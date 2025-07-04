import React, { useState, useEffect } from 'react';
import certImg from "/src/assets/certificate.svg";
import t1 from '/src/assets/t1.png';
import t2 from '/src/assets/t2.png';
import t3 from '/src/assets/t3.png';

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

// Faculty content for point 3
const FacultyContent = () => {
  const faculty = [
    { name: "Dr. Indu Joshi", role: "Associate Professor", institution: "IIT Mandi", img: `https://coding-platform.s3.amazonaws.com/dev/lms/tickets/f0adffdb-03d1-446b-b7a8-24ab7a45a2c3/VlcfFcDPAGCQgCXj.jpg` },
    { name: "Dr. Adarsh Patel", role: "Associate Professor", institution: "IIT Mandi", img: t2 },
    { name: "Dr. Sneha Singh", role: "Assistant Professor", institution: "IIT Mandi", img: t3 }
  ];

  return (
    <div className="space-y-4">
      {faculty.map(({ name, role, institution, img }) => (
        <div
          key={name}
          className="flex gap-3 items-center bg-white rounded-xl shadow-sm p-3"
        >
          <img src={img} alt={name} className="h-12 w-12 rounded-lg object-cover" />
          <div className="text-xs">
            <p className="font-semibold text-[#202124]">{name}</p>
            <p className="text-[#6d6d6d]">{role}</p>
            <p className="text-[#6d6d6d]">{institution}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Placements content for point 4
const PlacementsContent = () => {
  const hiringPartners = [
    {
      name: "MoneyTap",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/moneytap_d5a6c9d532.svg"
    },
    {
      name: "UrbanPiper",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/urbanpiper_2884348a0b.svg"
    },
    {
      name: "Airmeet",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/airmeet_93e45faced.svg"
    },
    {
      name: "Paytm",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/paytm_a5c1ce2bc6.svg"
    },
    {
      name: "BharatPe",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/bharatpe_a3a5a3f552.svg"
    },
    {
      name: "Salesken",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/salesken_baefe048ac.svg"
    },
    {
      name: "Vyapar",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/vyapar_3f3770ebb5.svg"
    },
    {
      name: "Capgemini",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/capgemini_31a863e94f.svg"
    },
    {
      name: "Simplilearn",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/simplilearn_f8af8de923.svg"
    },
    {
      name: "Pagarbook",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/pagarbook_2746958f65.svg"
    },
    {
      name: "Smallcase",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/smallcase_1740bcc33f.svg"
    },
    {
      name: "BharatAgri",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/bharatagri_d4794042fe.svg"
    },
    {
      name: "ShareChat",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/sharechat_23a9923a34.svg"
    },
    {
      name: "LeapFinance",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/leapfinance_0d785d05eb.svg"
    },
    {
      name: "Ola",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/ola_15b5ee2b82.svg"
    },
    {
      name: "IBM",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/ibm_795b5429ee.svg"
    },
    {
      name: "Ajio",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/ajio_a16cd7a85b.svg"
    },
    {
      name: "GlobalLogic",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/globallogic_c30eb641f7.svg"
    },
    {
      name: "EatFit",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/eatfit_9dc276a187.svg"
    },
    {
      name: "Dream11",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/dream11_d6c8d97a52.svg"
    },
    {
      name: "HomeLane",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/homelane_e9cadd0c3c.svg"
    },
    {
      name: "Swiggy",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/swiggy_bc1b88842e.svg"
    },
    {
      name: "Jio",
      logo: "https://masai-website-images.s3.ap-south-1.amazonaws.com/My_Jio_For_Everything_Jio_5dd9635cab.webp"
    }
  ];
  
  // Duplicate partners for continuous animation
  const duplicatedPartners = [...hiringPartners, ...hiringPartners];

  return (
    <div>
      <div className="logo-carousel">
        <div className="logo-carousel-inner">
          {duplicatedPartners.map((partner, index) => (
            <div key={index} className="logo-container">
              <div className="h-[40px] relative rounded-[234px] bg-white w-full flex flex-col items-start justify-center py-0 px-3 box-border">
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="w-[90.5px] relative max-h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .logo-carousel {
          width: 100%;
          overflow: hidden;
          position: relative;
          padding: 1px 0;
        }
        
        .logo-carousel-inner {
          display: flex;
          animation: logoScroll 30s linear infinite;
          width: fit-content;
        }
        
        .logo-container {
          flex: 0 0 auto;
          width: 130px;
          height: 60px;
          margin: 0 10px;
        }
        
        @keyframes logoScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 768px) {
          .logo-container {
            width: 110px;
            margin: 0 8px;
          }
          
          .logo-carousel-inner {
            animation: logoScroll 25s linear infinite;
          }
        }
      `}</style>
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
    media: <FacultyContent />
  },
  {
    num: 4,
    heading: "Placement & Internship",
    body: "Maintain a 7+ CGPA to become eligible for assured job opportunities",
    media: <PlacementsContent />
  }
];

export default function WhyChoose() {
  return (
    <section className="w-full relative [background:linear-gradient(180deg,_#ebf6ff,_#fff7ca)]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center font-bold text-xl sm:text-2xl text-[#202124] pt-8">
          Why Choose this Course
        </h2>

        {points.map(({ num, heading, body, media }) => (
          <div
            key={num}
            className={`py-10 px-6 sm:px-10 lg:px-16`}
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
