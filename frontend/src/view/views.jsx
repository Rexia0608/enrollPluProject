import { Routes, Route, Navigate } from "react-router-dom";

import AdminDashboard from "../pages/AdminDashboard";
import FacultyDashboard from "../pages/FacultyDashboard";
import StudentDashboard from "../pages/StudentDashboard";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFound from "../pages/NotFound";
import MaintenancePage from "../pages/MaintenancePage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import EmailValidationPage from "../pages/EmailValidationPage";

import ProtectedRoute from "../routes/ProtectedRotues";

const Views = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/email-validation" element={<EmailValidationPage />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={["admin"]} />}
        >
          <Route path="dashboard/*" element={<AdminDashboard />} />
        </Route>

        {/* ================= FACULTY ================= */}
        <Route
          path="/faculty"
          element={<ProtectedRoute allowedRoles={["faculty", "admin"]} />}
        >
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

        {/* ================= DEFAULT ================= */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default Views;
