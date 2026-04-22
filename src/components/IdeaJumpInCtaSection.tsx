import { useNavigate } from "react-router-dom";

const IdeaJumpInCtaSection = () => {
  const navigate = useNavigate();

  return (
    <section id="jump-in" className="relative py-24">
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/50 bg-card/80 p-6 text-center shadow-2xl backdrop-blur-md md:p-10">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Have an idea? JUMP IN 🚀</h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Choose your current stage. You will be redirected to the complete detailed form.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/apply/startup")}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg transition hover:opacity-95"
            >
              Running Startup
            </button>
            <button
              type="button"
              onClick={() => navigate("/apply/idea")}
              className="rounded-full border border-border bg-white px-5 py-2.5 text-sm font-bold text-foreground transition hover:border-primary/40"
            >
              Budding Idea
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IdeaJumpInCtaSection;