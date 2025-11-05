/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/slices/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@/services/userService';
import {
  UserState,
  SearchCoursesParams,
  CreateRatingPayload,
  UpdateRatingPayload,
} from '@/types/userTypes';
import { ApiError } from '@/types/authTypes';

const initialState: UserState = {
  courses: [],
  currentCourse: null,
  enrolledCourses: [],
  recommendations: [],
  categories: [],
  tools: [],
  durations: [],
  ratings: [],
  courseRating: null,
  pagination: null,
  loading: false,
  error: null,
};

// Async Thunks
export const searchCourses = createAsyncThunk(
  'user/searchCourses',
  async (
    { params, authenticated }: { params: SearchCoursesParams; authenticated?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await userService.searchCourses(params, authenticated || false);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to search courses' });
    }
  }
);

export const getCourseById = createAsyncThunk(
  'user/getCourseById',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await userService.getCourseById(courseId);
      return response.data.course;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch course' });
    }
  }
);

export const getCategories = createAsyncThunk(
  'user/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getCategories();
      return response.data.categories;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch categories' });
    }
  }
);

export const getTools = createAsyncThunk('user/getTools', async (_, { rejectWithValue }) => {
  try {
    const response = await userService.getTools();
    return response.data.tools;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || { message: 'Failed to fetch tools' });
  }
});

export const getDurations = createAsyncThunk(
  'user/getDurations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getDurations();
      return response.data.durations;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch durations' });
    }
  }
);

export const advancedSearchCourses = createAsyncThunk(
  'user/advancedSearchCourses',
  async (params: SearchCoursesParams, { rejectWithValue }) => {
    try {
      const response = await userService.advancedSearchCourses(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to search courses with filters' }
      );
    }
  }
);

export const enrollInCourse = createAsyncThunk(
  'user/enrollInCourse',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await userService.enrollInCourse(courseId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to enroll in course' });
    }
  }
);

export const getEnrolledCourses = createAsyncThunk(
  'user/getEnrolledCourses',
  async ({ page, size }: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await userService.getEnrolledCourses(page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch enrolled courses' }
      );
    }
  }
);

export const getRecommendations = createAsyncThunk(
  'user/getRecommendations',
  async (
    { page, size, authenticated }: { page?: number; size?: number; authenticated?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await userService.getRecommendations(page, size, authenticated || false);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to fetch recommendations' }
      );
    }
  }
);

export const rateCourse = createAsyncThunk(
  'user/rateCourse',
  async (payload: CreateRatingPayload, { rejectWithValue }) => {
    try {
      const response = await userService.rateCourse(payload);
      return response.data.rating;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to rate course' });
    }
  }
);

export const updateRating = createAsyncThunk(
  'user/updateRating',
  async (payload: UpdateRatingPayload, { rejectWithValue }) => {
    try {
      const response = await userService.updateRating(payload);
      return response.data.rating;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update rating' });
    }
  }
);

export const getCourseRatings = createAsyncThunk(
  'user/getCourseRatings',
  async (
    { courseId, page, size }: { courseId: string; page?: number; size?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await userService.getCourseRatings(courseId, page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch ratings' });
    }
  }
);

export const getMyRating = createAsyncThunk(
  'user/getMyRating',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await userService.getMyRating(courseId);
      return response.data.rating;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch your rating' });
    }
  }
);

export const deleteRating = createAsyncThunk(
  'user/deleteRating',
  async (courseId: string, { rejectWithValue }) => {
    try {
      await userService.deleteRating(courseId);
      return courseId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete rating' });
    }
  }
);

export const getAllUserRatings = createAsyncThunk(
  'user/getAllUserRatings',
  async ({ page, size }: { page?: number; size?: number }, { rejectWithValue }) => {
    try {
      const response = await userService.getAllUserRatings(page, size);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch user ratings' });
    }
  }
);

export const unenrollFromCourse = createAsyncThunk(
  'user/unenrollFromCourse',
  async (courseId: string, { rejectWithValue }) => {
    try {
      await userService.unenrollFromCourse(courseId);
      return courseId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to unenroll from course' });
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    clearCourseRating: (state) => {
      state.courseRating = null;
    },
  },
  extraReducers: (builder) => {
    // Search Courses
    builder
      .addCase(searchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(searchCourses.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to search courses';
      });

    // Get Course By ID
    builder
      .addCase(getCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
        state.error = null;
      })
      .addCase(getCourseById.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to fetch course';
      });

    // Get Categories
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to fetch categories';
      });

    // Get Tools
    builder
      .addCase(getTools.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTools.fulfilled, (state, action) => {
        state.loading = false;
        state.tools = action.payload;
        state.error = null;
      })
      .addCase(getTools.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to fetch tools';
      });

    // Get Durations
    builder
      .addCase(getDurations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDurations.fulfilled, (state, action) => {
        state.loading = false;
        state.durations = action.payload;
        state.error = null;
      })
      .addCase(getDurations.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to fetch durations';
      });

    // Advanced Search Courses
    builder
      .addCase(advancedSearchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(advancedSearchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(advancedSearchCourses.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to search courses with filters';
      });

    // Enroll In Course
    builder
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to enroll in course';
      });

    // Get Enrolled Courses
    builder
      .addCase(getEnrolledCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolledCourses = action.payload.courses;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to fetch enrolled courses';
      });

    // Get Recommendations
    builder
      .addCase(getRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload.courses;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getRecommendations.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to fetch recommendations';
      });

    // Rate Course
    builder
      .addCase(rateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rateCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courseRating = action.payload;
        state.error = null;
      })
      .addCase(rateCourse.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to rate course';
      });

    // Update Rating
    builder
      .addCase(updateRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRating.fulfilled, (state, action) => {
        state.loading = false;
        state.courseRating = action.payload;
        state.error = null;
      })
      .addCase(updateRating.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to update rating';
      });

    // Get Course Ratings
    builder
      .addCase(getCourseRatings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCourseRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.ratings = action.payload.ratings;
        state.error = null;
      })
      .addCase(getCourseRatings.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to fetch ratings';
      });

    // Get My Rating
    builder
      .addCase(getMyRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyRating.fulfilled, (state, action) => {
        state.loading = false;
        state.courseRating = action.payload;
        state.error = null;
      })
      .addCase(getMyRating.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to fetch your rating';
      });

    // Delete Rating
    builder
      .addCase(deleteRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRating.fulfilled, (state) => {
        state.loading = false;
        state.courseRating = null;
        state.error = null;
      })
      .addCase(deleteRating.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to delete rating';
      });

    // Get All User Ratings
    builder
      .addCase(getAllUserRatings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUserRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.ratings = action.payload.ratings;
        // Transform RatingsResponse pagination to match Pagination interface
        state.pagination = {
          currentPage: action.payload.pagination.currentPage,
          pageSize: action.payload.pagination.pageSize,
          totalCourses: action.payload.pagination.totalRatings, // Map totalRatings to totalCourses
          totalPages: action.payload.pagination.totalPages,
          hasNextPage: action.payload.pagination.hasNextPage,
          hasPrevPage: action.payload.pagination.hasPrevPage,
        };
        state.error = null;
      })
      .addCase(getAllUserRatings.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to fetch user ratings';
      });

    // Unenroll From Course
    builder
      .addCase(unenrollFromCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unenrollFromCourse.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the course from enrolledCourses
        state.enrolledCourses = state.enrolledCourses.filter(
          course => course._id !== action.payload
        );
        state.error = null;
      })
      .addCase(unenrollFromCourse.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as ApiError;
        state.error = error.message || 'Failed to unenroll from course';
      });
  },
});

export const { clearUserError, clearCurrentCourse, clearCourseRating } = userSlice.actions;
export default userSlice.reducer;
