'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import styles from './AuthComponents.module.scss';

interface LoginFormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
    backend?: string;
}

export default function Login() {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof LoginFormData, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: undefined });
        }
        if (errors.backend) {
            setErrors({ ...errors, backend: undefined });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const payload = {
                email: formData.email,
                password: formData.password
            };
            console.log('Login payload:', payload);

            // Simulate API response
            setTimeout(() => {
                const isSuccess = Math.random() > 0.3;

                if (isSuccess) {
                    setIsLoading(false);
                    console.log('Login successful');
                } else {
                    setIsLoading(false);
                    setErrors({
                        backend: 'Invalid email or password. Please try again.'
                    });
                }
            }, 1500);

        } catch (error) {
            setIsLoading(false);
            setErrors({
                backend: 'An error occurred. Please try again later.'
            });
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-3 sm:p-4">
            <div className="w-full max-w-md">
                <div className={`${styles.authCard} rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 md:p-8`}>
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-7">
                        <h1 className="text-xl sm:text-2xl font-bold mb-2">
                            Welcome to <span className={styles.brandName}>Learnityx<span className={styles.brandAi}>Ai</span></span>
                        </h1>
                        <p className={`${styles.authSubtitle} text-xs sm:text-sm`}>
                            Log in to continue your learning journey
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Backend Error Message */}
                        {errors.backend && (
                            <div className={`${styles.backendError} p-2.5 sm:p-3 rounded-lg text-xs sm:text-sm font-medium`}>
                                {errors.backend}
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label htmlFor="email" className={`${styles.formLabel} block text-xs sm:text-sm font-semibold`}>
                                Email
                            </label>
                            <div className="relative">
                                <Mail className={`${styles.inputIcon} absolute left-3 top-1/2 -translate-y-1/2`} size={18} />
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`${styles.formInput} ${errors.email ? styles.inputError : ''} w-full pl-10 pr-3 py-2.5 rounded-lg text-sm border-2 transition-all duration-200`}
                                    placeholder="Enter your email"
                                    disabled={isLoading}
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && (
                                <span className={`${styles.fieldError} text-xs font-medium block mt-1`}>{errors.email}</span>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5">
                            <label htmlFor="password" className={`${styles.formLabel} block text-xs sm:text-sm font-semibold`}>
                                Password
                            </label>
                            <div className="relative">
                                <Lock className={`${styles.inputIcon} absolute left-3 top-1/2 -translate-y-1/2`} size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={`${styles.formInput} ${errors.password ? styles.inputError : ''} w-full pl-10 pr-11 py-2.5 rounded-lg text-sm border-2 transition-all duration-200`}
                                    placeholder="Enter your password"
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`${styles.passwordToggle} absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all duration-200`}
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <span className={`${styles.fieldError} text-xs font-medium block mt-1`}>{errors.password}</span>
                            )}
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <Link href="/forgot-password" className={`${styles.forgotLink} text-xs sm:text-sm font-semibold transition-colors duration-200 hover:underline`}>
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`${styles.authButton} w-full py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {isLoading ? (
                                <>
                                    <span className={`${styles.spinner} w-4 h-4 border-2 rounded-full animate-spin`}></span>
                                    Logging in...
                                </>
                            ) : (
                                'Log in'
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className={`${styles.authFooter} flex items-center justify-center gap-2 mt-6 pt-5 border-t`}>
                        <p className="text-xs sm:text-sm m-0">Don&apos;t have an account?</p>
                        <Link href="/role" className={`${styles.authLink} text-xs sm:text-sm font-semibold transition-colors duration-200 hover:underline`}>
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
