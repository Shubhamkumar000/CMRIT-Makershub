import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import campusBg from "@/assets/campus-bg.jpg";

const schools = [
  {
    title: "School of Innovation & Prototyping",
    desc: "A studio-style learning space where teams ideate, design, build and iterate—supported by tools, mentors and a maker community.",
  },
  {
    title: "School of Robotics & Automation",
    desc: "Explore autonomous systems, mechatronics, and intelligent machines with state-of-the-art labs and expert guidance.",
  },
  {
    title: "School of Digital Fabrication",
    desc: "Master 3D printing, CNC machining, laser cutting, and advanced manufacturing techniques for rapid prototyping.",
  },
];

const SchoolsSection = () => {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i === 0 ? schools.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === schools.length - 1 ? 0 : i + 1));
  const s = schools[idx];

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50 min-h-[420px]">
          <img src={campusBg} alt="" className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm" />
          <div className="absolute inset-0 bg-background/30 backdrop-blur-sm" />

          <div className="relative z-10 p-8 md:p-12 flex items-end min-h-[420px]">
            <div className="bg-card/90 backdrop-blur-md rounded-2xl p-6 max-w-lg shadow-xl border border-border/50">
              <div className="bg-primary rounded-xl px-5 py-3 inline-block mb-4">
                <h3 className="text-lg font-bold text-primary-foreground">{s.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <Button className="mt-4 font-bold tracking-wider">
                EXPLORE
              </Button>
            </div>
          </div>

          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/80 border border-border flex items-center justify-center text-foreground hover:bg-card transition">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/80 border border-border flex items-center justify-center text-foreground hover:bg-card transition">
            <ChevronRight size={20} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {schools.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`w-3 h-3 rounded-full transition-all ${i === idx ? "bg-primary scale-110" : "bg-muted-foreground/40"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchoolsSection;
