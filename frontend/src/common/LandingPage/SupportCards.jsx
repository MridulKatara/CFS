/* eslint-disable no-unused-vars */
import React from "react";
import { FiHeadphones, FiPhone } from "react-icons/fi";

const cards = [
  { icon: FiHeadphones, heading: "Admission Support", content: "info.cce@iitmandi.ac.in" },
  { icon: FiPhone,      heading: "Phone Support",     content: "+91 6364919735" }
];

export default function SupportCards() {
  return (
    <section className="pt-12 px-4">
      <h2 className="text-center text-lg font-bold mb-6 text-[#202124]">Have Questions?</h2>

      <div className="space-y-4">
        {cards.map(({ icon: Icon, heading, content }) => (
          <div
            key={heading}
            className="flex items-center gap-3 bg-[#fff] border border-[#eee0fe] rounded-xl p-3"
          >
            <div className="bg-[#704ee7]/20 text-[#704ee7] p-2 rounded-lg">
              <Icon size={20} strokeWidth={1.5} />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-[#202124]">{heading}</p>
              <p className="text-[#6d6d6d]">{content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
