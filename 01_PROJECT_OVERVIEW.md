# Attendance Management System --- Project Overview

## Project Goal

Build a professional College Attendance Management System using the MERN
stack. It will have Admin, Teacher, and Student roles.

Attendance status rules: - **75% or above:** Green / Good - **50% to
below 75%:** Red / Low - **Below 50%:** Black / Critical

The project must be clean, modular, responsive, secure, and easy to
explain in a college viva.

## Technology

### Frontend

React, Vite, JavaScript only, Tailwind CSS, React Router DOM, Axios,
React Hook Form, Zod, Recharts, Lucide React, Framer Motion, React Hot
Toast, Context API.

### Backend

Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, dotenv, cors,
helmet, morgan, Zod, Nodemon.

## Roles

### Admin

Full access to dashboard, students, teachers, departments, classes,
subjects, attendance, reports, analytics, corrections, filters and
exports.

### Teacher

Access only to assigned classes/subjects; can view students, mark
attendance, view history, and edit attendance where authorized.

### Student

Can view only their own dashboard, overall attendance, subject-wise
attendance, history, present/absent statistics, status, and optional
attendance requirement calculation.

## Attendance Formula

`Attendance Percentage = (Present Classes / Total Conducted Classes) × 100`

``` text
percentage >= 75       -> GREEN / GOOD
percentage >= 50       -> RED / LOW
percentage < 50        -> BLACK / CRITICAL
```

The backend is the source of truth for attendance calculations. Never
trust a percentage sent by the frontend.

## Important Data Design

Do not store attendance as only `student -> attended -> percentage`.

Use individual attendance records connected to: - Student - Class -
Subject - Teacher - Date - Status

This supports date-wise, subject-wise, class-wise and monthly reporting.

## Real BCA-III Dataset

The supplied report is from Nalanda College, Biharsharif (Nalanda),
BCA-III (Hons).

-   Students: 120
-   Total classes engaged by faculty: 179
-   Period: 07-05-2026 to 21-08-2026
-   Fields: Roll No, Candidate Name, Father Name, Classes Attended,
    Percentage, Remarks

The user's real BCA-III data is the primary seed/demo dataset.

Examples from the report: - MD HUZAIFA: 79 attended, 44% - SUMIT KUMAR:
172 attended, 96% - AKASH KUMAR: 169 attended, 94%

The supplied report is aggregate data, not a complete date-wise
subject-wise attendance log. Do not invent historical daily records and
call them real.

## Demo Data

Create realistic demo data for other BCA and MCA classes. Keep academic
structure configurable.

Example BCA: - BCA-I - BCA-II - BCA-III

Example MCA: - MCA-I - MCA-II

Demo teachers, subjects and attendance can be generated.

## Coding Rules

-   JavaScript only; no TypeScript.
-   Keep frontend and backend separate.
-   Use reusable components.
-   Avoid huge files.
-   Avoid duplicate business logic.
-   Validate on frontend and backend.
-   Never store plaintext passwords.
-   Never hard-code secrets.
-   Use environment variables.
-   Use centralized error handling.
-   Use role-based authorization.
-   Tailwind is the main styling system.
-   Lucide React is the main icon system.
-   Use subtle professional animations.
-   Do not mix Bootstrap, Chakra UI and Reactstrap unnecessarily.

## Development Method

Build in multiple phases, not as one huge code dump.

For every phase: 1. Explain the goal. 2. Explain concepts and why they
are needed. 3. Show file/folder changes. 4. Give complete code. 5.
Explain code line by line. 6. Explain data flow. 7. Give run/test
commands. 8. Explain common errors. 9. Give viva/interview questions.
10. Give a completion checklist.

The assistant should behave like a teacher/coach, helping the learner
understand every part of the implementation.
