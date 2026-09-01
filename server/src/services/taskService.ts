import pg from 'pg';
import {
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilterQuery,
  TaskRecord,
  TaskResponse,
  formatTaskRecord,
} from '../types/task.js';

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

export class TaskService {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    this.pool = pool;
  }

  async create(userId: string, input: CreateTaskInput): Promise<TaskResponse> {
    const result = await this.pool.query(
      `INSERT INTO tasks (user_id, title, description, priority, category, due_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        userId,
        input.title.trim(),
        input.description ? input.description.trim() : '',
        input.priority || 'medium',
        input.category ? input.category.trim() : 'general',
        input.dueDate || null,
      ]
    );

    return formatTaskRecord(result.rows[0]);
  }

  async findAll(userId: string, filter: TaskFilterQuery): Promise<{ tasks: TaskResponse[]; total: number }> {
    const conditions: string[] = ['user_id = $1'];
    const params: any[] = [userId];

    if (filter.status === 'completed') {
      conditions.push('completed = TRUE');
    } else if (filter.status === 'pending') {
      conditions.push('completed = FALSE');
    }

    if (filter.priority && filter.priority !== 'all') {
      params.push(filter.priority);
      conditions.push(`priority = $${params.length}`);
    }

    if (filter.category && filter.category !== 'all') {
      params.push(filter.category);
      conditions.push(`category = $${params.length}`);
    }

    if (filter.search && filter.search.trim().length > 0) {
      params.push(`%${filter.search.trim()}%`);
      const searchParamIdx = params.length;
      conditions.push(`(title ILIKE $${searchParamIdx} OR description ILIKE $${searchParamIdx})`);
    }

    const whereClause = conditions.join(' AND ');

    // Safe sorting mappings
    const sortFieldMap: Record<string, string> = {
      created_at: 'created_at',
      due_date: 'due_date',
      priority: `CASE priority 
        WHEN 'urgent' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'medium' THEN 3 
        WHEN 'low' THEN 4 
        ELSE 5 END`,
      title: 'title',
    };

    const sortColumn = sortFieldMap[filter.sortBy] || 'created_at';
    const direction = filter.sortOrder === 'asc' ? 'ASC' : 'DESC';

    const countQuery = `SELECT COUNT(*) as count FROM tasks WHERE ${whereClause}`;
    const countResult = await this.pool.query(countQuery, params);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    const listQuery = `SELECT * FROM tasks WHERE ${whereClause} ORDER BY ${sortColumn} ${direction}`;
    const listResult = await this.pool.query(listQuery, params);

    return {
      tasks: listResult.rows.map((row: TaskRecord) => formatTaskRecord(row)),
      total: totalCount,
    };
  }

  async findById(userId: string, taskId: string): Promise<TaskResponse | null> {
    const result = await this.pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return formatTaskRecord(result.rows[0]);
  }

  async update(userId: string, taskId: string, input: UpdateTaskInput): Promise<TaskResponse> {
    const existing = await this.findById(userId, taskId);
    if (!existing) {
      const error = new Error('Task not found');
      (error as any).statusCode = 404;
      (error as any).code = 'NOT_FOUND';
      throw error;
    }

    const updates: string[] = ['updated_at = NOW()'];
    const params: any[] = [taskId, userId]; // $1, $2

    if (input.title !== undefined) {
      params.push(input.title.trim());
      updates.push(`title = $${params.length}`);
    }

    if (input.description !== undefined) {
      params.push(input.description.trim());
      updates.push(`description = $${params.length}`);
    }

    if (input.completed !== undefined) {
      params.push(Boolean(input.completed));
      updates.push(`completed = $${params.length}`);
    }

    if (input.priority !== undefined) {
      params.push(input.priority);
      updates.push(`priority = $${params.length}`);
    }

    if (input.category !== undefined) {
      params.push(input.category.trim());
      updates.push(`category = $${params.length}`);
    }

    if (input.dueDate !== undefined) {
      params.push(input.dueDate || null);
      updates.push(`due_date = $${params.length}`);
    }

    const updateQuery = `
      UPDATE tasks 
      SET ${updates.join(', ')} 
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;

    const result = await this.pool.query(updateQuery, params);
    return formatTaskRecord(result.rows[0]);
  }

  async toggleComplete(userId: string, taskId: string): Promise<TaskResponse> {
    const result = await this.pool.query(
      `UPDATE tasks 
       SET completed = NOT completed, updated_at = NOW() 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      const error = new Error('Task not found');
      (error as any).statusCode = 404;
      (error as any).code = 'NOT_FOUND';
      throw error;
    }

    return formatTaskRecord(result.rows[0]);
  }

  async delete(userId: string, taskId: string): Promise<boolean> {
    const result = await this.pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );

    if (result.rowCount === 0) {
      const error = new Error('Task not found');
      (error as any).statusCode = 404;
      (error as any).code = 'NOT_FOUND';
      throw error;
    }

    return true;
  }

  async clearCompleted(userId: string): Promise<number> {
    const result = await this.pool.query(
      'DELETE FROM tasks WHERE user_id = $1 AND completed = TRUE',
      [userId]
    );

    return result.rowCount || 0;
  }

  async getStats(userId: string): Promise<TaskStats> {
    const totalRes = await this.pool.query(
      'SELECT COUNT(*) as count FROM tasks WHERE user_id = $1',
      [userId]
    );

    const completedRes = await this.pool.query(
      'SELECT COUNT(*) as count FROM tasks WHERE user_id = $1 AND completed = TRUE',
      [userId]
    );

    const priorityRes = await this.pool.query(
      'SELECT priority, COUNT(*) as count FROM tasks WHERE user_id = $1 GROUP BY priority',
      [userId]
    );

    const categoryRes = await this.pool.query(
      'SELECT DISTINCT category FROM tasks WHERE user_id = $1 ORDER BY category ASC',
      [userId]
    );

    const byPriority = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    };

    for (const row of priorityRes.rows) {
      if (row.priority in byPriority) {
        (byPriority as any)[row.priority] = parseInt(row.count, 10);
      }
    }

    const total = parseInt(totalRes.rows[0].count, 10);
    const completed = parseInt(completedRes.rows[0].count, 10);
    const pending = total - completed;

    return {
      total,
      completed,
      pending,
      byPriority,
      categories: categoryRes.rows.map((r: { category: string }) => r.category),
    };
  }
}
