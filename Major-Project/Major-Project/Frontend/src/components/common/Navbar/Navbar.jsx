import { Link } from "react-router-dom";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services" },
  { name: "How It Works", path: "/how-it-works" },
  { name: "Contact", path: "/contact" },
];

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">

  {/* Logo */}
  <Link to="/" className="flex items-center gap-3">
    <img
      src="/logo.png"
      alt="PATRAK Logo"
      className="h-16 w-16"
    />

    <h1 className="text-3xl font-semibold text-[#023859]">
      PATRAK
    </h1>
  </Link>

  {/* Navigation */}
  <div className="flex items-center gap-8">

    {navLinks.map((link) => (
      <Link
        key={link.name}
        to={link.path}
        className="font-medium text-[#023859] hover:text-[#54ACBF] transition-colors duration-300"
      >
        {link.name}
      </Link>
    ))}

  </div>

  {/* Right Side */}
  <div className="flex items-center gap-4">

    <Link
      to="/login"
      className="font-medium text-[#023859] hover:text-[#54ACBF] transition-colors duration-300"
    >
      Login
    </Link>

    <Link
      to="/request-clinic"
      className="bg-[#54ACBF] text-white font-semibold px-6 py-2.5 rounded-2xl hover:bg-[#26658C] transition-colors duration-300"
    >
      Request Clinic
    </Link>

  </div>

</div>
    </nav>
  );
}

export default Navbar;