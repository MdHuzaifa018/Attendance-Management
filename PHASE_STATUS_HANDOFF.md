# Attendance Management System --- Phase Status & Handoff

## Stack

-   MERN
-   React + Vite
-   JavaScript/JSX
-   Tailwind CSS
-   Node.js
-   Express
-   MongoDB/Mongoose

## Completed

### Phase 1 --- Project Setup & Foundation

COMPLETE

### Phase 2 --- Backend Architecture

COMPLETE

### Phase 3 --- Database & Models

COMPLETE

Models: - User - Department - Class - Student - Teacher - Subject -
Attendance

### Phase 4 --- Authentication & Authorization

COMPLETE

Includes: - bcrypt hashing/comparison - JWT - register - login -
`/api/auth/me` - protect middleware - role middleware - Zod validation -
centralized errors

Auth header:

``` text
Authorization: Bearer <token>
```

Public registration creates students only.

## Current

### Phase 5 --- Admin UI & Dashboard Foundation

IN PROGRESS

Already created:

``` text
frontend/src/services/api.js
frontend/src/context/AuthContext.jsx
frontend/src/routes/ProtectedRoute.jsx
frontend/src/routes/RoleRoute.jsx
frontend/src/App.jsx
frontend/src/main.jsx
```

Current temporary routes:

``` text
/login
/admin/dashboard
/teacher/dashboard
/student/dashboard
/unauthorized
```

## Immediate next work

1.  Real Login page
2.  Register page if required
3.  Loading screen
4.  Admin layout
5.  Teacher layout
6.  Student layout
7.  Login → JWT integration
8.  `/auth/me` refresh persistence
9.  Logout
10. Role redirect
11. Unauthorized handling
12. Test end-to-end
13. Build real Admin Dashboard

## Relationships

``` text
User
 ├── Student
 └── Teacher

Department
 ├── Student
 ├── Teacher
 └── Class

Class
 ├── Student
 └── Subject

Subject
 ├── Teacher
 └── Attendance

Student
 └── Attendance

Teacher
 └── Attendance
```

## Attendance

Formula:

``` text
(Present Classes / Total Conducted Classes) × 100
```

Status:

``` text
>= 75%     → GREEN / Good
50–<75%    → RED / Low
<50%       → BLACK / Critical
```

Unique attendance key:

``` text
student + class + subject + date + session
```

## Real dataset

Nalanda College, Biharsharif (Nalanda) BCA-III (Hons) - 120 students -
179 classes engaged - 07-05-2026 to 21-08-2026 - Roll No, Candidate
Name, Father Name, Classes Attended, Percentage, Remarks

Examples: - MD HUZAIFA --- 79 --- 44% - SUMIT KUMAR --- 172 --- 96% -
AKASH KUMAR --- 169 --- 94%

This is aggregate data. Do not fabricate date-wise historical attendance
and label it real. Generated date-wise data is demo/seed data.

## Environment

``` env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Never commit `.env`.

## Definition of done

A phase is complete only after implementation, startup check, relevant
tests, error handling, responsive check where relevant, no obvious
errors, documentation update and Git checkpoint.

## Learning requirement

The owner wants to understand the project after implementation. Teach
each batch file-by-file with purpose, imports, code blocks, concepts,
data flow, relationships, common mistakes, testing and viva questions.
