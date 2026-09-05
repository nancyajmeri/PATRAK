import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
  BarChart3,
} from "lucide-react";

import LogoutButton from "../../../components/common/LogoutButton/LogoutButton";

function ReportsAnalytics() {
  const navigate = useNavigate();

  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Check whether a report field exists
  // --------------------------------------------------

  const hasReport = (field) => {
    return (
      reports &&
      Object.prototype.hasOwnProperty.call(reports, field)
    );
  };

  // --------------------------------------------------
  // Fetch Reports
  // --------------------------------------------------

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://patrak-backend.vercel.app/api/reports",
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
          data.message || "Failed to fetch reports"
        );
      }

      setReports(data);
    } catch (error) {
      console.error("Fetch reports error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Load Reports
  // --------------------------------------------------

  useEffect(() => {
    fetchReports();
  }, []);

  // --------------------------------------------------
  // Module Availability
  //
  // The backend only returns fields for enabled modules.
  // Therefore, the frontend uses the returned fields
  // instead of making another clinic API request.
  // --------------------------------------------------

  const patientManagementEnabled =
    hasReport("totalPatients");

  const appointmentSchedulingEnabled =
    hasReport("totalAppointments");

  // --------------------------------------------------
  // Loading State
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading reports and analytics...
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // Error State
  // --------------------------------------------------

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}

        <div className="bg-[#023859] text-white px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between gap-6">
              <div>
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
                  Reports & Analytics
                </h1>
              </div>

              <LogoutButton />
            </div>
          </div>
        </div>

        {/* Error */}

        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-5 py-4 rounded-lg">
            {error}
          </div>
        </div>
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
                  navigate("/clinic-admin")
                }
                className="mb-4 text-gray-300 hover:text-white transition"
              >
                ← Back to Dashboard
              </button>

              <h1 className="text-3xl font-bold">
                Reports & Analytics
              </h1>

              <p className="mt-2 text-gray-300">
                Monitor your clinic's performance through
                meaningful reports and statistics.
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
        {reports && (
          <>
            {/* ==================================================
                Overview
            ================================================== */}

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#023859]">
                Clinic Overview
              </h2>

              <p className="text-gray-500 mt-1">
                A summary of your clinic's current activity.
              </p>
            </div>

            {/* ==================================================
                Statistics
            ================================================== */}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* ==================================================
                  Total Patients
                  Only when Patient Management is enabled
              ================================================== */}

              {patientManagementEnabled && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-semibold">
                        Total Patients
                      </p>

                      <p className="text-4xl font-bold text-[#023859] mt-2">
                        {reports.totalPatients}
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-[#EAF9FB] flex items-center justify-center text-[#54ACBF]">
                      <Users size={25} />
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================
                  Total Appointments
                  Only when Appointment Scheduling is enabled
              ================================================== */}

              {appointmentSchedulingEnabled && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-semibold">
                        Total Appointments
                      </p>

                      <p className="text-4xl font-bold text-[#023859] mt-2">
                        {reports.totalAppointments}
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-[#EAF9FB] flex items-center justify-center text-[#54ACBF]">
                      <CalendarDays size={25} />
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================
                  Today's Appointments
                  Only when Appointment Scheduling is enabled
              ================================================== */}

              {appointmentSchedulingEnabled && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-semibold">
                        Today's Appointments
                      </p>

                      <p className="text-4xl font-bold text-[#023859] mt-2">
                        {reports.todaysAppointments}
                      </p>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-[#EAF9FB] flex items-center justify-center text-[#54ACBF]">
                      <Clock3 size={25} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ==================================================
                Appointment Status
                Only when Appointment Scheduling is enabled
            ================================================== */}

            {appointmentSchedulingEnabled && (
              <div className="mt-10">
                <div className="flex items-center gap-3">
                  <BarChart3
                    size={25}
                    className="text-[#54ACBF]"
                  />

                  <h2 className="text-2xl font-bold text-[#023859]">
                    Appointment Status
                  </h2>
                </div>

                <p className="text-gray-500 mt-1 mb-5">
                  Current appointment status across your clinic.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* ==================================================
                      Scheduled
                  ================================================== */}

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                        <Clock3 size={24} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-500">
                          Scheduled
                        </p>

                        <p className="text-3xl font-bold text-[#023859] mt-1">
                          {reports.scheduledAppointments}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width:
                            reports.totalAppointments > 0
                              ? `${
                                  (reports.scheduledAppointments /
                                    reports.totalAppointments) *
                                  100
                                }%`
                              : "0%",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* ==================================================
                      Completed
                  ================================================== */}

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle2 size={24} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-500">
                          Completed
                        </p>

                        <p className="text-3xl font-bold text-[#023859] mt-1">
                          {reports.completedAppointments}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width:
                            reports.totalAppointments > 0
                              ? `${
                                  (reports.completedAppointments /
                                    reports.totalAppointments) *
                                  100
                                }%`
                              : "0%",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* ==================================================
                      Cancelled
                  ================================================== */}

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                        <XCircle size={24} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-500">
                          Cancelled
                        </p>

                        <p className="text-3xl font-bold text-[#023859] mt-1">
                          {reports.cancelledAppointments}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{
                          width:
                            reports.totalAppointments > 0
                              ? `${
                                  (reports.cancelledAppointments /
                                    reports.totalAppointments) *
                                  100
                                }%`
                              : "0%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================
                Summary
            ================================================== */}

            {(patientManagementEnabled ||
              appointmentSchedulingEnabled) && (
              <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-[#023859]">
                  Summary
                </h2>

                <div className="mt-5 space-y-3 text-gray-600">
                  {/* Patient Summary */}

                  {patientManagementEnabled && (
                    <p>
                      Your clinic currently has{" "}
                      <strong className="text-[#023859]">
                        {reports.totalPatients}
                      </strong>{" "}
                      registered patients.
                    </p>
                  )}

                  {/* Appointment Summary */}

                  {appointmentSchedulingEnabled && (
                    <>
                      <p>
                        There are{" "}
                        <strong className="text-[#023859]">
                          {reports.scheduledAppointments}
                        </strong>{" "}
                        scheduled appointments.
                      </p>

                      <p>
                        <strong className="text-green-600">
                          {reports.completedAppointments}
                        </strong>{" "}
                        appointments have been completed.
                      </p>

                      <p>
                        <strong className="text-red-600">
                          {reports.cancelledAppointments}
                        </strong>{" "}
                        appointments have been cancelled.
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ==================================================
                No Report Data
            ================================================== */}

            {!patientManagementEnabled &&
              !appointmentSchedulingEnabled && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                  <BarChart3
                    size={40}
                    className="mx-auto text-gray-400"
                  />

                  <h3 className="mt-4 text-xl font-bold text-[#023859]">
                    No Report Data Available
                  </h3>

                  <p className="mt-2 text-gray-500">
                    There are currently no enabled modules that
                    provide report data.
                  </p>
                </div>
              )}

            {/* ==================================================
                Refresh
            ================================================== */}

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={fetchReports}
                className="px-5 py-2.5 bg-[#54ACBF] text-white rounded-lg font-semibold hover:bg-[#4298AA] transition"
              >
                Refresh Reports
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReportsAnalytics;