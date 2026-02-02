# Product Context — ROCR Digital

## Why This Project Exists
ROCR Digital needs a public website that reflects its identity as a cutting-edge digital agency. The site itself is a demonstration of the agency's capabilities — using advanced WebGL shaders, 3D graphics, and smooth animations to create a premium first impression.

## Problems It Solves
1. **Brand Visibility:** Provides a professional, discoverable online presence
2. **Service Communication:** Clearly presents the agency's 9 service categories to potential clients
3. **Credibility:** The technical sophistication of the site demonstrates hands-on expertise
4. **Lead Generation:** Contact section and CTAs guide visitors toward engagement

## Service Categories (9)
1. Strategy & Consulting
2. Brand & Identity
3. Web Experiences
4. AI & Automation
5. E-commerce
6. Content Production
7. Cloud & DevOps
8. Performance & SEO
9. Support & Growth

## Site Structure

### Current: Single Landing Page
All content on one page with anchor-based section navigation.

### Planned: Multi-Page Application
| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page — Hero, Partners carousel, Services grid, About summary, Contact info, Footer |
| `/partners` | Partners | Partner detaylari, case study'ler, isbirligi bilgileri, logo galeri |
| `/services` | Services | 9 servisin genisletilmis aciklamalari, ozellikler, CTA'lar |
| `/about` | About | Takim tanitimi, misyon/vizyon, degerler, sirket hikayesi, ofis bilgileri |
| `/contact` | Contact | Iletisim formu, harita entegrasyonu, adres, sosyal medya, calisma saatleri |
| `/site-map` | Site Map | Tum sayfa ve alt-sayfalarin HTML haritasi (SEO icin) |

## How It Should Work
- Visitors land on the homepage and immediately see the ColorBends WebGL shader animation as background
- Navbar provides navigation to all pages via React Router links + theme toggle
- Landing page showcases each capability briefly with "Learn more" links to dedicated pages
- Dedicated pages provide in-depth information for each topic
- ColorBends background persists across all pages (shared layout)
- Dark/Light theme toggle persists across sessions via localStorage
- Smooth scrolling via Lenis on all pages

## User Experience Goals
- **First Impression:** Visually striking, premium feel with animated background
- **Performance:** Smooth 60fps animations, fast initial load
- **Readability:** Clear typography hierarchy, proper contrast in both themes
- **Navigation:** Multi-page with clear route structure, landing page maintains scroll experience
- **Accessibility:** Screen reader friendly, keyboard navigable
- **Responsive:** Seamless experience from mobile to desktop
- **SEO:** Dedicated pages for each topic improve search visibility
