'use client';

import React from 'react';
import Image from 'next/image';
import { Quote } from 'lucide-react';
import styles from './HomePageComponents.module.scss';

interface Testimonial {
    id: string;
    name: string;
    image: string;
    testimonial: string;
}

export default function Testimonials(): React.JSX.Element {
    const testimonials: Testimonial[] = [
        {
            id: "1",
            name: "Abigail P.",
            image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            testimonial: "I have a full-time job and 3 kids. I needed the flexibility offered by LearnittyxAi in order to achieve my goals. My subscription motivated me to keep learning."
        },
        {
            id: "2",
            name: "Shi Jie F.",
            image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            testimonial: "LearnittyxAi keeps me motivated to learn. With each course, I'm getting more value out of my subscription. I can access almost anything with LearnittyxAi!"
        },
        {
            id: "3",
            name: "Inés K.",
            image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            testimonial: "I really appreciate the flexibility I get with LearnittyxAi. I can try any course and switch to another one for no additional cost. This motivates me to learn even more!"
        }
    ];

    return (
        <section className={`${styles.testimonialsSection} py-16 sm:py-20 lg:py-24`}>
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
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className={`${styles.testimonialCard} p-6 sm:p-7 lg:p-8 rounded-2xl transition-all duration-300 hover:scale-[1.02] flex flex-col h-full`}
                        >
                            {/* Quote Icon */}
                            <div className={`${styles.quoteIcon} mb-5 shrink-0`}>
                                <Quote className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />
                            </div>

                            {/* Testimonial Text - Fixed height with ellipsis */}
                            <p className={`${styles.testimonialText} text-sm sm:text-base leading-relaxed mb-6 grow line-clamp-4`}>
                                {testimonial.testimonial}
                            </p>

                            {/* Profile Section - Always at bottom */}
                            <div className="flex items-center gap-4 pt-5 border-t border-gray-200 dark:border-gray-700 shrink-0 mt-auto">
                                {/* Avatar */}
                                <div className={`${styles.avatar} relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0`}>
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Name */}
                                <div className="flex-1 min-w-0">
                                    <h4 className={`${styles.testimonialName} text-base sm:text-lg font-bold truncate`}>
                                        {testimonial.name}
                                    </h4>
                                    <p className={`${styles.testimonialRole} text-xs sm:text-sm mt-0.5`}>
                                        Verified Learner
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
                    <button className={`${styles.ctaButton} px-8 py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
                        Start Your Journey
                    </button>
                </div>
            </div>
        </section>
    );
}