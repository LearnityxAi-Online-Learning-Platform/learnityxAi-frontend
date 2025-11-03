'use client';

import React from 'react';
import { Target, Award, Star } from 'lucide-react';
import styles from './HomePageComponents.module.scss';

export default function Guidance(): React.JSX.Element {
    const features = [
        {
            icon: Target,
            title: 'Explore new skills',
            description: 'Access 10,000+ courses in AI, business, technology, and more.',
        },
        {
            icon: Award,
            title: 'Earn valuable credentials',
            description: 'Get certificates for every course you finish and boost your chances of getting hired after your trial ends at no additional cost.',
        },
        {
            icon: Star,
            title: 'Learn from the best',
            description: 'Take your skills to the next level with expert-led courses and Coursera Coach, your AI-powered guide.',
        },
    ];

    return (
        <section className={`${styles.guidanceSection} py-6 sm:py-8 lg:py-10`}>
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Heading */}
                <h2 className={`${styles.guidanceHeading} text-2xl sm:text-3xl lg:text-4xl font-bold mb-10 sm:mb-12 lg:mb-14`}>
                    Invest in your career
                </h2>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`${styles.featureCard} p-6 sm:p-7 rounded-xl transition-all duration-300`}
                        >
                            {/* Icon */}
                            <div className={`${styles.iconContainer} w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl mb-5 transition-all duration-300`}>
                                <feature.icon
                                    className={`${styles.icon} w-7 h-7 sm:w-8 sm:h-8`}
                                    strokeWidth={2}
                                />
                            </div>

                            {/* Title */}
                            <h3 className={`${styles.featureTitle} text-lg sm:text-xl font-bold mb-3 leading-tight`}>
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className={`${styles.featureDescription} text-sm sm:text-base leading-relaxed`}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}