const Footer = () => (
  <footer id="contact" className="bg-foreground text-background py-12">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-8">
      <div>
        <h4 className="font-bold text-lg">CMRIT Makerspace</h4>
        <p className="mt-2 text-sm opacity-70">Empowering students to innovate, build, and prototype solutions for real-world challenges.</p>
      </div>
      <div>
        <h4 className="font-bold text-sm uppercase tracking-wider mb-3">Quick Links</h4>
        {["About", "Services", "Events", "Contact"].map((l) => (
          <a key={l} href={`#${l.toLowerCase()}`} className="block text-sm opacity-70 hover:opacity-100 py-1 transition-opacity">{l}</a>
        ))}
      </div>
      <div>
        <h4 className="font-bold text-sm uppercase tracking-wider mb-3">Contact</h4>
        <p className="text-sm opacity-70">CMRIT Campus, Bangalore</p>
        <p className="text-sm opacity-70 mt-1">makerspace@cmrit.ac.in</p>
      </div>
    </div>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 pt-6 border-t border-background/20 text-center text-xs opacity-50">
      © 2026 CMRIT Makerspace. All rights reserved.
    </div>
  </footer>
);

export default Footer;
