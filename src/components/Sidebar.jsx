// components/Sidebar.jsx
import React from "react";

export default function Sidebar({ activePage, setActivePage, user }) {
  // Role-based menu items
  const getMenuItems = () => {
    const role = user?.role?.toLowerCase();

    const adminMenu = [
      { id: "dashboard-page", label: "Dashboard", icon: "fa-solid fa-house" },
      { id: "students-page", label: "Students", icon: "fa-solid fa-user-graduate" },
      { id: "faculty-page", label: "Faculty", icon: "fa-solid fa-chalkboard-teacher" },
      { id: "courses-page", label: "Courses", icon: "fa-solid fa-book" },
      { id: "admin-course-sync", label: "Course Sync", icon: "fa-solid fa-sync-alt" },
      { id: "schedule-page", label: "Schedule", icon: "fa-solid fa-calendar-days" },
      { id: "finance-page", label: "Finance", icon: "fa-solid fa-money-bill-wave" },
      { id: "reports-page", label: "Reports", icon: "fa-solid fa-chart-column" },
      { id: "settings-page", label: "Settings", icon: "fa-solid fa-gear" }
    ];

    const teacherMenu = [
      { id: "dashboard-page", label: "Dashboard", icon: "fa-solid fa-house" },
      { id: "students-page", label: "Students", icon: "fa-solid fa-user-graduate" },
      { id: "assignments-page", label: "Assignments", icon: "fa-solid fa-tasks" },
      { id: "attendance-page", label: "Attendance", icon: "fa-solid fa-clipboard-list" },
      { id: "announcements-page", label: "Announcements", icon: "fa-solid fa-bullhorn" },
      { id: "schedule-page", label: "Schedule", icon: "fa-solid fa-calendar-days" },
      { id: "reports-page", label: "Reports", icon: "fa-solid fa-chart-column" },
      { id: "settings-page", label: "Settings", icon: "fa-solid fa-gear" }
    ];

    const studentMenu = [
      { id: "dashboard-page", label: "Dashboard", icon: "fa-solid fa-house" },
      { id: "student-course-register", label: "Register Courses", icon: "fa-solid fa-pen-to-square" },
      { id: "student-enrolled-courses", label: "My Courses", icon: "fa-solid fa-book" },
      { id: "assignments-page", label: "Assignments", icon: "fa-solid fa-tasks" },
      { id: "grades-page", label: "Grades", icon: "fa-solid fa-chart-bar" },
      { id: "attendance-page", label: "Attendance", icon: "fa-solid fa-clipboard-list" },
      { id: "library-page", label: "Library", icon: "fa-solid fa-book-open" },
      { id: "schedule-page", label: "Schedule", icon: "fa-solid fa-calendar-days" },
      { id: "settings-page", label: "Settings", icon: "fa-solid fa-gear" }
    ];

    if (role === "admin") return adminMenu;
    if (role === "teacher") return teacherMenu;
    if (role === "student") return studentMenu;
    return studentMenu; // Default
  };

  const menuItems = getMenuItems();

  return (
    <aside className="sidebar">

      {/* Profile */}
      <div className="sidebar-profile">
        <div className="profile-circle">
          {user?.username?.substring(0, 2).toUpperCase()}
        </div>
        <div className="sidebar-email">{user?.username}@32343</div>
        <div className="sidebar-role">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Administrator'}</div>
      </div>

      {/* Menu */}
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`sidebar-item ${activePage === item.id ? "active" : ""}`}
            onClick={() => setActivePage(item.id)}
          >
            <i className={`${item.icon} sidebar-icon`}></i>
            <span className="sidebar-text">{item.label}</span>
          </li>
        ))}
      </ul>

    </aside>
  );
}
