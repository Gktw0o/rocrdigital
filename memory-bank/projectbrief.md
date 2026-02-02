# Project Brief — ROCR Digital (Monorepo)

## Overview
ROCR Digital is a monorepo containing two main projects:
1. **rocr-landing** — Public-facing agency website (React 19 + Vite 7 + Tailwind 4)
2. **rocr-panel** — Admin panel desktop/mobile app (Svelte 5 + Tauri 2 + Bun)

Both projects share the ROCR Digital brand identity and serve complementary purposes.

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

### Current Status: Polish & Production
- All 6 pages fully implemented and functional
- 22 components (12 active, 10 unused animation components available)
- 7 real partner logos with dark/white SVG variants
- 9 service categories with expanded detail views
- Remaining: Contact form backend, Google Maps, deployment, Lighthouse audit

---

## Project 2: rocr-panel (Admin Panel)

### Overview
Cross-platform admin panel built with Svelte 5, Tauri 2, and Bun. Compiles to native apps (.exe, .dmg, .apk). Manages all data from the rocr-landing website. Uses Svelte 5 runes syntax ($state, $derived, $props, $bindable).

### Core Requirements
- Desktop: Windows (.exe/.msi), macOS (.dmg/.app), Linux (.deb/.AppImage)
- Mobile: Android (.apk/.aab)
- 7 admin modules: Dashboard, Contacts, Partners, Services, Content, Team, Settings
- Theme system matching rocr-landing brand (dark/light with same design tokens)
- Local data persistence via Tauri Rust commands (app data directory)
- GitHub Actions CI/CD for automated multi-platform releases

### Tech Stack
- **Frontend:** Svelte 5 (runes) + Vite 6 + TailwindCSS 4
- **Backend/Runtime:** Tauri 2 (Rust) with 3 commands: read_data, write_data, export_data
- **Routing:** svelte-spa-router (hash-based SPA)
- **Icons:** lucide-svelte (consistent with rocr-landing's lucide-react)
- **Package Manager:** Bun
- **CI/CD:** GitHub Actions + tauri-apps/tauri-action@v0

### Data Model
- **Contacts:** id, name, email, subject, message, status (unread/read/replied/archived), date
- **Partners:** id, name, description, tags[]
- **Services:** id, title, description, features[], active (boolean)
- **Content:** hero {headline, subheadline}, about {description, mission, vision}, stats {projects, clients, years, services}, values[]
- **Team:** id, name, role, group (Founders & Leadership / Design Studio / Engineering Lab), description

---

## Shared Context

### Brand Identity
- **Brand Name:** ROCR Digital
- **Location:** Teknokent Ar-Ge 2 Ulugbey Binasi, No:3A/31, Konyaalti/Antalya, Turkiye
- **Color Palette:** Primary Blue (#00b7ff / #0071e3), Purple (#a020f0), Orange (#ff7a00)
- **Dark BG:** #050505 (landing) / #0a0a0a (panel)
- **Light BG:** #f7f8fa
- **Default Theme:** Dark mode

### Repository Structure (Actual)
```
rocrdigital/
├── memory-bank/               # 6 documentation files
│   ├── projectbrief.md
│   ├── productContext.md
│   ├── systemPatterns.md
│   ├── techContext.md
│   ├── activeContext.md
│   └── progress.md
├── rocr-landing/              # React web app (installed, built)
│   ├── src/                   # 6 pages, 22 components, context, config, lib
│   ├── public/                # fonts, partners SVGs, logos, icons
│   ├── dist/                  # production build output
│   ├── package.json
│   └── vite.config.js
├── rocr-panel/                # Svelte + Tauri admin panel (scaffolded, not yet installed)
│   ├── src/                   # 7 pages, 6 components, 2 stores, utils
│   ├── src-tauri/             # Rust backend (3 commands, capabilities, config)
│   ├── package.json
│   ├── vite.config.js
│   └── svelte.config.js
├── .github/
│   └── workflows/
│       └── release-panel.yml  # Multi-platform build + Android APK
└── AGENTS.md
```
