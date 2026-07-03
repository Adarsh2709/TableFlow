'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navbar() {
  const { isAuthenticated, logout, checkAuth } = useAuthStore();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        isScrolled || !isHome
          ? 'bg-[#0f0a07]/90 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] py-4'
          : 'bg-transparent border-b border-transparent py-8'
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className={`border border-[#D4AF37]/50 flex items-center justify-center transition-all duration-700 ${isScrolled ? 'w-8 h-8' : 'w-10 h-10'} group-hover:rotate-45`}>
            <span className={`font-heading font-bold text-[#D4AF37] transition-all duration-700 ${isScrolled ? 'text-sm' : 'text-lg'} group-hover:-rotate-45`}>TF</span>
          </div>
          <span className={`font-heading tracking-[0.2em] text-foreground hidden sm:block transition-all duration-700 ${isScrolled ? 'text-lg' : 'text-xl'}`}>TABLEFLOW</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-10">
          {[
            { label: 'Our Menu', href: '/#menu' },
            { label: 'Experiences', href: '/#experience' },
            { label: 'Private Events', href: '#' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative text-[11px] font-medium tracking-[0.25em] text-foreground/80 uppercase group overflow-hidden"
            >
              <span className="relative z-10 group-hover:text-primary transition-colors duration-300">{item.label}</span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <Link href="/booking">
            <Button 
              variant="outline" 
              className={`hidden sm:flex transition-all duration-700 text-xs tracking-widest uppercase rounded-none px-6 ${
                isScrolled 
                  ? 'border-[#D4AF37]/80 text-[#D4AF37] bg-[#D4AF37]/10 h-10 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                  : 'border-[#D4AF37]/40 text-white/90 bg-transparent h-12 hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]'
              }`}
            >
              Book Table
            </Button>
          </Link>

          <div className="h-6 w-[1px] bg-white/10 mx-2 hidden sm:block" />

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-foreground/70 hover:text-primary transition-colors">
                <div className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center bg-black/40 shadow-[0_0_15px_rgba(212,175,55,0.1)] group">
                  <User className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                </div>
              </Link>
              <button onClick={() => logout()} className="text-foreground/50 hover:text-destructive transition-colors hidden sm:block">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/auth/login">
              <span className="text-[11px] font-medium tracking-[0.2em] text-foreground/70 uppercase hover:text-primary transition-colors">
                Sign In
              </span>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
