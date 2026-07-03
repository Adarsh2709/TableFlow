'use client';

import { ReactLenis } from 'lenis/react';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.05, wheelMultiplier: 0.8, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
