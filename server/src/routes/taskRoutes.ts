import { Router, Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/taskService.js';
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  TaskFilterQuerySchema,
} from '../types/task.js';
import { createAuthMiddleware } from '../middleware/authMiddleware.js';
import { AuthService } from '../services/authService.js';

export function createTaskRoutes(taskService: TaskService, authService: AuthService): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(authService);

  // All task routes require authentication
  router.use(authMiddleware);

  // GET /api/tasks - List all tasks with filters
  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = TaskFilterQuerySchema.parse(req.query);
      const result = await taskService.findAll(req.user!.id, filter);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  // GET /api/tasks/stats - Get summary stats
  router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await taskService.getStats(req.user!.id);
      res.status(200).json({ stats });
    } catch (error) {
      next(error);
    }
  });

  // DELETE /api/tasks/completed/clear - Clear all completed tasks
  router.delete('/completed/clear', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const count = await taskService.clearCompleted(req.user!.id);
      res.status(200).json({
        message: `${count} completed task(s) removed`,
        count,
      });
    } catch (error) {
      next(error);
    }
  });

  // GET /api/tasks/:id - Single task
  router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = String(req.params.id);
      const task = await taskService.findById(req.user!.id, taskId);
      if (!task) {
        res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Task not found' },
        });
        return;
      }
      res.status(200).json({ task });
    } catch (error) {
      next(error);
    }
  });

  // POST /api/tasks - Create task
  router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = CreateTaskSchema.parse(req.body);
      const task = await taskService.create(req.user!.id, input);
      res.status(201).json({ task });
    } catch (error) {
      next(error);
    }
  });

  // PATCH /api/tasks/:id - Update task
  router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = String(req.params.id);
      const input = UpdateTaskSchema.parse(req.body);
      const task = await taskService.update(req.user!.id, taskId, input);
      res.status(200).json({ task });
    } catch (error) {
      next(error);
    }
  });

  // POST /api/tasks/:id/toggle - Toggle completed status
  router.post('/:id/toggle', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = String(req.params.id);
      const task = await taskService.toggleComplete(req.user!.id, taskId);
      res.status(200).json({ task });
    } catch (error) {
      next(error);
    }
  });

  // DELETE /api/tasks/:id - Delete task
  router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = String(req.params.id);
      await taskService.delete(req.user!.id, taskId);
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
