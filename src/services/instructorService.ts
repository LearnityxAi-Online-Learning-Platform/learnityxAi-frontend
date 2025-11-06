// src/store/services/instructorService.ts
import axiosInstance from '@/lib/api/axiosInstance';
import {
  CreateCoursePayload,
  UpdateCoursePayload,
  InstructorCourse,
  InstructorCoursesResponse,
  DashboardStats,
} from '@/types/instructorTypes';
import { ApiSuccessResponse } from '@/types/authTypes';

class InstructorService {
  // Create a new course (instructor only)
  async createCourse(
    payload: CreateCoursePayload
  ): Promise<ApiSuccessResponse<{ course: InstructorCourse }>> {
    const response = await axiosInstance.post('/api/courses', payload);
    return response.data;
  }

  // Update a course (instructor only)
  async updateCourse(
    payload: UpdateCoursePayload
  ): Promise<ApiSuccessResponse<{ course: InstructorCourse }>> {
    const { courseId, ...updateData } = payload;
    const response = await axiosInstance.put(`/api/courses/${courseId}`, updateData);
    return response.data;
  }

  // Delete a course (instructor only)
  async deleteCourse(courseId: string): Promise<ApiSuccessResponse<null>> {
    const response = await axiosInstance.delete(`/api/courses/${courseId}`);
    return response.data;
  }

  // Get instructor's courses
  async getInstructorCourses(
    page: number = 1,
    size: number = 10
  ): Promise<ApiSuccessResponse<InstructorCoursesResponse>> {
    const response = await axiosInstance.get(
      `/api/courses/instructor/my-courses?includeInactive=true&page=${page}&size=${size}`
    );
    return response.data;
  }

  // Get a specific course by ID (instructor)
  async getCourseById(
    courseId: string
  ): Promise<ApiSuccessResponse<{ course: InstructorCourse }>> {
    const response = await axiosInstance.get(`/api/courses/${courseId}`);
    return response.data;
  }

  // Toggle course active status
  async toggleCourseStatus(
    courseId: string,
    isActive: boolean
  ): Promise<ApiSuccessResponse<{ course: InstructorCourse }>> {
    const response = await axiosInstance.put(`/api/courses/${courseId}`, { isActive });
    return response.data;
  }

  // Get instructor dashboard statistics
  async getDashboardStats(): Promise<ApiSuccessResponse<DashboardStats>> {
    const response = await axiosInstance.get('/api/courses/instructor/dashboard');
    return response.data;
  }
}

export const instructorService = new InstructorService();
export default instructorService;
