"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, Phone, Calendar, Shield, Camera, Edit2, Save, X, Trash2, AlertTriangle, Upload } from "lucide-react";
import styles from "./InstructorComponents.module.scss";
import Toast from "../ui/Toast";
import AlertDialog from "../ui/AlertDialog";
import { useAuth } from "@/hooks/useAuthHook";
import { useFileUpload } from "@/hooks/useFileUploadHook";

interface UserProfile {
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

export default function InstructorProfile() {
  // Hooks
  const { user, updateProfile, deleteAccount, getUserProfile, loading: authLoading } = useAuth();
  const { uploadProfileImage, loading: uploadLoading } = useFileUpload();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', message: '', variant: 'success' as 'success' | 'error' });

  // Delete account dialog state
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    isLoading: false,
  });

  // Editable form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    profileImage: "",
  });

  // Initialize profile from Redux user
  useEffect(() => {
    if (user) {
      setProfile(user as UserProfile);
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        bio: user.bio || '',
        profileImage: user.profileImage || '',
      });
      setImagePreview(user.profileImage || '');
    }
  }, [user]);

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        try {
          await getUserProfile();
        } catch (err) {
          console.error("Error fetching profile:", err);
          setToastMessage({
            title: 'Error',
            message: 'Failed to load profile data',
            variant: 'error'
          });
          setShowToast(true);
        }
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync loading state
  useEffect(() => {
    setLoading(authLoading);
  }, [authLoading]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setToastMessage({
          title: 'Error',
          message: 'Image size should be less than 5MB',
          variant: 'error'
        });
        setShowToast(true);
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setToastMessage({
          title: 'Error',
          message: 'Please upload a valid image file',
          variant: 'error'
        });
        setShowToast(true);
        return;
      }

      try {
        const imageUrl = await uploadProfileImage(file);
        if (imageUrl) {
          setImagePreview(imageUrl);
          setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
          setToastMessage({
            title: 'Success',
            message: 'Image uploaded successfully! Click "Save Changes" to update your profile.',
            variant: 'success'
          });
          setShowToast(true);
        }
      } catch (err) {
        console.error('Error uploading image:', err);
        setToastMessage({
          title: 'Error',
          message: 'Failed to upload profile image. Please try again.',
          variant: 'error'
        });
        setShowToast(true);
      }
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form data
      setFormData({
        firstName: profile?.firstName || "",
        lastName: profile?.lastName || "",
        phone: profile?.phone || "",
        bio: profile?.bio || "",
        profileImage: profile?.profileImage || "",
      });
      setImagePreview(profile?.profileImage || "");
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone,
        bio: formData.bio,
        profileImage: formData.profileImage
      });

      setToastMessage({
        title: 'Success',
        message: 'Profile updated successfully!',
        variant: 'success'
      });
      setShowToast(true);
      setIsEditing(false);

      // Refresh user profile to get updated data
      await getUserProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      setToastMessage({
        title: 'Error',
        message: 'Failed to update profile. Please try again.',
        variant: 'error'
      });
      setShowToast(true);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleDeleteClick = () => {
    setDeleteDialog({
      isOpen: true,
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async (password?: string) => {
    setDeleteDialog((prev) => ({ ...prev, isLoading: true }));

    try {
      // deleteAccount expects a password from the AlertDialog component
      await deleteAccount({ password: password || '' });

      setToastMessage({
        title: 'Success',
        message: 'Account deleted successfully! Redirecting...',
        variant: 'success'
      });
      setShowToast(true);
      setDeleteDialog({ isOpen: false, isLoading: false });

      // Redirect to home page after deletion
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      console.error("Error deleting account:", err);
      setToastMessage({
        title: 'Error',
        message: 'Failed to delete account. Please try again.',
        variant: 'error'
      });
      setShowToast(true);
      setDeleteDialog((prev) => ({ ...prev, isLoading: false }));
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-full">
        <div className={`rounded-lg sm:rounded-xl border p-4 sm:p-6 mb-4 sm:mb-6 ${styles.formCard}`}>
          <div className="animate-pulse space-y-4 sm:space-y-6">
            {/* Profile Header Skeleton */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex-1 space-y-2 sm:space-y-3 text-center sm:text-left w-full">
                <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto sm:mx-0"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto sm:mx-0"></div>
              </div>
            </div>

            {/* Info Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 sm:h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>

            {/* Form Skeleton */}
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-10 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full max-w-full">
        <div className={`rounded-lg sm:rounded-xl border p-6 sm:p-8 text-center ${styles.formCard}`}>
          <div className={`text-base sm:text-lg ${styles.formLabel}`}>
            Failed to load profile data. Please try again.
          </div>
        </div>
        <Toast
          isVisible={showToast}
          onClose={() => setShowToast(false)}
          title={toastMessage.title}
          message={toastMessage.message}
          variant={toastMessage.variant}
          duration={3000}
          position="top-right"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full">{/*  */}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${styles.formTitle}`}>
            My Profile
          </h1>
          <p className={`text-xs sm:text-sm mt-1 ${styles.formLabel}`}>
            Manage your personal information and settings
          </p>
        </div>
        <button
          onClick={isEditing ? handleSave : handleEditToggle}
          disabled={isSaving}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
            isEditing ? styles.submitButton : styles.addButton
          }`}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : isEditing ? (
            <>
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Save Changes</span>
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Edit Profile</span>
            </>
          )}
        </button>
      </div>

      {/* Profile Card */}
      <div className={`rounded-lg sm:rounded-xl border p-4 sm:p-6 mb-4 sm:mb-6 ${styles.formCard}`}>
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-700">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-white font-bold text-2xl sm:text-4xl overflow-hidden relative"
              style={
                imagePreview
                  ? {
                      backgroundImage: `url(${imagePreview})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      minWidth: '6rem',
                      minHeight: '6rem'
                    }
                  : {
                      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      minWidth: '6rem',
                      minHeight: '6rem'
                    }
              }
            >
              {!imagePreview && getInitials(profile.firstName, profile.lastName)}

              {/* Upload Progress Overlay */}
              {uploadLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
            </div>

            {isEditing && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`absolute bottom-0 right-0 p-2 sm:p-2.5 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 transition-all hover:scale-110 ${styles.formIconBg}`}
                  title="Change profile picture"
                >
                  <Camera className={`w-4 h-4 sm:w-5 sm:h-5 ${styles.formIcon}`} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 ${styles.formTitle}`}>
              {profile.firstName} {profile.lastName}
            </h2>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
              <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${styles.categoryBadge}`}>
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </span>
              <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                profile.isActive ? styles.activeBadge : styles.inactiveBadge
              }`}>
                {profile.isActive ? "Active" : "Inactive"}
              </span>
              {profile.isEmailVerified && (
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* Cancel Button (only show when editing) */}
          {isEditing && (
            <button
              onClick={handleEditToggle}
              disabled={isSaving}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-sm sm:text-base transition-all ${styles.cancelButton}`}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1.5" />
              Cancel
            </button>
          )}
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 py-4 sm:py-6 border-b border-gray-200 dark:border-gray-700">
          <div className={`p-3 sm:p-4 rounded-lg ${styles.statCard}`}>
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-2 text-primary" />
            <div className={`text-xs ${styles.formLabel} mb-0.5 sm:mb-1`}>Email</div>
            <div className={`text-xs sm:text-sm font-medium truncate ${styles.formTitle}`}>
              {profile.email}
            </div>
          </div>

          <div className={`p-3 sm:p-4 rounded-lg ${styles.statCard}`}>
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-2 text-green-500" />
            <div className={`text-xs ${styles.formLabel} mb-0.5 sm:mb-1`}>Phone</div>
            <div className={`text-xs sm:text-sm font-medium ${styles.formTitle}`}>
              {profile.phone || "Not provided"}
            </div>
          </div>

          <div className={`p-3 sm:p-4 rounded-lg ${styles.statCard}`}>
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-2 text-blue-500" />
            <div className={`text-xs ${styles.formLabel} mb-0.5 sm:mb-1`}>Member Since</div>
            <div className={`text-xs sm:text-sm font-medium ${styles.formTitle}`}>
              {formatDate(profile.createdAt)}
            </div>
          </div>

          <div className={`p-3 sm:p-4 rounded-lg ${styles.statCard}`}>
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 mb-1 sm:mb-2 text-purple-500" />
            <div className={`text-xs ${styles.formLabel} mb-0.5 sm:mb-1`}>Last Login</div>
            <div className={`text-xs sm:text-sm font-medium ${styles.formTitle}`}>
              {formatDateTime(profile.lastLogin)}
            </div>
          </div>
        </div>

        {/* Editable Form */}
        <div className="pt-4 sm:pt-6 space-y-4 sm:space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${styles.formTitle}`}>
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* First Name */}
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${styles.formLabel}`}>
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border transition-all ${styles.formInput} ${
                    !isEditing ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter first name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${styles.formLabel}`}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border transition-all ${styles.formInput} ${
                    !isEditing ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter last name"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${styles.formLabel}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border opacity-60 cursor-not-allowed ${styles.formInput}`}
                />
                <p className={`text-xs mt-1 ${styles.formLabel}`}>
                  Email cannot be changed
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className={`block text-xs sm:text-sm font-medium mb-2 ${styles.formLabel}`}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border transition-all ${styles.formInput} ${
                    !isEditing ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${styles.formTitle}`}>
              About Me
            </h3>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
              rows={4}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border resize-none transition-all ${styles.formInput} ${
                !isEditing ? "opacity-60 cursor-not-allowed" : ""
              }`}
              placeholder="Tell us about yourself..."
            />
            <p className={`text-xs mt-1.5 sm:mt-2 ${styles.formLabel}`}>
              {formData.bio.length}/500 characters
            </p>
          </div>

          {/* Account Information */}
          <div>
            <h3 className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${styles.formTitle}`}>
              Account Information
            </h3>
            <div className={`p-3 sm:p-4 rounded-lg space-y-2 ${styles.statCard}`}>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className={styles.formLabel}>Account ID:</span>
                <span className={`font-mono font-medium ${styles.formTitle}`}>{profile._id}</span>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className={styles.formLabel}>Created At:</span>
                <span className={`font-medium ${styles.formTitle}`}>{formatDateTime(profile.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className={styles.formLabel}>Last Updated:</span>
                <span className={`font-medium ${styles.formTitle}`}>{formatDateTime(profile.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Danger Zone - Delete Account */}
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400 shrink-0" />
              <h3 className={`text-base sm:text-lg font-bold text-red-600 dark:text-red-400`}>
                DANGER ZONE
              </h3>
            </div>
            <div className={`p-4 sm:p-6 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10`}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="flex-1">
                  <h4 className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400 mb-2 sm:mb-3">
                    Delete Account Permanently
                  </h4>
                  <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mb-2 sm:mb-3">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <div className={`p-3 sm:p-4 rounded-lg border ${styles.statCard}`}>
                    <p className="text-xs sm:text-sm font-semibold mb-2">
                      This action will permanently delete:
                    </p>
                    <ul className="text-xs sm:text-sm space-y-1.5">
                      <li>• Your profile and personal information</li>
                      <li>• All your courses and course content</li>
                      <li>• Student enrollments and progress data</li>
                      <li>• All associated records and data</li>
                    </ul>
                  </div>
                </div>
                <button
                  onClick={handleDeleteClick}
                  disabled={isEditing || isSaving}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 rounded-lg font-medium transition-all text-sm sm:text-base ${styles.deleteButton} disabled:opacity-50 disabled:cursor-not-allowed shrink-0`}
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog
        isOpen={deleteDialog.isOpen}
        onClose={() =>
          setDeleteDialog({
            isOpen: false,
            isLoading: false,
          })
        }
        onConfirm={handleDeleteConfirm}
        title="Delete Account"
        description={`Are you sure you want to permanently delete your account? This action cannot be undone and will delete all your data including:

• Your profile and personal information
• All courses you've created
• Student enrollments and progress
• All associated records`}
        confirmText="Delete My Account"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteDialog.isLoading}
        requirePassword={true}
      />

      {/* Toast Notification */}
      <Toast
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        title={toastMessage.title}
        message={toastMessage.message}
        variant={toastMessage.variant}
        duration={3000}
        position="top-right"
      />
    </div>
  );
}
