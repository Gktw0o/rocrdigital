import React from "react";
import SEO from "../components/SEO";
import { useTheme } from "../context/ThemeContext";
import { LogoLoop } from "../components/LogoLoop";
import FadeIn from "../components/FadeIn";

const partners = [
  { src: "/feature-icon1.svg", alt: "Partner 1" },
  { src: "/feature-icon2.svg", alt: "Partner 2" },
  { src: "/feature-icon3.svg", alt: "Partner 3" },
  { src: "/feature-icon4.svg", alt: "Partner 4" },
  { src: "/feature-icon5.svg", alt: "Partner 5" },
  { src: "/feature-icon1.svg", alt: "Partner 6" },
  { src: "/feature-icon2.svg", alt: "Partner 7" },
  { src: "/feature-icon3.svg", alt: "Partner 8" },
];

const caseStudies = [
  {
    partner: "Tech Corp",
    title: "AI-Powered Customer Support Platform",
    desc: "Designed and built a full-stack AI chatbot platform that reduced response times by 60% and improved customer satisfaction scores.",
    tags: ["AI & Automation", "Web Experiences"],
  },
  {
    partner: "Creative Studio",
    title: "Brand Identity & E-Commerce Launch",
    desc: "Complete brand refresh and Shopify storefront that increased online revenue by 140% in the first quarter.",
    tags: ["Brand & Identity", "E-commerce"],
  },
  {
    partner: "FinTech Solutions",
    title: "Cloud Migration & DevOps Pipeline",
    desc: "Migrated legacy infrastructure to AWS with full CI/CD pipelines, cutting deployment time from hours to minutes.",
    tags: ["Cloud & DevOps", "Strategy & Consulting"],
  },
  {
    partner: "Health Plus",
    title: "Performance Optimization & SEO",
    desc: "Achieved 98+ Lighthouse scores and doubled organic search traffic within 3 months through technical SEO and Core Web Vitals work.",
    tags: ["Performance & SEO", "Web Experiences"],
  },
  {
    partner: "EduLearn",
    title: "Content Production & Motion Design",
    desc: "Produced a library of 50+ educational videos with custom motion graphics, increasing user engagement by 85%.",
    tags: ["Content Production", "Strategy & Consulting"],
  },
  {
    partner: "RetailMax",
    title: "Ongoing Support & Growth Program",
    desc: "Monthly A/B testing, feature iteration, and data-driven enhancements leading to a sustained 25% growth in conversions.",
    tags: ["Support & Growth", "E-commerce"],
  },
];

export default function PartnersPage() {
  const { theme } = useTheme();

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
          <div className={theme === "light" ? "opacity-70" : "opacity-60 invert"}>
            <LogoLoop
              logos={partners}
              speed={60}
              direction="left"
              logoHeight={40}
              gap={72}
              pauseOnHover
              fadeOut
              fadeOutColor={fadeColor}
              ariaLabel="Partner logos"
            />
          </div>
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
