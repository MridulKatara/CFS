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
      <section className="pt-8 pb-6 bg-[#f7f2ff]">
        <h2 className="text-center text-xl font-bold mb-5 text-black">
          Key Features
        </h2>
  
        <div className="px-4 grid grid-cols-2 gap-3">
          {featureData.map(({ title, text }) => (
            <div
              key={title}
              className="bg-[#704ee7] rounded-xl text-white p-4 "
            >
              <h3 className="font-semibold text-base mb-1 text-white">
                {title}
              </h3>
              <p className="text-sm leading-tight opacity-90 text-white">{text}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }
  