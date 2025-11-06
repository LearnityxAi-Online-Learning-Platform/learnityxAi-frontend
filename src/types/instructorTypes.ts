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

export interface DashboardStats {
  instructor: {
    name: string;
    email: string;
  };
  overview: {
    totalCourses: number;
    totalStudents: number;
    averageRating: number;
    totalRevenue: number;
  };
  topCourses: {
    mostPopular: {
      courseId: string;
      courseName: string;
      enrolledStudents: number;
    };
    highestRated: {
      courseId: string;
      courseName: string;
      rating: number;
      totalRatings: number;
    };
  };
  coursesByCategory: {
    [key: string]: {
      count: number;
      totalEnrolled: number;
    };
  };
  allCourses: Array<{
    courseId: string;
    courseName: string;
    courseCategory: string;
    enrolledStudents: number;
    rating: number;
    totalRatings: number;
    price: number;
    startingDate: string;
    duration: string;
  }>;
}

export interface InstructorState {
  courses: InstructorCourse[];
  currentCourse: InstructorCourse | null;
  pagination: InstructorPagination | null;
  dashboardStats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}
