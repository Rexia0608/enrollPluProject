import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const { user } = useAuth(); // Admin user
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch admin data when user is admin
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchAdminData = async () => {
      setLoading(true);

      try {
        // Example API calls
        const usersRes = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const usersData = await usersRes.json();
        setUsers(usersData);

        const auditRes = await fetch("/api/admin/audit-logs", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAuditLogs(await auditRes.json());

        const schedulesRes = await fetch("/api/admin/schedules", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setSchedules(await schedulesRes.json());

        const systemRes = await fetch("/api/admin/system-status", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setSystemStatus(await systemRes.json());
      } catch (err) {
        console.error("Admin data fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user]);

  // Reset on logout
  useEffect(() => {
    if (!user) {
      setUsers([]);
      setAuditLogs([]);
      setSchedules([]);
      setSystemStatus(null);
    }
  }, [user]);

  // Functions to mutate data
  const refreshUsers = async () => {
    if (!user) return;
    const res = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setUsers(await res.json());
  };

  return (
    <AdminContext.Provider
      value={{
        users,
        auditLogs,
        schedules,
        systemStatus,
        loading,
        refreshUsers,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
