'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Clock, TrendingUp, ArrowRight } from 'lucide-react';
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

export default function RecommendedCourses(): React.JSX.Element {
    // Sample courses data - replace with actual API data
    const courses: Course[] = [
        {
            _id: "1",
            courseName: "Python for Everybody",
            courseCategory: "Programming",
            instructorName: "University of Michigan",
            description: "Learn Python programming from scratch",
            rating: 4.8,
            skills: ["Python", "Programming"],
            tools: ["Python"],
            startingDate: "2024-12-01",
            duration: "8 weeks",
            price: 799,
            courseFlyerURL: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            numberOfUserEnrolled: 150000
        },
        {
            _id: "2",
            courseName: "Prompt Engineering",
            courseCategory: "AI & Machine Learning",
            instructorName: "Vanderbilt University",
            description: "Master prompt engineering techniques",
            rating: 4.9,
            skills: ["AI", "Prompt Engineering"],
            tools: ["ChatGPT"],
            startingDate: "2024-12-01",
            duration: "6 weeks",
            price: 899,
            courseFlyerURL: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            numberOfUserEnrolled: 85000
        },
        {
            _id: "3",
            courseName: "IBM Data Science",
            courseCategory: "Data Science",
            instructorName: "IBM",
            description: "Professional certificate in data science",
            rating: 4.7,
            skills: ["Data Science", "Python", "Machine Learning"],
            tools: ["Python", "Jupyter"],
            startingDate: "2024-12-01",
            duration: "10 weeks",
            price: 999,
            courseFlyerURL: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            numberOfUserEnrolled: 200000
        },
        {
            _id: "4",
            courseName: "Complete Web Development",
            courseCategory: "Web Development",
            instructorName: "John Doe",
            description: "Learn full-stack web development",
            rating: 4.6,
            skills: ["HTML", "CSS", "JavaScript", "React"],
            tools: ["React", "Node.js"],
            startingDate: "2024-12-01",
            duration: "12 weeks",
            price: 999,
            courseFlyerURL: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            numberOfUserEnrolled: 120000
        },
        {
            _id: "5",
            courseName: "Machine Learning Specialization",
            courseCategory: "AI & Machine Learning",
            instructorName: "Stanford University",
            description: "Deep dive into machine learning",
            rating: 4.9,
            skills: ["Machine Learning", "Python", "AI"],
            tools: ["Python", "TensorFlow"],
            startingDate: "2024-12-01",
            duration: "11 weeks",
            price: 1299,
            courseFlyerURL: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            numberOfUserEnrolled: 180000
        },
    ];

    const formatEnrollment = (count: number): string => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(0)}K`;
        }
        return count.toString();
    };

    return (
        <section className={`${styles.recommendedSection} py-16 sm:py-20 lg:py-24`}>
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-14 lg:mb-16">
                    <div className="max-w-2xl">
                        <h2 className={`${styles.recommendedHeading} text-3xl sm:text-4xl lg:text-5xl font-black mb-3 leading-tight`}>
                            Recommended <span className={styles.gradientText}>Courses</span>
                        </h2>
                        <p className={`${styles.recommendedSubheading} text-base sm:text-lg`}>
                            Hand-picked courses to accelerate your career growth
                        </p>
                    </div>

                    <button className={`${styles.viewAllButton} px-6 py-3 rounded-xl font-semibold text-base flex items-center gap-2 transition-all duration-300 hover:gap-3 w-fit`}>
                        View All Courses
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                    {courses.slice(0, 4).map((course) => (
                        <div
                            key={course._id}
                            className={`${styles.courseCard} group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer`}
                        >
                            {/* Course Image */}
                            <div className="relative w-full h-44 sm:h-48 lg:h-52 overflow-hidden">
                                <div className={`${styles.imageOverlay} absolute inset-0 z-10`}></div>
                                <Image
                                    src={course.courseFlyerURL}
                                    alt={course.courseName}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />

                                {/* Category Badge */}
                                <div className={`${styles.categoryBadge} absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold z-20`}>
                                    {course.courseCategory}
                                </div>

                                {/* Trending Badge */}
                                {course.rating >= 4.8 && (
                                    <div className={`${styles.trendingBadge} absolute top-4 right-4 p-2 rounded-lg z-20`}>
                                        <TrendingUp className="w-4 h-4" />
                                    </div>
                                )}
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
                    ))}
                </div>
            </div>
        </section>
    );
}