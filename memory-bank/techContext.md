# Tech Context — ROCR Digital

## Core Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.0 | UI framework |
| React DOM | 19.2.0 | DOM rendering |
| Vite | 7.2.2 | Build tool & dev server |
| Tailwind CSS | 4.1.17 | Utility-first CSS |
| Three.js | 0.181.1 | WebGL 3D graphics |

## Animation & Graphics Libraries

| Library | Purpose |
|---------|---------|
| three | WebGL rendering (ColorBends shader) |
| @react-three/fiber | React renderer for Three.js |
| @react-three/drei | Three.js helpers and abstractions |
| ogl | Lightweight WebGL library (alternative effects) |
| gsap | GreenSock Animation Platform |
| motion | Motion One animation library |
| lenis | Smooth scroll library |
| maath | Math helpers for Three.js |
| mathjs | General math operations |

## UI & Styling

| Library | Purpose |
|---------|---------|
| tailwindcss | Utility CSS framework |
| @tailwindcss/vite | Vite plugin for Tailwind |
| tailwind-merge | Merges Tailwind classes intelligently |
| clsx | Conditional className builder |
| class-variance-authority | Component variant system (CVA) |
| tw-animate-css | Tailwind animation utilities |
| lucide-react | Icon library |

## Development Tools

| Tool | Purpose |
|------|---------|
| ESLint 9 | Code linting |
| eslint-plugin-react-hooks | React hooks rules |
| eslint-plugin-react-refresh | Fast refresh compatibility |
| @vitejs/plugin-react | React support for Vite |
| Bun | Package manager (bun.lock) |

## Development Setup

### Prerequisites
- Node.js (or Bun runtime)
- Bun package manager

### Commands
```bash
# Install dependencies
bun install

# Start dev server (HMR)
bun run dev        # or: npm run dev

# Production build
bun run build      # outputs to dist/

# Preview production build
bun run preview

# Lint
bun run lint
```

### Path Aliases
- `@/*` maps to project root (configured in `jsconfig.json`)

### Environment Variables
- `VITE_BRAND_NAME` — overrides default brand name "ROCR Digital" (used in Contact, Footer)

## Technical Constraints
- **Frontend only** — no server-side rendering, no API backend
- **ES Modules** — project uses `"type": "module"` in package.json
- **Browser targets** — modern browsers with WebGL support required for ColorBends
- **Custom fonts** — 4 custom .otf font files served from `/public/fonts/`
- **No TypeScript** — project uses JavaScript with JSX (jsconfig.json for editor support)
- **No router** — single page with anchor-based navigation

## Static Assets (public/)
- `fonts/` — Regular, Medium, SemiBold, Bold (.otf)
- Logo variants: `logo.svg`, `logo-v3-white.svg`, `logo-v3-black.svg`
- Feature icons: `feature-icon1.svg` through `feature-icon5.svg`, `search.svg`
- Images: `rocr+vira.png`, `rocr+vira-white.png`, `ROCR Digital.png`

## Dependencies Graph (Key)
```
App.jsx
├── ThemeContext (context)
├── ColorBends → three (WebGL)
├── Navbar → ThemeContext
├── Hero → ThemeContext, TitleGraphic
├── Services → ThemeContext
├── Contact → ThemeContext
└── Footer → ThemeContext
```
