# System Patterns — ROCR Digital

## Architecture

### Current: Multi-Page Application with React Router
Full multi-page site with 6 routes, shared layout, and client-side navigation.

```
main.jsx → BrowserRouter → ThemeProvider → App.jsx
  └── Routes
      └── MainLayout (Navbar + ColorBends + Scrim + <Outlet> + Footer)
          ├── / → HomePage (landing page with sections)
          ├── /partners → PartnersPage
          ├── /services → ServicesPage
          ├── /about → AboutPage
          ├── /contact → ContactPage
          └── /site-map → SiteMapPage
```

### MainLayout Structure
```
MainLayout.jsx
├── ColorBends (fixed background, z-0, pointer-events-none)
├── Readability Scrim (dark mode only, z-1, bg-black/50)
└── <main> (z-10, pt-24)
    ├── Navbar (fixed, z-50)
    ├── <Outlet /> (page content)
    └── Footer
```

### Current File Structure
```
src/
├── pages/                  # Route-level page components
│   ├── HomePage.jsx        # Landing: Hero + Partners + Services + About + Contact
│   ├── PartnersPage.jsx    # /partners — partner details, case studies
│   ├── ServicesPage.jsx    # /services — 9 service categories expanded
│   ├── AboutPage.jsx       # /about — team, mission, values
│   ├── ContactPage.jsx     # /contact — contact info, form
│   └── SiteMapPage.jsx     # /site-map — HTML sitemap for SEO
├── layouts/
│   └── MainLayout.jsx      # Shared: Navbar + ColorBends + Scrim + <Outlet/> + Footer
├── components/             # Reusable section & UI components (20 files)
│   ├── Navbar.jsx          # React Router Links, theme toggle, mobile menu
│   ├── Hero.jsx            # Landing hero with TitleGraphic
│   ├── Partners.jsx        # Partner carousel section
│   ├── Services.jsx        # 9-card service grid section
│   ├── About.jsx           # Stats + values section
│   ├── Contact.jsx         # Contact info section
│   ├── Footer.jsx          # Site footer with links
│   ├── ColorBends.jsx      # Three.js WebGL shader background
│   ├── FadeIn.jsx          # motion/react scroll animation wrapper
│   ├── LogoLoop.jsx        # Infinite scrolling carousel
│   ├── TitleGraphic.jsx    # Gradient text effect
│   └── ...                 # Other effect components (BlurText, FluidGlass, etc.)
├── context/
│   └── ThemeContext.jsx    # Theme state + toggle + localStorage
├── config/
│   └── site.js             # Site configuration constants
├── lib/
│   └── utils.js            # Utility functions (cn, etc.)
├── main.jsx                # BrowserRouter + ThemeProvider entry
├── App.jsx                 # Routes definition
└── index.css               # Global styles + Tailwind
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
