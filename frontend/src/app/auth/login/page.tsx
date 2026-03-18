'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn, CheckSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AxiosError } from 'axios';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await login(data);
      toast.success('Welcome back!');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'hsl(var(--background))' }}>
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 w-[420px] flex-shrink-0"
        style={{
          background: 'linear-gradient(160deg, hsl(250 84% 15%) 0%, hsl(250 84% 28%) 100%)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'hsla(0,0%,100%,0.15)' }}
          >
            <CheckSquare size={18} color="white" />
          </div>
          <span className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>
            TaskFlow
          </span>
        </div>

        <div>
          <h2 className="text-white text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Organize your work,<br />amplify your output.
          </h2>
          <p className="text-white/60 text-base">
            A clean, focused task manager built to help you ship faster and think clearer.
          </p>
        </div>

        <div className="flex gap-2">
          {['PENDING', 'IN_PROGRESS', 'COMPLETED'].map((s) => (
            <div
              key={s}
              className="flex-1 rounded-lg p-3 text-center"
              style={{ background: 'hsla(0,0%,100%,0.08)' }}
            >
              <div className="text-white/40 text-xs mb-1">{s.replace('_', ' ')}</div>
              <div className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                {s === 'PENDING' ? '4' : s === 'IN_PROGRESS' ? '2' : '9'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <CheckSquare size={22} style={{ color: 'hsl(var(--primary))' }} />
            <span className="font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>
              TaskFlow
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            Welcome back
          </h1>
          <p style={{ color: 'hsl(var(--muted-foreground))' }} className="mb-8 text-sm">
            Sign in to continue managing your tasks
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{
                  background: 'hsl(var(--card))',
                  border: errors.email ? '1.5px solid hsl(var(--destructive))' : '1.5px solid hsl(var(--border))',
                }}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs mt-1.5" style={{ color: 'hsl(var(--destructive))' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border text-sm outline-none transition-all"
                  style={{
                    background: 'hsl(var(--card))',
                    border: errors.password ? '1.5px solid hsl(var(--destructive))' : '1.5px solid hsl(var(--border))',
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
                  style={{ color: 'hsl(var(--muted-foreground))' }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs mt-1.5" style={{ color: 'hsl(var(--destructive))' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                background: isSubmitting ? 'hsl(var(--muted))' : 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn size={16} />
              )}
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="font-semibold"
              style={{ color: 'hsl(var(--primary))' }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
