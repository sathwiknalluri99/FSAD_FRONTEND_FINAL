import React, { useState, useEffect } from 'react';
import ConfirmationDialog from '../ConfirmationDialog.jsx';
import { UserManagementAPI } from '../../services/api.js';

const SettingsPage = ({ user }) => {
  // Get current user role from props or localStorage
  let userRole = user?.role || localStorage.getItem('userRole') || '';
  
  // Normalize role to lowercase for comparison
  const isAdmin = userRole.toLowerCase() === 'admin';

  const [settings, setSettings] = useState({
    institutionName: 'UniERP University',
    academicYear: '2023-2024',
    gradeScale: 'Percentage (0-100%)',
    dateFormat: 'MM/DD/YYYY'
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    role: 'Faculty',
    email: '',
    status: 'Active'
  });

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Fetch all users from database
  const loadUsers = async () => {
    setLoading(true);
    console.log("Loading users from /api/admin/students/all-users...");
    const result = await UserManagementAPI.getAllUsers();
    console.log("User API Response:", result);
    if (result.success) {
      setUsers(result.data || []);
      setError(null);
    } else {
      console.error("User fetch error:", result.error);
      setError(result.error);
    }
    setLoading(false);
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
  };

  // Handle Add User button click
  const handleAddUserClick = () => {
    setFormData({
      username: '',
      fullName: '',
      role: 'Faculty',
      email: '',
      status: 'Active'
    });
    setShowAddUserModal(true);
  };

  // Handle form input change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save new user
  const handleSaveNewUser = async () => {
    if (!formData.username || !formData.fullName || !formData.email) {
      setError('Please fill all required fields');
      return;
    }

    const result = await UserManagementAPI.createUser(formData);
    if (result.success) {
      setUsers([...users, result.data]);
      setShowAddUserModal(false);
      setError(null);
    } else {
      setError(result.error);
    }
  };

  // Handle Edit User button click
  const handleEditUserClick = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      email: user.email,
      status: user.status
    });
    setShowEditUserModal(true);
  };

  // Handle save edited user
  const handleSaveEditedUser = async () => {
    if (!formData.username || !formData.fullName || !formData.email) {
      setError('Please fill all required fields');
      return;
    }

    const result = await UserManagementAPI.updateUser(selectedUser.id, formData);
    if (result.success) {
      setUsers(users.map(u => u.id === selectedUser.id ? result.data : u));
      setShowEditUserModal(false);
      setError(null);
    } else {
      setError(result.error);
    }
  };

  // Handle Delete User button click
  const handleDeleteUserClick = (user) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  // Confirm delete user
  const confirmDeleteUser = async () => {
    const result = await UserManagementAPI.deleteUser(selectedUser.id);
    if (result.success) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setError(null);
    } else {
      setError(result.error);
    }
    setShowDeleteDialog(false);
    setSelectedUser(null);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setSelectedUser(null);
  };

  return (
    <div id="settings-page" className="page-content active">
      <div className="page-header">
        <h1 className="page-title">⚙️ System Settings</h1>
        <p className="page-subtitle">Configure system preferences and user management</p>
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
      
      {isAdmin && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">General Settings</h2>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="institution-name">Institution Name</label>
              <input 
                type="text" 
                id="institution-name" 
                className="form-control" 
                value={settings.institutionName}
                onChange={(e) => handleSettingChange('institutionName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="academic-year">Academic Year</label>
              <select 
                id="academic-year" 
                className="form-control"
                value={settings.academicYear}
                onChange={(e) => handleSettingChange('academicYear', e.target.value)}
              >
                <option>2023-2024</option>
                <option>2022-2023</option>
                <option>2021-2022</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="grade-scale">Grade Scale</label>
              <select 
                id="grade-scale" 
                className="form-control"
                value={settings.gradeScale}
                onChange={(e) => handleSettingChange('gradeScale', e.target.value)}
              >
                <option>Percentage (0-100%)</option>
                <option>Letter Grade (A-F)</option>
                <option>GPA (0-4.0)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="date-format">Date Format</label>
              <select 
                id="date-format" 
                className="form-control"
                value={settings.dateFormat}
                onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
              >
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" style={{marginTop: '15px'}} onClick={handleSaveSettings}>
            <i className="fas fa-save"></i> Save Settings
          </button>
        </div>
      )}
      
      {isAdmin && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">User Management</h2>
            <button 
              className="btn btn-primary"
              onClick={handleAddUserClick}
            >
              <i className="fas fa-plus"></i> Add New User
            </button>
          </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Role</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="user-table-body">
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No users found
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.fullName}</td>
                  <td>{user.role}</td>
                  <td>{user.lastLogin || 'Never'}</td>
                  <td>
                    <span className={`badge badge-${user.status === 'Active' ? 'success' : 'danger'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-outline"
                        onClick={() => handleEditUserClick(user)}
                        title="Edit User"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteUserClick(user)}
                        title="Delete User"
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
      )}

      {!isAdmin && (
        <div className="card">
          <div style={{textAlign: 'center', padding: '40px', color: '#999'}}>
            <p>⚠️ Settings and User Management are only available for administrators.</p>
          </div>
        </div>
      )}

      {/* Add User Modal - Only for Admin */}
      {isAdmin && showAddUserModal && (
        <div className="modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New User</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddUserModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  placeholder="Enter username"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  placeholder="Enter full name"
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
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="form-control"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Registrar">Registrar</option>
                  <option value="Student">Student</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="form-control"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAddUserModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSaveNewUser}
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal - Only for Admin */}
      {isAdmin && showEditUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowEditUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit User</h2>
              <button 
                className="modal-close"
                onClick={() => setShowEditUserModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  placeholder="Enter username"
                  className="form-control"
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  placeholder="Enter full name"
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
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className="form-control"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Registrar">Registrar</option>
                  <option value="Student">Student</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="form-control"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowEditUserModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSaveEditedUser}
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <ConfirmationDialog 
          show={showDeleteDialog}
          onConfirm={confirmDeleteUser}
          onCancel={cancelDelete}
          title="Confirm User Deletion"
          message={`Are you sure you want to delete the user "${selectedUser?.fullName}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default SettingsPage;