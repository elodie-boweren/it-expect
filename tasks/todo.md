# Tasks & Checkpoints: C-137 Task Protocol (PostgreSQL Edition)

## Phase 1: PostgreSQL Infrastructure & Database Layer
- [x] Task 1.1: Install `pg` and `@types/pg` packages.
- [x] Task 1.2: Implement PostgreSQL connection pool, schema DDL, and environment variables in `server/src/config/` and `server/src/db/`.
- [x] Task 1.3: Implement auto-seeder engine (`seedDatabase`) to populate default users and tasks when the database is empty.

## Phase 2: Async PostgreSQL Service Refactor
- [x] Task 2.1: Refactor `AuthService` to async PostgreSQL queries (`$1`, `$2`) with parameterized inputs.
- [x] Task 2.2: Refactor `TaskService` to async PostgreSQL queries with multi-tenant isolation, filtering, and stats.
- [x] Task 2.3: Update Express routes and middleware to handle async database services.

## Phase 3: UI & Theming
- [x] Task 3.1: Implement Rick & Morty high-fidelity cyber design system.
- [x] Task 3.2: Implement telemetry HUD and vector icon registry.
- [x] Task 3.3: Provide dual Sign In & Registration clearance interface.

## Phase 4: Fullstack Verification & Packaging
- [x] Task 4.1: Update `README.md` with setup instructions and API reference.
- [x] Task 4.2: Verify builds (`pnpm build`), auto-seeding, and client-server integration.
