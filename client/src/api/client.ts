import { Task, TaskStats, TaskFilterState, CreateTaskPayload, UpdateTaskPayload, User } from '../types/index.js';

class ApiError extends Error {
  code: string;
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number, code: string = 'ERROR', details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Includes httpOnly cookies
  };

  const response = await fetch(endpoint, config);

  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.error?.message || response.statusText || 'Network request failed';
    const errorCode = data?.error?.code || `HTTP_${response.status}`;
    const details = data?.error?.details;
    throw new ApiError(errorMsg, response.status, errorCode, details);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (data: { email: string; password: string; name: string }) =>
    request<{ user: User; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{ user: User; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    request<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    }),

  me: () => request<{ user: User }>('/api/auth/me'),

  // Tasks
  getTasks: (filter: Partial<TaskFilterState>) => {
    const params = new URLSearchParams();
    if (filter.status && filter.status !== 'all') params.append('status', filter.status);
    if (filter.priority && filter.priority !== 'all') params.append('priority', filter.priority);
    if (filter.category && filter.category !== 'all') params.append('category', filter.category);
    if (filter.search) params.append('search', filter.search);
    if (filter.sortBy) params.append('sortBy', filter.sortBy);
    if (filter.sortOrder) params.append('sortOrder', filter.sortOrder);

    const query = params.toString() ? `?${params.toString()}` : '';
    return request<{ tasks: Task[]; total: number }>(`/api/tasks${query}`);
  },

  getStats: () => request<{ stats: TaskStats }>('/api/tasks/stats'),

  createTask: (payload: CreateTaskPayload) =>
    request<{ task: Task }>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateTask: (id: string, payload: UpdateTaskPayload) =>
    request<{ task: Task }>(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  toggleTask: (id: string) =>
    request<{ task: Task }>(`/api/tasks/${id}/toggle`, {
      method: 'POST',
    }),

  deleteTask: (id: string) =>
    request<{ message: string }>(`/api/tasks/${id}`, {
      method: 'DELETE',
    }),

  clearCompleted: () =>
    request<{ message: string; count: number }>('/api/tasks/completed/clear', {
      method: 'DELETE',
    }),
};
