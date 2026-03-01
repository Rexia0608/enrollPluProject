import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const StudentContext = createContext(null);
const API_BASE_URL_COURSE = "http://localhost:3000/student/course-list";
const API_URL_ENROLLMENT_OPEN =
  "http://localhost:3000/student/enrollment-open-status";

export const StudentProvider = ({ children }) => {
  const { user } = useAuth();
  const [initialCourses, setInitialCourses] = useState([]);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${user?.token}` },
  });

  useEffect(() => {
    if (!user || user.role !== "student") return;

    const fetchStudentData = async () => {
      setLoading(true);
      setError(null); // Clear previous errors

      try {
        // Parallel fetching for better performance
        const [coursesRes, enrollmentRes] = await Promise.all([
          axios.get(API_BASE_URL_COURSE, getAuthHeaders()),
          axios.get(API_URL_ENROLLMENT_OPEN, getAuthHeaders()),
        ]);

        // Validate and set courses (handle duplicates if needed)
        const courses = Array.isArray(coursesRes.data) ? coursesRes.data : [];
        setInitialCourses(courses);

        // Validate enrollment status (object with AcademicYear array)
        const enrollment = enrollmentRes.data?.AcademicYear?.[0] || null;
        setEnrollmentStatus(enrollment);
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || err.message || "Failed to fetch data";
        setError(errorMsg);
        console.error("Student data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setInitialCourses([]);
      setEnrollmentStatus(null); // Consistent: use null not undefined
      setError(null);
    }
  }, [user]);

  // Computed values for easier consumption
  const isEnrollmentOpen = enrollmentStatus?.enrollment_open ?? false;
  const academicYear = enrollmentStatus?.academic_year || null;
  const semester = enrollmentStatus?.semester || null;

  console.log(enrollmentStatus);

  return (
    <StudentContext.Provider
      value={{
        initialCourses,
        enrollmentStatus,
        loading,
        error,
        isEnrollmentOpen,
        academicYear,
        semester,
        getAuthHeaders,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

// Safer hook with error handling
export const useStudent = () => {
  const context = useContext(StudentContext);
  if (context === null) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
};
