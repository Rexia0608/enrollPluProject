// routes/MaintenanceGuard.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMaintenance } from "../context/MaintenanceContext";

const MaintenanceGuard = () => {
  const { isMaintenanceMode, checkingStatus, canAccessDuringMaintenance } =
    useMaintenance();
  const location = useLocation();

  // Show loading while checking maintenance status
  if (checkingStatus) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // PUBLIC PATHS - These should always be accessible during maintenance
  const publicPaths = [
    "/login",
    "/register",
    "/unauthorized",
    "/email-validation",
    "/maintenance",
  ];

  if (publicPaths.includes(location.pathname)) {
    return <Outlet />;
  }

  // If in maintenance mode
  if (isMaintenanceMode) {
    // Allow admin to bypass maintenance mode
    if (canAccessDuringMaintenance()) {
      return <Outlet />;
    }

    // Redirect non-admin users to maintenance page
    return <Navigate to="/maintenance" replace />;
  }

  // Not in maintenance mode, render the protected routes
  return <Outlet />;
};

export default MaintenanceGuard;
