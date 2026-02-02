import React, { useState } from "react";
import SEO from "../components/SEO";
import { useTheme } from "../context/ThemeContext";
import FadeIn from "../components/FadeIn";

const socialLinks = [
  { label: "LinkedIn", href: "#" },
  { label: "Twitter / X", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "GitHub", href: "#" },
];

export default function ContactPage() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up form submission (API endpoint, email service, etc.)
    console.log("Form submitted:", formData);
  };

  const shell =
    theme === "light"
      ? "rounded-2xl border border-black/10 bg-white/70 backdrop-blur-md shadow-sm"
      : "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md";

  const titleClass = theme === "light" ? "text-black/90" : "text-white/90";
  const descClass = theme === "light" ? "text-black/60" : "text-white/70";
  const inputClass =
    theme === "light"
      ? "w-full rounded-xl border border-black/10 bg-white/80 px-4 py-2.5 text-sm text-black/90 placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-black/20"
      : "w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20";
  const btnClass =
    theme === "light"
      ? "rounded-full bg-black text-white px-8 py-3 text-sm font-semibold hover:bg-black/90 transition-colors"
      : "rounded-full bg-white text-black px-8 py-3 text-sm font-semibold hover:bg-white/90 transition-colors";
  const linkClass =
    theme === "light"
      ? "text-black/80 hover:text-black underline underline-offset-2"
      : "text-white/90 hover:text-white underline underline-offset-2";
  const divider = theme === "light" ? "border-black/10" : "border-white/10";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <SEO
        title="Contact"
        description="Get in touch with ROCR Digital. Send us a message, visit our office in Antalya, or connect on social media. We'd love to hear about your project."
        path="/contact"
      />
      {/* Header */}
      <FadeIn>
        <div className="text-center">
          <h1 className={`text-3xl font-bold ${titleClass}`}>Contact Us</h1>
          <p className={`mt-3 max-w-xl mx-auto text-sm leading-relaxed ${descClass}`}>
            Have a project in mind? We'd love to hear from you. Fill out the form below
            or reach out directly.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Contact Form */}
        <FadeIn delay={0.1} className="lg:col-span-3">
          <div className={`p-6 sm:p-8 ${shell}`}>
            <h2 className={`text-lg font-semibold ${titleClass}`}>Send a Message</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className={inputClass}
              />
              <textarea
                name="message"
                placeholder="Your message..."
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className={`${inputClass} resize-none`}
              />
              <button type="submit" className={btnClass}>
                Send Message
              </button>
            </form>
          </div>
        </FadeIn>

        {/* Sidebar Info */}
        <FadeIn delay={0.15} className="lg:col-span-2">
          <div className={`p-6 sm:p-8 ${shell} space-y-6`}>
            {/* Address */}
            <div>
              <h3 className={`text-sm font-semibold ${titleClass}`}>Office</h3>
              <p className={`mt-2 text-sm ${descClass}`}>
                ROCR Digital<br />
                Teknokent Ar-Ge 2 Uluğbey Binası<br />
                No:3A/31, Konyaaltı/Antalya<br />
                Türkiye
              </p>
            </div>

            <div className={`border-t ${divider}`} />

            {/* Contact Info */}
            <div>
              <h3 className={`text-sm font-semibold ${titleClass}`}>Direct Contact</h3>
              <p className={`mt-2 text-sm ${descClass}`}>
                Email: hello@rocrdigital.com<br />
                Phone: +90 000 000 0000
              </p>
            </div>

            <div className={`border-t ${divider}`} />

            {/* Hours */}
            <div>
              <h3 className={`text-sm font-semibold ${titleClass}`}>Working Hours</h3>
              <p className={`mt-2 text-sm ${descClass}`}>
                Monday — Friday: 09:00 – 18:00<br />
                Saturday — Sunday: Closed
              </p>
            </div>

            <div className={`border-t ${divider}`} />

            {/* Social */}
            <div>
              <h3 className={`text-sm font-semibold ${titleClass}`}>Follow Us</h3>
              <div className="mt-2 flex flex-wrap gap-3">
                {socialLinks.map((link, i) => (
                  <a key={i} href={link.href} className={`text-sm ${linkClass}`}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
