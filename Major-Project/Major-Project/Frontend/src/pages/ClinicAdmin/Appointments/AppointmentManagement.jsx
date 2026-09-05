import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AppointmentManagement() {
  const navigate = useNavigate();

  // ==================================================
  // Clinic / Module State
  // ==================================================

  const [clinic, setClinic] = useState(null);
  const [loadingClinic, setLoadingClinic] = useState(true);

  const appointmentEnabled =
    clinic?.services?.includes(
      "Appointment Scheduling"
    );

  // ==================================================
  // Appointment State
  // ==================================================

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [patientId, setPatientId] = useState("");
  const [selectedPatient, setSelectedPatient] =
    useState(null);
  const [patientSearch, setPatientSearch] =
    useState("");

  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] =
    useState("");
  const [selectedSlot, setSelectedSlot] =
    useState("");
  const [reason, setReason] = useState("");

  // ==================================================
  // Loading / Messages
  // ==================================================

  const [loading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] =
    useState(false);
  const [loadingSlots, setLoadingSlots] =
    useState(false);
  const [loadingAppointments, setLoadingAppointments] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  // ==================================================
  // Filters
  // ==================================================

  const [filterDate, setFilterDate] =
    useState("");
  const [filterDoctor, setFilterDoctor] =
    useState("");
  const [filterStatus, setFilterStatus] =
    useState("");

  // ==================================================
  // Get Today's Date
  // ==================================================

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ==================================================
  // Fetch Clinic Information
  // ==================================================

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        setLoadingClinic(true);
        setError("");

        const token =
          localStorage.getItem("token");

        const response = await fetch(
          "https://patrak-backend.vercel.app/api/clinics/my-clinic",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch clinic information"
          );
        }

        setClinic(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoadingClinic(false);
      }
    };

    fetchClinic();
  }, []);

  // ==================================================
  // Fetch Doctors
  //
  // ONLY when Appointment Scheduling is enabled.
  // ==================================================

  useEffect(() => {
    if (!appointmentEnabled) {
      setDoctors([]);
      return;
    }

    const fetchDoctors = async () => {
      try {
        setError("");

        const token =
          localStorage.getItem("token");

        const response = await fetch(
          "https://patrak-backend.vercel.app/api/appointments/doctors",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch doctors"
          );
        }

        setDoctors(data);
      } catch (error) {
        setDoctors([]);
        setError(error.message);
      }
    };

    fetchDoctors();
  }, [appointmentEnabled]);

  // ==================================================
  // Search Patients
  //
  // Only search when Appointment Scheduling is enabled.
  // ==================================================

  useEffect(() => {
    if (!appointmentEnabled) {
      setPatients([]);
      return;
    }

    const searchPatients = async () => {
      if (!patientSearch.trim()) {
        setPatients([]);
        return;
      }

      try {
        setLoadingPatients(true);
        setError("");

        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `https://patrak-backend.vercel.app/api/patients?search=${encodeURIComponent(
            patientSearch.trim()
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to search patients"
          );
        }

        setPatients(data);
      } catch (error) {
        setPatients([]);
        setError(error.message);
      } finally {
        setLoadingPatients(false);
      }
    };

    const timeoutId = setTimeout(
      searchPatients,
      300
    );

    return () =>
      clearTimeout(timeoutId);
  }, [patientSearch, appointmentEnabled]);

  // ==================================================
  // Fetch Appointments
  // ==================================================

  const fetchAppointments = async () => {
    if (!appointmentEnabled) {
      setAppointments([]);
      return;
    }

    try {
      setLoadingAppointments(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "https://patrak-backend.vercel.app/api/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch appointments"
        );
      }

      setAppointments(data);
    } catch (error) {
      setAppointments([]);
      setError(error.message);
    } finally {
      setLoadingAppointments(false);
    }
  };

  // ==================================================
  // Load Appointments
  //
  // IMPORTANT:
  // Do NOT fetch appointments until we know that
  // Appointment Scheduling is enabled.
  // ==================================================

  useEffect(() => {
    if (appointmentEnabled) {
      fetchAppointments();
      setFilterDate(getTodayDate());
    }
  }, [appointmentEnabled]);

  // ==================================================
  // Fetch Available Slots
  // ==================================================

  useEffect(() => {
    if (
      !appointmentEnabled ||
      !doctorId ||
      !appointmentDate
    ) {
      setSlots([]);
      setSelectedSlot("");
      return;
    }

    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        setError("");
        setSelectedSlot("");

        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `https://patrak-backend.vercel.app/api/appointments/available-slots?doctorId=${doctorId}&date=${appointmentDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch available slots"
          );
        }

        setSlots(data.slots || []);
      } catch (error) {
        setSlots([]);
        setError(error.message);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [
    appointmentEnabled,
    doctorId,
    appointmentDate,
  ]);

  // ==================================================
  // Select Patient
  // ==================================================

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setPatientId(patient._id);
    setPatientSearch("");
    setPatients([]);
  };

  // ==================================================
  // Change Patient
  // ==================================================

  const handleChangePatient = () => {
    setSelectedPatient(null);
    setPatientId("");
    setPatientSearch("");
  };

  // ==================================================
  // Book Appointment
  // ==================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess(null);

    if (
      !patientId ||
      !doctorId ||
      !appointmentDate ||
      !selectedSlot
    ) {
      setError(
        "Please select patient, doctor, date and time."
      );
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "https://patrak-backend.vercel.app/api/appointments",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            patientId,
            doctorId,
            appointmentDate:
              selectedSlot,
            reason,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create appointment"
        );
      }

      setSuccess(data.appointment);

      setSelectedSlot("");
      setReason("");

      // Refresh available slots

      const slotsResponse =
        await fetch(
          `https://patrak-backend.vercel.app/api/appointments/available-slots?doctorId=${doctorId}&date=${appointmentDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const slotsData =
        await slotsResponse.json();

      setSlots(
        slotsData.slots || []
      );

      // Refresh appointment list

      await fetchAppointments();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // Cancel Appointment
  // ==================================================

  const handleCancelAppointment =
    async (appointmentId) => {
      const confirmed =
        window.confirm(
          "Are you sure you want to cancel this appointment?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");

        const token =
          localStorage.getItem("token");

        const response = await fetch(
          `https://patrak-backend.vercel.app/api/appointments/${appointmentId}/cancel`,
          {
            method: "PATCH",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to cancel appointment"
          );
        }

        await fetchAppointments();
      } catch (error) {
        setError(error.message);
      }
    };

  // ==================================================
  // Format Date
  // ==================================================

  const formatDate = (date) => {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==================================================
  // Format Time
  // ==================================================

  const formatTime = (date) => {
    return new Date(
      date
    ).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ==================================================
  // Appointment Date
  // ==================================================

  const getAppointmentDate = (date) => {
    const appointment =
      new Date(date);

    const year =
      appointment.getFullYear();

    const month = String(
      appointment.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      appointment.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ==================================================
  // Filter Appointments
  // ==================================================

  const filteredAppointments =
    appointments.filter(
      (appointment) => {
        const matchesDate =
          !filterDate ||
          getAppointmentDate(
            appointment.appointmentDate
          ) === filterDate;

        const matchesDoctor =
          !filterDoctor ||
          appointment.doctorId?._id ===
            filterDoctor;

        const matchesStatus =
          !filterStatus ||
          appointment.status ===
            filterStatus;

        return (
          matchesDate &&
          matchesDoctor &&
          matchesStatus
        );
      }
    );

  // ==================================================
  // Clear Filters
  // ==================================================

  const handleClearFilters = () => {
    setFilterDate("");
    setFilterDoctor("");
    setFilterStatus("");
  };

  // ==================================================
  // Loading Clinic
  // ==================================================

  if (loadingClinic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">
            Loading clinic information...
          </p>
        </div>
      </div>
    );
  }

  // ==================================================
  // Appointment Module Disabled
  //
  // IMPORTANT:
  // Do not render the appointment form.
  // Do not fetch doctors.
  // Do not fetch appointments.
  // ==================================================

  if (!appointmentEnabled) {
    return (
      <div className="min-h-screen bg-gray-50">

        {/* Header */}

        <div className="bg-[#023859] text-white px-8 py-6">
          <div className="max-w-7xl mx-auto">

            <button
              type="button"
              onClick={() =>
                navigate("/clinic-admin")
              }
              className="mb-4 text-gray-300 hover:text-white transition"
            >
              ← Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold">
              Appointments
            </h1>

            <p className="mt-2 text-gray-300">
              Schedule and manage clinic
              appointments.
            </p>

          </div>
        </div>

        {/* Disabled Module Message */}

        <div className="max-w-3xl mx-auto px-8 py-16">

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">

            <div className="w-16 h-16 mx-auto rounded-full bg-[#EAF9FB] flex items-center justify-center text-[#54ACBF] text-2xl font-bold">
              !
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#023859]">
              Appointment Scheduling is not enabled
            </h2>

            <p className="mt-3 text-gray-500 leading-7">
              Appointment Scheduling has not been
              enabled for this clinic.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/clinic-admin")
              }
              className="mt-6 bg-[#54ACBF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4298AA] transition"
            >
              Back to Dashboard
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ==================================================
  // Appointment Module Enabled
  // ==================================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}

      <div className="bg-[#023859] text-white px-8 py-6">

        <div className="max-w-7xl mx-auto">

          <button
            type="button"
            onClick={() =>
              navigate("/clinic-admin")
            }
            className="mb-4 text-gray-300 hover:text-white transition"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold">
            Appointments
          </h1>

          <p className="mt-2 text-gray-300">
            Schedule and manage clinic
            appointments.
          </p>

        </div>

      </div>

      {/* Content */}

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Error */}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-5 py-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Success */}

        {success && (
          <div className="mb-6 bg-green-100 border border-green-300 text-green-700 px-6 py-5 rounded-xl">

            <p className="font-bold text-lg">
              Appointment booked successfully!
            </p>

            <p className="mt-2">
              Token Number:{" "}
              <span className="font-bold">
                {success.tokenNumber}
              </span>
            </p>

            <p>
              Patient:{" "}
              {success.patientId?.name}
            </p>

            <p>
              Doctor:{" "}
              {success.doctorId?.name}
            </p>

            <p>
              Time:{" "}
              {formatTime(
                success.appointmentDate
              )}
            </p>

          </div>
        )}

        {/* ==================================================
            Create Appointment
        ================================================== */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          <h2 className="text-2xl font-bold text-[#023859]">
            Create Appointment
          </h2>

          <p className="text-gray-500 mt-1 mb-8">
            Select a patient, doctor and
            available time slot.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Patient */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Patient
              </label>

              {selectedPatient ? (
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex items-center justify-between">

                  <div>

                    <p className="font-semibold text-[#023859]">
                      {selectedPatient.patientId}
                      {" - "}
                      {selectedPatient.name}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Phone:{" "}
                      {selectedPatient.phone}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleChangePatient
                    }
                    className="text-[#54ACBF] font-semibold hover:underline"
                  >
                    Change
                  </button>

                </div>
              ) : (
                <div className="relative">

                  <input
                    type="text"
                    value={patientSearch}
                    onChange={(event) =>
                      setPatientSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search by patient ID, name or phone..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#54ACBF]"
                    disabled={loading}
                  />

                  {patientSearch.trim() && (
                    <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">

                      {loadingPatients ? (
                        <div className="px-4 py-4 text-gray-500">
                          Searching patients...
                        </div>
                      ) : patients.length === 0 ? (
                        <div className="px-4 py-4 text-gray-500">
                          No patients found.
                        </div>
                      ) : (
                        patients.map(
                          (patient) => (
                            <button
                              key={
                                patient._id
                              }
                              type="button"
                              onClick={() =>
                                handlePatientSelect(
                                  patient
                                )
                              }
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition"
                            >

                              <p className="font-semibold text-[#023859]">
                                {
                                  patient.patientId
                                }
                                {" - "}
                                {
                                  patient.name
                                }
                              </p>

                              <p className="text-sm text-gray-500 mt-1">
                                Phone:{" "}
                                {
                                  patient.phone
                                }
                              </p>

                            </button>
                          )
                        )
                      )}

                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Doctor */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Doctor
              </label>

              <select
                value={doctorId}
                onChange={(event) =>
                  setDoctorId(
                    event.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#54ACBF]"
                disabled={loading}
              >

                <option value="">
                  Select Doctor
                </option>

                {doctors.map(
                  (doctor) => (
                    <option
                      key={doctor._id}
                      value={doctor._id}
                    >
                      {doctor.name}
                      {doctor.specialization
                        ? ` - ${doctor.specialization}`
                        : ""}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* Appointment Date */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Appointment Date
              </label>

              <input
                type="date"
                value={appointmentDate}
                onChange={(event) =>
                  setAppointmentDate(
                    event.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#54ACBF]"
                disabled={!doctorId}
              />

            </div>

            {/* Available Slots */}

            {doctorId &&
              appointmentDate && (
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Available Time
                  </label>

                  {loadingSlots ? (
                    <p className="text-gray-500">
                      Loading available slots...
                    </p>
                  ) : slots.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-500">
                      No available slots for
                      this date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">

                      {slots.map(
                        (slot) => (
                          <button
                            key={
                              slot.dateTime
                            }
                            type="button"
                            onClick={() =>
                              setSelectedSlot(
                                slot.dateTime
                              )
                            }
                            className={`px-4 py-3 rounded-lg border font-semibold transition ${
                              selectedSlot ===
                              slot.dateTime
                                ? "bg-[#023859] text-white border-[#023859]"
                                : "bg-white text-[#023859] border-gray-300 hover:border-[#54ACBF] hover:bg-gray-50"
                            }`}
                          >
                            {
                              slot.displayTime
                            }
                          </button>
                        )
                      )}

                    </div>
                  )}

                </div>
              )}

            {/* Reason */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason for Visit{" "}
                <span className="text-gray-400 font-normal">
                  (Optional)
                </span>
              </label>

              <textarea
                value={reason}
                onChange={(event) =>
                  setReason(
                    event.target.value
                  )
                }
                rows="3"
                placeholder="Enter reason for visit..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#54ACBF]"
              />

            </div>

            {/* Submit */}

            <div className="flex justify-end pt-4">

              <button
                type="submit"
                disabled={
                  loading ||
                  loadingSlots ||
                  !selectedSlot ||
                  !patientId
                }
                className="bg-[#54ACBF] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#4298AA] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Booking..."
                  : "Book Appointment"}
              </button>

            </div>

          </form>

        </div>

        {/* ==================================================
            Appointment List
        ================================================== */}

        <div className="mt-10">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-2xl font-bold text-[#023859]">
                Appointments
              </h2>

              <p className="text-gray-500 mt-1">
                View and manage appointments.
              </p>

            </div>

            <button
              type="button"
              onClick={
                fetchAppointments
              }
              disabled={
                loadingAppointments
              }
              className="border border-gray-300 bg-white text-[#023859] px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
            >
              {loadingAppointments
                ? "Refreshing..."
                : "Refresh"}
            </button>

          </div>

          {/* Filters */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-5">

            <div className="grid md:grid-cols-4 gap-4">

              {/* Date */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date
                </label>

                <input
                  type="date"
                  value={filterDate}
                  onChange={(event) =>
                    setFilterDate(
                      event.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />

              </div>

              {/* Doctor */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Doctor
                </label>

                <select
                  value={filterDoctor}
                  onChange={(event) =>
                    setFilterDoctor(
                      event.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#54ACBF]"
                >

                  <option value="">
                    All Doctors
                  </option>

                  {doctors.map(
                    (doctor) => (
                      <option
                        key={doctor._id}
                        value={doctor._id}
                      >
                        {doctor.name}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* Status */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>

                <select
                  value={filterStatus}
                  onChange={(event) =>
                    setFilterStatus(
                      event.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#54ACBF]"
                >

                  <option value="">
                    All Status
                  </option>

                  <option value="scheduled">
                    Scheduled
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>

                </select>

              </div>

              {/* Clear */}

              <div className="flex items-end">

                <button
                  type="button"
                  onClick={
                    handleClearFilters
                  }
                  className="w-full border border-gray-300 bg-white text-gray-700 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Clear Filters
                </button>

              </div>

            </div>

            {/* Count */}

            <div className="mt-4 text-sm text-gray-500">

              Showing{" "}
              <span className="font-semibold text-[#023859]">
                {
                  filteredAppointments.length
                }
              </span>{" "}
              of{" "}
              <span className="font-semibold">
                {appointments.length}
              </span>{" "}
              appointments

            </div>

          </div>

          {/* Appointment Table */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

            {loadingAppointments ? (
              <div className="p-8 text-center text-gray-500">
                Loading appointments...
              </div>
            ) : filteredAppointments.length ===
              0 ? (
              <div className="p-8 text-center text-gray-500">
                No appointments match the
                selected filters.
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full text-left">

                  <thead className="bg-gray-50 border-b border-gray-200">

                    <tr>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                        Date
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                        Time
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                        Token
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                        Patient
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                        Doctor
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                        Reason
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                        Status
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredAppointments.map(
                      (appointment) => (
                        <tr
                          key={
                            appointment._id
                          }
                          className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                        >

                          <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                            {formatDate(
                              appointment.appointmentDate
                            )}
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                            {formatTime(
                              appointment.appointmentDate
                            )}
                          </td>

                          <td className="px-6 py-4 text-sm font-bold text-[#023859]">
                            {
                              appointment.tokenNumber
                            }
                          </td>

                          <td className="px-6 py-4">

                            <p className="font-semibold text-[#023859]">
                              {
                                appointment
                                  .patientId
                                  ?.name
                              }
                            </p>

                            <p className="text-xs text-gray-500">
                              {
                                appointment
                                  .patientId
                                  ?.patientId
                              }
                            </p>

                          </td>

                          <td className="px-6 py-4 text-sm text-gray-700">
                            {
                              appointment
                                .doctorId
                                ?.name
                            }
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                            {appointment.reason ||
                              "—"}
                          </td>

                          <td className="px-6 py-4">

                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                appointment.status ===
                                "scheduled"
                                  ? "bg-blue-100 text-blue-700"
                                  : appointment.status ===
                                    "completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {appointment.status
                                .charAt(0)
                                .toUpperCase() +
                                appointment.status.slice(
                                  1
                                )}
                            </span>

                          </td>

                          <td className="px-6 py-4">

                            {appointment.status ===
                              "scheduled" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleCancelAppointment(
                                    appointment._id
                                  )
                                }
                                className="text-red-600 font-semibold text-sm hover:underline"
                              >
                                Cancel
                              </button>
                            )}

                            {appointment.status ===
                              "cancelled" && (
                              <span className="text-gray-400 text-sm">
                                Cancelled
                              </span>
                            )}

                            {appointment.status ===
                              "completed" && (
                              <span className="text-green-600 text-sm">
                                Completed
                              </span>
                            )}

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default AppointmentManagement;