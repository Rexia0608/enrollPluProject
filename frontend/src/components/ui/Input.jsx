// components/ui/Input.jsx
import React from "react";

function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  helperText,
  icon: Icon,
  className = "",
  ...props
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Icon className="w-5 h-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${Icon ? "pl-10" : "pl-3"}
            ${error ? "border-red-300" : "border-gray-300"}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

export default Input;
