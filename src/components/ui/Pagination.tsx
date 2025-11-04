'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import styles from './Pagination.module.scss';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    totalCourses: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    maxVisiblePages?: number;
    alwaysShow?: boolean;
}

export default function Pagination({
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    totalCourses,
    pageSize,
    onPageChange,
    maxVisiblePages = 5,
    alwaysShow = false
}: PaginationProps): React.JSX.Element {

    // Calculate which page numbers to show
    const getVisiblePages = (): number[] => {
        const pages: number[] = [];

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than max
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show pages around current page
            const halfVisible = Math.floor(maxVisiblePages / 2);
            let startPage = Math.max(1, currentPage - halfVisible);
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            // Adjust if we're near the end
            if (endPage - startPage < maxVisiblePages - 1) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }

        return pages;
    };

    const visiblePages = getVisiblePages();
    const showFirstPage = visiblePages[0] > 1;
    const showLastPage = visiblePages[visiblePages.length - 1] < totalPages;

    // Calculate range display
    const startRange = (currentPage - 1) * pageSize + 1;
    const endRange = Math.min(currentPage * pageSize, totalCourses);

    // Don't render if there's only one page and alwaysShow is false
    if (totalPages <= 1 && !alwaysShow) {
        return <></>;
    }

    return (
        <div className={`${styles.paginationContainer} flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6`}>
            {/* Results Info - Left */}
            <div className={`${styles.pageInfo} text-sm order-2 sm:order-1`}>
                Showing <strong>{startRange}-{endRange}</strong> of <strong>{totalCourses}</strong> courses
            </div>

            {/* Pagination Buttons - Center */}
            <div className="flex items-center gap-2 order-1 sm:order-2">
                {/* First Page Button */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={!hasPrevPage}
                    className={`${styles.paginationButton} ${styles.paginationArrow} hidden sm:flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300`}
                    aria-label="First page"
                    title="First page"
                >
                    <ChevronsLeft className="w-5 h-5" />
                </button>

                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPrevPage}
                    className={`${styles.paginationButton} ${styles.paginationArrow} flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300`}
                    aria-label="Previous page"
                    title="Previous page"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* First Page Number (if not visible) */}
                {showFirstPage && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className={`${styles.paginationButton} ${styles.paginationNumber} hidden sm:flex items-center justify-center min-w-10 h-10 px-3 rounded-lg font-semibold text-sm transition-all duration-300`}
                        >
                            1
                        </button>
                        {visiblePages[0] > 2 && (
                            <span className={`${styles.paginationEllipsis} hidden sm:flex items-center justify-center w-10 h-10`}>
                                ...
                            </span>
                        )}
                    </>
                )}

                {/* Page Numbers */}
                {visiblePages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`${styles.paginationButton} ${styles.paginationNumber} ${currentPage === page ? styles.paginationActive : ''
                            } flex items-center justify-center min-w-10 h-10 px-3 rounded-lg font-semibold text-sm transition-all duration-300`}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                    >
                        {page}
                    </button>
                ))}

                {/* Last Page Number (if not visible) */}
                {showLastPage && (
                    <>
                        {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                            <span className={`${styles.paginationEllipsis} hidden sm:flex items-center justify-center w-10 h-10`}>
                                ...
                            </span>
                        )}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className={`${styles.paginationButton} ${styles.paginationNumber} hidden sm:flex items-center justify-center min-w-10 h-10 px-3 rounded-lg font-semibold text-sm transition-all duration-300`}
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className={`${styles.paginationButton} ${styles.paginationArrow} flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300`}
                    aria-label="Next page"
                    title="Next page"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                {/* Last Page Button */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={!hasNextPage}
                    className={`${styles.paginationButton} ${styles.paginationArrow} hidden sm:flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300`}
                    aria-label="Last page"
                    title="Last page"
                >
                    <ChevronsRight className="w-5 h-5" />
                </button>
            </div>

            {/* Page Info - Right (Mobile) */}
            <div className={`${styles.pageInfo} text-sm sm:hidden order-3 text-center w-full`}>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </div>
        </div>
    );
}