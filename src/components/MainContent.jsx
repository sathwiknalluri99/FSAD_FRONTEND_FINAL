// components/MainContent.jsx
import React from "react";
import DashboardPage from "./Pages/DashboardPages";
import AdminDashboard from "./Pages/AdminDashboard";
import TeacherDashboard from "./Pages/TeacherDashboard";
import StudentDashboard from "./Pages/StudentDashboard";
import StudentAssignmentsPage from "./Pages/StudentAssignmentsPage";
import TeacherAssignmentsPage from "./Pages/TeacherAssignmentsPage";
import StudentsPage from "./Pages/StudentsPage";
import FacultyPage from "./Pages/FacultyPage";
import CoursesPage from "./Pages/CoursesPage";
import StudentCourseRegister from "./Pages/StudentCourseRegister";
import StudentEnrolledCourses from "./Pages/StudentEnrolledCourses";
import GradesPage from "./Pages/GradesPage";
import SchedulePage from "./Pages/SchedulePage";
import FinancePage from "./Pages/FinancePage";
import LibraryPage from "./Pages/LibraryPage";
import ReportsPage from "./Pages/ReportsPage";
import SettingsPage from "./Pages/SettingsPage";
import AttendanceRegister from "./Pages/AttendanceRegister";
import TeacherAttendancePage from "./Pages/TeacherAttendancePage";
import AnnouncementsPage from "./Pages/AnnouncementsPage";
import AdminCourseSyncPage from "./Pages/AdminCourseSyncPage";

export default function MainContent({ activePage, user, setActivePage }) {
  // Render role-specific dashboard
  const renderDashboard = () => {
    const role = user?.role?.toLowerCase();
    
    if (role === "admin") {
      return <AdminDashboard user={user} />;
    } else if (role === "teacher") {
      return <TeacherDashboard user={user} setActivePage={setActivePage} />;
    } else if (role === "student") {
      return <StudentDashboard user={user} />;
    }
    return <DashboardPage user={user} />;
  };

  return (
    <div className="main-area">
      {activePage === "dashboard-page" && renderDashboard()}
      {activePage === "students-page" && <StudentsPage />}
      {activePage === "faculty-page" && <FacultyPage />}
      {activePage === "courses-page" && user?.role?.toLowerCase() === "admin" && <CoursesPage user={user} />}
      {activePage === "admin-course-sync" && user?.role?.toLowerCase() === "admin" && <AdminCourseSyncPage />}
      {activePage === "student-course-register" && <StudentCourseRegister />}
      {activePage === "student-enrolled-courses" && <StudentEnrolledCourses />}
      {activePage === "grades-page" && <GradesPage />}
      {activePage === "assignments-page" && (user?.role?.toLowerCase() === "teacher" ? <TeacherAssignmentsPage user={user} /> : <StudentAssignmentsPage user={user} />)}
      {activePage === "schedule-page" && <SchedulePage user={user} />}
      {activePage === "finance-page" && <FinancePage />}
      {activePage === "library-page" && <LibraryPage />}
      {activePage === "reports-page" && <ReportsPage />}
      {activePage === "settings-page" && <SettingsPage user={user} />}
      {activePage === "attendance-page" && (
        user?.role?.toLowerCase() === "teacher" ? <TeacherAttendancePage user={user} /> : <AttendanceRegister user={user} />
      )}
      {activePage === "announcements-page" && <AnnouncementsPage />}
    </div>
  );
}
