import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StaffManagement() {
  const navigate = useNavigate();

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "doctor",
    specialization: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [temporaryPassword, setTemporaryPassword] =
    useState("");

  // Fetch Staff
  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://patrak-backend.vercel.app/api/staff",
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
          data.message || "Failed to fetch staff"
        );
      }

      setStaff(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove specialization when receptionist is selected
    if (
      name === "role" &&
      value === "receptionist"
    ) {
      setFormData((previous) => ({
        ...previous,
        role: value,
        specialization: "",
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "doctor",
      specialization: "",
    });

    setShowForm(false);
  };

  // Create Staff
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");
      setTemporaryPassword("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://patrak-backend.vercel.app/api/staff",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create staff account"
        );
      }

      setSuccess(
        `${
          formData.role === "doctor"
            ? "Doctor"
            : "Receptionist"
        } account created successfully.`
      );

      setTemporaryPassword(
        data.temporaryPassword
      );

      resetForm();

      await fetchStaff();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}

      <div className="bg-[#023859] text-white px-8 py-6">

        <div className="max-w-7xl mx-auto">

          {/* Back Button */}

          <button
            onClick={() => navigate("/clinic-admin")}
            className="mb-4 text-sm text-gray-300 hover:text-white transition"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold">
            Staff Management
          </h1>

          <p className="mt-2 text-gray-300">
            Manage your clinic's doctors and receptionists.
          </p>

        </div>

      </div>

      {/* Content */}

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Success Message */}

        {success && (
          <div className="mb-4 bg-green-100 border border-green-300 text-green-700 px-5 py-4 rounded-lg">
            {success}
          </div>
        )}

        {/* Temporary Password */}

        {temporaryPassword && (
          <div className="mb-6 bg-yellow-50 border border-yellow-300 text-yellow-800 px-5 py-4 rounded-lg">

            <p className="font-semibold">
              Temporary Password
            </p>

            <p className="mt-1">
              Share this password securely with the staff
              member. They must change it after their first
              login.
            </p>

            <div className="mt-3 bg-white border border-yellow-200 rounded-lg px-4 py-3 font-mono font-semibold">
              {temporaryPassword}
            </div>

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
              Clinic Staff
            </h2>

            <p className="text-gray-500 mt-1">
              {staff.length} staff member
              {staff.length !== 1 ? "s" : ""}
            </p>

          </div>

          <button
            onClick={() => {
              setShowForm(!showForm);
              setError("");
              setSuccess("");
              setTemporaryPassword("");
            }}
            className="bg-[#54ACBF] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#26658C] transition"
          >
            {showForm ? "Close Form" : "+ Add Staff"}
          </button>

        </div>

        {/* Add Staff Form */}

        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">

            <h3 className="text-xl font-bold text-[#023859] mb-6">
              Add Staff Member
            </h3>

            <form
              onSubmit={handleSubmit}
              className="grid md:grid-cols-2 gap-5"
            >

              {/* Name */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter staff name"
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
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                />

              </div>

              {/* Role */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                >
                  <option value="doctor">
                    Doctor
                  </option>

                  <option value="receptionist">
                    Receptionist
                  </option>
                </select>

              </div>

              {/* Specialization */}

              {formData.role === "doctor" && (
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Specialization
                  </label>

                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g. Gynecologist"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
                  />

                </div>
              )}

              {/* Submit Buttons */}

              <div className="md:col-span-2 flex gap-3">

                <button
                  type="submit"
                  className="bg-[#54ACBF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#26658C] transition"
                >
                  Create Staff Account
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {/* Staff List */}

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <p className="text-gray-500">
              Loading staff...
            </p>
          </div>
        ) : staff.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <p className="text-gray-500">
              No staff members added yet.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50 border-b">

                  <tr>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Name
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Email
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Role
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Specialization
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {staff.map((member) => (
                    <tr
                      key={member._id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 font-semibold text-[#023859]">
                        {member.name}
                      </td>

                      <td className="px-6 py-4">
                        {member.email}
                      </td>

                      <td className="px-6 py-4 capitalize">
                        {member.role.replace(
                          "_",
                          " "
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {member.specialization || "-"}
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

export default StaffManagement;