import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import testimonialsData from "../../data/testimonials.json";

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const { testimonials } = testimonialsData;
  const intervalRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto scroll functionality
  useEffect(() => {
    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          setIdx((prevIdx) => (prevIdx + 1) % testimonials.length);
        }
      }, 3000); // Change testimonial every 3 seconds
    };

    startAutoScroll();

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [testimonials.length, isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const goToNext = () => {
    setIdx((prevIdx) => (prevIdx + 1) % testimonials.length);
    resetTimer();
  };

  const goToPrev = () => {
    setIdx((prevIdx) => (prevIdx - 1 + testimonials.length) % testimonials.length);
    resetTimer();
  };

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          setIdx((prevIdx) => (prevIdx + 1) % testimonials.length);
        }
      }, 3000);
    }
  };

  return (
    <section className="pt-10">
      <h2 className="text-center font-bold text-lg mb-6 text-[#202124]">
        What Our Students Say
      </h2>

      <div className="px-6 relative">
        {/* Left navigation arrow */}
        <button 
          onClick={goToPrev} 
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={20} className="text-[#704ee7]" />
        </button>

        <div 
          className="bg-gradient-to-br from-[#eee0fe] to-[rgba(228,206,253,0.4)] shadow-lg rounded-xl p-4 flex gap-3"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
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

        {/* Right navigation arrow */}
        <button 
          onClick={goToNext} 
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md"
          aria-label="Next testimonial"
        >
          <ChevronRight size={20} className="text-[#704ee7]" />
        </button>
        
        {/* Progress indicator - optional visual cue without dots */}
        {/* <div className="mt-3 flex justify-center">
          <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#704ee7] transition-all duration-300"
              style={{ width: `${((idx + 1) / testimonials.length) * 100}%` }}
            ></div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
