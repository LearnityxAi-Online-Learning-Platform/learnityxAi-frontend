'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import {
    Star,
    Users,
    Clock,
    Calendar,
    Award,
    TrendingUp,
    User,
    CheckCircle,
    Play,
    Download,
    Globe,
    Smartphone,
    Trophy,
    Share2,
    Heart
} from 'lucide-react';
import { useCourse } from '@/hooks/useCourseHook';
import styles from './CourseComponents.module.scss';

interface SingleCoursePageProps {
    courseId: string;
}

export default function SingleCoursePage({ courseId }: SingleCoursePageProps): React.JSX.Element {
    const { selectedCourse, loading, getCourseById } = useCourse();

    // Fetch course data on mount
    useEffect(() => {
        if (courseId) {
            getCourseById(courseId);
        }
    }, [courseId, getCourseById]);

    // Format date helper
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Render star rating
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`w-4 h-4 ${index < rating
                        ? `${styles.starRating} fill-current`
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
            />
        ));
    };

    // Loading state
    if (loading) {
        return (
            <div className={`${styles.coursePageContainer} min-h-screen`}>
                <section className={`${styles.heroSection} py-6 sm:py-8`}>
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                            <div className="lg:col-span-2 space-y-4 animate-pulse">
                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                            <div className="lg:col-span-1">
                                <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    // No course found
    if (!selectedCourse) {
        return (
            <div className={`${styles.coursePageContainer} min-h-screen flex items-center justify-center`}>
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Course not found</h2>
                    <p className="text-gray-600 dark:text-gray-400">The course you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            </div>
        );
    }

    const course = selectedCourse;

    // Extract data with fallbacks
    const courseName = course.courseName || course.title || 'Untitled Course';
    const courseCategory = course.courseCategory || course.category || 'General';
    const instructorName = course.instructorName || (course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Unknown Instructor');
    const description = course.description || 'No description available';
    const rating = course.rating || 0;
    const totalRatings = course.totalRatings || 0;
    const numberOfUserEnrolled = course.numberOfUserEnrolled || course.enrollmentCount || 0;
    const skills = course.skills || [];
    const tools = course.tools || [];
    const startingDate = course.startingDate || course.createdAt || new Date().toISOString();
    const duration = typeof course.duration === 'string' ? course.duration : `${course.duration || 0} weeks`;
    const price = course.price || 0;
    const courseFlyerURL = course.courseFlyerURL || course.thumbnail || '';
    const updatedAt = course.updatedAt || course.createdAt || new Date().toISOString();
    const instructorBio = course.instructorId?.bio || "Professional instructor with years of experience in the field.";

    return (
        <div className={`${styles.coursePageContainer} min-h-screen`}>
            {/* Hero Section */}
            <section className={`${styles.heroSection} py-6 sm:py-8`}>
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Course Title & Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        <div className="lg:col-span-2">
                            {/* Category Badge */}
                            <div className={`${styles.categoryBadge} inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold mb-3`}>
                                <Award className="w-3 h-3 mr-1.5" />
                                {courseCategory}
                            </div>

                            {/* Title */}
                            <h1 className={`${styles.courseTitle} text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight`}>
                                {courseName}
                            </h1>

                            {/* Subtitle */}
                            <p className={`${styles.courseSubtitle} text-sm sm:text-base lg:text-lg mb-4`}>
                                {description}
                            </p>

                            {/* Rating & Stats */}
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4">
                                <div className={`${styles.ratingSection} flex items-center gap-2`}>
                                    <span className={`${styles.ratingNumber} font-bold text-sm sm:text-base`}>
                                        {rating.toFixed(1)}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {renderStars(Math.round(rating))}
                                    </div>
                                    <span className={`${styles.ratingCount} text-xs sm:text-sm`}>
                                        ({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})
                                    </span>
                                </div>

                                <div className={`${styles.studentCount} flex items-center gap-1.5 text-xs sm:text-sm`}>
                                    <Users className="w-4 h-4" />
                                    <span>{numberOfUserEnrolled} students</span>
                                </div>
                            </div>

                            {/* Instructor & Date Info */}
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                                <div className={`${styles.instructorInfo} flex items-center gap-1.5`}>
                                    <span>Created by</span>
                                    <span className="font-semibold">{instructorName}</span>
                                </div>
                                <div className={`${styles.lastUpdated} flex items-center gap-1.5`}>
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>Last updated {formatDate(updatedAt)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Preview Card */}
                        <div className="lg:hidden">
                            <div className={`${styles.mobilePreviewCard} rounded-lg overflow-hidden p-4`}>
                                <div className={`${styles.courseImage} relative w-full aspect-video rounded-lg overflow-hidden mb-4`}>
                                    {courseFlyerURL ? (
                                        <Image
                                            src={courseFlyerURL}
                                            alt={courseName}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                            <Award className="w-16 h-16 text-white opacity-50" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <p className={`${styles.priceAmount} text-3xl font-bold mb-2`}>
                                        ${price}
                                    </p>
                                    <button className={`${styles.enrollButton} w-full py-3 rounded-lg font-semibold text-base`}>
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className={`${styles.contentSection} py-6 sm:py-8 lg:py-12`}>
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Main Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* What You'll Learn */}
                            {(skills.length > 0 || tools.length > 0) && (
                                <div className={`${styles.sectionCard} rounded-lg p-5 sm:p-6 lg:p-8`}>
                                    <h2 className={`${styles.sectionTitle} text-xl sm:text-2xl font-bold mb-4 sm:mb-6`}>
                                        What you&apos;ll learn
                                    </h2>
                                    <div className={`${styles.learningGrid} grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4`}>
                                        {skills.map((skill, index) => (
                                            <div key={`skill-${index}`} className="flex items-start gap-2 sm:gap-3">
                                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm sm:text-base">Master {skill} from scratch</span>
                                            </div>
                                        ))}
                                        {tools.map((tool, index) => (
                                            <div key={`tool-${index}`} className="flex items-start gap-2 sm:gap-3">
                                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm sm:text-base">Work with {tool}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Course Content Stats */}
                            <div className={`${styles.statsContainer} rounded-lg p-5 sm:p-6`}>
                                <h2 className={`${styles.sectionTitle} text-xl sm:text-2xl font-bold mb-4 sm:mb-6`}>
                                    Course content
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className={`${styles.statItem} text-center sm:text-left`}>
                                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 mb-2 mx-auto sm:mx-0" />
                                        <p className="text-xs sm:text-sm"><strong className="block text-base sm:text-lg">{duration}</strong>Duration</p>
                                    </div>
                                    <div className={`${styles.statItem} text-center sm:text-left`}>
                                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mb-2 mx-auto sm:mx-0" />
                                        <p className="text-xs sm:text-sm"><strong className="block text-base sm:text-lg">{formatDate(startingDate)}</strong>Starts</p>
                                    </div>
                                    <div className={`${styles.statItem} text-center sm:text-left`}>
                                        <Users className="w-5 h-5 sm:w-6 sm:h-6 mb-2 mx-auto sm:mx-0" />
                                        <p className="text-xs sm:text-sm"><strong className="block text-base sm:text-lg">{numberOfUserEnrolled}</strong>Students</p>
                                    </div>
                                    <div className={`${styles.statItem} text-center sm:text-left`}>
                                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mb-2 mx-auto sm:mx-0" />
                                        <p className="text-xs sm:text-sm"><strong className="block text-base sm:text-lg">{rating.toFixed(1)}</strong>Rating</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className={`${styles.sectionCard} rounded-lg p-5 sm:p-6 lg:p-8`}>
                                <h2 className={`${styles.sectionTitle} text-xl sm:text-2xl font-bold mb-4 sm:mb-6`}>
                                    Description
                                </h2>
                                <p className={`${styles.sectionText} text-sm sm:text-base leading-relaxed`}>
                                    {description}
                                </p>
                            </div>

                            {/* Skills Section */}
                            {skills.length > 0 && (
                                <div className={`${styles.sectionCard} rounded-lg p-5 sm:p-6 lg:p-8`}>
                                    <h2 className={`${styles.sectionTitle} text-xl sm:text-2xl font-bold mb-4 sm:mb-6`}>
                                        Skills you&apos;ll gain
                                    </h2>
                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                        {skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className={`${styles.skillTag} px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold`}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tools & Technologies */}
                            {tools.length > 0 && (
                                <div className={`${styles.sectionCard} rounded-lg p-5 sm:p-6 lg:p-8`}>
                                    <h2 className={`${styles.sectionTitle} text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2`}>
                                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                                        Tools & Technologies
                                    </h2>
                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                        {tools.map((tool, index) => (
                                            <span
                                                key={index}
                                                className={`${styles.toolTag} px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-semibold`}
                                            >
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Instructor */}
                            <div className={`${styles.instructorCard} rounded-lg p-5 sm:p-6 lg:p-8`}>
                                <h2 className={`${styles.sectionTitle} text-xl sm:text-2xl font-bold mb-6`}>
                                    Instructor
                                </h2>
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                    <div className={`${styles.instructorAvatar} w-28 h-28 sm:w-30 sm:h-30 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0`}>
                                        {(course.instructor?.profileImage || course.instructorId?.profileImage) ? (
                                            <Image
                                                src={course.instructor?.profileImage || course.instructorId?.profileImage || ''}
                                                alt={instructorName}
                                                width={120}
                                                height={120}
                                                className="rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-10 h-10 sm:w-12 sm:h-12" />
                                        )}
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className={`${styles.instructorName} text-lg sm:text-xl font-bold mb-2`}>
                                            {instructorName}
                                        </h3>
                                        <p className={`${styles.instructorBio} text-sm sm:text-base mb-4`}>
                                            {instructorBio}
                                        </p>
                                        <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6">
                                            <div className={`${styles.instructorStat} flex items-center gap-2 text-xs sm:text-sm`}>
                                                <Star className="w-4 h-4" />
                                                <span>{rating.toFixed(1)} Rating</span>
                                            </div>
                                            <div className={`${styles.instructorStat} flex items-center gap-2 text-xs sm:text-sm`}>
                                                <Users className="w-4 h-4" />
                                                <span>{numberOfUserEnrolled} Students</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-4 hidden lg:block">
                                <div className={`${styles.sidebarCard} rounded-lg overflow-hidden`}>
                                    {/* Course Image */}
                                    <div className={`${styles.courseImage} relative w-full aspect-video`}>
                                        {courseFlyerURL ? (
                                            <Image
                                                src={courseFlyerURL}
                                                alt={courseName}
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                <Award className="w-20 h-20 text-white opacity-50" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                                            <button className="bg-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform">
                                                <Play className="w-8 h-8 text-gray-900" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price Section */}
                                    <div className="p-6">
                                        <div className={`${styles.priceSection} pb-6 mb-6`}>
                                            <div className="flex items-end gap-3 mb-2">
                                                <span className={`${styles.priceAmount} text-3xl font-bold`}>
                                                    ${price}
                                                </span>
                                                <span className={`${styles.priceOriginal} text-lg line-through mb-1`}>
                                                    ${(price * 1.5).toFixed(2)}
                                                </span>
                                            </div>
                                            <span className={`${styles.priceDiscount} inline-block px-2 py-1 rounded text-xs font-semibold`}>
                                                40% OFF
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <button className={`${styles.enrollButton} w-full py-3.5 rounded-lg font-bold text-base`}>
                                                Enroll Now
                                            </button>
                                            <button className={`${styles.secondaryButton} w-full py-3.5 rounded-lg font-semibold text-base`}>
                                                Add to Cart
                                            </button>
                                        </div>

                                        {/* Course Includes */}
                                        <div className={`${styles.includesSection} mt-6 pt-6`}>
                                            <h3 className={`${styles.sectionTitle} text-sm font-bold mb-4`}>
                                                This course includes:
                                            </h3>
                                            <div className="space-y-3">
                                                <div className={`${styles.includeItem} flex items-center gap-3 text-sm`}>
                                                    <Clock className="w-4 h-4 flex-shrink-0" />
                                                    <span>{duration} on-demand content</span>
                                                </div>
                                                <div className={`${styles.includeItem} flex items-center gap-3 text-sm`}>
                                                    <Download className="w-4 h-4 flex-shrink-0" />
                                                    <span>Downloadable resources</span>
                                                </div>
                                                <div className={`${styles.includeItem} flex items-center gap-3 text-sm`}>
                                                    <Smartphone className="w-4 h-4 flex-shrink-0" />
                                                    <span>Access on mobile and desktop</span>
                                                </div>
                                                <div className={`${styles.includeItem} flex items-center gap-3 text-sm`}>
                                                    <Trophy className="w-4 h-4 flex-shrink-0" />
                                                    <span>Certificate of completion</span>
                                                </div>
                                                <div className={`${styles.includeItem} flex items-center gap-3 text-sm`}>
                                                    <Globe className="w-4 h-4 flex-shrink-0" />
                                                    <span>Full lifetime access</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Share buttons */}
                                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center justify-center gap-4">
                                                <button className={`${styles.shareButton} p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors`}>
                                                    <Share2 className="w-5 h-5" />
                                                </button>
                                                <button className={`${styles.shareButton} p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors`}>
                                                    <Heart className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
