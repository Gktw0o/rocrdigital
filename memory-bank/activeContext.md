# Active Context — ROCR Digital

## Current Work Focus

Polish & Production phase progressing. SEO, content links, and partner logos complete. Next: contact form functionality, service icons, performance optimization.

## Recent Changes (Latest Session)

1. **Real Partner Logos Implementation:**
   - 7 partner logos with dark/white theme variants in `/public/partners/`
   - Partners: Anatolicus, Antalyaspor, EventPlus, HostDirekt, İBÜ, Maraş Ceviz, MICE
   - `Partners.jsx` updated to dynamically select logo version based on theme
   - `PartnersPage.jsx` updated with real partner data and case studies
   - Removed CSS `invert` filter, using native dark/white SVG versions instead

2. **SEO / Meta Tags Implementation:**
   - `react-helmet-async` installed and configured
   - Created reusable `SEO.jsx` component with title, description, OG, Twitter card support
   - SEO component added to all 6 pages with unique meta content
   - Updated `index.html` with base meta tags, proper favicon, and theme-color

3. **Content Finalization:**
   - Footer links updated from placeholder `#` to real routes
   - Footer reorganized with Services, Company, Resources, For Business, About sections

## Current State

- ✅ 6-page multi-page application with React Router
- ✅ Shared MainLayout (ColorBends + Navbar + Footer)
- ✅ Dark/Light theme system functional across all pages
- ✅ ColorBends WebGL shader background with readability scrim
- ✅ Lenis smooth scroll with scroll-to-top on route change
- ✅ Mobile-responsive Navbar with hamburger menu (mobile only)
- ✅ All section components theme-aware
- ✅ SEO meta tags on all pages (title, description, OG, Twitter)
- ✅ Footer and navigation links working (no more placeholder `#` links)
- ✅ Real partner logos with theme-aware variants (7 partners)

---

## File Structure (Current)
```
src/
├── pages/
│   ├── HomePage.jsx        # Landing page (Hero, Partners, Services, About, Contact)
│   ├── PartnersPage.jsx    # /partners — Partner details, case studies
│   ├── ServicesPage.jsx    # /services — 9 service categories expanded
│   ├── AboutPage.jsx       # /about — Team, mission, values
│   ├── ContactPage.jsx     # /contact — Contact info, form placeholder
│   └── SiteMapPage.jsx     # /site-map — HTML sitemap
├── layouts/
│   └── MainLayout.jsx      # Navbar + ColorBends + Scrim + <Outlet> + Footer
├── components/             # 20 reusable components
│   ├── Navbar.jsx          # React Router Links, theme toggle, mobile menu
│   ├── Hero.jsx
│   ├── Partners.jsx
│   ├── Services.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Footer.jsx
│   ├── ColorBends.jsx      # WebGL shader background
│   ├── FadeIn.jsx          # Scroll-triggered animation wrapper
│   ├── LogoLoop.jsx        # Infinite carousel
│   └── ...                 # Other effect components
├── context/
│   └── ThemeContext.jsx
├── config/
│   └── site.js
├── lib/
│   └── utils.js
├── main.jsx               # BrowserRouter + ThemeProvider entry
├── App.jsx                # Routes definition
└── index.css
```

---

## Next Steps (Priority Order)

### High Priority — Production Readiness
1. **SEO / Meta Tags** — Add react-helmet or manual meta tags for each page (title, description, OG, Twitter)
2. **Content Finalization** — Replace placeholder `#` links with real URLs
3. **Real Partner Logos** — Replace placeholder icons with actual partner logos
4. **Contact Form** — Implement form submission (Formspree, Netlify Forms, or custom API)

### Medium Priority — Enhancement
5. **Service Icons** — Create/find dedicated icons for all 9 services
6. **Google Maps** — Add map embed to ContactPage
7. **Mobile Menu Animation** — Smoother open/close transition
8. **Loading States** — Add skeleton/loading indicators for slow connections

### Low Priority — Optimization
9. **Code Splitting** — Lazy load ColorBends/Three.js to reduce initial bundle
10. **Performance Audit** — Lighthouse, Core Web Vitals optimization
11. **Deployment** — Configure for Vercel/Netlify, set up CI/CD

---

## Active Decisions
- **Theme approach:** Conditional class strings per component (not Tailwind `dark:` variant)
- **Routing:** React Router DOM v7+ with nested routes and `<Outlet>`
- **WebGL background:** ColorBends in MainLayout, shared across all pages
- **Readability scrim:** Dark semi-transparent overlay (`bg-black/50`) in dark mode only
- **Animation strategy:** FadeIn wrapper + Lenis smooth scroll
- **Page structure:** `src/pages/` for route components, `src/components/` for reusable UI

## Important Patterns
- Every visual component accepts theme from `useTheme()` and applies conditional styles
- Card-based layouts: `rounded-2xl border backdrop-blur-md` pattern
- Theme classes: `theme === "light" ? lightClasses : darkClasses`
- Content data as default props arrays for reusability
- `<FadeIn>` wrapper for scroll-triggered entrance animations
- MainLayout handles shared elements; pages only define unique content
- Route changes trigger scroll-to-top via Lenis
