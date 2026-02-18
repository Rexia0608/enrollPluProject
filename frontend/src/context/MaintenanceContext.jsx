// context/MaintenanceContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const MaintenanceContext = createContext(null);
const BASE_URL_MAINTENANCE = "http://localhost:3000/admin/maintenance";

export const MaintenanceProvider = ({ children }) => {
  const { user } = useAuth();
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    "System is undergoing scheduled maintenance. We expect to be back online shortly.",
  );
  const [checkingStatus, setCheckingStatus] = useState(true);

  const checkMaintenanceStatus = async () => {
    try {
      const response = await axios.get(`${BASE_URL_MAINTENANCE}`, {
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
      });

      // If your API returns an object with isActive property
      if (response.data && typeof response.data === "object") {
        setIsMaintenanceMode(response.data.isActive === true);
        setMaintenanceMessage(response.data.message || maintenanceMessage);
      }
      // If your API returns a boolean directly
      else if (typeof response.data === "boolean") {
        setIsMaintenanceMode(response.data);
      }
      // If your API returns { data: { isActive: boolean } } structure
      else if (response.data?.data?.isActive !== undefined) {
        setIsMaintenanceMode(response.data.data.isActive);
        setMaintenanceMessage(response.data.data.message || maintenanceMessage);
      }
    } catch (error) {
      console.error("Error checking maintenance status:", error);
      setIsMaintenanceMode(false);
    } finally {
      setCheckingStatus(false);
    }
  };

  const canAccessDuringMaintenance = () => {
    return user?.role === "admin";
  };

  useEffect(() => {
    checkMaintenanceStatus();

    const interval = setInterval(checkMaintenanceStatus, 30000);
    return () => clearInterval(interval);
  }, [user?.token]);

  return (
    <MaintenanceContext.Provider
      value={{
        isMaintenanceMode,
        maintenanceMessage,
        checkingStatus,
        canAccessDuringMaintenance,
        refreshStatus: checkMaintenanceStatus,
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
