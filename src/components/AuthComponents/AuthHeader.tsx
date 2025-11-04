'use client';

import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import styles from './AuthComponents.module.scss';

export default function AuthHeader() {
    return (
        <header className={styles.authHeader}>
            <div className={styles.authHeaderContainer}>
                {/* Logo/Brand */}
                <Link href="/" className={styles.authLogo}>
                    <span className={styles.logoText}>Learnityx</span>
                    <span className={styles.logoAi}>Ai</span>
                </Link>

                {/* Navigation Links */}
                <nav className={styles.authNav}>
                    <Link href="/" className={styles.authNavLink}>
                        <Home size={18} />
                        <span>Home</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
