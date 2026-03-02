// components/student/EnrollmentProfiling.jsx
import React, { useState, useEffect } from "react";
import LoadingPage from "../../pages/LoadingPage";
import FailedLoadData from "../../pages/FailedLoadData";
import {
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  CheckCircle,
  Upload,
  FileText,
  XCircle,
  Lock,
  Unlock,
  Save,
  Eye,
  RefreshCw,
  Info,
  Clock,
  Loader2,
  GraduationCap,
  Calendar,
  FileCheck,
  X,
} from "lucide-react";
import { useStudent } from "../../context/StudentContext";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const API_BASE = "http://localhost:3000/student";

const EnrollmentProfiling = ({ onSuccess, onCancel }) => {
  // Context data
  const { user } = useAuth();
  const {
    initialCourses,
    enrollmentStatus,
    loading: contextLoading,
    error: contextError,
    getAuthHeaders,
    refreshData,
  } = useStudent();

  // Local state
  const [activeStep, setActiveStep] = useState(1);
  const [studentType, setStudentType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [myEnrollment, setMyEnrollment] = useState(null);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);

  // Form data
  const [formData, setFormData] = useState({
    contactNumber: "",
    address: "",
    yearLevel: "",
    course: "",
  });

  // Documents
  const [documents, setDocuments] = useState({
    form138: { file: null, required: false, label: "Form 138 / Report Card" },
    birthCertificate: {
      file: null,
      required: false,
      label: "Birth Certificate",
    },
    transcript: { file: null, required: false, label: "Transcript of Records" },
    honorableDismissal: {
      file: null,
      required: false,
      label: "Honorable Dismissal",
    },
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Derived values from context
  const isEnrollmentOpen = enrollmentStatus?.enrollment_open ?? false;
  const academicYear = enrollmentStatus?.academic_year;
  const semester = enrollmentStatus?.semester;
  const enrollmentStart = enrollmentStatus?.start_date;
  const enrollmentEnd = enrollmentStatus?.end_date;

  // Check existing enrollment on mount
  useEffect(() => {
    checkExistingEnrollment();
  }, []);

  // Set academic year and semester when context loads
  useEffect(() => {
    if (academicYear && semester) {
      setFormData((prev) => ({
        ...prev,
        academicYear,
        semester,
      }));
    }
  }, [academicYear, semester]);

  // Update document requirements when student type changes
  useEffect(() => {
    setDocuments((prev) => ({
      ...prev,
      form138: { ...prev.form138, required: studentType === "new" },
      birthCertificate: {
        ...prev.birthCertificate,
        required: studentType === "new",
      },
      transcript: {
        ...prev.transcript,
        required: studentType === "transferee",
      },
      honorableDismissal: {
        ...prev.honorableDismissal,
        required: studentType === "transferee",
      },
    }));
    // Clear errors when type changes
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.studentType;
      return newErrors;
    });
  }, [studentType]);

  console.log(user);

  const checkExistingEnrollment = async () => {
    try {
      setCheckingEnrollment(true);
      const response = await axios.get(
        `${API_BASE}/my-enrollment`,
        getAuthHeaders(),
      );
      setMyEnrollment(response.data);
    } catch (err) {
      // 404 means no enrollment exists - that's fine
      if (err.response?.status !== 404) {
        console.error("Failed to check enrollment:", err);
      }
      setMyEnrollment(null);
    } finally {
      setCheckingEnrollment(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileSelect = (docType, file) => {
    setDocuments((prev) => ({
      ...prev,
      [docType]: { ...prev[docType], file },
    }));
    if (errors[docType]) {
      setErrors((prev) => ({ ...prev, [docType]: null }));
    }
  };

  const handleFileRemove = (docType) => {
    setDocuments((prev) => ({
      ...prev,
      [docType]: { ...prev[docType], file: null },
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!studentType) {
        newErrors.studentType = "Please select your student type";
      }
    }

    if (step === 2) {
      if (!formData.contactNumber?.trim()) {
        newErrors.contactNumber = "Contact number is required";
      } else if (
        !/^[0-9]{11}$/.test(formData.contactNumber.replace(/\D/g, ""))
      ) {
        newErrors.contactNumber = "Must be 11 digits";
      }

      if (!formData.address?.trim()) {
        newErrors.address = "Address is required";
      }

      if (!formData.yearLevel) {
        newErrors.yearLevel = "Please select year level";
      }

      if (!formData.course) {
        newErrors.course = "Please select a course";
      }
    }

    if (step === 3 && (studentType === "new" || studentType === "transferee")) {
      Object.entries(documents).forEach(([key, doc]) => {
        if (doc.required && !doc.file) {
          newErrors[key] = `${doc.label} is required`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Create FormData to send both enrollment data AND files
      const formData = new FormData();

      // Add enrollment data fields
      formData.append("studentId", user?.id);
      formData.append("studentType", studentType);
      formData.append("contactNumber", formData.contactNumber);
      formData.append("address", formData.address);
      formData.append("yearLevel", formData.yearLevel);
      formData.append("course", formData.course);
      formData.append("academicYear", academicYear);
      formData.append("semester", semester);
      formData.append(
        "fullName",
        `${user?.firstName || ""} ${user?.middleName || ""} ${user?.lastName || ""}`.trim(),
      );
      formData.append("email", user?.email);
      formData.append("birthDate", user?.birthDate);
      formData.append("gender", user?.gender);

      // Add documents if applicable
      if (studentType === "new" || studentType === "transferee") {
        Object.entries(documents).forEach(([key, doc]) => {
          if (doc.file) {
            formData.append(key, doc.file);
          }
        });
      }

      // Single request with everything
      const response = await axios.post(
        `${API_BASE}/upload-documents`,
        formData,
        {
          ...getAuthHeaders(),
          headers: {
            ...getAuthHeaders().headers,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setSubmitSuccess(true);
      await checkExistingEnrollment();
      refreshData?.();
      onSuccess?.(response.data);
    } catch (err) {
      console.error("Submission failed:", err);
      setSubmitError(
        err.response?.data?.message ||
          "Failed to submit enrollment. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Loading states
  if (contextLoading || checkingEnrollment) {
    return <LoadingPage />;
  }

  // Context error
  if (contextError) {
    return <FailedLoadData />;
  }

  // Enrollment closed
  if (!isEnrollmentOpen) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-linear-to-r from-red-600 to-red-700 px-6 py-5">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Enrollment Closed
          </h2>
        </div>
        <div className="p-8 text-center">
          <div className="bg-red-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Enrollment is Not Available
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The enrollment period is currently closed. Please check back during
            the scheduled enrollment dates.
          </p>

          {enrollmentStart && enrollmentEnd && (
            <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto border border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <div className="text-left">
                  <p className="text-gray-500 mb-1">Enrollment Opens</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(enrollmentStart).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-gray-400">
                  <div className="w-12 h-px bg-gray-300"></div>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 mb-1">Enrollment Closes</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(enrollmentEnd).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={checkExistingEnrollment}
            className="mt-8 text-blue-600 hover:text-blue-800 flex items-center justify-center mx-auto font-medium"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Check Again
          </button>
        </div>
      </div>
    );
  }

  // Already enrolled or pending
  if (myEnrollment && myEnrollment.status !== "rejected") {
    const statusConfig = {
      enrolled: {
        bg: "bg-green-50",
        border: "border-green-200",
        icon: CheckCircle,
        iconColor: "text-green-600",
        title: "You are Currently Enrolled",
        message:
          "You have successfully completed enrollment for this semester.",
        gradient: "from-green-600 to-green-700",
      },
      approved: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: FileCheck,
        iconColor: "text-blue-600",
        title: "Enrollment Approved",
        message:
          "Your application has been approved. Please complete the next steps.",
        gradient: "from-blue-600 to-blue-700",
      },
      pending: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        icon: Clock,
        iconColor: "text-yellow-600",
        title: "Application Under Review",
        message:
          "Your enrollment is being processed. You'll be notified once approved.",
        gradient: "from-yellow-600 to-yellow-700",
      },
    };

    const config = statusConfig[myEnrollment.status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className={`bg-linear-to-r ${config.gradient} px-6 py-5`}>
          <h2 className="text-xl font-semibold text-white flex items-center">
            <GraduationCap className="w-5 h-5 mr-2" />
            Enrollment Status
          </h2>
        </div>
        <div className="p-8">
          <div
            className={`${config.bg} border ${config.border} rounded-xl p-6 mb-6`}
          >
            <div className="flex items-start">
              <div className={`${config.iconColor} mr-4`}>
                <Icon className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-bold ${config.iconColor} mb-2`}>
                  {config.title}
                </h3>
                <p className="text-gray-700 mb-4">{config.message}</p>

                <div className="grid grid-cols-2 gap-4 text-sm bg-white/50 rounded-lg p-4">
                  <div>
                    <span className="text-gray-500 block">Enrollment ID</span>
                    <span className="font-semibold text-gray-900">
                      {myEnrollment.id || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Submitted</span>
                    <span className="font-semibold text-gray-900">
                      {myEnrollment.submittedAt
                        ? new Date(
                            myEnrollment.submittedAt,
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Student Type</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {myEnrollment.studentType || studentType}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Course</span>
                    <span className="font-semibold text-gray-900">
                      {myEnrollment.course || formData.course || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {myEnrollment.status === "enrolled" && (
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3">
                What's Next?
              </h4>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 shrink-0" />
                  View your class schedule and assigned subjects
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 shrink-0" />
                  Check your email for important enrollment information
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 shrink-0" />
                  Proceed to student portal for additional resources
                </li>
              </ul>
            </div>
          )}

          <button
            onClick={checkExistingEnrollment}
            className="mt-6 text-blue-600 hover:text-blue-800 flex items-center font-medium"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Status
          </button>
        </div>
      </div>
    );
  }

  // Success state after submission
  if (submitSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
        <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Enrollment Submitted Successfully!
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Your enrollment application has been received and is now under review.
          You'll receive an email confirmation shortly.
        </p>
        <button
          onClick={() => {
            setSubmitSuccess(false);
            checkExistingEnrollment();
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Status
        </button>
      </div>
    );
  }

  // Main enrollment form
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center">
              <GraduationCap className="w-6 h-6 mr-2" />
              Student Enrollment
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Complete your profiling to enroll for {semester} {academicYear}
            </p>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
            <span className="text-white font-medium text-sm">
              Due:{" "}
              {enrollmentEnd
                ? new Date(enrollmentEnd).toLocaleDateString()
                : "TBA"}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {[1, 2, 3].map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                    activeStep >= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {activeStep > step ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                <span className="text-xs mt-2 text-gray-600 font-medium">
                  {step === 1 ? "Type" : step === 2 ? "Profile" : "Documents"}
                </span>
              </div>
              {index < 2 && (
                <div
                  className={`flex-1 h-1 mx-4 rounded ${
                    activeStep > step ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {submitError && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-red-800">Submission Failed</h4>
            <p className="text-sm text-red-700 mt-1">{submitError}</p>
          </div>
          <button
            onClick={() => setSubmitError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Form Content */}
      <div className="p-6">
        {/* Step 1: Student Type */}
        {activeStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select Student Type
              </h3>
              <p className="text-gray-600 mb-6">
                Choose the option that best describes your current status
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: "old",
                    label: "Old Student",
                    description: "Continuing/returning student",
                    icon: "📚",
                    color: "blue",
                  },
                  {
                    id: "new",
                    label: "New Student",
                    description: "First-time enrollment",
                    icon: "🎓",
                    color: "green",
                  },
                  {
                    id: "transferee",
                    label: "Transferee",
                    description: "Transfer from other school",
                    icon: "🔄",
                    color: "purple",
                  },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setStudentType(type.id)}
                    className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                      studentType === type.id
                        ? `border-${type.color}-500 bg-${type.color}-50 ring-2 ring-${type.color}-200`
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="text-4xl mb-3">{type.icon}</div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {type.label}
                    </h4>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </button>
                ))}
              </div>

              {errors.studentType && (
                <p className="mt-4 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.studentType}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Profile Information */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Student Information
              </h3>
              <p className="text-gray-600 mb-6">
                Review your details and complete the required fields
              </p>

              {/* Read-only Info Card */}
              <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-1">Full Name</span>
                    <span className="font-semibold text-gray-900">
                      {user?.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Email</span>
                    <span className="font-semibold text-gray-900">
                      {user?.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Student ID</span>
                    <span className="font-semibold text-gray-900">
                      {user?.id || "To be assigned"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">
                      Birth Date / Gender
                    </span>
                    <span className="font-semibold text-gray-900">
                      {user?.birthdate
                        ? new Date(user.birthdate).toLocaleDateString()
                        : "N/A"}{" "}
                      • {user?.gender || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      placeholder="09123456789"
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.contactNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.contactNumber && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.contactNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Year Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="yearLevel"
                    value={formData.yearLevel}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.yearLevel ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Year Level</option>
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Third Year">Third Year</option>
                    <option value="Fourth Year">Fourth Year</option>
                    <option value="Fifth Year">Fifth Year</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.yearLevel && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.yearLevel}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Course to Enroll <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.course ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Course</option>
                      {initialCourses.map((course) => (
                        <option key={course.id} value={course.code}>
                          {course.name} ({course.code}) - {course.type}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.course && (
                    <p className="mt-1 text-sm text-red-600">{errors.course}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Complete Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="House number, street, barangay, city, province"
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={academicYear || ""}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Semester
                  </label>
                  <input
                    type="text"
                    value={semester || ""}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Document Upload */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Required Documents
              </h3>
              <p className="text-gray-600 mb-6">
                Upload the necessary documents for{" "}
                {studentType === "new" ? "new students" : "transferees"}
              </p>

              {studentType === "old" ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-start">
                  <Info className="w-6 h-6 text-blue-600 mr-4 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">
                      No Documents Required
                    </h4>
                    <p className="text-blue-700 text-sm">
                      As an old student, you don't need to upload any documents.
                      Just review your information and submit.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(documents)
                    .filter(([_, doc]) => doc.required)
                    .map(([docType, doc]) => (
                      <div
                        key={docType}
                        className={`p-5 border-2 rounded-xl transition-colors ${
                          doc.file
                            ? "border-green-300 bg-green-50"
                            : errors[docType]
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <FileText
                                className={`w-6 h-6 mr-3 ${
                                  doc.file ? "text-green-600" : "text-gray-400"
                                }`}
                              />
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {doc.label}
                                  <span className="text-red-500 ml-1">*</span>
                                </h4>
                                <p className="text-xs text-gray-500">
                                  PDF, JPG, or PNG (Max 5MB)
                                </p>
                              </div>
                            </div>

                            {doc.file ? (
                              <div className="mt-3 bg-white rounded-lg p-3 border border-green-200 flex items-center justify-between">
                                <div className="flex items-center">
                                  <FileCheck className="w-5 h-5 text-green-600 mr-2" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {doc.file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {(doc.file.size / 1024 / 1024).toFixed(2)}{" "}
                                      MB
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Preview"
                                  >
                                    <Eye className="w-4 h-4 text-gray-600" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleFileRemove(docType)}
                                    className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                    title="Remove"
                                  >
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-3">
                                <input
                                  type="file"
                                  id={`doc-${docType}`}
                                  className="hidden"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) =>
                                    handleFileSelect(docType, e.target.files[0])
                                  }
                                />
                                <label
                                  htmlFor={`doc-${docType}`}
                                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  Choose File
                                </label>
                              </div>
                            )}

                            {errors[docType] && !doc.file && (
                              <p className="mt-2 text-sm text-red-600 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors[docType]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="px-6 py-5 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <button
          type="button"
          onClick={activeStep === 1 ? onCancel : handleBack}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          {activeStep === 1 ? "Cancel" : "Back"}
        </button>

        <div className="flex items-center gap-3">
          {activeStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              Next Step
              <Save className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Enrollment
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentProfiling;
