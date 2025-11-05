// src/store/types/fileUploadTypes.ts

export interface UploadedFile {
  url: string;
  publicId: string;
  originalName: string;
  size: number;
}

export interface FileUploadState {
  courseFlyerUrl: string | null;
  profileImageUrl: string | null;
  loading: boolean;
  error: string | null;
}

export interface UploadFileResponse {
  file: UploadedFile;
}
