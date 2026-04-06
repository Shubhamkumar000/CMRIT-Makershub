import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FindServiceSection from "@/components/FindServiceSection";
import SchoolsSection from "@/components/SchoolsSection";
import EventsSection from "@/components/EventsSection";
import Footer from "@/components/Footer";
import campusBg from "@/assets/campus-bg.jpg";

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <img src={campusBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
      </div>

      <Navbar />
      <HeroSection />
      <FindServiceSection />
      <SchoolsSection />
      <EventsSection />
      <Footer />
    </div>
  );
};

export default Index;
