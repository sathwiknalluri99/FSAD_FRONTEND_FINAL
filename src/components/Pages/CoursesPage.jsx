import React, { useEffect, useState } from 'react';
import ConfirmationDialog from '../ConfirmationDialog';
import { AdminAPI } from '../../services/api';
import { useToast } from '../Common/Toast';

const CoursesPage = ({ user }) => {
  const { showToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: 'General',
    credits: '3',
    capacity: '',
    description: ''
  });

  // Load courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  // Fetch all courses from database
  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch from database API endpoint
      const response = await fetch('http://localhost:8086/api/courses', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Map backend fields to frontend format
        const mappedCourses = data.map(course => ({
          id: course.id,
          code: course.courseCode,
          name: course.courseName,
          department: course.department || 'General',
          credits: course.credits || 3,
          instructor: course.instructor || 'TBA',
          capacity: course.capacity || 0,
          enrolled: course.enrolledCount || 0,
          description: course.description || '',
          status: 'Active'
        }));
        setCourses(mappedCourses);
      } else {
        setCourses([]);
        setError('Failed to load courses from database');
      }
    } catch (err) {
      console.error('Error loading courses:', err);
      setCourses([]);
      setError('Failed to fetch courses: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Add Course button click
  const handleAddCourseClick = () => {
    setFormData({
      code: '',
      name: '',
      department: 'General',
      credits: '3',
      capacity: '',
      description: ''
    });
    setShowAddModal(true);
  };

  // Handle save new course - Save to database
  const handleSaveNewCourse = async () => {
    if (!formData.code || !formData.name) {
      setError('Please fill required fields (Code, Name)');
      return;
    }

    try {
      // Create course with database field names
      const newCourse = {
        courseCode: formData.code,
        courseName: formData.name,
        department: formData.department,
        credits: parseInt(formData.credits) || 3,
        capacity: parseInt(formData.capacity) || 0,
        description: formData.description,
        semester: 'Semester 2'
      };

      // POST to backend API
      const response = await fetch('http://localhost:8086/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newCourse),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Map response to frontend format
        const mappedCourse = {
          id: result.id,
          code: result.courseCode,
          name: result.courseName,
          department: result.department || 'General',
          credits: result.credits || 3,
          instructor: result.instructor || 'TBA',
          capacity: result.capacity || 0,
          enrolled: result.enrolledCount || 0,
          description: result.description || '',
          status: 'Active'
        };

        showToast("✓ Course added to database successfully!", "success");
        setCourses([...courses, mappedCourse]);
        setShowAddModal(false);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add course to database');
        showToast("✗ " + (errorData.message || 'Failed to add course'), "error");
      }
    } catch (err) {
      console.error('Error saving course:', err);
      setError('Error: ' + err.message);
      showToast("✗ Error saving course: " + err.message, "error");
    }
  };

  // Handle Edit Course button click
  const handleEditCourseClick = (course) => {
    setSelectedCourse(course);
    setFormData({
      code: course.code,
      name: course.name,
      department: course.department,
      credits: course.credits.toString(),
      capacity: course.capacity.toString(),
      description: course.description
    });
    setShowEditModal(true);
  };

  // Handle save edited course - Update in database
  const handleSaveEditedCourse = async () => {
    if (!formData.code || !formData.name) {
      setError('Please fill required fields (Code, Name)');
      return;
    }

    try {
      const updatedCourse = {
        courseCode: formData.code,
        courseName: formData.name,
        department: formData.department,
        credits: parseInt(formData.credits) || 3,
        capacity: parseInt(formData.capacity) || 0,
        description: formData.description,
        semester: 'Semester 2'
      };

      // PUT to backend API
      const response = await fetch(`http://localhost:8085/api/courses/${selectedCourse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedCourse),
      });

      if (response.ok) {
        const result = await response.json();
        const course = result.course || result;

        // Map response to frontend format
        const mappedCourse = {
          id: course.id,
          code: course.courseCode,
          name: course.courseName,
          department: course.department || 'General',
          credits: course.credits || 3,
          instructor: course.instructor || 'TBA',
          capacity: course.capacity || 0,
          enrolled: course.enrolledCount || 0,
          description: course.description || '',
          status: 'Active'
        };

        showToast("✓ Course updated in database successfully!", "success");
        setCourses(courses.map(c => c.id === selectedCourse.id ? mappedCourse : c));
        setShowEditModal(false);
        setError(null);
        setSelectedCourse(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update course');
        showToast("✗ " + (errorData.message || 'Failed to update course'), "error");
      }
    } catch (err) {
      console.error('Error updating course:', err);
      setError('Error: ' + err.message);
      showToast("✗ Error updating course: " + err.message, "error");
    }
  };

  // Handle View Course
  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    alert(`
Course Code: ${course.code}
Course Name: ${course.name}
Department: ${course.department}
Credits: ${course.credits}
Capacity: ${course.capacity}
Enrolled: ${course.enrolled}
Description: ${course.description}
Status: ${course.status}
    `);
  };

  // Handle Delete Course button click
  const handleDeleteCourseClick = (course) => {
    setSelectedCourse(course);
    setShowDeleteDialog(true);
  };

  // Confirm delete course - Delete from database
  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8085/api/courses/${selectedCourse.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        showToast("✓ Course deleted from database successfully!", "success");
        setCourses(courses.filter(c => c.id !== selectedCourse.id));
        setError(null);
      } else {
        const errorData = await response.json();
        showToast("✗ " + (errorData.message || 'Failed to delete course'), "error");
      }
    } catch (err) {
      console.error('Error deleting course:', err);
      showToast("✗ Error deleting course: " + err.message, "error");
    } finally {
      setShowDeleteDialog(false);
      setSelectedCourse(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setSelectedCourse(null);
  };

  return (
    <div id="courses-page" className="page-content active">
      <div className="page-header">
        <h1 className="page-title">📚 Course Management</h1>
        <p className="page-subtitle">Manage course catalog, enrollment, and materials</p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '10px 15px',
          borderRadius: '4px',
          marginBottom: '15px',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#666'
        }}>
          Loading...
        </div>
      )}
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--primary)'}}>
            <i className="fas fa-book"></i>
          </div>
          <div className="stat-info">
            <h3>{courses.length}</h3>
            <p>Total Courses</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--success)'}}>
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>{courses.reduce((sum, c) => sum + c.enrolled, 0)}</h3>
            <p>Total Enrolled</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--accent)'}}>
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div className="stat-info">
            <h3>{courses.reduce((sum, c) => sum + c.credits, 0)}</h3>
            <p>Total Credits</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--warning)'}}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <h3>{courses.filter(c => c.status === 'Active').length}</h3>
            <p>Active Courses</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Course Catalog</h2>
          {user?.role?.toLowerCase() !== 'student' && (
            <button 
              className="btn btn-primary"
              onClick={handleAddCourseClick}
            >
              <i className="fas fa-plus"></i> Add New Course
            </button>
          )}
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Department</th>
              <th>Credits</th>
              <th>Capacity</th>
              <th>Enrolled</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="course-table-body">
            {courses.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No courses found in database
                </td>
              </tr>
            ) : (
              courses.map(course => (
                <tr key={course.id || course.code}>
                  <td>{course.code}</td>
                  <td>{course.name}</td>
                  <td>{course.department}</td>
                  <td>{course.credits}</td>
                  <td>{course.capacity}</td>
                  <td>{course.enrolled}/{course.capacity}</td>
                  <td>
                    <span className="badge badge-success">{course.status}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-outline"
                        onClick={() => handleViewCourse(course)}
                        title="View Course"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      {user?.role?.toLowerCase() !== 'student' ? (
                        <>
                          <button 
                            className="btn btn-primary"
                            onClick={() => handleEditCourseClick(course)}
                            title="Edit Course"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-danger"
                            onClick={() => handleDeleteCourseClick(course)}
                            title="Delete Course"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Course</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Course Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleFormChange}
                  placeholder="e.g., CS101"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Course Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter course name"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                  className="form-control"
                >
                  <option value="General">General</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>
              <div className="form-group">
                <label>Credits</label>
                <input
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleFormChange}
                  placeholder="Enter credits"
                  className="form-control"
                  min="0"
                  max="10"
                />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleFormChange}
                  placeholder="Enter capacity"
                  className="form-control"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Enter course description"
                  className="form-control"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSaveNewCourse}
              >
                Add Course to Database
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Course</h2>
              <button 
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Course Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleFormChange}
                  placeholder="e.g., CS101"
                  className="form-control"
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Course Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter course name"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                  className="form-control"
                >
                  <option value="General">General</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Arts">Arts</option>
                </select>
              </div>
              <div className="form-group">
                <label>Credits</label>
                <input
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleFormChange}
                  placeholder="Enter credits"
                  className="form-control"
                  min="0"
                  max="10"
                />
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleFormChange}
                  placeholder="Enter capacity"
                  className="form-control"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Enter course description"
                  className="form-control"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSaveEditedCourse}
              >
                Update Course in Database
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog 
        show={showDeleteDialog}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this course (${selectedCourse?.code} - ${selectedCourse?.name})? This action cannot be undone.`}
      />
    </div>
  );
};

export default CoursesPage;