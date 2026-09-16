import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import RoleRoute from "./routes/RoleRoute.jsx";

// Layouts
import AdminLayout from "./layouts/AdminLayout.jsx";
import TeacherLayout from "./layouts/TeacherLayout.jsx";
import StudentLayout from "./layouts/StudentLayout.jsx";

// Public pages
import HomePage from "./pages/public/HomePage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import UnauthorizedPage from "./pages/auth/UnauthorizedPage.jsx";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import StudentsPage from "./pages/admin/StudentsPage.jsx";
import TeachersPage from "./pages/admin/TeachersPage.jsx";
import DepartmentsPage from "./pages/admin/DepartmentsPage.jsx";
import ClassesPage from "./pages/admin/ClassesPage.jsx";
import SubjectsPage from "./pages/admin/SubjectsPage.jsx";
import TeacherAttendancePage from "./pages/teacher/TeacherAttendancePage.jsx";
import TeacherHistoryPage from "./pages/teacher/TeacherHistoryPage.jsx";
import TeacherDashboard from "./pages/teacher/TeacherDashboard.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import AdminHistoryPage from "./pages/admin/AdminHistoryPage.jsx";
import AdminReportsPage from "./pages/admin/AdminReportsPage.jsx";
import StudentAttendancePage from "./pages/student/StudentAttendancePage.jsx";
import InstallAppBanner from "./components/InstallAppBanner.jsx";

/**
 * App — Root component. Defines the complete routing tree.
 *
 * Route tree:
 *
 * /                                  → redirect to /login
 * /login                             → LoginPage (public)
 * /register                          → RegisterPage (public, student only)
 * /unauthorized                      → UnauthorizedPage (public)
 *
 * ProtectedRoute (needs auth)
 *   RoleRoute ["admin"]
 *     AdminLayout (sidebar + topbar)
 *       /admin/dashboard             → AdminDashboard
 *       (Phase 6+: /admin/students, /admin/teachers, etc.)
 *
 *   RoleRoute ["teacher", "admin"]
 *     TeacherLayout (sidebar + topbar)
 *       /teacher/dashboard           → TeacherDashboard
 *       (Phase 7+: /teacher/attendance, /teacher/history)
 *
 *   RoleRoute ["student"]
 *     StudentLayout (sidebar + topbar)
 *       /student/dashboard           → StudentDashboard
 *       (Phase 8+: /student/attendance, /student/history)
 *
 * *                                  → redirect to /login (catch-all)
 */
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid #334155",
              fontSize: "14px",
              borderRadius: "10px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: { primary: "#6366f1", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />

        {/* PWA Mobile Installation Prompt Banner */}
        <InstallAppBanner />

        <Routes>
          {/* ── Public routes ──────────────────────────────────────────── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* ── Protected: authentication required ─────────────────────── */}
          <Route element={<ProtectedRoute />}>

            {/* Admin area */}
            <Route element={<RoleRoute allowedRoles={["admin"]} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/students" element={<StudentsPage />} />
                <Route path="/admin/teachers" element={<TeachersPage />} />
                <Route path="/admin/departments" element={<DepartmentsPage />} />
                <Route path="/admin/classes" element={<ClassesPage />} />
                <Route path="/admin/subjects" element={<SubjectsPage />} />
                <Route path="/admin/attendance" element={<TeacherAttendancePage />} />
                <Route path="/admin/history" element={<AdminHistoryPage />} />
                <Route path="/admin/reports" element={<AdminReportsPage />} />
              </Route>
            </Route>

            {/* Teacher area — admin can also access teacher pages */}
            <Route element={<RoleRoute allowedRoles={["teacher", "admin"]} />}>
              <Route element={<TeacherLayout />}>
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                <Route path="/teacher/attendance" element={<TeacherAttendancePage />} />
                <Route path="/teacher/history" element={<TeacherHistoryPage />} />
              </Route>
            </Route>

            {/* Student area — admin can also access student pages */}
            <Route element={<RoleRoute allowedRoles={["student", "admin"]} />}>
              <Route element={<StudentLayout />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/attendance" element={<StudentAttendancePage />} />
                <Route path="/student/history" element={<StudentAttendancePage />} />
              </Route>
            </Route>

          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
}

export default App;