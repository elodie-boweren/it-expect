export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Task {
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

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  categories: string[];
}

export interface TaskFilterState {
  status: 'all' | 'pending' | 'completed';
  priority: 'all' | PriorityLevel;
  category: string;
  search: string;
  sortBy: 'created_at' | 'due_date' | 'priority' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: PriorityLevel;
  category?: string;
  dueDate?: string | null;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: PriorityLevel;
  category?: string;
  dueDate?: string | null;
}
