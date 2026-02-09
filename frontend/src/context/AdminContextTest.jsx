import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const AdminContextTest = createContext(null);
const GET_USER_API = "http://localhost:3000/admin/usersList"; // Your backend endpoint

export const AdminProviderTest = ({ children }) => {
  const { user } = useAuth(); // Admin user
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users when logged in as admin
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(GET_USER_API, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setUsersList(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  // Reset users on logout
  useEffect(() => {
    if (!user) setUsersList([]);
  }, [user]);

  // Refresh function
  const refreshUsers = async () => {
    if (!user) return;

    try {
      const res = await axios.get(GET_USER_API, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsersList(res.data);
    } catch (err) {
      console.error("Error refreshing users:", err);
    }
  };

  return (
    <AdminContextTest.Provider
      value={{
        users: usersList, // ✅ corrected from 'users'
        loading,
        refreshUsers,
      }}
    >
      {children}
    </AdminContextTest.Provider>
  );
};

export const useAdminTest = () => useContext(AdminContextTest);
