import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function ProgramsGrid({ programs }) {
  const INITIAL_VISIBLE = 8;
  const EXTRA_VISIBLE = 4;

  const [isExpanded, setIsExpanded] = useState(false);

  const visibleCount = isExpanded
    ? Math.min(programs.length, INITIAL_VISIBLE + EXTRA_VISIBLE)
    : INITIAL_VISIBLE;

  return (
    <div className="w-full">
      {/* CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch transition-all duration-500">
        {programs.slice(0, visibleCount).map((program, index) => (
          <Link to={program.link} key={index}>
            <div
              className="group relative p-6 bg-zinc-900 border border-zinc-800 rounded-2xl 
              hover:border-blue-500/50 flex flex-col h-full cursor-pointer
              transition-all duration-500 ease-out animate-fadeSlide"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-blue-600/5 rounded-2xl opacity-0 
              group-hover:opacity-100 transition-opacity pointer-events-none z-0"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex-1">
                  <div className="mb-4 bg-black w-14 h-14 rounded-xl flex items-center justify-center 
                  border border-zinc-800 group-hover:border-blue-500/30">
                    {program.icon}
                  </div>

                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                    {program.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    {program.description}
                  </p>
                </div>

                {/* Bottom */}
                <div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800">
                    <div>
                      <span className="block text-xs text-gray-500">Enrollment Fee</span>
                      <span className="text-lg font-bold text-white">
                        {program.price}
                      </span>
                    </div>
                    <button className="p-2 rounded-lg bg-white text-black 
                      hover:bg-blue-500 hover:text-white transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Show More / Show Less */}
      {programs.length > INITIAL_VISIBLE && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 rounded-full bg-zinc-800 border border-zinc-700 
            hover:border-blue-500/50 text-white transition-all duration-300
            transform hover:scale-105"
          >
            {isExpanded ? "Show Less" : "Show More"}
            <span
              className={`ml-2 inline-block transition-transform duration-300 ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
            >
              ▾
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
