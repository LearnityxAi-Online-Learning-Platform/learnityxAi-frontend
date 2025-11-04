'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, UserCircle } from 'lucide-react';
import styles from './AuthComponents.module.scss';

export default function RoleSelection() {
    const router = useRouter();

    const handleRoleSelect = (role: 'student' | 'instructor') => {
        if (role === 'student') {
            router.push('/user-register');
        } else {
            router.push('/instructor-register');
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-3 sm:p-4">
            <div className="w-full max-w-4xl">
                <div className={`${styles.authCard} rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 md:p-8`}>
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                            Welcome to <span className={styles.brandName}>Learnityx<span className={styles.brandAi}>Ai</span></span>
                        </h1>
                        <p className={`${styles.authSubtitle} text-xs sm:text-sm`}>
                            Choose your role to get started
                        </p>
                    </div>

                    {/* Role Cards - Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6">
                        {/* Student Role Card */}
                        <button
                            onClick={() => handleRoleSelect('student')}
                            className={`${styles.roleCard} rounded-xl border-2 p-5 sm:p-6 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 relative overflow-hidden`}
                        >
                            <div className={`${styles.roleIcon} w-16 h-16 sm:w-18 sm:h-18 rounded-full mx-auto mb-4 flex items-center justify-center`}>
                                <UserCircle size={36} className="sm:w-10 sm:h-10" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold mb-2">Student</h3>
                            <p className={`${styles.roleDescription} text-xs sm:text-sm mb-4`}>
                                Explore courses, learn new skills, and advance your career
                            </p>
                            <div className="space-y-2">
                                <div className={`${styles.feature} text-xs px-3 py-2 rounded-lg`}>
                                    ✓ Access to all courses
                                </div>
                                <div className={`${styles.feature} text-xs px-3 py-2 rounded-lg`}>
                                    ✓ Track your progress
                                </div>
                                <div className={`${styles.feature} text-xs px-3 py-2 rounded-lg`}>
                                    ✓ Earn certificates
                                </div>
                            </div>
                        </button>

                        {/* Instructor Role Card */}
                        <button
                            onClick={() => handleRoleSelect('instructor')}
                            className={`${styles.roleCard} rounded-xl border-2 p-5 sm:p-6 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 relative overflow-hidden`}
                        >
                            <div className={`${styles.roleIcon} w-16 h-16 sm:w-18 sm:h-18 rounded-full mx-auto mb-4 flex items-center justify-center`}>
                                <GraduationCap size={36} className="sm:w-10 sm:h-10" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold mb-2">Instructor</h3>
                            <p className={`${styles.roleDescription} text-xs sm:text-sm mb-4`}>
                                Share your expertise, create courses, and inspire learners
                            </p>
                            <div className="space-y-2">
                                <div className={`${styles.feature} text-xs px-3 py-2 rounded-lg`}>
                                    ✓ Create courses
                                </div>
                                <div className={`${styles.feature} text-xs px-3 py-2 rounded-lg`}>
                                    ✓ Manage students
                                </div>
                                <div className={`${styles.feature} text-xs px-3 py-2 rounded-lg`}>
                                    ✓ Earn revenue
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Login Link */}
                    <div className={`${styles.authFooter} flex items-center justify-center gap-2 mt-6 pt-5 border-t`}>
                        <p className="text-xs sm:text-sm m-0">Already have an account?</p>
                        <Link href="/login" className={`${styles.authLink} text-xs sm:text-sm font-semibold transition-colors duration-200 hover:underline`}>
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
