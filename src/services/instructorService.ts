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
    size: number = 10,
    filters?: {
      name?: string;
      category?: string;
      tool?: string;
      duration?: string;
      includeInactive?: boolean;
    }
  ): Promise<ApiSuccessResponse<InstructorCoursesResponse>> {
    // Build query parameters dynamically
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());

    // Always include inactive courses by default
    params.append('includeInactive', 'true');

    // Add filters only if they are provided
    if (filters?.name && filters.name.trim()) {
      params.append('name', filters.name.trim());
    }
    if (filters?.category && filters.category.trim()) {
      params.append('category', filters.category.trim());
    }
    if (filters?.tool && filters.tool.trim()) {
      params.append('tool', filters.tool.trim());
    }
    if (filters?.duration && filters.duration.trim()) {
      params.append('duration', filters.duration.trim());
    }
    // Allow override of includeInactive if explicitly set to false
    if (filters?.includeInactive === false) {
      params.set('includeInactive', 'false');
    }

    const response = await axiosInstance.get(
      `/api/courses/instructor/my-courses?${params.toString()}`
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
