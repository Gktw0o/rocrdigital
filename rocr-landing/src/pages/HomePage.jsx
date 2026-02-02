import React from "react";
import SEO from "../components/SEO";
import Hero from "../components/Hero";
import Partners from "../components/Partners";
import Services from "../components/Services";
import About from "../components/About";
import Contact from "../components/Contact";
import FadeIn from "../components/FadeIn";

export default function HomePage() {
  return (
    <>
      <SEO
        title="Digital Agency"
        description="ROCR Digital is a full-service digital agency specializing in web experiences, AI automation, brand identity, and cloud solutions. Based in Antalya, Türkiye."
        path="/"
      />
      <Hero title="Your Digital Agency" />

      <FadeIn delay={0.1}>
        <Partners />
      </FadeIn>

      <FadeIn delay={0.1}>
        <Services />
      </FadeIn>

      <FadeIn delay={0.1}>
        <About />
      </FadeIn>

      <FadeIn delay={0.1}>
        <Contact />
      </FadeIn>
    </>
  );
}
