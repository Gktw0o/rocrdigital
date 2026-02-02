# System Patterns — ROCR Digital

## Architecture

### Current: Single-Page Application
Landing page with all sections in one page, anchor-based navigation, Lenis smooth scroll.

```
main.jsx → ThemeProvider → App.jsx (+ Lenis smooth scroll)
  ├── ColorBends (fixed background, z-0)
  ├── Readability Scrim (dark mode only, z-1) ← BUG: no styling applied
  └── <main> (z-10)
      ├── Navbar (fixed, z-50)
      ├── Hero
      ├── FadeIn → Partners (LogoLoop carousel)
      ├── FadeIn → Services (9-card grid)
      ├── FadeIn → About (stats + values)
      ├── FadeIn → Contact
      └── Footer
```

### Planned: Multi-Page with React Router
```
main.jsx → BrowserRouter → ThemeProvider → App.jsx
  └── Routes
      ├── MainLayout (Navbar + ColorBends + Scrim + Footer)
      │   ├── / → HomePage (mevcut landing page)
      │   ├── /partners → PartnersPage
      │   ├── /services → ServicesPage
      │   ├── /about → AboutPage
      │   ├── /contact → ContactPage
      │   └── /site-map → SiteMapPage
      └── 404 → NotFound (optional)
```

### Planned File Structure
```
src/
├── pages/                  # Route-level page components
│   ├── HomePage.jsx        # Mevcut landing content
│   ├── PartnersPage.jsx    # /partners
│   ├── ServicesPage.jsx    # /services
│   ├── AboutPage.jsx       # /about
│   ├── ContactPage.jsx     # /contact
│   └── SiteMapPage.jsx     # /site-map
├── layouts/
│   └── MainLayout.jsx      # Shared: Navbar + ColorBends + Scrim + <Outlet/> + Footer
├── components/             # Reusable section & UI components
│   ├── FadeIn.jsx
│   ├── Partners.jsx        # Section component (reusable in HomePage & PartnersPage)
│   ├── Services.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Hero.jsx
│   ├── ColorBends.jsx
│   ├── LogoLoop.jsx
│   └── ...
├── context/
│   └── ThemeContext.jsx
├── config/
│   └── site.js
├── lib/
│   └── utils.js
├── main.jsx                # BrowserRouter entry point
├── App.jsx                 # Routes + Lenis init
└── index.css
```

## Key Technical Decisions

### Theme System
- React Context (`ThemeContext`) provides `theme`, `toggleTheme`, `setTheme`
- `data-theme` attribute set on `<html>` element
- Persisted to `localStorage`
- Falls back to OS `prefers-color-scheme`
- Default: dark mode
- Every component receives theme via `useTheme()` hook and applies conditional classes

### Routing (Planned)
- **Library:** `react-router-dom` (v7+)
- **Pattern:** `MainLayout` with `<Outlet />` for nested routes
- **Navbar:** `<Link to="/path">` instead of `<a href="#anchor">`
- **HomePage:** Landing page'deki anchor scroll davranisi korunacak
- **Diger sayfalar:** Scroll-to-top on route change
- **Lenis:** Route degisikliklerinde scroll pozisyonunu sifirla

### Styling Strategy
- **Tailwind CSS 4** as primary styling tool (utility-first)
- **Custom CSS utilities** defined in `index.css`
- **Custom CSS variables** for theme colors (`--bg`, `--text`, `--primary`, etc.)
- **Shadcn/ui design tokens** (oklch color space)
- **Conditional class strings** — ternary operators (not Tailwind's `dark:` variant)

### Animation Strategy
- **FadeIn component:** Reusable wrapper using `motion/react`. Supports directional entrance.
- **Lenis:** Smooth scroll, initialized in App.jsx (or MainLayout).
- **Section animations:** Content sections wrapped in `<FadeIn>`.

### Visual Effects Pipeline
- **ColorBends:** Custom GLSL shader via Three.js. Fixed background in MainLayout — shared across all pages.
- **TitleGraphic:** CSS `background-clip: text` gradient
- **LogoLoop:** Infinite scrolling carousel
- **Available but unused:** BlurText, TextPressure, FluidGlass, GlassSurface, Iridescence, LightRays, ScrollStack

### Component Patterns
- Functional components with hooks only
- Props with defaults for data-driven content
- Theme-aware styling via `useTheme()`
- Section components are reusable — used both in HomePage sections and dedicated pages
- Page components compose section components with additional page-specific content

## Component Relationships

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| App | ThemeContext, Lenis, React Router | Routes + smooth scroll |
| MainLayout | Navbar, ColorBends, Footer | Shared page wrapper |
| HomePage | Hero, Partners, Services, About, Contact, FadeIn | Landing page |
| PartnersPage | Partners (section), FadeIn | Dedicated partners page |
| ServicesPage | Services (section), FadeIn | Dedicated services page |
| AboutPage | About (section), FadeIn | Dedicated about page |
| ContactPage | Contact (section), FadeIn | Dedicated contact page |
| SiteMapPage | ThemeContext | HTML sitemap |
| Navbar | ThemeContext, React Router Link | Navigation + theme toggle |
| Hero | ThemeContext, TitleGraphic | Main headline section |
| Partners | ThemeContext, LogoLoop | Partner logo carousel |
| Services | ThemeContext | 9-card service grid |
| About | ThemeContext | Company info, stats, values |
| Contact | ThemeContext | Corporate info + feedback |
| Footer | ThemeContext | Links, disclaimers, legal |
| FadeIn | motion/react | Scroll-triggered animation wrapper |
| ColorBends | Three.js | WebGL background animation |

## Critical Implementation Paths
1. **Theme Toggle Flow:** User clicks → `toggleTheme()` → state update → `useEffect` sets `data-theme` → all components re-render
2. **ColorBends Render Loop:** `useEffect` → Three.js scene → `requestAnimationFrame` loop → GLSL shader per frame
3. **Smooth Scroll:** `new Lenis()` → `requestAnimationFrame` loop → cleanup on unmount
4. **Scroll Animation:** `<FadeIn>` → `motion.div` with `whileInView` → viewport trigger
5. **Route Navigation (planned):** `<Link>` click → React Router → `MainLayout` persists → `<Outlet>` swaps page content → scroll-to-top
6. **Responsive Layout:** Tailwind breakpoints (`sm:`, `md:`, `lg:`)
