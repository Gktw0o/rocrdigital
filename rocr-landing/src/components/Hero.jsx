import React from "react";
import TitleGraphic from "./TitleGraphic";
import { useTheme } from "../context/ThemeContext";

function Hero({ title = "Your Digital Agency" }) {
  const { theme } = useTheme();
  const artSrc = theme === 'dark' ? "/rocr+vira-white.png" : "/rocr+vira.png";
  return (
    <section className="relative w-full px-4 pt-28 pb-16 flex flex-col items-center justify-center text-center">
      {/* Foreground headline */}
      <h1
        className="font-regular tracking-tight text-[clamp(1.5rem,6vw,3.25rem)] leading-[1.05]"
        style={{ fontFamily: 'var(--font-regular)', textColor: 'var(--text)', color: 'var(--text)', textShadow: '0 2px 10px rgba(0,0,0,0.08),' + '0 0 10px rgba(0,183,255,0.15),' + '0 0 16px rgba(160,32,240,0.12)' }}
      >
        {title}
      </h1>

      {/* Decorative TitleGraphic directly under headline */}
      <div className="mt-3 mx-auto max-w-6xl" aria-hidden="true">
        <TitleGraphic title="Designed for the Future." />
      </div>
      <img
        src={artSrc}
        alt="ROCR X VIRA"
        className="mt-6 w-full mx-auto max-w-[80rem] rounded-2xl ring-1 ring-black/5 dark:ring-white/20 shadow-2xl shadow-black/40"
        loading="lazy"
        decoding="async"
        style={{
            WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0, black 40px, black calc(100% - 40px), transparent 100%)',
            maskImage:
                'linear-gradient(to bottom, transparent 0, black 40px, black calc(100% - 40px), transparent 100%)',
        }}
        />
    </section>
  );

}



export default Hero;