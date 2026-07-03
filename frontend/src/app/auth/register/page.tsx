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
import { GoogleLogin } from '@react-oauth/google';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
  role: z.enum(['customer', 'admin']).default('customer')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'customer'
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role
      });
      const { token, user } = res.data.data;
      
      login(token, user);
      toast.success('Registration successful. Welcome!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      // Pass the selected role so Google Auth creates the right account type
      const res = await api.post('/auth/google', { 
        credential: credentialResponse.credential,
        role: selectedRole 
      });
      const { token, user } = res.data.data;
      
      login(token, user);
      toast.success('Google Authentication Successful');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Google Auth failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden py-24">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="container relative z-10 max-w-md mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <GlassCard className="p-8 md:p-10 border-t border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="font-heading text-3xl mb-2">Request Access</h1>
              <p className="text-sm text-foreground/60 font-light">Join our exclusive dining platform.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Role Toggle */}
              <input type="hidden" {...register('role')} />
              <div className="flex gap-4 mb-2">
                <button
                  type="button"
                  onClick={() => setValue('role', 'customer')}
                  disabled={isLoading}
                  className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all duration-300 ${selectedRole === 'customer' ? 'border-primary bg-primary/20 text-primary shadow-[0_0_15px_rgba(198,156,109,0.2)]' : 'border-white/10 bg-black/20 text-foreground/50 hover:bg-white/5'}`}
                >
                  Dining Guest
                </button>
                <button
                  type="button"
                  onClick={() => setValue('role', 'admin')}
                  disabled={isLoading}
                  className={`flex-1 py-3 rounded-lg border text-sm font-medium transition-all duration-300 ${selectedRole === 'admin' ? 'border-primary bg-primary/20 text-primary shadow-[0_0_15px_rgba(198,156,109,0.2)]' : 'border-white/10 bg-black/20 text-foreground/50 hover:bg-white/5'}`}
                >
                  Administrator
                </button>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-foreground/70 mb-2 block">Full Name</label>
                <input
                  type="text"
                  {...register('name')}
                  disabled={isLoading}
                  className={`w-full bg-black/20 border ${errors.name ? 'border-destructive/50 focus:border-destructive' : 'border-white/10 focus:border-primary'} rounded-lg px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none transition-colors`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
              </div>

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
              
              <div>
                <label className="text-xs uppercase tracking-widest text-foreground/70 mb-2 block">Confirm Password</label>
                <input
                  type="password"
                  {...register('confirmPassword')}
                  disabled={isLoading}
                  className={`w-full bg-black/20 border ${errors.confirmPassword ? 'border-destructive/50 focus:border-destructive' : 'border-white/10 focus:border-primary'} rounded-lg px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none transition-colors`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <Button type="submit" className="w-full gold-gradient text-background mt-6" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-between">
              <span className="w-1/5 border-b border-white/10"></span>
              <span className="text-xs text-foreground/50 uppercase">Or continue with</span>
              <span className="w-1/5 border-b border-white/10"></span>
            </div>

            <div className="mt-6 flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  toast.error('Google Authentication Failed');
                }}
                theme="filled_black"
                shape="rectangular"
                width="100%"
                text="signup_with"
              />
            </div>

            <div className="mt-8 text-center text-sm text-foreground/60">
              Already a member?{' '}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign In
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
