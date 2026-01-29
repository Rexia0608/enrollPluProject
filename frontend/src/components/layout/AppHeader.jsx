// components/layout/AppHeader.jsx
import React from "react";
import { Bell, Menu, Search, User, EyeIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { NavLink } from "react-router-dom";
import { button } from "framer-motion/client";

function AppHeader({ title, role, onMenuClick }) {
  const { user } = useAuth();
  const isStaff = ["admin", "faculty"].includes(user.role);

  const getRoleColor = () => {
    switch (role) {
      case "admin":
        return "bg-gray-500";
      case "faculty":
        return "bg-green-600";
      case "student":
        return "bg-blue-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-lg ${getRoleColor()} flex items-center justify-center`}
            >
              <span className="text-white font-semibold text-sm">
                {role.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600 capitalize">
                {role} Dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div
            className={`hidden md:flex items-center space-x-2 py-1 px-2 ${getRoleColor()} rounded-lg hover:bg-gray-300 cursor-pointer`}
          >
            <User className="w-6 h-8 text-gray-50" />
            <div className="block text-center text-gray-50">
              <h3 className="text-sm font-light">
                {isStaff ? "View as" : user.name}
              </h3>

              {user?.role && (
                <p className="text-sm font-extralight capitalize">
                  {user.role}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
