import express from "express";

import {
  createPatient,
  getPatients,
  getPatient,
  getPatientHistory,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import requireModule from "../middleware/moduleMiddleware.js";

const router = express.Router();

// ==================================================
// Patient Management
// ==================================================

// Create Patient
// Clinic Admin and Receptionist
// Requires Patient Management module
router.post(
  "/",
  protect,
  authorizeRoles(
    "clinic_admin",
    "receptionist"
  ),
  requireModule("Patient Management"),
  createPatient
);

// Get Patients
// Clinic Admin, Doctor and Receptionist
// Requires Patient Management module
router.get(
  "/",
  protect,
  authorizeRoles(
    "clinic_admin",
    "doctor",
    "receptionist"
  ),
  requireModule("Patient Management"),
  getPatients
);

// Get Patient Visit History
// Clinic Admin, Doctor and Receptionist
// Requires Patient Management module
router.get(
  "/:id/history",
  protect,
  authorizeRoles(
    "clinic_admin",
    "doctor",
    "receptionist"
  ),
  requireModule("Patient Management"),
  getPatientHistory
);

// Get Single Patient
// Clinic Admin, Doctor and Receptionist
// Requires Patient Management module
router.get(
  "/:id",
  protect,
  authorizeRoles(
    "clinic_admin",
    "doctor",
    "receptionist"
  ),
  requireModule("Patient Management"),
  getPatient
);

// Update Patient
// Clinic Admin and Receptionist
// Requires Patient Management module
router.put(
  "/:id",
  protect,
  authorizeRoles(
    "clinic_admin",
    "receptionist"
  ),
  requireModule("Patient Management"),
  updatePatient
);

// Delete Patient
// Clinic Admin only
// Requires Patient Management module
router.delete(
  "/:id",
  protect,
  authorizeRoles("clinic_admin"),
  requireModule("Patient Management"),
  deletePatient
);

export default router;