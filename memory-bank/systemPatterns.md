# System Patterns — ROCR Digital

**Last Updated:** 2026-02-02

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ROCR Digital Ecosystem                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────┐                      ┌───────────────────┐          │
│  │   rocr-landing    │    Contact Form      │   rocr-backend    │          │
│  │   (React + Vite)  │ ─────────────────▶   │  (Bun + Hono)     │          │
│  │                   │                      │                   │          │
│  │  • Public website │                      │  • REST API       │          │
│  │  • WebGL effects  │                      │  • Authentication │          │
│  │  • Contact form   │                      │  • Business logic │          │
│  └───────────────────┘                      └─────────┬─────────┘          │
│                                                       │                     │
│                                                       │ PostgreSQL          │
│                                                       ▼                     │
│  ┌───────────────────┐     REST API + JWT   ┌───────────────────┐          │
│  │    rocr-panel     │ ◀───────────────────▶│    Database       │          │
│  │  (Svelte + Tauri) │                      │   (PostgreSQL)    │          │
│  │                   │                      │                   │          │
│  │  • CRM client     │                      │  • Users          │          │
│  │  • Native apps    │                      │  • Projects       │          │
│  │  • Time tracking  │                      │  • Time entries   │          │
│  └───────────────────┘                      └───────────────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## rocr-landing Architecture

### Multi-Page Application with React Router
```
main.jsx -> BrowserRouter -> HelmetProvider -> ThemeProvider -> App.jsx
  └── Suspense (PageLoader fallback)
      └── Routes
          └── Route element={MainLayout}
              ├── / -> HomePage (lazy)
              ├── /partners -> PartnersPage (lazy)
              ├── /services -> ServicesPage (lazy)
              ├── /about -> AboutPage (lazy)
              ├── /contact -> ContactPage (lazy)
              └── /site-map -> SiteMapPage (lazy)
```

### MainLayout Structure
```
MainLayout.jsx
├── ColorBends (Suspense lazy, fixed, z-0, pointer-events-none)
├── Readability Scrim (dark mode only, z-1, bg-black/50)
├── Navbar (fixed, z-50)
├── <Outlet /> (z-10, pt-24, page content)
├── Footer
└── Lenis (smooth scroll, scroll-to-top on route change)
```

### Key Patterns
- **Theme:** React Context + `data-theme` attribute + localStorage + OS preference
- **Styling:** Conditional ternary class strings (not Tailwind `dark:` variant)
- **Animation:** `<FadeIn direction="up" delay={0.1}>` wrapper on all content sections
- **WebGL:** ColorBends shader in MainLayout (fixed, z-0, pointer-events-none)
- **Code Splitting:** React.lazy() per page + manualChunks
- **SEO:** `<SEO title="..." description="..." path="/..." />` on every page

### Contact Form → Backend Integration (NEW)
```javascript
// ContactPage.jsx - Form submission
const handleSubmit = async (formData) => {
  const response = await fetch(`${API_URL}/api/v1/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      source: 'landing-contact-form'
    })
  });
  // Handle response...
};
```

---

## rocr-panel Architecture

### Svelte 5 + Tauri Application
```
index.html -> src/main.js -> mount(App, #app)
  └── App.svelte
      ├── AuthGuard (checks JWT token)
      │   ├── LoginPage (if not authenticated)
      │   └── MainApp (if authenticated)
      │       ├── Sidebar.svelte (collapsible, nav items by role)
      │       ├── Header.svelte (user info, notifications, theme)
      │       └── <main>
      │           └── Router (svelte-spa-router)
```

### Route Structure (Expanded for CRM)
```
Router Routes:
├── /                  -> Dashboard.svelte
├── /contacts          -> Contacts.svelte
├── /partners          -> Partners.svelte
├── /services          -> Services.svelte
├── /content           -> Content.svelte
├── /team              -> Team.svelte
├── /projects          -> Projects.svelte        ⭐ NEW
├── /projects/:id      -> ProjectDetail.svelte   ⭐ NEW
├── /calendar          -> Calendar.svelte        ⭐ NEW
├── /schedule          -> Schedule.svelte        ⭐ NEW
├── /time-tracking     -> TimeTracking.svelte    ⭐ NEW
├── /reports           -> Reports.svelte         ⭐ NEW
└── /settings          -> Settings.svelte
```

### State Management (Expanded)

#### Stores Structure
```
src/lib/stores/
├── auth.js           # Authentication state, JWT tokens, user info ⭐ NEW
├── theme.js          # Dark/light theme
├── data.js           # Legacy in-memory data (being replaced by API)
├── projects.js       # Projects & tasks state ⭐ NEW
├── calendar.js       # Events & schedules ⭐ NEW
├── time.js           # Time tracking entries ⭐ NEW
└── api.js            # API client with auth headers ⭐ NEW
```

#### Auth Store Pattern (NEW)
```javascript
// src/lib/stores/auth.js
import { writable, derived } from 'svelte/store';

function createAuthStore() {
  const { subscribe, set, update } = writable({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true
  });

  return {
    subscribe,
    login: async (email, password) => { /* POST /auth/login */ },
    logout: async () => { /* POST /auth/logout, clear tokens */ },
    refresh: async () => { /* POST /auth/refresh */ },
    initialize: async () => { /* Check stored tokens on app start */ }
  };
}

export const auth = createAuthStore();
export const isAdmin = derived(auth, $auth => $auth.user?.role === 'admin');
```

#### API Client Pattern (NEW)
```javascript
// src/lib/stores/api.js
import { get } from 'svelte/store';
import { auth } from './auth.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function apiRequest(endpoint, options = {}) {
  const { accessToken } = get(auth);
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': accessToken ? `Bearer ${accessToken}` : '',
      ...options.headers
    }
  });

  if (response.status === 401) {
    // Try to refresh token
    const refreshed = await auth.refresh();
    if (!refreshed) {
      auth.logout();
      throw new Error('Session expired');
    }
    // Retry request with new token
    return apiRequest(endpoint, options);
  }

  return response.json();
}

export const api = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, data) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  patch: (endpoint, data) => apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' })
};
```

### Svelte 5 Runes Patterns
```javascript
// Component props
let { collapsed = $bindable(false) } = $props();

// Reactive state
let searchQuery = $state("");
let selectedProject = $state(null);

// Derived computations
const filteredProjects = $derived(
  projects.filter(p => p.name.includes(searchQuery))
);

// Effects for API calls
$effect(() => {
  if (selectedProject) {
    loadProjectTasks(selectedProject.id);
  }
});
```

---

## rocr-backend Architecture ⭐ NEW

### Hono Application Structure
```
src/index.ts -> Hono app
├── Global Middleware
│   ├── cors()           # CORS for landing & panel origins
│   ├── logger()         # Request logging
│   ├── secureHeaders()  # Security headers
│   └── errorHandler()   # Global error handling
│
├── Route Groups
│   ├── /api/v1/auth     -> authRoutes
│   ├── /api/v1/users    -> userRoutes (admin only)
│   ├── /api/v1/contacts -> contactRoutes
│   ├── /api/v1/projects -> projectRoutes
│   ├── /api/v1/tasks    -> taskRoutes
│   ├── /api/v1/calendar -> calendarRoutes
│   ├── /api/v1/schedule -> scheduleRoutes
│   ├── /api/v1/time     -> timeRoutes
│   ├── /api/v1/content  -> contentRoutes
│   └── /health          -> healthRoutes
│
└── Database Connection (Drizzle + PostgreSQL)
```

### File Structure
```
rocr-backend/
├── src/
│   ├── index.ts              # Entry point, Hono app setup
│   ├── routes/
│   │   ├── auth.ts           # Login, logout, refresh, password reset
│   │   ├── users.ts          # User CRUD (admin only)
│   │   ├── contacts.ts       # Contact form submissions
│   │   ├── projects.ts       # Project management
│   │   ├── tasks.ts          # Task management
│   │   ├── calendar.ts       # Events & meetings
│   │   ├── schedule.ts       # Work schedules, off-days
│   │   ├── time.ts           # Time tracking entries
│   │   ├── content.ts        # Website content management
│   │   └── health.ts         # Health check endpoint
│   │
│   ├── db/
│   │   ├── index.ts          # Drizzle client setup
│   │   ├── schema/
│   │   │   ├── users.ts      # Users, sessions tables
│   │   │   ├── contacts.ts   # Contacts table
│   │   │   ├── projects.ts   # Projects, tasks, milestones
│   │   │   ├── calendar.ts   # Events table
│   │   │   ├── schedule.ts   # Schedules, off_days tables
│   │   │   ├── time.ts       # Time entries table
│   │   │   └── content.ts    # Partners, services, content
│   │   └── migrations/       # Generated migration files
│   │
│   ├── middleware/
│   │   ├── auth.ts           # JWT verification middleware
│   │   ├── roles.ts          # Role-based access control
│   │   ├── validate.ts       # Zod validation middleware
│   │   └── error.ts          # Error handling middleware
│   │
│   ├── services/
│   │   ├── auth.ts           # Authentication logic
│   │   ├── users.ts          # User business logic
│   │   ├── projects.ts       # Project business logic
│   │   ├── time.ts           # Time calculation logic
│   │   └── reports.ts        # Report generation
│   │
│   └── utils/
│       ├── jwt.ts            # JWT helpers (sign, verify)
│       ├── password.ts       # Bcrypt helpers
│       └── date.ts           # Date/time utilities
│
├── drizzle.config.ts         # Drizzle Kit configuration
├── package.json
├── tsconfig.json
├── .env.example
└── .env                      # Local environment (gitignored)
```

### Drizzle Schema Patterns
```typescript
// src/db/schema/users.ts
import { pgTable, text, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['admin', 'manager', 'employee', 'freelancer']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  role: userRoleEnum('role').default('employee').notNull(),
  avatarUrl: text('avatar_url'),
  hourlyRate: numeric('hourly_rate', { precision: 10, scale: 2 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  refreshToken: text('refresh_token').notNull(),
  userAgent: text('user_agent'),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Route Handler Pattern
```typescript
// src/routes/projects.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import { db } from '../db';
import { projects, tasks } from '../db/schema/projects';

const projectRouter = new Hono();

// All routes require authentication
projectRouter.use('*', authMiddleware);

// List projects
projectRouter.get('/', async (c) => {
  const user = c.get('user');
  const userProjects = await db.query.projects.findMany({
    where: (projects, { eq, or }) => 
      user.role === 'admin' 
        ? undefined 
        : or(eq(projects.ownerId, user.id), eq(projects.assignedTo, user.id)),
    with: { tasks: true }
  });
  return c.json({ data: userProjects });
});

// Create project (manager+ only)
projectRouter.post('/',
  requireRole(['admin', 'manager']),
  zValidator('json', z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    clientName: z.string().optional(),
    startDate: z.string().datetime().optional(),
    dueDate: z.string().datetime().optional(),
  })),
  async (c) => {
    const data = c.req.valid('json');
    const user = c.get('user');
    
    const [project] = await db.insert(projects).values({
      ...data,
      ownerId: user.id,
      status: 'planning'
    }).returning();
    
    return c.json({ data: project }, 201);
  }
);

export default projectRouter;
```

### Authentication Middleware Pattern
```typescript
// src/middleware/auth.ts
import { Context, Next } from 'hono';
import { verify } from '../utils/jwt';
import { db } from '../db';
import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7);
  
  try {
    const payload = await verify(token, process.env.JWT_SECRET!);
    const [user] = await db.select().from(users).where(eq(users.id, payload.sub));
    
    if (!user || !user.isActive) {
      return c.json({ error: 'User not found or inactive' }, 401);
    }

    c.set('user', user);
    await next();
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
}
```

### Time Tracking Calculations
```typescript
// src/services/time.ts
export function calculateWorkHours(entries: TimeEntry[]): WorkHoursSummary {
  let totalMinutes = 0;
  let billableMinutes = 0;

  for (const entry of entries) {
    const duration = entry.endTime 
      ? differenceInMinutes(entry.endTime, entry.startTime)
      : 0;
    
    totalMinutes += duration;
    if (entry.isBillable) {
      billableMinutes += duration;
    }
  }

  return {
    totalHours: Math.round(totalMinutes / 60 * 100) / 100,
    billableHours: Math.round(billableMinutes / 60 * 100) / 100,
    nonBillableHours: Math.round((totalMinutes - billableMinutes) / 60 * 100) / 100
  };
}

export function calculateEarnings(hours: number, hourlyRate: number): number {
  return Math.round(hours * hourlyRate * 100) / 100;
}
```

---

## Shared Patterns

### Theme System
All projects use dark/light with localStorage persistence and data-theme attribute:
- rocr-landing: React Context (`useTheme()`)
- rocr-panel: Svelte store (`$theme`)
- rocr-backend: N/A (API only)

### Design Tokens
```css
--color-primary: #00b7ff;
--color-primary-dark: #0071e3;
--color-accent-purple: #a020f0;
--color-accent-orange: #ff7a00;
```

### Card Pattern
```
rounded-2xl border backdrop-blur-md
dark: border-white/10 bg-white/5
light: border-black/10 bg-white/70 shadow-sm
```

### API Response Format
```typescript
// Success response
{
  "data": T | T[],
  "meta": {
    "page": number,
    "perPage": number,
    "total": number
  }
}

// Error response
{
  "error": string,
  "code": string,
  "details": object
}
```

### Icon Library
- rocr-landing: `lucide-react`
- rocr-panel: `lucide-svelte`
- rocr-backend: N/A
