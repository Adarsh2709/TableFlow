'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FadeIn, SlideUp } from '@/components/ui/motion-wrapper';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Award, Loader2, UtensilsCrossed, ArrowRight, User as UserIcon } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export function CustomerDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [reservations, setReservations] = useState<any[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(true);

  const fetchReservations = async () => {
    setLoadingReservations(true);
    try {
      const res = await api.get('/reservations/my');
      setReservations(res.data.data.reservations || []);
    } catch (error) {
      toast.error('Failed to load your reservations.');
    } finally {
      setLoadingReservations(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (id: string) => {
    try {
      await api.patch(`/reservations/${id}/cancel`);
      toast.success('Reservation cancelled.');
      fetchReservations(); // Refresh list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel reservation.');
    }
  };

  if (loadingReservations) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/50" />
        </div>
        <Loader2 className="animate-spin text-primary w-12 h-12 relative z-10" />
      </div>
    );
  }

  const upcoming = reservations.filter(r => r.status === 'CONFIRMED' || r.status === 'PENDING');
  const past = reservations.filter(r => r.status === 'CANCELLED' || r.status === 'COMPLETED');

  return (
    <div className="min-h-screen relative bg-neutral-950">
      {/* 40vh Hero Section */}
      <div className="relative h-[40vh] w-full flex flex-col justify-end pb-16">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-6 max-w-6xl">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-primary uppercase tracking-widest text-xs mb-3 font-semibold drop-shadow-md">Member Lounge</p>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-lg">
                  Welcome back, <span className="text-primary italic">{user?.name?.split(' ')[0] || 'Guest'}</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium tracking-wide uppercase text-white/90">Standard Member</p>
                  <p className="text-xs text-white/60 tracking-widest">Since 2026</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-primary/20 backdrop-blur-md border border-primary/50 flex items-center justify-center shadow-[0_0_20px_rgba(198,156,109,0.3)]">
                  <UserIcon className="text-primary w-6 h-6" />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="container relative z-20 mx-auto px-6 max-w-6xl -mt-8 pb-20">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Upcoming Reservation */}
            <SlideUp delay={0.1}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl lg:text-3xl tracking-wide">Upcoming Experience</h2>
              </div>
              
              {upcoming.length > 0 ? (
                <div className="space-y-6">
                  {upcoming.map((res) => (
                    <GlassCard key={res._id} className="p-8 group relative overflow-hidden border-primary/30 shadow-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-1">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <span className="inline-block px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-xs text-primary uppercase tracking-widest">
                              {res.status}
                            </span>
                            <span className="text-xs text-foreground/50 uppercase tracking-widest font-mono">ID: {res._id.slice(-6)}</span>
                          </div>
                          <h3 className="font-heading text-3xl mb-4 text-foreground drop-shadow-sm">Table for {res.guests} Guests</h3>
                          <div className="flex flex-wrap gap-6 text-foreground/80 text-sm font-medium">
                            <span className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-white/5"><Calendar size={16} className="text-primary" /> {res.reservationDate}</span>
                            <span className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-white/5"><Clock size={16} className="text-primary" /> {res.timeSlot}</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="backdrop-blur-md border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 w-full sm:w-auto"
                          onClick={() => handleCancel(res._id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <GlassCard className="p-16 text-center flex flex-col items-center justify-center min-h-[35vh] border-dashed border-primary/30 bg-black/40 backdrop-blur-xl group hover:border-primary/50 transition-colors duration-500">
                  <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(198,156,109,0.15)] group-hover:scale-110 transition-transform duration-500">
                    <UtensilsCrossed className="text-primary/70 w-10 h-10" />
                  </div>
                  <h3 className="font-heading text-2xl mb-3 text-foreground">No upcoming reservations</h3>
                  <p className="text-foreground/60 mb-8 max-w-sm mx-auto leading-relaxed">
                    Your dining itinerary is currently empty. Secure your next unforgettable culinary experience today.
                  </p>
                  <Button onClick={() => router.push('/booking')} className="gold-gradient text-background px-8 py-6 text-lg group hover:shadow-[0_0_20px_rgba(198,156,109,0.4)] transition-all duration-300">
                    Reserve a Table <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </GlassCard>
              )}
            </SlideUp>

            {/* Past Experiences */}
            <SlideUp delay={0.2}>
              <div className="flex items-center justify-between mb-6 mt-16">
                <h2 className="font-heading text-2xl lg:text-3xl tracking-wide">Dining History</h2>
              </div>
              
              <div className="space-y-4">
                {past.length > 0 ? past.map((res) => (
                  <GlassCard key={res._id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between group cursor-pointer hover:border-primary/30 transition-all duration-300 bg-black/60">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-full bg-black/40 flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-colors">
                        <UtensilsCrossed className="text-foreground/50 w-6 h-6 group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-heading text-xl mb-1 group-hover:text-primary transition-colors">Past Booking</h4>
                        <p className="text-sm text-foreground/60 font-medium">{res.reservationDate} <span className="mx-2 opacity-30">|</span> {res.guests} Guests</p>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 text-right w-full sm:w-auto flex justify-between sm:block items-center">
                      <p className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${res.status === 'CANCELLED' ? 'text-destructive border-destructive/30 bg-destructive/10' : 'text-primary border-primary/30 bg-primary/10'}`}>
                        {res.status}
                      </p>
                    </div>
                  </GlassCard>
                )) : (
                  <GlassCard className="p-10 text-center border-dashed border-white/10 bg-black/40">
                    <p className="text-foreground/50 text-sm tracking-wide">Your past dining history will gracefully appear here.</p>
                  </GlassCard>
                )}
              </div>
            </SlideUp>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Membership Card */}
            <SlideUp delay={0.3}>
              <h2 className="font-heading text-2xl mb-6 tracking-wide">Membership</h2>
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 flex flex-col justify-between group cursor-pointer hover:-translate-y-2 transition-transform duration-500 border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-900 z-0" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-10 mix-blend-overlay z-0" />
                
                {/* Gold accent shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0 translate-x-[-100%] group-hover:translate-x-[100%] pointer-events-none" />
                
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <span className="font-heading tracking-widest text-2xl text-primary drop-shadow-md">TABLEFLOW</span>
                    <p className="text-[10px] text-foreground/40 tracking-[0.3em] uppercase mt-1">Exclusive</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                    <Award className="text-primary w-5 h-5" />
                  </div>
                </div>
                
                <div className="relative z-10 mt-auto">
                  <p className="text-xs uppercase tracking-widest text-foreground/60 mb-2">Cardholder</p>
                  <p className="font-heading text-xl tracking-widest text-white drop-shadow-md">{user?.name}</p>
                  <div className="flex justify-between items-end mt-6">
                    <p className="text-sm tracking-[0.2em] font-mono text-foreground/70">•••• •••• 8294</p>
                    <p className="text-primary text-sm font-semibold italic tracking-wide">Standard</p>
                  </div>
                </div>
              </div>
            </SlideUp>

            {/* Profile Summary */}
            <SlideUp delay={0.4}>
              <GlassCard className="p-8 bg-black/60 border-white/5">
                <h3 className="font-heading text-xl mb-6 tracking-wide">Profile Details</h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-foreground/50 mb-1">Email</p>
                    <p className="text-sm text-foreground/90 font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-foreground/50 mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <p className="text-sm text-foreground/90 font-medium">Active Member</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <Button variant="outline" className="w-full justify-start border-primary/30 text-primary hover:bg-primary hover:text-background transition-colors duration-300" onClick={() => router.push('/booking')}>
                      Make a New Reservation
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </SlideUp>

          </div>
        </div>
      </div>
    </div>
  );
}
