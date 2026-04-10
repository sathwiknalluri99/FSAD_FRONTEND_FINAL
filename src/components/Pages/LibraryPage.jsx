import React, { useState, useEffect } from 'react';
import ConfirmationDialog from '../ConfirmationDialog.jsx';
import { LibraryAPI } from '../../services/api.js';

const LibraryPage = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    bookTitle: '',
    borrower: '',
    borrowDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load borrowings on component mount
  useEffect(() => {
    loadBorrowings();
  }, []);

  // Fetch all borrowing records
  const loadBorrowings = () => {
    setLoading(true);
    const result = LibraryAPI.getBorrowings();
    if (result.success) {
      setBorrowings(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  // Handle Add Borrowing button click
  const handleAddBorrowingClick = () => {
    setFormData({
      bookTitle: '',
      borrower: '',
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      status: 'Active'
    });
    setShowAddModal(true);
  };

  // Handle form input change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission for adding new borrowing
  const handleSaveNewBorrowing = () => {
    if (!formData.bookTitle || !formData.borrower || !formData.dueDate) {
      setError('Please fill all required fields');
      return;
    }

    const result = LibraryAPI.createBorrowing(formData);
    if (result.success) {
      setBorrowings([...borrowings, result.data]);
      setShowAddModal(false);
      setError(null);
    } else {
      setError(result.error);
    }
  };

  // Handle view borrowing record
  const handleViewBorrowing = (borrowingId) => {
    const result = LibraryAPI.getBorrowingRecord(borrowingId);
    if (result.success) {
      setSelectedRecord(result.data);
      setShowViewModal(true);
      setError(null);
    } else {
      setError(result.error);
    }
  };

  // Handle delete borrowing
  const handleDelete = (borrowingId) => {
    setItemToDelete(borrowingId);
    setShowDialog(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    const result = LibraryAPI.deleteBorrowing(itemToDelete);
    if (result.success) {
      setBorrowings(borrowings.filter(b => b.id !== itemToDelete));
      setError(null);
    } else {
      setError(result.error);
    }
    setShowDialog(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setShowDialog(false);
    setItemToDelete(null);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active':
        return 'success';
      case 'Due Soon':
        return 'warning';
      case 'Overdue':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <div id="library-page" className="page-content active">
      <div className="page-header">
        <h1 className="page-title">📖 Library Management</h1>
        <p className="page-subtitle">Manage library resources, borrowing, and inventory</p>
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
            <h3>25,847</h3>
            <p>Total Books</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--success)'}}>
            <i className="fas fa-book-open"></i>
          </div>
          <div className="stat-info">
            <h3>{borrowings.length}</h3>
            <p>Books Borrowed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--warning)'}}>
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-info">
            <h3>{borrowings.filter(b => b.status === 'Overdue').length}</h3>
            <p>Overdue Books</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--accent)'}}>
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>1,842</h3>
            <p>Active Members</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Borrowings</h2>
          <button 
            className="btn btn-primary" 
            onClick={handleAddBorrowingClick}
          >
            <i className="fas fa-plus"></i> Add Borrowing Record
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Borrow ID</th>
              <th>Book Title</th>
              <th>Borrower</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="borrowing-table-body">
            {borrowings.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No borrowing records found
                </td>
              </tr>
            ) : (
              borrowings.map(borrowing => (
                <tr key={borrowing.id}>
                  <td>{borrowing.id}</td>
                  <td>{borrowing.bookTitle}</td>
                  <td>{borrowing.borrower}</td>
                  <td>{borrowing.borrowDate}</td>
                  <td>{borrowing.dueDate}</td>
                  <td>
                    <span className={`badge badge-${getStatusColor(borrowing.status)}`}>
                      {borrowing.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-outline view-borrowing-btn" 
                        onClick={() => handleViewBorrowing(borrowing.id)}
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        className="btn btn-danger delete-borrowing-btn" 
                        onClick={() => handleDelete(borrowing.id)}
                        title="Delete"
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

      {/* Add Borrowing Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Borrowing Record</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Book Title *</label>
                <input
                  type="text"
                  name="bookTitle"
                  value={formData.bookTitle}
                  onChange={handleFormChange}
                  placeholder="Enter book title"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Borrower Name *</label>
                <input
                  type="text"
                  name="borrower"
                  value={formData.borrower}
                  onChange={handleFormChange}
                  placeholder="Enter borrower name"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Borrow Date</label>
                <input
                  type="date"
                  name="borrowDate"
                  value={formData.borrowDate}
                  onChange={handleFormChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Due Date *</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleFormChange}
                  className="form-control"
                />
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
                  <option value="Due Soon">Due Soon</option>
                  <option value="Overdue">Overdue</option>
                </select>
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
                onClick={handleSaveNewBorrowing}
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Borrowing Modal */}
      {showViewModal && selectedRecord && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Borrowing Record Details</h2>
              <button 
                className="modal-close"
                onClick={() => setShowViewModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <strong>Borrow ID:</strong>
                <span>{selectedRecord.id}</span>
              </div>
              <div className="detail-row">
                <strong>Book Title:</strong>
                <span>{selectedRecord.bookTitle}</span>
              </div>
              <div className="detail-row">
                <strong>Borrower:</strong>
                <span>{selectedRecord.borrower}</span>
              </div>
              <div className="detail-row">
                <strong>Borrow Date:</strong>
                <span>{selectedRecord.borrowDate}</span>
              </div>
              <div className="detail-row">
                <strong>Due Date:</strong>
                <span>{selectedRecord.dueDate}</span>
              </div>
              <div className="detail-row">
                <strong>Status:</strong>
                <span className={`badge badge-${getStatusColor(selectedRecord.status)}`}>
                  {selectedRecord.status}
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog 
        show={showDialog}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this borrowing record? This action cannot be undone."
      />
    </div>
  );
};

export default LibraryPage;