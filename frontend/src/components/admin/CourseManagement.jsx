// components/admin/CourseManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronUp,
  ChevronDown,
  X,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import StatusBadge from "../ui/StatusBadge";
import Modal from "../ui/Modal";
import Pagination from "../ui/Pagination";
import { toast } from "react-toastify";
import { useAdmin } from "../../context/AdminContext";
import validateCourse from "../../utils/courseValidation";
import axios from "axios";

const ITEMS_PER_PAGE = 5;

// Helper function to map server data to component format
const mapServerToComponent = (serverCourse) => ({
  id: serverCourse.id,
  code: serverCourse.course_code || "",
  name: serverCourse.course_name || "",
  type: serverCourse.duration_type || "",
  tuition_fee: serverCourse.tuition_fee || "",
  status: serverCourse.course_status || "active",
  created_at: serverCourse.created_at,
  updated_at: serverCourse.updated_at,
});

// Helper function to map component data to server format
const mapComponentToServer = (componentData) => ({
  course_code: componentData.code,
  course_name: componentData.name,
  duration_type: componentData.type,
  tuition_fee: componentData.tuition_fee,
  course_status: componentData.status,
});

const CourseForm = ({
  formData,
  onInputChange,
  onBlur,
  onSubmit,
  onCancel,
  isEditing,
  errors,
  touched,
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="space-y-5">
      {/* Course Code Field */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full border ${
              errors.code
                ? "border-red-500 bg-red-50/50"
                : touched.code && !errors.code && formData.code
                  ? "border-green-500 bg-green-50/50"
                  : "border-gray-300"
            } rounded-xl px-4 py-3.5 text-sm focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 pr-10`}
            required
            placeholder="Course Code *"
          />
          {touched.code && formData.code && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {errors.code ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
          )}
        </div>
        <div className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500 font-medium">
          Course Code
        </div>
        {errors.code && (
          <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.code}
          </p>
        )}
      </div>

      {/* Course Name Field */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full border ${
              errors.name
                ? "border-red-500 bg-red-50/50"
                : touched.name && !errors.name && formData.name
                  ? "border-green-500 bg-green-50/50"
                  : "border-gray-300"
            } rounded-xl px-4 py-3.5 text-sm focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 pr-10`}
            required
            placeholder="Course Name *"
          />
          {touched.name && formData.name && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {errors.name ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
          )}
        </div>
        <div className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500 font-medium">
          Course Name
        </div>
        {errors.name && (
          <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Course Type Field */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full border ${
              errors.type
                ? "border-red-500 bg-red-50/50"
                : touched.type && !errors.type && formData.type
                  ? "border-green-500 bg-green-50/50"
                  : "border-gray-300"
            } rounded-xl px-4 py-3.5 text-sm focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 pr-10`}
            required
            placeholder="Select Course Type"
            list="courseTypes"
          />
          {touched.type && formData.type && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {errors.type ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
          )}
        </div>
        <datalist id="courseTypes">
          {[
            "4 years Course",
            "2 years Course",
            "Short Course",
            "1 year Course",
            "Summer Class Course",
            "Certificate Course",
          ].map((type) => (
            <option key={type} value={type} />
          ))}
        </datalist>
        <div className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500 font-medium">
          Course Type
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
        {errors.type && (
          <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.type}
          </p>
        )}
      </div>

      {/* Tuition Fee Field */}
      <div className="relative">
        <div className="relative">
          <input
            type="number"
            name="tuition_fee"
            min="0"
            step="100"
            value={formData.tuition_fee}
            onChange={onInputChange}
            onBlur={onBlur}
            className={`w-full border ${
              errors.tuition_fee
                ? "border-red-500 bg-red-50/50"
                : touched.tuition_fee &&
                    !errors.tuition_fee &&
                    formData.tuition_fee
                  ? "border-green-500 bg-green-50/50"
                  : "border-gray-300"
            } rounded-xl px-4 py-3.5 text-sm focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg outline-none transition-all duration-200 hover:border-gray-400 scheme-light pr-10`}
            placeholder="Enter tuition fee"
          />
          {touched.tuition_fee && formData.tuition_fee && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {errors.tuition_fee ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
          )}
        </div>
        <div className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500 font-medium">
          Tuition Fee (₱)
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-400">₱</span>
        </div>
        {errors.tuition_fee && (
          <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.tuition_fee}
          </p>
        )}
      </div>

      {/* Status Field */}
      <div className="relative">
        <select
          name="status"
          value={formData.status}
          onChange={onInputChange}
          onBlur={onBlur}
          className={`w-full border ${
            errors.status
              ? "border-red-500 bg-red-50/50"
              : touched.status && !errors.status
                ? "border-green-500 bg-green-50/50"
                : "border-gray-300"
          } rounded-xl px-4 py-3.5 text-sm focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg outline-none transition-all duration-200 appearance-none bg-white hover:border-gray-400`}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <div className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500 font-medium">
          Status
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
        {errors.status && (
          <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.status}
          </p>
        )}
      </div>
    </div>

    {/* Validation Summary */}
    {Object.keys(errors).length > 0 && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-red-800">
              Please fix the following errors:
            </h4>
            <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )}

    <div className="flex justify-end space-x-3 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={Object.keys(errors).length > 0}
        className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-blue-500/40 shadow-sm hover:shadow-md active:scale-[0.98] ${
          Object.keys(errors).length > 0
            ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
            : "bg-linear-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
        }`}
      >
        <span className="flex items-center">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isEditing ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"}
            />
          </svg>
          {isEditing ? "Update Course" : "Add Course"}
        </span>
      </button>
    </div>
  </form>
);

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  courseName,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Delete Course"
    size="sm"
    closeOnBackdropClick
    closeOnEsc
  >
    <div className="p-6">
      <div className="flex items-center justify-center mb-4 text-red-600">
        <AlertTriangle className="w-12 h-12" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
        Confirm Deletion
      </h3>
      <p className="text-sm text-gray-500 text-center mb-6">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-gray-700">{courseName}</span>? This
        action cannot be undone.
      </p>
      <div className="flex justify-center space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
        >
          Delete Course
        </button>
      </div>
    </div>
  </Modal>
);

function CourseManagement() {
  const { initialCourses } = useAdmin();
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "",
    tuition_fee: "",
    status: "active",
  });
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Load initial courses and map them to component format
  useEffect(() => {
    if (initialCourses && initialCourses.length > 0) {
      const mappedCourses = initialCourses.map(mapServerToComponent);
      setCourses(mappedCourses);
    }
  }, [initialCourses]);

  // Real-time validation
  useEffect(() => {
    if (Object.keys(touchedFields).length > 0) {
      const { errors } = validateCourse(formData, courses, currentCourse?.id);
      setFormErrors(errors);
    }
  }, [formData, courses, currentCourse, touchedFields]);

  const handleSort = (key) =>
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    });

  const getSortedCourses = () => {
    if (!sortConfig.key) return [...courses];
    return [...courses].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (sortConfig.key === "tuition_fee") {
        return sortConfig.direction === "ascending"
          ? (parseFloat(aVal) || 0) - (parseFloat(bVal) || 0)
          : (parseFloat(bVal) || 0) - (parseFloat(aVal) || 0);
      }
      const aStr = String(aVal || "").toLowerCase();
      const bStr = String(bVal || "").toLowerCase();
      return sortConfig.direction === "ascending"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  };

  const filteredCourses = getSortedCourses().filter(
    (course) =>
      (course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.type?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || course.status === statusFilter),
  );

  const handleAddNew = () => {
    setCurrentCourse(null);
    setFormData({
      code: "",
      name: "",
      type: "",
      tuition_fee: "",
      status: "active",
    });
    setFormErrors({});
    setTouchedFields({});
    setIsModalOpen(true);
  };

  const handleEdit = (course) => {
    setCurrentCourse(course);
    setFormData({
      code: course.code || "",
      name: course.name || "",
      type: course.type || "",
      tuition_fee: course.tuition_fee || "",
      status: course.status || "active",
    });
    setFormErrors({});
    setTouchedFields({});
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    const course = courses.find((c) => c.id === id);
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (courseToDelete) {
      try {
        await axios.delete(
          `http://localhost:3000/admin/deleteCourse/${courseToDelete.id}`,
        );

        // Update local state
        setCourses(courses.filter((c) => c.id !== courseToDelete.id));
        setIsDeleteModalOpen(false);
        setCourseToDelete(null);
        toast.success("Course deleted successfully");
      } catch (error) {
        console.error("Error deleting course:", error);
        toast.error("Failed to delete course");
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouchedFields(allTouched);

    // Validate with duplicate checking
    const { errors, isValid } = validateCourse(
      formData,
      courses,
      currentCourse?.id,
    );
    setFormErrors(errors);

    if (!isValid) {
      // Show all validation errors as toasts
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
      return;
    }

    try {
      // Map form data to server format
      const serverData = mapComponentToServer(formData);

      if (currentCourse) {
        // Update existing course
        await axios.put(
          `http://localhost:3000/admin/editCourse/${currentCourse.id}`,
          serverData,
        );
        toast.success("Course updated successfully");
      } else {
        // Create new course
        await axios.post("http://localhost:3000/admin/addCourse", serverData);
        toast.success("Course added successfully");
      }

      // Reload courses from DB and map them
      const res = await axios.get("http://localhost:3000/admin/courseList");
      const mappedCourses = res.data.map(mapServerToComponent);
      setCourses(mappedCourses);

      handleCloseModal();
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Mark field as touched
    setTouchedFields({ ...touchedFields, [name]: true });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields({ ...touchedFields, [name]: true });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCourse(null);
    setFormData({
      code: "",
      name: "",
      type: "",
      tuition_fee: "",
      status: "active",
    });
    setFormErrors({});
    setTouchedFields({});
  };

  const formatCurrency = (amount) =>
    amount
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "PHP",
          minimumFractionDigits: 0,
        }).format(amount)
      : "N/A";

  const renderCourseTable = (coursesToRender) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {["code", "name", "type", "tuition_fee", "status"].map((key) => (
              <th
                key={key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort(key)}
              >
                <div className="flex items-center">
                  {key === "tuition_fee"
                    ? "Tuition Fee"
                    : key === "code"
                      ? "Course Code"
                      : key === "name"
                        ? "Course Name"
                        : key === "type"
                          ? "Duration"
                          : key.charAt(0).toUpperCase() + key.slice(1)}
                  {sortConfig.key === key &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    ))}
                </div>
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {coursesToRender.length ? (
            coursesToRender.map((course) => (
              <tr
                key={course.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{course.code}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">{course.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">{course.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900 font-medium">
                    {formatCurrency(course.tuition_fee)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={course.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {[
                      {
                        icon: Edit2,
                        onClick: () => handleEdit(course),
                        color: "blue",
                        title: "Edit",
                      },
                      {
                        icon: Trash2,
                        onClick: () => handleDeleteClick(course.id),
                        color: "red",
                        title: "Delete",
                      },
                    ].map(({ icon: Icon, onClick, color, title }, i) => (
                      <button
                        key={i}
                        onClick={onClick}
                        className={`p-1 text-gray-600 hover:text-${color}-600 transition-colors rounded hover:bg-${color}-50`}
                        title={title}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 font-medium">No courses found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filter"
                      : "Add your first course using the 'Add New Course' button"}
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const emptyStateComponent = (
    <div className="text-center py-12">
      <div className="flex flex-col items-center justify-center">
        <Search className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-500 font-medium">No courses found</p>
        <p className="text-gray-400 text-sm mt-1">
          {searchTerm || statusFilter !== "all"
            ? "Try adjusting your search or filter"
            : "Add your first course using the 'Add New Course' button"}
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentCourse ? "Edit Course" : "Add New Course"}
        size="md"
        closeOnBackdropClick
        closeOnEsc
      >
        <CourseForm
          formData={formData}
          onInputChange={handleInputChange}
          onBlur={handleBlur}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isEditing={!!currentCourse}
          errors={formErrors}
          touched={touchedFields}
        />
      </Modal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        courseName={courseToDelete?.name || "this course"}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Course Management
          </h1>
          <p className="text-gray-600">Manage all available courses</p>
        </div>
        <PrimaryButton
          onClick={handleAddNew}
          icon={Plus}
          className="mt-4 sm:mt-0"
        >
          Add New Course
        </PrimaryButton>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">All Courses</h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 pl-10 pr-10 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <Pagination
          items={filteredCourses}
          itemsPerPage={ITEMS_PER_PAGE}
          renderItems={renderCourseTable}
          emptyStateComponent={emptyStateComponent}
          showFirstLast
          siblingCount={1}
        />
      </Card>
    </div>
  );
}

export default CourseManagement;
