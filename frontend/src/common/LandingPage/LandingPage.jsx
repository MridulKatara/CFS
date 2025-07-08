import React from "react";
import HeroSection from "./HeroSection";
import AboutIIT from "./AboutIIT";
import KeyFeatures from "./KeyFeatures";
import WhyChoose from "./WhyChoose";
import MinorPrograms from "./MinorPrograms";
import PartnerUniversities from "./PartnerUniversities";
import Testimonials from "./Testimonials";
import SupportCards from "./SupportCards";
import FAQ from "./FAQ";
import BottomNavBar from '../../student/ButtomNavItem';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] font-inter pb-20">
      <div className="max-w-md mx-auto bg-white">
        <HeroSection />
        <AboutIIT />
        <KeyFeatures />
        <MinorPrograms />
        <PartnerUniversities />
        <WhyChoose />
        <Testimonials />
        <SupportCards />
        <FAQ />
      </div>
      <BottomNavBar />
    </main>
  );
}
