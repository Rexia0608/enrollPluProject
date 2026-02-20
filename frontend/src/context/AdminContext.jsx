import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const AdminContext = createContext(null);
const API_BASE_URL_COURSE = "http://localhost:3000/admin/courseList";
const API_BASE_URL_USER = "http://localhost:3000/admin/usersList";
const API_BASE_URL_OVERVIEW = "http://localhost:3000/admin/overView";

export const AdminProvider = ({ children }) => {
  const { user } = useAuth(); // Admin user
  const [initialCourses, setInitialCourses] = useState([]);
  const [userList, setUserList] = useState([]);
  const [overView, setOverView] = useState([]);
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
        const [initialCoursesRes, userListRes, overViewRes] = await Promise.all(
          [
            axios.get(API_BASE_URL_COURSE, getAuthHeaders()),
            axios.get(API_BASE_URL_USER, getAuthHeaders()),
            axios.get(API_BASE_URL_OVERVIEW, getAuthHeaders()),
          ],
        );

        setInitialCourses(initialCoursesRes.data);
        setUserList(userListRes.data);
        setOverView(overViewRes.data);
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
      setUserList([]);
      setOverView([]);
    }
  }, [user]);

  // Functions to mutate data
  const refreshUsers = async () => {
    if (!user) return;
    try {
      const res = await axios.get(API_BASE_URL_USER, getAuthHeaders());
      setUserList(res.data);
    } catch (err) {
      console.error(
        "Error refreshing users",
        err.response?.data || err.message || err,
      );
    }
  };

  return (
    <AdminContext.Provider
      value={{
        initialCourses,
        userList,
        loading,
        overView,
        refreshUsers,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
