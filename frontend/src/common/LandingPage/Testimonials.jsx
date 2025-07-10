import React, { useState, useEffect, useRef } from "react";
import testimonialsData from "../../data/testimonials.json";

// Video testimonials data
const videoTestimonials = [
  {
    id: 1,
    url: "https://cdn.masaischool.com/coding-platform/dev/lms/tickets/02cbbc81-e715-4234-a8e2-3daf28c59ba0/DUPKkMlXPCtDTHZ1.mp4",
    name: "Dr. Lal Singh",
    title: "Professor, IIT Mandi"
  },
  {
    id: 2,
    url: "https://cdn.masaischool.com/coding-platform/dev/lms/tickets/eed94c1a-8ca4-4f23-b88f-6d433e899c01/lPW3vABeVCzpReze.mp4",
    name: "Dr. Aditya Kumar",
    title: "Associate Professor, IIT Mandi"
  },
  {
    id: 3,
    url: "https://cdn.masaischool.com/coding-platform/dev/lms/tickets/b311007c-c77b-4d9d-93dc-4fe9455f0f14/qTPlXJLm21XPoPhX.mp4",
    name: "Dr. Ravi Shankar",
    title: "Assistant Professor, IIT Mandi"
  }
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const { testimonials } = testimonialsData;
  const intervalRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  
  // Video testimonials state
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const videoRef = useRef(null);
  const videoObserverRef = useRef(null);

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
  
  // Video testimonials functionality
  useEffect(() => {
    // Setup Intersection Observer for video visibility
    const observerOptions = {
      root: null, // use viewport
      rootMargin: '0px',
      threshold: 0.7 // 70% of the video must be visible
    };
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVideoVisible(true);
          if (videoRef.current) {
            videoRef.current.play().catch(error => {
              console.error("Video play failed:", error);
            });
            setIsVideoPlaying(true);
          }
        } else {
          setIsVideoVisible(false);
          if (videoRef.current) {
            videoRef.current.pause();
            setIsVideoPlaying(false);
          }
        }
      });
    };
    
    videoObserverRef.current = new IntersectionObserver(observerCallback, observerOptions);
    
    if (videoRef.current) {
      videoObserverRef.current.observe(videoRef.current);
    }
    
    return () => {
      if (videoObserverRef.current && videoRef.current) {
        videoObserverRef.current.unobserve(videoRef.current);
      }
    };
  }, [currentVideoIndex]);
  
  // Handle video completion
  const handleVideoEnded = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videoTestimonials.length);
  };
  
  // Navigate video testimonials
  const goToNextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videoTestimonials.length);
  };
  
  const goToPrevVideo = () => {
    setCurrentVideoIndex((prev) => 
      prev === 0 ? videoTestimonials.length - 1 : prev - 1
    );
  };
  
  // Video touch and mouse events
  const handleVideoTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleVideoTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleVideoTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      goToNextVideo();
    } else if (touchStart - touchEnd < -50) {
      goToPrevVideo();
    }
  };
  
  const handleVideoMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };
  
  const handleVideoMouseUp = (e) => {
    if (!isDragging) return;
    
    const diffX = startX - e.clientX;
    
    if (diffX > 50) {
      goToNextVideo();
    } else if (diffX < -50) {
      goToPrevVideo();
    }
    
    setIsDragging(false);
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
            <p className="text-[10px] mb-2 text-[#6d6d6d]">Student @REVA University</p>
            <p className="text-xs text-[#454545]">{testimonials[idx].content}</p>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-center font-bold text-lg mb-6 text-[#202124]">
          Faculty Video Testimonials
        </h2>
        
        <div className="px-6 relative">
          <div className="max-w-md mx-auto">
            <div 
              className="relative rounded-xl overflow-hidden shadow-lg w-[325px] h-[250px] mx-auto"
              onTouchStart={handleVideoTouchStart}
              onTouchMove={handleVideoTouchMove}
              onTouchEnd={handleVideoTouchEnd}
              onMouseDown={handleVideoMouseDown}
              onMouseUp={handleVideoMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              <video
                ref={videoRef}
                src={videoTestimonials[currentVideoIndex].url}
                className={`w-full object-cover ${isVideoVisible ? 'opacity-100' : 'opacity-90'}`}
                onEnded={handleVideoEnded}
                playsInline
                muted={false}
                controls={isVideoPlaying}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3">
                <h3 className="font-semibold text-sm">
                  {videoTestimonials[currentVideoIndex].name}
                </h3>
                <p className="text-xs text-gray-300">
                  {videoTestimonials[currentVideoIndex].title}
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {videoTestimonials.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx === currentVideoIndex ? 'bg-[#704ee7]' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentVideoIndex(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
