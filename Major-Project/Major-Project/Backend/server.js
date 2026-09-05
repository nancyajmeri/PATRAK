import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import Clinic from "./models/Clinic.js";

import authRoutes from "./routes/authRoutes.js";
import clinicRequestRoutes from "./routes/clinicRequestRoutes.js";
import clinicRoutes from "./routes/clinicRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import doctorScheduleRoutes from "./routes/doctorScheduleRoutes.js";
import doctorHolidayRoutes from "./routes/doctorHolidayRoutes.js";
import kioskRoutes from "./routes/kioskRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Generate missing kiosk codes for existing clinics
const initializeKioskCodes = async () => {
  try {
    const clinics = await Clinic.find({
      kioskCode: {
        $exists: false,
      },
    }).sort({
      createdAt: 1,
    });

    if (clinics.length === 0) {
      return;
    }

    const existingCodes =
      await Clinic.find({
        kioskCode: {
          $exists: true,
        },
      }).select("kioskCode");

    const usedNumbers =
      existingCodes
        .map((clinic) => {
          const match =
            clinic.kioskCode?.match(
              /^PATRAK-(\d+)$/
            );

          return match
            ? parseInt(match[1], 10)
            : null;
        })
        .filter(
          (number) => number !== null
        );

    let nextNumber =
      usedNumbers.length > 0
        ? Math.max(...usedNumbers) + 1
        : 1;

    for (const clinic of clinics) {
      let kioskCode;

      do {
        kioskCode = `PATRAK-${String(
          nextNumber
        ).padStart(3, "0")}`;

        nextNumber++;
      } while (
        usedNumbers.includes(
          parseInt(
            kioskCode.replace(
              "PATRAK-",
              ""
            ),
            10
          )
        )
      );

      clinic.kioskCode = kioskCode;

      await clinic.save();

      console.log(
        `Kiosk code assigned: ${clinic.name} → ${kioskCode}`
      );
    }
  } catch (error) {
    console.error(
      "Failed to initialize kiosk codes:",
      error.message
    );
  }
};

const startServer = async () => {
  try {
    await connectDB();

    await initializeKioskCodes();

    // Middleware

    app.use(cors());
    app.use(express.json());

    // Routes

    app.get("/", (req, res) => {
      res.json({
        message:
          "PATRAK Backend is running",
      });
    });

    app.use(
      "/api/auth",
      authRoutes
    );

    app.use(
      "/api/clinic-requests",
      clinicRequestRoutes
    );

    app.use(
      "/api/clinics",
      clinicRoutes
    );

    app.use(
      "/api/patients",
      patientRoutes
    );

    app.use(
      "/api/appointments",
      appointmentRoutes
    );

    app.use(
      "/api/staff",
      staffRoutes
    );

    app.use(
      "/api/doctor-schedules",
      doctorScheduleRoutes
    );

    app.use(
      "/api/doctor-holidays",
      doctorHolidayRoutes
    );

    app.use(
     "/api/kiosk",
      kioskRoutes
    );

    app.use(
     "/api/reports",
      reportsRoutes
    );

    // Start server

    app.listen(PORT,"0.0.0.0", () => {
      console.log(
        `PATRAK Backend running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();