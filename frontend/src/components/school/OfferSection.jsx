import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Target,
  BookOpen,
  Briefcase,
  Cpu,
  Wrench,
  Zap,
  Clock,
  DollarSign,
} from "lucide-react";
import Card from "../ui/Card";

const OfferSection = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // More robust icon mapping (by course_code or name keywords)
  const getCourseIcon = (courseCode, courseName) => {
    const code = courseCode?.toLowerCase() || "";
    const name = courseName?.toLowerCase() || "";

    if (code.includes("cs") || name.includes("computer science")) return Cpu;
    if (code.includes("it") || name.includes("information technology"))
      return GraduationCap;
    if (code.includes("eng") || name.includes("english")) return BookOpen;
    if (name.includes("electronics")) return Zap;
    if (name.includes("automotive")) return Wrench;
    return Briefcase;
  };

  // Format tuition fee as USD
  const formatTuition = (fee) => {
    const num = parseFloat(fee);
    if (isNaN(num)) return fee;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(num);
  };

  // Status badge style
  const getStatusBadge = (status) => {
    const isActive = status?.toLowerCase() === "active";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
        }`}
      >
        {isActive ? "Active" : status}
      </span>
    );
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/student/course-list`,
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load programs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Skeleton loader
  if (loading) {
    return (
      <section id="programs" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-4 w-full max-w-2xl bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="programs" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="programs" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What We Offer
          </h2>
          <p className="text-gray-600 text-lg">
            LSTC delivers industry-relevant programs designed to equip students
            with practical skills and real-world knowledge. Our hands-on
            training and values formation ensure graduates are workforce-ready.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => {
            const Icon = getCourseIcon(course.course_code, course.course_name);
            return (
              <Card
                key={course.id}
                className="group hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex flex-col h-full">
                  {/* Icon + Title */}
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="bg-blue-50 rounded-xl p-3 mb-4 group-hover:bg-blue-100 transition">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-1">
                      {course.course_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {course.course_code}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration_type}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium">
                        {formatTuition(course.tuition_fee)}
                      </span>
                    </div>
                    <div className="flex justify-center">
                      {getStatusBadge(course.course_status)}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto pt-2">
                    <button className="w-full py-2 px-4 bg-white border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-600 hover:text-white transition-colors">
                      Learn More →
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Optional: Show if no courses */}
        {courses.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No programs available at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default OfferSection;
