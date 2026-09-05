import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      role: "super_admin",
    });

    if (existingAdmin) {
      console.log("Super Admin already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "PatrakAdmin@123",
      10
    );

    const admin = await User.create({
      name: "PATRAK Super Admin",
      email: "admin@patrak.com",
      password: hashedPassword,
      role: "super_admin",
      clinicId: null,
    });

    console.log("Super Admin created successfully.");
    console.log("Email: admin@patrak.com");
    console.log("Password: PatrakAdmin@123");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error creating Super Admin:", error.message);
    process.exit(1);
  }
};

createAdmin();