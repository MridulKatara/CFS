import React from 'react';

const universities = [
  {
    name: "DAV",
    logo: "https://s3.ap-south-1.amazonaws.com/static.masaischool.com/future_skills/college_icons/dav.png"
  },
  {
    name: "REVA University",
    logo: "https://s3.ap-south-1.amazonaws.com/static.masaischool.com/future_skills/college_icons/reva.png"
  },
  {
    name: "BBDU",
    logo: "https://s3.ap-south-1.amazonaws.com/static.masaischool.com/future_skills/college_icons/bbdu.png"
  },
  {
    name: "Guru Nanak University",
    logo: "https://s3.ap-south-1.amazonaws.com/static.masaischool.com/future_skills/college_icons/gnu.png"
  },
  {
    name: "Atria University",
    logo: "https://s3.ap-south-1.amazonaws.com/static.masaischool.com/future_skills/college_icons/atria.png"
  },
  {
    name: "Charusat University",
    logo: "https://s3.ap-south-1.amazonaws.com/static.masaischool.com/future_skills/college_icons/charusat.png"
  }
];

const PartnerUniversities = () => {
  // Duplicate the universities array for continuous animation
  const duplicatedUniversities = [...universities, ...universities];

  return (
    <section className="pt-8 bg-white overflow-hidden">
      <h2 className="text-center font-bold text-xl text-[#202124] mb-6">
        Our Partner Universities
      </h2>
      
      <div className="marquee-container">
        <div className="marquee-content">
          {duplicatedUniversities.map((university, index) => (
            <div 
              key={index} 
              className="marquee-item"
            >
              <img 
                src={university.logo} 
                alt={university.name}
                className="h-12 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          width: 100%;
          overflow: hidden;
          position: relative;
          padding: 10px 0;
        }
        
        .marquee-content {
          display: flex;
          animation: marquee 20s linear infinite;
          width: fit-content;
        }
        
        .marquee-item {
          flex-shrink: 0;
          width: 120px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 15px;
        }
        
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 768px) {
          .marquee-content {
            animation: marquee 15s linear infinite;
          }
          
          .marquee-item {
            width: 90px;
            padding: 0 10px;
          }
        }
      `}</style>
    </section>
  );
};

export default PartnerUniversities;
