# Implementation Plan: C-137 Task Protocol (PostgreSQL Edition)

## Overview
Fullstack task management system with authentication, built on Node.js/Express/TypeScript/PostgreSQL and React/Vite/TypeScript/Tailwind CSS.

## Architecture Decisions
1. **Database:** PostgreSQL (`pg` connection pool) with parameterized statements (`$1`, `$2`), UUID primary keys, and auto-seeding on empty database.
2. **Authentication:** Session tokens via JWT stored in httpOnly, SameSite=lax secure cookies, preventing XSS-based token theft.
3. **Validation:** Zod schemas at API boundaries for parsing and strict type-safety.
4. **Security Hardening:** `helmet` for HTTP headers, `express-rate-limit` for brute-force protection on `/api/auth/*`, `cors` whitelist, password hashing using `bcryptjs` with 12 rounds.
5. **Frontend State & Design:** React Context for Auth and Tasks, zero unicode emojis, 100% SVG icons, Rick & Morty dark theme.

## Dependency Graph
```
PostgreSQL Database & Connection Pool
   └── Schema DDL & Auto-Seeding Engine
         └── Auth Service (Async PG Pool)
               └── Auth Routes & Cookie Middleware
                     └── Task Service (Async PG Pool)
                           └── Task Routes & Protection
                                 └── Frontend API Client & Auth Context
                                       └── UI Components (Auth, TaskList, TaskItem, FilterBar, Metrics)
```
