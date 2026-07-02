import ProtectedRoute from '@/components/ProtectedRoute';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['CUSTOMER']}>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* We can add a Customer Navigation Header here later */}
        {children}
      </div>
    </ProtectedRoute>
  );
}
