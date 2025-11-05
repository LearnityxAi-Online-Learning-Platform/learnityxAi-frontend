// src/store/hooks/useUserHook.ts
import { useAppDispatch, useAppSelector } from './useReduxHooks';
import {
  searchCourses,
  getCourseById,
  getCategories,
  getTools,
  getDurations,
  advancedSearchCourses,
  enrollInCourse,
  getEnrolledCourses,
  getRecommendations,
  rateCourse,
  updateRating,
  getCourseRatings,
  getMyRating,
  deleteRating,
  clearUserError,
  clearCurrentCourse,
  clearCourseRating,
} from '../slices/userSlice';
import {
  SearchCoursesParams,
  CreateRatingPayload,
  UpdateRatingPayload,
} from '../types/userTypes';

export const useUser = () => {
  const dispatch = useAppDispatch();
  const {
    courses,
    currentCourse,
    enrolledCourses,
    recommendations,
    categories,
    tools,
    durations,
    ratings,
    courseRating,
    pagination,
    loading,
    error,
  } = useAppSelector((state) => state.user);

  const handleSearchCourses = async (
    params: SearchCoursesParams,
    authenticated: boolean = false
  ) => {
    return await dispatch(searchCourses({ params, authenticated })).unwrap();
  };

  const handleGetCourseById = async (courseId: string) => {
    return await dispatch(getCourseById(courseId)).unwrap();
  };

  const handleGetCategories = async () => {
    return await dispatch(getCategories()).unwrap();
  };

  const handleGetTools = async () => {
    return await dispatch(getTools()).unwrap();
  };

  const handleGetDurations = async () => {
    return await dispatch(getDurations()).unwrap();
  };

  const handleAdvancedSearchCourses = async (params: SearchCoursesParams) => {
    return await dispatch(advancedSearchCourses(params)).unwrap();
  };

  const handleEnrollInCourse = async (courseId: string) => {
    return await dispatch(enrollInCourse(courseId)).unwrap();
  };

  const handleGetEnrolledCourses = async (page: number = 1, size: number = 10) => {
    return await dispatch(getEnrolledCourses({ page, size })).unwrap();
  };

  const handleGetRecommendations = async (
    page: number = 1,
    size: number = 10,
    authenticated: boolean = false
  ) => {
    return await dispatch(getRecommendations({ page, size, authenticated })).unwrap();
  };

  const handleRateCourse = async (payload: CreateRatingPayload) => {
    return await dispatch(rateCourse(payload)).unwrap();
  };

  const handleUpdateRating = async (payload: UpdateRatingPayload) => {
    return await dispatch(updateRating(payload)).unwrap();
  };

  const handleGetCourseRatings = async (
    courseId: string,
    page: number = 1,
    size: number = 10
  ) => {
    return await dispatch(getCourseRatings({ courseId, page, size })).unwrap();
  };

  const handleGetMyRating = async (courseId: string) => {
    return await dispatch(getMyRating(courseId)).unwrap();
  };

  const handleDeleteRating = async (courseId: string) => {
    return await dispatch(deleteRating(courseId)).unwrap();
  };

  const handleClearError = () => {
    dispatch(clearUserError());
  };

  const handleClearCurrentCourse = () => {
    dispatch(clearCurrentCourse());
  };

  const handleClearCourseRating = () => {
    dispatch(clearCourseRating());
  };

  return {
    courses,
    currentCourse,
    enrolledCourses,
    recommendations,
    categories,
    tools,
    durations,
    ratings,
    courseRating,
    pagination,
    loading,
    error,
    searchCourses: handleSearchCourses,
    getCourseById: handleGetCourseById,
    getCategories: handleGetCategories,
    getTools: handleGetTools,
    getDurations: handleGetDurations,
    advancedSearchCourses: handleAdvancedSearchCourses,
    enrollInCourse: handleEnrollInCourse,
    getEnrolledCourses: handleGetEnrolledCourses,
    getRecommendations: handleGetRecommendations,
    rateCourse: handleRateCourse,
    updateRating: handleUpdateRating,
    getCourseRatings: handleGetCourseRatings,
    getMyRating: handleGetMyRating,
    deleteRating: handleDeleteRating,
    clearError: handleClearError,
    clearCurrentCourse: handleClearCurrentCourse,
    clearCourseRating: handleClearCourseRating,
  };
};
