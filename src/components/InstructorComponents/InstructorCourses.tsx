"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  Calendar,
  DollarSign,
  Users,
  Star,
  BookOpen,
  Power,
} from "lucide-react";
import styles from "./InstructorComponents.module.scss";
import Pagination from "../ui/Pagination";
import AlertDialog from "../ui/AlertDialog";
import Toast from "../ui/Toast";
import CustomSelect from "./CustomSelect";
import { useInstructor } from "@/hooks/useInstructorHook";
import courseService from "@/services/courseService";

interface Course {
  _id: string;
  courseName: string;
  courseCategory: string;
  instructorId: string;
  instructorName: string;
  description: string;
  whatYouWillLearn: string[];
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
  enrolledStudents: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  currentPage: number;
  pageSize: number;
  totalCourses: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    courses: Course[];
    pagination: PaginationData;
  };
}

export default function InstructorCourses() {
  const router = useRouter();
  const {
    courses: instructorCourses,
    pagination: instructorPagination,
    loading: instructorLoading,
    getInstructorCourses,
    deleteCourse: deleteCourseAction,
    toggleCourseStatus: toggleCourseStatusAction
  } = useInstructor();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    categories: [] as string[],
    tools: [] as string[],
    durations: [] as string[]
  });

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', message: '', variant: 'success' as 'success' | 'error' });
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    pageSize: 10,
    totalCourses: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTool, setSelectedTool] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");

  // Alert Dialog
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    courseId: "",
    courseName: "",
    isLoading: false,
  });

  const [deactivateDialog, setDeactivateDialog] = useState({
    isOpen: false,
    courseId: "",
    courseName: "",
    isActive: false,
    isLoading: false,
  });

  const [viewDialog, setViewDialog] = useState({
    isOpen: false,
    course: null as Course | null,
  });

  // Fetch filter options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [categoriesData, toolsData, durationsData] = await Promise.all([
          courseService.getCategories(),
          courseService.getTools(),
          courseService.getDurations()
        ]);
        setFilterOptions({
          categories: categoriesData,
          tools: toolsData,
          durations: durationsData
        });
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    };
    fetchFilterOptions();
  }, []);

  // Sync courses from Redux store
  useEffect(() => {
    if (instructorCourses) {
      setCourses(instructorCourses as unknown as Course[]);
    }
  }, [instructorCourses]);

  // Sync pagination from Redux store
  useEffect(() => {
    if (instructorPagination) {
      setPagination({
        currentPage: instructorPagination.currentPage || 1,
        pageSize: instructorPagination.pageSize || 10,
        totalCourses: instructorPagination.totalCourses || 0,
        totalPages: instructorPagination.totalPages || 1,
        hasNextPage: instructorPagination.hasNextPage || false,
        hasPrevPage: instructorPagination.hasPrevPage || false,
      });
    }
  }, [instructorPagination]);

  // Sync loading state
  useEffect(() => {
    setLoading(instructorLoading);
  }, [instructorLoading]);

  // Fetch courses from API
  const fetchCourses = async (page: number = 1) => {
    try {
      await getInstructorCourses(page, pagination.pageSize);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setToastMessage({
        title: 'Error',
        message: 'Failed to fetch courses. Please try again.',
        variant: 'error'
      });
      setShowToast(true);
    }
  };


  useEffect(() => {
    fetchCourses(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    fetchCourses(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedTool("");
    setSelectedDuration("");
    fetchCourses(1);
  };

  const handlePageChange = (page: number) => {
    fetchCourses(page);
  };

  const handleView = (course: Course) => {
    setViewDialog({ isOpen: true, course });
  };

  const handleEdit = (courseId: string) => {
    router.push(`/create-course?edit=${courseId}`);
  };

  const handleDeleteClick = (courseId: string, courseName: string) => {
    setDeleteDialog({
      isOpen: true,
      courseId,
      courseName,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialog((prev) => ({ ...prev, isLoading: true }));

    try {
      await deleteCourseAction(deleteDialog.courseId);
      setToastMessage({
        title: 'Success',
        message: 'Course deleted successfully!',
        variant: 'success'
      });
      setShowToast(true);
      setDeleteDialog({ isOpen: false, courseId: "", courseName: "", isLoading: false });
      fetchCourses(pagination.currentPage);
    } catch (err) {
      console.error("Error deleting course:", err);
      setToastMessage({
        title: 'Error',
        message: 'Failed to delete course. Please try again.',
        variant: 'error'
      });
      setShowToast(true);
      setDeleteDialog((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeactivateClick = (courseId: string, courseName: string, isActive: boolean) => {
    setDeactivateDialog({
      isOpen: true,
      courseId,
      courseName,
      isActive,
      isLoading: false,
    });
  };

  const handleDeactivateConfirm = async () => {
    setDeactivateDialog((prev) => ({ ...prev, isLoading: true }));

    try {
      await toggleCourseStatusAction(deactivateDialog.courseId, !deactivateDialog.isActive);
      const action = deactivateDialog.isActive ? "deactivated" : "activated";
      setToastMessage({
        title: 'Success',
        message: `Course ${action} successfully!`,
        variant: 'success'
      });
      setShowToast(true);
      setDeactivateDialog({
        isOpen: false,
        courseId: "",
        courseName: "",
        isActive: false,
        isLoading: false
      });
      fetchCourses(pagination.currentPage);
    } catch (err) {
      console.error("Error updating course status:", err);
      setToastMessage({
        title: 'Error',
        message: 'Failed to update course status. Please try again.',
        variant: 'error'
      });
      setShowToast(true);
      setDeactivateDialog((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedTool || selectedDuration;

  return (
    <div className="w-full max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${styles.formTitle}`}>My Courses</h1>
          <p className={`text-xs sm:text-sm mt-1 ${styles.formLabel}`}>
            Manage and track your course offerings
          </p>
        </div>
        <button
          onClick={() => router.push("/create-course")}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${styles.submitButton}`}
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Filters Section */}
      <div className={`rounded-lg sm:rounded-xl border p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 ${styles.formCard}`}>
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className={`p-1.5 sm:p-2 rounded-lg ${styles.formIconBg}`}>
            <Filter className={`w-4 h-4 sm:w-5 sm:h-5 ${styles.formIcon}`} />
          </div>
          <h2 className={`text-base sm:text-lg font-bold ${styles.formTitle}`}>Search & Filters</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label className={`block text-xs sm:text-sm font-medium mb-2 ${styles.formLabel}`}>
              Search by name
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search courses..."
                className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border focus:outline-none focus:ring-2 transition-all ${styles.formInput}`}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <CustomSelect
              options={filterOptions.categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="All Categories"
              label="Category"
            />
          </div>

          {/* Tool Filter */}
          <div>
            <CustomSelect
              options={filterOptions.tools}
              value={selectedTool}
              onChange={setSelectedTool}
              placeholder="All Tools"
              label="Tool"
            />
          </div>

          {/* Duration Filter */}
          <div>
            <CustomSelect
              options={filterOptions.durations}
              value={selectedDuration}
              onChange={setSelectedDuration}
              placeholder="All Durations"
              label="Duration"
            />
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
          <button
            onClick={handleSearch}
            className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all ${styles.addButton}`}
          >
            Apply Filters
          </button>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all ${styles.cancelButton}`}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Courses Table */}
      <div className={`rounded-lg sm:rounded-xl border overflow-hidden ${styles.formCard}`}>
        {loading ? (
          <>
            {/* Desktop Skeleton */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className={styles.tableHeader}>
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[...Array(5)].map((_, index) => (
                    <tr key={index} className={styles.tableRow}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Skeleton */}
            <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                    </div>
                    <div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                    </div>
                    <div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="flex-1 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="flex-1 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className={`text-lg font-semibold mb-2 ${styles.formTitle}`}>
              No courses found
            </h3>
            <p className={`text-sm ${styles.formLabel}`}>
              {hasActiveFilters
                ? "Try adjusting your filters"
                : "Create your first course to get started"}
            </p>
            {!hasActiveFilters && (
              <button
                onClick={() => router.push("/create-course")}
                className={`mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${styles.addButton}`}
              >
                <Plus className="w-4 h-4" />
                Create Course
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className={styles.tableHeader}>
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-2 py-4 text-left text-xs font-semibold uppercase tracking-wider w-32">
                      Category
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={styles.tableBody}>
                  {courses.map((course) => (
                    <tr key={course._id} className={styles.tableRow}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                            style={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              minWidth: '3rem',
                              minHeight: '3rem'
                            }}
                          >
                            {course.courseName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className={`font-semibold ${styles.courseName}`}>
                              {course.courseName}
                            </div>
                            <div className={`text-xs ${styles.formLabel}`}>
                              {formatDate(course.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${styles.categoryBadge}`}>
                          {course.courseCategory}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="w-4 h-4" />
                          <span className="font-semibold">{course.numberOfUserEnrolled}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{course.rating.toFixed(1)}</span>
                          <span className={`text-xs ${styles.formLabel}`}>
                            ({course.totalRatings})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold">${course.price.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-sm ${styles.formLabel}`}>{course.duration}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            course.isActive ? styles.activeBadge : styles.inactiveBadge
                          }`}
                        >
                          {course.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(course)}
                            className={`p-2 rounded-lg transition-all ${styles.actionButton} ${styles.viewButton}`}
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(course._id)}
                            className={`p-2 rounded-lg transition-all ${styles.actionButton} ${styles.editButton}`}
                            title="Edit course"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeactivateClick(course._id, course.courseName, course.isActive)}
                            className={`p-2 rounded-lg transition-all ${styles.actionButton} ${
                              course.isActive ? styles.deleteButton : styles.editButton
                            }`}
                            title={course.isActive ? "Deactivate course" : "Activate course"}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(course._id, course.courseName)}
                            className={`p-2 rounded-lg transition-all ${styles.actionButton} ${styles.deleteButton}`}
                            title="Delete course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden p-3 sm:p-4 space-y-3 sm:space-y-4">
              {courses.map((course) => (
                <div key={course._id} className={`rounded-lg border p-3 sm:p-4 ${styles.mobileCard}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 text-sm sm:text-base"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          minWidth: '2.5rem',
                          minHeight: '2.5rem'
                        }}
                      >
                        {course.courseName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-sm sm:text-base truncate ${styles.courseName}`}>
                          {course.courseName}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                          <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium inline-block ${styles.categoryBadge}`}>
                            {course.courseCategory}
                          </span>
                          <span
                            className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium inline-block ${
                              course.isActive ? styles.activeBadge : styles.inactiveBadge
                            }`}
                          >
                            {course.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                      <span className="text-xs sm:text-sm truncate">
                        <span className="font-semibold">{course.numberOfUserEnrolled}</span>{" "}
                        <span className="hidden xs:inline">students</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400 shrink-0" />
                      <span className="text-xs sm:text-sm truncate">
                        <span className="font-semibold">{course.rating.toFixed(1)}</span> (
                        {course.totalRatings})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold truncate">${course.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                      <span className="text-xs sm:text-sm truncate">{course.duration}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t">
                    <button
                      onClick={() => handleView(course)}
                      className={`flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-lg transition-all ${styles.actionButton} ${styles.viewButton}`}
                    >
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">View</span>
                    </button>
                    <button
                      onClick={() => handleEdit(course._id)}
                      className={`flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-lg transition-all ${styles.actionButton} ${styles.editButton}`}
                    >
                      <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeactivateClick(course._id, course.courseName, course.isActive)}
                      className={`flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-lg transition-all ${styles.actionButton} ${
                        course.isActive ? styles.deleteButton : styles.editButton
                      }`}
                    >
                      <Power className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">{course.isActive ? "Deactivate" : "Activate"}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(course._id, course.courseName)}
                      className={`flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-lg transition-all ${styles.actionButton} ${styles.deleteButton}`}
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-6 py-4">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                hasNextPage={pagination.hasNextPage}
                hasPrevPage={pagination.hasPrevPage}
                totalCourses={pagination.totalCourses}
                pageSize={pagination.pageSize}
                onPageChange={handlePageChange}
                alwaysShow
              />
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={deleteDialog.isOpen}
        onClose={() =>
          setDeleteDialog({ isOpen: false, courseId: "", courseName: "", isLoading: false })
        }
        onConfirm={handleDeleteConfirm}
        title="Delete Course"
        description={`Are you sure you want to delete "${deleteDialog.courseName}"? This action cannot be undone and all enrolled students will lose access to this course.`}
        confirmText="Delete Course"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteDialog.isLoading}
      />

      {/* Deactivate/Activate Confirmation Dialog */}
      <AlertDialog
        isOpen={deactivateDialog.isOpen}
        onClose={() =>
          setDeactivateDialog({
            isOpen: false,
            courseId: "",
            courseName: "",
            isActive: false,
            isLoading: false
          })
        }
        onConfirm={handleDeactivateConfirm}
        title={deactivateDialog.isActive ? "Deactivate Course" : "Activate Course"}
        description={
          deactivateDialog.isActive
            ? `Are you sure you want to deactivate "${deactivateDialog.courseName}"? Students will no longer be able to enroll in this course.`
            : `Are you sure you want to activate "${deactivateDialog.courseName}"? Students will be able to enroll in this course.`
        }
        confirmText={deactivateDialog.isActive ? "Deactivate Course" : "Activate Course"}
        cancelText="Cancel"
        variant={deactivateDialog.isActive ? "danger" : "info"}
        isLoading={deactivateDialog.isLoading}
      />

      {/* View Course Dialog */}
      {viewDialog.isOpen && viewDialog.course && (
        <div
          className="fixed z-50 flex items-center justify-center p-2 sm:p-4 left-0 right-0 md:left-[280px]"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            top: '73px',
            bottom: '0'
          }}
          onClick={() => setViewDialog({ isOpen: false, course: null })}
        >
          <div
            className={`max-w-3xl w-full max-h-[calc(100vh-90px)] sm:max-h-[calc(100vh-100px)] overflow-y-auto rounded-lg sm:rounded-xl shadow-2xl ${styles.viewDialog}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b ${styles.viewDialogHeader}`}>
              <h2 className={`text-lg sm:text-2xl font-bold ${styles.formTitle}`}>Course Details</h2>
              <button
                onClick={() => setViewDialog({ isOpen: false, course: null })}
                className={`p-1.5 sm:p-2 rounded-lg transition-all ${styles.removeButton}`}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Course Header */}
              <div>
                <h3 className={`text-base sm:text-xl font-bold mb-2 ${styles.formTitle}`}>
                  {viewDialog.course.courseName}
                </h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${styles.categoryBadge}`}>
                    {viewDialog.course.courseCategory}
                  </span>
                  <span
                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                      viewDialog.course.isActive ? styles.activeBadge : styles.inactiveBadge
                    }`}
                  >
                    {viewDialog.course.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                <div className={`p-3 sm:p-4 rounded-lg ${styles.statCard}`}>
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-2 text-primary" />
                  <div className="text-lg sm:text-2xl font-bold">{viewDialog.course.numberOfUserEnrolled}</div>
                  <div className={`text-xs ${styles.formLabel}`}>Students</div>
                </div>
                <div className={`p-3 sm:p-4 rounded-lg ${styles.statCard}`}>
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-2 text-yellow-400" />
                  <div className="text-lg sm:text-2xl font-bold">{viewDialog.course.rating.toFixed(1)}</div>
                  <div className={`text-xs ${styles.formLabel}`}>
                    ({viewDialog.course.totalRatings} ratings)
                  </div>
                </div>
                <div className={`p-3 sm:p-4 rounded-lg ${styles.statCard}`}>
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-2 text-green-500" />
                  <div className="text-lg sm:text-2xl font-bold">${viewDialog.course.price.toFixed(2)}</div>
                  <div className={`text-xs ${styles.formLabel}`}>Price</div>
                </div>
                <div className={`p-3 sm:p-4 rounded-lg ${styles.statCard}`}>
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-2 text-blue-500" />
                  <div className="text-lg sm:text-2xl font-bold">{viewDialog.course.duration}</div>
                  <div className={`text-xs ${styles.formLabel}`}>Duration</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className={`text-base sm:text-lg font-semibold mb-2 ${styles.formTitle}`}>Description</h4>
                <p className={`text-xs sm:text-sm ${styles.formLabel}`}>{viewDialog.course.description}</p>
              </div>

              {/* What You Will Learn */}
              <div>
                <h4 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${styles.formTitle}`}>
                  What You Will Learn
                </h4>
                <ul className="space-y-1.5 sm:space-y-2">
                  {viewDialog.course.whatYouWillLearn.map((item, index) => (
                    <li key={index} className={`flex items-start gap-2 text-xs sm:text-sm ${styles.formLabel}`}>
                      <span className="text-primary mt-0.5 sm:mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div>
                <h4 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${styles.formTitle}`}>Skills</h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {viewDialog.course.skills.map((skill, index) => (
                    <span key={index} className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-medium ${styles.chip}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <h4 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${styles.formTitle}`}>Tools</h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {viewDialog.course.tools.map((tool, index) => (
                    <span key={index} className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm font-medium ${styles.chip}`}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Course Info */}
              <div>
                <h4 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${styles.formTitle}`}>Course Information</h4>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between gap-2">
                    <span className={styles.formLabel}>Starting Date:</span>
                    <span className="font-medium text-right">{formatDate(viewDialog.course.startingDate)}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className={styles.formLabel}>Created:</span>
                    <span className="font-medium text-right">{formatDate(viewDialog.course.createdAt)}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className={styles.formLabel}>Last Updated:</span>
                    <span className="font-medium text-right">{formatDate(viewDialog.course.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Enrolled Students */}
              <div>
                <h4 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 ${styles.formTitle}`}>
                  Enrolled Students ({viewDialog.course.enrolledStudents.length})
                </h4>
                {viewDialog.course.enrolledStudents.length > 0 ? (
                  <div className="space-y-2">
                    {viewDialog.course.enrolledStudents.map((student) => (
                      <div
                        key={student._id}
                        className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg ${styles.statCard}`}
                      >
                        <div
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            minWidth: '2rem',
                            minHeight: '2rem'
                          }}
                        >
                          {student.firstName.charAt(0).toUpperCase()}{student.lastName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-sm sm:text-base truncate ${styles.formTitle}`}>
                            {student.firstName} {student.lastName}
                          </div>
                          <div className={`text-xs ${styles.formLabel} truncate`}>{student.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-xs sm:text-sm ${styles.formLabel}`}>No students enrolled yet.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
                <button
                  onClick={() => {
                    const courseId = viewDialog.course?._id;
                    setViewDialog({ isOpen: false, course: null });
                    if (courseId) handleEdit(courseId);
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all ${styles.addButton}`}
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                  Edit Course
                </button>
                <button
                  onClick={() => setViewDialog({ isOpen: false, course: null })}
                  className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all ${styles.cancelButton}`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        title={toastMessage.title}
        message={toastMessage.message}
        variant={toastMessage.variant}
        duration={3000}
        position="top-right"
      />
    </div>
  );
}
