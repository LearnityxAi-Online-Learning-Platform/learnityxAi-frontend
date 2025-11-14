'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Eye, EyeOff } from 'lucide-react';
import styles from './AlertDialog.module.scss';

interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (password?: string) => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    icon?: React.ReactNode;
    isLoading?: boolean;
    requirePassword?: boolean;
}

export default function AlertDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    icon,
    isLoading = false,
    requirePassword = false
}: AlertDialogProps) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    // Reset state when dialog opens/closes
    useEffect(() => {
        if (!isOpen) {
            setPassword('');
            setShowPassword(false);
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose();
        }
    };

    const handleConfirm = () => {
        if (isLoading) return;

        // Validate password if required
        if (requirePassword && password.trim().length === 0) {
            setError('Please enter your password to confirm.');
            return;
        }

        // Clear any errors and proceed
        setError('');
        onConfirm(requirePassword ? password : undefined);
    };

    const handleCancel = () => {
        if (!isLoading) {
            onClose();
        }
    };

    return (
        <div
            className={styles.backdrop}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <div className={`w-full max-w-md mx-4 sm:mx-auto ${styles.dialog} ${styles[variant]}`}>
                {/* Close Button */}
                <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className={styles.closeButton}
                    aria-label="Close dialog"
                >
                    <X size={18} className="sm:w-5 sm:h-5" />
                </button>

                {/* Icon */}
                <div className={`w-14 h-14 sm:w-16 sm:h-16 ${styles.iconContainer}`}>
                    {icon || <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12" />}
                </div>

                {/* Content */}
                <div className="text-center mb-6">
                    <h2 id="alert-dialog-title" className={`text-lg sm:text-xl font-bold mb-2 ${styles.title}`}>
                        {title}
                    </h2>
                    <p id="alert-dialog-description" className={`text-sm sm:text-base whitespace-pre-line ${styles.description}`}>
                        {description}
                    </p>

                    {/* Password Input */}
                    {requirePassword && (
                        <div className="mt-4 text-left">
                            <label htmlFor="password-confirm" className="block text-sm font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                                Enter your password to confirm:
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    id="password-confirm"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="Enter your password"
                                    className={`w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base rounded-lg border-2 transition-all focus:outline-none ${styles.input}`}
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleConfirm();
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 p-2 rounded-md transition-all hover:bg-opacity-10"
                                    style={{ color: 'var(--color-text-secondary)' }}
                                    disabled={isLoading}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className={`mt-3 p-3 rounded-lg text-sm text-left font-medium ${styles.errorMessage}`}>
                            {error}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className={`flex-1 px-4 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all order-2 sm:order-1 ${styles.button} ${styles.cancelButton}`}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`flex-1 px-4 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all order-1 sm:order-2 ${styles.button} ${styles.confirmButton}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className={styles.spinner} />
                                <span>Processing...</span>
                            </div>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
