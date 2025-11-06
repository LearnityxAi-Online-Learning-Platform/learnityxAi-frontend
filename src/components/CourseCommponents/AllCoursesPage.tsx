/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { useCourse } from '@/hooks/useCourseHook';
import Pagination from '@/components/ui/Pagination';
import courseService from '@/services/courseService';
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

const ratingOptions = [
    { label: "All Ratings", value: 0 },
    { label: "4.5 & above", value: 4.5 },
    { label: "4.0 & above", value: 4.0 },
    { label: "3.5 & above", value: 3.5 },
    { label: "3.0 & above", value: 3.0 }
];

// Fallback data for filter options if API fails
const FALLBACK_CATEGORIES = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Artificial Intelligence',
    'Cloud Computing',
    'Cybersecurity',
    'DevOps'
];

const FALLBACK_TOOLS = [
    'JavaScript',
    'Python',
    'React',
    'Node.js',
    'Docker',
    'AWS',
    'Git',
    'MongoDB'
];

const FALLBACK_DURATIONS = [
    '4 weeks',
    '8 weeks',
    '12 weeks',
    '6 months'
];

export default function AllCoursesPage(): React.JSX.Element {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { courses: apiCourses, total, page: currentPage, totalPages, loading, getAllCourses, searchCoursesQuery } = useCourse();

    // Initialize search from URL query params
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlTools = searchParams.get('tools') || '';

    const [searchQuery, setSearchQuery] = useState(urlSearch);
    const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'All Categories');
    const [selectedTool, setSelectedTool] = useState(urlTools || 'All Tools');
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState<'rating' | 'price' | 'enrollmentCount' | 'createdAt'>('enrollmentCount');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        tools: false,
        rating: false
    });

    // Dynamic filter options from API with localStorage caching
    const [categories, setCategories] = useState<string[]>(['All Categories']);
    const [tools, setTools] = useState<string[]>(['All Tools']);
    const [durations, setDurations] = useState<string[]>([]);
    const [filterOptionsLoading, setFilterOptionsLoading] = useState(true);

    // Fetch filter options on component mount - directly from backend without caching
    useEffect(() => {
        const fetchFilterOptions = async () => {
            setFilterOptionsLoading(true);

            try {
                // Fetch all filter options directly from backend in parallel
                const [categoriesData, toolsData, durationsData] = await Promise.all([
                    courseService.getCategories(),
                    courseService.getTools(),
                    courseService.getDurations()
                ]);

                // Update all states at once
                setCategories(['All Categories', ...categoriesData]);
                setTools(['All Tools', ...toolsData]);
                setDurations(durationsData);
            } catch (error) {
                console.error('Error fetching filter options:', error);
                // Fallback to default values if API fails
                setCategories(['All Categories', ...FALLBACK_CATEGORIES]);
                setTools(['All Tools', ...FALLBACK_TOOLS]);
                setDurations(FALLBACK_DURATIONS);
            } finally {
                setFilterOptionsLoading(false);
            }
        };

        fetchFilterOptions();
    }, []);

    // Map API courses to component interface
    const courses: Course[] = (apiCourses || []).map((course: any) => ({
        _id: course._id,
        courseName: course.courseName || course.title,
        courseCategory: course.courseCategory || course.category,
        instructorName: course.instructorName || `${course.instructor?.firstName || ''} ${course.instructor?.lastName || ''}`.trim(),
        description: course.description,
        rating: course.rating || 0,
        skills: course.skills || [],
        tools: course.tools || [],
        startingDate: course.startingDate || course.createdAt,
        duration: typeof course.duration === 'string' ? course.duration : `${course.duration} weeks`,
        price: course.price || 0,
        courseFlyerURL: course.courseFlyerURL || course.thumbnail || '/placeholder-course.jpg',
        numberOfUserEnrolled: course.numberOfUserEnrolled || course.enrollmentCount || 0,
    }));

    // Fetch courses with filters
    const fetchCourses = async (pageNumber: number = 1) => {
        const params: any = {
            page: pageNumber,
            size: 12,
            sortBy,
            sortOrder,
        };

        // Add filters only if they're not default values
        if (selectedCategory && selectedCategory !== 'All Categories') {
            params.category = selectedCategory;
        }
        if (selectedTool && selectedTool !== 'All Tools') {
            params.tools = selectedTool;
        }
        if (minRating > 0) {
            params.minRating = minRating;
        }
        if (searchQuery.trim()) {
            params.search = searchQuery.trim();
        }

        try {
            await getAllCourses(params);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        }
    };

    // Fetch courses on mount and when filters change
    useEffect(() => {
        fetchCourses(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory, selectedTool, minRating, sortBy, sortOrder, searchQuery]);

    // Handle URL search and category param changes
    useEffect(() => {
        const urlSearchParam = searchParams.get('search');
        const urlCategoryParam = searchParams.get('category');

        // Handle search parameter
        if (urlSearchParam && urlSearchParam !== searchQuery) {
            setSearchQuery(urlSearchParam);
        } else if (!urlSearchParam && searchQuery && !urlCategoryParam) {
            // Clear search if URL has no search param but local state does (and no category param)
            setSearchQuery('');
        }

        // Handle category parameter
        if (urlCategoryParam) {
            // Set the category from URL if it exists in our categories list
            if (categories.includes(urlCategoryParam)) {
                setSelectedCategory(urlCategoryParam);
            } else {
                // If category from URL doesn't exist in list, still set it (backend will validate)
                setSelectedCategory(urlCategoryParam);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

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

    const handlePageChange = (pageNumber: number) => {
        fetchCourses(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSortChange = (value: string) => {
        switch (value) {
            case 'popular':
                setSortBy('enrollmentCount');
                setSortOrder('desc');
                break;
            case 'rating':
                setSortBy('rating');
                setSortOrder('desc');
                break;
            case 'newest':
                setSortBy('createdAt');
                setSortOrder('desc');
                break;
            case 'price-low':
                setSortBy('price');
                setSortOrder('asc');
                break;
            case 'price-high':
                setSortBy('price');
                setSortOrder('desc');
                break;
            default:
                setSortBy('enrollmentCount');
                setSortOrder('desc');
        }
    };

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedCategory('All Categories');
        setSelectedTool('All Tools');
        setMinRating(0);
        setSortBy('enrollmentCount');
        setSortOrder('desc');
        // Clear URL params
        router.push('/courses');
    };

    const hasActiveFilters =
        searchQuery !== '' ||
        selectedCategory !== 'All Categories' ||
        selectedTool !== 'All Tools' ||
        minRating !== 0;

    return (
        <div className={`${styles.allCoursesPage} min-h-screen py-6 sm:py-8 lg:py-12`}>
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 sm:mb-10 lg:mb-12">
                    <h1 className={`${styles.pageTitle} text-3xl sm:text-4xl lg:text-5xl font-black mb-3 leading-tight`}>
                        All <span className={styles.gradientText}>Courses</span>
                    </h1>
                    <p className={`${styles.pageSubtitle} text-base sm:text-lg`}>
                        Explore {total || 0} courses to advance your skills
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
                                placeholder="Search by course name, skills, or tools..."
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
                                onChange={(e) => handleSortChange(e.target.value)}
                                defaultValue="popular"
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
                                {minRating > 0 && <span className="ml-2">• Rating: {minRating}+</span>}
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
                                                    onClick={() => setMinRating(option.value)}
                                                    className={`${styles.categoryChip} ${minRating === option.value ? styles.categoryChipActive : ''
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
                {loading ? (
                    // Loading skeletons
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10 lg:mb-12">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className={`${styles.courseCard} rounded-2xl overflow-hidden animate-pulse`}>
                                <div className="w-full h-44 sm:h-48 lg:h-52 bg-gray-200 dark:bg-gray-700"></div>
                                <div className="p-4 sm:p-5 space-y-3">
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : courses.length > 0 ? (
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
                            currentPage={currentPage}
                            totalPages={totalPages}
                            hasNextPage={currentPage < totalPages}
                            hasPrevPage={currentPage > 1}
                            totalCourses={total}
                            pageSize={12}
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
