import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import LoadingPage from "../pages/LoadingPage";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [delayDone, setDelayDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDelayDone(true), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !delayDone) {
    return <LoadingPage />;
  }

  // 🔴 Not logged in → login (replace history)
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // 🔴 Logged in but unauthorized → stay here (replace history)
  if (
    allowedRoles.length > 0 &&
    (!user.role || !allowedRoles.includes(user.role))
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
