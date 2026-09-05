import express from "express";

import {
  getClinicReports,
} from "../controllers/reportsController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import requireModule from "../middleware/moduleMiddleware.js";

const router = express.Router();

// Reports & Analytics
// Only Clinic Admins with the Reports module enabled

router.get(
  "/",
  protect,
  authorizeRoles("clinic_admin"),
  requireModule("Reports & Analytics"),
  getClinicReports
);

export default router;