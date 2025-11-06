"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  BookOpen,
  Users,
  Star,
  DollarSign,
  TrendingUp,
  Award,
  Calendar,
  Clock,
} from "lucide-react";
import styles from "./InstructorComponents.module.scss";
import MobileDashboard from "./MobileDashboard";
import { useInstructor } from "@/hooks/useInstructorHook";
import Toast from "../ui/Toast";

interface DashboardData {
  instructor: {
    name: string;
    email: string;
  };
  overview: {
    totalCourses: number;
    totalStudents: number;
    averageRating: number;
    totalRevenue: number;
  };
  topCourses: {
    mostPopular: {
      courseId: string;
      courseName: string;
      enrolledStudents: number;
    };
    highestRated: {
      courseId: string;
      courseName: string;
      rating: number;
      totalRatings: number;
    };
  };
  coursesByCategory: {
    [key: string]: {
      count: number;
      totalEnrolled: number;
    };
  };
  allCourses: Array<{
    courseId: string;
    courseName: string;
    courseCategory: string;
    enrolledStudents: number;
    rating: number;
    totalRatings: number;
    price: number;
    startingDate: string;
    duration: string;
  }>;
}

export default function DashboardStats() {
  const { dashboardStats, loading: statsLoading, getDashboardStats } = useInstructor();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', message: '', variant: 'error' as 'success' | 'error' });

  // Fetch dashboard stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        await getDashboardStats();
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setToastMessage({
          title: 'Error',
          message: 'Failed to load dashboard stats. Please try again.',
          variant: 'error'
        });
        setShowToast(true);
      }
    };
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync dashboard data from Redux
  useEffect(() => {
    if (dashboardStats) {
      setDashboardData(dashboardStats as unknown as DashboardData);
    }
  }, [dashboardStats]);

  // Sync loading state
  useEffect(() => {
    setLoading(statsLoading);
  }, [statsLoading]);

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const { overview, topCourses, coursesByCategory, allCourses } = dashboardData;

  // Prepare chart data
  const categoryChartData = Object.entries(coursesByCategory).map(([category, data]) => ({
    name: category,
    courses: data.count,
    students: data.totalEnrolled,
  }));

  // Professional color palette for charts
  const COLORS = [
    "#4169E1", // Royal Blue - Primary
    "#8B5CF6", // Purple - Secondary
    "#00D9FF", // Cyan - Accent
    "#10B981", // Green - Success
    "#F59E0B", // Amber - Warning
    "#EF4444", // Red - Error
    "#EC4899", // Pink
    "#14B8A6", // Teal
  ];

  const statsCards: Array<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    change: string;
    changeType: "positive" | "negative";
  }> = [
    {
      title: "Total Courses",
      value: overview.totalCourses,
      icon: <BookOpen className="w-6 h-6" />,
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Total Students",
      value: overview.totalStudents,
      icon: <Users className="w-6 h-6" />,
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "Average Rating",
      value: overview.averageRating.toFixed(1),
      icon: <Star className="w-6 h-6" />,
      change: "+0.2",
      changeType: "positive",
    },
    {
      title: "Total Revenue",
      value: `$${overview.totalRevenue.toFixed(2)}`,
      icon: <DollarSign className="w-6 h-6" />,
      change: "+15%",
      changeType: "positive",
    },
  ];

  return (
    <>
      {/* Mobile View - Show only on small screens */}
      <div className="block md:hidden">
        <MobileDashboard />
      </div>

      {/* Desktop View - Show only on medium screens and above */}
      <div className="hidden md:block w-full space-y-6">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className={`rounded-xl border p-4 md:p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${styles.statsCard}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${styles.statsIcon}`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs md:text-sm font-medium px-2 py-1 rounded-full ${styles.statsChange} ${stat.changeType === 'negative' ? styles.negative : ''}`}>
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                {stat.change}
              </div>
            </div>
            <div>
              <p className={`text-2xl md:text-3xl font-bold mb-1 ${styles.statsValue}`}>
                {stat.value}
              </p>
              <p className={`text-xs md:text-sm ${styles.statsLabel}`}>
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Category Distribution Chart */}
        <div className={`rounded-xl border p-4 md:p-6 ${styles.chartCard}`}>
          <h3 className={`text-lg md:text-xl font-bold mb-4 pb-3 border-b ${styles.chartTitle}`}>
            Courses by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="courses"
              >
                {categoryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Students Enrollment Chart */}
        <div className={`rounded-xl border p-4 md:p-6 ${styles.chartCard}`}>
          <h3 className={`text-lg md:text-xl font-bold mb-4 pb-3 border-b ${styles.chartTitle}`}>
            Student Enrollment
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#4169E1" name="Students" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Courses Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Most Popular Course */}
        <div className={`rounded-xl border p-4 md:p-6 ${styles.chartCard}`}>
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 md:w-6 md:h-6 text-warning" />
            <h3 className={`text-lg md:text-xl font-bold ${styles.chartTitle}`}>
              Most Popular Course
            </h3>
          </div>
          <div className={`p-4 rounded-lg border ${styles.courseCard}`}>
            <h4 className={`font-semibold text-base md:text-lg mb-2 ${styles.courseTitle}`}>
              {topCourses.mostPopular.courseName}
            </h4>
            <div className="flex items-center gap-2 text-sm md:text-base">
              <Users className="w-4 h-4" />
              <span className={styles.courseInfo}>
                {topCourses.mostPopular.enrolledStudents} students enrolled
              </span>
            </div>
          </div>
        </div>

        {/* Highest Rated Course */}
        <div className={`rounded-xl border p-4 md:p-6 ${styles.chartCard}`}>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 md:w-6 md:h-6 text-warning" />
            <h3 className={`text-lg md:text-xl font-bold ${styles.chartTitle}`}>
              Highest Rated Course
            </h3>
          </div>
          <div className={`p-4 rounded-lg border ${styles.courseCard}`}>
            <h4 className={`font-semibold text-base md:text-lg mb-2 ${styles.courseTitle}`}>
              {topCourses.highestRated.courseName}
            </h4>
            <div className="flex items-center gap-4 text-sm md:text-base">
              <div className="flex items-center gap-1">
                <Star className={`w-4 h-4 ${styles.courseRating}`} fill="currentColor" />
                <span className={`font-medium ${styles.courseRating}`}>
                  {topCourses.highestRated.rating}
                </span>
              </div>
              <span className={styles.courseInfo}>
                ({topCourses.highestRated.totalRatings} ratings)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* All Courses List */}
      <div className={`rounded-xl border p-4 md:p-6 ${styles.chartCard}`}>
        <h3 className={`text-lg md:text-xl font-bold mb-4 pb-3 border-b ${styles.chartTitle}`}>
          All Courses
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allCourses.map((course) => (
            <div
              key={course.courseId}
              className={`rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${styles.courseCard}`}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className={`font-semibold text-sm md:text-base line-clamp-2 flex-1 ${styles.courseTitle}`}>
                  {course.courseName}
                </h4>
              </div>

              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 ${styles.courseCategory}`}>
                {course.courseCategory}
              </div>

              <div className="space-y-2 text-xs md:text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 md:w-4 md:h-4" />
                    <span className={styles.courseInfo}>{course.enrolledStudents} students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className={`w-3 h-3 md:w-4 md:h-4 ${styles.courseRating}`} fill={course.rating > 0 ? "currentColor" : "none"} />
                    <span className={styles.courseInfo}>
                      {course.rating > 0 ? course.rating.toFixed(1) : "No ratings"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    <span className={styles.courseInfo}>{course.duration}</span>
                  </div>
                  <span className={`font-bold text-sm md:text-base ${styles.coursePrice}`}>
                    ${course.price}
                  </span>
                </div>

                <div className="flex items-center gap-1 pt-2 border-t border-border">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                  <span className={styles.courseInfo}>
                    Starts: {new Date(course.startingDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
}
