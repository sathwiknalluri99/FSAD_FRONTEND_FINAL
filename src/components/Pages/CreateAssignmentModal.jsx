import React, { useState, useEffect } from "react";
import { TeacherAPI } from "../../services/api";

export default function CreateAssignmentModal({ isOpen, onClose, courseId, onSuccess }) {
  const [formData, setFormData] = useState({
    courseId: courseId || "",
    title: "",
    description: "",
    dueDate: "",
    totalMarks: 10,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      courseId: courseId || "",
    }));
  }, [courseId]);

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

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

    // Call the API
    (async () => {
      try {
        const result = await TeacherAPI.createAssignmentNetwork(formData);
        if (result.success) {
          setMessage({ type: "success", text: "Assignment created successfully!" });
          setFormData({ courseId, title: "", description: "", dueDate: "", totalMarks: 10 });
          setTimeout(() => {
            onSuccess && onSuccess(result.data);
            onClose();
          }, 1200);
        } else {
          setMessage({ type: "error", text: result.error || "Failed to create assignment" });
        }
      } catch (err) {
        setMessage({ type: "error", text: err.message || "Failed to create assignment" });
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
          <h2>Create Assignment</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Course *</label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              required
            >
              <option value="">Select a course</option>
              <option value="CS101">CS101 - Data Structures & Algorithms</option>
              <option value="CS102">CS102 - Web Development</option>
              <option value="CS103">CS103 - Database Management</option>
              <option value="MA101">MA101 - Calculus I</option>
              <option value="PH101">PH101 - Physics I</option>
            </select>
          </div>

          <div className="form-group">
            <label>Assignment Title *</label>
            <input
              type="text"
              name="title"
              placeholder="E.g., Chapter 5 Exercises"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Assignment details and instructions"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Due Date *</label>
              <input
                type="datetime-local"
                name="dueDate"
                value={formData.dueDate}
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
                max="100"
                value={formData.totalMarks}
                onChange={handleChange}
                required
              />
            </div>
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
              {loading ? "Creating..." : "Create Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
