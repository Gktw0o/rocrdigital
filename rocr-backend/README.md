# ROCR Backend API

CRM backend API for ROCR Digital ecosystem. Built with Bun + Hono + PostgreSQL + Drizzle.

## Tech Stack

- **Runtime:** Bun
- **Framework:** Hono
- **Database:** PostgreSQL
- **ORM:** Drizzle
- **Auth:** JWT (jose) + bcryptjs
- **Validation:** Zod

## Quick Start

### 1. Install Dependencies

```bash
bun install
```

### 2. Setup PostgreSQL

Make sure you have PostgreSQL running. Create a database:

```sql
CREATE DATABASE rocr_db;
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Update `DATABASE_URL` with your PostgreSQL credentials.

### 4. Push Schema to Database

```bash
bun run db:push
```

### 5. Seed Admin User

```bash
bun run db:seed
```

### 6. Start Development Server

```bash
bun run dev
```

Server will start at http://localhost:3000

## API Endpoints

### Health Check
- `GET /health` - Health status
- `GET /health/ready` - Readiness check
- `GET /health/live` - Liveness check

### Authentication
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Current user
- `POST /api/v1/auth/update-password` - Update password

### Users (Admin Only)
- `GET /api/v1/users` - List users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/:id` - Get user
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Deactivate user
- `POST /api/v1/users/:id/reset-password` - Reset password

### Contacts
- `POST /api/v1/contacts` - Submit contact (public)
- `GET /api/v1/contacts` - List contacts
- `GET /api/v1/contacts/:id` - Get contact
- `PATCH /api/v1/contacts/:id` - Update contact
- `DELETE /api/v1/contacts/:id` - Delete contact
- `GET /api/v1/contacts/stats/summary` - Contact stats

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start dev server with hot reload |
| `bun run start` | Start production server |
| `bun run db:generate` | Generate migrations |
| `bun run db:migrate` | Run migrations |
| `bun run db:push` | Push schema to database |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run db:seed` | Seed admin user |

## Project Structure

```
rocr-backend/
├── src/
│   ├── index.ts           # App entry point
│   ├── routes/            # API route handlers
│   │   ├── auth.ts        # Authentication
│   │   ├── users.ts       # User management
│   │   ├── contacts.ts    # Contact form
│   │   └── health.ts      # Health checks
│   ├── db/
│   │   ├── index.ts       # Database connection
│   │   ├── seed.ts        # Seed script
│   │   └── schema/        # Drizzle schemas
│   ├── middleware/        # Hono middleware
│   │   ├── auth.ts        # JWT verification
│   │   ├── roles.ts       # Role-based access
│   │   └── error.ts       # Error handling
│   └── utils/             # Helper functions
│       ├── jwt.ts         # JWT utilities
│       └── password.ts    # Password hashing
├── drizzle.config.ts      # Drizzle configuration
├── package.json
└── .env                   # Environment variables
```

## License

Private - ROCR Digital
