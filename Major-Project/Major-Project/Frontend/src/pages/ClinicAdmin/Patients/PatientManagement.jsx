import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PatientManagement() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  // Patient profile
  const [viewingPatient, setViewingPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "",
    medicalHistory: "",
  });

  // ==================================================
  // Fetch Patients
  // ==================================================

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://patrak-backend.vercel.app/api/patients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch patients"
        );
      }

      setPatients(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // ==================================================
  // View Patient Profile + History
  // ==================================================

  const handleViewPatient = async (patient) => {
    try {
      setError("");
      setHistoryError("");
      setViewingPatient(patient);
      setPatientHistory(null);
      setHistoryLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://patrak-backend.vercel.app/api/patients/${patient._id}/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch patient history"
        );
      }

      setPatientHistory(data);
    } catch (error) {
      setHistoryError(error.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  const closePatientProfile = () => {
    setViewingPatient(null);
    setPatientHistory(null);
    setHistoryError("");
  };

  // ==================================================
  // Handle Form Changes
  // ==================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==================================================
  // Reset Form
  // ==================================================

  const resetForm = () => {
    setFormData({
      name: "",
      dateOfBirth: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      bloodGroup: "",
      medicalHistory: "",
    });

    setEditingPatient(null);
    setShowForm(false);
  };

  // ==================================================
  // Add / Update Patient
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const url = editingPatient
        ? `https://patrak-backend.vercel.app/api/patients/${editingPatient._id}`
        : "https://patrak-backend.vercel.app/api/patients";

      const response = await fetch(url, {
        method: editingPatient ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (editingPatient
              ? "Failed to update patient"
              : "Failed to create patient")
        );
      }

      if (!editingPatient && data.patient?.patientId) {
        setSuccess(
          `Patient created successfully. Patient ID: ${data.patient.patientId}`
        );
      } else {
        setSuccess("Patient updated successfully.");
      }

      resetForm();
      await fetchPatients();
    } catch (error) {
      setError(error.message);
    }
  };

  // ==================================================
  // Edit Patient
  // ==================================================

  const handleEdit = (patient) => {
    setEditingPatient(patient);

    setFormData({
      name: patient.name,
      dateOfBirth: patient.dateOfBirth
        ? patient.dateOfBirth.split("T")[0]
        : "",
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email || "",
      address: patient.address || "",
      bloodGroup: patient.bloodGroup || "",
      medicalHistory: patient.medicalHistory || "",
    });

    setShowForm(true);
    closePatientProfile();
    setSuccess("");
  };

  // ==================================================
  // Delete Patient
  // ==================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://patrak-backend.vercel.app/api/patients/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete patient"
        );
      }

      setSuccess("Patient deleted successfully.");
      fetchPatients();
    } catch (error) {
      setError(error.message);
    }
  };

  // ==================================================
  // Formatting Helpers
  // ==================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "scheduled":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ==================================================
  // Patient Profile
  // ==================================================

  if (viewingPatient) {
    const patient =
      patientHistory?.patient || viewingPatient;

    const visitHistory =
      patientHistory?.visitHistory || [];

    const upcomingAppointments =
      patientHistory?.upcomingAppointments || [];

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-[#023859] text-white px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={closePatientProfile}
              className="mb-4 text-sm text-gray-300 hover:text-white transition"
            >
              ← Back to Patient Management
            </button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">
                  Patient Profile
                </h1>

                <p className="mt-2 text-gray-300">
                  View patient information and visit history.
                </p>
              </div>

              <div className="bg-white/10 px-5 py-3 rounded-xl">
                <p className="text-xs text-gray-300">
                  Patient ID
                </p>

                <p className="font-bold text-lg">
                  {patient.patientId}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-10">
          {/* Error */}
          {historyError && (
            <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-5 py-4 rounded-lg">
              {historyError}
            </div>
          )}

          {/* Patient Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#023859]">
                  Patient Information
                </h2>

                <p className="text-gray-500 mt-1">
                  Personal and medical information
                </p>
              </div>

              <button
                onClick={() => handleEdit(patient)}
                className="bg-[#54ACBF] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#26658C] transition"
              >
                Edit Patient
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">
                  Full Name
                </p>
                <p className="font-semibold mt-1 text-gray-800">
                  {patient.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Patient ID
                </p>
                <p className="font-semibold mt-1 text-[#023859]">
                  {patient.patientId}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Date of Birth
                </p>
                <p className="font-semibold mt-1">
                  {formatDate(patient.dateOfBirth)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Gender
                </p>
                <p className="font-semibold mt-1 capitalize">
                  {patient.gender || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Phone
                </p>
                <p className="font-semibold mt-1">
                  {patient.phone || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>
                <p className="font-semibold mt-1">
                  {patient.email || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Blood Group
                </p>
                <p className="font-semibold mt-1">
                  {patient.bloodGroup || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Address
                </p>
                <p className="font-semibold mt-1">
                  {patient.address || "-"}
                </p>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <p className="text-sm text-gray-500">
                  Medical History
                </p>

                <p className="font-semibold mt-1 whitespace-pre-wrap">
                  {patient.medicalHistory || "-"}
                </p>
              </div>
            </div>
          </div>

          {historyLoading ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="animate-pulse">
                <p className="text-gray-500">
                  Loading patient history...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Upcoming Appointments */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#023859]">
                      Upcoming Appointments
                    </h2>

                    <p className="text-gray-500 mt-1">
                      Future scheduled appointments
                    </p>
                  </div>

                  <div className="bg-[#54ACBF]/10 text-[#023859] px-4 py-2 rounded-lg font-semibold">
                    {upcomingAppointments.length}
                  </div>
                </div>

                {upcomingAppointments.length === 0 ? (
                  <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center">
                    <p className="text-gray-500">
                      No upcoming appointments.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                            Date
                          </th>

                          <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                            Time
                          </th>

                          <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                            Doctor
                          </th>

                          <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                            Token
                          </th>

                          <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                            Reason
                          </th>

                          <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {upcomingAppointments.map(
                          (appointment) => (
                            <tr
                              key={appointment._id}
                              className="border-b last:border-b-0"
                            >
                              <td className="px-5 py-4">
                                {formatDate(
                                  appointment.appointmentDate
                                )}
                              </td>

                              <td className="px-5 py-4">
                                {formatTime(
                                  appointment.appointmentDate
                                )}
                              </td>

                              <td className="px-5 py-4">
                                <p className="font-semibold">
                                  {appointment.doctorId?.name ||
                                    "Unknown Doctor"}
                                </p>

                                {appointment.doctorId
                                  ?.specialization && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {
                                      appointment.doctorId
                                        .specialization
                                    }
                                  </p>
                                )}
                              </td>

                              <td className="px-5 py-4 font-semibold text-[#023859]">
                                {appointment.tokenNumber ??
                                  "-"}
                              </td>

                              <td className="px-5 py-4">
                                {appointment.reason || "-"}
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getStatusClass(
                                    appointment.status
                                  )}`}
                                >
                                  {appointment.status ||
                                    "Unknown"}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Visit History */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#023859]">
                      Visit History
                    </h2>

                    <p className="text-gray-500 mt-1">
                      Previous appointments and clinic visits
                    </p>
                  </div>

                  <div className="bg-[#023859]/10 text-[#023859] px-4 py-2 rounded-lg font-semibold">
                    {visitHistory.length}
                  </div>
                </div>

                {visitHistory.length === 0 ? (
                  <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center">
                    <p className="text-gray-500">
                      No visit history available.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                            Date
                          </th>

                          <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                            Time
                          </th>

                          <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                            Doctor
                          </th>

                          <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                            Token
                          </th>

                          <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                            Reason
                          </th>

                          <th className="text-left px-5 py-4 text-sm font-semibold text-gray-600">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {visitHistory.map(
                          (appointment) => (
                            <tr
                              key={appointment._id}
                              className="border-b last:border-b-0 hover:bg-gray-50"
                            >
                              <td className="px-5 py-4">
                                {formatDate(
                                  appointment.appointmentDate
                                )}
                              </td>

                              <td className="px-5 py-4">
                                {formatTime(
                                  appointment.appointmentDate
                                )}
                              </td>

                              <td className="px-5 py-4">
                                <p className="font-semibold">
                                  {appointment.doctorId?.name ||
                                    "Unknown Doctor"}
                                </p>

                                {appointment.doctorId
                                  ?.specialization && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {
                                      appointment.doctorId
                                        .specialization
                                    }
                                  </p>
                                )}
                              </td>

                              <td className="px-5 py-4 font-semibold text-[#023859]">
                                {appointment.tokenNumber ??
                                  "-"}
                              </td>

                              <td className="px-5 py-4">
                                {appointment.reason || "-"}
                              </td>

                              <td className="px-5 py-4">
                                <span
                                  className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getStatusClass(
                                    appointment.status
                                  )}`}
                                >
                                  {appointment.status ||
                                    "Unknown"}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Back Button */}
          <div className="mt-8">
            <button
              onClick={closePatientProfile}
              className="px-6 py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 font-semibold text-gray-700 transition"
            >
              ← Back to Patient Management
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // Patient Management
  // ==================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#023859] text-white px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/clinic-admin")}
            className="mb-4 text-sm text-gray-300 hover:text-white transition"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold">
            Patient Management
          </h1>

          <p className="mt-2 text-gray-300">
            Manage your clinic's patients.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-100 border border-green-300 text-green-700 px-5 py-4 rounded-lg">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-5 py-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Top Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#023859]">
              Patients
            </h2>

            <p className="text-gray-500 mt-1">
              {patients.length} patient
              {patients.length !== 1 ? "s" : ""} registered
            </p>
          </div>

          <button
            onClick={() => {
              setEditingPatient(null);
              setShowForm(!showForm);
              setSuccess("");
            }}
            className="bg-[#54ACBF] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#26658C] transition"
          >
            {showForm ? "Close Form" : "+ Add Patient"}
          </button>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <h3 className="text-xl font-bold text-[#023859] mb-6">
              {editingPatient
                ? "Edit Patient"
                : "Add New Patient"}
            </h3>

            <form
              onSubmit={handleSubmit}
              className="grid md:grid-cols-2 gap-5"
            >
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
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
                <label className="block text-sm font-semibold mb-2">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Blood Group
                </label>

                <input
                  type="text"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  placeholder="e.g. O+"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Patient address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>

              {/* Medical History */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Medical History
                </label>

                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter relevant medical history"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#54ACBF] text-white py-3 rounded-lg font-semibold hover:bg-[#26658C] transition"
                >
                  {editingPatient
                    ? "Update Patient"
                    : "Add Patient"}
                </button>

                {editingPatient && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Patient List */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <p className="text-gray-500">
              Loading patients...
            </p>
          </div>
        ) : patients.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <p className="text-gray-500">
              No patients registered yet.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Patient ID
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Name
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Gender
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Phone
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Blood Group
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {patients.map((patient) => (
                    <tr
                      key={patient._id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-semibold text-[#023859]">
                        {patient.patientId}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleViewPatient(patient)
                          }
                          className="font-semibold text-[#023859] hover:text-[#54ACBF] hover:underline transition"
                        >
                          {patient.name}
                        </button>
                      </td>

                      <td className="px-6 py-4 capitalize">
                        {patient.gender}
                      </td>

                      <td className="px-6 py-4">
                        {patient.phone}
                      </td>

                      <td className="px-6 py-4">
                        {patient.bloodGroup || "-"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleViewPatient(patient)
                            }
                            className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
                          >
                            View
                          </button>

                          <button
                            onClick={() =>
                              handleEdit(patient)
                            }
                            className="px-3 py-2 text-sm rounded-lg bg-[#54ACBF] text-white hover:bg-[#26658C]"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(patient._id)
                            }
                            className="px-3 py-2 text-sm rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientManagement;