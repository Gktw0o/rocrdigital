import React from "react";
import { useTheme } from "../context/ThemeContext";

const defaultStats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Happy Clients" },
  { value: "5+", label: "Years of Experience" },
  { value: "9", label: "Core Services" },
];

const defaultValues = [
  {
    title: "Design-First Thinking",
    desc: "Every project starts with understanding the problem, then crafting solutions that are both beautiful and functional.",
  },
  {
    title: "Technical Excellence",
    desc: "We leverage modern technologies and best practices to build performant, scalable, and maintainable products.",
  },
  {
    title: "Collaborative Process",
    desc: "Transparent communication and iterative development ensure alignment at every stage.",
  },
];

export default function About({ stats = defaultStats, values = defaultValues }) {
  const { theme } = useTheme();

  const shell =
    theme === "light"
      ? "rounded-2xl border border-black/10 bg-white/70 backdrop-blur-md shadow-sm"
      : "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md";

  const titleClass = theme === "light" ? "text-black/90" : "text-white/90";
  const descClass = theme === "light" ? "text-black/60" : "text-white/70";
  const divider = theme === "light" ? "border-black/10" : "border-white/10";
  const statValueClass = theme === "light" ? "text-black/90" : "text-white";
  const cardBg =
    theme === "light"
      ? "bg-white/80 hover:bg-white"
      : "bg-white/10 hover:bg-white/15";
  const ringClass = theme === "light" ? "ring-black/10" : "ring-white/10";

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className={`p-6 sm:p-8 ${shell}`}>
        {/* Header */}
        <div className="text-center">
          <h2 id="about-heading" className={`text-xl font-semibold ${titleClass}`}>
            About ROCR Digital
          </h2>
          <p className={`mt-3 max-w-2xl mx-auto text-sm leading-relaxed ${descClass}`}>
            We are a digital agency based in Antalya, Türkiye — specializing in design, development, and technology
            solutions that help businesses thrive in the digital landscape. From brand identity to AI-powered
            automation, we bring ideas to life with precision and craft.
          </p>
        </div>

        {/* Stats */}
        <div className={`mt-10 border-t border-b ${divider} py-8`}>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-2xl font-bold ${statValueClass}`}>{stat.value}</div>
                <div className={`mt-1 text-sm ${descClass}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mt-8">
          <h3 className={`text-base font-semibold text-center mb-6 ${titleClass}`}>
            How We Work
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {values.map((v, i) => (
              <article
                key={i}
                className={`flex flex-col rounded-xl ${cardBg} transition-colors ring-1 ${ringClass} ring-inset p-5`}
              >
                <h4 className={`text-sm font-semibold ${titleClass}`}>{v.title}</h4>
                <p className={`mt-2 text-sm ${descClass}`}>{v.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
