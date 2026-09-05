import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://patrak-backend.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save authentication data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Force users with temporary passwords to change them
      if (
        data.user.mustChangePassword &&
        ["clinic_admin", "doctor", "receptionist"].includes(
          data.user.role
        )
      ) {
        navigate("/change-password");
        return;
      }

      // Redirect based on role
      if (data.user.role === "super_admin") {
        navigate("/super-admin");
      } else if (data.user.role === "clinic_admin") {
        navigate("/clinic-admin");
      } else if (data.user.role === "receptionist") {
        // Receptionist uses the Clinic Admin interface
        navigate("/clinic-admin");
      } else if (data.user.role === "doctor") {
        navigate("/doctor");
      } else {
        setError("Your account does not have a valid role.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Back to Home */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-sm font-semibold text-gray-500 hover:text-[#023859] transition mb-6"
        >
          ← Back to Home
        </button>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#023859] text-center">
          Login
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Login to your PATRAK account
        </p>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#54ACBF]"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#54ACBF] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;