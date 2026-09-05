import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";

// Generate the next Patient ID for a clinic
const generatePatientId = async (clinicId) => {
  const lastPatient = await Patient.findOne({
    clinicId,
  })
    .sort({ createdAt: -1 })
    .select("patientId");

  if (!lastPatient || !lastPatient.patientId) {
    return "PAT-0001";
  }

  const lastNumber = parseInt(
    lastPatient.patientId.replace("PAT-", ""),
    10
  );

  const nextNumber = lastNumber + 1;

  return `PAT-${String(nextNumber).padStart(4, "0")}`;
};

// Add Patient
export const createPatient = async (req, res) => {
  try {
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

    const clinicId = req.user.clinicId;

    if (!clinicId) {
      return res.status(400).json({
        message:
          "User is not associated with a clinic",
      });
    }

    // Generate Patient ID automatically
    const patientId =
      await generatePatientId(clinicId);

    const patient = await Patient.create({
      clinicId,
      patientId,
      name,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      bloodGroup,
      medicalHistory,
    });

    res.status(201).json({
      message: "Patient created successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Patients
export const getPatients = async (req, res) => {
  try {
    const { search } = req.query;

    const query = {
      clinicId: req.user.clinicId,
    };

    // Search by Patient ID, Name or Phone
    if (search && search.trim()) {
      const searchValue = search.trim();

      query.$or = [
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
      ];
    }

    const patients = await Patient.find(query)
      .sort({
        createdAt: -1,
      })
      .limit(search ? 10 : 100);

    res.json(patients);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Single Patient
export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      clinicId: req.user.clinicId,
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Patient Visit History
export const getPatientHistory = async (
  req,
  res
) => {
  try {
    const clinicId = req.user.clinicId;

    if (!clinicId) {
      return res.status(400).json({
        message:
          "User is not associated with a clinic",
      });
    }

    // First verify that the patient belongs
    // to the logged-in user's clinic
    const patient = await Patient.findOne({
      _id: req.params.id,
      clinicId,
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    // Get all appointments for this patient
    // within the same clinic
    const appointments =
      await Appointment.find({
        patientId: patient._id,
        clinicId,
      })
        .populate(
          "doctorId",
          "name specialization"
        )
        .sort({
          appointmentDate: -1,
        });

    const now = new Date();

    // Separate past/completed visits
    // from upcoming appointments
    const visitHistory = appointments.filter(
      (appointment) => {
        const appointmentDate = new Date(
          appointment.appointmentDate
        );

        return (
          appointmentDate < now ||
          appointment.status === "completed"
        );
      }
    );

    const upcomingAppointments =
      appointments.filter(
        (appointment) => {
          const appointmentDate = new Date(
            appointment.appointmentDate
          );

          return (
            appointmentDate >= now &&
            appointment.status !== "completed" &&
            appointment.status !== "cancelled"
          );
        }
      );

    res.json({
      patient,
      visitHistory,
      upcomingAppointments,
    });
  } catch (error) {
    console.error(
      "Get patient history error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update Patient
export const updatePatient = async (
  req,
  res
) => {
  try {
    const patient = await Patient.findOne({
      _id: req.params.id,
      clinicId: req.user.clinicId,
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

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

    patient.name = name ?? patient.name;

    patient.dateOfBirth =
      dateOfBirth ?? patient.dateOfBirth;

    patient.gender =
      gender ?? patient.gender;

    patient.phone =
      phone ?? patient.phone;

    patient.email =
      email ?? patient.email;

    patient.address =
      address ?? patient.address;

    patient.bloodGroup =
      bloodGroup ?? patient.bloodGroup;

    patient.medicalHistory =
      medicalHistory ?? patient.medicalHistory;

    // Patient ID is intentionally NOT changed
    await patient.save();

    res.json({
      message: "Patient updated successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete Patient
export const deletePatient = async (
  req,
  res
) => {
  try {
    const patient =
      await Patient.findOneAndDelete({
        _id: req.params.id,
        clinicId: req.user.clinicId,
      });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.json({
      message: "Patient deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};