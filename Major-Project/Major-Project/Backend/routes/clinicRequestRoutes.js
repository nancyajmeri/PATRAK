import express from "express";
import {
  createClinicRequest,
  getClinicRequests,
  rejectClinicRequest,
  approveClinicRequest,
} from "../controllers/clinicRequestController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public
router.post("/", createClinicRequest);

// Super Admin only
router.get(
  "/",
  protect,
  authorizeRoles("super_admin"),
  getClinicRequests
);

router.patch(
  "/:id/approve",
  protect,
  authorizeRoles("super_admin"),
  approveClinicRequest
);

router.patch(
  "/:id/reject",
  protect,
  authorizeRoles("super_admin"),
  rejectClinicRequest
);

export default router;