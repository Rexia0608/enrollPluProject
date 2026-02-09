import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import "./ChartAndTables.css";

const ChartAndTables = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    const enrollmentChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        datasets: [
          {
            label: "Enrollments",
            data: [21, 9, 80, 81, 56, 55, 40, 75],
            backgroundColor: "rgba(67, 97, 238, 0.7)",
            borderColor: "rgba(67, 97, 238, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    // Cleanup chart on unmount
    return () => {
      enrollmentChart.destroy();
    };
  }, []);

  return (
    <>
      <div className="row mt-4">
        <div className="col-md-8">
          <div className="card dashboard-card">
            <div className="card-header">
              <h5 className="card-title mb-0">Enrollment Statistics</h5>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card dashboard-card">
            <div className="card-header">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-primary btn-block">
                  <i className="fas fa-calendar-plus me-2"></i> Set Enrollment
                  Schedule
                </button>
                <button className="btn btn-success btn-block">
                  <i className="fas fa-plus-circle me-2"></i> Add New Course
                </button>
                <button className="btn btn-info btn-block">
                  <i className="fas fa-bell me-2"></i> Send Notification
                </button>
                <button className="btn btn-warning btn-block">
                  <i className="fas fa-cog me-2"></i> System Settings
                </button>
              </div>
            </div>
          </div>

          <div className="card dashboard-card mt-4">
            <div className="card-header">
              <h5 className="card-title mb-0">System Status</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Enrollment Status:</span>
                  <span className="badge badge-success">Active</span>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Maintenance Mode:</span>
                  <span className="badge badge-secondary">Off</span>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Last Backup:</span>
                  <span>2025-08-15 02:00</span>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between">
                  <span>Server Uptime:</span>
                  <span>99.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChartAndTables;
