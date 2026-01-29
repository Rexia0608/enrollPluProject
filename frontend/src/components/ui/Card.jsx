// components/ui/Card.jsx
import React from "react";

function Card({ children, className = "", padding = true }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 ${padding ? "p-6" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
