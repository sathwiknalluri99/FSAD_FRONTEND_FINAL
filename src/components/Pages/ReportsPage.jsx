import React from 'react';

const ReportsPage = () => {
  const handleGenerateReport = (reportType) => {
    let reportName = '';
    
    switch(reportType) {
      case 'student-performance':
        reportName = 'Student Performance Report';
        break;
      case 'attendance':
        reportName = 'Attendance Summary';
        break;
      case 'financial':
        reportName = 'Financial Report';
        break;
      case 'faculty-workload':
        reportName = 'Faculty Workload Report';
        break;
      case 'library-usage':
        reportName = 'Library Usage Report';
        break;
      case 'enrollment':
        reportName = 'Enrollment Statistics';
        break;
      default:
        reportName = 'Report';
    }
    
    alert(`${reportName} is being generated...\n\nThis would typically download a PDF file.`);
  };

  return (
    <div id="reports-page" className="page-content active">
      <div className="page-header">
        <h1 className="page-title">📊 Reports & Analytics</h1>
        <p className="page-subtitle">Access institutional reports and performance analytics</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--primary)'}}>
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-info">
            <h3>92%</h3>
            <p>Overall Attendance</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--success)'}}>
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div className="stat-info">
            <h3>87%</h3>
            <p>Pass Rate</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--accent)'}}>
            <i className="fas fa-book-open"></i>
          </div>
          <div className="stat-info">
            <h3>74%</h3>
            <p>Course Completion</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'var(--warning)'}}>
            <i className="fas fa-user-friends"></i>
          </div>
          <div className="stat-info">
            <h3>19:1</h3>
            <p>Student-Teacher Ratio</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Available Reports</h2>
        </div>
        <div className="report-cards">
          <div className="report-card">
            <h4>Student Performance Report</h4>
            <p>Detailed analysis of student grades and progress across all courses and semesters</p>
            <button 
              className="btn btn-primary generate-report-btn" 
              onClick={() => handleGenerateReport('student-performance')}
            >
              <i className="fas fa-download"></i> Generate
            </button>
          </div>
          <div className="report-card">
            <h4>Attendance Summary</h4>
            <p>Monthly attendance reports by class, department, and individual student</p>
            <button 
              className="btn btn-primary generate-report-btn" 
              onClick={() => handleGenerateReport('attendance')}
            >
              <i className="fas fa-download"></i> Generate
            </button>
          </div>
          <div className="report-card">
            <h4>Financial Report</h4>
            <p>Comprehensive overview of tuition, fees, expenses, and financial aid distribution</p>
            <button 
              className="btn btn-primary generate-report-btn" 
              onClick={() => handleGenerateReport('financial')}
            >
              <i className="fas fa-download"></i> Generate
            </button>
          </div>
          <div className="report-card">
            <h4>Faculty Workload</h4>
            <p>Teaching assignments, course loads, and faculty utilization analysis</p>
            <button 
              className="btn btn-primary generate-report-btn" 
              onClick={() => handleGenerateReport('faculty-workload')}
            >
              <i className="fas fa-download"></i> Generate
            </button>
          </div>
          <div className="report-card">
            <h4>Library Usage Report</h4>
            <p>Analysis of book circulation, popular titles, and library resource utilization</p>
            <button 
              className="btn btn-primary generate-report-btn" 
              onClick={() => handleGenerateReport('library-usage')}
            >
              <i className="fas fa-download"></i> Generate
            </button>
          </div>
          <div className="report-card">
            <h4>Enrollment Statistics</h4>
            <p>Student enrollment trends by department, program, and demographic data</p>
            <button 
              className="btn btn-primary generate-report-btn" 
              onClick={() => handleGenerateReport('enrollment')}
            >
              <i className="fas fa-download"></i> Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;