import {
  Users,
  CalendarDays,
  Ticket,
  UserCog,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

import ServiceCard from "../ServiceCard/ServiceCard";

const services = [
  {
    icon: <Users size={28} />,
    title: "Patient Management",
    description:
      "Maintain patient records, medical history, and visit information in one secure place.",
  },
  {
    icon: <CalendarDays size={28} />,
    title: "Appointment Scheduling",
    description:
      "Schedule and manage appointments efficiently with an organized calendar.",
  },
  {
    icon: <Ticket size={28} />,
    title: "Token Management",
    description:
      "Generate and manage patient tokens for a smooth queue experience.",
  },
  {
    icon: <UserCog size={28} />,
    title: "Staff Management",
    description:
      "Manage doctors, receptionists, and clinic staff with role-based access.",
  },
  {
    icon: <BarChart3 size={28} />,
    title: "Reports & Analytics",
    description:
      "Monitor clinic performance through meaningful reports and analytics.",
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Role-Based Access",
    description:
      "Ensure secure access by assigning permissions to different users.",
  },
];

function CoreServices() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">

      {/* Heading */}

      <div className="text-center">

        <p className="text-[#54ACBF] font-semibold uppercase tracking-wider">
          Core Modules
        </p>

        <h2 className="mt-3 text-4xl font-bold text-[#023859]">
          Everything Your Clinic Needs
        </h2>

        <p className="mt-5 max-w-2xl mx-auto text-gray-600 leading-8">
          PATRAK provides a complete set of modules designed to simplify
          daily clinic operations while keeping everything secure,
          organized, and easy to manage.
        </p>

      </div>

      {/* Cards */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

        {services.map((service) => (
          <ServiceCard
            key={service.title}
            icon={service.icon}
            title={service.title}
            description={service.description}
          />
        ))}

      </div>

    </section>
  );
}

export default CoreServices;