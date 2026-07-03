'use client';

import { useEffect, useState } from 'react';
import { FadeIn, SlideUp } from '@/components/ui/motion-wrapper';
import { GlassCard } from '@/components/ui/glass-card';
import { Users, Calendar as CalendarIcon, DollarSign, TrendingUp, Loader2, RefreshCw, LayoutGrid, List, UtensilsCrossed, Settings, UserCircle, Search, Clock, CheckCircle, XCircle } from 'lucide-react';
import { PageHero } from '@/components/ui/page-hero';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';

type Tab = 'overview' | 'reservations' | 'tables' | 'customers' | 'analytics';

export function AdminDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // Data States
  const [overview, setOverview] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [popularTables, setPopularTables] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [overviewRes, trendsRes, popularTablesRes, reservationsRes, tablesRes, customersRes] = await Promise.all([
        api.get('/admin/analytics/overview'),
        api.get('/admin/analytics/trends'),
        api.get('/admin/analytics/popular-tables'),
        api.get('/admin/reservations?limit=50'),
        api.get('/admin/tables'),
        api.get('/admin/users/customers')
      ]);

      setOverview(overviewRes.data.data);
      setTrends(trendsRes.data.data.trends || []);
      setPopularTables(popularTablesRes.data.data.tables || []);
      setReservations(reservationsRes.data.data.reservations || []);
      setTables(tablesRes.data.data.tables || []);
      setCustomers(customersRes.data.data.customers || []);
    } catch (error) {
      console.error('Failed to load admin data', error);
      toast.error('Failed to sync dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleUpdateReservationStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/reservations/${id}`, { status });
      toast.success(`Reservation marked as ${status}`);
      fetchAllData();
    } catch (error) {
      toast.error('Failed to update reservation status');
    }
  };

  const handleToggleTableStatus = async (id: string, isActive: boolean) => {
    try {
      await api.patch(`/admin/tables/${id}`, { isActive: !isActive });
      toast.success(`Table marked as ${!isActive ? 'Active' : 'Inactive'}`);
      fetchAllData();
    } catch (error) {
      toast.error('Failed to update table status');
    }
  };

  if (loading && !overview) {
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

  const hasData = overview && (overview.today > 0 || overview.upcoming > 0 || overview.completed > 0);

  return (
    <div className="w-full">
      <PageHero 
        title="Executive Dashboard"
        subtitle="Command Center for Restaurant Operations."
        category="Operations"
        bgImage="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop"
      />

      <div className="container relative z-20 mx-auto px-6 max-w-7xl -mt-16 pb-20">

        {/* Tab Navigation */}
        <FadeIn delay={0.1} className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center justify-between min-w-max gap-8 w-full">
            <div className="flex gap-2">
              {[
                { id: 'overview', label: 'Overview', icon: LayoutGrid },
                { id: 'reservations', label: 'Reservations', icon: List },
                { id: 'tables', label: 'Table Management', icon: UtensilsCrossed },
                { id: 'customers', label: 'Customers', icon: Users },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id 
                    ? 'bg-primary/20 text-primary border border-primary/40 shadow-[0_0_15px_rgba(198,156,109,0.2)]' 
                    : 'bg-black/40 text-foreground/60 border border-white/5 hover:bg-white/5 hover:text-foreground'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            <button 
              onClick={fetchAllData}
              disabled={loading}
              className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors bg-black/40 px-6 py-3 rounded-xl border border-white/5 hover:bg-white/5"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Sync Data
            </button>
          </div>
        </FadeIn>

        {/* Tab Content */}
        <div className="min-h-[50vh]">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <SlideUp delay={0.2} className="space-y-8">
              {!hasData ? (
                <GlassCard className="p-16 text-center flex flex-col items-center justify-center min-h-[40vh] border-dashed border-primary/30 bg-black/40">
                  <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(198,156,109,0.15)]">
                    <TrendingUp className="text-primary/70 w-10 h-10" />
                  </div>
                  <h3 className="font-heading text-2xl mb-3 text-foreground">Awaiting Restaurant Data</h3>
                  <p className="text-foreground/60 max-w-md mx-auto leading-relaxed">
                    Once customers begin booking tables and generating revenue, your command center will automatically populate with actionable insights.
                  </p>
                </GlassCard>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Stat Cards */}
                    <GlassCard className="p-6 bg-black/60 hover:bg-black/80 transition-colors border-white/10 hover:border-primary/30 group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs text-foreground/50 uppercase tracking-widest mb-1">Total Revenue</p>
                          <h3 className="text-3xl font-heading text-foreground group-hover:text-primary transition-colors">${overview?.estimatedRevenue?.toLocaleString() || '0'}</h3>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-xl text-primary"><DollarSign size={20} /></div>
                      </div>
                      <p className="text-xs text-primary/80 flex items-center gap-1"><TrendingUp size={12} /> Estimated based on covers</p>
                    </GlassCard>

                    <GlassCard className="p-6 bg-black/60 hover:bg-black/80 transition-colors border-white/10 hover:border-primary/30 group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs text-foreground/50 uppercase tracking-widest mb-1">Today's Bookings</p>
                          <h3 className="text-3xl font-heading text-foreground group-hover:text-primary transition-colors">{overview?.today || '0'}</h3>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-xl text-primary"><CalendarIcon size={20} /></div>
                      </div>
                      <p className="text-xs text-foreground/50">Active reservations for today</p>
                    </GlassCard>

                    <GlassCard className="p-6 bg-black/60 hover:bg-black/80 transition-colors border-white/10 hover:border-primary/30 group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs text-foreground/50 uppercase tracking-widest mb-1">Total Customers</p>
                          <h3 className="text-3xl font-heading text-foreground group-hover:text-primary transition-colors">{overview?.totalCustomers || '0'}</h3>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-xl text-primary"><Users size={20} /></div>
                      </div>
                      <p className="text-xs text-foreground/50">Registered platform users</p>
                    </GlassCard>

                    <GlassCard className="p-6 bg-black/60 hover:bg-black/80 transition-colors border-white/10 hover:border-primary/30 group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs text-foreground/50 uppercase tracking-widest mb-1">Occupancy Rate</p>
                          <h3 className="text-3xl font-heading text-foreground group-hover:text-primary transition-colors">{overview?.occupancyRate || 0}%</h3>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-xl text-primary"><UtensilsCrossed size={20} /></div>
                      </div>
                      <p className="text-xs text-foreground/50">Based on today's capacity</p>
                    </GlassCard>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Quick Activity */}
                    <div className="lg:col-span-2">
                      <GlassCard className="p-8 h-full bg-black/50 border-white/10">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-heading text-xl tracking-wide">Recent Activity</h3>
                          <Button variant="ghost" className="text-xs text-primary hover:text-primary/80" onClick={() => setActiveTab('reservations')}>View All</Button>
                        </div>
                        <div className="space-y-4">
                          {reservations.slice(0, 5).map((res) => (
                            <div key={res._id} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5 hover:border-primary/20 transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <UserCircle className="text-primary w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{res.customer?.name || 'Guest'}</p>
                                  <p className="text-xs text-foreground/50">{res.reservationDate} at {res.timeSlot} • {res.guests} Guests</p>
                                </div>
                              </div>
                              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${
                                res.status === 'CONFIRMED' ? 'text-primary border-primary/30 bg-primary/10' :
                                res.status === 'CANCELLED' ? 'text-destructive border-destructive/30 bg-destructive/10' :
                                'text-foreground/70 border-white/20 bg-white/5'
                              }`}>
                                {res.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                    </div>

                    {/* Popular Tables Mini */}
                    <div className="lg:col-span-1">
                      <GlassCard className="p-8 h-full bg-black/50 border-white/10">
                        <h3 className="font-heading text-xl tracking-wide mb-6">Popular Tables</h3>
                        <div className="space-y-4">
                          {popularTables.length > 0 ? popularTables.map((table, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/5">
                              <div className="flex items-center gap-3">
                                <span className="text-lg font-heading text-primary/80">#{i + 1}</span>
                                <div>
                                  <p className="text-sm font-medium">Table {table.tableNumber}</p>
                                  <p className="text-xs text-foreground/50">Capacity: {table.capacity}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-foreground">{table.usageCount}</p>
                                <p className="text-[10px] uppercase text-foreground/50">Bookings</p>
                              </div>
                            </div>
                          )) : (
                            <p className="text-sm text-foreground/50 text-center py-10">No table data yet</p>
                          )}
                        </div>
                      </GlassCard>
                    </div>
                  </div>
                </>
              )}
            </SlideUp>
          )}

          {/* RESERVATIONS TAB */}
          {activeTab === 'reservations' && (
            <SlideUp delay={0.2}>
              <GlassCard className="p-8 bg-black/60 border-white/10 min-h-[60vh]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <h3 className="font-heading text-2xl tracking-wide">Reservation Management</h3>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
                    <input type="text" placeholder="Search reservations..." className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none transition-colors" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-foreground/50">
                        <th className="pb-4 font-medium">Customer</th>
                        <th className="pb-4 font-medium">Date & Time</th>
                        <th className="pb-4 font-medium">Table & Guests</th>
                        <th className="pb-4 font-medium">Status</th>
                        <th className="pb-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {reservations.length > 0 ? reservations.map((res) => (
                        <tr key={res._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                          <td className="py-4">
                            <p className="font-medium">{res.customer?.name || 'Unknown'}</p>
                            <p className="text-xs text-foreground/50">{res.customer?.email}</p>
                          </td>
                          <td className="py-4">
                            <p className="flex items-center gap-2"><CalendarIcon size={12} className="text-primary" /> {res.reservationDate}</p>
                            <p className="flex items-center gap-2 text-xs text-foreground/50 mt-1"><Clock size={12} /> {res.timeSlot}</p>
                          </td>
                          <td className="py-4">
                            <p>Table {res.table?.tableNumber || '?'}</p>
                            <p className="text-xs text-foreground/50 mt-1">{res.guests} Guests</p>
                          </td>
                          <td className="py-4">
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${
                                res.status === 'CONFIRMED' ? 'text-primary border-primary/30 bg-primary/10' :
                                res.status === 'CANCELLED' ? 'text-destructive border-destructive/30 bg-destructive/10' :
                                'text-foreground/70 border-white/20 bg-white/5'
                              }`}>
                              {res.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            {res.status !== 'CANCELLED' && res.status !== 'COMPLETED' && (
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleUpdateReservationStatus(res._id, 'COMPLETED')} className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-black rounded-lg transition-colors" title="Mark Completed">
                                  <CheckCircle size={16} />
                                </button>
                                <button onClick={() => handleUpdateReservationStatus(res._id, 'CANCELLED')} className="p-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-lg transition-colors" title="Cancel">
                                  <XCircle size={16} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-foreground/50">
                            No reservations found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </SlideUp>
          )}

          {/* TABLES TAB */}
          {activeTab === 'tables' && (
            <SlideUp delay={0.2}>
              <GlassCard className="p-8 bg-black/60 border-white/10 min-h-[60vh]">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-heading text-2xl tracking-wide">Floor Plan Management</h3>
                  <Button className="gold-gradient text-background">Add New Table</Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {tables.map((table) => (
                    <div key={table._id} className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center text-center group relative overflow-hidden ${
                      table.isActive ? 'bg-primary/5 border-primary/30 hover:border-primary/60' : 'bg-black/40 border-white/10 opacity-50'
                    }`}>
                      <div className="absolute top-2 right-2">
                        <button onClick={() => handleToggleTableStatus(table._id, table.isActive)} className="text-xs text-foreground/50 hover:text-primary transition-colors p-1">
                          <Settings size={14} />
                        </button>
                      </div>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 border ${table.isActive ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-white/5 border-white/10 text-foreground/50'}`}>
                        <UtensilsCrossed size={20} />
                      </div>
                      <h4 className="font-heading text-xl mb-1 text-foreground">Table {table.tableNumber}</h4>
                      <p className="text-xs text-foreground/60 uppercase tracking-widest">{table.capacity} Seats</p>
                      
                      <div className={`mt-4 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${table.isActive ? 'text-primary border-primary/30' : 'text-foreground/50 border-white/10'}`}>
                        {table.isActive ? 'Active' : 'Disabled'}
                      </div>
                    </div>
                  ))}
                  {tables.length === 0 && (
                     <div className="col-span-full py-12 text-center text-foreground/50 border border-dashed border-white/10 rounded-xl bg-black/20">
                       No tables configured. Please add tables to the floor plan.
                     </div>
                  )}
                </div>
              </GlassCard>
            </SlideUp>
          )}

          {/* CUSTOMERS TAB */}
          {activeTab === 'customers' && (
            <SlideUp delay={0.2}>
              <GlassCard className="p-8 bg-black/60 border-white/10 min-h-[60vh]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <h3 className="font-heading text-2xl tracking-wide">Client Directory</h3>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-4 h-4" />
                    <input type="text" placeholder="Search clients..." className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-primary focus:outline-none transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customers.map((cust) => (
                    <div key={cust._id} className="p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-primary/30 transition-all duration-300 flex items-start gap-4 group">
                      <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <span className="font-heading text-lg text-primary">{cust.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-heading text-lg text-foreground truncate group-hover:text-primary transition-colors">{cust.name}</h4>
                        <p className="text-xs text-foreground/50 truncate mb-3">{cust.email}</p>
                        <div className="flex gap-2">
                          <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded bg-white/5 border border-white/10 text-foreground/70">Standard</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {customers.length === 0 && (
                    <div className="col-span-full py-16 text-center text-foreground/50 border border-dashed border-white/10 rounded-xl bg-black/20">
                      <Users className="w-12 h-12 mx-auto text-foreground/20 mb-4" />
                      <p>No registered clients found in the database.</p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </SlideUp>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <SlideUp delay={0.2}>
              <GlassCard className="p-8 bg-black/60 border-white/10 min-h-[60vh]">
                <h3 className="font-heading text-2xl tracking-wide mb-8">Performance Analytics</h3>
                
                {trends.length > 0 ? (
                  <div className="space-y-12">
                    {/* Revenue Trend */}
                    <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                      <h4 className="text-sm uppercase tracking-widest text-foreground/60 mb-6">Revenue Trend (7 Days)</h4>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#C69C6D" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#C69C6D" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} axisLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickFormatter={(val) => `$${val}`} axisLine={false} tickLine={false} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(198,156,109,0.3)', borderRadius: '8px' }}
                              itemStyle={{ color: '#C69C6D' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#C69C6D" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Booking Trend */}
                    <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                      <h4 className="text-sm uppercase tracking-widest text-foreground/60 mb-6">Booking Volume</h4>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={12} tickMargin={10} axisLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} axisLine={false} tickLine={false} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(198,156,109,0.3)', borderRadius: '8px' }}
                              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="reservations" fill="#C69C6D" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[40vh] text-center border border-dashed border-white/10 rounded-2xl bg-black/20">
                    <TrendingUp className="w-12 h-12 text-foreground/20 mb-4" />
                    <p className="text-foreground/50">Insufficient data to generate analytics.</p>
                  </div>
                )}
              </GlassCard>
            </SlideUp>
          )}

        </div>
      </div>
    </div>
  );
}
