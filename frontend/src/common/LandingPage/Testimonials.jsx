import React, { useState, useEffect, useRef } from "react";
import testimonialsData from "../../data/testimonials.json";

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const { testimonials } = testimonialsData;
  const intervalRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  useEffect(() => {
    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        if (!isPaused && !isDragging) {
          setIdx((prevIdx) => (prevIdx + 1) % testimonials.length);
        }
      }, 3000);
    };

    startAutoScroll();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [testimonials.length, isPaused, isDragging]);

  const handleContainerMouseEnter = () => {
    setIsPaused(true);
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
        if (!isPaused && !isDragging) {
          setIdx((prevIdx) => (prevIdx + 1) % testimonials.length);
        }
      }, 3000);
    }
  };
  
  const handleTouchStart = (e) => {
    setIsPaused(true);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      goToNext();
    } else if (touchStart - touchEnd < -50) {
      goToPrev();
    }
    setIsPaused(false);
  };
  
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.clientX);
  };
  
  const handleMouseMove = () => {
    if (!isDragging) return;
  };
  
  const handleMouseUp = (e) => {
    if (!isDragging) return;
    
    const diffX = startX - e.clientX;
    
    if (diffX > 50) {
      goToNext();
    } else if (diffX < -50) {
      goToPrev();
    }
    
    setIsDragging(false);
    setIsPaused(false);
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  return (
    <section className="pt-10">
      <h2 className="text-center font-bold text-lg mb-6 text-[#202124]">
        What Our Students Say
      </h2>

      <div className="px-6 relative">
        <div 
          className="bg-gradient-to-br from-[#eee0fe] to-[rgba(228,206,253,0.4)] shadow-lg rounded-xl p-4 flex gap-3"
          onMouseEnter={handleContainerMouseEnter}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <img 
            src={testimonials[idx].imageUrl} 
            alt={testimonials[idx].name} 
            className="h-14 w-14 rounded-lg shrink-0 object-cover"
            draggable="false"
          />
          <div>
            <h3 className="font-semibold text-sm text-[#202124]">
              {testimonials[idx].name}
            </h3>
            <p className="text-[10px] mb-2 text-[#6d6d6d]">Student @IIT Mandi</p>
            <p className="text-xs text-[#454545]">{testimonials[idx].content}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
