import crypto from "crypto";
import bcrypt from "bcryptjs";

import ClinicRequest from "../models/ClinicRequest.js";
import Clinic from "../models/Clinic.js";
import User from "../models/User.js";

import { resolveModules } from "../config/moduleDependencies.js";

// Generate the next Kiosk Code
const generateKioskCode = async () => {
  const lastClinic = await Clinic.findOne({
    kioskCode: {
      $regex: /^PATRAK-\d+$/i,
    },
  })
    .sort({ kioskCode: -1 })
    .select("kioskCode");

  if (!lastClinic || !lastClinic.kioskCode) {
    return "PATRAK-001";
  }

  const lastNumber = parseInt(
    lastClinic.kioskCode.replace(/^PATRAK-/i, ""),
    10
  );

  const nextNumber = lastNumber + 1;

  return `PATRAK-${String(nextNumber).padStart(3, "0")}`;
};

// Create Clinic Request
export const createClinicRequest = async (req, res) => {
  try {
    const {
      clinicName,
      ownerName,
      email,
      phone,
      address,
      city,
      services,
    } = req.body;

    // Basic validation
    if (
      !clinicName ||
      !ownerName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !services ||
      !Array.isArray(services) ||
      services.length === 0
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    /*
     * Resolve module dependencies on the backend.
     *
     * Example:
     *
     * Appointment Scheduling
     *      ↓
     * Patient Management
     * Staff Management
     *
     * Even if the frontend does not send the dependencies,
     * they will still be added here.
     */
    const resolvedServices = resolveModules(services);

    if (resolvedServices.length === 0) {
      return res.status(400).json({
        message: "Please select at least one valid service",
      });
    }

    // Check for an existing pending request
    const existingRequest = await ClinicRequest.findOne({
      email: normalizedEmail,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        message:
          "A clinic request with this email is already pending",
      });
    }

    // Create clinic request with resolved modules
    const clinicRequest = await ClinicRequest.create({
      clinicName: clinicName.trim(),
      ownerName: ownerName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      services: resolvedServices,
      status: "pending",
    });

    res.status(201).json({
      message: "Clinic request submitted successfully",

      request: clinicRequest,

      // Useful for the frontend/admin to know what was added.
      requestedServices: services,
      resolvedServices,
    });
  } catch (error) {
    console.error(
      "Create clinic request error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Clinic Requests
export const getClinicRequests = async (req, res) => {
  try {
    const requests = await ClinicRequest.find().sort({
      createdAt: -1,
    });

    res.json(requests);
  } catch (error) {
    console.error(
      "Get clinic requests error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Reject Clinic Request
export const rejectClinicRequest = async (req, res) => {
  try {
    const request = await ClinicRequest.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        message: "Clinic request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message:
          "This request has already been processed",
      });
    }

    request.status = "rejected";

    await request.save();

    res.json({
      message: "Clinic request rejected",
      request,
    });
  } catch (error) {
    console.error(
      "Reject clinic request error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Approve Clinic Request
export const approveClinicRequest = async (req, res) => {
  try {
    const request = await ClinicRequest.findById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        message: "Clinic request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message:
          "This request has already been processed",
      });
    }

    /*
     * Resolve dependencies again during approval.
     *
     * This protects the system even if:
     * - an old request was created before dependency logic
     * - someone manually modified the request
     * - the frontend sent incomplete module information
     */
    const resolvedServices = resolveModules(
      request.services || []
    );

    if (resolvedServices.length === 0) {
      return res.status(400).json({
        message:
          "The clinic request does not contain any valid services",
      });
    }

    // Check if a clinic with this email already exists
    const existingClinic = await Clinic.findOne({
      email: request.email,
    });

    if (existingClinic) {
      return res.status(400).json({
        message:
          "A clinic with this email already exists",
      });
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({
      email: request.email,
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          "A user with this email already exists",
      });
    }

    // Generate Kiosk Code
    const kioskCode = await generateKioskCode();

    /*
     * Create Clinic
     *
     * Store the resolved module list, not merely what
     * the requester originally selected.
     */
    const clinic = await Clinic.create({
      name: request.clinicName,
      kioskCode,
      ownerName: request.ownerName,
      email: request.email,
      phone: request.phone,
      address: request.address,
      city: request.city,
      services: resolvedServices,
      status: "active",
    });

    try {
      // Generate unique temporary password
      const temporaryPassword =
        "Patrak@" +
        crypto
          .randomBytes(6)
          .toString("hex");

      // Hash temporary password
      const hashedPassword = await bcrypt.hash(
        temporaryPassword,
        10
      );

      // Create Clinic Admin
      const clinicAdmin = await User.create({
        name: request.ownerName,
        email: request.email,
        password: hashedPassword,
        mustChangePassword: true,
        role: "clinic_admin",
        clinicId: clinic._id,
      });

      // Update request status
      request.status = "approved";

      // Keep the request synchronized with the final
      // resolved module configuration.
      request.services = resolvedServices;

      await request.save();

      res.json({
        message:
          "Clinic approved successfully",

        clinic: {
          id: clinic._id,
          name: clinic.name,
          kioskCode: clinic.kioskCode,
          services: clinic.services,
        },

        clinicAdmin: {
          id: clinicAdmin._id,
          name: clinicAdmin.name,
          email: clinicAdmin.email,
          role: clinicAdmin.role,
        },

        temporaryPassword,

        resolvedServices,
      });
    } catch (userCreationError) {
      /*
       * If Clinic Admin creation fails, remove the newly
       * created clinic so we don't leave behind a half-created
       * clinic.
       */
      await Clinic.findByIdAndDelete(clinic._id);

      throw userCreationError;
    }
  } catch (error) {
    console.error(
      "Approve clinic request error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};