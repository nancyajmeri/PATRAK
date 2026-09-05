import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    kioskCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    services: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Clinic = mongoose.model(
  "Clinic",
  clinicSchema
);

export default Clinic;