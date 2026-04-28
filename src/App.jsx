// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import OtpVerification from "./components/OtpVerification";
import Dashboard from "./components/Pages/Dashboard";
import TeacherDashboard from "./components/Pages/TeacherDashboard";
import AdminDashboard from "./components/Pages/AdminDashboard";
import StudentsPage from "./components/Pages/StudentsPage";
import CoursesPage from "./components/Pages/CoursesPage";
import GradesPage from "./components/Pages/GradesPage";
import FacultyPage from "./components/Pages/FacultyPage";
import AttendanceRegister from "./components/Pages/AttendanceRegister";
import SchedulePage from "./components/Pages/SchedulePage";
import StudentCourseRegister from "./components/Pages/StudentCourseRegister";
import StudentEnrolledCourses from "./components/Pages/StudentEnrolledCourses";
import AnnouncementsPage from "./components/Pages/AnnouncementsPage";
import AdminCourseSyncPage from "./components/Pages/AdminCourseSyncPage";
import SettingsPage from "./components/Pages/SettingsPage";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StudentAssignmentsPage from "./components/Pages/StudentAssignmentsPage";
import TeacherAssignmentsPage from "./components/Pages/TeacherAssignmentsPage";
import TeacherAttendancePage from "./components/Pages/TeacherAttendancePage";
import ReportsPage from "./components/Pages/ReportsPage";
import { ToastProvider } from "./components/Common/Toast";

import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [verificationEmail, setVerificationEmail] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("uniERPUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // called when the Login component reports a successful sign‑in (or auto‑registration)
  // it saves the active session under `uniERPUser` so the app can auto‑restore on reload.
  // the Login component itself is responsible for a separate "remember me" value
  // which will pre‑fill the form even after an explicit logout.
  const handleLogin = (userOrName) => {
    let username = typeof userOrName === "string" ? userOrName : userOrName?.username;
    let role = typeof userOrName === "object" && userOrName?.role ? userOrName.role : "student";
    let email = typeof userOrName === "object" && userOrName?.email ? userOrName.email : null;

    if (!username) return;

    // If no email provided, generate a default institutional email from username
    if (!email) email = `${username}@kluniversity.in`;

    const userData = {
      username,
      role,
      email,
      avatar: username.substring(0, 2).toUpperCase(),
    };

    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("uniERPUser", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("uniERPUser");
    // do not touch rememberedUser here; if the user chose "remember me" we keep the
    // info so the login form can pre‑populate next time. They can always uncheck the box.
  };

  return (
    <ToastProvider>
      <div className="App">
        <Router>
          <Routes>
            {/* Login Route */}
            <Route path="/login" element={
              !isLoggedIn ? (
                verificationEmail ? (
                  <div className="login-screen">
                    <div className="login-right-panel" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                      <OtpVerification 
                        email={verificationEmail} 
                        onVerified={() => {
                          setVerificationEmail(null);
                        }} 
                        onCancel={() => setVerificationEmail(null)}
                      />
                    </div>
                  </div>
                ) : (
                  <Login 
                    onLogin={handleLogin} 
                    onVerifyRequired={(email) => setVerificationEmail(email)}
                  />
                )
              ) : <Navigate to="/dashboard" replace />
            } />

            {/* Protected Dashboard Routes */}
            {isLoggedIn && (
              <>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={
                  <div className="dashboard-container">
                    <Sidebar user={user} />
                    <div className="main-wrapper">
                      <Header user={user} onLogout={handleLogout} />
                      {user?.role?.toLowerCase() === 'teacher' ? <TeacherDashboard user={user} /> : 
                       user?.role?.toLowerCase() === 'admin' ? <AdminDashboard user={user} /> : 
                       <Dashboard user={user} />}
                    </div>
                  </div>
                } />
                <Route path="/students" element={
                  <div className="dashboard-container">
                    <Sidebar user={user} />
                    <div className="main-wrapper">
                      <Header user={user} onLogout={handleLogout} />
                      <StudentsPage />
                    </div>
                  </div>
                } />
                <Route path="/courses" element={
                  <div className="dashboard-container">
                    <Sidebar user={user} />
                    <div className="main-wrapper">
                      <Header user={user} onLogout={handleLogout} />
                      <CoursesPage />
                    </div>
                  </div>
                } />
                <Route path="/grades" element={
                  <div className="dashboard-container">
                    <Sidebar user={user} />
                    <div className="main-wrapper">
                      <Header user={user} onLogout={handleLogout} />
                      <GradesPage user={user} />
                    </div>
                  </div>
                } />
                <Route path="/faculty" element={
                  <div className="dashboard-container">
                    <Sidebar user={user} />
                    <div className="main-wrapper">
                      <Header user={user} onLogout={handleLogout} />
                      <FacultyPage />
                    </div>
                  </div>
                } />
                <Route path="/attendance" element={
                  <div className="dashboard-container">
                    <Sidebar user={user} />
                    <div className="main-wrapper">
                      <Header user={user} onLogout={handleLogout} />
                      {user?.role?.toLowerCase() === 'teacher' ? <TeacherAttendancePage user={user} /> : <AttendanceRegister user={user} />}
                    </div>
                  </div>
                } />
                <Route path="/schedule" element={
                  <div className="dashboard-container">
                    <Sidebar user={user} />
                    <div className="main-wrapper">
                      <Header user={user} onLogout={handleLogout} />
                      <SchedulePage />
                    </div>
                  </div>
                } />
                <Route path="/assignments" element={
                  <div className="dashboard-container">
                    <Sidebar user={user} />
                    <div className="main-wrapper">
                      <Header user={user} onLogout={handleLogout} />
                      {user?.role?.toLowerCase() === 'teacher' ? <TeacherAssignmentsPage user={user} /> : <StudentAssignmentsPage user={user} />}
                    </div>
                  </div>
                } />
                <Route path="/announcements" element={
                  <div className="dashboard-container">
                    <Sidebar user={user} />
                    <div className="main-wrapper">
                      <Header user={user} onLogout={handleLogout} />
                      <AnnouncementsPage />
                    </div>
                  </div>
                } />
                <Route path="/student-course-register" element={
                  <div className="dashboard-container">
                    <Sidebar user={user} />
                    <div className="main-wrapper">
                      <Header user={user} onLogout={handleLogout} />
                      <StudentCourseRegister user={user} />
                    </div>
                  </div>
                } />
                <Route path="/student-enrolled-courses" element={
                  <div className="dashboard-container">
                    <Sidebar user={user} />
                    <div className="main-wrapper">
                      <Header user={user} onLogout={handleLogout} />
                      <StudentEnrolledCourses user={user} />
                    </div>
                  </div>
                } />
                <Route path="/settings" element={
                  <div className="dashboard-container">
                    <Sidebar user={user} />
                    <div className="main-wrapper">
                      <Header user={user} onLogout={handleLogout} />
                      <SettingsPage user={user} />
                    </div>
                  </div>
                } />
                <Route path="/admin-course-sync" element={
                  <div className="dashboard-container">
                    <Sidebar user={user} />
                    <div className="main-wrapper">
                      <Header user={user} onLogout={handleLogout} />
                      <AdminCourseSyncPage />
                    </div>
                  </div>
                } />
                <Route path="/reports" element={
                  <div className="dashboard-container">
                    <Sidebar user={user} />
                    <div className="main-wrapper">
                      <Header user={user} onLogout={handleLogout} />
                      <ReportsPage />
                    </div>
                  </div>
                } />
              </>
            )}

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </Router>
      </div>
    </ToastProvider>
  );
}

export default App;
