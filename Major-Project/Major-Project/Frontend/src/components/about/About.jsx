import aboutImage from "../../assets/about-patrak.png";

function About() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">

      <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* Left Side */}

        <div className="flex justify-center">

          <img
            src={aboutImage}
            alt="About PATRAK"
            className="w-full max-w-lg"
          />

        </div>

        {/* Right Side */}

        <div>

          <p className="uppercase tracking-widest text-[#54ACBF] font-semibold">
            About PATRAK
          </p>

          {/* Accent Line */}

          <div className="w-20 h-1 bg-[#54ACBF] rounded-full mt-3"></div>

          <h2 className="mt-5 text-4xl font-bold text-[#023859] leading-tight">
            Simplifying Clinic Management
          </h2>

          <p className="mt-6 text-gray-600 leading-8">
            PATRAK is a{" "}
            <span className="font-semibold text-[#023859]">
              cloud-based clinic management platform
            </span>{" "}
            designed to simplify patient registration, appointment scheduling,
            staff management, token handling, and everyday clinic operations.
          </p>

          <p className="mt-5 text-gray-600 leading-8">
            Built with{" "}
            <span className="font-semibold text-[#023859]">
              security, flexibility, and scalability
            </span>{" "}
            in mind, PATRAK allows clinics to focus on{" "}
            <span className="font-semibold text-[#023859]">
              delivering better patient care
            </span>{" "}
            while we handle the technology behind the scenes.
          </p>

        </div>

      </div>

    </section>
  );
}

export default About;