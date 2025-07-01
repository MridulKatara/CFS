import React from "react";
import { ArrowRight, Clock, Globe } from "lucide-react";
import programsData from "../../data/minorPrograms.json";

export default function MinorPrograms() {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-white">
      <h2 className="text-center font-bold text-xl sm:text-2xl lg:text-3xl text-[#202124]">
        Our Minor Programs
      </h2>
      <p className="text-xs sm:text-sm text-center mt-1 mb-6 leading-snug text-[#6d6d6d] max-w-3xl mx-auto">
        Join the innovative Minor Certificate program, proudly backed by IIT Mandi, NSDC
      </p>

      <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
        {programsData.map((program) => (
          <article
            key={program.programId}
            className="relative bg-[#f9f4ff] border border-[#e8dcf8] rounded-lg p-4 overflow-hidden"
          >
            <h3 className="font-semibold text-base text-[#202124]">
              {program.programName}
            </h3>
            <p className="text-xs mt-1 mb-3 text-[#454545] pr-4">
              {program.detail}
            </p>

            <div className="flex items-center gap-4 text-xs font-medium text-[#6d6d6d]">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {program.duration}
              </span>
              <span className="flex items-center gap-1">
                <Globe size={14} />
                Online
              </span>
            </div>

            <ArrowRight 
              size={18} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#704ee7]" 
            />
          </article>
        ))}
      </div>
    </section>
  );
}
