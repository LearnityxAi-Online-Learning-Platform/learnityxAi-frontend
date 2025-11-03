// src/app/(instructor)/layout.tsx
"use client";

import InstructorLayout from "@/components/Layouts/InstructorLayout/InstructorLayout";

export default function InstructorLayoutComponents({ children }: { children: React.ReactNode }) {
    return (
        <InstructorLayout>
            {children}
        </InstructorLayout>
    );
}