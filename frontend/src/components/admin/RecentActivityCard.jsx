// components/admin/EnrollmentDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Wallet,
  UserCheck,
  BookOpen,
} from "lucide-react";
import Card from "../ui/Card";

// ============================================
// MOCK DATA (based on actual schema)
// ============================================

// 1. ENROLLMENT TREND: enrollees per academic year/semester
const mockEnrollmentTrend = [
  { year_semester: "2023-2024 First Sem", enrollees: 145 },
  { year_semester: "2023-2024 Second Sem", enrollees: 162 },
  { year_semester: "2024-2025 First Sem", enrollees: 198 }, // current open
  { year_semester: "2024-2025 Second Sem", enrollees: 0 }, // future
];

// 2. INCOME OVERVIEW: paid_amount per period (current open semester only)
const mockIncomeOverview = [
  { period: "enrollment", amount: 125000 },
  { period: "prelim", amount: 98000 },
  { period: "mid-term", amount: 112000 },
  { period: "pre-final", amount: 87000 },
  { period: "final", amount: 65000 },
];

// 3. PAYMENT PROGRESS (current open semester)
const mockPaymentProgress = {
  total_paid: 487000,
  total_expected: 600000,
  percentage: 81.2,
};

// 4. ENROLLMENT FUNNEL (counts per status)
const mockEnrollmentFunnel = [
  { status: "documents_pending", count: 45 },
  { status: "payment_pending", count: 38 },
  { status: "enrolled", count: 198 },
];

// 5. TOP COURSES (most enrollments in current semester)
const mockTopCourses = [
  { course_code: "CS101", course_name: "Computer Science", enrollees: 87 },
  {
    course_code: "IT101",
    course_name: "Information Technology",
    enrollees: 64,
  },
  { course_code: "ENG101", course_name: "English", enrollees: 32 },
];

// ============================================
// MAIN COMPONENT
// ============================================
const EnrollmentDashboard = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Colors for pie chart
  const COLORS = ["#F59E0B", "#3B82F6", "#10B981"];

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Enrollment Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time overview of enrollment and payments
          </p>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Current: 2024-2025 First Semester (Open)
        </div>
      </div>

      {/* Row 1: Two Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend Graph */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Enrollment Trend
            </h3>
            <p className="text-gray-600">
              Enrollees per academic year / semester
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockEnrollmentTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year_semester"
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="enrollees" fill="#3B82F6" name="Enrollees" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Income Overview Graph */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Income Overview
            </h3>
            <p className="text-gray-600">
              Paid amounts per period (current open semester)
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockIncomeOverview}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis tickFormatter={(value) => `₱${value / 1000}k`} />
              <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="amount" fill="#10B981" name="Paid Amount" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 2: Payment Progress + Enrollment Funnel + Top Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Collection Progress */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-indigo-600" />
              Payment Progress
            </h3>
            <p className="text-gray-600">Current semester collection</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Collected:</span>
              <span className="font-semibold text-gray-900">
                ₱{mockPaymentProgress.total_paid.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Expected:</span>
              <span className="font-semibold text-gray-900">
                ₱{mockPaymentProgress.total_expected.toLocaleString()}
              </span>
            </div>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${mockPaymentProgress.percentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                ></div>
              </div>
              <div className="text-right text-sm text-gray-600 mt-1">
                {mockPaymentProgress.percentage}% complete
              </div>
            </div>
          </div>
        </Card>

        {/* Enrollment Funnel */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-600" />
              Enrollment Funnel
            </h3>
            <p className="text-gray-600">Documents → Payment → Enrolled</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={mockEnrollmentFunnel}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={70}
                fill="#8884d8"
                dataKey="count"
                nameKey="status"
                label={({ status, count }) =>
                  `${status.replace("_", " ")}: ${count}`
                }
              >
                {mockEnrollmentFunnel.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Courses */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-600" />
              Top Courses
            </h3>
            <p className="text-gray-600">Most enrollments (current semester)</p>
          </div>
          <div className="space-y-3">
            {mockTopCourses.map((course) => (
              <div
                key={course.course_code}
                className="flex justify-between items-center"
              >
                <div>
                  <span className="font-medium text-gray-900">
                    {course.course_code}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {course.course_name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {course.enrollees} students
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Optional: Summary footer */}
      <div className="text-xs text-gray-400 text-center mt-4">
        Data refreshed from current open academic year (enrollment_open = true)
      </div>
    </div>
  );
};

export default EnrollmentDashboard;
