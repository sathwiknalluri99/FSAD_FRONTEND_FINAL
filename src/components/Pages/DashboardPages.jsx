// components/Pages/DashboardPages.jsx
import React from "react";

export default function DashboardPage({ user }) {
  return (
    <div id="dashboard-page" className="page-content active">

      {/* PAGE HEADER */}
      <div className="page-header">
        <h1 className="page-title">
          Welcome back, {user?.username || "User"}!
        </h1>
        <p className="page-subtitle">
          Here's what's happening with your university today.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="stats-row">

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#3d73ff" }}>
            <i className="fas fa-user-graduate"></i>
          </div>
          <div className="stat-info">
            <h3>2,847</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#4cc9f0" }}>
            <i className="fas fa-chalkboard-teacher"></i>
          </div>
          <div className="stat-info">
            <h3>184</h3>
            <p>Faculty Members</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#28d17c" }}>
            <i className="fas fa-book-open"></i>
          </div>
          <div className="stat-info">
            <h3>96</h3>
            <p>Active Courses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#ffb117" }}>
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-info">
            <h3>94%</h3>
            <p>Attendance Rate</p>
          </div>
        </div>

      </div>

      {/* CONTENT GRID */}
      <div className="content-grid">

        {/* LEFT COLUMN */}
        <div>
          {/* RECENT ACTIVITIES */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Activities</h2>
              <span className="card-action">View All</span>
            </div>

            <ul className="activity-list">

              <li className="activity-item">
                <div className="activity-icon" style={{ background: "#4c6ef5" }}>
                  <i className="fas fa-user-plus"></i>
                </div>
                <div className="activity-info">
                  <h4>New Student Registration</h4>
                  <p>Michael Johnson has been registered for the Spring semester</p>
                  <small>2 hours ago</small>
                </div>
              </li>

              <li className="activity-item">
                <div className="activity-icon" style={{ background: "#28d17c" }}>
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="activity-info">
                  <h4>Assignment Submitted</h4>
                  <p>Mathematics assignment submitted by 92% of students</p>
                  <small>5 hours ago</small>
                </div>
              </li>

              <li className="activity-item">
                <div className="activity-icon" style={{ background: "#ffb117" }}>
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div className="activity-info">
                  <h4>Low Attendance Alert</h4>
                  <p>18 students have attendance below 75% in Physics</p>
                  <small>Yesterday</small>
                </div>
              </li>

            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>

          {/* QUICK ACTIONS */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Quick Actions</h2>
            </div>

            <div className="quick-actions">

              <div className="action-card">
                <div className="action-icon" style={{ background: "#4c6ef5" }}>
                  <i className="fas fa-user-plus"></i>
                </div>
                <div className="action-title">Add Student</div>
                <div className="action-desc">Register new student</div>
              </div>

              <div className="action-card">
                <div className="action-icon" style={{ background: "#4cc9f0" }}>
                  <i className="fas fa-book"></i>
                </div>
                <div className="action-title">Create Course</div>
                <div className="action-desc">Set up new course</div>
              </div>

              <div className="action-card">
                <div className="action-icon" style={{ background: "#28d17c" }}>
                  <i className="fas fa-file-invoice-dollar"></i>
                </div>
                <div className="action-title">Generate Invoice</div>
                <div className="action-desc">Create fee invoice</div>
              </div>

              <div className="action-card">
                <div className="action-icon" style={{ background: "#ffb117" }}>
                  <i className="fas fa-chart-line"></i>
                </div>
                <div className="action-title">View Reports</div>
                <div className="action-desc">Analytics & insights</div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
