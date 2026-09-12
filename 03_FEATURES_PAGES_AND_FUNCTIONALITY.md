# Features, Pages & Functionality

## Authentication

### `/login`

Fields: - Email - Password

Features: - validation - loading state - error handling - role-based
redirect

Redirects: - Admin -\> `/admin/dashboard` - Teacher -\>
`/teacher/dashboard` - Student -\> `/student/dashboard`

# Admin

## `/admin/dashboard`

Show: - Total students - Total teachers - Total departments - Total
classes - Total subjects - Today's attendance - Average attendance - Low
attendance count

Charts: - attendance trend - class-wise attendance - subject-wise
attendance - green/red/black distribution

Widgets: - highest attendance - low attendance - recent attendance
activity

## `/admin/students`

Features: - list - search - filter - pagination - add - edit - delete -
profile - attendance view

Fields: - name - roll number - father name - email - phone -
department - class - semester - session - linked user

## `/admin/teachers`

Features: - list - search - add/edit/delete - assign classes - assign
subjects

## `/admin/departments`

Features: - add - edit - delete - view classes

## `/admin/classes`

Features: - add - edit - delete - department association - students -
subjects

## `/admin/subjects`

Features: - add - edit - delete - assign to class - assign teacher

# Teacher

## `/teacher/dashboard`

Show: - assigned classes - assigned subjects - today's attendance -
recent attendance - class statistics

## `/teacher/attendance`

Workflow:

``` text
Select Class
 -> Select Subject
 -> Select Date
 -> Load Students
 -> Mark Present/Absent
 -> Save
```

Controls: - Mark All Present - Mark All Absent - Reset - Save Attendance

## `/teacher/history`

Filters: - class - subject - date - student

Actions: - view - edit if authorized

# Student

## `/student/dashboard`

Show: - overall percentage - total classes - present - absent - status -
subject cards - attendance trend

## `/student/attendance`

Table: - Subject - Total Classes - Present - Absent - Percentage -
Status

Example:

``` text
DBMS -> 86% -> GREEN
Java -> 74% -> RED
OS -> 48% -> BLACK
```

## `/student/history`

Show: - Date - Subject - Status

Students cannot edit attendance.

# Attendance Rules

``` text
>= 75%       -> Green / Good
50% to <75%  -> Red / Low
< 50%        -> Black / Critical
```

Use a centralized utility/service for this rule.

# Duplicate Protection

The backend must prevent duplicate attendance for the same class,
subject and date/session.

Frontend should show an appropriate message and offer view/edit when
possible.

# Reports

Possible reports: - student report - class report - subject report -
date report - monthly report - overall report

# Low Attendance

Dedicated admin view: - Red: 50% to below 75% - Black: below 50%

Filters: - department - class - subject - percentage range

# Attendance Requirement Calculator

Optional feature: Given current attendance and target attendance,
calculate approximately how many consecutive classes must be attended to
reach the target.

This is a derived calculation and must not modify real attendance
records.

# Search, Filters & Pagination

Students: - name - roll number - class - department

Attendance: - date - class - subject - teacher - status

Use server-side pagination for large lists.

# Reusable UI Components

``` text
Sidebar
Navbar
StatCard
Button
Input
Select
DatePicker
Modal
Table
Badge
ProgressBar
Pagination
SearchBar
FilterPanel
LoadingSkeleton
EmptyState
ErrorState
ConfirmDialog
```

# UX

Must support: - loading - empty - error - success - disabled - hover -
active states

Use toast notifications instead of `alert()`.

# Responsive Design

Support: - desktop - laptop - tablet - mobile

Sidebar should collapse on smaller screens. Tables should have usable
mobile behavior.

# Seed Data

Seed: - admin - teachers - departments - classes - subjects - students -
attendance

The supplied real BCA-III dataset is the primary seed dataset. Other
BCA/MCA data can be realistic generated demo data.

# Export

Optional: - CSV - Excel via ExcelJS - PDF via PDFKit

Do not add UI buttons for features that are not actually implemented.
