/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import {
    Star,
    Edit2,
    Trash2,
    Eye,
    BookOpen,
    Calendar,
    MessageSquare
} from 'lucide-react';
import styles from './UserComponents.module.scss';
import AlertDialog from '../ui/AlertDialog';
import Toast from '../ui/Toast';
import { useUser } from '@/hooks/useUserHook';
import { Rating as BaseRating } from '@/types/userTypes';

// Extended Rating type with course details
interface CourseDetails {
    _id: string;
    courseName: string;
    courseCategory: string;
    instructorName: string;
    description: string;
    rating: number;
    startingDate: string;
    duration: string;
    price: number;
    courseFlyerURL: string;
    totalRatings: number;
}

interface Rating extends Omit<BaseRating, 'courseId'> {
    courseId: CourseDetails;
}

export default function UserRatings() {
    // Redux hooks
    const {
        ratings: reduxRatings,
        loading,
        error,
        getAllUserRatings,
        updateRating,
        deleteRating
    } = useUser();

    // Cast to extended Rating type (API returns course details)
    const ratings = (reduxRatings as unknown) as Rating[];

    // Local state for UI
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Edit form state
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState('');

    // Fetch ratings on mount and page change
    useEffect(() => {
        getAllUserRatings(currentPage, 10);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDeleteClick = (rating: Rating) => {
        setSelectedRating(rating);
        setShowDeleteDialog(true);
    };

    const handleEditClick = (rating: Rating) => {
        setSelectedRating(rating);
        setEditRating(rating.rating);
        setEditComment(rating.comment);
        setShowEditDialog(true);
    };

    const handleViewClick = (rating: Rating) => {
        setSelectedRating(rating);
        setShowViewDialog(true);
    };

    const handleDelete = async () => {
        if (!selectedRating) return;

        setIsDeleting(true);

        try {
            // Extract courseId from the courseId object
            const courseId = selectedRating.courseId._id;

            await deleteRating(courseId);
            setToastMessage('Rating deleted successfully');
            setShowSuccessToast(true);
            setShowDeleteDialog(false);
            setSelectedRating(null);
            // Refresh ratings
            await getAllUserRatings(currentPage, 10);
        } catch (error: any) {
            setToastMessage(error?.message || 'Failed to delete rating');
            setShowErrorToast(true);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!selectedRating) return;

        if (editRating === 0) {
            setToastMessage('Please select a rating');
            setShowErrorToast(true);
            return;
        }

        setIsSaving(true);

        try {
            // Extract courseId from the courseId object
            const courseId = selectedRating.courseId._id;

            await updateRating({
                courseId: courseId,
                rating: editRating,
                comment: editComment
            });
            setToastMessage('Rating updated successfully');
            setShowSuccessToast(true);
            setShowEditDialog(false);
            setSelectedRating(null);
            // Refresh ratings
            await getAllUserRatings(currentPage, 10);
        } catch (error: any) {
            setToastMessage(error?.message || 'Failed to update rating');
            setShowErrorToast(true);
        } finally {
            setIsSaving(false);
        }
    };

    const hasNoRatings = ratings.length === 0;

    const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
        return (
            <div className={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => interactive && onRatingChange && onRatingChange(star)}
                        disabled={!interactive}
                        className={`${styles.starButton} ${interactive ? styles.interactive : ''}`}
                    >
                        <Star
                            size={interactive ? 32 : 20}
                            className={star <= rating ? styles.starFilled : styles.starEmpty}
                            fill={star <= rating ? 'currentColor' : 'none'}
                        />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className={`min-h-screen py-6 sm:py-8 lg:py-12 ${styles.profilePage}`}>
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-6 sm:mb-8 lg:mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-3 leading-tight ${styles.pageTitle}`}>
                                My <span className={styles.gradientText}>Ratings</span>
                            </h1>
                            <p className={`text-base sm:text-lg ${styles.pageSubtitle}`}>
                                {hasNoRatings
                                    ? 'You haven\'t rated any courses yet'
                                    : `You have rated ${ratings.length} ${ratings.length === 1 ? 'course' : 'courses'}`
                                }
                            </p>
                        </div>

                        {/* Stats Badge */}
                        {!hasNoRatings && (
                            <div className={`${styles.statsBadge} px-6 py-3 rounded-xl`}>
                                <div className="flex items-center gap-2">
                                    <Star size={20} className={styles.statsIcon} />
                                    <span className="font-bold text-lg">{ratings.length}</span>
                                    <span className={styles.statsLabel}>Ratings</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Empty State */}
                {hasNoRatings ? (
                    <div className={`${styles.emptyState} rounded-2xl p-8 sm:p-12 text-center`}>
                        <div className={styles.emptyStateIcon}>
                            <Star size={64} />
                        </div>
                        <h3 className={`text-2xl font-bold mb-3 ${styles.emptyStateTitle}`}>
                            No Ratings Yet
                        </h3>
                        <p className={`text-base mb-6 ${styles.emptyStateText}`}>
                            Start rating courses to share your experience
                        </p>
                    </div>
                ) : (
                    /* Ratings List */
                    <div className="space-y-4 sm:space-y-6">
                        {ratings.map((rating) => (
                            <div
                                key={rating._id}
                                className={`${styles.ratingCard} rounded-2xl p-5 sm:p-6 lg:p-8 transition-all duration-300`}
                            >
                                {/* Rating Header */}
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <BookOpen size={20} className={styles.ratingIcon} />
                                            <h3 className={styles.ratingCourseTitle}>
                                                {rating.courseId.courseName}
                                            </h3>
                                        </div>
                                        <p className={styles.ratingCategory}>
                                            {rating.courseId.courseCategory}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleViewClick(rating)}
                                            className={`${styles.iconActionBtn} ${styles.viewBtn}`}
                                            title="View details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(rating)}
                                            className={`${styles.iconActionBtn} ${styles.editActionBtn}`}
                                            title="Edit rating"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(rating)}
                                            className={`${styles.iconActionBtn} ${styles.deleteActionBtn}`}
                                            title="Delete rating"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Rating Stars */}
                                <div className="mb-4">
                                    {renderStars(rating.rating)}
                                </div>

                                {/* Comment */}
                                <div className={styles.ratingCommentContainer}>
                                    <div className="flex items-start gap-2 mb-2">
                                        <MessageSquare size={18} className={styles.commentIcon} />
                                        <h4 className={styles.commentLabel}>Your Review</h4>
                                    </div>
                                    <p className={styles.ratingComment}>
                                        {rating.comment}
                                    </p>
                                </div>

                                {/* Rating Footer */}
                                <div className={`${styles.ratingFooter} flex flex-wrap items-center gap-4 mt-4 pt-4`}>
                                    <div className={styles.ratingDate}>
                                        <Calendar size={14} />
                                        <span>Rated on {formatDate(rating.createdAt)}</span>
                                    </div>
                                    {rating.updatedAt !== rating.createdAt && (
                                        <div className={styles.ratingDate}>
                                            <Edit2 size={14} />
                                            <span>Updated {formatDate(rating.updatedAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                isOpen={showDeleteDialog}
                onClose={() => {
                    if (!isDeleting) {
                        setShowDeleteDialog(false);
                        setSelectedRating(null);
                    }
                }}
                onConfirm={handleDelete}
                title="Delete Rating"
                description={`Are you sure you want to delete your rating for "${selectedRating?.courseId.courseName}"? This action cannot be undone.`}
                confirmText="Yes, Delete"
                cancelText="Cancel"
                variant="danger"
                isLoading={isDeleting}
            />

            {/* Edit Rating Dialog */}
            {showEditDialog && selectedRating && (
                <div className={styles.modalBackdrop}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>Edit Your Rating</h2>
                        <p className={styles.modalSubtitle}>{selectedRating.courseId.courseName}</p>

                        {/* Star Rating */}
                        <div className="mb-6">
                            <label className={styles.formLabel}>Rating</label>
                            {renderStars(editRating, true, setEditRating)}
                        </div>

                        {/* Comment */}
                        <div className="mb-6 w-full">
                            <label className={styles.formLabel}>Your Review</label>
                            <textarea
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                                className={`${styles.textarea} w-full`}
                                placeholder="Share your experience with this course..."
                                rows={4}
                                maxLength={500}
                                disabled={isSaving}
                            />
                            <div className={styles.charCount}>
                                {editComment.length}/500 characters
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleSaveEdit}
                                disabled={isSaving}
                                className={`${styles.saveBtn} flex-1 py-3 rounded-xl font-semibold text-base flex items-center justify-center gap-2`}
                            >
                                {isSaving ? (
                                    <>
                                        <div className={styles.spinner} />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                            <button
                                onClick={() => !isSaving && setShowEditDialog(false)}
                                disabled={isSaving}
                                className={`${styles.cancelBtn} flex-1 py-3 rounded-xl font-semibold text-base`}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Rating Dialog */}
            {showViewDialog && selectedRating && (
                <div className={styles.modalBackdrop} onClick={() => setShowViewDialog(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>Rating Details</h2>
                        <p className={styles.modalSubtitle}>{selectedRating.courseId.courseName}</p>
                        <p className={`${styles.modalCategory} mb-4`}>{selectedRating.courseId.courseCategory}</p>

                        <div className="mb-6">
                            <label className={styles.formLabel}>Your Rating</label>
                            {renderStars(selectedRating.rating)}
                        </div>

                        <div className="mb-6">
                            <label className={styles.formLabel}>Your Review</label>
                            <p className={styles.viewComment}>{selectedRating.comment}</p>
                        </div>

                        <div className="mb-6">
                            <label className={styles.formLabel}>Timeline</label>
                            <div className="space-y-2">
                                <p className={styles.viewDate}>
                                    <Calendar size={16} />
                                    Created: {formatDate(selectedRating.createdAt)}
                                </p>
                                {selectedRating.updatedAt !== selectedRating.createdAt && (
                                    <p className={styles.viewDate}>
                                        <Edit2 size={16} />
                                        Updated: {formatDate(selectedRating.updatedAt)}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => setShowViewDialog(false)}
                            className={`${styles.primaryBtn} w-full py-3 rounded-xl font-semibold text-base`}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            <Toast
                isVisible={showSuccessToast}
                onClose={() => setShowSuccessToast(false)}
                title={toastMessage}
                variant="success"
                duration={2000}
                position="top-right"
                showCloseButton={false}
            />

            {/* Error Toast */}
            <Toast
                isVisible={showErrorToast}
                onClose={() => setShowErrorToast(false)}
                title={toastMessage}
                variant="error"
                duration={2000}
                position="top-right"
                showCloseButton={false}
            />
        </div>
    );
}
