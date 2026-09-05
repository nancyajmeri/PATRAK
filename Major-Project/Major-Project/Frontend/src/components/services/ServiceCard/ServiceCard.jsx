function ServiceCard({ icon, title, description }) {
  return (
    <div className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">

      <div className="w-16 h-16 rounded-full bg-[#EAF9FB] flex items-center justify-center text-[#54ACBF] group-hover:bg-[#54ACBF] group-hover:text-white transition-all duration-300">

        {icon}

      </div>

      <h3 className="mt-5 text-xl font-bold text-[#023859]">
        {title}
      </h3>

      <p className="mt-3 text-gray-600 leading-7">
        {description}
      </p>

    </div>
  );
}

export default ServiceCard;