# Spec: C-137 Task Protocol (Todo Fullstack App)

## Objective
A secure, high-performance, accessible fullstack task management web application with user authentication (registration, login, logout, session persistence), categorized task tracking, priority management, due dates, filtering, search, and progress metrics. Built on Node.js, PostgreSQL, and React.

## Capability Map
| Module ID | Responsibility | Depends on |
|---|---|---|
| db-postgres | PostgreSQL connection pool, automatic database creation, schema initialization, auto-seeding | — |
| auth-service | User registration, password hashing, JWT session cookies, rate-limiting | db-postgres |
| task-service | CRUD operations for tasks, user data isolation, filtering & sorting | db-postgres, auth-service |
| ui-client | React frontend, design tokens, zero-emoji SVG icons, responsive layout, accessible forms | auth-service, task-service |

## Tech Stack
- Frontend: React 18+, TypeScript, Vite, Tailwind CSS (Design Token CSS variables).
- Backend: Node.js 22 LTS, Express, TypeScript, PostgreSQL (`pg` connection pool) with parameterized queries (`$1`, `$2`).
- Database: PostgreSQL (local or remote instance) with automatic database provisioning, DDL, and auto-seeding.
- Security: bcryptjs (12 salt rounds), jsonwebtoken, httpOnly secure SameSite cookies, helmet security headers, cors, express-rate-limit, Zod boundary validation.
- Testing: Vitest.
- Package Manager: pnpm.

## Commands
```bash
Install: pnpm install
Dev (Fullstack): pnpm dev
Build: pnpm build
Seed Database: pnpm --filter server seed
Test: pnpm test
Lint: pnpm lint
```

## Project Structure
```
c137-todo/
├── SPEC.md
├── DESIGN.md
├── tasks/
│   ├── plan.md
│   └── todo.md
├── server/
│   ├── src/
│   │   ├── config/       # Environment & PostgreSQL connection config
│   │   ├── db/           # PostgreSQL pool, schema DDL, auto-seeder
│   │   ├── middleware/   # Auth check, error handler, rate limit
│   │   ├── routes/       # Auth routes, Task routes
│   │   ├── services/     # Auth service, Task service
│   │   ├── types/        # Shared DTOs and Zod schemas
│   │   ├── app.ts        # Express app configuration
│   │   └── index.ts      # Server entry point
│   ├── tests/            # Test suite directory
│   └── package.json
├── client/
│   ├── src/
│   │   ├── api/          # Typed API client
│   │   ├── components/   # UI components with clean SVG icons
│   │   ├── context/      # Auth and Task state
│   │   ├── types/        # Frontend types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── package.json
└── package.json          # Workspace root scripts
```

## Code Style & Conventions
- Pure TypeScript with strict null checks.
- Zero unicode emojis anywhere in code, comments, UI, or tests.
- Real inline SVG icons with `currentColor` and `aria-hidden="true"`.
- Zod schemas for all request boundary validations.
- Parameterized PostgreSQL queries only (`$1`, `$2`).

## Boundaries
- **Always:** Validate inputs at boundaries with Zod, parameterize all DB queries, hash passwords with bcrypt, use httpOnly cookies for JWT, enforce keyboard accessibility.
- **Never:** Commit plaintext secrets, store JWT in localStorage, use Unicode emojis, or bypass security headers.
