// components/faculty/DocumentReview.jsx
import React, { useState } from "react";
import {
  Search,
  Filter,
  Users,
  FileText,
  Clock,
  AlertCircle,
} from "lucide-react";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import StatusBadge from "../ui/StatusBadge";
import DocumentReviewCard from "./DocumentReviewCard";

function DocumentReview() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const reviewQueue = [
    {
      id: 1,
      studentName: "John Doe",
      studentId: "S2024001",
      type: "document",
      submitted: "2 hours ago",
      status: "pending",
      priority: "high",
      documents: 3,
      details: {
        email: "john.doe@example.com",
        program: "Computer Science",
        semester: "Fall 2024",
      },
    },
    {
      id: 2,
      studentName: "Jane Smith",
      studentId: "S2024002",
      type: "payment",
      submitted: "4 hours ago",
      status: "pending",
      priority: "medium",
      amount: "$1,500",
      details: {
        email: "jane.smith@example.com",
        program: "Business Administration",
        semester: "Fall 2024",
      },
    },
    {
      id: 3,
      studentName: "Robert Johnson",
      studentId: "S2024003",
      type: "document",
      submitted: "1 day ago",
      status: "pending",
      priority: "low",
      documents: 2,
      details: {
        email: "robert.j@example.com",
        program: "Engineering",
        semester: "Spring 2024",
      },
    },
    {
      id: 4,
      studentName: "Sarah Williams",
      studentId: "S2024004",
      type: "document",
      submitted: "2 days ago",
      status: "pending",
      priority: "medium",
      documents: 4,
      details: {
        email: "sarah.w@example.com",
        program: "Medicine",
        semester: "Fall 2024",
      },
    },
  ];

  const getFilteredQueue = () => {
    let filtered = reviewQueue;

    // Apply type filter
    if (filter !== "all") {
      filtered = filtered.filter((item) => item.type === filter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.studentName.toLowerCase().includes(query) ||
          item.studentId.toLowerCase().includes(query) ||
          item.details.email.toLowerCase().includes(query),
      );
    }

    return filtered;
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <FileText className="w-4 h-4 text-green-600" />;
    }
  };

  const handleStartReview = (student) => {
    setSelectedStudent(student);
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
  };

  const getStats = () => {
    const total = reviewQueue.length;
    const documents = reviewQueue.filter(
      (item) => item.type === "document",
    ).length;
    const payments = reviewQueue.filter(
      (item) => item.type === "payment",
    ).length;
    const highPriority = reviewQueue.filter(
      (item) => item.priority === "high",
    ).length;

    return { total, documents, payments, highPriority };
  };

  const stats = getStats();
  const filteredQueue = getFilteredQueue();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Document Review</h1>
        <p className="text-gray-600">Review and validate student documents</p>
      </div>

      {selectedStudent ? (
        <div>
          <div className="mb-6">
            <button
              onClick={handleBackToList}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Review Queue
            </button>
          </div>
          <DocumentReviewCard student={selectedStudent} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Documents</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.documents}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Payments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.payments}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.highPriority}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student name, ID, or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <Filter className="w-5 h-5 text-gray-400 mr-2" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="document">Documents</option>
                    <option value="payment">Payments</option>
                  </select>
                </div>
                <SecondaryButton icon={Filter}>More Filters</SecondaryButton>
              </div>
            </div>
          </Card>

          {/* Review Queue */}
          <Card className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Review Queue
                </h3>
                <span className="text-sm text-gray-600">
                  {filteredQueue.length} of {reviewQueue.length} items
                </span>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredQueue.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No pending reviews
                  </h4>
                  <p className="text-gray-600">
                    All caught up! No items in the review queue.
                  </p>
                </div>
              ) : (
                filteredQueue.map((student) => (
                  <div
                    key={student.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                          <Users className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-gray-900">
                              {student.studentName}
                            </h4>
                            <StatusBadge status={student.priority} size="sm" />
                            {getPriorityIcon(student.priority)}
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center space-x-4">
                              <span className="text-gray-600">
                                ID: {student.studentId}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600">
                                {student.details.email}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-gray-600">
                                {student.details.program}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600">
                                {student.details.semester}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center space-x-4 text-sm">
                            <span className="flex items-center text-gray-600">
                              <Clock className="w-4 h-4 mr-1" />
                              {student.submitted}
                            </span>
                            <span className="text-gray-600">
                              {student.type === "document"
                                ? `${student.documents} documents`
                                : `Payment: ${student.amount}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <SecondaryButton
                          onClick={() =>
                            console.log(`View ${student.studentName}`)
                          }
                          size="sm"
                        >
                          View Details
                        </SecondaryButton>
                        <PrimaryButton
                          onClick={() => handleStartReview(student)}
                          size="sm"
                        >
                          Start Review
                        </PrimaryButton>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredQueue.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {filteredQueue.length} of {reviewQueue.length}{" "}
                    reviews
                  </p>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1.5 border border-gray-300 rounded text-sm">
                      Previous
                    </button>
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm">
                      1
                    </button>
                    <button className="px-3 py-1.5 border border-gray-300 rounded text-sm">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

export default DocumentReview;
