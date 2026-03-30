// context/FacultyContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const FacultyContext = createContext(null);

export const FacultyProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  const [facultyProfile, setFacultyProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${user?.token}` },
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== "faculty") {
      setFacultyProfile(null);
      setLoading(false);
      return;
    }

    const mockProfile = {
      id: user.id,
      name: user.name || "Faculty Member",
      email: user.email,
      role: "faculty",
    };

    setFacultyProfile(mockProfile);
    setLoading(false);
  }, [user, authLoading]);

  return (
    <FacultyContext.Provider
      value={{
        facultyProfile,
        loading,
        getAuthHeaders,
      }}
    >
      {children}
    </FacultyContext.Provider>
  );
};

export const useFaculty = () => {
  const context = useContext(FacultyContext);
  if (!context) {
    throw new Error("useFaculty must be used within a FacultyProvider");
  }
  return context;
};
