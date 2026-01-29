// components/layout/MobileNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  CreditCard,
  Bell,
  Settings,
  BookOpen, // Add this
  BarChart, // Add this
} from "lucide-react";

function MobileNav({ role }) {
  const getNavItems = () => {
    switch (role) {
      case "admin":
        return [
          { to: "/admin", icon: Home, label: "Home" },
          { to: "/admin/users", icon: Users, label: "Users" },
          { to: "/admin/courses", icon: BookOpen, label: "Courses" },
          { to: "/admin/activity", icon: BarChart, label: "Activity" },
          { to: "/admin/settings", icon: Settings, label: "Settings" },
        ];
      case "faculty":
        return [
          { to: "/faculty", icon: Home, label: "Home" },
          { to: "/faculty/documents", icon: FileText, label: "Documents" },
          { to: "/faculty/payments", icon: CreditCard, label: "Payments" },
          { to: "/faculty/students", icon: Users, label: "Students" },
          { to: "/faculty/settings", icon: Settings, label: "Settings" },
        ];
      case "student":
        return [
          { to: "/student", icon: Home, label: "Status" },
          { to: "/student/documents", icon: FileText, label: "Documents" },
          { to: "/student/payments", icon: CreditCard, label: "Payments" },
          { to: "/student/notifications", icon: Bell, label: "Alerts" },
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
