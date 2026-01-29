// pages/StudentDashboard.jsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AppHeader from "../components/layout/AppHeader";
import Sidebar from "../components/layout/Sidebar";
import MobileNav from "../components/layout/MobileNav";
import DashboardContainer from "../components/layout/DashboardContainer";
import StudentStatus from "../components/student/StudentStatus";
import StudentDocuments from "../components/student/StudentDocuments";
import NotFound from "./NotFound";

function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        title="EnrollPlus"
        role="student"
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <Sidebar role="student" isOpen={sidebarOpen} />

        <main className="flex-1 pb-16 md:pb-0">
          <DashboardContainer>
            <Routes>
              <Route index element={<StudentStatus />} />
              <Route path="documents" element={<StudentDocuments />} />

              {/* 404 response when someone crawiling it will catch here */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DashboardContainer>
        </main>
      </div>

      <MobileNav role="student" />
    </div>
  );
}

export default StudentDashboard;
