// components/layout/DashboardContainer.jsx
import React from "react";

function DashboardContainer({ children, className = "" }) {
  return (
    <div className={`max-w-7xl mx-auto px-4 py-6 ${className}`}>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

export default DashboardContainer;
