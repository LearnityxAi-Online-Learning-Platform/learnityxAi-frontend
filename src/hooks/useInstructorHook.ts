// src/store/hooks/useInstructorHook.ts
import { useAppDispatch, useAppSelector } from './useReduxHooks';
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  getInstructorCourseById,
  toggleCourseStatus,
  clearInstructorError,
  clearCurrentInstructorCourse,
} from '../slices/instructorSlice';
import { CreateCoursePayload, UpdateCoursePayload } from '../types/instructorTypes';

export const useInstructor = () => {
  const dispatch = useAppDispatch();
  const { courses, currentCourse, pagination, loading, error } = useAppSelector(
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

  const handleGetInstructorCourses = async (page: number = 1, size: number = 10) => {
    return await dispatch(getInstructorCourses({ page, size })).unwrap();
  };

  const handleGetCourseById = async (courseId: string) => {
    return await dispatch(getInstructorCourseById(courseId)).unwrap();
  };

  const handleToggleCourseStatus = async (courseId: string, isActive: boolean) => {
    return await dispatch(toggleCourseStatus({ courseId, isActive })).unwrap();
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
    createCourse: handleCreateCourse,
    updateCourse: handleUpdateCourse,
    deleteCourse: handleDeleteCourse,
    getInstructorCourses: handleGetInstructorCourses,
    getCourseById: handleGetCourseById,
    toggleCourseStatus: handleToggleCourseStatus,
    clearError: handleClearError,
    clearCurrentCourse: handleClearCurrentCourse,
  };
};
