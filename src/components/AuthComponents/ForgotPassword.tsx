'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft } from 'lucide-react';
import styles from './AuthComponents.module.scss';

interface FormErrors {
    email?: string;
    backend?: string;
}

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (value: string) => {
        setEmail(value);
        if (errors.email) {
            setErrors({ ...errors, email: undefined });
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
            console.log('Sending OTP to:', email);

            // Simulate API response
            setTimeout(() => {
                const isSuccess = Math.random() > 0.2;

                if (isSuccess) {
                    setIsLoading(false);
                    // Navigate to OTP page with email as query parameter
                    router.push(`/otp?email=${encodeURIComponent(email)}`);
                } else {
                    setIsLoading(false);
                    setErrors({
                        backend: 'Email not found. Please check and try again.'
                    });
                }
            }, 1500);

        } catch {
            setIsLoading(false);
            setErrors({
                backend: 'An error occurred. Please try again later.'
            });
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] flex items-center justify-center p-2 sm:p-3">
            <div className="w-full max-w-md h-full flex items-center py-2">
                <div className={`${styles.authCard} rounded-lg sm:rounded-xl shadow-xl p-4 sm:p-5 md:p-6 w-full`}>
                    {/* Back to Login Link */}
                    <Link href="/login" className={`${styles.authLink} inline-flex items-center gap-1.5 text-xs font-semibold mb-4 transition-colors duration-200 hover:underline`}>
                        <ArrowLeft size={14} />
                        Back to Login
                    </Link>

                    {/* Logo */}
                    <div className="flex justify-center mb-3">
                        <Image
                            src="/logo/logo.png"
                            alt="Learnityx Logo"
                            width={120}
                            height={120}
                            className="w-28 h-28 sm:w-30 sm:h-30 object-contain"
                            priority
                        />
                    </div>

                    {/* Header */}
                    <div className="mb-4">
                        <h1 className="text-lg sm:text-xl font-bold mb-1">
                            Forgot Password?
                        </h1>
                        <p className={`${styles.authSubtitle} text-xs`}>
                            Enter your email address and we&apos;ll send you a verification code
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Backend Error Message */}
                        {errors.backend && (
                            <div className={`${styles.backendError} p-2.5 rounded-lg text-xs font-medium`}>
                                {errors.backend}
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-1">
                            <label htmlFor="email" className={`${styles.formLabel} block text-xs font-semibold`}>
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className={`${styles.inputIcon} absolute left-2.5 top-1/2 -translate-y-1/2`} size={16} />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    className={`${styles.formInput} ${errors.email ? styles.inputError : ''} w-full pl-9 pr-2.5 py-2 rounded-lg text-xs border-2 transition-all duration-200`}
                                    placeholder="Enter your email"
                                    disabled={isLoading}
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && (
                                <span className={`${styles.fieldError} text-xs font-medium block`}>{errors.email}</span>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`${styles.authButton} w-full py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {isLoading ? (
                                <>
                                    <span className={`${styles.spinner} w-3.5 h-3.5 border-2 rounded-full animate-spin`}></span>
                                    Sending Code...
                                </>
                            ) : (
                                'Send Verification Code'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className={`${styles.authFooter} flex items-center justify-center gap-2 mt-4 pt-4 border-t`}>
                        <p className="text-xs m-0">Remember your password?</p>
                        <Link href="/login" className={`${styles.authLink} text-xs font-semibold transition-colors duration-200 hover:underline`}>
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
