// src/lib/localStorageCache.ts

/**
 * Intelligent Local Storage Cache Service
 * Designed to reduce API calls by caching data with smart expiration and refresh strategies
 */

export interface CacheConfig {
  key: string;
  expirationMinutes?: number; // Default: 60 minutes
  version?: string; // For cache invalidation on schema changes
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
  expiresAt: number;
}

class LocalStorageCache {
  private readonly DEFAULT_EXPIRATION_MINUTES = 60;
  private readonly CACHE_VERSION = '1.0';

  /**
   * Get data from cache
   * Returns null if cache is expired or doesn't exist
   */
  get<T>(config: CacheConfig): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const cached = localStorage.getItem(config.key);
      if (!cached) return null;

      const entry: CacheEntry<T> = JSON.parse(cached);
      const now = Date.now();

      // Check version mismatch
      const version = config.version || this.CACHE_VERSION;
      if (entry.version !== version) {
        this.remove(config.key);
        return null;
      }

      // Check expiration
      if (now > entry.expiresAt) {
        this.remove(config.key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  }

  /**
   * Set data in cache with expiration
   */
  set<T>(config: CacheConfig, data: T): void {
    if (typeof window === 'undefined') return;

    try {
      const expirationMinutes = config.expirationMinutes || this.DEFAULT_EXPIRATION_MINUTES;
      const now = Date.now();
      const expiresAt = now + (expirationMinutes * 60 * 1000);

      const entry: CacheEntry<T> = {
        data,
        timestamp: now,
        version: config.version || this.CACHE_VERSION,
        expiresAt,
      };

      localStorage.setItem(config.key, JSON.stringify(entry));
    } catch (error) {
      console.error('Cache write error:', error);
      // Handle quota exceeded errors gracefully
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.clearOldest();
        // Retry once after clearing
        try {
          localStorage.setItem(config.key, JSON.stringify({
            data,
            timestamp: Date.now(),
            version: config.version || this.CACHE_VERSION,
            expiresAt: Date.now() + ((config.expirationMinutes || this.DEFAULT_EXPIRATION_MINUTES) * 60 * 1000),
          }));
        } catch {
          console.error('Failed to cache after cleanup');
        }
      }
    }
  }

  /**
   * Remove specific cache entry
   */
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }

  /**
   * Check if cache exists and is valid
   */
  has(config: CacheConfig): boolean {
    return this.get(config) !== null;
  }

  /**
   * Get cache age in minutes
   */
  getAge(key: string): number | null {
    if (typeof window === 'undefined') return null;

    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const entry: CacheEntry<unknown> = JSON.parse(cached);
      const now = Date.now();
      const ageMinutes = (now - entry.timestamp) / (60 * 1000);

      return ageMinutes;
    } catch {
      return null;
    }
  }

  /**
   * Check if cache should be refreshed (older than half its expiration time)
   */
  shouldRefresh(config: CacheConfig): boolean {
    const age = this.getAge(config.key);
    if (age === null) return true;

    const expirationMinutes = config.expirationMinutes || this.DEFAULT_EXPIRATION_MINUTES;
    return age > (expirationMinutes / 2);
  }

  /**
   * Clear all cache entries with a specific prefix
   */
  clearByPrefix(prefix: string): void {
    if (typeof window === 'undefined') return;

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Cache clear by prefix error:', error);
    }
  }

  /**
   * Clear oldest cache entries to free up space
   */
  private clearOldest(): void {
    if (typeof window === 'undefined') return;

    try {
      const entries: Array<{ key: string; timestamp: number }> = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              const entry = JSON.parse(value);
              if (entry.timestamp) {
                entries.push({ key, timestamp: entry.timestamp });
              }
            }
          } catch {
            // Skip non-cache entries
          }
        }
      }

      // Sort by timestamp and remove oldest 25%
      entries.sort((a, b) => a.timestamp - b.timestamp);
      const toRemove = Math.ceil(entries.length * 0.25);
      for (let i = 0; i < toRemove; i++) {
        localStorage.removeItem(entries[i].key);
      }
    } catch (error) {
      console.error('Clear oldest error:', error);
    }
  }

  /**
   * Get or fetch data with automatic caching
   * This is the main method to use for API calls
   */
  async getOrFetch<T>(
    config: CacheConfig,
    fetchFn: () => Promise<T>,
    options?: {
      forceRefresh?: boolean;
      backgroundRefresh?: boolean;
    }
  ): Promise<T> {
    // Force refresh bypasses cache
    if (options?.forceRefresh) {
      const data = await fetchFn();
      this.set(config, data);
      return data;
    }

    // Check cache first
    const cached = this.get<T>(config);
    if (cached !== null) {
      // Background refresh if cache is getting old
      if (options?.backgroundRefresh && this.shouldRefresh(config)) {
        // Fire and forget - update cache in background
        fetchFn().then(data => this.set(config, data)).catch(console.error);
      }
      return cached;
    }

    // Cache miss - fetch from API
    const data = await fetchFn();
    this.set(config, data);
    return data;
  }

  /**
   * Invalidate cache by version
   */
  invalidateVersion(prefix: string, oldVersion: string): void {
    if (typeof window === 'undefined') return;

    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              const entry: CacheEntry<unknown> = JSON.parse(value);
              if (entry.version === oldVersion) {
                keysToRemove.push(key);
              }
            }
          } catch {
            // Skip invalid entries
          }
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Cache invalidate version error:', error);
    }
  }
}

export const localStorageCache = new LocalStorageCache();
export default localStorageCache;
