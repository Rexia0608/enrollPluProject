// routes/MaintenanceGuard.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMaintenance } from "../context/MaintenanceContext";
import { useAuth } from "../context/AuthContext";
import LoadingPage from "../pages/LoadingPage";

const MaintenanceGuard = () => {
  const { isMaintenanceMode, checkingStatus, canAccessDuringMaintenance } =
    useMaintenance();
  const { user } = useAuth();
  const location = useLocation();

  if (checkingStatus) {
    return <LoadingPage />;
  }

  // Not in maintenance mode - allow access to all protected routes
  if (!isMaintenanceMode) {
    return <Outlet />;
  }

  // In maintenance mode
  console.log("Maintenance mode active, checking access for:", user?.role);

  // If user is admin, allow access to all protected routes
  if (user && canAccessDuringMaintenance()) {
    return <Outlet />;
  }

  // If user is logged in but not admin, redirect to maintenance
  if (user) {
    return (
      <Navigate to="/maintenance" replace state={{ from: location.pathname }} />
    );
  }

  // If no user, redirect to login (they can login first, then will be redirected to maintenance)
  return <Navigate to="/login" replace state={{ from: location.pathname }} />;
};

export default MaintenanceGuard;
