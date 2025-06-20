import React from "react";
import { ArrowRight, Clock, Globe } from "lucide-react";
import programsData from "../../data/minorPrograms.json";

export default function MinorPrograms() {
  return (
    <section className="pt-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-center font-bold text-xl sm:text-2xl lg:text-3xl text-[#202124]">
        Our Minor Programs
      </h2>
      <p className="text-xs sm:text-sm text-center mt-1 mb-6 leading-snug text-[#6d6d6d] max-w-3xl mx-auto">
        Join the innovative Minor Certificate program, proudly backed by IIT Mandi, NSDC
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {programsData.map((program) => (
          <article
            key={program.programId}
            className="relative bg-[#eee0fe]/40 border border-[#eee0fe] rounded-xl p-4 sm:p-5 pt-5 shadow-lg overflow-hidden"
          >
            {/* subtle grid bg */}
            <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(112,78,231,0.08)_25%,rgba(112,78,231,0.08)_26%,transparent_27%,transparent_74%,rgba(112,78,231,0.08)_75%,rgba(112,78,231,0.08)_76%,transparent_77%),linear-gradient(90deg,transparent_24%,rgba(112,78,231,0.08)_25%,rgba(112,78,231,0.08)_26%,transparent_27%,transparent_74%,rgba(112,78,231,0.08)_75%,rgba(112,78,231,0.08)_76%,transparent_77%)] [background-size:50px_50px]" />

            <h3 className="relative font-semibold text-sm sm:text-base text-[#202124]">
              {program.programName}
            </h3>
            <p className="relative text-xs sm:text-sm mt-1 mb-3 text-[#454545]">
              {program.detail}
            </p>

            <div className="relative flex items-center gap-4 text-[10px] sm:text-xs font-medium text-[#6d6d6d]">
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
              className="absolute right-4 top-4 text-[#704ee7]" 
            />
          </article>
        ))}
      </div>
    </section>
  );
}
