// components/ui/StatusBadge.jsx
import React from "react";

function StatusBadge({ status, size = "md" }) {
  const statusConfig = {
    active: { color: "bg-green-100 text-green-800", label: "Active" },
    pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
    approved: { color: "bg-green-100 text-green-800", label: "Approved" },
    rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
    closed: { color: "bg-gray-100 text-gray-800", label: "Closed" },
    open: { color: "bg-blue-100 text-blue-800", label: "Open" },
    enrolled: { color: "bg-purple-100 text-purple-800", label: "Enrolled" },
    maintenance: {
      color: "bg-orange-100 text-orange-800",
      label: "Maintenance",
    },
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const config = statusConfig[status] || {
    color: "bg-gray-100 text-gray-800",
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.color} ${sizeClasses[size]}`}
    >
      {config.label}
    </span>
  );
}

export default StatusBadge;
