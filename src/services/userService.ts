// src/store/services/userService.ts
import axiosInstance from '@/lib/api/axiosInstance';
import axios from 'axios';
import { base_url } from '@/config/config';
import {
  SearchCoursesParams,
  CoursesResponse,
  Course,
  CreateRatingPayload,
  UpdateRatingPayload,
  RatingsResponse,
  Rating,
  RecommendationsResponse,
} from '@/types/userTypes';
import { ApiSuccessResponse } from '@/types/authTypes';

class UserService {
  // Search courses (public or authenticated)
  async searchCourses(
    params: SearchCoursesParams,
    authenticated: boolean = false
  ): Promise<ApiSuccessResponse<CoursesResponse>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.size) queryParams.append('size', params.size.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.skills) queryParams.append('skills', params.skills);
    if (params.tools) queryParams.append('tools', params.tools);
    if (params.instructorName) queryParams.append('instructorName', params.instructorName);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `/api/courses?${queryParams.toString()}`;

    const response = authenticated
      ? await axiosInstance.get(url)
      : await axios.get(`${base_url}${url}`);

    return response.data;
  }

  // Get course by ID (public)
  async getCourseById(courseId: string): Promise<ApiSuccessResponse<{ course: Course }>> {
    const response = await axios.get(`${base_url}/api/courses/${courseId}`);
    return response.data;
  }

  // Get course categories (public)
  async getCategories(): Promise<ApiSuccessResponse<{ categories: string[] }>> {
    const response = await axios.get(`${base_url}/api/courses/categories`);
    return response.data;
  }

  // Get tools list (public)
  async getTools(): Promise<ApiSuccessResponse<{ tools: string[] }>> {
    const response = await axios.get(`${base_url}/api/courses/tools`);
    return response.data;
  }

  // Get durations list (public)
  async getDurations(): Promise<ApiSuccessResponse<{ durations: string[] }>> {
    const response = await axios.get(`${base_url}/api/courses/durations`);
    return response.data;
  }

  // Search courses with advanced filters (public)
  async advancedSearchCourses(
    params: SearchCoursesParams
  ): Promise<ApiSuccessResponse<CoursesResponse>> {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    if (params.skills) queryParams.append('skills', params.skills);
    if (params.tools) queryParams.append('tools', params.tools);
    if (params.instructorName) queryParams.append('instructorName', params.instructorName);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.size) queryParams.append('size', params.size.toString());

    const response = await axios.get(`${base_url}/api/courses/search?${queryParams.toString()}`);
    return response.data;
  }

  // Enroll in a course (authenticated - student only)
  async enrollInCourse(
    courseId: string
  ): Promise<
    ApiSuccessResponse<{
      courseId: string;
      courseName: string;
      startingDate: string;
      message: string;
    }>
  > {
    const response = await axiosInstance.post(`/api/courses/${courseId}/enroll`);
    return response.data;
  }

  // Get enrolled courses (authenticated - student only)
  async getEnrolledCourses(
    page: number = 1,
    size: number = 10
  ): Promise<ApiSuccessResponse<CoursesResponse>> {
    const response = await axiosInstance.get(
      `/api/courses/student/enrolled?page=${page}&size=${size}`
    );
    return response.data;
  }

  // Get AI course recommendations (public or authenticated)
  async getRecommendations(
    page: number = 1,
    size: number = 10,
    authenticated: boolean = false
  ): Promise<ApiSuccessResponse<RecommendationsResponse>> {
    const url = `/api/recommendations?page=${page}&size=${size}`;

    const response = authenticated
      ? await axiosInstance.get(url)
      : await axios.get(`${base_url}${url}`);

    return response.data;
  }

  // Create or update course rating (authenticated)
  async rateCourse(
    payload: CreateRatingPayload
  ): Promise<ApiSuccessResponse<{ rating: Rating }>> {
    const response = await axiosInstance.post(
      `/api/ratings/course/${payload.courseId}`,
      {
        rating: payload.rating,
        comment: payload.comment,
      }
    );
    return response.data;
  }

  // Update course rating (authenticated)
  async updateRating(
    payload: UpdateRatingPayload
  ): Promise<ApiSuccessResponse<{ rating: Rating }>> {
    const response = await axiosInstance.post(
      `/api/ratings/course/${payload.courseId}`,
      {
        rating: payload.rating,
        comment: payload.comment,
      }
    );
    return response.data;
  }

  // Get course ratings (public)
  async getCourseRatings(
    courseId: string,
    page: number = 1,
    size: number = 10
  ): Promise<ApiSuccessResponse<RatingsResponse>> {
    const response = await axios.get(
      `${base_url}/api/ratings/course/${courseId}?page=${page}&size=${size}`
    );
    return response.data;
  }

  // Get user's rating for a course (authenticated)
  async getMyRating(courseId: string): Promise<ApiSuccessResponse<{ rating: Rating }>> {
    const response = await axiosInstance.get(`/api/ratings/course/${courseId}/my-rating`);
    return response.data;
  }

  // Delete course rating (authenticated)
  async deleteRating(courseId: string): Promise<ApiSuccessResponse<null>> {
    const response = await axiosInstance.delete(`/api/ratings/course/${courseId}`);
    return response.data;
  }

  // Get all user's ratings (authenticated)
  async getAllUserRatings(
    page: number = 1,
    size: number = 10
  ): Promise<ApiSuccessResponse<RatingsResponse>> {
    // Updated endpoint - adjust this based on your actual backend API
    const response = await axiosInstance.get(
      `/api/user/ratings?page=${page}&size=${size}`
    );
    return response.data;
  }

  // Unenroll from a course (authenticated - student only)
  async unenrollFromCourse(courseId: string): Promise<ApiSuccessResponse<null>> {
    const response = await axiosInstance.post(`/api/courses/${courseId}/unenroll`);
    return response.data;
  }
}

export const userService = new UserService();
export default userService;
