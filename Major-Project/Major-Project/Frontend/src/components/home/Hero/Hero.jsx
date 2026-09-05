import HeroHighlight from "./HeroHighlight";
import { Puzzle, Cloud, Settings } from "lucide-react";
import DashboardPreview from "./DashboardPreview";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-8 py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE */}

        <div>
          <span className="text-[#54ACBF] font-semibold">
            Cloud-Based • Multi-Tenant • Modular
          </span>

          <h1 className="text-6xl font-bold text-[#023859] mt-5 leading-tight">
            You Run the Clinic.
            <br />
            We Power Your Platform.
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-8">
            PATRAK provides clinics with a secure, cloud-based platform
            tailored to their needs. Choose the modules you require,
            and we'll configure, maintain, and support your workspace.
          </p>

          {/* CTA Buttons */}

          <div className="mt-10 flex gap-4">
            <button
              onClick={() => navigate("/request-clinic")}
              className="bg-[#54ACBF] text-white px-6 py-3 rounded-xl hover:bg-[#26658C] transition"
            >
              Request Clinic
            </button>

            <button className="border border-[#023859] text-[#023859] px-6 py-3 rounded-xl hover:bg-[#023859] hover:text-white transition">
              Explore Modules
            </button>
          </div>

          {/* Highlights */}

          <div className="mt-12 flex flex-col gap-6">
            <HeroHighlight
              icon={<Puzzle size={24} />}
              title="Configurable Modules"
            />

            <HeroHighlight
              icon={<Cloud size={24} />}
              title="Secure Cloud Workspace"
            />

            <HeroHighlight
              icon={<Settings size={24} />}
              title="Fully Managed by PATRAK"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="-mt-8">
          <DashboardPreview />
        </div>

      </div>
    </section>
  );
}

export default Hero;