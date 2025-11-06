"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BookOpen,
  List,
  Award,
  Wrench,
  Calendar,
  Plus,
  X,
  Save,
  Loader2,
  Upload,
} from "lucide-react";
import styles from "./InstructorComponents.module.scss";
import Toast from "../ui/Toast";
import CustomSelect from "./CustomSelect";
import { useInstructor } from "@/hooks/useInstructorHook";
import { useFileUpload } from "@/hooks/useFileUploadHook";
import courseService from "@/services/courseService";

interface CourseFormData {
  courseName: string;
  courseCategory: string;
  description: string;
  whatYouWillLearn: string[];
  skills: string[];
  tools: string[];
  startingDate: string;
  duration: string;
  price: string;
  courseFlyer: File | null;
}

interface ValidationErrors {
  courseName?: string;
  courseCategory?: string;
  description?: string;
  whatYouWillLearn?: string;
  skills?: string;
  tools?: string;
  startingDate?: string;
  duration?: string;
  price?: string;
  courseFlyer?: string;
}

// Skills options (frontend only, not from backend)
const SKILLS_OPTIONS = [
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Django",
  "Flask",
  "FastAPI",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "REST APIs",
  "GraphQL",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Bootstrap",
  "Vue.js",
  "Angular",
  "Next.js",
  "React Native",
  "Flutter",
  "Swift",
  "Kotlin",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "Ruby on Rails",
];

function CreateCourseForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams?.get("edit");
  const isEditMode = !!editId;

  // Hooks
  const {
    currentCourse,
    createCourse,
    updateCourse,
    getCourseById,
    loading: instructorLoading
  } = useInstructor();
  const { uploadCourseFlyer, loading: uploadLoading } = useFileUpload();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [currentLearnItem, setCurrentLearnItem] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Upload progress state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFileName, setUploadFileName] = useState<string>("");

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    title: '',
    message: '',
    variant: 'success' as 'success' | 'error'
  });

  // Dynamic options from backend
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [toolOptions, setToolOptions] = useState<string[]>([]);
  const [durationOptions, setDurationOptions] = useState<string[]>([]);

  const [formData, setFormData] = useState<CourseFormData>({
    courseName: "",
    courseCategory: "",
    description: "",
    whatYouWillLearn: [],
    skills: [],
    tools: [],
    startingDate: "",
    duration: "",
    price: "",
    courseFlyer: null,
  });

  // Fetch dynamic options from backend
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [categories, tools, durations] = await Promise.all([
          courseService.getCategories(),
          courseService.getTools(),
          courseService.getDurations()
        ]);
        setCategoryOptions(categories);
        setToolOptions(tools);
        setDurationOptions(durations);
      } catch (err) {
        console.error('Error fetching filter options:', err);
        setToastMessage({
          title: 'Error',
          message: 'Failed to load form options. Some fields may be unavailable.',
          variant: 'error'
        });
        setShowToast(true);
      }
    };
    fetchOptions();
  }, []);

  // Fetch course data if in edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      fetchCourseData(editId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  // Sync course data from Redux when fetched
  useEffect(() => {
    if (currentCourse && isEditMode) {
      setFormData({
        courseName: currentCourse.courseName || "",
        courseCategory: currentCourse.courseCategory || "",
        description: currentCourse.description || "",
        whatYouWillLearn: currentCourse.whatYouWillLearn || [],
        skills: currentCourse.skills || [],
        tools: currentCourse.tools || [],
        startingDate: currentCourse.startingDate ? new Date(currentCourse.startingDate).toISOString().split('T')[0] : "",
        duration: typeof currentCourse.duration === 'string' ? currentCourse.duration : "",
        price: currentCourse.price?.toString() || "",
        courseFlyer: null,
      });

      // Set image preview if URL exists
      if (currentCourse.courseFlyerURL) {
        setImagePreview(currentCourse.courseFlyerURL);
      }
      setIsLoading(false);
    }
  }, [currentCourse, isEditMode]);

  const fetchCourseData = async (courseId: string) => {
    setIsLoading(true);
    try {
      await getCourseById(courseId);
    } catch (err) {
      console.error("Error fetching course data:", err);
      setToastMessage({
        title: 'Error',
        message: 'Failed to load course data. Please try again.',
        variant: 'error'
      });
      setShowToast(true);
      setIsLoading(false);
    }
  };

  // Validation function
  const validateField = (name: string, value: string | string[] | File | null): string | undefined => {
    switch (name) {
      case "courseName":
        if (typeof value !== "string" || !value.trim()) {
          return "Course name is required";
        }
        if (value.trim().length < 5) {
          return "Course name must be at least 5 characters long";
        }
        if (value.trim().length > 100) {
          return "Course name must not exceed 100 characters";
        }
        if (!/^[a-zA-Z0-9\s\-:&.,()]+$/.test(value)) {
          return "Course name contains invalid characters";
        }
        break;

      case "courseCategory":
        if (!value || (typeof value === "string" && !value.trim())) {
          return "Please select a course category";
        }
        break;

      case "description":
        if (typeof value !== "string" || !value.trim()) {
          return "Course description is required";
        }
        if (value.trim().length < 50) {
          return "Description must be at least 50 characters long";
        }
        if (value.trim().length > 1000) {
          return "Description must not exceed 1000 characters";
        }
        break;

      case "whatYouWillLearn":
        if (!Array.isArray(value) || value.length === 0) {
          return "Please add at least one learning outcome";
        }
        if (value.length < 3) {
          return "Please add at least 3 learning outcomes";
        }
        if (value.length > 20) {
          return "Maximum 20 learning outcomes allowed";
        }
        break;

      case "skills":
        if (!Array.isArray(value) || value.length === 0) {
          return "Please select at least one skill";
        }
        if (value.length < 2) {
          return "Please select at least 2 skills";
        }
        if (value.length > 15) {
          return "Maximum 15 skills allowed";
        }
        break;

      case "tools":
        if (!Array.isArray(value) || value.length === 0) {
          return "Please select at least one tool";
        }
        if (value.length < 2) {
          return "Please select at least 2 tools";
        }
        if (value.length > 15) {
          return "Maximum 15 tools allowed";
        }
        break;

      case "startingDate":
        if (typeof value !== "string" || !value) {
          return "Starting date is required";
        }
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          return "Starting date cannot be in the past";
        }
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 2);
        if (selectedDate > maxDate) {
          return "Starting date cannot be more than 2 years in the future";
        }
        break;

      case "duration":
        if (!value || (typeof value === "string" && !value.trim())) {
          return "Please select course duration";
        }
        break;

      case "price":
        if (typeof value !== "string" || value === "") {
          return "Price is required";
        }
        const priceNum = parseFloat(value);
        if (isNaN(priceNum)) {
          return "Please enter a valid price";
        }
        if (priceNum < 0) {
          return "Price cannot be negative";
        }
        if (priceNum === 0) {
          return "Price must be greater than 0";
        }
        if (priceNum > 10000) {
          return "Price cannot exceed $10,000";
        }
        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
          return "Price must have at most 2 decimal places";
        }
        break;

      case "courseFlyer":
        // Optional field, no required validation
        if (value && value instanceof File) {
          if (!value.type.startsWith("image/")) {
            return "Only image files are allowed";
          }
          if (value.size > 5 * 1024 * 1024) {
            return "Image size must be less than 5MB";
          }
        }
        break;

      default:
        break;
    }
    return undefined;
  };

  // Validate all fields
  const validateAllFields = (): boolean => {
    const errors: ValidationErrors = {
      courseName: validateField("courseName", formData.courseName),
      courseCategory: validateField("courseCategory", formData.courseCategory),
      description: validateField("description", formData.description),
      whatYouWillLearn: validateField("whatYouWillLearn", formData.whatYouWillLearn),
      skills: validateField("skills", formData.skills),
      tools: validateField("tools", formData.tools),
      startingDate: validateField("startingDate", formData.startingDate),
      duration: validateField("duration", formData.duration),
      price: validateField("price", formData.price),
      courseFlyer: validateField("courseFlyer", formData.courseFlyer),
    };

    setValidationErrors(errors);

    // Check if there are any errors
    const hasErrors = Object.values(errors).some((err) => err !== undefined);

    if (hasErrors) {
      // Show first error in toast
      const firstError = Object.values(errors).find((err) => err !== undefined);
      if (firstError) {
        setToastMessage({
          title: 'Validation Error',
          message: firstError,
          variant: 'error'
        });
        setShowToast(true);
      }
    }

    return !hasErrors;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field if it exists
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldValue = formData[field as keyof CourseFormData];
    const fieldError = validateField(field, fieldValue as string | string[] | File | null);
    if (fieldError) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: fieldError,
      }));
    }
  };

  const handleMultiSelect = (name: "skills" | "tools", value: string) => {
    setFormData((prev) => {
      const currentValues = prev[name];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      // Validate the field after update
      const fieldError = validateField(name, newValues);
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [name]: fieldError,
      }));

      return {
        ...prev,
        [name]: newValues,
      };
    });
  };

  const addLearnItem = () => {
    if (currentLearnItem.trim()) {
      if (currentLearnItem.trim().length < 10) {
        setToastMessage({
          title: 'Validation Error',
          message: 'Learning outcome must be at least 10 characters long',
          variant: 'error'
        });
        setShowToast(true);
        return;
      }
      if (currentLearnItem.trim().length > 200) {
        setToastMessage({
          title: 'Validation Error',
          message: 'Learning outcome must not exceed 200 characters',
          variant: 'error'
        });
        setShowToast(true);
        return;
      }

      setFormData((prev) => {
        const newItems = [...prev.whatYouWillLearn, currentLearnItem.trim()];

        // Validate the field after update
        const fieldError = validateField("whatYouWillLearn", newItems);
        setValidationErrors((prevErrors) => ({
          ...prevErrors,
          whatYouWillLearn: fieldError,
        }));

        return {
          ...prev,
          whatYouWillLearn: newItems,
        };
      });
      setCurrentLearnItem("");
    }
  };

  const removeLearnItem = (index: number) => {
    setFormData((prev) => {
      const newItems = prev.whatYouWillLearn.filter((_, i) => i !== index);

      // Validate the field after update
      const fieldError = validateField("whatYouWillLearn", newItems);
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        whatYouWillLearn: fieldError,
      }));

      return {
        ...prev,
        whatYouWillLearn: newItems,
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setToastMessage({
          title: 'Error',
          message: 'Please upload an image file',
          variant: 'error'
        });
        setShowToast(true);
        return;
      }

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

      try {
        // Reset progress and start upload
        setUploadProgress(0);
        setIsUploading(true);
        setUploadFileName(file.name);

        // Simulate progress (since we don't have real progress from backend)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        // Upload to backend
        const uploadedUrl = await uploadCourseFlyer(file);

        // Complete progress
        clearInterval(progressInterval);
        setUploadProgress(100);

        if (uploadedUrl) {
          setFormData((prev) => ({
            ...prev,
            courseFlyer: file,
          }));

          // Set preview to uploaded URL
          setImagePreview(uploadedUrl);

          // Wait a bit to show 100% before hiding progress
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
            setUploadFileName("");
          }, 500);

          setToastMessage({
            title: 'Success',
            message: 'Course flyer uploaded successfully!',
            variant: 'success'
          });
          setShowToast(true);
        }
      } catch (err) {
        console.error('Error uploading course flyer:', err);
        setIsUploading(false);
        setUploadProgress(0);
        setUploadFileName("");
        setToastMessage({
          title: 'Error',
          message: 'Failed to upload course flyer. Please try again.',
          variant: 'error'
        });
        setShowToast(true);
      }
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      courseFlyer: null,
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    if (!validateAllFields()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && editId) {
        // Update existing course
        await updateCourse({
          courseId: editId,
          courseName: formData.courseName,
          courseCategory: formData.courseCategory,
          description: formData.description,
          whatYouWillLearn: formData.whatYouWillLearn,
          skills: formData.skills,
          tools: formData.tools,
          startingDate: formData.startingDate,
          duration: formData.duration,
          price: parseFloat(formData.price),
          courseFlyerURL: imagePreview || undefined,
        });

        setToastMessage({
          title: 'Success',
          message: 'Course updated successfully!',
          variant: 'success'
        });
        setShowToast(true);

        // Navigate back to instructor courses after successful update
        setTimeout(() => {
          router.push("/instructor-courses");
        }, 1500);
      } else {
        // Create new course
        await createCourse({
          courseName: formData.courseName,
          courseCategory: formData.courseCategory,
          description: formData.description,
          whatYouWillLearn: formData.whatYouWillLearn,
          skills: formData.skills,
          tools: formData.tools,
          startingDate: formData.startingDate,
          duration: formData.duration,
          price: parseFloat(formData.price),
          courseFlyerURL: imagePreview || undefined,
        });

        setToastMessage({
          title: 'Success',
          message: 'Course created successfully!',
          variant: 'success'
        });
        setShowToast(true);

        // Reset form after creating
        setTimeout(() => {
          setFormData({
            courseName: "",
            courseCategory: "",
            description: "",
            whatYouWillLearn: [],
            skills: [],
            tools: [],
            startingDate: "",
            duration: "",
            price: "",
            courseFlyer: null,
          });
          setImagePreview(null);
          setValidationErrors({});
          setTouched({});
        }, 1000);
      }
    } catch (err: any) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} course:`, err);
      setToastMessage({
        title: 'Error',
        message: err?.message || `Failed to ${isEditMode ? "update" : "create"} course. Please try again.`,
        variant: 'error'
      });
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while fetching course data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className={`text-sm ${styles.formLabel}`}>Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full pb-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className={`text-2xl md:text-3xl font-bold ${styles.formTitle}`}>
            {isEditMode ? "Edit Course" : "Create New Course"}
          </h1>
          <p className={`text-sm mt-1 ${styles.formLabel}`}>
            {isEditMode
              ? "Update your course information below"
              : "Fill in the details to create a new course"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Name */}
        <div className={`rounded-xl border p-4 md:p-6 ${styles.formCard}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${styles.formIconBg}`}>
              <BookOpen className={`w-5 h-5 ${styles.formIcon}`} />
            </div>
            <h2 className={`text-lg md:text-xl font-bold ${styles.formTitle}`}>
              Course Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="courseName" className={`block text-sm font-medium mb-2 ${styles.formLabel}`}>
                Course Name *
              </label>
              <input
                type="text"
                id="courseName"
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                onBlur={() => handleBlur("courseName")}
                placeholder="e.g., Complete Python Programming"
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                  validationErrors.courseName && touched.courseName
                    ? "border-red-500 focus:ring-red-500"
                    : styles.formInput
                }`}
                required
              />
              {validationErrors.courseName && touched.courseName && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.courseName}</p>
              )}
            </div>

            <div>
              <CustomSelect
                options={categoryOptions}
                value={formData.courseCategory}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, courseCategory: value }));
                  setTouched((prev) => ({ ...prev, courseCategory: true }));
                  const fieldError = validateField("courseCategory", value);
                  setValidationErrors((prev) => ({ ...prev, courseCategory: fieldError }));
                }}
                placeholder="Select a category"
                label="Course Category"
                required
              />
              {validationErrors.courseCategory && touched.courseCategory && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.courseCategory}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className={`block text-sm font-medium mb-2 ${styles.formLabel}`}>
                Description * <span className="text-xs text-gray-500">(min 50 characters)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                onBlur={() => handleBlur("description")}
                placeholder="Describe what students will learn in this course..."
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none ${
                  validationErrors.description && touched.description
                    ? "border-red-500 focus:ring-red-500"
                    : styles.formInput
                }`}
                required
              />
              <div className="flex justify-between items-center mt-1">
                <div>
                  {validationErrors.description && touched.description && (
                    <p className="text-sm text-red-600">{validationErrors.description}</p>
                  )}
                </div>
                <p className={`text-xs ${formData.description.length < 50 ? "text-red-500" : "text-gray-500"}`}>
                  {formData.description.length}/1000
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What You Will Learn */}
        <div className={`rounded-xl border p-4 md:p-6 ${styles.formCard}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${styles.formIconBg}`}>
              <List className={`w-5 h-5 ${styles.formIcon}`} />
            </div>
            <h2 className={`text-lg md:text-xl font-bold ${styles.formTitle}`}>
              Learning Outcomes
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={currentLearnItem}
                onChange={(e) => setCurrentLearnItem(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addLearnItem();
                  }
                }}
                placeholder="e.g., Master Python from scratch (min 10 chars)"
                className={`flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${styles.formInput}`}
              />
              <button
                type="button"
                onClick={addLearnItem}
                className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${styles.addButton}`}
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>

            {validationErrors.whatYouWillLearn && (
              <p className="text-sm text-red-600">{validationErrors.whatYouWillLearn}</p>
            )}

            {formData.whatYouWillLearn.length > 0 && (
              <div className="space-y-2">
                {formData.whatYouWillLearn.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between gap-3 p-3 rounded-lg ${styles.listItem}`}
                  >
                    <span className="flex-1 text-sm">{item}</span>
                    <button
                      type="button"
                      onClick={() => removeLearnItem(index)}
                      className={`p-1.5 rounded-md transition-all ${styles.removeButton}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className={`rounded-xl border p-4 md:p-6 ${styles.formCard}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${styles.formIconBg}`}>
              <Award className={`w-5 h-5 ${styles.formIcon}`} />
            </div>
            <h2 className={`text-lg md:text-xl font-bold ${styles.formTitle}`}>
              Skills *
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {SKILLS_OPTIONS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleMultiSelect("skills", skill)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.skills.includes(skill)
                    ? styles.selectedChip
                    : styles.chip
                }`}
              >
                {skill}
              </button>
            ))}
          </div>

          {validationErrors.skills && (
            <p className="mt-2 text-sm text-red-600">{validationErrors.skills}</p>
          )}

          {formData.skills.length > 0 && (
            <div className={`mt-4 p-3 rounded-lg ${styles.selectedCount}`}>
              <span className="text-sm font-medium">
                {formData.skills.length} skill{formData.skills.length !== 1 ? "s" : ""} selected (min 2, max 15)
              </span>
            </div>
          )}
        </div>

        {/* Tools */}
        <div className={`rounded-xl border p-4 md:p-6 ${styles.formCard}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${styles.formIconBg}`}>
              <Wrench className={`w-5 h-5 ${styles.formIcon}`} />
            </div>
            <h2 className={`text-lg md:text-xl font-bold ${styles.formTitle}`}>
              Tools *
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {toolOptions.map((tool) => (
              <button
                key={tool}
                type="button"
                onClick={() => handleMultiSelect("tools", tool)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.tools.includes(tool)
                    ? styles.selectedChip
                    : styles.chip
                }`}
              >
                {tool}
              </button>
            ))}
          </div>

          {validationErrors.tools && (
            <p className="mt-2 text-sm text-red-600">{validationErrors.tools}</p>
          )}

          {formData.tools.length > 0 && (
            <div className={`mt-4 p-3 rounded-lg ${styles.selectedCount}`}>
              <span className="text-sm font-medium">
                {formData.tools.length} tool{formData.tools.length !== 1 ? "s" : ""} selected (min 2, max 15)
              </span>
            </div>
          )}
        </div>

        {/* Course Details */}
        <div className={`rounded-xl border p-4 md:p-6 ${styles.formCard}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${styles.formIconBg}`}>
              <Calendar className={`w-5 h-5 ${styles.formIcon}`} />
            </div>
            <h2 className={`text-lg md:text-xl font-bold ${styles.formTitle}`}>
              Course Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startingDate" className={`block text-sm font-medium mb-2 ${styles.formLabel}`}>
                Starting Date *
              </label>
              <input
                type="date"
                id="startingDate"
                name="startingDate"
                value={formData.startingDate}
                onChange={handleInputChange}
                onBlur={() => handleBlur("startingDate")}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                  validationErrors.startingDate && touched.startingDate
                    ? "border-red-500 focus:ring-red-500"
                    : styles.formInput
                }`}
                required
              />
              {validationErrors.startingDate && touched.startingDate && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.startingDate}</p>
              )}
            </div>

            <div>
              <CustomSelect
                options={durationOptions}
                value={formData.duration}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, duration: value }));
                  setTouched((prev) => ({ ...prev, duration: true }));
                  const fieldError = validateField("duration", value);
                  setValidationErrors((prev) => ({ ...prev, duration: fieldError }));
                }}
                placeholder="Select duration"
                label="Duration"
                required
              />
              {validationErrors.duration && touched.duration && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.duration}</p>
              )}
            </div>

            <div>
              <label htmlFor="price" className={`block text-sm font-medium mb-2 ${styles.formLabel}`}>
                Price (USD) * <span className="text-xs text-gray-500">(max $10,000)</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                onBlur={() => handleBlur("price")}
                placeholder="99.99"
                step="0.01"
                min="0"
                max="10000"
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                  validationErrors.price && touched.price
                    ? "border-red-500 focus:ring-red-500"
                    : styles.formInput
                }`}
                required
              />
              {validationErrors.price && touched.price && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.price}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${styles.formLabel}`}>
                Course Flyer Image
              </label>

              {!imagePreview ? (
                <div className={`relative border-2 border-dashed rounded-lg p-6 md:p-8 text-center transition-all ${styles.uploadArea}`}>
                  <input
                    type="file"
                    id="courseFlyer"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className={`p-4 rounded-full ${styles.uploadIconBg}`}>
                      {isUploading ? (
                        <Loader2 className={`w-8 h-8 animate-spin ${styles.uploadIcon}`} />
                      ) : (
                        <Upload className={`w-8 h-8 ${styles.uploadIcon}`} />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm md:text-base font-medium mb-1 ${styles.uploadText}`}>
                        {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
                      </p>
                      <p className={`text-xs md:text-sm ${styles.uploadSubtext}`}>
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>

                    {/* Upload Progress Indicator */}
                    {isUploading && (
                      <div className="w-full max-w-md mt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-medium truncate flex-1 mr-2 ${styles.uploadText}`}>
                            {uploadFileName}
                          </span>
                          <span className={`text-xs font-bold ${styles.uploadPercentage}`}>
                            {uploadProgress}%
                          </span>
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${styles.progressBarBg}`}>
                          <div
                            className={`h-full rounded-full transition-all duration-300 ease-out ${styles.progressBarFill}`}
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className={`relative rounded-lg border overflow-hidden ${styles.imagePreview}`}>
                  <img
                    src={imagePreview}
                    alt="Course flyer preview"
                    className="w-full h-48 md:h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all ${styles.removeImageButton}`}
                    title="Remove image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm font-medium truncate">
                      {formData.courseFlyer?.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setFormData({
                courseName: "",
                courseCategory: "",
                description: "",
                whatYouWillLearn: [],
                skills: [],
                tools: [],
                startingDate: "",
                duration: "",
                price: "",
                courseFlyer: null,
              });
              setCurrentLearnItem("");
              setImagePreview(null);
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${styles.cancelButton}`}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${styles.submitButton}`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEditMode ? "Update Course" : "Create Course"}
              </>
            )}
          </button>
        </div>
      </form>
      </div>

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
    </>
  );
}

// Wrapper component with Suspense boundary
export default function CreateCourse() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <CreateCourseForm />
    </Suspense>
  );
}
