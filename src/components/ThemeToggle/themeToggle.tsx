'use client';

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import styles from './ThemeToggle.module.scss';

interface ThemeToggleProps {
    className?: string;
    showLabel?: boolean;
}

export function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            className={`${styles.toggle} ${className}`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <span className={styles.iconWrapper}>
                <Sun
                    className={`${styles.icon} ${styles.sunIcon} ${!isDark ? styles.active : ''}`}
                    size={20}
                />
                <Moon
                    className={`${styles.icon} ${styles.moonIcon} ${isDark ? styles.active : ''}`}
                    size={20}
                />
            </span>

            {showLabel && (
                <span className={styles.label}>
                    {isDark ? 'Dark' : 'Light'}
                </span>
            )}
        </button>
    );
}

export default ThemeToggle;