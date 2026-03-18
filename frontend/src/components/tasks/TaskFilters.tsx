'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { TaskFilters, TaskStatus, Priority } from '@/types';
import { cn } from '@/lib/utils';

interface TaskFiltersBarProps {
  filters: TaskFilters;
  onFiltersChange: (filters: Partial<TaskFilters>) => void;
}

const STATUS_OPTIONS: { value: TaskStatus | ''; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

const PRIORITY_OPTIONS: { value: Priority | ''; label: string }[] = [
  { value: '', label: 'All Priority' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

export default function TaskFiltersBar({ filters, onFiltersChange }: TaskFiltersBarProps) {
  const [search, setSearch] = useState(filters.search || '');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (search !== (filters.search || '')) {
        onFiltersChange({ search });
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const hasActiveFilters = filters.status || filters.priority || filters.search;

  const clearFilters = () => {
    setSearch('');
    onFiltersChange({ status: '', priority: '', search: '' });
  };

  const chipBase = 'px-3 py-2 rounded-xl border text-sm font-medium outline-none transition-all cursor-pointer';

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: 'hsl(var(--muted-foreground))' }}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none"
          style={{
            background: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
          }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Status filter */}
      <select
        value={filters.status || ''}
        onChange={(e) => onFiltersChange({ status: e.target.value as TaskStatus | '' })}
        className={cn(chipBase)}
        style={{
          background: 'hsl(var(--card))',
          borderColor: 'hsl(var(--border))',
          color: filters.status ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
        }}
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Priority filter */}
      <select
        value={filters.priority || ''}
        onChange={(e) => onFiltersChange({ priority: e.target.value as Priority | '' })}
        className={cn(chipBase)}
        style={{
          background: 'hsl(var(--card))',
          borderColor: 'hsl(var(--border))',
          color: filters.priority ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
        }}
      >
        {PRIORITY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{
            background: 'hsl(var(--destructive) / 0.1)',
            color: 'hsl(var(--destructive))',
          }}
        >
          <X size={14} />
          Clear
        </button>
      )}
    </div>
  );
}
