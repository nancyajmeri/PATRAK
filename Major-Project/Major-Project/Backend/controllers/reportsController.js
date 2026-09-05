import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";
import Clinic from "../models/Clinic.js";

// Get Clinic Reports
export const getClinicReports = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;

    if (!clinicId) {
      return res.status(400).json({
        message: "User is not associated with a clinic",
      });
    }

    // --------------------------------------------------
    // Get Clinic
    // --------------------------------------------------

    const clinic = await Clinic.findById(clinicId).select(
      "services status"
    );

    if (!clinic) {
      return res.status(404).json({
        message: "Clinic not found",
      });
    }

    if (clinic.status !== "active") {
      return res.status(403).json({
        message: "Clinic is not active",
      });
    }

    // --------------------------------------------------
    // Check Enabled Modules
    // --------------------------------------------------

    const enabledServices = clinic.services || [];

    const patientManagementEnabled =
      enabledServices.includes("Patient Management");

    const appointmentSchedulingEnabled =
      enabledServices.includes("Appointment Scheduling");

    // --------------------------------------------------
    // Response Object
    // Only enabled module reports will be added
    // --------------------------------------------------

    const reports = {};

    // --------------------------------------------------
    // Patient Management Reports
    // --------------------------------------------------

    if (patientManagementEnabled) {
      const totalPatients = await Patient.countDocuments({
        clinicId,
      });

      reports.totalPatients = totalPatients;
    }

    // --------------------------------------------------
    // Appointment Scheduling Reports
    // --------------------------------------------------

    if (appointmentSchedulingEnabled) {
      const totalAppointments =
        await Appointment.countDocuments({
          clinicId,
        });

      const scheduledAppointments =
        await Appointment.countDocuments({
          clinicId,
          status: "scheduled",
        });

      const completedAppointments =
        await Appointment.countDocuments({
          clinicId,
          status: "completed",
        });

      const cancelledAppointments =
        await Appointment.countDocuments({
          clinicId,
          status: "cancelled",
        });

      // --------------------------------------------------
      // Today's Appointments
      // --------------------------------------------------

      const today = new Date();

      const startOfDay = new Date(today);

      startOfDay.setHours(
        0,
        0,
        0,
        0
      );

      const endOfDay = new Date(today);

      endOfDay.setHours(
        23,
        59,
        59,
        999
      );

      const todaysAppointments =
        await Appointment.countDocuments({
          clinicId,
          appointmentDate: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        });

      // --------------------------------------------------
      // Add Appointment Reports
      // --------------------------------------------------

      reports.totalAppointments =
        totalAppointments;

      reports.scheduledAppointments =
        scheduledAppointments;

      reports.completedAppointments =
        completedAppointments;

      reports.cancelledAppointments =
        cancelledAppointments;

      reports.todaysAppointments =
        todaysAppointments;
    }

    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    return res.json(reports);
  } catch (error) {
    console.error(
      "Get clinic reports error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};