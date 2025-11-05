'use client';

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthHook';
import styles from './AuthComponents.module.scss';

interface FormErrors {
    otp?: string;
    backend?: string;
}

function OTPContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const { verifyOTP, loading } = useAuth();

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [errors, setErrors] = useState<FormErrors>({});
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (!email) {
            router.push('/forgot-password');
        }
    }, [email, router]);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Clear errors when user types
        if (errors.otp) {
            setErrors({ ...errors, otp: undefined });
        }
        if (errors.backend) {
            setErrors({ ...errors, backend: undefined });
        }

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                // If current input is empty, move to previous and clear it
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
            } else {
                // Clear current input
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        }

        // Handle arrow keys
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();

        // Check if pasted data is 6 digits
        if (/^\d{6}$/.test(pastedData)) {
            const newOtp = pastedData.split('');
            setOtp(newOtp);

            // Focus last input
            inputRefs.current[5]?.focus();

            // Clear errors
            if (errors.otp) {
                setErrors({ ...errors, otp: undefined });
            }
            if (errors.backend) {
                setErrors({ ...errors, backend: undefined });
            }
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        const otpValue = otp.join('');

        if (otpValue.length !== 6) {
            newErrors.otp = 'Please enter the complete 6-digit code';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setErrors({});

        try {
            const otpValue = otp.join('');

            await verifyOTP({ email, otp: otpValue });

            // Navigate to new password page with email and OTP
            router.push(`/new-password?email=${encodeURIComponent(email)}&otp=${otpValue}`);

        } catch (error: any) {
            const errorMessage = error?.message || 'Invalid verification code. Please try again.';
            setErrors({
                backend: errorMessage
            });
        }
    };

    const handleResendCode = () => {
        setOtp(['', '', '', '', '', '']);
        setErrors({});
        inputRefs.current[0]?.focus();
        console.log('Resending code to:', email);
        // Add resend logic here
    };

    return (
        <div className="min-h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] flex items-center justify-center p-2 sm:p-3">
            <div className="w-full max-w-md h-full flex items-center py-2">
                <div className={`${styles.authCard} rounded-lg sm:rounded-xl shadow-xl p-4 sm:p-5 md:p-6 w-full`}>
                    {/* Back Link */}
                    <Link href="/forgot-password" className={`${styles.authLink} inline-flex items-center gap-1.5 text-xs font-semibold mb-4 transition-colors duration-200 hover:underline`}>
                        <ArrowLeft size={14} />
                        Back
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
                        <h1 className="text-lg sm:text-xl font-bold mb-1.5">
                            Enter Verification Code
                        </h1>
                        <p className={`${styles.authSubtitle} text-xs`}>
                            We&apos;ve sent a 6-digit code to <span className="font-semibold">{email}</span>
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

                        {/* OTP Input Fields */}
                        <div className="space-y-1">
                            <label className={`${styles.formLabel} block text-xs font-semibold`}>
                                Verification Code
                            </label>
                            <div className="flex gap-2 justify-between">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        className={`${styles.formInput} ${errors.otp ? styles.inputError : ''} w-full aspect-square text-center text-lg sm:text-xl font-bold rounded-lg border-2 transition-all duration-200`}
                                        disabled={loading}
                                        autoComplete="off"
                                    />
                                ))}
                            </div>
                            {errors.otp && (
                                <span className={`${styles.fieldError} text-xs font-medium block`}>{errors.otp}</span>
                            )}
                        </div>

                        {/* Resend Code */}
                        <div className="text-center">
                            <p className="text-xs">
                                <span className={styles.authSubtitle}>Didn&apos;t receive the code? </span>
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    className={`${styles.authLink} text-xs font-semibold transition-colors duration-200 hover:underline`}
                                    disabled={loading}
                                >
                                    Resend Code
                                </button>
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`${styles.authButton} w-full py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed`}
                        >
                            {loading ? (
                                <>
                                    <span className={`${styles.spinner} w-3.5 h-3.5 border-2 rounded-full animate-spin`}></span>
                                    Verifying...
                                </>
                            ) : (
                                'Verify Code'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function OTP() {
    return (
        <Suspense fallback={
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
                <div className="text-sm">Loading...</div>
            </div>
        }>
            <OTPContent />
        </Suspense>
    );
}
