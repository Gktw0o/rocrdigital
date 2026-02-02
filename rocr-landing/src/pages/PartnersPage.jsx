import React from "react";
import SEO from "../components/SEO";
import { useTheme } from "../context/ThemeContext";
import InfiniteLogoScroll from "../components/InfiniteLogoScroll";
import FadeIn from "../components/FadeIn";

// Partner logos - dark version for light theme, white version for dark theme
const partnerLogos = [
  { name: "Anatolicus", dark: "/partners/rocr-anatolicus-dark.svg", white: "/partners/rocr-anatolicus-white.svg" },
  { name: "Antalyaspor", dark: "/partners/rocr-antalyaspor-dark.svg", white: "/partners/rocr-antalyaspor-white.svg" },
  { name: "EventPlus", dark: "/partners/rocr-eventplus-dark.svg", white: "/partners/rocr-eventplus-white.svg" },
  { name: "HostDirekt", dark: "/partners/rocr-hostdirekt-dark.svg", white: "/partners/rocr-hostdirekt-white.svg" },
  { name: "İBÜ", dark: "/partners/rocr-ibü-dark.svg", white: "/partners/rocr-ibü-white.svg" },
  { name: "Maraş Ceviz", dark: "/partners/rocr-maras-ceviz-dark.svg", white: "/partners/rocr-maras-ceviz-white.svg" },
  { name: "MICE", dark: "/partners/rocr-mice-dark.svg", white: "/partners/rocr-mice-white.svg" },
];

const caseStudies = [
  {
    partner: "Antalyaspor",
    title: "Digital Fan Experience Platform",
    desc: "Comprehensive digital platform for fan engagement, match-day experiences, and club communications reaching over 500K supporters.",
    tags: ["Web Experiences", "Content Production"],
  },
  {
    partner: "HostDirekt",
    title: "Cloud Infrastructure & DevOps",
    desc: "Migrated legacy hosting infrastructure to modern cloud architecture with 99.99% uptime SLA and automated deployment pipelines.",
    tags: ["Cloud & DevOps", "Performance & SEO"],
  },
  {
    partner: "EventPlus",
    title: "Event Management System",
    desc: "Full-stack event management platform with AI-powered scheduling, ticketing integration, and real-time analytics dashboards.",
    tags: ["AI & Automation", "Web Experiences"],
  },
  {
    partner: "Anatolicus",
    title: "E-commerce & Brand Identity",
    desc: "Complete brand refresh and Shopify storefront with custom checkout flow, increasing online revenue by 140% in the first quarter.",
    tags: ["Brand & Identity", "E-commerce"],
  },
  {
    partner: "İBÜ",
    title: "Educational Content Platform",
    desc: "Produced a library of 50+ educational videos with custom motion graphics and interactive learning modules for student engagement.",
    tags: ["Content Production", "Strategy & Consulting"],
  },
  {
    partner: "MICE",
    title: "Business Intelligence Dashboard",
    desc: "Custom analytics platform with real-time KPI tracking, automated reporting, and executive dashboard for data-driven decision making.",
    tags: ["Strategy & Consulting", "AI & Automation"],
  },
];

export default function PartnersPage() {
  const { theme } = useTheme();

  // Select appropriate logo version based on theme
  const partners = partnerLogos.map((partner) => ({
    src: theme === "light" ? partner.dark : partner.white,
    alt: partner.name,
  }));

  const shell =
    theme === "light"
      ? "rounded-2xl border border-black/10 bg-white/70 backdrop-blur-md shadow-sm"
      : "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md";

  const titleClass = theme === "light" ? "text-black/90" : "text-white/90";
  const descClass = theme === "light" ? "text-black/60" : "text-white/70";
  const cardBg =
    theme === "light"
      ? "bg-white/80 hover:bg-white"
      : "bg-white/10 hover:bg-white/15";
  const ringClass = theme === "light" ? "ring-black/10" : "ring-white/10";
  const tagClass =
    theme === "light"
      ? "bg-black/5 text-black/70"
      : "bg-white/10 text-white/70";
  const fadeColor =
    theme === "light" ? "rgba(255,255,255,0.7)" : "rgba(5,5,5,0.85)";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <SEO
        title="Partners"
        description="Discover our trusted partners and collaborations. We work with forward-thinking companies across industries to deliver measurable impact through digital solutions."
        path="/partners"
      />
      {/* Header */}
      <FadeIn>
        <div className="text-center">
          <h1 className={`text-3xl font-bold ${titleClass}`}>Our Partners</h1>
          <p className={`mt-3 max-w-2xl mx-auto text-sm leading-relaxed ${descClass}`}>
            We collaborate with forward-thinking companies across industries to deliver measurable
            impact. Here are some of the organizations we've had the privilege to work with.
          </p>
        </div>
      </FadeIn>

      {/* Logo Carousel */}
      <FadeIn delay={0.1}>
        <div className={`py-8 ${shell}`}>
          <InfiniteLogoScroll
            logos={partners}
            speed={25}
            direction="left"
            logoHeight={196}
            gap={80}
            pauseOnHover
            scaleOnHover
          />
        </div>
      </FadeIn>

      {/* Case Studies */}
      <FadeIn delay={0.15}>
        <div className={`p-6 sm:p-8 ${shell}`}>
          <h2 className={`text-xl font-semibold text-center ${titleClass}`}>
            Case Studies
          </h2>
          <p className={`mt-2 text-sm text-center ${descClass}`}>
            Real results from real partnerships.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((study, i) => (
              <article
                key={i}
                className={`flex flex-col rounded-xl ${cardBg} transition-colors ring-1 ${ringClass} ring-inset p-5`}
              >
                <div className={`text-xs font-semibold uppercase tracking-wide ${descClass}`}>
                  {study.partner}
                </div>
                <h3 className={`mt-2 text-sm font-semibold ${titleClass}`}>
                  {study.title}
                </h3>
                <p className={`mt-2 text-sm flex-1 ${descClass}`}>{study.desc}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {study.tags.map((tag, j) => (
                    <span
                      key={j}
                      className={`text-xs rounded-full px-2 py-0.5 ${tagClass}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
