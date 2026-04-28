// components/Sidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Role-based menu items
  const getMenuItems = () => {
    const role = user?.role?.toLowerCase();

    const adminMenu = [
      { id: "dashboard-page", label: "Dashboard", icon: "fa-solid fa-house", path: "/dashboard" },
      { id: "students-page", label: "Students", icon: "fa-solid fa-user-graduate", path: "/students" },
      { id: "faculty-page", label: "Faculty", icon: "fa-solid fa-chalkboard-teacher", path: "/faculty" },
      { id: "courses-page", label: "Courses", icon: "fa-solid fa-book", path: "/courses" },
      { id: "admin-course-sync", label: "Course Sync", icon: "fa-solid fa-sync-alt", path: "/admin-course-sync" },
      { id: "schedule-page", label: "Schedule", icon: "fa-solid fa-calendar-days", path: "/schedule" },
      { id: "reports-page", label: "Reports", icon: "fa-solid fa-chart-bar", path: "/reports" },
      { id: "settings-page", label: "Settings", icon: "fa-solid fa-gear", path: "/settings" }
    ];

    const teacherMenu = [
      { id: "dashboard-page", label: "Dashboard", icon: "fa-solid fa-house", path: "/dashboard" },
      { id: "students-page", label: "Students", icon: "fa-solid fa-user-graduate", path: "/students" },
      { id: "assignments-page", label: "Assignments", icon: "fa-solid fa-tasks", path: "/assignments" },
      { id: "attendance-page", label: "Attendance", icon: "fa-solid fa-clipboard-list", path: "/attendance" },
      { id: "announcements-page", label: "Announcements", icon: "fa-solid fa-bullhorn", path: "/announcements" },
      { id: "schedule-page", label: "Schedule", icon: "fa-solid fa-calendar-days", path: "/schedule" },
      { id: "reports-page", label: "Reports", icon: "fa-solid fa-chart-bar", path: "/reports" },
      { id: "settings-page", label: "Settings", icon: "fa-solid fa-gear", path: "/settings" }
    ];

    const studentMenu = [
      { id: "dashboard-page", label: "Dashboard", icon: "fa-solid fa-house", path: "/dashboard" },
      { id: "student-course-register", label: "Register Courses", icon: "fa-solid fa-pen-to-square", path: "/student-course-register" },
      { id: "student-enrolled-courses", label: "My Courses", icon: "fa-solid fa-book", path: "/student-enrolled-courses" },
      { id: "assignments-page", label: "Assignments", icon: "fa-solid fa-tasks", path: "/assignments" },
      {id: "grades-page", label: "Grades", icon: "fa-solid fa-chart-bar", path: "/grades" },
      { id: "attendance-page", label: "Attendance", icon: "fa-solid fa-clipboard-list", path: "/attendance" },
      { id: "schedule-page", label: "Schedule", icon: "fa-solid fa-calendar-days", path: "/schedule" },
      { id: "settings-page", label: "Settings", icon: "fa-solid fa-gear", path: "/settings" }
    ];

    if (role === "admin") return adminMenu;
    if (role === "teacher") return teacherMenu;
    if (role === "student") return studentMenu;
    return studentMenu; // Default
  };

  const menuItems = getMenuItems();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      {/* Profile Section at the Top */}
      <div className="sidebar-profile">
        <div className="profile-circle">
          {user?.username?.substring(0, 2).toUpperCase()}
        </div>
        <div className="profile-info">
          <div className="sidebar-email">{user?.username}</div>
          <div className="sidebar-role">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Administrator'}</div>
          {user?.role?.toLowerCase() === 'student' && <div className="sidebar-student-id">ID: {user?.username}</div>}
        </div>
      </div>

      {/* Menu */}
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <i className={`${item.icon} sidebar-icon`}></i>
            <span className="sidebar-text">{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
