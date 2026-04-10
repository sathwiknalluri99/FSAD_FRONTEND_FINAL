import React, { useState, useEffect } from "react";
import { TeacherAPI, AdminAPI } from "../../services/api";
import CreateAssignmentModal from "../AssignmentModules/CreateAssignmentModal";

export default function TeacherAssignmentsPage({ user }) {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("1");
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await AdminAPI.getAllCourses();
        console.log('Raw courses response:', res);
        
        let coursesArray = [];
        if (res.success && res.data) {
          coursesArray = Array.isArray(res.data) ? res.data : [];
        } else if (Array.isArray(res)) {
          coursesArray = res;
        }
        
        console.log('Parsed courses array:', coursesArray);
        
        if (coursesArray.length > 0) {
          const courses = coursesArray.map((course) => {
            const courseObj = {
              id: course.courseCode || course.id,
              name: course.courseName || course.name,
              semester: course.semester || "1",
            };
            console.log('Mapped course:', courseObj);
            return courseObj;
          });
          setClasses(courses);
          // Set first course as selected by default
          if (courses.length > 0) {
            setSelectedClass(courses[0].id);
            console.log('Selected first course:', courses[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fixed semester options - always show both Odd and Even
  const semesterOptions = [
    { value: "1", label: "Odd Semester" },
    { value: "2", label: "Even Semester" }
  ];

  const isPastDue = (dueDate) => dueDate && new Date(dueDate) < new Date();

  useEffect(() => {
    const res = TeacherAPI.getAssignments(selectedClass);
    if (res.success) setAssignments(res.data);
    setSelectedAssignment(null);
    setSubmissions([]);

    const foundClass = classes.find((c) => c.id === selectedClass);
    if (foundClass) {
      setSelectedSemester(foundClass.semester);
    }
  }, [selectedClass]);

  const loadSubmissions = (assignmentId) => {
    const res = TeacherAPI.getSubmissions(assignmentId);
    if (res.success) setSubmissions(res.data);
  };

  const handleViewSubmissions = (assignment) => {
    setSelectedAssignment(assignment);
    loadSubmissions(assignment.id);
  };

  const handleVerify = (submissionId) => {
    const res = TeacherAPI.verifySubmission(submissionId);
    if (res.success) {
      loadSubmissions(selectedAssignment.id);
      alert("Submission verified.");
    } else {
      alert("Verify failed: " + (res.error || "unknown"));
    }
  };

  const handleDelete = (id, dueDate) => {
    if (!isPastDue(dueDate)) {
      alert("Cannot delete until assignment is past due date.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    const res = TeacherAPI.deleteAssignment(id);
    if (res.success) {
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      alert("Assignment deleted successfully");
    } else {
      alert("Delete failed: " + (res.error || "unknown"));
    }
  };

  return (
    <div className="assignments-page">
      <h1 className="page-title">Teacher Assignment Management</h1>
      <p className="page-subtitle">Select subject, then remove overdue assignments</p>

      {loading ? (
        <div className="section-card">
          <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>Loading courses...</p>
        </div>
      ) : classes.length === 0 ? (
        <div className="section-card">
          <p style={{ textAlign: "center", color: "#d32f2f", padding: "20px" }}>
            No courses found in the system.
          </p>
        </div>
      ) : (
        <div className="section-card">
          <h2>Select Subject</h2>
          <div className="class-selector">
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{
                padding: '10px 15px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '2px solid #6b40c3',
                backgroundColor: '#fff',
                color: '#000',
                cursor: 'pointer',
                minWidth: '300px',
                fontWeight: '500'
              }}
            >
              <option value="">-- Select a Subject --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {!loading && classes.length > 0 && (
        <div className="section-card">
          <div className="filter-header">
            <h2>Assignments ({selectedClass})</h2>
            <div className="filter-area">
              <button 
                className="btn btn-primary" 
                onClick={() => setShowCreateModal(true)}
                disabled={!selectedClass || selectedClass.trim() === ""}
                title={!selectedClass ? "Select a subject first" : ""}
              >
                <i className="fa-solid fa-plus"></i> Create Assignment
              </button>
              <label htmlFor="semester-select" style={{marginRight:'8px', marginLeft:'16px', fontWeight:'600', color:'#000'}}>Semester</label>
              <select
                id="semester-select"
                value={selectedSemester}
                onChange={(e) => {
                  const sem = e.target.value;
                  setSelectedSemester(sem);
                  const classMatches = classes.filter((c) => c.semester === sem);
                  if (classMatches.length > 0) {
                    setSelectedClass(classMatches[0].id);
                  }
                }}
                style={{padding:'8px 12px', borderRadius:'8px', border:'1px solid #d1d5db'}}
              >
                {semesterOptions.map((sem) => (
                  <option key={sem.value} value={sem.value}>
                    {sem.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {assignments.length === 0 ? (
            <p>No assignments found for this class.</p>
          ) : (
            <table className="results-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Due Date</th>
                  <th>Total Marks</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a) => {
                  const duePassed = isPastDue(a.dueDate);
                  return (
                    <tr key={a.id}>
                      <td style={{ color: "#000" }}>{a.title}</td>
                      <td style={{ color: "#000" }}>{a.dueDate ? new Date(a.dueDate).toLocaleString() : "-"}</td>
                      <td style={{ color: "#000" }}>{a.totalMarks || "-"}</td>
                      <td>
                        <span className={duePassed ? "status-badge overdue" : "status-badge good"}>
                          {duePassed ? "Past Due" : "Active"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="action-btn delete-btn"
                          disabled={!duePassed}
                          onClick={() => handleDelete(a.id, a.dueDate)}
                        >
                          <i className="fa-solid fa-trash"></i> Remove
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => handleViewSubmissions(a)}
                          style={{ marginLeft: "10px" }}
                        >
                          <i className="fa-solid fa-eye"></i> View Submissions
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {!loading && classes.length > 0 && selectedAssignment && (
        <div className="section-card">
          <h2>Submissions for: {selectedAssignment.title}</h2>
          {submissions.length === 0 ? (
            <p>No submissions yet.</p>
          ) : (
            <table className="results-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>File</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                  <th>Verify</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.id}>
                    <td style={{ color: "#000" }}>{s.studentName}</td>
                    <td style={{ color: "#000" }}>{s.fileName}</td>
                    <td style={{ color: "#000" }}>{new Date(s.submittedAt).toLocaleString()}</td>
                    <td style={{ color: "#000" }}>{s.status}</td>
                    <td>
                      <button
                        className="action-btn"
                        disabled={s.status === "verified"}
                        onClick={() => handleVerify(s.id)}
                      >
                        {s.status === "verified" ? "Verified" : "Verify"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      <CreateAssignmentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        courseId={selectedClass}
        onSuccess={(newAssignment) => {
          if (newAssignment.courseId === selectedClass) {
            setAssignments((prev) => [newAssignment, ...prev]);
          }
        }}
      />
    </div>
  );
}
