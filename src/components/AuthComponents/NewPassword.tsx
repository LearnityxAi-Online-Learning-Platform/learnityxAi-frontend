'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, Eye, EyeOff, Check, X } from 'lucide-react';
import Toast from '@/components/ui/Toast';
import styles from './AuthComponents.module.scss';

interface FormData {
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    password?: string;
    confirmPassword?: string;
    backend?: string;
}

interface PasswordStrength {
    score: number;
    label: string;
    color: string;
}

function NewPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const otp = searchParams.get('otp') || '';

    const [formData, setFormData] = useState<FormData>({
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (!email || !otp) {
            router.push('/forgot-password');
        }
    }, [email, otp, router]);

    const calculatePasswordStrength = (password: string): PasswordStrength => {
        let score = 0;

        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
        if (score <= 4) return { score, label: 'Medium', color: 'bg-yellow-500' };
        return { score, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = calculatePasswordStrength(formData.password);

    const passwordRequirements = [
        { label: 'At least 8 characters', met: formData.password.length >= 8 },
        { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
        { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
        { label: 'Contains number', met: /[0-9]/.test(formData.password) },
        { label: 'Contains special character', met: /[^a-zA-Z0-9]/.test(formData.password) }
    ];

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/[a-z]/.test(formData.password)) {
            newErrors.password = 'Password must contain a lowercase letter';
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = 'Password must contain an uppercase letter';
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = 'Password must contain a number';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
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
                email,
                otp,
                password: formData.password
            };
            console.log('Resetting password:', payload);

            // Simulate API response
            setTimeout(() => {
                const isSuccess = Math.random() > 0.2;

                if (isSuccess) {
                    setIsLoading(false);
                    setShowToast(true);
                    // Redirect to login after showing toast
                    setTimeout(() => {
                        router.push('/login');
                    }, 2000);
                } else {
                    setIsLoading(false);
                    setErrors({
                        backend: 'Failed to reset password. Please try again.'
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
        <>
            <div className="min-h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] flex items-center justify-center p-2 sm:p-3">
                <div className="w-full max-w-md h-full flex items-center py-2">
                    <div className={`${styles.authCard} rounded-lg sm:rounded-xl shadow-xl p-4 sm:p-5 md:p-6 w-full`}>
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
                            <h1 className="text-lg sm:text-xl font-bold mb-1.5">
                                Create New Password
                            </h1>
                            <p className={`${styles.authSubtitle} text-xs`}>
                                Your new password must be different from previously used passwords
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

                            {/* Password Field */}
                            <div className="space-y-1">
                                <label htmlFor="password" className={`${styles.formLabel} block text-xs font-semibold`}>
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className={`${styles.inputIcon} absolute left-2.5 top-1/2 -translate-y-1/2`} size={16} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className={`${styles.formInput} ${errors.password ? styles.inputError : ''} w-full pl-9 pr-10 py-2 rounded-lg text-xs border-2 transition-all duration-200`}
                                        placeholder="Create a new password"
                                        disabled={isLoading}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`${styles.passwordToggle} absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all duration-200`}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <span className={`${styles.fieldError} text-xs font-medium block`}>{errors.password}</span>
                                )}

                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="space-y-2 mt-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium">Password Strength:</span>
                                            <span className={`text-xs font-semibold ${
                                                passwordStrength.label === 'Weak' ? 'text-red-600' :
                                                passwordStrength.label === 'Medium' ? 'text-yellow-600' :
                                                'text-green-600'
                                            }`}>
                                                {passwordStrength.label}
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                                style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Password Requirements */}
                                {formData.password && (
                                    <div className="space-y-1 mt-2">
                                        {passwordRequirements.map((req, index) => (
                                            <div key={index} className="flex items-center gap-1.5">
                                                {req.met ? (
                                                    <Check size={12} className="text-green-600 flex-shrink-0" />
                                                ) : (
                                                    <X size={12} className="text-red-600 flex-shrink-0" />
                                                )}
                                                <span className={`text-xs ${req.met ? 'text-green-600' : 'text-red-600'}`}>
                                                    {req.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-1">
                                <label htmlFor="confirmPassword" className={`${styles.formLabel} block text-xs font-semibold`}>
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className={`${styles.inputIcon} absolute left-2.5 top-1/2 -translate-y-1/2`} size={16} />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        className={`${styles.formInput} ${errors.confirmPassword ? styles.inputError : ''} w-full pl-9 pr-10 py-2 rounded-lg text-xs border-2 transition-all duration-200`}
                                        placeholder="Confirm your new password"
                                        disabled={isLoading}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className={`${styles.passwordToggle} absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all duration-200`}
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <span className={`${styles.fieldError} text-xs font-medium block`}>{errors.confirmPassword}</span>
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
                                        Resetting Password...
                                    </>
                                ) : (
                                    'Reset Password'
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

            {/* Toast Notification */}
            <Toast
                isVisible={showToast}
                onClose={() => setShowToast(false)}
                title="Password Reset Successful!"
                message="Your password has been changed successfully. Redirecting to login..."
                variant="success"
                duration={3000}
                position="top-right"
            />
        </>
    );
}

export default function NewPassword() {
    return (
        <Suspense fallback={
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
                <div className="text-sm">Loading...</div>
            </div>
        }>
            <NewPasswordContent />
        </Suspense>
    );
}
