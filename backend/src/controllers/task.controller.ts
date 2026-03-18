import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest, TaskQueryParams, PaginatedResponse, TaskStatus, Priority } from '../types';
import { successResponse, errorResponse } from '../utils/response';

const prisma = new PrismaClient();

export const getTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      status,
      search,
      priority,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query as TaskQueryParams;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'dueDate', 'priority'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const where: Record<string, unknown> = { userId: req.userId };

    const validStatuses: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
    if (status && validStatuses.includes(status as TaskStatus)) {
      where.status = status;
    }

    const validPriorities: Priority[] = ['LOW', 'MEDIUM', 'HIGH'];
    if (priority && validPriorities.includes(priority as Priority)) {
      where.priority = priority;
    }

    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search.trim() } },
        { description: { contains: search.trim() } },
      ];
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { [safeSortBy]: sortOrder },
      }),
      prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    const response: PaginatedResponse<typeof tasks[0]> = {
      data: tasks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    };

    successResponse(res, response);
  } catch (error) {
    console.error('Get tasks error:', error);
    errorResponse(res, 'Failed to fetch tasks', 500);
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'PENDING',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: req.userId!,
      },
    });

    successResponse(res, task, 'Task created successfully', 201);
  } catch (error) {
    console.error('Create task error:', error);
    errorResponse(res, 'Failed to create task', 500);
  }
};

export const getTaskById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findFirst({
      where: { id, userId: req.userId },
    });

    if (!task) {
      errorResponse(res, 'Task not found', 404);
      return;
    }

    successResponse(res, task);
  } catch (error) {
    errorResponse(res, 'Failed to fetch task', 500);
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    const existingTask = await prisma.task.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingTask) {
      errorResponse(res, 'Task not found', 404);
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    successResponse(res, task, 'Task updated successfully');
  } catch (error) {
    errorResponse(res, 'Failed to update task', 500);
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingTask = await prisma.task.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingTask) {
      errorResponse(res, 'Task not found', 404);
      return;
    }

    await prisma.task.delete({ where: { id } });

    successResponse(res, null, 'Task deleted successfully');
  } catch (error) {
    errorResponse(res, 'Failed to delete task', 500);
  }
};

export const toggleTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existingTask = await prisma.task.findFirst({
      where: { id, userId: req.userId },
    });

    if (!existingTask) {
      errorResponse(res, 'Task not found', 404);
      return;
    }

    const nextStatus: TaskStatus =
      existingTask.status === 'COMPLETED'
        ? 'PENDING'
        : existingTask.status === 'PENDING'
        ? 'IN_PROGRESS'
        : 'COMPLETED';

    const task = await prisma.task.update({
      where: { id },
      data: { status: nextStatus },
    });

    successResponse(res, task, `Task status updated to ${nextStatus}`);
  } catch (error) {
    errorResponse(res, 'Failed to toggle task', 500);
  }
};