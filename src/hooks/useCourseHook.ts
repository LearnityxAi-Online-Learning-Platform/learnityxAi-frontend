// src/hooks/useCourseHook.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useReduxHooks';
import {
  fetchRecommendations,
  refreshRecommendations,
  fetchAllCourses,
  fetchCourseById,
  fetchCoursesByCategory,
  searchCourses,
  fetchSystemReviews,
  clearError,
  clearCourses,
  clearSelectedCourse,
  clearCache,
  clearRecommendationsCache,
} from '@/store/slices/courseSlice';
import { GetCoursesParams } from '@/services/courseService';

export const useCourse = () => {
  const dispatch = useAppDispatch();
  const courseState = useAppSelector((state) => state.courses);

  /**
   * Get recommendations with intelligent caching
   * By default, this will use cache if available
   */
  const getRecommendations = useCallback(
    async (options?: { forceRefresh?: boolean; userId?: string }) => {
      return dispatch(fetchRecommendations(options)).unwrap();
    },
    [dispatch]
  );

  /**
   * Force refresh recommendations from API
   * Use this when user explicitly clicks "Refresh Recommendations"
   */
  const forceRefreshRecommendations = useCallback(
    async (userId?: string) => {
      return dispatch(refreshRecommendations(userId)).unwrap();
    },
    [dispatch]
  );

  /**
   * Get all courses with optional parameters
   */
  const getAllCourses = useCallback(
    async (params?: GetCoursesParams) => {
      return dispatch(fetchAllCourses(params)).unwrap();
    },
    [dispatch]
  );

  /**
   * Get course by ID
   */
  const getCourseById = useCallback(
    async (id: string) => {
      return dispatch(fetchCourseById(id)).unwrap();
    },
    [dispatch]
  );

  /**
   * Get courses by category
   */
  const getCoursesByCategory = useCallback(
    async (category: string) => {
      return dispatch(fetchCoursesByCategory(category)).unwrap();
    },
    [dispatch]
  );

  /**
   * Search courses
   */
  const searchCoursesQuery = useCallback(
    async (searchQuery: string, params?: GetCoursesParams) => {
      return dispatch(searchCourses({ searchQuery, params })).unwrap();
    },
    [dispatch]
  );

  /**
   * Clear error messages
   */
  const clearErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * Clear courses list
   */
  const clearCoursesList = useCallback(() => {
    dispatch(clearCourses());
  }, [dispatch]);

  /**
   * Clear selected course
   */
  const clearCourse = useCallback(() => {
    dispatch(clearSelectedCourse());
  }, [dispatch]);

  /**
   * Clear all cache
   */
  const clearAllCache = useCallback(() => {
    dispatch(clearCache());
  }, [dispatch]);

  /**
   * Clear recommendations cache
   */
  const clearRecommendations = useCallback(
    (userId?: string) => {
      dispatch(clearRecommendationsCache(userId));
    },
    [dispatch]
  );

  /**
   * Get system reviews with pagination
   */
  const getSystemReviews = useCallback(
    async (params?: { page?: number; size?: number }) => {
      return dispatch(fetchSystemReviews(params)).unwrap();
    },
    [dispatch]
  );

  return {
    // State
    courses: courseState.courses,
    recommendations: courseState.recommendations,
    selectedCourse: courseState.selectedCourse,
    total: courseState.total,
    page: courseState.page,
    totalPages: courseState.totalPages,
    loading: courseState.loading,
    error: courseState.error,
    recommendationsLoading: courseState.recommendationsLoading,
    recommendationsError: courseState.recommendationsError,
    systemReviews: courseState.systemReviews,
    systemReviewsPagination: courseState.systemReviewsPagination,
    systemReviewsSummary: courseState.systemReviewsSummary,
    systemReviewsLoading: courseState.systemReviewsLoading,
    systemReviewsError: courseState.systemReviewsError,

    // Actions
    getRecommendations,
    forceRefreshRecommendations,
    getAllCourses,
    getCourseById,
    getCoursesByCategory,
    searchCoursesQuery,
    getSystemReviews,
    clearErrors,
    clearCoursesList,
    clearCourse,
    clearAllCache,
    clearRecommendations,
  };
};
