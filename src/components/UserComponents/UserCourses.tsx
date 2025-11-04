'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
    BookOpen,
    Clock,
    Calendar,
    Users,
    Star,
    LogOut,
    DollarSign
} from 'lucide-react';
import styles from './UserComponents.module.scss';
import AlertDialog from '../ui/AlertDialog';
import Toast from '../ui/Toast';
import Pagination from '../ui/Pagination';

interface Course {
    _id: string;
    courseName: string;
    courseCategory: string;
    instructorId: string;
    instructorName: string;
    description: string;
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
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: {
        courses: Course[];
        pagination: {
            currentPage: number;
            pageSize: number;
            totalCourses: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    };
}

export default function UserCourses() {
    // Mock API response - Replace with actual API call
    const [coursesData, setCoursesData] = useState<ApiResponse>({
        success: true,
        message: "Enrolled courses retrieved successfully",
        data: {
            courses: [
                {
                    _id: "69055847ebcd89cbc8eecee9",
                    courseName: "Complete Python Programming",
                    courseCategory: "Web Development",
                    instructorId: "690553d08deac7a86c92c678",
                    instructorName: "Jane Instructor",
                    description: "Learn Python from basics to advanced topics including Django and Flask. Master web development with real-world projects.",
                    rating: 4.8,
                    totalRatings: 156,
                    numberOfUserEnrolled: 1243,
                    skills: ["Python", "Django", "Flask", "REST APIs"],
                    tools: ["Python", "Django", "PostgreSQL", "Git"],
                    startingDate: "2024-02-01T00:00:00.000Z",
                    duration: "12 weeks",
                    price: 89.99,
                    courseFlyerURL: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                    isActive: true,
                    createdAt: "2025-11-01T00:45:59.350Z",
                    updatedAt: "2025-11-01T00:54:19.505Z",
                },
                {
                    _id: "69055847ebcd89cbc8eecee8",
                    courseName: "Modern React Development",
                    courseCategory: "Frontend Development",
                    instructorId: "690553d08deac7a86c92c677",
                    instructorName: "John Developer",
                    description: "Master React, Next.js, and modern frontend development practices with hands-on projects.",
                    rating: 4.9,
                    totalRatings: 203,
                    numberOfUserEnrolled: 1567,
                    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
                    tools: ["VS Code", "Node.js", "Git", "Vercel"],
                    startingDate: "2024-03-15T00:00:00.000Z",
                    duration: "10 weeks",
                    price: 99.99,
                    courseFlyerURL: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                    isActive: true,
                    createdAt: "2025-10-28T00:45:59.350Z",
                    updatedAt: "2025-10-28T00:54:19.505Z",
                },
                {
                    _id: "69055847ebcd89cbc8eecee7",
                    courseName: "Full Stack JavaScript",
                    courseCategory: "Full Stack Development",
                    instructorId: "690553d08deac7a86c92c676",
                    instructorName: "Sarah Engineer",
                    description: "Complete full-stack JavaScript course covering Node.js, Express, MongoDB, and React.",
                    rating: 4.7,
                    totalRatings: 187,
                    numberOfUserEnrolled: 1098,
                    skills: ["Node.js", "Express", "MongoDB", "React"],
                    tools: ["MongoDB", "Express", "React", "Node.js"],
                    startingDate: "2024-01-10T00:00:00.000Z",
                    duration: "16 weeks",
                    price: 129.99,
                    courseFlyerURL: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                    isActive: true,
                    createdAt: "2025-10-20T00:45:59.350Z",
                    updatedAt: "2025-10-20T00:54:19.505Z",
                }
            ],
            pagination: {
                currentPage: 1,
                pageSize: 10,
                totalCourses: 3,
                totalPages: 1,
                hasNextPage: false,
                hasPrevPage: false
            }
        }
    });

    const [showUnenrollDialog, setShowUnenrollDialog] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isUnenrolling, setIsUnenrolling] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleUnenrollClick = (course: Course) => {
        setSelectedCourse(course);
        setShowUnenrollDialog(true);
    };

    const handleUnenroll = async () => {
        if (!selectedCourse) return;

        setIsUnenrolling(true);

        // Simulate API call
        setTimeout(() => {
            const isSuccess = Math.random() > 0.1; // 90% success rate

            if (isSuccess) {
                // Remove course from the list
                setCoursesData({
                    ...coursesData,
                    data: {
                        ...coursesData.data,
                        courses: coursesData.data.courses.filter(
                            course => course._id !== selectedCourse._id
                        ),
                        pagination: {
                            ...coursesData.data.pagination,
                            totalCourses: coursesData.data.pagination.totalCourses - 1
                        }
                    }
                });
                setIsUnenrolling(false);
                setShowUnenrollDialog(false);
                setSelectedCourse(null);
                setShowSuccessToast(true);
            } else {
                setIsUnenrolling(false);
                setShowErrorToast(true);
            }
        }, 1500);
    };

    const courses = coursesData.data.courses;
    const hasNoCourses = courses.length === 0;
    const pagination = coursesData.data.pagination;

    const handlePageChange = (page: number) => {
        // In production, this would call the API with the new page number
        console.log('Changing to page:', page);
        // Simulate API call to fetch new page data
        // fetchCourses(page);
    };

    return (
        <div className={`min-h-screen py-6 sm:py-8 lg:py-12 ${styles.profilePage}`}>
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-6 sm:mb-8 lg:mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-3 leading-tight ${styles.pageTitle}`}>
                                My <span className={styles.gradientText}>Courses</span>
                            </h1>
                            <p className={`text-base sm:text-lg ${styles.pageSubtitle}`}>
                                {hasNoCourses
                                    ? 'You haven\'t enrolled in any courses yet'
                                    : `You are enrolled in ${courses.length} ${courses.length === 1 ? 'course' : 'courses'}`
                                }
                            </p>
                        </div>

                        {/* Stats Badge */}
                        {!hasNoCourses && (
                            <div className={`${styles.statsBadge} px-6 py-3 rounded-xl`}>
                                <div className="flex items-center gap-2">
                                    <BookOpen size={20} className={styles.statsIcon} />
                                    <span className="font-bold text-lg">{courses.length}</span>
                                    <span className={styles.statsLabel}>Active Courses</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Empty State */}
                {hasNoCourses ? (
                    <div className={`${styles.emptyState} rounded-2xl p-8 sm:p-12 text-center`}>
                        <div className={styles.emptyStateIcon}>
                            <BookOpen size={64} />
                        </div>
                        <h3 className={`text-2xl font-bold mb-3 ${styles.emptyStateTitle}`}>
                            No Courses Yet
                        </h3>
                        <p className={`text-base mb-6 ${styles.emptyStateText}`}>
                            Start your learning journey by enrolling in a course
                        </p>
                        <button className={`${styles.primaryBtn} px-8 py-3 rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105`}>
                            Browse Courses
                        </button>
                    </div>
                ) : (
                    /* Courses Grid */
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div
                                key={course._id}
                                className={`${styles.courseCard} rounded-2xl overflow-hidden transition-all duration-300`}
                            >
                                {/* Course Image */}
                                <div className={styles.courseImageContainer}>
                                    <Image
                                        src={course.courseFlyerURL}
                                        alt={course.courseName}
                                        width={400}
                                        height={250}
                                        className={styles.courseImage}
                                    />
                                    <div className={styles.courseCategory}>
                                        {course.courseCategory}
                                    </div>
                                </div>

                                {/* Course Content */}
                                <div className={styles.courseContent}>
                                    {/* Course Title & Instructor */}
                                    <div className="mb-3">
                                        <h3 className={styles.courseTitle}>
                                            {course.courseName}
                                        </h3>
                                        <p className={styles.courseInstructor}>
                                            by {course.instructorName}
                                        </p>
                                    </div>

                                    {/* Course Description */}
                                    <p className={styles.courseDescription}>
                                        {course.description}
                                    </p>

                                    {/* Course Stats */}
                                    <div className={styles.courseStats}>
                                        <div className={styles.courseStat}>
                                            <Star size={16} />
                                            <span>{course.rating.toFixed(1)}</span>
                                            <span className={styles.courseStatLabel}>
                                                ({course.totalRatings})
                                            </span>
                                        </div>
                                        <div className={styles.courseStat}>
                                            <Users size={16} />
                                            <span>{course.numberOfUserEnrolled.toLocaleString()}</span>
                                        </div>
                                        <div className={styles.courseStat}>
                                            <Clock size={16} />
                                            <span>{course.duration}</span>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div className={styles.courseSkills}>
                                        {course.skills.slice(0, 3).map((skill, index) => (
                                            <span key={index} className={styles.skillBadge}>
                                                {skill}
                                            </span>
                                        ))}
                                        {course.skills.length > 3 && (
                                            <span className={styles.skillBadge}>
                                                +{course.skills.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    {/* Course Footer */}
                                    <div className={styles.courseFooter}>
                                        <div className={styles.coursePrice}>
                                            <DollarSign size={18} />
                                            <span>{course.price.toFixed(2)}</span>
                                        </div>
                                        <button
                                            onClick={() => handleUnenrollClick(course)}
                                            className={styles.unenrollBtn}
                                        >
                                            <LogOut size={18} />
                                            <span>Unenroll</span>
                                        </button>
                                    </div>

                                    {/* Course Meta Info */}
                                    <div className={styles.courseMeta}>
                                        <div className={styles.courseMetaItem}>
                                            <Calendar size={14} />
                                            <span>Starts: {formatDate(course.startingDate)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!hasNoCourses && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            hasNextPage={pagination.hasNextPage}
                            hasPrevPage={pagination.hasPrevPage}
                            totalCourses={pagination.totalCourses}
                            pageSize={pagination.pageSize}
                            onPageChange={handlePageChange}
                            alwaysShow={true}
                        />
                    </div>
                )}
            </div>

            {/* Unenroll Confirmation Dialog */}
            <AlertDialog
                isOpen={showUnenrollDialog}
                onClose={() => {
                    if (!isUnenrolling) {
                        setShowUnenrollDialog(false);
                        setSelectedCourse(null);
                    }
                }}
                onConfirm={handleUnenroll}
                title="Unenroll from Course"
                description={`Are you sure you want to unenroll from "${selectedCourse?.courseName}"? You will lose access to all course materials and your progress will not be saved.`}
                confirmText="Yes, Unenroll"
                cancelText="Cancel"
                variant="warning"
                isLoading={isUnenrolling}
            />

            {/* Success Toast */}
            <Toast
                isVisible={showSuccessToast}
                onClose={() => setShowSuccessToast(false)}
                title="Successfully unenrolled from course"
                variant="success"
                duration={2000}
                position="top-right"
                showCloseButton={false}
            />

            {/* Error Toast */}
            <Toast
                isVisible={showErrorToast}
                onClose={() => setShowErrorToast(false)}
                title="Failed to unenroll from course"
                variant="error"
                duration={2000}
                position="top-right"
                showCloseButton={false}
            />
        </div>
    );
}
