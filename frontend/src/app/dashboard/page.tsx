'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FadeIn, SlideUp } from '@/components/ui/motion-wrapper';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Award, ChevronRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore();
  const [reservations, setReservations] = useState<any[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReservations();
    } else if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchReservations = async () => {
    try {
      const res = await api.get('/reservations/my');
      setReservations(res.data.data.reservations || []);
    } catch (error) {
      toast.error('Failed to load your reservations.');
    } finally {
      setLoadingReservations(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await api.patch(`/reservations/${id}/cancel`);
      toast.success('Reservation cancelled.');
      fetchReservations(); // Refresh list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel reservation.');
    }
  };

  if (authLoading || loadingReservations) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  }

  const upcoming = reservations.filter(r => r.status === 'CONFIRMED');
  const past = reservations.filter(r => r.status !== 'CONFIRMED');

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 relative">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Welcome Header */}
        <FadeIn className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
            <div>
              <p className="text-primary uppercase tracking-widest text-xs mb-2">Member Lounge</p>
              <h1 className="font-heading text-4xl md:text-5xl">Welcome back, {user?.name.split(' ')[0]}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">Gold Tier</p>
                <p className="text-xs text-foreground/50">2,450 points</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                <span className="font-heading text-xl text-primary">{user?.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Upcoming Reservation */}
            <SlideUp delay={0.1}>
              <h2 className="font-heading text-2xl mb-6">Upcoming Experience</h2>
              {upcoming.length > 0 ? (
                <div className="space-y-6">
                  {upcoming.map((res) => (
                    <div key={res._id} className="relative rounded-2xl overflow-hidden group">
                      <div className="absolute inset-0 z-0">
                        <Image 
                          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop" 
                          alt="Restaurant Interior"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                      </div>
                      
                      <div className="relative z-10 p-8 pt-40">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                          <div>
                            <span className="inline-block px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-xs text-primary uppercase tracking-widest mb-4">Confirmed</span>
                            <h3 className="font-heading text-3xl mb-2">Table for {res.guests}</h3>
                            <div className="flex gap-6 text-foreground/80 text-sm">
                              <span className="flex items-center gap-2"><Calendar size={16} /> {res.reservationDate}</span>
                              <span className="flex items-center gap-2"><Clock size={16} /> {res.timeSlot}</span>
                            </div>
                          </div>
                          <Button 
                            variant="destructive" 
                            className="backdrop-blur-md"
                            onClick={() => handleCancel(res._id)}
                          >
                            Cancel Reservation
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <GlassCard className="p-10 text-center flex flex-col items-center justify-center">
                  <p className="text-foreground/50 mb-6">You have no upcoming reservations.</p>
                  <Button variant="outline" onClick={() => router.push('/booking')} className="border-primary text-primary hover:bg-primary/10">
                    Book a Table
                  </Button>
                </GlassCard>
              )}
            </SlideUp>

            {/* Past Experiences */}
            <SlideUp delay={0.2}>
              <h2 className="font-heading text-2xl mb-6 mt-12">Dining History</h2>
              <div className="space-y-4">
                {past.length > 0 ? past.map((res, i) => (
                  <GlassCard key={res._id} className="p-6 flex items-center justify-between group cursor-pointer hover:border-white/20">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-lg bg-black/40 overflow-hidden relative border border-white/5">
                        <Image 
                          src={`https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop&sig=${i}`}
                          alt="Dish"
                          fill
                          className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                      <div>
                        <h4 className="font-heading text-lg">{res.status === 'CANCELLED' ? 'Cancelled Booking' : 'Tasting Menu'}</h4>
                        <p className="text-xs text-foreground/50">{res.reservationDate} • {res.guests} Guests</p>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className={`text-sm font-medium ${res.status === 'CANCELLED' ? 'text-destructive' : 'text-primary'}`}>
                        {res.status}
                      </p>
                    </div>
                  </GlassCard>
                )) : (
                  <p className="text-foreground/50 text-sm">No past dining history found.</p>
                )}
              </div>
            </SlideUp>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Membership Card */}
            <SlideUp delay={0.3}>
              <h2 className="font-heading text-2xl mb-6">Membership</h2>
              <div className="relative h-56 rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col justify-between group">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black z-0" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-20 mix-blend-overlay z-0" />
                {/* Gold accent shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0 translate-x-[-100%] group-hover:translate-x-[100%] pointer-events-none" />
                
                <div className="relative z-10 flex justify-between items-start">
                  <span className="font-heading tracking-widest text-xl text-primary drop-shadow-md">TABLEFLOW</span>
                  <Award className="text-primary w-6 h-6" />
                </div>
                
                <div className="relative z-10">
                  <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-1">Cardholder</p>
                  <p className="font-heading text-lg tracking-wider">{user?.name}</p>
                  <div className="flex justify-between items-end mt-4">
                    <p className="text-xs tracking-[0.2em] font-mono text-foreground/70">•••• •••• •••• 8294</p>
                    <p className="text-primary text-sm font-medium italic">Gold Member</p>
                  </div>
                </div>
              </div>
            </SlideUp>

            {/* Quick Actions */}
            <SlideUp delay={0.4}>
              <GlassCard className="p-6">
                <h3 className="font-heading text-xl mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-white/5 bg-black/20 hover:bg-white/5" onClick={() => router.push('/booking')}>
                    Book a Table
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-white/5 bg-black/20 hover:bg-white/5">
                    View Digital Menu
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-white/5 bg-black/20 hover:bg-white/5" onClick={() => {
                    useAuthStore.getState().logout();
                    router.push('/auth/login');
                  }}>
                    Log Out
                  </Button>
                </div>
              </GlassCard>
            </SlideUp>

          </div>
        </div>
      </div>
    </div>
  );
}
