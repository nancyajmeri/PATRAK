import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },

    patientId: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      trim: true,
    },

    bloodGroup: {
      type: String,
      trim: true,
    },

    medicalHistory: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

patientSchema.index(
  { clinicId: 1, patientId: 1 },
  { unique: true }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;