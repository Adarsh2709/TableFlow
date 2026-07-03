'use client';

import { Playfair_Display } from 'next/font/google';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn, SlideUp } from '@/components/ui/motion-wrapper';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Star, Clock, ArrowRight, UtensilsCrossed, BookOpenText, Hourglass, Wine } from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";
import { useRef } from "react";
import { useLenis } from 'lenis/react';

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const lenis = useLenis();

  const handleScrollToNext = () => {
    lenis?.scrollTo('#experience', {
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
  };

  // Parallax Values for Hero
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.6, 0.9]);

  return (
    <main className="flex min-h-screen flex-col bg-transparent selection:bg-primary/30" ref={containerRef}>
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: heroY, scale: heroScale }}
        >
          <Image 
            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop"
            alt="Luxury Restaurant Interior"
            fill
            priority
            className="object-cover"
          />
        </motion.div>
        
        <motion.div 
          className="absolute inset-0 z-10 bg-black" 
          style={{ opacity: overlayOpacity }} 
        />
        
        <motion.div 
          className="container relative z-20 mx-auto px-6 text-center flex flex-col items-center justify-center h-full pt-20"
          style={{ opacity: heroOpacity }}
        >
          <SlideUp duration={1}>
            <p className="font-heading italic text-2xl md:text-3xl text-primary/90 mb-4 tracking-wide drop-shadow-md">
              Welcome to our restaurant
            </p>
          </SlideUp>

          <SlideUp delay={0.2}>
            <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl text-white tracking-widest uppercase mb-6 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] font-bold">
              TABLEFLOW
            </h1>
          </SlideUp>

          <FadeIn delay={0.4}>
            <div className="flex items-center justify-center gap-4 mb-8 opacity-90">
              <span className="h-[1px] w-24 bg-gradient-to-r from-transparent to-primary"></span>
              <svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M20 0C20 0 25 10 35 10C25 10 20 20 20 20C20 20 15 10 5 10C15 10 20 0 20 0Z" fill="currentColor"/>
              </svg>
              <span className="h-[1px] w-24 bg-gradient-to-l from-transparent to-primary"></span>
            </div>
          </FadeIn>

          <FadeIn delay={0.6}>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-12 font-light italic leading-relaxed drop-shadow-md">
              Immerse yourself in a world where flavor meets atmosphere. Book your table for an unforgettable evening of culinary perfection.
            </p>
          </FadeIn>

          <SlideUp delay={0.8} className="flex flex-col sm:flex-row gap-6 mt-4">
             <button onClick={handleScrollToNext} className="outline-none">
               <div className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer group animate-bounce shadow-xl">
                 <ArrowRight className="w-6 h-6 text-white transform rotate-90 group-hover:translate-y-1 transition-transform" />
               </div>
             </button>
          </SlideUp>
        </motion.div>
      </section>

      {/* Featured Experience */}
      <section id="experience" className="py-32 relative z-20 bg-gradient-to-b from-[#1a1410] to-[#110e0c]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <SlideUp>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop"
                  alt="Plated Dish"
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-[2s] ease-out"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
              </div>
            </SlideUp>

            <div className="flex flex-col">
              <FadeIn>
                <h2 className="text-primary text-sm uppercase tracking-[0.2em] mb-4">Our Signature</h2>
              </FadeIn>
              <SlideUp delay={0.2}>
                <h3 className="font-heading text-4xl md:text-5xl mb-8 leading-snug">
                  A Symphony of Tastes, Crafted with Passion.
                </h3>
              </SlideUp>
              <FadeIn delay={0.3}>
                <p className="text-foreground/70 mb-10 text-lg leading-relaxed font-light">
                  Our executive chef curates seasonal menus that push the boundaries of modern gastronomy, while paying homage to classic techniques. Every ingredient is sourced with absolute care.
                </p>
              </FadeIn>

              <div className="grid grid-cols-2 gap-8">
                <SlideUp delay={0.4}>
                  <div className="flex flex-col gap-3">
                    <Star className="text-primary w-8 h-8" />
                    <h4 className="font-heading text-xl">Michelin Quality</h4>
                    <p className="text-sm text-foreground/60">Award-winning dining experience recognized globally.</p>
                  </div>
                </SlideUp>
                <SlideUp delay={0.5}>
                  <div className="flex flex-col gap-3">
                    <Clock className="text-primary w-8 h-8" />
                    <h4 className="font-heading text-xl">Atmospheric</h4>
                    <p className="text-sm text-foreground/60">Warm, elegant, and perfectly lit for your evening.</p>
                  </div>
                </SlideUp>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Journey (Custom Cards matching user design) */}
      <section className="py-32 relative bg-[#0a0705] overflow-hidden">
        {/* Background Layout matching the image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20"></div>
          
          {/* Copper texture curve on the right */}
          <div className="absolute -right-[15%] top-[10%] w-[50%] h-[120%] rounded-[100%] bg-gradient-to-br from-[#4a2e1b] to-[#26150a] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] border-l border-white/5">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay rounded-[100%]"></div>
             <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0a0705]/50 to-[#0a0705] rounded-[100%]"></div>
          </div>
        </div>
        
        <div className="container relative z-10 mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <FadeIn>
              <h2 className="font-heading text-4xl md:text-5xl mb-4 text-white">Your Evening Awaits</h2>
              <p className="text-primary text-lg">Seamlessly manage your dining experience through our premium reservation platform.</p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SlideUp delay={0.1}>
              <div className="h-full flex flex-col items-center text-center p-12 rounded-[2rem] bg-[#1a1410] border border-primary/40 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative mb-8">
                  <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 text-primary text-xs opacity-80">✦</div>
                  <div className="absolute bottom-0 left-0 translate-y-2 -translate-x-4 text-primary text-[10px] opacity-60">✦</div>
                  <BookOpenText strokeWidth={1} className="w-16 h-16 text-primary" />
                </div>
                <h4 className="font-heading text-[28px] mb-4 text-white leading-tight">Select Your<br/>Experience</h4>
                <p className="text-white/70 font-light text-[15px] leading-relaxed">Choose from the main<br/>dining room, chef's table,<br/>or our private wine cellar.</p>
              </div>
            </SlideUp>
            
            <SlideUp delay={0.2}>
              <div className="h-full flex flex-col items-center text-center p-12 rounded-[2rem] bg-[#1a1410] border border-primary/40 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Hourglass strokeWidth={1} className="w-16 h-16 text-primary mb-8" />
                <h4 className="font-heading text-[28px] mb-4 text-white leading-tight">Choose Your<br/>Time</h4>
                <p className="text-white/70 font-light text-[15px] leading-relaxed">Real-time availability with<br/>our elegant, frictionless<br/>booking interface.</p>
              </div>
            </SlideUp>
            
            <SlideUp delay={0.3}>
              <div className="h-full flex flex-col items-center text-center p-12 rounded-[2rem] bg-[#1a1410] border border-primary/40 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative mb-8">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 text-primary text-sm opacity-90">✦</div>
                  <Wine strokeWidth={1} className="w-16 h-16 text-primary" />
                </div>
                <h4 className="font-heading text-[28px] mb-4 text-white leading-tight">Enjoy the<br/>Moment</h4>
                <p className="text-white/70 font-light text-[15px] leading-relaxed">Arrive to a personalized<br/>greeting and let our staff<br/>handle the rest.</p>
              </div>
            </SlideUp>
          </div>
        </div>
      </section>
    </main>
  );
}
