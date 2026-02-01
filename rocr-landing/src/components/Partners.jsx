import React from "react";
import { useTheme } from "../context/ThemeContext";
import { LogoLoop } from "./LogoLoop";

const defaultPartners = [
  { src: "/feature-icon1.svg", alt: "Partner 1" },
  { src: "/feature-icon2.svg", alt: "Partner 2" },
  { src: "/feature-icon3.svg", alt: "Partner 3" },
  { src: "/feature-icon4.svg", alt: "Partner 4" },
  { src: "/feature-icon5.svg", alt: "Partner 5" },
  { src: "/feature-icon1.svg", alt: "Partner 6" },
  { src: "/feature-icon2.svg", alt: "Partner 7" },
  { src: "/feature-icon3.svg", alt: "Partner 8" },
];

export default function Partners({ partners = defaultPartners }) {
  const { theme } = useTheme();

  const shell =
    theme === "light"
      ? "rounded-2xl border border-black/10 bg-white/70 backdrop-blur-md shadow-sm"
      : "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md";

  const titleClass = theme === "light" ? "text-black/90" : "text-white/90";
  const descClass = theme === "light" ? "text-black/60" : "text-white/70";

  const fadeColor = theme === "light" ? "rgba(255,255,255,0.7)" : "rgba(5,5,5,0.85)";

  return (
    <section
      id="partners"
      aria-labelledby="partners-heading"
      className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className={`py-10 ${shell}`}>
        <div className="text-center mb-8 px-6">
          <h2 id="partners-heading" className={`text-xl font-semibold ${titleClass}`}>
            Trusted Partners
          </h2>
          <p className={`mt-2 text-sm ${descClass}`}>
            We collaborate with industry leaders to deliver exceptional results.
          </p>
        </div>

        <div className={theme === "light" ? "opacity-70" : "opacity-60 invert"}>
          <LogoLoop
            logos={partners}
            speed={80}
            direction="left"
            logoHeight={36}
            gap={64}
            pauseOnHover
            fadeOut
            fadeOutColor={fadeColor}
            ariaLabel="Partner logos"
          />
        </div>
      </div>
    </section>
  );
}
