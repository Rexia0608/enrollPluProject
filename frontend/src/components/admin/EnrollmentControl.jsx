// components/admin/EnrollmentControl.jsx
import React, { useState } from "react";
import {
  Calendar,
  Lock,
  Unlock,
  Clock,
  AlertCircle,
  Edit2,
  Save,
  X,
  Plus,
  CheckCircle,
} from "lucide-react";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import StatusBadge from "../ui/StatusBadge";
import ConfirmDialog from "../ui/ConfirmDialog";

function EnrollmentControl() {
  const [enrollmentOpen, setEnrollmentOpen] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [activeYear, setActiveYear] = useState("2024-2025");
  const [editingSchedule, setEditingSchedule] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    startDate: "2024-01-15",
    endDate: "2024-03-31",
    registrationDeadline: "2024-03-15",
    lateRegistrationFee: 50,
    allowLateRegistration: true,
  });

  const [academicYears, setAcademicYears] = useState([
    {
      id: 1,
      year: "2024-2025",
      status: "active",
      startDate: "2024-06-01",
      endDate: "2025-05-31",
    },
    {
      id: 2,
      year: "2023-2024",
      status: "inactive",
      startDate: "2023-06-01",
      endDate: "2024-05-31",
    },
    {
      id: 3,
      year: "2022-2023",
      status: "inactive",
      startDate: "2022-06-01",
      endDate: "2023-05-31",
    },
  ]);

  const [newYear, setNewYear] = useState({
    year: "",
    startDate: "",
    endDate: "",
  });

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

  const handleScheduleUpdate = () => {
    // In real app, would call API
    setEditingSchedule(false);
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
    }
  };

  const handleAddAcademicYear = () => {
    if (!newYear.year || !newYear.startDate || !newYear.endDate) {
      alert("Please fill all fields");
      return;
    }

    const newYearObj = {
      id: academicYears.length + 1,
      year: newYear.year,
      status: "inactive",
      startDate: newYear.startDate,
      endDate: newYear.endDate,
    };

    setAcademicYears([newYearObj, ...academicYears]);
    setNewYear({ year: "", startDate: "", endDate: "" });
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Enrollment Control</h1>
        <p className="text-gray-600">
          Manage enrollment periods, academic years, and schedules
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Enrollment Status and Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enrollment Status Card */}
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
                    {activeYear}
                  </span>
                  <span className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded">
                    Active
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  All enrollments will be for this academic year
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
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">
                      {scheduleData.startDate}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">{scheduleData.endDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <StatusBadge status={scheduleStatus} size="sm" />
                  </div>
                </div>
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

          {/* Schedule Management Card */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Schedule Management
                </h3>
                <p className="text-gray-600">
                  Configure enrollment dates and deadlines
                </p>
              </div>
              {!editingSchedule ? (
                <SecondaryButton
                  onClick={() => setEditingSchedule(true)}
                  icon={Edit2}
                  size="sm"
                >
                  Edit Schedule
                </SecondaryButton>
              ) : (
                <div className="flex space-x-2">
                  <PrimaryButton
                    onClick={handleScheduleUpdate}
                    icon={Save}
                    size="sm"
                  >
                    Save Changes
                  </PrimaryButton>
                  <SecondaryButton
                    onClick={() => setEditingSchedule(false)}
                    icon={X}
                    size="sm"
                  >
                    Cancel
                  </SecondaryButton>
                </div>
              )}
            </div>

            {editingSchedule ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enrollment Start Date
                    </label>
                    <input
                      type="date"
                      value={scheduleData.startDate}
                      onChange={(e) =>
                        setScheduleData({
                          ...scheduleData,
                          startDate: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enrollment End Date
                    </label>
                    <input
                      type="date"
                      value={scheduleData.endDate}
                      onChange={(e) =>
                        setScheduleData({
                          ...scheduleData,
                          endDate: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Deadline
                    </label>
                    <input
                      type="date"
                      value={scheduleData.registrationDeadline}
                      onChange={(e) =>
                        setScheduleData({
                          ...scheduleData,
                          registrationDeadline: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Late Registration Fee
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        value={scheduleData.lateRegistrationFee}
                        onChange={(e) =>
                          setScheduleData({
                            ...scheduleData,
                            lateRegistrationFee: e.target.value,
                          })
                        }
                        className="w-full pl-8 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowLateRegistration"
                    checked={scheduleData.allowLateRegistration}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        allowLateRegistration: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="allowLateRegistration"
                    className="text-sm text-gray-700"
                  >
                    Allow late registration with fee
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Enrollment Period</span>
                    <StatusBadge status={scheduleStatus} size="sm" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium">{scheduleData.startDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">End Date</p>
                      <p className="font-medium">{scheduleData.endDate}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        Registration Deadline
                      </p>
                      <p className="font-medium">
                        {scheduleData.registrationDeadline}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Late Registration Fee
                      </p>
                      <p className="font-medium">
                        ${scheduleData.lateRegistrationFee}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Late Registration</p>
                      <p className="font-medium">
                        {scheduleData.allowLateRegistration
                          ? "Allowed"
                          : "Not Allowed"}
                      </p>
                    </div>
                  </div>
                </div>

                {scheduleStatus === "upcoming" && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                      <div>
                        <p className="font-medium text-yellow-900">
                          Enrollment period starts soon
                        </p>
                        <p className="text-sm text-yellow-800 mt-1">
                          Enrollment will open on {scheduleData.startDate}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {scheduleStatus === "expired" && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                      <div>
                        <p className="font-medium text-red-900">
                          Enrollment period has ended
                        </p>
                        <p className="text-sm text-red-800 mt-1">
                          The enrollment period ended on {scheduleData.endDate}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Academic Year Management */}
        <div className="space-y-6">
          {/* Academic Year Management */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Academic Years
                </h3>
                <p className="text-gray-600">
                  Manage academic years for enrollment
                </p>
              </div>
              <span className="text-xs text-gray-500">
                Only one active at a time
              </span>
            </div>

            {/* Add New Academic Year */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add New Academic Year
              </h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newYear.year}
                  onChange={(e) =>
                    setNewYear({ ...newYear, year: e.target.value })
                  }
                  placeholder="2025-2026"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={newYear.startDate}
                    onChange={(e) =>
                      setNewYear({ ...newYear, startDate: e.target.value })
                    }
                    placeholder="Start Date"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="date"
                    value={newYear.endDate}
                    onChange={(e) =>
                      setNewYear({ ...newYear, endDate: e.target.value })
                    }
                    placeholder="End Date"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <PrimaryButton
                  onClick={handleAddAcademicYear}
                  icon={Plus}
                  size="sm"
                  className="w-full"
                >
                  Add Academic Year
                </PrimaryButton>
              </div>
            </div>

            {/* Academic Years List */}
            <div className="space-y-3">
              {academicYears.map((year) => (
                <div
                  key={year.id}
                  className={`p-4 rounded-lg border ${
                    year.status === "active"
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">
                        {year.year}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {year.status === "active" ? (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-green-700">Active</span>
                        </div>
                      ) : (
                        <PrimaryButton
                          onClick={() => handleActivateYear(year.id)}
                          size="sm"
                        >
                          Activate
                        </PrimaryButton>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Start</p>
                      <p className="font-medium">{year.startDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">End</p>
                      <p className="font-medium">{year.endDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All Academic Years
              </button>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Enrollment Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Total Applications</span>
                <span className="font-bold text-gray-900">1,248</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Completed Enrollments</span>
                <span className="font-bold text-gray-900">876</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Pending Documents</span>
                <span className="font-bold text-gray-900">42</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Pending Payments</span>
                <span className="font-bold text-gray-900">28</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

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
