'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Users, Calendar, TrendingUp, DollarSign, Activity, Loader2, LogOut } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { FadeIn, SlideUp } from '@/components/ui/motion-wrapper';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, checkAuth, logout } = useAuthStore();
  
  const [overview, setOverview] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role !== 'admin') {
        router.push('/dashboard'); // Not an admin
      } else {
        fetchAnalytics();
      }
    } else if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, user, router]);

  const fetchAnalytics = async () => {
    try {
      const [overviewRes, trendsRes] = await Promise.all([
        api.get('/admin/analytics/overview'),
        api.get('/admin/analytics/trends')
      ]);
      
      setOverview(overviewRes.data.data);
      
      // Format trends for Recharts
      const formattedTrends = trendsRes.data.data.trends.map((t: any) => ({
        name: new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' }),
        reservations: t.reservations,
        guests: t.guests,
        revenue: t.revenue
      }));
      setTrends(formattedTrends);
    } catch (error) {
      console.error('Failed to load analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  }

  const statCards = [
    { title: "Today's Reservations", value: overview?.today || 0, icon: <Calendar className="w-5 h-5 text-primary" />, trend: "Active" },
    { title: 'Upcoming (Total)', value: overview?.upcoming || 0, icon: <Activity className="w-5 h-5 text-primary" />, trend: "Confirmed" },
    { title: 'Occupancy Rate', value: `${overview?.occupancyRate || 0}%`, icon: <Users className="w-5 h-5 text-primary" />, trend: "Capacity Booked" },
    { title: 'Est. Revenue', value: `$${(overview?.estimatedRevenue || 0).toLocaleString()}`, icon: <DollarSign className="w-5 h-5 text-primary" />, trend: "Based on completions" },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 relative">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <FadeIn className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <p className="text-primary uppercase tracking-widest text-xs mb-2">Management</p>
            <h1 className="font-heading text-4xl md:text-5xl">Executive Dashboard</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-white/10" onClick={() => {
              logout();
              router.push('/auth/login');
            }}>
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </FadeIn>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, i) => (
            <SlideUp key={i} delay={i * 0.1}>
              <GlassCard className="p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity group-hover:scale-110 duration-500">
                  {stat.icon}
                </div>
                <h3 className="text-sm uppercase tracking-widest text-foreground/50 mb-2">{stat.title}</h3>
                <div className="font-heading text-4xl mb-2">{stat.value}</div>
                <div className="text-xs text-primary font-medium">{stat.trend}</div>
              </GlassCard>
            </SlideUp>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <SlideUp delay={0.4} className="lg:col-span-2">
            <GlassCard className="p-8 h-[400px]">
              <h3 className="font-heading text-2xl mb-6 flex items-center gap-2">
                <TrendingUp className="text-primary w-5 h-5" /> 
                Revenue & Guest Trends
              </h3>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <YAxis yAxisId="right" orientation="right" stroke="#c69c6d" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#fff" strokeWidth={3} dot={{ r: 4, fill: '#fff' }} activeDot={{ r: 6, fill: '#fff' }} />
                    <Line yAxisId="right" type="monotone" dataKey="guests" stroke="#c69c6d" strokeWidth={3} dot={{ r: 4, fill: '#c69c6d' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </SlideUp>

          <SlideUp delay={0.5}>
            <GlassCard className="p-8 h-[400px]">
              <h3 className="font-heading text-2xl mb-6">Reservations by Day</h3>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="reservations" fill="#c69c6d" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </SlideUp>
        </div>

      </div>
    </div>
  );
}
