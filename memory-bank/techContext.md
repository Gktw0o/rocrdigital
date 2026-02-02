# Tech Context — ROCR Digital

## rocr-landing Tech Stack

### Core Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.0 | UI framework |
| React DOM | 19.2.0 | DOM rendering |
| React Router DOM | 7.x | Client-side routing |
| Vite | 7.2.2 | Build tool & dev server |
| Tailwind CSS | 4.1.17 | Utility-first CSS |
| Three.js | 0.181.1 | WebGL 3D graphics |

### Animation & Graphics Libraries
| Library | Purpose |
|---------|---------|
| three | WebGL rendering (ColorBends shader) |
| @react-three/fiber | React renderer for Three.js |
| @react-three/drei | Three.js helpers and abstractions |
| ogl | Lightweight WebGL library |
| gsap | GreenSock Animation Platform |
| motion | Motion One animation library |
| lenis | Smooth scroll library |

### UI & Styling
| Library | Purpose |
|---------|---------|
| tailwindcss | Utility CSS framework |
| tailwind-merge | Merges Tailwind classes intelligently |
| clsx | Conditional className builder |
| class-variance-authority | Component variant system (CVA) |
| lucide-react | Icon library |

### Development Tools
| Tool | Purpose |
|------|---------|
| ESLint 9 | Code linting |
| @vitejs/plugin-react | React support for Vite |
| Bun | Package manager |

### Commands (rocr-landing)
```bash
cd rocr-landing
bun install          # Install dependencies
bun run dev          # Dev server with HMR
bun run build        # Production build (dist/)
bun run preview      # Preview production build
bun run lint         # Run ESLint
```

---

## rocr-panel Tech Stack

### Core Technologies
| Technology | Version | Purpose |
|-----------|---------|---------|
| Svelte | 5.x | UI framework (reactive, compiled) |
| Tauri | 2.x | Native app framework (Rust backend) |
| Vite | 6.x | Build tool & dev server |
| Bun | latest | Package manager & runtime |
| Rust | stable | Backend runtime (Tauri core) |
| TailwindCSS | 4.x | Utility-first CSS |

### Frontend Dependencies
| Library | Purpose |
|---------|---------|
| svelte | Compiler-based UI framework |
| @sveltejs/vite-plugin-svelte | Svelte support for Vite |
| @tauri-apps/api | JavaScript API for Tauri commands |
| @tauri-apps/plugin-shell | Shell command execution |
| lucide-svelte | Icon library (consistent with landing) |
| tailwindcss | Utility CSS framework |
| svelte-spa-router | Client-side routing for SPA |

### Rust/Tauri Dependencies
| Crate | Purpose |
|-------|---------|
| tauri | Core framework |
| tauri-build | Build system |
| serde | Serialization/deserialization |
| serde_json | JSON handling |
| tauri-plugin-shell | Shell integration |

### Build Targets
| Platform | Format | Build Command |
|----------|--------|---------------|
| Windows | .exe (.msi) | `bun run tauri build` |
| macOS | .dmg (.app) | `bun run tauri build` |
| Android | .apk (.aab) | `bun run tauri android build` |

### Commands (rocr-panel)
```bash
cd rocr-panel
bun install                    # Install frontend dependencies
bun run dev                    # Dev server (Svelte + Vite)
bun run tauri dev              # Dev with Tauri window
bun run tauri build            # Production build (desktop)
bun run tauri android init     # Initialize Android target
bun run tauri android build    # Build Android APK
bun run tauri icon             # Generate app icons from source
```

### Development Prerequisites
- **Bun** — Package manager and JS runtime
- **Rust** — Required by Tauri (install via rustup)
- **Android SDK** — Required for APK builds
- **Xcode** — Required for macOS .dmg builds (macOS only)
- **Visual Studio Build Tools** — Required for Windows .exe builds

---

## Shared Configuration

### Path Aliases
- rocr-landing: `@/*` maps to project root (jsconfig.json)
- rocr-panel: `$lib/*` maps to `src/lib/` (Svelte convention)

### Environment Variables
- `VITE_BRAND_NAME` — Override brand name "ROCR Digital"
- `VITE_API_URL` — Backend API URL (for future API integration)

### Technical Constraints
- **rocr-landing:** Frontend only, no backend, ES modules, WebGL required
- **rocr-panel:** Desktop-first, Tauri Rust backend, local data storage, optional API sync
- **Shared:** Bun as package manager, dark mode default, ROCR brand identity

### CI/CD Pipeline
- **GitHub Actions** workflow at `.github/workflows/release-panel.yml`
- Builds for Windows (x64), macOS (ARM + Intel), Android (ARM64)
- Triggered on push to `release` branch or manual dispatch
- Uses `tauri-apps/tauri-action@v0` for automated builds
- Creates GitHub Release with all platform binaries

### Dependencies Graph (rocr-panel)
```
index.html
└── src/main.js
    └── App.svelte (root component)
        ├── Sidebar.svelte (navigation)
        ├── Router (svelte-spa-router)
        │   ├── Dashboard.svelte
        │   ├── Contacts.svelte
        │   ├── Partners.svelte
        │   ├── Services.svelte
        │   ├── Content.svelte
        │   ├── Team.svelte
        │   └── Settings.svelte
        └── stores/
            ├── theme.js (dark/light)
            └── data.js (app state)

src-tauri/
├── src/main.rs (desktop entry)
├── src/lib.rs (shared entry + Tauri commands)
├── tauri.conf.json (app config)
├── capabilities/default.json (permissions)
└── Cargo.toml (Rust deps)
```
