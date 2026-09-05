import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#023859] text-white mt-20">
      <div className="max-w-7xl mx-auto px-8 py-12">

        {/* Logo & Description */}

        <div className="text-center">

          <h2 className="text-3xl font-bold">
            PATRAK
          </h2>

          <p className="mt-4 max-w-xl mx-auto text-gray-300 leading-7">
            Simplifying clinic management through a secure
            cloud-based platform.
          </p>

        </div>

        {/* Navigation */}

        <div className="flex flex-wrap justify-center gap-8 mt-10">

          <Link
            to="/"
            className="hover:text-[#54ACBF] transition-colors duration-300"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="hover:text-[#54ACBF] transition-colors duration-300"
          >
            About
          </Link>

          <Link
            to="/services"
            className="hover:text-[#54ACBF] transition-colors duration-300"
          >
            Services
          </Link>

          <Link
            to="/contact"
            className="hover:text-[#54ACBF] transition-colors duration-300"
          >
            Contact
          </Link>

        </div>

        {/* Contact Information */}

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10 text-gray-300">

          <div className="flex items-center gap-2">

            <Phone size={18} />

            <span>+91 97266 82638</span>

          </div>

          <div className="flex items-center gap-2">

            <Mail size={18} />

            <span>mrtatsuyaop@gmail.com</span>

          </div>

        </div>

        {/* Copyright */}

        <div className="border-t border-[#1E5A84] mt-8 pt-6 text-center text-sm text-gray-400">

          © 2026 PATRAK. All Rights Reserved.

        </div>

      </div>
    </footer>
  );
}

export default Footer;