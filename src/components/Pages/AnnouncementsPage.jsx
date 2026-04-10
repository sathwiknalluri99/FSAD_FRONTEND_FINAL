import React, { useState, useEffect } from "react";
import { TeacherAPI } from "../../services/api";

const AnnouncementsPage = () => {
  const [courseFilter, setCourseFilter] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    courseId: "",
  });
  const [message, setMessage] = useState(null);

  const classes = [
    { id: "CS101", name: "Data Structures & Algorithms" },
    { id: "CS102", name: "Web Development" },
    { id: "CS103", name: "Database Management" },
  ];

  const loadAnnouncements = () => {
    const res = TeacherAPI.getAnnouncements(courseFilter || null);
    if (res.success) {
      setAnnouncements(res.data);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, [courseFilter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setMessage({ type: "error", text: "Title and content are required" });
      return;
    }
    const res = TeacherAPI.createAnnouncement(formData);
    if (res.success) {
      setMessage({ type: "success", text: "Announcement posted" });
      setFormData({ title: "", content: "", courseId: "" });
      loadAnnouncements();
    } else {
      setMessage({ type: "error", text: res.error });
    }
  };

  return (
    <div id="announcements-page" className="page-content active">
      <div className="page-header">
        <h1 className="page-title">📣 Announcements</h1>
        <p className="page-subtitle">Post and review class announcements</p>
      </div>

      {message && (
        <div
          style={{
            padding: "10px",
            margin: "0 20px 20px",
            borderRadius: "4px",
            backgroundColor: message.type === "success" ? "#e6ffed" : "#ffe6e6",
            color: message.type === "success" ? "#2d662d" : "#a00",
            border: message.type === "success" ? "1px solid #8fce8f" : "1px solid #f99",
          }}
        >
          {message.text}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">New Announcement</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Course (optional)</label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">All Classes</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Content *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="form-control"
                rows="4"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Post Announcement
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Existing Announcements</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="form-control"
            >
              <option value="">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id}
                </option>
              ))}
            </select>
            <button className="btn btn-secondary" onClick={loadAnnouncements}>Refresh</button>
          </div>
        </div>
        <div className="card-body">
          {announcements.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>No announcements to show.</p>
          ) : (
            <ul className="announcement-list">
              {announcements.map((a) => (
                <li key={a.id} className="announcement-item">
                  <h4>{a.title}</h4>
                  <p>{a.content}</p>
                  <small>
                    {a.courseId ? `Class: ${a.courseId}` : "General"} – {new Date(a.createdAt).toLocaleString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;