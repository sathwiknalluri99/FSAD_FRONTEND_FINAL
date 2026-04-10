import React from 'react';

const ConfirmationDialog = ({ show, onConfirm, onCancel, title = "Confirm Deletion", message = "Are you sure you want to delete this item? This action cannot be undone." }) => {
  if (!show) return null;

  return (
    <div className="confirmation-dialog" style={{display: 'flex'}}>
      <div className="dialog-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="dialog-buttons">
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;