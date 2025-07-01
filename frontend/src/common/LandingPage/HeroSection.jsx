import React from "react";
import masaiLogo from '/src/assets/masai.svg';
import nsdcLogo from '/src/assets/nsdc.svg';
import iitmandiLogo from '/src/assets/iitmandi.svg';
import cceLogo from '/src/assets/cce.svg';

export default function HeroSection() {
  return (
    <section className="w-full">
      {/* Header logos */}
      <div className="relative w-full py-4 flex items-center justify-center gap-4">
        <img src={cceLogo} alt="CCE" className="w-[49px] object-contain" />
        <img src={iitmandiLogo} alt="IIT Mandi" className="w-[52px] object-contain" />
        <img src={nsdcLogo} alt="NSDC" className="w-[42px] h-[42px] object-contain" />
        <img src={masaiLogo} alt="Masai" className="w-[50px] h-[22px] object-contain" />
      </div>

      {/* Title */}
      <div className="px-4 mt-6">
        <h1 className="text-[34px] tracking-[-0.02em] leading-[120%] font-semibold font-poppins text-black text-center">
          Minor Programs
        </h1>
        <p className="text-base tracking-[-0.02em] leading-[120%] font-medium font-poppins text-black text-center mt-1 mb-4">
          offered by CCE, IIT Mandi
        </p>
      </div>

      {/* Hero Image with Gradient Overlay */}
      <div className="relative w-full">
        <img
          src="https://coding-platform.s3.amazonaws.com/dev/lms/tickets/29ad5f5f-1dd6-4e9e-895a-01759bad9a65/O1CjAVecEdvwUuvB.jpg"
          alt="IIT Mandi campus"
          className="w-full object-cover rounded-b-2xl"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-100 rounded-b-2xl" />
      </div>
    </section>
  );
}
