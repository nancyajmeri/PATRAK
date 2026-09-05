import Clinic from "../models/Clinic.js";

export const getMyClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.user.clinicId);

    if (!clinic) {
      return res.status(404).json({
        message: "Clinic not found",
      });
    }

    res.json(clinic);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};