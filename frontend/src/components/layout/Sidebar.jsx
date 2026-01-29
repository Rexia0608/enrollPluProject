// components/layout/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  Settings,
  FileText,
  CreditCard,
  Clock,
  Shield,
  BarChart,
  Bell,
  HelpCircle, // Added HelpCircle
} from "lucide-react";

function Sidebar({ role, isOpen = true }) {
  const adminItems = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
    {
      to: "/admin/dashboard/enrollment",
      icon: Calendar,
      label: "Enrollment Control",
    },
    { to: "/admin/dashboard/users", icon: Users, label: "User Management" },
    {
      to: "/admin/dashboard/course",
      icon: BookOpen,
      label: "Courses Management",
    },
    { to: "/admin/dashboard/schedule", icon: Clock, label: "Schedules" },
    { to: "/admin/dashboard/maintenance", icon: Shield, label: "Maintenance" },
    { to: "/admin/dashboard/activity", icon: BarChart, label: "Activity Log" },
  ];

  const facultyItems = [
    { to: "/faculty/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    {
      to: "/faculty/dashboard/documents",
      icon: FileText,
      label: "Document Review",
    },
    {
      to: "/faculty/dashboard/payments",
      icon: CreditCard,
      label: "Payment Validation",
    },
    {
      to: "/faculty/dashboard/students",
      icon: Users,
      label: "Student Details",
    },
    {
      to: "/faculty/dashboard/notifications",
      icon: Bell,
      label: "Notifications",
    },
  ];

  const studentItems = [
    { to: "/student/dashboard", icon: LayoutDashboard, label: "Status" },
    { to: "/student/dashboard/documents", icon: FileText, label: "Documents" },
    { to: "/student/dashboard/payments", icon: CreditCard, label: "Payments" },
    {
      to: "/student/dashboard/notifications",
      icon: Bell,
      label: "Notifications",
    },
    { to: "/student/dashboard/support", icon: HelpCircle, label: "Help" },
  ];

  const getItems = () => {
    switch (role) {
      case "admin":
        return adminItems;
      case "faculty":
        return facultyItems;
      case "student":
        return studentItems;
      default:
        return [];
    }
  };

  const items = getItems();

  return (
    <aside
      className={`${isOpen ? "w-64" : "w-0"} hidden md:block transition-all duration-200`}
    >
      <div className="h-full bg-white border-r border-gray-200 px-4 py-6">
        <nav className="space-y-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200">
          <NavLink
            to={`/${role}/settings`}
            className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
