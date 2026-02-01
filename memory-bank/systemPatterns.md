# System Patterns — ROCR Digital

## Architecture
Single-page React application with component-based architecture. No routing library — navigation uses anchor links for in-page scrolling. Lenis handles smooth scroll behavior.

```
main.jsx → ThemeProvider → App.jsx (+ Lenis smooth scroll)
  ├── ColorBends (fixed background, z-0)
  ├── Readability Scrim (dark mode only, z-1)
  └── <main> (z-10)
      ├── Navbar (fixed, z-50)
      ├── Hero
      ├── FadeIn → Partners (LogoLoop carousel)
      ├── FadeIn → Services (9-card grid)
      ├── FadeIn → About (stats + values)
      ├── FadeIn → Contact
      └── Footer
```

## Key Technical Decisions

### Theme System
- React Context (`ThemeContext`) provides `theme`, `toggleTheme`, `setTheme`
- `data-theme` attribute set on `<html>` element
- Persisted to `localStorage`
- Falls back to OS `prefers-color-scheme`
- Default: dark mode
- Every component receives theme via `useTheme()` hook and applies conditional classes

### Styling Strategy
- **Tailwind CSS 4** as primary styling tool (utility-first)
- **Custom CSS utilities** defined in `index.css` (`flex-center`, `flex-between`, `col-center`, `abs-center`, `h3-semibold`, `base-semibold`, `small-medium`)
- **Custom CSS variables** for theme colors (`--bg`, `--text`, `--primary`, etc.)
- **Shadcn/ui design tokens** (oklch color space) for component library compatibility
- **Conditional class strings** — components build theme-specific class strings using ternary operators (not Tailwind's `dark:` variant)

### Animation Strategy
- **FadeIn component:** Reusable wrapper using `motion/react` (Framer Motion v12). Supports directional entrance (up/down/left/right), configurable delay, duration, and viewport trigger threshold.
- **Lenis:** Smooth scroll library initialized in App.jsx with exponential easing (duration 1.2s). Runs via `requestAnimationFrame` loop.
- **Section animations:** Partners, Services, About, and Contact wrapped in `<FadeIn>` for scroll-triggered entrance.

### Visual Effects Pipeline
- **ColorBends:** Custom GLSL fragment shader rendered via Three.js WebGLRenderer. Full-screen fixed background with mouse-reactive color bending.
- **TitleGraphic:** Multi-color radial gradient text with CSS `background-clip: text`
- **LogoLoop:** Infinite scrolling logo carousel with configurable speed, direction, hover pause, and fade edges.
- **Additional effects available:** BlurText, TextPressure, TextType, FluidGlass, GlassSurface, GradualBlur, Iridescence, LightRays, ScrollStack

### Component Patterns
- Functional components with hooks only (no class components)
- Props with defaults for data-driven content (services, contact info, footer links, partners, stats)
- Theme-aware styling via `useTheme()` hook in every visual component
- Inline SVG icons (no external icon library for nav icons)
- `lucide-react` available for additional icons
- Section `id` attributes match nav anchor links (`#partners`, `#services`, `#about`, `#contact`)

## Component Relationships

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| App | ThemeContext, Lenis, all sections, FadeIn | Root layout, smooth scroll, composition |
| Navbar | ThemeContext | Navigation + theme toggle |
| Hero | ThemeContext, TitleGraphic | Main headline section |
| TitleGraphic | CSS (index.css) | Gradient text decoration |
| Partners | ThemeContext, LogoLoop | Partner logo carousel |
| Services | ThemeContext | 9-card service grid |
| About | ThemeContext | Company info, stats, values |
| Contact | ThemeContext | Corporate info + feedback |
| Footer | ThemeContext | Links, disclaimers, legal |
| FadeIn | motion/react | Scroll-triggered entrance animation wrapper |
| ColorBends | Three.js | WebGL background animation |
| LogoLoop | — (self-contained) | Infinite scrolling carousel |

## File Organization
```
src/
├── components/     # All React components (flat structure)
│   ├── FadeIn.jsx         # Animation wrapper
│   ├── Partners.jsx       # Partners section (new)
│   ├── About.jsx          # About section (new)
│   └── ...                # Other components
├── context/        # React Context providers
├── config/         # Site configuration constants
├── lib/            # Utility functions (cn/clsx/tailwind-merge)
├── main.jsx        # Entry point
├── App.jsx         # Root component (Lenis init here)
└── index.css       # Global styles, fonts, theme variables, utilities
```

## Critical Implementation Paths
1. **Theme Toggle Flow:** User clicks → `toggleTheme()` → state update → `useEffect` sets `data-theme` on `<html>` + saves to `localStorage` → all components re-render with new theme classes
2. **ColorBends Render Loop:** `useEffect` creates Three.js scene → `requestAnimationFrame` loop → GLSL shader updates each frame with time, pointer position, rotation
3. **Smooth Scroll:** App.jsx `useEffect` → `new Lenis()` → `requestAnimationFrame` loop → `lenis.raf(time)` each frame → cleanup on unmount
4. **Scroll Animation:** `<FadeIn>` wraps section → `motion.div` with `whileInView` → triggers opacity + translate animation when section enters viewport
5. **Responsive Layout:** Tailwind breakpoints (`sm:`, `md:`, `lg:`) control grid columns and spacing
