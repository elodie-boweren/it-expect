import { z } from 'zod';

export const PriorityEnum = z.enum(['low', 'medium', 'high', 'urgent']);
export type PriorityLevel = z.infer<typeof PriorityEnum>;

export const CreateTaskSchema = z.object({
  title: z.string().trim().min(1, { message: 'Title cannot be empty' }).max(300),
  description: z.string().trim().max(2000).default(''),
  priority: PriorityEnum.default('medium'),
  category: z.string().trim().min(1).max(50).default('general'),
  dueDate: z.string().nullable().optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = z.object({
  title: z.string().trim().min(1).max(300).optional(),
  description: z.string().trim().max(2000).optional(),
  completed: z.boolean().optional(),
  priority: PriorityEnum.optional(),
  category: z.string().trim().min(1).max(50).optional(),
  dueDate: z.string().nullable().optional(),
});

export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

export const TaskFilterQuerySchema = z.object({
  status: z.enum(['all', 'pending', 'completed']).default('all'),
  priority: z.enum(['all', 'low', 'medium', 'high', 'urgent']).default('all'),
  category: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['created_at', 'due_date', 'priority', 'title']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type TaskFilterQuery = z.infer<typeof TaskFilterQuerySchema>;

export interface TaskRecord {
  id: string;
  user_id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: PriorityLevel;
  category: string;
  due_date: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface TaskResponse {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  priority: PriorityLevel;
  category: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export function formatTaskRecord(record: TaskRecord): TaskResponse {
  return {
    id: record.id,
    userId: record.user_id,
    title: record.title,
    description: record.description || '',
    completed: Boolean(record.completed),
    priority: record.priority,
    category: record.category,
    dueDate: record.due_date ? new Date(record.due_date).toISOString() : null,
    createdAt: new Date(record.created_at).toISOString(),
    updatedAt: new Date(record.updated_at).toISOString(),
  };
}
