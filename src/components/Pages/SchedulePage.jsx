import React, { useState, useEffect } from 'react';
import { StudentAPI } from '../../services/api';

const SchedulePage = ({ user }) => {
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [selectedMonth, setSelectedMonth] = useState('October');
  const [scheduleData, setScheduleData] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Parse schedule string like "Mon & Wed 9:00 AM - 10:30 AM" into structured data
  const parseSchedule = (scheduleStr) => {
    if (!scheduleStr) return null;
    
    try {
      // Extract days and time
      const dayTimeRegex = /(Mon|Tue|Wed|Thu|Fri|Saturday|Sunday)(?:\s*&\s*(Mon|Tue|Wed|Thu|Fri|Saturday|Sunday))?\s+(\d{1,2}:\d{2}\s*(?:AM|PM))\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i;
      const match = scheduleStr.match(dayTimeRegex);
      
      if (!match) return null;
      
      const days = [match[1]];
      if (match[2]) days.push(match[2]);
      const timeSlot = `${match[3]} - ${match[4]}`;
      
      return { days, timeSlot };
    } catch (e) {
      console.error('Error parsing schedule:', e);
      return null;
    }
  };

  // Build schedule data from enrolled courses
  const buildScheduleData = (courses) => {
    const timeSlots = {};
    
    // Group courses by time slot
    courses.forEach(course => {
      const parsed = parseSchedule(course.schedule);
      if (parsed) {
        const { days, timeSlot } = parsed;
        
        if (!timeSlots[timeSlot]) {
          timeSlots[timeSlot] = {
            time: timeSlot,
            events: [
              { day: 'Monday', course: null },
              { day: 'Tuesday', course: null },
              { day: 'Wednesday', course: null },
              { day: 'Thursday', course: null },
              { day: 'Friday', course: null }
            ]
          };
        }
        
        days.forEach(day => {
          const dayObj = timeSlots[timeSlot].events.find(e => e.day.toLowerCase().startsWith(day.toLowerCase()));
          if (dayObj) {
            dayObj.course = course.courseCode || course.courseName;
            dayObj.room = course.room || 'TBA';
            dayObj.instructor = course.instructor || 'TBA';
            dayObj.courseName = course.courseName;
          }
        });
      }
    });
    
    // Convert to array and sort by time
    const sortedSlots = Object.values(timeSlots).sort((a, b) => {
      const timeA = a.time.split('-')[0].trim();
      const timeB = b.time.split('-')[0].trim();
      return timeA.localeCompare(timeB);
    });
    
    return sortedSlots;
  };

  // Fetch enrolled courses and sync timetable
  const fetchAndSyncSchedule = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8086/api/enrollments/my-courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (response.ok) {
        const coursesData = await response.json();
        setEnrolledCourses(coursesData);
        
        // Build dynamic schedule from courses
        const dynamicSchedule = buildScheduleData(coursesData);
        setScheduleData(dynamicSchedule);
        setLastSyncTime(new Date().toLocaleTimeString());
        
        console.log('Schedule synced with enrolled courses:', dynamicSchedule);
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      // Fallback to empty schedule
      setScheduleData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch schedule on component mount
  useEffect(() => {
    fetchAndSyncSchedule();
  }, []);

  const calendarData = [
    { date: 1, events: ['Faculty Meeting - 10:00 AM'], type: 'meeting' },
    { date: 5, events: ['Science Fair - All Day'], type: 'event' },
    { date: 10, events: ['Mid-term Exams Begin'], type: 'exam' },
    { date: 15, events: ['Tuition Due Date'], type: 'deadline' },
    { date: 20, events: ['Parent-Teacher Conference'], type: 'event' },
    { date: 25, events: ['Faculty Development Workshop'], type: 'meeting' },
    { date: 31, events: ['Halloween - No Classes'], type: 'holiday' }
  ];

  const renderCalendar = () => {
    let calendarHTML = [];
    let dayCounter = 1;

    for (let week = 0; week < 6; week++) {
      let weekDays = [];
      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < 1) {
          weekDays.push(<td key={`empty-${day}`} className="empty-day"></td>);
        } else if (dayCounter > 31) {
          weekDays.push(<td key={`empty-end-${day}`} className="empty-day"></td>);
        } else {
          const dayEvents = calendarData.find(d => d.date === dayCounter);
          const isToday = dayCounter === 15;
          
          weekDays.push(
            <td key={`day-${dayCounter}`} className={`calendar-cell ${isToday ? 'today' : ''} ${dayEvents ? 'has-events' : ''}`}>
              <div className="calendar-day-number">{dayCounter}</div>
              {dayEvents && dayEvents.events.map((event, index) => (
                <div key={`event-${dayCounter}-${index}`} className={`calendar-event event-${dayEvents.type}`}>
                  <i className="fa-solid fa-circle" style={{ marginRight: '4px', fontSize: '6px' }}></i>
                  <span>{event}</span>
                </div>
              ))}
            </td>
          );
          dayCounter++;
        }
      }
      calendarHTML.push(<tr key={`week-${week}`}>{weekDays}</tr>);
    }

    return calendarHTML;
  };

  const getCourseColor = (course) => {
    const colors = {
      'MATH101': '#FF6B6B',
      'PHYS201': '#4ECDC4',
      'COMP301': '#45B7D1',
      'ENGL101': '#FFA07A',
      'HIST202': '#98D8C8',
      'CHEM102': '#F7DC6F'
    };
    return colors[course] || '#4F46E5';
  };

  const handleExport = async () => {
    if (!user || !user.username) {
      alert('Please log in to export your schedule.');
      return;
    }

    // Try network-first export
    try {
      const payload = { scheduleData, calendarData };
      const res = await StudentAPI.exportScheduleNetwork(user.username, payload);
      if (res && res.success && res.data) {
        // If backend returned file content or URL, try to use it
        if (res.data.fileContent) {
          const blob = new Blob([res.data.fileContent], { type: res.data.mimeType || 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${user.username}-schedule.csv`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          return;
        }
        if (res.data.fileUrl) {
          window.open(res.data.fileUrl, '_blank');
          return;
        }
      }
    } catch (err) {
      // continue to local export fallback
    }

    // Local fallback: generate CSV from scheduleData
    try {
      const rows = [['Time', 'Day', 'Course', 'Room', 'Instructor']];
      scheduleData.forEach(slot => {
        slot.events.forEach(ev => {
          rows.push([slot.time, ev.day, ev.course, ev.room, ev.instructor]);
        });
      });
      const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${user.username}-schedule.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      alert('Schedule exported (local CSV).');
    } catch (e) {
      alert('Export failed: ' + (e?.message || e));
    }
  };

  return (
    <div className="schedule-page">
      {/* Header */}
      <div className="schedule-header">
        <div>
          <h1 className="page-title">
            <i className="fa-solid fa-calendar-days"></i> Schedule Management
          </h1>
          <p className="page-subtitle">View and manage class schedules, rooms, and timetables</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="schedule-stats">
        <div className="stat-item">
          <i className="fa-solid fa-clock"></i>
          <div>
            <h4>Classes Per Week</h4>
            <p>15 Classes</p>
          </div>
        </div>
        <div className="stat-item">
          <i className="fa-solid fa-door-open"></i>
          <div>
            <h4>Rooms Assigned</h4>
            <p>8 Rooms</p>
          </div>
        </div>
        <div className="stat-item">
          <i className="fa-solid fa-users"></i>
          <div>
            <h4>Total Students</h4>
            <p>542 Students</p>
          </div>
        </div>
        <div className="stat-item">
          <i className="fa-solid fa-person-chalkboard"></i>
          <div>
            <h4>Faculty Members</h4>
            <p>12 Instructors</p>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Card */}
      <div className="schedule-card">
        <div className="schedule-card-header">
          <div>
            <h2>
              <i className="fa-solid fa-table"></i> Weekly Timetable
            </h2>
            <p>{scheduleData.length > 0 ? `${enrolledCourses.length} courses scheduled` : 'No courses enrolled yet'}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              className="btn-export" 
              onClick={fetchAndSyncSchedule}
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
            >
              <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-sync'}`}></i> 
              {loading ? 'Syncing...' : 'Sync Timetable'}
            </button>
            <button className="btn-export" onClick={() => handleExport()}>
              <i className="fa-solid fa-download"></i> Export Schedule
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '24px', marginRight: '10px' }}></i>
            Loading schedule...
          </div>
        ) : scheduleData.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
            <i className="fa-solid fa-calendar-xmark" style={{ fontSize: '48px', marginBottom: '10px', display: 'block' }}></i>
            <p>No courses scheduled. Enroll in courses to see your timetable.</p>
          </div>
        ) : (
        <div className="table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th className="time-column">
                  <i className="fa-solid fa-hourglass-end"></i> Time Slot
                </th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((slot, idx) => (
                <tr key={idx} className="schedule-row">
                  <td className="time-slot">
                    <div className="time-badge">{slot.time}</div>
                  </td>
                  {slot.events.map((event, eventIdx) => {
                    const bgColor = getCourseColor(event.course);
                    return (
                      <td key={eventIdx} className="course-cell">
                        <div className="course-card" style={{ borderLeftColor: bgColor }}>
                          <div className="course-code">{event.course}</div>
                          <div className="course-room">
                            <i className="fa-solid fa-location-dot"></i> {event.room}
                          </div>
                          <div className="course-instructor">
                            <i className="fa-solid fa-user-tie"></i> {event.instructor}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        <div className="table-footer">
          <small>Last synced: {lastSyncTime ? lastSyncTime : 'Not synced yet'}</small>
          {user?.role?.toLowerCase() !== 'student' && (
            <button className="btn-edit">
              <i className="fa-solid fa-pen"></i> Edit Schedule
            </button>
          )}
        </div>
      </div>

      {/* Calendar Card */}
      <div className="schedule-card">
        <div className="schedule-card-header">
          <div>
            <h2>
              <i className="fa-solid fa-calendar-alt"></i> Academic Calendar
            </h2>
            <p>2023-24 Academic Year</p>
          </div>
          <div className="legend">
            <span><i className="fa-circle" style={{color: '#FF6B6B'}}></i> Exams</span>
            <span><i className="fa-circle" style={{color: '#FFA07A'}}></i> Events</span>
            <span><i className="fa-circle" style={{color: '#F7DC6F'}}></i> Deadline</span>
          </div>
        </div>

        <div className="calendar-wrapper">
          <table className="calendar-table">
            <thead>
              <tr>
                <th>Sun</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
              </tr>
            </thead>
            <tbody>
              {renderCalendar()}
            </tbody>
          </table>
        </div>

        <div className="calendar-footer">
          <button className="btn-prev">
            <i className="fa-solid fa-chevron-left"></i> Previous
          </button>
          <span className="current-month">Current Month</span>
          <button className="btn-next">
            Next <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;