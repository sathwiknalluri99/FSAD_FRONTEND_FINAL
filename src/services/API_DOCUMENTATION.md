/**
 * API PATHS DOCUMENTATION
 * 
 * This document describes all available API paths that work like a backend system.
 * Even though it's built with localStorage for now, it follows RESTful conventions.
 */

export const API_DOCUMENTATION = {
  // ============================================
  // TEACHER API PATHS
  // ============================================
  TEACHER: {
    ASSIGNMENTS: {
      CREATE: {
        method: "POST",
        path: "/api/teacher/assignments/create",
        description: "Create a new assignment",
        params: {
          courseId: "string - Course ID",
          title: "string - Assignment title",
          description: "string - Assignment description",
          dueDate: "ISO string - Due date and time",
          totalMarks: "number - Total marks for assignment",
        },
        example: "TeacherAPI.createAssignment({ courseId: 'CS101', ... })",
      },
      GET: {
        method: "GET",
        path: "/api/teacher/assignments/:courseId",
        description: "Get all assignments for a course",
        params: {
          courseId: "string - Course ID",
        },
        example: "TeacherAPI.getAssignments('CS101')",
      },
      UPDATE: {
        method: "PUT",
        path: "/api/teacher/assignments/:assignmentId",
        description: "Update an existing assignment",
        params: {
          assignmentId: "string - Assignment ID",
          updateData: "object - Fields to update",
        },
        example: "TeacherAPI.updateAssignment('ASSIGN001', { title: 'New Title' })",
      },
      DELETE: {
        method: "DELETE",
        path: "/api/teacher/assignments/:assignmentId",
        description: "Delete an assignment",
        params: {
          assignmentId: "string - Assignment ID",
        },
        example: "TeacherAPI.deleteAssignment('ASSIGN001')",
      },
    },
    MARKS: {
      POST: {
        method: "POST",
        path: "/api/teacher/marks/post",
        description: "Post marks for a student",
        params: {
          courseId: "string - Course ID",
          studentId: "string - Student ID",
          type: "string - Type (assignment, quiz, midterm, final, project)",
          marks: "number - Marks obtained",
          totalMarks: "number - Total marks",
          semester: "number - Semester number",
          description: "string - Remarks/feedback",
        },
        example: "TeacherAPI.postStudentMarks({ courseId: 'CS101', studentId: 'STU001', ... })",
      },
      GET: {
        method: "GET",
        path: "/api/teacher/marks/:courseId",
        description: "Get marks for a course or specific student",
        params: {
          courseId: "string - Course ID",
          studentId: "string (optional) - Specific student ID",
        },
        example: "TeacherAPI.getStudentMarks('CS101', 'STU001')",
      },
    },
    ATTENDANCE: {
      MARK: {
        method: "POST",
        path: "/api/teacher/attendance/mark",
        description: "Mark attendance for students",
        params: {
          courseId: "string - Course ID",
          studentId: "string - Student ID",
          date: "ISO string - Date of class",
          status: "string - present, absent, or late",
        },
        example: "TeacherAPI.markAttendance({ courseId: 'CS101', ... })",
      },
      GET: {
        method: "GET",
        path: "/api/teacher/attendance/:courseId",
        description: "Get attendance records",
        params: {
          courseId: "string - Course ID",
          studentId: "string (optional) - Specific student",
        },
        example: "TeacherAPI.getAttendance('CS101')",
      },
    },
    ANNOUNCEMENTS: {
      CREATE: {
        method: "POST",
        path: "/api/teacher/announcements/create",
        description: "Create announcement for students",
        params: {
          courseId: "string - Course ID",
          title: "string - Announcement title",
          description: "string - Announcement details",
          priority: "string - low, medium, high",
        },
        example: "TeacherAPI.createAnnouncement({ ... })",
      },
      GET: {
        method: "GET",
        path: "/api/teacher/announcements/:courseId",
        description: "Get announcements",
        example: "TeacherAPI.getAnnouncements('CS101')",
      },
    },
  },

  // ============================================
  // STUDENT API PATHS
  // ============================================
  STUDENT: {
    RESULTS: {
      BY_SEMESTER: {
        method: "GET",
        path: "/api/student/results/:semester",
        description: "Get results for a specific semester",
        params: {
          studentId: "string - Student ID",
          semester: "number - Semester number",
        },
        example: "StudentAPI.getResultsBySemester('STU001', 1)",
      },
      CGPA: {
        method: "GET",
        path: "/api/student/cgpa",
        description: "Get student CGPA and SGPA",
        params: {
          studentId: "string - Student ID",
        },
        example: "StudentAPI.getStudentCGPA('STU001')",
      },
    },
    ASSIGNMENTS: {
      GET: {
        method: "GET",
        path: "/api/student/assignments",
        description: "Get assigned assignments",
        params: {
          studentId: "string - Student ID",
          courseId: "string (optional) - Filter by course",
        },
        example: "StudentAPI.getStudentAssignments('STU001', 'CS101')",
      },
      SUBMIT: {
        method: "POST",
        path: "/api/student/assignments/submit",
        description: "Submit an assignment",
        params: {
          assignmentId: "string - Assignment ID",
          courseId: "string - Course ID",
          studentId: "string - Student ID",
          filePath: "string - File path or URL",
          remarks: "string - Submission remarks",
        },
        example: "StudentAPI.submitAssignment({ ... })",
      },
    },
    ATTENDANCE: {
      GET: {
        method: "GET",
        path: "/api/student/attendance",
        description: "Get student attendance",
        params: {
          studentId: "string - Student ID",
          courseId: "string (optional) - Filter by course",
        },
        example: "StudentAPI.getStudentAttendance('STU001', 'CS101')",
      },
    },
    ANNOUNCEMENTS: {
      GET: {
        method: "GET",
        path: "/api/student/announcements",
        description: "Get announcements",
        example: "StudentAPI.getAnnouncements()",
      },
    },
  },

  // ============================================
  // LIBRARY API PATHS
  // ============================================
  LIBRARY: {
    BORROWINGS: {
      GET_ALL: {
        method: "GET",
        path: "/api/library/borrowings",
        description: "Get all borrowing records",
        example: "LibraryAPI.getBorrowings()",
      },
      GET_ONE: {
        method: "GET",
        path: "/api/library/borrowings/:borrowingId",
        description: "Get a specific borrowing record",
        params: {
          borrowingId: "string - Borrowing ID",
        },
        example: "LibraryAPI.getBorrowingRecord('BOR1234567890')",
      },
      CREATE: {
        method: "POST",
        path: "/api/library/borrowings/create",
        description: "Create a new borrowing record",
        params: {
          bookTitle: "string - Title of the book",
          borrower: "string - Name of borrower",
          borrowDate: "ISO string - Date when book was borrowed",
          dueDate: "ISO string - Due date for returning",
          status: "string - Active, Due Soon, or Overdue",
        },
        example: "LibraryAPI.createBorrowing({ bookTitle: 'Algorithms', ... })",
      },
      UPDATE: {
        method: "PUT",
        path: "/api/library/borrowings/:borrowingId",
        description: "Update a borrowing record (e.g., mark as returned)",
        params: {
          borrowingId: "string - Borrowing ID",
          updateData: "object - Fields to update",
        },
        example: "LibraryAPI.updateBorrowing('BOR1234567890', { status: 'Returned' })",
      },
      DELETE: {
        method: "DELETE",
        path: "/api/library/borrowings/:borrowingId",
        description: "Delete a borrowing record",
        params: {
          borrowingId: "string - Borrowing ID",
        },
        example: "LibraryAPI.deleteBorrowing('BOR1234567890')",
      },
    },
    STUDENT_BORROWINGS: {
      GET: {
        method: "GET",
        path: "/api/library/borrowings/student/:studentId",
        description: "Get all borrowing records for a student",
        params: {
          studentId: "string - Student ID",
        },
        example: "LibraryAPI.getBorrowingsByStudent('STU001')",
      },
    },
    OVERDUE_BOOKS: {
      GET: {
        method: "GET",
        path: "/api/library/overdue",
        description: "Get all overdue books",
        example: "LibraryAPI.getOverdueBooks()",
      },
    },
  },

  // ============================================
  // ADMIN API PATHS
  // ============================================
  ADMIN: {
    STUDENTS: {
      GET_ALL: {
        method: "GET",
        path: "/api/admin/students",
        description: "Get all students",
        example: "AdminAPI.getAllStudents()",
      },
      ADD: {
        method: "POST",
        path: "/api/admin/students/add",
        description: "Add a new student",
        params: {
          name: "string - Student name",
          email: "string - Email address",
          rollNumber: "string - Roll number",
          enrollmentDate: "ISO string - Enrollment date",
        },
        example: "AdminAPI.addStudent({ name: 'John Doe', ... })",
      },
      UPDATE: {
        method: "PUT",
        path: "/api/admin/students/:studentId",
        description: "Update student information",
        params: {
          studentId: "string - Student ID",
          updateData: "object - Fields to update",
        },
        example: "AdminAPI.updateStudent('STU001', { status: 'inactive' })",
      },
      DELETE: {
        method: "DELETE",
        path: "/api/admin/students/:studentId",
        description: "Delete a student",
        example: "AdminAPI.deleteStudent('STU001')",
      },
    },
    TEACHERS: {
      GET_ALL: {
        method: "GET",
        path: "/api/admin/teachers",
        description: "Get all teachers",
        example: "AdminAPI.getAllTeachers()",
      },
      ADD: {
        method: "POST",
        path: "/api/admin/teachers/add",
        description: "Add a new teacher",
        params: {
          name: "string - Teacher name",
          email: "string - Email address",
          department: "string - Department",
          qualification: "string - Qualification",
        },
        example: "AdminAPI.addTeacher({ name: 'Dr. Jane Smith', ... })",
      },
    },
    COURSES: {
      GET_ALL: {
        method: "GET",
        path: "/api/admin/courses",
        description: "Get all courses",
        example: "AdminAPI.getAllCourses()",
      },
      CREATE: {
        method: "POST",
        path: "/api/admin/courses/create",
        description: "Create a new course",
        params: {
          code: "string - Course code",
          name: "string - Course name",
          credits: "number - Credit hours",
          semester: "number - Semester",
          instructorId: "string - Instructor ID",
        },
        example: "AdminAPI.createCourse({ code: 'CS101', ... })",
      },
    },
    SYSTEM: {
      STATS: {
        method: "GET",
        path: "/api/admin/system/stats",
        description: "Get system statistics",
        example: "AdminAPI.getSystemStats()",
      },
      HEALTH: {
        method: "GET",
        path: "/api/admin/system/health",
        description: "Check system health",
        example: "AdminAPI.getSystemHealth()",
      },
    },
  },

  // ============================================
  // COMMON API PATHS (All Roles)
  // ============================================
  COMMON: {
    PROFILE: {
      GET: {
        method: "GET",
        path: "/api/user/profile/:userId",
        description: "Get user profile",
        example: "CommonAPI.getUserProfile('STU001')",
      },
    },
    DASHBOARD: {
      GET: {
        method: "GET",
        path: "/api/dashboard",
        description: "Get dashboard data (role-specific)",
        params: {
          role: "string - admin, teacher, or student",
          userId: "string - User ID",
        },
        example: "CommonAPI.getDashboardData('teacher', 'TEACH001')",
      },
    },
    SEARCH: {
      GET: {
        method: "GET",
        path: "/api/search",
        description: "Search across system",
        params: {
          query: "string - Search query",
          type: "string - students, teachers, courses, or all",
        },
        example: "CommonAPI.search('john', 'students')",
      },
    },
  },

  // ============================================
  // USER MANAGEMENT API PATHS
  // ============================================
  USER_MANAGEMENT: {
    USERS: {
      GET_ALL: {
        method: "GET",
        path: "/api/user-management/users",
        description: "Get all users",
        example: "UserManagementAPI.getAllUsers()",
      },
      GET_ONE: {
        method: "GET",
        path: "/api/user-management/users/:userId",
        description: "Get a specific user",
        params: {
          userId: "string - User ID",
        },
        example: "UserManagementAPI.getUser('USR001')",
      },
      CREATE: {
        method: "POST",
        path: "/api/user-management/users/create",
        description: "Create a new user",
        params: {
          username: "string - Unique username",
          fullName: "string - User's full name",
          email: "string - Email address",
          role: "string - Administrator, Faculty, Registrar, or Student",
          status: "string - Active or Inactive",
        },
        example: "UserManagementAPI.createUser({ username: 'jdoe', ... })",
      },
      UPDATE: {
        method: "PUT",
        path: "/api/user-management/users/:userId",
        description: "Update user information",
        params: {
          userId: "string - User ID",
          updateData: "object - Fields to update",
        },
        example: "UserManagementAPI.updateUser('USR001', { role: 'Registrar' })",
      },
      DELETE: {
        method: "DELETE",
        path: "/api/user-management/users/:userId",
        description: "Delete a user",
        params: {
          userId: "string - User ID",
        },
        example: "UserManagementAPI.deleteUser('USR001')",
      },
    },
    ROLES: {
      GET_BY_ROLE: {
        method: "GET",
        path: "/api/user-management/users/role/:role",
        description: "Get users by role",
        params: {
          role: "string - Role name (Administrator, Faculty, Registrar, Student)",
        },
        example: "UserManagementAPI.getUsersByRole('Faculty')",
      },
    },
    STATUS: {
      GET_ACTIVE: {
        method: "GET",
        path: "/api/user-management/users/status/active",
        description: "Get all active users",
        example: "UserManagementAPI.getActiveUsers()",
      },
      DEACTIVATE: {
        method: "PUT",
        path: "/api/user-management/users/:userId/deactivate",
        description: "Deactivate a user",
        params: {
          userId: "string - User ID",
        },
        example: "UserManagementAPI.deactivateUser('USR001')",
      },
      ACTIVATE: {
        method: "PUT",
        path: "/api/user-management/users/:userId/activate",
        description: "Activate a user",
        params: {
          userId: "string - User ID",
        },
        example: "UserManagementAPI.activateUser('USR001')",
      },
    },
  },

  // ============================================
  // FACULTY API PATHS
  // ============================================
  FACULTY: {
    MANAGEMENT: {
      GET_ALL: {
        method: "GET",
        path: "/api/faculty/all",
        description: "Get all faculty members",
        example: "FacultyAPI.getAllFaculty()",
      },
      GET_BY_ID: {
        method: "GET",
        path: "/api/faculty/:facultyId",
        description: "Get a specific faculty member",
        params: {
          facultyId: "string - Faculty ID",
        },
        example: "FacultyAPI.getFaculty('FAC001')",
      },
      CREATE: {
        method: "POST",
        path: "/api/faculty/create",
        description: "Create a new faculty member",
        params: {
          name: "string - Faculty name (required)",
          email: "string - Faculty email (required)",
          department: "string - Department name (required)",
          position: "string - Job position (required)",
          qualification: "string - Academic qualification (required)",
          phone: "string - Faculty phone (required)",
          status: "string - Status: Active, On Leave, Inactive (default: Active)",
        },
        example: "FacultyAPI.addFaculty({ name: 'Dr. John Smith', email: 'john@example.com', ... })",
      },
      UPDATE: {
        method: "PUT",
        path: "/api/faculty/:facultyId",
        description: "Update faculty member information",
        params: {
          facultyId: "string - Faculty ID",
          updateData: "object - Fields to update",
        },
        example: "FacultyAPI.updateFaculty('FAC001', { position: 'Associate Professor' })",
      },
      DELETE: {
        method: "DELETE",
        path: "/api/faculty/:facultyId",
        description: "Delete a faculty member",
        params: {
          facultyId: "string - Faculty ID",
        },
        example: "FacultyAPI.deleteFaculty('FAC001')",
      },
    },
    DEPARTMENT: {
      GET_BY_DEPARTMENT: {
        method: "GET",
        path: "/api/faculty/department/:departmentName",
        description: "Get faculty members by department",
        params: {
          departmentName: "string - Department name",
        },
        example: "FacultyAPI.getFacultyByDepartment('Computer Science')",
      },
    },
  },

  // ============================================
  // FINANCE API PATHS
  // ============================================
  FINANCE: {
    TRANSACTIONS: {
      GET_ALL: {
        method: "GET",
        path: "/api/finance/transactions",
        description: "Get all financial transactions",
        example: "FinanceAPI.getAllTransactions()",
      },
      GET_BY_ID: {
        method: "GET",
        path: "/api/finance/transactions/:transactionId",
        description: "Get a specific transaction",
        params: {
          transactionId: "string - Transaction ID",
        },
        example: "FinanceAPI.getTransaction('TXN001')",
      },
      CREATE: {
        method: "POST",
        path: "/api/finance/transactions/create",
        description: "Create a new transaction",
        params: {
          student: "string - Student name (required)",
          studentId: "string - Student ID",
          type: "string - Transaction type: Tuition Fee, Library Fine, Exam Fee, Activity Fee, Hostel Fee, Lab Fee (required)",
          amount: "number - Transaction amount in dollars (required)",
          date: "string - Transaction date (ISO format)",
          status: "string - Transaction status: Paid, Pending, Overdue (default: Pending)",
          description: "string - Transaction description",
        },
        example: "FinanceAPI.addTransaction({ student: 'John Doe', type: 'Tuition Fee', amount: 5000, ... })",
      },
      UPDATE: {
        method: "PUT",
        path: "/api/finance/transactions/:transactionId",
        description: "Update a transaction",
        params: {
          transactionId: "string - Transaction ID",
          updateData: "object - Fields to update",
        },
        example: "FinanceAPI.updateTransaction('TXN001', { status: 'Paid' })",
      },
      DELETE: {
        method: "DELETE",
        path: "/api/finance/transactions/:transactionId",
        description: "Delete a transaction",
        params: {
          transactionId: "string - Transaction ID",
        },
        example: "FinanceAPI.deleteTransaction('TXN001')",
      },
    },
    SUMMARY: {
      GET_SUMMARY: {
        method: "GET",
        path: "/api/finance/summary",
        description: "Get financial summary statistics",
        returns: {
          totalRevenue: "number - Total revenue from all transactions",
          paid: "number - Total paid transactions",
          pending: "number - Total pending transactions",
          overdue: "number - Total overdue transactions",
        },
        example: "FinanceAPI.getFinancialSummary()",
      },
    },
  },
};

export default API_DOCUMENTATION;
