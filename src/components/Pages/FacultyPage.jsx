import React, { useState, useEffect } from 'react';
import ConfirmationDialog from '../ConfirmationDialog';
import { useToast } from '../Common/Toast';

const FacultyPage = () => {
  const { showToast } = useToast();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Computer Science',
    position: 'Assistant Professor',
    qualification: 'Master\'s Degree',
    active: true
  });

  // Load faculty on component mount
  useEffect(() => {
    loadFaculty();
  }, []);

  // Fetch all teachers from database
  const loadFaculty = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8086/api/admin/students/teachers', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFaculty(data || []);
        setError(null);
      } else {
        setFaculty([]);
        setError('Failed to load faculty from database');
      }
    } catch (err) {
      console.error('Error loading faculty:', err);
      setFaculty([]);
      setError('Error fetching faculty: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Faculty button click
  const handleAddFacultyClick = () => {
    setFormData({
      name: '',
      email: '',
      department: 'Computer Science',
      position: 'Assistant Professor',
      qualification: 'Master\'s Degree',
      active: true
    });
    setShowAddModal(true);
  };

  // Handle form input change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    
    // Convert string to boolean for active field
    if (name === 'active') {
      finalValue = value === 'true' || value === true;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  // Handle save new faculty - Save to database
  const handleSaveNewFaculty = async () => {
    if (!formData.name || !formData.email) {
      setError('Please fill required fields (Name, Email)');
      return;
    }

    try {
      const newTeacher = {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        position: formData.position,
        qualification: formData.qualification
      };

      const response = await fetch('http://localhost:8086/api/admin/students/teachers/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newTeacher),
      });

      if (response.ok) {
        const result = await response.json();
        showToast("✓ Teacher added to database successfully!", "success");
        setFaculty([...faculty, result.data]);
        setShowAddModal(false);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add teacher');
        showToast("✗ " + (errorData.error || 'Failed to add teacher'), "error");
      }
    } catch (err) {
      console.error('Error saving teacher:', err);
      setError('Error: ' + err.message);
      showToast("✗ Error saving teacher: " + err.message, "error");
    }
  };

  // Handle Edit Faculty button click
  const handleEditFacultyClick = (facultyMember) => {
    setSelectedFaculty(facultyMember);
    setFormData({
      name: facultyMember.name,
      email: facultyMember.email,
      department: facultyMember.department || 'Computer Science',
      position: facultyMember.position || 'Assistant Professor',
      qualification: facultyMember.qualification || 'Master\'s Degree',
      active: facultyMember.active !== undefined ? facultyMember.active : true
    });
    setShowEditModal(true);
  };

  // Handle save edited faculty - Update in database
  const handleSaveEditedFaculty = async () => {
    if (!formData.name || !formData.email) {
      setError('Please fill required fields (Name, Email)');
      return;
    }

    try {
      const updatedTeacher = {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        position: formData.position,
        qualification: formData.qualification,
        active: formData.active
      };

      const response = await fetch(`http://localhost:8086/api/admin/students/teachers/${selectedFaculty.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedTeacher),
      });

      if (response.ok) {
        const result = await response.json();
        showToast("✓ Teacher updated in database successfully!", "success");
        setFaculty(faculty.map(f => f.id === selectedFaculty.id ? result.data : f));
        setShowEditModal(false);
        setError(null);
        setSelectedFaculty(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update teacher');
        showToast("✗ " + (errorData.error || 'Failed to update teacher'), "error");
      }
    } catch (err) {
      console.error('Error updating teacher:', err);
      setError('Error: ' + err.message);
      showToast("✗ Error updating teacher: " + err.message, "error");
    }
  };

  // Handle Delete Faculty button click
  const handleDeleteFacultyClick = (facultyMember) => {
    setSelectedFaculty(facultyMember);
    setShowDeleteDialog(true);
  };

  // Confirm delete faculty - Delete from database
  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8086/api/admin/students/teachers/${selectedFaculty.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        showToast("✓ Teacher deleted from database successfully!", "success");
        setFaculty(faculty.filter(f => f.id !== selectedFaculty.id));
        setError(null);
      } else {
        const errorData = await response.json();
        showToast("✗ " + (errorData.error || 'Failed to delete teacher'), "error");
      }
    } catch (err) {
      console.error('Error deleting teacher:', err);
      showToast("✗ Error deleting teacher: " + err.message, "error");
    } finally {
      setShowDeleteDialog(false);
      setSelectedFaculty(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setSelectedFaculty(null);
  };

  return (
    <div id="faculty-page" className="page-content active">
      <div className="page-header">
        <h1 className="page-title">👨‍🏫 Faculty Management</h1>
        <p className="page-subtitle">Manage faculty records, assignments, and performance</p>
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
            <i className="fas fa-chalkboard-user"></i>
          </div>
          <div className="stat-info">
            <h3>{faculty.length}</h3>
            <p>Total Faculty</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--success)'}}>
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-info">
            <h3>{faculty.filter(f => f.active).length}</h3>
            <p>Active Faculty</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--warning)'}}>
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div className="stat-info">
            <h3>{faculty.filter(f => !f.active).length}</h3>
            <p>Inactive Faculty</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--accent)'}}>
            <i className="fas fa-list-check"></i>
          </div>
          <div className="stat-info">
            <h3>24</h3>
            <p>Total Courses</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Faculty Members</h2>
          <button 
            className="btn btn-primary"
            onClick={handleAddFacultyClick}
          >
            <i className="fas fa-plus"></i> Add New Faculty
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Faculty ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="faculty-table-body">
            {faculty.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No faculty members found in database
                </td>
              </tr>
            ) : (
              faculty.map(facultyMember => (
                <tr key={facultyMember.id}>
                  <td>{facultyMember.id}</td>
                  <td>{facultyMember.name}</td>
                  <td>{facultyMember.email}</td>
                  <td>{facultyMember.department}</td>
                  <td>{facultyMember.position}</td>
                  <td>
                    <span className={`badge badge-${facultyMember.active ? 'success' : 'danger'}`}>
                      {facultyMember.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-outline"
                        onClick={() => handleEditFacultyClick(facultyMember)}
                        title="Edit Faculty"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteFacultyClick(facultyMember)}
                        title="Delete Faculty"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Faculty Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Faculty</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter faculty name"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Enter email address"
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
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Physics">Physics</option>
                </select>
              </div>
              <div className="form-group">
                <label>Position</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleFormChange}
                  className="form-control"
                >
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lecturer">Lecturer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleFormChange}
                  placeholder="e.g., Ph.D. in Mathematics"
                  className="form-control"
                />
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
                onClick={handleSaveNewFaculty}
              >
                Add Teacher to Database
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Faculty Modal */}
      {showEditModal && selectedFaculty && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Faculty</h2>
              <button 
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Faculty ID</label>
                <input
                  type="text"
                  value={selectedFaculty.id}
                  className="form-control"
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter faculty name"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Enter email address"
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
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Physics">Physics</option>
                </select>
              </div>
              <div className="form-group">
                <label>Position</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleFormChange}
                  className="form-control"
                >
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lecturer">Lecturer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleFormChange}
                  placeholder="e.g., Ph.D. in Mathematics"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="active"
                  value={formData.active}
                  onChange={handleFormChange}
                  className="form-control"
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
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
                onClick={handleSaveEditedFaculty}
              >
                Save Teacher to Database
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog 
        show={showDeleteDialog}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Confirm Faculty Deletion"
        message={`Are you sure you want to delete "${selectedFaculty?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default FacultyPage;