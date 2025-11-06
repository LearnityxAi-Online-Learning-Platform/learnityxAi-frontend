/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/slices/courseSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  courseService,
  Course,
  RecommendationResponse,
  GetCoursesParams,
  SystemReview,
  SystemReviewsResponse,
} from '@/services/courseService';

export interface CourseState {
  courses: Course[];
  recommendations: Course[];
  selectedCourse: Course | null;
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  recommendationsLoading: boolean;
  recommendationsError: string | null;
  systemReviews: SystemReview[];
  systemReviewsPagination: {
    currentPage: number;
    pageSize: number;
    totalReviews: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
  systemReviewsSummary: {
    totalReviews: number;
    averageRating: number;
  } | null;
  systemReviewsLoading: boolean;
  systemReviewsError: string | null;
}

const initialState: CourseState = {
  courses: [],
  recommendations: [],
  selectedCourse: null,
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
  recommendationsLoading: false,
  recommendationsError: null,
  systemReviews: [],
  systemReviewsPagination: null,
  systemReviewsSummary: null,
  systemReviewsLoading: false,
  systemReviewsError: null,
};

// Async Thunks
export const fetchRecommendations = createAsyncThunk(
  'courses/fetchRecommendations',
  async (options: { forceRefresh?: boolean; userId?: string } | undefined, { rejectWithValue }) => {
    try {
      const response = await courseService.getRecommendations(options);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommendations');
    }
  }
);

export const refreshRecommendations = createAsyncThunk(
  'courses/refreshRecommendations',
  async (userId: string | undefined, { rejectWithValue }) => {
    try {
      const response = await courseService.refreshRecommendations(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to refresh recommendations');
    }
  }
);

export const fetchAllCourses = createAsyncThunk(
  'courses/fetchAllCourses',
  async (params: GetCoursesParams | undefined, { rejectWithValue }) => {
    try {
      // Always fetch directly from backend without cache
      const response = await courseService.getAllCourses(params, false);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (id: string, { rejectWithValue }) => {
    try {
      // Always fetch directly from backend without cache
      const response = await courseService.getCourseById(id, false);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course');
    }
  }
);

export const fetchCoursesByCategory = createAsyncThunk(
  'courses/fetchCoursesByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      // Always fetch directly from backend without cache
      const response = await courseService.getCoursesByCategory(category, false);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses by category');
    }
  }
);

export const searchCourses = createAsyncThunk(
  'courses/searchCourses',
  async ({ searchQuery, params }: { searchQuery: string; params?: GetCoursesParams }, { rejectWithValue }) => {
    try {
      const response = await courseService.searchCourses(searchQuery, params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search courses');
    }
  }
);

export const fetchSystemReviews = createAsyncThunk(
  'courses/fetchSystemReviews',
  async (params: { page?: number; size?: number } | undefined, { rejectWithValue }) => {
    try {
      const response = await courseService.getSystemReviews(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch system reviews');
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.recommendationsError = null;
    },
    clearCourses: (state) => {
      state.courses = [];
      state.total = 0;
      state.page = 1;
      state.totalPages = 1;
    },
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },
    clearCache: () => {
      courseService.clearCache();
    },
    clearRecommendationsCache: (state, action: PayloadAction<string | undefined>) => {
      courseService.clearRecommendationsCache(action.payload);
      state.recommendations = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Recommendations
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.recommendationsLoading = true;
        state.recommendationsError = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action: PayloadAction<RecommendationResponse>) => {
        state.recommendationsLoading = false;
        state.recommendations = action.payload.courses;
        state.recommendationsError = null;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.recommendationsLoading = false;
        state.recommendationsError = action.payload as string;
      });

    // Refresh Recommendations
    builder
      .addCase(refreshRecommendations.pending, (state) => {
        state.recommendationsLoading = true;
        state.recommendationsError = null;
      })
      .addCase(refreshRecommendations.fulfilled, (state, action: PayloadAction<RecommendationResponse>) => {
        state.recommendationsLoading = false;
        state.recommendations = action.payload.courses;
        state.recommendationsError = null;
      })
      .addCase(refreshRecommendations.rejected, (state, action) => {
        state.recommendationsLoading = false;
        state.recommendationsError = action.payload as string;
      });

    // Fetch All Courses
    builder
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.error = null;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Course By ID
    builder
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action: PayloadAction<Course>) => {
        state.loading = false;
        state.selectedCourse = action.payload;
        state.error = null;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Courses By Category
    builder
      .addCase(fetchCoursesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoursesByCategory.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.loading = false;
        state.courses = action.payload;
        state.error = null;
      })
      .addCase(fetchCoursesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search Courses
    builder
      .addCase(searchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(searchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch System Reviews
    builder
      .addCase(fetchSystemReviews.pending, (state) => {
        state.systemReviewsLoading = true;
        state.systemReviewsError = null;
      })
      .addCase(fetchSystemReviews.fulfilled, (state, action: PayloadAction<SystemReviewsResponse>) => {
        state.systemReviewsLoading = false;
        state.systemReviews = action.payload.reviews;
        state.systemReviewsPagination = action.payload.pagination;
        state.systemReviewsSummary = action.payload.summary;
        state.systemReviewsError = null;
      })
      .addCase(fetchSystemReviews.rejected, (state, action) => {
        state.systemReviewsLoading = false;
        state.systemReviewsError = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearCourses,
  clearSelectedCourse,
  clearCache,
  clearRecommendationsCache,
} = courseSlice.actions;

export default courseSlice.reducer;
