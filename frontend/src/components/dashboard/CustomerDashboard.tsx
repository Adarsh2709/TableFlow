'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FadeIn, SlideUp } from '@/components/ui/motion-wrapper';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Award, Loader2, UtensilsCrossed } from 'lucide-react';
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
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  }

  const upcoming = reservations.filter(r => r.status === 'CONFIRMED' || r.status === 'PENDING');
  const past = reservations.filter(r => r.status === 'CANCELLED' || r.status === 'COMPLETED');

  return (
    <div className="pt-24 pb-20 relative bg-background min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Welcome Header */}
        <FadeIn className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
            <div>
              <p className="text-primary uppercase tracking-widest text-xs mb-2">Member Lounge</p>
              <h1 className="font-heading text-4xl md:text-5xl">Welcome back, {user?.name?.split(' ')[0] || 'Guest'}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">Standard Member</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                <span className="font-heading text-xl text-primary">{user?.name?.charAt(0).toUpperCase() || 'G'}</span>
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
                    <GlassCard key={res._id} className="p-8 group relative overflow-hidden border-primary/20">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                        <div>
                          <span className="inline-block px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-xs text-primary uppercase tracking-widest mb-4">
                            {res.status}
                          </span>
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
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <GlassCard className="p-16 text-center flex flex-col items-center justify-center min-h-[30vh] border-dashed border-white/20">
                  <div className="w-16 h-16 rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-6">
                    <UtensilsCrossed className="text-primary/50 w-8 h-8" />
                  </div>
                  <h3 className="font-heading text-xl mb-2">No upcoming reservations</h3>
                  <p className="text-foreground/50 mb-6 max-w-sm mx-auto">
                    You don't have any confirmed tables at the moment. Secure your next dining experience now.
                  </p>
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
                      <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center border border-white/5">
                        <UtensilsCrossed className="text-primary/50 w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading text-lg">Past Booking</h4>
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
                  <GlassCard className="p-8 text-center border-dashed border-white/10">
                    <p className="text-foreground/50 text-sm">Your past dining history will appear here.</p>
                  </GlassCard>
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
                    <p className="text-primary text-sm font-medium italic">Standard Member</p>
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
                </div>
              </GlassCard>
            </SlideUp>

          </div>
        </div>
      </div>
    </div>
  );
}
