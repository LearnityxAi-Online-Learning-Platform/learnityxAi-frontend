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

// System Review Types
export interface SystemReview {
  _id: string;
  courseId: {
    _id: string;
    courseName: string;
    courseCategory: string;
    instructorName: string;
    courseFlyerURL: string;
  };
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemReviewsResponse {
  reviews: SystemReview[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalReviews: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  summary: {
    totalReviews: number;
    averageRating: number;
  };
}

class CourseService {
  // Note: Caching has been removed - all data is fetched directly from backend
  // Backend handles rate limiting and caching strategies

  /**
   * Get course recommendations directly from backend
   * Backend handles rate limiting and caching
   */
  async getRecommendations(options?: {
    forceRefresh?: boolean;
    userId?: string;
    page?: number;
    size?: number;
  }): Promise<RecommendationResponse> {
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
  }

  /**
   * Refresh recommendations (alias for getRecommendations for backward compatibility)
   */
  async refreshRecommendations(userId?: string): Promise<RecommendationResponse> {
    return this.getRecommendations({ userId });
  }

  /**
   * Get all courses directly from backend
   */
  async getAllCourses(params?: GetCoursesParams, useCache = false): Promise<{
    courses: Course[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    // useCache parameter kept for backward compatibility but ignored
    const response = await axiosInstance.get<ApiSuccessResponse<{
      courses: Course[];
      pagination: {
        currentPage: number;
        pageSize: number;
        totalCourses: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>>('/api/courses', { params });

    // Map the response to match the expected format
    return {
      courses: response.data.data.courses,
      total: response.data.data.pagination.totalCourses,
      page: response.data.data.pagination.currentPage,
      totalPages: response.data.data.pagination.totalPages,
    };
  }

  /**
   * Get course by ID directly from backend
   */
  async getCourseById(id: string, useCache = false): Promise<Course> {
    // useCache parameter kept for backward compatibility but ignored
    const response = await axiosInstance.get<ApiSuccessResponse<{ course: Course }>>(
      `/api/courses/${id}`
    );
    return response.data.data.course;
  }

  /**
   * Get courses by category directly from backend
   */
  async getCoursesByCategory(category: string, useCache = false): Promise<Course[]> {
    // useCache parameter kept for backward compatibility but ignored
    const response = await axiosInstance.get<ApiSuccessResponse<{ courses: Course[] }>>(
      '/api/courses',
      { params: { category } }
    );
    return response.data.data.courses;
  }

  /**
   * Search courses (no caching for search to ensure fresh results)
   */
  async searchCourses(searchQuery: string, params?: GetCoursesParams): Promise<{
    courses: Course[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await axiosInstance.get<ApiSuccessResponse<{
      courses: Course[];
      pagination: {
        currentPage: number;
        pageSize: number;
        totalCourses: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>>('/api/courses/search', {
      params: { search: searchQuery, ...params },
    });

    // Map the response to match the expected format
    return {
      courses: response.data.data.courses,
      total: response.data.data.pagination.totalCourses,
      page: response.data.data.pagination.currentPage,
      totalPages: response.data.data.pagination.totalPages,
    };
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
   * Clear all course-related cache (deprecated - no longer uses cache)
   */
  clearCache(): void {
    // No-op: caching removed, backend handles everything
    console.warn('clearCache() is deprecated - caching has been removed');
  }

  /**
   * Clear recommendations cache only (deprecated - no longer uses cache)
   */
  clearRecommendationsCache(userId?: string): void {
    // No-op: caching removed, backend handles everything
    console.warn('clearRecommendationsCache() is deprecated - caching has been removed');
  }

  /**
   * Clear specific course cache (deprecated - no longer uses cache)
   */
  clearCourseCache(courseId: string): void {
    // No-op: caching removed, backend handles everything
    console.warn('clearCourseCache() is deprecated - caching has been removed');
  }

  /**
   * Get cache status for debugging (deprecated - no longer uses cache)
   */
  getCacheStatus(userId?: string): {
    hasRecommendations: boolean;
    recommendationsAge: number | null;
    shouldRefresh: boolean;
  } {
    // Return empty status since caching is removed
    console.warn('getCacheStatus() is deprecated - caching has been removed');
    return {
      hasRecommendations: false,
      recommendationsAge: null,
      shouldRefresh: false,
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

  /**
   * Get all system reviews with pagination
   */
  async getSystemReviews(params?: { page?: number; size?: number }): Promise<SystemReviewsResponse> {
    const response = await axiosInstance.get<ApiSuccessResponse<SystemReviewsResponse>>(
      '/api/ratings',
      {
        params: {
          page: params?.page || 1,
          size: params?.size || 10,
        },
      }
    );
    return response.data.data;
  }
}

export const courseService = new CourseService();
export default courseService;
