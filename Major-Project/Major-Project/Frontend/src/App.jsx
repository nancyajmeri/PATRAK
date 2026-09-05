import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import RequestClinic from "./pages/RequestClinic/RequestClinic";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import About from "./pages/About";
import Services from "./pages/Services";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";

import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard";

import ClinicAdminDashboard from "./pages/ClinicAdmin/ClinicAdminDashboard";
import PatientManagement from "./pages/ClinicAdmin/Patients/PatientManagement";
import StaffManagement from "./pages/ClinicAdmin/StaffManagement";
import DoctorSchedule from "./pages/ClinicAdmin/DoctorSchedule";
import AppointmentManagement from "./pages/ClinicAdmin/Appointments/AppointmentManagement";
import ReportsAnalytics from "./pages/ClinicAdmin/Reports/ReportsAnalytics";

import Kiosk from "./pages/Kiosk/Kiosk";

import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/services"
        element={<Services />}
      />

      <Route path="/how-it-works" element={<HowItWorks />} />

      <Route path="/contact" element={<Contact />}
 />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/request-clinic"
        element={<RequestClinic />}
      />

      {/* Change Password */}

      <Route
        path="/change-password"
        element={
          <ProtectedRoute
            allowedRoles={[
              "super_admin",
              "clinic_admin",
              "receptionist",
              "doctor",
            ]}
          >
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      {/* Super Admin */}

      <Route
        path="/super-admin"
        element={
          <ProtectedRoute
            allowedRoles={["super_admin"]}
          >
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Clinic Admin and Receptionist */}

      <Route
        path="/clinic-admin"
        element={
          <ProtectedRoute
            allowedRoles={[
              "clinic_admin",
              "receptionist",
            ]}
          >
            <ClinicAdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clinic-admin/patients"
        element={
          <ProtectedRoute
            allowedRoles={[
              "clinic_admin",
              "receptionist",
            ]}
          >
            <PatientManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clinic-admin/staff"
        element={
          <ProtectedRoute
            allowedRoles={["clinic_admin"]}
          >
            <StaffManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clinic-admin/doctor-schedule"
        element={
          <ProtectedRoute
            allowedRoles={["clinic_admin"]}
          >
            <DoctorSchedule />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clinic-admin/appointments"
        element={
          <ProtectedRoute
            allowedRoles={[
              "clinic_admin",
              "receptionist",
            ]}
          >
            <AppointmentManagement />
          </ProtectedRoute>
        }
      />

      {/* Doctor */}

      <Route
        path="/doctor"
        element={
          <ProtectedRoute
            allowedRoles={["doctor"]}
          >
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/appointments"
        element={
          <ProtectedRoute
            allowedRoles={["doctor"]}
          >
            <DoctorAppointments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clinic-admin/reports"
        element={
          <ProtectedRoute
            allowedRoles={["clinic_admin"]}
          >
            <ReportsAnalytics />
          </ProtectedRoute>
        }
      />

      {/* Kiosk */}

      <Route
        path="/kiosk/:kioskCode"
        element={<Kiosk />}
      />
    </Routes>
  );
}

export default App;