'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Plus, LogOut, CheckSquare, ChevronLeft, ChevronRight,
  ListChecks, Clock, CheckCircle2, Circle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import TaskCard from '@/components/tasks/TaskCard';
import TaskForm from '@/components/tasks/TaskForm';
import TaskFiltersBar from '@/components/tasks/TaskFilters';
import TaskSkeleton from '@/components/tasks/TaskSkeleton';
import { Task, CreateTaskPayload } from '@/types';

export default function DashboardPage() {
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const {
    tasks, pagination, isLoading, filters,
    fetchTasks, createTask, updateTask, deleteTask,
    toggleTask, applyFilters, goToPage,
  } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) fetchTasks();
  }, [isAuthenticated]);

  const handleFormSubmit = async (data: CreateTaskPayload) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
      } else {
        await createTask(data);
      }
      setShowForm(false);
      setEditingTask(null);
    } catch {
      toast.error('Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Stat counts
  const totalTasks = pagination?.total ?? 0;
  const pending = tasks.filter((t) => t.status === 'PENDING').length;
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      {/* Navbar */}
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-md"
        style={{
          background: 'hsla(0,0%,100%,0.85)',
          borderColor: 'hsl(var(--border))',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'hsl(var(--primary))' }}
            >
              <CheckSquare size={16} color="white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
              TaskFlow
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm hidden sm:block" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Hi, <strong style={{ color: 'hsl(var(--foreground))' }}>{user?.name}</strong>
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-600"
              style={{ borderColor: 'hsl(var(--border))' }}
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title + add button */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              My Tasks
            </h1>
            <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
              {totalTasks} task{totalTasks !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            onClick={() => { setEditingTask(null); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 flex-shrink-0"
            style={{ background: 'hsl(var(--primary))', color: 'white' }}
          >
            <Plus size={16} />
            New Task
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total', value: totalTasks, icon: ListChecks, color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'Pending', value: pending, icon: Circle, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'In Progress', value: inProgress, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border p-4 flex items-center gap-3"
              style={{ background: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.bg}`}>
                <stat.icon size={17} className={stat.color} />
              </div>
              <div>
                <div className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  {stat.value}
                </div>
                <div className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6">
          <TaskFiltersBar filters={filters} onFiltersChange={applyFilters} />
        </div>

        {/* Task grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <TaskSkeleton key={i} />)}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'hsl(var(--accent))' }}
            >
              <CheckSquare size={28} style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              {filters.search || filters.status || filters.priority
                ? 'No tasks match your filters'
                : 'No tasks yet'}
            </h3>
            <p className="text-sm mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
              {filters.search || filters.status || filters.priority
                ? 'Try adjusting your filters'
                : 'Create your first task to get started'}
            </p>
            {!filters.search && !filters.status && !filters.priority && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
                style={{ background: 'hsl(var(--primary))', color: 'white' }}
              >
                <Plus size={16} />
                Create task
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={deleteTask}
                onToggle={toggleTask}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => goToPage(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className="p-2 rounded-xl border transition-all disabled:opacity-40"
              style={{ borderColor: 'hsl(var(--border))' }}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className="w-9 h-9 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: page === pagination.page ? 'hsl(var(--primary))' : 'transparent',
                  color: page === pagination.page ? 'white' : 'hsl(var(--foreground))',
                  border: `1.5px solid ${page === pagination.page ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className="p-2 rounded-xl border transition-all disabled:opacity-40"
              style={{ borderColor: 'hsl(var(--border))' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>

      {/* Task form modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleFormSubmit}
          onClose={handleClose}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
