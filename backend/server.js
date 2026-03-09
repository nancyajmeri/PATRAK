const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Patient = require("./models/Patient");
const Visit = require("./models/Visit");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.static("frontend"));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/patrakDB")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("PATRAK Backend Running");
});

// Register Patient API

app.post("/api/patients/register", async (req, res) => {

  try {

    const { fullName, age, gender, phone } = req.body;

    // Backend validation
    if (!fullName || fullName.length < 3) {
      return res.status(400).json({ message: "Invalid name" });
    }

    if (age < 0 || age > 120) {
      return res.status(400).json({ message: "Invalid age" });
    }

    if (!["Male","Female","Other"].includes(gender)) {
      return res.status(400).json({ message: "Invalid gender" });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }

    // NEW UX IMPROVEMENT
    const existingPatient = await Patient.findOne({
      fullName: { $regex: `^${fullName}$`, $options: "i" },
      phone: phone
    });

    if (existingPatient) {
      return res.status(400).json({
        message: "Patient already exists. Please search instead."
      });
    }

    const patient = new Patient({
      fullName,
      age,
      gender,
      phone
    });

    await patient.save();

    res.json({
      message: "Patient registered",
      patient
    });

  } catch (error) {

    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });

  }

});

// Create Visit + Generate Token API
app.post("/api/visits", async (req, res) => {

  try {

    const { patientId, visitDate, visitTime, doctor, visitType } = req.body;

    const today = new Date().toISOString().split("T")[0];

    if (!["New","Follow-up"].includes(visitType)) {
  return res.status(400).json({
    message: "Invalid visit type"
  });
}
    let tokenNumber = null;

    // Generate token immediately if visit is today
    if (visitDate === today) {

      const lastVisit = await Visit.findOne({
            visitDate,
            tokenNumber: { $ne: null }
               }).sort({ tokenNumber: -1 });

      tokenNumber = lastVisit ? lastVisit.tokenNumber + 1 : 1;

    }

    const visit = new Visit({
      patientId,
      visitDate,
      visitTime,
      doctor,
      visitType,
      tokenNumber
    });

    await visit.save();

    res.json({ visit });

  } catch (error) {

    res.status(500).json({
      message: "Error creating visit",
      error: error.message
    });

  }

});

// Generate tokens for pending visits when the day starts
app.get("/api/visits/today", async (req, res) => {

  try {

    const today = new Date().toISOString().split("T")[0];

    // Find visits today with no token yet
    const pendingVisits = await Visit.find({
      visitDate: today,
      tokenNumber: null
    }).sort({ createdAt: 1 });

    // Find last token issued today
    const lastVisit = await Visit.findOne({
      visitDate: today,
      tokenNumber: { $ne: null }
    }).sort({ tokenNumber: -1 });

    let nextToken = lastVisit ? lastVisit.tokenNumber + 1 : 1;

    // Assign tokens to pending visits
    for (let visit of pendingVisits) {

      visit.tokenNumber = nextToken++;
      await visit.save();

    }

    // Return today's visits
    const todayVisits = await Visit.find({ visitDate: today }).populate("patientId");
    res.json(todayVisits);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching today's visits",
      error: error.message
    });

  }

});

// Status update
app.put("/api/visits/:id/status", async (req, res) => {

  try {

    const visitId = req.params.id;
    const { status } = req.body;

    const visit = await Visit.findByIdAndUpdate(
      visitId,
      { status: status },
      { new: true }
    );

    res.json({
      message: "Status updated",
      visit
    });

  } catch (error) {

    res.status(500).json({
      message: "Status update failed",
      error: error.message
    });

  }

});

// Search Patient (by name or phone)
app.get("/api/patients/search", async (req, res) => {

  try {

    const query = req.query.query;

    if (!query) {
      return res.json([]);
    }

    const patients = await Patient.find({
      $or: [
        { fullName: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } }
      ]
    }).limit(10);

    res.json(patients);

  } catch (error) {

    res.status(500).json({
      message: "Error searching patients",
      error: error.message
    });

  }

});

// Get patient visit history
app.get("/api/patients/:id/history", async (req, res) => {

  try {

    const patientId = req.params.id;

    const visits = await Visit.find({ patientId })
      .sort({ visitDate: -1 });

    res.json(visits);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching patient history",
      error: error.message
    });

  }

});

//live token
app.get("/api/live-token", async (req, res) => {

  try {

    const today = new Date().toISOString().split("T")[0];

    const visits = await Visit.find({
      visitDate: today
    })
    .populate("patientId")
    .sort({ tokenNumber: 1 });

    res.json(visits);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching live tokens",
      error: error.message
    });

  }

});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});