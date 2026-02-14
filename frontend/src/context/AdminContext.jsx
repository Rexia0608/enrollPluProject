import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

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

  // Fetch admin data when user is admin
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchAdminData = async () => {
      setLoading(true);

      try {
        const initialCoursesRes = await fetch(`${API_BASE_URL_COURSE}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const initialCoursesData = await initialCoursesRes.json();
        setInitialCourses(initialCoursesData);

        const userListRes = await fetch(`${API_BASE_URL_USER}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const userListResData = await userListRes.json();
        setUserList(userListResData);

        const overViewRes = await fetch(`${API_BASE_URL_OVERVIEW}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const overViewData = await overViewRes.json();
        setOverView(overViewData);
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
      setInitialCourses([]);
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
