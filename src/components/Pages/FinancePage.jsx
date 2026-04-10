import React, { useState, useEffect } from 'react';
import ConfirmationDialog from '../ConfirmationDialog.jsx';
import { FinanceAPI } from '../../services/api.js';

const FinancePage = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [formData, setFormData] = useState({
    student: '',
    studentId: '',
    type: 'Tuition Fee',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    description: ''
  });

  // Load transactions on component mount
  useEffect(() => {
    loadTransactions();
  }, []);

  // Fetch all transactions
  const loadTransactions = () => {
    setLoading(true);
    const result = FinanceAPI.getAllTransactions();
    if (result.success) {
      setTransactions(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    
    // Load financial summary
    const summaryResult = FinanceAPI.getFinancialSummary();
    if (summaryResult.success) {
      setSummary(summaryResult.data);
    }
    
    setLoading(false);
  };

  // Handle Add Transaction button click
  const handleAddTransactionClick = () => {
    setFormData({
      student: '',
      studentId: '',
      type: 'Tuition Fee',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      description: ''
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

  // Handle save new transaction
  const handleSaveNewTransaction = () => {
    if (!formData.student || !formData.amount) {
      setError('Please fill all required fields (Student, Amount)');
      return;
    }

    const result = FinanceAPI.addTransaction(formData);
    if (result.success) {
      setTransactions([...transactions, result.data]);
      setShowAddModal(false);
      setError(null);
      // Reload summary
      const summaryResult = FinanceAPI.getFinancialSummary();
      if (summaryResult.success) {
        setSummary(summaryResult.data);
      }
    } else {
      setError(result.error);
    }
  };

  // Handle Delete Transaction button click
  const handleDeleteTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteDialog(true);
  };

  // Confirm delete transaction
  const confirmDelete = () => {
    const result = FinanceAPI.deleteTransaction(selectedTransaction.id);
    if (result.success) {
      setTransactions(transactions.filter(t => t.id !== selectedTransaction.id));
      setError(null);
      // Reload summary
      const summaryResult = FinanceAPI.getFinancialSummary();
      if (summaryResult.success) {
        setSummary(summaryResult.data);
      }
    } else {
      setError(result.error);
    }
    setShowDeleteDialog(false);
    setSelectedTransaction(null);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setSelectedTransaction(null);
  };

  return (
    <div id="finance-page" className="page-content active">
      <div className="page-header">
        <h1 className="page-title">💰 Financial Management</h1>
        <p className="page-subtitle">Manage tuition fees, payments, and financial records</p>
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
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-info">
            <h3>${summary?.totalRevenue || 0}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--success)'}}>
            <i className="fas fa-money-check"></i>
          </div>
          <div className="stat-info">
            <h3>${summary?.paid || 0}</h3>
            <p>Paid Transactions</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--warning)'}}>
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div className="stat-info">
            <h3>${summary?.pending || 0}</h3>
            <p>Pending Payments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--danger)'}}>
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="stat-info">
            <h3>${summary?.overdue || 0}</h3>
            <p>Overdue Payments</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Transactions</h2>
          <button 
            className="btn btn-primary"
            onClick={handleAddTransactionClick}
          >
            <i className="fas fa-plus"></i> Add Transaction
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Student</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="transaction-table-body">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.student}</td>
                  <td>{transaction.type}</td>
                  <td>${transaction.amount}</td>
                  <td>{transaction.date}</td>
                  <td>
                    <span className={`badge badge-${transaction.status === 'Paid' ? 'success' : transaction.status === 'Pending' ? 'warning' : 'danger'}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteTransactionClick(transaction)}
                        title="Delete Transaction"
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

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Transaction</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Student Name *</label>
                <input
                  type="text"
                  name="student"
                  value={formData.student}
                  onChange={handleFormChange}
                  placeholder="Enter student name"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleFormChange}
                  placeholder="Enter student ID"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Transaction Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  className="form-control"
                >
                  <option value="Tuition Fee">Tuition Fee</option>
                  <option value="Library Fine">Library Fine</option>
                  <option value="Exam Fee">Exam Fee</option>
                  <option value="Activity Fee">Activity Fee</option>
                  <option value="Hostel Fee">Hostel Fee</option>
                  <option value="Lab Fee">Lab Fee</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount ($) *</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleFormChange}
                  placeholder="Enter amount"
                  className="form-control"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label>Transaction Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
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
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Enter transaction description"
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
                onClick={handleSaveNewTransaction}
              >
                Add Transaction
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
        message={`Are you sure you want to delete this transaction (${selectedTransaction?.id})? This action cannot be undone.`}
      />
    </div>
  );
};


export default FinancePage;