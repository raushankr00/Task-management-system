import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { TaskStatus, Priority } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'MMM d, yyyy');
}

export function isOverdue(date: string | null | undefined, status: TaskStatus): boolean {
  if (!date || status === 'COMPLETED') return false;
  return isPast(new Date(date));
}

export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string; dot: string }> = {
  PENDING: {
    label: 'Pending',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    dot: 'bg-amber-400',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    dot: 'bg-blue-500',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    dot: 'bg-emerald-500',
  },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string }> = {
  LOW: { label: 'Low', color: 'text-slate-600', bg: 'bg-slate-100' },
  MEDIUM: { label: 'Medium', color: 'text-violet-700', bg: 'bg-violet-50' },
  HIGH: { label: 'High', color: 'text-rose-700', bg: 'bg-rose-50' },
};
