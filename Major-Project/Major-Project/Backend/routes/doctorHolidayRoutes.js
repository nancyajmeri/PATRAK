import express from "express";

import {
  addDoctorHoliday,
  getDoctorHolidays,
  deleteDoctorHoliday,
} from "../controllers/doctorHolidayController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Clinic Admin can add a doctor's holiday
router.post(
  "/",
  protect,
  authorizeRoles("clinic_admin"),
  addDoctorHoliday
);

// Clinic Admin can view a doctor's holidays
router.get(
  "/:doctorId",
  protect,
  authorizeRoles("clinic_admin"),
  getDoctorHolidays
);

// Clinic Admin can delete a doctor's holiday
router.delete(
  "/:id",
  protect,
  authorizeRoles("clinic_admin"),
  deleteDoctorHoliday
);

export default router;