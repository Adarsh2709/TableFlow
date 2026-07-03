'use client';

import Image from "next/image";
import Link from "next/link";
import { FadeIn, SlideUp, StaggerText } from "@/components/ui/motion-wrapper";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ArrowRight, Star, Clock, UtensilsCrossed, MapPin } from "lucide-react";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main ref={containerRef} className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury Restaurant Interior"
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background z-10" />
        </motion.div>

        <div className="container relative z-20 mx-auto px-6 lg:px-12 pt-32 text-center flex flex-col items-center">
          <SlideUp duration={1}>
            <div className="flex items-center gap-4 mb-6">
              <span className="h-[1px] w-12 bg-primary"></span>
              <span className="text-primary uppercase tracking-[0.3em] text-sm font-medium">Fine Dining Reimagined</span>
              <span className="h-[1px] w-12 bg-primary"></span>
            </div>
          </SlideUp>

          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl max-w-4xl leading-tight mb-8">
            <StaggerText text="Experience the Art of Culinary Perfection" delay={0.2} />
          </h1>

          <FadeIn delay={0.6}>
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-12 font-light">
              Immerse yourself in a world where flavor meets atmosphere. Book your table for an unforgettable evening.
            </p>
          </FadeIn>

          <SlideUp delay={0.8} className="flex flex-col sm:flex-row gap-6">
            <Link href="/booking">
              <Button size="lg" className="gold-gradient text-background hover:scale-105 transition-transform duration-300">
                Reserve a Table <ArrowRight className="ml-2 w-5 h-5 text-background" />
              </Button>
            </Link>
            <Link href="#menu">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5">
                Explore Menu
              </Button>
            </Link>
          </SlideUp>
        </div>
      </section>

      {/* Featured Experience */}
      <section className="py-32 relative z-20">
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

      {/* Reservation Journey (Glass Cards) */}
      <section className="py-32 relative bg-neutral-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-fixed bg-center opacity-10" />
        <div className="absolute inset-0 bg-background/90" />
        
        <div className="container relative z-10 mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <FadeIn>
              <h2 className="font-heading text-4xl md:text-5xl mb-6">Your Evening Awaits</h2>
              <p className="text-foreground/70 text-lg font-light">Seamlessly manage your dining experience through our premium reservation platform.</p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SlideUp delay={0.1}>
              <GlassCard glow className="h-full flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <UtensilsCrossed className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-heading text-2xl mb-4">Select Your Experience</h4>
                <p className="text-foreground/60 font-light text-sm">Choose from the main dining room, chef's table, or our private wine cellar.</p>
              </GlassCard>
            </SlideUp>
            
            <SlideUp delay={0.2}>
              <GlassCard glow className="h-full flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-heading text-2xl mb-4">Choose Your Time</h4>
                <p className="text-foreground/60 font-light text-sm">Real-time availability with our elegant, frictionless booking interface.</p>
              </GlassCard>
            </SlideUp>
            
            <SlideUp delay={0.3}>
              <GlassCard glow className="h-full flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Star className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-heading text-2xl mb-4">Enjoy the Moment</h4>
                <p className="text-foreground/60 font-light text-sm">Arrive to a personalized greeting and let our staff handle the rest.</p>
              </GlassCard>
            </SlideUp>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-12 relative z-20 bg-background">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="font-heading text-xl tracking-widest text-foreground font-semibold">TABLEFLOW</h1>
            <p className="text-foreground/50 text-sm mt-2">© 2026 TableFlow Luxury Dining. All rights reserved.</p>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
