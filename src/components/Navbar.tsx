import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogIn, Search, ChevronDown } from "lucide-react";
import cmritLogo from "@/assets/cmrit-logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [mobileLoginOpen, setMobileLoginOpen] = useState(false);
  const navigate = useNavigate();
  const links = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Our Services", href: "#services" },
    { label: "Our Programs", href: "#programs" },
    { label: "MSME - HI", href: "#msme-hi" },
    { label: "Our Startups", href: "#startups", hasDropdown: true },
    { label: "Resources", href: "#resources" },
    { label: "Events", href: "#events", hasDropdown: true },
    { label: "Contact Us", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="hidden items-center justify-center gap-6 bg-yellow-300 px-4 py-3 text-center md:flex">
        <p className="text-sm font-medium text-black lg:text-base">
          Invitation to Participate in "Innovate to Elevate" - 4-Day Startup Boot Camp (22nd-30th April 2026)
        </p>
        <button className="shrink-0 rounded-md border border-black bg-yellow-300 px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-yellow-300">
          Register Now
        </button>
      </div>

      <div className="mx-auto flex h-[74px] w-full max-w-[1480px] items-center px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex shrink-0 items-center gap-3 pr-8">
          <img src={cmritLogo} alt="CMRIT Logo" className="h-9 w-9 object-contain" />
          <span className="whitespace-nowrap text-sm font-medium tracking-wide text-foreground sm:text-xl">CMRIT INCUBATION CENTER</span>
        </div>

        <div className="hidden min-w-0 flex-1 items-center lg:flex">
          <div className="flex w-full items-center justify-between gap-5 xl:gap-7">
            {links.map((item) => (
              <a key={item.label} href={item.href} className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[14px] font-semibold text-foreground transition-colors hover:text-primary xl:text-[15px]">
                {item.label}
                {item.hasDropdown ? <ChevronDown size={16} /> : null}
              </a>
            ))}

            <div className="relative shrink-0">
              <button
                onClick={() => setLoginMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 whitespace-nowrap text-[14px] font-semibold text-foreground transition-colors hover:text-primary xl:text-[15px]"
                aria-label="Login menu"
              >
                <LogIn size={16} />
                Login
                <ChevronDown size={16} className={`transition-transform ${loginMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {loginMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-md border border-border bg-card p-1 shadow-lg">
                  <button
                    onClick={() => {
                      setLoginMenuOpen(false);
                      navigate("/admin/login");
                    }}
                    className="w-full rounded px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    Admin Login
                  </button>
                  <button
                    onClick={() => {
                      setLoginMenuOpen(false);
                      navigate("/student/login");
                    }}
                    className="w-full rounded px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    Student Login
                  </button>
                </div>
              )}
            </div>

            <button aria-label="Search" className="shrink-0 text-foreground transition-colors hover:text-primary">
              <Search size={22} />
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            setOpen((prev) => !prev);
            setMobileLoginOpen(false);
          }}
          className="ml-auto p-2 text-foreground lg:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-card px-4 pb-4 lg:hidden">
          <div className="my-3 rounded-md border border-black/20 bg-yellow-300 p-3 text-xs font-medium text-black">
            Invitation to Participate in "Innovate to Elevate" - 4-Day Startup Boot Camp (22nd-30th April 2026)
          </div>

          {links.map((item) => (
            <a key={item.label} href={item.href} onClick={() => setOpen(false)} className="flex items-center justify-between py-3 text-sm font-medium text-foreground hover:text-primary">
              <span>{item.label}</span>
              {item.hasDropdown ? <ChevronDown size={16} /> : null}
            </a>
          ))}

          <button
            onClick={() => setMobileLoginOpen((prev) => !prev)}
            className="flex w-full items-center justify-between py-3 text-sm font-medium text-foreground hover:text-primary"
          >
            <span className="flex items-center gap-1.5">
              <LogIn size={16} /> Login
            </span>
            <ChevronDown size={16} className={`transition-transform ${mobileLoginOpen ? "rotate-180" : ""}`} />
          </button>

          {mobileLoginOpen && (
            <div className="pl-6">
              <button
                onClick={() => {
                  setOpen(false);
                  setMobileLoginOpen(false);
                  navigate("/admin/login");
                }}
                className="block w-full py-2 text-left text-sm font-medium text-foreground hover:text-primary"
              >
                Admin Login
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  setMobileLoginOpen(false);
                  navigate("/student/login");
                }}
                className="block w-full py-2 text-left text-sm font-medium text-foreground hover:text-primary"
              >
                Student Login
              </button>
            </div>
          )}

          <button className="flex w-full items-center gap-1.5 py-3 text-sm font-medium text-foreground hover:text-primary" aria-label="Search">
            <Search size={16} /> Search
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
