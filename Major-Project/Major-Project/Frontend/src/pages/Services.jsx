import Navbar from "../components/common/Navbar/Navbar";
import CoreServices from "../components/services/CoreServices/CoreServices";
import Footer from "../components/common/Footer/Footer";

function Services() {
  return (
    <>
      <Navbar />

      <main>
        {/* Page Header */}

        <section className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-8 py-20 text-center">

            <p className="text-[#54ACBF] font-semibold uppercase tracking-widest">
              PATRAK Services
            </p>

            <h1 className="mt-3 text-4xl md:text-5xl font-bold text-[#023859]">
              Everything Your Clinic Needs
            </h1>

            <p className="mt-5 max-w-2xl mx-auto text-gray-600 leading-8">
              PATRAK provides the tools you need to manage patients,
              appointments, staff, tokens, and everyday clinic operations
              from one secure platform.
            </p>

          </div>
        </section>

        {/* Core Services */}

        <CoreServices />
      </main>

      <Footer />
    </>
  );
}

export default Services;