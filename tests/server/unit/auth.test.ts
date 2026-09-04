import {describe, it, vi, expect} from 'vitest';
import {AuthService} from '../../../server/src/services/authService.ts';
import bcrypt from 'bcryptjs';

describe('authentication', () => {

    const user = {
    id: 'user-123',
    email: 'alice@example.com',
    name: 'Alice',
    created_at: '2026-09-04T10:00:00.000Z',
    updated_at: '2026-09-04T10:00:00.000Z',
    };

    const password = 'Password123!';
    const passwordHash = bcrypt.hashSync(password, 4);

    function createMockPool() {
        return {
        query: vi.fn(),
        } as any;
    }


    it('AU-01 - should authenticate a user with valid credentials', async () => {
       const pool = createMockPool();

         // First query: check whether the email already exists.
      // Second query: insert the new user.
      pool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({
          rows: [user],
        });

      const authService = new AuthService(pool);

      const result = await authService.register({
        email: ' Alice@Example.com ',
        password,
        name: ' Alice ',
      });

      expect(result.user).toEqual({
        id: 'user-123',
        email: 'alice@example.com',
        name: 'Alice',
        createdAt: '2026-09-04T10:00:00.000Z',
      });

      expect(result.token).toEqual(expect.any(String));

      expect(pool.query).toHaveBeenCalledTimes(2);

      // The service trims the email and name and stores the email in lowercase.
      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
        ['Alice@Example.com'],
      );

      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('INSERT INTO users'),
        ['alice@example.com', 'Alice', expect.any(String)],
      );
    });
    })
