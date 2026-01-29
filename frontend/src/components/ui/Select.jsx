// components/ui/Select.jsx
import React from "react";
import { ChevronDown } from "lucide-react";

function Select({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  helperText,
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
        <select
          value={value}
          onChange={onChange}
          className={`
            w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
            appearance-none pr-10
            ${error ? "border-red-300" : "border-gray-300"}
          `}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

export default Select;
