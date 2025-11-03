// src/app/(protected)/layout.tsx
"use client";

import ProtectedPagesLayout from "@/components/Layouts/ProtectedLayout";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedPagesLayout>
            {children}
        </ProtectedPagesLayout>
    );
}