// API service for handling backend operations with MySQL database

const API_BASE = "http://localhost:8085/api";

// Simple network helpers
const networkPost = async (path, payload) => {
  const url = `${API_BASE}${path}`;
  const token = localStorage.getItem("token");
  const resp = await fetch(url, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => resp.statusText);
    throw new Error(text || `HTTP ${resp.status}`);
  }
  return await resp.json();
};

const networkGet = async (path) => {
  const url = `${API_BASE}${path}`;
  const token = localStorage.getItem("token");
  const resp = await fetch(url, {
    headers: {
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => resp.statusText);
    throw new Error(text || `HTTP ${resp.status}`);
  }
  return await resp.json();
};

const networkPut = async (path, payload) => {
  const url = `${API_BASE}${path}`;
  const token = localStorage.getItem("token");
  const resp = await fetch(url, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => resp.statusText);
    throw new Error(text || `HTTP ${resp.status}`);
  }
  return await resp.json();
};

const networkDelete = async (path) => {
  const url = `${API_BASE}${path}`;
  const token = localStorage.getItem("token");
  const resp = await fetch(url, { 
    method: "DELETE",
    headers: {
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    }
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => resp.statusText);
    throw new Error(text || `HTTP ${resp.status}`);
  }
  return await resp.json();
};

// Initialize default data in localStorage
// Only initialize empty arrays for caching - NO hardcoded data
// All real data must be fetched from the backend database
const initializeData = () => {
  if (!localStorage.getItem("erp_assignments")) {
    localStorage.setItem("erp_assignments", JSON.stringify([]));
  }
  if (!localStorage.getItem("erp_student_marks")) {
    localStorage.setItem("erp_student_marks", JSON.stringify([]));
  }
  if (!localStorage.getItem("erp_submissions")) {
    localStorage.setItem("erp_submissions", JSON.stringify([]));
  }
  if (!localStorage.getItem("erp_attendance")) {
    localStorage.setItem("erp_attendance", JSON.stringify([]));
  }
  if (!localStorage.getItem("erp_courses")) {
    localStorage.setItem("erp_courses", JSON.stringify([]));
  }
  if (!localStorage.getItem("erp_announcements")) {
    localStorage.setItem("erp_announcements", JSON.stringify([]));
  }
  if (!localStorage.getItem("erp_borrowings")) {
    localStorage.setItem("erp_borrowings", JSON.stringify([]));
  }
  // NOTE: Users, students, faculty, and transactions must be fetched from backend
  // DO NOT initialize hardcoded data here
};

initializeData();

// ============================================
// TEACHER API PATHS
// ============================================

export const TeacherAPI = {
  // Create Assignment
  createAssignment: (assignmentData) => {
    try {
      return networkPost('/teacher/assignments/create', assignmentData);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Network-first create assignment (tries localhost then falls back)
  createAssignmentNetwork: async (assignmentData) => {
    try {
      return await networkPost('/teacher/assignments/create', assignmentData);
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Get All Assignments for a teacher's course
  getAssignments: (courseId) => {
    try {
      return networkGet(`/teacher/assignments/${courseId}`);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update Assignment
  updateAssignment: (assignmentId, updateData) => {
    try {
      const assignments = JSON.parse(localStorage.getItem("erp_assignments")) || [];
      const index = assignments.findIndex((a) => a.id === assignmentId);
      if (index > -1) {
        assignments[index] = { ...assignments[index], ...updateData };
        localStorage.setItem("erp_assignments", JSON.stringify(assignments));
        return { success: true, data: assignments[index] };
      }
      return { success: false, error: "Assignment not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete Assignment
  deleteAssignment: (assignmentId) => {
    try {
      return networkDelete(`/teacher/assignments/${assignmentId}`);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get submissions for an assignment (teacher)
  getSubmissions: (assignmentId) => {
    try {
      return networkGet(`/teacher/assignments/${assignmentId}/submissions`);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  verifySubmission: (submissionId) => {
    try {
      return networkPut(`/teacher/submissions/${submissionId}/verify`, {});
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Post Student Marks
  postStudentMarks: (marksData) => {
    try {
      return networkPost('/teacher/marks/post', marksData);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Network-first post marks
  postStudentMarksNetwork: async (marksData) => {
    try {
      return await networkPost('/teacher/marks/post', marksData);
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Get Student Marks
  getStudentMarks: (courseId, studentId = null) => {
    try {
      const allMarks = JSON.parse(localStorage.getItem("erp_student_marks")) || [];
      let filtered = allMarks.filter((m) => m.courseId === courseId);
      if (studentId) {
        filtered = filtered.filter((m) => m.studentId === studentId);
      }
      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Mark Attendance
  markAttendance: (attendanceData) => {
    try {
      return networkPost('/attendance', attendanceData);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Network-first mark attendance
  markAttendanceNetwork: async (attendanceData) => {
    try {
      return await networkPost('/attendance', attendanceData);
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Get Attendance
  getAttendance: (courseId, studentId = null) => {
    try {
      const allAttendance = JSON.parse(localStorage.getItem("erp_attendance")) || [];
      let filtered = allAttendance.filter((a) => a.courseId === courseId);
      if (studentId) {
        filtered = filtered.filter((a) => a.studentId === studentId);
      }
      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Mark Batch Attendance for a class
  markBatchAttendance: async (classAttendanceData) => {
    try {
      // Reformat payload for backend /api/attendance/bulk
      // Backend expects: { date: "...", records: [{ studentId, status, remarks }] }
      const payload = {
        courseId: classAttendanceData[0]?.courseId,
        date: classAttendanceData[0]?.date || new Date().toISOString().split('T')[0],
        records: classAttendanceData.map(record => ({
          studentId: record.studentId,
          status: record.status.toUpperCase(),
          remarks: record.remarks || ""
        }))
      };
      const response = await networkPost('/attendance/bulk', payload);
      return { ...response, success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Search attendance for a class on a date (for editing)
  searchAttendance: async (date, courseCode) => {
    try {
      return await networkGet(`/attendance/search?date=${date}&courseCode=${courseCode}`);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Attendance Summary by Class
  getAttendanceSummary: (courseId, semester = null) => {
    try {
      const allAttendance = JSON.parse(localStorage.getItem("erp_attendance")) || [];
      let filtered = allAttendance.filter((a) => a.courseId === courseId);
      if (semester) {
        filtered = filtered.filter((a) => a.semester === semester);
      }
      
      const byStudent = {};
      filtered.forEach((record) => {
        if (!byStudent[record.studentId]) {
          byStudent[record.studentId] = { present: 0, absent: 0, total: 0 };
        }
        byStudent[record.studentId].total += 1;
        if (record.status === "present") {
          byStudent[record.studentId].present += 1;
        } else {
          byStudent[record.studentId].absent += 1;
        }
      });
      
      // Calculate percentages
      const summary = {};
      Object.keys(byStudent).forEach((studentId) => {
        const stat = byStudent[studentId];
        summary[studentId] = {
          ...stat,
          percentage: ((stat.present / stat.total) * 100).toFixed(2)
        };
      });
      
      return { success: true, data: summary };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create Announcement
  createAnnouncement: (announcementData) => {
    try {
      const announcements = JSON.parse(localStorage.getItem("erp_announcements")) || [];
      const newAnnouncement = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...announcementData,
      };
      announcements.push(newAnnouncement);
      localStorage.setItem("erp_announcements", JSON.stringify(announcements));
      return { success: true, data: newAnnouncement };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Announcements
  getAnnouncements: (courseId = null) => {
    try {
      const announcements = JSON.parse(localStorage.getItem("erp_announcements")) || [];
      let filtered = announcements;
      if (courseId) {
        filtered = announcements.filter((a) => a.courseId === courseId);
      }
      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// STUDENT API PATHS
// ============================================

export const StudentAPI = {
  // Get Student Results by Semester
  getResultsBySemester: (studentId, semester) => {
    try {
      const allMarks = JSON.parse(localStorage.getItem("erp_student_marks")) || [];
      const results = allMarks.filter((m) => m.studentId === studentId && m.semester === semester);
      return { success: true, data: results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Student CGPA
  getStudentCGPA: (studentId) => {
    try {
      const allMarks = JSON.parse(localStorage.getItem("erp_student_marks")) || [];
      const studentMarks = allMarks.filter((m) => m.studentId === studentId);

      if (studentMarks.length === 0) {
        return { success: true, data: { cgpa: 0, sgpa: 0 } };
      }

      const totalMarks = studentMarks.reduce((sum, m) => sum + (m.marks || 0), 0);
      const cgpa = (totalMarks / studentMarks.length / 25).toFixed(2);

      return { success: true, data: { cgpa: parseFloat(cgpa), totalMarks, courseCount: studentMarks.length } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Student Assignments
  getStudentAssignments: (studentId, courseId = null) => {
    try {
      const assignments = JSON.parse(localStorage.getItem("erp_assignments")) || [];
      let filtered = assignments;
      if (courseId) {
        filtered = assignments.filter((a) => a.courseId === courseId);
      }
      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Submit Assignment
  submitAssignment: (submissionData) => {
    try {
      const submissions = JSON.parse(localStorage.getItem("erp_submissions")) || [];
      const newSubmission = {
        id: Date.now().toString(),
        submittedAt: new Date().toISOString(),
        status: "submitted",
        ...submissionData,
      };
      submissions.push(newSubmission);
      localStorage.setItem("erp_submissions", JSON.stringify(submissions));
      return { success: true, data: newSubmission };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Student Attendance
  getStudentAttendance: (studentId, courseId = null) => {
    try {
      const allAttendance = JSON.parse(localStorage.getItem("erp_attendance")) || [];
      let filtered = allAttendance.filter((a) => a.studentId === studentId);
      if (courseId) {
        filtered = filtered.filter((a) => a.courseId === courseId);
      }
      const presentCount = filtered.filter((a) => a.status === "present").length;
      const absentCount = filtered.filter((a) => a.status === "absent").length;
      const percentage = filtered.length > 0 ? ((presentCount / filtered.length) * 100).toFixed(2) : 0;

      return {
        success: true,
        data: { attendance: filtered, presentCount, absentCount, percentage, totalClasses: filtered.length },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Network-first export schedule (server may return generated file or a URL)
  exportScheduleNetwork: async (studentId, payload = {}) => {
    try {
      const path = `/students/${studentId}/export/schedule`;
      const res = await networkPost(path, payload);
      return { success: true, data: res };
    } catch (err) {
      notifyBackendUnreachable(err);
      return { success: false, error: err?.message || String(err) };
    }
  },

  // Network-first get student attendance
  getStudentAttendanceNetwork: async (studentId, courseId = null) => {
    try {
      const path = courseId ? `/students/${studentId}/attendance?courseId=${courseId}` : `/students/${studentId}/attendance`;
      const res = await networkGet(path);
      return { success: true, data: res };
    } catch (err) {
      console.error('Network getStudentAttendance failed:', err.message);
      alert(`Unable to reach backend at ${API_BASE} — using local mock.\nError: ${err.message}`);
      return StudentAPI.getStudentAttendance(studentId, courseId);
    }
  },

  // Get Student Attendance Summary by Semester
  getAttendanceBySemester: (studentId, semester) => {
    try {
      const allAttendance = JSON.parse(localStorage.getItem("erp_attendance")) || [];
      const filtered = allAttendance.filter((a) => a.studentId === studentId && a.semester === semester);
      const presentCount = filtered.filter((a) => a.status === "present").length;
      const absentCount = filtered.filter((a) => a.status === "absent").length;
      const percentage = filtered.length > 0 ? ((presentCount / filtered.length) * 100).toFixed(2) : 0;

      return {
        success: true,
        data: {
          semester,
          totalClasses: filtered.length,
          presentCount,
          absentCount,
          percentage: parseFloat(percentage),
          attendanceDetails: filtered
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Attendance Statistics by Course
  getAttendanceByCourseSemester: (studentId, courseId, semester) => {
    try {
      const allAttendance = JSON.parse(localStorage.getItem("erp_attendance")) || [];
      const filtered = allAttendance.filter((a) => a.studentId === studentId && a.courseId === courseId && a.semester === semester);
      const presentCount = filtered.filter((a) => a.status === "present").length;
      const absentCount = filtered.filter((a) => a.status === "absent").length;
      const percentage = filtered.length > 0 ? ((presentCount / filtered.length) * 100).toFixed(2) : 0;

      return {
        success: true,
        data: {
          courseId,
          semester,
          totalClasses: filtered.length,
          presentCount,
          absentCount,
          percentage: parseFloat(percentage),
          attendanceLog: filtered
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get All Attendance for Report
  getAttendanceReport: async (studentId) => {
    try {
      return await networkGet(`/attendance/my-report`);
    } catch (error) {
      console.error("Error fetching attendance report:", error);
      return { success: false, message: "Failed to fetch attendance report" };
    }
  },

  // Get Announcements
  getAnnouncements: () => {
    try {
      const announcements = JSON.parse(localStorage.getItem("erp_announcements")) || [];
      return { success: true, data: announcements };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// ADMIN API PATHS
// ============================================

export const AdminAPI = {
  // Get All Students
  getAllStudents: () => {
    try {
      return networkGet('/admin/students');
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add Student
  addStudent: (studentData) => {
    try {
      return networkPost('/admin/students', studentData);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update Student
  updateStudent: (studentId, updateData) => {
    try {
      const students = JSON.parse(localStorage.getItem("erp_students")) || [];
      const index = students.findIndex((s) => s.id === studentId);
      if (index > -1) {
        students[index] = { ...students[index], ...updateData };
        localStorage.setItem("erp_students", JSON.stringify(students));
        return { success: true, data: students[index] };
      }
      return { success: false, error: "Student not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete Student
  deleteStudent: (studentId) => {
    try {
      const students = JSON.parse(localStorage.getItem("erp_students")) || [];
      const filtered = students.filter((s) => s.id !== studentId);
      localStorage.setItem("erp_students", JSON.stringify(filtered));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get All Teachers
  getAllTeachers: () => {
    try {
      const teachers = JSON.parse(localStorage.getItem("erp_teachers")) || [];
      return { success: true, data: teachers };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add Teacher
  addTeacher: (teacherData) => {
    try {
      const teachers = JSON.parse(localStorage.getItem("erp_teachers")) || [];
      const newTeacher = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...teacherData,
      };
      teachers.push(newTeacher);
      localStorage.setItem("erp_teachers", JSON.stringify(teachers));
      return { success: true, data: newTeacher };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get All Courses (accessible to all authenticated users including teachers)
  getAllCourses: async () => {
    try {
      const res = await networkGet('/courses');
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  listCourses: async () => {
    try {
      const res = await networkGet('/admin/courses');
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create Course
  createCourse: async (courseData) => {
    try {
      const res = await networkPost('/admin/courses/create', courseData);
      return { success: true, data: res.data || res.course || res };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Network-first create course
  createCourseNetwork: async (courseData) => {
    try {
      const res = await networkPost('/admin/courses/create', courseData);
      return { success: true, data: res.data || res.course || res };
    } catch (err) {
      console.error('Backend unavailable, falling back to local admin create', err.message);
      return AdminAPI.createCourse(courseData);
    }
  },

  // Update Course (backend)
  updateCourse: async (courseId, updateData) => {
    try {
      const res = await networkPost('/admin/courses/update', { id: courseId, ...updateData });
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Network-first update course
  updateCourseNetwork: async (courseId, updateData) => {
    try {
      const res = await networkPost('/admin/courses/update', { id: courseId, ...updateData });
      return { success: true, data: res.data || res };
    } catch (err) {
      console.error('Backend unavailable, falling back to local admin update', err.message);
      const courses = JSON.parse(localStorage.getItem('erp_courses')) || [];
      const index = courses.findIndex((c) => (c.id === courseId || c.code === courseId));
      if (index > -1) {
        courses[index] = { ...courses[index], ...updateData, updatedAt: new Date().toISOString() };
        localStorage.setItem('erp_courses', JSON.stringify(courses));
        return { success: true, data: courses[index] };
      }
      return { success: false, error: 'Course not found' };
    }
  },

  // Delete Course (backend)
  deleteCourse: async (courseId) => {
    try {
      const res = await networkPost('/admin/courses/delete', { id: courseId });
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Network-first delete course
  deleteCourseNetwork: async (courseId) => {
    try {
      const res = await networkPost('/admin/courses/delete', { id: courseId });
      return { success: true, data: res.data || res };
    } catch (err) {
      console.error('Backend unavailable, falling back to local admin delete', err.message);
      const courses = JSON.parse(localStorage.getItem('erp_courses')) || [];
      const filtered = courses.filter((c) => !(c.id === courseId || c.code === courseId));
      localStorage.setItem('erp_courses', JSON.stringify(filtered));
      return { success: true };
    }
  },

  // Get System Statistics
  getSystemStats: async () => {
    try {
      return await networkGet('/dashboard/admin/stats');
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get System Health
  getSystemHealth: () => {
    try {
      return {
        success: true,
        data: {
          serverStatus: "Online",
          databaseStatus: "Healthy",
          uptime: "99.8%",
          users: "3,210",
          lastChecked: new Date().toISOString(),
        },
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Admin Enroll Student in Course
  adminEnrollStudent: async (studentId, courseId) => {
    try {
      return await networkPost('/enrollments/admin/register', { studentId, courseId });
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create Student with User Account
  addStudentWithAccount: async (studentData) => {
    try {
      const res = await networkPost('/admin/students/create-with-account', {
        ...studentData,
        defaultPassword: '123456'
      });
      return { success: true, data: res.data || res };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// COMMON API PATHS
// ============================================

export const CommonAPI = {
  // Get User Profile
  getUserProfile: (userId) => {
    try {
      const user = {
        id: userId,
        username: localStorage.getItem("uniERPUser") ? JSON.parse(localStorage.getItem("uniERPUser")).username : "User",
        email: `${userId}@kluniversity.in`,
        role: JSON.parse(localStorage.getItem("uniERPUser")).role || "student",
      };
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Dashboard Data
  getDashboardData: (role, userId) => {
    try {
      if (role === "admin") {
        return AdminAPI.getSystemStats();
      } else if (role === "teacher") {
        return { success: true, data: { courses: 3, students: 124 } };
      } else {
        return { success: true, data: { enrolledCourses: 5, cgpa: 3.48 } };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Search
  search: (query, type = "all") => {
    try {
      const results = {};

      if (type === "all" || type === "students") {
        const students = JSON.parse(localStorage.getItem("erp_students")) || [];
        results.students = students.filter((s) => s.name?.toLowerCase().includes(query.toLowerCase()));
      }

      if (type === "all" || type === "teachers") {
        const teachers = JSON.parse(localStorage.getItem("erp_teachers")) || [];
        results.teachers = teachers.filter((t) => t.name?.toLowerCase().includes(query.toLowerCase()));
      }

      if (type === "all" || type === "courses") {
        const courses = JSON.parse(localStorage.getItem("erp_courses")) || [];
        results.courses = courses.filter((c) => c.name?.toLowerCase().includes(query.toLowerCase()));
      }

      return { success: true, data: results };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // -----------------------------
  // Duplicate Attendance endpoints (wrapper aliases)
  // These provide alternate "backend" entry points that delegate to StudentAPI
  // -----------------------------
  // Get Attendance Report (duplicate path)
  getAttendanceReport: async (studentId) => {
    try {
      return await StudentAPI.getAttendanceReport(studentId);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Attendance By Semester (duplicate path)
  getAttendanceBySemester: (studentId, semester) => {
    try {
      return StudentAPI.getAttendanceBySemester(studentId, semester);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Attendance By Course & Semester (duplicate path)
  getAttendanceByCourseSemester: (studentId, courseId, semester) => {
    try {
      return StudentAPI.getAttendanceByCourseSemester(studentId, courseId, semester);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// LIBRARY API PATHS
// ============================================

export const LibraryAPI = {
  // Get All Borrowing Records
  getBorrowings: () => {
    try {
      const borrowings = JSON.parse(localStorage.getItem("erp_borrowings")) || [];
      return { success: true, data: borrowings };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Specific Borrowing Record
  getBorrowingRecord: (borrowingId) => {
    try {
      const borrowings = JSON.parse(localStorage.getItem("erp_borrowings")) || [];
      const record = borrowings.find((b) => b.id === borrowingId);
      if (record) {
        return { success: true, data: record };
      }
      return { success: false, error: "Borrowing record not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create Borrowing Record
  createBorrowing: (borrowingData) => {
    try {
      const borrowings = JSON.parse(localStorage.getItem("erp_borrowings")) || [];
      const newBorrowing = {
        id: `BOR${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...borrowingData,
      };
      borrowings.push(newBorrowing);
      localStorage.setItem("erp_borrowings", JSON.stringify(borrowings));
      return { success: true, data: newBorrowing };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update Borrowing Record (e.g., for returning books, updating status)
  updateBorrowing: (borrowingId, updateData) => {
    try {
      const borrowings = JSON.parse(localStorage.getItem("erp_borrowings")) || [];
      const index = borrowings.findIndex((b) => b.id === borrowingId);
      if (index > -1) {
        borrowings[index] = { 
          ...borrowings[index], 
          ...updateData,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem("erp_borrowings", JSON.stringify(borrowings));
        return { success: true, data: borrowings[index] };
      }
      return { success: false, error: "Borrowing record not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete Borrowing Record
  deleteBorrowing: (borrowingId) => {
    try {
      const borrowings = JSON.parse(localStorage.getItem("erp_borrowings")) || [];
      const filtered = borrowings.filter((b) => b.id !== borrowingId);
      localStorage.setItem("erp_borrowings", JSON.stringify(filtered));
      return { success: true, message: "Borrowing record deleted successfully" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Borrowing Records by Student
  getBorrowingsByStudent: (studentId) => {
    try {
      const borrowings = JSON.parse(localStorage.getItem("erp_borrowings")) || [];
      const filtered = borrowings.filter((b) => b.studentId === studentId);
      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Overdue Books
  getOverdueBooks: () => {
    try {
      const borrowings = JSON.parse(localStorage.getItem("erp_borrowings")) || [];
      const today = new Date();
      const overdue = borrowings.filter((b) => {
        const dueDate = new Date(b.dueDate);
        return dueDate < today && b.status !== "Returned";
      });
      return { success: true, data: overdue };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// USER MANAGEMENT API PATHS
// ============================================

export const UserManagementAPI = {
  // Get All Users from Backend Database
  getAllUsers: async () => {
    try {
      const response = await networkGet("/admin/students/all-users");
      return { success: true, data: response.data || response };
    } catch (error) {
      console.error("Error fetching users:", error);
      return { success: false, error: error.message };
    }
  },

  // Get Specific User from Backend
  getUser: async (userId) => {
    try {
      const response = await networkGet(`/admin/students/${userId}`);
      return { success: true, data: response };
    } catch (error) {
      console.error("Error fetching user:", error);
      return { success: false, error: "User not found" };
    }
  },

  // Create New User in Backend Database
  createUser: async (userData) => {
    try {
      // Prepare request payload
      const nameParts = userData.fullName ? userData.fullName.trim().split(" ") : [];
      const firstName = nameParts.length > 0 ? nameParts[0] : userData.username;
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "User";
      
      const payload = {
        username: userData.username,
        email: userData.email,
        password: "123456", // Default password for new users
        firstName: firstName,
        lastName: lastName, // Never allow blank - use "User" as default
        role: (userData.role || "Faculty").toUpperCase() // Default to Faculty
      };

      console.log("Creating user with payload:", payload);

      // Call backend register endpoint to create user
      const response = await networkPost("/auth/register", payload);
      
      if (response.success || response.user) {
        return { 
          success: true, 
          data: {
            id: response.user?.id,
            username: response.user?.username || userData.username,
            fullName: userData.fullName,
            email: userData.email,
            role: userData.role || "Faculty",
            status: userData.status || 'Active',
            lastLogin: null
          }
        };
      }
      return { success: false, error: response.message || "Failed to create user" };
    } catch (error) {
      console.error("Error creating user:", error);
      return { success: false, error: error.message };
    }
  },

  // Update User in Backend Database
  updateUser: async (userId, updateData) => {
    try {
      const response = await networkPut(`/admin/students/${userId}`, updateData);
      return { success: true, data: response };
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete User from Backend Database
  deleteUser: async (userId) => {
    try {
      const response = await networkDelete(`/admin/students/${userId}`);
      return { success: true, message: "User deleted successfully" };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, error: error.message };
    }
  },

  // Get Users by Role from Backend
  getUsersByRole: async (role) => {
    try {
      const response = await networkGet(`/admin/students/role/${role}`);
      return { success: true, data: response.data || response };
    } catch (error) {
      console.error("Error fetching users by role:", error);
      return { success: false, error: error.message };
    }
  },

  // Get Active Users from Backend
  getActiveUsers: async () => {
    try {
      const response = await networkGet("/admin/students/status/active");
      return { success: true, data: response.data || response };
    } catch (error) {
      console.error("Error fetching active users:", error);
      return { success: false, error: error.message };
    }
  },

  // Deactivate User in Backend
  deactivateUser: async (userId) => {
    try {
      return await UserManagementAPI.updateUser(userId, { status: 'Inactive' });
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Activate User in Backend
  activateUser: async (userId) => {
    try {
      return await UserManagementAPI.updateUser(userId, { status: 'Active' });
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// FACULTY MANAGEMENT API
// ============================================

export const FacultyAPI = {
  // Get All Faculty
  getAllFaculty: () => {
    try {
      const faculty = JSON.parse(localStorage.getItem("erp_faculty")) || [];
      return { success: true, data: faculty };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Specific Faculty
  getFaculty: (facultyId) => {
    try {
      const faculty = JSON.parse(localStorage.getItem("erp_faculty")) || [];
      const member = faculty.find((f) => f.id === facultyId);
      if (member) {
        return { success: true, data: member };
      }
      return { success: false, error: "Faculty member not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create Faculty
  addFaculty: (facultyData) => {
    try {
      const faculty = JSON.parse(localStorage.getItem("erp_faculty")) || [];
      const newFaculty = {
        id: `F${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...facultyData,
      };
      faculty.push(newFaculty);
      localStorage.setItem("erp_faculty", JSON.stringify(faculty));
      return { success: true, data: newFaculty };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update Faculty
  updateFaculty: (facultyId, updateData) => {
    try {
      const faculty = JSON.parse(localStorage.getItem("erp_faculty")) || [];
      const index = faculty.findIndex((f) => f.id === facultyId);
      if (index > -1) {
        faculty[index] = {
          ...faculty[index],
          ...updateData,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem("erp_faculty", JSON.stringify(faculty));
        return { success: true, data: faculty[index] };
      }
      return { success: false, error: "Faculty member not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete Faculty
  deleteFaculty: (facultyId) => {
    try {
      const faculty = JSON.parse(localStorage.getItem("erp_faculty")) || [];
      const filtered = faculty.filter((f) => f.id !== facultyId);
      localStorage.setItem("erp_faculty", JSON.stringify(filtered));
      return { success: true, message: "Faculty member deleted successfully" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Faculty by Department
  getFacultyByDepartment: (department) => {
    try {
      const faculty = JSON.parse(localStorage.getItem("erp_faculty")) || [];
      const filtered = faculty.filter((f) => f.department === department);
      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// FINANCE & TRANSACTION API
// ============================================

export const FinanceAPI = {
  // Get All Transactions
  getAllTransactions: () => {
    try {
      const transactions = JSON.parse(localStorage.getItem("erp_transactions")) || [];
      return { success: true, data: transactions };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Specific Transaction
  getTransaction: (transactionId) => {
    try {
      const transactions = JSON.parse(localStorage.getItem("erp_transactions")) || [];
      const transaction = transactions.find((t) => t.id === transactionId);
      if (transaction) {
        return { success: true, data: transaction };
      }
      return { success: false, error: "Transaction not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create Transaction
  addTransaction: (transactionData) => {
    try {
      const transactions = JSON.parse(localStorage.getItem("erp_transactions")) || [];
      const newTransaction = {
        id: `TXN${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...transactionData,
      };
      transactions.push(newTransaction);
      localStorage.setItem("erp_transactions", JSON.stringify(transactions));
      return { success: true, data: newTransaction };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update Transaction
  updateTransaction: (transactionId, updateData) => {
    try {
      const transactions = JSON.parse(localStorage.getItem("erp_transactions")) || [];
      const index = transactions.findIndex((t) => t.id === transactionId);
      if (index > -1) {
        transactions[index] = {
          ...transactions[index],
          ...updateData,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem("erp_transactions", JSON.stringify(transactions));
        return { success: true, data: transactions[index] };
      }
      return { success: false, error: "Transaction not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Delete Transaction
  deleteTransaction: (transactionId) => {
    try {
      const transactions = JSON.parse(localStorage.getItem("erp_transactions")) || [];
      const filtered = transactions.filter((t) => t.id !== transactionId);
      localStorage.setItem("erp_transactions", JSON.stringify(filtered));
      return { success: true, message: "Transaction deleted successfully" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Transactions by Status
  getTransactionsByStatus: (status) => {
    try {
      const transactions = JSON.parse(localStorage.getItem("erp_transactions")) || [];
      const filtered = transactions.filter((t) => t.status === status);
      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Transactions by Student
  getTransactionsByStudent: (studentId) => {
    try {
      const transactions = JSON.parse(localStorage.getItem("erp_transactions")) || [];
      const filtered = transactions.filter((t) => t.studentId === studentId);
      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get Financial Summary
  getFinancialSummary: () => {
    try {
      const transactions = JSON.parse(localStorage.getItem("erp_transactions")) || [];
      const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      const paid = transactions.filter((t) => t.status === 'Paid').reduce((sum, t) => sum + (t.amount || 0), 0);
      const pending = transactions.filter((t) => t.status === 'Pending').reduce((sum, t) => sum + (t.amount || 0), 0);
      const overdue = transactions.filter((t) => t.status === 'Overdue').reduce((sum, t) => sum + (t.amount || 0), 0);

      return {
        success: true,
        data: {
          totalRevenue,
          paid,
          pending,
          overdue,
          totalTransactions: transactions.length,
          paidTransactions: transactions.filter((t) => t.status === 'Paid').length,
          pendingTransactions: transactions.filter((t) => t.status === 'Pending').length,
          overdueTransactions: transactions.filter((t) => t.status === 'Overdue').length,
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

export default {
  TeacherAPI,
  StudentAPI,
  AdminAPI,
  CommonAPI,
  LibraryAPI,
  UserManagementAPI,
  FacultyAPI,
  FinanceAPI,
};
