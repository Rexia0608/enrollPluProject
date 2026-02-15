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
        {
          headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
        },
      );
      console.log(response);
      setIsMaintenanceMode(response.data);
    } catch (error) {
      console.error("Error checking maintenance status:", error);
      // If error, assume maintenance mode is false
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

    // Poll for updates every 30 seconds
    const interval = setInterval(checkMaintenanceStatus, 30000);

    return () => clearInterval(interval);
  }, [user?.token]); // Add dependency on user token

  return (
    <MaintenanceContext.Provider
      value={{
        isMaintenanceMode,
        checkingStatus,
        canAccessDuringMaintenance,
        refreshStatus: checkMaintenanceStatus, // Expose this to manually refresh
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error("useMaintenance must be used within a MaintenanceProvider");
  }
  return context;
};
