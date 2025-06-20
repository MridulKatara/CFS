import React, { useState, useEffect } from 'react';
import certImg from "/src/assets/certificate.svg";

const slides = [
  {
    image: 'https://coding-platform.s3.amazonaws.com/dev/lms/tickets/4afff385-555c-496f-8945-4c3cfd65a1f8/HWLHkzXEi3UQuC2F.JPG',
    alt: 'Campus Life',
    caption: 'Experience the vibrant campus life'
  },
  {
    image: 'https://masai-website-images.s3.ap-south-1.amazonaws.com/Hand_On_Lab_Session_bb22ff5eb1.JPG',
    alt: 'Lab Sessions',
    caption: 'Hands-on learning in state-of-the-art labs'
  },
  {
    image: 'https://masai-website-images.s3.ap-south-1.amazonaws.com/Students_Collaborating_in_class_76c8dee49c.JPG',
    alt: 'Collaborative Learning',
    caption: 'Collaborative learning environment'
  }
];

const CampusSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="flex transition-transform duration-500 ease-in-out" 
           style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img 
              src={slide.image} 
              alt={slide.alt} 
              className="w-full h-28 sm:h-48 lg:h-64 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs sm:text-sm p-2">
              {slide.caption}
            </div>
          </div>
        ))}
      </div>
      
      {/* Dots indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const points = [
  {
    num: 1,
    heading: "Minor Certification",
    body: "Earn a recognized Minor Certificate supported by IIT Mandi, NSDC & your university",
    media: <img src={certImg} alt="certificate" className="rounded-xl w-full" />
  },
  {
    num: 2,
    heading: "Campus Immersion",
    body: "Opportunity to experience IIT campus life during events and orientations",
    media: <CampusSlider />
  },
  {
    num: 3,
    heading: "IIT Faculty & Experts",
    body: "Learn directly from IIT faculty, NSDC mentors & seasoned industry experts",
    media: null
  }
];

export default function WhyChoose() {
  return (
    <section className="pt-10">
      <div className="max-w-7xl mx-auto">
        {points.map(({ num, heading, body, media }) => (
          <div
            key={num}
            className={`py-10 px-6 sm:px-10 lg:px-16 ${
              num % 2 === 1
                ? "bg-gradient-to-b from-[#ebf6ff]/40 to-[#fff]"
                : "bg-gradient-to-b from-[#f5f5f5]/40 to-[#fff]"
            }`}
          >
            <div className="text-center max-w-2xl mx-auto">
              <div className="mx-auto w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#fff] shadow-lg flex items-center justify-center font-semibold text-[#704ee7]">
                {num}
              </div>
              <h3 className="mt-4 font-semibold text-[#202124] text-lg sm:text-xl lg:text-2xl">
                {heading}
              </h3>
              <p className="text-xs sm:text-sm lg:text-base mt-2 text-[#6d6d6d]">
                {body}
              </p>
            </div>

            {media && (
              <div className="mt-6 max-w-3xl mx-auto">
                {media}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
