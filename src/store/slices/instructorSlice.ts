/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/slices/instructorSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { instructorService } from '@/services/instructorService';
import {
  InstructorState,
  CreateCoursePayload,
  UpdateCoursePayload,
} from '@/types/instructorTypes';
import { ApiError } from '@/types/authTypes';

const initialState: InstructorState = {
  courses: [],
  currentCourse: null,
  pagination: null,
  dashboardStats: null,
  loading: false,
  error: null,
};

// Async Thunks
export const createCourse = createAsyncThunk(
  'instructor/createCourse',
  async (payload: CreateCoursePayload, { rejectWithValue }) => {
    try {
      const response = await instructorService.createCourse(payload);
      return response.data.course;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to create course' });
    }
  }
);

export const updateCourse = createAsyncThunk(
  'instructor/updateCourse',
  async (payload: UpdateCoursePayload, { rejectWithValue }) => {
    try {
      const response = await instructorService.updateCourse(payload);
      return response.data.course;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update course' });
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'instructor/deleteCourse',
  async (courseId: string, { rejectWithValue }) => {
    try {
      await instructorService.deleteCourse(courseId);
      return courseId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete course' });
    }
  }
);

export const getInstructorCourses = createAsyncThunk(
  'instructor/getInstructorCourses',
  async (
    {
      page,
      size,
      filters,
    }: {
      page?: number;
      size?: number;
      filters?: {
        name?: string;
        category?: string;
        tool?: string;
        duration?: string;
        includeInactive?: boolean;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await instructorService.getInstructorCourses(page, size, filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch instructor courses' }
      );
    }
  }
);

export const getInstructorCourseById = createAsyncThunk(
  'instructor/getCourseById',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await instructorService.getCourseById(courseId);
      return response.data.course;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch course' });
    }
  }
);

export const toggleCourseStatus = createAsyncThunk(
  'instructor/toggleCourseStatus',
  async ({ courseId, isActive }: { courseId: string; isActive: boolean }, { rejectWithValue }) => {
    try {
      const response = await instructorService.toggleCourseStatus(courseId, isActive);
      return response.data.course;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to toggle course status' }
      );
    }
  }
);

export const getDashboardStats = createAsyncThunk(
  'instructor/getDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await instructorService.getDashboardStats();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch dashboard stats' }
      );
    }
  }
);

const instructorSlice = createSlice({
  name: 'instructor',
  initialState,
  reducers: {
    clearInstructorError: (state) => {
      state.error = null;
    },
    clearCurrentInstructorCourse: (state) => {
      state.currentCourse = null;
    },
  },
  extraReducers: (builder) => {
    // Create Course
    builder
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.unshift(action.payload);
        state.error = null;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to create course';
      });

    // Update Course
    builder
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.courses.findIndex((course) => course._id === action.payload._id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        if (state.currentCourse && state.currentCourse._id === action.payload._id) {
          state.currentCourse = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to update course';
      });

    // Delete Course
    builder
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter((course) => course._id !== action.payload);
        if (state.currentCourse && state.currentCourse._id === action.payload) {
          state.currentCourse = null;
        }
        state.error = null;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to delete course';
      });

    // Get Instructor Courses
    builder
      .addCase(getInstructorCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInstructorCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getInstructorCourses.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to fetch instructor courses';
      });

    // Get Course By ID
    builder
      .addCase(getInstructorCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInstructorCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
        state.error = null;
      })
      .addCase(getInstructorCourseById.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to fetch course';
      });

    // Toggle Course Status
    builder
      .addCase(toggleCourseStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleCourseStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.courses.findIndex((course) => course._id === action.payload._id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        if (state.currentCourse && state.currentCourse._id === action.payload._id) {
          state.currentCourse = action.payload;
        }
        state.error = null;
      })
      .addCase(toggleCourseStatus.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to toggle course status';
      });

    // Get Dashboard Stats
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
        state.error = null;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to fetch dashboard stats';
      });
  },
});

export const { clearInstructorError, clearCurrentInstructorCourse } = instructorSlice.actions;
export default instructorSlice.reducer;
