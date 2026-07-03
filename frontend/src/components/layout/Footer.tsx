import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 relative z-20 bg-[#140D09]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative overflow-hidden rounded-full border border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.2)] flex items-center justify-center w-10 h-10 hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all duration-300">
                <Image 
                  src="/logo.png" 
                  alt="TableFlow Logo" 
                  fill 
                  className="object-cover scale-110" 
                />
              </div>
              <h1 className="font-heading text-xl tracking-[0.2em] text-[#D4AF37] font-semibold drop-shadow-md">TABLEFLOW</h1>
            </div>
            <p className="text-foreground/50 text-xs font-light max-w-xs">
              Experience the art of culinary perfection. A premium reservation system for luxury dining.
            </p>
          </div>

          <div className="flex gap-16 md:gap-32">
            <div className="flex flex-col gap-6">
              <h4 className="text-[#D4AF37] text-sm uppercase tracking-wider font-bold">Company</h4>
              <Link href="#" className="text-[15px] text-[#8ea5b8] hover:text-white transition-colors">About Us</Link>
              <Link href="#" className="text-[15px] text-[#8ea5b8] hover:text-white transition-colors">Careers</Link>
              <Link href="#" className="text-[15px] text-[#8ea5b8] hover:text-white transition-colors">Contact</Link>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-[#D4AF37] text-sm uppercase tracking-wider font-bold">Legal</h4>
              <Link href="#" className="text-[15px] text-[#8ea5b8] hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-[15px] text-[#8ea5b8] hover:text-white transition-colors">Terms of Service</Link>
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
