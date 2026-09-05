import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const createEmptySchedule = () => {
  return daysOfWeek.map((day) => ({
    dayOfWeek: day,
    isWorking: false,
    startTime: "",
    endTime: "",
    breaks: [],
    appointmentDuration: 20,
  }));
};

function DoctorSchedule() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const [schedule, setSchedule] = useState(
    createEmptySchedule()
  );

  const [holidays, setHolidays] = useState([]);
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayReason, setHolidayReason] = useState("");

  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [loadingHolidays, setLoadingHolidays] = useState(false);

  const [saving, setSaving] = useState(false);
  const [savingHoliday, setSavingHoliday] = useState(false);

  const [moduleDisabled, setModuleDisabled] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==================================================
  // Fetch Doctors
  // ==================================================

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      setError("");
      setModuleDisabled(false);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://patrak-backend.vercel.app/api/staff",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Backend returns 403 when neither
        // Staff Management nor Appointment Scheduling
        // is enabled.

        if (response.status === 403) {
          setModuleDisabled(true);
          return;
        }

        throw new Error(
          data.message || "Failed to fetch doctors"
        );
      }

      const doctorList = data.filter(
        (member) => member.role === "doctor"
      );

      setDoctors(doctorList);

      if (doctorList.length > 0) {
        setSelectedDoctor(doctorList[0]._id);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // ==================================================
  // Load Doctors
  // ==================================================

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ==================================================
  // Fetch Selected Doctor Schedule
  // ==================================================

  const fetchSchedule = async (doctorId) => {
    if (!doctorId) {
      return;
    }

    try {
      setLoadingSchedule(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://patrak-backend.vercel.app/api/doctor-schedules/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch schedule"
        );
      }

      const newSchedule = createEmptySchedule();

      data.forEach((savedDay) => {
        const index = newSchedule.findIndex(
          (day) =>
            day.dayOfWeek === savedDay.dayOfWeek
        );

        if (index !== -1) {
          newSchedule[index] = {
            dayOfWeek: savedDay.dayOfWeek,
            isWorking: savedDay.isWorking,
            startTime: savedDay.startTime || "",
            endTime: savedDay.endTime || "",
            breaks: savedDay.breaks || [],
            appointmentDuration:
              savedDay.appointmentDuration || 20,
          };
        }
      });

      setSchedule(newSchedule);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingSchedule(false);
    }
  };

  // ==================================================
  // Fetch Selected Doctor Holidays
  // ==================================================

  const fetchHolidays = async (doctorId) => {
    if (!doctorId) {
      return;
    }

    try {
      setLoadingHolidays(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://patrak-backend.vercel.app/api/doctor-holidays/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch holidays"
        );
      }

      setHolidays(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingHolidays(false);
    }
  };

  // ==================================================
  // Load Schedule and Holidays when Doctor Changes
  // ==================================================

  useEffect(() => {
    if (selectedDoctor && !moduleDisabled) {
      fetchSchedule(selectedDoctor);
      fetchHolidays(selectedDoctor);
    }
  }, [selectedDoctor, moduleDisabled]);

  // ==================================================
  // Update Day
  // ==================================================

  const updateDay = (index, field, value) => {
    setSchedule((previous) =>
      previous.map((day, dayIndex) =>
        dayIndex === index
          ? {
              ...day,
              [field]: value,
            }
          : day
      )
    );
  };

  // ==================================================
  // Toggle Working Day
  // ==================================================

  const toggleWorkingDay = (index) => {
    setSchedule((previous) =>
      previous.map((day, dayIndex) =>
        dayIndex === index
          ? {
              ...day,
              isWorking: !day.isWorking,
              startTime: !day.isWorking
                ? day.startTime
                : "",
              endTime: !day.isWorking
                ? day.endTime
                : "",
              breaks: !day.isWorking
                ? day.breaks
                : [],
            }
          : day
      )
    );
  };

  // ==================================================
  // Add Break
  // ==================================================

  const addBreak = (index) => {
    setSchedule((previous) =>
      previous.map((day, dayIndex) =>
        dayIndex === index
          ? {
              ...day,
              breaks: [
                ...day.breaks,
                {
                  startTime: "",
                  endTime: "",
                },
              ],
            }
          : day
      )
    );
  };

  // ==================================================
  // Update Break
  // ==================================================

  const updateBreak = (
    dayIndex,
    breakIndex,
    field,
    value
  ) => {
    setSchedule((previous) =>
      previous.map((day, index) => {
        if (index !== dayIndex) {
          return day;
        }

        const updatedBreaks = day.breaks.map(
          (breakItem, index) =>
            index === breakIndex
              ? {
                  ...breakItem,
                  [field]: value,
                }
              : breakItem
        );

        return {
          ...day,
          breaks: updatedBreaks,
        };
      })
    );
  };

  // ==================================================
  // Remove Break
  // ==================================================

  const removeBreak = (
    dayIndex,
    breakIndex
  ) => {
    setSchedule((previous) =>
      previous.map((day, index) => {
        if (index !== dayIndex) {
          return day;
        }

        return {
          ...day,
          breaks: day.breaks.filter(
            (_, index) => index !== breakIndex
          ),
        };
      })
    );
  };

  // ==================================================
  // Save Schedule
  // ==================================================

  const saveSchedule = async (day) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (day.isWorking) {
        if (!day.startTime || !day.endTime) {
          throw new Error(
            `Please provide working hours for ${formatDay(
              day.dayOfWeek
            )}.`
          );
        }

        if (day.startTime >= day.endTime) {
          throw new Error(
            `End time must be later than start time for ${formatDay(
              day.dayOfWeek
            )}.`
          );
        }

        for (const breakItem of day.breaks) {
          if (
            !breakItem.startTime ||
            !breakItem.endTime
          ) {
            throw new Error(
              `Please complete all break times for ${formatDay(
                day.dayOfWeek
              )}.`
            );
          }

          if (
            breakItem.startTime >=
            breakItem.endTime
          ) {
            throw new Error(
              `Break end time must be later than break start time for ${formatDay(
                day.dayOfWeek
              )}.`
            );
          }
        }
      }

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://patrak-backend.vercel.app/api/doctor-schedules",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            doctorId: selectedDoctor,
            dayOfWeek: day.dayOfWeek,
            isWorking: day.isWorking,
            startTime: day.startTime,
            endTime: day.endTime,
            breaks: day.breaks,
            appointmentDuration:
              Number(day.appointmentDuration),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save doctor schedule"
        );
      }

      setSuccess(
        `${formatDay(
          day.dayOfWeek
        )} schedule saved successfully.`
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // Add Holiday
  // ==================================================

  const addHoliday = async (e) => {
    e.preventDefault();

    try {
      setSavingHoliday(true);
      setError("");
      setSuccess("");

      if (!holidayDate) {
        throw new Error(
          "Please select a holiday date."
        );
      }

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://patrak-backend.vercel.app/api/doctor-holidays",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            doctorId: selectedDoctor,
            date: holidayDate,
            reason: holidayReason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add holiday"
        );
      }

      setSuccess(
        "Doctor holiday added successfully."
      );

      setHolidayDate("");
      setHolidayReason("");

      await fetchHolidays(selectedDoctor);
    } catch (error) {
      setError(error.message);
    } finally {
      setSavingHoliday(false);
    }
  };

  // ==================================================
  // Delete Holiday
  // ==================================================

  const deleteHoliday = async (holidayId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this holiday?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://patrak-backend.vercel.app/api/doctor-holidays/${holidayId}`,
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
          data.message || "Failed to delete holiday"
        );
      }

      setSuccess(
        "Doctor holiday removed successfully."
      );

      await fetchHolidays(selectedDoctor);
    } catch (error) {
      setError(error.message);
    }
  };

  // ==================================================
  // Format Day
  // ==================================================

  const formatDay = (day) => {
    return (
      day.charAt(0).toUpperCase() +
      day.slice(1)
    );
  };

  // ==================================================
  // Format Holiday Date
  // ==================================================

  const formatHolidayDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const selectedDoctorDetails = doctors.find(
    (doctor) => doctor._id === selectedDoctor
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ==================================================
          Header
      ================================================== */}

      <div className="bg-[#023859] text-white px-8 py-6">

        <div className="max-w-7xl mx-auto">

          <button
            onClick={() =>
              navigate("/clinic-admin")
            }
            className="mb-4 text-sm text-gray-300 hover:text-white transition"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold">
            Doctor Schedule
          </h1>

          <p className="mt-2 text-gray-300">
            Manage working hours, breaks, holidays and
            appointment duration for your doctors.
          </p>

        </div>

      </div>

      {/* ==================================================
          Content
      ================================================== */}

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

        {/* ==================================================
            Module Disabled
        ================================================== */}

        {moduleDisabled ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">

            <div className="text-4xl mb-4">
              ⚠️
            </div>

            <h2 className="text-2xl font-bold text-[#023859]">
              Doctor Schedule is not available
            </h2>

            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              Doctor Schedule requires either the
              Staff Management or Appointment Scheduling
              module to be enabled for this clinic.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/clinic-admin")
              }
              className="mt-6 bg-[#54ACBF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#26658C] transition"
            >
              Back to Dashboard
            </button>

          </div>
        ) : (
          <>
            {/* ==================================================
                Doctor Selection
            ================================================== */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Doctor
              </label>

              {loadingDoctors ? (
                <p className="text-gray-500">
                  Loading doctors...
                </p>
              ) : doctors.length === 0 ? (
                <div className="text-gray-500">
                  No doctors have been added yet.
                </div>
              ) : (
                <>
                  <select
                    value={selectedDoctor}
                    onChange={(e) =>
                      setSelectedDoctor(e.target.value)
                    }
                    className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                  >
                    {doctors.map((doctor) => (
                      <option
                        key={doctor._id}
                        value={doctor._id}
                      >
                        {doctor.name}
                        {doctor.specialization
                          ? ` - ${doctor.specialization}`
                          : ""}
                      </option>
                    ))}
                  </select>

                  {selectedDoctorDetails && (
                    <div className="mt-4 text-gray-600">

                      <p>
                        <span className="font-semibold">
                          Doctor:
                        </span>{" "}
                        {selectedDoctorDetails.name}
                      </p>

                      {selectedDoctorDetails.specialization && (
                        <p>
                          <span className="font-semibold">
                            Specialization:
                          </span>{" "}
                          {
                            selectedDoctorDetails.specialization
                          }
                        </p>
                      )}

                    </div>
                  )}
                </>
              )}

            </div>

            {/* ==================================================
                Weekly Schedule
            ================================================== */}

            {doctors.length > 0 && (
              <>
                {loadingSchedule ? (
                  <div className="bg-white rounded-2xl shadow-sm p-10 text-center">

                    <p className="text-gray-500">
                      Loading schedule...
                    </p>

                  </div>
                ) : (
                  <div className="space-y-6">

                    {schedule.map((day, index) => (
                      <div
                        key={day.dayOfWeek}
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
                      >

                        {/* Day Header */}

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                          <div>

                            <h2 className="text-xl font-bold text-[#023859]">
                              {formatDay(day.dayOfWeek)}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                              Configure availability for this day.
                            </p>

                          </div>

                          <label className="flex items-center gap-3 cursor-pointer">

                            <input
                              type="checkbox"
                              checked={day.isWorking}
                              onChange={() =>
                                toggleWorkingDay(index)
                              }
                              className="w-5 h-5 accent-[#54ACBF]"
                            />

                            <span className="font-semibold text-gray-700">
                              Working Day
                            </span>

                          </label>

                        </div>

                        {day.isWorking ? (
                          <>

                            {/* Working Hours */}

                            <div className="grid md:grid-cols-3 gap-5">

                              <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Start Time
                                </label>

                                <input
                                  type="time"
                                  value={day.startTime}
                                  onChange={(e) =>
                                    updateDay(
                                      index,
                                      "startTime",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                                />

                              </div>

                              <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  End Time
                                </label>

                                <input
                                  type="time"
                                  value={day.endTime}
                                  onChange={(e) =>
                                    updateDay(
                                      index,
                                      "endTime",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                                />

                              </div>

                              <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Appointment Duration
                                </label>

                                <select
                                  value={
                                    day.appointmentDuration
                                  }
                                  onChange={(e) =>
                                    updateDay(
                                      index,
                                      "appointmentDuration",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                                >
                                  <option value="10">
                                    10 minutes
                                  </option>

                                  <option value="15">
                                    15 minutes
                                  </option>

                                  <option value="20">
                                    20 minutes
                                  </option>

                                  <option value="30">
                                    30 minutes
                                  </option>

                                  <option value="45">
                                    45 minutes
                                  </option>

                                  <option value="60">
                                    60 minutes
                                  </option>
                                </select>

                              </div>

                            </div>

                            {/* Breaks */}

                            <div className="mt-8">

                              <div className="flex items-center justify-between mb-4">

                                <div>

                                  <h3 className="font-bold text-[#023859]">
                                    Breaks
                                  </h3>

                                  <p className="text-sm text-gray-500">
                                    Add breaks when the doctor is unavailable.
                                  </p>

                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    addBreak(index)
                                  }
                                  className="px-4 py-2 bg-gray-100 text-[#023859] rounded-lg font-semibold hover:bg-gray-200 transition"
                                >
                                  + Add Break
                                </button>

                              </div>

                              {day.breaks.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                  No breaks added.
                                </p>
                              ) : (
                                <div className="space-y-3">

                                  {day.breaks.map(
                                    (
                                      breakItem,
                                      breakIndex
                                    ) => (
                                      <div
                                        key={breakIndex}
                                        className="flex flex-col md:flex-row gap-3 items-end"
                                      >

                                        <div className="flex-1 w-full">

                                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Break Start
                                          </label>

                                          <input
                                            type="time"
                                            value={
                                              breakItem.startTime
                                            }
                                            onChange={(e) =>
                                              updateBreak(
                                                index,
                                                breakIndex,
                                                "startTime",
                                                e.target.value
                                              )
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                                          />

                                        </div>

                                        <div className="flex-1 w-full">

                                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Break End
                                          </label>

                                          <input
                                            type="time"
                                            value={
                                              breakItem.endTime
                                            }
                                            onChange={(e) =>
                                              updateBreak(
                                                index,
                                                breakIndex,
                                                "endTime",
                                                e.target.value
                                              )
                                            }
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                                          />

                                        </div>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeBreak(
                                              index,
                                              breakIndex
                                            )
                                          }
                                          className="px-4 py-3 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                                        >
                                          Remove
                                        </button>

                                      </div>
                                    )
                                  )}

                                </div>
                              )}

                            </div>

                          </>
                        ) : (
                          <div className="bg-gray-50 rounded-lg px-5 py-4 text-gray-500">
                            Doctor is not working on this day.
                          </div>
                        )}

                        {/* Save Day */}

                        <div className="mt-6 flex justify-end">

                          <button
                            type="button"
                            onClick={() =>
                              saveSchedule(day)
                            }
                            disabled={saving}
                            className="bg-[#54ACBF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#26658C] transition disabled:opacity-50"
                          >
                            {saving
                              ? "Saving..."
                              : `Save ${formatDay(
                                  day.dayOfWeek
                                )}`}
                          </button>

                        </div>

                      </div>
                    ))}

                  </div>
                )}
              </>
            )}

            {/* ==================================================
                Holidays
            ================================================== */}

            {doctors.length > 0 && (
              <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                <div className="mb-6">

                  <h2 className="text-2xl font-bold text-[#023859]">
                    Doctor Holidays
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Add specific dates when this doctor will be unavailable.
                  </p>

                </div>

                {/* Add Holiday Form */}

                <form
                  onSubmit={addHoliday}
                  className="grid md:grid-cols-3 gap-5 items-end"
                >

                  {/* Date */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Holiday Date
                    </label>

                    <input
                      type="date"
                      value={holidayDate}
                      onChange={(e) =>
                        setHolidayDate(e.target.value)
                      }
                      min={
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                    />

                  </div>

                  {/* Reason */}

                  <div>

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Reason
                    </label>

                    <input
                      type="text"
                      value={holidayReason}
                      onChange={(e) =>
                        setHolidayReason(e.target.value)
                      }
                      placeholder="e.g. Personal Leave"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                    />

                  </div>

                  {/* Add Button */}

                  <button
                    type="submit"
                    disabled={savingHoliday}
                    className="bg-[#54ACBF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#26658C] transition disabled:opacity-50"
                  >
                    {savingHoliday
                      ? "Adding..."
                      : "+ Add Holiday"}
                  </button>

                </form>

                {/* Holiday List */}

                <div className="mt-8">

                  <h3 className="font-bold text-[#023859] mb-4">
                    Scheduled Holidays
                  </h3>

                  {loadingHolidays ? (
                    <p className="text-gray-500">
                      Loading holidays...
                    </p>
                  ) : holidays.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg px-5 py-4 text-gray-500">
                      No holidays have been added for this doctor.
                    </div>
                  ) : (
                    <div className="space-y-3">

                      {holidays.map((holiday) => (
                        <div
                          key={holiday._id}
                          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-50 border border-gray-200 rounded-lg px-5 py-4"
                        >

                          <div>

                            <p className="font-semibold text-[#023859]">
                              {formatHolidayDate(
                                holiday.date
                              )}
                            </p>

                            {holiday.reason && (
                              <p className="text-sm text-gray-500 mt-1">
                                {holiday.reason}
                              </p>
                            )}

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              deleteHoliday(
                                holiday._id
                              )
                            }
                            className="self-start md:self-auto px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                          >
                            Delete
                          </button>

                        </div>
                      ))}

                    </div>
                  )}

                </div>

              </div>
            )}

          </>
        )}

      </div>

    </div>
  );
}

export default DoctorSchedule;