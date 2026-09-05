import Clinic from "../models/Clinic.js";

// ==================================================
// Require a Specific Module
// ==================================================

const requireModule = (moduleName) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Not authorized",
        });
      }

      // Super Admin is not associated with a clinic.
      // Module restrictions do not apply to Super Admin.
      if (req.user.role === "super_admin") {
        return next();
      }

      if (!req.user.clinicId) {
        return res.status(403).json({
          message: "User is not associated with a clinic",
        });
      }

      const clinic = await Clinic.findById(
        req.user.clinicId
      ).select("services status");

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

      const enabledServices = clinic.services || [];

      if (!enabledServices.includes(moduleName)) {
        return res.status(403).json({
          message: `${moduleName} is not enabled for this clinic`,
        });
      }

      next();
    } catch (error) {
      console.error(
        "Module authorization error:",
        error
      );

      return res.status(500).json({
        message: "Failed to verify clinic module",
        error: error.message,
      });
    }
  };
};

export default requireModule;