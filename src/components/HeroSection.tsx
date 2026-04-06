import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import campusBg from "@/assets/campus-bg.jpg";
import slide1 from "@/assets/slide-1.jpg";
import slide2 from "@/assets/slide-2.jpeg";
import slide3 from "@/assets/slide-3.webp";
import slide4 from "@/assets/slide-4.png";

const slides = [campusBg, slide1, slide2, slide3, slide4];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {slides.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img src={src} alt={`Campus slide ${i + 1}`} className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-20">
        <div className="text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
            CMRIT<br />
            <span className="opacity-90">Makerspace</span>
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-md mx-auto md:mx-0">
            Where ideas become reality. A hands-on innovation hub for building, prototyping, and creating the future.
          </p>
          <div className="mt-8 flex gap-4 justify-center md:justify-start">
            <Button size="lg" className="shadow-lg">
              Apply Now
            </Button>
            <Button size="lg" variant="outline" className="border-white/75 bg-black/30 text-white hover:bg-black/45 hover:text-white backdrop-blur-sm shadow-lg">
              Know More
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current ? "bg-primary-foreground scale-125" : "bg-primary-foreground/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
