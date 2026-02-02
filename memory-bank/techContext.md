# Tech Context — ROCR Digital

**Last Updated:** 2026-02-02

---

## rocr-landing Tech Stack

### Core Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.0 | UI framework |
| React DOM | 19.2.0 | DOM rendering |
| React Router DOM | 7.13.0 | Client-side routing (BrowserRouter, nested routes) |
| Vite | 7.2.2 | Build tool & dev server |
| Tailwind CSS | 4.1.17 | Utility-first CSS |
| Three.js | 0.181.1 | WebGL (ColorBends GLSL shader) |

### Animation & Graphics
| Library | Version | Purpose |
|---------|---------|---------|
| @react-three/fiber | 9.4.0 | React renderer for Three.js |
| @react-three/drei | 10.7.6 | Three.js helpers |
| motion | 12.23.24 | Scroll-triggered FadeIn animations |
| lenis | 1.3.15 | Smooth scroll (duration 1.2s) |
| gsap | 3.13.0 | GreenSock Animation (installed, partially used) |
| ogl | 1.0.11 | Lightweight WebGL (installed, used by some unused components) |
| maath | 0.10.8 | Math helpers for Three.js |

### UI & Styling
| Library | Purpose |
|---------|---------|
| tailwind-merge 3.4.0 | Merge Tailwind classes intelligently |
| clsx 2.1.1 | Conditional className builder |
| class-variance-authority 0.7.1 | Component variant system (CVA) |
| tw-animate-css 1.4.0 | Tailwind animation utilities |
| lucide-react 0.553.0 | Icon library |
| react-helmet-async 2.0.5 | SEO meta tags (title, OG, Twitter cards) |

### Dev Tools
| Tool | Purpose |
|------|---------|
| ESLint 9.39.1 (flat config) | Code linting |
| eslint-plugin-react-hooks 5.2.0 | React hooks rules |
| eslint-plugin-react-refresh 0.4.24 | Fast refresh compatibility |
| @vitejs/plugin-react 5.1.0 | React support for Vite |
| Bun | Package manager (bun.lock) |

### Commands (rocr-landing)
```bash
cd rocr-landing
bun install          # Install dependencies
bun run dev          # Dev server (HMR, default port)
bun run build        # Production build -> dist/
bun run preview      # Preview production build
bun run lint         # ESLint
```

---

## rocr-panel Tech Stack

### Core Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| Svelte | ^5.0.0 | UI framework (runes: $state, $derived, $props, $bindable) |
| Tauri | ^2.0.0 | Native app framework (Rust backend) |
| Vite | ^6.0.0 | Build tool & dev server |
| Bun | latest | Package manager & runtime |
| Rust | stable | Backend (Tauri core) |
| TailwindCSS | ^4.0.0 | Utility-first CSS |

### Frontend Dependencies (package.json)
| Library | Version | Purpose |
|---------|---------|---------|
| @tauri-apps/api | ^2.9.1 | JS API for Tauri invoke commands |
| @tauri-apps/plugin-shell | ^2.3.4 | Shell command execution |
| lucide-svelte | ^0.460.0 | Icon library (same icons as landing) |
| svelte-spa-router | ^4.0.1 | Hash-based SPA routing |

### Commands (rocr-panel)
```bash
cd rocr-panel
bun install                    # Install frontend deps
bun run dev                    # Vite dev server (port 1420)
bun run tauri dev              # Dev with Tauri native window
bun run tauri build            # Production build (desktop)
bun run tauri android build    # Build Android APK/AAB
```

---

## rocr-backend Tech Stack ⭐ NEW

### Core Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| Bun | latest | Runtime, package manager, test runner |
| Hono | ^4.0.0 | Ultra-fast web framework (edge-ready) |
| PostgreSQL | 16+ | Relational database |
| Drizzle ORM | ^0.39.0 | Type-safe SQL ORM |
| Drizzle Kit | ^0.30.0 | Migrations & schema management |
| Zod | ^3.24.0 | Runtime schema validation |

### Authentication & Security
| Library | Version | Purpose |
|---------|---------|---------|
| @hono/zod-validator | latest | Request validation middleware |
| jose | ^5.0.0 | JWT signing/verification (edge-compatible) |
| bcryptjs | ^3.0.0 | Password hashing (pure JS, Bun compatible) |
| @hono/cors | built-in | CORS middleware |

### Database & ORM
| Tool | Purpose |
|------|---------|
| drizzle-orm | Type-safe queries, relations, transactions |
| drizzle-kit | Schema migrations, studio UI |
| postgres (pg driver) | PostgreSQL client for Bun |
| drizzle-zod | Generate Zod schemas from Drizzle tables |

### Development Tools
| Tool | Purpose |
|------|---------|
| TypeScript | Type safety |
| dotenv | Environment variables |
| tsx | TypeScript execution (scripts) |

### Database Schema Overview
```
┌─────────────────────────────────────────────────────────────────┐
│                         CORE ENTITIES                          │
├─────────────────────────────────────────────────────────────────┤
│ users          │ Authentication, roles, profiles               │
│ sessions       │ Refresh tokens, device tracking               │
│ contacts       │ Lead submissions from landing page            │
├─────────────────────────────────────────────────────────────────┤
│                         CRM ENTITIES                           │
├─────────────────────────────────────────────────────────────────┤
│ projects       │ Client projects with status, dates            │
│ tasks          │ Project tasks with assignees, priority        │
│ milestones     │ Project milestones with deadlines             │
├─────────────────────────────────────────────────────────────────┤
│                    SCHEDULING ENTITIES                         │
├─────────────────────────────────────────────────────────────────┤
│ events         │ Calendar events, meetings                     │
│ schedules      │ User work schedules (weekly pattern)          │
│ off_days       │ User holidays, sick days, PTO                 │
├─────────────────────────────────────────────────────────────────┤
│                    TIME TRACKING ENTITIES                      │
├─────────────────────────────────────────────────────────────────┤
│ time_entries   │ Clock in/out, manual entries                  │
│ time_reports   │ Weekly/monthly summaries                      │
├─────────────────────────────────────────────────────────────────┤
│                    CONTENT ENTITIES                            │
├─────────────────────────────────────────────────────────────────┤
│ partners       │ Portfolio partners                            │
│ services       │ Service catalog                               │
│ content        │ Website content (hero, about, etc.)           │
│ team_profiles  │ Public team member profiles                   │
└─────────────────────────────────────────────────────────────────┘
```

### API Endpoints Structure
```
/api/v1
├── /auth
│   ├── POST   /login          # Login with email/password
│   ├── POST   /logout         # Logout (invalidate refresh token)
│   ├── POST   /refresh        # Refresh access token
│   └── POST   /password-reset # Request password reset
│
├── /users (Admin only)
│   ├── GET    /               # List all users
│   ├── POST   /               # Create new user (admin seeds)
│   ├── GET    /:id            # Get user by ID
│   ├── PATCH  /:id            # Update user
│   └── DELETE /:id            # Soft delete user
│
├── /contacts
│   ├── GET    /               # List contacts (with filters)
│   ├── POST   /               # Create contact (from landing)
│   ├── GET    /:id            # Get contact details
│   ├── PATCH  /:id            # Update status, add notes
│   └── DELETE /:id            # Archive contact
│
├── /projects
│   ├── GET    /               # List projects
│   ├── POST   /               # Create project
│   ├── GET    /:id            # Get project with tasks
│   ├── PATCH  /:id            # Update project
│   ├── DELETE /:id            # Archive project
│   └── /:id/tasks             # Nested task routes
│
├── /tasks
│   ├── GET    /               # List all tasks (with filters)
│   ├── POST   /               # Create task
│   ├── GET    /:id            # Get task details
│   ├── PATCH  /:id            # Update task
│   └── DELETE /:id            # Delete task
│
├── /calendar
│   ├── GET    /events         # Get events (date range)
│   ├── POST   /events         # Create event
│   ├── PATCH  /events/:id     # Update event
│   └── DELETE /events/:id     # Delete event
│
├── /schedule
│   ├── GET    /               # Get current user schedule
│   ├── PUT    /               # Set weekly schedule
│   ├── GET    /availability   # Check team availability
│   ├── POST   /off-days       # Request off day
│   └── GET    /off-days       # List off days
│
├── /time
│   ├── POST   /clock-in       # Start time tracking
│   ├── POST   /clock-out      # Stop time tracking
│   ├── GET    /entries        # List time entries
│   ├── POST   /entries        # Manual time entry
│   ├── PATCH  /entries/:id    # Update entry
│   └── GET    /reports        # Generate time reports
│
├── /content
│   ├── GET    /               # Get all content
│   ├── PATCH  /:section       # Update content section
│   └── GET    /partners       # Public partner list
│
└── /health
    └── GET    /               # Health check
```

### Commands (rocr-backend)
```bash
cd rocr-backend
bun install                    # Install dependencies
bun run dev                    # Dev server with hot reload (port 3000)
bun run build                  # Bundle for production
bun run start                  # Start production server
bun run db:generate            # Generate migrations from schema
bun run db:migrate             # Run pending migrations
bun run db:push                # Push schema directly (dev)
bun run db:studio              # Open Drizzle Studio
bun run db:seed                # Seed initial admin user
bun run test                   # Run tests
```

### Environment Variables (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/rocr_db

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Admin Seed
ADMIN_EMAIL=admin@rocrdigital.com
ADMIN_PASSWORD=initial-password-change-me

# Server
PORT=3000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:1420
```

---

## Shared Configuration

### Development Ports
| Service | Port | Purpose |
|---------|------|---------|
| rocr-landing | 5173 | Vite dev server |
| rocr-panel | 1420 | Tauri/Vite dev server |
| rocr-backend | 3000 | Hono API server |
| PostgreSQL | 5432 | Database |
| Drizzle Studio | 4983 | Database UI |

### Authentication Flow
```
1. User opens rocr-panel
2. Panel shows login screen
3. User enters credentials
4. POST /api/v1/auth/login → { accessToken, refreshToken }
5. Panel stores tokens (secure storage)
6. All subsequent requests include: Authorization: Bearer <accessToken>
7. On 401, try POST /api/v1/auth/refresh with refreshToken
8. On refresh failure, redirect to login
```

### User Roles
| Role | Permissions |
|------|-------------|
| Admin | Full access, user management, settings |
| Manager | Project management, team schedules, reports |
| Employee | Own projects, tasks, schedule, time tracking |
| Freelancer | Assigned tasks, own time tracking only |

---

## CI/CD

### Existing Workflows
- **release-panel.yml** — Multi-platform Tauri builds

### New Workflow (to be created)
- **deploy-backend.yml** — Deploy rocr-backend to:
  - Railway / Render / Fly.io (recommended)
  - Or self-hosted Docker container

---

## File Counts Summary

### rocr-landing
- **src/pages/**: 6 files
- **src/components/**: 22 files
- **src/layouts/**: 1 file

### rocr-panel
- **src/lib/pages/**: 7 files → expanding to 11+ (new CRM modules)
- **src/lib/components/**: 6 files → expanding
- **src/lib/stores/**: 2 files → adding auth store

### rocr-backend (new)
- **src/routes/**: ~10 route files
- **src/db/schema/**: ~8 schema files
- **src/middleware/**: ~4 middleware files
- **src/services/**: ~6 service files
