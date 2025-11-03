// src/app/(main)/layout.tsx
"use client";

import HomePageLayout from "@/components/Layouts/MainLayout";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
            <HomePageLayout>
                {children}
            </HomePageLayout>
    );
}