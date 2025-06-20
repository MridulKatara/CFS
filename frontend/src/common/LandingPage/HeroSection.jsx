import React from "react";
import masaiLogo from '/src/assets/masai.svg';
import nsdcLogo from '/src/assets/nsdc.svg';
import iitmandiLogo from '/src/assets/iitmandi.svg';
import cceLogo from '/src/assets/cce.svg';

export default function HeroSection() {
  return (
    <section className="w-full">
      {/* header logos */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 pt-6">
        <img src={cceLogo}   alt="IIT"     className="h-5 sm:h-7" />
        <img src={iitmandiLogo}   alt="CCE"     className="h-5 sm:h-7" />
        <img src={nsdcLogo}  alt="NSDC"    className="h-5 sm:h-7" />
        <img src={masaiLogo} alt="Masai"   className="h-4 sm:h-5" />
      </div>

      {/* title */}
      <div className="text-center mt-5 mb-4 px-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-[#202124]">
          Minor Programs
        </h1>
        <p className="text-sm sm:text-base font-medium text-[#6d6d6d]">
          offered by CCE, IIT Mandi
        </p>
      </div>

      {/* hero */}
      <img
        src="https://coding-platform.s3.amazonaws.com/dev/lms/tickets/29ad5f5f-1dd6-4e9e-895a-01759bad9a65/O1CjAVecEdvwUuvB.jpg"
        alt="IIT Mandi campus"
        className="w-full object-cover h-[200px] sm:h-[230px] lg:h-[300px]"
        draggable={false}
      />
    </section>
  );
}
