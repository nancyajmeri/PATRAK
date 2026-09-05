function HowItWorksCard({ icon, title, description }) {
  return (
    <div className="relative flex flex-col items-center text-center z-10">
      {/* Icon Circle */}
      <div className="w-20 h-20 rounded-full bg-[#EAF9FB] border-4 border-white shadow-sm flex items-center justify-center text-[#54ACBF]">
        {icon}
      </div>

      {/* Title */}
      <h3 className="mt-6 text-xl font-bold text-[#023859]">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-3 text-gray-600 leading-7 max-w-[240px]">
        {description}
      </p>
    </div>
  );
}

export default HowItWorksCard;