'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus, CheckSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AxiosError } from 'axios';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include uppercase letter')
    .regex(/[a-z]/, 'Must include lowercase letter')
    .regex(/\d/, 'Must include a number'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const password = watch('password', '');
  const strength = [/[A-Z]/, /[a-z]/, /\d/, /.{8,}/].filter((r) => r.test(password)).length;
  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-500'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await registerUser(data);
      toast.success('Account created! Welcome aboard 🎉');
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'hsl(var(--background))' }}>
      <div className="w-full max-w-md animate-slide-up">
        <div className="flex items-center gap-2 mb-10">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'hsl(var(--primary))' }}
          >
            <CheckSquare size={18} color="white" />
          </div>
          <span className="font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>
            TaskFlow
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Create your account
        </h1>
        <p style={{ color: 'hsl(var(--muted-foreground))' }} className="mb-8 text-sm">
          Join thousands managing tasks smarter
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Full name</label>
            <input
              {...register('name')}
              type="text"
              placeholder="Jane Smith"
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
              style={{
                background: 'hsl(var(--card))',
                border: errors.name ? '1.5px solid hsl(var(--destructive))' : '1.5px solid hsl(var(--border))',
              }}
              autoComplete="name"
            />
            {errors.name && (
              <p className="text-xs mt-1.5" style={{ color: 'hsl(var(--destructive))' }}>
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
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
                placeholder="Min 8 chars, uppercase & number"
                className="w-full px-4 py-3 pr-12 rounded-xl border text-sm outline-none"
                style={{
                  background: 'hsl(var(--card))',
                  border: errors.password ? '1.5px solid hsl(var(--destructive))' : '1.5px solid hsl(var(--border))',
                }}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                style={{ color: 'hsl(var(--muted-foreground))' }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Strength meter */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${i < strength ? strengthColors[strength - 1] : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
                <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {strength > 0 ? strengthLabels[strength - 1] : ''}
                </p>
              </div>
            )}
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
              <UserPlus size={16} />
            )}
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold" style={{ color: 'hsl(var(--primary))' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
