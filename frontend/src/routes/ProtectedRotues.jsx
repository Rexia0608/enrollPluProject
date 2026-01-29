import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import LoadingPage from "../pages/LoadingPage";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const [delayDone, setDelayDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayDone(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Still checking auth OR delay not finished
  if (loading || !delayDone) {
    return (
      <>
        <LoadingPage />
      </>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
