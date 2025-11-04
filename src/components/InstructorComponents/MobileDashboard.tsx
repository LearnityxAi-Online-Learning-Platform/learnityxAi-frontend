"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  Star,
  DollarSign,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  ChevronRight,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import styles from "./InstructorComponents.module.scss";

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

export default function MobileDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<"pie" | "bar">("pie");

  useEffect(() => {
    setTimeout(() => {
      setDashboardData({
        instructor: {
          name: "Jane Instructor",
          email: "cpriyadasun@gmail.com",
        },
        overview: {
          totalCourses: 2,
          totalStudents: 1,
          averageRating: 4,
          totalRevenue: 89.99,
        },
        topCourses: {
          mostPopular: {
            courseId: "69055847ebcd89cbc8eecee9",
            courseName: "Complete Python Programming - Updated",
            enrolledStudents: 1,
          },
          highestRated: {
            courseId: "69055847ebcd89cbc8eecee9",
            courseName: "Complete Python Programming - Updated",
            rating: 4,
            totalRatings: 1,
          },
        },
        coursesByCategory: {
          "Web Development": {
            count: 2,
            totalEnrolled: 1,
          },
        },
        allCourses: [
          {
            courseId: "69055847ebcd89cbc8eecee9",
            courseName: "Complete Python Programming - Updated",
            courseCategory: "Web Development",
            enrolledStudents: 1,
            rating: 4,
            totalRatings: 1,
            price: 89.99,
            startingDate: "2024-02-01T00:00:00.000Z",
            duration: "12 weeks",
          },
          {
            courseId: "6909651a4a31f9aea645d58c",
            courseName: "Complete Python Programming",
            courseCategory: "Web Development",
            enrolledStudents: 0,
            rating: 0,
            totalRatings: 0,
            price: 99.99,
            startingDate: "2024-02-01T00:00:00.000Z",
            duration: "12 weeks",
          },
        ],
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  const { overview, topCourses, coursesByCategory, allCourses } = dashboardData;

  const categoryChartData = Object.entries(coursesByCategory).map(([category, data]) => ({
    name: category,
    courses: data.count,
    students: data.totalEnrolled,
  }));

  const COLORS = [
    "#4169E1",
    "#8B5CF6",
    "#00D9FF",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#EC4899",
    "#14B8A6",
  ];

  const statsCards = [
    {
      title: "Courses",
      value: overview.totalCourses,
      icon: <BookOpen className="w-5 h-5" />,
      change: "+12%",
      color: "#4169E1",
    },
    {
      title: "Students",
      value: overview.totalStudents,
      icon: <Users className="w-5 h-5" />,
      change: "+8%",
      color: "#8B5CF6",
    },
    {
      title: "Rating",
      value: overview.averageRating.toFixed(1),
      icon: <Star className="w-5 h-5" />,
      change: "+0.2",
      color: "#F59E0B",
    },
    {
      title: "Revenue",
      value: `$${overview.totalRevenue.toFixed(0)}`,
      icon: <DollarSign className="w-5 h-5" />,
      change: "+15%",
      color: "#10B981",
    },
  ];

  return (
    <div className="w-full space-y-4 pb-6">
      {/* Compact Stats Grid - 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className={`rounded-xl border p-4 ${styles.statsCard}`}
            style={{ borderLeftWidth: "3px", borderLeftColor: stat.color }}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <div style={{ color: stat.color }}>{stat.icon}</div>
              </div>
              <span
                className="text-xs font-semibold"
                style={{ color: stat.color }}
              >
                {stat.change}
              </span>
            </div>
            <div>
              <p className={`text-2xl font-bold mb-0.5 ${styles.statsValue}`}>
                {stat.value}
              </p>
              <p className={`text-xs ${styles.statsLabel}`}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Tabs */}
      <div className={`rounded-xl border p-4 ${styles.chartCard}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-base font-bold ${styles.chartTitle}`}>
            Course Analytics
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveChart("pie")}
              className={`p-2 rounded-lg transition-all ${
                activeChart === "pie"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <PieChartIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveChart("bar")}
              className={`p-2 rounded-lg transition-all ${
                activeChart === "bar"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {activeChart === "pie" ? (
          <div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="courses"
                  label={({ name, percent }) =>
                    `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {categoryChartData.map((cat, index) => (
                <div key={index} className="flex items-center gap-1.5 text-xs">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className={styles.courseInfo}>{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryChartData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="students" fill="#4169E1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Courses - Compact Cards */}
      <div className="space-y-3">
        {/* Most Popular */}
        <div className={`rounded-xl border p-4 ${styles.courseCard}`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-warning" />
              <h3 className={`text-sm font-bold ${styles.chartTitle}`}>
                Most Popular
              </h3>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <h4 className={`font-semibold text-sm mb-2 line-clamp-2 ${styles.courseTitle}`}>
            {topCourses.mostPopular.courseName}
          </h4>
          <div className="flex items-center gap-1.5 text-xs">
            <Users className="w-3.5 h-3.5" />
            <span className={styles.courseInfo}>
              {topCourses.mostPopular.enrolledStudents} students
            </span>
          </div>
        </div>

        {/* Highest Rated */}
        <div className={`rounded-xl border p-4 ${styles.courseCard}`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-warning" fill="currentColor" />
              <h3 className={`text-sm font-bold ${styles.chartTitle}`}>
                Highest Rated
              </h3>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <h4 className={`font-semibold text-sm mb-2 line-clamp-2 ${styles.courseTitle}`}>
            {topCourses.highestRated.courseName}
          </h4>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <Star className={`w-3.5 h-3.5 ${styles.courseRating}`} fill="currentColor" />
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

      {/* All Courses List - Mobile Optimized */}
      <div className={`rounded-xl border p-4 ${styles.chartCard}`}>
        <h3 className={`text-base font-bold mb-3 pb-2 border-b ${styles.chartTitle}`}>
          All Courses
        </h3>
        <div className="space-y-3">
          {allCourses.map((course) => (
            <div
              key={course.courseId}
              className={`rounded-lg border p-3 ${styles.courseCard}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className={`font-semibold text-sm line-clamp-2 flex-1 ${styles.courseTitle}`}>
                  {course.courseName}
                </h4>
                <span className={`font-bold text-sm whitespace-nowrap ${styles.coursePrice}`}>
                  ${course.price}
                </span>
              </div>

              <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${styles.courseCategory}`}>
                {course.courseCategory}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span className={styles.courseInfo}>{course.enrolledStudents}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star
                    className={`w-3.5 h-3.5 ${styles.courseRating}`}
                    fill={course.rating > 0 ? "currentColor" : "none"}
                  />
                  <span className={styles.courseInfo}>
                    {course.rating > 0 ? course.rating.toFixed(1) : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className={styles.courseInfo}>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className={styles.courseInfo}>
                    {new Date(course.startingDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
