# Active Context — ROCR Digital

## Current Work Focus

New phase: **rocr-panel project initialization**. The landing website (rocr-landing) is in Polish & Production phase. Now creating the admin panel application with Svelte 5 + Tauri 2 + Bun for cross-platform deployment.

---

## Recent Changes (Current Session)

### 1. rocr-panel Project Creation
- Initialized Svelte 5 + Vite + TailwindCSS frontend
- Set up Tauri 2 Rust backend (src-tauri/)
- Created admin panel UI with 7 pages:
  - Dashboard, Contacts, Partners, Services, Content, Team, Settings
- Implemented Sidebar navigation + Header with theme toggle
- Added Svelte stores for theme and data management
- Configured Tauri commands for data persistence (read/write/export)

### 2. GitHub Actions Workflow
- Created `.github/workflows/release-panel.yml`
- Multi-platform build: Windows (.exe), macOS (.dmg ARM + Intel), Ubuntu (.deb)
- Triggered on push to `release` branch or manual dispatch
- Uses `tauri-apps/tauri-action@v0` for automated build & release

### 3. Memory Bank Update
- Updated all 6 memory-bank files to include rocr-panel context
- Added comprehensive documentation for both projects

---

## Current State

### rocr-landing (Polish & Production)
- All 6 pages fully functional
- Theme system, WebGL background, smooth scrolling working
- SEO meta tags on all pages
- Real partner logos with theme variants
- Remaining: Contact form backend, Google Maps, deployment, performance audit

### rocr-panel (Initial Setup)
- Project structure created
- Frontend: Svelte 5 + Vite + TailwindCSS
- Backend: Tauri 2 (Rust)
- Package manager: Bun
- Build targets: .exe, .dmg, .apk
- GitHub Actions release workflow configured

---

## File Structure (Monorepo)
```
rocrdigital/
├── memory-bank/                # Shared documentation (6 files)
├── rocr-landing/               # Web application
│   ├── src/                    # React + Vite source
│   ├── public/                 # Static assets
│   ├── package.json
│   └── vite.config.js
├── rocr-panel/                 # Admin panel
│   ├── src/                    # Svelte + Vite source
│   ├── src-tauri/              # Tauri Rust backend
│   ├── package.json
│   └── vite.config.js
└── .github/
    └── workflows/
        └── release-panel.yml   # CI/CD for panel builds
```

---

## Next Steps (Priority Order)

### rocr-panel — Immediate
1. Install dependencies (`bun install` in rocr-panel)
2. Verify Tauri dev environment works (`bun run tauri dev`)
3. Build and test on Windows (`bun run tauri build`)
4. Initialize Android target (`bun run tauri android init`)
5. Polish UI components and page layouts

### rocr-panel — Short Term
6. Implement data persistence (Tauri commands + local JSON storage)
7. Add CRUD functionality for all entities (contacts, partners, services, team)
8. Build content management module
9. Add authentication/login screen
10. Test cross-platform builds (Windows, macOS, Android)

### rocr-landing — Ongoing
11. Contact form backend integration
12. Google Maps on contact page
13. Deployment configuration
14. Performance audit (Lighthouse)

---

## Active Decisions
- **Panel tech stack:** Svelte 5 + Tauri 2 + Bun (compiled to native apps)
- **Data storage:** Local JSON files via Tauri FS (initially), API sync later
- **Routing:** svelte-spa-router (hash-based, no server needed)
- **Theme:** Consistent with rocr-landing (dark/light, same color tokens)
- **CI/CD:** GitHub Actions with tauri-action for automated releases
- **Android:** Tauri Android target (requires Android SDK setup)

## Important Patterns
- Svelte stores for reactive state management
- Tauri commands bridge Rust backend to Svelte frontend
- TailwindCSS with same design tokens as rocr-landing
- Card-based layouts matching the landing page aesthetic
- Sidebar + Header layout pattern for admin panel
