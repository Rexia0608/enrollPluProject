// components/faculty/MetricsTrendChart.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RefreshCw, Eye, EyeOff } from "lucide-react";

// ----------------------------------------------------------------------
// MOCK DATA – variable values (simulates real‑time changes)
// ----------------------------------------------------------------------
const generateMockData = () => {
  const baseDates = [
    "2026-04-12",
    "2026-04-13",
    "2026-04-14",
    "2026-04-15",
    "2026-04-16",
  ];
  return baseDates.map((date, idx) => ({
    date,
    pending_documents: 20 + Math.floor(Math.random() * 10) - idx, // trend down
    payment_validations: 10 + Math.floor(Math.random() * 8),
    reviewed_today: 15 + Math.floor(Math.random() * 15),
    avg_response_time: +(2 + Math.random() * 0.8).toFixed(1),
  }));
};

// ----------------------------------------------------------------------
// METRIC CONFIGURATION (color, label, yAxis domain hints, formatter)
// ----------------------------------------------------------------------
const METRICS = [
  {
    key: "pending_documents",
    label: "Pending Documents",
    color: "#F59E0B", // amber
    unit: "",
    domain: [0, 40],
  },
  {
    key: "payment_validations",
    label: "Payment Validations",
    color: "#3B82F6", // blue
    unit: "",
    domain: [0, 25],
  },
  {
    key: "reviewed_today",
    label: "Reviewed Today",
    color: "#10B981", // green
    unit: "",
    domain: [0, 35],
  },
  {
    key: "avg_response_time",
    label: "Avg. Response Time",
    color: "#8B5CF6", // purple
    unit: "h",
    domain: [0, 5],
  },
];

// ----------------------------------------------------------------------
// CUSTOM TOOLTIP – formats avg_response_time with 'h'
// ----------------------------------------------------------------------
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((entry, idx) => {
        const metric = METRICS.find((m) => m.key === entry.dataKey);
        const value =
          entry.dataKey === "avg_response_time"
            ? `${entry.value}h`
            : entry.value;
        return (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{metric?.label}:</span>
            <span className="font-medium text-gray-900">{value}</span>
          </div>
        );
      })}
    </div>
  );
};

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------
const MetricsTrendChart = () => {
  const [data, setData] = useState(generateMockData());
  const [visibleMetrics, setVisibleMetrics] = useState(
    METRICS.reduce((acc, m) => ({ ...acc, [m.key]: true }), {}),
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ----------------------------------------------------------------------
  // SIMULATE REAL‑TIME UPDATES (optional)
  // ----------------------------------------------------------------------
  useEffect(() => {
    // API Placeholder:
    // TODO: GET /api/faculty/dashboard/metrics-trend
    // Expected response format: array of { date, pending_documents, payment_validations, reviewed_today, avg_response_time }

    const interval = setInterval(() => {
      // Simulate new data every 10 seconds (can be disabled by commenting)
      const newData = generateMockData();
      setData(newData);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // ----------------------------------------------------------------------
  // MANUAL REFRESH (simulate API call)
  // ----------------------------------------------------------------------
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate async fetch delay
    setTimeout(() => {
      setData(generateMockData());
      setIsRefreshing(false);
    }, 600);
    // Real implementation would look like:
    // const res = await fetch('/api/faculty/dashboard/metrics-trend');
    // const newData = await res.json();
    // setData(newData);
  }, []);

  const toggleMetric = (key) => {
    setVisibleMetrics((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Normalise Y‑axis domains per metric? Here we keep separate Y axes?
  // Simpler: use a single Y axis with reasonable domain based on max possible values.
  // Since metrics have different scales, we'll use a unified Y axis from 0 to 40
  // but avg_response_time (max ~5) will look flat. For better readability, we could use
  // dual Y axis or normalise. The requirement says "normalize values if needed" –
  // we'll implement a secondary Y axis for avg_response_time to keep lines visible.

  // For simplicity and readability, we'll create two Y axes:
  // Left Y axis: count metrics (0-40)
  // Right Y axis: avg_response_time (0-5)
  // This makes all trends visible.

  const leftAxisMetrics = [
    "pending_documents",
    "payment_validations",
    "reviewed_today",
  ];
  const rightAxisMetric = "avg_response_time";

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 w-full">
      {/* Header with title and refresh button */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Faculty Performance Metrics (Last 5 Days)
          </h3>
          <p className="text-sm text-gray-500">
            Daily trend of pending documents, validations, reviews & response
            time
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Legend with toggles */}
      <div className="flex flex-wrap gap-3 mb-4 pb-2 border-b border-gray-100">
        {METRICS.map((metric) => (
          <button
            key={metric.key}
            onClick={() => toggleMetric(metric.key)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors hover:bg-gray-50"
          >
            {visibleMetrics[metric.key] ? (
              <Eye className="w-3.5 h-3.5 text-gray-600" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: metric.color }}
            />
            <span
              className={
                visibleMetrics[metric.key] ? "text-gray-700" : "text-gray-400"
              }
            >
              {metric.label}
            </span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            {/* Left Y axis for count metrics */}
            <YAxis
              yAxisId="left"
              domain={[0, 40]}
              tick={{ fontSize: 12 }}
              label={{
                value: "Count",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fontSize: 12 },
              }}
            />
            {/* Right Y axis for avg response time */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 5]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}h`}
              label={{
                value: "Hours",
                angle: 90,
                position: "insideRight",
                style: { textAnchor: "middle", fontSize: 12 },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 10 }} />

            {/* Render lines for visible metrics */}
            {METRICS.map((metric) => {
              if (!visibleMetrics[metric.key]) return null;
              const yAxisId = metric.key === rightAxisMetric ? "right" : "left";
              return (
                <Line
                  key={metric.key}
                  yAxisId={yAxisId}
                  type="monotone"
                  dataKey={metric.key}
                  stroke={metric.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  name={metric.label}
                  unit={metric.unit}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* API placeholder note */}
      <div className="mt-3 text-xs text-gray-400 text-center border-t pt-2">
        {/* API endpoint: GET /api/faculty/dashboard/metrics-trend */}
        Data updates every 10 seconds (simulated). Real-time refresh ready.
      </div>
    </div>
  );
};

export default MetricsTrendChart;
