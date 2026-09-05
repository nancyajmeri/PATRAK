import { useEffect, useState } from "react";

import {
  getClinicRequests,
  approveClinicRequest,
  rejectClinicRequest,
} from "../../services/clinicRequestService";

import LogoutButton from "../../components/common/LogoutButton/LogoutButton";

function SuperAdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch Clinic Requests

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getClinicRequests();

      setRequests(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load Requests

  useEffect(() => {
    fetchRequests();
  }, []);

  // Approve Clinic

  const handleApprove = async (id) => {
    try {
      setMessage("");
      setError("");

      const result = await approveClinicRequest(id);

      setMessage(
        `Clinic approved successfully. Temporary password: ${result.temporaryPassword}`
      );

      fetchRequests();
    } catch (error) {
      setError(error.message);
    }
  };

  // Reject Clinic

  const handleReject = async (id) => {
    try {
      setMessage("");
      setError("");

      await rejectClinicRequest(id);

      setMessage(
        "Clinic request rejected successfully."
      );

      fetchRequests();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}

      <div className="bg-[#023859] text-white px-8 py-6">

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">

          <div>
            <h1 className="text-3xl font-bold">
              Super Admin Dashboard
            </h1>

            <p className="mt-2 text-gray-300">
              Manage clinic registration requests.
            </p>
          </div>

          {/* Logout */}

          <LogoutButton />

        </div>

      </div>

      {/* Content */}

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Success Message */}

        {message && (
          <div className="mb-6 rounded-lg bg-green-100 border border-green-300 text-green-700 px-5 py-4">
            {message}
          </div>
        )}

        {/* Error Message */}

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 border border-red-300 text-red-700 px-5 py-4">
            {error}
          </div>
        )}

        {/* Title + Refresh */}

        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-2xl font-bold text-[#023859]">
              Clinic Requests
            </h2>

            <p className="text-gray-500 mt-1">
              Review and manage clinic registration
              requests.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchRequests}
            className="px-5 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition"
          >
            Refresh
          </button>

        </div>

        {/* Loading / Empty / Requests */}

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">

            <p className="text-gray-500">
              Loading clinic requests...
            </p>

          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">

            <p className="text-gray-500">
              No clinic requests found.
            </p>

          </div>
        ) : (
          <div className="space-y-5">

            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >

                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">

                  {/* Clinic Information */}

                  <div className="flex-1">

                    <h3 className="text-xl font-bold text-[#023859]">
                      {request.clinicName}
                    </h3>

                    <div className="mt-3 space-y-1 text-gray-600">

                      <p>
                        <strong>Owner:</strong>{" "}
                        {request.ownerName}
                      </p>

                      <p>
                        <strong>Email:</strong>{" "}
                        {request.email}
                      </p>

                      <p>
                        <strong>Phone:</strong>{" "}
                        {request.phone}
                      </p>

                      <p>
                        <strong>Address:</strong>{" "}
                        {request.address}
                      </p>

                      <p>
                        <strong>City:</strong>{" "}
                        {request.city}
                      </p>

                    </div>

                    {/* Requested Services */}

                    <div className="mt-5">

                      <p className="font-semibold text-gray-700 mb-2">
                        Requested Services:
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {request.services &&
                        request.services.length > 0 ? (
                          request.services.map(
                            (service) => (
                              <span
                                key={service}
                                className="px-3 py-1 bg-[#54ACBF]/10 text-[#023859] rounded-full text-sm"
                              >
                                {service}
                              </span>
                            )
                          )
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No services selected
                          </span>
                        )}

                      </div>

                    </div>

                  </div>

                  {/* Status + Actions */}

                  <div className="flex flex-col items-start lg:items-end gap-4">

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : request.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {request.status.toUpperCase()}
                    </span>

                    {request.status === "pending" && (
                      <div className="flex gap-3">

                        <button
                          type="button"
                          onClick={() =>
                            handleApprove(
                              request._id
                            )
                          }
                          className="px-5 py-2 rounded-lg bg-[#54ACBF] text-white font-semibold hover:opacity-90 transition"
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleReject(
                              request._id
                            )
                          }
                          className="px-5 py-2 rounded-lg border border-red-400 text-red-600 font-semibold hover:bg-red-50 transition"
                        >
                          Reject
                        </button>

                      </div>
                    )}

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default SuperAdminDashboard;