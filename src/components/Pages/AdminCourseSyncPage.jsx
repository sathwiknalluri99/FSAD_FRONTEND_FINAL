import React, { useState, useEffect } from 'react';

export default function AdminCourseSyncPage() {
  const [emptyFieldsData, setEmptyFieldsData] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);

  // Check which courses have empty fields
  const checkEmptyFields = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8086/api/courses/admin/check-empty-fields', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEmptyFieldsData(data);
        setSyncStatus(null);
      } else {
        console.error('Failed to check empty fields');
      }
    } catch (error) {
      console.error('Error checking empty fields:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sync and populate empty fields
  const handleSync = async () => {
    setSyncLoading(true);
    try {
      const response = await fetch('http://localhost:8086/api/courses/sync', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSyncStatus(data);
        // Refresh the empty fields check
        checkEmptyFields();
      } else {
        setSyncStatus({
          success: false,
          message: 'Failed to sync courses',
        });
      }
    } catch (error) {
      console.error('Error syncing courses:', error);
      setSyncStatus({
        success: false,
        message: 'Error: ' + error.message,
      });
    } finally {
      setSyncLoading(false);
    }
  };

  useEffect(() => {
    checkEmptyFields();
  }, []);

  return (
    <div className="admin-course-sync-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
          <i className="fa-solid fa-sync-alt"></i> Course Database Sync
        </h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Check and synchronize courses with empty fields. This will populate missing course information with default values.
        </p>
      </div>

      {/* Sync Status Alert */}
      {syncStatus && (
        <div
          style={{
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '6px',
            backgroundColor: syncStatus.success ? '#d4edda' : '#f8d7da',
            border: `1px solid ${syncStatus.success ? '#c3e6cb' : '#f5c6cb'}`,
            color: syncStatus.success ? '#155724' : '#721c24',
          }}
        >
          <strong>
            {syncStatus.success ? '✓ Sync Completed' : '✗ Sync Failed'}
          </strong>
          <p style={{ marginTop: '8px', marginBottom: '0' }}>{syncStatus.message}</p>
          {syncStatus.success && (
            <>
              <p style={{ marginTop: '5px' }}>
                <strong>Total Courses:</strong> {syncStatus.totalCourses}
              </p>
              <p style={{ marginTop: '5px' }}>
                <strong>Updated Courses:</strong> {syncStatus.updatedCourses}
              </p>
            </>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <button
          onClick={checkEmptyFields}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-refresh'}`}></i>
          {loading ? ' Checking...' : ' Check Empty Fields'}
        </button>

        <button
          onClick={handleSync}
          disabled={syncLoading || !emptyFieldsData || emptyFieldsData.coursesWithEmptyFields === 0}
          style={{
            padding: '10px 20px',
            backgroundColor: emptyFieldsData && emptyFieldsData.coursesWithEmptyFields > 0 ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor:
              syncLoading || !emptyFieldsData || emptyFieldsData.coursesWithEmptyFields === 0
                ? 'not-allowed'
                : 'pointer',
            opacity:
              syncLoading || !emptyFieldsData || emptyFieldsData.coursesWithEmptyFields === 0 ? 0.6 : 1,
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          <i className={`fa-solid ${syncLoading ? 'fa-spinner fa-spin' : 'fa-sync'}`}></i>
          {syncLoading ? ' Syncing...' : ' Sync Empty Fields'}
        </button>
      </div>

      {/* Summary Stats */}
      {emptyFieldsData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div
            style={{
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: '#f8f9fa',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Total Courses</h3>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
              {emptyFieldsData.totalCourses}
            </p>
          </div>

          <div
            style={{
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: '#fff3cd',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#856404' }}>Empty Fields Found</h3>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#856404' }}>
              {emptyFieldsData.coursesWithEmptyFields}
            </p>
          </div>

          <div
            style={{
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              backgroundColor: emptyFieldsData.coursesWithEmptyFields === 0 ? '#d4edda' : '#f8f9fa',
            }}
          >
            <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>Status</h3>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: emptyFieldsData.coursesWithEmptyFields === 0 ? '#155724' : '#dc3545' }}>
              {emptyFieldsData.coursesWithEmptyFields === 0 ? '✓ All Complete' : '⚠ Needs Sync'}
            </p>
          </div>
        </div>
      )}

      {/* Courses with Empty Fields Table */}
      {emptyFieldsData && emptyFieldsData.coursesWithEmptyFields > 0 && (
        <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
              Courses with Empty Fields ({emptyFieldsData.coursesWithEmptyFields})
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>
                    Course Code
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>
                    Course Name
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>
                    Empty Fields
                  </th>
                </tr>
              </thead>
              <tbody>
                {emptyFieldsData.courses.map((course, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #ddd', backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#0066cc' }}>
                      {course.courseCode}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px' }}>{course.courseName}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {course.emptyFields.map((field, i) => (
                          <span
                            key={i}
                            style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              backgroundColor: '#ffc107',
                              color: '#000',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500',
                            }}
                          >
                            {field}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Synced Message */}
      {emptyFieldsData && emptyFieldsData.coursesWithEmptyFields === 0 && (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '6px',
            color: '#155724',
          }}
        >
          <i className="fa-solid fa-check-circle" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
          <h2 style={{ margin: '10px 0', fontSize: '20px', fontWeight: 'bold' }}>All Courses Synced</h2>
          <p style={{ margin: '10px 0' }}>All {emptyFieldsData.totalCourses} courses have complete information.</p>
        </div>
      )}

      {/* Info Section */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e7f3ff', border: '1px solid #b3d9ff', borderRadius: '6px' }}>
        <h3 style={{ marginTop: 0, color: '#004085' }}>
          <i className="fa-solid fa-info-circle"></i> How it Works
        </h3>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>The sync process fills empty course fields with default values:</li>
          <li><strong>Description:</strong> "Course: [Course Name]"</li>
          <li><strong>Schedule:</strong> "TBA" (To Be Announced)</li>
          <li><strong>Location:</strong> "TBA"</li>
          <li><strong>Prerequisites:</strong> "None"</li>
          <li><strong>Semester:</strong> "Spring" (if empty)</li>
          <li><strong>Credits:</strong> 3 (if empty/invalid)</li>
          <li><strong>Capacity:</strong> 30 (if empty/invalid)</li>
        </ul>
      </div>
    </div>
  );
}
