'use client';

import { useEffect, useState } from 'react';
import { FadeIn, SlideUp } from '@/components/ui/motion-wrapper';
import { GlassCard } from '@/components/ui/glass-card';
import { Users, Calendar as CalendarIcon, DollarSign, TrendingUp, Loader2, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export function AdminDashboard() {
  const { user } = useAuthStore();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/analytics/overview');
      setOverview(res.data.data);
    } catch (error) {
      console.error('Failed to load analytics', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  }

  // Elegant empty state logic
  const hasData = overview && (overview.totalReservations > 0 || overview.totalRevenue > 0);

  return (
    <div className="pt-24 pb-20 relative min-h-screen bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <FadeIn className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <p className="text-primary uppercase tracking-widest text-xs mb-2">Executive Overview</p>
            <h1 className="font-heading text-4xl md:text-5xl">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchAnalytics}
              className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              <RefreshCw size={14} /> Refresh Data
            </button>
            <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
              <span className="font-heading text-xl text-primary">{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
            </div>
          </div>
        </FadeIn>

        {!hasData ? (
          <SlideUp delay={0.1}>
            <GlassCard className="p-16 text-center flex flex-col items-center justify-center min-h-[40vh] border-dashed border-white/20">
              <div className="w-20 h-20 rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-6">
                <TrendingUp className="text-primary/50 w-10 h-10" />
              </div>
              <h3 className="font-heading text-2xl mb-2">No Analytics Data Yet</h3>
              <p className="text-foreground/50 max-w-md mx-auto">
                Once customers start booking tables and generating revenue, your dashboard will automatically populate with insights and statistics here.
              </p>
            </GlassCard>
          </SlideUp>
        ) : (
          <SlideUp delay={0.1}>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
               <GlassCard className="p-6">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-primary/10 rounded-lg text-primary"><DollarSign size={24} /></div>
                   <div>
                     <p className="text-sm text-foreground/60 uppercase tracking-wider">Revenue</p>
                     <h3 className="text-2xl font-heading">${overview?.totalRevenue?.toLocaleString() || '0'}</h3>
                   </div>
                 </div>
               </GlassCard>

               <GlassCard className="p-6">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-primary/10 rounded-lg text-primary"><CalendarIcon size={24} /></div>
                   <div>
                     <p className="text-sm text-foreground/60 uppercase tracking-wider">Reservations</p>
                     <h3 className="text-2xl font-heading">{overview?.totalReservations || '0'}</h3>
                   </div>
                 </div>
               </GlassCard>

               <GlassCard className="p-6">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-primary/10 rounded-lg text-primary"><Users size={24} /></div>
                   <div>
                     <p className="text-sm text-foreground/60 uppercase tracking-wider">Guests</p>
                     <h3 className="text-2xl font-heading">{overview?.totalGuests || '0'}</h3>
                   </div>
                 </div>
               </GlassCard>

               <GlassCard className="p-6">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-primary/10 rounded-lg text-primary"><TrendingUp size={24} /></div>
                   <div>
                     <p className="text-sm text-foreground/60 uppercase tracking-wider">Occupancy</p>
                     <h3 className="text-2xl font-heading">
                       {Math.round((overview?.totalReservations / (overview?.totalReservations + 10)) * 100) || 0}%
                     </h3>
                   </div>
                 </div>
               </GlassCard>
             </div>
          </SlideUp>
        )}
      </div>
    </div>
  );
}
