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
  const [error, setError] = useState(null);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${user?.token}` },
  });

  useEffect(() => {
    if (!user || user.role !== "student") return;

    const fetchStudentData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [coursesRes, enrollmentRes] = await Promise.all([
          axios.get(API_BASE_URL_COURSE, getAuthHeaders()),
          axios.get(API_URL_ENROLLMENT_OPEN, getAuthHeaders()),
        ]);

        // Check the actual structure of courses response
        let courses = [];
        if (Array.isArray(coursesRes.data)) {
          courses = coursesRes.data;
        } else if (
          coursesRes.data?.data &&
          Array.isArray(coursesRes.data.data)
        ) {
          // If response is { data: [...] }
          courses = coursesRes.data.data;
        } else if (
          coursesRes.data?.courses &&
          Array.isArray(coursesRes.data.courses)
        ) {
          // If response is { courses: [...] }
          courses = coursesRes.data.courses;
        } else if (
          coursesRes.data?.Response &&
          Array.isArray(coursesRes.data.Response)
        ) {
          // If response has Response property (like your enrollment API)
          courses = coursesRes.data.Response;
        }

        setInitialCourses(courses);

        // FIXED: Access Response array correctly (capital R)
        // The API returns { message, Response: [...] }
        const enrollment = enrollmentRes.data?.Response?.[0] || null;
        setEnrollmentStatus(enrollment);
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || err.message || "Failed to fetch data";
        setError(errorMsg);
        console.error("Student data fetch error:", err);
        console.error("Error details:", {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setInitialCourses([]);
      setEnrollmentStatus(null);
      setError(null);
    }
  }, [user]);

  // Computed values for easier consumption
  const isEnrollmentOpen = enrollmentStatus?.enrollment_open ?? false;
  const academicYear = enrollmentStatus?.year_series || null;
  const semester = enrollmentStatus?.semester || null;

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
