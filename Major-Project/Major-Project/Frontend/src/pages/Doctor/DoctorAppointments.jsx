import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LogoutButton from "../../components/common/LogoutButton/LogoutButton";

function DoctorAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Fetch Doctor's Appointments
  // --------------------------------------------------

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "https://patrak-backend.vercel.app/api/appointments",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch appointments"
        );
      }

      setAppointments(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Load Appointments
  // --------------------------------------------------

  useEffect(() => {
    fetchAppointments();
  }, []);

  // --------------------------------------------------
  // Mark Appointment as Completed
  // --------------------------------------------------

  const handleComplete = async (appointmentId) => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `https://patrak-backend.vercel.app/api/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "completed",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update appointment"
        );
      }

      await fetchAppointments();
    } catch (error) {
      setError(error.message);
    }
  };

  // --------------------------------------------------
  // Format Date
  // --------------------------------------------------

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // --------------------------------------------------
  // Format Time
  // --------------------------------------------------

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // --------------------------------------------------
  // Get Date Key
  // --------------------------------------------------

  const getDateKey = (date) => {
    const formattedDate = new Date(date);

    const year = formattedDate.getFullYear();

    const month = String(
      formattedDate.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      formattedDate.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // --------------------------------------------------
  // Get Today's Date
  // --------------------------------------------------

  const getTodayDate = () => {
    return getDateKey(new Date());
  };

  // --------------------------------------------------
  // Sort All Appointments
  // --------------------------------------------------

  const sortedAppointments = [...appointments].sort(
    (a, b) =>
      new Date(a.appointmentDate) -
      new Date(b.appointmentDate)
  );

  // --------------------------------------------------
  // Appointment Statistics
  // --------------------------------------------------

  const todaysAppointments = appointments.filter(
    (appointment) =>
      getDateKey(
        appointment.appointmentDate
      ) === getTodayDate()
  );

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      new Date(appointment.appointmentDate) >
      new Date() &&
      appointment.status === "scheduled"
  );

  const completedAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "completed"
  );

  const cancelledAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "cancelled"
  );

  // --------------------------------------------------
  // Loading State
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading appointments...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ==================================================
          Header
      ================================================== */}

      <div className="bg-[#023859] text-white px-8 py-6">

        <div className="max-w-7xl mx-auto">

          <div className="flex items-center justify-between gap-6">

            <div>

              <button
                type="button"
                onClick={() =>
                  navigate("/doctor")
                }
                className="mb-4 text-gray-300 hover:text-white transition"
              >
                ← Back to Dashboard
              </button>

              <h1 className="text-3xl font-bold">
                My Appointments
              </h1>

              <p className="mt-2 text-gray-300">
                View and manage all your appointments.
              </p>

            </div>

            <LogoutButton />

          </div>

        </div>

      </div>

      {/* ==================================================
          Content
      ================================================== */}

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Error */}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-5 py-4 rounded-lg">
            {error}
          </div>
        )}

        {/* ==================================================
            Statistics
        ================================================== */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* Today's Appointments */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

            <p className="text-gray-500 text-sm font-semibold">
              Today's Appointments
            </p>

            <p className="text-4xl font-bold text-[#023859] mt-2">
              {todaysAppointments.length}
            </p>

            <p className="text-[#54ACBF] text-sm font-semibold mt-3">
              Today
            </p>

          </div>

          {/* Upcoming */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

            <p className="text-gray-500 text-sm font-semibold">
              Upcoming
            </p>

            <p className="text-4xl font-bold text-[#023859] mt-2">
              {upcomingAppointments.length}
            </p>

            <p className="text-blue-600 text-sm font-semibold mt-3">
              Scheduled
            </p>

          </div>

          {/* Completed */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

            <p className="text-gray-500 text-sm font-semibold">
              Completed
            </p>

            <p className="text-4xl font-bold text-[#023859] mt-2">
              {completedAppointments.length}
            </p>

            <p className="text-green-600 text-sm font-semibold mt-3">
              Finished
            </p>

          </div>

          {/* Cancelled */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

            <p className="text-gray-500 text-sm font-semibold">
              Cancelled
            </p>

            <p className="text-4xl font-bold text-[#023859] mt-2">
              {cancelledAppointments.length}
            </p>

            <p className="text-red-600 text-sm font-semibold mt-3">
              Cancelled
            </p>

          </div>

        </div>

        {/* ==================================================
            Appointment Header
        ================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div>

            <h2 className="text-2xl font-bold text-[#023859]">
              All Appointments
            </h2>

            <p className="text-gray-500 mt-1">
              View your today's, upcoming and previous appointments.
            </p>

          </div>

          <button
            type="button"
            onClick={fetchAppointments}
            disabled={loading}
            className="border border-gray-300 bg-white text-[#023859] px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>

        </div>

        {/* ==================================================
            Appointment Count
        ================================================== */}

        <div className="mb-5 text-sm text-gray-500">
          {appointments.length}{" "}
          appointment
          {appointments.length !== 1
            ? "s"
            : ""}{" "}
          in total.
        </div>

        {/* ==================================================
            Appointment List
        ================================================== */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {appointments.length === 0 ? (

            <div className="p-10 text-center">

              <div className="text-4xl mb-4">
                📅
              </div>

              <p className="text-lg font-semibold text-gray-700">
                No appointments found
              </p>

              <p className="text-gray-500 mt-2">
                You currently have no appointments scheduled.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-gray-50 border-b border-gray-200">

                  <tr>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Token
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Date
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Time
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Patient
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Phone
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

                  {sortedAppointments.map(
                    (appointment) => (

                      <tr
                        key={appointment._id}
                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                      >

                        {/* Token */}

                        <td className="px-6 py-4">

                          <span className="inline-flex items-center justify-center min-w-10 h-10 px-3 rounded-lg bg-[#023859] text-white font-bold">
                            #
                            {appointment.tokenNumber}
                          </span>

                        </td>

                        {/* Date */}

                        <td className="px-6 py-4 text-sm font-semibold text-gray-700 whitespace-nowrap">
                          {formatDate(
                            appointment.appointmentDate
                          )}
                        </td>

                        {/* Time */}

                        <td className="px-6 py-4 text-sm font-semibold text-gray-700 whitespace-nowrap">
                          {formatTime(
                            appointment.appointmentDate
                          )}
                        </td>

                        {/* Patient */}

                        <td className="px-6 py-4">

                          <p className="font-semibold text-[#023859]">
                            {
                              appointment.patientId
                                ?.name
                            }
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            Patient ID:{" "}
                            {
                              appointment.patientId
                                ?.patientId
                            }
                          </p>

                        </td>

                        {/* Phone */}

                        <td className="px-6 py-4 text-sm text-gray-700">
                          {
                            appointment.patientId
                              ?.phone
                          }
                        </td>

                        {/* Reason */}

                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                          {appointment.reason || "—"}
                        </td>

                        {/* Status */}

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

                        {/* Action */}

                        <td className="px-6 py-4">

                          {appointment.status ===
                            "scheduled" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleComplete(
                                  appointment._id
                                )
                              }
                              className="bg-[#54ACBF] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#4298AA] transition whitespace-nowrap"
                            >
                              Mark Completed
                            </button>
                          )}

                          {appointment.status ===
                            "completed" && (
                            <span className="text-green-600 text-sm font-semibold">
                              Completed
                            </span>
                          )}

                          {appointment.status ===
                            "cancelled" && (
                            <span className="text-gray-400 text-sm">
                              Cancelled
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
  );
}

export default DoctorAppointments;