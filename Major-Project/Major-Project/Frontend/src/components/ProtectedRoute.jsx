import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  allowedRoles,
}) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // Not logged in
  if (!token || !storedUser) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  // Check role
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    // Send user to their own dashboard
    if (user.role === "super_admin") {
      return (
        <Navigate
          to="/super-admin"
          replace
        />
      );
    }

    if (
      user.role === "clinic_admin" ||
      user.role === "receptionist"
    ) {
      return (
        <Navigate
          to="/clinic-admin"
          replace
        />
      );
    }

    if (user.role === "doctor") {
      return (
        <Navigate
          to="/doctor"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;