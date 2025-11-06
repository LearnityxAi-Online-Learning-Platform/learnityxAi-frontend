/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, Clock, TrendingUp, ArrowRight, Award } from 'lucide-react';
import courseService from '@/services/courseService';
import styles from './HomePageComponents.module.scss';

interface Course {
    _id: string;
    courseName: string;
    courseCategory: string;
    instructorName: string;
    description: string;
    rating: number;
    skills: string[];
    tools: string[];
    startingDate: string;
    duration: string;
    price: number;
    courseFlyerURL: string;
    numberOfUserEnrolled?: number;
}

export default function StudentsChoiceCourses(): React.JSX.Element {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch top rated courses on mount
    useEffect(() => {
        const fetchTopRated = async () => {
            try {
                setLoading(true);
                const response = await courseService.getTopRatedCourses({ page: 1, size: 15 });

                // Map the API response to match our component's interface
                const mappedCourses = response.courses.map((course: any) => ({
                    _id: course._id,
                    courseName: course.courseName || course.title,
                    courseCategory: course.courseCategory || course.category,
                    instructorName: course.instructorName || `${course.instructor?.firstName || ''} ${course.instructor?.lastName || ''}`.trim(),
                    description: course.description,
                    rating: course.rating || 0,
                    skills: course.skills || [],
                    tools: course.tools || [],
                    startingDate: course.startingDate || course.createdAt,
                    duration: course.duration || '8 weeks',
                    price: course.price || 0,
                    courseFlyerURL: course.courseFlyerURL || course.thumbnail || '/placeholder-course.jpg',
                    numberOfUserEnrolled: course.numberOfUserEnrolled || course.enrollmentCount || 0,
                }));

                setCourses(mappedCourses);
            } catch (error) {
                console.error('Failed to fetch top rated courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopRated();
    }, []);

    const formatEnrollment = (count: number): string => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(0)}K`;
        }
        return count.toString();
    };

    return (
        <section className={`${styles.recommendedSection} py-8 sm:py-10 lg:py-12`}>
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-14 lg:mb-16">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-3">
                            <Award className={`${styles.gradientText} w-8 h-8 sm:w-9 sm:h-9`} />
                            <h2 className={`${styles.recommendedHeading} text-3xl sm:text-4xl lg:text-5xl font-black leading-tight`}>
                                Students&apos; <span className={styles.gradientText}>Choice</span>
                            </h2>
                        </div>
                        <p className={`${styles.recommendedSubheading} text-base sm:text-lg`}>
                            Top-rated courses loved by students worldwide
                        </p>
                    </div>

                    <button
                        onClick={() => router.push('/courses')}
                        className={`${styles.viewAllButton} px-6 py-3 rounded-xl font-semibold text-base flex items-center gap-2 transition-all duration-300 hover:gap-3 w-fit`}
                    >
                        View All Popular
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                    {loading ? (
                        // Loading skeletons
                        Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className={`${styles.courseCard} rounded-2xl overflow-hidden animate-pulse`}>
                                <div className="w-full h-44 sm:h-48 lg:h-52 bg-gray-200 dark:bg-gray-700"></div>
                                <div className="p-4 sm:p-5 space-y-3">
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                </div>
                            </div>
                        ))
                    ) : courses.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">No top-rated courses available at this time.</p>
                        </div>
                    ) : (
                        courses.slice(0, 4).map((course) => (
                        <div
                            key={course._id}
                            onClick={() => router.push(`/courses/${course._id}`)}
                            className={`${styles.courseCard} group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer`}
                        >
                            {/* Course Image */}
                            <div className="relative w-full h-44 sm:h-48 lg:h-52 overflow-hidden">
                                <div className={`${styles.imageOverlay} absolute inset-0 z-10`}></div>
                                <Image
                                    src={course.courseFlyerURL}
                                    alt={course.courseName}
                                    fill
                                        className="object-fill group-hover:scale-110 transition-transform duration-500"
                                />

                                {/* Category Badge */}
                                <div className={`${styles.categoryBadge} absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold z-20`}>
                                    {course.courseCategory}
                                </div>

                                {/* High Rating Badge - Always show for Students' Choice */}
                                <div className={`${styles.trendingBadge} absolute top-4 right-4 p-2 rounded-lg z-20`}>
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                            </div>

                            {/* Course Content */}
                            <div className={`${styles.courseContent} p-4 sm:p-5`}>
                                {/* Instructor */}
                                <p className={`${styles.instructorName} text-xs font-semibold mb-2 uppercase tracking-wider`}>
                                    {course.instructorName}
                                </p>

                                {/* Course Name */}
                                <h3 className={`${styles.courseName} text-base sm:text-lg font-bold mb-3 line-clamp-2 leading-tight min-h-12 sm:min-h-14`}>
                                    {course.courseName}
                                </h3>

                                {/* Duration */}
                                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                    <Clock className={`${styles.clockIcon} w-4 h-4`} />
                                    <span className={`${styles.duration} text-xs sm:text-sm font-medium`}>
                                        {course.duration}
                                    </span>
                                </div>

                                {/* Divider */}
                                <div className={`${styles.divider} h-px w-full mb-3 sm:mb-4`}></div>

                                {/* Bottom Section */}
                                <div className="flex items-center justify-between">
                                    {/* Rating */}
                                    <div className="flex items-center gap-1 sm:gap-1.5">
                                        <Star className={`${styles.starIcon} w-4 h-4 sm:w-5 sm:h-5 fill-current`} />
                                        <span className={`${styles.ratingText} text-sm sm:text-base font-bold`}>
                                            {course.rating.toFixed(1)}
                                        </span>
                                    </div>

                                    {/* Enrollment Count */}
                                    {course.numberOfUserEnrolled && course.numberOfUserEnrolled > 0 && (
                                        <div className="flex items-center gap-1 sm:gap-1.5">
                                            <span className={`${styles.enrollmentText} text-xs sm:text-sm font-semibold`}>
                                                {formatEnrollment(course.numberOfUserEnrolled)} students
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}