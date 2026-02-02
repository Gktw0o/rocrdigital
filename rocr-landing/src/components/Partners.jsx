import React from "react";
import { useTheme } from "../context/ThemeContext";
import InfiniteLogoScroll from "./InfiniteLogoScroll";

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

export default function Partners() {
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
    </section>
  );
}
