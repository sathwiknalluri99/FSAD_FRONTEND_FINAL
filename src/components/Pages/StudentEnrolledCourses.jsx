import React, { useState, useEffect } from "react";
import "./StudentPages.css";

export default function StudentEnrolledCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({
    totalEnrollments: 0,
    activeEnrollments: 0,
    completedCourses: 0,
    droppedCourses: 0,
  });
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [droppingCourseId, setDroppingCourseId] = useState(null);
  const [showDropModal, setShowDropModal] = useState(false);

  useEffect(() => {
    fetchEnrollments();
    fetchGrades();
    fetchStats();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await fetch("http://localhost:8086/api/enrollments/my-courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEnrollments(data);
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      setMessage("Error loading your courses");
    } finally {
      setLoading(false);
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

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:8086/api/enrollments/statistics", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Recalculate stats locally whenever enrollments change to ensure they reflect the table
  useEffect(() => {
    if (enrollments.length > 0) {
      const total = enrollments.length;
      const active = enrollments.filter(e => e.status === "ACTIVE").length;
      const completed = enrollments.filter(e => e.status === "COMPLETED").length;
      const dropped = enrollments.filter(e => e.status === "DROPPED").length;
      
      setStats({
        totalEnrollments: total,
        activeEnrollments: active,
        completedCourses: completed,
        droppedCourses: dropped
      });
    }
  }, [enrollments]);

  const handleDropClick = (enrollmentId) => {
    setDroppingCourseId(enrollmentId);
    setShowDropModal(true);
  };

  const confirmDropCourse = async () => {
    try {
      const response = await fetch(
        `http://localhost:8086/api/enrollments/${droppingCourseId}/drop`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setMessage("✓ Course dropped successfully");
        setShowDropModal(false);
        fetchEnrollments();
        fetchStats();
        setTimeout(() => setMessage(""), 3000);
      } else {
        const error = await response.json();
        setMessage(`✗ ${error.message}`);
      }
    } catch (error) {
      console.error("Error dropping course:", error);
      setMessage("Error dropping course");
    }
  };

  return (
    <div className="student-enrolled-courses">
      <div className="page-header">
        <h1>My Enrolled Courses</h1>
        <p>View and manage your course enrollments</p>
      </div>

      {message && (
        <div className={`alert ${message.includes("✓") ? "alert-success" : "alert-error"}`}>
          {message}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <i className="fa-solid fa-book"></i>
          </div>
          <div className="stat-content">
            <h4>Total Enrollments</h4>
            <p className="stat-value">{stats.totalEnrollments}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">
            <i className="fa-solid fa-star"></i>
          </div>
          <div className="stat-content">
            <h4>Active Courses</h4>
            <p className="stat-value">{stats.activeEnrollments}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <i className="fa-solid fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h4>Completed</h4>
            <p className="stat-value">{stats.completedCourses}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon dropped">
            <i className="fa-solid fa-circle-xmark"></i>
          </div>
          <div className="stat-content">
            <h4>Dropped</h4>
            <p className="stat-value">{stats.droppedCourses}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Loading your courses...</p>
        </div>
      ) : enrollments.length === 0 ? (
        <div className="empty-state">
          <i className="fa-solid fa-inbox"></i>
          <h3>No Enrollments</h3>
          <p>You haven't registered for any courses yet.</p>
        </div>
      ) : (
        <div className="enrollments-container">
          <div className="enrollments-table-wrapper">
            <table className="enrollments-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Instructor</th>
                  <th>Schedule</th>
                  <th>Credits</th>
                  <th>Grade</th>
                  <th>Total</th>
                  <th>Midterm</th>
                  <th>Assignment</th>
                  <th>Project</th>
                  <th>Final</th>
                  <th>Status</th>
                  <th>Enrolled Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => {
                  const grade = grades.find((g) => g.courseCode === enrollment.courseCode);
                  return (
                    <tr key={enrollment.enrollmentId} className={`status-${enrollment.status.toLowerCase()}`}>
                      <td className="course-code">{enrollment.courseCode}</td>
                      <td className="course-name">{enrollment.courseName}</td>
                      <td>{enrollment.instructor}</td>
                      <td>{enrollment.schedule || "TBA"}</td>
                      <td className="text-center">{enrollment.credits}</td>
                      <td>{grade?.letterGrade || "Pending"}</td>
                      <td>{grade?.totalMarks != null ? `${grade.totalMarks}/100` : "-"}</td>
                      <td>{grade?.midtermMarks != null ? `${grade.midtermMarks}/30` : "-"}</td>
                      <td>{grade?.assignmentMarks != null ? `${grade.assignmentMarks}/20` : "-"}</td>
                      <td>{grade?.projectMarks != null ? `${grade.projectMarks}/20` : "-"}</td>
                      <td>{grade?.finalMarks != null ? `${grade.finalMarks}/30` : "-"}</td>
                      <td>
                        <span className={`badge badge-${enrollment.status.toLowerCase()}`}>
                          {enrollment.status}
                        </span>
                      </td>
                      <td>{new Date(enrollment.enrolledDate).toLocaleDateString()}</td>
                      <td className="actions">
                        {enrollment.status === "ACTIVE" && (
                          <button
                            className="btn-drop"
                            onClick={() => handleDropClick(enrollment.enrollmentId)}
                          >
                            Drop Course
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drop Course Confirmation Modal */}
      {showDropModal && (
        <div className="modal-overlay" onClick={() => setShowDropModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Drop Course?</h2>
              <button className="close-btn" onClick={() => setShowDropModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to drop this course?</p>
              <p className="warning-text">
                <i className="fa-solid fa-exclamation-triangle"></i>
                This action cannot be undone. Your grades and progress will be marked as dropped.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDropModal(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmDropCourse}>
                Confirm Drop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
