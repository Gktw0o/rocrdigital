import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import FadeIn from "../components/FadeIn";

const siteMap = [
  {
    heading: "Main Pages",
    links: [
      { label: "Home", to: "/" },
      { label: "Partners", to: "/partners" },
      { label: "Services", to: "/services" },
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Strategy & Consulting", to: "/services" },
      { label: "Brand & Identity", to: "/services" },
      { label: "Web Experiences", to: "/services" },
      { label: "AI & Automation", to: "/services" },
      { label: "E-commerce", to: "/services" },
      { label: "Content Production", to: "/services" },
      { label: "Cloud & DevOps", to: "/services" },
      { label: "Performance & SEO", to: "/services" },
      { label: "Support & Growth", to: "/services" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Our Partners", to: "/partners" },
      { label: "Careers", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", to: "/" },
      { label: "Terms of Use", to: "/" },
      { label: "Site Map", to: "/site-map" },
    ],
  },
];

export default function SiteMapPage() {
  const { theme } = useTheme();

  const shell =
    theme === "light"
      ? "rounded-2xl border border-black/10 bg-white/70 backdrop-blur-md shadow-sm"
      : "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md";

  const titleClass = theme === "light" ? "text-black/90" : "text-white/90";
  const descClass = theme === "light" ? "text-black/60" : "text-white/70";
  const linkClass =
    theme === "light"
      ? "text-black/80 hover:text-black transition-colors"
      : "text-white/90 hover:text-white transition-colors";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <FadeIn>
        <div className="text-center">
          <h1 className={`text-3xl font-bold ${titleClass}`}>Site Map</h1>
          <p className={`mt-3 max-w-xl mx-auto text-sm leading-relaxed ${descClass}`}>
            A complete overview of all pages and sections on the ROCR Digital website.
          </p>
        </div>
      </FadeIn>

      {/* Site Map Grid */}
      <FadeIn delay={0.1}>
        <div className={`p-6 sm:p-8 ${shell}`}>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {siteMap.map((group, idx) => (
              <section key={idx}>
                <h2 className={`text-sm font-semibold ${titleClass}`}>{group.heading}</h2>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        to={link.to}
                        className={`text-sm ${linkClass}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
