// components/student/EnrollmentProfiling.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../pages/LoadingPage";
import FailedLoadData from "../../pages/FailedLoadData";
import { useAuth } from "../../context/AuthContext";
import { useStudent } from "../../context/StudentContext";
import {
  Phone,
  MapPin,
  BookOpen,
  CheckCircle,
  Upload,
  FileText,
  XCircle,
  Lock,
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
  AlertCircle,
} from "lucide-react";
import { useEnrollmentValidation } from "../../utils/useEnrollmentValidation";
import { getRequiredDocuments } from "../../utils/documentValidation";
import axios from "axios";

const EnrollmentProfiling = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { getAuthHeaders } = useStudent();

  const {
    errors,
    setTouched,
    validateStep,
    handleBlur,
    getError,
    clearErrors,
  } = useEnrollmentValidation();

  // State for fetched data
  const [initialCourses, setInitialCourses] = useState([]);
  const [academicYearInfo, setAcademicYearInfo] = useState({
    id: "",
    year_series: "",
    semester: "",
    start_date: "",
    end_date: "",
    enrollment_open: false,
  });
  const [myEnrollment, setMyEnrollment] = useState(null);
  const [enrollmentDateRange, setEnrollmentDateRange] = useState({
    start_date: "",
    end_date: "",
  });

  // UI states
  const [activeStep, setActiveStep] = useState(1);
  const [studentType, setStudentType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    contactNumber: "",
    address: "",
    yearLevel: "",
    course: "",
    academicYearId: "",
  });

  // Documents
  const [documents, setDocuments] = useState(getRequiredDocuments(""));
  const timeoutRef = useRef(null);

  // Update documents when student type changes
  useEffect(() => {
    setDocuments(getRequiredDocuments(studentType));
    clearErrors(["studentType"]);
  }, [studentType, clearErrors]);

  // Fetch all necessary data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = getAuthHeaders();

        // Fetch all three endpoints in parallel
        const [enrollmentStatusRes, enrollmentCheckRes, coursesRes] =
          await Promise.all([
            axios.get(
              "http://localhost:3000/student/enrollment-open-status",
              headers,
            ),
            axios.get(
              `http://localhost:3000/student/validate-enrolled-student/${user.id}`,
              headers,
            ),
            axios.get("http://localhost:3000/student/course-list", headers),
          ]);

        // Process enrollment open status
        const statusData = enrollmentStatusRes.data;
        if (statusData.success && statusData.data) {
          const {
            id,
            year_series,
            semester,
            start_date,
            end_date,
            enrollment_open,
          } = statusData.data;
          setAcademicYearInfo({
            id,
            year_series,
            semester,
            start_date,
            end_date,
            enrollment_open,
          });
          setEnrollmentDateRange({ start_date, end_date });
          setFormData((prev) => ({ ...prev, academicYearId: id }));
        } else {
          // No active academic year (enrollment closed)
          setAcademicYearInfo((prev) => ({ ...prev, enrollment_open: false }));
        }

        // Process enrollment check
        const checkData = enrollmentCheckRes.data;
        if (checkData.success && checkData.data) {
          setMyEnrollment(checkData.data); // contains enrollment object
        } else {
          setMyEnrollment(null); // not enrolled
        }

        // Process courses list – the response is an array directly
        const coursesArray = coursesRes.data || [];
        setInitialCourses(coursesArray);
      } catch (err) {
        console.error("Failed to fetch enrollment data:", err);
        setError(
          err.response?.data?.message || "Failed to load enrollment data.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [user, getAuthHeaders]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (errors[name]) clearErrors([name]);
  };

  const handleFileSelect = (docType, file) => {
    setDocuments((prev) => ({
      ...prev,
      [docType]: { ...prev[docType], file },
    }));
    setTouched((prev) => ({ ...prev, [docType]: true }));
    if (errors[docType]) clearErrors([docType]);
  };

  const handleFileRemove = (docType) => {
    setDocuments((prev) => ({
      ...prev,
      [docType]: { ...prev[docType], file: null },
    }));
  };

  const handleNext = () => {
    const isValid = validateStep(activeStep, {
      studentType,
      formData,
      documents,
    });
    if (isValid) setActiveStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    const isValid = validateStep(3, { studentType, formData, documents });
    if (!isValid) return;

    // Check for existing non-rejected enrollment
    if (myEnrollment && myEnrollment.status !== "rejected") {
      setSubmitError(`You already have an ${myEnrollment.status} enrollment.`);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const submitFormData = new FormData();
      submitFormData.append("studentId", user.id);
      submitFormData.append("studentType", studentType);
      submitFormData.append("contactNumber", formData.contactNumber);
      submitFormData.append("address", formData.address);
      submitFormData.append("yearLevel", formData.yearLevel);
      submitFormData.append("course", formData.course);
      submitFormData.append("academicYearId", formData.academicYearId);

      if (studentType !== "old") {
        Object.entries(documents).forEach(([docType, doc]) => {
          if (doc.required && doc.file) {
            submitFormData.append(docType, doc.file);
          }
        });
      }

      const headers = getAuthHeaders();
      headers.headers["Content-Type"] = "multipart/form-data";

      const [enrollmentResultRes, enrollmentCheckResult] = await Promise.all([
        axios.post(
          "http://localhost:3000/student/enrollment-upload-documents-process",
          submitFormData,
          headers,
        ),
        axios.get(
          `http://localhost:3000/student/validate-enrolled-student/${user.id}`,
          headers,
        ),
      ]);

      if (enrollmentResultRes.data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setMyEnrollment(enrollmentCheckResult.data.data);
        }, 1800);
        onSuccess?.();
      } else {
        setSubmitError(response.data.message || "Submission failed.");
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatCourseDisplay = (course) => {
    const courseCode = course.course_code || course.code || "";
    const courseName = course.course_name || course.name || "";
    const courseType = course.duration_type || "Course";
    return {
      id: course.id || courseCode,
      code: courseCode,
      name: courseName,
      display: `${courseName} (${courseCode}) - ${courseType}`,
    };
  };

  // Loading / error states
  if (loading) return <LoadingPage />;
  if (error) return <FailedLoadData message={error} />;

  // Enrollment closed view
  if (!academicYearInfo.enrollment_open) {
    const startDate = enrollmentDateRange?.start_date;
    const endDate = enrollmentDateRange?.end_date;
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
          {startDate && endDate && (
            <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto border border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <div className="text-left">
                  <p className="text-gray-500 mb-1">Enrollment Opens</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(startDate).toLocaleDateString("en-US", {
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
                    {new Date(endDate).toLocaleDateString("en-US", {
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
            onClick={() => window.location.reload()}
            className="mt-8 text-blue-600 hover:text-blue-800 flex items-center justify-center mx-auto font-medium"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Check Again
          </button>
        </div>
      </div>
    );
  }

  // Existing enrollment (non-rejected) view
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
                    <span className="text-gray-500 block">
                      Enrollment Reference
                    </span>
                    <span className="font-semibold text-gray-900">
                      {myEnrollment?.enrollment_id || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Submitted</span>
                    <span className="font-semibold text-gray-900">
                      {myEnrollment?.updated_at
                        ? new Date(myEnrollment.updated_at).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Student Type</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {myEnrollment?.student_type?.replace("_", " ") || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Semester</span>
                    <span className="font-semibold text-gray-900">
                      {myEnrollment?.semester || "TBA"}
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
            onClick={() => window.location.reload()}
            className="mt-6 text-blue-600 hover:text-blue-800 flex items-center font-medium"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Status
          </button>
        </div>
      </div>
    );
  }

  // Success view after submission
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
            // Keep myEnrollment as pending
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
      <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center">
              <GraduationCap className="w-6 h-6 mr-2" />
              Student Enrollment
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Complete your profiling to enroll for {academicYearInfo.semester}
            </p>
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
            <span className="text-white font-medium text-sm">
              Due:{" "}
              {enrollmentDateRange?.end_date
                ? new Date(enrollmentDateRange.end_date).toLocaleDateString()
                : "TBA"}
            </span>
          </div>
        </div>
      </div>

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

      <div className="p-6">
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

              {getError("studentType") && (
                <p className="mt-4 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {getError("studentType")}
                </p>
              )}
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Student Information
              </h3>
              <p className="text-gray-600 mb-6">
                Review your details and complete the required fields
              </p>

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
                      Mobile Number
                    </span>
                    <span className="font-semibold text-gray-900">
                      {user?.mobile || "To be assigned"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Birth Date</span>
                    <span className="font-semibold text-gray-900">
                      {user?.birthdate
                        ? new Date(user.birthdate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Gender</span>
                    <span className="font-semibold text-gray-900">
                      {user?.gender || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

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
                      onBlur={() => handleBlur("contactNumber")}
                      placeholder={user?.mobile || "09123456789"}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        getError("contactNumber")
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {getError("contactNumber") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getError("contactNumber")}
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
                    onBlur={() => handleBlur("yearLevel")}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      getError("yearLevel")
                        ? "border-red-500"
                        : "border-gray-300"
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
                  {getError("yearLevel") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getError("yearLevel")}
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
                      onBlur={() => handleBlur("course")}
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        getError("course")
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Course</option>
                      {initialCourses && initialCourses.length > 0 ? (
                        initialCourses.map((course) => {
                          const formatted = formatCourseDisplay(course);
                          return (
                            <option key={formatted.id} value={formatted.id}>
                              {formatted.display}
                            </option>
                          );
                        })
                      ) : (
                        <option value="" disabled>
                          No courses available
                        </option>
                      )}
                    </select>
                  </div>
                  {getError("course") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getError("course")}
                    </p>
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
                      onBlur={() => handleBlur("address")}
                      rows={3}
                      placeholder="House number, street, barangay, city, province"
                      className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                        getError("address")
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {getError("address") && (
                    <p className="mt-1 text-sm text-red-600">
                      {getError("address")}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={academicYearInfo.year_series || ""}
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
                    value={academicYearInfo.semester || ""}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

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
                            : getError(docType)
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
                                    onClick={() => alert("Preview coming soon")}
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

                            {getError(docType) && !doc.file && (
                              <p className="mt-2 text-sm text-red-600 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {getError(docType)}
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
