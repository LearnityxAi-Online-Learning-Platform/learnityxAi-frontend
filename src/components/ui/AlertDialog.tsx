'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import styles from './AlertDialog.module.scss';

interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    icon?: React.ReactNode;
    isLoading?: boolean;
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
    isLoading = false
}: AlertDialogProps) {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose();
        }
    };

    const handleConfirm = () => {
        if (!isLoading) {
            onConfirm();
        }
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
            <div className={`${styles.dialog} ${styles[variant]}`}>
                {/* Close Button */}
                <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className={styles.closeButton}
                    aria-label="Close dialog"
                >
                    <X size={20} />
                </button>

                {/* Icon */}
                <div className={styles.iconContainer}>
                    {icon || <AlertTriangle size={48} />}
                </div>

                {/* Content */}
                <div className={styles.content}>
                    <h2 id="alert-dialog-title" className={styles.title}>
                        {title}
                    </h2>
                    <p id="alert-dialog-description" className={styles.description}>
                        {description}
                    </p>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className={`${styles.button} ${styles.cancelButton}`}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`${styles.button} ${styles.confirmButton}`}
                    >
                        {isLoading ? (
                            <div className={styles.buttonContent}>
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
