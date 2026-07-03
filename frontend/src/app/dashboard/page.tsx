'use client';

import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/ProtectedRoute';
import { CustomerDashboard } from '@/components/dashboard/CustomerDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      {user.role === 'admin' ? <AdminDashboard /> : <CustomerDashboard />}
    </ProtectedRoute>
  );
}
