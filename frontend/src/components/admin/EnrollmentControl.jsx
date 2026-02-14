// components/admin/EnrollmentControl.jsx
import React, { useState } from "react";
import { Calendar, Lock, Unlock, Clock, Plus } from "lucide-react";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import StatusBadge from "../ui/StatusBadge";
import ConfirmDialog from "../ui/ConfirmDialog";
import Modal from "../ui/Modal";

function EnrollmentControl() {
  const [enrollmentOpen, setEnrollmentOpen] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAddYearModal, setShowAddYearModal] = useState(false);

  // Find the active academic year
  const [academicYears, setAcademicYears] = useState([]);

  const [activeYear, setActiveYear] = useState("");

  const [scheduleData, setScheduleData] = useState({
    startDate: "2024-01-15",
    endDate: "2024-03-31",
    registrationDeadline: "2024-03-15",
    lateRegistrationFee: 50,
    allowLateRegistration: true,
  });

  const [newYear, setNewYear] = useState({
    semester: "1ST Semester",
    year: "",
    startDate: "",
    endDate: "",
  });

  // Function to get next academic year
  const getNextAcademicYear = () => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    return `${currentYear}-${nextYear}`;
  };

  // Function to get default dates based on semester
  const getDefaultDatesForSemester = (semester, yearRange) => {
    const [startYear, endYear] = yearRange.split("-").map(Number);

    switch (semester) {
      case "1ST Semester":
        return {
          startDate: `${startYear}-06-01`,
          endDate: `${startYear}-10-31`,
        };
      case "2ND Semester":
        return {
          startDate: `${startYear}-11-01`,
          endDate: `${endYear}-03-31`,
        };
      case "Summer Class":
        return {
          startDate: `${endYear}-04-01`,
          endDate: `${endYear}-05-31`,
        };
      default:
        return {
          startDate: `${startYear}-06-01`,
          endDate: `${endYear}-05-31`,
        };
    }
  };

  // Reset form with next academic year when modal opens
  const handleOpenAddYearModal = () => {
    const nextYear = getNextAcademicYear();
    const defaultDates = getDefaultDatesForSemester("1ST Semester", nextYear);

    setNewYear({
      semester: "1ST Semester",
      year: nextYear,
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
    });

    setShowAddYearModal(true);
  };

  // Handle semester change
  const handleSemesterChange = (e) => {
    const semester = e.target.value;
    const defaultDates = getDefaultDatesForSemester(semester, newYear.year);

    setNewYear({
      ...newYear,
      semester: semester,
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
    });
  };

  const handleToggleEnrollment = () => {
    if (enrollmentOpen) {
      setShowConfirmDialog(true);
    } else {
      setEnrollmentOpen(true);
    }
  };

  const confirmCloseEnrollment = () => {
    setEnrollmentOpen(false);
    setShowConfirmDialog(false);
  };

  const handleActivateYear = (yearId) => {
    // Only one year can be active at a time
    const updatedYears = academicYears.map((year) => ({
      ...year,
      status: year.id === yearId ? "active" : "inactive",
    }));
    setAcademicYears(updatedYears);
    const activatedYear = updatedYears.find((y) => y.id === yearId);
    if (activatedYear) {
      setActiveYear(activatedYear.year);
      // Update enrollment period dates with the active academic year dates
      setScheduleData({
        ...scheduleData,
        startDate: activatedYear.startDate,
        endDate: activatedYear.endDate,
      });
    }
  };

  const handleAddAcademicYear = () => {
    if (
      !newYear.semester ||
      !newYear.year ||
      !newYear.startDate ||
      !newYear.endDate
    ) {
      alert("Please fill all fields");
      return;
    }

    // Validate year format (YYYY-YYYY)
    const yearRegex = /^\d{4}-\d{4}$/;
    if (!yearRegex.test(newYear.year)) {
      alert("Please use format YYYY-YYYY (e.g., 2024-2025)");
      return;
    }

    // Validate dates
    if (new Date(newYear.endDate) <= new Date(newYear.startDate)) {
      alert("End date must be after start date");
      return;
    }

    const fullYearName = `${newYear.semester} ${newYear.year}`;

    // Check if academic year already exists
    const yearExists = academicYears.some((y) => y.year === fullYearName);
    if (yearExists) {
      alert("This academic year already exists");
      return;
    }

    // If this is the first academic year, make it active
    const isFirstYear = academicYears.length === 0;

    const newYearObj = {
      id: academicYears.length + 1,
      year: fullYearName,
      status: isFirstYear ? "active" : "inactive",
      startDate: newYear.startDate,
      endDate: newYear.endDate,
    };

    setAcademicYears([newYearObj, ...academicYears]);

    // If this is the first year, set it as active and update enrollment period
    if (isFirstYear) {
      setActiveYear(fullYearName);
      setScheduleData({
        ...scheduleData,
        startDate: newYear.startDate,
        endDate: newYear.endDate,
      });
    }

    setNewYear({
      semester: "1ST Semester",
      year: "",
      startDate: "",
      endDate: "",
    });
    setShowAddYearModal(false);
  };

  const getScheduleStatus = () => {
    const today = new Date();
    const startDate = new Date(scheduleData.startDate);
    const endDate = new Date(scheduleData.endDate);

    if (today < startDate) return "upcoming";
    if (today > endDate) return "expired";
    return "active";
  };

  const scheduleStatus = getScheduleStatus();

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Add Academic Year Modal Content
  const AddAcademicYearModal = () => (
    <Modal
      isOpen={showAddYearModal}
      onClose={() => setShowAddYearModal(false)}
      title="Add New Academic Year"
      size="md"
      closeOnBackdropClick={true}
      closeOnEsc={true}
      backdropBlur="md"
      backdropOpacity="dark"
    >
      <div className="space-y-4">
        <div className="space-y-4">
          {/* Semester Selection */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Select Semester *
            </label>
            <div className="relative">
              <select
                value={newYear.semester}
                onChange={handleSemesterChange}
                className="
                  w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm
                  focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg
                  outline-none transition-all duration-200 appearance-none
                  bg-white hover:border-gray-400
                "
                required
              >
                <option value="1ST Semester">1ST Semester</option>
                <option value="2ND Semester">2ND Semester</option>
                <option value="Summer Class">Summer Class</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none top-7">
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

          {/* Year Input */}
          <div className="relative">
            <input
              type="text"
              value={newYear.year}
              onChange={(e) => setNewYear({ ...newYear, year: e.target.value })}
              placeholder="2024-2025"
              className="
                w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm
                focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg
                outline-none transition-all duration-200
                placeholder:text-gray-400
                hover:border-gray-400
              "
              required
            />
            <div className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500 font-medium">
              Academic Year
            </div>
          </div>

          {/* Start Date */}
          <div className="relative">
            <input
              type="date"
              value={newYear.startDate}
              onChange={(e) =>
                setNewYear({ ...newYear, startDate: e.target.value })
              }
              className="
                w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm
                focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg
                outline-none transition-all duration-200
                hover:border-gray-400
              "
              required
            />
            <div className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500 font-medium">
              Start Date
            </div>
          </div>

          {/* End Date */}
          <div className="relative">
            <input
              type="date"
              value={newYear.endDate}
              onChange={(e) =>
                setNewYear({ ...newYear, endDate: e.target.value })
              }
              className="
                w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm
                focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg
                outline-none transition-all duration-200
                hover:border-gray-400
              "
              required
            />
            <div className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500 font-medium">
              End Date
            </div>
          </div>

          <p className="text-xs text-gray-500 italic">
            * Dates auto-adjust based on semester selection
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => setShowAddYearModal(false)}
            className="
              px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium 
              text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300
            "
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddAcademicYear}
            className="
              px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white 
              rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800
              transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-blue-500/40
              shadow-sm hover:shadow-md active:scale-[0.98]
            "
          >
            <span className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Academic Year
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div>
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Enrollment Control
          </h1>
          <p className="text-gray-600">
            Manage enrollment periods, academic years, and schedules
          </p>
        </div>

        <PrimaryButton
          onClick={handleOpenAddYearModal}
          icon={Plus}
          className="mt-4 sm:mt-0"
        >
          Add Academic Year
        </PrimaryButton>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Enrollment Status Card */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Enrollment Status
                </h3>
                <p className="text-gray-600">
                  Control enrollment availability for students
                </p>
              </div>
              <StatusBadge status={enrollmentOpen ? "open" : "closed"} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active Academic Year */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-gray-900">
                    Active Academic Year
                  </h4>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {activeYear || "No active year"}
                  </span>
                  {activeYear && (
                    <span className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Current active semester for enrollment
                </p>
              </div>

              {/* Enrollment Period */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <h4 className="font-medium text-gray-900">
                    Enrollment Period
                  </h4>
                </div>
                {activeYear ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">
                        {formatDate(scheduleData.startDate)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">End Date:</span>
                      <span className="font-medium">
                        {formatDate(scheduleData.endDate)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <StatusBadge status={scheduleStatus} size="sm" />
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center py-4">
                    <p className="text-gray-500 text-sm">
                      No Enrollment Period Set Yet
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Enrollment Toggle */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {enrollmentOpen
                      ? "Enrollment is currently open"
                      : "Enrollment is currently closed"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {enrollmentOpen
                      ? "Students can submit applications and upload documents"
                      : "New applications are not being accepted"}
                  </p>
                </div>
                <PrimaryButton
                  onClick={handleToggleEnrollment}
                  icon={enrollmentOpen ? Lock : Unlock}
                  className="w-full sm:w-auto"
                >
                  {enrollmentOpen ? "Close Enrollment" : "Open Enrollment"}
                </PrimaryButton>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Academic Years List - Last 3 Entries */}
      {academicYears.length > 0 && (
        <Card className="mt-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Academic Years
            </h3>
            <div className="space-y-3">
              {academicYears.slice(0, 3).map((year) => (
                <div
                  key={year.id}
                  className={`p-4 border rounded-lg ${
                    year.status === "active"
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {year.year}
                    </span>
                    <StatusBadge
                      status={year.status === "active" ? "active" : "inactive"}
                      size="sm"
                    />
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {formatDate(year.startDate)} - {formatDate(year.endDate)}
                  </div>
                </div>
              ))}

              {/* Show message if there are more than 3 entries */}
              {academicYears.length > 3 && (
                <p className="text-sm text-gray-500 text-center pt-2">
                  + {academicYears.length - 3} more academic years
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Add Academic Year Modal */}
      <AddAcademicYearModal />

      {/* Confirmation Dialog for Closing Enrollment */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmCloseEnrollment}
        title="Close Enrollment Period?"
        message="Closing enrollment will prevent new students from applying. Existing applications can continue through the process. This action cannot be undone."
        confirmText="Close Enrollment"
        confirmColor="red"
      />
    </div>
  );
}

export default EnrollmentControl;
