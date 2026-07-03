'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { FadeIn, SlideUp } from '@/components/ui/motion-wrapper';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Check, Loader2 } from 'lucide-react';
import { PageHero } from '@/components/ui/page-hero';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const TIME_SLOTS = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

export default function BookingPage() {
  const router = useRouter();
  const { isAuthenticated, user, checkAuth, isLoading: authLoading } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [guests, setGuests] = useState(2);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0] // Tomorrow by default
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (authLoading) {
    return <div className="min-h-screen bg-transparent flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  }

  if (!isAuthenticated) {
    // If not authenticated, prompt them to login
    return (
      <div className="min-h-screen bg-transparent pt-32 pb-24 flex items-center justify-center">
        <GlassCard className="max-w-md text-center p-10">
          <h2 className="font-heading text-3xl mb-4">Authentication Required</h2>
          <p className="text-foreground/70 mb-8 font-light">Please log in to your account to reserve a table at TableFlow.</p>
          <Button className="w-full gold-gradient text-background" onClick={() => router.push('/auth/login')}>
            Sign In to Book
          </Button>
        </GlassCard>
      </div>
    );
  }

  const handleConfirmReservation = async () => {
    if (!selectedTime) return;
    
    setIsSubmitting(true);
    try {
      await api.post('/reservations', {
        reservationDate: selectedDate,
        timeSlot: selectedTime,
        guests
      });
      
      toast.success('Reservation confirmed successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to book reservation. The table might be taken.');
      if (error.response?.status === 409) {
        // Conflict - table taken
        setStep(1); // Go back to selection
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <PageHero 
        title="Reserve Your Table"
        subtitle="Join us for an unforgettable dining experience."
        category="Reservation"
        bgImage="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop"
      />

      <div className="container relative z-20 max-w-4xl mx-auto px-6 -mt-16 pb-24">

        <SlideUp delay={0.2}>
          <GlassCard className="p-8 md:p-12 relative overflow-visible shadow-2xl shadow-primary/5">
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-12"
              >
                {/* Date & Guests */}
                <div className="space-y-8">
                  <div>
                    <label className="text-sm uppercase tracking-widest text-foreground/60 mb-4 block">Guests</label>
                    <div className="flex items-center gap-4 bg-black/20 p-2 rounded-lg border border-white/5">
                      <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-md" onClick={() => setGuests(Math.max(1, guests - 1))}>-</Button>
                      <div className="flex-1 text-center font-heading text-xl">{guests} {guests === 1 ? 'Person' : 'People'}</div>
                      <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-md" onClick={() => setGuests(Math.min(10, guests + 1))}>+</Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm uppercase tracking-widest text-foreground/60 mb-4 block">Date</label>
                    <input 
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-black/20 p-6 rounded-lg border border-white/5 text-center font-heading text-xl cursor-pointer hover:bg-black/40 transition-colors focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <label className="text-sm uppercase tracking-widest text-foreground/60 mb-4 block">Availability</label>
                  <div className="grid grid-cols-3 gap-3">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 rounded-lg text-sm transition-all duration-300 border ${
                          selectedTime === time 
                            ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(198,156,109,0.3)]' 
                            : 'bg-black/20 border-white/5 text-foreground/70 hover:bg-black/40 hover:border-white/20'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  <div className="mt-12">
                    <Button 
                      className="w-full gold-gradient text-background text-lg h-14" 
                      onClick={() => setStep(2)}
                      disabled={!selectedTime}
                    >
                      Continue to Details
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="max-w-md mx-auto"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-2xl mb-2">Review Reservation</h3>
                  <p className="text-sm text-foreground/60">{selectedDate} at {selectedTime} for {guests} Guests</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="bg-black/20 border border-white/10 rounded-lg px-4 py-3">
                    <p className="text-xs text-foreground/50 uppercase tracking-widest mb-1">Reservation For</p>
                    <p className="font-medium text-foreground">{user?.name}</p>
                    <p className="text-sm text-foreground/70">{user?.email}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 border-white/10" onClick={() => setStep(1)} disabled={isSubmitting}>Back</Button>
                  <Button className="flex-2 w-full gold-gradient text-background" onClick={handleConfirmReservation} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Reservation'}
                  </Button>
                </div>
              </motion.div>
            )}
          </GlassCard>
        </SlideUp>
      </div>
    </div>
  );
}
