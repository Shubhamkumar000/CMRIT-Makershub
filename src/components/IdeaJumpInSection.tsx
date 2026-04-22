import { useMemo, useState } from "react";

type Track = "startup" | "idea";

interface IdeaJumpInSectionProps {
  initialTrack?: Track;
}

const inputClass = "mt-2 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary";
const labelClass = "block text-sm font-semibold text-foreground";
const noteClass = "mt-2 text-xs text-muted-foreground";

const IdeaJumpInSection = ({ initialTrack = "startup" }: IdeaJumpInSectionProps) => {
  const [track, setTrack] = useState<Track>(initialTrack);

  const startupSupportOptions = useMemo(
    () => [
      "Tech/Product Development",
      "UI/UX",
      "Marketing & Growth",
      "Fundraising",
      "Legal/Compliance",
      "Hiring",
    ],
    [],
  );

  const ideaSupportOptions = useMemo(
    () => ["Idea validation", "Finding team", "Tech help", "Business strategy", "Mentorship"],
    [],
  );

  return (
    <section id="jump-in" className="relative py-24">
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/50 bg-card/80 p-6 shadow-2xl backdrop-blur-md md:p-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Have an idea? JUMP IN 🚀</h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              Pick your current stage and submit the detailed form so we can evaluate and support you better.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setTrack("startup")}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                track === "startup"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "border border-border bg-white text-foreground hover:border-primary/40"
              }`}
            >
              Running Startup
            </button>
            <button
              type="button"
              onClick={() => setTrack("idea")}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                track === "idea"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "border border-border bg-white text-foreground hover:border-primary/40"
              }`}
            >
              Budding Idea
            </button>
          </div>

          {track === "startup" ? (
            <form className="mt-10 space-y-6">
              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h3 className="text-xl font-bold text-foreground">FORM 1 - I HAVE A STARTUP (Detailed / Advanced)</h3>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">1. Founder Information</h4>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className={labelClass}>Full Name<input className={inputClass} type="text" /></label>
                  <label className={labelClass}>Email<input className={inputClass} type="email" /></label>
                  <label className={labelClass}>Phone Number<input className={inputClass} type="tel" /></label>
                  <label className={labelClass}>College / Department / Year<input className={inputClass} type="text" /></label>
                  <label className={labelClass}>LinkedIn Profile<input className={inputClass} type="url" /></label>
                  <label className={labelClass}>GitHub / Portfolio<input className={inputClass} type="url" /></label>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className={labelClass}>
                    Previous startup experience?
                    <select className={inputClass} defaultValue="">
                      <option value="" disabled>Select</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </label>
                  <label className={labelClass}>If yes, details<textarea className={inputClass} rows={3} /></label>
                </div>
                <label className={`${labelClass} mt-4`}>Any internships / work experience?<textarea className={inputClass} rows={3} /></label>
                <p className={noteClass}>Helps judge seriousness and background.</p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">2. Team Details</h4>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className={labelClass}>Team Size<input className={inputClass} type="number" min={1} /></label>
                  <label className={labelClass}>How long have you worked together?<input className={inputClass} type="text" /></label>
                </div>
                <label className={`${labelClass} mt-4`}>Co-founder names + roles<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>Equity split (optional)<input className={inputClass} type="text" /></label>
                <label className={`${labelClass} mt-4`}>
                  Any conflicts in team?
                  <select className={inputClass} defaultValue="">
                    <option value="" disabled>Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </label>
                <p className={noteClass}>Helps identify team stability.</p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">3. Startup Basics</h4>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className={labelClass}>Startup Name<input className={inputClass} type="text" /></label>
                  <label className={labelClass}>Tagline (max 15 words)<input className={inputClass} type="text" maxLength={120} /></label>
                </div>
                <label className={`${labelClass} mt-4`}>Elevator Pitch (max 100 words)<textarea className={inputClass} rows={4} /></label>
                <label className={`${labelClass} mt-4`}>Problem Statement (detailed)<textarea className={inputClass} rows={4} /></label>
                <label className={`${labelClass} mt-4`}>Who faces this problem?<textarea className={inputClass} rows={3} /></label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">4. Problem Validation</h4>
                <label className={`${labelClass} mt-4`}>How did you discover this problem?<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>
                  Have you personally experienced it?
                  <select className={inputClass} defaultValue="">
                    <option value="" disabled>Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </label>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className={labelClass}>Number of people interviewed<input className={inputClass} type="number" min={0} /></label>
                  <label className={labelClass}>Any survey data link<input className={inputClass} type="url" /></label>
                </div>
                <label className={`${labelClass} mt-4`}>Key insights from users<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>Upload survey data<input className={inputClass} type="file" /></label>
                <p className={noteClass}>This separates real founders from random idea people.</p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">5. Solution Details</h4>
                <label className={`${labelClass} mt-4`}>Your solution explained clearly<textarea className={inputClass} rows={4} /></label>
                <label className={`${labelClass} mt-4`}>Why is your solution better?<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>Key features (bullet points)<textarea className={inputClass} rows={4} /></label>
                <label className={`${labelClass} mt-4`}>What makes it hard to replicate?<textarea className={inputClass} rows={3} /></label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">6. Product Stage</h4>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className={labelClass}>
                    Current stage
                    <select className={inputClass} defaultValue="">
                      <option value="" disabled>Select stage</option>
                      <option>Idea</option>
                      <option>Prototype</option>
                      <option>MVP</option>
                      <option>Live</option>
                    </select>
                  </label>
                  <label className={labelClass}>Demo link / Website / GitHub<input className={inputClass} type="url" /></label>
                </div>
                <label className={`${labelClass} mt-4`}>Screenshots upload<input className={inputClass} type="file" multiple /></label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">7. Traction & Metrics</h4>
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <label className={labelClass}>Number of users<input className={inputClass} type="number" min={0} /></label>
                  <label className={labelClass}>Active users (DAU/MAU)<input className={inputClass} type="text" /></label>
                  <label className={labelClass}>Growth rate (%)<input className={inputClass} type="number" min={0} /></label>
                  <label className={labelClass}>Revenue (if any)<input className={inputClass} type="text" /></label>
                  <label className={labelClass}>Retention rate (if known)<input className={inputClass} type="text" /></label>
                </div>
                <p className={noteClass}>Gold section for evaluation.</p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">8. Target Market</h4>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className={labelClass}>Target audience (very specific)<textarea className={inputClass} rows={3} /></label>
                  <label className={labelClass}>Market size (if known)<input className={inputClass} type="text" /></label>
                </div>
                <label className={`${labelClass} mt-4`}>Geography focus<input className={inputClass} type="text" /></label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">9. Competition</h4>
                <label className={`${labelClass} mt-4`}>List competitors<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>What are they doing well?<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>Why will users choose you?<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>Your unique advantage (USP)<textarea className={inputClass} rows={3} /></label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">10. Business Model</h4>
                <label className={`${labelClass} mt-4`}>How will you make money?<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>Pricing strategy<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>Expected revenue streams<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>Unit economics (if known)<textarea className={inputClass} rows={3} /></label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">11. Tech & Operations</h4>
                <label className={`${labelClass} mt-4`}>Tech stack<input className={inputClass} type="text" /></label>
                <label className={`${labelClass} mt-4`}>Who built the product?<input className={inputClass} type="text" /></label>
                <label className={`${labelClass} mt-4`}>Any dependencies (APIs/tools)?<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>Scalability concerns?<textarea className={inputClass} rows={3} /></label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">12. Growth Strategy</h4>
                <label className={`${labelClass} mt-4`}>How will you acquire users?<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>Marketing channels planned<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>Any experiments tried?<textarea className={inputClass} rows={3} /></label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">13. Support Required (Mentor Matching Core)</h4>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {startupSupportOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground">
                      <input type="checkbox" name="startupSupport" value={option} />
                      {option}
                    </label>
                  ))}
                </div>
                <label className={`${labelClass} mt-4`}>Explain specifically what help you need<textarea className={inputClass} rows={4} /></label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">14. Roadmap & Vision</h4>
                <label className={`${labelClass} mt-4`}>Goals for next 3 months<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>Goals for next 6 months<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>Long-term vision (1-3 years)<textarea className={inputClass} rows={3} /></label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">15. Funding Status</h4>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className={labelClass}>
                    Current funding status
                    <select className={inputClass} defaultValue="">
                      <option value="" disabled>Select</option>
                      <option>Bootstrapped</option>
                      <option>Funded</option>
                    </select>
                  </label>
                  <label className={labelClass}>If funded: amount + source<input className={inputClass} type="text" /></label>
                </div>
                <label className={`${labelClass} mt-4`}>
                  Planning to raise?
                  <select className={inputClass} defaultValue="">
                    <option value="" disabled>Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">16. Founder Mindset</h4>
                <label className={`${labelClass} mt-4`}>Why are you building this startup?<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>Biggest challenge faced so far<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>What will you do if this fails?<textarea className={inputClass} rows={3} /></label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">17. Final Filter Question</h4>
                <label className={`${labelClass} mt-4`}>Why should our incubation center select you?<textarea className={inputClass} rows={4} /></label>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg hover:opacity-95">
                  Submit Startup Form
                </button>
              </div>
            </form>
          ) : (
            <form className="mt-10 space-y-6">
              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h3 className="text-xl font-bold text-foreground">FORM 2 - IDEATION STAGE (Detailed but Guided)</h3>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">1. Personal Info</h4>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className={labelClass}>Full Name<input className={inputClass} type="text" /></label>
                  <label className={labelClass}>Email<input className={inputClass} type="email" /></label>
                  <label className={labelClass}>Phone Number<input className={inputClass} type="tel" /></label>
                  <label className={labelClass}>College / Department / Year<input className={inputClass} type="text" /></label>
                  <label className={labelClass}>LinkedIn Profile<input className={inputClass} type="url" /></label>
                  <label className={labelClass}>GitHub / Portfolio<input className={inputClass} type="url" /></label>
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">2. Idea Basics</h4>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className={labelClass}>Idea Title<input className={inputClass} type="text" /></label>
                  <label className={labelClass}>Who faces this problem?<input className={inputClass} type="text" /></label>
                </div>
                <label className={`${labelClass} mt-4`}>Elevator pitch (1-2 lines)<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>Problem statement<textarea className={inputClass} rows={4} /></label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">3. Problem Understanding</h4>
                <label className={`${labelClass} mt-4`}>Why does this problem exist?<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>How are people solving it today?<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>What's wrong with current solutions?<textarea className={inputClass} rows={3} /></label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">4. Proposed Solution</h4>
                <label className={`${labelClass} mt-4`}>Your idea in detail<textarea className={inputClass} rows={4} /></label>
                <label className={`${labelClass} mt-4`}>Key features<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>Why do you think it will work?<textarea className={inputClass} rows={3} /></label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">5. Validation (Light)</h4>
                <label className={`${labelClass} mt-4`}>
                  Have you talked to users?
                  <select className={inputClass} defaultValue="">
                    <option value="" disabled>Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </label>
                <label className={`${labelClass} mt-4`}>If yes, what did you learn?<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>Any research done?<textarea className={inputClass} rows={3} /></label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">6. Team & Collaboration</h4>
                <label className={`${labelClass} mt-4`}>
                  Solo / Team
                  <select className={inputClass} defaultValue="">
                    <option value="" disabled>Select</option>
                    <option>Solo</option>
                    <option>Team</option>
                  </select>
                </label>
                <label className={`${labelClass} mt-4`}>
                  Looking for co-founders?
                  <select className={inputClass} defaultValue="">
                    <option value="" disabled>Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </label>
                <label className={`${labelClass} mt-4`}>Preferred roles in teammates<textarea className={inputClass} rows={3} /></label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">7. Interest & Commitment</h4>
                <label className={`${labelClass} mt-4`}>Why do you want to build this?<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>Hours per week you can commit<input className={inputClass} type="number" min={0} /></label>
                <label className={`${labelClass} mt-4`}>
                  Ready for long-term startup journey?
                  <select className={inputClass} defaultValue="">
                    <option value="" disabled>Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">8. Flexibility</h4>
                <label className={`${labelClass} mt-4`}>
                  Open to changing idea?
                  <select className={inputClass} defaultValue="">
                    <option value="" disabled>Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </label>
                <label className={`${labelClass} mt-4`}>
                  Open to joining someone else's startup?
                  <select className={inputClass} defaultValue="">
                    <option value="" disabled>Select</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </label>
                <p className={noteClass}>Helps in matching people together.</p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">9. Support Needed</h4>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {ideaSupportOptions.map((option) => (
                    <label key={option} className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground">
                      <input type="checkbox" name="ideaSupport" value={option} />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">10. Goals</h4>
                <label className={`${labelClass} mt-4`}>
                  What do you want to achieve in incubation?
                  <select className={inputClass} defaultValue="">
                    <option value="" disabled>Select primary goal</option>
                    <option>Build MVP</option>
                    <option>Learn</option>
                    <option>Network</option>
                    <option>Join team</option>
                  </select>
                </label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">11. Thinking Ability</h4>
                <label className={`${labelClass} mt-4`}>If this idea fails, what will you do next?<textarea className={inputClass} rows={3} /></label>
                <label className={`${labelClass} mt-4`}>What's one problem you care deeply about?<textarea className={inputClass} rows={3} /></label>
              </div>

              <div className="rounded-2xl border border-border/50 bg-white/70 p-5 md:p-6">
                <h4 className="text-lg font-bold text-foreground">12. Final Filter</h4>
                <label className={`${labelClass} mt-4`}>Why should we select you?<textarea className={inputClass} rows={4} /></label>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg hover:opacity-95">
                  Submit Ideation Form
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default IdeaJumpInSection;