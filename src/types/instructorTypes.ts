// src/store/types/instructorTypes.ts

export interface CreateCoursePayload {
  courseName: string;
  courseCategory: string;
  description: string;
  whatYouWillLearn?: string[];
  skills: string[];
  tools: string[];
  startingDate: string;
  duration: string;
  price: number;
  courseFlyerURL: string;
}

export interface UpdateCoursePayload {
  courseId: string;
  courseName?: string;
  courseCategory?: string;
  description?: string;
  whatYouWillLearn?: string[];
  skills?: string[];
  tools?: string[];
  startingDate?: string;
  duration?: string;
  price?: number;
  courseFlyerURL?: string;
  isActive?: boolean;
}

export interface InstructorCourse {
  _id: string;
  courseName: string;
  courseCategory: string;
  instructorId: string;
  instructorName: string;
  description: string;
  whatYouWillLearn?: string[];
  rating: number;
  totalRatings: number;
  numberOfUserEnrolled: number;
  skills: string[];
  tools: string[];
  startingDate: string;
  duration: string;
  price: number;
  courseFlyerURL: string;
  isActive: boolean;
  enrolledStudents?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InstructorPagination {
  currentPage: number;
  pageSize: number;
  totalCourses: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface InstructorCoursesResponse {
  courses: InstructorCourse[];
  pagination: InstructorPagination;
}

export interface InstructorState {
  courses: InstructorCourse[];
  currentCourse: InstructorCourse | null;
  pagination: InstructorPagination | null;
  loading: boolean;
  error: string | null;
}
