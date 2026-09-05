import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";
import DoctorSchedule from "../models/DoctorSchedule.js";
import DoctorHoliday from "../models/DoctorHoliday.js";

// ==================================================
// Helper Functions
// ==================================================

// Get Day of Week
const getDayOfWeek = (date) => {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  return days[date.getDay()];
};

// Convert HH:MM to Minutes
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

// Get Minutes from Date
const getDateMinutes = (date) => {
  return date.getHours() * 60 + date.getMinutes();
};

// ==================================================
// Get Doctors for Appointment Scheduling
// ==================================================

export const getAppointmentDoctors = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;

    if (!clinicId) {
      return res.status(400).json({
        message: "User is not associated with a clinic",
      });
    }

    const doctors = await User.find({
      clinicId,
      role: "doctor",
    }).select("name email specialization");

    res.json(doctors);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// Create Appointment
// ==================================================

export const createAppointment = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      appointmentDate,
      reason,
    } = req.body;

    if (!patientId || !doctorId || !appointmentDate) {
      return res.status(400).json({
        message: "Patient, doctor and appointment date are required",
      });
    }

    const clinicId = req.user.clinicId;

    if (!clinicId) {
      return res.status(400).json({
        message: "User is not associated with a clinic",
      });
    }

    const appointmentDateTime = new Date(appointmentDate);

    if (isNaN(appointmentDateTime.getTime())) {
      return res.status(400).json({
        message: "Invalid appointment date",
      });
    }

    // --------------------------------------------------
    // Check Patient
    // --------------------------------------------------

    const patient = await Patient.findOne({
      _id: patientId,
      clinicId,
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found in this clinic",
      });
    }

    // --------------------------------------------------
    // Check Doctor
    // --------------------------------------------------

    const doctor = await User.findOne({
      _id: doctorId,
      clinicId,
      role: "doctor",
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found in this clinic",
      });
    }

    // --------------------------------------------------
    // Get Day of Week
    // --------------------------------------------------

    const dayOfWeek = getDayOfWeek(appointmentDateTime);

    // --------------------------------------------------
    // Get Doctor Schedule
    // --------------------------------------------------

    const schedule = await DoctorSchedule.findOne({
      doctorId,
      clinicId,
      dayOfWeek,
    });

    if (!schedule || !schedule.isWorking) {
      return res.status(400).json({
        message: "Doctor is not available on this day",
      });
    }

    // --------------------------------------------------
    // Get Appointment Time
    // --------------------------------------------------

    const appointmentMinutes = getDateMinutes(
      appointmentDateTime
    );

    const startMinutes = timeToMinutes(schedule.startTime);

    const endMinutes = timeToMinutes(schedule.endTime);

    // --------------------------------------------------
    // Check Working Hours
    // --------------------------------------------------

    if (
      appointmentMinutes < startMinutes ||
      appointmentMinutes >= endMinutes
    ) {
      return res.status(400).json({
        message:
          "Appointment time is outside the doctor's working hours",
      });
    }

    // --------------------------------------------------
    // Check Appointment Duration
    // --------------------------------------------------

    const appointmentEndMinutes =
      appointmentMinutes + schedule.appointmentDuration;

    if (appointmentEndMinutes > endMinutes) {
      return res.status(400).json({
        message:
          "Appointment duration extends beyond the doctor's working hours",
      });
    }

    // --------------------------------------------------
    // Check Breaks
    // --------------------------------------------------

    for (const breakItem of schedule.breaks) {
      const breakStart = timeToMinutes(breakItem.startTime);

      const breakEnd = timeToMinutes(breakItem.endTime);

      const overlapsBreak =
        appointmentMinutes < breakEnd &&
        appointmentEndMinutes > breakStart;

      if (overlapsBreak) {
        return res.status(400).json({
          message: "Doctor is on a break during this time",
        });
      }
    }

    // --------------------------------------------------
    // Get Start and End of Selected Day
    // --------------------------------------------------

    const startOfDay = new Date(appointmentDateTime);

    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(appointmentDateTime);

    endOfDay.setHours(23, 59, 59, 999);

    // --------------------------------------------------
    // Check Holiday
    // --------------------------------------------------

    const holiday = await DoctorHoliday.findOne({
      doctorId,
      clinicId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (holiday) {
      return res.status(400).json({
        message: `Doctor is unavailable on this date${
          holiday.reason ? `: ${holiday.reason}` : ""
        }`,
      });
    }

    // --------------------------------------------------
    // Appointment Start and End
    // --------------------------------------------------

    const appointmentStart = new Date(appointmentDateTime);

    const appointmentEnd = new Date(appointmentDateTime);

    appointmentEnd.setMinutes(
      appointmentEnd.getMinutes() +
        schedule.appointmentDuration
    );

    // --------------------------------------------------
    // Get Existing Appointments
    // --------------------------------------------------

    const existingAppointments = await Appointment.find({
      clinicId,
      doctorId,
      status: "scheduled",
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    // --------------------------------------------------
    // Check Appointment Overlap
    // --------------------------------------------------

    for (const existingAppointment of existingAppointments) {
      const existingStart = new Date(
        existingAppointment.appointmentDate
      );

      const existingEnd = new Date(existingStart);

      existingEnd.setMinutes(
        existingEnd.getMinutes() +
          schedule.appointmentDuration
      );

      const overlapsAppointment =
        appointmentStart < existingEnd &&
        appointmentEnd > existingStart;

      if (overlapsAppointment) {
        return res.status(400).json({
          message:
            "This doctor already has an appointment during this time",
        });
      }
    }

    // --------------------------------------------------
    // Generate Next Token Number
    // --------------------------------------------------

    const lastAppointment = await Appointment.findOne({
      clinicId,
      doctorId,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({
      tokenNumber: -1,
    });

    const tokenNumber = lastAppointment
      ? lastAppointment.tokenNumber + 1
      : 1;

    // --------------------------------------------------
    // Create Appointment
    // --------------------------------------------------

    const appointment = await Appointment.create({
      clinicId,
      patientId,
      doctorId,
      appointmentDate: appointmentDateTime,
      tokenNumber,
      reason,
      status: "scheduled",
    });

    // --------------------------------------------------
    // Populate Appointment
    // --------------------------------------------------

    const populatedAppointment = await Appointment.findById(
      appointment._id
    )
      .populate(
        "patientId",
        "patientId name phone"
      )
      .populate(
        "doctorId",
        "name email specialization"
      );

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: populatedAppointment,
    });
  } catch (error) {
    // MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "This appointment slot was just booked by someone else. Please select another slot.",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// Get Available Appointment Slots
// ==================================================

export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        message: "Doctor and date are required",
      });
    }

    const clinicId = req.user.clinicId;

    if (!clinicId) {
      return res.status(400).json({
        message: "User is not associated with a clinic",
      });
    }

    // --------------------------------------------------
    // Check Doctor
    // --------------------------------------------------

    const doctor = await User.findOne({
      _id: doctorId,
      clinicId,
      role: "doctor",
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found in this clinic",
      });
    }

    // --------------------------------------------------
    // Create Selected Date
    // --------------------------------------------------

    const selectedDate = new Date(`${date}T00:00:00`);

    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    // --------------------------------------------------
    // Get Day of Week
    // --------------------------------------------------

    const dayOfWeek = getDayOfWeek(selectedDate);

    // --------------------------------------------------
    // Get Doctor Schedule
    // --------------------------------------------------

    const schedule = await DoctorSchedule.findOne({
      doctorId,
      clinicId,
      dayOfWeek,
    });

    if (!schedule || !schedule.isWorking) {
      return res.json({
        doctorId,
        date,
        slots: [],
        message: "Doctor is not available on this day",
      });
    }

    // --------------------------------------------------
    // Start and End of Day
    // --------------------------------------------------

    const startOfDay = new Date(selectedDate);

    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);

    endOfDay.setHours(23, 59, 59, 999);

    // --------------------------------------------------
    // Check Holiday
    // --------------------------------------------------

    const holiday = await DoctorHoliday.findOne({
      doctorId,
      clinicId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (holiday) {
      return res.json({
        doctorId,
        date,
        slots: [],
        message: holiday.reason
          ? `Doctor is unavailable: ${holiday.reason}`
          : "Doctor is unavailable on this date",
      });
    }

    // --------------------------------------------------
    // Working Hours
    // --------------------------------------------------

    const startMinutes = timeToMinutes(
      schedule.startTime
    );

    const endMinutes = timeToMinutes(
      schedule.endTime
    );

    const duration = schedule.appointmentDuration;

    // --------------------------------------------------
    // Existing Appointments
    // --------------------------------------------------

    const existingAppointments = await Appointment.find({
      clinicId,
      doctorId,
      status: "scheduled",
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const slots = [];

    // --------------------------------------------------
    // Generate Available Slots
    // --------------------------------------------------

    let minutes = startMinutes;

    while (minutes + duration <= endMinutes) {
      const slotStart = minutes;

      const slotEnd = minutes + duration;

      // ----------------------------------------------
      // Check Break
      // ----------------------------------------------

      let overlappingBreak = null;

      for (const breakItem of schedule.breaks) {
        const breakStart = timeToMinutes(
          breakItem.startTime
        );

        const breakEnd = timeToMinutes(
          breakItem.endTime
        );

        const overlapsBreak =
          slotStart < breakEnd &&
          slotEnd > breakStart;

        if (overlapsBreak) {
          overlappingBreak = {
            start: breakStart,
            end: breakEnd,
          };

          break;
        }
      }

      // ----------------------------------------------
      // Move to End of Break
      // ----------------------------------------------

      if (overlappingBreak) {
        minutes = overlappingBreak.end;

        continue;
      }

      // ----------------------------------------------
      // Create Slot Date
      // ----------------------------------------------

      const hours = Math.floor(minutes / 60);

      const mins = minutes % 60;

      const slotDate = new Date(selectedDate);

      slotDate.setHours(
        hours,
        mins,
        0,
        0
      );

      const slotEndDate = new Date(slotDate);

      slotEndDate.setMinutes(
        slotEndDate.getMinutes() +
          duration
      );

      // ----------------------------------------------
      // Check Existing Appointment
      // ----------------------------------------------

      let isBooked = false;

      for (const appointment of existingAppointments) {
        const existingStart = new Date(
          appointment.appointmentDate
        );

        const existingEnd = new Date(existingStart);

        existingEnd.setMinutes(
          existingEnd.getMinutes() +
            duration
        );

        const overlapsAppointment =
          slotDate < existingEnd &&
          slotEndDate > existingStart;

        if (overlapsAppointment) {
          isBooked = true;
          break;
        }
      }

      // ----------------------------------------------
      // Add Available Slot
      // ----------------------------------------------

      if (!isBooked) {
        slots.push({
          time: slotDate
            .toTimeString()
            .slice(0, 5),

          displayTime:
            slotDate.toLocaleTimeString(
              "en-IN",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),

          dateTime: slotDate,
        });
      }

      // ----------------------------------------------
      // Move to Next Slot
      // ----------------------------------------------

      minutes += duration;
    }

    res.json({
      doctorId,
      date,
      appointmentDuration: duration,
      slots,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// Get Appointments
// ==================================================

export const getAppointments = async (req, res) => {
  try {
    const query = {
      clinicId: req.user.clinicId,
    };

    // Doctors can only see their own appointments
    if (req.user.role === "doctor") {
      query.doctorId = req.user.id;
    }

    const appointments = await Appointment.find(query)
      .populate(
        "patientId",
        "patientId name phone"
      )
      .populate(
        "doctorId",
        "name email specialization"
      )
      .sort({
        appointmentDate: 1,
      });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// Get Single Appointment
// ==================================================

export const getAppointment = async (req, res) => {
  try {
    const query = {
      _id: req.params.id,
      clinicId: req.user.clinicId,
    };

    // Doctors can only view their own appointments
    if (req.user.role === "doctor") {
      query.doctorId = req.user.id;
    }

    const appointment = await Appointment.findOne(query)
      .populate(
        "patientId",
        "patientId name phone email"
      )
      .populate(
        "doctorId",
        "name email specialization"
      );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// Update Appointment Status
// ==================================================

export const updateAppointmentStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    if (
      !status ||
      ![
        "scheduled",
        "completed",
        "cancelled",
      ].includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid appointment status",
      });
    }

    const query = {
      _id: req.params.id,
      clinicId: req.user.clinicId,
    };

    // Doctors can only update their own appointments
    if (req.user.role === "doctor") {
      query.doctorId = req.user.id;
    }

    const appointment = await Appointment.findOne(query);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.status = status;

    await appointment.save();

    res.json({
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// Cancel Appointment
// ==================================================

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      clinicId: req.user.clinicId,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.status === "completed") {
      return res.status(400).json({
        message:
          "A completed appointment cannot be cancelled",
      });
    }

    appointment.status = "cancelled";

    await appointment.save();

    res.json({
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};