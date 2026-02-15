// views/views.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import AdminDashboard from "../pages/AdminDashboard";
import FacultyDashboard from "../pages/FacultyDashboard";
import StudentDashboard from "../pages/StudentDashboard";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFound from "../pages/NotFound";
import MaintenancePage from "../pages/MaintenancePage";
import UnauthorizedPage from "../pages/UnAuthorizedPage";
import EmailValidationPage from "../pages/EmailValidationPage";

import ProtectedRoute from "../routes/ProtectedRoutes";
import PublicRoute from "../routes/PublicRoute";
import MaintenanceGuard from "../routes/MaintenanceGuard";

const Views = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Maintenance page - always accessible */}
        <Route path="/maintenance" element={<MaintenancePage />} />

        {/* PUBLIC ROUTES - These should bypass MaintenanceGuard */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Other public pages - also bypass MaintenanceGuard */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/email-validation" element={<EmailValidationPage />} />

        {/* PROTECTED ROUTES - These are wrapped with MaintenanceGuard */}
        <Route element={<MaintenanceGuard />}>
          {/* ================= ADMIN ================= */}
          <Route
            path="/admin"
            element={<ProtectedRoute allowedRoles={["admin"]} />}
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard/*" element={<AdminDashboard />} />
          </Route>

          {/* ================= FACULTY ================= */}
          <Route
            path="/faculty"
            element={<ProtectedRoute allowedRoles={["faculty", "admin"]} />}
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard/*" element={<FacultyDashboard />} />
          </Route>

          {/* ================= STUDENT ================= */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={["student", "admin", "faculty"]} />
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard/*" element={<StudentDashboard />} />
          </Route>
        </Route>

        {/* ================= DEFAULT ================= */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default Views;
