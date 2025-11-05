// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const { pathname } = request.nextUrl;

  // Define protected routes
  const studentProtectedRoutes = ['/my-courses', '/my-ratings', '/profile'];
  const instructorProtectedRoutes = ['/dashboard', '/create-course', '/instructor-courses', '/instructor-profile'];
  const authRoutes = ['/login', '/role', '/user-register', '/instructor-register'];

  const isStudentRoute = studentProtectedRoutes.some(route => pathname.startsWith(route));
  const isInstructorRoute = instructorProtectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isProtectedRoute = isStudentRoute || isInstructorRoute;

  // Check if user is authenticated
  const isAuthenticated = !!(accessToken || refreshToken);

  // Redirect to login if trying to access protected routes without authentication
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if logged in user tries to access auth routes
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Student protected routes
    '/my-courses/:path*',
    '/my-ratings/:path*',
    '/profile/:path*',
    // Instructor protected routes
    '/dashboard/:path*',
    '/create-course/:path*',
    '/instructor-courses/:path*',
    '/instructor-profile/:path*',
    // Auth routes
    '/login',
    '/role',
    '/user-register',
    '/instructor-register',
  ],
};
