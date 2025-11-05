'use client';

import React, { JSX, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, ChevronDown, User, BookOpen, Star, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle/themeToggle';
import { useAuth } from '@/hooks/useAuthHook';
import styles from './NavBar.module.scss';

interface NavLink {
    label: string;
    href: string;
}

const exploreLinks: NavLink[] = [
    { label: 'AI & Machine Learning', href: '/explore/ai-ml' },
    { label: 'Web Development', href: '/explore/web-dev' },
    { label: 'Data Science', href: '/explore/data-science' },
    { label: 'Business', href: '/explore/business' },
    { label: 'Computer Science', href: '/explore/cs' },
    { label: 'Information Technology', href: '/explore/it' },
];

export default function NavBar(): JSX.Element {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [isExploreOpen, setIsExploreOpen] = useState<boolean>(false);
    const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
    const exploreRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Use real auth state from Redux
    const { user, isAuthenticated, loading, logout } = useAuth();
    const isLoggedIn = isAuthenticated && !!user;
    const isAuthLoading = loading;

    const toggleMobileMenu = (): void => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleExplore = (): void => {
        setIsExploreOpen(!isExploreOpen);
    };

    const toggleProfile = (): void => {
        setIsProfileOpen(!isProfileOpen);
    };

    const handleLogout = async (): Promise<void> => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsProfileOpen(false);
            router.push('/login');
        }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
                setIsExploreOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <nav className={`sticky top-0 z-50 w-full ${styles.navbar}`}>
            <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6">
                {/* Main Navbar */}
                <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 gap-2 sm:gap-3 md:gap-4">
                    {/* Left Section - Logo */}
                    <div className="flex items-center shrink-0">
                        <Link href="/" className={`flex items-center ${styles.logo}`}>
                            <Image
                                src="/logo/logo.png"
                                alt="LearnityxAi"
                                width={150}
                                height={150}
                                priority
                                className="h-7 sm:h-18 md:h-18 w-auto"
                            />
                        </Link>

                        {/* Explore Dropdown - Desktop */}
                        <div className="hidden lg:block ml-3 md:ml-4 relative" ref={exploreRef}>
                            <button
                                className={`flex items-center gap-1 px-3 md:px-4 py-2 rounded-lg font-medium transition-all ${styles.exploreBtn}`}
                                onClick={toggleExplore}
                                type="button"
                                aria-expanded={isExploreOpen}
                                aria-haspopup="true"
                            >
                                Explore
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform duration-200 ${isExploreOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {/* Explore Dropdown Menu */}
                            {isExploreOpen && (
                                <div
                                    className={`absolute top-full left-0 mt-2 min-w-[16rem] rounded-xl p-2 animate-fade-in ${styles.exploreDropdown}`}
                                    role="menu"
                                >
                                    {exploreLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`block px-4 py-2.5 rounded-lg font-medium transition-all ${styles.dropdownItem}`}
                                            role="menuitem"
                                            onClick={() => setIsExploreOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Center Section - Search Bar (Desktop & Tablet) */}
                    <div className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl mx-2 lg:mx-4">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="What do you want to learn?"
                                className={`w-full px-4 pr-12 py-3.5 rounded-full text-sm font-medium transition-all outline-none ${styles.searchInput}`}
                                aria-label="Search courses"
                            />
                            <button
                                className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${styles.searchBtn}`}
                                type="button"
                                aria-label="Search"
                            >
                                <Search size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Right Section - Theme Toggle, Auth Buttons/Profile & Mobile Menu */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Theme Toggle - Desktop & Tablet */}
                        <div className="hidden sm:flex">
                            <ThemeToggle />
                        </div>

                        {/* Profile Dropdown or Auth Buttons - Desktop */}
                        {isAuthLoading ? (
                            // Loading skeleton
                            <div className="hidden lg:flex items-center gap-2">
                                <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                                <div className="w-28 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                            </div>
                        ) : (
                            <>
                                {isLoggedIn ? (
                                    <div className="hidden lg:block relative" ref={profileRef}>
                                <button
                                    onClick={toggleProfile}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${styles.profileBtn}`}
                                    type="button"
                                    aria-expanded={isProfileOpen}
                                    aria-haspopup="true"
                                >
                                    {/* Avatar */}
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${styles.avatar}`}>
                                        {user.profileImage ? (
                                            <Image
                                                src={user.profileImage}
                                                alt={user.firstName}
                                                width={36}
                                                height={36}
                                                className="rounded-full object-cover"
                                            />
                                        ) : (
                                            <span>{user.firstName.charAt(0).toUpperCase()}</span>
                                        )}
                                    </div>
                                    <ChevronDown
                                        size={18}
                                        className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Profile Dropdown Menu */}
                                {isProfileOpen && (
                                    <div
                                        className={`absolute top-full right-0 mt-2 min-w-[14rem] rounded-xl p-2 animate-fade-in ${styles.profileDropdown}`}
                                        role="menu"
                                    >
                                        {/* User Info */}
                                        <div className={`px-4 py-3 border-b mb-1 ${styles.userInfo}`}>
                                            <p className="font-semibold text-sm">{user.firstName} {user.lastName}</p>
                                            <p className="text-xs opacity-70 truncate">{user.email}</p>
                                        </div>

                                        {/* Profile Links */}
                                        <Link
                                            href="/profile"
                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all ${styles.dropdownItem}`}
                                            role="menuitem"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <User size={18} />
                                            <span>My Profile</span>
                                        </Link>
                                        <Link
                                            href="/my-courses"
                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all ${styles.dropdownItem}`}
                                            role="menuitem"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <BookOpen size={18} />
                                            <span>My Courses</span>
                                        </Link>
                                        <Link
                                            href="/my-ratings"
                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all ${styles.dropdownItem}`}
                                            role="menuitem"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <Star size={18} />
                                            <span>My Ratings</span>
                                        </Link>

                                        {/* Logout */}
                                        <div className={`border-t mt-1 pt-1 ${styles.userInfo}`}>
                                            <button
                                                onClick={handleLogout}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all ${styles.dropdownItem} ${styles.logoutBtn}`}
                                                role="menuitem"
                                            >
                                                <LogOut size={18} />
                                                <span>Log Out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                                ) : (
                                    <div className="hidden lg:flex items-center gap-2">
                                        <Link
                                            href="/login"
                                            className={`px-4 xl:px-5 py-2 xl:py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${styles.loginBtn}`}
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            href="/role"
                                            className={`px-4 xl:px-5 py-2 xl:py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${styles.joinBtn}`}
                                        >
                                            Join for Free
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className={`lg:hidden flex items-center justify-center p-2 rounded-lg transition-all active:scale-95 ${styles.mobileMenuBtn}`}
                            onClick={toggleMobileMenu}
                            aria-label="Toggle menu"
                            type="button"
                        >
                            {isMobileMenuOpen ? (
                                <X size={22} className="sm:w-6 sm:h-6" />
                            ) : (
                                <Menu size={22} className="sm:w-6 sm:h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <div className="md:hidden pb-3">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="What do you want to learn?"
                            className={`w-full px-4 pr-12 py-2.5 rounded-full text-sm font-medium transition-all outline-none ${styles.searchInput}`}
                            aria-label="Search courses"
                        />
                        <button
                            className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all active:scale-95 ${styles.searchBtn}`}
                            type="button"
                            aria-label="Search"
                        >
                            <Search size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={toggleMobileMenu}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Menu - Slides from Right */}
            <aside
                className={`lg:hidden fixed top-0 right-0 bottom-0 w-[85%] max-w-sm z-50 transform transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    } ${styles.mobileMenu}`}
            >
                <div className="h-full flex flex-col overflow-hidden">
                    {/* Mobile Menu Header */}
                    <div className="flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16 flex-shrink-0 border-b border-white/10">
                        <h2 className="text-base sm:text-lg font-bold">Menu</h2>
                        <button
                            className={`flex items-center justify-center p-2 rounded-lg transition-all active:scale-95 ${styles.mobileMenuBtn}`}
                            onClick={toggleMobileMenu}
                            aria-label="Close menu"
                            type="button"
                        >
                            <X size={22} className="sm:w-6 sm:h-6" />
                        </button>
                    </div>

                    {/* Mobile Menu Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto overscroll-contain">
                        <div className="p-4 sm:p-6 space-y-6">
                            {/* User Profile or Auth Buttons - Mobile */}
                            {isAuthLoading ? (
                                // Loading skeleton for mobile
                                <div className="pb-6 border-b border-white/10">
                                    <div className="flex flex-col gap-3">
                                        <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                                        <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {isLoggedIn ? (
                                <div className="pb-6 border-b border-white/10">
                                    {/* User Info */}
                                    <div className={`flex items-center gap-3 mb-4 px-2 ${styles.mobileUserInfo}`}>
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base ${styles.avatar}`}>
                                            {user.profileImage ? (
                                                <Image
                                                    src={user.profileImage}
                                                    alt={user.firstName}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full object-cover"
                                                />
                                            ) : (
                                                <span>{user.firstName.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-base truncate">{user.firstName} {user.lastName}</p>
                                            <p className="text-sm opacity-70 truncate">{user.email}</p>
                                        </div>
                                    </div>

                                    {/* Profile Links */}
                                    <div className="flex flex-col gap-1">
                                        <Link
                                            href="/profile"
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all active:scale-95 min-h-[44px] ${styles.mobileLink}`}
                                            onClick={toggleMobileMenu}
                                        >
                                            <User size={20} />
                                            <span>My Profile</span>
                                        </Link>
                                        <Link
                                            href="/my-courses"
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all active:scale-95 min-h-[44px] ${styles.mobileLink}`}
                                            onClick={toggleMobileMenu}
                                        >
                                            <BookOpen size={20} />
                                            <span>My Courses</span>
                                        </Link>
                                        <Link
                                            href="/my-ratings"
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all active:scale-95 min-h-[44px] ${styles.mobileLink}`}
                                            onClick={toggleMobileMenu}
                                        >
                                            <Star size={20} />
                                            <span>My Ratings</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                toggleMobileMenu();
                                            }}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all active:scale-95 min-h-[44px] w-full text-left ${styles.mobileLink} ${styles.mobileLogoutBtn}`}
                                        >
                                            <LogOut size={20} />
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                </div>
                                    ) : (
                                        <div className="flex flex-col gap-3 pb-6 border-b border-white/10">
                                            <Link
                                                href="/login"
                                                className={`w-full px-4 py-3.5 rounded-lg font-semibold text-center transition-all active:scale-95 min-h-[48px] flex items-center justify-center ${styles.mobileLoginBtn}`}
                                                onClick={toggleMobileMenu}
                                            >
                                                Log In
                                            </Link>
                                            <Link
                                                href="/role"
                                                className={`w-full px-4 py-3.5 rounded-lg font-semibold text-center transition-all active:scale-95 min-h-[48px] flex items-center justify-center ${styles.mobileJoinBtn}`}
                                                onClick={toggleMobileMenu}
                                            >
                                                Join for Free
                                            </Link>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Explore Section */}
                            <div className={`pb-6 border-b border-white/10 ${styles.mobileSection}`}>
                                <h3 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-60">
                                    Explore
                                </h3>
                                <div className="flex flex-col gap-1">
                                    {exploreLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`px-4 py-3 rounded-lg font-medium transition-all active:scale-95 min-h-[44px] flex items-center ${styles.mobileLink}`}
                                            onClick={toggleMobileMenu}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Theme Toggle - Mobile */}
                            <div className="sm:hidden">
                                <h3 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-60">
                                    Theme
                                </h3>
                                <div className="flex items-center justify-between px-4 py-3 rounded-lg min-h-[44px]">
                                    <span className="font-medium">Appearance</span>
                                    <ThemeToggle showLabel />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </nav>
    );
}