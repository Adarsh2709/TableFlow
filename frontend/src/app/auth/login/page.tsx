'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', data);
      const { token, user } = res.data.data;
      
      login(token, user);
      toast.success('Welcome back to TableFlow');
      
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden py-24">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="container relative z-10 max-w-md mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <GlassCard className="p-8 md:p-10 border-t border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="font-heading text-3xl mb-2">Member Login</h1>
              <p className="text-sm text-foreground/60 font-light">Access your exclusive dining dashboard.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="text-xs uppercase tracking-widest text-foreground/70 mb-2 block">Email</label>
                <input
                  type="email"
                  {...register('email')}
                  disabled={isLoading}
                  className={`w-full bg-black/20 border ${errors.email ? 'border-destructive/50 focus:border-destructive' : 'border-white/10 focus:border-primary'} rounded-lg px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none transition-colors`}
                  placeholder="name@example.com"
                />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-foreground/70 mb-2 block">Password</label>
                <input
                  type="password"
                  {...register('password')}
                  disabled={isLoading}
                  className={`w-full bg-black/20 border ${errors.password ? 'border-destructive/50 focus:border-destructive' : 'border-white/10 focus:border-primary'} rounded-lg px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none transition-colors`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex justify-end">
                <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>

              <Button type="submit" className="w-full gold-gradient text-background mt-4" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-foreground/60">
              Not a member yet?{' '}
              <Link href="/auth/register" className="text-primary hover:underline">
                Request Access
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
