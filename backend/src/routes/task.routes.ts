import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  toggleTask,
} from '../controllers/task.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.use(authenticate);

router.get('/', getTasks);

router.post(
  '/',
  [
    body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required (max 200 chars)'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Description max 1000 chars'),
    body('status')
      .optional()
      .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
      .withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['LOW', 'MEDIUM', 'HIGH'])
      .withMessage('Invalid priority'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  createTask
);

router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid task ID')],
  validate,
  getTaskById
);

router.patch(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid task ID'),
    body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title max 200 chars'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Description max 1000 chars'),
    body('status')
      .optional()
      .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
      .withMessage('Invalid status'),
    body('priority')
      .optional()
      .isIn(['LOW', 'MEDIUM', 'HIGH'])
      .withMessage('Invalid priority'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  updateTask
);

router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Invalid task ID')],
  validate,
  deleteTask
);

router.patch(
  '/:id/toggle',
  [param('id').isUUID().withMessage('Invalid task ID')],
  validate,
  toggleTask
);

export default router;
