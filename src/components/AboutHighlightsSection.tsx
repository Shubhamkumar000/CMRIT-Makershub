import inaugurationImage from "@/assets/slide-2.jpeg";

const stats = [
  { value: "56+", label: "STARTUPS INCUBATED" },
  { value: "2019", label: "ECOSYSTEM BEGAN" },
  { value: "DPIIT", label: "RECOGNIZED VENTURES" },
  { value: "MSME", label: "REGISTERED STARTUPS" },
];

const AboutHighlightsSection = () => {
  return (
    <section id="about" className="relative py-20">
      <div className="w-full px-3 sm:px-5 lg:px-8">
        <div className="w-full overflow-hidden rounded-2xl border border-border/40 bg-card/85 p-4 backdrop-blur-md md:p-8 lg:rounded-3xl lg:p-10">
          <div className="grid items-start gap-6 lg:grid-cols-[2.2fr_1fr]">
            <div className="space-y-4 bg-white/75 p-4 text-left text-foreground md:p-6 lg:p-8">
              <p className="text-base leading-relaxed md:text-[19px]">
                The CMRIT Incubation center was inaugurated on 21st January 2026 by <strong>Hon'ble Vice-President of India, Shri C. P Radhakrishnan</strong>, and <strong>Hon'ble Governor of Karnataka, Shri Thaawarchand Gehlot</strong>, in the distinguished presence of <strong>Dr. K. C. Ramamurthy, IPS (Retd.), Chairman, CMR Group of Institutions; Dr. Sabitha Ramamurthy, President, CMR Jnanadhara Trust and Chancellor, CMR University</strong>; along with other eminent dignitaries, trustees, and institutional leaders.
              </p>
              <p className="text-base leading-relaxed text-foreground/90 md:text-[19px]">
                The CMRIT Incubation Center at CMR Institute of Technology, Bengaluru, embodies the Institute's commitment to nurturing and guiding young start-up ventures during their formative years. Recognized as a Host Institute by the Ministry of Micro, Small and Medium Enterprises (MSME), Government of India, the center consistently promotes society-oriented innovative start-ups - contributing to the nation's goals of knowledge creation, wealth generation, skill development, and employment.
              </p>
              <p className="text-base leading-relaxed text-foreground/90 md:text-[19px]">
                We encourage entrepreneurship among students, faculty, alumni, and external innovators alike, offering a vibrant, collaborative, and resource-rich environment that supports ideation, prototyping, commercialization, and scaling of ventures.
              </p>
            </div>

            <div className="overflow-hidden border border-border/40 bg-white/40">
              <img src={inaugurationImage} alt="CMRIT Incubation Center inauguration" className="h-full min-h-[360px] w-full object-cover" />
            </div>
          </div>

          <div className="mt-8 overflow-hidden border border-amber-400 bg-white/70">
            <div className="grid divide-y divide-amber-400 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="px-5 py-6 text-center sm:px-6">
                  <p className="text-4xl font-bold tracking-wide text-slate-900 md:text-5xl">{item.value}</p>
                  <p className="mt-3 text-xs font-medium tracking-[0.45em] text-slate-700 md:text-sm">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-lg font-medium leading-relaxed text-foreground md:px-3 lg:text-3xl">
            Between 2019 and 2026, the CMRIT ecosystem has incubated 56 startups - many DPIIT-recognized, MSME-registered, and building across healthcare, agriculture, sustainability, robotics, and education.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHighlightsSection;