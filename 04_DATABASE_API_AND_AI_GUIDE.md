# Database, API & AI Coding Guide

## Purpose

This document is persistent context for AI coding assistants helping
with the project.

Before generating or modifying code, read the project documentation and
preserve the established stack, folder structure, naming conventions,
attendance rules and database relationships.

Do not make major architecture changes silently.

# Database Collections

Recommended collections:

``` text
users
students
teachers
departments
classes
subjects
attendance
```

# User

Conceptual fields:

``` text
name
email
password
role
isActive
createdAt
updatedAt
```

Roles:

``` text
admin
teacher
student
```

Passwords must be hashed.

# Student

Conceptual fields:

``` text
name
rollNumber
fatherName
email
phone
department
class
semester
session
user
createdAt
updatedAt
```

# Teacher

Conceptual fields:

``` text
name
email
phone
department
assignedClasses
assignedSubjects
user
createdAt
updatedAt
```

# Department

``` text
name
code
description
createdAt
updatedAt
```

Examples: - BCA - MCA

# Class

``` text
name
department
year
semester
section
session
createdAt
updatedAt
```

Examples: - BCA-I - BCA-II - BCA-III - MCA-I - MCA-II

Academic structure should remain configurable.

# Subject

``` text
name
code
department
semester
createdAt
updatedAt
```

A subject should be associated with its academic/class context.

# Attendance

Core fields:

``` text
student
class
subject
teacher
date
status
markedAt
createdAt
updatedAt
```

Initial statuses: - Present - Absent

Optional future statuses: - Late - Leave

Only implement extra statuses when their rules are defined.

# Attendance Calculation

``` text
percentage = (present / total) * 100
```

Status:

``` text
percentage >= 75 -> green / good
percentage >= 50 -> red / low
percentage < 50 -> black / critical
```

Boundary cases:

``` text
75      -> GREEN
74.99   -> RED
50      -> RED
49.99   -> BLACK
0       -> BLACK
100     -> GREEN
```

Use consistent rounding.

The backend is the source of truth.

# Attendance Utility

Suggested file:

``` text
backend/utils/attendanceCalculator.js
```

Possible functions: - calculatePercentage() - getAttendanceStatus() -
getAttendanceLabel() - getAttendanceSummary()

# API

## Authentication

``` text
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

## Students

``` text
GET    /api/students
GET    /api/students/:id
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id
```

Possible query parameters:

``` text
?page=1
&limit=10
&search=rahul
&classId=...
&departmentId=...
```

## Teachers

``` text
GET    /api/teachers
GET    /api/teachers/:id
POST   /api/teachers
PUT    /api/teachers/:id
DELETE /api/teachers/:id
```

## Departments

``` text
GET    /api/departments
GET    /api/departments/:id
POST   /api/departments
PUT    /api/departments/:id
DELETE /api/departments/:id
```

## Classes

``` text
GET    /api/classes
GET    /api/classes/:id
POST   /api/classes
PUT    /api/classes/:id
DELETE /api/classes/:id
```

## Subjects

``` text
GET    /api/subjects
GET    /api/subjects/:id
POST   /api/subjects
PUT    /api/subjects/:id
DELETE /api/subjects/:id
```

## Attendance

``` text
POST /api/attendance/mark
GET  /api/attendance
GET  /api/attendance/:id
PUT  /api/attendance/:id
GET  /api/attendance/student/:studentId
GET  /api/attendance/class/:classId
GET  /api/attendance/subject/:subjectId
```

## Reports

``` text
GET /api/reports/overview
GET /api/reports/student/:studentId
GET /api/reports/class/:classId
GET /api/reports/subject/:subjectId
```

Exact endpoint design may be refined during implementation, but naming
and conventions must remain consistent.

# Frontend Services

Keep API calls out of large page components.

``` text
frontend/src/services/
├── api.js
├── authService.js
├── studentService.js
├── teacherService.js
├── departmentService.js
├── classService.js
├── subjectService.js
├── attendanceService.js
└── reportService.js
```

Use one centralized Axios instance.

# Security

Protected endpoints use authentication middleware.

Role-specific endpoints additionally use role middleware.

Never rely only on hiding frontend buttons; backend authorization must
enforce permissions.

# API Response Convention

Success:

``` json
{
  "success": true,
  "message": "Student created successfully",
  "data": {}
}
```

Error:

``` json
{
  "success": false,
  "message": "Student not found"
}
```

# AI Coding Rules

1.  Use JavaScript only.
2.  Preserve MERN architecture.
3.  Preserve the established folder structure.
4.  Do not create random folders or duplicate modules.
5.  Keep files focused and reasonably sized.
6.  Centralize attendance calculation/status logic.
7.  Validate input on the backend.
8.  Never hard-code secrets.
9.  Never store plaintext passwords.
10. Explain every significant code change.
11. Do not break existing features without discussing the impact.
12. Test affected functionality after changes.
13. Ask before making major architecture/database/authentication
    changes.
14. Distinguish real user-provided data from generated demo data.
15. Do not invent historical daily attendance records from aggregate
    reports.

# Teaching Rules for AI

The user is learning MERN while building the project.

For each coding phase, provide:

``` text
1. Goal
2. Concept
3. Why it is needed
4. Folder/file changes
5. Commands
6. Complete code
7. Line-by-line explanation
8. Data flow
9. Testing
10. Common errors
11. Viva/interview questions
12. Practice task
13. Completion checklist
```

Do not merely paste code. Explain the concepts like a teacher/coach.
