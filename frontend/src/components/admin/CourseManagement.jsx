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
import Pagination from "../ui/Pagination";
import { useAdmin } from "../../context/AdminContext";

const ITEMS_PER_PAGE = 5;

const CourseForm = ({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  isEditing,
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="space-y-5">
      {["code", "name"].map((field) => (
        <div key={field} className="relative">
          <input
            type="text"
            name={field}
            value={formData[field]}
            onChange={onInputChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400"
            required
            placeholder={`${field === "code" ? "Course Code" : "Course Name"} *`}
          />
          <div className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500 font-medium">
            {field === "code" ? "Course Code" : "Course Name"}
          </div>
        </div>
      ))}

      <div className="relative">
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Course Type *
        </label>
        <div className="relative">
          <select
            name="type"
            value={formData.type}
            onChange={onInputChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg outline-none transition-all duration-200 appearance-none bg-white hover:border-gray-400"
            required
          >
            <option value="">Select Course Type</option>
            {[
              "4 years Course",
              "2 years Course",
              "Short Course",
              "1 year Course",
              "Summer Class Course",
              "Certificate Course",
            ].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
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
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Tuition Fee (₱)
        </label>
        <div className="relative">
          <input
            type="number"
            name="tuition_fee"
            min="0"
            step="100"
            value={formData.tuition_fee}
            onChange={onInputChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg outline-none transition-all duration-200 hover:border-gray-400 scheme-light"
            placeholder="Enter tuition fee"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-400">₱</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Status
        </label>
        <div className="relative">
          <select
            name="status"
            value={formData.status}
            onChange={onInputChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg outline-none transition-all duration-200 appearance-none bg-white hover:border-gray-400"
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
        className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-blue-500/40 shadow-sm hover:shadow-md active:scale-[0.98]"
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

function CourseManagement() {
  const { initialCourses } = useAdmin();
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  useEffect(() => setCourses(initialCourses), [initialCourses]);

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
      const aVal = a[sortConfig.key],
        bVal = b[sortConfig.key];
      if (sortConfig.key === "tuition_fee")
        return sortConfig.direction === "ascending"
          ? (aVal || 0) - (bVal || 0)
          : (bVal || 0) - (aVal || 0);
      return sortConfig.direction === "ascending"
        ? aVal < bVal
          ? -1
          : aVal > bVal
            ? 1
            : 0
        : aVal > bVal
          ? -1
          : aVal < bVal
            ? 1
            : 0;
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
    setIsModalOpen(true);
  };
  const handleDelete = (id) =>
    window.confirm("Are you sure you want to delete this course?") &&
    setCourses(courses.filter((c) => c.id !== id));
  const handleToggleStatus = (id) =>
    setCourses(
      courses.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "inactive" : "active" }
          : c,
      ),
    );
  const handleSubmit = (e) => {
    e.preventDefault();
    setCourses(
      currentCourse
        ? courses.map((c) =>
            c.id === currentCourse.id ? { ...c, ...formData } : c,
          )
        : [
            ...courses,
            {
              id: courses.length
                ? Math.max(...courses.map((c) => c.id)) + 1
                : 1,
              ...formData,
            },
          ],
    );
    handleCloseModal();
  };
  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
                        icon: course.status === "active" ? EyeOff : Eye,
                        onClick: () => handleToggleStatus(course.id),
                        color: "yellow",
                        title:
                          course.status === "active"
                            ? "Deactivate"
                            : "Activate",
                      },
                      {
                        icon: Trash2,
                        onClick: () => handleDelete(course.id),
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
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isEditing={!!currentCourse}
        />
      </Modal>

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
