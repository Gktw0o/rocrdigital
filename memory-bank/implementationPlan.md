# Implementation Plan — ROCR Digital System Overhaul

**Created:** 2026-02-03  
**Status:** 🔄 In Progress  
**Priority:** Critical

---

## Executive Summary

Bu plan, ROCR Digital sisteminin tam fonksiyonel hale getirilmesi için gerekli tüm iyileştirmeleri kapsar. Mock data temizliği, gerçek API entegrasyonu, güvenlik denetimi ve UI yeniden tasarımını içerir.

---

## Phase Overview

| Phase | Scope | Priority | Effort |
|-------|-------|----------|--------|
| A | Backend Security Audit | 🔴 Critical | 2-3 saat |
| B | rocr-panel UI Redesign | 🟡 High | 4-6 saat |
| C | Panel → Backend Integration | 🔴 Critical | 3-4 saat |
| D | rocr-landing SSR + API | 🟡 High | 3-4 saat |
| E | Landing Security Audit | 🟠 Medium | 1-2 saat |
| F | Panel Security Audit | 🟠 Medium | 1-2 saat |
| G | End-to-End Testing | 🔴 Critical | 2-3 saat |

**Toplam Tahmini Süre:** 16-24 saat

---

## Phase A: Backend Security Audit

### Mevcut Durum
- Hono.js + Drizzle ORM
- JWT authentication
- PostgreSQL database

### Kontrol Listesi

| Check | Status | Risk |
|-------|--------|------|
| SQL Injection | ⏳ Bekliyor | High |
| JWT Secret Strength | ⏳ Bekliyor | Critical |
| Rate Limiting | ⏳ Bekliyor | Medium |
| Input Validation | ⏳ Bekliyor | High |
| CORS Configuration | ⏳ Bekliyor | Medium |
| Password Hashing | ✅ bcrypt | Low |
| Environment Variables | ⏳ Bekliyor | High |
| Error Exposure | ⏳ Bekliyor | Medium |
| Helmet/Security Headers | ⏳ Bekliyor | Medium |

### Uygulanacak İyileştirmeler
1. Rate limiting middleware
2. Input sanitization (zod validation)
3. Security headers
4. JWT refresh token rotation
5. Audit logging

---

## Phase B: rocr-panel UI Redesign

### Mevcut Sorunlar
- Basic styling
- Inconsistent design language
- Limited responsiveness
- Mock data hardcoded

### Yeni Tasarım Hedefleri
- Premium dark theme
- Glassmorphism components
- Smooth animations
- Responsive layout
- Real-time data updates

### Yeniden Yazılacak Sayfalar

| Page | Priority | Complexity |
|------|----------|------------|
| Dashboard | 🔴 Critical | High |
| Contacts | 🔴 Critical | Medium |
| Projects | 🟡 High | High |
| Calendar | 🟡 High | High |
| Schedule | 🟠 Medium | Medium |
| Time Tracking | 🟠 Medium | Medium |
| Partners | 🟡 High | Medium |
| Services | 🟡 High | Medium |
| Content | 🟠 Medium | Medium |
| Team | 🟠 Medium | Medium |
| Settings | 🟢 Low | Low |

### UI Component Library
- Card
- Button
- Input
- Modal
- Table
- DataGrid
- Chart
- Calendar
- Form

---

## Phase C: Panel → Backend Integration

### Mevcut Durum
- API client tanımlı (`stores/api.js`)
- Mock data sayfaların içinde hardcoded
- Değişiklikler kaydedilmiyor

### Entegrasyon Planı

| Endpoint Group | Status | Pages Affected |
|----------------|--------|----------------|
| /api/v1/auth | ✅ Çalışıyor | Login |
| /api/v1/contacts | ⏳ Bekliyor | Dashboard, Contacts |
| /api/v1/projects | ⏳ Bekliyor | Dashboard, Projects |
| /api/v1/tasks | ⏳ Bekliyor | Projects |
| /api/v1/calendar | ⏳ Bekliyor | Calendar |
| /api/v1/schedule | ⏳ Bekliyor | Schedule |
| /api/v1/time | ⏳ Bekliyor | Time Tracking |
| /api/v1/content | ⏳ Bekliyor | Content |
| /api/v1/users | ⏳ Bekliyor | Team, Settings |

### Mock Data Temizliği
```
src/lib/pages/*.svelte → Tüm hardcoded data kaldırılacak
src/lib/stores/data.js → Real API calls ile değiştirilecek
```

---

## Phase D: rocr-landing SSR + API

### Mevcut Durum
- React + Vite (CSR)
- Contact form API'ye bağlı değil
- Static content

### SSR Dönüşümü
**Seçenek 1:** Next.js migration  
**Seçenek 2:** Remix migration  
**Seçenek 3:** Vite + vite-plugin-ssr  

**Önerilen:** Next.js (en mature SSR solution)

### API Entegrasyonu

| Feature | Endpoint | Status |
|---------|----------|--------|
| Contact Form | POST /api/v1/contacts | ⏳ |
| Services List | GET /api/v1/content | ⏳ |
| Partners Display | GET /api/v1/content | ⏳ |

### SEO İyileştirmeleri
- Server-side meta tags
- Open Graph tags
- JSON-LD structured data
- Sitemap generation

---

## Phase E: Landing Security Audit

### Kontrol Listesi

| Check | Status | Risk |
|-------|--------|------|
| XSS Prevention | ⏳ Bekliyor | High |
| Form Validation | ⏳ Bekliyor | Medium |
| HTTPS Enforcement | ⏳ Bekliyor | High |
| CSP Headers | ⏳ Bekliyor | Medium |
| Dependency Audit | ⏳ Bekliyor | Medium |

---

## Phase F: Panel Security Audit

### Kontrol Listesi

| Check | Status | Risk |
|-------|--------|------|
| Token Storage | ⏳ localStorage → secureStorage | High |
| XSS in Svelte | ⏳ Bekliyor | Medium |
| Tauri Security | ⏳ Bekliyor | Medium |
| API Key Exposure | ⏳ Bekliyor | High |
| Deep Link Security | ⏳ Bekliyor | Low |

---

## Implementation Order

### Week 1: Foundation
```
Day 1-2: Phase A (Backend Security)
Day 3-4: Phase C (Panel API Integration - Contacts, Projects)
Day 5: Phase C (Panel API Integration - Calendar, Schedule)
```

### Week 2: UI & Landing
```
Day 1-2: Phase B (Panel UI Redesign - Core components)
Day 3-4: Phase B (Panel UI Redesign - All pages)
Day 5: Phase D (Landing SSR conversion)
```

### Week 3: Security & Testing
```
Day 1: Phase E (Landing Security)
Day 2: Phase F (Panel Security)
Day 3-4: Phase G (E2E Testing)
Day 5: Deployment
```

---

## Success Criteria

- [ ] Tüm mock data kaldırıldı
- [ ] Panel'de yapılan değişiklikler DB'ye kaydediliyor
- [ ] Landing'den gelen contact formları DB'ye kaydediliyor
- [ ] SSR düzgün çalışıyor
- [ ] Güvenlik denetimleri geçti
- [ ] Tüm sayfalar responsive
- [ ] E2E testler geçiyor

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking changes | High | Git branching, incremental updates |
| Data loss | Critical | Database backups |
| API incompatibility | Medium | Version control, backwards compat |
| Performance degradation | Medium | Performance testing |

---

## Next Action

**Şu an başlanacak:** Phase A - Backend Security Audit
