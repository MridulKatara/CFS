import React from "react";

const featureData = [
    {
      title: "18 Credits (7+8+3)",
      text : "Complete 18 credits over 3 semesters equivalent to a Minor degree"
    },
    {
      title: "Affordable Learning",
      text : "Get all this value at just ₹45,000 for the full 3 semester program."
    },
    {
      title: "Placement & Internship",
      text : "Maintain a 7+ CGPA to become eligible for assured job opportunities"
    },
    {
      title: "Job Ready Curriculum",
      text : "Learn through hands‑on projects, real‑world case studies, and mentorship"
    }
  ];
  
  export default function KeyFeatures() {
    return (
      <section className="mt-10 pb-8 bg-gradient-to-b from-[#eee0fe] via-white to-[#ebf6ff]">
        <h2 className="text-center text-lg sm:text-xl lg:text-2xl font-bold pt-8 mb-6 text-[#202124]">
          Key Features
        </h2>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {featureData.map(({ title, text }) => (
            <div
              key={title}
              className="bg-[#704ee7]/90 rounded-xl text-white p-4 sm:p-5 flex flex-col"
            >
              <h3 className="font-semibold text-sm sm:text-base leading-tight mb-1">
                {title}
              </h3>
              <p className="text-[10px] sm:text-xs leading-snug">{text}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  