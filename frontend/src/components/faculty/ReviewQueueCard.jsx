// components/faculty/ReviewQueueCard.jsx
import React, { useState, useEffect } from "react";
import { Users, AlertCircle, RefreshCw } from "lucide-react";
import Card from "../ui/Card";
import PrimaryButton from "../ui/PrimaryButton";
import StatusBadge from "../ui/StatusBadge";
import Pagination from "../ui/Pagination";
import { mockReviewQueue } from "./mockReviewQueueData";

function ReviewQueueCard() {
  const [reviewQueue, setReviewQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviewQueue = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setReviewQueue(mockReviewQueue);
    } catch (err) {
      setError("Failed to load review queue");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewQueue();
  }, []);

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

  // Render function for Pagination
  const renderReviewItems = (paginatedData) => (
    <div className="space-y-3">
      {paginatedData.map((item) => (
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
  );

  const emptyState = (
    <div className="text-center py-12">
      <p className="text-gray-500 font-medium">No pending reviews</p>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-gray-700 font-medium">{error}</p>
          <button
            onClick={fetchReviewQueue}
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Try again
          </button>
        </div>
      </Card>
    );
  }

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

      <Pagination
        items={reviewQueue}
        itemsPerPage={5}
        renderItems={renderReviewItems}
        emptyStateComponent={emptyState}
        showFirstLast
        siblingCount={1}
      />
    </Card>
  );
}

export default ReviewQueueCard;
