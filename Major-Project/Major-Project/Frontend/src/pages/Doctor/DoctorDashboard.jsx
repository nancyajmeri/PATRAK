import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LogoutButton from "../../components/common/LogoutButton/LogoutButton";

function DoctorDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Fetch Doctor Appointments
  // --------------------------------------------------

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

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

      // TEMPORARY DEBUGGING
      console.log(
        "Doctor appointments:",
        data
      );

      console.log(
        "Scheduled appointments:",
        data.filter(
          (appointment) =>
            appointment.status === "scheduled"
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Load User and Appointments
  // --------------------------------------------------

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    fetchAppointments();
  }, []);

  // --------------------------------------------------
  // Get Today's Date
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Check if Appointment is Today
  // --------------------------------------------------

  const isToday = (date) => {
    const appointmentDate = new Date(date);

    const year = appointmentDate.getFullYear();

    const month = String(
      appointmentDate.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      appointmentDate.getDate()
    ).padStart(2, "0");

    return (
      `${year}-${month}-${day}` ===
      getTodayDate()
    );
  };

  // --------------------------------------------------
  // Appointment Statistics
  // --------------------------------------------------

  const todaysAppointments = appointments.filter(
    (appointment) =>
      isToday(appointment.appointmentDate)
  );

  const scheduledAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status === "scheduled"
    );

  const completedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status === "completed"
    );

  const cancelledAppointments =
    appointments.filter(
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
          Loading doctor dashboard...
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

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">

          <div>

            <h1 className="text-3xl font-bold">
              Doctor Dashboard
            </h1>

            <p className="mt-2 text-gray-300">
              Welcome back,{" "}
              {user?.name || "Doctor"}
            </p>

          </div>

          <LogoutButton />

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
            Welcome
        ================================================== */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          <h2 className="text-2xl font-bold text-[#023859]">
            Welcome,{" "}
            {user?.name || "Doctor"}
          </h2>

          <p className="mt-2 text-gray-500">
            Manage your appointments and patient
            visits from here.
          </p>

        </div>

        {/* ==================================================
            Statistics
        ================================================== */}

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-5">

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

          {/* Scheduled */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

            <p className="text-gray-500 text-sm font-semibold">
              Scheduled
            </p>

            <p className="text-4xl font-bold text-[#023859] mt-2">
              {scheduledAppointments.length}
            </p>

            <p className="text-blue-600 text-sm font-semibold mt-3">
              Upcoming
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
            Today's Appointments
        ================================================== */}

        <div className="mt-10">

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-2xl font-bold text-[#023859]">
                Today's Appointments
              </h2>

              <p className="text-gray-500 mt-1">
                Your appointments scheduled for today.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/doctor/appointments")
              }
              className="bg-[#54ACBF] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#4298AA] transition"
            >
              View All
            </button>

          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

            {todaysAppointments.length === 0 ? (

              <div className="p-8 text-center text-gray-500">

                <p>
                  No appointments scheduled for today.
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
                        Time
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                        Patient
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                        Reason
                      </th>

                      <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {todaysAppointments
                      .slice(0, 5)
                      .map((appointment) => (

                        <tr
                          key={appointment._id}
                          className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                        >

                          {/* Token */}

                          <td className="px-6 py-4">

                            <span className="font-bold text-[#023859]">
                              #
                              {appointment.tokenNumber}
                            </span>

                          </td>

                          {/* Time */}

                          <td className="px-6 py-4 text-sm text-gray-700">

                            {new Date(
                              appointment.appointmentDate
                            ).toLocaleTimeString(
                              "en-IN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
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

                            <p className="text-xs text-gray-500">
                              {
                                appointment.patientId
                                  ?.patientId
                              }
                            </p>

                          </td>

                          {/* Reason */}

                          <td className="px-6 py-4 text-sm text-gray-600">
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
                                appointment.status.slice(1)}
                            </span>

                          </td>

                        </tr>

                      ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

        {/* ==================================================
            Quick Action
        ================================================== */}

        <div className="mt-8">

          <button
            type="button"
            onClick={() =>
              navigate("/doctor/appointments")
            }
            className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition"
          >

            <h3 className="text-lg font-bold text-[#023859]">
              Manage My Appointments →
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              View all your appointments and mark
              completed visits.
            </p>

          </button>

        </div>

      </div>

    </div>
  );
}

export default DoctorDashboard;