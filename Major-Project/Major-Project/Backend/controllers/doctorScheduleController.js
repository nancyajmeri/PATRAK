import DoctorSchedule from "../models/DoctorSchedule.js";
import User from "../models/User.js";

// Create or Update Doctor Schedule
export const saveDoctorSchedule = async (req, res) => {
  try {
    const {
      doctorId,
      dayOfWeek,
      isWorking,
      startTime,
      endTime,
      breaks,
      appointmentDuration,
    } = req.body;

    if (!doctorId || !dayOfWeek) {
      return res.status(400).json({
        message: "Doctor and day are required",
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

    // Validate working-day information
    if (isWorking) {
      if (!startTime || !endTime) {
        return res.status(400).json({
          message:
            "Start time and end time are required for working days",
        });
      }
    }

    // Find existing schedule
    let schedule = await DoctorSchedule.findOne({
      doctorId,
      clinicId: req.user.clinicId,
      dayOfWeek,
    });

    const scheduleData = {
      doctorId,
      clinicId: req.user.clinicId,
      dayOfWeek,
      isWorking,
      startTime: isWorking ? startTime : null,
      endTime: isWorking ? endTime : null,
      breaks: isWorking ? breaks || [] : [],
      appointmentDuration:
        appointmentDuration || 20,
    };

    if (schedule) {
      schedule = await DoctorSchedule.findByIdAndUpdate(
        schedule._id,
        scheduleData,
        {
          new: true,
          runValidators: true,
        }
      );
    } else {
      schedule = await DoctorSchedule.create(
        scheduleData
      );
    }

    res.json({
      message: "Doctor schedule saved successfully",
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Doctor Schedule
export const getDoctorSchedule = async (
  req,
  res
) => {
  try {
    const { doctorId } = req.params;

    // Check that the doctor belongs to the clinic
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

    const schedules = await DoctorSchedule.find({
      doctorId,
      clinicId: req.user.clinicId,
    }).sort({
      dayOfWeek: 1,
    });

    res.json(schedules);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};