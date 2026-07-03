'use client';

import { motion } from 'framer-motion';
import { FadeIn } from '@/components/ui/motion-wrapper';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  category?: string;
  bgImage: string;
  children?: React.ReactNode;
}

export function PageHero({ title, subtitle, category, bgImage, children }: PageHeroProps) {
  return (
    <div className="relative h-[45vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax & Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
        {/* Luxury Overlays: Darker at bottom to blend into Espresso background */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#140D09] via-[#140D09]/50 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 mt-16">
        <FadeIn>
          {category && (
            <p className="text-primary uppercase tracking-[0.3em] text-[10px] mb-4 font-semibold drop-shadow-md">
              {category}
            </p>
          )}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-xl mb-4 tracking-wide">
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/70 font-light max-w-lg mx-auto text-sm md:text-base">
              {subtitle}
            </p>
          )}
          {children && (
            <div className="mt-8">
              {children}
            </div>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
