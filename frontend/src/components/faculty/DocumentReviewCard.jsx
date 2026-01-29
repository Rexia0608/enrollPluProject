// components/faculty/DocumentReviewCard.jsx
import React, { useState, useEffect } from "react";
// Add to the imports at the top of DocumentReviewCard.jsx
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
} from "lucide-react";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import StatusBadge from "../ui/StatusBadge";

function DocumentReviewCard({ student }) {
  const [documents, setDocuments] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [action, setAction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch documents based on student.id
    if (student) {
      // Mock data based on student
      const mockDocuments = student.documents || [
        {
          id: 1,
          name: "Admission Application Form",
          type: "PDF",
          size: "2.4 MB",
          uploaded: "2024-01-15 14:30",
          status: "pending",
          category: "Application",
          previewUrl: "#",
          downloadUrl: "#",
        },
        {
          id: 2,
          name: "Birth Certificate",
          type: "PDF",
          size: "1.8 MB",
          uploaded: "2024-01-15 14:32",
          status: "pending",
          category: "Identity",
          previewUrl: "#",
          downloadUrl: "#",
        },
        {
          id: 3,
          name: "Transcript of Records",
          type: "PDF",
          size: "3.2 MB",
          uploaded: "2024-01-14 11:15",
          status: "pending",
          category: "Academic",
          previewUrl: "#",
          downloadUrl: "#",
        },
        {
          id: 4,
          name: "Recommendation Letter",
          type: "PDF",
          size: "1.5 MB",
          uploaded: "2024-01-14 11:20",
          status: "pending",
          category: "Academic",
          previewUrl: "#",
          downloadUrl: "#",
        },
        {
          id: 5,
          name: "Medical Certificate",
          type: "JPG",
          size: "4.1 MB",
          uploaded: "2024-01-13 09:45",
          status: "pending",
          category: "Health",
          previewUrl: "#",
          downloadUrl: "#",
        },
      ];
      setDocuments(mockDocuments);
    }
  }, [student]);

  const getDocumentIcon = (type) => {
    if (type === "PDF") return "text-red-600 bg-red-50";
    if (type === "JPG" || type === "PNG") return "text-green-600 bg-green-50";
    if (type === "DOC") return "text-blue-600 bg-blue-50";
    return "text-gray-600 bg-gray-50";
  };

  const handleApprove = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // In real app, would call API to approve all documents
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAction("approved");
      setDocuments((docs) =>
        docs.map((doc) => ({ ...doc, status: "approved" })),
      );
    } catch (error) {
      console.error("Failed to approve:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (isSubmitting) return;

    if (!feedback.trim()) {
      alert("Please provide feedback for rejection");
      return;
    }

    setIsSubmitting(true);
    try {
      // In real app, would call API to reject documents with feedback
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAction("rejected");
      setDocuments((docs) =>
        docs.map((doc) => ({ ...doc, status: "rejected" })),
      );
    } catch (error) {
      console.error("Failed to reject:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDocument = (documentId) => {
    console.log("View document:", documentId);
    // In real app, would open document viewer
  };

  const handleDownloadDocument = (documentId) => {
    console.log("Download document:", documentId);
    // In real app, would trigger download
  };

  const getStudentData = () => {
    return (
      student || {
        id: 1,
        studentName: "John Doe",
        studentId: "S2024001",
        email: "john.doe@example.com",
        program: "Computer Science",
        semester: "Fall 2024",
        enrollmentDate: "2024-01-15",
        status: "documents_pending",
      }
    );
  };

  const currentStudent = getStudentData();

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
                  <span className="font-medium">ID:</span>{" "}
                  {currentStudent.studentId}
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
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <StatusBadge
              status={currentStudent.status.split("_").join(" ")}
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
            Uploaded Documents
          </h3>
          <p className="text-gray-600">
            Review each document and provide feedback if needed
          </p>
        </div>

        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${getDocumentIcon(doc.type)}`}
                  >
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{doc.name}</h4>
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
                    onClick={() => handleViewDocument(doc.id)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDownloadDocument(doc.id)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <a
                    href={doc.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Document Preview Placeholder */}
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
                  <FileText className="w-12 h-12 text-gray-400" />
                  <div className="ml-4">
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-600">
                      {doc.type} • {doc.size}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback for Student
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback here. Be specific about what needs to be corrected or improved."
              className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-sm text-gray-600 mt-2">
              This feedback will be sent to the student via email and will
              appear in their dashboard.
            </p>
          </div>

          {action && (
            <div
              className={`p-4 rounded-lg ${action === "approved" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
            >
              <div className="flex items-center">
                {action === "approved" ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 mr-2" />
                )}
                <span className="font-medium">
                  Documents {action}!{" "}
                  {action === "rejected" &&
                    "Feedback has been sent to the student."}
                </span>
              </div>
            </div>
          )}

          {documents.some((d) => d.status === "pending") && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <PrimaryButton
                onClick={handleApprove}
                icon={CheckCircle}
                disabled={isSubmitting}
                className="sm:flex-1"
              >
                {isSubmitting ? "Approving..." : "Approve All Documents"}
              </PrimaryButton>
              <SecondaryButton
                onClick={handleReject}
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
    </div>
  );
}

export default DocumentReviewCard;
