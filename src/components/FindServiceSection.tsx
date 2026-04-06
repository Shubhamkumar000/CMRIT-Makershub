import { useNavigate } from "react-router-dom";

const categoryRoutes: Record<string, string> = {
  "3D Printing": "/book/3d-printing",
  "Laser Printing": "/book/laser-printing",
  "Book MakerSpace": "/book/makerspace",
  "Hardware": "/hardware",
};
const categories = ["3D Printing", "Laser Printing", "Book MakerSpace", "Hardware"];

const FindServiceSection = () => {
  const navigate = useNavigate();

  return (
    <section id="services" className="relative py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-card/70 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-border/50">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Find your Service</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Explore maker-focused learning paths—hands-on labs, projects, and interdisciplinary programs designed to turn ideas into prototypes.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Click a service to continue booking.
              </p>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      if (categoryRoutes[cat]) navigate(categoryRoutes[cat]);
                    }}
                    className="rounded-xl py-3 px-4 text-sm font-semibold border transition-all bg-card text-foreground border-border hover:border-primary/40"
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindServiceSection;
