'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    Star,
    Clock,
    TrendingUp,
    Filter,
    Search,
    SlidersHorizontal,
    X,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import styles from './CourseComponents.module.scss';

interface Course {
    _id: string;
    courseName: string;
    courseCategory: string;
    instructorName: string;
    description: string;
    rating: number;
    skills: string[];
    tools: string[];
    startingDate: string;
    duration: string;
    price: number;
    courseFlyerURL: string;
    numberOfUserEnrolled?: number;
}

interface PaginationData {
    currentPage: number;
    pageSize: number;
    totalCourses: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: {
        courses: Course[];
        pagination: PaginationData;
    };
}

// API Data for filters
const categories = [
    "All Categories",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Cloud Computing",
    "Cybersecurity",
    "DevOps",
    "Database Management",
    "UI/UX Design",
    "Digital Marketing",
    "Business Analytics",
    "Project Management",
    "Software Testing",
    "Blockchain",
    "Game Development",
    "Other"
];

const tools = [
    "All Tools",
    "JavaScript",
    "Python",
    "Java",
    "React",
    "Node.js",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "Git",
    "Jenkins",
    "Tableau",
    "Power BI",
    "Figma",
    "Adobe XD",
    "TensorFlow",
    "PyTorch",
    "Angular",
    "Vue.js",
    "Django",
    "Flask",
    "Spring Boot",
    "TypeScript",
    "Go",
    "Rust",
    "Swift",
    "Kotlin"
];

const durations = [
    "All Durations",
    "1 week",
    "2 weeks",
    "3 weeks",
    "4 weeks",
    "6 weeks",
    "8 weeks",
    "10 weeks",
    "12 weeks",
    "3 months",
    "4 months",
    "5 months",
    "6 months",
    "9 months",
    "12 months",
    "Self-paced"
];

const ratingOptions = [
    { label: "All Ratings", value: 0 },
    { label: "4.5 & above", value: 4.5 },
    { label: "4.0 & above", value: 4.0 },
    { label: "3.5 & above", value: 3.5 },
    { label: "3.0 & above", value: 3.0 }
];

export default function AllCoursesPageAPI(): React.JSX.Element {
    const router = useRouter();

    // State for API data
    const [apiResponse, setApiResponse] = useState<ApiResponse>({
        success: true,
        message: "Courses retrieved successfully",
        data: {
            courses: [
                {
                    _id: "1",
                    courseName: "Python for Everybody",
                    courseCategory: "Web Development",
                    instructorName: "University of Michigan",
                    description: "Learn Python programming from scratch",
                    rating: 4.8,
                    skills: ["Python", "Programming"],
                    tools: ["Python"],
                    startingDate: "2024-12-01",
                    duration: "8 weeks",
                    price: 799,
                    courseFlyerURL: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                    numberOfUserEnrolled: 150000
                },
                {
                    _id: "2",
                    courseName: "Prompt Engineering",
                    courseCategory: "Artificial Intelligence",
                    instructorName: "Vanderbilt University",
                    description: "Master prompt engineering techniques",
                    rating: 4.9,
                    skills: ["AI", "Prompt Engineering"],
                    tools: ["Python", "TensorFlow"],
                    startingDate: "2024-12-01",
                    duration: "6 weeks",
                    price: 899,
                    courseFlyerURL: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                    numberOfUserEnrolled: 85000
                },
                {
                    _id: "3",
                    courseName: "IBM Data Science",
                    courseCategory: "Data Science",
                    instructorName: "IBM",
                    description: "Professional certificate in data science",
                    rating: 4.7,
                    skills: ["Data Science", "Python", "Machine Learning"],
                    tools: ["Python", "Tableau"],
                    startingDate: "2024-12-01",
                    duration: "10 weeks",
                    price: 999,
                    courseFlyerURL: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                    numberOfUserEnrolled: 200000
                },
                {
                    _id: "4",
                    courseName: "Complete Web Development",
                    courseCategory: "Web Development",
                    instructorName: "John Doe",
                    description: "Learn full-stack web development",
                    rating: 4.6,
                    skills: ["HTML", "CSS", "JavaScript", "React"],
                    tools: ["React", "Node.js"],
                    startingDate: "2024-12-01",
                    duration: "12 weeks",
                    price: 999,
                    courseFlyerURL: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                    numberOfUserEnrolled: 120000
                },
                {
                    _id: "5",
                    courseName: "Machine Learning Specialization",
                    courseCategory: "Machine Learning",
                    instructorName: "Stanford University",
                    description: "Deep dive into machine learning",
                    rating: 4.9,
                    skills: ["Machine Learning", "Python", "AI"],
                    tools: ["Python", "TensorFlow"],
                    startingDate: "2024-12-01",
                    duration: "11 weeks",
                    price: 1299,
                    courseFlyerURL: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                    numberOfUserEnrolled: 180000
                },
            ],
            pagination: {
                currentPage: 1,
                pageSize: 10,
                totalCourses: 5,
                totalPages: 1,
                hasNextPage: false,
                hasPrevPage: false
            }
        }
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedTool, setSelectedTool] = useState('All Tools');
    const [selectedDuration, setSelectedDuration] = useState('All Durations');
    const [selectedRating, setSelectedRating] = useState(0);
    const [sortBy, setSortBy] = useState('popular');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        tools: false,
        duration: false,
        rating: false
    });

    // Extract data from API response
    const courses = apiResponse.data.courses;
    const pagination = apiResponse.data.pagination;

    const formatEnrollment = (count: number): string => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(0)}K`;
        }
        return count.toString();
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handlePageChange = (page: number) => {
        // In production, fetch new data from API with the new page number
        // Example: fetchCourses(page, pageSize, filters, sort)

        setApiResponse(prev => ({
            ...prev,
            data: {
                ...prev.data,
                pagination: {
                    ...prev.data.pagination,
                    currentPage: page,
                    hasNextPage: page < prev.data.pagination.totalPages,
                    hasPrevPage: page > 1
                }
            }
        }));

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedCategory('All Categories');
        setSelectedTool('All Tools');
        setSelectedDuration('All Durations');
        setSelectedRating(0);
        setSortBy('popular');
    };

    const hasActiveFilters =
        searchQuery !== '' ||
        selectedCategory !== 'All Categories' ||
        selectedTool !== 'All Tools' ||
        selectedDuration !== 'All Durations' ||
        selectedRating !== 0;

    /* 
    // Example API integration:
    const fetchCourses = async (page: number) => {
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: '10',
            ...(selectedCategory !== 'All Categories' && { category: selectedCategory }),
            ...(selectedTool !== 'All Tools' && { tool: selectedTool }),
            ...(selectedDuration !== 'All Durations' && { duration: selectedDuration }),
            ...(selectedRating > 0 && { minRating: selectedRating.toString() }),
            ...(searchQuery && { search: searchQuery }),
            sort: sortBy
        });
        
        const response = await fetch(`/api/courses?${params}`);
        const data = await response.json();
        setApiResponse(data);
    };
    
    useEffect(() => {
        fetchCourses(pagination.currentPage);
    }, [pagination.currentPage, selectedCategory, selectedTool, selectedDuration, selectedRating, sortBy, searchQuery]);
    */

    return (
        <div className={`${styles.allCoursesPage} min-h-screen py-6 sm:py-8 lg:py-12`}>
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 sm:mb-10 lg:mb-12">
                    <h1 className={`${styles.pageTitle} text-3xl sm:text-4xl lg:text-5xl font-black mb-3 leading-tight`}>
                        All <span className={styles.gradientText}>Courses</span>
                    </h1>
                    <p className={`${styles.pageSubtitle} text-base sm:text-lg`}>
                        Explore {pagination.totalCourses} courses to advance your skills
                    </p>
                </div>

                {/* Search and Sort */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Bar */}
                        <div className={`${styles.searchContainer} flex-1 relative`}>
                            <Search className={`${styles.searchIcon} absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5`} />
                            <input
                                type="text"
                                placeholder="Search by course name ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`${styles.searchInput} w-full pl-12 pr-4 py-3.5 rounded-xl text-sm sm:text-base`}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className={`${styles.clearButton} absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full`}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Sort Dropdown and Filter Toggle */}
                        <div className="flex gap-3">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className={`${styles.sortSelect} px-4 py-3.5 rounded-xl text-sm sm:text-base font-medium min-w-[160px]`}
                            >
                                <option value="popular">Most Popular</option>
                                <option value="rating">Highest Rated</option>
                                <option value="newest">Newest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>

                            {/* Mobile Filter Button */}
                            <button
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                className={`${styles.filterButton} lg:hidden px-4 py-3.5 rounded-xl font-medium flex items-center gap-2`}
                            >
                                <SlidersHorizontal className="w-5 h-5" />
                                <span className="hidden sm:inline">Filters</span>
                            </button>
                        </div>
                    </div>

                    {/* Active Filters Summary & Clear Button */}
                    {hasActiveFilters && (
                        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                            <div className={`${styles.resultsInfo} text-sm flex-1`}>
                                <strong>Active filters:</strong>
                                {searchQuery && <span className="ml-2">Search: &quot;{searchQuery}&quot;</span>}
                                {selectedCategory !== 'All Categories' && <span className="ml-2">• Category: {selectedCategory}</span>}
                                {selectedTool !== 'All Tools' && <span className="ml-2">• Tool: {selectedTool}</span>}
                                {selectedDuration !== 'All Durations' && <span className="ml-2">• Duration: {selectedDuration}</span>}
                                {selectedRating > 0 && <span className="ml-2">• Rating: {selectedRating}+</span>}
                            </div>
                            <button
                                onClick={clearAllFilters}
                                className={`${styles.clearFiltersButton} text-sm font-semibold flex items-center gap-1 hover:underline`}
                            >
                                <X className="w-4 h-4" />
                                Clear all filters
                            </button>
                        </div>
                    )}

                    {/* Advanced Filters Toggle Button - Desktop */}
                    <div className="hidden lg:block mt-4">
                        <button
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className={`${styles.filterButton} w-full px-4 py-3 rounded-xl font-medium flex items-center justify-between transition-all duration-300`}
                        >
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-5 h-5" />
                                <span>Advanced Filters</span>
                            </div>
                            {showAdvancedFilters ? (
                                <ChevronUp className="w-5 h-5" />
                            ) : (
                                <ChevronDown className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Advanced Filters Panel */}
                    {showAdvancedFilters && (
                        <div className="mt-4">
                            <div className={`${styles.categoryContainer} rounded-xl p-4 sm:p-5`}>
                                <div className="flex items-center gap-2 mb-4">
                                    <Filter className={`${styles.filterIcon} w-5 h-5`} />
                                    <span className={`${styles.filterLabel} text-base font-bold`}>Advanced Filters</span>
                                </div>

                            <div className="space-y-4">
                                {/* Categories Filter */}
                                <div>
                                    <button
                                        onClick={() => toggleSection('categories')}
                                        className="w-full flex items-center justify-between mb-3"
                                    >
                                        <span className={`${styles.filterSubLabel} text-sm font-semibold`}>
                                            Categories
                                        </span>
                                        {expandedSections.categories ? (
                                            <ChevronUp className="w-4 h-4" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4" />
                                        )}
                                    </button>
                                    {expandedSections.categories && (
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map((category) => (
                                                <button
                                                    key={category}
                                                    onClick={() => setSelectedCategory(category)}
                                                    className={`${styles.categoryChip} ${selectedCategory === category ? styles.categoryChipActive : ''
                                                        } px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300`}
                                                >
                                                    {category}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Tools Filter */}
                                <div>
                                    <button
                                        onClick={() => toggleSection('tools')}
                                        className="w-full flex items-center justify-between mb-3"
                                    >
                                        <span className={`${styles.filterSubLabel} text-sm font-semibold`}>
                                            Tools & Technologies
                                        </span>
                                        {expandedSections.tools ? (
                                            <ChevronUp className="w-4 h-4" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4" />
                                        )}
                                    </button>
                                    {expandedSections.tools && (
                                        <div className="flex flex-wrap gap-2">
                                            {tools.map((tool) => (
                                                <button
                                                    key={tool}
                                                    onClick={() => setSelectedTool(tool)}
                                                    className={`${styles.categoryChip} ${selectedTool === tool ? styles.categoryChipActive : ''
                                                        } px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300`}
                                                >
                                                    {tool}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Duration Filter */}
                                <div>
                                    <button
                                        onClick={() => toggleSection('duration')}
                                        className="w-full flex items-center justify-between mb-3"
                                    >
                                        <span className={`${styles.filterSubLabel} text-sm font-semibold`}>
                                            Course Duration
                                        </span>
                                        {expandedSections.duration ? (
                                            <ChevronUp className="w-4 h-4" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4" />
                                        )}
                                    </button>
                                    {expandedSections.duration && (
                                        <div className="flex flex-wrap gap-2">
                                            {durations.map((duration) => (
                                                <button
                                                    key={duration}
                                                    onClick={() => setSelectedDuration(duration)}
                                                    className={`${styles.categoryChip} ${selectedDuration === duration ? styles.categoryChipActive : ''
                                                        } px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300`}
                                                >
                                                    {duration}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Rating Filter */}
                                <div>
                                    <button
                                        onClick={() => toggleSection('rating')}
                                        className="w-full flex items-center justify-between mb-3"
                                    >
                                        <span className={`${styles.filterSubLabel} text-sm font-semibold`}>
                                            Minimum Rating
                                        </span>
                                        {expandedSections.rating ? (
                                            <ChevronUp className="w-4 h-4" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4" />
                                        )}
                                    </button>
                                    {expandedSections.rating && (
                                        <div className="flex flex-wrap gap-2">
                                            {ratingOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setSelectedRating(option.value)}
                                                    className={`${styles.categoryChip} ${selectedRating === option.value ? styles.categoryChipActive : ''
                                                        } px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1`}
                                                >
                                                    {option.value > 0 && <Star className="w-3 h-3 fill-current" />}
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        </div>
                    )}
                </div>

                {/* Course Grid */}
                {courses.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10 lg:mb-12">
                            {courses.map((course) => (
                                <div
                                    key={course._id}
                                    onClick={() => router.push(`/courses/${course._id}`)}
                                    className={`${styles.courseCard} group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 cursor-pointer`}
                                >
                                    {/* Course Image */}
                                    <div className="relative w-full h-44 sm:h-48 lg:h-52 overflow-hidden">
                                        <div className={`${styles.imageOverlay} absolute inset-0 z-10`}></div>
                                        <Image
                                            src={course.courseFlyerURL}
                                            alt={course.courseName}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />

                                        {/* Category Badge */}
                                        <div className={`${styles.categoryBadge} absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold z-20`}>
                                            {course.courseCategory}
                                        </div>

                                        {/* Trending Badge */}
                                        {course.rating >= 4.8 && (
                                            <div className={`${styles.trendingBadge} absolute top-4 right-4 p-2 rounded-lg z-20`}>
                                                <TrendingUp className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Course Content */}
                                    <div className={`${styles.courseContent} p-4 sm:p-5`}>
                                        {/* Instructor */}
                                        <p className={`${styles.instructorName} text-xs font-semibold mb-2 uppercase tracking-wider`}>
                                            {course.instructorName}
                                        </p>

                                        {/* Course Name */}
                                        <h3 className={`${styles.courseName} text-base sm:text-lg font-bold mb-3 line-clamp-2 leading-tight min-h-12 sm:min-h-14`}>
                                            {course.courseName}
                                        </h3>

                                        {/* Duration */}
                                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                            <Clock className={`${styles.clockIcon} w-4 h-4`} />
                                            <span className={`${styles.duration} text-xs sm:text-sm font-medium`}>
                                                {course.duration}
                                            </span>
                                        </div>

                                        {/* Divider */}
                                        <div className={`${styles.divider} h-px w-full mb-3 sm:mb-4`}></div>

                                        {/* Bottom Section */}
                                        <div className="flex items-center justify-between">
                                            {/* Rating */}
                                            <div className="flex items-center gap-1 sm:gap-1.5">
                                                <Star className={`${styles.starIcon} w-4 h-4 sm:w-5 sm:h-5 fill-current`} />
                                                <span className={`${styles.ratingText} text-sm sm:text-base font-bold`}>
                                                    {course.rating.toFixed(1)}
                                                </span>
                                            </div>

                                            {/* Enrollment Count */}
                                            {course.numberOfUserEnrolled && course.numberOfUserEnrolled > 0 && (
                                                <div className="flex items-center gap-1 sm:gap-1.5">
                                                    <span className={`${styles.enrollmentText} text-xs sm:text-sm font-semibold`}>
                                                        {formatEnrollment(course.numberOfUserEnrolled)} students
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination - Always Show */}
                        <Pagination
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                            hasNextPage={pagination.hasNextPage}
                            hasPrevPage={pagination.hasPrevPage}
                            totalCourses={pagination.totalCourses}
                            pageSize={pagination.pageSize}
                            onPageChange={handlePageChange}
                            alwaysShow={true}
                        />
                    </>
                ) : (
                    <div className={`${styles.noResults} text-center py-16 sm:py-20 lg:py-24`}>
                        <div className={`${styles.noResultsIcon} w-28 h-28 sm:w-30 sm:h-30 mx-auto mb-6 rounded-full flex items-center justify-center`}>
                            <Search className="w-10 h-10 sm:w-12 sm:h-12" />
                        </div>
                        <h3 className={`${styles.noResultsTitle} text-xl sm:text-2xl font-bold mb-3`}>
                            No courses found
                        </h3>
                        <p className={`${styles.noResultsText} text-sm sm:text-base mb-6`}>
                            Try adjusting your search or filters to find what you&apos;re looking for
                        </p>
                        <button
                            onClick={clearAllFilters}
                            className={`${styles.resetButton} px-6 py-3 rounded-xl font-semibold text-sm sm:text-base`}
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}