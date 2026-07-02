'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogOut, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CustomerDashboard() {
  const { user, logout } = useAuthStore();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-reservations'],
    queryFn: async () => {
      const res = await api.get('/reservations/my');
      return res.data.data.reservations;
    },
  });

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch(e) {} // ignore error, force logout locally
    logout();
  };

  const cancelReservation = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await api.patch(`/reservations/${id}/cancel`);
      toast.success('Reservation cancelled');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel reservation');
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-neutral-500">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-4">
          <Link href="/customer/book">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <PlusCircle className="mr-2 h-4 w-4" /> Book a Table
            </Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Your Upcoming Reservations</h2>
        
        {isLoading ? (
          <div className="text-center py-12">Loading reservations...</div>
        ) : data?.length === 0 ? (
          <Card className="bg-neutral-50 border-dashed dark:bg-neutral-900/50">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <PlusCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold mb-1">No reservations yet</h3>
              <p className="text-neutral-500 text-sm mb-4">You haven't booked any tables. Let's fix that!</p>
              <Link href="/customer/book">
                <Button variant="outline">Make your first booking</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.map((reservation: any) => (
              <Card key={reservation._id} className={`transition-all ${reservation.status === 'CANCELLED' ? 'opacity-60' : 'hover:shadow-md border-indigo-100'}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center">
                      Table {reservation.table?.tableNumber}
                    </CardTitle>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      reservation.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                      reservation.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {reservation.status}
                    </span>
                  </div>
                  <CardDescription>
                    {reservation.reservationDate} at {reservation.timeSlot}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="font-medium text-neutral-900 dark:text-white">Guests:</span> {reservation.guests}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="font-medium text-neutral-900 dark:text-white">Capacity:</span> {reservation.table?.capacity}
                  </p>
                  
                  {reservation.status !== 'CANCELLED' && (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full mt-4" 
                      onClick={() => cancelReservation(reservation._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Cancel Booking
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
