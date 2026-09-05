import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// ==================================================
// Generate Temporary Password
// ==================================================

const generateTemporaryPassword = () => {
  return (
    "Patrak@" +
    crypto.randomBytes(6).toString("hex")
  );
};

// ==================================================
// Create Staff
// ==================================================

export const createStaff = async (req, res) => {
  try {
    const {
      name,
      email,
      role,
      specialization,
    } = req.body;

    // --------------------------------------------------
    // Validate required fields
    // --------------------------------------------------

    if (!name || !email || !role) {
      return res.status(400).json({
        message:
          "Name, email and role are required",
      });
    }

    // --------------------------------------------------
    // Only Doctor and Receptionist can be created
    // --------------------------------------------------

    if (
      !["doctor", "receptionist"].includes(role)
    ) {
      return res.status(400).json({
        message:
          "Only doctors and receptionists can be created",
      });
    }

    // --------------------------------------------------
    // Specialization is required for doctors
    // --------------------------------------------------

    if (
      role === "doctor" &&
      !specialization?.trim()
    ) {
      return res.status(400).json({
        message:
          "Specialization is required for doctors",
      });
    }

    // --------------------------------------------------
    // Clinic ID
    // --------------------------------------------------

    const clinicId = req.user.clinicId;

    if (!clinicId) {
      return res.status(400).json({
        message:
          "Clinic Admin is not associated with a clinic",
      });
    }

    // --------------------------------------------------
    // Check existing email
    // --------------------------------------------------

    const normalizedEmail =
      email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          "A user with this email already exists",
      });
    }

    // --------------------------------------------------
    // Generate temporary password
    // --------------------------------------------------

    const temporaryPassword =
      generateTemporaryPassword();

    const hashedPassword =
      await bcrypt.hash(
        temporaryPassword,
        10
      );

    // --------------------------------------------------
    // Prepare staff data
    // --------------------------------------------------

    const staffData = {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
      clinicId,
      mustChangePassword: true,
    };

    // --------------------------------------------------
    // Doctor specialization
    // --------------------------------------------------

    if (role === "doctor") {
      staffData.specialization =
        specialization.trim();
    }

    // --------------------------------------------------
    // Create account
    // --------------------------------------------------

    const staff =
      await User.create(staffData);

    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    res.status(201).json({
      message:
        "Staff account created successfully",

      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        specialization:
          staff.specialization || null,
        clinicId: staff.clinicId,
      },

      temporaryPassword,
    });
  } catch (error) {
    console.error(
      "Create staff error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// Get Clinic Staff / Doctors
// ==================================================

export const getStaff = async (req, res) => {
  try {
    const staff = await User.find({
      clinicId: req.user.clinicId,

      role: {
        $in: [
          "doctor",
          "receptionist",
        ],
      },
    })
      .select("-password")
      .sort({
        createdAt: -1,
      });

    res.json(staff);
  } catch (error) {
    console.error(
      "Get staff error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================================================
// Get Single Staff Member
// ==================================================

export const getStaffMember = async (
  req,
  res
) => {
  try {
    const staff = await User.findOne({
      _id: req.params.id,

      clinicId: req.user.clinicId,

      role: {
        $in: [
          "doctor",
          "receptionist",
        ],
      },
    }).select("-password");

    if (!staff) {
      return res.status(404).json({
        message:
          "Staff member not found",
      });
    }

    res.json(staff);
  } catch (error) {
    console.error(
      "Get staff member error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};