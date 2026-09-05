function HeroHighlight({ icon, title }) {
  return (
    <div className="group flex items-center gap-4 cursor-pointer transition-all duration-300 hover:translate-x-2">

      <div
        className="
          w-14
          h-14
          rounded-full
          bg-[#EAF9FB]
          flex
          items-center
          justify-center
          text-[#023859]
          transition-all
          duration-300
          group-hover:bg-[#54ACBF]
          group-hover:text-white
          group-hover:scale-110
          group-hover:shadow-lg
        "
      >
        {icon}
      </div>

      <h3 className="font-semibold text-[#023859] group-hover:text-[#54ACBF] transition-colors duration-300">
        {title}
      </h3>

    </div>
  );
}

export default HeroHighlight;