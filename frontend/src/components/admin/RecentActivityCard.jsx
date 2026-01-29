// components/admin/RecentActivityCard.jsx
import React, { useState } from "react";
import {
  Clock,
  Users,
  FileText,
  CreditCard,
  Settings,
  UserPlus,
  BookOpen,
  Shield,
  Calendar,
  Filter,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import Card from "../ui/Card";
import SecondaryButton from "../ui/SecondaryButton";
import StatusBadge from "../ui/StatusBadge";

function RecentActivityCard() {
  const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const activities = [
    {
      id: 1,
      type: "user_created",
      title: "New User Created",
      description: "Admin created a new faculty account for Dr. Sarah Johnson",
      user: "Admin User",
      timestamp: "5 minutes ago",
      icon: UserPlus,
      color: "bg-blue-100 text-blue-600",
      details: {
        username: "sjohnson",
        role: "Faculty",
        email: "s.johnson@school.edu",
      },
    },
    {
      id: 2,
      type: "enrollment_opened",
      title: "Enrollment Period Opened",
      description: "Enrollment for Academic Year 2024-2025 has been opened",
      user: "System Admin",
      timestamp: "1 hour ago",
      icon: Calendar,
      color: "bg-green-100 text-green-600",
      details: {
        period: "2024-2025",
        startDate: "Jan 15, 2024",
        endDate: "Mar 31, 2024",
      },
    },
    {
      id: 3,
      type: "document_rejected",
      title: "Document Rejected",
      description: "John Smith's birth certificate was rejected",
      user: "Faculty Reviewer",
      timestamp: "2 hours ago",
      icon: FileText,
      color: "bg-red-100 text-red-600",
      details: {
        student: "John Smith",
        document: "Birth Certificate",
        reason: "Document is blurry",
      },
    },
    {
      id: 4,
      type: "payment_validated",
      title: "Payment Validated",
      description: "Payment from Jane Doe has been validated",
      user: "Faculty Reviewer",
      timestamp: "3 hours ago",
      icon: CreditCard,
      color: "bg-green-100 text-green-600",
      details: {
        student: "Jane Doe",
        amount: "$1,500",
        reference: "PAY-2024-00123",
      },
    },
    {
      id: 5,
      type: "course_created",
      title: "New Course Created",
      description: "Introduction to Data Science (CS301) has been added",
      user: "Academic Admin",
      timestamp: "Yesterday",
      icon: BookOpen,
      color: "bg-purple-100 text-purple-600",
      details: {
        courseCode: "CS301",
        credits: 3,
        seats: 45,
      },
    },
    {
      id: 6,
      type: "settings_updated",
      title: "System Settings Updated",
      description: "Enrollment deadline was extended by 2 weeks",
      user: "System Admin",
      timestamp: "Yesterday",
      icon: Settings,
      color: "bg-yellow-100 text-yellow-600",
      details: {
        setting: "Enrollment Deadline",
        oldValue: "Mar 15, 2024",
        newValue: "Mar 31, 2024",
      },
    },
    {
      id: 7,
      type: "user_deactivated",
      title: "User Account Deactivated",
      description: "Student account for Michael Brown was deactivated",
      user: "Admin User",
      timestamp: "2 days ago",
      icon: Users,
      color: "bg-red-100 text-red-600",
      details: {
        user: "Michael Brown",
        reason: "Inactive account",
      },
    },
    {
      id: 8,
      type: "maintenance_mode",
      title: "Maintenance Mode Activated",
      description: "System was placed in maintenance mode for updates",
      user: "System Admin",
      timestamp: "3 days ago",
      icon: Shield,
      color: "bg-orange-100 text-orange-600",
      details: {
        duration: "2 hours",
        status: "Completed",
      },
    },
  ];

  const activityTypes = [
    { id: "all", label: "All Activities", icon: Clock },
    { id: "user_created", label: "User Management", icon: Users },
    { id: "enrollment_opened", label: "Enrollment", icon: Calendar },
    { id: "document_rejected", label: "Documents", icon: FileText },
    { id: "payment_validated", label: "Payments", icon: CreditCard },
    { id: "system", label: "System", icon: Settings },
  ];

  const getActivityTypeLabel = (type) => {
    const typeConfig = activityTypes.find((t) => t.id === type);
    return typeConfig ? typeConfig.label : type;
  };

  const filteredActivities =
    filter === "all"
      ? activities
      : activities.filter((activity) => activity.type === filter);

  const displayedActivities = showAll
    ? filteredActivities
    : filteredActivities.slice(0, 5);

  const getActivityIcon = (type) => {
    const typeConfig = activityTypes.find((t) => t.id === type);
    return typeConfig ? typeConfig.icon : Clock;
  };

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
          <p className="text-gray-600">System-wide actions and events</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg pl-10 pr-8 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {activityTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
            <div className="absolute left-3 top-2.5">
              <Filter className="w-4 h-4 text-gray-400" />
            </div>
            <ChevronRight className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <SecondaryButton>Export Log</SecondaryButton>
        </div>
      </div>

      {/* Activity Type Quick Filters */}
      <div className="flex overflow-x-auto pb-2 mb-6 -mx-6 px-6">
        <div className="flex space-x-2 min-w-max">
          {activityTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setFilter(type.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                filter === type.id
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-100 border border-transparent"
              }`}
            >
              <type.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Activities Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-6">
          {displayedActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="relative">
                {/* Timeline dot */}
                <div
                  className={`absolute left-6 transform -translate-x-1/2 w-3 h-3 rounded-full border-4 border-white ${activity.color.replace("bg-", "bg-").split(" ")[0]}`}
                ></div>

                <div className="ml-12">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.color}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">
                              {activity.title}
                            </h4>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                              {getActivityTypeLabel(activity.type)}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">
                            {activity.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center text-sm text-gray-500">
                              <Users className="w-4 h-4 mr-1" />
                              <span>{activity.user}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{activity.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Activity Details */}
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                          {Object.entries(activity.details).map(
                            ([key, value]) => (
                              <div key={key} className="flex flex-col">
                                <span className="text-gray-500 capitalize">
                                  {key.replace(/([A-Z])/g, " $1")}
                                </span>
                                <span className="font-medium text-gray-900">
                                  {value}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>

                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg self-start sm:self-center">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View More / View Less */}
      {filteredActivities.length > 5 && (
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            {showAll
              ? "Show Less"
              : `View All Activities (${filteredActivities.length})`}
            <ChevronRight
              className={`w-4 h-4 ml-1 transition-transform ${showAll ? "rotate-90" : ""}`}
            />
          </button>
        </div>
      )}

      {/* Activity Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {activities.length}
            </div>
            <div className="text-sm text-gray-600">Total Activities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">24h</div>
            <div className="text-sm text-gray-600">Last 24 Hours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {activities.filter((a) => a.type.includes("user")).length}
            </div>
            <div className="text-sm text-gray-600">User Actions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {activities.filter((a) => a.type.includes("system")).length}
            </div>
            <div className="text-sm text-gray-600">System Events</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default RecentActivityCard;
