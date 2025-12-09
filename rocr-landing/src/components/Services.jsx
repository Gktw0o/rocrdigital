import React from "react";
import { useTheme } from "../context/ThemeContext";

const defaultServices = [
  {
    title: "Strategy & Consulting",
    desc: "Positioning, roadmaps, and measurable outcomes aligned to your goals.",
    href: "#",
    icon: "/feature-icon1.svg",
  },
  {
    title: "Brand & Identity",
    desc: "Logo systems, visual language, and guidelines to scale coherently.",
    href: "#",
    icon: "/feature-icon2.svg",
  },
  {
    title: "Web Experiences",
    desc: "Modern websites and apps with React/Next.js, TypeScript, Tailwind.",
    href: "#",
    icon: "/feature-icon3.svg",
  },
  {
    title: "AI & Automation",
    desc: "Workflows, agents, and data integrations to accelerate operations.",
    href: "#",
    icon: "/feature-icon4.svg",
  },
  {
    title: "E‑commerce",
    desc: "Storefronts, subscriptions, and performance optimizations to convert.",
    href: "#",
    icon: "/feature-icon5.svg",
  },
  {
    title: "Content Production",
    desc: "Art direction, video, and motion design for engaging narratives.",
    href: "#",
    icon: "/logo.svg",
  },
  {
    title: "Cloud & DevOps",
    desc: "CI/CD, observability, security hardening, and cost‑efficient infra.",
    href: "#",
    icon: "/logo-v3-white.svg",
  },
  {
    title: "Performance & SEO",
    desc: "Core Web Vitals, accessibility, and search visibility improvements.",
    href: "#",
    icon: "/search.svg",
  },
  {
    title: "Support & Growth",
    desc: "Ongoing iteration, A/B testing, and data‑driven enhancements.",
    href: "#",
    icon: "/ROCR Digital.png",
  },
];

export default function Services({ services = defaultServices }) {
  const { theme } = useTheme();

  const shell =
    theme === "light"
      ? "rounded-2xl border border-black/10 bg-white/70 backdrop-blur-md shadow-sm"
      : "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md";

  const titleClass = theme === "light" ? "text-black/90" : "text-white/90";
  const descClass = theme === "light" ? "text-black/60" : "text-white/70";
  const linkClass =
    theme === "light"
      ? "text-black/80 hover:text-black"
      : "text-white/90 hover:text-white";
  const cardBg =
    theme === "light"
      ? "bg-white/80 hover:bg-white"
      : "bg-white/10 hover:bg-white/15";
  const ringClass =
    theme === "light" ? "ring-black/10" : "ring-white/10";

  return (
    <section aria-labelledby="services-heading" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className={`p-6 sm:p-8 ${shell}`}>
        <div className="text-center">
          <h2 id="services-heading" className={`text-xl font-semibold ${titleClass}`}>
            What We Do
          </h2>
          <p className={`mt-2 text-sm ${descClass}`}>
            A focused set of capabilities to design, build, and grow your digital presence.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <article
              key={i}
              className={`group flex flex-col rounded-xl ${cardBg} transition-colors ring-1 ${ringClass} ring-inset p-4`}
            >
              <div className="flex items-center gap-3">
                {s.icon && (
                  <img
                    src={s.icon}
                    alt=""
                    aria-hidden="true"
                    className="h-8 w-8 shrink-0 rounded-md object-contain opacity-90"
                  />
                )}
                <h3 className={`text-sm font-semibold ${titleClass}`}>{s.title}</h3>
              </div>

              <p className={`mt-2 text-sm ${descClass}`}>{s.desc}</p>

              <div className="mt-3">
                <a
                  href={s.href}
                  className={`inline-flex items-center text-sm font-semibold ${linkClass}`}
                >
                  Learn more <span aria-hidden="true" className="ml-1">›</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}