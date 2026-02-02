import React from "react";
import { useTheme } from "../context/ThemeContext";

const brand = import.meta.env.VITE_BRAND_NAME || "ROCR Digital";

const defaultDisclaimers = [
  "Trade‑in value varies and depends on work experience and product model. Offers may not be available in all regions.",
  "Features and services are subject to change and may require additional fees, apps, or subscriptions.",
  `For more details, contact with ${brand}.`,
];

const defaultGroups = [
  {
    heading: "Services",
    links: [
      { label: "All Services", href: "/services" },
      { label: "AI & Automation", href: "/services" },
      { label: "Web Experiences", href: "/services" },
      { label: "Brand & Identity", href: "/services" },
      { label: "Cloud & DevOps", href: "/services" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Partners", href: "/partners" },
      { label: "Careers", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Partners", href: "/partners" },
      { label: "Case Studies", href: "/partners" },
      { label: "Site Map", href: "/site-map" },
    ],
  },
  {
    heading: "For Business",
    links: [
      { label: `${brand} for Business`, href: "/services" },
      { label: "Partner Program", href: "/partners" },
      { label: "Enterprise Solutions", href: "/services" },
      { label: "Consultation", href: "/contact" },
    ],
  },
  {
    heading: `About ${brand}`,
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Team", href: "/about" },
      { label: "Mission & Vision", href: "/about" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

const defaultLegalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Use", href: "#" },
  { label: "Sales and Refunds", href: "#" },
  { label: "Legal", href: "#" },
  { label: "Site Map", href: "/site-map" },
];

export default function Footer({
  disclaimers = defaultDisclaimers,
  groups = defaultGroups,
  legalLinks = defaultLegalLinks,
  region = "Türkiye",
}) {
  const { theme } = useTheme();

  const shell =
    theme === "light"
      ? "bg-white/70 border-t border-black/10 backdrop-blur-md"
      : "bg-white/5 border-t border-white/10 backdrop-blur-md";

  const titleClass = theme === "light" ? "text-black/90" : "text-white/90";
  const subtleClass = theme === "light" ? "text-black/60" : "text-white/70";
  const linkClass =
    theme === "light"
      ? "text-black/80 hover:text-black"
      : "text-white/90 hover:text-white";
  const divider = theme === "light" ? "border-black/10" : "border-white/10";

  const year = new Date().getFullYear();

  return (
    <footer role="contentinfo" className={`w-full ${shell}`}>
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Disclaimers */}
        {disclaimers?.length > 0 && (
          <div className={`text-xs leading-relaxed ${subtleClass} space-y-2`}>
            {disclaimers.map((text, i) => (
              <p key={i}>
                <sup className="mr-1">{i + 1}.</sup>
                {text}
              </p>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className={`my-8 border-t ${divider}`} />

        {/* Links grid */}
        <nav aria-label="Footer" className="w-full">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {groups.map((group, idx) => (
              <section key={idx} aria-labelledby={`footer-group-${idx}`}>
                <h2
                  id={`footer-group-${idx}`}
                  className={`text-sm font-semibold ${titleClass}`}
                >
                  {group.heading}
                </h2>
                <ul className="mt-3 space-y-2">
                  {group.links?.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.href}
                        className={`text-sm transition-colors ${linkClass}`}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </nav>

        {/* Divider */}
        <div className={`my-8 border-t ${divider}`} />

        {/* “More ways” row */}
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row">
          <p className={`text-sm ${subtleClass}`}>
            More ways to work with {brand}:{" "}
            <a href="/partners" className={`underline underline-offset-2 ${linkClass}`}>
              find a partner
            </a>{" "}
            or{" "}
            <a href="/contact" className={`underline underline-offset-2 ${linkClass}`}>
              contact a specialist
            </a>
            .
          </p>
        </div>

        {/* Divider */}
        <div className={`my-6 border-t ${divider}`} />

        {/* Legal/meta bar */}
        <div className="flex flex-col items-start justify-between gap-y-3 md:flex-row md:items-center">
          <div className={`text-xs ${subtleClass}`}>
            © {year} {brand}. All rights reserved.
          </div>

          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            {legalLinks.map((l, i) => (
              <li key={i}>
                <a href={l.href} className={`${linkClass}`}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className={`text-xs ${subtleClass}`}>{region}</div>
        </div>
      </div>
    </footer>
  );
}