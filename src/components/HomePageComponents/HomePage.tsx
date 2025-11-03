// src/components/HomePageComponents/HomePage.tsx
"use client";

import React from 'react';
import Header from './Header';
import Stats from './Stats';
import FaqSection from './FaqSection';
import RecomendedCourses from './RecomendedCourses';
import StudentsChoiceCourses from './StudentsChoiceCourses';
import TestaMonials from './TestaMonials';
import Guidence from './Guidence';

export default function HomePage() {
    return (
        <div >
            <Header />
            <Stats />
            <Guidence />
            <RecomendedCourses />
            <TestaMonials />
            <StudentsChoiceCourses />
            <FaqSection />
        </div>
    );
}