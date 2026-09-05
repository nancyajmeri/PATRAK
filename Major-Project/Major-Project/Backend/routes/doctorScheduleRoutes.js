import express from "express";

import {
  saveDoctorSchedule,
  getDoctorSchedule,
} from "../controllers/doctorScheduleController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import requireModule from "../middleware/moduleMiddleware.js";

const router = express.Router();

// ==================================================
// Doctor Schedule
// ==================================================

// --------------------------------------------------
// Create / Update Doctor Schedule
//
// Clinic Admin only.
//
// Doctor Schedule requires Staff Management because
// doctors are managed through the Staff Management
// module.
// --------------------------------------------------

router.post(
  "/",
  protect,
  authorizeRoles("clinic_admin"),
  requireModule("Staff Management"),
  saveDoctorSchedule
);

// --------------------------------------------------
// View Doctor Schedule
//
// Clinic Admin only.
//
// Staff Management is required because the schedule
// belongs to a doctor managed by the clinic.
// --------------------------------------------------

router.get(
  "/:doctorId",
  protect,
  authorizeRoles("clinic_admin"),
  requireModule("Staff Management"),
  getDoctorSchedule
);

export default router;