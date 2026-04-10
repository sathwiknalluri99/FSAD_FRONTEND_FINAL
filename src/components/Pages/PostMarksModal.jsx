import React, { useState } from "react";
import { TeacherAPI } from "../../services/api";
import { useToast } from "../Common/Toast";

export default function PostMarksModal({ isOpen, onClose, courseId, studentId, studentName, onSuccess }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    courseId: courseId || "",
    studentId: studentId || "",
    studentName: studentName || "",
    type: "assignment", // assignment, quiz, midterm, final
    marks: "",
    totalMarks: 10,
    description: "",
    semester: 1,
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const markTypes = [
    { value: "assignment", label: "Assignment" },
    { value: "quiz", label: "Quiz" },
    { value: "midterm", label: "Midterm Exam" },
    { value: "final", label: "Final Exam" },
    { value: "project", label: "Project" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const marksData = {
      ...formData,
      marks: parseFloat(formData.marks),
      totalMarks: parseFloat(formData.totalMarks),
    };

    // Call the API - POST MARKS
    (async () => {
      try {
        const result = await TeacherAPI.postStudentMarksNetwork(marksData);
        if (result.success) {
          showToast("✓ Marks posted successfully!", "success");
          onSuccess && onSuccess(result.data);
          setFormData({
            courseId,
            studentId: "",
            studentName: "",
            type: "assignment",
            marks: "",
            totalMarks: 10,
            description: "",
            semester: 1,
          });
          onClose();
        } else {
          showToast(`✗ ${result.error || "Failed to post marks"}`, "error");
        }
      } catch (err) {
        showToast(`✗ ${err.message || "Failed to post marks"}`, "error");
      } finally {
        setLoading(false);
      }
    })();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Post Marks</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Student Name</label>
            <input
              type="text"
              value={formData.studentName}
              disabled
              style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Assessment Type *</label>
              <select name="type" value={formData.type} onChange={handleChange} required>
                {markTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Semester *</label>
              <select name="semester" value={formData.semester} onChange={handleChange} required>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Marks Obtained *</label>
              <input
                type="number"
                name="marks"
                min="0"
                step="0.5"
                placeholder="0"
                value={formData.marks}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Total Marks *</label>
              <input
                type="number"
                name="totalMarks"
                min="1"
                placeholder="10"
                value={formData.totalMarks}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Remarks / Feedback</label>
            <textarea
              name="description"
              placeholder="Add comments or feedback for the student"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Posting..." : "Post Marks"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
