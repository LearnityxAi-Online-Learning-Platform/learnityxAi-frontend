// src/app/(auth)/layout.tsx
"use client";

import AuthLayout from "@/components/Layouts/AuthLayout";

export default function AuthLayoutMainLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthLayout>
            {children}
        </AuthLayout>
    );
}