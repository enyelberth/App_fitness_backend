# Development Guide

## Quick Start

### Prerequisites
- **Node.js 20.x** or higher
- **pnpm 9.x** or higher
- **Docker** and **Docker Compose** (for local database and containers)
- **PostgreSQL 16** (via Docker, recommended)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/enyelberth/App_fitness_backend.git
   cd App_fitness_backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   DATABASE_URL=postgresql://fitness_dev:fitness_dev_password@localhost:5432/fitness_db
   JWT_ACCESS_SECRET=your_32_char_secret_key_for_access_token_minimum
   JWT_REFRESH_SECRET=your_32_char_secret_key_for_refresh_token_minimum
   CORS_ORIGINS=http://localhost:3000,http://localhost:4000
   PORT=4000
   NODE_ENV=development
   ```

4. **Start the database with Docker Compose**
   ```bash
   docker-compose up -d postgres
   ```

5. **Run Prisma migrations**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

6. **Start the development server**
   ```bash
   pnpm start:dev
   ```

The API will be available at `http://localhost:4000/api/v1`
Swagger documentation: `http://localhost:4000/docs`

---

## Project Structure

```
src/
├── main.ts                    # NestJS bootstrap entry point
├── app.module.ts              # Root application module
├── config/
│   └── env.validation.ts      # Environment variable validation
├── database/
│   ├── database.module.ts     # Database module (Prisma setup)
│   └── prisma.service.ts      # Prisma client wrapper
├── modules/
│   ├── health/                # Health check endpoint
│   ├── payments/              # Payment integrations (PayPal, Binance)
│   ├── economy/               # Financial management
│   ├── exercise/              # Fitness exercises
│   ├── products/              # Product catalog
│   └── routines/              # Workout routines
└── ...
prisma/
├── schema.prisma              # Database schema
├── seed.ts                    # Database seeding
└── migrations/                # Migration history
```

---

## Common Development Tasks

### Database Management

**Generate Prisma Client** (required after schema changes)
```bash
pnpm db:generate
```

**Create a new migration**
```bash
pnpm db:migrate
```

**Run database seed**
```bash
pnpm db:seed
```

**Reset database** (⚠️ destructive)
```bash
# CLI will prompt before executing
pnpm db:migrate:reset
```

### Code Quality

**Run ESLint**
```bash
pnpm lint              # Check and report
pnpm lint --fix        # Auto-fix issues
```

**Format code with Prettier**
```bash
pnpm format
```

**Run tests**
```bash
pnpm test              # Single run
pnpm test:watch        # Watch mode
pnpm test:cov          # With coverage report
```

### Building & Running

**Development mode** (with hot reload)
```bash
pnpm start:dev
```

**Production build**
```bash
pnpm build             # Compiles to dist/
```

**Run production build**
```bash
pnpm start:prod        # Requires build first
```

---

## Docker Workflow

### Local Development with Docker Compose

Start all services (PostgreSQL + API in dev mode):
```bash
docker-compose up
```

Start only PostgreSQL:
```bash
docker-compose up -d postgres
```

Stop services:
```bash
docker-compose down
```

View logs:
```bash
docker-compose logs -f api    # API logs
docker-compose logs -f postgres  # Database logs
```

### Building Docker Images

**Production image**
```bash
docker build -t fitness-api:latest .
docker run -p 4000:4000 fitness-api:latest
```

**Development image**
```bash
docker build -f Dockerfile.dev -t fitness-api:dev .
docker run -p 4000:4000 -p 9229:9229 fitness-api:dev
```

---

## Debugging

### Node Debugger

When running with `pnpm start:dev`, the debugger is available on port 9229.

**Chrome DevTools:**
1. Open `chrome://inspect`
2. Click "Inspect" on the running process
3. Use the debugger normally

**VS Code:**
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "attach",
  "name": "Attach",
  "port": 9229,
  "skipFiles": ["<node_internals>/**"]
}
```

### Console Logs & Debugging

Use standard Node.js practices:
```typescript
// Only console.warn and console.error are allowed in production
console.warn('Warning message');    // ✓ ESLint passes
console.error('Error message');     // ✓ ESLint passes
console.log('Debug message');       // ✗ ESLint error (unless in dev)
```

---

## Environment Variables

### Required Variables (CI will fail without these)

| Variable | Description | Min Length |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_ACCESS_SECRET` | JWT access token secret | 32 chars |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | 32 chars |
| `CORS_ORIGINS` | Comma-separated CORS origins | - |

### Optional Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `4000` | API server port |
| `NODE_ENV` | `development` | Environment (development/production/test) |

### Example `.env.local`

```env
DATABASE_URL=postgresql://fitness_dev:fitness_dev_password@localhost:5432/fitness_db
JWT_ACCESS_SECRET=your_very_long_secret_key_with_at_least_32_chars_here
JWT_REFRESH_SECRET=another_very_long_secret_key_with_at_least_32_chars_here
CORS_ORIGINS=http://localhost:3000,http://localhost:4000,http://127.0.0.1:3000
PORT=4000
NODE_ENV=development
```

---

## Troubleshooting

### Port Already in Use
```bash
# On Linux/Mac
lsof -i :4000
kill -9 <PID>

# On Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### PostgreSQL Connection Failed
```bash
# Verify container is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Restart
docker-compose restart postgres
```

### Dependencies Installation Issues
```bash
# Clear pnpm cache
pnpm store prune

# Reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Prisma Client Out of Sync
```bash
# Regenerate after schema changes
pnpm db:generate
```

---

## Code Style & Conventions

### TypeScript

- Use **strict mode** enabled (tsconfig.json)
- Explicit return types on all functions
- Avoid `any` type (ESLint enforces)
- Use `const` by default, `let` only when needed
- Use type imports: `import type { Type } from '...`

### NestJS

- Use **dependency injection** for all services
- Decorators: `@Controller`, `@Service`, `@Module`, `@Inject`
- Single responsibility per class
- Use DTOs for request/response validation

### File Naming

- **Controllers**: `*.controller.ts` (e.g., `user.controller.ts`)
- **Services**: `*.service.ts` (e.g., `user.service.ts`)
- **Modules**: `*.module.ts` (e.g., `user.module.ts`)
- **DTOs**: `*.dto.ts` (e.g., `create-user.dto.ts`)
- **Tests**: `*.spec.ts` (e.g., `user.service.spec.ts`)

---

## Git Workflow

### Branch Naming
- Feature: `feature/feature-name`
- Bugfix: `fix/bug-name`
- Development: `enyelberth-dev`
- Production: `master`

### Commit Messages
```
type(scope): short description

Longer explanation if needed.

Closes #123
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Before Pushing
```bash
pnpm lint --fix
pnpm format
pnpm test
git add .
git commit -m "type(scope): description"
```

---

## Health Check Endpoint

The API includes a health check endpoint:

**Endpoint:** `GET /api/v1/health`

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:45.123Z"
}
```

This is used by Docker, health checks, and monitoring systems to verify the API is running.

---

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [ESLint Rules](https://eslint.org/docs/latest/rules/)
