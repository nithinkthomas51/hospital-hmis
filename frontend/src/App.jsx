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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected by role */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={["DOCTOR"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist"
            element={
              <ProtectedRoute allowedRoles={["RECEPTIONIST"]}>
                <ReceptionistDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy"
            element={
              <ProtectedRoute allowedRoles={["PHARMACIST"]}>
                <PharmacyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lab"
            element={
              <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
                <LabDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient"
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <PatientDashboard />
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
