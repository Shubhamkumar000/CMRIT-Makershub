import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import campusBg from "@/assets/campus-bg.jpg";

const startups = [
  {
    slNo: 1,
    startupName: "Pure Athera",
    directors: ["Ms. Shalini KV", "Mr. S K Ravi Kiran Kumar", "Mr. Jasti Ramakanth"],
    nature: "Partnership",
    registration: ["JNR-F18-2019-20 dated 5/4/2019"],
    address: "#10 F No 30d, 4th Cross, Bharat Residency, Koramangala 6th Block, Bangalore 560095",
  },
  {
    slNo: 2,
    startupName: "Nun Selene",
    directors: ["Ms. Swetha Shree", "Ms. Vidya Shree", "Ms. Sri Lakshmi"],
    nature: "Partnership",
    registration: ["SJN-F22-2019-20 dated 4/4/2019"],
    address: "#34, Kaveri street, Opposite to Jubilee school, Vijinapura, Bangalore 560016",
  },
  {
    slNo: 3,
    startupName: "Love Rhea",
    directors: [
      "Mr. Pradeep Talashery",
      "Mr. Mohsin Ali Khan",
      "Mr. Goutham Reddy",
      "Mr. Sarath Kumar",
      "Mr. Chandrappa",
      "Mr. Ramesha",
      "Mr. Anand Raja",
      "Mr. Manohar S",
      "Mr. Raju J",
    ],
    nature: "Partnership",
    registration: ["DIPP45261 dated 12/9/2019", "SJN-F19-2019-20 dated 4/4/2019"],
    address: "#937, 3rd cross, D block, AECS layout Marathahalli, Bangalore 560037",
  },
  {
    slNo: 4,
    startupName: "An Astrea Innovative Solutions",
    directors: ["Mr. Pranav Bhat", "Mr. Sarath Kumar D", "Mr. Manohar S", "Mr. Srinivas S M", "Ms. Anindita Ghosh"],
    nature: "Partnership",
    registration: ["SJN-F1015-2019-20 dated 24/12/2019"],
    address: "#937, 3rd cross, D block, AECS layout Marathahalli, Bangalore 560037",
  },
  {
    slNo: 5,
    startupName: "An Hestia",
    directors: ["Ms. Swathi N", "Mr. Nitheshkmar Reddy", "Mr. Koushik N"],
    nature: "Partnership",
    registration: ["SJN-F20-2019-20 dated 4/4/2019"],
    address: "#2479/3, Sapthagiri layout, Munekollalu, Marathahalli, Bangalore 560037",
  },
  {
    slNo: 6,
    startupName: "Arms Minerva",
    directors: ["Ms. Amrutha C K", "Mr. Rahul Sanjay Mahendrakar"],
    nature: "Partnership",
    registration: ["SJN-F8-2021-22 dated 1/4/2021"],
    address: "#40, 1st cross, Ayyappa Nagar, Priyadharshini layout, Bangalore 560036",
  },
  {
    slNo: 7,
    startupName: "Carlo Stea",
    directors: ["Mr. Navneeth Kumar", "Mr. Prince Vergiiese"],
    nature: "Partnership",
    registration: ["JNR-F979-2020-21 dated 31/3/2021"],
    address: "#6/4, 3rd cross, 8th main, Chikka Adugudi, Bangalore 560029",
  },
  {
    slNo: 8,
    startupName: "CO3 Structural Systems",
    directors: ["Mr. Gowtham Reddy", "Mr. Mohsin Ali Khan"],
    nature: "Partnership",
    registration: ["SJN-F99-2017-18 dated 24/4/2017"],
    address: "#65/1, 2nd cross, Hutchins road, St. Thomas Town, Bangalore 560018",
  },
  {
    slNo: 9,
    startupName: "DS9 Elements and Structure",
    directors: ["Mr. Sharvan Kumar", "Mr. Dharshan Reddy", "Mr. Srinivas N Eddara"],
    nature: "Partnership",
    registration: ["JNR-F417-2020-21 dated 12/10/2020"],
    address: "#1924, 22nd main, 24th cross, 2nd sector, HSR layout, Bangalore 560102",
  },
  {
    slNo: 10,
    startupName: "Cute Apate",
    directors: ["Mr. Chandrappa M", "Ms. Preeti", "Mr. Sanjay B Khayshap"],
    nature: "Partnership",
    registration: ["SJN-F26-2019-20 dated 4/4/2019"],
    address: "#937, 3rd cross, D block, AECS layout, Bangalore 560037",
  },
];

const StudentStartups = () => {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <img src={campusBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/75 backdrop-blur-[2px]" />
      </div>

      <Navbar />

      <main className="px-4 pb-20 pt-20 sm:px-6 md:pt-28 lg:px-10">
        <div className="mx-auto max-w-[1450px] rounded-3xl border border-border/50 bg-card/85 p-6 shadow-2xl backdrop-blur-sm md:p-8">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Student Startups</h1>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Startup registration and partner details.
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
                {startups.map((startup) => (
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

export default StudentStartups;