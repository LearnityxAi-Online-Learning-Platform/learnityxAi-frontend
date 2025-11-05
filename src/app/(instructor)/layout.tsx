// src/app/(instructor)/layout.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import InstructorLayout from "@/components/Layouts/InstructorLayout/InstructorLayout";
import { useAppSelector } from '@/hooks/useReduxHooks';

export default function InstructorLayoutComponents({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, loading } = useAppSelector(state => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (user && user.role !== 'instructor') {
                router.push('/');
            }
        }
    }, [user, isAuthenticated, loading, router]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render if not authenticated or not instructor
    if (!isAuthenticated || !user || user.role !== 'instructor') {
        return null;
    }

    return (
        <InstructorLayout>
            {children}
        </InstructorLayout>
    );
}