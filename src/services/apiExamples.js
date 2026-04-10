/**
 * API USAGE EXAMPLES FOR ALL ROLES
 * This file demonstrates how to use the backend-like API system
 */

import { TeacherAPI, StudentAPI, AdminAPI, CommonAPI } from "./api";

// ============================================
// TEACHER API EXAMPLES
// ============================================

export const TeacherAPIExamples = {
  // POST - Create an assignment
  createAssignment: () => {
    const result = TeacherAPI.createAssignment({
      courseId: "CS101",
      title: "Chapter 5 Exercises",
      description: "Solve all problems from chapter 5",
      dueDate: "2026-03-15T23:59:00",
      totalMarks: 10,
    });
    console.log("Create Assignment:", result);
  },

  // GET - Fetch all assignments for a course
  getAssignments: () => {
    const result = TeacherAPI.getAssignments("CS101");
    console.log("Get Assignments:", result);
  },

  // PUT - Update an assignment
  updateAssignment: () => {
    const result = TeacherAPI.updateAssignment("assignment_id_here", {
      title: "Updated Title",
      dueDate: "2026-03-20T23:59:00",
    });
    console.log("Update Assignment:", result);
  },

  // DELETE - Delete an assignment
  deleteAssignment: () => {
    const result = TeacherAPI.deleteAssignment("assignment_id_here");
    console.log("Delete Assignment:", result);
  },

  // POST - Post student marks
  postStudentMarks: () => {
    const result = TeacherAPI.postStudentMarks({
      courseId: "CS101",
      studentId: "STU001",
      studentName: "John Doe",
      type: "assignment", // assignment, quiz, midterm, final, project
      marks: 8.5,
      totalMarks: 10,
      semester: 1,
      description: "Good work! Keep it up.",
    });
    console.log("Post Marks:", result);
  },

  // GET - Get student marks for a course
  getStudentMarks: () => {
    const result = TeacherAPI.getStudentMarks("CS101", "STU001");
    console.log("Get Student Marks:", result);
  },

  // POST - Mark attendance
  markAttendance: () => {
    const result = TeacherAPI.markAttendance({
      courseId: "CS101",
      studentId: "STU001",
      studentName: "John Doe",
      date: new Date().toISOString(),
      status: "present", // present, absent, late
    });
    console.log("Mark Attendance:", result);
  },

  // GET - Get attendance
  getAttendance: () => {
    const result = TeacherAPI.getAttendance("CS101");
    console.log("Get Attendance:", result);
  },

  // POST - Create announcement
  createAnnouncement: () => {
    const result = TeacherAPI.createAnnouncement({
      courseId: "CS101",
      title: "Class Postponed",
      description: "Tomorrow's class is postponed to next week",
      priority: "high",
    });
    console.log("Create Announcement:", result);
  },

  // GET - Get announcements
  getAnnouncements: () => {
    const result = TeacherAPI.getAnnouncements("CS101");
    console.log("Get Announcements:", result);
  },
};

// ============================================
// STUDENT API EXAMPLES
// ============================================

export const StudentAPIExamples = {
  // GET - Get results for a specific semester
  getResultsBySemester: () => {
    const result = StudentAPI.getResultsBySemester("STU001", 1);
    console.log("Results Semester 1:", result);
  },

  // GET - Get student CGPA
  getStudentCGPA: () => {
    const result = StudentAPI.getStudentCGPA("STU001");
    console.log("Student CGPA:", result);
  },

  // GET - Get student assignments
  getStudentAssignments: () => {
    const result = StudentAPI.getStudentAssignments("STU001", "CS101");
    console.log("Student Assignments:", result);
  },

  // POST - Submit assignment
  submitAssignment: () => {
    const result = StudentAPI.submitAssignment({
      assignmentId: "ASSIGN001",
      courseId: "CS101",
      studentId: "STU001",
      filePath: "/path/to/submission.pdf",
      submittedDate: new Date().toISOString(),
      remarks: "Please review my solution",
    });
    console.log("Submit Assignment:", result);
  },

  // GET - Get attendance
  getStudentAttendance: () => {
    const result = StudentAPI.getStudentAttendance("STU001", "CS101");
    console.log("Student Attendance:", result);
  },

  // GET - Get announcements
  getAnnouncements: () => {
    const result = StudentAPI.getAnnouncements();
    console.log("Announcements:", result);
  },
};

// ============================================
// ADMIN API EXAMPLES
// ============================================

export const AdminAPIExamples = {
  // GET - Get all students
  getAllStudents: () => {
    const result = AdminAPI.getAllStudents();
    console.log("All Students:", result);
  },

  // POST - Add a new student
  addStudent: () => {
    const result = AdminAPI.addStudent({
      name: "Jane Smith",
      email: "jane.smith@kluniversity.in",
      rollNumber: "STU0056",
      enrollmentDate: new Date().toISOString(),
      status: "active",
    });
    console.log("Add Student:", result);
  },

  // PUT - Update student information
  updateStudent: () => {
    const result = AdminAPI.updateStudent("STU001", {
      status: "inactive",
      email: "newemail@kluniversity.in",
    });
    console.log("Update Student:", result);
  },

  // DELETE - Delete a student
  deleteStudent: () => {
    const result = AdminAPI.deleteStudent("STU001");
    console.log("Delete Student:", result);
  },

  // GET - Get all teachers
  getAllTeachers: () => {
    const result = AdminAPI.getAllTeachers();
    console.log("All Teachers:", result);
  },

  // POST - Add a new teacher
  addTeacher: () => {
    const result = AdminAPI.addTeacher({
      name: "Dr. John Smith",
      email: "john.smith@kluniversity.in",
      department: "Computer Science",
      qualification: "PhD",
    });
    console.log("Add Teacher:", result);
  },

  // GET - Get all courses
  getAllCourses: () => {
    const result = AdminAPI.getAllCourses();
    console.log("All Courses:", result);
  },

  // POST - Create a new course
  createCourse: () => {
    const result = AdminAPI.createCourse({
      code: "CS101",
      name: "Data Structures & Algorithms",
      credits: 4,
      semester: 1,
      instructorId: "TEACH001",
    });
    console.log("Create Course:", result);
  },

  // GET - System statistics
  getSystemStats: () => {
    const result = AdminAPI.getSystemStats();
    console.log("System Stats:", result);
  },

  // GET - System health check
  getSystemHealth: () => {
    const result = AdminAPI.getSystemHealth();
    console.log("System Health:", result);
  },
};

// ============================================
// COMMON API EXAMPLES
// ============================================

export const CommonAPIExamples = {
  // GET - Get user profile
  getUserProfile: () => {
    const result = CommonAPI.getUserProfile("STU001");
    console.log("User Profile:", result);
  },

  // GET - Get dashboard data (role-specific)
  getDashboardData: () => {
    const role = "teacher"; // or "admin", "student"
    const result = CommonAPI.getDashboardData(role, "USER001");
    console.log("Dashboard Data:", result);
  },

  // GET - Search across system
  search: () => {
    const result = CommonAPI.search("john", "students");
    console.log("Search Results:", result);
  },
};

// ============================================
// USAGE IN REACT COMPONENTS
// ============================================

/**
 * Example: Use TeacherAPI in a React component to create assignment
 * 
 * COMPONENT: CreateAssignmentModal.jsx
 * 
 * import { TeacherAPI } from "../../services/api";
 * 
 * const handleSubmit = (e) => {
 *   e.preventDefault();
 *   
 *   const result = TeacherAPI.createAssignment({
 *     courseId: formData.courseId,
 *     title: formData.title,
 *     description: formData.description,
 *     dueDate: formData.dueDate,
 *     totalMarks: formData.totalMarks,
 *   });
 *   
 *   if (result.success) {
 *     alert("Assignment created successfully!");
 *     // Update state or navigate
 *   } else {
 *     alert("Error: " + result.error);
 *   }
 * };
 */

/**
 * Example: Use StudentAPI in a React component to get CGPA
 * 
 * COMPONENT: StudentDashboard.jsx
 * 
 * import { StudentAPI } from "../../services/api";
 * 
 * useEffect(() => {
 *   const result = StudentAPI.getStudentCGPA("STU001");
 *   if (result.success) {
 *     setCGPA(result.data.cgpa);
 *   }
 * }, []);
 */

/**
 * Example: Use AdminAPI in a React component to get all students
 * 
 * COMPONENT: StudentsPage.jsx
 * 
 * import { AdminAPI } from "../../services/api";
 * 
 * useEffect(() => {
 *   const result = AdminAPI.getAllStudents();
 *   if (result.success) {
 *     setStudents(result.data);
 *   }
 * }, []);
 */

export default {
  TeacherAPIExamples,
  StudentAPIExamples,
  AdminAPIExamples,
  CommonAPIExamples,
};
