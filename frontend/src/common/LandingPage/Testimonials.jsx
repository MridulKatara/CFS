import React, { useState } from "react";
import { CircleDot } from "lucide-react";
import testimonialsData from "../../data/testimonials.json";

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const { testimonials } = testimonialsData;

  return (
    <section className="pt-10">
      <h2 className="text-center font-bold text-lg mb-6 text-[#202124]">
        What Our Students Say
      </h2>

      <div className="px-6">
        <div className="bg-gradient-to-br from-[#eee0fe] to-[rgba(228,206,253,0.4)] shadow-lg rounded-xl p-4 flex gap-3">
          <img 
            src={testimonials[idx].imageUrl} 
            alt={testimonials[idx].name} 
            className="h-14 w-14 rounded-lg shrink-0 object-cover"
          />
          <div>
            <h3 className="font-semibold text-sm text-[#202124]">
              {testimonials[idx].name}
            </h3>
            <p className="text-[10px] mb-2 text-[#6d6d6d]">Student @IIT Mandi</p>
            <p className="text-xs text-[#454545]">{testimonials[idx].content}</p>
          </div>
        </div>

        {/* dots */}
        <div className="flex justify-center gap-2 mt-4">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}>
              <CircleDot
                size={10}
                className={i === idx ? "fill-[#704ee7] stroke-[#704ee7]" : "stroke-[#999]"}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
