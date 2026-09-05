import mongoose from "mongoose";

const doctorScheduleSchema = new mongoose.Schema(
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

    dayOfWeek: {
      type: String,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      required: true,
    },

    isWorking: {
      type: Boolean,
      default: true,
    },

    startTime: {
      type: String,
      default: null,
    },

    endTime: {
      type: String,
      default: null,
    },

    breaks: [
      {
        startTime: {
          type: String,
          required: true,
        },

        endTime: {
          type: String,
          required: true,
        },
      },
    ],

    appointmentDuration: {
      type: Number,
      default: 20,
      min: 5,
    },
  },
  {
    timestamps: true,
  }
);

doctorScheduleSchema.index(
  {
    doctorId: 1,
    dayOfWeek: 1,
  },
  {
    unique: true,
  }
);

const DoctorSchedule = mongoose.model(
  "DoctorSchedule",
  doctorScheduleSchema
);

export default DoctorSchedule;