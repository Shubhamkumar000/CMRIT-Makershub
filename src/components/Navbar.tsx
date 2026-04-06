import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogIn, Wrench } from "lucide-react";
import cmritLogo from "@/assets/cmrit-logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const links = ["Home", "About", "Services", "Events", "Contact"];

  const handleAdminNavigate = () => {
    const isAdminLoggedIn = localStorage.getItem("admin_logged_in") || sessionStorage.getItem("admin_logged_in");
    navigate(isAdminLoggedIn === "true" ? "/admin/dashboard" : "/admin/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <img src={cmritLogo} alt="CMRIT Logo" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <span className="font-bold text-lg tracking-tight text-foreground">CMRIT</span>
            <span className="block text-xs font-semibold text-primary tracking-widest -mt-1">MAKERSPACE</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {l}
            </a>
          ))}
          <button onClick={() => navigate("/student/login")} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <Wrench size={16} /> Report Issue
          </button>
          <button onClick={handleAdminNavigate} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <LogIn size={16} /> Admin
          </button>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-foreground">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-card border-t border-border px-4 pb-4">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)} className="block py-3 text-sm font-medium text-muted-foreground hover:text-primary">
              {l}
            </a>
          ))}
          <button onClick={() => { setOpen(false); navigate("/student/login"); }} className="flex items-center gap-1.5 py-3 text-sm font-medium text-muted-foreground hover:text-primary w-full">
            <Wrench size={16} /> Report Issue
          </button>
          <button onClick={() => { setOpen(false); handleAdminNavigate(); }} className="flex items-center gap-1.5 py-3 text-sm font-medium text-muted-foreground hover:text-primary w-full">
            <LogIn size={16} /> Admin
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
