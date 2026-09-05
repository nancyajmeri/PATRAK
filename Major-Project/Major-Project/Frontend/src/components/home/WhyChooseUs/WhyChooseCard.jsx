function WhyChooseCard({ icon, title, description }) {
  return (
    <div className="flex items-start gap-5">

      {/* Icon */}

      <div className="w-14 h-14 rounded-full bg-[#EAF9FB] flex items-center justify-center text-[#54ACBF] flex-shrink-0">

        {icon}

      </div>

      {/* Content */}

      <div>

        <h3 className="text-xl font-bold text-[#023859]">
          {title}
        </h3>

        <p className="mt-2 text-gray-600 leading-7">
          {description}
        </p>

      </div>

    </div>
  );
}

export default WhyChooseCard;