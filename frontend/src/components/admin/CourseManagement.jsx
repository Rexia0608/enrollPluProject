// components/admin/CourseManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import StatusBadge from "../ui/StatusBadge";
import Modal from "../ui/Modal";

function CourseManagement() {
  // Initial courses data
  const initialCourses = [
    {
      id: 1,
      code: "BSCS",
      name: "Bachelor of Science in Computer Science",
      type: "4 years Course",
      started_date: "2023-09-01",
      end_date: "2027-06-30",
      status: "active",
    },
    {
      id: 2,
      code: "CSS",
      name: "Computer System Servicing NC II",
      type: "Short Course",
      started_date: "2024-01-15",
      end_date: "2024-06-15",
      status: "active",
    },
    {
      id: 3,
      code: "BSIT",
      name: "Bachelor of Science in Information Technology",
      type: "4 years Course",
      started_date: "2023-09-01",
      end_date: "2027-06-30",
      status: "inactive",
    },
    {
      id: 4,
      code: "Humss",
      name: "Humanities and Social Sciences",
      type: "2 years Course",
      started_date: "2024-01-20",
      end_date: "2026-01-20",
      status: "active",
    },
    {
      id: 5,
      code: "STEM",
      name: "Science, Technology, Engineering and Mathematics",
      type: "2 years Course",
      started_date: "2024-02-01",
      end_date: "2026-02-01",
      status: "inactive",
    },
  ];

  // State management
  const [courses, setCourses] = useState(initialCourses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "",
    started_date: "",
    end_date: "",
    status: "active",
  });

  // Handle sorting
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Sort courses based on configuration
  const getSortedCourses = () => {
    if (!sortConfig.key) return [...courses];

    return [...courses].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle dates
      if (sortConfig.key.includes("date")) {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        return sortConfig.direction === "ascending"
          ? dateA - dateB
          : dateB - dateA;
      }

      // Handle strings
      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  // Filter courses based on search and status
  const filteredCourses = getSortedCourses().filter((course) => {
    const matchesSearch =
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || course.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // CRUD Operations
  const handleAddNew = () => {
    setCurrentCourse(null);
    setFormData({
      code: "",
      name: "",
      type: "",
      started_date: "",
      end_date: "",
      status: "active",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (course) => {
    setCurrentCourse(course);
    setFormData({
      code: course.code,
      name: course.name,
      type: course.type,
      started_date: course.started_date || "",
      end_date: course.end_date || "",
      status: course.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((course) => course.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setCourses(
      courses.map((course) =>
        course.id === id
          ? {
              ...course,
              status: course.status === "active" ? "inactive" : "active",
            }
          : course,
      ),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentCourse) {
      // Update existing course
      setCourses(
        courses.map((course) =>
          course.id === currentCourse.id ? { ...course, ...formData } : course,
        ),
      );
    } else {
      // Add new course
      const newCourse = {
        id: Math.max(...courses.map((c) => c.id)) + 1,
        ...formData,
      };
      setCourses([...courses, newCourse]);
    }

    handleCloseModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCourse(null);
    setFormData({
      code: "",
      name: "",
      type: "",
      started_date: "",
      end_date: "",
      status: "active",
    });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentCourse ? "Edit Course" : "Add New Course"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            {/* Course Code */}
            <div className="relative">
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className="
          w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm
          focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg
          outline-none transition-all duration-200
          placeholder:text-gray-400
          hover:border-gray-400
        "
                required
                placeholder="Course Code *"
              />
              <div className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500 font-medium">
                Course Code
              </div>
            </div>

            {/* Course Name */}
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="
          w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm
          focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg
          outline-none transition-all duration-200
          placeholder:text-gray-400
          hover:border-gray-400
        "
                required
                placeholder="Course Name *"
              />
              <div className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500 font-medium">
                Course Name
              </div>
            </div>

            {/* Course Type */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Course Type *
              </label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="
            w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm
            focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg
            outline-none transition-all duration-200 appearance-none
            bg-white hover:border-gray-400
          "
                  required
                >
                  <option value="" className="text-gray-400">
                    Select Course Type
                  </option>
                  <option value="4 years Course">4 years Course</option>
                  <option value="2 years Course">2 years Course</option>
                  <option value="Short Course">Short Course</option>
                  <option value="1 year Course">1 year Course</option>
                  <option value="Certificate Course">Certificate Course</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="started_date"
                    value={formData.started_date}
                    onChange={handleInputChange}
                    className="
              w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm
              focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg
              outline-none transition-all duration-200
              hover:border-gray-400
              [color-scheme:light]
            "
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="
              w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm
              focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg
              outline-none transition-all duration-200
              hover:border-gray-400
              [color-scheme:light]
            "
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Status
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="
            w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm
            focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg
            outline-none transition-all duration-200 appearance-none
            bg-white hover:border-gray-400
          "
                >
                  <option value="active" className="text-green-600">
                    Active
                  </option>
                  <option value="inactive" className="text-red-600">
                    Inactive
                  </option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="
        px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium 
        text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300
      "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="
        px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white 
        rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800
        transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-blue-500/40
        shadow-sm hover:shadow-md active:scale-[0.98]
      "
            >
              {currentCourse ? (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Update Course
                </span>
              ) : (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                  Add Course
                </span>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Main Content */}
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
        {/* Filter and Search Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">All Courses</h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                  className="border border-gray-300 rounded-lg px-3 py-2 pl-10 pr-10 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("code")}
                >
                  <div className="flex items-center">
                    Course Code
                    {sortConfig.key === "code" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Course Name
                    {sortConfig.key === "name" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("type")}
                >
                  <div className="flex items-center">
                    Course Type
                    {sortConfig.key === "type" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {sortConfig.key === "status" &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp className="w-4 h-4 ml-1" />
                      ) : (
                        <ChevronDown className="w-4 h-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {course.code}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{course.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{course.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {course.started_date && course.end_date
                          ? `${formatDate(course.started_date)} - ${formatDate(course.end_date)}`
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={course.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="p-1 text-gray-600 hover:text-blue-600 transition-colors rounded hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(course.id)}
                          className="p-1 text-gray-600 hover:text-yellow-600 transition-colors rounded hover:bg-yellow-50"
                          title={
                            course.status === "active"
                              ? "Deactivate"
                              : "Activate"
                          }
                        >
                          {course.status === "active" ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-1 text-gray-600 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 font-medium">
                        No courses found
                      </p>
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

        {/* Footer with Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold">{filteredCourses.length}</span> of{" "}
            <span className="font-semibold">{courses.length}</span> courses
            {(searchTerm || statusFilter !== "all") && (
              <span className="ml-2 text-gray-400 text-xs">(filtered)</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium">
              1
            </button>
            <button
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={filteredCourses.length <= 10}
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CourseManagement;
