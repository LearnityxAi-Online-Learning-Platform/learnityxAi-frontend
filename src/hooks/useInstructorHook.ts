// src/hooks/useInstructorHook.ts
import { useAppDispatch, useAppSelector } from './useReduxHooks';
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  getInstructorCourseById,
  toggleCourseStatus,
  getDashboardStats as getDashboardStatsAction,
  clearInstructorError,
  clearCurrentInstructorCourse,
} from '../store/slices/instructorSlice';
import { CreateCoursePayload, UpdateCoursePayload } from '../types/instructorTypes';

export const useInstructor = () => {
  const dispatch = useAppDispatch();
  const { courses, currentCourse, pagination, loading, error, dashboardStats } = useAppSelector(
    (state) => state.instructor
  );

  const handleCreateCourse = async (payload: CreateCoursePayload) => {
    return await dispatch(createCourse(payload)).unwrap();
  };

  const handleUpdateCourse = async (payload: UpdateCoursePayload) => {
    return await dispatch(updateCourse(payload)).unwrap();
  };

  const handleDeleteCourse = async (courseId: string) => {
    return await dispatch(deleteCourse(courseId)).unwrap();
  };

  const handleGetInstructorCourses = async (
    page: number = 1,
    size: number = 10,
    filters?: {
      name?: string;
      category?: string;
      tool?: string;
      duration?: string;
      includeInactive?: boolean;
    }
  ) => {
    return await dispatch(getInstructorCourses({ page, size, filters })).unwrap();
  };

  const handleGetCourseById = async (courseId: string) => {
    return await dispatch(getInstructorCourseById(courseId)).unwrap();
  };

  const handleToggleCourseStatus = async (courseId: string, isActive: boolean) => {
    return await dispatch(toggleCourseStatus({ courseId, isActive })).unwrap();
  };

  const handleGetDashboardStats = async () => {
    return await dispatch(getDashboardStatsAction()).unwrap();
  };

  const handleClearError = () => {
    dispatch(clearInstructorError());
  };

  const handleClearCurrentCourse = () => {
    dispatch(clearCurrentInstructorCourse());
  };

  return {
    courses,
    currentCourse,
    pagination,
    loading,
    error,
    dashboardStats,
    createCourse: handleCreateCourse,
    updateCourse: handleUpdateCourse,
    deleteCourse: handleDeleteCourse,
    getInstructorCourses: handleGetInstructorCourses,
    getCourseById: handleGetCourseById,
    toggleCourseStatus: handleToggleCourseStatus,
    getDashboardStats: handleGetDashboardStats,
    clearError: handleClearError,
    clearCurrentCourse: handleClearCurrentCourse,
  };
};
