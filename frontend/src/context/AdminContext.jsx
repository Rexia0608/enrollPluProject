import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const AdminContext = createContext(null);
const API_BASE_URL_COURSE = "http://localhost:3000/admin/courseList";

export const AdminProvider = ({ children }) => {
  const { user } = useAuth(); // Admin user
  const [initialCourses, setInitialCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create axios instance with auth header
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${user?.token}` },
  });

  // Fetch admin data when user is admin
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchAdminData = async () => {
      setLoading(true);

      try {
        const [initialCoursesRes] = await Promise.all([
          axios.get(API_BASE_URL_COURSE, getAuthHeaders()),
        ]);

        setInitialCourses(initialCoursesRes.data.items);
      } catch (err) {
        console.error(
          "Admin data fetch error",
          err.response?.data || err.message || err,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user]);

  // Reset on logout
  useEffect(() => {
    if (!user) {
      setInitialCourses([]);
    }
  }, [user]);

  return (
    <AdminContext.Provider
      value={{
        initialCourses,
        loading,
        getAuthHeaders,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
