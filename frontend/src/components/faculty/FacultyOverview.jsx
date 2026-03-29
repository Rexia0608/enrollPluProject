// components/faculty/FacultyOverview.jsx
import React from "react";
import { FileText, CreditCard, Clock, CheckCircle } from "lucide-react";
import Card from "../ui/Card";
import StatCard from "../ui/StatCard";
import ReviewQueueCard from "./ReviewQueueCard";

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

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="lg:col-span-2">
          <ReviewQueueCard />
        </div>
      </div>
    </div>
  );
}

export default FacultyOverview;
