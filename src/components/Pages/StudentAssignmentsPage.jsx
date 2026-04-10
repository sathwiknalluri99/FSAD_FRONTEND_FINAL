import React, { useState, useEffect } from "react";
import { StudentAPI } from "../../services/api";

export default function StudentAssignmentsPage({ user }) {
  const [assignments, setAssignments] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingAssignment, setUploadingAssignment] = useState(null);

  // Available courses that teachers can create assignments for
  const studentCourses = [
    { id: "CS101", name: "Data Structures & Algorithms", semester: "1" },
    { id: "CS102", name: "Web Development", semester: "2" },
    { id: "CS103", name: "Database Management", semester: "3" },
    { id: "MA101", name: "Calculus I", semester: "1" },
    { id: "PH101", name: "Physics I", semester: "1" },
  ];

  // Fixed semester options - always show both Odd and Even
  const semesterOptions = [
    { value: "1", label: "Odd Semester" },
    { value: "2", label: "Even Semester" }
  ];

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAssignments();
    loadSubmissions();
  }, [selectedSemester, selectedCourse]);

  const loadAssignments = () => {
    setLoading(true);
    const res = StudentAPI.getStudentAssignments(user?.id || "STU001", selectedCourse || null);
    if (res.success) {
      setAssignments(res.data);
    }
    setLoading(false);
  };

  const loadSubmissions = () => {
    // Load existing submissions from localStorage
    const allSubmissions = JSON.parse(localStorage.getItem("erp_submissions")) || [];
    const studentSubmissions = allSubmissions.filter(s => s.studentId === (user?.id || "STU001"));
    setSubmissions(studentSubmissions);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAssignments();
    loadSubmissions();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleFileSelect = (assignmentId, file) => {
    setSelectedFile(file);
    setUploadingAssignment(assignmentId);
  };

  const handleSubmitAssignment = (assignmentId) => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    const submissionData = {
      assignmentId,
      studentId: user?.id || "STU001",
      studentName: user?.username || "John Doe",
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      submittedAt: new Date().toISOString(),
      status: "submitted"
    };

    const res = StudentAPI.submitAssignment(submissionData);
    if (res.success) {
      alert("Assignment submitted successfully!");
      setSelectedFile(null);
      setUploadingAssignment(null);
      loadSubmissions(); // Refresh submissions
    } else {
      alert("Failed to submit assignment: " + res.error);
    }
  };

  const getSubmissionStatus = (assignmentId) => {
    const submission = submissions.find(s => s.assignmentId === assignmentId);
    return submission ? submission.status : "not_submitted";
  };

  const getSubmissionDate = (assignmentId) => {
    const submission = submissions.find(s => s.assignmentId === assignmentId);
    return submission ? new Date(submission.submittedAt).toLocaleDateString() : null;
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && getSubmissionStatus() === "not_submitted";
  };

  const filteredAssignments = assignments
    .filter((a) => {
      const course = studentCourses.find((c) => c.id === a.courseId);
      if (!course) return false;
      const semesterMatch = course.semester === selectedSemester;
      const courseMatch = selectedCourse ? a.courseId === selectedCourse : true;
      return semesterMatch && courseMatch;
    });

  return (
    <div className="assignments-page">
      <h1 className="page-title">My Assignments</h1>
      <p className="page-subtitle">View and submit your course assignments</p>

      {/* Course Filter */}
      <div className="section-card">
        <div className="filter-header">
          <h2>Filter by Course</h2>
          <button className="refresh-btn" onClick={handleRefresh} disabled={refreshing}>
            <i className={`fa-solid fa-refresh ${refreshing ? 'fa-spin' : ''}`}></i>
            Refresh
          </button>
        </div>
        <div className="filter-controls">
          <label className="filter-label" htmlFor="semester-select">Semester</label>
          <select
            id="semester-select"
            value={selectedSemester}
            onChange={(e) => {
              setSelectedSemester(e.target.value);
              setSelectedCourse("");
            }}
            className="course-filter"
          >
            {semesterOptions.map((sem) => (
              <option key={sem.value} value={sem.value}>
                {sem.label}
              </option>
            ))}
          </select>

          <label className="filter-label" htmlFor="course-select">Course</label>
          <select
            id="course-select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="course-filter"
          >
            <option value="">All Courses</option>
            {studentCourses
              .filter((course) => course.semester === selectedSemester)
              .map((course) => (
                <option key={course.id} value={course.id}>
                  {course.id} - {course.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Assignments List */}
      <div className="assignments-list">
        {loading ? (
          <div className="loading">Loading assignments...</div>
        ) : filteredAssignments.length === 0 ? (
          <div className="no-assignments">
            <i className="fa-solid fa-clipboard-list"></i>
            <h3>No assignments found</h3>
            <p>
              {selectedCourse
                ? `No assignments have been created for ${studentCourses.find(c => c.id === selectedCourse)?.name || selectedCourse} yet.`
                : "No assignments have been created by your teachers yet."
              }
            </p>
            <p className="help-text">
              Assignments will appear here once your teachers create them. Try refreshing the page or check back later.
            </p>
          </div>
        ) : (
          filteredAssignments.map(assignment => {
            const status = getSubmissionStatus(assignment.id);
            const submissionDate = getSubmissionDate(assignment.id);
            const overdue = isOverdue(assignment.dueDate);

            return (
              <div key={assignment.id} className={`assignment-card ${overdue ? 'overdue' : ''}`}>
                <div className="assignment-header">
                  <div className="assignment-info">
                    <h3>{assignment.title}</h3>
                    <p className="course-name">
                      {studentCourses.find(c => c.id === assignment.courseId)?.name || assignment.courseId}
                    </p>
                  </div>
                  <div className="assignment-meta">
                    <span className={`status-badge ${status}`}>
                      {status === 'submitted' ? 'Submitted' : 'Not Submitted'}
                    </span>
                  </div>
                </div>

                <div className="assignment-content">
                  <p className="description">{assignment.description}</p>
                  <div className="assignment-details">
                    <div className="detail-item">
                      <i className="fa-solid fa-calendar-days"></i>
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fa-solid fa-star"></i>
                      <span>Marks: {assignment.totalMarks}</span>
                    </div>
                    {submissionDate && (
                      <div className="detail-item">
                        <i className="fa-solid fa-clock"></i>
                        <span>Submitted: {submissionDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {status !== 'submitted' && (
                  <div className="assignment-actions">
                    <div className="file-upload">
                      <input
                        type="file"
                        id={`file-${assignment.id}`}
                        onChange={(e) => handleFileSelect(assignment.id, e.target.files[0])}
                        accept=".pdf,.doc,.docx,.txt,.zip"
                        style={{ display: 'none' }}
                      />
                      <label htmlFor={`file-${assignment.id}`} className="upload-btn">
                        <i className="fa-solid fa-upload"></i>
                        Choose File
                      </label>
                      {selectedFile && uploadingAssignment === assignment.id && (
                        <span className="file-name">{selectedFile.name}</span>
                      )}
                    </div>
                    <button
                      className="submit-btn"
                      onClick={() => handleSubmitAssignment(assignment.id)}
                      disabled={!selectedFile || uploadingAssignment !== assignment.id}
                    >
                      <i className="fa-solid fa-paper-plane"></i>
                      Submit Assignment
                    </button>
                  </div>
                )}

                {overdue && status !== 'submitted' && (
                  <div className="overdue-notice">
                    <i className="fa-solid fa-exclamation-triangle"></i>
                    This assignment is overdue
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}