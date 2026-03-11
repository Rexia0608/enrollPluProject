import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Edit2,
  CheckCircle,
  Lock,
  Unlock,
  Calendar,
  GraduationCap,
  Clock,
  AlertCircle,
  RefreshCw,
  XCircle,
  BookOpen,
  X,
} from "lucide-react";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import StatusBadge from "../ui/StatusBadge";
import ConfirmDialog from "../ui/ConfirmDialog";
import Modal from "../ui/Modal";
import { useAdmin } from "../../context/AdminContext";
import axios from "axios";

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:3000";
const SEMESTERS = ["1ST Semester", "2ND Semester", "Summer Class"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

const getDefaultDates = (semester, year) => {
  if (!year || !year.includes("-")) return { startDate: "", endDate: "" };
  const [startYear, endYear] = year.split("-").map(Number);

  const map = {
    "1ST Semester": {
      startDate: `${startYear}-06-01`,
      endDate: `${startYear}-10-31`,
    },
    "2ND Semester": {
      startDate: `${startYear}-11-01`,
      endDate: `${endYear}-03-31`,
    },
    "Summer Class": {
      startDate: `${endYear}-04-01`,
      endDate: `${endYear}-05-31`,
    },
  };

  return map[semester] || { startDate: "", endDate: "" };
};

const getNextAcademicYear = () => {
  const y = new Date().getFullYear();
  return `${y}-${y + 1}`;
};

const transformApiData = (apiData) => {
  if (!apiData) return null;
  return {
    id: apiData.id,
    year_series: apiData.year_series || "",
    semester: apiData.semester || "",
    startDate: apiData.start_date ? apiData.start_date.split("T")[0] : "",
    endDate: apiData.end_date ? apiData.end_date.split("T")[0] : "",
    isClassOngoing:
      apiData.is_class_ongoing === true || apiData.is_class_ongoing === 1,
    enrollmentOpen:
      apiData.enrollment_open === true || apiData.enrollment_open === 1,
  };
};

// ─── Shared Styles ────────────────────────────────────────────────────────────
const inputClasses =
  "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400 bg-white";
const tableHeaderClasses =
  "px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider";
const tableCellClasses = "px-6 py-4 whitespace-nowrap text-sm text-gray-700";

// ─── Form Component ───────────────────────────────────────────────────────────
const AcademicYearForm = ({
  values,
  onChange,
  onSubmit,
  onCancel,
  isEdit,
  isSubmitting,
}) => {
  const handleSemesterChange = (e) => {
    const semester = e.target.value;
    const defaults = getDefaultDates(semester, values.academicYear);
    onChange({ ...values, semester, ...defaults });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Academic Year (YYYY-YYYY) *
        </label>
        <input
          type="text"
          value={values.academicYear}
          onChange={(e) =>
            onChange({ ...values, academicYear: e.target.value })
          }
          placeholder="2024-2025"
          className={inputClasses}
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Semester *
        </label>
        <select
          value={values.semester}
          onChange={handleSemesterChange}
          className={inputClasses}
          required
          disabled={isSubmitting}
        >
          {SEMESTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-1 italic">
          Dates auto-adjust based on selection
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Start Date *
          </label>
          <input
            type="date"
            value={values.startDate}
            onChange={(e) => onChange({ ...values, startDate: e.target.value })}
            className={inputClasses}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            End Date *
          </label>
          <input
            type="date"
            value={values.endDate}
            onChange={(e) => onChange({ ...values, endDate: e.target.value })}
            className={inputClasses}
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <PrimaryButton
          type="submit"
          icon={isEdit ? CheckCircle : Plus}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isEdit
              ? "Saving..."
              : "Adding..."
            : isEdit
              ? "Save Changes"
              : "Add Academic Year"}
        </PrimaryButton>
      </div>
    </form>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EnrollmentControl() {
  const { academicYear, refreshAcademicYears, getAuthHeaders } = useAdmin();

  // Local State
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmOpenEnrollment, setIsConfirmOpenEnrollment] = useState(false);
  const [isConfirmClassStatus, setIsConfirmClassStatus] = useState(false);

  // Selection State
  const [selectedYear, setSelectedYear] = useState(null);
  const [pendingClassStatus, setPendingClassStatus] = useState(null); // true or false
  const [formData, setFormData] = useState({
    id: null,
    academicYear: "",
    semester: "1ST Semester",
    startDate: "",
    endDate: "",
  });

  // Alerts
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Auto-clear alerts
  useEffect(() => {
    if (!error && !successMessage) return;
    const timer = setTimeout(() => {
      setError("");
      setSuccessMessage("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, successMessage]);

  // Reset pending state when modal closes
  useEffect(() => {
    if (!isConfirmClassStatus) {
      const timer = setTimeout(() => {
        setPendingClassStatus(null);
        setSelectedYear(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isConfirmClassStatus]);

  // Sync Context Data to Local State
  useEffect(() => {
    if (
      academicYear?.AcademicYear &&
      Array.isArray(academicYear.AcademicYear)
    ) {
      const transformed =
        academicYear.AcademicYear.map(transformApiData).filter(Boolean);
      setYears(transformed);
    } else {
      setYears([]);
    }
  }, [academicYear]);

  // Handlers
  const handleOpenAdd = () => {
    const nextYear = getNextAcademicYear();
    setFormData({
      id: null,
      academicYear: nextYear,
      semester: "1ST Semester",
      ...getDefaultDates("1ST Semester", nextYear),
    });
    setError("");
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (year) => {
    setSelectedYear(year);
    setFormData({ ...year });
    setError("");
    setIsEditModalOpen(true);
  };

  const validateForm = (data) => {
    if (
      !data.academicYear ||
      !data.semester ||
      !data.startDate ||
      !data.endDate
    ) {
      setError("Please fill all fields");
      return false;
    }
    if (!/^\d{4}-\d{4}$/.test(data.academicYear)) {
      setError("Please use format YYYY-YYYY (e.g., 2024-2025)");
      return false;
    }
    if (new Date(data.endDate) <= new Date(data.startDate)) {
      setError("End date must be after start date");
      return false;
    }
    return true;
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(formData)) return;

    setIsSubmitting(true);
    try {
      await axios.post(
        `${API_BASE}/admin/addAcademicYear`,
        {
          year_series: formData.academicYear,
          semester: formData.semester,
          start_date: formData.startDate,
          end_date: formData.endDate,
          enrollment_open: false,
          is_class_ongoing: false,
        },
        getAuthHeaders(),
      );

      setSuccessMessage("Academic year added successfully");
      setIsAddModalOpen(false);
      await refreshAcademicYears();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add academic year");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(formData)) return;

    setIsSubmitting(true);
    try {
      await axios.patch(
        `${API_BASE}/admin/updateAcademicYear/${formData.id}`,
        {
          year_series: formData.academicYear,
          semester: formData.semester,
          start_date: formData.startDate,
          end_date: formData.endDate,
        },
        getAuthHeaders(),
      );

      setSuccessMessage("Academic year updated successfully");
      setIsEditModalOpen(false);
      await refreshAcademicYears();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update academic year");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivateClick = (year) => {
    if (year.enrollmentOpen) {
      setError("Enrollment is already open for this academic year");
      return;
    }
    setSelectedYear(year);
    setIsConfirmOpenEnrollment(true);
  };

  // Updated: Handle class status toggle click with validation
  const handleClassStatusClick = (year, newStatus) => {
    // Prevent toggling if there's already an active class and we're trying to start another
    if (
      newStatus === true &&
      ongoingClassYear &&
      ongoingClassYear.id !== year.id
    ) {
      setError(
        `Cannot start classes for ${year.semester} while ${ongoingClassYear.semester} is still ongoing. End current classes first.`,
      );
      return;
    }

    // Prevent ending classes that haven't started
    if (newStatus === false && !year.isClassOngoing) {
      setError("Cannot end classes that haven't started.");
      return;
    }

    setSelectedYear(year);
    setPendingClassStatus(newStatus);
    setIsConfirmClassStatus(true);
  };

  const confirmOpenEnrollment = async () => {
    if (!selectedYear) return;

    setIsSubmitting(true);
    try {
      await axios.patch(
        `${API_BASE}/admin/switchStatusAcademicYear/${selectedYear.id}`,
        {
          enrollment_open: true,
        },
        getAuthHeaders(),
      );

      setSuccessMessage("Enrollment opened successfully");
      setIsConfirmOpenEnrollment(false);
      await refreshAcademicYears();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to open enrollment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Updated: Confirm class status change with better error handling
  const confirmClassStatusChange = async () => {
    if (!selectedYear || pendingClassStatus === null) {
      setError("Invalid class status change request");
      return;
    }

    setIsSubmitting(true);
    setError(""); // Clear any previous errors

    try {
      const response = await axios.patch(
        `${API_BASE}/admin/switchClassStatusAcademicYear/${selectedYear.id}`,
        {
          is_class_ongoing: pendingClassStatus,
        },
        getAuthHeaders(),
      );

      // Check if the response was successful
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(
          pendingClassStatus
            ? `Classes started successfully for ${selectedYear.semester} ${selectedYear.year_series}`
            : `Classes ended successfully for ${selectedYear.semester} ${selectedYear.year_series}`,
        );

        // Refresh the data
        await refreshAcademicYears();
      }
    } catch (err) {
      // Handle specific error cases
      if (err.response?.status === 400) {
        setError(
          err.response?.data?.message ||
            "Cannot change class status at this time",
        );
      } else if (err.response?.status === 409) {
        setError("Conflict: Another class is currently ongoing. End it first.");
      } else {
        setError(
          err.response?.data?.message || "Failed to update class status",
        );
      }
      console.error("Class status change error:", err);
    } finally {
      setIsSubmitting(false);
      setIsConfirmClassStatus(false);
      setPendingClassStatus(null);
      setSelectedYear(null);
    }
  };

  const toggleEnrollment = async (year) => {
    setIsSubmitting(true);
    try {
      await axios.patch(
        `${API_BASE}/admin/switchStatusAcademicYear/${year.id}`,
        { enrollment_open: !year.enrollmentOpen },
        getAuthHeaders(),
      );

      setSuccessMessage(
        `Enrollment ${!year.enrollmentOpen ? "opened" : "closed"} successfully`,
      );
      await refreshAcademicYears();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to toggle enrollment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await refreshAcademicYears();
      setSuccessMessage("Data refreshed successfully");
    } catch (err) {
      setError("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmClassStatus(false);
    setPendingClassStatus(null);
    setSelectedYear(null);
  };

  // Derived State
  const activeYear = useMemo(
    () => years.find((y) => y.enrollmentOpen),
    [years],
  );

  const ongoingClassYear = useMemo(
    () => years.find((y) => y.isClassOngoing),
    [years],
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Academic Year Management
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage semesters, schedules, enrollment, and class status.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <PrimaryButton onClick={handleOpenAdd} icon={Plus}>
            Add Academic Year
          </PrimaryButton>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <XCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-sm text-green-600">{successMessage}</p>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Enrollment Open Card */}
        {activeYear && (
          <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Enrollment Open: {activeYear.academicYear}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {activeYear.semester}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Accepting Applications
                    </span>
                  </div>
                </div>
              </div>
              <StatusBadge status="active" />
            </div>
          </Card>
        )}

        {/* Class Ongoing Card */}
        {ongoingClassYear && (
          <Card className="bg-linear-to-r from-emerald-50 to-green-50 border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Classes Ongoing: {ongoingClassYear.academicYear}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {ongoingClassYear.semester}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      In Session
                    </span>
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                Active
              </span>
            </div>
          </Card>
        )}
      </div>

      {/* Table Section */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className={tableHeaderClasses}>Academic Year</th>
                <th className={tableHeaderClasses}>Semester</th>
                <th className={tableHeaderClasses}>Duration</th>
                <th className={tableHeaderClasses}>Enrollment</th>
                <th className={tableHeaderClasses}>Class Status</th>
                <th className={`${tableHeaderClasses} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {years.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <AlertCircle className="w-8 h-8 text-gray-300 mb-2" />
                      <p>No academic years found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                years.map((year) => (
                  <tr
                    key={year.id}
                    className={`transition-colors ${
                      year.enrollmentOpen || year.isClassOngoing
                        ? "bg-blue-50/30 border-l-4 border-blue-500"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className={tableCellClasses}>
                      <div className="flex items-center">
                        {(year.enrollmentOpen || year.isClassOngoing) && (
                          <span
                            className={`mr-2 flex h-2 w-2 rounded-full ${
                              year.enrollmentOpen
                                ? "bg-blue-600"
                                : "bg-emerald-500"
                            }`}
                          ></span>
                        )}
                        <span className="font-medium text-gray-900">
                          {year.year_series}
                        </span>
                      </div>
                    </td>
                    <td className={tableCellClasses}>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {year.semester}
                      </span>
                    </td>
                    <td className={tableCellClasses}>
                      <div className="text-gray-900">
                        {formatDate(year.startDate)}
                      </div>
                      <div className="text-gray-500 text-xs">
                        to {formatDate(year.endDate)}
                      </div>
                    </td>
                    <td className={tableCellClasses}>
                      <button
                        onClick={() => toggleEnrollment(year)}
                        disabled={isSubmitting}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          year.enrollmentOpen
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {year.enrollmentOpen ? (
                          <>
                            <Unlock className="w-3 h-3 mr-1" /> Open
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 mr-1" /> Closed
                          </>
                        )}
                      </button>
                    </td>
                    {/* Updated: Class Status with loading states and validation */}
                    <td className={tableCellClasses}>
                      {year.isClassOngoing ? (
                        <button
                          onClick={() => handleClassStatusClick(year, false)}
                          disabled={isSubmitting || loading}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                            isSubmitting
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:shadow-sm active:scale-95"
                          }`}
                          title="Click to end classes"
                        >
                          {isSubmitting &&
                          pendingClassStatus === false &&
                          selectedYear?.id === year.id ? (
                            <>
                              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                              Ending...
                            </>
                          ) : (
                            <>
                              <BookOpen className="w-3 h-3 mr-1" />
                              Ongoing
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleClassStatusClick(year, true)}
                          disabled={
                            isSubmitting ||
                            loading ||
                            (ongoingClassYear &&
                              ongoingClassYear.id !== year.id)
                          }
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                            isSubmitting ||
                            (ongoingClassYear &&
                              ongoingClassYear.id !== year.id)
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-sm active:scale-95"
                          }`}
                          title={
                            ongoingClassYear && ongoingClassYear.id !== year.id
                              ? `Cannot start: ${ongoingClassYear.semester} is still ongoing`
                              : "Click to start classes"
                          }
                        >
                          {isSubmitting &&
                          pendingClassStatus === true &&
                          selectedYear?.id === year.id ? (
                            <>
                              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                              Starting...
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              Not Started
                            </>
                          )}
                        </button>
                      )}
                    </td>
                    <td className={`${tableCellClasses} text-right`}>
                      <div className="flex items-center justify-end space-x-2">
                        {!year.enrollmentOpen && (
                          <button
                            onClick={() => handleActivateClick(year)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Open Enrollment"
                            disabled={isSubmitting}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(year)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit Year"
                          disabled={isSubmitting}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Academic Year"
        size="md"
      >
        <AcademicYearForm
          values={formData}
          onChange={setFormData}
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAddModalOpen(false)}
          isEdit={false}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Academic Year"
        size="md"
      >
        <AcademicYearForm
          values={formData}
          onChange={setFormData}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditModalOpen(false)}
          isEdit={true}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Confirm Open Enrollment */}
      <ConfirmDialog
        isOpen={isConfirmOpenEnrollment}
        onClose={() => setIsConfirmOpenEnrollment(false)}
        onConfirm={confirmOpenEnrollment}
        title="Open Enrollment?"
        message={`Are you sure you want to open enrollment for ${selectedYear?.year_series} - ${selectedYear?.semester}? Students will be able to submit applications.`}
        confirmText="Open Enrollment"
        confirmColor="blue"
        isConfirming={isSubmitting}
      />

      {/* Updated: Dynamic Class Status Confirmation Dialog with better messaging */}
      <ConfirmDialog
        isOpen={isConfirmClassStatus}
        onClose={handleCloseConfirmDialog}
        onConfirm={confirmClassStatusChange}
        title={pendingClassStatus ? "Start Classes?" : "End Classes?"}
        message={
          pendingClassStatus
            ? `Are you sure you want to START classes for ${selectedYear?.year_series} - ${selectedYear?.semester}? 
               \n\nThis will: 
               \n• Mark the semester as currently in session
               \n• Allow class-related activities to begin
               \n• Update the system status for all enrolled students`
            : `Are you sure you want to END classes for ${selectedYear?.year_series} - ${selectedYear?.semester}?
               \n\nThis will:
               \n• Mark the semester as completed
               \n• Finalize current class records
               \n• Prepare for grade submission`
        }
        confirmText={
          pendingClassStatus ? "Yes, Start Classes" : "Yes, End Classes"
        }
        cancelText="No, Cancel"
        confirmColor={pendingClassStatus ? "blue" : "red"}
        isConfirming={isSubmitting}
        icon={pendingClassStatus ? BookOpen : XCircle}
      />
    </div>
  );
}
