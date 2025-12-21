import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import LabDashboard from "./pages/LabDashboard";
import PharmacyDashboard from "./pages/PharmacyDashboard";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import DepartmentsPage from "./pages/DepartmentsPage";
import StaffDashboardPage from "./pages/staffDashboardPage";
import { ROUTES } from "./constants/routes";
import { ROLES } from "./constants/roles";
import SchedulesDashboardPage from "./pages/SchedulesDashboardPage";
import ReceptionPatientPage from "./pages/ReceptionPatientPage";
import ReceptionQueuePage from "./pages/ReceptionistQueuePage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* public */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />

          {/* Protected by role */}
          <Route
            path={ROUTES.ADMIN_HOME}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.DOCTOR_HOME}
            element={
              <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.RECEPTION_HOME}
            element={
              <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}>
                <ReceptionistDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PHARMACY_HOME}
            element={
              <ProtectedRoute allowedRoles={[ROLES.PHARMACIST]}>
                <PharmacyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.LAB_HOME}
            element={
              <ProtectedRoute allowedRoles={[ROLES.TECHNICIAN]}>
                <LabDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PATIENT_HOME}
            element={
              <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_DEPARTMENTS}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DepartmentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_STAFF}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <StaffDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_SCHEDULES}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <SchedulesDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.RECEPTION_PATIENTS}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPTIONIST]}>
                <ReceptionPatientPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.RECEPTION_QUEUE}
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEPTIONIST]}>
                <ReceptionQueuePage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
