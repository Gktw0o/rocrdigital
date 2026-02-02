# Product Context — ROCR Digital

## Ecosystem Overview
ROCR Digital operates two complementary applications:
1. **rocr-landing** — Client-facing website (brand presence + lead generation)
2. **rocr-panel** — Internal admin panel (data management + content control)

---

## rocr-landing (Web Application)

### Why It Exists
Public website reflecting ROCR Digital's identity as a cutting-edge agency. The site itself demonstrates technical capabilities — WebGL shaders, 3D graphics, smooth animations, premium first impression.

### Problems It Solves
1. **Brand Visibility:** Professional, discoverable online presence
2. **Service Communication:** 9 service categories with detailed descriptions
3. **Credibility:** Technical sophistication demonstrates expertise
4. **Lead Generation:** Contact form + CTAs guide visitors toward engagement
5. **Partner Showcase:** 7 real partners with case studies build trust

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
| `/contact` | Contact | Form (name/email/subject/message), address, social links, hours |
| `/site-map` | Site Map | HTML sitemap (4 link groups) |

### User Experience
- ColorBends WebGL shader as persistent background across all pages
- Dark/Light toggle persists via localStorage
- Smooth scrolling via Lenis (duration 1.2s)
- FadeIn scroll-triggered animations on all sections
- Mobile hamburger menu with slide-down panel

---

## rocr-panel (Admin Panel)

### Why It Exists
rocr-landing generates data (contact submissions, content updates) that needs centralized management. The admin panel provides a native desktop/mobile app for the ROCR Digital team.

### Problems It Solves
1. **Data Management:** Centralized control over contacts, partners, services, team
2. **Content Updates:** Edit website content without touching code
3. **Lead Tracking:** View, filter, and manage contact form submissions
4. **Partner Relations:** CRUD partner information and tags
5. **Offline Access:** Native app with local data storage
6. **Cross-Platform:** Single codebase compiles to .exe, .dmg, .apk

### Panel Modules (7 pages, all implemented)

#### 1. Dashboard (`/`)
- 4 stat cards: Mesajlar, Partnerler, Servisler, Ekip (with live counts)
- Badge for unread contacts count
- 5 most recent contacts with status indicators
- 3 quick action cards (Partners, Content, Team)
- Uses derived stores for computed data

#### 2. Contacts (`/contacts`)
- DataTable with 5 columns: Isim, Email, Konu, Durum, Tarih
- Search by name/email/subject
- Filter by status: all/unread/read/replied/archived
- Click row to open detail Modal
- Status change buttons in modal
- Delete functionality
- Export button (placeholder for Tauri command)

#### 3. Partners (`/partners`)
- Card grid (1/2/3 columns responsive)
- Each card: name, description, tags with Tag icons
- Edit (pencil) and Delete (trash) buttons per card
- "Yeni Partner" button opens create Modal
- Form: name, description, tags (comma-separated input)

#### 4. Services (`/services`)
- Stacked card list (all 9 services)
- Each card: title, active/pasif badge, description, feature list with checkmarks
- Toggle active/inactive per service
- Edit button opens Modal with title, description, features (newline-separated)

#### 5. Content (`/content`)
- 4 section cards: Hero, Hakkimizda, Istatistikler, Degerlerimiz
- Each section has its own Save button
- Flash success message on save ("... kaydedildi")
- Hero: headline + subheadline inputs
- About: description + mission + vision textareas
- Stats: 4 inputs (projects, clients, years, services)
- Values: newline-separated textarea

#### 6. Team (`/team`)
- Grouped by: Founders & Leadership, Design Studio, Engineering Lab
- Card grid per group with avatar initial, name, role, description
- Edit and Delete per member
- "Yeni Uye" button opens create Modal
- Form: name, role, group (select), description

#### 7. Settings (`/settings`)
- Appearance: Dark/Light theme buttons with active indicator
- Data Management: JSON export, CSV export, import (placeholder buttons)
- API Configuration: URL input + auto-sync toggle
- App info: version 0.1.0

### Target Users
- ROCR Digital founders and leadership
- Content managers
- Internal team members needing data access
