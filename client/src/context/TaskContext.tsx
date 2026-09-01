import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, TaskStats, TaskFilterState, CreateTaskPayload, UpdateTaskPayload } from '../types/index.js';
import { api } from '../api/client.js';
import { useAuth } from './AuthContext.js';

interface TaskContextType {
  tasks: Task[];
  stats: TaskStats | null;
  isLoading: boolean;
  error: string | null;
  filter: TaskFilterState;
  setFilter: React.Dispatch<React.SetStateAction<TaskFilterState>>;
  createTask: (payload: CreateTaskPayload) => Promise<void>;
  updateTask: (id: string, payload: UpdateTaskPayload) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  refreshTasks: () => Promise<void>;
}

const defaultFilter: TaskFilterState = {
  status: 'all',
  priority: 'all',
  category: 'all',
  search: '',
  sortBy: 'created_at',
  sortOrder: 'desc',
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TaskFilterState>(defaultFilter);

  const fetchTasksAndStats = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setStats(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const [tasksRes, statsRes] = await Promise.all([
        api.getTasks(filter),
        api.getStats(),
      ]);
      setTasks(tasksRes.tasks);
      setStats(statsRes.stats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [user, filter]);

  useEffect(() => {
    fetchTasksAndStats();
  }, [fetchTasksAndStats]);

  async function createTask(payload: CreateTaskPayload) {
    try {
      const res = await api.createTask(payload);
      setTasks((prev) => [res.task, ...prev]);
      // refresh stats
      api.getStats().then((s) => setStats(s.stats)).catch(() => {});
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
      throw err;
    }
  }

  async function updateTask(id: string, payload: UpdateTaskPayload) {
    try {
      const res = await api.updateTask(id, payload);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.task : t)));
      api.getStats().then((s) => setStats(s.stats)).catch(() => {});
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
      throw err;
    }
  }

  async function toggleTask(id: string) {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

    try {
      const res = await api.toggleTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.task : t)));
      api.getStats().then((s) => setStats(s.stats)).catch(() => {});
    } catch (err: any) {
      // Revert optimistic update
      fetchTasksAndStats();
      setError(err.message || 'Failed to toggle task');
      throw err;
    }
  }

  async function deleteTask(id: string) {
    // Optimistic delete
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await api.deleteTask(id);
      api.getStats().then((s) => setStats(s.stats)).catch(() => {});
    } catch (err: any) {
      setTasks(previousTasks);
      setError(err.message || 'Failed to delete task');
      throw err;
    }
  }

  async function clearCompleted() {
    try {
      await api.clearCompleted();
      fetchTasksAndStats();
    } catch (err: any) {
      setError(err.message || 'Failed to clear completed tasks');
      throw err;
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        isLoading,
        error,
        filter,
        setFilter,
        createTask,
        updateTask,
        toggleTask,
        deleteTask,
        clearCompleted,
        refreshTasks: fetchTasksAndStats,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
