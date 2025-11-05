// src/store/types/userTypes.ts

export interface Course {
  _id: string;
  courseName: string;
  courseCategory: string;
  instructorId: string | InstructorInfo;
  instructorName: string;
  description: string;
  whatYouWillLearn?: string[];
  rating: number;
  totalRatings?: number;
  numberOfUserEnrolled: number;
  skills: string[];
  tools: string[];
  startingDate: string;
  duration: string;
  price: number;
  courseFlyerURL: string;
  isActive: boolean;
  enrolledStudents?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface InstructorInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
  bio: string;
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalCourses: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CoursesResponse {
  courses: Course[];
  pagination: Pagination;
}

export interface SearchCoursesParams {
  page?: number;
  size?: number;
  search?: string;
  category?: string;
  skills?: string;
  tools?: string;
  instructorName?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'rating' | 'price' | 'numberOfUserEnrolled' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface Rating {
  _id: string;
  courseId: string;
  userId: string | RatingUser;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface RatingUser {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
}

export interface RatingsResponse {
  ratings: Rating[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalRatings: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  averageRating: number;
  totalRatingsCount: number;
}

export interface CreateRatingPayload {
  courseId: string;
  rating: number;
  comment: string;
}

export interface UpdateRatingPayload {
  courseId: string;
  rating: number;
  comment: string;
}

export interface RecommendationsResponse {
  courses: Course[];
  pagination: Pagination;
  recommendationType: 'ai-powered' | 'rating-based';
  cached?: boolean;
  authenticated?: boolean;
  message?: string;
  apiUsage?: {
    global: {
      used: number;
      remaining: number;
      limit: number;
      percentageUsed: string;
    };
    personal: {
      used: number;
      remaining: number;
      limit: number;
      hoursUntilReset: number;
    };
  };
}

export interface UserState {
  courses: Course[];
  currentCourse: Course | null;
  enrolledCourses: Course[];
  recommendations: Course[];
  categories: string[];
  tools: string[];
  durations: string[];
  ratings: Rating[];
  courseRating: Rating | null;
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}
