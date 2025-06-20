import React from "react";

const faculty = [
    { name: "Dr. Indu Joshi",     role: "Associate Professor", img: "/assets/indu.jpg" },
    { name: "Dr. Adarsh Patel",   role: "Associate Professor", img: "/assets/adarsh.jpg" },
    { name: "Dr. Sneha Singh",    role: "Associate Professor", img: "/assets/sneha.jpg" }
  ];
  
  export default function FacultySection() {
    return (
      <section className="px-4 pt-10">
        {faculty.map(({ name, role, img }) => (
          <div
            key={name}
            className="flex gap-3 items-center bg-white rounded-xl shadow-card mb-4 p-3"
          >
            <img src={img} alt={name} className="h-12 w-12 rounded-lg object-cover" />
            <div className="text-xs">
              <p className="font-semibold">{name}</p>
              <p>{role}</p>
              <p>IIT Mandi</p>
            </div>
          </div>
        ))}
      </section>
    );
  }
  