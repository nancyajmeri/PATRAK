import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold transition"
    >
      <LogOut size={18} />

      <span>Logout</span>
    </button>
  );
}

export default LogoutButton;