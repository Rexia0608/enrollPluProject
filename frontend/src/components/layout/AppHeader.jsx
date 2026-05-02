// components/layout/AppHeader.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  User,
  LogOut,
  Bell,
  Settings,
  ChevronDown,
  Home,
  Shield,
  GraduationCap,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const AppHeader = ({ title, onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleConfig = () => {
    const configs = {
      admin: {
        color: "bg-red-500",
        icon: <Shield className="w-4 h-4" />,
        badge: "Admin",
        label: "Administrator",
      },
      faculty: {
        color: "bg-green-500",
        icon: <GraduationCap className="w-4 h-4" />,
        badge: "Faculty",
        label: "Faculty Member",
      },
      student: {
        color: "bg-blue-500",
        icon: <User className="w-4 h-4" />,
        badge: "Student",
        label: "Student",
      },
    };

    return configs[user?.role] || configs.student;
  };

  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter((path) => path);

    return paths.map((path, index) => ({
      name: path.charAt(0).toUpperCase() + path.slice(1),
      path: "/" + paths.slice(0, index + 1).join("/"),
      isLast: index === paths.length - 1,
    }));
  };

  const handleLogout = () => {
    try {
      logout();
      // Clear any local storage/session data if needed
      localStorage.clear(); // Optional: clear all local storage
      sessionStorage.clear(); // Optional: clear all session storage

      // Force a full page reload to login
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback navigation if logout fails
      navigate("/login");
    }
  };

  const roleConfig = getRoleConfig();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            {/* Logo/Branding */}
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-xl ${roleConfig.color} flex items-center justify-center shadow-md text-white`}
              >
                {roleConfig.icon}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                <div className="flex items-center space-x-1 text-sm">
                  <Home className="w-3 h-3 text-gray-500" />
                  {getBreadcrumbs().map((crumb, index) => (
                    <React.Fragment key={crumb.path}>
                      <span
                        onClick={() => !crumb.isLast && navigate(crumb.path)}
                        className={`${crumb.isLast ? "text-gray-500" : "text-gray-700 hover:text-blue-600 cursor-pointer"}`}
                      >
                        {crumb.name}
                      </span>
                      {index < getBreadcrumbs().length - 1 && (
                        <span className="text-gray-400">/</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-3">
            {/* Help */}
            <button
              onClick={() => navigate("/student/dashboard/support")}
              className="hidden sm:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Help"
            >
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="User menu"
              >
                <div className="relative">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${roleConfig.color} text-white font-semibold`}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() ||
                      user?.email?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <div
                      className={`w-3 h-3 ${roleConfig.color} rounded-full`}
                    ></div>
                  </div>
                </div>

                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || user?.email?.split("@")[0]}
                  </p>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-600 capitalize">
                      {roleConfig.label}
                    </span>
                  </div>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="font-semibold text-gray-900">
                      {user?.name || "User"}
                    </p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    <div className="flex items-center mt-2">
                      <span
                        className={`px-2 py-1 text-xs ${roleConfig.color} text-white rounded-full`}
                      >
                        {roleConfig.badge}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => navigate("/student/dashboard/profile")}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => navigate("/student/dashboard/settings")}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                  </div>

                  <div className="border-t border-gray-200 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
