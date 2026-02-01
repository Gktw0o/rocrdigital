# Active Context — ROCR Digital

## Current Work Focus
Post-sprint polish phase. All core sections are complete including newly added Partners and About sections. Scroll animations and smooth scrolling are integrated. Bug fixes applied. Next focus areas: dedicated service icons, SEO, content finalization, and deployment.

## Recent Changes
1. **Full Sprint (current session):**
   - Fixed Navbar bugs: `onClock` → `onClick`, single-quote template literal → backtick, `aria-expended` → `aria-expanded`
   - Fixed Hero inline style: removed invalid `textColor` CSS property
   - Integrated Lenis smooth scroll in App.jsx
   - Created Partners section with LogoLoop carousel
   - Created About section with stats and values cards
   - Created FadeIn animation wrapper using `motion/react`
   - Wrapped Partners, Services, About, and Contact sections with FadeIn scroll animations
   - Cleaned up unused imports in App.jsx (TitleGraphic, TextPressure, BlurText)
2. **Services section added** (commit `0758a16`) — Theme-aware 9-card grid
3. **MVP Landing Page** (commit `28485aa`) — Initial implementation

## Current State
- All 7 main sections implemented: Navbar, Hero, Partners, Services, About, Contact, Footer
- Dark/Light theme system is functional
- ColorBends WebGL shader background is working
- Lenis smooth scroll is active
- Scroll-triggered FadeIn animations on all content sections
- LogoLoop partner carousel is active
- Mobile responsive layout is in place
- Build succeeds (842KB JS bundle — needs code splitting)

## Known Bugs / Issues
1. **Service icons:** 3 of 9 services use placeholder logo files (Content Production, Cloud & DevOps, Support & Growth)
2. **Bundle size:** 842KB JS chunk (above 500KB Vite warning) — needs code splitting with dynamic imports
3. **Partner logos:** Currently using placeholder feature icons — need real partner logos

## Next Steps
- Create dedicated icons for all 9 services
- Add real partner logos
- SEO meta tags and Open Graph data
- Code splitting (dynamic imports for Three.js/ColorBends)
- Content finalization (replace `#` placeholder links)
- Contact form implementation (actual form submission)
- Mobile menu animation (currently simple show/hide)
- Deployment configuration

## Active Decisions
- **Theme approach:** Conditional class strings per component (not Tailwind `dark:` variant)
- **No routing:** Single-page with anchor links
- **WebGL background:** ColorBends as signature visual
- **Animation strategy:** FadeIn wrapper using `motion/react` whileInView for scroll-triggered entrance animations
- **Smooth scroll:** Lenis with exponential easing (duration 1.2s)

## Important Patterns
- Every new visual component must accept theme from `useTheme()` and apply conditional styles
- Card-based layouts use consistent `rounded-2xl border backdrop-blur-md` pattern
- Theme-specific classes follow: `theme === "light" ? lightClasses : darkClasses`
- Content data is defined as default props arrays, making components reusable
- Use `<FadeIn>` wrapper for scroll-triggered entrance animations on sections
- Section components should include `id` attribute matching nav anchor links
