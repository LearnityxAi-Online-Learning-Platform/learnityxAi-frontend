// src/app/(userProtected)/layout.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedPagesLayout from "@/components/Layouts/ProtectedLayout";
import { useAppSelector } from '@/hooks/useReduxHooks';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, loading } = useAppSelector(state => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (user && user.role !== 'student') {
                router.push('/dashboard');
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

    // Don't render if not authenticated or not student
    if (!isAuthenticated || !user || user.role !== 'student') {
        return null;
    }

    return (
        <ProtectedPagesLayout>
            {children}
        </ProtectedPagesLayout>
    );
}