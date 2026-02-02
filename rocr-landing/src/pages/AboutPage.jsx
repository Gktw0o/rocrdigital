import React from "react";
import SEO from "../components/SEO";
import { useTheme } from "../context/ThemeContext";
import FadeIn from "../components/FadeIn";

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "30+", label: "Happy Clients" },
  { value: "5+", label: "Years of Experience" },
  { value: "9", label: "Core Services" },
];

const team = [
  {
    name: "ROCR Digital Team",
    role: "Founders & Leadership",
    desc: "A multidisciplinary team of designers, engineers, and strategists passionate about building exceptional digital products.",
  },
  {
    name: "Design Studio",
    role: "Brand & Visual Design",
    desc: "Our design team crafts visual identities, UI/UX experiences, and motion graphics that tell compelling stories.",
  },
  {
    name: "Engineering Lab",
    role: "Development & Infrastructure",
    desc: "Full-stack engineers specializing in React, Next.js, cloud architecture, AI integrations, and performance optimization.",
  },
];

const values = [
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
  {
    title: "Measurable Impact",
    desc: "We define success through metrics. Every decision is backed by data and tied to real business outcomes.",
  },
];

export default function AboutPage() {
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
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <SEO
        title="About"
        description="Learn about ROCR Digital — a digital agency in Antalya, Türkiye. Meet our team, discover our mission, and see how we deliver design, development, and technology solutions."
        path="/about"
      />
      {/* Header */}
      <FadeIn>
        <div className="text-center">
          <h1 className={`text-3xl font-bold ${titleClass}`}>About ROCR Digital</h1>
          <p className={`mt-3 max-w-2xl mx-auto text-sm leading-relaxed ${descClass}`}>
            We are a digital agency based in Antalya, Türkiye — specializing in design, development,
            and technology solutions that help businesses thrive in the digital landscape.
          </p>
        </div>
      </FadeIn>

      {/* Mission & Vision */}
      <FadeIn delay={0.1}>
        <div className={`p-6 sm:p-8 ${shell}`}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className={`text-lg font-semibold ${titleClass}`}>Our Mission</h2>
              <p className={`mt-3 text-sm leading-relaxed ${descClass}`}>
                To empower businesses with thoughtfully designed, technically excellent digital
                products that drive growth and create lasting value. We believe great software
                is built at the intersection of design, engineering, and strategy.
              </p>
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${titleClass}`}>Our Vision</h2>
              <p className={`mt-3 text-sm leading-relaxed ${descClass}`}>
                To be the most trusted digital partner for ambitious companies, known for
                delivering work that sets new standards in quality, performance, and impact.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Stats */}
      <FadeIn delay={0.15}>
        <div className={`p-6 sm:p-8 ${shell}`}>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-3xl font-bold ${statValueClass}`}>{stat.value}</div>
                <div className={`mt-1 text-sm ${descClass}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Team */}
      <FadeIn delay={0.1}>
        <div className={`p-6 sm:p-8 ${shell}`}>
          <h2 className={`text-xl font-semibold text-center ${titleClass}`}>Our Team</h2>
          <p className={`mt-2 text-sm text-center ${descClass}`}>
            The people behind ROCR Digital.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {team.map((member, i) => (
              <article
                key={i}
                className={`flex flex-col rounded-xl ${cardBg} transition-colors ring-1 ${ringClass} ring-inset p-5`}
              >
                <h3 className={`text-sm font-semibold ${titleClass}`}>{member.name}</h3>
                <div className={`text-xs mt-1 ${descClass}`}>{member.role}</div>
                <p className={`mt-3 text-sm ${descClass}`}>{member.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Values */}
      <FadeIn delay={0.1}>
        <div className={`p-6 sm:p-8 ${shell}`}>
          <h2 className={`text-xl font-semibold text-center ${titleClass}`}>How We Work</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {values.map((v, i) => (
              <article
                key={i}
                className={`flex flex-col rounded-xl ${cardBg} transition-colors ring-1 ${ringClass} ring-inset p-5`}
              >
                <h3 className={`text-sm font-semibold ${titleClass}`}>{v.title}</h3>
                <p className={`mt-2 text-sm ${descClass}`}>{v.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Location */}
      <FadeIn delay={0.1}>
        <div className={`p-6 sm:p-8 text-center ${shell}`}>
          <h2 className={`text-lg font-semibold ${titleClass}`}>Our Office</h2>
          <p className={`mt-3 text-sm ${descClass}`}>
            Teknokent Ar-Ge 2 Uluğbey Binası, No:3A/31
          </p>
          <p className={`text-sm ${descClass}`}>Konyaaltı/Antalya, Türkiye</p>
        </div>
      </FadeIn>
    </div>
  );
}
