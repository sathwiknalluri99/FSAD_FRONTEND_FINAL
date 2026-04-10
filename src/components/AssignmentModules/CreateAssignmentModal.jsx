import React, { useState, useEffect } from 'react';
import { useToast } from '../Common/Toast';
import '../Styles/AssignmentCreate.css';

/**
 * Teacher Component: Create Assignment with Questions
 * Allows teachers to create assignments with 1-2 questions
 * Supports both descriptive and objective question formats
 */
export default function CreateAssignmentModal({ isOpen, onClose, courseId, onSuccess, teacherUsername, teacherId }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    courseId: null,
    courseCode: courseId || '',
    questions: [
      {
        questionText: '',
        questionType: 'DESCRIPTIVE',
        marks: 10,
        options: '',
        correctAnswer: ''
      }
    ]
  });

  useEffect(() => {
    if (isOpen && courseId) {
      setFormData(prev => ({ 
        ...prev, 
        courseCode: courseId
      }));
      console.log('Modal opened with courseId:', courseId);
    }
  }, [isOpen, courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    console.log(`Question ${index} - Field: ${field}, Value:`, value);
    const updatedQuestions = [...formData.questions];
    
    // Convert marks to number
    const finalValue = field === 'marks' ? parseInt(value, 10) || 0 : value;
    
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: finalValue
    };
    
    console.log('Updated questions array:', updatedQuestions);
    
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const addQuestion = () => {
    if (formData.questions.length < 2) {
      setFormData(prev => ({
        ...prev,
        questions: [
          ...prev.questions,
          {
            questionText: '',
            questionType: 'DESCRIPTIVE',
            marks: 10,
            options: '',
            correctAnswer: ''
          }
        ]
      }));
    } else {
      showToast('Maximum 2 questions allowed per assignment', 'warning');
    }
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index)
      }));
    } else {
      showToast('At least one question is required', 'warning');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      showToast('Assignment title is required', 'error');
      return;
    }

    if (!formData.courseCode || formData.courseCode.trim() === '') {
      showToast('Please select a course before creating an assignment', 'error');
      return;
    }

    if (!formData.dueDate) {
      showToast('Due date is required', 'error');
      return;
    }

    // Validate questions
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      console.log(`Validating Question ${i}:`, q);
      
      if (!q.questionText.trim()) {
        showToast(`Question ${i + 1} text is required`, 'error');
        return;
      }

      const marksValue = parseInt(q.marks, 10);
      console.log(`Question ${i} marks value:`, q.marks, 'parsed:', marksValue);
      
      if (!marksValue || marksValue <= 0) {
        showToast(`Question ${i + 1} marks must be greater than 0`, 'error');
        return;
      }

      if (q.questionType === 'OBJECTIVE' || q.questionType === 'TRUE_FALSE') {
        if (!q.options || !q.correctAnswer) {
          showToast(`Question ${i + 1}: Options and correct answer required for ${q.questionType} questions`, 'error');
          return;
        }
      }
    }

    console.log('✓ All questions validated successfully');
    console.log('Questions count before submission:', formData.questions.length);
    console.log('Full questions before submission:', JSON.stringify(formData.questions));

    setLoading(true);

    // Log all form data including questions
    console.log('=== PRE-SUBMISSION CHECK ===');
    console.log('Current formData:', formData);
    console.log('Number of questions:', formData.questions ? formData.questions.length : 0);
    console.log('Questions detail:', formData.questions);

    // Ensure courseCode is set before sending
    const finalFormData = {
      ...formData,
      courseCode: formData.courseCode || courseId || '',
      description: formData.description || '',
      questions: formData.questions || []
    };

    console.log('=== ASSIGNMENT SUBMISSION ===');
    console.log('Final Form Data:', finalFormData);
    console.log('Final questions array:', finalFormData.questions);
    console.log('Course Code being sent:', finalFormData.courseCode);
    console.log('========================')

    try {
      const response = await fetch('http://localhost:8085/api/assignments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(finalFormData)
      });

      const data = await response.json();

      console.log('API Response:', data, 'Status:', response.status);

      if (data.success) {
        showToast('✓ Assignment created successfully', 'success');
        if (onSuccess) {
          onSuccess(data.assignment);
        }
        handleClose();
      } else {
        showToast(data.error || 'Failed to create assignment', 'error');
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      showToast('Error creating assignment: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      courseId: null,
      courseCode: courseId || '',
      questions: [
        {
          questionText: '',
          questionType: 'DESCRIPTIVE',
          marks: 10,
          options: '',
          correctAnswer: ''
        }
      ]
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content assignment-create-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Assignment</h2>
          <span className="close-btn" onClick={handleClose}>&times;</span>
        </div>

        <form onSubmit={handleSubmit} className="assignment-form">
          {/* Assignment Details */}
          <div className="form-section">
            <h3>Assignment Details</h3>

            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Arrays and Data Structures Assignment"
                required
              />
            </div>

            <div className="form-group">
              <label>Due Date *</label>
              <input
                type="datetime-local"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="form-section">
            <div className="section-header">
              <h3>Questions ({formData.questions.length}/2)</h3>
              {formData.questions.length < 2 && (
                <button type="button" className="btn-add-question" onClick={addQuestion}>
                  + Add Question
                </button>
              )}
            </div>

            {formData.questions.map((question, index) => (
              <div key={index} className="question-card">
                <div className="question-number">Question {index + 1}</div>

                <div className="form-group">
                  <label>Question Text *</label>
                  <textarea
                    value={question.questionText}
                    onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                    placeholder="Enter the question here..."
                    rows="3"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Question Type *</label>
                    <select
                      value={question.questionType}
                      onChange={(e) => handleQuestionChange(index, 'questionType', e.target.value)}
                      required
                    >
                      <option value="DESCRIPTIVE">Descriptive (Essay/Short Answer)</option>
                      <option value="OBJECTIVE">Multiple Choice</option>
                      <option value="TRUE_FALSE">True/False</option>
                      <option value="SHORT_ANSWER">Short Answer</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Marks *</label>
                    <input
                      type="number"
                      value={question.marks}
                      onChange={(e) => handleQuestionChange(index, 'marks', e.target.value)}
                      min="1"
                      max="100"
                      required
                    />
                  </div>
                </div>

                {/* Conditional fields for objective questions */}
                {(question.questionType === 'OBJECTIVE' || question.questionType === 'TRUE_FALSE') && (
                  <>
                    <div className="form-group">
                      <label>Options * (separated by |)</label>
                      <input
                        type="text"
                        value={question.options}
                        onChange={(e) => handleQuestionChange(index, 'options', e.target.value)}
                        placeholder="Option1|Option2|Option3|Option4"
                        required
                      />
                      <small>Example: True|False or A|B|C|D</small>
                    </div>

                    <div className="form-group">
                      <label>Correct Answer *</label>
                      <input
                        type="text"
                        value={question.correctAnswer}
                        onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                        placeholder="Select the correct option"
                        required
                      />
                    </div>
                  </>
                )}

                {formData.questions.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeQuestion(index)}
                  >
                    Remove Question
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
