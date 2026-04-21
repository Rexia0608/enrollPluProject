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
import axios from "axios";

const ActivityCard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for API data
  const [enrollmentTrend, setEnrollmentTrend] = useState([]);
  const [incomeOverview, setIncomeOverview] = useState([]);
  const [paymentProgress, setPaymentProgress] = useState({
    total_paid: 0,
    total_expected: 0,
    percentage: 0,
  });
  const [enrollmentFunnel, setEnrollmentFunnel] = useState([]);
  const [topCourses, setTopCourses] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all APIs in parallel
        const [
          enrollmentTrendRes,
          incomeOverviewRes,
          paymentProgressRes,
          enrollmentFunnelRes,
          topCoursesRes,
        ] = await Promise.all([
          axios.get("http://localhost:3000/admin/enrollmentTrend"),
          axios.get("http://localhost:3000/admin/incomeOverview"),
          axios.get("http://localhost:3000/admin/paymentProgress"),
          axios.get("http://localhost:3000/admin/enrollmentFunnel"),
          axios.get("http://localhost:3000/admin/topCourses"),
        ]);

        // 1. Process Enrollment Trend
        if (enrollmentTrendRes.data.success && enrollmentTrendRes.data.items) {
          const trendData = enrollmentTrendRes.data.items.map((item) => ({
            year_semester: `${item.year_series} ${item.semester}`,
            enrollees: parseInt(item.total_enrollees) || 0,
          }));
          setEnrollmentTrend(trendData);
        }

        // 2. Process Income Overview
        if (incomeOverviewRes.data.success && incomeOverviewRes.data.items) {
          const incomeData = incomeOverviewRes.data.items.map((item) => ({
            period: item.period,
            amount: parseFloat(item.amount) || 0,
          }));
          setIncomeOverview(incomeData);
        }

        // 3. Process Payment Progress
        if (
          paymentProgressRes.data.success &&
          paymentProgressRes.data.items?.length > 0
        ) {
          const progress = paymentProgressRes.data.items[0];
          setPaymentProgress({
            total_paid: parseFloat(progress.total_paid) || 0,
            total_expected: parseFloat(progress.total_expected) || 0,
            percentage: parseFloat(progress.progress_percentage) || 0,
          });
        }

        // 4. Process Enrollment Funnel
        if (
          enrollmentFunnelRes.data.success &&
          enrollmentFunnelRes.data.items
        ) {
          const funnelData = enrollmentFunnelRes.data.items.map((item) => ({
            status: item.stage,
            count: parseInt(item.total) || 0,
          }));
          setEnrollmentFunnel(funnelData);
        }

        // 5. Process Top Courses
        if (topCoursesRes.data.success && topCoursesRes.data.items) {
          const coursesData = topCoursesRes.data.items.map((item) => ({
            course_name: item.course_name,
            enrollees: parseInt(item.total_enrollees) || 0,
          }));
          setTopCourses(coursesData);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Unable to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Colors for pie chart
  const COLORS = ["#F59E0B", "#3B82F6", "#10B981", "#8B5CF6", "#EC4899"];

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

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error</p>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          {enrollmentTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentTrend}>
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
          ) : (
            <div className="flex items-center justify-center h-72 text-gray-500">
              No enrollment trend data available
            </div>
          )}
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
          {incomeOverview.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeOverview}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(value) => `₱${value / 1000}k`} />
                <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="amount" fill="#10B981" name="Paid Amount" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-72 text-gray-500">
              No income data available
            </div>
          )}
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
                ₱{paymentProgress.total_paid.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Expected:</span>
              <span className="font-semibold text-gray-900">
                ₱{paymentProgress.total_expected.toLocaleString()}
              </span>
            </div>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${paymentProgress.percentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                ></div>
              </div>
              <div className="text-right text-sm text-gray-600 mt-1">
                {paymentProgress.percentage}% complete
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
          {enrollmentFunnel.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={enrollmentFunnel}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {enrollmentFunnel.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              No funnel data available
            </div>
          )}
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
          {topCourses.length > 0 ? (
            <div className="space-y-3">
              {topCourses.map((course, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">
                      {course.course_name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {course.enrollees} students
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500">
              No course data available
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ActivityCard;
