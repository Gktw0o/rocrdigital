# Project Brief — ROCR Digital (Monorepo)

**Last Updated:** 2026-02-02

## Overview
ROCR Digital is a monorepo containing three main projects:
1. **rocr-landing** — Public-facing agency website (React 19 + Vite 7 + Tailwind 4)
2. **rocr-panel** — Admin panel desktop/mobile app (Svelte 5 + Tauri 2 + Bun)
3. **rocr-backend** — CRM Backend API (Bun + Hono + PostgreSQL + Drizzle) ⭐ NEW

All projects share the ROCR Digital brand identity and work together as a unified ecosystem.

---

## Project 1: rocr-landing (Web Application)

### Overview
Modern, visually rich multi-page landing website. Frontend-only React application featuring WebGL shader background (ColorBends), scroll animations (FadeIn + Lenis), and full dark/light theme support.

### Core Requirements
- 6-route multi-page site: Home, Partners, Services, About, Contact, Site Map
- Dark/Light theme with system preference detection + localStorage persistence
- WebGL shader background (ColorBends via Three.js custom GLSL)
- Fully responsive (mobile-first, Tailwind breakpoints)
- Accessibility (ARIA labels, semantic HTML, keyboard navigable)
- Code splitting (React.lazy, manual vendor chunks)
- SEO (react-helmet-async on all 6 pages)
- **Contact form → rocr-backend API integration** ⭐ NEW

### Current Status: Production Ready ✅
- All 6 pages fully implemented and functional
- Dependencies installed, production build completed
- Remaining: Contact form backend integration, Google Maps, deployment

---

## Project 2: rocr-panel (Admin Panel / CRM Frontend)

### Overview
Cross-platform admin panel and CRM client built with Svelte 5, Tauri 2, and Bun. Compiles to native apps (.exe, .dmg, .apk). Manages all data via rocr-backend API.

### Core Requirements
- Desktop: Windows (.exe/.msi), macOS (.dmg/.app), Linux (.deb/.AppImage)
- Mobile: Android (.apk/.aab)
- **Authentication:** Login/Logout with JWT tokens ⭐ NEW
- **CRM Modules:** ⭐ EXPANDED
  - Dashboard (stats, recent activity)
  - Contacts (form submissions from landing)
  - Partners (portfolio management)
  - Services (service catalog)
  - Content (website content management)
  - Team (team member profiles)
  - **Projects** (project tracking, milestones, tasks) ⭐ NEW
  - **Calendar** (events, meetings, deadlines) ⭐ NEW
  - **Schedule** (availability, off-days, work hours) ⭐ NEW
  - **Time Tracking** (freelancer hours, reports) ⭐ NEW
  - Settings (theme, API config, profile)

### Current Status: Installed & Ready for Backend Integration ✅

---

## Project 3: rocr-backend (CRM API Server) ⭐ NEW

### Overview
RESTful API server providing centralized data management for the entire ROCR Digital ecosystem. Handles authentication, contact form submissions, CRM data, project tracking, scheduling, and time tracking.

### Tech Stack
| Technology | Version | Purpose |
|-----------|---------|---------|
| Bun | latest | Runtime & package manager |
| Hono | ^4.0.0 | Ultra-fast web framework |
| PostgreSQL | 16+ | Relational database |
| Drizzle ORM | latest | Type-safe ORM |
| Zod | latest | Schema validation |
| JWT | - | Stateless authentication |
| bcrypt | - | Password hashing |

### Core Modules

#### 1. Authentication & Users
- Admin-seeded registration (only admin can create users)
- Login/Logout with JWT (access + refresh tokens)
- Role-based access: Admin, Manager, Employee, Freelancer
- Password reset flow

#### 2. Contacts (Lead Management)
- Receive contact form submissions from rocr-landing
- Status workflow: unread → read → replied → archived
- Assignment to team members
- Notes and follow-up tracking

#### 3. Projects & Tasks
- Project CRUD with client association
- Milestones and deadlines
- Tasks with assignees, priority, status
- Time estimates and actual time tracking
- Project templates

#### 4. Calendar & Events
- Personal and team calendars
- Event types: Meeting, Deadline, Reminder, Holiday
- Recurring events support
- Google Calendar sync (future)

#### 5. Schedule & Availability
- User work schedules (weekly patterns)
- Off-days and holidays
- Availability status: Available, Busy, OOO
- Schedule conflicts detection

#### 6. Time Tracking (Freelancer Focus)
- Clock in/out functionality
- Manual time entries
- Project/task association
- Weekly/monthly reports
- Billable vs non-billable hours
- Rate calculations

#### 7. Content Management
- Store website content (hero, about, stats, values)
- Version history
- Publish/draft states

### API Design Principles
- RESTful endpoints with consistent naming
- JSON:API-like response format
- Pagination, filtering, sorting
- Rate limiting
- CORS for rocr-landing and rocr-panel origins
- Request/response validation with Zod

---

## Shared Context

### Brand Identity
- **Brand Name:** ROCR Digital
- **Location:** Teknokent Ar-Ge 2 Ulugbey Binasi, No:3A/31, Konyaalti/Antalya, Turkiye
- **Color Palette:** Primary Blue (#00b7ff / #0071e3), Purple (#a020f0), Orange (#ff7a00)
- **Dark BG:** #050505 (landing) / #0a0a0a (panel)
- **Light BG:** #f7f8fa
- **Default Theme:** Dark mode

### Repository Structure (Updated 2026-02-02)
```
rocrdigital/
├── memory-bank/               # 6 documentation files
│   ├── projectbrief.md
│   ├── productContext.md
│   ├── systemPatterns.md
│   ├── techContext.md
│   ├── activeContext.md
│   └── progress.md
├── rocr-landing/              # React web app (production ready)
│   ├── src/
│   ├── public/
│   ├── dist/
│   └── package.json
├── rocr-panel/                # Svelte + Tauri CRM client
│   ├── src/
│   ├── src-tauri/
│   └── package.json
├── rocr-backend/              # ⭐ NEW: Bun + Hono API server
│   ├── src/
│   │   ├── routes/            # API route handlers
│   │   ├── db/                # Drizzle schema & migrations
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── services/          # Business logic
│   │   └── index.ts           # Entry point
│   ├── drizzle.config.ts
│   ├── package.json
│   └── .env.example
├── .github/
│   └── workflows/
│       ├── release-panel.yml
│       └── deploy-backend.yml # ⭐ NEW
└── AGENTS.md
```

---

## Data Flow Architecture

```
┌─────────────────┐     Contact Form      ┌─────────────────┐
│  rocr-landing   │ ──────────────────▶   │  rocr-backend   │
│  (React Web)    │                       │  (Bun + Hono)   │
└─────────────────┘                       └────────┬────────┘
                                                   │
                                                   │ PostgreSQL
                                                   ▼
┌─────────────────┐     REST API          ┌─────────────────┐
│   rocr-panel    │ ◀────────────────────▶│    Database     │
│ (Svelte+Tauri)  │     JWT Auth          │  (PostgreSQL)   │
└─────────────────┘                       └─────────────────┘
```

---

## Quick Start

### rocr-landing
```bash
cd rocr-landing
bun run dev          # Start dev server
```

### rocr-panel
```bash
cd rocr-panel
bun run tauri dev    # Start with Tauri native window
```

### rocr-backend
```bash
cd rocr-backend
bun install          # Install dependencies
bun run db:push      # Push schema to database
bun run dev          # Start dev server (port 3000)
```
