// components/student/StudentStatus.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  RefreshCw,
} from "lucide-react";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import StatusBadge from "../ui/StatusBadge";
import { ToastContainer, toast } from "react-toastify";
import LoadingPage from "../../pages/LoadingPage";
import { useStudent } from "../../context/StudentContext";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

function StudentStatus() {
  const [currentSemester, setCurrentSemester] = useState(null);
  const [enrollmentStage, setEnrollmentStage] = useState("not_started");
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { user } = useAuth();
  const { getAuthHeaders } = useStudent();
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  // Define valid enrollment stages (matches API enrollment_status values)
  const validStages = [
    "not_started",
    "documents_review",
    "documents_pending",
    "documents_approved",
    "payment_pending",
    "payment_validated",
    "enrolled",
  ];

  // Define the enrollment roadmap stages
  const roadmapStages = [
    {
      id: 1,
      key: "not_started",
      label: "Start here",
      description: "Begin your enrollment application",
      icon: AlertCircle,
      color: "gray",
    },
    {
      id: 2,
      key: "documents_review",
      label: "Document Submission",
      description: "Documents under review",
      icon: FileText,
      color: "blue",
    },
    {
      id: 3,
      key: "documents_approved",
      label: "Document Accepted",
      description: "Document passed the evaluation",
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

  // Helper function to safely determine enrollment stage from API response
  const determineEnrollmentStage = (enrollmentData) => {
    if (!enrollmentData) return "not_started";
    const status = enrollmentData.enrollment_status;
    if (!status || !validStages.includes(status)) return "not_started";
    return status;
  };

  // Validate user ID before making requests
  const validateUserId = () => {
    if (!user?.id) {
      console.error("User ID is missing");
      setError("User information not available");
      return false;
    }
    return true;
  };

  // Core data fetching logic (can show a refreshing indicator)
  const fetchEnrollmentData = useCallback(
    async (showRefreshing = false) => {
      if (showRefreshing) setIsRefreshing(true);
      setError(null);

      try {
        if (!validateUserId()) {
          if (showRefreshing) setIsRefreshing(false);
          setIsInitialLoad(false);
          return;
        }

        const api = axios.create({
          baseURL: "http://localhost:3000",
          timeout: 10000,
          headers: getAuthHeaders().headers,
        });

        let enrollmentStatusResponse = { data: { data: null } };
        let enrollmentResponse = { data: { data: null } };

        try {
          enrollmentStatusResponse = await api.get(
            `/student/enrollment-open-status`,
          );
        } catch (err) {
          console.error("Error fetching enrollment open status:", err);
          if (err.code !== "ERR_CANCELED" && showRefreshing) {
            toast.warn("Unable to fetch enrollment period details");
          }
        }

        try {
          enrollmentResponse = await api.get(
            `/student/validate-enrolled-student/${user.id}`,
          );
        } catch (err) {
          if (err.response?.status === 404) {
            console.log(
              "ℹ️ Enrollment not found for user (expected for new students)",
            );
          } else if (err.response?.status !== 404 && showRefreshing) {
            toast.warn("Unable to fetch enrollment details");
          }
        }

        const enrollmentData = enrollmentResponse?.data?.data;
        const enrollmentStatusData = enrollmentStatusResponse?.data?.data;

        const stage = determineEnrollmentStage(enrollmentData);
        setEnrollmentStage(stage);

        // Build semester data from both APIs
        let semesterName = "No Active Semester";
        let enrollmentStart = null;
        let enrollmentEnd = null;
        let enrollmentId = null;
        let isEnrollmentOpen = false;
        let isClassOngoing = false;
        let yearLevel = null;
        let studentType = null;
        let yearSeries = null;
        let semester = null;

        if (enrollmentStatusData) {
          yearSeries = enrollmentStatusData.year_series;
          semester = enrollmentStatusData.semester;
          enrollmentStart = enrollmentStatusData.start_date || null;
          enrollmentEnd = enrollmentStatusData.end_date || null;
          isEnrollmentOpen = enrollmentStatusData.enrollment_open || false;
          if (semester && yearSeries) {
            semesterName = `${semester} ${yearSeries}`;
          } else if (semester) {
            semesterName = semester;
          } else if (yearSeries) {
            semesterName = yearSeries;
          }
        }

        if (enrollmentData) {
          enrollmentId = enrollmentData.enrollment_id || null;
          isClassOngoing = enrollmentData.is_class_ongoing || false;
          yearLevel = enrollmentData.year_level || null;
          studentType = enrollmentData.student_type || null;
          if (!semesterName || semesterName === "No Active Semester") {
            if (enrollmentData.semester && enrollmentData.year_series) {
              semesterName = `${enrollmentData.semester} ${enrollmentData.year_series}`;
            } else if (enrollmentData.semester) {
              semesterName = enrollmentData.semester;
            } else if (enrollmentData.year_series) {
              semesterName = enrollmentData.year_series;
            }
          }
          if (!enrollmentStart)
            enrollmentStart = enrollmentData.start_date || null;
          if (!enrollmentEnd) enrollmentEnd = enrollmentData.end_date || null;
          if (
            !isEnrollmentOpen &&
            enrollmentData.enrollment_open !== undefined
          ) {
            isEnrollmentOpen = enrollmentData.enrollment_open;
          }
        }

        const semesterData = {
          id: enrollmentId,
          name: semesterName,
          classesStart: null,
          enrollmentStart,
          enrollmentEnd,
          enrollmentOpen: isEnrollmentOpen,
          isClassOngoing,
          yearLevel,
          studentType,
          yearSeries,
          semester,
          rawData: { enrollment: enrollmentData, status: enrollmentStatusData },
        };

        setCurrentSemester(semesterData);
      } catch (error) {
        console.error("Error in fetchEnrollmentData:", error);
        if (error.code === "ECONNABORTED") {
          toast.error("Request timeout. Please check your connection.");
        } else if (error.code === "ERR_NETWORK") {
          toast.error("Network error. Please check your connection.");
        } else if (error.response?.status === 500) {
          toast.error("Server error. Please try again later.");
        } else if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
        } else if (error.response?.status !== 404 && showRefreshing) {
          toast.error("Failed to load enrollment status");
        }
        setEnrollmentStage("not_started");
        setCurrentSemester(null);
      } finally {
        if (showRefreshing) setIsRefreshing(false);
        setIsInitialLoad(false);
      }
    },
    [user?.id, getAuthHeaders],
  );

  // Initial load (show refreshing indicator)
  useEffect(() => {
    fetchEnrollmentData(true);
  }, [fetchEnrollmentData]);

  // Background polling every 30 minutes (no indicator)
  useEffect(() => {
    intervalRef.current = setInterval(
      () => {
        fetchEnrollmentData(false);
      },
      30 * 60 * 1000,
    ); // 30 * 60 * 1000 30 minutes
    return () => clearInterval(intervalRef.current);
  }, [fetchEnrollmentData]);

  // Manual refresh
  const refreshData = () => {
    fetchEnrollmentData(true);
  };

  // Check if enrollment is available for current semester
  const isEnrollmentOpen = () => {
    if (currentSemester?.enrollmentOpen !== undefined) {
      return currentSemester.enrollmentOpen;
    }
    if (!currentSemester?.enrollmentStart || !currentSemester?.enrollmentEnd)
      return false;
    try {
      const now = new Date();
      const enrollmentStart = new Date(currentSemester.enrollmentStart);
      const enrollmentEnd = new Date(currentSemester.enrollmentEnd);
      if (isNaN(enrollmentStart.getTime()) || isNaN(enrollmentEnd.getTime()))
        return false;
      return now >= enrollmentStart && now <= enrollmentEnd;
    } catch {
      return false;
    }
  };

  const getEnrollmentPeriodStatus = () => {
    if (!currentSemester) {
      return {
        status: "loading",
        message: "Loading...",
        color: "gray",
        icon: Clock,
      };
    }
    if (currentSemester.enrollmentOpen !== undefined) {
      if (currentSemester.enrollmentOpen) {
        return {
          status: "open",
          message: "Enrollment is open",
          color: "green",
          icon: CheckCircle,
        };
      } else {
        return {
          status: "closed",
          message: "Enrollment is closed",
          color: "gray",
          icon: Ban,
        };
      }
    }
    if (!currentSemester.enrollmentStart || !currentSemester.enrollmentEnd) {
      return {
        status: "unavailable",
        message: "Enrollment dates not available",
        color: "gray",
        icon: AlertCircle,
      };
    }
    try {
      const now = new Date();
      const enrollmentStart = new Date(currentSemester.enrollmentStart);
      const enrollmentEnd = new Date(currentSemester.enrollmentEnd);
      if (isNaN(enrollmentStart.getTime()) || isNaN(enrollmentEnd.getTime())) {
        return {
          status: "unavailable",
          message: "Invalid enrollment dates",
          color: "gray",
          icon: AlertCircle,
        };
      }
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
        const daysLeft = Math.ceil(
          (enrollmentEnd - now) / (1000 * 60 * 60 * 24),
        );
        return {
          status: "open",
          message: `Enrollment is open - ${daysLeft} days left`,
          color: "green",
          icon: CheckCircle,
        };
      }
    } catch {
      return {
        status: "error",
        message: "Error loading enrollment period",
        color: "red",
        icon: AlertCircle,
      };
    }
  };

  // Get current stage index
  const getCurrentStageIndex = () =>
    roadmapStages.findIndex((stage) => stage.key === enrollmentStage);
  const isStageCompleted = (stageKey) => {
    const currentIndex = getCurrentStageIndex();
    const stageIndex = roadmapStages.findIndex(
      (stage) => stage.key === stageKey,
    );
    return stageIndex < currentIndex;
  };
  const isStageCurrent = (stageKey) => stageKey === enrollmentStage;

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const handleStartEnrollment = () => {
    toast.info("Starting enrollment application...");
    navigate("/student/dashboard/enrollment");
  };

  const handleRetry = () => {
    fetchEnrollmentData(true);
  };

  // Show initial loading screen only on first load
  if (isInitialLoad) {
    return <LoadingPage />;
  }

  if (error && !currentSemester) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error Loading Data
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <PrimaryButton onClick={handleRetry}>Try Again</PrimaryButton>
      </div>
    );
  }

  const enrollmentPeriod = getEnrollmentPeriodStatus();
  const PeriodIcon = enrollmentPeriod.icon;
  const isOpen = isEnrollmentOpen();

  const getBadgeProps = (status) => {
    switch (status) {
      case "open":
        return { label: "Ongoing", className: "bg-green-100 text-green-800" };
      case "upcoming":
        return { label: "Upcoming", className: "bg-blue-100 text-blue-800" };
      case "closed":
        return { label: "Closed", className: "bg-gray-100 text-gray-800" };
      default:
        return { label: status, className: "bg-gray-100 text-gray-800" };
    }
  };
  const badgeProps = getBadgeProps(enrollmentPeriod.status);

  return (
    <div>
      {/* Header with Refresh Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Enrollment Status
          </h1>
          <p className="text-gray-600">
            View current enrollment period and your progress
          </p>
        </div>
        <button
          onClick={refreshData}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Updating..." : "Refresh"}
        </button>
      </div>

      {/* Main Status Card */}
      <Card className="p-6">
        {/* Semester Info */}
        {currentSemester ? (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentSemester.name}
                  </h3>
                  {currentSemester.id && (
                    <p className="text-sm text-gray-600">
                      Enrollment Reference:{" "}
                      <strong>{currentSemester.id}</strong>
                    </p>
                  )}
                  {currentSemester.yearLevel && (
                    <p className="text-sm text-gray-600">
                      Year Level: <strong>{currentSemester.yearLevel}</strong>
                    </p>
                  )}
                </div>
              </div>
              <StatusBadge
                status={badgeProps.label}
                className={badgeProps.className}
              />
            </div>
          </div>
        ) : (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6 text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold text-gray-500">
                  No Active Semester
                </h3>
                <p className="text-sm text-gray-400">
                  Please check back later for enrollment periods
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Enrollment Period Status */}
          <div className="lg:col-span-1 space-y-4">
            <h4 className="font-medium text-gray-700 flex items-center">
              <Calendar className="w-4 h-4 mr-2" /> Enrollment Period
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
                  {currentSemester?.enrollmentStart &&
                    currentSemester?.enrollmentEnd && (
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(currentSemester.enrollmentStart)} -{" "}
                        {formatDate(currentSemester.enrollmentEnd)}
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
                    {enrollmentStage === "documents_review" &&
                      "Your documents are being processed for review."}
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

            {/* Welcome Message for New Students */}
            {enrollmentStage === "not_started" && !currentSemester?.id && (
              <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800 flex items-center">
                  <span className="text-lg mr-2">👋</span>
                  Welcome! It looks like you're new here. Start your enrollment
                  journey today!
                </p>
              </div>
            )}

            {/* Quick Action - Start Enrollment Button for New Students */}
            {isOpen && enrollmentStage === "not_started" && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  Get Started:
                </p>
                <PrimaryButton
                  onClick={handleStartEnrollment}
                  className="w-full flex items-center justify-center"
                >
                  Start Your Enrollment{" "}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </PrimaryButton>
              </div>
            )}

            {/* Quick Action for Returning Students */}
            {isOpen &&
              enrollmentStage !== "enrolled" &&
              enrollmentStage !== "not_started" && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    Next Step:
                  </p>
                  <p className="text-sm text-blue-700">
                    {enrollmentStage === "documents_review" &&
                      "Your documents are under evaluation."}
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
              <GraduationCap className="w-4 h-4 mr-2" /> Enrollment Roadmap
            </h4>

            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {roadmapStages.map((stage) => {
                  const Icon = stage.icon;
                  const isCompleted = isStageCompleted(stage.key);
                  const isCurrent = isStageCurrent(stage.key);
                  const isPending = !isCompleted && !isCurrent;
                  const getColorClasses = (color) => {
                    const colorMap = {
                      green: {
                        bg: "bg-green-100",
                        ring: "ring-green-500/20",
                        text: "text-green-600",
                        currentText: "text-green-600",
                      },
                      blue: {
                        bg: "bg-blue-100",
                        ring: "ring-blue-500/20",
                        text: "text-blue-600",
                        currentText: "text-blue-600",
                      },
                      purple: {
                        bg: "bg-purple-100",
                        ring: "ring-purple-500/20",
                        text: "text-purple-600",
                        currentText: "text-purple-600",
                      },
                      yellow: {
                        bg: "bg-yellow-100",
                        ring: "ring-yellow-500/20",
                        text: "text-yellow-600",
                        currentText: "text-yellow-600",
                      },
                      gray: {
                        bg: "bg-gray-100",
                        ring: "ring-gray-500/20",
                        text: "text-gray-600",
                        currentText: "text-gray-600",
                      },
                      red: {
                        bg: "bg-red-100",
                        ring: "ring-red-500/20",
                        text: "text-red-600",
                        currentText: "text-red-600",
                      },
                    };
                    return colorMap[color] || colorMap.gray;
                  };
                  const colors = getColorClasses(stage.color);
                  return (
                    <div
                      key={stage.id}
                      className="relative flex items-start group"
                    >
                      <div className="relative z-10 shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isCompleted
                              ? "bg-green-100"
                              : isCurrent
                                ? `${colors.bg} ring-4 ${colors.ring}`
                                : "bg-gray-100"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Icon
                              className={`w-5 h-5 ${isCurrent ? colors.text : "text-gray-400"}`}
                            />
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex-1 pb-6">
                        <div className="flex items-center justify-between">
                          <h5
                            className={`font-semibold ${isCompleted ? "text-green-600" : isCurrent ? colors.currentText : "text-gray-400"}`}
                          >
                            {stage.label}
                          </h5>
                          {isCurrent && (
                            <span
                              className={`px-2 py-1 ${colors.bg} ${colors.text} text-xs font-medium rounded-full`}
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
                          className={`text-sm mt-0.5 ${isPending ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {stage.description}
                        </p>
                        {isCurrent &&
                          isOpen &&
                          enrollmentStage !== "enrolled" && (
                            <button
                              onClick={
                                enrollmentStage === "not_started"
                                  ? handleStartEnrollment
                                  : undefined
                              }
                              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center group"
                            >
                              {enrollmentStage === "not_started"
                                ? "Start Enrollment"
                                : `Proceed to ${stage.label}`}
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
                  {formatDate(currentSemester.enrollmentStart)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Enrollment End</p>
                <p className="font-medium text-gray-900">
                  {formatDate(currentSemester.enrollmentEnd)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Classes Start</p>
                <p className="font-medium text-gray-900">
                  {formatDate(currentSemester.classesStart)}
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

      <ToastContainer />
    </div>
  );
}

export default StudentStatus;
