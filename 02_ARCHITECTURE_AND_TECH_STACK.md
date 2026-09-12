# Architecture & Technology Stack

## High-Level Architecture

``` text
User
  |
  v
React + Vite Frontend
  |
 Axios / REST API
  |
  v
Node.js + Express Backend
  |
 Mongoose
  |
  v
MongoDB / MongoDB Atlas
```

## Frontend Structure

``` text
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── attendance/
│   │   ├── students/
│   │   └── ui/
│   ├── context/
│   ├── hooks/
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   ├── TeacherLayout.jsx
│   │   └── StudentLayout.jsx
│   ├── pages/
│   │   ├── auth/
│   │   ├── admin/
│   │   ├── teacher/
│   │   └── student/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## Backend Structure

``` text
backend/
├── config/
│   └── db.js
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── validators/
├── utils/
├── seed/
├── .env
├── server.js
└── package.json
```

## Frontend Packages

### React

Main UI library. Used for reusable components and pages.

### Vite

Fast development/build tool for React.

### React Router DOM

Client-side routing for login, admin, teacher and student pages.

### Tailwind CSS

Primary styling system for layout, cards, tables, forms, responsive
design and states.

### Axios

HTTP client for React-to-Express API communication. Use one centralized
Axios instance.

### React Hook Form

Form state and submission management for login and CRUD forms.

### Zod

Schema validation for form/input data.

### Recharts

Dashboard charts such as attendance trends, class statistics and
attendance distribution.

### Lucide React

Consistent icon system.

### Framer Motion

Subtle animations for pages, cards, modals and navigation.

### React Hot Toast

Professional success/error/warning notifications instead of browser
alerts.

### Context API

Built into React. Mainly for authentication/user state.

## Backend Packages

### Node.js

JavaScript runtime for the server.

### Express.js

REST API framework.

### MongoDB

Database.

### Mongoose

MongoDB ODM for schemas, models, validation, queries, references and
indexes.

### dotenv

Environment variables such as PORT, MONGO_URI and JWT_SECRET.

### cors

Allows configured frontend origins to communicate with the API.

### bcryptjs

Password hashing and password verification.

### jsonwebtoken

JWT creation and verification.

### helmet

Common security-related HTTP headers.

### morgan

HTTP request logging during development.

### Zod

Backend request validation.

### Nodemon

Automatically restarts the backend during development.

## Optional Packages

Only add when implementing their feature: - `multer` --- file uploads /
CSV imports - `exceljs` --- Excel reports - `pdfkit` --- PDF reports -
`express-rate-limit` --- request limiting

## Intentionally Avoid Initially

-   TypeScript
-   Bootstrap
-   Chakra UI
-   Reactstrap
-   Multiple icon libraries
-   Redux Toolkit unless global state later becomes genuinely complex

## Request Flow

``` text
Request
 -> Route
 -> Authentication Middleware
 -> Role Middleware
 -> Controller
 -> Service
 -> Mongoose Model
 -> MongoDB
 -> Response
```

Controllers should not become giant files. Business logic belongs in
services.

## Authentication Flow

``` text
Login Form
 -> Axios
 -> POST /api/auth/login
 -> Validate input
 -> Find user
 -> bcrypt verification
 -> JWT
 -> Client auth state
 -> Protected routes
```

Authentication means identifying the user. Authorization means deciding
what that user is allowed to do.

## Security Rules

-   Hash passwords.
-   Use JWT.
-   Validate backend input.
-   Enforce authorization on the backend.
-   Store secrets in environment variables.
-   Configure CORS.
-   Use Helmet.
-   Centralize errors.
-   Do not leak sensitive server details in production.
