import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Kiosk() {
  const { kioskCode } = useParams();

  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [step, setStep] = useState("welcome");

  // Existing Patient

  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [selectedPatient, setSelectedPatient] =
    useState(null);

  // Doctors

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] =
    useState(false);
  const [doctorError, setDoctorError] =
    useState("");

  const [selectedDoctor, setSelectedDoctor] =
    useState(null);

  // Date and Slots

  const [selectedDate, setSelectedDate] =
    useState("");

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] =
    useState(false);
  const [slotError, setSlotError] =
    useState("");

  const [selectedSlot, setSelectedSlot] =
    useState(null);

  // New Patient

  const [newPatient, setNewPatient] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "",
    medicalHistory: "",
  });

  const [newPatientError, setNewPatientError] =
    useState("");

  const [creatingPatient, setCreatingPatient] =
    useState(false);

  // Appointment

  const [bookingAppointment, setBookingAppointment] =
    useState(false);

  const [appointmentError, setAppointmentError] =
    useState("");

  const [bookedAppointment, setBookedAppointment] =
    useState(null);

  // Load Clinic

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://patrak-backend.vercel.app/api/kiosk/${kioskCode}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load clinic"
          );
        }

        setClinic(data.clinic);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (kioskCode) {
      fetchClinic();
    }
  }, [kioskCode]);

  // Start Appointment

  const handleStart = () => {
    setStep("patient-type");
  };

  // Search Existing Patient

  const handleSearchPatient = async (e) => {
    e.preventDefault();

    if (!search.trim()) {
      setSearchError(
        "Please enter a Patient ID, name or phone number."
      );

      return;
    }

    try {
      setSearching(true);
      setSearchError("");
      setPatients([]);

      const response = await fetch(
        `https://patrak-backend.vercel.app/api/kiosk/${kioskCode}/patients?search=${encodeURIComponent(
          search.trim()
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to search patients"
        );
      }

      setPatients(data.patients || []);

      if (
        !data.patients ||
        data.patients.length === 0
      ) {
        setSearchError(
          "No patient found. Please check your details or register as a new patient."
        );
      }
    } catch (error) {
      setSearchError(error.message);
    } finally {
      setSearching(false);
    }
  };

  // Select Existing Patient

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setStep("patient-selected");
  };

  // Load Doctors

  const handleLoadDoctors = async () => {
    try {
      setLoadingDoctors(true);
      setDoctorError("");

      const response = await fetch(
        `https://patrak-backend.vercel.app/api/kiosk/${kioskCode}/doctors`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load doctors"
        );
      }

      setDoctors(data.doctors || []);
    } catch (error) {
      setDoctorError(error.message);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Continue to Doctor Selection

  const handleContinueToDoctors = async () => {
    setStep("doctor");

    await handleLoadDoctors();
  };

  // Select Doctor

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setStep("doctor-selected");
  };

  // Load Available Slots

  const handleDateChange = async (e) => {
    const date = e.target.value;

    setSelectedDate(date);
    setSelectedSlot(null);
    setSlots([]);
    setSlotError("");

    if (!date || !selectedDoctor) {
      return;
    }

    try {
      setLoadingSlots(true);

      const response = await fetch(
        `https://patrak-backend.vercel.app/api/kiosk/${kioskCode}/doctors/${selectedDoctor._id}/slots?date=${date}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load available slots"
        );
      }

      setSlots(data.slots || []);

      if (
        !data.slots ||
        data.slots.length === 0
      ) {
        setSlotError(
          data.message ||
            "No appointment slots are available on this date."
        );
      }
    } catch (error) {
      setSlotError(error.message);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Select Slot

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
  };

  // New Patient Form Change

  const handleNewPatientChange = (e) => {
    const { name, value } = e.target;

    setNewPatient((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Register New Patient

  const handleNewPatientSubmit = async (e) => {
    e.preventDefault();

    setNewPatientError("");

    if (
      !newPatient.name.trim() ||
      !newPatient.dateOfBirth ||
      !newPatient.gender ||
      !newPatient.phone.trim()
    ) {
      setNewPatientError(
        "Name, date of birth, gender and phone are required."
      );

      return;
    }

    try {
      setCreatingPatient(true);

      const response = await fetch(
        `https://patrak-backend.vercel.app/api/kiosk/${kioskCode}/patients`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: newPatient.name.trim(),
            dateOfBirth:
              newPatient.dateOfBirth,
            gender: newPatient.gender,
            phone: newPatient.phone.trim(),

            email:
              newPatient.email.trim() ||
              undefined,

            address:
              newPatient.address.trim() ||
              undefined,

            bloodGroup:
              newPatient.bloodGroup.trim() ||
              undefined,

            medicalHistory:
              newPatient.medicalHistory.trim() ||
              undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to register patient"
        );
      }

      // Store patient returned by backend

      setSelectedPatient(data.patient);

      // Continue to patient confirmation

      setStep("patient-selected");
    } catch (error) {
      setNewPatientError(error.message);
    } finally {
      setCreatingPatient(false);
    }
  };

  // Book Appointment

  const handleConfirmAppointment = async () => {
    if (
      !selectedPatient ||
      !selectedDoctor ||
      !selectedSlot
    ) {
      setAppointmentError(
        "Patient, doctor and appointment slot are required."
      );

      return;
    }

    try {
      setBookingAppointment(true);
      setAppointmentError("");

      const response = await fetch(
        `https://patrak-backend.vercel.app/api/kiosk/${kioskCode}/appointments`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            patientId: selectedPatient._id,
            doctorId: selectedDoctor._id,
            appointmentDate:
              selectedSlot.dateTime,
            reason: "General consultation",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to book appointment"
        );
      }

      setBookedAppointment(
        data.appointment
      );

      setStep("success");
    } catch (error) {
      setAppointmentError(error.message);
    } finally {
      setBookingAppointment(false);
    }
  };

  // Reset Kiosk

  const handleFinish = () => {
    setStep("welcome");

    setSearch("");
    setPatients([]);
    setSearchError("");

    setSelectedPatient(null);
    setSelectedDoctor(null);

    setSelectedDate("");
    setSlots([]);
    setSelectedSlot(null);
    setSlotError("");

    setNewPatient({
      name: "",
      dateOfBirth: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      bloodGroup: "",
      medicalHistory: "",
    });

    setNewPatientError("");
    setAppointmentError("");
    setBookedAppointment(null);
  };

  // Back Navigation

  const handleBack = () => {
    if (step === "patient-type") {
      setStep("welcome");
      return;
    }

    if (step === "existing-patient") {
      setSearch("");
      setPatients([]);
      setSearchError("");
      setStep("patient-type");

      return;
    }

    if (step === "new-patient") {
      setNewPatientError("");
      setStep("patient-type");

      return;
    }

    if (step === "patient-selected") {
      setSelectedPatient(null);
      setStep("patient-type");

      return;
    }

    if (step === "doctor") {
      setSelectedDoctor(null);
      setStep("patient-selected");

      return;
    }

    if (step === "doctor-selected") {
      setSelectedDoctor(null);
      setStep("doctor");

      return;
    }

    if (step === "date") {
      setSelectedDate("");
      setSlots([]);
      setSelectedSlot(null);
      setSlotError("");
      setStep("doctor-selected");

      return;
    }

    if (step === "confirmation") {
      setAppointmentError("");
      setStep("date");
    }
  };

  // Loading Screen

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading kiosk...
        </p>
      </div>
    );
  }

  // Error Screen

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">
            Kiosk Unavailable
          </h1>

          <p className="text-gray-600 mt-3">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <div className="bg-[#023859] text-white px-6 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold">
            {clinic.name}
          </h1>

          <p className="mt-2 text-gray-300">
            PATRAK Self-Service Kiosk
          </p>
        </div>
      </div>

      {/* Main Content */}

      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Welcome */}

        {step === "welcome" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
            <h2 className="text-3xl font-bold text-[#023859]">
              Welcome
            </h2>

            <p className="text-gray-500 mt-3">
              Book your appointment quickly
              and easily.
            </p>

            <button
              type="button"
              onClick={handleStart}
              className="mt-8 bg-[#54ACBF] text-white px-10 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition"
            >
              Start Appointment
            </button>
          </div>
        )}

        {/* Patient Type */}

        {step === "patient-type" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10">
            <button
              type="button"
              onClick={handleBack}
              className="text-gray-500 hover:text-[#023859]"
            >
              ← Back
            </button>

            <div className="text-center mt-4">
              <h2 className="text-2xl font-bold text-[#023859]">
                Are you an existing patient?
              </h2>

              <p className="text-gray-500 mt-2">
                Choose an option to continue.
              </p>

              <div className="grid gap-4 mt-8">
                <button
                  type="button"
                  onClick={() =>
                    setStep(
                      "existing-patient"
                    )
                  }
                  className="w-full border-2 border-[#54ACBF] text-[#023859] py-4 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Search Existing Patient
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setStep("new-patient")
                  }
                  className="w-full bg-[#54ACBF] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  I am a New Patient
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Existing Patient Search */}

        {step === "existing-patient" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <button
              type="button"
              onClick={handleBack}
              className="text-gray-500 hover:text-[#023859]"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-bold text-[#023859] mt-6">
              Find Your Patient Record
            </h2>

            <p className="text-gray-500 mt-2">
              Search using your Patient ID,
              name or phone number.
            </p>

            <form
              onSubmit={handleSearchPatient}
              className="mt-6"
            >
              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Patient ID, name or phone"
                className="w-full px-4 py-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
              />

              <button
                type="submit"
                disabled={searching}
                className="w-full mt-4 bg-[#54ACBF] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
              >
                {searching
                  ? "Searching..."
                  : "Search Patient"}
              </button>
            </form>

            {searchError && (
              <div className="mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {searchError}
              </div>
            )}

            {patients.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold text-gray-700">
                  Select your patient record
                </h3>

                {patients.map((patient) => (
                  <div
                    key={patient._id}
                    className="border border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-semibold text-[#023859]">
                        {patient.name}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {patient.patientId}
                      </p>

                      <p className="text-sm text-gray-500">
                        {patient.phone}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleSelectPatient(
                          patient
                        )
                      }
                      className="bg-[#54ACBF] text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* New Patient Registration */}

        {step === "new-patient" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <button
              type="button"
              onClick={handleBack}
              className="text-gray-500 hover:text-[#023859]"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-bold text-[#023859] mt-6">
              New Patient Registration
            </h2>

            <p className="text-gray-500 mt-2">
              Enter your details to create your
              patient record.
            </p>

            {newPatientError && (
              <div className="mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {newPatientError}
              </div>
            )}

            <form
              onSubmit={handleNewPatientSubmit}
              className="mt-6 space-y-5"
            >
              {/* Name */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={newPatient.name}
                  onChange={
                    handleNewPatientChange
                  }
                  placeholder="Enter full name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>

              {/* Date of Birth */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={
                    newPatient.dateOfBirth
                  }
                  onChange={
                    handleNewPatientChange
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>

              {/* Gender */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender
                </label>

                <select
                  name="gender"
                  value={newPatient.gender}
                  onChange={
                    handleNewPatientChange
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="male">
                    Male
                  </option>

                  <option value="female">
                    Female
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>
              </div>

              {/* Phone */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={newPatient.phone}
                  onChange={
                    handleNewPatientChange
                  }
                  placeholder="Enter phone number"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>

              {/* Email */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={newPatient.email}
                  onChange={
                    handleNewPatientChange
                  }
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>

              {/* Address */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>

                <textarea
                  name="address"
                  value={newPatient.address}
                  onChange={
                    handleNewPatientChange
                  }
                  placeholder="Enter address"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>

              {/* Blood Group */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Blood Group
                </label>

                <input
                  type="text"
                  name="bloodGroup"
                  value={
                    newPatient.bloodGroup
                  }
                  onChange={
                    handleNewPatientChange
                  }
                  placeholder="e.g. O+"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>

              {/* Medical History */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Medical History
                </label>

                <textarea
                  name="medicalHistory"
                  value={
                    newPatient.medicalHistory
                  }
                  onChange={
                    handleNewPatientChange
                  }
                  placeholder="Enter medical history if applicable"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={creatingPatient}
                className="w-full bg-[#54ACBF] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
              >
                {creatingPatient
                  ? "Registering Patient..."
                  : "Register & Continue"}
              </button>
            </form>
          </div>
        )}

        {/* Selected Patient */}

        {step === "patient-selected" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <button
              type="button"
              onClick={handleBack}
              className="text-gray-500 hover:text-[#023859]"
            >
              ← Back
            </button>

            <div className="text-center mt-6">
              <h2 className="text-2xl font-bold text-[#023859]">
                Patient Selected
              </h2>

              <div className="mt-6 bg-gray-50 rounded-xl p-6 text-left">
                <p>
                  <span className="font-semibold">
                    Patient ID:
                  </span>{" "}
                  {selectedPatient.patientId}
                </p>

                <p className="mt-2">
                  <span className="font-semibold">
                    Name:
                  </span>{" "}
                  {selectedPatient.name}
                </p>

                <p className="mt-2">
                  <span className="font-semibold">
                    Phone:
                  </span>{" "}
                  {selectedPatient.phone}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleContinueToDoctors
                }
                className="mt-8 w-full bg-[#54ACBF] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Doctor Selection */}

        {step === "doctor" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <button
              type="button"
              onClick={handleBack}
              className="text-gray-500 hover:text-[#023859]"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-bold text-[#023859] mt-6">
              Select Doctor
            </h2>

            <p className="text-gray-500 mt-2">
              Choose the doctor you would like
              to see.
            </p>

            {loadingDoctors && (
              <div className="mt-8 text-center">
                <p className="text-gray-500">
                  Loading doctors...
                </p>
              </div>
            )}

            {doctorError && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {doctorError}
              </div>
            )}

            {!loadingDoctors &&
              !doctorError &&
              doctors.length === 0 && (
                <div className="mt-6 bg-gray-50 border border-gray-200 text-gray-600 px-4 py-4 rounded-lg">
                  No doctors are currently
                  available at this clinic.
                </div>
              )}

            {!loadingDoctors &&
              doctors.length > 0 && (
                <div className="mt-6 space-y-3">
                  {doctors.map((doctor) => (
                    <button
                      key={doctor._id}
                      type="button"
                      onClick={() =>
                        handleSelectDoctor(
                          doctor
                        )
                      }
                      className="w-full text-left border border-gray-200 rounded-xl p-5 hover:border-[#54ACBF] hover:bg-gray-50 transition"
                    >
                      <p className="font-semibold text-[#023859]">
                        {doctor.name}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {doctor.specialization}
                      </p>
                    </button>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* Selected Doctor */}

        {step === "doctor-selected" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <button
              type="button"
              onClick={handleBack}
              className="text-gray-500 hover:text-[#023859]"
            >
              ← Back
            </button>

            <div className="text-center mt-6">
              <h2 className="text-2xl font-bold text-[#023859]">
                Doctor Selected
              </h2>

              <div className="mt-6 bg-gray-50 rounded-xl p-6 text-left">
                <p>
                  <span className="font-semibold">
                    Doctor:
                  </span>{" "}
                  {selectedDoctor.name}
                </p>

                <p className="mt-2">
                  <span className="font-semibold">
                    Specialization:
                  </span>{" "}
                  {selectedDoctor.specialization}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setStep("date")
                }
                className="mt-8 w-full bg-[#54ACBF] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Date and Slot Selection */}

        {step === "date" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <button
              type="button"
              onClick={handleBack}
              className="text-gray-500 hover:text-[#023859]"
            >
              ← Back
            </button>

            <h2 className="text-2xl font-bold text-[#023859] mt-6">
              Select Date & Time
            </h2>

            <p className="text-gray-500 mt-2">
              Choose a date and available
              appointment time.
            </p>

            <div className="mt-6 bg-gray-50 rounded-xl p-5">
              <p className="font-semibold text-[#023859]">
                {selectedDoctor.name}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {selectedDoctor.specialization}
              </p>
            </div>

            {/* Date */}

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Appointment Date
              </label>

              <input
                type="date"
                value={selectedDate}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={handleDateChange}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
              />
            </div>

            {/* Loading */}

            {loadingSlots && (
              <div className="mt-6 text-center">
                <p className="text-gray-500">
                  Checking available slots...
                </p>
              </div>
            )}

            {/* Error */}

            {slotError && !loadingSlots && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {slotError}
              </div>
            )}

            {/* Slots */}

            {!loadingSlots &&
              slots.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-700">
                    Available Slots
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    {slots.map((slot) => (
                      <button
                        key={slot.dateTime}
                        type="button"
                        onClick={() =>
                          handleSelectSlot(
                            slot
                          )
                        }
                        className={`py-3 px-4 rounded-lg border font-semibold transition ${
                          selectedSlot?.dateTime ===
                          slot.dateTime
                            ? "bg-[#54ACBF] text-white border-[#54ACBF]"
                            : "border-gray-300 text-[#023859] hover:border-[#54ACBF]"
                        }`}
                      >
                        {slot.displayTime}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Continue */}

            <button
              type="button"
              disabled={!selectedSlot}
              onClick={() =>
                setStep("confirmation")
              }
              className="w-full mt-8 bg-[#54ACBF] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {/* Appointment Confirmation */}

        {step === "confirmation" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <button
              type="button"
              onClick={handleBack}
              className="text-gray-500 hover:text-[#023859]"
            >
              ← Back
            </button>

            <div className="text-center mt-6">
              <h2 className="text-2xl font-bold text-[#023859]">
                Confirm Appointment
              </h2>

              <p className="text-gray-500 mt-2">
                Please review your appointment
                details before confirming.
              </p>
            </div>

            {appointmentError && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {appointmentError}
              </div>
            )}

            {/* Appointment Summary */}

            <div className="mt-8 bg-gray-50 rounded-xl p-6 space-y-5">
              {/* Patient */}

              <div>
                <p className="text-sm text-gray-500">
                  Patient
                </p>

                <p className="font-semibold text-[#023859] mt-1">
                  {selectedPatient.name}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedPatient.patientId}
                </p>
              </div>

              {/* Doctor */}

              <div>
                <p className="text-sm text-gray-500">
                  Doctor
                </p>

                <p className="font-semibold text-[#023859] mt-1">
                  {selectedDoctor.name}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedDoctor.specialization}
                </p>
              </div>

              {/* Date */}

              <div>
                <p className="text-sm text-gray-500">
                  Date
                </p>

                <p className="font-semibold text-[#023859] mt-1">
                  {new Date(
                    selectedSlot.dateTime
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Time */}

              <div>
                <p className="text-sm text-gray-500">
                  Appointment Time
                </p>

                <p className="font-semibold text-[#023859] mt-1">
                  {selectedSlot.displayTime}
                </p>
              </div>
            </div>

            {/* Confirm */}

            <button
              type="button"
              onClick={handleConfirmAppointment}
              disabled={bookingAppointment}
              className="w-full mt-8 bg-[#54ACBF] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
            >
              {bookingAppointment
                ? "Booking Appointment..."
                : "Confirm Appointment"}
            </button>
          </div>
        )}

        {/* Appointment Success */}

        {step === "success" && bookedAppointment && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-3xl text-green-600">
                ✓
              </span>
            </div>

            <h2 className="text-3xl font-bold text-[#023859] mt-6">
              Appointment Confirmed
            </h2>

            <p className="text-gray-500 mt-2">
              Your appointment has been booked
              successfully.
            </p>

            {/* Token Number */}

            <div className="mt-8 border-2 border-[#54ACBF] rounded-2xl p-6">
              <p className="text-sm text-gray-500">
                Your Token Number
              </p>

              <p className="text-5xl font-bold text-[#023859] mt-2">
                {bookedAppointment.tokenNumber}
              </p>
            </div>

            {/* Appointment Details */}

            <div className="mt-6 bg-gray-50 rounded-xl p-6 text-left space-y-4">
              <div>
                <p className="text-sm text-gray-500">
                  Patient
                </p>

                <p className="font-semibold text-[#023859]">
                  {bookedAppointment.patient.name}
                </p>

                <p className="text-sm text-gray-500">
                  {bookedAppointment.patient.patientId}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Doctor
                </p>

                <p className="font-semibold text-[#023859]">
                  {bookedAppointment.doctor.name}
                </p>

                <p className="text-sm text-gray-500">
                  {bookedAppointment.doctor.specialization}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Date
                </p>

                <p className="font-semibold text-[#023859]">
                  {new Date(
                    bookedAppointment.appointmentDate
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Time
                </p>

                <p className="font-semibold text-[#023859]">
                  {new Date(
                    bookedAppointment.appointmentDate
                  ).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <p className="text-gray-500 text-sm mt-6">
              Please remember your token number and
              proceed to the waiting area.
            </p>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full mt-8 bg-[#54ACBF] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Finish
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Kiosk;