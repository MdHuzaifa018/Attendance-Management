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

COMPLETE

Includes:
- Real Login page with credentials validation & dark theme
- Register page for student self-registration
- Unauthorized & 404 pages
- Admin, Teacher, and Student layouts with dynamic sidebar navigation & responsive mobile drawers
- Real Admin Dashboard with quick stats, recent attendance, alerts, and quick actions
- Teacher and Student dashboard foundation

### Phase 6 --- Student Management

COMPLETE

Includes:
- Backend student validators (`student.validator.js`) with Zod schemas for create and update
- Backend student service (`student.service.js`) with pagination, debounced multi-field search (name & roll no), department/class filters, atomic user+student creation, cascade deletion
- Backend student controller (`student.controller.js`) & REST routes (`/api/students`) protected with admin authorization
- Supporting lookup routes for active departments (`/api/departments`) and classes (`/api/classes`)
- Database seed script (`seedData.js`) for departments, classes, and initial BCA-III students
- Frontend `studentService.js` with Axios API integration
- Frontend `StudentFormModal.jsx` featuring React Hook Form + Zod, cascading department-to-class dropdowns, validation errors, and loading states
- Frontend `StudentsPage.jsx` featuring searchable & paginated data table, status badges, edit & delete modals, and empty state
- Full end-to-end browser verification of list, search, modal create, table reflect, and delete confirmation dialog

### Phase 7 --- Teacher Management

COMPLETE

Includes:
- Backend teacher validator (`teacher.validator.js`) with Zod schemas for create and update
- Backend teacher service (`teacher.service.js`) with pagination, debounced multi-field search (name & employeeId), department filter, atomic user+teacher creation, cascade deletion
- Backend teacher controller (`teacher.controller.js`) & REST routes (`/api/teachers`) protected by admin authorization
- Database seed script (`seedTeachers.js`) populating initial faculty members for BCA and MCA departments
- Frontend `teacherService.js` with Axios API integration
- Frontend `TeacherFormModal.jsx` featuring React Hook Form + Zod, department selection, designation options, validation errors, and loading states
- Frontend `TeachersPage.jsx` with search bar, data table, status badges, edit & delete modals, pagination, and empty state
- Full end-to-end browser verification of list, search, modal create, table update, and delete confirmation dialog

## Current

### Phase 8 --- Department & Class Management

READY TO START

Immediate next work:
1. Department Zod validator (`department.validator.js`) & Class Zod validator (`class.validator.js`)
2. Department & Class service layers with full CRUD, validations, and cascading lookups
3. Department & Class controllers & routes (`/api/departments`, `/api/classes`) protected by admin
4. Frontend `departmentService.js` & `classService.js`
5. Departments list page (`DepartmentsPage.jsx`) & Class list page (`ClassesPage.jsx`)
6. Department & Class modals for creation/editing
7. Wire `/admin/departments` and `/admin/classes` in `App.jsx`
8. End-to-end testing and verification

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
