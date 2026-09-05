import express from "express";

import {
  createStaff,
  getStaff,
  getStaffMember,
} from "../controllers/staffController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import requireModule from "../middleware/moduleMiddleware.js";

const router = express.Router();

// ==================================================
// Staff Management
// ==================================================

// --------------------------------------------------
// Create Staff
// Clinic Admin only
//
// Staff Management must be enabled because this
// endpoint creates and manages staff accounts.
// --------------------------------------------------

router.post(
  "/",
  protect,
  authorizeRoles("clinic_admin"),
  requireModule("Staff Management"),
  createStaff
);

// --------------------------------------------------
// Get Staff
//
// Used by:
// - Staff Management
// - Appointment Scheduling
//
// Appointment Scheduling automatically includes
// Staff Management through the module dependency
// system.
//
// Therefore Staff Management is the single
// required module here.
// --------------------------------------------------

router.get(
  "/",
  protect,
  authorizeRoles(
    "clinic_admin",
    "receptionist"
  ),
  requireModule("Staff Management"),
  getStaff
);

// --------------------------------------------------
// Get Single Staff Member
// Clinic Admin only
//
// This is part of Staff Management itself.
// --------------------------------------------------

router.get(
  "/:id",
  protect,
  authorizeRoles("clinic_admin"),
  requireModule("Staff Management"),
  getStaffMember
);

export default router;