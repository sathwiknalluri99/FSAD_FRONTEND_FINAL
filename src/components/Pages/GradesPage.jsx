import React, { useState, useEffect } from "react";
import "./StudentPages.css";

export default function GradesPage() {
  const [grades, setGrades] = useState([]);
  const [transcript, setTranscript] = useState(null);
  const [cgpa, setCgpa] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("grades");

  useEffect(() => {
    // Get student ID from auth endpoint first
    const token = localStorage.getItem("token");
    if (token) {
      // Parse JWT to get user info (basic approach)
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const tokenData = JSON.parse(jsonPayload);
        if (tokenData.sub) {
          setStudentId(tokenData.sub);
          fetchCGPA(tokenData.sub);
        }
      } catch (e) {
        console.error("Failed to parse token:", e);
      }
    }
    
    fetchGrades();
    fetchTranscript();
  }, []);

  const fetchCGPA = async (id) => {
    try {
      const response = await fetch(`http://localhost:8086/api/grades/cgpa/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCgpa(data.cgpa);
      }
    } catch (error) {
      console.error("Error fetching CGPA:", error);
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await fetch("http://localhost:8086/api/grades/my-grades", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setGrades(data);
      }
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };

  const fetchTranscript = async () => {
    try {
      const response = await fetch("http://localhost:8086/api/grades/transcript", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTranscript(data);
      }
    } catch (error) {
      console.error("Error fetching transcript:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (letterGrade) => {
    switch (letterGrade) {
      case "A":
        return "#10b981";
      case "B":
        return "#3b82f6";
      case "C":
        return "#f59e0b";
      case "D":
        return "#ef4444";
      case "F":
        return "#dc2626";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="grades-page">
      <div className="page-header">
        <h1>Academic Performance</h1>
        <p>View your grades and academic transcript</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "grades" ? "active" : ""}`}
          onClick={() => setActiveTab("grades")}
        >
          <i className="fa-solid fa-chart-bar"></i> Course Grades
        </button>
        <button
          className={`tab-btn ${activeTab === "transcript" ? "active" : ""}`}
          onClick={() => setActiveTab("transcript")}
        >
          <i className="fa-solid fa-file-lines"></i> Academic Transcript
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Loading your information...</p>
        </div>
      ) : (
        <>
          {/* Grades Tab */}
          {activeTab === "grades" && (
            <div className="tab-content">
              {grades.length === 0 ? (
                <div className="empty-state">
                  <i className="fa-solid fa-inbox"></i>
                  <h3>No Grades Yet</h3>
                  <p>Your grades will appear here once they are posted.</p>
                </div>
              ) : (
                <div className="grades-grid">
                  {grades.map((grade) => (
                    <div key={grade.gradeId} className="grade-card">
                      <div className="grade-header">
                        <div className="course-info">
                          <h3>{grade.courseName}</h3>
                          <p className="course-code">{grade.courseCode}</p>
                        </div>
                        <div
                          className="grade-circle"
                          style={{ backgroundColor: getGradeColor(grade.letterGrade) }}
                        >
                          <span className="grade">{grade.letterGrade}</span>
                        </div>
                      </div>

                      <div className="grade-details">
                        <div className="detail-row">
                          <span className="label">Total Marks:</span>
                          <span className="value">{grade.totalMarks}/100</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Grade Points:</span>
                          <span className="value">{grade.gradePoints}</span>
                        </div>
                      </div>

                      <div className="marks-breakdown">
                        <h4>Marks Breakdown</h4>
                        <div className="breakdown-items">
                          {grade.midtermMarks !== null && (
                            <div className="breakdown-item">
                              <span>Midterm:</span>
                              <span className="marks">{grade.midtermMarks}/30</span>
                            </div>
                          )}
                          {grade.assignmentMarks !== null && (
                            <div className="breakdown-item">
                              <span>Assignment:</span>
                              <span className="marks">{grade.assignmentMarks}/20</span>
                            </div>
                          )}
                          {grade.projectMarks !== null && (
                            <div className="breakdown-item">
                              <span>Project:</span>
                              <span className="marks">{grade.projectMarks}/20</span>
                            </div>
                          )}
                          {grade.finalMarks !== null && (
                            <div className="breakdown-item">
                              <span>Final Exam:</span>
                              <span className="marks">{grade.finalMarks}/30</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="progress-bar">
                        <div className="bar-fill" style={{ width: `${grade.totalMarks}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Transcript Tab */}
          {activeTab === "transcript" && transcript && (
            <div className="tab-content">
              <div className="transcript-section">
                <div className="transcript-header">
                  <div className="transcript-student-info">
                    <h2>{transcript.studentName}</h2>
                    <p className="transcript-subtitle">Academic Transcript</p>
                  </div>
                  <div className="transcript-stats">
                    <div className="stat">
                      <span className="label">CGPA:</span>
                      <span className="value gpa">{cgpa !== null ? cgpa.toFixed(2) : "N/A"}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Total Credits:</span>
                      <span className="value">{transcript.totalCredits || "N/A"}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Completed Courses:</span>
                      <span className="value">{transcript.completedCourses || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {transcript.grades && transcript.grades.length > 0 ? (
                  <div className="transcript-table-wrapper">
                    <table className="transcript-table">
                      <thead>
                        <tr>
                          <th>Course Code</th>
                          <th>Course Name</th>
                          <th>Credits</th>
                          <th>Total Marks</th>
                          <th>Grade</th>
                          <th>Grade Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transcript.grades.map((grade, index) => (
                          <tr key={index}>
                            <td className="course-code">{grade.courseCode}</td>
                            <td className="course-name">{grade.courseName}</td>
                            <td className="text-center">{grade.credits}</td>
                            <td className="text-center">{grade.totalMarks}/100</td>
                            <td className="text-center">
                              <span
                                className="grade-badge"
                                style={{ backgroundColor: getGradeColor(grade.letterGrade) }}
                              >
                                {grade.letterGrade}
                              </span>
                            </td>
                            <td className="text-center">{grade.gradePoints}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No transcript data available yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
