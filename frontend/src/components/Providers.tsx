'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId="578661303068-k9tlf9vrqf1kodjcgi25rre3prp25uh4.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
