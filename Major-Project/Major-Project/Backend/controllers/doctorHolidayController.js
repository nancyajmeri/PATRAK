import DoctorHoliday from "../models/DoctorHoliday.js";
import User from "../models/User.js";

// Add Holiday
export const addDoctorHoliday = async (req, res) => {
  try {
    const { doctorId, date, reason } = req.body;

    if (!doctorId || !date) {
      return res.status(400).json({
        message: "Doctor and holiday date are required",
      });
    }

    // Check that the doctor belongs to the logged-in clinic
    const doctor = await User.findOne({
      _id: doctorId,
      clinicId: req.user.clinicId,
      role: "doctor",
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found in your clinic",
      });
    }

    // Check if holiday already exists
    const existingHoliday = await DoctorHoliday.findOne({
      doctorId,
      clinicId: req.user.clinicId,
      date: new Date(date),
    });

    if (existingHoliday) {
      return res.status(400).json({
        message: "A holiday already exists for this date",
      });
    }

    const holiday = await DoctorHoliday.create({
      doctorId,
      clinicId: req.user.clinicId,
      date: new Date(date),
      reason: reason || "",
    });

    res.status(201).json({
      message: "Doctor holiday added successfully",
      holiday,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Doctor Holidays
export const getDoctorHolidays = async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Check that the doctor belongs to the logged-in clinic
    const doctor = await User.findOne({
      _id: doctorId,
      clinicId: req.user.clinicId,
      role: "doctor",
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found in your clinic",
      });
    }

    const holidays = await DoctorHoliday.find({
      doctorId,
      clinicId: req.user.clinicId,
    }).sort({
      date: 1,
    });

    res.json(holidays);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete Doctor Holiday
export const deleteDoctorHoliday = async (req, res) => {
  try {
    const holiday = await DoctorHoliday.findOneAndDelete({
      _id: req.params.id,
      clinicId: req.user.clinicId,
    });

    if (!holiday) {
      return res.status(404).json({
        message: "Holiday not found",
      });
    }

    res.json({
      message: "Doctor holiday deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};