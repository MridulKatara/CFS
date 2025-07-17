import React from "react";

const featureData = [
    {
      title: "18 credits 3 semesters",
      text : "Complete 18 credits over three semesters and add a Minor to your degree."
    },
    {
      title: "Affordable Quality Learning",
      text : "Access IIT-level teaching and industry-relevant skills for just ₹45,000."
    },
    {
      title: "Placement & Internship",
      text : "Maintain a CGPA of 7.0 or higher to qualify for assured job opportunities."
    },
    {
      title: "Practical, Job-Ready Curriculum",
      text : "Learn through hands-on projects, case studies, and expert mentorship."
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
  