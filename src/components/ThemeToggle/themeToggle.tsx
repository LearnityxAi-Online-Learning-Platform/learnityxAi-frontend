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
            className={`flex items-center gap-2 p-2 rounded-lg transition-all hover:scale-105 active:scale-95 ${styles.toggle} ${className}`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            type="button"
        >
            <span className="relative w-5 h-5 flex items-center justify-center">
                <Sun
                    className={`absolute transition-all duration-300 ${
                        !isDark 
                            ? 'opacity-100 rotate-0 scale-100' 
                            : 'opacity-0 rotate-90 scale-0'
                    } ${styles.sunIcon}`}
                    size={18}
                    strokeWidth={2.5}
                />
                <Moon
                    className={`absolute transition-all duration-300 ${
                        isDark 
                            ? 'opacity-100 rotate-0 scale-100' 
                            : 'opacity-0 -rotate-90 scale-0'
                    } ${styles.moonIcon}`}
                    size={18}
                    strokeWidth={2.5}
                />
            </span>

            {showLabel && (
                <span className={`text-sm font-medium ${styles.label}`}>
                    {isDark ? 'Dark' : 'Light'}
                </span>
            )}
        </button>
    );
}

export default ThemeToggle;