import express from "express";

import { getMyClinic } from "../controllers/clinicController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Get current clinic
// Clinic Admin and Receptionist can view clinic information

router.get(
  "/my-clinic",
  protect,
  authorizeRoles(
    "clinic_admin",
    "receptionist"
  ),
  getMyClinic
);

export default router;