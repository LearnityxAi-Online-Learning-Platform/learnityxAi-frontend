// src/services/courseService.ts
import axiosInstance from '@/lib/api/axiosInstance';
import { localStorageCache } from '@/lib/localStorageCache';

// Course Types
export interface Course {
  _id: string;
  // Support both naming conventions
  title?: string;
  courseName?: string;
  description: string;
  // Nested instructor object (from some endpoints)
  instructor?: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  };
  // Full instructor object with bio (from course detail endpoint)
  instructorId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    profileImage: string;
    bio?: string;
  };
  // Flat instructor name (from recommendations endpoint)
  instructorName?: string;
  category?: string;
  courseCategory?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  thumbnail?: string;
  courseFlyerURL?: string;
  rating: number;
  totalRatings?: number;
  enrollmentCount?: number;
  numberOfUserEnrolled?: number;
  duration?: number | string;
  skills?: string[];
  tools?: string[];
  whatYouWillLearn?: string[];
  startingDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecommendationResponse {
  courses: Course[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCourses: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  recommendationType: string;
  cached: boolean;
  apiUsage?: {
    global: {
      used: number;
      remaining: number;
      limit: number;
      percentageUsed: string;
    };
    personal: {
      used: number;
      remaining: number;
      limit: number;
      hoursUntilReset: number;
    };
  };
}

export interface GetCoursesParams {
  page?: number;
  limit?: number;
  size?: number;
  category?: string;
  level?: string;
  search?: string;
  skills?: string;
  tools?: string;
  instructorName?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'rating' | 'price' | 'enrollmentCount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
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
    page?: number;
    size?: number;
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
          '/api/recommendations',
          {
            params: {
              userId: options?.userId,
              page: options?.page || 1,
              size: options?.size || 10
            }
          }
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
   * Get top rated courses (sorted by rating descending)
   */
  async getTopRatedCourses(params?: { page?: number; size?: number }): Promise<{
    courses: Course[];
    pagination: {
      currentPage: number;
      pageSize: number;
      totalCourses: number;
      totalPages: number;
    };
  }> {
    const response = await axiosInstance.get<ApiSuccessResponse<{
      courses: Course[];
      pagination: {
        currentPage: number;
        pageSize: number;
        totalCourses: number;
        totalPages: number;
      };
    }>>('/api/courses', {
      params: {
        sortBy: 'rating',
        sortOrder: 'desc',
        page: params?.page || 1,
        size: params?.size || 15,
      },
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

  /**
   * Get all available categories
   */
  async getCategories(): Promise<string[]> {
    const response = await axiosInstance.get<ApiSuccessResponse<{ categories: string[] }>>(
      '/api/courses/categories'
    );
    return response.data.data.categories;
  }

  /**
   * Get all available tools
   */
  async getTools(): Promise<string[]> {
    const response = await axiosInstance.get<ApiSuccessResponse<{ tools: string[] }>>(
      '/api/courses/tools'
    );
    return response.data.data.tools;
  }

  /**
   * Get all available durations
   */
  async getDurations(): Promise<string[]> {
    const response = await axiosInstance.get<ApiSuccessResponse<{ durations: string[] }>>(
      '/api/courses/durations'
    );
    return response.data.data.durations;
  }
}

export const courseService = new CourseService();
export default courseService;
