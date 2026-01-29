// components/faculty/FacultyOverview.jsx
import React from "react";
import { FileText, CreditCard, Clock, CheckCircle } from "lucide-react";
import Card from "../ui/Card";
import StatCard from "../ui/StatCard";
import ReviewQueueCard from "./ReviewQueueCard";
import FacultyNotificationsCard from "./FacultyNotificationsCard";

function FacultyOverview() {
  const stats = [
    {
      title: "Pending Documents",
      value: "18",
      icon: FileText,
      color: "yellow",
    },
    {
      title: "Payment Validations",
      value: "12",
      icon: CreditCard,
      color: "blue",
    },
    { title: "Reviewed Today", value: "24", icon: CheckCircle, color: "green" },
    {
      title: "Avg. Response Time",
      value: "2.4h",
      icon: Clock,
      color: "purple",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Review Dashboard</h1>
        <p className="text-gray-600">
          Manage document reviews and payment validations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReviewQueueCard />
        </div>

        <div className="space-y-6">
          <FacultyNotificationsCard />

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                View All Students
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                Generate Review Report
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                Set Availability
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default FacultyOverview;
