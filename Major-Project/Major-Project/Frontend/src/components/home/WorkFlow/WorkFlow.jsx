import {
  ClipboardList,
  CheckCircle,
  Settings,
  Rocket,
} from "lucide-react";

import HowItWorksCard from "./HowItWorksCard";

const workflow = [
  {
    icon: <ClipboardList size={34} />,
    title: "Request a Clinic",
    description:
      "Submit your clinic details and select the modules your clinic requires.",
  },
  {
    icon: <CheckCircle size={34} />,
    title: "Get Approved",
    description:
      "The PATRAK administrator reviews your request and approves your clinic workspace.",
  },
  {
    icon: <Settings size={34} />,
    title: "Configure Your Modules",
    description:
      "Set up the features your clinic needs, with required dependencies included automatically.",
  },
  {
    icon: <Rocket size={34} />,
    title: "Go Live",
    description:
      "Access your secure clinic workspace and start managing daily operations with PATRAK.",
  },
];

function WorkFlow() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-[#023859]">
          Getting Started is Simple
        </h2>

        <p className="mt-5 max-w-2xl mx-auto text-gray-600 leading-8">
            PATRAK brings essential clinic operations together in one centralized
            platform, helping teams manage patients, staff, appointments, and
            day-to-day workflows more efficiently.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative mt-24">
        {/* Horizontal Line */}
        <div className="hidden lg:block absolute top-10 left-24 right-24 h-0.5 bg-[#D8EEF2]" />

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {workflow.map((step) => (
            <HowItWorksCard
              key={step.title}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default WorkFlow;