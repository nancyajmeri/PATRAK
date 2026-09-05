import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";

function CallToAction() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">

      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#023859] via-[#03456F] to-[#023859] px-10 py-20 shadow-2xl">

        {/* Decorative Circles */}

        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#54ACBF] opacity-10 rounded-full"></div>

        <div className="absolute -bottom-28 -right-24 w-80 h-80 bg-[#54ACBF] opacity-10 rounded-full"></div>

        {/* Content */}

        <div className="relative z-10 text-center">

          <p className="uppercase tracking-[5px] text-[#54ACBF] font-semibold">
            Get Started
          </p>

          <h2 className="mt-5 text-5xl font-bold text-white leading-tight">
            Ready to Modernize
            <br />
            Your Clinic?
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-gray-300 text-lg leading-8">
            Join clinics using PATRAK to streamline patient management,
            appointments, staff coordination, and daily operations
            through one secure cloud-based platform.
          </p>

          {/* Buttons */}

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5">

            <Link
              to="/request-clinic"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#54ACBF] text-white font-semibold hover:bg-[#3A9BB1] transition-all duration-300 hover:scale-105"
            >
              Request a Clinic
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/contact"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white text-white font-semibold hover:bg-white hover:text-[#023859] transition-all duration-300 hover:scale-105"
            >
              <Mail size={18} />
              Contact Us
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default CallToAction;