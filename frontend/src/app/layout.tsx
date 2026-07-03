import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import { cn } from "@/lib/utils";
import { Navbar } from '@/components/layout/navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'TableFlow | Luxury Dining Experience',
  description: 'A premium smart restaurant reservation platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", inter.variable, playfair.variable)}>
      <body className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground font-sans antialiased overflow-x-hidden">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
