import React from "react";
import HeroSection        from "./HeroSection";
import AboutIIT           from "./AboutIIT";
import KeyFeatures        from "./KeyFeatures";
import WhyChoose          from "./WhyChoose";
import MinorPrograms      from "./MinorPrograms";
import PartnerUniversities from "./PartnerUniversities";
import FacultySection     from "./FacultySection";
import Placements         from "./Placements";
import Testimonials       from "./Testimonials";
import SupportCards       from "./SupportCards";
import FAQ                from "./FAQ";
import BottomNavBar       from '../../student/ButtomNavItem';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] font-inter pb-20">
      <div className="max-w-7xl mx-auto bg-white">
        <HeroSection />
        <AboutIIT />
        <KeyFeatures />
        <WhyChoose />
        <MinorPrograms />
        <PartnerUniversities />
        <FacultySection />
        <Placements />
        <Testimonials />
        <SupportCards />
        <FAQ />
      </div>
      <BottomNavBar />
    </main>
  );
}
