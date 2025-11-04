"use client";

import { useState } from "react";
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
import { useToast } from "../ui/useToast";
import CustomSelect from "./CustomSelect";

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

const COURSE_CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Cloud Computing",
  "Cybersecurity",
  "DevOps",
  "Blockchain",
  "Game Development",
  "UI/UX Design",
  "Digital Marketing",
  "Business Analytics",
  "Programming Languages",
  "Database Management",
];

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

const TOOLS_OPTIONS = [
  "VS Code",
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "Postman",
  "Insomnia",
  "Docker",
  "Kubernetes",
  "Jenkins",
  "CircleCI",
  "Travis CI",
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "Redis",
  "Nginx",
  "Apache",
  "Linux",
  "Windows",
  "macOS",
  "Figma",
  "Adobe XD",
  "Sketch",
  "Jira",
  "Trello",
  "Slack",
  "Notion",
];

const DURATION_OPTIONS = [
  "4 weeks",
  "6 weeks",
  "8 weeks",
  "10 weeks",
  "12 weeks",
  "16 weeks",
  "20 weeks",
  "24 weeks",
  "6 months",
  "9 months",
  "12 months",
];

export default function CreateCourse() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLearnItem, setCurrentLearnItem] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { success, error, ToastComponent } = useToast();

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelect = (name: "skills" | "tools", value: string) => {
    setFormData((prev) => {
      const currentValues = prev[name];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [name]: currentValues.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [name]: [...currentValues, value],
        };
      }
    });
  };

  const addLearnItem = () => {
    if (currentLearnItem.trim()) {
      setFormData((prev) => ({
        ...prev,
        whatYouWillLearn: [...prev.whatYouWillLearn, currentLearnItem.trim()],
      }));
      setCurrentLearnItem("");
    }
  };

  const removeLearnItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      whatYouWillLearn: prev.whatYouWillLearn.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        error("Please upload an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        error("Image size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        courseFlyer: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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

    // Validation
    if (!formData.courseName.trim()) {
      error("Course name is required");
      return;
    }
    if (!formData.courseCategory) {
      error("Please select a course category");
      return;
    }
    if (!formData.description.trim()) {
      error("Course description is required");
      return;
    }
    if (formData.whatYouWillLearn.length === 0) {
      error("Please add at least one learning outcome");
      return;
    }
    if (formData.skills.length === 0) {
      error("Please select at least one skill");
      return;
    }
    if (formData.tools.length === 0) {
      error("Please select at least one tool");
      return;
    }
    if (!formData.startingDate) {
      error("Starting date is required");
      return;
    }
    if (!formData.duration) {
      error("Please select course duration");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      error("Please enter a valid price");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const courseData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      // TODO: Replace with actual API call
      console.log("Course Data:", courseData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Success
      success("Course created successfully!");

      // Reset form
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
    } catch (err) {
      console.error("Error creating course:", err);
      error("Failed to create course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastComponent />
      <div className="w-full max-w-5xl mx-auto pb-8">
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
                placeholder="e.g., Complete Python Programming"
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${styles.formInput}`}
                required
              />
            </div>

            <CustomSelect
              options={COURSE_CATEGORIES}
              value={formData.courseCategory}
              onChange={(value) => setFormData((prev) => ({ ...prev, courseCategory: value }))}
              placeholder="Select a category"
              label="Course Category"
              required
            />

            <div>
              <label htmlFor="description" className={`block text-sm font-medium mb-2 ${styles.formLabel}`}>
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what students will learn in this course..."
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none ${styles.formInput}`}
                required
              />
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
                placeholder="e.g., Master Python from scratch"
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

          {formData.skills.length > 0 && (
            <div className={`mt-4 p-3 rounded-lg ${styles.selectedCount}`}>
              <span className="text-sm font-medium">
                {formData.skills.length} skill{formData.skills.length !== 1 ? "s" : ""} selected
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
            {TOOLS_OPTIONS.map((tool) => (
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

          {formData.tools.length > 0 && (
            <div className={`mt-4 p-3 rounded-lg ${styles.selectedCount}`}>
              <span className="text-sm font-medium">
                {formData.tools.length} tool{formData.tools.length !== 1 ? "s" : ""} selected
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
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${styles.formInput}`}
                required
              />
            </div>

            <CustomSelect
              options={DURATION_OPTIONS}
              value={formData.duration}
              onChange={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
              placeholder="Select duration"
              label="Duration"
              required
            />

            <div>
              <label htmlFor="price" className={`block text-sm font-medium mb-2 ${styles.formLabel}`}>
                Price (USD) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="99.99"
                step="0.01"
                min="0"
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${styles.formInput}`}
                required
              />
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
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className={`p-4 rounded-full ${styles.uploadIconBg}`}>
                      <Upload className={`w-8 h-8 ${styles.uploadIcon}`} />
                    </div>
                    <div>
                      <p className={`text-sm md:text-base font-medium mb-1 ${styles.uploadText}`}>
                        Click to upload or drag and drop
                      </p>
                      <p className={`text-xs md:text-sm ${styles.uploadSubtext}`}>
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
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
                Creating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Create Course
              </>
            )}
          </button>
        </div>
      </form>
      </div>
    </>
  );
}
