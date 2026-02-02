import React from "react";

/**
 * Simple CSS-based infinite logo scroll component
 * Uses CSS keyframe animation for reliable smooth scrolling
 */
export default function InfiniteLogoScroll({
  logos,
  speed = 30, // seconds for one complete cycle
  direction = "left",
  logoHeight = 48,
  gap = 64,
  pauseOnHover = true,
  scaleOnHover = false,
  className = "",
}) {
  const isReverse = direction === "right";

  return (
    <div
      className={`overflow-hidden relative group ${className}`}
      style={{
        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div
        className="flex w-max animate-scroll"
        style={{
          "--scroll-speed": `${speed}s`,
          animationDirection: isReverse ? "reverse" : "normal",
        }}
      >
        {/* First set of logos */}
        <div className="flex items-center shrink-0" style={{ gap: `${gap}px` }}>
          {logos.map((logo, index) => (
            <img
              key={`a-${index}`}
              src={logo.src}
              alt={logo.alt || ""}
              className={`shrink-0 object-contain transition-transform duration-300 ${
                scaleOnHover ? "hover:scale-110" : ""
              }`}
              style={{ height: `${logoHeight}px`, width: "auto" }}
              loading="eager"
              draggable={false}
            />
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="flex items-center shrink-0" style={{ gap: `${gap}px`, marginLeft: `${gap}px` }}>
          {logos.map((logo, index) => (
            <img
              key={`b-${index}`}
              src={logo.src}
              alt={logo.alt || ""}
              className={`shrink-0 object-contain transition-transform duration-300 ${
                scaleOnHover ? "hover:scale-110" : ""
              }`}
              style={{ height: `${logoHeight}px`, width: "auto" }}
              loading="eager"
              draggable={false}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll var(--scroll-speed, 30s) linear infinite;
        }
        ${pauseOnHover ? `
        .group:hover .animate-scroll {
          animation-play-state: paused;
        }
        ` : ""}
      `}</style>
    </div>
  );
}

