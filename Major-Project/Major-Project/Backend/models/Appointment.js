import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    tokenNumber: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "scheduled",
        "completed",
        "cancelled",
      ],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent two appointments from being created
// for the same doctor at the exact same time.
appointmentSchema.index(
  {
    clinicId: 1,
    doctorId: 1,
    appointmentDate: 1,
  },
  {
    unique: true,
  }
);

// Token number must be unique for a doctor
// on a particular appointment date.
appointmentSchema.index(
  {
    clinicId: 1,
    doctorId: 1,
    appointmentDate: 1,
    tokenNumber: 1,
  },
  {
    unique: true,
  }
);

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema
);

export default Appointment;