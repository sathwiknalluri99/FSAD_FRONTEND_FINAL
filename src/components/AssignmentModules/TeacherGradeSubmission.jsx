import React, { useState, useEffect } from 'react';
import { useToast } from '../Common/Toast';
import '../Styles/TeacherGradeSubmission.css';

/**
 * Teacher Component: View and Grade Student Submissions
 * Teachers can view all student submissions for an assignment and provide marks/feedback
 */
export default function TeacherGradeSubmission({ assignmentId, teacherId, onClose, onGradeSuccess }) {
  const { showToast } = useToast();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  const [gradeData, setGradeData] = useState({
    marks: '',
    feedback: ''
  });

  useEffect(() => {
    fetchAssignmentAndSubmissions();
  }, [assignmentId]);

  const fetchAssignmentAndSubmissions = async () => {
    try {
      // Fetch assignment
      const assignmentRes = await fetch(`http://localhost:8085/api/assignments/${assignmentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const assignmentData = await assignmentRes.json();
      if (assignmentData.success) {
        setAssignment(assignmentData.assignment);
      }

      // Fetch submissions
      const submissionsRes = await fetch(
        `http://localhost:8085/api/assignments/${assignmentId}/submissions`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const submissionsData = await submissionsRes.json();
      if (submissionsData.success) {
        setSubmissions(submissionsData.submissions);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradeData({
      marks: submission.marks || '',
      feedback: submission.feedback || ''
    });
  };

  const handleGradeChange = (field, value) => {
    setGradeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();

    if (!gradeData.marks || gradeData.marks === '') {
      showToast('Please enter marks', 'error');
      return;
    }

    if (parseInt(gradeData.marks) < 0 || parseInt(gradeData.marks) > assignment.totalMarks) {
      showToast(`Marks must be between 0 and ${assignment.totalMarks}`, 'error');
      return;
    }

    setGrading(true);

    try {
      const response = await fetch(
        `http://localhost:8085/api/assignments/submissions/${selectedSubmission.id}/grade`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            marks: parseInt(gradeData.marks),
            feedback: gradeData.feedback
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        showToast('✓ Submission graded successfully', 'success');
        
        // Update submissions list
        const updatedSubmissions = submissions.map(s =>
          s.id === selectedSubmission.id ? data.submission : s
        );
        setSubmissions(updatedSubmissions);
        
        // Update selected submission
        setSelectedSubmission(data.submission);
        
        if (onGradeSuccess) {
          onGradeSuccess();
        }
      } else {
        showToast(data.error || 'Failed to grade submission', 'error');
      }
    } catch (error) {
      console.error('Error grading submission:', error);
      showToast('Error grading submission: ' + error.message, 'error');
    } finally {
      setGrading(false);
    }
  };

  const filteredSubmissions = filterStatus
    ? submissions.filter(s => s.status === filterStatus)
    : submissions;

  if (loading) {
    return (
      <div className="grade-container loading">
        <p>Loading submissions...</p>
      </div>
    );
  }

  return (
    <div className="teacher-grade-view">
      <div className="grade-header">
        <h2>Grade Submissions: {assignment?.title}</h2>
        <button className="btn-close" onClick={onClose}>&times;</button>
      </div>

      <div className="grade-content">
        <div className="submissions-list-section">
          <div className="list-header">
            <h3>Student Submissions ({filteredSubmissions.length})</h3>
            <div className="filter-group">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="">All ({submissions.length})</option>
                <option value="SUBMITTED">Submitted ({submissions.filter(s => s.status === 'SUBMITTED').length})</option>
                <option value="GRADED">Graded ({submissions.filter(s => s.isGraded).length})</option>
                <option value="LATE">Late ({submissions.filter(s => s.status === 'LATE').length})</option>
              </select>
            </div>
          </div>

          <div className="submissions-list">
            {filteredSubmissions.length === 0 ? (
              <div className="no-submissions">No submissions found</div>
            ) : (
              filteredSubmissions.map(submission => (
                <div
                  key={submission.id}
                  className={`submission-list-item ${selectedSubmission?.id === submission.id ? 'selected' : ''}`}
                  onClick={() => handleSelectSubmission(submission)}
                >
                  <div className="list-item-header">
                    <div className="student-info">
                      <div className="student-name">{submission.studentName}</div>
                      <div className="student-id">ID: {submission.studentId}</div>
                    </div>

                    <div className="submission-meta">
                      <span className={`status-badge ${submission.status.toLowerCase()}`}>
                        {submission.status}
                      </span>

                      {submission.isGraded && (
                        <span className="marks-info">
                          {submission.marks} marks
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="list-item-footer">
                    <span className="submitted-date">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </span>
                    {submission.feedback && (
                      <span className="has-feedback">with feedback</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Submission Details and Grading Form */}
        <div className="submission-details-section">
          {selectedSubmission ? (
            <>
              <div className="details-header">
                <h3>{selectedSubmission.studentName}</h3>
                <span className={`status-badge ${selectedSubmission.status.toLowerCase()}`}>
                  {selectedSubmission.status}
                </span>
              </div>

              <div className="submission-info">
                <div className="info-row">
                  <label>Student Email:</label>
                  <span>{selectedSubmission.studentId}</span>
                </div>

                <div className="info-row">
                  <label>Submitted At:</label>
                  <span>{new Date(selectedSubmission.submittedAt).toLocaleString()}</span>
                </div>

                {selectedSubmission.marks !== null && (
                  <div className="info-row">
                    <label>Graded At:</label>
                    <span>{new Date(selectedSubmission.gradedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Answer */}
              <div className="answer-section">
                <h4>Student's Answer</h4>
                <div className="answer-content">
                  {selectedSubmission.submissionText ? (
                    <div className="text-answer">
                      {selectedSubmission.submissionText}
                    </div>
                  ) : (
                    <div className="no-text">No text submission</div>
                  )}
                </div>

                {selectedSubmission.fileUrl && (
                  <div className="file-section">
                    <strong>Uploaded File:</strong>
                    <a href={selectedSubmission.fileUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                      View File
                    </a>
                  </div>
                )}
              </div>

              {/* Grading Form */}
              <form onSubmit={handleSubmitGrade} className="grading-form">
                <h4>Evaluate Submission</h4>

                <div className="form-group">
                  <label>Marks * (0 - {assignment?.totalMarks})</label>
                  <div className="marks-input-group">
                    <input
                      type="number"
                      value={gradeData.marks}
                      onChange={(e) => handleGradeChange('marks', e.target.value)}
                      min="0"
                      max={assignment?.totalMarks}
                      placeholder="Enter marks"
                      required
                      disabled={grading}
                    />
                    <span className="marks-label">/{assignment?.totalMarks}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Feedback / Comments</label>
                  <textarea
                    value={gradeData.feedback}
                    onChange={(e) => handleGradeChange('feedback', e.target.value)}
                    placeholder="Provide feedback to the student about their submission..."
                    rows="5"
                    disabled={grading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-grade-submit"
                  disabled={grading || !gradeData.marks}
                >
                  {grading ? 'Grading...' : selectedSubmission.marks !== null ? 'Update Grade' : 'Grade Submission'}
                </button>
              </form>
            </>
          ) : (
            <div className="no-selection">
              <p>Select a submission to view and grade it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
