// src/services/courseService.ts
import axiosInstance from '@/lib/api/axiosInstance';
import { localStorageCache } from '@/lib/localStorageCache';

// Course Types
export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  };
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  thumbnail: string;
  rating: number;
  enrollmentCount: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecommendationResponse {
  recommendations: Course[];
  algorithm: string;
  generatedAt: string;
}

export interface GetCoursesParams {
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  search?: string;
  sortBy?: 'rating' | 'price' | 'enrollmentCount' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

class CourseService {
  private readonly CACHE_KEYS = {
    RECOMMENDATIONS: 'course_recommendations',
    ALL_COURSES: 'all_courses',
    COURSE_DETAIL: (id: string) => `course_detail_${id}`,
    COURSES_BY_CATEGORY: (category: string) => `courses_category_${category}`,
  };

  private readonly CACHE_EXPIRATION = {
    RECOMMENDATIONS: 1440, // 24 hours (since it uses AI and costs money)
    COURSES: 60, // 1 hour
    COURSE_DETAIL: 30, // 30 minutes
  };

  /**
   * Get course recommendations with intelligent caching
   * This method prioritizes cache to reduce expensive API calls
   */
  async getRecommendations(options?: {
    forceRefresh?: boolean;
    userId?: string;
  }): Promise<RecommendationResponse> {
    const cacheKey = options?.userId
      ? `${this.CACHE_KEYS.RECOMMENDATIONS}_${options.userId}`
      : this.CACHE_KEYS.RECOMMENDATIONS;

    return localStorageCache.getOrFetch<RecommendationResponse>(
      {
        key: cacheKey,
        expirationMinutes: this.CACHE_EXPIRATION.RECOMMENDATIONS,
        version: '1.0',
      },
      async () => {
        const response = await axiosInstance.get<ApiSuccessResponse<RecommendationResponse>>(
          '/api/courses/recommendations',
          { params: { userId: options?.userId } }
        );
        return response.data.data;
      },
      {
        forceRefresh: options?.forceRefresh,
        backgroundRefresh: true, // Auto-refresh in background when cache is old
      }
    );
  }

  /**
   * Force refresh recommendations (call this when user explicitly requests)
   */
  async refreshRecommendations(userId?: string): Promise<RecommendationResponse> {
    return this.getRecommendations({ forceRefresh: true, userId });
  }

  /**
   * Get all courses with optional caching
   */
  async getAllCourses(params?: GetCoursesParams, useCache = true): Promise<{
    courses: Course[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const cacheKey = `${this.CACHE_KEYS.ALL_COURSES}_${JSON.stringify(params || {})}`;

    if (!useCache) {
      const response = await axiosInstance.get<ApiSuccessResponse<{
        courses: Course[];
        total: number;
        page: number;
        totalPages: number;
      }>>('/api/courses', { params });
      return response.data.data;
    }

    return localStorageCache.getOrFetch(
      {
        key: cacheKey,
        expirationMinutes: this.CACHE_EXPIRATION.COURSES,
        version: '1.0',
      },
      async () => {
        const response = await axiosInstance.get<ApiSuccessResponse<{
          courses: Course[];
          total: number;
          page: number;
          totalPages: number;
        }>>('/api/courses', { params });
        return response.data.data;
      },
      {
        backgroundRefresh: true,
      }
    );
  }

  /**
   * Get course by ID with caching
   */
  async getCourseById(id: string, useCache = true): Promise<Course> {
    if (!useCache) {
      const response = await axiosInstance.get<ApiSuccessResponse<{ course: Course }>>(
        `/api/courses/${id}`
      );
      return response.data.data.course;
    }

    return localStorageCache.getOrFetch(
      {
        key: this.CACHE_KEYS.COURSE_DETAIL(id),
        expirationMinutes: this.CACHE_EXPIRATION.COURSE_DETAIL,
        version: '1.0',
      },
      async () => {
        const response = await axiosInstance.get<ApiSuccessResponse<{ course: Course }>>(
          `/api/courses/${id}`
        );
        return response.data.data.course;
      },
      {
        backgroundRefresh: true,
      }
    );
  }

  /**
   * Get courses by category with caching
   */
  async getCoursesByCategory(category: string, useCache = true): Promise<Course[]> {
    if (!useCache) {
      const response = await axiosInstance.get<ApiSuccessResponse<{ courses: Course[] }>>(
        '/api/courses',
        { params: { category } }
      );
      return response.data.data.courses;
    }

    return localStorageCache.getOrFetch(
      {
        key: this.CACHE_KEYS.COURSES_BY_CATEGORY(category),
        expirationMinutes: this.CACHE_EXPIRATION.COURSES,
        version: '1.0',
      },
      async () => {
        const response = await axiosInstance.get<ApiSuccessResponse<{ courses: Course[] }>>(
          '/api/courses',
          { params: { category } }
        );
        return response.data.data.courses;
      },
      {
        backgroundRefresh: true,
      }
    );
  }

  /**
   * Search courses (no caching for search to ensure fresh results)
   */
  async searchCourses(searchQuery: string, params?: GetCoursesParams): Promise<{
    courses: Course[];
    total: number;
  }> {
    const response = await axiosInstance.get<ApiSuccessResponse<{
      courses: Course[];
      total: number;
    }>>('/api/courses/search', {
      params: { search: searchQuery, ...params },
    });
    return response.data.data;
  }

  /**
   * Clear all course-related cache
   */
  clearCache(): void {
    localStorageCache.clearByPrefix('course_');
  }

  /**
   * Clear recommendations cache only
   */
  clearRecommendationsCache(userId?: string): void {
    const cacheKey = userId
      ? `${this.CACHE_KEYS.RECOMMENDATIONS}_${userId}`
      : this.CACHE_KEYS.RECOMMENDATIONS;
    localStorageCache.remove(cacheKey);
  }

  /**
   * Clear specific course cache
   */
  clearCourseCache(courseId: string): void {
    localStorageCache.remove(this.CACHE_KEYS.COURSE_DETAIL(courseId));
  }

  /**
   * Get cache status for debugging
   */
  getCacheStatus(userId?: string): {
    hasRecommendations: boolean;
    recommendationsAge: number | null;
    shouldRefresh: boolean;
  } {
    const cacheKey = userId
      ? `${this.CACHE_KEYS.RECOMMENDATIONS}_${userId}`
      : this.CACHE_KEYS.RECOMMENDATIONS;

    return {
      hasRecommendations: localStorageCache.has({
        key: cacheKey,
        expirationMinutes: this.CACHE_EXPIRATION.RECOMMENDATIONS,
      }),
      recommendationsAge: localStorageCache.getAge(cacheKey),
      shouldRefresh: localStorageCache.shouldRefresh({
        key: cacheKey,
        expirationMinutes: this.CACHE_EXPIRATION.RECOMMENDATIONS,
      }),
    };
  }
}

export const courseService = new CourseService();
export default courseService;
