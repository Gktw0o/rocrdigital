# Tech Context — ROCR Digital

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
| tailwind-merge | Merge Tailwind classes intelligently |
| clsx | Conditional className builder |
| class-variance-authority | Component variant system (CVA) |
| tw-animate-css | Tailwind animation utilities |
| lucide-react | Icon library |
| react-helmet-async | SEO meta tags (title, OG, Twitter cards) |

### Dev Tools
| Tool | Purpose |
|------|---------|
| ESLint 9 (flat config) | Code linting |
| eslint-plugin-react-hooks | React hooks rules |
| eslint-plugin-react-refresh | Fast refresh compatibility |
| @vitejs/plugin-react | React support for Vite |
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

### Vite Build Config
- manualChunks: vendor-react, vendor-router, vendor-three, vendor-helmet
- chunkSizeWarningLimit: 600KB
- Three.js chunk: ~471KB (largest)

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
| @tauri-apps/api | ^2.0.0 | JS API for Tauri invoke commands |
| @tauri-apps/plugin-shell | ^2.0.0 | Shell command execution |
| lucide-svelte | ^0.460.0 | Icon library (same icons as landing) |
| svelte-spa-router | ^4.0.1 | Hash-based SPA routing |

### Dev Dependencies (package.json)
| Library | Version | Purpose |
|---------|---------|---------|
| @sveltejs/vite-plugin-svelte | ^4.0.0 | Svelte support for Vite |
| @tailwindcss/vite | ^4.0.0 | Tailwind Vite plugin |
| @tauri-apps/cli | ^2.0.0 | Tauri CLI (build, dev, android) |
| svelte | ^5.0.0 | Svelte compiler |
| tailwindcss | ^4.0.0 | CSS framework |
| vite | ^6.0.0 | Build tool |

### Rust Dependencies (Cargo.toml)
| Crate | Version | Purpose |
|-------|---------|---------|
| tauri | 2 | Core framework |
| tauri-build | 2 | Build system |
| serde | 1 (features: derive) | Serialization |
| serde_json | 1 | JSON handling |
| tauri-plugin-shell | 2 | Shell integration |

### Build Targets
| Platform | Format | Build Command |
|----------|--------|---------------|
| Windows | .exe + .msi | `bun run tauri build` |
| macOS | .dmg + .app | `bun run tauri build` |
| Linux | .deb + .AppImage | `bun run tauri build` |
| Android | .apk + .aab | `bun run tauri android build` |

### Commands (rocr-panel)
```bash
cd rocr-panel
bun install                    # Install frontend deps
bun run dev                    # Vite dev server (port 1420)
bun run tauri dev              # Dev with Tauri native window
bun run tauri build            # Production build (desktop)
bun run tauri android init     # Initialize Android target
bun run tauri android build    # Build Android APK/AAB
bun run tauri icon             # Generate icons from source image
```

### Development Prerequisites
- **Bun** — Package manager and JS runtime
- **Rust stable** — Required by Tauri (install via `rustup`)
- **Visual Studio Build Tools** — Required for .exe/.msi on Windows
- **Xcode + Command Line Tools** — Required for .dmg on macOS
- **Android SDK + NDK + Java 17** — Required for .apk builds

---

## Shared Configuration

### Path Aliases
- rocr-landing: `@/*` -> project root (jsconfig.json)
- rocr-panel: standard relative imports (`./lib/stores/theme.js`)

### CSS Variables (both projects)
```css
/* Panel CSS variables (app.css) */
[data-theme="dark"] {
  --bg: #0a0a0a;
  --bg-secondary: #111111;
  --bg-card: rgba(255, 255, 255, 0.05);
  --border: rgba(255, 255, 255, 0.1);
  --text: #e5e7eb;
  --text-secondary: #9ca3af;
  --sidebar-bg: #0f0f0f;
  --hover: rgba(255, 255, 255, 0.08);
}
[data-theme="light"] {
  --bg: #f7f8fa;
  --bg-secondary: #ffffff;
  --bg-card: rgba(255, 255, 255, 0.7);
  --border: rgba(0, 0, 0, 0.1);
  --text: #111827;
  --text-secondary: #6b7280;
  --sidebar-bg: #ffffff;
  --hover: rgba(0, 0, 0, 0.04);
}
```

### Technical Constraints
- **rocr-landing:** Frontend only, no backend, ES modules, WebGL required, no TypeScript
- **rocr-panel:** Desktop-first (Tauri window), Rust backend, local JSON persistence, no TypeScript
- **Shared:** Bun as package manager, dark mode default, ROCR brand colors

### CI/CD
- **Workflow:** `.github/workflows/release-panel.yml`
- **Trigger:** push to `release` branch (paths: `rocr-panel/**`) OR `workflow_dispatch`
- **Desktop builds:** tauri-apps/tauri-action@v0 (Windows, macOS ARM+Intel, Ubuntu)
- **Android build:** Separate job with Java 17 + Android SDK + cargo tauri android build
- **Bun setup:** oven-sh/setup-bun@v2
- **Rust cache:** swatinem/rust-cache@v2 (workspaces: rocr-panel/src-tauri -> target)
- **Output:** GitHub Release (draft) with all platform binaries

### Dependencies Graph (rocr-panel)
```
index.html
└── src/main.js — mount(App, target: #app)
    └── App.svelte
        ├── Sidebar.svelte (7 nav items, use:link from svelte-spa-router)
        ├── Header.svelte ($unreadContacts badge, $theme toggle)
        └── Router (svelte-spa-router)
            ├── Dashboard.svelte ($data, $unreadContacts, $activeServices)
            ├── Contacts.svelte ($data, DataTable, Modal)
            ├── Partners.svelte ($data, Card, Modal)
            ├── Services.svelte ($data, Card, Modal)
            ├── Content.svelte ($data)
            ├── Team.svelte ($data, $teamByGroup, Card, Modal)
            └── Settings.svelte ($theme)

stores/
├── theme.js — writable (custom: set, toggle, init)
└── data.js — writable (custom: 11 CRUD methods) + 3 derived stores

src-tauri/
├── src/main.rs — calls rocr_panel_lib::run()
└── src/lib.rs — tauri::Builder + 3 commands (read_data, write_data, export_data)
```
