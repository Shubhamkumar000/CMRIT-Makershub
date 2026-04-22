import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IdeaJumpInSection from "@/components/IdeaJumpInSection";
import campusBg from "@/assets/campus-bg.jpg";

const StartupApplication = () => {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <img src={campusBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px]" />
      </div>

      <Navbar />
      <div className="pt-16 md:pt-28">
        <IdeaJumpInSection initialTrack="startup" />
      </div>
      <Footer />
    </div>
  );
};

export default StartupApplication;