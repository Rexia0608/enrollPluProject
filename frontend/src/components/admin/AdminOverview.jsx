// components/admin/AdminOverview.jsx
import React, { useState, useEffect } from "react";
import { Users, FileText, CreditCard, CheckCircle } from "lucide-react";
import Card from "../ui/Card";
import StatCard from "../ui/StatCard";
import EnrollmentControlCard from "./EnrollmentControlCard";
import RecentActivityCard from "./RecentActivityCard";
import MaintenanceModeCard from "./MaintenanceModeCard";
import { useAdmin } from "../../context/AdminContext";

// Map string icons to actual components
const iconMap = {
  Users: Users,
  FileText: FileText,
  CreditCard: CreditCard,
  CheckCircle: CheckCircle,
};

function AdminOverview() {
  const [stats, setStats] = useState([]);
  const { overView } = useAdmin();

  useEffect(() => {
    // If overView is already in context, use it
    if (overView) {
      // Map string icons to components
      const mappedStats = overView.map((stat) => ({
        ...stat,
        icon: iconMap[stat.icon],
      }));
      setStats(mappedStats);
    }

    // If you need to fetch from API
    // fetchOverview();
  }, [overView]);

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
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
