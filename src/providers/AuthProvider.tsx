// src/providers/AuthProvider.tsx
'use client';

import { useEffect } from 'react';
import { useAppSelector } from '@/hooks/useReduxHooks';
import { getUserProfile } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/hooks/useReduxHooks';
import { useRouter, usePathname } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, accessToken, loading } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // Auto-fetch user profile on mount if token exists but no user
  useEffect(() => {
    const initAuth = async () => {
      if (accessToken && !user && !loading) {
        try {
          await dispatch(getUserProfile()).unwrap();
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
    };
    initAuth();
  }, [accessToken, user, loading, dispatch]);

  // Role-based route protection
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const instructorRoutes = ['/dashboard', '/create-course', '/instructor-courses', '/instructor-profile'];
    const studentRoutes = ['/my-courses', '/my-ratings', '/profile'];

    const isInstructorRoute = instructorRoutes.some(route => pathname.startsWith(route));
    const isStudentRoute = studentRoutes.some(route => pathname.startsWith(route));

    if (user.role === 'student' && isInstructorRoute) {
      router.push('/');
    } else if (user.role === 'instructor' && isStudentRoute) {
      router.push('/dashboard');
    }
  }, [user, pathname, isAuthenticated, router]);

  return <>{children}</>;
}
