import React from "react";
import { useTheme } from "../context/ThemeContext";

const defaultAddress = {
  company: (import.meta.env.VITE_BRAND_NAME || "ROCR Digital"),
  lines: ["Teknokent Ar-Ge 2 Uluğbey Binası, No:3A/31, Konyaaltı/Antalya"],
  phone: "000-000-0000",
};

const defaultInfo = [
  {
    title: "Account Support",
    desc: "Learn more about managing your account and benefits.",
    href: "#",
  },
  {
    title: "Product Support",
    desc: "Get technical support and service options for products.",
    href: "#",
  },
  {
    title: "Job Opportunities",
    desc: "Find openings, internships, and more.",
    href: "#",
  },
  {
    title: "Media and Analyst Info",
    desc: "Get press releases and media contacts.",
    href: "#",
  },
  {
    title: "Email Subscriptions",
    desc: "Update your email address and preferences.",
    href: "#",
  },
];

const defaultFeedback = [
  { label: "Product Feedback", href: "#" },
  { label: "Website Feedback", href: "#" },
  { label: "Developer Feedback", href: "#" },
];

export default function Contact({
  address = defaultAddress,
  info = defaultInfo,
  feedback = defaultFeedback,
}) {
  const { theme } = useTheme();

  const cardClass =
    theme === "light"
      ? "rounded-2xl border border-black/10 bg-white/70 backdrop-blur-md shadow-sm"
      : "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md";

  const dividerClass =
    theme === "light" ? "border-t border-black/10" : "border-t border-white/10";

  const titleClass =
    theme === "light" ? "text-black/90" : "text-white/90";

  const descClass =
    theme === "light" ? "text-black/60" : "text-white/70";

  const linkClass =
    theme === "light"
      ? "text-black/80 hover:text-black"
      : "text-white/90 hover:text-white";

  const buttonClass =
    theme === "light"
      ? "rounded-xl border border-black/10 bg-white/70 px-4 py-2 hover:bg-white text-black/80"
      : "rounded-xl border border-white/10 bg-white/10 px-4 py-2 hover:bg-white/15 text-white/90";

  return (
    <section
      aria-labelledby="contact-heading"
      className="mx-auto w-full max-w-6xl px-4 py-10"
    >
      <div className={cardClass}>
        {/* Corporate Address */}
        <div className="px-6 py-8 text-center sm:px-8">
          <h2 id="contact-heading" className={`text-lg font-semibold ${titleClass}`}>
            Corporate Address
          </h2>
          <div className="mt-3 text-sm">
            <div className={titleClass}>{address.company}</div>
            {address.lines?.map((l, i) => (
              <div key={i} className={descClass}>
                {l}
              </div>
            ))}
            {address.phone && <div className={descClass}>{address.phone}</div>}
          </div>
        </div>

        {/* Divider */}
        <div className={dividerClass} />

        {/* Frequently Requested Info */}
        <div className="px-6 py-8 sm:px-8">
          <h3 className={`text-base font-semibold ${titleClass}`}>
            Frequently Requested Info
          </h3>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {info.map((item, idx) => (
              <div key={idx} className="flex flex-col">
                <div className={`text-sm font-semibold ${titleClass}`}>
                  {item.title}
                </div>
                <div className={`mt-1 text-sm ${descClass}`}>{item.desc}</div>
                <a
                  href={item.href}
                  className={`mt-2 inline-flex items-center text-sm font-semibold ${linkClass}`}
                >
                  Learn more <span aria-hidden="true" className="ml-1">›</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className={dividerClass} />

        {/* Feedback */}
        <div className="px-6 py-8 sm:px-8">
          <h3 className={`text-base font-semibold ${titleClass}`}>Feedback</h3>
          <p className={`mt-2 text-sm ${descClass}`}>
            Tell us how we’re doing. Select the appropriate feedback option.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {feedback.map((f, i) => (
              <a key={i} href={f.href} className={buttonClass}>
                {f.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}