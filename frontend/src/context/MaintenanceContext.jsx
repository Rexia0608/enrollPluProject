// context/MaintenanceContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const MaintenanceContext = createContext(null);

export const MaintenanceProvider = ({ children }) => {
  const { user } = useAuth();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const checkMaintenanceStatus = async () => {
    try {
      // API returns true or false directly
      const response = await axios.get(
        "http://localhost:3000/admin/maintenance",
      );
      setIsMaintenanceMode(response.data);
    } catch (error) {
      console.error("Error checking maintenance status:", error);
      setIsMaintenanceMode(false);
    } finally {
      setCheckingStatus(false);
    }
  };

  // Only admin can access during maintenance
  const canAccessDuringMaintenance = () => {
    return user?.role === "admin";
  };

  useEffect(() => {
    checkMaintenanceStatus();
    const interval = setInterval(checkMaintenanceStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MaintenanceContext.Provider
      value={{
        isMaintenanceMode,
        checkingStatus,
        canAccessDuringMaintenance,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => useContext(MaintenanceContext);
