// components/faculty/FacultyOverview.jsx
import React, { useState, useEffect } from "react";
import { FileText, CreditCard, Clock, CheckCircle } from "lucide-react";
import StatCard from "../ui/StatCard";
import ActivityCard from "./ActivityCard";
import axios from "axios";

function FacultyOverview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState({
    pending_documents: 0,
    pending_payment_validations: 0,
    reviewed_today: 0,
    avg_response_hours: 0,
  });

  useEffect(() => {
    const fetchKPI = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:3000/faculty/kpiCards",
        );

        if (response.data.success && response.data.items?.length > 0) {
          const data = response.data.items[0];
          setStatsData({
            pending_documents: parseInt(data.pending_documents) || 0,
            pending_payment_validations:
              parseInt(data.pending_payment_validations) || 0,
            reviewed_today: parseInt(data.reviewed_today) || 0,
            avg_response_hours: parseFloat(data.avg_response_hours) || 0,
          });
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch faculty KPI:", err);
        setError("Unable to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchKPI();
  }, []);

  // Format average response time to show "Xh" or "X.Xh"
  const formatResponseTime = (hours) => {
    if (hours === 0) return "0h";
    // Show one decimal if needed
    return hours % 1 === 0 ? `${hours}h` : `${hours.toFixed(1)}h`;
  };

  const stats = [
    {
      title: "Pending Documents",
      value: loading ? "..." : statsData.pending_documents.toString(),
      icon: FileText,
      color: "yellow",
    },
    {
      title: "Payment Validations",
      value: loading ? "..." : statsData.pending_payment_validations.toString(),
      icon: CreditCard,
      color: "blue",
    },
    {
      title: "Reviewed Today",
      value: loading ? "..." : statsData.reviewed_today.toString(),
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Avg. Response Time",
      value: loading ? "..." : formatResponseTime(statsData.avg_response_hours),
      icon: Clock,
      color: "purple",
    },
  ];

  if (error) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Faculty Overview Dashboard
          </h1>
          <p className="text-gray-600">
            Manage document reviews and payment validations
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Error loading data</p>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Faculty Overview Dashboard
        </h1>
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
          <ActivityCard />
        </div>
      </div>
    </div>
  );
}

export default FacultyOverview;
