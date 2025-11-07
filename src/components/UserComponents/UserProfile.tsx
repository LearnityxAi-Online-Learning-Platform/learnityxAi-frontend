/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
    User,
    Mail,
    Phone,
    Calendar,
    Shield,
    Edit2,
    Camera,
    CheckCircle,
    XCircle,
    Clock,
    Save,
    X,
    AlertCircle,
    Upload
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuthHook';
import { useFileUpload } from '@/hooks/useFileUploadHook';
import styles from './UserComponents.module.scss';
import AlertDialog from '../ui/AlertDialog';
import Toast from '../ui/Toast';

interface UserData {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phone: string;
    profileImage: string;
    bio: string;
    isEmailVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    lastLogin: string;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: {
        user: UserData;
    };
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    bio?: string;
}

export default function UserProfile() {
    // Get user data from Redux
    const { user, updateProfile, deleteAccount, getUserProfile, loading } = useAuth();
    const { uploadProfileImage, loading: uploadLoading } = useFileUpload();

    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<UserData | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [backendErrorTimestamp, setBackendErrorTimestamp] = useState<number>(0);

    // Initialize editedUser when user data is available
    useEffect(() => {
        if (user && !editedUser) {
            setEditedUser(user as UserData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Fetch user profile on mount if not available
    useEffect(() => {
        if (!user) {
            getUserProfile();
        }
    }, [user, getUserProfile]);

    if (!user || !editedUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className={styles.spinner} />
            </div>
        );
    }

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getInitials = (): string => {
        return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!editedUser.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (editedUser.firstName.length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        }

        if (!editedUser.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (editedUser.lastName.length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!editedUser.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(editedUser.email)) {
            newErrors.email = 'Invalid email format';
        }

        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        if (editedUser.phone && !phoneRegex.test(editedUser.phone)) {
            newErrors.phone = 'Invalid phone format';
        }

        if (editedUser.bio && editedUser.bio.length > 500) {
            newErrors.bio = 'Bio must be less than 500 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditedUser({ ...user } as UserData);
        setErrors({});
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedUser({ ...user } as UserData);
        setErrors({});
    };

    const handleSave = async () => {
        if (!validateForm()) {
            setErrorMessage('Please fix the validation errors');
            setShowErrorToast(true);
            return;
        }

        try {
            await updateProfile({
                firstName: editedUser.firstName.trim(),
                lastName: editedUser.lastName.trim(),
                phone: editedUser.phone,
                bio: editedUser.bio,
                profileImage: editedUser.profileImage
            });

            setIsEditing(false);
            setSuccessMessage('Profile updated successfully!');
            setShowSuccessToast(true);
            // Refresh user profile to get updated data
            await getUserProfile();
        } catch (error: any) {
            const errMsg = error || 'Failed to update profile. Please try again.';
            setErrorMessage(typeof errMsg === 'string' ? errMsg : errMsg?.message || 'Failed to update profile. Please try again.');
            setShowErrorToast(true);
            setBackendErrorTimestamp(Date.now());
        }
    };

    const handleInputChange = (field: keyof UserData, value: string) => {
        setEditedUser({ ...editedUser, [field]: value });
        if (errors[field as keyof FormErrors]) {
            setErrors({ ...errors, [field]: undefined });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const imageUrl = await uploadProfileImage(file);
                if (imageUrl) {
                    // Update the edited user state with the new image URL
                    setEditedUser({ ...editedUser, profileImage: imageUrl });
                    // Don't auto-save - user needs to click "Save Changes" button
                    setSuccessMessage('Image uploaded successfully! Click "Save Changes" to update your profile.');
                    setShowSuccessToast(true);
                }
            } catch (error: any) {
                const errMsg = error || 'Failed to upload profile image. Please try again.';
                setErrorMessage(typeof errMsg === 'string' ? errMsg : errMsg?.message || 'Failed to upload profile image. Please try again.');
                setShowErrorToast(true);
            }
        }
    };

    const handleDeleteAccount = async () => {
        try {
            // deleteAccount expects a password
            // The AlertDialog component will handle password input
            await deleteAccount({ password: '' }); // Password should come from the dialog
            setShowDeleteDialog(false);
            // Redirect to home page after account deletion
            window.location.href = '/';
        } catch (error: any) {
            const errMsg = error || 'Failed to delete account. Please try again.';
            setErrorMessage(typeof errMsg === 'string' ? errMsg : errMsg?.message || 'Failed to delete account. Please try again.');
            setShowErrorToast(true);
            setShowDeleteDialog(false);
        }
    };

    return (
        <div className={`min-h-screen py-6 sm:py-8 lg:py-12 ${styles.profilePage}`}>
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* Page Header */}
                <div className="mb-6 sm:mb-8 lg:mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-3 leading-tight ${styles.pageTitle}`}>
                                My <span className={styles.gradientText}>Profile</span>
                            </h1>
                            <p className={`text-base sm:text-lg ${styles.pageSubtitle}`}>
                                {isEditing ? 'Update your information' : 'Manage your account information and preferences'}
                            </p>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={handleEdit}
                                className={`${styles.primaryBtn} px-6 py-3 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 w-full sm:w-auto`}
                            >
                                <Edit2 size={18} />
                                <span>Edit Profile</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className={`${styles.profileCard} rounded-2xl p-6 sm:p-8 text-center sticky top-6`}>
                            {/* Profile Image */}
                            <div className="relative inline-block mb-6">
                                <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-black mx-auto ${styles.avatar} overflow-hidden`}>
                                    {(isEditing ? editedUser.profileImage : user.profileImage) ? (
                                        <Image
                                            src={isEditing ? editedUser.profileImage : user.profileImage}
                                            alt={`${user.firstName} ${user.lastName}`}
                                            width={128}
                                            height={128}
                                            className="rounded-full object-cover w-full h-full"
                                        />
                                    ) : (
                                        <span>{getInitials()}</span>
                                    )}

                                    {/* Upload Progress Overlay */}
                                    {uploadLoading && (
                                        <div className={styles.uploadOverlay}>
                                            <div className={styles.uploadContent}>
                                                <div className={`${styles.spinner} mx-auto mb-2`} />
                                                <div className="flex flex-col items-center gap-1">
                                                    <Upload size={20} className={styles.uploadIcon} />
                                                    <span className={styles.uploadText}>Uploading...</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* Edit Photo Button */}
                                {isEditing && !uploadLoading && (
                                    <label
                                        className={`${styles.editPhotoBtn} absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer`}
                                    >
                                        <Camera size={18} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            {/* User Name */}
                            <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${styles.userName}`}>
                                {user.firstName} {user.lastName}
                            </h2>

                            {/* Role Badge */}
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold mb-6 ${styles.roleBadge}`}>
                                <Shield size={16} />
                                <span className="capitalize">{user.role}</span>
                            </div>

                            {/* Status Indicators */}
                            <div className={`${styles.statusContainer} space-y-3 mb-6 p-4 rounded-xl`}>
                                {/* <div className={`flex items-center justify-center gap-2 text-sm ${user.isEmailVerified ? styles.verified : styles.unverified}`}>
                                    {user.isEmailVerified ? (
                                        <>
                                            <CheckCircle size={16} />
                                            <span>Email Verified</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle size={16} />
                                            <span>Email Not Verified</span>
                                        </>
                                    )}
                                </div> */}
                                <div className={`flex items-center justify-center gap-2 text-sm ${user.isActive ? styles.active : styles.inactive}`}>
                                    {user.isActive ? (
                                        <>
                                            <CheckCircle size={16} />
                                            <span>Account Active</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle size={16} />
                                            <span>Account Inactive</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {isEditing ? (
                                <div className="space-y-3">
                                    <button
                                        onClick={handleSave}
                                        disabled={loading || uploadLoading}
                                        className={`${styles.saveBtn} w-full py-3 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {loading ? (
                                            <>
                                                <div className={styles.spinner} />
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={loading || uploadLoading}
                                        className={`${styles.cancelBtn} w-full py-3 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <X size={18} />
                                        <span>Cancel</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleEdit}
                                    className={`${styles.editProfileBtn} w-full py-3 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105`}
                                >
                                    <Edit2 size={18} />
                                    <span>Edit Profile</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Personal Information Card */}
                        <div className={`${styles.infoCard} rounded-2xl p-5 sm:p-6 lg:p-8`}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className={`text-xl sm:text-2xl font-bold ${styles.cardTitle}`}>
                                    Personal Information
                                </h3>
                                {!isEditing && (
                                    <button
                                        onClick={handleEdit}
                                        className={`${styles.editBtn} p-2 rounded-lg transition-all hover:scale-110`}
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {/* First Name */}
                                <div className={`${styles.infoItem} p-4 rounded-xl`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <User size={18} className={styles.infoIcon} />
                                        <label className={`text-xs font-semibold uppercase tracking-wider ${styles.infoLabel}`}>
                                            First Name
                                        </label>
                                    </div>
                                    {isEditing ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={editedUser.firstName}
                                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                className={`${styles.input} w-full px-3 py-2 rounded-lg text-base sm:text-lg font-semibold border-2 transition-all duration-300 focus:outline-none`}
                                                placeholder="Enter first name"
                                            />
                                            {errors.firstName && (
                                                <p className={`${styles.errorText} text-xs mt-1 flex items-center gap-1`}>
                                                    <AlertCircle size={12} />
                                                    {errors.firstName}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className={`text-base sm:text-lg font-semibold ${styles.infoValue}`}>
                                            {user.firstName}
                                        </p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div className={`${styles.infoItem} p-4 rounded-xl`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <User size={18} className={styles.infoIcon} />
                                        <label className={`text-xs font-semibold uppercase tracking-wider ${styles.infoLabel}`}>
                                            Last Name
                                        </label>
                                    </div>
                                    {isEditing ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={editedUser.lastName}
                                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                className={`${styles.input} w-full px-3 py-2 rounded-lg text-base sm:text-lg font-semibold border-2 transition-all duration-300 focus:outline-none`}
                                                placeholder="Enter last name"
                                            />
                                            {errors.lastName && (
                                                <p className={`${styles.errorText} text-xs mt-1 flex items-center gap-1`}>
                                                    <AlertCircle size={12} />
                                                    {errors.lastName}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className={`text-base sm:text-lg font-semibold ${styles.infoValue}`}>
                                            {user.lastName}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className={`${styles.infoItem} p-4 rounded-xl sm:col-span-2`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Mail size={18} className={styles.infoIcon} />
                                        <label className={`text-xs font-semibold uppercase tracking-wider ${styles.infoLabel}`}>
                                            Email Address
                                        </label>
                                    </div>
                                    {isEditing ? (
                                        <div>
                                            <input
                                                type="email"
                                                value={editedUser.email}
                                                readOnly
                                                disabled
                                                className={`${styles.inputDisabled} w-full px-3 py-2 rounded-lg text-base sm:text-lg font-semibold border-2 transition-all duration-300 focus:outline-none cursor-not-allowed`}
                                                placeholder="Enter email address"
                                            />
                                            <p className={`${styles.infoText} text-xs mt-1 flex items-center gap-1`}>
                                                <AlertCircle size={12} />
                                                Email cannot be changed
                                            </p>
                                        </div>
                                    ) : (
                                        <p className={`text-base sm:text-lg font-semibold break-all ${styles.infoValue}`}>
                                            {user.email}
                                        </p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className={`${styles.infoItem} p-4 rounded-xl sm:col-span-2`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Phone size={18} className={styles.infoIcon} />
                                        <label className={`text-xs font-semibold uppercase tracking-wider ${styles.infoLabel}`}>
                                            Phone Number
                                        </label>
                                    </div>
                                    {isEditing ? (
                                        <div>
                                            <input
                                                type="tel"
                                                value={editedUser.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className={`${styles.input} w-full px-3 py-2 rounded-lg text-base sm:text-lg font-semibold border-2 transition-all duration-300 focus:outline-none`}
                                                placeholder="Enter phone number"
                                            />
                                            {errors.phone && (
                                                <p className={`${styles.errorText} text-xs mt-1 flex items-center gap-1`}>
                                                    <AlertCircle size={12} />
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className={`text-base sm:text-lg font-semibold ${styles.infoValue}`}>
                                            {user.phone || 'Not provided'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Bio Section */}
                            <div className={`${styles.infoItem} p-4 rounded-xl mt-4 sm:mt-6`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <User size={18} className={styles.infoIcon} />
                                    <label className={`text-xs font-semibold uppercase tracking-wider ${styles.infoLabel}`}>
                                        Bio
                                    </label>
                                </div>
                                {isEditing ? (
                                    <div>
                                        <textarea
                                            value={editedUser.bio}
                                            onChange={(e) => handleInputChange('bio', e.target.value)}
                                            className={`${styles.textarea} w-full px-3 py-2 rounded-lg text-sm sm:text-base border-2 transition-all duration-300 focus:outline-none resize-none`}
                                            placeholder="Tell us about yourself..."
                                            rows={4}
                                            maxLength={500}
                                        />
                                        <div className="flex items-center justify-between mt-2">
                                            <span className={`text-xs ${styles.charCount}`}>
                                                {editedUser.bio.length}/500 characters
                                            </span>
                                            {errors.bio && (
                                                <p className={`${styles.errorText} text-xs flex items-center gap-1`}>
                                                    <AlertCircle size={12} />
                                                    {errors.bio}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className={`text-sm sm:text-base leading-relaxed ${styles.infoValue}`}>
                                        {user.bio || 'No bio provided'}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Account Activity Card */}
                        <div className={`${styles.infoCard} rounded-2xl p-5 sm:p-6 lg:p-8`}>
                            <h3 className={`text-xl sm:text-2xl font-bold mb-6 ${styles.cardTitle}`}>
                                Account Activity
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {/* Created At */}
                                <div className={`${styles.infoItem} p-4 rounded-xl`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar size={18} className={styles.infoIcon} />
                                        <label className={`text-xs font-semibold uppercase tracking-wider ${styles.infoLabel}`}>
                                            Member Since
                                        </label>
                                    </div>
                                    <p className={`text-sm sm:text-base font-semibold ${styles.infoValue}`}>
                                        {formatDate(user.createdAt)}
                                    </p>
                                </div>

                                {/* Last Login */}
                                <div className={`${styles.infoItem} p-4 rounded-xl`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock size={18} className={styles.infoIcon} />
                                        <label className={`text-xs font-semibold uppercase tracking-wider ${styles.infoLabel}`}>
                                            Last Login
                                        </label>
                                    </div>
                                    <p className={`text-sm sm:text-base font-semibold ${styles.infoValue}`}>
                                        {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                                    </p>
                                </div>

                                {/* Updated At */}
                                <div className={`${styles.infoItem} p-4 rounded-xl sm:col-span-2`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar size={18} className={styles.infoIcon} />
                                        <label className={`text-xs font-semibold uppercase tracking-wider ${styles.infoLabel}`}>
                                            Last Updated
                                        </label>
                                    </div>
                                    <p className={`text-sm sm:text-base font-semibold ${styles.infoValue}`}>
                                        {formatDate(user.updatedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone - Account Deletion */}
                        <div className={`${styles.dangerCard} rounded-2xl p-5 sm:p-6 lg:p-8`}>
                            <h3 className={`text-xl sm:text-2xl font-bold mb-4 ${styles.dangerTitle}`}>
                                Danger Zone
                            </h3>
                            <div className={`${styles.dangerContent} p-4 rounded-xl`}>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <h4 className="font-bold text-base sm:text-lg mb-2">Delete Account</h4>
                                        <p className={`text-sm ${styles.dangerText}`}>
                                            Once you delete your account, there is no going back. Please be certain.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowDeleteDialog(true)}
                                        className={`${styles.deleteBtn} px-6 py-3 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 whitespace-nowrap`}
                                    >
                                        <AlertCircle size={18} />
                                        <span>Delete Account</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Account Confirmation Dialog */}
            <AlertDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account"
                description={`Are you absolutely sure you want to delete your account? This action cannot be undone and will delete all your data including:

• Your profile and personal information
• All your enrolled courses and progress
• Your learning history and achievements
• All associated records`}
                confirmText="Yes, Delete My Account"
                cancelText="Cancel"
                variant="danger"
                isLoading={loading}
                requirePassword={true}
            />

            {/* Success Toast Notification */}
            <Toast
                isVisible={showSuccessToast}
                onClose={() => setShowSuccessToast(false)}
                title={successMessage || "Profile updated successfully!"}
                variant="success"
                duration={3000}
                position="top-right"
                showCloseButton={false}
            />

            {/* Error Toast Notification */}
            <Toast
                isVisible={showErrorToast}
                onClose={() => setShowErrorToast(false)}
                title={errorMessage || "Failed to update profile"}
                variant="error"
                duration={3000}
                position="top-right"
                showCloseButton={false}
            />
        </div>
    );
}