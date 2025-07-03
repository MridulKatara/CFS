/* eslint-disable no-unused-vars */
import React from "react";
import { FiHeadphones, FiPhone } from "react-icons/fi";

const cards = [
  { 
    icon: FiHeadphones, 
    heading: "Admission Support", 
    content: "info.cce@iitmandi.ac.in",
    type: "email" 
  },
  { 
    icon: FiPhone,      
    heading: "Phone Support",     
    content: "+91 6364919735",
    type: "phone" 
  }
];

export default function SupportCards() {
  const getHref = (type, content) => {
    return type === "email" ? `mailto:${content}` : `tel:${content}`;
  };

  return (
    <section className="pt-12 px-4">
      <h2 className="text-center text-lg font-bold mb-6 text-[#202124]">Have Questions?</h2>

      <div className="space-y-4">
        {cards.map(({ icon: Icon, heading, content, type }) => (
          <div
            key={heading}
            className="flex items-center gap-3 bg-[#fff] border border-[#eee0fe] rounded-xl p-3"
          >
            <a 
              href={getHref(type, content)} 
              className="bg-[#704ee7]/20 text-[#704ee7] p-2 rounded-lg cursor-pointer"
            >
              <Icon size={20} strokeWidth={1.5} />
            </a>
            <div className="text-xs">
              <p className="font-semibold text-[#202124]">{heading}</p>
              <a 
                href={getHref(type, content)} 
                className="text-[#6d6d6d] hover:text-[#704ee7] cursor-pointer"
              >
                {content}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
