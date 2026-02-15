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

  const getNextAcademicYear = () => {
    const y = new Date().getFullYear();
    return `${y}-${y + 1}`;
  };
  const getDefaultDatesForSemester = (semester, yearRange) => {
    const [s, e] = yearRange.split("-").map(Number);
    return (
      {
        "1ST Semester": { startDate: `${s}-06-01`, endDate: `${s}-10-31` },
        "2ND Semester": { startDate: `${s}-11-01`, endDate: `${e}-03-31` },
        "Summer Class": { startDate: `${e}-04-01`, endDate: `${e}-05-31` },
      }[semester] || { startDate: `${s}-06-01`, endDate: `${e}-05-31` }
    );
  };

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

  const handleSemesterChange = (e) => {
    const semester = e.target.value;
    const defaultDates = getDefaultDatesForSemester(semester, newYear.year);
    setNewYear({
      ...newYear,
      semester,
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
    });
  };

  const handleToggleEnrollment = () =>
    enrollmentOpen ? setShowConfirmDialog(true) : setEnrollmentOpen(true);
  const confirmCloseEnrollment = () => {
    setEnrollmentOpen(false);
    setShowConfirmDialog(false);
  };

  const handleActivateYear = (yearId) => {
    const updatedYears = academicYears.map((y) => ({
      ...y,
      status: y.id === yearId ? "active" : "inactive",
    }));
    setAcademicYears(updatedYears);
    const activated = updatedYears.find((y) => y.id === yearId);
    if (activated) {
      setActiveYear(activated.year);
      setScheduleData({
        ...scheduleData,
        startDate: activated.startDate,
        endDate: activated.endDate,
      });
    }
  };

  const handleAddAcademicYear = () => {
    if (
      !newYear.semester ||
      !newYear.year ||
      !newYear.startDate ||
      !newYear.endDate
    )
      return alert("Please fill all fields");
    if (!/^\d{4}-\d{4}$/.test(newYear.year))
      return alert("Please use format YYYY-YYYY (e.g., 2024-2025)");
    if (new Date(newYear.endDate) <= new Date(newYear.startDate))
      return alert("End date must be after start date");

    const fullYearName = `${newYear.semester} ${newYear.year}`;
    if (academicYears.some((y) => y.year === fullYearName))
      return alert("This academic year already exists");

    const isFirstYear = !academicYears.length;
    const newYearObj = {
      id: academicYears.length + 1,
      year: fullYearName,
      status: isFirstYear ? "active" : "inactive",
      startDate: newYear.startDate,
      endDate: newYear.endDate,
    };

    setAcademicYears([newYearObj, ...academicYears]);
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
    const today = new Date(),
      start = new Date(scheduleData.startDate),
      end = new Date(scheduleData.endDate);
    return today < start ? "upcoming" : today > end ? "expired" : "active";
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";
  const scheduleStatus = getScheduleStatus();
  const inputClasses =
    "w-full border border-gray-300 rounded-xl px-4 py-3.5 text-sm focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 focus:shadow-lg outline-none transition-all duration-200 hover:border-gray-400";

  return (
    <div>
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

      <div className="grid grid-cols-1 gap-6">
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
              {[
                {
                  bg: "bg-blue-50",
                  icon: Calendar,
                  color: "text-blue-600",
                  title: "Active Academic Year",
                  value: activeYear || "No active year",
                  badge: activeYear && "Active",
                },
                {
                  bg: "bg-gray-50",
                  icon: Clock,
                  color: "text-gray-600",
                  title: "Enrollment Period",
                  value: activeYear ? (
                    <div className="space-y-2">
                      {["Start Date", "End Date", "Status"].map((label, i) => (
                        <div
                          key={label}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">{label}:</span>
                          <span className="font-medium">
                            {i === 0 ? (
                              formatDate(scheduleData.startDate)
                            ) : i === 1 ? (
                              formatDate(scheduleData.endDate)
                            ) : (
                              <StatusBadge status={scheduleStatus} size="sm" />
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center py-4">
                      <p className="text-gray-500 text-sm">
                        No Enrollment Period Set Yet
                      </p>
                    </div>
                  ),
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`p-4 ${item.bg} border border-${item.bg === "bg-blue-50" ? "blue-200" : "gray-200"} rounded-lg`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                  </div>
                  {i === 0 ? (
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        {item.value}
                      </span>
                      {item.badge && (
                        <span className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  ) : (
                    item.value
                  )}
                  {i === 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Current active semester for enrollment
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Enrollment is currently {enrollmentOpen ? "open" : "closed"}
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
                  className={`p-4 border rounded-lg ${year.status === "active" ? "border-blue-300 bg-blue-50" : "border-gray-200"}`}
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
              {academicYears.length > 3 && (
                <p className="text-sm text-gray-500 text-center pt-2">
                  + {academicYears.length - 3} more academic years
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      <Modal
        isOpen={showAddYearModal}
        onClose={() => setShowAddYearModal(false)}
        title="Add New Academic Year"
        size="md"
        closeOnBackdropClick
        closeOnEsc
      >
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Select Semester *
              </label>
              <div className="relative">
                <select
                  value={newYear.semester}
                  onChange={handleSemesterChange}
                  className={`${inputClasses} appearance-none bg-white`}
                  required
                >
                  {["1ST Semester", "2ND Semester", "Summer Class"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none top-7">
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

            {["year", "startDate", "endDate"].map((field) => (
              <div key={field} className="relative">
                <input
                  type={field === "year" ? "text" : "date"}
                  value={newYear[field]}
                  onChange={(e) =>
                    setNewYear({ ...newYear, [field]: e.target.value })
                  }
                  placeholder={field === "year" ? "2024-2025" : ""}
                  className={inputClasses}
                  required
                />
                <div className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-500 font-medium">
                  {field === "year"
                    ? "Academic Year"
                    : field === "startDate"
                      ? "Start Date"
                      : "End Date"}
                </div>
              </div>
            ))}

            <p className="text-xs text-gray-500 italic">
              * Dates auto-adjust based on semester selection
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddYearModal(false)}
              className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddAcademicYear}
              className="px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-blue-500/40 shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <span className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Academic Year
              </span>
            </button>
          </div>
        </div>
      </Modal>

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
