import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LogoutButton from "../../components/common/LogoutButton/LogoutButton";

function ClinicAdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [clinic, setClinic] = useState(null);

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // Module Configuration
  // ==================================================

  const modules = [
    {
      name: "Patient Management",
      description:
        "Add, view, edit and manage your clinic's patients.",
      route: "/clinic-admin/patients",
    },
    {
      name: "Appointment Scheduling",
      description:
        "Schedule and manage appointments for your clinic.",
      route: "/clinic-admin/appointments",
    },
    {
      name: "Token Management",
      description:
        "Manage patient tokens and clinic queues.",
      route: "/clinic-admin/appointments",
    },
    {
      name: "Staff Management",
      description:
        "Manage doctors and receptionists in your clinic.",
      route: "/clinic-admin/staff",
    },
    {
      name: "Reports & Analytics",
      description:
        "Monitor clinic performance through meaningful reports and analytics.",
      route: "/clinic-admin/reports",
    },
  ];

  // ==================================================
  // Fetch Clinic
  // ==================================================

  const fetchClinic = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "https://patrak-backend.vercel.app/api/clinics/my-clinic",
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
        data.message || "Failed to fetch clinic"
      );
    }

    return data;
  };

  // ==================================================
  // Fetch Patients
  // ==================================================

  const fetchPatients = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "https://patrak-backend.vercel.app/api/patients",
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
        data.message || "Failed to fetch patients"
      );
    }

    return data;
  };

  // ==================================================
  // Fetch Appointments
  // ==================================================

  const fetchAppointments = async () => {
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

    return data;
  };

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
  // Load Dashboard
  // ==================================================

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // ------------------------------------------
        // Fetch clinic first
        // ------------------------------------------

        const clinicData =
          await fetchClinic();

        setClinic(clinicData);

        const enabledServices =
          clinicData.services || [];

        // ------------------------------------------
        // Patient Management
        // ------------------------------------------

        if (
          enabledServices.includes(
            "Patient Management"
          )
        ) {
          const patientData =
            await fetchPatients();

          setPatients(patientData);
        } else {
          setPatients([]);
        }

        // ------------------------------------------
        // Appointment Scheduling
        //
        // IMPORTANT:
        // Appointments are never fetched unless
        // Appointment Scheduling is enabled.
        // ------------------------------------------

        if (
          enabledServices.includes(
            "Appointment Scheduling"
          )
        ) {
          const appointmentData =
            await fetchAppointments();

          setAppointments(
            appointmentData
          );
        } else {
          setAppointments([]);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // ==================================================
  // Enabled Modules
  // ==================================================

  const enabledServices =
    clinic?.services || [];

  const hasService = (serviceName) =>
    enabledServices.includes(serviceName);

  const enabledModules = modules.filter(
    (module) =>
      hasService(module.name)
  );

  // ==================================================
  // Today's Appointments
  // ==================================================

  const todaysAppointments =
    appointments.filter((appointment) => {
      const appointmentDate =
        new Date(
          appointment.appointmentDate
        );

      const year =
        appointmentDate.getFullYear();

      const month = String(
        appointmentDate.getMonth() + 1
      ).padStart(2, "0");

      const day = String(
        appointmentDate.getDate()
      ).padStart(2, "0");

      const date =
        `${year}-${month}-${day}`;

      return (
        date === getTodayDate() &&
        appointment.status === "scheduled"
      );
    });

  // ==================================================
  // Kiosk
  // ==================================================

  const kioskCode =
    clinic?.kioskCode;

  const kioskUrl = kioskCode
    ? `${window.location.origin}/kiosk/${kioskCode}`
    : "";

  const handleOpenKiosk = () => {
    if (!kioskUrl) {
      return;
    }

    window.open(
      kioskUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCopyKioskUrl = async () => {
    if (!kioskUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        kioskUrl
      );

      alert(
        "Kiosk URL copied successfully."
      );
    } catch {
      setError(
        "Unable to copy the kiosk URL."
      );
    }
  };

  // ==================================================
  // Loading
  // ==================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading clinic dashboard...
        </p>
      </div>
    );
  }

  // ==================================================
  // Dashboard
  // ==================================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ==================================================
          Header
      ================================================== */}

      <div className="bg-[#023859] text-white px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">

          <div>
            <h1 className="text-3xl font-bold">
              Clinic Admin Dashboard
            </h1>

            <p className="mt-2 text-gray-300">
              Welcome back,{" "}
              {user?.name || "Clinic Admin"}
            </p>
          </div>

          <LogoutButton />

        </div>
      </div>

      {/* ==================================================
          Main Content
      ================================================== */}

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Error */}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-5 py-4 rounded-lg">
            {error}
          </div>
        )}

        {clinic && (
          <>

            {/* ==================================================
                Clinic Information
            ================================================== */}

            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                  <h2 className="text-2xl font-bold text-[#023859]">
                    {clinic.name}
                  </h2>

                  <p className="mt-2 text-gray-600">
                    Owner: {clinic.ownerName}
                  </p>

                  <p className="text-gray-600">
                    City: {clinic.city}
                  </p>

                </div>

                <span className="inline-flex w-fit px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold capitalize">
                  {clinic.status}
                </span>

              </div>

            </section>

            {/* ==================================================
                Kiosk
            ================================================== */}

            <section className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                <div>

                  <h2 className="text-2xl font-bold text-[#023859]">
                    Kiosk
                  </h2>

                  <p className="mt-1 text-gray-500">
                    Use this link to open your clinic's
                    patient self-service kiosk.
                  </p>

                </div>

                {kioskCode && (
                  <div className="flex flex-wrap gap-3">

                    <button
                      type="button"
                      onClick={handleOpenKiosk}
                      className="px-5 py-3 bg-[#023859] text-white rounded-lg font-semibold hover:bg-[#034d78] transition"
                    >
                      Open Kiosk
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyKioskUrl}
                      className="px-5 py-3 border border-[#023859] text-[#023859] rounded-lg font-semibold hover:bg-gray-50 transition"
                    >
                      Copy Link
                    </button>

                  </div>
                )}

              </div>

              {kioskCode && (
                <div className="mt-6 grid md:grid-cols-2 gap-5">

                  <div className="bg-gray-50 rounded-xl p-5">

                    <p className="text-gray-500 text-sm font-semibold">
                      Kiosk Code
                    </p>

                    <p className="mt-2 text-xl font-bold text-[#023859]">
                      {kioskCode}
                    </p>

                  </div>

                  <div className="bg-gray-50 rounded-xl p-5">

                    <p className="text-gray-500 text-sm font-semibold">
                      Kiosk URL
                    </p>

                    <p className="mt-2 text-sm font-medium text-[#023859] break-all">
                      {kioskUrl}
                    </p>

                  </div>

                </div>
              )}

            </section>

            {/* ==================================================
                Clinic Overview
            ================================================== */}

            {enabledServices.length > 0 && (
              <section className="mt-10">

                <h2 className="text-2xl font-bold text-[#023859]">
                  Clinic Overview
                </h2>

                <p className="text-gray-500 mt-1 mb-5">
                  A quick overview of the features currently
                  enabled for your clinic.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                  {/* Patient Statistics */}

                  {hasService(
                    "Patient Management"
                  ) && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/clinic-admin/patients"
                        )
                      }
                      className="text-left bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                    >

                      <p className="text-gray-500 text-sm font-semibold">
                        Total Patients
                      </p>

                      <p className="text-4xl font-bold text-[#023859] mt-2">
                        {patients.length}
                      </p>

                      <p className="text-[#54ACBF] text-sm font-semibold mt-3">
                        Manage Patients →
                      </p>

                    </button>
                  )}

                  {/* Appointment Statistics */}

                  {hasService(
                    "Appointment Scheduling"
                  ) && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/clinic-admin/appointments"
                        )
                      }
                      className="text-left bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                    >

                      <p className="text-gray-500 text-sm font-semibold">
                        Total Appointments
                      </p>

                      <p className="text-4xl font-bold text-[#023859] mt-2">
                        {appointments.length}
                      </p>

                      <p className="text-[#54ACBF] text-sm font-semibold mt-3">
                        Manage Appointments →
                      </p>

                    </button>
                  )}

                  {/* Today's Scheduled Appointments */}

                  {hasService(
                    "Appointment Scheduling"
                  ) && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/clinic-admin/appointments"
                        )
                      }
                      className="text-left bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                    >

                      <p className="text-gray-500 text-sm font-semibold">
                        Today's Appointments
                      </p>

                      <p className="text-4xl font-bold text-[#023859] mt-2">
                        {todaysAppointments.length}
                      </p>

                      <p className="text-[#54ACBF] text-sm font-semibold mt-3">
                        View Today's Schedule →
                      </p>

                    </button>
                  )}

                  {/* Token Management */}

                  {hasService(
                    "Token Management"
                  ) && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/clinic-admin/appointments"
                        )
                      }
                      className="text-left bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                    >

                      <p className="text-gray-500 text-sm font-semibold">
                        Token Management
                      </p>

                      <p className="text-2xl font-bold text-[#023859] mt-3">
                        Enabled
                      </p>

                      <p className="text-[#54ACBF] text-sm font-semibold mt-3">
                        View Today's Queue →
                      </p>

                    </button>
                  )}

                </div>

              </section>
            )}

            {/* ==================================================
                Clinic Management
            ================================================== */}

            <section className="mt-10">

              <h2 className="text-2xl font-bold text-[#023859]">
                Clinic Management
              </h2>

              <p className="text-gray-500 mt-1 mb-5">
                Manage the functions available to your clinic.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                {/* Enabled Modules */}

                {enabledModules.map(
                  (module) => (
                    <button
                      key={module.name}
                      type="button"
                      onClick={() =>
                        navigate(
                          module.route
                        )
                      }
                      className="text-left bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                    >

                      <h3 className="text-lg font-bold text-[#023859]">
                        {module.name}
                      </h3>

                      <p className="mt-2 text-gray-500 text-sm">
                        {module.description}
                      </p>

                      <p className="mt-4 text-[#54ACBF] text-sm font-semibold">
                        Open {module.name} →
                      </p>

                    </button>
                  )
                )}

                {/* Doctor Schedule
                    Available whenever Staff Management
                    is enabled.
                */}

                {user?.role === "clinic_admin" &&
                  hasService("Staff Management") && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/clinic-admin/doctor-schedule"
                        )
                      }
                      className="text-left bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                    >

                      <h3 className="text-lg font-bold text-[#023859]">
                        Doctor Schedule
                      </h3>

                      <p className="mt-2 text-gray-500 text-sm">
                        Manage doctor working hours,
                        breaks and appointment duration.
                      </p>

                      <p className="mt-4 text-[#54ACBF] text-sm font-semibold">
                        Manage Doctor Schedule →
                      </p>

                    </button>
                  )}

              </div>

              {/* No management modules */}

              {enabledModules.length === 0 &&
                !hasService("Staff Management") && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                    <p className="text-gray-500">
                      No clinic management modules are
                      currently enabled.
                    </p>
                  </div>
                )}

            </section>

          </>
        )}

      </div>

    </div>
  );
}

export default ClinicAdminDashboard;