# System Patterns — ROCR Digital

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

### File Structure (rocr-landing)
```
rocr-landing/src/
├── pages/              # 6 route-level components (lazy-loaded)
│   ├── HomePage.jsx
│   ├── PartnersPage.jsx
│   ├── ServicesPage.jsx
│   ├── AboutPage.jsx
│   ├── ContactPage.jsx
│   └── SiteMapPage.jsx
├── layouts/
│   └── MainLayout.jsx  # Shared wrapper (ColorBends + Navbar + Outlet + Footer)
├── components/         # 22 files (12 active, 10 unused animation components)
│   ├── Navbar.jsx      # Desktop + mobile nav, theme toggle, React Router Links
│   ├── Hero.jsx        # Headline + TitleGraphic
│   ├── Partners.jsx    # InfiniteLogoScroll with 7 logos
│   ├── Services.jsx    # 9-card grid
│   ├── About.jsx       # Stats + values + description
│   ├── Contact.jsx     # Corporate info + feedback buttons
│   ├── Footer.jsx      # Link groups + disclaimers + legal
│   ├── SEO.jsx         # react-helmet-async wrapper (title, OG, Twitter)
│   ├── FadeIn.jsx      # motion/react scroll-triggered animation
│   ├── InfiniteLogoScroll.jsx  # CSS keyframe infinite carousel
│   ├── TitleGraphic.jsx        # CSS gradient text (radial-gradient background-clip)
│   └── ColorBends.jsx          # Three.js custom GLSL fragment shader (~10KB)
├── context/
│   └── ThemeContext.jsx  # useTheme() -> {theme, toggleTheme, setTheme}
├── config/
│   └── site.js           # { brandName: "ROCR Digital" }
├── lib/
│   └── utils.js          # cn() = clsx + tailwind-merge
├── main.jsx              # BrowserRouter + HelmetProvider + ThemeProvider
├── App.jsx               # Routes (React.lazy + Suspense)
└── index.css             # Global styles, @font-face, CSS variables, Tailwind utilities
```

### Key Patterns
- **Theme:** React Context + `data-theme` attribute + localStorage + OS preference
- **Styling:** Conditional ternary class strings (not Tailwind `dark:` variant)
- **Card:** `rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md` (dark) / `border-black/10 bg-white/70 shadow-sm` (light)
- **Animation:** `<FadeIn direction="up" delay={0.1}>` wrapper on all content sections
- **WebGL:** ColorBends shader in MainLayout (fixed, z-0, pointer-events-none)
- **Code Splitting:** React.lazy() per page + manualChunks: vendor-react, vendor-router, vendor-three, vendor-helmet
- **SEO:** `<SEO title="..." description="..." path="/..." />` on every page

### Critical Flows
1. **Theme Toggle:** click -> toggleTheme() -> state update -> data-theme attr -> all components re-render
2. **ColorBends:** useEffect -> Three.js scene -> requestAnimationFrame -> GLSL shader per frame -> mouse tracking
3. **Smooth Scroll:** Lenis init in MainLayout -> raf loop -> cleanup on unmount
4. **Route Navigation:** Link click -> React Router -> MainLayout persists -> Outlet swaps -> Lenis scrollTo(0)
5. **SEO:** Page mount -> react-helmet-async injects meta tags into document head

---

## rocr-panel Architecture

### Tauri 2 + Svelte 5 Application
```
index.html -> src/main.js -> mount(App, #app)
  └── App.svelte
      ├── Sidebar.svelte (collapsible, 7 nav items, active highlighting)
      ├── Header.svelte (notification badge, theme toggle, avatar)
      └── <main>
          └── Router (svelte-spa-router)
              ├── /           -> Dashboard.svelte
              ├── /contacts   -> Contacts.svelte
              ├── /partners   -> Partners.svelte
              ├── /services   -> Services.svelte
              ├── /content    -> Content.svelte
              ├── /team       -> Team.svelte
              └── /settings   -> Settings.svelte
```

### File Structure (rocr-panel) — 30 files total
```
rocr-panel/
├── src/
│   ├── lib/
│   │   ├── components/          # 6 reusable UI components
│   │   │   ├── Sidebar.svelte   # Collapsible nav (240px / 68px), 7 items, active link
│   │   │   ├── Header.svelte    # Unread badge, theme toggle (Sun/Moon), avatar
│   │   │   ├── Card.svelte      # Generic card (rounded-2xl, border, backdrop-blur)
│   │   │   ├── Modal.svelte     # Overlay modal (backdrop click to close)
│   │   │   ├── DataTable.svelte # Generic table (columns, rows, onRowClick, empty state)
│   │   │   └── ThemeToggle.svelte # Standalone toggle button
│   │   ├── pages/               # 7 route page components
│   │   │   ├── Dashboard.svelte # Stats grid, recent contacts, quick actions
│   │   │   ├── Contacts.svelte  # DataTable + search + filter + detail Modal
│   │   │   ├── Partners.svelte  # Card grid + CRUD Modal
│   │   │   ├── Services.svelte  # Card list + toggle + edit Modal
│   │   │   ├── Content.svelte   # 4 section editors with Save buttons
│   │   │   ├── Team.svelte      # Grouped card grid + CRUD Modal
│   │   │   └── Settings.svelte  # Appearance, data mgmt, API config
│   │   ├── stores/              # Svelte writable/derived stores
│   │   │   ├── theme.js         # createThemeStore() -> {subscribe, set, toggle, init}
│   │   │   └── data.js          # createDataStore() + 3 derived stores
│   │   └── utils/
│   │       └── index.js         # formatDate, getStatusColor, getStatusLabel, truncate, generateId
│   ├── App.svelte               # Root: flex layout (Sidebar + Header + Router)
│   ├── app.css                  # TailwindCSS + CSS variables (--bg, --text, --border, etc.)
│   └── main.js                  # mount(App, #app)
├── src-tauri/
│   ├── src/
│   │   ├── main.rs              # Desktop entry: rocr_panel_lib::run()
│   │   └── lib.rs               # 3 Tauri commands + AppData struct + mobile entry point
│   ├── capabilities/
│   │   └── default.json         # core:default + shell:allow-open
│   ├── icons/                   # Empty (needs tauri icon generation)
│   ├── tauri.conf.json          # 1200x800, min 900x600, identifier: com.rocrdigital.panel
│   ├── Cargo.toml               # tauri 2, tauri-build 2, serde, serde_json, tauri-plugin-shell
│   └── build.rs                 # tauri_build::build()
├── index.html                   # lang="tr", data-theme="dark"
├── package.json                 # svelte 5, tauri-apps/api 2, vite 6, tailwindcss 4
├── vite.config.js               # svelte() + tailwindcss(), port 1420, HMR 1421
├── svelte.config.js             # vitePreprocess()
└── .gitignore                   # node_modules, dist, src-tauri/target, src-tauri/gen
```

### Svelte 5 Runes Usage (actual code patterns)
```javascript
// Component props
let { collapsed = $bindable(false) } = $props();

// Reactive state
let searchQuery = $state("");
let selectedContact = $state(null);

// Derived computations
const filteredContacts = $derived(
  $data.contacts.filter(c => c.name.includes(searchQuery))
);

// Store subscriptions (auto via $prefix)
$data.contacts  // auto-subscribes to data store
$theme          // auto-subscribes to theme store
$unreadContacts // auto-subscribes to derived store
```

### State Management (Svelte Stores)

#### theme.js — Custom writable store
- `subscribe` — Standard Svelte subscription
- `set(value)` — Sets theme + localStorage + data-theme attribute
- `toggle()` — Flips dark/light
- `init()` — Sets initial data-theme attribute on mount

#### data.js — Custom writable store with CRUD methods
- **Base:** writable(defaultData) with contacts, partners, services, content, team
- **Contact ops:** addContact, updateContact, deleteContact
- **Partner ops:** addPartner, updatePartner, deletePartner
- **Service ops:** updateService, toggleService
- **Content ops:** updateContent(section, value)
- **Team ops:** addTeamMember, updateTeamMember, deleteTeamMember

#### Derived stores (exported separately)
- `unreadContacts` — contacts where status === "unread"
- `activeServices` — services where active === true
- `teamByGroup` — team members grouped by group field

### Tauri Commands (Rust — src-tauri/src/lib.rs)
```rust
// All 3 commands use app: tauri::AppHandle to resolve data path
// Data stored in: app.path().app_data_dir() / "data.json"

#[tauri::command]
fn read_data(app: tauri::AppHandle) -> Result<String, String>
// Reads data.json, creates default if missing

#[tauri::command]
fn write_data(app: tauri::AppHandle, data: String) -> Result<(), String>
// Writes JSON string to data.json

#[tauri::command]
fn export_data(app: tauri::AppHandle, format: String) -> Result<String, String>
// "json" -> returns raw content, "csv" -> converts contacts to CSV
```

### Tauri App Configuration (tauri.conf.json)
- **productName:** "ROCR Panel"
- **identifier:** com.rocrdigital.panel
- **Window:** 1200x800, min 900x600, centered, resizable, decorated
- **Dev:** beforeDevCommand = `bun run dev`, devUrl = `http://localhost:1420`
- **Build:** beforeBuildCommand = `bun run build`, frontendDist = `../dist`
- **Bundle:** all targets active, icon paths configured

### Data Flow
```
User Action (click/type)
  -> Svelte Component ($state update)
  -> Store method (data.updateContact, etc.)
  -> Writable store update (reactive re-render)
  -> [Future] invoke("write_data", { data: JSON.stringify($data) })
  -> [Future] Tauri Rust command -> app_data_dir/data.json
```

**Current state:** CRUD operations work in-memory via Svelte stores.
Tauri commands are implemented in Rust but not yet wired to the frontend (invoke calls not yet added).

### CI/CD Pipeline (release-panel.yml)
```
Trigger: push to 'release' branch (paths: rocr-panel/**) OR manual dispatch

Job 1: publish-tauri (4 platform matrix)
  ├── macos-latest (aarch64-apple-darwin)   -> .dmg (Apple Silicon)
  ├── macos-latest (x86_64-apple-darwin)    -> .dmg (Intel)
  ├── ubuntu-22.04                          -> .deb + .AppImage
  └── windows-latest                        -> .msi + .exe
  Steps: checkout -> Ubuntu deps -> Bun setup -> Rust stable -> Rust cache
         -> bun install -> tauri-action (build + GitHub Release draft)

Job 2: build-android (needs: publish-tauri)
  └── ubuntu-22.04
  Steps: checkout -> Java 17 -> Android SDK -> Bun -> Rust (Android targets)
         -> cargo install tauri-cli -> bun install -> tauri android init --ci
         -> tauri android build --apk -> upload-artifact
```

---

## Shared Patterns

### Theme System
Both projects use dark/light with localStorage persistence and data-theme attribute:
- rocr-landing: React Context (`useTheme()`) + conditional class ternaries
- rocr-panel: Svelte store (`$theme`) + CSS variables

### Design Tokens (shared)
```css
--color-primary: #00b7ff;
--color-primary-dark: #0071e3;
--color-accent-purple: #a020f0;
--color-accent-orange: #ff7a00;
```

### Card Pattern (shared aesthetic)
```
rounded-2xl border backdrop-blur-md
dark: border-white/10 bg-white/5
light: border-black/10 bg-white/70 shadow-sm
```

### Icon Library
- rocr-landing: `lucide-react`
- rocr-panel: `lucide-svelte`
Same icon set, different framework bindings.
