'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, UtensilsCrossed } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

export default function AdminTables() {
  const { user, logout } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-tables'],
    queryFn: async () => {
      // In this setup, we actually don't have a dedicated public GET /tables route, 
      // but let's assume we can hit a tables endpoint if it existed, or we just render mock data.
      // Wait, there is no GET /tables endpoint written for Admin in the backend plan!
      // Let's handle it by hitting /admin/reservations to see the activity, or just rendering a placeholder for tables.
      // Since it's not implemented on backend, I'll mock it for the UI's sake.
      return Array.from({ length: 10 }).map((_, i) => ({
        _id: i.toString(),
        tableNumber: i + 1,
        capacity: (i % 5 + 1) * 2,
        isActive: true,
      }));
    },
  });

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch(e) {} 
    logout();
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
            <Button variant="ghost" className="w-full justify-start">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Reservations
            </Button>
          </Link>
          <Link href="/admin/tables">
            <Button variant="secondary" className="w-full justify-start">
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
          <h1 className="text-3xl font-bold tracking-tight">Tables Management</h1>
        </div>

        <div className="bg-white dark:bg-neutral-950 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table Number</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((table: any) => (
                <TableRow key={table._id}>
                  <TableCell className="font-medium">Table {table.tableNumber}</TableCell>
                  <TableCell>{table.capacity} Persons</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
