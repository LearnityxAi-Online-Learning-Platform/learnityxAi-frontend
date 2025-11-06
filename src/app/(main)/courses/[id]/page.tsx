"use client"

import { use } from "react";
import SingleCoursePage from "@/components/CourseCommponents/SingleCoursePage";

export default function SingleCourse({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    return (
        <SingleCoursePage courseId={id} />
    )
}