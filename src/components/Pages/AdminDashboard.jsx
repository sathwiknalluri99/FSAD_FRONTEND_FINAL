import React, { useState, useEffect } from "react";

export default function AdminDashboard({ user }) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    activeSessions: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:8085/api/dashboard/admin/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const [recentActivities] = useState([
    { id: 1, type: "Student Registration", name: "John Doe", time: "2 hours ago", status: "Completed" },
    { id: 2, type: "Course Created", name: "Data Science 101", time: "5 hours ago", status: "Active" },
    { id: 3, type: "Grade Submission", name: "Mathematics Final Exam", time: "1 day ago", status: "Completed" },
    { id: 4, type: "System Update", name: "Security Patch v1.2", time: "2 days ago", status: "Applied" },
  ]);

  const [systemHealth] = useState({
    serverStatus: "Online",
    databaseStatus: "Healthy",
    uptime: "99.8%",
    users: "3,210",
  });

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-subtitle">Welcome, {user?.username}! Here's your system overview.</p>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#4CAF50" }}>
            <i className="fa-solid fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#2196F3" }}>
            <i className="fa-solid fa-chalkboard-user"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalTeachers}</h3>
            <p>Total Teachers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#FF9800" }}>
            <i className="fa-solid fa-book"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalCourses}</h3>
            <p>Active Courses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#9C27B0" }}>
            <i className="fa-solid fa-circle-play"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.activeSessions}</h3>
            <p>Active Sessions</p>
          </div>
        </div>
      </div>

      {/* System Health & Recent Activities */}
      <div className="admin-content-grid">
        <div className="admin-card">
          <h2>System Health</h2>
          <div className="health-status">
            <div className="health-item">
              <span>Server Status:</span>
              <span className="status-badge success">{systemHealth.serverStatus}</span>
            </div>
            <div className="health-item">
              <span>Database Status:</span>
              <span className="status-badge success">{systemHealth.databaseStatus}</span>
            </div>
            <div className="health-item">
              <span>Uptime:</span>
              <span className="status-badge info">{systemHealth.uptime}</span>
            </div>
            <div className="health-item">
              <span>Active Users:</span>
              <span className="status-badge info">{systemHealth.users}</span>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2>Recent Activities</h2>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-info">
                  <h4>{activity.type}</h4>
                  <p>{activity.name}</p>
                  <small>{activity.time}</small>
                </div>
                <span className={`status-badge ${activity.status.toLowerCase()}`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn">
            <i className="fa-solid fa-user-plus"></i>
            <span>Add Student</span>
          </button>
          <button className="action-btn">
            <i className="fa-solid fa-chalkboard-user"></i>
            <span>Add Teacher</span>
          </button>
          <button className="action-btn">
            <i className="fa-solid fa-book-open"></i>
            <span>Create Course</span>
          </button>
          <button className="action-btn">
            <i className="fa-solid fa-gears"></i>
            <span>System Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
