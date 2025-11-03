'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HomePageComponents.module.scss';

export default function Header(): React.JSX.Element {
    return (
        <header className={`${styles.header} relative overflow-hidden`}>
            {/* Gradient Overlay */}
            <div className={`${styles.gradientOverlay} absolute inset-0 pointer-events-none`}></div>

            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center py-12 sm:py-16 lg:py-20 xl:py-24">

                    {/* Left Content Section */}
                    <div className="flex flex-col space-y-5 sm:space-y-6 lg:space-y-8 order-2 lg:order-1">

                        {/* Main Heading */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black leading-[1.1] tracking-tight">
                            <span className={styles.headingText}>
                                Achieve your career goals with{' '}
                            </span>
                            <span className={styles.gradientText}>
                                LearnittyxAi
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className={`${styles.subtitle} text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl`}>
                            Subscribe to build job-ready skills from world-class institutions.
                        </p>

                        {/* Pricing Info */}
                        <p className={`${styles.pricing} text-lg sm:text-xl font-semibold`}>
                            $24/month, cancel anytime
                        </p>

                        {/* CTA Button */}
                        <div className="flex flex-col sm:flex-row gap-4 items-start pt-2">
                            <Link
                                href="/signup"
                                className={`${styles.ctaButton} inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 w-full sm:w-auto min-h-[3.5rem] sm:min-h-[3.75rem]`}
                            >
                                Start 7-day Free Trial
                            </Link>
                        </div>

                        {/* Guarantee Text */}
                        <p className={`${styles.guarantee} text-sm sm:text-base`}>
                            or{' '}
                            <span className={`${styles.guaranteeHighlight} font-semibold cursor-pointer hover:underline transition-all duration-200`}>
                                $160/year with 14-day money-back guarantee
                            </span>
                        </p>
                    </div>

                    {/* Right Image Section */}
                    <div className="relative order-1 lg:order-2 flex items-center justify-center lg:justify-end">
                        <div className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[550px] aspect-square mx-auto lg:mx-0">

                            {/* Background Geometric Shape */}
                            <div className={`${styles.geometricShape} absolute inset-0 -z-10`}>
                                <div className={`${styles.shapeInner} absolute inset-0`}></div>
                            </div>

                            {/* Hero Image */}
                            <div className="relative z-10 w-full h-full flex items-center justify-center">
                                <Image
                                    src="/landing/header.png"
                                    alt="Student achieving goals"
                                    width={600}
                                    height={600}
                                    priority
                                    className="w-full h-auto object-contain drop-shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}