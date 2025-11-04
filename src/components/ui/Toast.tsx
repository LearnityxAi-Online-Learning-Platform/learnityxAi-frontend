'use client';

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import styles from './Toast.module.scss';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
    isVisible: boolean;
    onClose: () => void;
    title: string;
    message?: string;
    variant?: ToastVariant;
    duration?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
    showCloseButton?: boolean;
}

export default function Toast({
    isVisible,
    onClose,
    title,
    message,
    variant = 'info',
    duration = 5000,
    position = 'top-right',
    showCloseButton = true
}: ToastProps) {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const getIcon = () => {
        switch (variant) {
            case 'success':
                return <CheckCircle size={20} />;
            case 'error':
                return <XCircle size={20} />;
            case 'warning':
                return <AlertCircle size={20} />;
            case 'info':
                return <Info size={20} />;
            default:
                return <Info size={20} />;
        }
    };

    return (
        <div
            className={`${styles.toast} ${styles[variant]} ${styles[position]}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <div className={styles.content}>
                <div className={styles.iconContainer}>
                    {getIcon()}
                </div>

                <div className={styles.textContent}>
                    <h4 className={styles.title}>{title}</h4>
                    {message && <p className={styles.message}>{message}</p>}
                </div>
            </div>

            {showCloseButton && (
                <button
                    onClick={onClose}
                    className={styles.closeButton}
                    aria-label="Close notification"
                >
                    <X size={18} />
                </button>
            )}

            {/* Progress bar for auto-dismiss */}
            {duration > 0 && (
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ animationDuration: `${duration}ms` }}
                    />
                </div>
            )}
        </div>
    );
}
