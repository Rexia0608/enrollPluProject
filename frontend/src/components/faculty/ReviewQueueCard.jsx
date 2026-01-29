// components/faculty/ReviewQueueCard.jsx
import React, { useState } from "react";
import {
  Users,
  Clock,
  AlertCircle,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import StatusBadge from "../ui/StatusBadge";

function ReviewQueueCard() {
  const [reviewQueue, setReviewQueue] = useState([
    {
      id: 1,
      studentName: "John Doe",
      studentId: "S2024001",
      type: "document",
      submitted: "2 hours ago",
      status: "pending",
      priority: "high",
      documents: 3,
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
    },
    {
      id: 4,
      studentName: "Sarah Williams",
      studentId: "S2024004",
      type: "payment",
      submitted: "1 day ago",
      status: "pending",
      priority: "medium",
      amount: "$1,500",
    },
    {
      id: 5,
      studentName: "Michael Brown",
      studentId: "S2024005",
      type: "document",
      submitted: "2 days ago",
      status: "pending",
      priority: "low",
      documents: 4,
    },
  ]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleReview = (id) => {
    console.log("Review student:", id);
    // In a real app, this would navigate to the review page
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Review Queue</h3>
          <p className="text-gray-600">Pending reviews and validations</p>
        </div>
        <div className="flex items-center space-x-2">
          <StatusBadge status="pending" />
          <span className="text-gray-600">·</span>
          <span className="text-sm text-gray-600">
            {reviewQueue.length} items
          </span>
        </div>
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pending</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Wait Time</p>
              <p className="text-2xl font-bold text-gray-900">1.2h</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-3">
        {reviewQueue.map((item) => (
          <div
            key={item.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {item.studentName}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600">
                      {item.studentId}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}
                    >
                      {item.priority} priority
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {item.type === "document"
                      ? `${item.documents} documents`
                      : `Payment: ${item.amount}`}
                  </p>
                  <p className="text-xs text-gray-500">{item.submitted}</p>
                </div>
                <PrimaryButton onClick={() => handleReview(item.id)} size="sm">
                  Review
                </PrimaryButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviewQueue.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {reviewQueue.length} of 18 pending reviews
          </div>
          <SecondaryButton>View All</SecondaryButton>
        </div>
      )}
    </Card>
  );
}

export default ReviewQueueCard;
