# Active Context — ROCR Digital

## Current Work Focus
Transitioning from single-page landing to a multi-page application. Two critical UI bugs need fixing before new page development begins. Architecture will shift from anchor-based navigation to React Router.

## Recent Changes
1. **Full Sprint (previous session):**
   - Fixed Navbar bugs: `onClock` → `onClick`, template literal fix, `aria-expanded` fix
   - Fixed Hero inline style: removed invalid `textColor` CSS property
   - Integrated Lenis smooth scroll in App.jsx
   - Created Partners section with LogoLoop carousel
   - Created About section with stats and values cards
   - Created FadeIn animation wrapper using `motion/react`
   - Cleaned up unused imports in App.jsx
2. **Services section added** (commit `0758a16`)
3. **MVP Landing Page** (commit `28485aa`)

## Current State
- All 7 landing page sections implemented: Navbar, Hero, Partners, Services, About, Contact, Footer
- Dark/Light theme system is functional
- ColorBends WebGL shader background is working
- Lenis smooth scroll is active
- Build succeeds (842KB JS bundle)

---

## Pending Bug Fixes

### BUG-1: ColorBends dark mode z-index / readability (HIGH)
**Problem:** Dark modda ColorBends arka plan animasyonu diger componentlerin ustune cikiyor ve yazilarin gorulmesini engelliyor.
**Root Cause:** `App.jsx:64` — `.readebility-scrim` CSS class'inin hicbir gercek stili yok (background-color, opacity vb. tanimlanmamis). Scrim div'i seffaf kaliyor ve ColorBends'in canli renklerini filtrele(ye)miyor.
**Affected Files:**
- `App.jsx:44-46` — Scrim div (class name typo: "readebility" → "readability")
- `index.css` — `.readebility-scrim` icin CSS tanimlanmamis
**Fix Plan:**
1. `App.jsx` — Class name typo'sunu duzelt: `readebility-scrim` → `readability-scrim`
2. Scrim div'e Tailwind ile yari seffaf siyah arkaplan ekle: `bg-black/50` (veya uygun opacity)
3. Alternatif: `index.css`'e `.readability-scrim` icin ozel CSS tanimla (gradient overlay vb.)
4. Test: Dark modda tum section'lardaki yazilarin okunabilir oldugunu dogrula

### BUG-2: Hamburger menu desktop'ta gorunuyor (MEDIUM)
**Problem:** Navbar'daki hamburger menu butonu (`Navbar.jsx:92-113`) hem mobile hem desktop'ta gorunuyor. Desktop'ta nav link'leri zaten mevcut, hamburger gereksiz.
**Root Cause:** Hamburger `<button>` elemaninda `md:hidden` class'i eksik. Sadece mobile panel (`Navbar.jsx:118`) `md:hidden` class'ina sahip.
**Affected Files:**
- `Navbar.jsx:92-97` — Hamburger button wrapper
**Fix Plan:**
1. Hamburger button'a `md:hidden` class'i ekle (veya button'un parent div'ini md breakpoint ile gizle)
2. Theme toggle butonu desktop'ta gorunmeye devam etmeli — sadece hamburger gizlenecek
3. Mevcut `<div className="flex items-center gap-3">` wrapper'ini iki ayri container'a bol: biri theme toggle (her zaman gorunur), biri hamburger (sadece mobile)

---

## Planned Pages (Multi-Page Architecture)

### Architecture Shift: SPA → Multi-Page App
Mevcut tek sayfa yapisini React Router ile multi-page yapiya donusturuyoruz. Landing page (Home) mevcut yapisini koruyacak, ek sayfalar ayri route'lar olarak eklenecek.

### Yeni Sayfalar (Siralama)

#### 1. `/partners` — Partners Page
- Mevcut `Partners.jsx` section'ini tam sayfa versiyonuna genislet
- Partner detaylari, case study'ler, isbirligi bilgileri
- LogoLoop carousel'i ust kisimda koru
- Her partner icin detay karti/grid

#### 2. `/services` — Services Page
- Mevcut 9 servis kartini tam sayfa deneyimine donustur
- Her servis icin genisletilmis aciklama, ozellikler, fiyatlandirma bilgisi
- Servis detay alt-sayfalari veya accordion/tab yapisi
- CTA (Call to Action) butonlari

#### 3. `/about` — About Page
- Mevcut About section'ini genislet
- Takim tanitimi (team members)
- Sirket hikayesi / misyon / vizyon
- Degerler ve calisma prensipleri
- Ofis/lokasyon bilgileri

#### 4. `/contact` — Contact Page
- Gercek iletisim formu (form submission)
- Harita entegrasyonu (Google Maps veya alternatif)
- Kurumsal adres, telefon, e-posta
- Sosyal medya linkleri
- Calisma saatleri

#### 5. `/site-map` — Site Map Page
- Tum sayfalarin ve alt-sayfalarin listesi
- SEO icin HTML site haritasi
- Footer'dan ve nav'dan erisilebilir link yapisi

### Implementation Plan
1. `react-router-dom` kur (`bun add react-router-dom`)
2. `src/pages/` dizini olustur (her route icin ayri page component)
3. `src/layouts/MainLayout.jsx` olustur (Navbar + ColorBends + Footer sarmalayici)
4. `main.jsx` veya `App.jsx`'de `BrowserRouter` + `Routes` + `Route` yapilandirmasi
5. Navbar link'lerini anchor (`#section`) yerine route (`/partners`) olarak guncelle
6. Landing page (Home) icin mevcut section yapisi korunacak
7. Her yeni sayfa icin `pages/PartnersPage.jsx`, `pages/ServicesPage.jsx` vb. olustur
8. Sayfa gecislerinde FadeIn animasyonlarini uygula

### Yeni Dosya Yapisi (Planlanan)
```
src/
├── pages/
│   ├── HomePage.jsx        # Mevcut landing page icerigini tasiyan wrapper
│   ├── PartnersPage.jsx    # /partners route
│   ├── ServicesPage.jsx    # /services route
│   ├── AboutPage.jsx       # /about route
│   ├── ContactPage.jsx     # /contact route
│   └── SiteMapPage.jsx     # /site-map route
├── layouts/
│   └── MainLayout.jsx      # Navbar + ColorBends bg + Footer (shared layout)
├── components/             # Mevcut componentler (section + efekt)
├── context/
├── config/
├── lib/
├── main.jsx               # BrowserRouter entry
├── App.jsx                # Routes tanimlamasi
└── index.css
```

---

## Next Steps (Oncelik Sirasi)
1. **BUG-1:** ColorBends dark mode readability fix
2. **BUG-2:** Hamburger menu desktop gizleme
3. **React Router kurulumu** ve layout yapisi
4. **HomePage.jsx** — mevcut landing icerigini page'e tasi
5. **PartnersPage.jsx** olustur
6. **ServicesPage.jsx** olustur
7. **AboutPage.jsx** olustur
8. **ContactPage.jsx** olustur
9. **SiteMapPage.jsx** olustur
10. Navbar link'lerini route'lara guncelle

## Active Decisions
- **Theme approach:** Conditional class strings per component (not Tailwind `dark:` variant)
- **Routing:** React Router DOM ile client-side routing (yakinda eklenecek)
- **WebGL background:** ColorBends tum sayfalarda shared layout uzerinden gorunecek
- **Animation strategy:** FadeIn wrapper + Lenis smooth scroll
- **Page structure:** `src/pages/` dizini route-level componentler icin, `src/components/` mevcut section/UI componentleri icin

## Important Patterns
- Every new visual component must accept theme from `useTheme()` and apply conditional styles
- Card-based layouts use consistent `rounded-2xl border backdrop-blur-md` pattern
- Theme-specific classes follow: `theme === "light" ? lightClasses : darkClasses`
- Content data is defined as default props arrays, making components reusable
- Use `<FadeIn>` wrapper for scroll-triggered entrance animations on sections
- Page components go in `src/pages/`, reusable UI in `src/components/`
- Shared layout (Navbar, ColorBends, Footer) managed via `MainLayout.jsx`
