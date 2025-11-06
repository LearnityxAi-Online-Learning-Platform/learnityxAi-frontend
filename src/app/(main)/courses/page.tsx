"use client"

import { Suspense } from "react";
import AllCoursesPage from "@/components/CourseCommponents/AllCoursesPage";

function AllCoursesContent() {
    return <AllCoursesPage />;
}

export default function AllCourses() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Loading courses...</p>
                    </div>
                </div>
            }
        >
            <AllCoursesContent />
        </Suspense>
    );
}