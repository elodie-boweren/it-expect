# C-137 Task Protocol

A cross-platform fullstack task management platform built with Node.js/Express, PostgreSQL, and React. Runs identically on Linux, macOS, and Windows.

---

## 1. Quickstart (Linux / macOS / Windows)

### Prerequisites
- Node.js 22+ (LTS)
- pnpm 9+ (`npm install -g pnpm`)
- PostgreSQL 14+ service running locally or on a remote host

### Installation & Environment Setup

1. **Install workspace dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure Database Connection:**
   - On **Linux / macOS**:
     ```bash
     cp server/.env.example server/.env
     ```
   - On **Windows (PowerShell)**:
     ```powershell
     Copy-Item server/.env.example server/.env
     ```
   - On **Windows (CMD)**:
     ```cmd
     copy server\.env.example server\.env
     ```

   Edit `server/.env` with your PostgreSQL connection string (the target database does **not** need to be created manually):
   ```env
   PORT=4000
   NODE_ENV=development
   DATABASE_URL=postgresql://postgres:password@localhost:5432/c137_todo
   JWT_SECRET=c137-quantum-portal-secret-key-32-chars-min-prod
   CLIENT_ORIGIN=http://localhost:3000
   ```

3. **Start the Application:**
   ```bash
   # Starts both backend (port 4000) and frontend (port 3000) concurrently
   pnpm dev
   ```
   > **Note on Database Provisioning**: If the database (e.g. `c137_todo`) does not exist yet on your PostgreSQL server, the backend automatically provisions it, applies the DDL schema, and seeds default accounts and tasks automatically.

4. **Build Production Artifacts:**
   ```bash
   pnpm build
   ```

5. **Run Tests:**
   ```bash
   pnpm test
   ```

---

## 2. Automatic Database Provisioning & Auto-Seeder

### Automatic Database Creation
The backend includes built-in database provisioning logic:
- On startup, the server parses `DATABASE_URL` and checks whether the target database exists.
- If the database is missing, it connects to PostgreSQL's default administrative instance, executes `CREATE DATABASE "<target_db>"`, and switches to the newly created database.
- No manual `createdb` or `psql -c "CREATE DATABASE ..."` command is required.

### Schema Initialization & Seeding
- The application automatically applies all table definitions (`users`, `tasks`), foreign keys, constraints, and indexes.
- If the `users` table is empty (`COUNT(*) === 0`), it automatically populates demo universe accounts with sample tasks across varied relative dates.

You can also run the seed script manually at any time on any platform:
```bash
pnpm seed
```

### Pre-Seeded Accounts
1. **Rick Sanchez**
   - Email: `rick@c137.universe`
   - Password: `portal_gun_password_123`
2. **Summer Smith**
   - Email: `summer@c137.universe`
   - Password: `password123`
3. **Morty Smith**
   - Email: `morty@c137.universe`
   - Password: `password123`
4. **Dr. Beth Smith**
   - Email: `beth@c137.universe`
   - Password: `password123`

---

## 3. Cross-Platform Compatibility

- **OS Support**: Tested and verified on **Linux** (Debian, Ubuntu, Arch, Fedora), **macOS** (Apple Silicon M-series & Intel), and **Windows 10/11** (PowerShell, Command Prompt, WSL2).
- **Line Endings**: Normalized via `.gitattributes` (`eol=lf`).
- **Path Handling**: Standard Node.js path normalization and in-memory schema DDL without OS-specific path delimiters.
- **Pure JavaScript Driver**: Utilizes `pg` (PostgreSQL pure JS driver) with zero native compilation dependencies, ensuring zero binary build failures on Windows, ARM64, or x86_64.

---

## 4. System Architecture

- **Backend**: Node.js 22 LTS, Express, PostgreSQL (`pg` connection pool), TypeScript, Zod, bcryptjs, jsonwebtoken, Helmet, CORS, Cookie-Parser.
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, SVG vector icons.
- **Database**: PostgreSQL with automatic database provisioning, UUID primary keys, timestamp tracking, foreign keys with `ON DELETE CASCADE`, and query indexes.
- **Security**: Strict multi-tenant isolation (`user_id` scoping), password hashing with bcrypt, `httpOnly` secure `SameSite=lax` session cookies, rate-limiting on auth endpoints, and Zod input boundary validation.
- **UI Standard**: Pure SVG vector icons with `currentColor` (Strictly zero Unicode emojis).

---

## 5. API Reference

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (`email`, `password`, `name`) | No |
| `POST` | `/api/auth/login` | Authenticate user and issue `httpOnly` session cookie | No |
| `POST` | `/api/auth/logout` | Revoke session and clear cookies | No |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile | Yes |

### Task Management Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/tasks` | List tasks with filters (`status`, `priority`, `category`, `search`, `sortBy`, `sortOrder`) | Yes |
| `GET` | `/api/tasks/stats` | Retrieve aggregate metrics (total, completed, pending, by priority) | Yes |
| `GET` | `/api/tasks/:id` | Retrieve single task by ID | Yes |
| `POST` | `/api/tasks` | Create a new task directive (`title`, `description`, `priority`, `category`, `dueDate`) | Yes |
| `PATCH` | `/api/tasks/:id` | Update task properties | Yes |
| `POST` | `/api/tasks/:id/toggle` | Toggle task completion status (`completed = !completed`) | Yes |
| `DELETE` | `/api/tasks/:id` | Delete specific task | Yes |
| `DELETE` | `/api/tasks/completed/clear` | Clear all completed tasks for the authenticated user | Yes |
