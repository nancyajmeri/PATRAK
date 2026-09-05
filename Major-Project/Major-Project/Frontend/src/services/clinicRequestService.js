const API_URL = "https://patrak-backend.vercel.app/api";

// Public: Submit a clinic request
export const createClinicRequest = async (clinicData) => {
  const response = await fetch(
    `${API_URL}/clinic-requests`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clinicData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to submit clinic request"
    );
  }

  return data;
};

// Super Admin: Get clinic requests
export const getClinicRequests = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/clinic-requests`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch requests"
    );
  }

  return data;
};

// Super Admin: Approve clinic request
export const approveClinicRequest = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/clinic-requests/${id}/approve`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to approve request"
    );
  }

  return data;
};

// Super Admin: Reject clinic request
export const rejectClinicRequest = async (id) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/clinic-requests/${id}/reject`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to reject request"
    );
  }

  return data;
};