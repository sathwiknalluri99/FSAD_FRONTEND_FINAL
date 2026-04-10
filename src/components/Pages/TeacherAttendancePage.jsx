import React, { useState, useEffect } from "react";
import { TeacherAPI, AdminAPI } from "../../services/api";

const TeacherAttendancePage = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    await Promise.all([loadCourses(), loadStudents()]);
    setLoading(false);
  };

  const loadCourses = async () => {
    try {
      const result = await AdminAPI.listCourses();
      if (result.success && result.data) {
        setCourses(result.data);
        if (result.data.length > 0) {
          setSelectedCourse(result.data[0].courseCode);
        }
      }
    } catch (err) {
      console.error("Error loading courses:", err);
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const result = await AdminAPI.getAllStudents();
      if (result.success) {
        // Map to the format expected by the component
        const studentList = result.data.map(student => ({
          id: student.id,
          name: student.name
        }));
        setStudents(studentList);
      } else {
        setStudents([]);
        setMessage({ type: "error", text: "Failed to load students: " + (result.error || "Unknown error") });
      }
    } catch (err) {
      setStudents([]);
      setMessage({ type: "error", text: "Connection error: " + err.message });
    }
    setLoading(false);
  };

  const loadAttendanceForEdit = async () => {
    if (!selectedCourse || !date) return;
    setLoading(true);
    try {
      const result = await TeacherAPI.searchAttendance(date, selectedCourse);
      if (result.success && result.data) {
        const records = result.data;
        const mappedAttendance = {};
        records.forEach(r => {
          mappedAttendance[r.studentId] = r.status.toLowerCase();
        });
        setAttendance(mappedAttendance);
        setMessage({ type: "success", text: `Loaded ${records.length} records for editing.` });
      } else {
        setAttendance({});
        setMessage({ type: "error", text: "No records found for this date/course." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error loading attendance: " + err.message });
    }
    setLoading(false);
  };

  const toggleMode = (mode) => {
    setIsEditMode(mode);
    setAttendance({});
    setMessage(null);
    if (!mode) {
      // If switching to Mark New, maybe reset date to today
      setDate(new Date().toISOString().split("T")[0]);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach((s) => (updated[s.id] = status));
    setAttendance(updated);
  };

  const handleSubmit = async () => {
    const payload = students.map((s) => ({
      courseId: selectedCourse,
      studentId: s.id,
      date,
      status: attendance[s.id] || "absent",
      semester: 1,
    }));

    try {
      const res = await TeacherAPI.markBatchAttendance(payload);
      if (res.success) {
        setMessage({ type: "success", text: res.message || "Attendance saved" });
      } else {
        setMessage({ type: "error", text: res.error || "Failed to save attendance" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Error saving attendance" });
    }
  };

  return (
    <div id="teacher-attendance-page" className="page-content active">
      <div className="page-header">
        <h1 className="page-title">{isEditMode ? " Edit Attendance" : " Record Attendance"}</h1>
        <p className="page-subtitle">
          {isEditMode 
            ? "Modify previously marked attendance" 
            : "Mark present/absent for students in a class"}
        </p>
      </div>

      <div style={{ padding: "0 20px 20px", display: "flex", gap: "0", background: "#f8fafc", borderRadius: "12px", margin: "0 20px 20px", width: "fit-content", overflow: "hidden", border: "1px solid #e2e8f0" }}>
        <button 
          className={`btn`} 
          onClick={() => toggleMode(false)}
          style={{ 
            padding: "10px 24px",
            fontSize: "14px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            background: !isEditMode ? "#6366f1" : "transparent",
            color: !isEditMode ? "white" : "#64748b",
            transition: "all 0.3s ease",
            borderRadius: "0"
          }}
        >
          Mark New
        </button>
        <button 
          className={`btn`} 
          onClick={() => toggleMode(true)}
          style={{ 
            padding: "10px 24px",
            fontSize: "14px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            background: isEditMode ? "#6366f1" : "transparent",
            color: isEditMode ? "white" : "#64748b",
            transition: "all 0.3s ease",
            borderRadius: "0"
          }}
        >
          Edit Existing
        </button>
      </div>

      {message && (
        <div
          className={`alert ${message.type}`}
          style={{
            padding: "12px 16px",
            margin: "0 20px 20px",
            borderRadius: "8px",
            backgroundColor: message.type === "success" ? "#dcfce7" : "#fee2e2",
            color: message.type === "success" ? "#166534" : "#991b1b",
            border: message.type === "success" ? "1px solid #bbf7d0" : "1px solid #fecaca",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          {message.type === "success" ? "✅ " : "❌ "} {message.text}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Class &amp; Date</h2>
        </div>
        <div className="form-row" style={{ padding: "15px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Class</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="form-control"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#fff",
                color: "#1e293b",
                fontSize: "14px",
                outline: "none"
              }}
            >
              {courses.length === 0 ? (
                <option value="">No subjects loaded</option>
              ) : (
                courses.map((c) => (
                  <option key={c.id} value={c.courseCode}>
                    {c.courseCode} - {c.courseName}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Date</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-control"
              />
              {isEditMode && (
                <button 
                  className="btn btn-primary" 
                  onClick={loadAttendanceForEdit}
                >
                  Load
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="card-title">Students</h2>
          {!loading && (
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn btn-small"
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onClick={() => markAll("present")}
                onMouseOver={(e) => e.target.style.backgroundColor = "#059669"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#10b981"}
              >
                All Present
              </button>
              <button
                className="btn btn-small"
                style={{
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onClick={() => markAll("absent")}
                onMouseOver={(e) => e.target.style.backgroundColor = "#dc2626"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#ef4444"}
              >
                All Absent
              </button>
            </div>
          )}
        </div>
        {loading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            No students found
          </div>
        ) : (
          <table className="data-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>
                    <select
                      value={attendance[s.id] || "absent"}
                      onChange={(e) => handleStatusChange(s.id, e.target.value)}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && students.length > 0 && (
        <div style={{ padding: "20px", textAlign: "right" }}>
          <button className="btn btn-primary" onClick={handleSubmit}>Save Attendance</button>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendancePage;