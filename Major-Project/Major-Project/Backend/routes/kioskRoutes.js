import express from "express";

import {
  getKioskClinic,
  searchKioskPatients,
  createKioskPatient,
  getKioskDoctors,
  getKioskAvailableSlots,
  createKioskAppointment,
} from "../controllers/kioskController.js";

const router = express.Router();

// Get clinic information for kiosk

router.get(
  "/:kioskCode",
  getKioskClinic
);

// Search patients through kiosk

router.get(
  "/:kioskCode/patients",
  searchKioskPatients
);

// Create new patient through kiosk

router.post(
  "/:kioskCode/patients",
  createKioskPatient
);

// Get doctors through kiosk

router.get(
  "/:kioskCode/doctors",
  getKioskDoctors
);

// Get available appointment slots

router.get(
  "/:kioskCode/doctors/:doctorId/slots",
  getKioskAvailableSlots
);

// Create appointment through kiosk

router.post(
  "/:kioskCode/appointments",
  createKioskAppointment
);

export default router;