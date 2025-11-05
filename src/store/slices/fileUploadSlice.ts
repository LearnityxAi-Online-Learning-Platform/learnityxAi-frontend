/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/slices/fileUploadSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fileUploadService } from '@/services/fileUploadService';
import { FileUploadState } from '@/types/fileUploadTypes';
import { ApiError } from '@/types/authTypes';

const initialState: FileUploadState = {
  courseFlyerUrl: null,
  profileImageUrl: null,
  loading: false,
  error: null,
};

// Async Thunks
export const uploadCourseFlyer = createAsyncThunk(
  'fileUpload/uploadCourseFlyer',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await fileUploadService.uploadCourseFlyer(file);
      return response.data.file.url;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to upload course flyer' }
      );
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  'fileUpload/uploadProfileImage',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await fileUploadService.uploadProfileImage(file);
      return response.data.file.url;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to upload profile image' }
      );
    }
  }
);

const fileUploadSlice = createSlice({
  name: 'fileUpload',
  initialState,
  reducers: {
    clearFileUploadError: (state) => {
      state.error = null;
    },
    clearCourseFlyerUrl: (state) => {
      state.courseFlyerUrl = null;
    },
    clearProfileImageUrl: (state) => {
      state.profileImageUrl = null;
    },
    resetFileUploadState: (state) => {
      state.courseFlyerUrl = null;
      state.profileImageUrl = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Upload Course Flyer
    builder
      .addCase(uploadCourseFlyer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadCourseFlyer.fulfilled, (state, action) => {
        state.loading = false;
        state.courseFlyerUrl = action.payload;
        state.error = null;
      })
      .addCase(uploadCourseFlyer.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to upload course flyer';
      });

    // Upload Profile Image
    builder
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.profileImageUrl = action.payload;
        state.error = null;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to upload profile image';
      });
  },
});

export const {
  clearFileUploadError,
  clearCourseFlyerUrl,
  clearProfileImageUrl,
  resetFileUploadState,
} = fileUploadSlice.actions;
export default fileUploadSlice.reducer;
