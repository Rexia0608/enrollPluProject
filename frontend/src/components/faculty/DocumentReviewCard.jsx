import React, { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Download,
  CheckCircle,
  XCircle,
  MessageSquare,
  Eye,
  User,
  Calendar,
  Book,
  AlertCircle,
  Paperclip,
  ExternalLink,
  Mail,
  ImageIcon,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import StatusBadge from "../ui/StatusBadge";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

function DocumentReviewCard({ student, backpage, onReviewComplete }) {
  const [documents, setDocuments] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Store blob URLs for each document
  const [imageBlobUrls, setImageBlobUrls] = useState({});

  const getRequiredDocuments = (studentType) => {
    const commonDocs = [
      {
        id: "birthCertificate",
        name: "Birth Certificate",
        category: "Identity",
        fileKey: "birthCertificate",
      },
      {
        id: "photoId",
        name: "1x1 Photo ID (White Background)",
        category: "Identification",
        fileKey: "PhotoId",
      },
    ];

    if (studentType === "transferee") {
      return [
        ...commonDocs,
        {
          id: "transcript",
          name: "Transcript of Records",
          category: "Academic",
          fileKey: null,
        },
        {
          id: "honorableDismissal",
          name: "Honorable Dismissal",
          category: "Academic",
          fileKey: null,
        },
      ];
    }

    return [
      {
        id: "form138",
        name: "Form 138 / 137",
        category: "Academic",
        fileKey: "form138",
      },
      ...commonDocs,
    ];
  };

  // Build the authenticated URL (same as before, but we'll fetch via axios)
  const getImageUrl = (fileKey) => {
    if (!student?.studentId || !fileKey) return null;
    return `${API_BASE_URL}/faculty/review-document/${student.studentId}-${fileKey}`;
  };

  // Fetch a single image and return a blob URL
  const fetchImageAsBlob = async (fileKey) => {
    const url = getImageUrl(fileKey);
    if (!url) return null;
    try {
      const response = await axios.get(url, { responseType: "blob" });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error(`Failed to fetch image for ${fileKey}:`, error);
      return null;
    }
  };

  // Initialize documents and fetch all images
  const initializeDocuments = useCallback(async () => {
    if (!student?.studentId) {
      setDocuments([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const studentType = student.type === "transferee" ? "transferee" : "new";
      const requiredDocs = getRequiredDocuments(studentType);

      // Create document objects without blob URLs first
      const docs = requiredDocs.map((doc) => ({
        id: doc.id,
        name: doc.name,
        type: doc.fileKey ? "JPG" : "PDF",
        size: doc.fileKey ? "Loading..." : "N/A",
        uploaded: new Date().toLocaleDateString(),
        status: "pending",
        category: doc.category,
        fileKey: doc.fileKey,
        downloadUrl: doc.fileKey ? getImageUrl(doc.fileKey) : null,
      }));

      setDocuments(docs);

      // Fetch images for documents that have a fileKey
      const blobMap = {};
      for (const doc of docs) {
        if (doc.fileKey) {
          const blobUrl = await fetchImageAsBlob(doc.fileKey);
          if (blobUrl) blobMap[doc.id] = blobUrl;
        }
      }
      setImageBlobUrls(blobMap);
    } catch (error) {
      console.error("Failed to initialize documents:", error);
      toast.error("Failed to load documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [student?.studentId, student?.type]);

  useEffect(() => {
    initializeDocuments();

    // Cleanup all blob URLs when component unmounts or student changes
    return () => {
      Object.values(imageBlobUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [initializeDocuments]);

  // Cleanup specific blob URL when a document is removed or re-fetched
  const revokeBlobUrl = (docId) => {
    if (imageBlobUrls[docId]) {
      URL.revokeObjectURL(imageBlobUrls[docId]);
      setImageBlobUrls((prev) => {
        const newUrls = { ...prev };
        delete newUrls[docId];
        return newUrls;
      });
    }
  };

  const getDocumentIcon = (type, hasBlob) => {
    if (!hasBlob) return "text-gray-400 bg-gray-100";
    if (type === "PDF") return "text-red-600 bg-red-50";
    if (type === "JPG" || type === "PNG") return "text-green-600 bg-green-50";
    return "text-gray-600 bg-gray-50";
  };

  const handleViewDocument = (doc) => {
    const blobUrl = imageBlobUrls[doc.id];
    if (blobUrl) {
      window.open(blobUrl, "_blank");
    } else if (doc.downloadUrl) {
      // Fallback to original URL (but likely will fail auth)
      window.open(doc.downloadUrl, "_blank");
    } else {
      toast.warning(
        "Document preview not available. The student may not have uploaded this document.",
      );
    }
  };

  const handleDownloadDocument = async (doc) => {
    // Prefer blob URL if available, otherwise try the raw URL
    const blobUrl = imageBlobUrls[doc.id];
    if (blobUrl) {
      // Create a temporary link to download the blob
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${doc.name}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    if (doc.downloadUrl) {
      try {
        // Fetch with axios to get authenticated blob
        const response = await axios.get(doc.downloadUrl, {
          responseType: "blob",
        });
        const blob = response.data;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${doc.name}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to download document. Please try again.");
      }
    } else {
      toast.warning("Document not available for download.");
    }
  };

  const handleApprove = async (fileId, studentId) => {
    if (isSubmitting) return;
    const fileData = {
      fileId,
      studentId,
      feedback,
      status: true,
    };
    setIsSubmitting(true);
    setFeedbackError("");
    try {
      await axios.patch(`${API_BASE_URL}/faculty/verified-document`, fileData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("All documents approved successfully!");
      setDocuments((docs) =>
        docs.map((doc) => ({ ...doc, status: "approved" })),
      );

      if (onReviewComplete) onReviewComplete();

      setTimeout(() => {
        backpage(null);
      }, 2500);
    } catch (error) {
      console.error("Failed to approve:", error);
      toast.error("Failed to approve. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (fileId, studentId) => {
    if (isSubmitting) return;
    if (!feedback.trim()) {
      setFeedbackError("Please provide feedback for rejection.");
      toast.warning("Please provide feedback when rejecting documents.");
      return;
    }
    setFeedbackError("");
    setIsSubmitting(true);
    const fileData = {
      fileId,
      studentId,
      feedback,
      status: false,
    };
    try {
      await axios.patch(`${API_BASE_URL}/faculty/verified-document`, fileData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.info("Documents rejected. Feedback sent to student.");
      setDocuments((docs) =>
        docs.map((doc) => ({ ...doc, status: "rejected" })),
      );

      if (onReviewComplete) onReviewComplete();

      setTimeout(() => {
        backpage(null);
      }, 2500);
    } catch (error) {
      console.error("Failed to reject:", error);
      toast.error("Failed to reject. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStudentData = () => {
    if (student) return student;
    return {
      id: 1,
      studentName: "John Doe",
      studentId: "c069768b-e7a6-4f46-9d64-1af0263a634b",
      email: "john.doe@example.com",
      program: "Computer Science",
      semester: "Fall 2024",
      enrollmentDate: "2024-01-15",
      status: "documents_pending",
      type: "new",
    };
  };

  const currentStudent = getStudentData();
  const studentTypeLabel =
    currentStudent.type === "transferee" ? "Transferee" : "New Student";

  if (isLoading) {
    return (
      <Card>
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading documents...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Student Information Header */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {currentStudent.studentName}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">ENROLLMENT ID: </span>{" "}
                  {currentStudent.id}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-1" />
                  {currentStudent.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Book className="w-4 h-4 mr-1" />
                  {currentStudent.program}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  {currentStudent.semester}
                </div>
                <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
                  {studentTypeLabel}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <StatusBadge
              status={currentStudent.status?.split("_").join(" ") || "pending"}
              size="lg"
            />
            <p className="text-sm text-gray-600 mt-2">
              Enrolled: {currentStudent.enrollmentDate}
            </p>
          </div>
        </div>
      </Card>

      {/* Documents List */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Required Documents ({studentTypeLabel})
          </h3>
          <p className="text-gray-600">
            Review each document and provide feedback if needed.
          </p>
        </div>

        <div className="space-y-4">
          {documents.map((doc) => {
            const blobUrl = imageBlobUrls[doc.id];
            const hasBlob = !!blobUrl;
            const showPreview = hasBlob && doc.fileKey;

            return (
              <div
                key={doc.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${getDocumentIcon(doc.type, hasBlob)}`}
                    >
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          {doc.name}
                        </h4>
                        {doc.status !== "pending" && (
                          <StatusBadge status={doc.status} size="sm" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Paperclip className="w-4 h-4 mr-1" />
                          {doc.type} • {doc.size}
                        </span>
                        <span>•</span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {doc.category}
                        </span>
                        <span>•</span>
                        <span>Uploaded: {doc.uploaded}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-start md:self-center">
                    <button
                      type="button"
                      onClick={() => handleViewDocument(doc)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Preview"
                      aria-label={`Preview ${doc.name}`}
                      disabled={!hasBlob && !doc.downloadUrl}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadDocument(doc)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download"
                      aria-label={`Download ${doc.name}`}
                      disabled={!hasBlob && !doc.downloadUrl}
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    {hasBlob && (
                      <a
                        href={blobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Document Preview / Thumbnail */}
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Document Preview
                    </span>
                    <span className="text-xs text-gray-500">
                      Click buttons above to view full document
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-6 bg-white border border-gray-300 rounded">
                    {showPreview ? (
                      <img
                        src={blobUrl}
                        alt={doc.name}
                        className="max-w-full max-h-48 object-contain"
                      />
                    ) : (
                      <div className="text-center">
                        {!doc.fileKey ? (
                          <>
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                              Document not available digitally
                            </p>
                            <p className="text-xs text-gray-400">
                              Student must submit physical copy.
                            </p>
                          </>
                        ) : !hasBlob ? (
                          <>
                            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">
                              Failed to load image
                            </p>
                            <p className="text-xs text-gray-400">
                              The file may be missing or inaccessible.
                            </p>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">{doc.name}</p>
                            <p className="text-xs text-gray-400">
                              {doc.type} • {doc.size}
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Document Statistics */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {documents.length}
              </div>
              <div className="text-sm text-gray-600">Total Documents</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {documents.filter((d) => d.status === "pending").length}
              </div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {documents.filter((d) => d.status === "approved").length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {documents.filter((d) => d.status === "rejected").length}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Feedback and Actions */}
      <Card>
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Review Feedback
            </h3>
          </div>
          <p className="text-gray-600">
            Provide feedback for the student. Required when rejecting documents.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="feedback"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Feedback for Student
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback here. Be specific about what needs to be corrected or improved."
              className={`w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                feedbackError ? "border-red-500" : "border-gray-300"
              }`}
            />
            {feedbackError && (
              <p className="text-red-600 text-sm mt-2">{feedbackError}</p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              This feedback will be sent to the student via email and will
              appear in their dashboard.
            </p>
          </div>

          {documents.some((d) => d.status === "pending") && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <PrimaryButton
                type="button"
                onClick={() =>
                  handleApprove(currentStudent.id, student.studentId)
                }
                icon={CheckCircle}
                disabled={isSubmitting}
                className="sm:flex-1"
              >
                {isSubmitting ? "Approving..." : "Approve All Documents"}
              </PrimaryButton>
              <SecondaryButton
                type="button"
                onClick={() =>
                  handleReject(currentStudent.id, student.studentId)
                }
                icon={XCircle}
                disabled={isSubmitting || !feedback.trim()}
                className="sm:flex-1 border-red-300 text-red-700 hover:bg-red-50"
              >
                {isSubmitting ? "Rejecting..." : "Reject Documents"}
              </SecondaryButton>
            </div>
          )}
        </div>
      </Card>

      {/* Review Guidelines */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Review Guidelines
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">When to Approve</p>
              <p className="text-sm text-gray-600">
                Documents are clear, complete, and meet all requirements. All
                information is verifiable.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">When to Reject</p>
              <p className="text-sm text-gray-600">
                Documents are blurry, incomplete, expired, or contain incorrect
                information. Always provide specific feedback.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Feedback Requirements</p>
              <p className="text-sm text-gray-600">
                Feedback is required when rejecting. Be clear about what needs
                to be corrected and how to resubmit.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default DocumentReviewCard;
