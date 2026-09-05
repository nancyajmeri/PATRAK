import {
  Cloud,
  ShieldCheck,
  Blocks,
  Building2,
  Zap,
  Wrench,
} from "lucide-react";

import WhyChooseCard from "./WhyChooseCard";

const benefits = [
  {
    icon: <Cloud size={28} />,
    title: "Cloud-Based",
    description:
      "Access your clinic workspace securely from anywhere, at any time.",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Secure & Reliable",
    description:
      "Protect patient information with secure authentication and role-based access.",
  },
  {
    icon: <Blocks size={28} />,
    title: "Modular Platform",
    description:
      "Choose only the modules your clinic requires and expand anytime.",
  },
  {
    icon: <Building2 size={28} />,
    title: "Multi-Tenant Architecture",
    description:
      "Every clinic receives its own dedicated and isolated workspace.",
  },
  {
    icon: <Zap size={28} />,
    title: "Quick Deployment",
    description:
      "Get your clinic up and running without lengthy installation or setup.",
  },
  {
    icon: <Wrench size={28} />,
    title: "Fully Managed",
    description:
      "PATRAK handles updates, maintenance, and continuous improvements for you.",
  },
];

function WhyChooseUs() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">

      {/* Heading */}

      <div className="text-center">

        <p className="uppercase tracking-widest text-[#54ACBF] font-semibold">
          Why Choose PATRAK
        </p>

        <h2 className="mt-3 text-4xl font-bold text-[#023859]">
          Built for Modern Clinics
        </h2>

        <p className="mt-5 max-w-3xl mx-auto text-gray-600 leading-8">
          PATRAK is designed to simplify clinic management with a secure,
          scalable, and cloud-first platform that grows with your practice.
        </p>

      </div>

      {/* Benefits */}

      <div className="grid lg:grid-cols-2 gap-x-16 gap-y-12 mt-20">

        {benefits.map((benefit) => (
          <WhyChooseCard
            key={benefit.title}
            icon={benefit.icon}
            title={benefit.title}
            description={benefit.description}
          />
        ))}

      </div>

    </section>
  );
}

export default WhyChooseUs;