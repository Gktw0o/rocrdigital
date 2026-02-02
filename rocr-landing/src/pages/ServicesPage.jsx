import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { useTheme } from "../context/ThemeContext";
import FadeIn from "../components/FadeIn";

const services = [
  {
    title: "Strategy & Consulting",
    desc: "Positioning, roadmaps, and measurable outcomes aligned to your goals.",
    details: [
      "Market research & competitive analysis",
      "Digital transformation roadmaps",
      "KPI frameworks & measurement strategies",
      "Stakeholder workshops & alignment sessions",
    ],
  },
  {
    title: "Brand & Identity",
    desc: "Logo systems, visual language, and guidelines to scale coherently.",
    details: [
      "Logo design & brand mark systems",
      "Color palettes & typography selection",
      "Brand guidelines documentation",
      "Visual identity across digital & print",
    ],
  },
  {
    title: "Web Experiences",
    desc: "Modern websites and apps with React/Next.js, TypeScript, Tailwind.",
    details: [
      "Responsive web applications",
      "Progressive Web Apps (PWA)",
      "Server-side rendering & static generation",
      "Interactive UI with animations & WebGL",
    ],
  },
  {
    title: "AI & Automation",
    desc: "Workflows, agents, and data integrations to accelerate operations.",
    details: [
      "Custom AI chatbots & assistants",
      "Workflow automation pipelines",
      "Data integration & ETL processes",
      "Machine learning model deployment",
    ],
  },
  {
    title: "E-commerce",
    desc: "Storefronts, subscriptions, and performance optimizations to convert.",
    details: [
      "Shopify & custom storefront builds",
      "Payment gateway integrations",
      "Subscription & recurring billing",
      "Conversion rate optimization (CRO)",
    ],
  },
  {
    title: "Content Production",
    desc: "Art direction, video, and motion design for engaging narratives.",
    details: [
      "Video production & post-production",
      "Motion graphics & animation",
      "Photography & art direction",
      "Social media content strategy",
    ],
  },
  {
    title: "Cloud & DevOps",
    desc: "CI/CD, observability, security hardening, and cost-efficient infra.",
    details: [
      "AWS / GCP / Azure cloud architecture",
      "CI/CD pipeline configuration",
      "Infrastructure as Code (Terraform, Pulumi)",
      "Monitoring, logging & alerting",
    ],
  },
  {
    title: "Performance & SEO",
    desc: "Core Web Vitals, accessibility, and search visibility improvements.",
    details: [
      "Core Web Vitals optimization",
      "Technical SEO audits & fixes",
      "Accessibility (WCAG) compliance",
      "Page speed & bundle optimization",
    ],
  },
  {
    title: "Support & Growth",
    desc: "Ongoing iteration, A/B testing, and data-driven enhancements.",
    details: [
      "Monthly retainer & support plans",
      "A/B testing & experimentation",
      "Analytics dashboards & reporting",
      "Feature iteration & roadmap planning",
    ],
  },
];

export default function ServicesPage() {
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
  const ctaClass =
    theme === "light"
      ? "bg-black text-white hover:bg-black/90"
      : "bg-white text-black hover:bg-white/90";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <SEO
        title="Services"
        description="Explore our 9 core services: Strategy, Brand Identity, Web Development, AI Automation, E-commerce, Content Production, Cloud DevOps, SEO, and Ongoing Support."
        path="/services"
      />
      {/* Header */}
      <FadeIn>
        <div className="text-center">
          <h1 className={`text-3xl font-bold ${titleClass}`}>Our Services</h1>
          <p className={`mt-3 max-w-2xl mx-auto text-sm leading-relaxed ${descClass}`}>
            A focused set of capabilities to design, build, and grow your digital presence.
            Each service is tailored to deliver measurable outcomes.
          </p>
        </div>
      </FadeIn>

      {/* Services Grid */}
      {services.map((service, i) => (
        <FadeIn key={i} delay={0.05 * i}>
          <div className={`p-6 sm:p-8 ${shell}`}>
            <div>
              <h2 className={`text-lg font-semibold ${titleClass}`}>{service.title}</h2>
              <p className={`mt-1 text-sm ${descClass}`}>{service.desc}</p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {service.details.map((detail, j) => (
                <div
                  key={j}
                  className={`flex items-start gap-2 rounded-xl ${cardBg} ring-1 ${ringClass} ring-inset p-3 transition-colors`}
                >
                  <span className={`mt-0.5 text-sm ${titleClass}`}>&#10003;</span>
                  <span className={`text-sm ${descClass}`}>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      ))}

      {/* CTA */}
      <FadeIn delay={0.1}>
        <div className="text-center">
          <p className={`text-sm ${descClass}`}>
            Ready to start your project?
          </p>
          <Link
            to="/contact"
            className={`mt-4 inline-block rounded-full px-8 py-3 text-sm font-semibold transition-colors ${ctaClass}`}
          >
            Get in Touch
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
