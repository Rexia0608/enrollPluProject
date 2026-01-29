// components/ui/PrimaryButton.jsx
import React from "react";

function PrimaryButton({
  children,
  onClick,
  disabled = false,
  className = "",
  icon: Icon,
  size = "md",
}) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center rounded-lg font-medium
        bg-blue-600 text-white hover:bg-blue-700
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${sizeClasses[size]} ${className}
      `}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
}

export default PrimaryButton;
