import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] =
    useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError(
        "New passwords do not match."
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters long."
      );
      return;
    }

    setLoading(true);

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "https://patrak-backend.vercel.app/api/auth/change-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to change password"
        );
      }

      // Update stored user information
      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(
          storedUser
        );

        const updatedUser = {
          ...user,
          mustChangePassword: false,
        };

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );
      }

      setMessage(
        "Password changed successfully. Redirecting..."
      );

      setTimeout(() => {
        const storedUser =
          localStorage.getItem("user");

        if (!storedUser) {
          navigate("/login");
          return;
        }

        const user = JSON.parse(
          storedUser
        );

        // Redirect based on role
        if (
          user.role === "super_admin"
        ) {
          navigate("/super-admin");
        } else if (
          user.role === "clinic_admin" ||
          user.role === "receptionist"
        ) {
          navigate("/clinic-admin");
        } else if (
          user.role === "doctor"
        ) {
          navigate("/doctor");
        } else {
          navigate("/login");
        }
      }, 1000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#023859] text-center">
          Change Password
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Please create a new password to continue.
        </p>

        {/* Success Message */}

        {message && (
          <div className="mt-6 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        {/* Error Message */}

        {error && (
          <div className="mt-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          {/* Current Password */}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value
                )
              }
              placeholder="Enter temporary password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
            />
          </div>

          {/* New Password */}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              placeholder="Enter new password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
            />
          </div>

          {/* Confirm Password */}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Confirm new password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
            />
          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#54ACBF] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading
              ? "Changing Password..."
              : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;