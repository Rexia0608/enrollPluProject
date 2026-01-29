// pages/FacultyDashboard.jsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AppHeader from "../components/layout/AppHeader";
import Sidebar from "../components/layout/Sidebar";
import MobileNav from "../components/layout/MobileNav";
import DashboardContainer from "../components/layout/DashboardContainer";
import FacultyOverview from "../components/faculty/FacultyOverview";
import DocumentReview from "../components/faculty/DocumentReview";
import PaymentValidation from "../components/faculty/PaymentValidation";
import StudentDetails from "../components/faculty/StudentDetails";
import NotFound from "./NotFound";

function FacultyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        title="EnrollPlus"
        role="faculty"
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <Sidebar role="faculty" isOpen={sidebarOpen} />

        <main className="flex-1 pb-16 md:pb-0">
          <DashboardContainer>
            <Routes>
              <Route index element={<FacultyOverview />} />
              <Route path="documents" element={<DocumentReview />} />
              <Route path="payments" element={<PaymentValidation />} />
              <Route path="students" element={<StudentDetails />} />
              {/* Add more faculty routes as needed */}

              {/* 404 response when someone crawiling it will catch here */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DashboardContainer>
        </main>
      </div>

      <MobileNav role="faculty" />
    </div>
  );
}

export default FacultyDashboard;
