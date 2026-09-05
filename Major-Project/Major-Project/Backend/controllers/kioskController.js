import Clinic from "../models/Clinic.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import DoctorSchedule from "../models/DoctorSchedule.js";
import DoctorHoliday from "../models/DoctorHoliday.js";

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
  const [hours, minutes] = time
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
};

// Generate Next Patient ID

const generatePatientId = async (clinicId) => {
  const lastPatient = await Patient.findOne({
    clinicId,
  })
    .sort({
      createdAt: -1,
    })
    .select("patientId");

  if (
    !lastPatient ||
    !lastPatient.patientId
  ) {
    return "PAT-0001";
  }

  const lastNumber = parseInt(
    lastPatient.patientId.replace(
      "PAT-",
      ""
    ),
    10
  );

  const nextNumber = lastNumber + 1;

  return `PAT-${String(
    nextNumber
  ).padStart(4, "0")}`;
};

// Get Clinic for Kiosk

export const getKioskClinic = async (
  req,
  res
) => {
  try {
    const { kioskCode } = req.params;

    if (!kioskCode) {
      return res.status(400).json({
        message: "Kiosk code is required",
      });
    }

    const clinic = await Clinic.findOne({
      kioskCode: kioskCode.toUpperCase(),
      status: "active",
    }).select(
      "name kioskCode services city"
    );

    if (!clinic) {
      return res.status(404).json({
        message:
          "Kiosk not found or clinic is inactive",
      });
    }

    res.json({
      clinic,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Search Patients through Kiosk

export const searchKioskPatients = async (
  req,
  res
) => {
  try {
    const { kioskCode } = req.params;
    const { search } = req.query;

    if (!kioskCode) {
      return res.status(400).json({
        message: "Kiosk code is required",
      });
    }

    if (
      !search ||
      !search.trim()
    ) {
      return res.status(400).json({
        message:
          "Patient ID, name or phone is required",
      });
    }

    const clinic = await Clinic.findOne({
      kioskCode: kioskCode.toUpperCase(),
      status: "active",
    }).select("_id");

    if (!clinic) {
      return res.status(404).json({
        message:
          "Kiosk not found or clinic is inactive",
      });
    }

    const searchValue = search.trim();

    const patients = await Patient.find({
      clinicId: clinic._id,
      $or: [
        {
          patientId: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          name: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: searchValue,
            $options: "i",
          },
        },
      ],
    })
      .select(
        "patientId name dateOfBirth gender phone"
      )
      .limit(10);

    res.json({
      patients,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Create New Patient through Kiosk

export const createKioskPatient = async (
  req,
  res
) => {
  try {
    const { kioskCode } = req.params;

    const {
      name,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      bloodGroup,
      medicalHistory,
    } = req.body;

    if (!kioskCode) {
      return res.status(400).json({
        message: "Kiosk code is required",
      });
    }

    if (
      !name ||
      !dateOfBirth ||
      !gender ||
      !phone
    ) {
      return res.status(400).json({
        message:
          "Name, date of birth, gender and phone are required",
      });
    }

    // Find clinic belonging to this kiosk

    const clinic = await Clinic.findOne({
      kioskCode: kioskCode.toUpperCase(),
      status: "active",
    }).select("_id");

    if (!clinic) {
      return res.status(404).json({
        message:
          "Kiosk not found or clinic is inactive",
      });
    }

    // Generate Patient ID

    const patientId =
      await generatePatientId(
        clinic._id
      );

    // Create Patient

    const patient = await Patient.create({
      clinicId: clinic._id,
      patientId,
      name: name.trim(),
      dateOfBirth,
      gender,
      phone: phone.trim(),
      email:
        email?.trim() || undefined,
      address:
        address?.trim() || undefined,
      bloodGroup:
        bloodGroup?.trim() || undefined,
      medicalHistory:
        medicalHistory?.trim() ||
        undefined,
    });

    res.status(201).json({
      message:
        "Patient registered successfully",

      patient: {
        _id: patient._id,
        patientId: patient.patientId,
        name: patient.name,
        dateOfBirth:
          patient.dateOfBirth,
        gender: patient.gender,
        phone: patient.phone,
        email: patient.email,
        address: patient.address,
        bloodGroup:
          patient.bloodGroup,
        medicalHistory:
          patient.medicalHistory,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Doctors through Kiosk

export const getKioskDoctors = async (
  req,
  res
) => {
  try {
    const { kioskCode } = req.params;

    if (!kioskCode) {
      return res.status(400).json({
        message: "Kiosk code is required",
      });
    }

    // Find clinic belonging to this kiosk

    const clinic = await Clinic.findOne({
      kioskCode: kioskCode.toUpperCase(),
      status: "active",
    }).select("_id");

    if (!clinic) {
      return res.status(404).json({
        message:
          "Kiosk not found or clinic is inactive",
      });
    }

    // Get doctors from this clinic

    const doctors = await User.find({
      clinicId: clinic._id,
      role: "doctor",
    })
      .select(
        "_id name specialization"
      )
      .sort({
        name: 1,
      });

    res.json({
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Available Appointment Slots through Kiosk

export const getKioskAvailableSlots = async (
  req,
  res
) => {
  try {
    const {
      kioskCode,
      doctorId,
    } = req.params;

    const { date } = req.query;

    if (
      !kioskCode ||
      !doctorId ||
      !date
    ) {
      return res.status(400).json({
        message:
          "Kiosk code, doctor and date are required",
      });
    }

    // Find clinic belonging to this kiosk

    const clinic = await Clinic.findOne({
      kioskCode: kioskCode.toUpperCase(),
      status: "active",
    }).select("_id");

    if (!clinic) {
      return res.status(404).json({
        message:
          "Kiosk not found or clinic is inactive",
      });
    }

    // Check doctor belongs to this clinic

    const doctor = await User.findOne({
      _id: doctorId,
      clinicId: clinic._id,
      role: "doctor",
    });

    if (!doctor) {
      return res.status(404).json({
        message:
          "Doctor not found in this clinic",
      });
    }

    // Create selected date

    const selectedDate = new Date(
      `${date}T00:00:00`
    );

    if (
      isNaN(
        selectedDate.getTime()
      )
    ) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    // Get Day of Week

    const dayOfWeek =
      getDayOfWeek(selectedDate);

    // Get Doctor Schedule

    const schedule =
      await DoctorSchedule.findOne({
        doctorId,
        clinicId: clinic._id,
        dayOfWeek,
      });

    if (
      !schedule ||
      !schedule.isWorking
    ) {
      return res.json({
        doctorId,
        date,
        slots: [],
        message:
          "Doctor is not available on this day",
      });
    }

    // Start and End of Selected Day

    const startOfDay = new Date(
      selectedDate
    );

    startOfDay.setHours(
      0,
      0,
      0,
      0
    );

    const endOfDay = new Date(
      selectedDate
    );

    endOfDay.setHours(
      23,
      59,
      59,
      999
    );

    // Check Doctor Holiday

    const holiday =
      await DoctorHoliday.findOne({
        doctorId,
        clinicId: clinic._id,
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

    // Working Hours

    const startMinutes =
      timeToMinutes(
        schedule.startTime
      );

    const endMinutes =
      timeToMinutes(
        schedule.endTime
      );

    const duration =
      schedule.appointmentDuration;

    // Existing Appointments

    const existingAppointments =
      await Appointment.find({
        clinicId: clinic._id,
        doctorId,
        status: "scheduled",
        appointmentDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });

    const slots = [];

    // Generate Available Slots

    let minutes = startMinutes;

    while (
      minutes + duration <=
      endMinutes
    ) {
      const slotStart = minutes;

      const slotEnd =
        minutes + duration;

      // Check Breaks

      let overlappingBreak = null;

      for (
        const breakItem of schedule.breaks
      ) {
        const breakStart =
          timeToMinutes(
            breakItem.startTime
          );

        const breakEnd =
          timeToMinutes(
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

      // Move to End of Break

      if (overlappingBreak) {
        minutes =
          overlappingBreak.end;

        continue;
      }

      const hours = Math.floor(
        minutes / 60
      );

      const mins = minutes % 60;

      const slotDate = new Date(
        selectedDate
      );

      slotDate.setHours(
        hours,
        mins,
        0,
        0
      );

      const slotEndDate =
        new Date(slotDate);

      slotEndDate.setMinutes(
        slotEndDate.getMinutes() +
          duration
      );

      // Check Existing Appointment

      let isBooked = false;

      for (
        const appointment of
          existingAppointments
      ) {
        const existingStart =
          new Date(
            appointment.appointmentDate
          );

        const existingEnd =
          new Date(existingStart);

        existingEnd.setMinutes(
          existingEnd.getMinutes() +
            duration
        );

        const overlapsAppointment =
          slotDate < existingEnd &&
          slotEndDate >
            existingStart;

        if (overlapsAppointment) {
          isBooked = true;
          break;
        }
      }

      // Add Available Slot

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

      // Move to Next Slot

      minutes += duration;
    }

    res.json({
      doctorId,
      date,
      appointmentDuration:
        duration,
      slots,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Create Appointment through Kiosk

export const createKioskAppointment = async (
  req,
  res
) => {
  try {
    const { kioskCode } = req.params;

    const {
      patientId,
      doctorId,
      appointmentDate,
      reason,
    } = req.body;

    // Validate required fields

    if (
      !kioskCode ||
      !patientId ||
      !doctorId ||
      !appointmentDate
    ) {
      return res.status(400).json({
        message:
          "Kiosk code, patient, doctor and appointment date are required",
      });
    }

    // Find clinic belonging to kiosk

    const clinic = await Clinic.findOne({
      kioskCode: kioskCode.toUpperCase(),
      status: "active",
    }).select("_id name");

    if (!clinic) {
      return res.status(404).json({
        message:
          "Kiosk not found or clinic is inactive",
      });
    }

    // Verify patient belongs to clinic

    const patient = await Patient.findOne({
      _id: patientId,
      clinicId: clinic._id,
    });

    if (!patient) {
      return res.status(404).json({
        message:
          "Patient not found in this clinic",
      });
    }

    // Verify doctor belongs to clinic

    const doctor = await User.findOne({
      _id: doctorId,
      clinicId: clinic._id,
      role: "doctor",
    }).select(
      "_id name specialization"
    );

    if (!doctor) {
      return res.status(404).json({
        message:
          "Doctor not found in this clinic",
      });
    }

    // Validate appointment date

    const selectedDate = new Date(
      appointmentDate
    );

    if (
      isNaN(
        selectedDate.getTime()
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid appointment date",
      });
    }

    // Start and End of Appointment Day

    const startOfDay = new Date(
      selectedDate
    );

    startOfDay.setHours(
      0,
      0,
      0,
      0
    );

    const endOfDay = new Date(
      selectedDate
    );

    endOfDay.setHours(
      23,
      59,
      59,
      999
    );

    // Check Doctor Schedule

    const dayOfWeek =
      getDayOfWeek(selectedDate);

    const schedule =
      await DoctorSchedule.findOne({
        doctorId,
        clinicId: clinic._id,
        dayOfWeek,
      });

    if (
      !schedule ||
      !schedule.isWorking
    ) {
      return res.status(400).json({
        message:
          "Doctor is not available on this day",
      });
    }

    // Check Doctor Holiday

    const holiday =
      await DoctorHoliday.findOne({
        doctorId,
        clinicId: clinic._id,
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });

    if (holiday) {
      return res.status(400).json({
        message: holiday.reason
          ? `Doctor is unavailable: ${holiday.reason}`
          : "Doctor is unavailable on this date",
      });
    }

    // Check if Slot is Already Booked

    const existingAppointment =
      await Appointment.findOne({
        clinicId: clinic._id,
        doctorId,
        appointmentDate:
          selectedDate,
        status: "scheduled",
      });

    if (existingAppointment) {
      return res.status(409).json({
        message:
          "This appointment slot has already been booked. Please select another slot.",
      });
    }

    // Get Last Token Number for Doctor on Date

    const lastAppointment =
      await Appointment.findOne({
        clinicId: clinic._id,
        doctorId,
        appointmentDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
        .sort({
          tokenNumber: -1,
        })
        .select("tokenNumber");

    const tokenNumber =
      lastAppointment &&
      lastAppointment.tokenNumber
        ? lastAppointment.tokenNumber + 1
        : 1;

    // Create Appointment

    const appointment =
      await Appointment.create({
        clinicId: clinic._id,
        patientId: patient._id,
        doctorId: doctor._id,
        appointmentDate:
          selectedDate,
        tokenNumber,
        reason:
          reason?.trim() || undefined,
        status: "scheduled",
      });

    // Return Appointment Details

    res.status(201).json({
      message:
        "Appointment booked successfully",

      appointment: {
        _id: appointment._id,

        clinicId:
          appointment.clinicId,

        patient: {
          _id: patient._id,
          patientId:
            patient.patientId,
          name: patient.name,
          phone: patient.phone,
        },

        doctor: {
          _id: doctor._id,
          name: doctor.name,
          specialization:
            doctor.specialization,
        },

        appointmentDate:
          appointment.appointmentDate,

        tokenNumber:
          appointment.tokenNumber,

        reason:
          appointment.reason,

        status:
          appointment.status,
      },
    });
  } catch (error) {
    // Handle duplicate appointment

    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "This appointment slot has already been booked. Please select another slot.",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};