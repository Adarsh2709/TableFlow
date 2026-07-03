'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
    setMobileMenuOpen(false);
  };

  let navLinks: { name: string, href: string }[] = [];

  if (!isAuthenticated) {
    navLinks = [
      { name: 'Home', href: '/' },
      { name: 'About', href: '/#about' },
      { name: 'Contact', href: '/#contact' },
      { name: 'Book Table', href: '/booking' },
      { name: 'Login', href: '/auth/login' },
      { name: 'Register', href: '/auth/register' }
    ];
  } else if (user?.role === 'customer') {
    navLinks = [
      { name: 'Home', href: '/' },
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Book Table', href: '/booking' },
      { name: 'My Reservations', href: '/dashboard#reservations' },
      { name: 'Profile', href: '/dashboard#profile' }
    ];
  } else if (user?.role === 'admin') {
    navLinks = [
      { name: 'Home', href: '/' },
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Reservations', href: '/dashboard#reservations' },
      { name: 'Tables', href: '/dashboard#tables' },
      { name: 'Analytics', href: '/dashboard#analytics' },
      { name: 'Profile', href: '/dashboard#profile' }
    ];
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
        isScrolled ? 'bg-background/70 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative z-50">
          <h1 className="font-heading text-2xl tracking-widest text-foreground font-semibold">
            TABLEFLOW
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'text-xs lg:text-sm tracking-wide uppercase transition-colors hover:text-primary relative group',
                  isActive ? 'text-primary' : 'text-foreground/80'
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute -bottom-1.5 left-0 w-full h-[1px] bg-primary scale-x-0 transition-transform duration-300 origin-left",
                  isActive ? "scale-x-100" : "group-hover:scale-x-100"
                )} />
              </Link>
            );
          })}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="text-xs lg:text-sm tracking-wide uppercase transition-colors text-foreground/80 hover:text-primary relative group"
            >
              Logout
              <span className="absolute -bottom-1.5 left-0 w-full h-[1px] bg-primary scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
            </button>
          )}
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden relative z-50 p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={mobileMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: '-100%', pointerEvents: 'none' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed inset-0 bg-background/95 backdrop-blur-3xl z-40 flex flex-col items-center justify-center gap-8 md:hidden overflow-y-auto pt-20 pb-10"
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => setMobileMenuOpen(false)}
            className="font-heading text-3xl hover:text-primary transition-colors"
          >
            {link.name}
          </Link>
        ))}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="font-heading text-3xl hover:text-primary transition-colors mt-4"
          >
            Logout
          </button>
        )}
      </motion.div>
    </motion.header>
  );
}
