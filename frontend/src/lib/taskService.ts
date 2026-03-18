import api from './api';
import { Task, PaginatedTasks, CreateTaskPayload, UpdateTaskPayload, TaskFilters } from '@/types';

export const taskService = {
  async getTasks(filters: TaskFilters = {}): Promise<PaginatedTasks> {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.search) params.set('search', filters.search);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const res = await api.get(`/tasks?${params.toString()}`);
    return res.data.data;
  },

  async getTask(id: string): Promise<Task> {
    const res = await api.get(`/tasks/${id}`);
    return res.data.data;
  },

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    const res = await api.post('/tasks', payload);
    return res.data.data;
  },

  async updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
    const res = await api.patch(`/tasks/${id}`, payload);
    return res.data.data;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async toggleTask(id: string): Promise<Task> {
    const res = await api.patch(`/tasks/${id}/toggle`);
    return res.data.data;
  },
};
