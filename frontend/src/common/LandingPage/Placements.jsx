import React from 'react';

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

const Placements = () => {
  // Duplicate the partners array for continuous animation
  const duplicatedPartners = [...hiringPartners, ...hiringPartners];

  return (
    <section className="py-6 bg-[#fcf7d0]">
      <div className="text-center mb-5 px-2">
        <h2 className="text-xl font-bold mb-2 text-[#202124]">Placements</h2>
        <p className="text-sm text-[#6d6d6d]">Meet Some Of Our 4000+ Hiring Partners</p>
      </div>
      
      <div className="logo-carousel ">
        <div className="logo-carousel-inner">
          {duplicatedPartners.map((partner, index) => (
            <div key={index} className="logo-container">
              <div className="h-[40px] relative rounded-[234px] bg-white w-full flex flex-col items-start justify-center py-0 px-3 box-border ">
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
          background: #fcf7d0;
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
    </section>
  );
};

export default Placements;
