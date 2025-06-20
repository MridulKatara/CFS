import React from 'react';

const universities = [
  {
    name: "KL University",
    logo: "http://masai-website-images.s3.ap-south-1.amazonaws.com/KL_University_logo_c1af84ec04.svg"
  },
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
  // Triple the universities array to ensure smooth infinite scroll
  const tripleUniversities = [...universities, ...universities, ...universities];

  return (
    <section className="pt-14">
      <h2 className="text-center font-bold text-lg text-[#202124] mb-6">
        Our Partner Universities
      </h2>
      
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll-fast">
          {tripleUniversities.map((university, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 mx-6 flex items-center justify-center"
              style={{ minWidth: '140px' }}
            >
              <img 
                src={university.logo} 
                alt={university.name}
                className="h-12 w-auto object-contain hover:scale-110 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerUniversities;
