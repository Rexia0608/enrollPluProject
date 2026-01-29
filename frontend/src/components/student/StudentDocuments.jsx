// components/student/DocumentsCard.jsx
import React, { useState } from "react";
import {
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
} from "lucide-react";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import StatusBadge from "../ui/StatusBadge";

function DocumentsCard() {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Admission Form",
      description: "Complete and signed admission application",
      status: "approved",
      feedback: "",
      uploadedDate: "2024-01-15",
      required: true,
    },
    {
      id: 2,
      name: "Birth Certificate",
      description: "Government-issued birth certificate",
      status: "rejected",
      feedback:
        "Document is blurry and unreadable. Please upload a clear scan.",
      uploadedDate: "2024-01-15",
      required: true,
    },
    {
      id: 3,
      name: "Transcript of Records",
      description: "Official transcript from previous school",
      status: "pending",
      feedback: "",
      uploadedDate: "2024-01-14",
      required: true,
    },
    {
      id: 4,
      name: "Recommendation Letter",
      description: "Letter from a teacher or counselor",
      status: "not_uploaded",
      feedback: "",
      uploadedDate: null,
      required: true,
    },
    {
      id: 5,
      name: "Medical Certificate",
      description: "Health clearance from licensed physician",
      status: "not_uploaded",
      feedback: "",
      uploadedDate: null,
      required: false,
    },
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const handleUpload = (id) => {
    // In real app, this would trigger file upload
    console.log("Upload document:", id);
  };

  const completedCount = documents.filter(
    (d) => d.status === "approved",
  ).length;
  const totalRequired = documents.filter((d) => d.required).length;

  return (
    <Card>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
            <p className="text-gray-600">Upload and track required documents</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {completedCount}/{totalRequired}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Document Progress</span>
            <span className="text-sm font-medium">
              {Math.round((completedCount / totalRequired) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / totalRequired) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="shrink-0">{getStatusIcon(doc.status)}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{doc.name}</h4>
                      {doc.required && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {doc.description}
                    </p>

                    {doc.status === "rejected" && doc.feedback && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start">
                          <XCircle className="w-4 h-4 text-red-600 mt-0.5 mr-2 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-red-800">
                              Feedback from reviewer:
                            </p>
                            <p className="text-sm text-red-700 mt-1">
                              {doc.feedback}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {doc.uploadedDate && (
                      <p className="text-xs text-gray-500 mt-2">
                        Uploaded: {doc.uploadedDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="ml-4 flex flex-col items-end space-y-2">
                <StatusBadge
                  status={
                    doc.status === "not_uploaded" ? "pending" : doc.status
                  }
                  size="sm"
                />

                {doc.status === "not_uploaded" ? (
                  <PrimaryButton
                    onClick={() => handleUpload(doc.id)}
                    icon={Upload}
                    size="sm"
                  >
                    Upload
                  </PrimaryButton>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Area */}
      <div className="mt-6 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h4 className="font-medium text-gray-900 mb-2">Upload New Document</h4>
        <p className="text-gray-600 mb-4">
          Drag and drop files or click to browse
        </p>
        <PrimaryButton icon={Upload} className="mx-auto">
          Select Files
        </PrimaryButton>
        <p className="text-xs text-gray-500 mt-3">
          Supported formats: PDF, JPG, PNG up to 10MB
        </p>
      </div>
    </Card>
  );
}

export default DocumentsCard;
