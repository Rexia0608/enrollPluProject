// components/layout/MobileNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ScanQrCode,
  Calendar,
  BookOpen,
  Settings,
  FileText,
  CreditCard,
  Clock,
  HelpCircle,
} from "lucide-react";

function MobileNav({ role }) {
  const getNavItems = () => {
    switch (role) {
      case "admin":
        return [
          {
            to: "/admin/dashboard",
            icon: LayoutDashboard,
            label: "Overview",
            exact: true,
          },
          {
            to: "/admin/dashboard/enrollment",
            icon: Calendar,
            label: "Enrollment Control",
          },
          {
            to: "/admin/dashboard/users",
            icon: Users,
            label: "User Management",
          },
          {
            to: "/admin/dashboard/course",
            icon: BookOpen,
            label: "Courses Management",
          },
          { to: "/admin/dashboard/schedule", icon: Clock, label: "Schedules" },
        ];
      case "faculty":
        return [
          {
            to: "/faculty/dashboard",
            icon: LayoutDashboard,
            label: "Dashboard",
            exact: true,
          },
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
            to: "/faculty/dashboard/scanner",
            icon: ScanQrCode,
            label: "Qr Scanner",
          },
        ];
      case "student":
        return [
          { to: "/student/dashboard", icon: Home, label: "Status" },
          {
            to: "/student/dashboard/enrollment",
            icon: FileText,
            label: "enrollment",
          },
          {
            to: "/student/dashboard/payments",
            icon: CreditCard,
            label: "Payments",
          },
          { to: "/student/dashboard/support", icon: HelpCircle, label: "Help" },
          { to: "/student/settings", icon: Settings, label: "Settings" },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around items-center px-2 py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default MobileNav;
