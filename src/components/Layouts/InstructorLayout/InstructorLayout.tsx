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
import styles from "./InstructorLayout.module.scss";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
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

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    router.push("/login");
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
          href: "/instructor-profile.tsx",
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
    <div className={styles.layout}>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isSidebarOpen ? styles.visible : ""}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <div className={styles.logoWrapper}>
            <div className={styles.logoIcon}>L</div>
            <div className={styles.logoText}>
              <h2>LearnityX</h2>
              <p>Instructor Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.navigation}>
          {navigationItems.map((section) => (
            <div key={section.section} className={styles.navSection}>
              <div className={styles.navLabel}>{section.section}</div>
              <ul className={styles.navList}>
                {section.items.map((item) => (
                  <li key={item.href} className={styles.navItem}>
                    <Link
                      href={item.href}
                      className={pathname === item.href ? styles.active : ""}
                    >
                      <span className={styles.navIcon}>{item.icon}</span>
                      <span className={styles.navText}>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className={styles.userSection}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <LogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              className={styles.menuButton}
              onClick={toggleSidebar}
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className={styles.headerTitle}>{getPageTitle()}</h1>
          </div>

          <div className={styles.headerRight}>
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Profile Dropdown */}
            <div className={styles.profileDropdownWrapper} ref={profileDropdownRef}>
              <button
                className={`${styles.profileButton} ${
                  isProfileDropdownOpen ? styles.active : ""
                }`}
                onClick={toggleProfileDropdown}
                aria-label="Profile menu"
              >
                <div className={styles.profileAvatar}>JD</div>
                <span className={styles.profileName}>John Doe</span>
                <ChevronDown
                  size={16}
                  className={`${styles.chevronIcon} ${
                    isProfileDropdownOpen ? styles.open : ""
                  }`}
                />
              </button>

              <div
                className={`${styles.profileDropdown} ${
                  isProfileDropdownOpen ? styles.open : ""
                }`}
              >
                <div className={styles.dropdownHeader}>
                  <h3 className={styles.dropdownUserName}>John Doe</h3>
                  <p className={styles.dropdownUserEmail}>john.doe@example.com</p>
                </div>

                <div className={styles.dropdownMenu}>
                  <Link
                    href="/instructor-profile.tsx"
                    className={styles.dropdownItem}
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <User size={18} />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href="/settings"
                    className={styles.dropdownItem}
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>

                  <div className={styles.dropdownDivider} />

                  <button
                    className={`${styles.dropdownItem} ${styles.danger}`}
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
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}