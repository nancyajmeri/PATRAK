import express from "express";

import {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  getAvailableSlots,
  getAppointmentDoctors,
} from "../controllers/appointmentController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import requireModule from "../middleware/moduleMiddleware.js";

const router = express.Router();

// ==================================================
// Appointment Scheduling
// ==================================================

// --------------------------------------------------
// Get Doctors
// Used by Appointment Scheduling
//
// This does NOT require Staff Management.
// A clinic only needs Appointment Scheduling
// to retrieve its doctors for booking appointments.
// --------------------------------------------------

router.get(
  "/doctors",
  protect,
  authorizeRoles(
    "clinic_admin",
    "receptionist"
  ),
  requireModule(
    "Appointment Scheduling"
  ),
  getAppointmentDoctors
);

// --------------------------------------------------
// Create Appointment
// Clinic Admin and Receptionist
// Requires Appointment Scheduling
// --------------------------------------------------

router.post(
  "/",
  protect,
  authorizeRoles(
    "clinic_admin",
    "receptionist"
  ),
  requireModule(
    "Appointment Scheduling"
  ),
  createAppointment
);

// --------------------------------------------------
// Get Appointments
// Clinic Admin, Receptionist and Doctor
// Requires Appointment Scheduling
// --------------------------------------------------

router.get(
  "/",
  protect,
  authorizeRoles(
    "clinic_admin",
    "receptionist",
    "doctor"
  ),
  requireModule(
    "Appointment Scheduling"
  ),
  getAppointments
);

// --------------------------------------------------
// Get Available Appointment Slots
// Clinic Admin, Receptionist and Doctor
// Requires Appointment Scheduling
// --------------------------------------------------

router.get(
  "/available-slots",
  protect,
  authorizeRoles(
    "clinic_admin",
    "receptionist",
    "doctor"
  ),
  requireModule(
    "Appointment Scheduling"
  ),
  getAvailableSlots
);

// --------------------------------------------------
// Get Single Appointment
// Clinic Admin, Receptionist and Doctor
// Requires Appointment Scheduling
// --------------------------------------------------

router.get(
  "/:id",
  protect,
  authorizeRoles(
    "clinic_admin",
    "receptionist",
    "doctor"
  ),
  requireModule(
    "Appointment Scheduling"
  ),
  getAppointment
);

// --------------------------------------------------
// Update Appointment Status
// Clinic Admin and Doctor
// Requires Appointment Scheduling
// --------------------------------------------------

router.patch(
  "/:id/status",
  protect,
  authorizeRoles(
    "clinic_admin",
    "doctor"
  ),
  requireModule(
    "Appointment Scheduling"
  ),
  updateAppointmentStatus
);

// --------------------------------------------------
// Cancel Appointment
// Clinic Admin and Receptionist
// Requires Appointment Scheduling
// --------------------------------------------------

router.patch(
  "/:id/cancel",
  protect,
  authorizeRoles(
    "clinic_admin",
    "receptionist"
  ),
  requireModule(
    "Appointment Scheduling"
  ),
  cancelAppointment
);

export default router;