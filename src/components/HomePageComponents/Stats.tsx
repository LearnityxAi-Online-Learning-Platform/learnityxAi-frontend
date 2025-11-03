'use client';

import React from 'react';
import Image from 'next/image';
import styles from './HomePageComponents.module.scss';

export default function Stats(): React.JSX.Element {
    // Sample brand logos - replace with actual logos later
    const brands = [
        { name: 'Illinois', logo: '/stats/1.png' },
        { name: 'Duke University', logo: '/stats/2.png' },
        { name: 'Google', logo: '/stats/3.png' },
        { name: 'University of Michigan', logo: '/stats/4.png' },
        { name: 'IBM', logo: '/stats/5.png' },
        { name: 'Vanderbilt University', logo: '/stats/6.png' },
        { name: 'Johns Hopkins University', logo: '/stats/7.png' },
    ];

    return (
        <section className={`${styles.statsSection} py-8 sm:py-10 lg:py-12`}>
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Heading */}
                <h2 className={`${styles.statsHeading} text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-10 lg:mb-12`}>
                    Learn from 350+ top universities and companies
                </h2>

                {/* Logos Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-5 lg:gap-4 xl:gap-5 items-center justify-items-center">
                    {brands.map((brand, index) => (
                        <div
                            key={index}
                            className={`${styles.brandLogoCard} flex items-center justify-center w-full h-24 sm:h-28 lg:h-24 xl:h-28 px-5 py-4 sm:px-6 sm:py-5 lg:px-5 lg:py-4 rounded-lg transition-all duration-300 hover:scale-105`}
                        >
                            <Image
                                src={brand.logo}
                                alt={brand.name}
                                width={200}
                                height={100}
                                className={`${styles.brandLogoImage} max-w-full max-h-full object-contain transition-all duration-300`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}