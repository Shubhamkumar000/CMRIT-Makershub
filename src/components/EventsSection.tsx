import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import campusBg from "@/assets/campus-bg.jpg";
import { eventsAPI } from "@/lib/api";
import { type CampusEvent } from "@/lib/ticketStore";

const EventsSection = () => {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [idx, setIdx] = useState(0);

  const fetchEvents = async () => {
    try {
      const eventsRes = await eventsAPI.getAll();
      const normalizedEvents: CampusEvent[] = (eventsRes.events || []).map((ev: any) => ({
        id: ev._id || ev.id,
        date: ev.date,
        title: ev.title,
        desc: ev.description || ev.desc || "",
        time: ev.time,
        venue: ev.venue,
        image: ev.image || "",
      }));
      setEvents(normalizedEvents);
      setIdx((prev) => (normalizedEvents.length === 0 ? 0 : Math.min(prev, normalizedEvents.length - 1)));
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const prev = () => setIdx((i) => (i === 0 ? events.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === events.length - 1 ? 0 : i + 1));

  if (events.length === 0) return null;

  const e = events[idx];

  return (
    <section id="events" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-secondary/5 to-transparent" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center italic text-foreground">Campus Events</h2>
        <p className="text-center text-muted-foreground mt-2">Upcoming workshops, talks and hack sessions.</p>

        <div className="mt-10 bg-card/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
          <div className="grid md:grid-cols-2 min-h-[380px]">
            <div className="relative overflow-hidden h-[250px] md:h-full">
              <img src={e.image || campusBg} alt={e.title} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <span className="inline-block bg-secondary text-secondary-foreground text-sm font-bold px-4 py-2 rounded-lg w-fit">{e.date}</span>
              <h3 className="mt-4 text-2xl font-bold text-foreground">{e.title}</h3>
              <p className="mt-2 text-muted-foreground">{e.desc}</p>
              <div className="mt-auto pt-8 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock size={16} /> {e.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={16} className="text-destructive" /> {e.venue}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pb-4">
            {events.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`w-3 h-3 rounded-full transition-all ${i === idx ? "bg-primary scale-110" : "bg-muted-foreground/30"}`} />
            ))}
          </div>
        </div>

        <button onClick={prev} className="absolute left-0 top-1/2 translate-y-8 z-20 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition">
          <ChevronLeft size={20} />
        </button>
        <button onClick={next} className="absolute right-0 top-1/2 translate-y-8 z-20 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition">
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default EventsSection;
