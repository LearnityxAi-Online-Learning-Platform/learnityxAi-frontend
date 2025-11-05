// src/store/services/fileUploadService.ts
import axiosInstance from '@/lib/api/axiosInstance';
import { ApiSuccessResponse } from '@/types/authTypes';
import { UploadFileResponse } from '@/types/fileUploadTypes';

class FileUploadService {
  // Upload course flyer
  async uploadCourseFlyer(file: File): Promise<ApiSuccessResponse<UploadFileResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/api/upload/course-flyer', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Upload profile image
  async uploadProfileImage(file: File): Promise<ApiSuccessResponse<UploadFileResponse>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/api/upload/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }
}

export const fileUploadService = new FileUploadService();
export default fileUploadService;
