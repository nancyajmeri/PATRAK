import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/common/Navbar/Navbar";
import Footer from "../components/common/Footer/Footer";

function Contact() {
  return (
    <>
      <Navbar />

      <main>
        {/* Header */}
        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-8 py-20 text-center">
            <p className="text-[#54ACBF] font-semibold uppercase tracking-widest">
              Contact PATRAK
            </p>

            <h1 className="mt-3 text-4xl md:text-5xl font-bold text-[#023859]">
              We're Here to Help
            </h1>

            <p className="mt-5 max-w-2xl mx-auto text-gray-600 leading-8">
              Have questions about PATRAK, its modules, or getting your
              clinic started? Reach out to us and we'll be happy to help.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="max-w-5xl mx-auto px-8 py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#023859]">
              Get in Touch
            </h2>

            <p className="mt-3 text-gray-600">
              Choose the most convenient way to reach the PATRAK team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Phone */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#EAF9FB] flex items-center justify-center text-[#54ACBF]">
                <Phone size={28} />
              </div>

              <h2 className="mt-6 text-xl font-bold text-[#023859]">
                Phone
              </h2>

              <p className="mt-3 text-gray-600">
                Contact us for assistance with PATRAK.
              </p>

              <a
                href="tel:+919726682638"
                className="inline-block mt-4 text-[#54ACBF] font-semibold hover:text-[#26658C] transition"
              >
                +91 97266 82638
              </a>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#EAF9FB] flex items-center justify-center text-[#54ACBF]">
                <Mail size={28} />
              </div>

              <h2 className="mt-6 text-xl font-bold text-[#023859]">
                Email
              </h2>

              <p className="mt-3 text-gray-600">
                Send us your questions or enquiries.
              </p>

              <a
                href="mailto:mrtatsuyaop@gmail.com"
                className="inline-block mt-4 text-[#54ACBF] font-semibold hover:text-[#26658C] transition break-all"
              >
                mrtatsuyaop@gmail.com
              </a>
            </div>
          </div>

          {/* Clinic CTA */}
          <div className="mt-12 bg-[#023859] rounded-2xl p-10 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold">
              Ready to Get Started?
            </h2>

            <p className="mt-3 text-gray-300">
              Request your clinic workspace and start building a more
              connected clinic workflow with PATRAK.
            </p>

            <Link
              to="/request-clinic"
              className="inline-block mt-6 bg-[#54ACBF] text-white font-semibold px-7 py-3 rounded-2xl hover:bg-[#26658C] transition"
            >
              Request a Clinic
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Contact;