'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, UtensilsCrossed } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-reservations', page],
    queryFn: async () => {
      const res = await api.get(`/admin/reservations?page=${page}&limit=10`);
      return res.data.data;
    },
  });

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch(e) {} 
    logout();
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      // We don't have a specific update status endpoint in backend other than cancel for customer, 
      // but let's assume we can cancel as admin or we can just view them.
      // Wait, admin can just view all reservations in this MVP.
      toast.info('Status update feature coming soon');
    } catch (error: any) {}
  };

  return (
    <div className="flex min-h-screen bg-neutral-100 dark:bg-neutral-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
          <UtensilsCrossed className="h-6 w-6 text-indigo-600 mr-2" />
          <span className="font-bold text-xl tracking-tight">Admin Portal</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard">
            <Button variant="secondary" className="w-full justify-start">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Reservations
            </Button>
          </Link>
          <Link href="/admin/tables">
            <Button variant="ghost" className="w-full justify-start">
              <UtensilsCrossed className="mr-2 h-4 w-4" /> Tables Management
            </Button>
          </Link>
        </nav>
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="mb-4 px-2">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-neutral-500">{user?.email}</p>
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">All Reservations</h1>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-neutral-500">Loading data...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Table No.</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.reservations?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No reservations found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.reservations?.map((res: any) => (
                      <TableRow key={res._id}>
                        <TableCell>
                          <div className="font-medium">{res.customer?.name}</div>
                          <div className="text-xs text-neutral-500">{res.customer?.email}</div>
                        </TableCell>
                        <TableCell>{res.reservationDate} at {res.timeSlot}</TableCell>
                        <TableCell>{res.guests}</TableCell>
                        <TableCell>Table {res.table?.tableNumber} (Cap: {res.table?.capacity})</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            res.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                            res.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {res.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {data?.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 dark:border-neutral-800">
                  <span className="text-sm text-neutral-500">
                    Showing Page {data.page} of {data.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                    >
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={page === data.totalPages}
                      onClick={() => setPage(p => p + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
