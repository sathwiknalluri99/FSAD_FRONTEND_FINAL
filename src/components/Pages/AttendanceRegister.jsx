import React, { useState, useEffect } from 'react';
import { StudentAPI } from '../../services/api';

const AttendanceRegister = ({ user }) => {
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allSemesters, setAllSemesters] = useState({});

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    setLoading(true);
    try {
      // Get complete attendance report for all semesters from backend
      const data = await StudentAPI.getAttendanceReport();
      
      if (data && typeof data === 'object') {
        setAllSemesters(data);
        // Set default to first available semester
        const semesters = Object.keys(data).sort();
        if (semesters.length > 0) {
          const firstSem = semesters[0];
          setSelectedSemester(firstSem);
          setAttendanceData(data[firstSem]);
        }
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
    setLoading(false);
  };

  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester);
    setAttendanceData(allSemesters[semester]);
  };

  const getStatusColor = (status) => {
    return status === 'present' ? '#10b981' : '#ef4444';
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 85) return '#10b981';
    if (percentage >= 75) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div id="attendance-page" className="page-content active">
        <div className="page-header">
          <h1 className="page-title">📋 Attendance Register</h1>
          <p className="page-subtitle">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  const currentData = attendanceData || {};
  const semesters = Object.keys(allSemesters).sort();

  return (
    <div id="attendance-page" className="page-content active">
      <div className="page-header">
        <h1 className="page-title">📋 Attendance Register</h1>
        <p className="page-subtitle">View your attendance record and percentages</p>
      </div>

      {/* Overall Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary)' }}>
            <i className="fas fa-book"></i>
          </div>
          <div className="stat-info">
            <h3>{Object.keys(allSemesters).length}</h3>
            <p>Total Semesters</p>
          </div>
        </div>
        {currentData.totalClasses !== undefined && (
          <>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--success)' }}>
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <h3>{currentData.present || 0}</h3>
                <p>Classes Present</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'var(--danger)' }}>
                <i className="fas fa-times-circle"></i>
              </div>
              <div className="stat-info">
                <h3>{currentData.absent || 0}</h3>
                <p>Classes Absent</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: getPercentageColor(currentData.percentage || 0), color: 'white' }}>
                <i className="fas fa-percentage"></i>
              </div>
              <div className="stat-info">
                <h3>{currentData.percentage || 0}%</h3>
                <p>Attendance %</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Semester Selector */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Select Semester</h2>
        </div>
        <div className="semester-selector">
          {semesters.map((sem) => (
            <button
              key={sem}
              className={`semester-btn ${selectedSemester === sem ? 'active' : ''}`}
              onClick={() => handleSemesterChange(sem)}
            >
              Semester {sem}
            </button>
          ))}
        </div>
      </div>

      {/* Subject-Wise Summary */}
      {currentData.subjects && Object.keys(currentData.subjects).length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Subject-wise Breakdown</h2>
          </div>
          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {Object.entries(currentData.subjects).map(([name, stats]) => (
              <div key={name} style={{ 
                padding: '16px', 
                borderRadius: '12px', 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0',
                transition: 'transform 0.2s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0 }}>{name}</h3>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '700', 
                    color: getPercentageColor(stats.percentage)
                  }}>
                    {stats.percentage}%
                  </span>
                </div>
                
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                  <div style={{ 
                    width: `${stats.percentage}%`, 
                    height: '100%', 
                    background: getPercentageColor(stats.percentage),
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                  <span>Present: <strong>{stats.present}</strong></span>
                  <span>Absent: <strong>{stats.absent}</strong></span>
                  <span>Total: <strong>{stats.total}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Section */}
      {currentData.totalClasses !== undefined && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Overall Performance Summary</h2>
          </div>
          <div className="attendance-summary">
            <div className="summary-stat">
              <span className="summary-label">Total Classes</span>
              <span className="summary-value">{currentData.totalClasses}</span>
            </div>
            <div className="summary-stat">
              <span className="summary-label">Classes Present</span>
              <span className="summary-value" style={{ color: '#10b981', fontWeight: '700' }}>
                {currentData.present}
              </span>
            </div>
            <div className="summary-stat">
              <span className="summary-label">Classes Absent</span>
              <span className="summary-value" style={{ color: '#ef4444', fontWeight: '700' }}>
                {currentData.absent}
              </span>
            </div>
            <div className="summary-stat">
              <span className="summary-label">Attendance Percentage</span>
              <span className="summary-value" style={{ color: getPercentageColor(currentData.percentage), fontWeight: '700', fontSize: '28px' }}>
                {currentData.percentage}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Attendance Log */}
      {currentData.records && currentData.records.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Attendance Details</h2>
          </div>
          <div className="attendance-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {currentData.records.map((record, index) => (
                  <tr key={record.id || index}>
                    <td>
                      {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>{record.courseName || record.courseId || 'General'}</td>
                    <td>
                      <span
                        className={`badge badge-${record.status === 'present' ? 'success' : 'danger'}`}
                      >
                        {record.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </td>
                    <td>{record.remarks || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Data Message */}
      {(!currentData.records || currentData.records.length === 0) && (
        <div className="card">
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <h3>No Attendance Records</h3>
            <p>Attendance data will appear here once your instructor marks it.</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Legend & Information</h2>
        </div>
        <div className="attendance-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#10b981' }}></span>
            <span className="legend-text"><strong>Present:</strong> You attended the class</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#ef4444' }}></span>
            <span className="legend-text"><strong>Absent:</strong> You missed the class</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#10b981' }}></span>
            <span className="legend-text"><strong>85%+ Attendance:</strong> Excellent - No concerns</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#f59e0b' }}></span>
            <span className="legend-text"><strong>75-84% Attendance:</strong> Good - Try to improve</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#ef4444' }}></span>
            <span className="legend-text"><strong>Below 75% Attendance:</strong> Poor - May affect grades</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRegister;
