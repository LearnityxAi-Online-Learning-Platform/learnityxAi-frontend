'use client';

import { useState, useCallback } from 'react';
import Toast, { ToastVariant } from './Toast';

interface ToastState {
  isVisible: boolean;
  title: string;
  message?: string;
  variant: ToastVariant;
}

export function useToast() {
  const [toastState, setToastState] = useState<ToastState>({
    isVisible: false,
    title: '',
    message: '',
    variant: 'info',
  });

  const showToast = useCallback(
    (title: string, message?: string, variant: ToastVariant = 'info') => {
      setToastState({
        isVisible: true,
        title,
        message,
        variant,
      });
    },
    []
  );

  const success = useCallback(
    (title: string, message?: string) => showToast(title, message, 'success'),
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string) => showToast(title, message, 'error'),
    [showToast]
  );

  const warning = useCallback(
    (title: string, message?: string) => showToast(title, message, 'warning'),
    [showToast]
  );

  const info = useCallback(
    (title: string, message?: string) => showToast(title, message, 'info'),
    [showToast]
  );

  const hideToast = useCallback(() => {
    setToastState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const ToastComponent = useCallback(
    () => (
      <Toast
        isVisible={toastState.isVisible}
        onClose={hideToast}
        title={toastState.title}
        message={toastState.message}
        variant={toastState.variant}
      />
    ),
    [toastState, hideToast]
  );

  return {
    success,
    error,
    warning,
    info,
    ToastComponent,
  };
}
