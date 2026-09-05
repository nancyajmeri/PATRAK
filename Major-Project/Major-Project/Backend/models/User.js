import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    mustChangePassword: {
      type: Boolean,
      default: false,
    },

    specialization: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: [
        "super_admin",
        "clinic_admin",
        "doctor",
        "receptionist",
      ],
      required: true,
    },

    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;