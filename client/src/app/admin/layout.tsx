import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* We can add an Admin Navigation Header here later */}
        {children}
      </div>
    </ProtectedRoute>
  );
}
