"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, Phone, Calendar, Shield, Camera, Edit2, Save, X, Trash2, AlertTriangle } from "lucide-react";
import styles from "./InstructorComponents.module.scss";
import { useToast } from "../ui/useToast";
import AlertDialog from "../ui/AlertDialog";

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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { ToastComponent, success, error } = useToast();

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

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/instructor/profile');
        // const data = await response.json();

        // Mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockData = {
          success: true,
          message: "Profile retrieved successfully",
          data: {
            user: {
              _id: "690553b18deac7a86c92c672",
              firstName: "student",
              lastName: "galle",
              email: "premasirikb1@gmail.com",
              role: "instructor",
              phone: "0765698587",
              profileImage: "",
              bio: "Passionate educator with 5+ years of experience in web development and programming. Love sharing knowledge and helping students achieve their goals.",
              isEmailVerified: false,
              isActive: true,
              createdAt: "2025-11-01T00:26:25.147Z",
              updatedAt: "2025-11-01T00:28:33.412Z",
              lastLogin: "2025-11-01T00:28:33.318Z",
            },
          },
        };

        setProfile(mockData.data.user);
        setFormData({
          firstName: mockData.data.user.firstName,
          lastName: mockData.data.user.lastName,
          phone: mockData.data.user.phone,
          bio: mockData.data.user.bio,
          profileImage: mockData.data.user.profileImage,
        });
        setImagePreview(mockData.data.user.profileImage);
      } catch (err) {
        console.error("Error fetching profile:", err);
        error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [error]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        error("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        error("Please upload a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData((prev) => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
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
      // TODO: Replace with actual API call
      // const response = await fetch('/api/instructor/profile', {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          bio: formData.bio,
          profileImage: formData.profileImage,
          updatedAt: new Date().toISOString(),
        });
      }

      success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      error("Failed to update profile. Please try again.");
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

  const handleDeleteConfirm = async () => {
    setDeleteDialog((prev) => ({ ...prev, isLoading: true }));

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/instructor/profile', {
      //   method: 'DELETE',
      // });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      success("Account deleted successfully! Redirecting...");

      // Redirect to login or home page after deletion
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      console.error("Error deleting account:", err);
      error("Failed to delete account. Please try again.");
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
        <ToastComponent />
        <div className={`rounded-lg sm:rounded-xl border p-6 sm:p-8 text-center ${styles.formCard}`}>
          <div className={`text-base sm:text-lg ${styles.formLabel}`}>
            Failed to load profile data. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full">
      <ToastComponent />

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
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-white font-bold text-2xl sm:text-4xl overflow-hidden"
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
    </div>
  );
}
