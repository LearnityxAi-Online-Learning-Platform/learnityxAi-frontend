'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import Toast from '@/components/ui/Toast';
import styles from './AuthComponents.module.scss';

interface RegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    backend?: string;
}

export default function InstructorRegister() {
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^0\d{9}$/;
        return phoneRegex.test(phone);
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Phone number must be 10 digits starting with 0';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof RegisterFormData, value: string) => {
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
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email,
                password: formData.password,
                role: 'instructor',
                phone: formData.phone
            };
            console.log('Registration payload:', payload);

            // Simulate API response
            setTimeout(() => {
                const isSuccess = Math.random() > 0.3;

                if (isSuccess) {
                    setIsLoading(false);
                    setShowToast(true);
                    console.log('Registration successful');
                    // Reset form
                    setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                        password: '',
                        confirmPassword: ''
                    });
                } else {
                    setIsLoading(false);
                    setErrors({
                        backend: 'Email already exists. Please use a different email or log in.'
                    });
                }
            }, 1500);

        } catch {
            setIsLoading(false);
            setErrors({
                backend: 'An error occurred during registration. Please try again later.'
            });
        }
    };

    return (
        <>
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-3 sm:p-4">
                <div className="w-full max-w-6xl">
                    <div className={`${styles.authCard} rounded-xl sm:rounded-2xl shadow-xl overflow-hidden`}>
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left Brand Section */}
                            <div className="hidden lg:flex flex-col justify-center p-8 lg:p-10 xl:p-12 bg-linear-to-br from-indigo-600 to-purple-700">
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-3xl xl:text-4xl font-bold text-white mb-2">
                                            Learnityx<span className="text-indigo-200">Ai</span>
                                        </h2>
                                        <p className="text-indigo-100 text-lg">
                                            Share your expertise and inspire learners worldwide
                                        </p>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                                                <span className="text-white text-sm">✓</span>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold mb-1">Create Courses</h3>
                                                <p className="text-indigo-100 text-sm">Design and publish your own courses with ease</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                                                <span className="text-white text-sm">✓</span>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold mb-1">Manage Students</h3>
                                                <p className="text-indigo-100 text-sm">Track student progress and provide feedback</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                                                <span className="text-white text-sm">✓</span>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold mb-1">Earn Revenue</h3>
                                                <p className="text-indigo-100 text-sm">Monetize your knowledge and grow your income</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Form Section */}
                            <div className="p-5 sm:p-6 md:p-8 lg:p-10">
                                <div className="mb-6">
                                    <h1 className="text-xl sm:text-2xl font-bold mb-2">
                                        Create Instructor Account
                                    </h1>
                                    <p className={`${styles.authSubtitle} text-xs sm:text-sm`}>
                                        Start teaching and inspiring students today
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Backend Error Message */}
                                    {errors.backend && (
                                        <div className={`${styles.backendError} p-2.5 sm:p-3 rounded-lg text-xs sm:text-sm font-medium`}>
                                            {errors.backend}
                                        </div>
                                    )}

                                    {/* Name Fields - Side by Side */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* First Name */}
                                        <div className="space-y-1.5">
                                            <label htmlFor="firstName" className={`${styles.formLabel} block text-xs sm:text-sm font-semibold`}>
                                                First Name
                                            </label>
                                            <div className="relative">
                                                <User className={`${styles.inputIcon} absolute left-3 top-1/2 -translate-y-1/2`} size={18} />
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    value={formData.firstName}
                                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                    className={`${styles.formInput} ${errors.firstName ? styles.inputError : ''} w-full pl-10 pr-3 py-2.5 rounded-lg text-sm border-2 transition-all duration-200`}
                                                    placeholder="Enter first name"
                                                    disabled={isLoading}
                                                    autoComplete="given-name"
                                                />
                                            </div>
                                            {errors.firstName && (
                                                <span className={`${styles.fieldError} text-xs font-medium block mt-1`}>{errors.firstName}</span>
                                            )}
                                        </div>

                                        {/* Last Name */}
                                        <div className="space-y-1.5">
                                            <label htmlFor="lastName" className={`${styles.formLabel} block text-xs sm:text-sm font-semibold`}>
                                                Last Name
                                            </label>
                                            <div className="relative">
                                                <User className={`${styles.inputIcon} absolute left-3 top-1/2 -translate-y-1/2`} size={18} />
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    value={formData.lastName}
                                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                    className={`${styles.formInput} ${errors.lastName ? styles.inputError : ''} w-full pl-10 pr-3 py-2.5 rounded-lg text-sm border-2 transition-all duration-200`}
                                                    placeholder="Enter last name"
                                                    disabled={isLoading}
                                                    autoComplete="family-name"
                                                />
                                            </div>
                                            {errors.lastName && (
                                                <span className={`${styles.fieldError} text-xs font-medium block mt-1`}>{errors.lastName}</span>
                                            )}
                                        </div>
                                    </div>

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

                                    {/* Phone Field */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="phone" className={`${styles.formLabel} block text-xs sm:text-sm font-semibold`}>
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <Phone className={`${styles.inputIcon} absolute left-3 top-1/2 -translate-y-1/2`} size={18} />
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className={`${styles.formInput} ${errors.phone ? styles.inputError : ''} w-full pl-10 pr-3 py-2.5 rounded-lg text-sm border-2 transition-all duration-200`}
                                                placeholder="0XXXXXXXXX"
                                                disabled={isLoading}
                                                autoComplete="tel"
                                            />
                                        </div>
                                        {errors.phone && (
                                            <span className={`${styles.fieldError} text-xs font-medium block mt-1`}>{errors.phone}</span>
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
                                                placeholder="Create a password"
                                                disabled={isLoading}
                                                autoComplete="new-password"
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

                                    {/* Confirm Password Field */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="confirmPassword" className={`${styles.formLabel} block text-xs sm:text-sm font-semibold`}>
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Lock className={`${styles.inputIcon} absolute left-3 top-1/2 -translate-y-1/2`} size={18} />
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                id="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                                className={`${styles.formInput} ${errors.confirmPassword ? styles.inputError : ''} w-full pl-10 pr-11 py-2.5 rounded-lg text-sm border-2 transition-all duration-200`}
                                                placeholder="Confirm your password"
                                                disabled={isLoading}
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className={`${styles.passwordToggle} absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all duration-200`}
                                                disabled={isLoading}
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <span className={`${styles.fieldError} text-xs font-medium block mt-1`}>{errors.confirmPassword}</span>
                                        )}
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
                                                Creating account...
                                            </>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </button>
                                </form>

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
                </div>
            </div>

            {/* Toast Notification */}
            <Toast
                isVisible={showToast}
                onClose={() => setShowToast(false)}
                title="Registration Successful!"
                message="Welcome to LearnityxAi! You can now log in with your credentials."
                variant="success"
                duration={5000}
                position="top-right"
            />
        </>
    );
}
