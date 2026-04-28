import React, { useState, useEffect } from "react";

export default function StudentDashboard({ user }) {
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [cgpa, setCgpa] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [semesterList, setSemesterList] = useState(["1", "2", "3", "4", "5", "6"]);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      // Parse token to get student ID
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const tokenData = JSON.parse(jsonPayload);
          if (tokenData.sub) {
            setStudentId(tokenData.sub);
            // Fetch CGPA
            fetchCGPA(tokenData.sub);
          }
        } catch (e) {
          console.error("Failed to parse token:", e);
        }
      }

      // Fetch enrolled courses
      const response = await fetch("http://localhost:8086/api/enrollments/my-courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const coursesData = await response.json();
        setEnrolledCourses(coursesData);
        
        // Extract unique semesters
        const semesters = [...new Set(coursesData.map(c => String(c.semester || "1")))].sort();
        if (semesters.length > 0) {
          setSemesterList(semesters);
          setSelectedSemester(semesters[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCGPA = async (id) => {
    try {
      // Note: Backend might not have this specific endpoint yet, 
      // but keeping it with corrected port/path if it exists
      const response = await fetch(`http://localhost:8085/api/grades/cgpa/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCgpa(data.cgpa || 0.0);
      }
    } catch (error) {
      console.error("Error fetching CGPA:", error);
    }
  };

  // Prefer the logged-in user's details when available, otherwise fall back to demo data
  const studentInfo = {
    id: "STU001234",
    name: user?.username || "John Doe",
    email: user?.email || "john.doe@kluniversity.in",
    program: "B.Tech Computer Science",
  };

  // Get courses for selected semester
  const currentSemesterCourses = enrolledCourses.filter(c => (c.semester || "1") === selectedSemester);
  const totalCreditsForSemester = currentSemesterCourses.reduce((sum, c) => sum + (c.credits || 3), 0);

  const getGradeColor = (grade) => {
    if (grade.startsWith("A+") || grade === "A+") return "#4CAF50";
    if (grade.startsWith("A")) return "#66BB6A";
    if (grade.startsWith("B+")) return "#42A5F5";
    if (grade.startsWith("B")) return "#2196F3";
    if (grade.startsWith("C")) return "#FF9800";
    return "#F44336";
  };

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Student Dashboard</h1>
      <p className="page-subtitle">Welcome, {user?.username}! Review your academic performance.</p>

      {/* Student Information Card */}
      <div className="student-info-card">
        <div className="info-section">
          <i className="fa-solid fa-user"></i>
          <div>
            <label>Student ID</label>
            <p>{studentInfo.id}</p>
          </div>
        </div>
        <div className="info-section">
          <i className="fa-solid fa-envelope"></i>
          <div>
            <label>Email</label>
            <p>{studentInfo.email}</p>
          </div>
        </div>
        <div className="info-section">
          <i className="fa-solid fa-graduation-cap"></i>
          <div>
            <label>Program</label>
            <p>{studentInfo.program}</p>
          </div>
        </div>
      </div>

      {/* Semester Selection */}
      <div className="section-card">
        <h2 style={{ color: '#000' }}>Current Semester: {selectedSemester}</h2>
        <div className="semester-selector">
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="semester-dropdown"
          >
            {semesterList.map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CGPA and SGPA */}
      <div className="gpa-cards">
        <div className="gpa-card cgpa">
          <div className="gpa-icon">
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <div className="gpa-content">
            <h3>CGPA</h3>
            <p className="gpa-value">{cgpa !== null ? cgpa.toFixed(2) : "N/A"}</p>
            <small>Cumulative GPA</small>
          </div>
        </div>

        <div className="gpa-card sgpa">
          <div className="gpa-icon">
            <i className="fa-solid fa-chart-simple"></i>
          </div>
          <div className="gpa-content">
            <h3>Credits</h3>
            <p className="gpa-value">{totalCreditsForSemester}</p>
            <small>Credits This Semester</small>
          </div>
        </div>

        <div className="gpa-card credits">
          <div className="gpa-icon">
            <i className="fa-solid fa-book"></i>
          </div>
          <div className="gpa-content">
            <h3>Courses</h3>
            <p className="gpa-value">{currentSemesterCourses.length}</p>
            <small>Enrolled Courses</small>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="performance-summary">
        <h2>Performance Summary</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <i className="fa-solid fa-medal"></i>
            <h4>Overall Performance</h4>
            <p className={cgpa >= 3.5 ? "excellent" : "good"}>
              {cgpa >= 3.7
                ? "Excellent 🌟"
                : cgpa >= 3.5
                ? "Very Good 👍"
                : cgpa !== null ? "Good" : "Loading..."}
            </p>
          </div>
          <div className="summary-item">
            <i className="fa-solid fa-trending-up"></i>
            <h4>Academic Standing</h4>
            <p>In Good Standing</p>
          </div>
          <div className="summary-item">
            <i className="fa-solid fa-calendar-check"></i>
            <h4>Current Status</h4>
            <p>Active Semester {selectedSemester}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
