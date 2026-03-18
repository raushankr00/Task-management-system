'use client';

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Task, PaginatedTasks, TaskFilters, CreateTaskPayload, UpdateTaskPayload } from '@/types';
import { taskService } from '@/lib/taskService';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginatedTasks['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({ page: 1, limit: 9 });

  const fetchTasks = useCallback(async (overrideFilters?: TaskFilters) => {
    setIsLoading(true);
    try {
      const activeFilters = overrideFilters ?? filters;
      const result = await taskService.getTasks(activeFilters);
      setTasks(result.data);
      setPagination(result.pagination);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const createTask = async (payload: CreateTaskPayload) => {
    const task = await taskService.createTask(payload);
    toast.success('Task created!');
    await fetchTasks();
    return task;
  };

  const updateTask = async (id: string, payload: UpdateTaskPayload) => {
    const task = await taskService.updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    toast.success('Task updated!');
    return task;
  };

  const deleteTask = async (id: string) => {
    await taskService.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success('Task deleted');
    if (tasks.length === 1 && pagination && pagination.page > 1) {
      const newFilters = { ...filters, page: pagination.page - 1 };
      setFilters(newFilters);
      await fetchTasks(newFilters);
    }
  };

  const toggleTask = async (id: string) => {
    const task = await taskService.toggleTask(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    toast.success(`Status: ${task.status.replace('_', ' ')}`);
    return task;
  };

  const applyFilters = (newFilters: Partial<TaskFilters>) => {
    const updated = { ...filters, ...newFilters, page: 1 };
    setFilters(updated);
    fetchTasks(updated);
  };

  const goToPage = (page: number) => {
    const updated = { ...filters, page };
    setFilters(updated);
    fetchTasks(updated);
  };

  return {
    tasks,
    pagination,
    isLoading,
    filters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    applyFilters,
    goToPage,
  };
}
