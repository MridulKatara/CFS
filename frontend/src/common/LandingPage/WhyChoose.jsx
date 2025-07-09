import React, { useState, useEffect, useRef } from 'react';
import certImg from "/src/assets/certificate.svg";

const slides = [
  {
    image: 'https://coding-platform.s3.amazonaws.com/dev/lms/tickets/ce4244c8-c872-42e1-8cac-42d711f8436a/23sfy1mdvFrWzIDg.jpg',
    alt: 'Campus Life',
  },
  {
    image: 'https://coding-platform.s3.amazonaws.com/dev/lms/tickets/2e4da6b7-898c-48d2-9496-edb33553f9f2/PkQiluR00tKiRw2B.jpg',
    alt: 'Lab Sessions',
  },
  {
    image: 'https://coding-platform.s3.amazonaws.com/dev/lms/tickets/9fe7c860-5854-48bb-9c22-9c73752167e9/YcFwyuMikS00jROT.jpg',
    alt: 'Collaborative Learning',
  },
  {
    image: 'https://coding-platform.s3.amazonaws.com/dev/lms/tickets/dfea8ea0-51f8-4e82-b627-25f071575a51/ov0bTKjNltRTRmxA.jpg',
    alt: 'Collaborative Learning',
  },
  {
    image: 'https://coding-platform.s3.amazonaws.com/dev/lms/tickets/6583e6f4-5dc6-41b0-b2eb-8c26463cd4c8/P2bopvZeT1PcESmP.jpg',
    alt: 'Collaborative Learning',
  },
  {
    image: 'https://coding-platform.s3.amazonaws.com/dev/lms/tickets/54aa2d83-f2e2-41c6-8e6c-e9536e6f926d/HBDAgGaCD0tX1kts.jpg',
    alt: 'Collaborative Learning',
  },
  {
    image: 'https://coding-platform.s3.amazonaws.com/dev/lms/tickets/59f7caaf-569e-4ef3-9dc5-0871e35dfc4f/VHYaHJYrRXnqCwGu.jpg',
    alt: 'Collaborative Learning',
  },
  {
    image: 'https://coding-platform.s3.amazonaws.com/dev/lms/tickets/98c3e665-7e56-4a9d-9520-961c56bb0d52/ficCwADmkRYqeyuQ.jpg',
    alt: 'Collaborative Learning',
  },
  {
    image: 'https://coding-platform.s3.amazonaws.com/dev/lms/tickets/a8a94375-c7d2-4cdc-9a15-be460380b403/mQGvi3JLVHxiQXYV.jpg',
    alt: 'Collaborative Learning',
  },
  {
    image: 'https://coding-platform.s3.amazonaws.com/dev/lms/tickets/71221613-9f30-4de7-af03-eb5fdd497572/IBFQfmzsSfmlZFao.jpg',
    alt: 'Collaborative Learning',
  },
  {
    image: 'https://coding-platform.s3.amazonaws.com/dev/lms/tickets/3cf67755-9d35-4446-9f5d-473def514bcc/lULOMrsAvrZOmRaG.jpg',
    alt: 'Collaborative Learning',
  },
  {
    image: 'https://coding-platform.s3.amazonaws.com/dev/lms/tickets/501f4566-012b-4a45-b044-a1c3e75dae77/AvuGDNL0YldixDzi.jpg',
    alt: 'Collaborative Learning',
  },
  {
    image: 'https://coding-platform.s3.amazonaws.com/dev/lms/tickets/1c6d5756-63d7-4c46-9c54-098ee5d09ae4/JYTmVvoetDnRaDuz.jpg',
    alt: 'Collaborative Learning',
  },
  {
    image: 'https://coding-platform.s3.amazonaws.com/dev/lms/tickets/541bf5a1-29ea-470a-9f38-265b090543fe/IlBzwGuzRaCW0gSU.jpg',
    alt: 'Collaborative Learning',
  },
  {
    image: 'https://coding-platform.s3.amazonaws.com/dev/lms/tickets/2de3a832-d5f2-4bbc-a908-98aba2303426/hG3DrNcP1pzmGoQJ.jpg',
    alt: 'Collaborative Learning',
  },
  {
    image: 'https://coding-platform.s3.amazonaws.com/dev/lms/tickets/9989bccd-70b2-4bee-895e-cfb93360a2ca/BGgNuiaDtcHMEHP1.jpg',
    alt: 'Collaborative Learning',
  },
  {
    image: 'https://coding-platform.s3.amazonaws.com/dev/lms/tickets/ad4d09df-e6ed-44af-a1dd-6744b421c64a/kPKLuORBbLMbTWnW.jpg',
    alt: 'Collaborative Learning',
  },
];

const CampusSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const slideContainerRef = useRef(null);
  
  const resetTimer = useRef(null);
  
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isDragging) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 3000);
    
    resetTimer.current = () => {
      clearInterval(timer);
      const newTimer = setInterval(() => {
        if (!isDragging) {
          setCurrentSlide((prev) => (prev + 1) % slides.length);
        }
      }, 3000);
      return newTimer;
    };

    return () => clearInterval(timer);
  }, [isDragging]);
  
  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  
  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  
  // Touch events for mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      handleNextSlide();
    } else if (touchStart - touchEnd < -50) {
      handlePrevSlide();
    }
  };
  
  // Mouse events for desktop
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };
  
  const handleMouseMove = () => {
    if (!isDragging) return;
  };
  
  const handleMouseUp = (e) => {
    if (!isDragging) return;
    
    const diffX = startX - e.clientX;
    
    if (diffX > 50) {
      handleNextSlide();
    } else if (diffX < -50) {
      handlePrevSlide();
    }
    
    setIsDragging(false);
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative overflow-hidden rounded-xl mx-auto" style={{ width: '325px', height: '200px' }}>
      <div 
        ref={slideContainerRef}
        className="flex transition-transform duration-500 ease-in-out" 
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <img 
              src={slide.image} 
              alt={slide.alt} 
              className="w-[325px] h-[200px] object-cover"
              draggable="false"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs sm:text-sm p-2">
              {slide.caption}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Faculty content for point 3
const FacultyContent = () => {
  const faculty = [
    { name: "Dr. Tushar JAIN", role: "Head CCE, IIT Mandi", institution: "IIT Mandi", img: `https://coding-platform.s3.amazonaws.com/dev/lms/tickets/96ea7635-f86d-4314-a878-635f02678a11/DMao2csPnQRdUE0G.jpg` },
    { name: "Dr. Sneha Singh", role: "Associate Professor", institution: "IIT Mandi", img: `https://coding-platform.s3.amazonaws.com/dev/lms/tickets/7e1bf450-21d5-4b20-bb8e-337125f6403e/VCRFTyaLfVypom0E.jpeg` },
    { name: "Dr. Adarsh Patel", role: "Assistant Professor", institution: "IIT Mandi", img: `https://coding-platform.s3.amazonaws.com/dev/lms/tickets/082dec54-2aae-400d-91f7-eae85b1f29bc/RfpSqCRu2ygjuABy.jpg` },
    { name: "Dr. Jyoti Nigam", role: "Assistant Professor", institution: "IIT Mandi", img: `https://coding-platform.s3.amazonaws.com/dev/lms/tickets/b75b532e-5525-4ccd-9acf-d40864e56ca0/IQCa1KCiiylDPpfQ.jpg` },
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
    <div >
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
            className={`py-6 px-6 sm:px-10 lg:px-16`}
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
