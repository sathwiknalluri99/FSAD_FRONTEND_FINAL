import React, { useState, useEffect } from "react";
import "./StudentPages.css";
import { useToast } from "../Common/Toast";

export default function StudentCourseRegister() {
  const { showToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, semesterFilter]);

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:8085/api/courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setMessage("Error loading courses");
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.courseName.toLowerCase().includes(term) ||
          course.courseCode.toLowerCase().includes(term)
      );
    }

    // Semester filter
    if (semesterFilter !== "All") {
      filtered = filtered.filter((course) => course.semester === semesterFilter);
    }

    setFilteredCourses(filtered);
  };

  const handleRegisterClick = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(
        `http://localhost:8085/api/enrollments/register/${selectedCourse.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        showToast("✓ Successfully registered for course!", "success");
        setShowModal(false);
        fetchCourses();
      } else {
        const error = await response.json();
        showToast(`✗ ${error.message || "Registration failed"}`, "error");
      }
    } catch (error) {
      console.error("Error registering:", error);
      showToast("Error registering for course", "error");
    }
  };

  const getEnrolledPercentage = (course) => {
    if (!course.capacity) return 0;
    const enrolled = course.enrollments?.length || 0;
    return Math.round((enrolled / course.capacity) * 100);
  };

  return (
    <div className="student-course-register">
      <div className="page-header">
        <h1>Course Registration</h1>
        <p>Browse available courses and register for the upcoming semester</p>
      </div>

      {message && (
        <div className={`alert ${message.includes("✓") ? "alert-success" : "alert-error"}`}>
          {message}
        </div>
      )}

      <div className="course-filters">
        <div className="filter-group">
          <label>Search Courses:</label>
          <input
            type="text"
            placeholder="Search by course name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label>Filter by Semester:</label>
          <select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)} className="filter-select">
            <option>All</option>
            <option>Spring</option>
            <option>Fall</option>
            <option>Summer</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Loading courses...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="no-results">
          <p>No courses found matching your filters</p>
        </div>
      ) : (
        <div className="courses-container">
          <div className="courses-list">
            {filteredCourses.map((course) => {
              const enrolled = course.enrollments?.length || 0;
              const available = enrolled < (course.capacity || 30);
              const percentage = getEnrolledPercentage(course);

              return (
                <div key={course.id} className="course-item">
                  <div className="course-info-header">
                    <div className="course-titles">
                      <h3>{course.courseName}</h3>
                      <span className="course-code">{course.courseCode}</span>
                    </div>
                    <div className={`status-badge ${available ? "available" : "full"}`}>
                      {available ? "Available" : "Full"}
                    </div>
                  </div>

                  <p className="course-description">{course.description}</p>

                  <div className="course-details">
                    <div className="detail-row">
                      <span className="label">
                        <i className="fa-solid fa-chalkboard-user"></i> Instructor:
                      </span>
                      <span className="value">{course.teacher?.username || "TBA"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">
                        <i className="fa-solid fa-clock"></i> Schedule:
                      </span>
                      <span className="value">{course.schedule || "TBA"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">
                        <i className="fa-solid fa-map-pin"></i> Location:
                      </span>
                      <span className="value">{course.location || "TBA"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">
                        <i className="fa-solid fa-book"></i> Credits:
                      </span>
                      <span className="value">{course.credits}</span>
                    </div>
                  </div>

                  <div className="enrollment-info">
                    <div className="enrollment-stats">
                      <span>
                        {enrolled} / {course.capacity || 30} students
                      </span>
                    </div>
                    <div className="enrollment-bar">
                      <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>

                  {course.prerequisites && (
                    <div className="prerequisites">
                      <i className="fa-solid fa-exclamation-circle"></i>
                      <span>Prerequisites: {course.prerequisites}</span>
                    </div>
                  )}

                  <button
                    className="register-btn"
                    onClick={() => handleRegisterClick(course)}
                    disabled={!available}
                  >
                    {available ? "Register" : "Course Full"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Registration Confirmation Modal */}
      {showModal && selectedCourse && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Course Registration</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="registration-summary">
                <h3>{selectedCourse.courseName}</h3>
                <div className="summary-row">
                  <span>Course Code:</span>
                  <strong>{selectedCourse.courseCode}</strong>
                </div>
                <div className="summary-row">
                  <span>Instructor:</span>
                  <strong>{selectedCourse.teacher?.username || "TBA"}</strong>
                </div>
                <div className="summary-row">
                  <span>Schedule:</span>
                  <strong>{selectedCourse.schedule || "TBA"}</strong>
                </div>
                <div className="summary-row">
                  <span>Credits:</span>
                  <strong>{selectedCourse.credits}</strong>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleRegister}>
                Confirm Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
