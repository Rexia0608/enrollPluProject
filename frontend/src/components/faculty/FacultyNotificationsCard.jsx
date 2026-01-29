// components/faculty/FacultyNotificationsCard.jsx
import React, { useState } from "react";
import {
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  X,
  Check,
} from "lucide-react";
import Card from "../ui/Card";
import SecondaryButton from "../ui/SecondaryButton";

function FacultyNotificationsCard() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "document",
      title: "New Document Submission",
      description: "John Doe uploaded admission form",
      time: "10 minutes ago",
      unread: true,
      studentId: "S2024001",
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Submitted",
      description: "Jane Smith submitted payment proof",
      time: "1 hour ago",
      unread: true,
      studentId: "S2024002",
    },
    {
      id: 3,
      type: "document",
      title: "Document Review Completed",
      description: "Mark Wilson's documents approved",
      time: "3 hours ago",
      unread: false,
      studentId: "S2024003",
    },
    {
      id: 4,
      type: "system",
      title: "System Update",
      description: "New review guidelines available",
      time: "Yesterday",
      unread: false,
      studentId: null,
    },
    {
      id: 5,
      type: "payment",
      title: "Payment Rejected",
      description: "Sarah Johnson's payment needs correction",
      time: "2 days ago",
      unread: false,
      studentId: "S2024004",
    },
  ]);

  const [filter, setFilter] = useState("all");

  const getNotificationIcon = (type) => {
    switch (type) {
      case "document":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "payment":
        return <CreditCard className="w-5 h-5 text-green-600" />;
      case "system":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, unread: false } : notif,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, unread: false })),
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((notif) => notif.type === filter);

  const unreadCount = notifications.filter((notif) => notif.unread).length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-4 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setFilter("all")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === "all"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("document")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === "document"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Documents
        </button>
        <button
          onClick={() => setFilter("payment")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === "payment"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Payments
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-colors ${
                notification.unread
                  ? "border-blue-200 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div
                    className={`mt-1 ${notification.unread ? "text-blue-600" : "text-gray-400"}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {notification.unread && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 hover:bg-white rounded-md"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4 text-gray-400 hover:text-green-600" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 hover:bg-white rounded-md"
                          title="Delete"
                        >
                          <X className="w-4 h-4 text-gray-400 hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                      {notification.studentId && (
                        <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                          {notification.studentId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <SecondaryButton className="w-full">
            View All Notifications
          </SecondaryButton>
        </div>
      )}
    </Card>
  );
}

export default FacultyNotificationsCard;
