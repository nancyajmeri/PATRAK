import mongoose from "mongoose";

const doctorHolidaySchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    clinicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

doctorHolidaySchema.index(
  {
    doctorId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

const DoctorHoliday = mongoose.model(
  "DoctorHoliday",
  doctorHolidaySchema
);

export default DoctorHoliday;