import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingPage from "../pages/LoadingPage";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for auth resolution
  if (loading) {
    return <LoadingPage />;
  }

  // 🔴 Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔴 Logged in but role not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // ✅ Authorized
  return <Outlet />;
};

export default ProtectedRoute;
