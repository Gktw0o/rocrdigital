# Product Context — ROCR Digital

**Last Updated:** 2026-02-02

## Ecosystem Overview
ROCR Digital operates three complementary applications:
1. **rocr-landing** — Client-facing website (brand presence + lead generation)
2. **rocr-backend** — CRM API server (data management + business logic) ⭐ NEW
3. **rocr-panel** — Internal admin panel & CRM client (native apps)

---

## rocr-landing (Web Application)

### Why It Exists
Public website reflecting ROCR Digital's identity as a cutting-edge agency. The site itself demonstrates technical capabilities — WebGL shaders, 3D graphics, smooth animations, premium first impression.

### Problems It Solves
1. **Brand Visibility:** Professional, discoverable online presence
2. **Service Communication:** 9 service categories with detailed descriptions
3. **Credibility:** Technical sophistication demonstrates expertise
4. **Lead Generation:** Contact form sends to backend → panel notification
5. **Partner Showcase:** 7 real partners with case studies

### Service Categories (9)
1. Strategy & Consulting
2. Brand & Identity
3. Web Experiences
4. AI & Automation
5. E-commerce
6. Content Production
7. Cloud & DevOps
8. Performance & SEO
9. Support & Growth

### Site Structure (6 Routes)
| Route | Page | Key Content |
|-------|------|-------------|
| `/` | Home | Hero + TitleGraphic, Partners carousel, Services grid, About summary, Contact info |
| `/partners` | Partners | 7-logo InfiniteLogoScroll, 6 case studies with tags |
| `/services` | Services | 9 categories with 4 detail features each |
| `/about` | About | Stats (50+/30+/5+/9), team (3 groups), mission/vision, 4 values |
| `/contact` | Contact | Form → POST to rocr-backend API |
| `/site-map` | Site Map | HTML sitemap (4 link groups) |

### Current Status: Production Ready ✅

---

## rocr-backend (CRM API Server) ⭐ NEW

### Why It Exists
Central data layer connecting rocr-landing (public) and rocr-panel (internal). Provides secure API for all CRM operations, authentication, and business logic.

### Problems It Solves
1. **Data Centralization:** Single source of truth for all company data
2. **Authentication:** Secure admin-seeded user management
3. **Lead Pipeline:** Receives contacts from landing, manages in panel
4. **Project Tracking:** Full project lifecycle management
5. **Team Coordination:** Schedules, availability, resource allocation
6. **Time & Billing:** Freelancer hour tracking and cost calculation

### Core Modules

#### 1. Authentication & Authorization
- **Admin Seeding:** First user created via environment variables
- **Role Hierarchy:** Admin > Manager > Employee > Freelancer
- **JWT Tokens:** Access (15min) + Refresh (7 days)
- **Session Management:** Track devices, allow forced logout

#### 2. Contact Management (CRM Leads)
- **Inbound:** Receive from rocr-landing contact form
- **Status Flow:** Unread → Read → In Progress → Replied → Archived
- **Assignment:** Assign contacts to team members
- **Notes:** Internal notes and follow-up tracking
- **Export:** CSV/JSON export for reporting

#### 3. Project Management
- **Projects:** Client name, status, dates, budget
- **Milestones:** Key deliverables with deadlines
- **Tasks:** Granular work items with estimates
- **Status:** Planning → In Progress → Review → Completed → Archived
- **Templates:** Reusable project templates

#### 4. Calendar & Events
- **Event Types:** Meeting, Deadline, Reminder, Holiday
- **Visibility:** Private, Team, All
- **Recurrence:** Daily, Weekly, Monthly patterns
- **Reminders:** Email/notification before events

#### 5. Schedule & Availability
- **Work Schedules:** Weekly patterns (e.g., Mon-Fri 9-17)
- **Off Days:** PTO, sick days, holidays
- **Availability:** Real-time free/busy view
- **Conflicts:** Automatic overlap detection

#### 6. Time Tracking
- **Clock In/Out:** Real-time tracking
- **Manual Entries:** Add past time entries
- **Task Association:** Link time to specific tasks
- **Billable Toggle:** Mark time as billable/non-billable
- **Reports:** Weekly, monthly summaries
- **Rate Calculation:** Hours × Hourly Rate = Earnings

### API Consumers
1. **rocr-landing:** POST /contacts (public endpoint, rate-limited)
2. **rocr-panel:** All endpoints (authenticated)

### Current Status: Planned ⏳

---

## rocr-panel (CRM Client Application)

### Why It Exists
Native desktop/mobile application for the ROCR Digital team to manage all business operations. Consumes rocr-backend API.

### Problems It Solves
1. **Unified Interface:** Single app for all team operations
2. **Offline Capability:** Local caching with sync
3. **Cross-Platform:** Windows, macOS, Linux, Android
4. **Real-Time Updates:** Live data from backend
5. **Native Performance:** Rust-powered, lightweight

### Panel Modules (13 pages total)

#### Existing Modules (7)
| Module | Purpose | Status |
|--------|---------|--------|
| Dashboard | Stats, recent activity, quick actions | ✅ UI Done |
| Contacts | Lead management, status tracking | ✅ UI Done |
| Partners | Portfolio management | ✅ UI Done |
| Services | Service catalog | ✅ UI Done |
| Content | Website content management | ✅ UI Done |
| Team | Team member profiles | ✅ UI Done |
| Settings | Theme, API config | ✅ UI Done |

#### New CRM Modules (6) ⭐
| Module | Purpose | Status |
|--------|---------|--------|
| Login | Authentication screen | ⏳ Planned |
| Projects | Project & task management | ⏳ Planned |
| Calendar | Events & meetings | ⏳ Planned |
| Schedule | Work hours & availability | ⏳ Planned |
| Time Tracking | Clock in/out, entries | ⏳ Planned |
| Reports | Analytics & exports | ⏳ Planned |

### Module Details

#### Dashboard (Enhanced)
- 6 stat cards: Contacts, Projects, Tasks, Events Today, Time This Week, Team
- Recent activity feed (contacts, project updates, time entries)
- Quick actions: New Contact, New Project, Clock In/Out
- Calendar widget (next 7 days)

#### Projects
- List view with filters: Status, Assigned To, Client
- Kanban board view (drag & drop)
- Project detail page:
  - Overview: Description, client, dates, budget
  - Milestones: Timeline with progress
  - Tasks: List with status, assignee, due date
  - Time: Logged hours on this project
  - Files: Attachments (future)

#### Calendar
- Month/Week/Day views
- Color-coded event types
- Drag to create/move events
- Event detail modal
- Team member filter

#### Schedule
- My Schedule: Weekly pattern editor
- Off Days: Request/view PTO
- Team Availability: Who's free today/this week
- Conflict warnings

#### Time Tracking
- Clock In/Out button (persistent in header when active)
- Current session timer
- Today's entries list
- Week's entries with daily breakdown
- Manual entry form
- Task/Project assignment

#### Reports
- Time reports: Daily, Weekly, Monthly
- Project hours breakdown
- Team productivity overview
- Export to CSV/PDF

### Target Users
| Role | Primary Use Cases |
|------|-------------------|
| Admin | User management, all access, settings |
| Manager | Project oversight, team schedules, reports |
| Employee | Own projects, tasks, time tracking |
| Freelancer | Assigned tasks, time tracking, earnings |

### Current Status: UI Base Complete, Backend Integration Pending ⏳

---

## User Journey Examples

### Lead Generation Flow
```
1. Visitor lands on rocr-landing
2. Navigates to /contact
3. Fills out contact form
4. Form submits to POST /api/v1/contacts
5. rocr-backend creates contact record (status: unread)
6. rocr-panel Dashboard shows new notification badge
7. Team member opens Contacts page
8. Reviews and assigns contact
9. Changes status as conversation progresses
10. Eventually marks as replied/archived
```

### Project Management Flow
```
1. Manager creates new project in rocr-panel
2. Adds milestones and tasks
3. Assigns tasks to team members
4. Team members receive assignments in their Dashboard
5. Employees update task status as they work
6. Time is logged against tasks
7. Manager views project progress and time spent
8. Project completed, marked as done
```

### Freelancer Time Tracking Flow
```
1. Freelancer logs into rocr-panel
2. Sees assigned tasks in Dashboard
3. Clicks "Clock In" to start working
4. Timer runs in header (visible across all pages)
5. Clicks "Clock Out" when done
6. Entry created with duration, linked to active task
7. At week's end, generates time report
8. Report shows: Total Hours, Billable Hours, Earnings
```

### Team Scheduling Flow
```
1. Employee sets weekly work schedule (Settings or Schedule)
2. Requests off-day for next Friday
3. Admin/Manager approves request
4. Day shows as "Off" in team availability view
5. Manager checks availability before scheduling meeting
6. Creates meeting event, adds available team members
7. Event appears in all participants' calendars
```

---

## Key Metrics

| Metric | Source | Display Location |
|--------|--------|------------------|
| Total Contacts | Backend DB | Dashboard |
| Unread Contacts | Backend query | Dashboard, Header badge |
| Active Projects | Backend query | Dashboard |
| Tasks This Week | Backend query | Dashboard |
| Hours This Week | Time entries | Dashboard, Time Tracking |
| Billable Amount | Hours × Rate | Reports |
| Team Members | Users table | Dashboard |

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Data Flow Diagram                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  EXTERNAL                     BACKEND                     INTERNAL          │
│  ────────                     ───────                     ────────          │
│                                                                             │
│  ┌─────────────┐             ┌─────────────┐             ┌─────────────┐   │
│  │   Website   │   HTTP      │             │   HTTP      │    Panel    │   │
│  │   Visitor   │ ─────────▶  │   Hono      │ ◀─────────▶ │    User     │   │
│  │             │  Contact    │   Server    │   Auth+API  │             │   │
│  └─────────────┘             │             │             └─────────────┘   │
│                              │             │                               │
│                              └──────┬──────┘                               │
│                                     │                                      │
│                                     ▼                                      │
│                              ┌─────────────┐                               │
│                              │  PostgreSQL │                               │
│                              │  Database   │                               │
│                              │             │                               │
│                              │ • Users     │                               │
│                              │ • Contacts  │                               │
│                              │ • Projects  │                               │
│                              │ • Tasks     │                               │
│                              │ • Events    │                               │
│                              │ • Time      │                               │
│                              │ • Content   │                               │
│                              └─────────────┘                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```
