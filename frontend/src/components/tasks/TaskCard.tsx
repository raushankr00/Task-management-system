'use client';

import { useState } from 'react';
import { Calendar, Pencil, Trash2, RotateCcw, Flag, Clock } from 'lucide-react';
import { Task } from '@/types';
import { STATUS_CONFIG, PRIORITY_CONFIG, formatDate, isOverdue, cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onToggle }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const status = STATUS_CONFIG[task.status];
  const priority = PRIORITY_CONFIG[task.priority];
  const overdue = isOverdue(task.dueDate, task.status);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      await onToggle(task.id);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div
      className={cn(
        'group rounded-2xl border p-5 transition-all duration-200 flex flex-col gap-3 animate-slide-up',
        'hover:shadow-md hover:-translate-y-0.5',
        task.status === 'COMPLETED' && 'opacity-75'
      )}
      style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          {/* Toggle button */}
          <button
            onClick={handleToggle}
            disabled={isToggling}
            title="Cycle status"
            className={cn(
              'mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
              task.status === 'COMPLETED'
                ? 'bg-emerald-500 border-emerald-500'
                : 'border-gray-300 hover:border-violet-500'
            )}
          >
            {task.status === 'COMPLETED' && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {isToggling && (
              <span className="w-2.5 h-2.5 border border-current border-t-transparent rounded-full animate-spin" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                'font-semibold text-sm leading-snug',
                task.status === 'COMPLETED' && 'line-through text-gray-400'
              )}
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Actions — show on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: 'hsl(var(--muted-foreground))' }}
            title="Edit"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
            style={{ color: isDeleting ? 'hsl(var(--muted-foreground))' : 'hsl(var(--destructive))' }}
            title="Delete"
          >
            {isDeleting ? (
              <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin block" />
            ) : (
              <Trash2 size={13} />
            )}
          </button>
        </div>
      </div>

      {/* Badges row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status badge */}
        <span
          className={cn('inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium', status.bg, status.color)}
        >
          <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
          {status.label}
        </span>

        {/* Priority badge */}
        <span
          className={cn('inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium', priority.bg, priority.color)}
        >
          <Flag size={10} />
          {priority.label}
        </span>

        {/* Due date */}
        {task.dueDate && (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium',
              overdue ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'
            )}
          >
            {overdue ? <Clock size={10} /> : <Calendar size={10} />}
            {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
}
