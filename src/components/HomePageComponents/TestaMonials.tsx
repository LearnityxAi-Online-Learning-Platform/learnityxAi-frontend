'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Quote, Star } from 'lucide-react';
import { useCourse } from '@/hooks/useCourseHook';
import styles from './HomePageComponents.module.scss';

export default function Testimonials(): React.JSX.Element {
    const router = useRouter();
    const {
        systemReviews,
        systemReviewsLoading,
        systemReviewsError,
        getSystemReviews
    } = useCourse();

    // Fetch system reviews on mount
    useEffect(() => {
        getSystemReviews({ page: 1, size: 6 });
    }, [getSystemReviews]);

    // Show loading state
    if (systemReviewsLoading) {
        return (
            <section className={`${styles.testimonialsSection} py-8 sm:py-10 lg:py-12`}>
                <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 sm:mb-14 lg:mb-16">
                        <h2 className={`${styles.testimonialsHeading} text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight tracking-tight`}>
                            What subscribers are <span className={styles.gradientText}>achieving</span> through learning
                        </h2>
                        <p className={`${styles.testimonialsSubheading} text-base sm:text-lg max-w-3xl`}>
                            Real stories from learners who transformed their careers with our platform
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className={`${styles.testimonialCard} p-6 sm:p-7 lg:p-8 rounded-2xl animate-pulse`}>
                                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-10 mb-5"></div>
                                <div className="space-y-3 mb-6">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                                </div>
                                <div className="flex items-center gap-4 pt-5 border-t border-gray-200 dark:border-gray-700">
                                    <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Show error or empty state
    if (systemReviewsError || !systemReviews || systemReviews.length === 0) {
        return (
            <section className={`${styles.testimonialsSection} py-8 sm:py-10 lg:py-12`}>
                <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 sm:mb-14 lg:mb-16">
                        <h2 className={`${styles.testimonialsHeading} text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight tracking-tight`}>
                            What subscribers are <span className={styles.gradientText}>achieving</span> through learning
                        </h2>
                        <p className={`${styles.testimonialsSubheading} text-base sm:text-lg max-w-3xl`}>
                            Real stories from learners who transformed their careers with our platform
                        </p>
                    </div>
                    <div className="text-center py-12">
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            No reviews available at the moment.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={`${styles.testimonialsSection} py-8 sm:py-10 lg:py-12`}>
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="mb-12 sm:mb-14 lg:mb-16">
                    <h2 className={`${styles.testimonialsHeading} text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight tracking-tight`}>
                        What subscribers are <span className={styles.gradientText}>achieving</span> through learning
                    </h2>
                    <p className={`${styles.testimonialsSubheading} text-base sm:text-lg max-w-3xl`}>
                        Real stories from learners who transformed their careers with our platform
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
                    {systemReviews.slice(0, 6).map((review) => (
                        <div
                            key={review._id}
                            className={`${styles.testimonialCard} p-6 sm:p-7 lg:p-8 rounded-2xl transition-all duration-300 hover:scale-[1.02] flex flex-col h-full`}
                        >
                            {/* Quote Icon */}
                            <div className={`${styles.quoteIcon} mb-5 shrink-0`}>
                                <Quote className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />
                            </div>

                            {/* Rating Stars */}
                            <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, index) => (
                                    <Star
                                        key={index}
                                        className={`w-4 h-4 ${
                                            index < review.rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300 dark:text-gray-600'
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Testimonial Text - Fixed height with ellipsis */}
                            <p className={`${styles.testimonialText} text-sm sm:text-base leading-relaxed mb-6 grow line-clamp-4`}>
                                {review.comment}
                            </p>

                            {/* Profile Section - Always at bottom */}
                            <div className="flex items-center gap-4 pt-5 border-t border-gray-200 dark:border-gray-700 shrink-0 mt-auto">
                                {/* Avatar */}
                                <div className={`${styles.avatar} relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0`}>
                                    <Image
                                        src={review.userId.profileImage || '/placeholder-avatar.jpg'}
                                        alt={`${review.userId.firstName} ${review.userId.lastName}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Name and Course */}
                                <div className="flex-1 min-w-0">
                                    <h4 className={`${styles.testimonialName} text-base sm:text-lg font-bold truncate`}>
                                        {review.userId.firstName} {review.userId.lastName}
                                    </h4>
                                    <p className={`${styles.testimonialRole} text-xs sm:text-sm mt-0.5 truncate`}>
                                        {review.courseId.courseName}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 sm:mt-14 lg:mt-16 text-center">
                    <p className={`${styles.ctaText} text-base sm:text-lg font-semibold mb-5`}>
                        Join thousands of learners transforming their careers
                    </p>
                    <button
                        onClick={() => router.push('/role')}
                        className={`${styles.ctaButton} px-8 py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                    >
                        Start Your Journey
                    </button>
                </div>
            </div>
        </section>
    );
}