import React, { useState, useEffect } from "react";
import CreateAssignmentModal from "../AssignmentModules/CreateAssignmentModal";
import PostMarksModal from "./PostMarksModal";
import { TeacherAPI } from "../../services/api";
import { useToast } from "../Common/Toast";

export default function TeacherDashboard({ user, setActivePage }) {
  const { showToast } = useToast();
  const [selectedClass, setSelectedClass] = useState("");
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showPostMarks, setShowPostMarks] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);
  const [dailyStats, setDailyStats] = useState({
    classesScheduled: 0,
    studentsAssigned: 0,
    assignmentsPending: 0,
    avgPerformance: 0,
  });

  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (user?.username) {
      fetchTeacherData();
      fetchStudents();
    }
  }, [user]);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8086/api/dashboard/teacher/courses/${user.username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setClasses(data.data);
          if (data.data.length > 0) {
            setSelectedClass(data.data[0].id);
          }
          // Update stats
          setDailyStats(prev => ({
            ...prev,
            classesScheduled: data.data.length,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching teacher dashboard data:", error);
      showToast("Error loading dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch(`http://localhost:8086/api/dashboard/teacher/students/${user.username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          // Convert student data to progress format
          const progressData = data.data.map(student => ({
            id: student.id,
            name: student.name || student.username,
            email: student.email,
            assignmentMarks: Math.floor(Math.random() * 100), // Placeholder - would come from grades API
            dailyWork: Math.floor(Math.random() * 100),
            attendance: Math.floor(Math.random() * 100),
            projectMarks: Math.floor(Math.random() * 100),
            overallGrade: ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'][Math.floor(Math.random() * 7)],
          }));
          setStudents(data.data);
          setStudentProgress(progressData);
          // Update stats
          setDailyStats(prev => ({
            ...prev,
            studentsAssigned: progressData.length,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      showToast("Error loading student list", "error");
    }
  };

  const isPastDue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const handleDeleteAssignment = (assignmentId) => {
    if (!window.confirm("Delete this assignment? This can only be done after due date.")) return;
    const res = TeacherAPI.deleteAssignment(assignmentId);
    if (res.success) {
      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
      showToast("Assignment deleted successfully.", "success");
    } else {
      showToast("Failed to delete assignment: " + res.error, "error");
    }
  };

  // load assignments whenever class changes
  useEffect(() => {
    const fetchAssignments = async () => {
      if (selectedClass) {
        const res = await TeacherAPI.getAssignments(selectedClass);
        if (res.success) {
          setAssignments(res.data);
          // Update pending assignments count
          const pendingCount = res.data.filter(a => !isPastDue(a.dueDate)).length;
          setDailyStats(prev => ({
            ...prev,
            assignmentsPending: pendingCount,
          }));
        }
      }
    };
    fetchAssignments();
  }, [selectedClass]);

  const getGradeColor = (grade) => {
    if (grade.startsWith("A")) return "#4CAF50";
    if (grade.startsWith("B")) return "#2196F3";
    if (grade.startsWith("C")) return "#FF9800";
    return "#F44336";
  };

  const handleCreateAssignmentClick = () => {
    setShowCreateAssignment(true);
  };

  // export progress as CSV
  const handleExportReport = () => {
    const header = [
      "Student Name",
      "Assignment Marks",
      "Daily Work",
      "Attendance",
      "Project Marks",
      "Overall Grade",
    ];
    const rows = studentProgress.map((s) => [
      s.name,
      s.assignmentMarks,
      s.dailyWork,
      s.attendance,
      s.projectMarks,
      s.overallGrade,
    ]);
    const csvContent = [header, ...rows]
      .map((r) => r.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedClass || "class"}-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePostMarksClick = (student) => {
    setSelectedStudent(student);
    setShowPostMarks(true);
  };

  const handleAssignmentSuccess = (newAssignment) => {
    console.log("Assignment created:", newAssignment);
    // refresh assignments list
    const res = TeacherAPI.getAssignments(selectedClass);
    if (res.success) {
      setAssignments(res.data);
    }
  };

  const handleMarksSuccess = (marksData) => {
    console.log("Marks posted:", marksData);
    // Optionally update student progress
  };

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Teacher Dashboard</h1>
      <p className="page-subtitle">Welcome, {user?.username}! Monitor your students' progress.</p>

      {/* Daily Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#EEF2FF", color: "#4CAF50" }}>
            <i className="fa-solid fa-calendar-check"></i>
          </div>
          <div className="stat-info">
            <h3>{dailyStats.classesScheduled}</h3>
            <p>Classes Scheduled</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#EEF2FF", color: "#2196F3" }}>
            <i className="fa-solid fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>{dailyStats.studentsAssigned}</h3>
            <p>Students Assigned</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#EEF2FF", color: "#FF9800" }}>
            <i className="fa-solid fa-tasks"></i>
          </div>
          <div className="stat-info">
            <h3>{dailyStats.assignmentsPending}</h3>
            <p>Pending Assignments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#EEF2FF", color: "#9C27B0" }}>
            <i className="fa-solid fa-star"></i>
          </div>
          <div className="stat-info">
            <h3>{dailyStats.avgPerformance}%</h3>
            <p>Class Average</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#EEF2FF", color: "#3f51b5" }}>
            <i className="fa-solid fa-file-alt"></i>
          </div>
          <div className="stat-info">
            <h3>{assignments.length}</h3>
            <p>Assignments Created</p>
          </div>
        </div>
      </div>

      {/* Class Selection */}
      <div className="section-card">
        <h2 style={{color:'#000'}}>Select Class</h2>
        <div className="class-selector">
          {classes.map((cls) => (
            <button
              key={cls.id}
              className={`class-btn ${selectedClass === cls.id ? "active" : ""}`}
              onClick={() => setSelectedClass(cls.id)}
            >
              <span className="class-code">{cls.id}</span>
              <span className="class-name">{cls.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Assignments for selected class */}
      <div className="section-card">
        <div className="section-header">
          <h2>Assignments for {classes.find(c => c.id === selectedClass)?.name}</h2>
          <span className="small-text">(Delete enabled after due date)</span>
        </div>
        {assignments.length === 0 ? (
          <p>No assignments found for this class yet.</p>
        ) : (
          <div className="assignments-overview-table">
            <table className="progress-table">
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
                {assignments.map((assignment) => {
                  const duePassed = isPastDue(assignment.dueDate);
                  return (
                    <tr key={assignment.id}>
                      <td>{assignment.title}</td>
                      <td>{assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : "-"}</td>
                      <td>{assignment.totalMarks || "-"}</td>
                      <td>
                        {duePassed ? (
                          <span className="status-badge overdue">Past Due</span>
                        ) : (
                          <span className="status-badge good">Active</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteAssignment(assignment.id)}
                          disabled={!duePassed}
                          title={duePassed ? "Delete this assignment" : "Can delete only after due date"}
                        >
                          <i className="fa-solid fa-trash"></i>
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Progress Table */}
      <div className="section-card">
        <div className="section-header">
          <h2>Student Progress - {classes.find(c => c.id === selectedClass)?.name}</h2>
          <button className="export-btn" onClick={handleExportReport}>
            <i className="fa-solid fa-download"></i> Export Report
          </button>
        </div>

        {studentProgress.length === 0 ? (
          <p>No students enrolled in this class yet.</p>
        ) : (
          <div className="progress-table-container">
            <table className="progress-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Assignment Marks</th>
                  <th>Daily Work</th>
                  <th>Attendance</th>
                  <th>Project Marks</th>
                  <th>Overall Grade</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentProgress.map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    style={{ cursor: 'pointer', backgroundColor: selectedStudent?.id === student.id ? 'rgba(0,0,0,0.05)' : 'transparent' }}
                  >
                    <td className="student-name">{student.name}</td>
                    <td className="marks">{student.assignmentMarks}%</td>
                    <td className="marks">{student.dailyWork}%</td>
                    <td className="marks">{student.attendance}%</td>
                    <td className="marks">{student.projectMarks}%</td>
                    <td>
                      <span
                        className="grade-badge"
                        style={{ backgroundColor: getGradeColor(student.overallGrade) }}
                      >
                        {student.overallGrade}
                      </span>
                    </td>
                    <td className="actions">
                      <button className="action-icon" title="View Details" onClick={() => alert(`View ${student.name}'s profile`)}>
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button 
                        className="action-icon" 
                        title="Update Marks"
                        onClick={() => handlePostMarksClick(student)}
                      >
                        <i className="fa-solid fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={handleCreateAssignmentClick}>
            <i className="fa-solid fa-plus"></i>
            <span>Create Assignment</span>
          </button>
          <button className="action-btn" onClick={handleExportReport}>
            <i className="fa-solid fa-download"></i>
            <span>Export Report</span>
          </button>
          <button
            className="action-btn"
            onClick={() => {
              if (selectedStudent) {
                handlePostMarksClick(selectedStudent);
              } else {
                alert('Select a student row above then click this button to update marks.');
              }
            }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
            <span>Update Marks</span>
          </button>
          <button
            className="action-btn"
            onClick={() => setActivePage && setActivePage('announcements-page')}
          >
            <i className="fa-solid fa-bell"></i>
            <span>Send Announcement</span>
          </button>
          <button
            className="action-btn"
            onClick={() => setActivePage && setActivePage('attendance-page')}
          >
            <i className="fa-solid fa-clipboard-list"></i>
            <span>Mark Attendance</span>
          </button>
          <button
            className="action-btn"
            onClick={() => setActivePage && setActivePage('reports-page')}
          >
            <i className="fa-solid fa-chart-bar"></i>
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <CreateAssignmentModal
        isOpen={showCreateAssignment}
        onClose={() => setShowCreateAssignment(false)}
        courseId={selectedClass}
        teacherId={user?.id}
        teacherUsername={user?.username}
        onSuccess={handleAssignmentSuccess}
      />

      <PostMarksModal
        isOpen={showPostMarks}
        onClose={() => setShowPostMarks(false)}
        courseId={selectedClass}
        studentId={selectedStudent?.id}
        studentName={selectedStudent?.name}
        onSuccess={handleMarksSuccess}
      />
    </div>
  );
}
