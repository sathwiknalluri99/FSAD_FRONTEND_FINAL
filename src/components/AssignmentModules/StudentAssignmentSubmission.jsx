import React, { useState, useEffect } from 'react';
import { useToast } from '../Common/Toast';
import '../Styles/StudentAssignmentSubmission.css';

/**
 * Student Component: View Assignment and Submit Answer
 * Students can view assignment questions and submit text or file answers
 */
export default function StudentAssignmentSubmission({ assignmentId, studentId, studentName, onClose, onSubmissionSuccess }) {
  const { showToast } = useToast();
  const [assignment, setAssignment] = useState(null);
  const [mySubmission, setMySubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const [submitData, setSubmitData] = useState({
    submissionText: '',
    fileUrl: ''
  });

  useEffect(() => {
    fetchAssignmentDetails();
    fetchMySubmission();
  }, [assignmentId, studentId]);

  const fetchAssignmentDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8086/api/assignments/${assignmentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setAssignment(data.assignment);
      }
    } catch (error) {
      console.error('Error fetching assignment:', error);
      showToast('Error loading assignment', 'error');
    }
  };

  const fetchMySubmission = async () => {
    try {
      const response = await fetch(
        `http://localhost:8086/api/assignments/${assignmentId}/my-submission/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.json();
      if (data.success && data.submitted) {
        setMySubmission(data.submission);
      }
    } catch (error) {
      console.error('Error fetching submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!submitData.submissionText.trim() && !submitData.fileUrl.trim()) {
      showToast('Please provide submission text or upload a file', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:8086/api/assignments/${assignmentId}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            studentId,
            submissionText: submitData.submissionText,
            fileUrl: submitData.fileUrl
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        showToast('✓ Assignment submitted successfully!', 'success');
        setMySubmission(data.submission);
        setSubmitData({
          submissionText: '',
          fileUrl: ''
        });
        setShowSubmitForm(false);
        if (onSubmissionSuccess) {
          onSubmissionSuccess();
        }
      } else {
        showToast(data.error || 'Failed to submit assignment', 'error');
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      showToast('Error submitting assignment: ' + error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="submission-container loading">
        <p>Loading assignment...</p>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="submission-container">
        <p>Assignment not found</p>
      </div>
    );
  }

  return (
    <div className="assignment-submission-view">
      <div className="submission-header">
        <h2>{assignment.title}</h2>
        <button className="btn-close" onClick={onClose}>&times;</button>
      </div>

      <div className="submission-content">
        {/* Assignment Information */}
        <div className="assignment-info-section">
          <div className="info-item">
            <label>Subject:</label>
            <span className="subject-badge">{assignment.subject}</span>
          </div>

          <div className="info-item">
            <label>Teacher:</label>
            <span>{assignment.teacherName}</span>
          </div>

          <div className="info-item">
            <label>Due Date:</label>
            <span className="due-date">{new Date(assignment.dueDate).toLocaleString()}</span>
          </div>

          <div className="info-item">
            <label>Total Marks:</label>
            <span className="marks-badge">{assignment.totalMarks}</span>
          </div>
        </div>

        {/* Assignment Description */}
        {assignment.description && (
          <div className="assignment-description-section">
            <h3>Instructions</h3>
            <div className="description-text">
              {assignment.description}
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="questions-section">
          <h3>Questions ({assignment.questionCount})</h3>

          {assignment.questions && assignment.questions.map((question, index) => (
            <div key={question.id} className="question-item">
              <div className="question-header">
                <span className="q-number">Q{question.questionNumber}</span>
                <span className="q-marks">{question.marks} marks</span>
              </div>

              <div className="q-text">
                {question.questionText}
              </div>

              <div className="q-type-badge">
                {question.questionType === 'DESCRIPTIVE'
                  ? 'Essay/Descriptive'
                  : question.questionType === 'OBJECTIVE'
                    ? 'Multiple Choice'
                    : question.questionType === 'TRUE_FALSE'
                      ? 'True/False'
                      : 'Short Answer'}
              </div>

              {question.options && (
                <div className="q-options">
                  <strong>Options:</strong>
                  <div className="options-list">
                    {question.options.split('|').map((option, idx) => (
                      <div key={idx} className="option">{option}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submission Status and Form */}
        <div className="submission-section">
          {mySubmission ? (
            // Already submitted - Show submission details
            <div className="submitted-status">
              <div className="status-badge submitted">
                ✓ Submitted
              </div>

              <div className="submission-details">
                <div className="detail-item">
                  <label>Submitted At:</label>
                  <span>{new Date(mySubmission.submittedAt).toLocaleString()}</span>
                </div>

                {mySubmission.submissionText && (
                  <div className="detail-item">
                    <label>Your Answer:</label>
                    <div className="answer-text">
                      {mySubmission.submissionText}
                    </div>
                  </div>
                )}

                {mySubmission.fileUrl && (
                  <div className="detail-item">
                    <label>Uploaded File:</label>
                    <a href={mySubmission.fileUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                      {mySubmission.fileUrl}
                    </a>
                  </div>
                )}

                {mySubmission.marks !== null ? (
                  <>
                    <div className="detail-item graded">
                      <label>Marks:</label>
                      <span className="marks-score">{mySubmission.marks}/{assignment.totalMarks}</span>
                    </div>

                    {mySubmission.feedback && (
                      <div className="detail-item">
                        <label>Teacher Feedback:</label>
                        <div className="feedback-text">
                          {mySubmission.feedback}
                        </div>
                      </div>
                    )}

                    <div className="detail-item">
                      <label>Graded On:</label>
                      <span>{new Date(mySubmission.gradedAt).toLocaleString()}</span>
                    </div>
                  </>
                ) : (
                  <div className="status-message">
                    <strong>Status:</strong> Awaiting evaluation from teacher
                  </div>
                )}
              </div>
            </div>
          ) : (
            // No submission yet - Show submit form
            <>
              {!showSubmitForm ? (
                <button
                  className="btn-submit-assignment"
                  onClick={() => setShowSubmitForm(true)}
                >
                  Submit Assignment
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="submit-form">
                  <h3>Submit Your Answer</h3>

                  <div className="form-group">
                    <label>Answer / Written Submission *</label>
                    <textarea
                      value={submitData.submissionText}
                      onChange={(e) => setSubmitData(prev => ({
                        ...prev,
                        submissionText: e.target.value
                      }))}
                      placeholder="Type your answer here... You can submit text, or upload a file, or both."
                      rows="8"
                      className="submission-textarea"
                    />
                  </div>

                  <div className="form-group">
                    <label>File Upload (Optional)</label>
                    <input
                      type="text"
                      value={submitData.fileUrl}
                      onChange={(e) => setSubmitData(prev => ({
                        ...prev,
                        fileUrl: e.target.value
                      }))}
                      placeholder="Paste the file URL or upload path here"
                      className="file-input"
                    />
                    <small>You can upload files to a storage service and paste the link here</small>
                  </div>

                  <div className="submit-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setShowSubmitForm(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Assignment'}
                    </button>
                  </div>

                  <div className="important-note">
                    <strong>⚠️ Important:</strong> You can only submit once. Make sure your answer is complete before submitting.
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
