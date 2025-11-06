"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  BookOpen,
  User,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { ThemeToggle } from "../../ThemeToggle/themeToggle";
import { useAuth } from "@/hooks/useAuthHook";
import styles from "./InstructorLayout.module.scss";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, getUserProfile } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close sidebar when route changes on mobile
  if (pathname !== prevPathname) {
    setIsSidebarOpen(false);
    setPrevPathname(pathname);
  }

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Fetch user profile on mount
  useEffect(() => {
    if (!user) {
      getUserProfile().catch((err) => {
        console.error("Error fetching user profile:", err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      // Force redirect even if logout fails
      router.push("/login");
    }
  };

  // Helper function to get user initials
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase();
  };

  // Get display name
  const getDisplayName = () => {
    if (!user) return "Loading...";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
  };

  const navigationItems = [
    {
      section: "Main",
      items: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard size={22} />,
        },
      ],
    },
    {
      section: "Courses",
      items: [
        {
          href: "/create-course",
          label: "Create Course",
          icon: <Plus size={22} />,
        },
        {
          href: "/instructor-courses",
          label: "My Courses",
          icon: <BookOpen size={22} />,
        },
      ],
    },
    {
      section: "Account",
      items: [
        {
          href: "/instructor-profile",
          label: "Profile",
          icon: <User size={22} />,
        },
      ],
    },
  ];

  const getPageTitle = () => {
    const allItems = navigationItems.flatMap((section) => section.items);
    const currentItem = allItems.find((item) => pathname === item.href);
    return currentItem?.label || "Dashboard";
  };

  return (
    <div className={`min-h-screen flex relative ${styles.layout}`}>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[999] transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } ${styles.overlay}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[280px] border-r flex flex-col z-[1000] transition-transform duration-300 overflow-y-auto overflow-x-hidden shadow-xl md:shadow-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${styles.sidebar}`}
      >
        {/* Logo Section */}
        <div className={`p-4 px-5 border-b sticky top-0 z-10 min-h-[73px] flex items-center ${styles.logoSection}`}>
          <div className="flex items-center gap-3 w-full">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl shrink-0 ${styles.logoIcon}`}>
              L
            </div>
            <div className="flex-1 min-w-0">
              <h2 className={`text-xl font-bold m-0 leading-tight ${styles.logoText}`}>LearnityX</h2>
              <p className={`text-xs m-0 mt-0.5 leading-tight ${styles.logoText}`}>Instructor Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-6 overflow-y-auto ${styles.navigation}`}>
          {navigationItems.map((section) => (
            <div key={section.section} className="mb-8 last:mb-0">
              <div className={`text-xs font-semibold uppercase tracking-wider px-5 mb-3 ${styles.navLabel}`}>
                {section.section}
              </div>
              <ul className="list-none p-0 m-0">
                {section.items.map((item) => (
                  <li key={item.href} className="mx-3 my-1">
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-lg no-underline font-medium text-[15px] relative overflow-hidden before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:scale-y-0 hover:translate-x-1 transition-all duration-150 ${
                        pathname === item.href
                          ? `${styles.active} font-semibold before:scale-y-100`
                          : ""
                      } ${styles.navItem}`}
                    >
                      <span className={`w-[22px] h-[22px] flex items-center justify-center shrink-0 ${styles.navIcon}`}>
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className={`p-3 border-t mt-auto ${styles.userSection}`}>
          <button
            className={`flex items-center gap-3 px-4 py-3.5 mx-2 rounded-lg border font-medium text-[15px] cursor-pointer w-[calc(100%-1rem)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 ${styles.logoutButton}`}
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ml-0 md:ml-[280px] min-h-screen flex flex-col transition-[margin-left] duration-300 ${styles.main}`}>
        {/* Header */}
        <header className={`fixed top-0 right-0 left-0 md:left-[280px] border-b px-4 md:px-6 py-3 flex items-center justify-between z-[100] shadow-sm ${styles.header}`}>
          <div className="flex items-center gap-4">
            <button
              className={`flex items-center justify-center md:hidden p-2 border-0 cursor-pointer rounded-md active:scale-95 transition-all duration-150 ${styles.menuButton}`}
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className={`text-lg md:text-2xl font-bold m-0 ${styles.headerTitle}`}>{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                className={`flex items-center gap-2.5 p-2 border rounded-full cursor-pointer transition-all duration-150 ${
                  isProfileDropdownOpen ? styles.active : ""
                } ${styles.profileButton}`}
                onClick={toggleProfileDropdown}
                aria-label="Profile menu"
              >
                {user?.profileImage ? (
                  <div
                    className="w-8 h-8 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${user.profileImage})` }}
                  />
                ) : (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${styles.profileAvatar}`}>
                    {getInitials(user?.firstName, user?.lastName)}
                  </div>
                )}
                <span className="text-sm font-medium hidden sm:block">{getDisplayName()}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-150 hidden sm:block ${
                    isProfileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute top-[calc(100%+0.5rem)] right-0 min-w-[220px] border rounded-lg shadow-xl overflow-hidden transition-all duration-150 ${
                  isProfileDropdownOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2.5 pointer-events-none"
                } ${styles.profileDropdown}`}
              >
                <div className={`p-4 border-b ${styles.dropdownHeader}`}>
                  <h3 className={`text-[15px] font-semibold m-0 mb-1 ${styles.dropdownUserName}`}>
                    {getDisplayName()}
                  </h3>
                  <p className={`text-[13px] m-0 ${styles.dropdownUserEmail}`}>
                    {user?.email || ""}
                  </p>
                </div>

                <div className="p-2">
                  <Link
                    href="/instructor-profile"
                    className={`flex items-center gap-3 px-4 py-3 rounded-md no-underline text-sm font-medium cursor-pointer transition-all duration-150 border-0 w-full text-left ${styles.dropdownItem}`}
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <User size={18} />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href="/settings"
                    className={`flex items-center gap-3 px-4 py-3 rounded-md no-underline text-sm font-medium cursor-pointer transition-all duration-150 border-0 w-full text-left ${styles.dropdownItem}`}
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>

                  <div className={`h-px my-2 ${styles.dropdownDivider}`} />

                  <button
                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium cursor-pointer transition-all duration-150 border-0 w-full text-left ${styles.dropdownItem} ${styles.danger}`}
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 px-4 md:px-8 pb-6 md:pb-8 pt-[97px] md:pt-[105px] max-w-[1400px] w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
