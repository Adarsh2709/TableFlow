import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 relative z-20 bg-[#140D09]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 border border-primary/50 flex items-center justify-center transform rotate-45">
                <span className="font-heading font-bold text-sm text-primary transform -rotate-45">TF</span>
              </div>
              <h1 className="font-heading text-xl tracking-[0.2em] text-foreground font-semibold">TABLEFLOW</h1>
            </div>
            <p className="text-foreground/50 text-xs font-light max-w-xs">
              Experience the art of culinary perfection. A premium reservation system for luxury dining.
            </p>
          </div>

          <div className="flex gap-10">
            <div className="flex flex-col gap-4">
              <h4 className="text-primary text-[10px] uppercase tracking-widest font-semibold">Company</h4>
              <Link href="#" className="text-xs text-foreground/60 hover:text-primary transition-colors">About Us</Link>
              <Link href="#" className="text-xs text-foreground/60 hover:text-primary transition-colors">Careers</Link>
              <Link href="#" className="text-xs text-foreground/60 hover:text-primary transition-colors">Contact</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-primary text-[10px] uppercase tracking-widest font-semibold">Legal</h4>
              <Link href="#" className="text-xs text-foreground/60 hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-xs text-foreground/60 hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-foreground/40 text-[10px] tracking-widest uppercase">
            © {new Date().getFullYear()} TableFlow Luxury Dining. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Social Icons would go here */}
            <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-primary/50 transition-colors cursor-pointer text-foreground/50 hover:text-primary text-xs">IN</span>
            <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-primary/50 transition-colors cursor-pointer text-foreground/50 hover:text-primary text-xs">TW</span>
            <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-primary/50 transition-colors cursor-pointer text-foreground/50 hover:text-primary text-xs">IG</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
