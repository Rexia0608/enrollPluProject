// pages/AdminDashboard.jsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AppHeader from "../components/layout/AppHeader";
import Sidebar from "../components/layout/Sidebar";
import MobileNav from "../components/layout/MobileNav";
import DashboardContainer from "../components/layout/DashboardContainer";
import AdminOverview from "../components/admin/AdminOverview";
import EnrollmentControl from "../components/admin/EnrollmentControl";
import CourseManagement from "../components/admin/CourseManagement";
import MaintenanceModeCard from "../components/admin/MaintenanceModeCard";
import EnrollmentControlCard from "../components/admin/EnrollmentControlCard";
import RecentActivityCard from "../components/admin/RecentActivityCard";
import UserManagement from "../components/admin/UserManagement";
import NotFound from "./NotFound";

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        title="EnrollPlus"
        role="admin"
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <Sidebar role="admin" isOpen={sidebarOpen} />

        <main className="flex-1 pb-16 md:pb-0">
          <DashboardContainer>
            <Routes>
              <Route index element={<AdminOverview />} />
              <Route path="enrollment" element={<EnrollmentControl />} />
              <Route path="course" element={<CourseManagement />} />
              <Route path="schedule" element={<EnrollmentControlCard />} />
              <Route path="activity" element={<RecentActivityCard />} />
              <Route path="maintenance" element={<MaintenanceModeCard />} />
              <Route path="users" element={<UserManagement />} />

              {/* 404 response when someone crawiling it will catch here */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DashboardContainer>
        </main>
      </div>

      <MobileNav role="admin" />
    </div>
  );
}

export default AdminDashboard;
