// components/student/StudentStatus.jsx
import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  BookOpen,
  Ban,
  Info,
  FileText,
  CreditCard,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import Card from "../ui/Card";
import StatusBadge from "../ui/StatusBadge";
import { toast } from "react-toastify";
import LoadingPage from "../../pages/LoadingPage";
import axios from "axios";

function StudentStatus() {
  const [currentSemester, setCurrentSemester] = useState(null);
  const [enrollmentStage, setEnrollmentStage] = useState("documents_pending");
  const [loading, setLoading] = useState(true);

  // Define the enrollment roadmap stages
  const roadmapStages = [
    {
      id: 1,
      key: "not_started",
      label: "Not Started",
      description: "Begin your enrollment application",
      icon: AlertCircle,
      color: "gray",
    },
    {
      id: 2,
      key: "documents_pending",
      label: "Document Submission",
      description: "Upload required documents",
      icon: FileText,
      color: "blue",
    },
    {
      id: 3,
      key: "documents_approved",
      label: "Document Review",
      description: "Documents under review",
      icon: CheckCircle,
      color: "green",
    },
    {
      id: 4,
      key: "payment_pending",
      label: "Payment",
      description: "Submit payment proof",
      icon: CreditCard,
      color: "purple",
    },
    {
      id: 5,
      key: "payment_validated",
      label: "Payment Validation",
      description: "Payment under validation",
      icon: Clock,
      color: "yellow",
    },
    {
      id: 6,
      key: "enrolled",
      label: "Enrolled",
      description: "Enrollment complete",
      icon: GraduationCap,
      color: "green",
    },
  ];

  // Simulate fetching current semester and enrollment status
  useEffect(() => {
    const fetchEnrollmentData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data - replace with actual API call
        const mockData = {
          semester: {
            id: 1,
            name: "1st Semester 2024-2025",
            status: "ongoing", // ongoing, upcoming, closed
            startDate: "2024-08-15",
            endDate: "2024-12-20",
            enrollmentStart: "2024-07-01",
            enrollmentEnd: "2024-08-10",
          },
          enrollment: {
            status: "documents_approved", // not_started, documents_pending, documents_approved, payment_pending, payment_validated, enrolled
          },
        };

        setCurrentSemester(mockData.semester);
        setEnrollmentStage(mockData.enrollment.status);
      } catch (error) {
        console.error("Error fetching enrollment data:", error);
        toast.error("Failed to load enrollment status");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentData();
  }, []);

  // Check if enrollment is available for current semester
  const isEnrollmentOpen = () => {
    if (!currentSemester) return false;

    const now = new Date();
    const enrollmentStart = new Date(currentSemester.enrollmentStart);
    const enrollmentEnd = new Date(currentSemester.enrollmentEnd);

    return now >= enrollmentStart && now <= enrollmentEnd;
  };

  // Get enrollment period status
  const getEnrollmentPeriodStatus = () => {
    if (!currentSemester) return { status: "loading", message: "Loading..." };

    const now = new Date();
    const enrollmentStart = new Date(currentSemester.enrollmentStart);
    const enrollmentEnd = new Date(currentSemester.enrollmentEnd);

    if (now < enrollmentStart) {
      const daysUntil = Math.ceil(
        (enrollmentStart - now) / (1000 * 60 * 60 * 24),
      );
      return {
        status: "upcoming",
        message: `Enrollment starts in ${daysUntil} days`,
        color: "blue",
        icon: Clock,
      };
    } else if (now > enrollmentEnd) {
      return {
        status: "closed",
        message: "Enrollment is closed",
        color: "gray",
        icon: Ban,
      };
    } else {
      const daysLeft = Math.ceil((enrollmentEnd - now) / (1000 * 60 * 60 * 24));
      return {
        status: "open",
        message: `Enrollment is open - ${daysLeft} days left`,
        color: "green",
        icon: CheckCircle,
      };
    }
  };

  // Get current stage index
  const getCurrentStageIndex = () => {
    return roadmapStages.findIndex((stage) => stage.key === enrollmentStage);
  };

  // Check if a stage is completed
  const isStageCompleted = (stageKey) => {
    const currentIndex = getCurrentStageIndex();
    const stageIndex = roadmapStages.findIndex(
      (stage) => stage.key === stageKey,
    );
    return stageIndex < currentIndex;
  };

  // Check if a stage is current
  const isStageCurrent = (stageKey) => {
    return stageKey === enrollmentStage;
  };

  if (loading) {
    return <LoadingPage />;
  }

  const enrollmentPeriod = getEnrollmentPeriodStatus();
  const PeriodIcon = enrollmentPeriod.icon;
  const isOpen = isEnrollmentOpen();
  const currentStageIndex = getCurrentStageIndex();

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Enrollment Status</h1>
        <p className="text-gray-600">
          View current enrollment period and your progress
        </p>
      </div>

      {/* Main Status Card */}
      <Card className="p-6">
        {/* Semester Info */}
        {currentSemester && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentSemester.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(currentSemester.startDate).toLocaleDateString()} -{" "}
                    {new Date(currentSemester.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <StatusBadge
                status={currentSemester.status}
                className={
                  currentSemester.status === "ongoing"
                    ? "bg-green-100 text-green-800"
                    : currentSemester.status === "upcoming"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                }
              />
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Enrollment Period Status */}
          <div className="lg:col-span-1 space-y-4">
            <h4 className="font-medium text-gray-700 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Enrollment Period
            </h4>

            <div
              className={`p-4 rounded-lg border ${
                enrollmentPeriod.status === "open"
                  ? "border-green-200 bg-green-50"
                  : enrollmentPeriod.status === "upcoming"
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-start space-x-3">
                <PeriodIcon
                  className={`w-5 h-5 ${
                    enrollmentPeriod.status === "open"
                      ? "text-green-600"
                      : enrollmentPeriod.status === "upcoming"
                        ? "text-blue-600"
                        : "text-gray-600"
                  }`}
                />
                <div>
                  <p
                    className={`font-medium ${
                      enrollmentPeriod.status === "open"
                        ? "text-green-800"
                        : enrollmentPeriod.status === "upcoming"
                          ? "text-blue-800"
                          : "text-gray-800"
                    }`}
                  >
                    {enrollmentPeriod.message}
                  </p>
                  {currentSemester && (
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(
                        currentSemester.enrollmentStart,
                      ).toLocaleDateString()}{" "}
                      -{" "}
                      {new Date(
                        currentSemester.enrollmentEnd,
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Current Status Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Current Status:
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {enrollmentStage === "not_started" &&
                      "You haven't started your enrollment yet."}
                    {enrollmentStage === "documents_pending" &&
                      "Your documents are pending submission."}
                    {enrollmentStage === "documents_approved" &&
                      "Your documents have been approved."}
                    {enrollmentStage === "payment_pending" &&
                      "Your payment is pending validation."}
                    {enrollmentStage === "payment_validated" &&
                      "Your payment has been validated."}
                    {enrollmentStage === "enrolled" &&
                      "You are successfully enrolled!"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action */}
            {isOpen && enrollmentStage !== "enrolled" && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  Next Step:
                </p>
                <p className="text-sm text-blue-700">
                  {enrollmentStage === "not_started" &&
                    "Start your enrollment application."}
                  {enrollmentStage === "documents_pending" &&
                    "Upload your required documents."}
                  {enrollmentStage === "documents_approved" &&
                    "Proceed to payment."}
                  {enrollmentStage === "payment_pending" &&
                    "Submit your payment proof."}
                  {enrollmentStage === "payment_validated" &&
                    "Wait for enrollment confirmation."}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Enrollment Roadmap */}
          <div className="lg:col-span-2">
            <h4 className="font-medium text-gray-700 mb-4 flex items-center">
              <GraduationCap className="w-4 h-4 mr-2" />
              Enrollment Roadmap
            </h4>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              <div className="space-y-6">
                {roadmapStages.map((stage) => {
                  const Icon = stage.icon;
                  const isCompleted = isStageCompleted(stage.key);
                  const isCurrent = isStageCurrent(stage.key);
                  const isPending = !isCompleted && !isCurrent;

                  return (
                    <div
                      key={stage.id}
                      className="relative flex items-start group"
                    >
                      {/* Stage Indicator */}
                      <div className="relative z-10 shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isCompleted
                              ? "bg-green-100"
                              : isCurrent
                                ? `bg-${stage.color}-100 ring-4 ring-${stage.color}-500/20`
                                : "bg-gray-100"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className={`w-5 h-5 text-green-600`} />
                          ) : (
                            <Icon
                              className={`w-5 h-5 ${
                                isCurrent
                                  ? `text-${stage.color}-600`
                                  : "text-gray-400"
                              }`}
                            />
                          )}
                        </div>
                      </div>

                      {/* Stage Content */}
                      <div className="ml-4 flex-1 pb-6">
                        <div className="flex items-center justify-between">
                          <h5
                            className={`font-semibold ${
                              isCompleted
                                ? "text-green-600"
                                : isCurrent
                                  ? `text-${stage.color}-600`
                                  : "text-gray-400"
                            }`}
                          >
                            {stage.label}
                          </h5>
                          {isCurrent && (
                            <span
                              className={`px-2 py-1 bg-${stage.color}-100 text-${stage.color}-700 text-xs font-medium rounded-full`}
                            >
                              Current Step
                            </span>
                          )}
                          {isCompleted && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              Completed
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-sm mt-0.5 ${
                            isPending ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {stage.description}
                        </p>

                        {/* Show next action for current stage */}
                        {isCurrent &&
                          isOpen &&
                          enrollmentStage !== "enrolled" && (
                            <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center group">
                              Proceed to {stage.label}
                              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </button>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Important Dates Summary */}
        {currentSemester && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-700 mb-3">Important Dates</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Enrollment Start</p>
                <p className="font-medium text-gray-900">
                  {new Date(
                    currentSemester.enrollmentStart,
                  ).toLocaleDateString()}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Enrollment End</p>
                <p className="font-medium text-gray-900">
                  {new Date(currentSemester.enrollmentEnd).toLocaleDateString()}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Classes Start</p>
                <p className="font-medium text-gray-900">
                  {new Date(currentSemester.startDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Help Card */}
      <Card className="mt-6 p-4 bg-gray-50">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-700">
              For questions about enrollment, please contact the Registrar's
              Office at
              <span className="font-medium"> registrar@school.edu</span> or call
              <span className="font-medium"> (123) 456-7890</span>.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default StudentStatus;
