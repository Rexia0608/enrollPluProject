// components/admin/AdminOverview.jsx
import React, { useState, useEffect } from "react";
import { Users, FileText, CreditCard, CheckCircle } from "lucide-react";
import StatCard from "../ui/StatCard";
import RecentActivityCard from "./RecentActivityCard";
import { useAdmin } from "../../context/AdminContext";
import axios from "axios";

// Map string icons to actual components
const iconMap = {
  Users: Users,
  FileText: FileText,
  CreditCard: CreditCard,
  CheckCircle: CheckCircle,
};

function AdminOverview() {
  const { getAuthHeaders } = useAdmin();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3000/admin/overView",
          getAuthHeaders(),
        );

        // ✅ Fix: Access response.data, not response directly
        if (response.data.success) {
          // Map string icons to components
          const mappedStats = response.data.items.map((stat) => ({
            ...stat,
            icon: iconMap[stat.icon],
          }));
          setStats(mappedStats);
        } else {
          setError(response.data.message || "Failed to load overview");
        }
      } catch (err) {
        console.error("Error fetching overview:", err);
        setError(err.message || "Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []); // ✅ Empty dependency array – fetch once on mount

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading overview...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error: {error}
      </div>
    );
  }

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
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecentActivityCard />
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
