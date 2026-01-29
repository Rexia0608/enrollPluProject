// components/admin/AdminOverview.jsx
import React from "react";
import { Users, FileText, CreditCard, CheckCircle } from "lucide-react";
import Card from "../ui/Card";
import StatCard from "../ui/StatCard";
import EnrollmentControlCard from "./EnrollmentControlCard";
import RecentActivityCard from "./RecentActivityCard";
import MaintenanceModeCard from "./MaintenanceModeCard";

function AdminOverview() {
  const stats = [
    {
      title: "Total Students",
      value: "1,248",
      change: 12,
      icon: Users,
      color: "blue",
    },
    {
      title: "Pending Documents",
      value: "42",
      change: -5,
      icon: FileText,
      color: "yellow",
    },
    {
      title: "Pending Payments",
      value: "28",
      change: 8,
      icon: CreditCard,
      color: "red",
    },
    {
      title: "Enrolled Students",
      value: "876",
      change: 15,
      icon: CheckCircle,
      color: "green",
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
        <p className="text-gray-600">
          Monitor and manage enrollment system status
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <EnrollmentControlCard />
          <RecentActivityCard />
        </div>

        <div className="space-y-6">
          <MaintenanceModeCard />
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                Create New Academic Year
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                Add New Course
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                View System Reports
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                Manage User Roles
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
