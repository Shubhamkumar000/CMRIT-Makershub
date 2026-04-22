import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import campusBg from "@/assets/campus-bg.jpg";

const facultyStartups = [
  {
    slNo: 1,
    startupName: "Space Tech Orbital Pvt Ltd",
    directors: ["Mr. Ashutosh Srivatsav", "DIN - 09091911"],
    nature: "Pvt Ltd",
    registration: ["U72100KA2021PTC144909", "PAN - ABFCS6561F", "TAN - BLRS81203D"],
    address: "No 432, Second Floor, 4th Cross, 2nd Block, HRBR Layout, Kalyan Nagar, Bangalore, Karnataka, India, 560043",
  },
  {
    slNo: 2,
    startupName: "Tech Force",
    directors: ["Mr. P. Velraj Kumar"],
    nature: "Partnership, Micro Industry",
    registration: ["UDYAM-KR-03-0152088 dated 22/3/2022"],
    address: "CMRIT, ITPL Road, Kundalahalli, Bangalore, Karnataka, India, 560037",
  },
  {
    slNo: 3,
    startupName: "Agriharaa",
    directors: ["Mrs. Preeti Jacob"],
    nature: "Proprietorship",
    registration: ["PAN: ABWFA8672P"],
    address: "#10, Cheeran Villa, 4th Cross, Ramajanappa Layout, B Narayanapura, Bangalore - 560016",
  },
  {
    slNo: 4,
    startupName: "REVOL2ROBO",
    directors: ["Mr. Sumit Kumar", "Dr. Viji", "Mrs. Anju Das"],
    nature: "Micro",
    registration: ["UDYAM-KR-03-0160297"],
    address: "CMRIT, ITPL Road, Kundalahalli, Bangalore, Karnataka, India, 560037",
  },
  {
    slNo: 5,
    startupName: "Rayanam Learning Solutions",
    directors: ["Mrs. Gomathi T"],
    nature: "Micro",
    registration: ["UDYAM-KR-03-0160487"],
    address: "CMRIT, ITPL Road, Kundalahalli, Bangalore, Karnataka, India, 560037",
  },
  {
    slNo: 6,
    startupName: "ARTRIUM",
    directors: ["Ms. Ashwini Patil"],
    nature: "Micro",
    registration: ["UDYAM-KR-03-0160493"],
    address: "CMRIT, ITPL Road, Kundalahalli, Bangalore, Karnataka, India, 560037",
  },
  {
    slNo: 7,
    startupName: "AI Tech Solutions",
    directors: ["Prof. Savitha N J", "Prof. Smitha N", "Dr. Sanchari Saha"],
    nature: "Micro",
    registration: ["UDYAM-KR-03-0162589"],
    address: "CMRIT, ITPL Road, Kundalahalli, Bangalore, Karnataka, India, 560037",
  },
  {
    slNo: 8,
    startupName: "ROOTERY",
    directors: ["Dr. Sharmila K P"],
    nature: "Micro",
    registration: ["UDYAM-KR-03-0168034"],
    address: "CMRIT, ITPL Road, Kundalahalli, Bangalore, Karnataka, India, 560037",
  },
  {
    slNo: 9,
    startupName: "Kousalya Prayogha",
    directors: ["Dr. Fazlur Rahaman"],
    nature: "Micro",
    registration: ["UDYAM-KR-03-0162855"],
    address: "CMRIT, ITPL Road, Kundalahalli, Bangalore, Karnataka, India, 560037",
  },
  {
    slNo: 10,
    startupName: "SunShrub",
    directors: ["Prof. Chitra", "Prof. Kashif"],
    nature: "Micro",
    registration: ["UDYAM-KR-03-0274201"],
    address: "CMRIT, ITPL Road, Kundalahalli, Bangalore, Karnataka, India, 560037",
  },
];

const FacultyStartups = () => {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <img src={campusBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/75 backdrop-blur-[2px]" />
      </div>

      <Navbar />

      <main className="px-4 pb-20 pt-20 sm:px-6 md:pt-28 lg:px-10">
        <div className="mx-auto max-w-[1450px] rounded-3xl border border-border/50 bg-card/85 p-6 shadow-2xl backdrop-blur-sm md:p-8">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Faculty Startups</h1>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Faculty startup registration and partner details.
          </p>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-border/60 bg-white/95">
            <table className="w-full min-w-[1100px] border-collapse text-left text-sm text-foreground">
              <thead className="bg-[#b7d07a] text-foreground">
                <tr>
                  <th className="border border-border/70 px-3 py-3 font-bold">Sl. No.</th>
                  <th className="border border-border/70 px-3 py-3 font-bold">Name of the Startup</th>
                  <th className="border border-border/70 px-3 py-3 font-bold">Name of the Directors / partners</th>
                  <th className="border border-border/70 px-3 py-3 font-bold">Nature of the company</th>
                  <th className="border border-border/70 px-3 py-3 font-bold">Registration Details</th>
                  <th className="border border-border/70 px-3 py-3 font-bold">Address of the company / Incubation Center</th>
                </tr>
              </thead>
              <tbody>
                {facultyStartups.map((startup) => (
                  <tr key={startup.slNo}>
                    <td className="border border-border/70 px-3 py-3 align-top">{startup.slNo}</td>
                    <td className="border border-border/70 px-3 py-3 align-top font-medium">{startup.startupName}</td>
                    <td className="border border-border/70 px-3 py-3 align-top">
                      {startup.directors.map((director) => (
                        <div key={director}>{director}</div>
                      ))}
                    </td>
                    <td className="border border-border/70 px-3 py-3 align-top">{startup.nature}</td>
                    <td className="border border-border/70 px-3 py-3 align-top">
                      {startup.registration.map((line) => (
                        <div key={line}>{line}</div>
                      ))}
                    </td>
                    <td className="border border-border/70 px-3 py-3 align-top">{startup.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FacultyStartups;