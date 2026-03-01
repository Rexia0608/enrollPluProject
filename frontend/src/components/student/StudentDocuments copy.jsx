// components/student/EnrollmentProfiling.jsx
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  School,
  AlertCircle,
  CheckCircle,
  Upload,
  FileText,
  XCircle,
  Lock,
  Unlock,
  ChevronRight,
  Save,
  Eye,
  Download,
  Info,
  Clock,
  FileCheck,
  RefreshCw,
} from "lucide-react";

import { useStudent } from "../../context/StudentContext";

// =============================================
// PLACEHOLDER API CONFIGURATION
// =============================================
// Change these values to test different scenarios:

// 1. ENROLLMENT STATUS - Change this to test open/closed

const ENROLLMENT_OPEN = true; // Set to false to test closed enrollment
const ENROLLMENT_MESSAGE = "Enrollment is currently open";
const ENROLLMENT_START_DATE = "2024-06-01";
const ENROLLMENT_END_DATE = "2024-07-31";
const ENROLLMENT_SEMESTER = "1st Semester";
const ENROLLMENT_ACADEMIC_YEAR = "2024-2025";

// 2. STUDENT ENROLLMENT STATUS - Change this to test different states
// Possible values:
// - null (no enrollment yet)
// - "pending" (under review)
// - "approved" (approved but not yet enrolled)
// - "enrolled" (fully enrolled)
// - "rejected" (needs to reapply)
const STUDENT_ENROLLMENT_STATUS = null; // Change this to test different states

// 3. Mock student data
const mockStudentData = {
  id: "STU-2024-12345",
  firstName: "Juan",
  middleName: "Dela",
  lastName: "Cruz",
  email: "juan.delacruz@example.com",
  studentId: "2024-12345",
  // Mock student already has these in their profile
  birthDate: "2000-01-15",
  gender: "male",
};

// =============================================
// PLACEHOLDER API SERVICE
// =============================================

const enrollmentAPI = {
  // Check if enrollment period is open
  checkEnrollmentStatus: async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Return based on placeholder configuration
    return {
      isOpen: ENROLLMENT_OPEN,
      message: ENROLLMENT_MESSAGE,
      startDate: ENROLLMENT_START_DATE,
      endDate: ENROLLMENT_END_DATE,
      semester: ENROLLMENT_SEMESTER,
      academicYear: ENROLLMENT_ACADEMIC_YEAR,
    };
  },

  // Check if student already has an enrollment
  checkStudentEnrollment: async (studentId) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Return based on placeholder configuration
    if (STUDENT_ENROLLMENT_STATUS === null) {
      return { hasEnrollment: false };
    }

    // Return different states based on configuration
    const enrollmentData = {
      id: "ENR-2024-001",
      studentType: "new",
      submittedAt: "2024-06-15T10:30:00Z",
      status: STUDENT_ENROLLMENT_STATUS,
      documents: {
        form138: "uploaded",
        birthCertificate: "uploaded",
      },
    };

    const messages = {
      pending: "You have a pending enrollment application",
      approved: "Your enrollment has been approved",
      enrolled: "You are currently enrolled",
      rejected: "Your application was rejected. Please reapply.",
    };

    return {
      hasEnrollment: true,
      status: STUDENT_ENROLLMENT_STATUS,
      enrollmentData,
      message:
        messages[STUDENT_ENROLLMENT_STATUS] ||
        "You have an existing enrollment",
    };
  },

  submitProfile: async (data) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      success: true,
      message: "Profile saved successfully",
      enrollmentId: "ENR-2024-001",
    };
  },

  uploadDocuments: async (formData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { success: true, message: "Documents uploaded successfully" };
  },
};

// Document Upload Component
const DocumentUpload = ({ documents, onDocumentChange, errors }) => {
  const [uploading, setUploading] = useState(null);

  const handleFileSelect = (docType, file) => {
    onDocumentChange(docType, file);
  };

  const getDocumentLabel = (docType) => {
    const labels = {
      transcript: "Transcript of Records",
      honorableDismissal: "Honorable Dismissal",
      form138: "Form 138 / Report Card",
      birthCertificate: "Birth Certificate",
      optional: "Optional Supporting Document",
    };
    return labels[docType] || docType;
  };

  const getDocumentHelper = (docType) => {
    const helpers = {
      transcript: "PDF, JPG, or PNG (Max 5MB)",
      honorableDismissal: "PDF, JPG, or PNG (Max 5MB)",
      form138: "PDF, JPG, or PNG (Max 5MB)",
      birthCertificate: "PSA Birth Certificate preferred (Max 5MB)",
    };
    return helpers[docType] || "PDF, JPG, or PNG (Max 5MB)";
  };

  return (
    <div className="space-y-4">
      {Object.entries(documents).map(([docType, doc]) => (
        <div
          key={docType}
          className={`p-4 border rounded-lg ${
            doc.required && !doc.file && errors[docType]
              ? "border-red-300 bg-red-50"
              : doc.file
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center">
                <FileText
                  className={`w-5 h-5 mr-2 ${
                    doc.file ? "text-green-600" : "text-gray-400"
                  }`}
                />
                <h4 className="font-medium text-gray-900">
                  {getDocumentLabel(docType)}
                  {doc.required && <span className="text-red-500 ml-1">*</span>}
                </h4>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                {getDocumentHelper(docType)}
              </p>

              {doc.file && (
                <div className="mt-2 p-2 bg-white rounded border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm text-gray-700">
                        {doc.file.name}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        ({(doc.file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        className="p-1 hover:bg-green-100 rounded"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4 text-green-600" />
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:bg-red-100 rounded"
                        onClick={() => onDocumentChange(docType, null)}
                        title="Remove"
                      >
                        <XCircle className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!doc.file && (
              <div className="ml-4">
                <input
                  type="file"
                  id={`file-${docType}`}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleFileSelect(docType, file);
                  }}
                />
                <label
                  htmlFor={`file-${docType}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer inline-flex items-center text-sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </label>
              </div>
            )}
          </div>

          {doc.required && !doc.file && errors[docType] && (
            <p className="mt-2 text-xs text-red-600 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors[docType]}
            </p>
          )}
        </div>
      ))}

      {/* Optional Documents Section for Transferee */}
      {documents.optional && (
        <div className="p-4 border border-dashed border-gray-300 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-700">
                Additional Documents
              </h4>
              <p className="text-xs text-gray-500">
                Upload any supporting documents (optional)
              </p>
            </div>
            <input
              type="file"
              id="file-optional"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleFileSelect("optional", file);
              }}
            />
            <label
              htmlFor="file-optional"
              className="px-3 py-1 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 cursor-pointer inline-flex items-center text-sm"
            >
              <Upload className="w-3 h-3 mr-1" />
              Add Document
            </label>
          </div>
          {documents.optional?.file && (
            <div className="mt-3 p-2 bg-gray-50 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-sm">
                    {documents.optional.file.name}
                  </span>
                </div>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onDocumentChange("optional", null)}
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Student Type Selection Component
const StudentTypeSelector = ({ selectedType, onChange, disabled }) => {
  const types = [
    {
      id: "old",
      label: "Old Student",
      icon: "📚",
      description: "Returning/continuing student",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      selectedColor: "bg-blue-100 border-blue-500",
    },
    {
      id: "new",
      label: "New Student",
      icon: "🎓",
      description: "First-time enrollment",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      selectedColor: "bg-green-100 border-green-500",
    },
    {
      id: "transferee",
      label: "Transferee",
      icon: "🔄",
      description: "Transfer from other school",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      selectedColor: "bg-purple-100 border-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {types.map((type) => (
        <button
          key={type.id}
          type="button"
          onClick={() => onChange(type.id)}
          disabled={disabled}
          className={`p-4 border-2 rounded-lg text-left transition-all ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } ${
            selectedType === type.id
              ? type.selectedColor
              : `border-gray-200 ${type.bgColor} hover:border-gray-300`
          }`}
        >
          <div className="text-3xl mb-2">{type.icon}</div>
          <h3 className="font-semibold text-gray-900">{type.label}</h3>
          <p className="text-xs text-gray-600 mt-1">{type.description}</p>
        </button>
      ))}
    </div>
  );
};

// Enrollment Status Banner Component
const EnrollmentStatusBanner = ({ status, enrollmentData, onRefresh }) => {
  if (!status) return null;

  const getStatusConfig = () => {
    switch (status) {
      case "enrolled":
        return {
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: CheckCircle,
          iconColor: "text-green-600",
          title: "You are currently enrolled",
          message: "You have successfully enrolled for the current semester.",
        };
      case "approved":
        return {
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          icon: CheckCircle,
          iconColor: "text-green-600",
          title: "Enrollment Approved",
          message:
            "Your enrollment has been approved. You may now proceed with class registration.",
        };
      case "pending":
        return {
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          icon: Clock,
          iconColor: "text-yellow-600",
          title: "Enrollment Under Review",
          message:
            "Your enrollment application is being processed. You'll be notified once approved.",
        };
      case "rejected":
        return {
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          icon: AlertCircle,
          iconColor: "text-red-600",
          title: "Enrollment Requires Action",
          message:
            "Your enrollment application needs attention. Please check the remarks below.",
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div
      className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 mb-6`}
    >
      <div className="flex items-start">
        <div className={`${config.iconColor} mr-3`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className={`font-medium ${config.iconColor}`}>{config.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{config.message}</p>

          {enrollmentData && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Enrollment ID:</span>
                <span className="ml-2 font-medium">{enrollmentData.id}</span>
              </div>
              <div>
                <span className="text-gray-500">Submitted:</span>
                <span className="ml-2 font-medium">
                  {new Date(enrollmentData.submittedAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Student Type:</span>
                <span className="ml-2 font-medium capitalize">
                  {enrollmentData.studentType}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Documents:</span>
                <span className="ml-2 font-medium">
                  {Object.keys(enrollmentData.documents || {}).length} uploaded
                </span>
              </div>
            </div>
          )}

          <button
            onClick={onRefresh}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Check Status Again
          </button>
        </div>
      </div>
    </div>
  );
};

// Main EnrollmentProfiling Component
function EnrollmentProfiling({ onSubmit, studentData = mockStudentData }) {
  const { initialCourses, enrollmentStatus } = useStudent();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [enrollmentStatus2, setEnrollmentStatus2] = useState(null);
  const [studentEnrollment, setStudentEnrollment] = useState(null);
  const [enrollmentPeriod, setEnrollmentPeriod] = useState(null);
  console.log(initialCourses, enrollmentStatus);
  // Form state - birthDate and gender removed (they come from student profile)
  const [studentType, setStudentType] = useState("");
  const [formData, setFormData] = useState({
    contactNumber: "",
    address: "",
    yearLevel: "",
    course: "",
    academicYear: "",
    semester: "",
  });

  // Document state based on student type
  const [documents, setDocuments] = useState({
    form138: { file: null, required: false },
    birthCertificate: { file: null, required: false },
    transcript: { file: null, required: false },
    honorableDismissal: { file: null, required: false },
    optional: { file: null, required: false },
  });

  // Validation errors
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Check enrollment status and student enrollment on mount
  useEffect(() => {
    checkEnrollmentStatus();
  }, []);

  const checkEnrollmentStatus = async () => {
    try {
      setLoading(true);

      // Check if enrollment period is open
      const periodStatus = await enrollmentAPI.checkEnrollmentStatus();
      setEnrollmentPeriod(periodStatus);

      // Check if student already has an enrollment
      const enrollment = await enrollmentAPI.checkStudentEnrollment(
        studentData.id,
      );
      setStudentEnrollment(enrollment);

      // Pre-fill academic year and semester from enrollment period
      if (periodStatus) {
        setFormData((prev) => ({
          ...prev,
          academicYear: periodStatus.academicYear || "",
          semester: periodStatus.semester || "",
        }));
      }
    } catch (error) {
      console.error("Failed to check enrollment status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update document requirements based on student type
  useEffect(() => {
    if (studentType) {
      setDocuments({
        form138: { file: null, required: studentType === "new" },
        birthCertificate: { file: null, required: studentType === "new" },
        transcript: { file: null, required: studentType === "transferee" },
        honorableDismissal: {
          file: null,
          required: studentType === "transferee",
        },
        optional: { file: null, required: false },
      });

      // Clear errors when changing type
      setErrors({});
    }
  }, [studentType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleDocumentChange = (docType, file) => {
    setDocuments((prev) => ({
      ...prev,
      [docType]: { ...prev[docType], file },
    }));

    if (errors[docType]) {
      setErrors((prev) => ({ ...prev, [docType]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Skip validation if already enrolled
    if (
      studentEnrollment?.hasEnrollment &&
      studentEnrollment.status !== "rejected"
    ) {
      return true;
    }

    // Validate required fields - birthDate and gender removed
    const requiredFields = [
      "contactNumber",
      "address",
      "yearLevel",
      "course",
      "academicYear",
      "semester",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] =
          `${field.replace(/([A-Z])/g, " $1").toLowerCase()} is required`;
      }
    });

    // Validate phone number
    if (
      formData.contactNumber &&
      !/^[0-9]{11}$/.test(formData.contactNumber.replace(/\D/g, ""))
    ) {
      newErrors.contactNumber = "Contact number must be 11 digits";
    }

    // Validate documents based on student type
    if (studentType === "new") {
      if (!documents.form138.file) newErrors.form138 = "Form 138 is required";
      if (!documents.birthCertificate.file)
        newErrors.birthCertificate = "Birth Certificate is required";
    }

    if (studentType === "transferee") {
      if (!documents.transcript.file)
        newErrors.transcript = "Transcript of Records is required";
      if (!documents.honorableDismissal.file)
        newErrors.honorableDismissal = "Honorable Dismissal is required";
    }

    // Validate student type selected
    if (!studentType) {
      newErrors.studentType = "Please select your student type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If already enrolled with approved/enrolled status, don't allow submission
    if (
      studentEnrollment?.hasEnrollment &&
      (studentEnrollment.status === "enrolled" ||
        studentEnrollment.status === "approved")
    ) {
      return;
    }

    // If enrollment is closed, don't allow submission
    if (!enrollmentPeriod?.isOpen) {
      return;
    }

    if (!validateForm()) {
      const allFields = [
        "contactNumber",
        "address",
        "yearLevel",
        "course",
        "academicYear",
        "semester",
      ];
      setTouched(
        allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}),
      );
      return;
    }

    setSubmitting(true);

    try {
      // Prepare profile data - include birthDate and gender from studentData
      const profileData = {
        studentId: studentData.studentId,
        studentType,
        ...formData,
        birthDate: studentData.birthDate, // From student profile
        gender: studentData.gender, // From student profile
        fullName: `${studentData.firstName} ${studentData.middleName} ${studentData.lastName}`,
        email: studentData.email,
        submittedAt: new Date().toISOString(),
      };

      // Submit profile
      const profileResult = await enrollmentAPI.submitProfile(profileData);

      // Upload documents if any
      if (studentType === "new" || studentType === "transferee") {
        const documentFormData = new FormData();

        Object.entries(documents).forEach(([docType, doc]) => {
          if (doc.file) {
            documentFormData.append(docType, doc.file);
          }
        });

        documentFormData.append("studentId", studentData.studentId);
        documentFormData.append("studentType", studentType);
        documentFormData.append("enrollmentId", profileResult.enrollmentId);

        await enrollmentAPI.uploadDocuments(documentFormData);
      }

      // Show success message
      alert("Enrollment profiling completed successfully!");

      // Refresh enrollment status
      await checkEnrollmentStatus();

      // Call onSubmit callback
      if (onSubmit) {
        onSubmit(profileData);
      }

      // Reset form
      setStudentType("");
      setFormData({
        contactNumber: "",
        address: "",
        yearLevel: "",
        course: "",
        academicYear: enrollmentPeriod?.academicYear || "",
        semester: enrollmentPeriod?.semester || "",
      });
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit enrollment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Checking enrollment status...</p>
        </div>
      </div>
    );
  }

  // Case 1: Enrollment is closed
  if (!enrollmentPeriod?.isOpen) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-linear-to-r from-red-600 to-red-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">
            Enrollment Status
          </h2>
        </div>
        <div className="p-8 text-center">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Enrollment is Currently Closed
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {enrollmentPeriod?.message ||
              "The enrollment period is not open at this time."}
          </p>

          {enrollmentPeriod?.startDate && enrollmentPeriod?.endDate && (
            <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-4">
                <div className="text-left">
                  <p className="text-xs text-gray-500">Starts</p>
                  <p className="font-medium text-gray-900">
                    {new Date(enrollmentPeriod.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Ends</p>
                  <p className="font-medium text-gray-900">
                    {new Date(enrollmentPeriod.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={checkEnrollmentStatus}
            className="mt-6 text-blue-600 hover:text-blue-800 flex items-center justify-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Check Status Again
          </button>
        </div>
      </div>
    );
  }

  // Case 2: Student already has an enrollment (not rejected)
  if (
    studentEnrollment?.hasEnrollment &&
    studentEnrollment.status !== "rejected"
  ) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div
          className={`bg-linear-to-r ${
            studentEnrollment.status === "enrolled"
              ? "from-green-600 to-green-700"
              : studentEnrollment.status === "approved"
                ? "from-blue-600 to-blue-700"
                : "from-yellow-600 to-yellow-700"
          } px-6 py-4`}
        >
          <h2 className="text-xl font-semibold text-white">
            Enrollment Status
          </h2>
        </div>

        <div className="p-6">
          <EnrollmentStatusBanner
            status={studentEnrollment.status}
            enrollmentData={studentEnrollment.enrollmentData}
            onRefresh={checkEnrollmentStatus}
          />

          {studentEnrollment.status === "rejected" && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Remarks:</h4>
              <p className="text-sm text-red-700">
                Your enrollment application was rejected due to incomplete or
                invalid documents. Please review and resubmit your application.
              </p>
              <button
                onClick={() => setStudentEnrollment(null)}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Start New Application
              </button>
            </div>
          )}

          {studentEnrollment.status === "enrolled" && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">What's Next?</h4>
              <ul className="text-sm text-green-700 space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                  <span>You can now proceed to class registration</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                  <span>
                    Check your email for important enrollment information
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                  <span>View your class schedule and assigned subjects</span>
                </li>
              </ul>
            </div>
          )}

          {studentEnrollment.status === "approved" && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Next Steps:</h4>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start">
                  <Clock className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                  <span>Wait for the official enrollment confirmation</span>
                </li>
                <li className="flex items-start">
                  <Clock className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                  <span>You'll receive an email within 24-48 hours</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Case 3: Enrollment is open and student can apply
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Student Enrollment Profiling
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Complete your profile to continue with enrollment
              </p>
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-1">
              <span className="text-sm text-white font-medium">
                {enrollmentPeriod?.semester} {enrollmentPeriod?.academicYear}
              </span>
            </div>
          </div>
        </div>

        {/* Enrollment Open Banner */}
        <div className="px-6 py-3 bg-green-50 border-b border-green-100 flex items-center">
          <Unlock className="w-4 h-4 text-green-600 mr-2" />
          <span className="text-sm text-green-700">
            Enrollment is open until{" "}
            {new Date(enrollmentPeriod?.endDate).toLocaleDateString()}
          </span>
        </div>

        {/* Student Information - Shows birthDate and gender from profile */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Student Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-500">Full Name</label>
              <p className="font-medium text-gray-900">
                {studentData.firstName} {studentData.middleName}{" "}
                {studentData.lastName}
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-500">
                Email Address
              </label>
              <p className="font-medium text-gray-900">{studentData.email}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500">Student ID</label>
              <p className="font-medium text-gray-900">
                {studentData.studentId || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-xs text-gray-500">
                Birth Date / Gender
              </label>
              <p className="font-medium text-gray-900">
                {new Date(studentData.birthDate).toLocaleDateString()} •{" "}
                {studentData.gender}
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Student Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Student Type <span className="text-red-500">*</span>
            </label>
            <StudentTypeSelector
              selectedType={studentType}
              onChange={setStudentType}
              disabled={
                studentEnrollment?.hasEnrollment &&
                studentEnrollment.status === "rejected"
              }
            />
            {touched.studentType && errors.studentType && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.studentType}
              </p>
            )}
          </div>

          {/* Profiling Information - birthDate and gender fields removed */}
          {studentType && (
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900 border-b pb-2">
                Profiling Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      placeholder="09123456789"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        touched.contactNumber && errors.contactNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {touched.contactNumber && errors.contactNumber && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.contactNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upcoming Year Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="yearLevel"
                    value={formData.yearLevel}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      touched.yearLevel && errors.yearLevel
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Level</option>
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Third Year">Third Year</option>
                    <option value="Fourth Year">Fourth Year</option>
                    <option value="Fifth Year">Fifth Year</option>
                  </select>
                  {touched.yearLevel && errors.yearLevel && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.yearLevel}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course to Enroll <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        touched.course && errors.course
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Course</option>
                      <option value="BS Computer Science">
                        BS Computer Science
                      </option>
                      <option value="BS Information Technology">
                        BS Information Technology
                      </option>
                      <option value="BS Business Administration">
                        BS Business Administration
                      </option>
                      <option value="BS Accountancy">BS Accountancy</option>
                      <option value="BS Engineering">BS Engineering</option>
                      <option value="BS Nursing">BS Nursing</option>
                      <option value="BS Education">BS Education</option>
                    </select>
                  </div>
                  {touched.course && errors.course && (
                    <p className="mt-1 text-xs text-red-600">{errors.course}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      touched.academicYear && errors.academicYear
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Academic Year</option>
                    <option value="2024-2025">2024-2025</option>
                    <option value="2025-2026">2025-2026</option>
                  </select>
                  {touched.academicYear && errors.academicYear && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.academicYear}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      touched.semester && errors.semester
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Semester</option>
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="Summer">Summer</option>
                  </select>
                  {touched.semester && errors.semester && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.semester}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="2"
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        touched.address && errors.address
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Complete address"
                    />
                  </div>
                  {touched.address && errors.address && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Conditional Document Upload */}
          {studentType &&
            (studentType === "new" || studentType === "transferee") && (
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 border-b pb-2">
                  Required Documents
                  {studentType === "new" && " (New Student)"}
                  {studentType === "transferee" && " (Transferee)"}
                </h3>

                {studentType === "new" && (
                  <DocumentUpload
                    documents={{
                      form138: documents.form138,
                      birthCertificate: documents.birthCertificate,
                    }}
                    onDocumentChange={handleDocumentChange}
                    errors={errors}
                  />
                )}

                {studentType === "transferee" && (
                  <DocumentUpload
                    documents={{
                      transcript: documents.transcript,
                      honorableDismissal: documents.honorableDismissal,
                      optional: documents.optional,
                    }}
                    onDocumentChange={handleDocumentChange}
                    errors={errors}
                  />
                )}
              </div>
            )}

          {/* Old Student Note */}
          {studentType === "old" && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex">
                <Info className="w-5 h-5 text-blue-600 mr-2 shrink-0" />
                <div>
                  <p className="text-sm text-blue-700">
                    As an Old Student, you only need to complete the profiling
                    information above. No document upload is required at this
                    time.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            type="submit"
            disabled={!studentType || submitting || !enrollmentPeriod?.isOpen}
            className={`w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
              submitting ? "opacity-75 cursor-wait" : ""
            }`}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Submit Enrollment Profile
              </>
            )}
          </button>

          {!enrollmentPeriod?.isOpen && (
            <p className="mt-2 text-sm text-red-600">
              Enrollment is closed. You cannot submit at this time.
            </p>
          )}
        </div>
      </div>
    </form>
  );
}

export default EnrollmentProfiling;
