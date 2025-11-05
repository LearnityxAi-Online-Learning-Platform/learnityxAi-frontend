// src/hooks/useFileUploadHook.ts
import { useAppDispatch, useAppSelector } from './useReduxHooks';
import {
  uploadCourseFlyer,
  uploadProfileImage,
  clearFileUploadError,
  clearCourseFlyerUrl,
  clearProfileImageUrl,
  resetFileUploadState,
} from '../store/slices/fileUploadSlice';

export const useFileUpload = () => {
  const dispatch = useAppDispatch();
  const { courseFlyerUrl, profileImageUrl, loading, error } = useAppSelector(
    (state) => state.fileUpload
  );

  const handleUploadCourseFlyer = async (file: File) => {
    return await dispatch(uploadCourseFlyer(file)).unwrap();
  };

  const handleUploadProfileImage = async (file: File) => {
    return await dispatch(uploadProfileImage(file)).unwrap();
  };

  const handleClearError = () => {
    dispatch(clearFileUploadError());
  };

  const handleClearCourseFlyerUrl = () => {
    dispatch(clearCourseFlyerUrl());
  };

  const handleClearProfileImageUrl = () => {
    dispatch(clearProfileImageUrl());
  };

  const handleResetState = () => {
    dispatch(resetFileUploadState());
  };

  return {
    courseFlyerUrl,
    profileImageUrl,
    loading,
    error,
    uploadCourseFlyer: handleUploadCourseFlyer,
    uploadProfileImage: handleUploadProfileImage,
    clearError: handleClearError,
    clearCourseFlyerUrl: handleClearCourseFlyerUrl,
    clearProfileImageUrl: handleClearProfileImageUrl,
    resetState: handleResetState,
  };
};
