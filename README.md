# Nalanda College — Smart Attendance & Academic Management System

A modern, full-stack Attendance & Academic Management platform built for higher education institutions. Features role-based access for Administrators, Faculty, and Students, complete academic hierarchy tracking (Departments, Classes, Faculty, Students), and a dual **Light Mode / Dark Mode** design system.

---

## 🌟 Key Features

- **Split-Screen Authentication**: Modern 50/50 authentication UI featuring institutional branding, ambient glow effects, quick demo credentials, and instant theme switching.
- **Dual Theme Support (Light & Dark Mode)**: High-contrast, accessibility-first design system with persistent local storage theme preferences.
- **Role-Based Access Control (RBAC)**: Secure JWT-based authentication guarding Administrator, Teacher, and Student workflows.
- **Academic Hierarchy Management**:
  - **Departments**: Code, name, descriptions, and dynamic entity statistics.
  - **Classes**: Semester-wise, section, and academic year tracking.
  - **Faculty Management**: Employee IDs, department assignments, designations, and portal access controls.
  - **Student Directory**: Roll number indexing, department/class cascades, admission years, and status toggles.
- **Real-Time Data Validation**: Zod-powered schema validation on both frontend forms and backend API routes.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (with custom `@custom-variant dark`)
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form + Zod
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios with automatic bearer token interceptors

### Backend
- **Runtime**: Node.js + Express
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, JSON Web Tokens (JWT), bcryptjs
- **Logging**: Morgan + custom request logger
- **Validation**: Joi / Zod middleware

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas or local MongoDB instance

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MdHuzaifa018/Attendance-Management.git
   cd Attendance-Management
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   ```
   Start the backend server:
   ```bash
   node server.js
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 👥 Demo Accounts

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@nalanda.edu` | `Admin@1234` |
| **Teacher** | `rajesh@nalanda.edu` | `Teacher@1234` |
| **Student** | `huzaifa@bca.edu` | `Student@1234` |

*(Quick demo buttons are also provided on the login page for 1-click testing)*

---

## 📄 License
This project is licensed under the MIT License.
