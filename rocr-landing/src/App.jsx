import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import Navbar from "./components/Navbar";
import ColorBends from "./components/ColorBends";
import { useTheme } from "./context/ThemeContext";
import Hero from "./components/Hero";
import Partners from "./components/Partners";
import Services from "./components/Services";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FadeIn from "./components/FadeIn";


const App = () => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
  const { theme } = useTheme();
  const bendColors =
    theme === "light"
    ? ["#57bfff", "#c08cf7", "#ff9b49"]
    : ["#00b7ff", "#a020f0", "#ff7a00"];
  const showScrim = theme === "dark";

  return (
    <>
      <div className="fixed inset-0 -y-20 z-0 pointer-events-none"> 
        <ColorBends
          className="w-full h-full"
          pointerTarget="window"
          transparent={true}
          autoRotate={0}
          rotation={23}
          scale={2}
          speed={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0}
          noise={0}
          colors={bendColors}
        />
      </div>

      {showScrim && (
        <div
          className="readebility-scrim fixed inset-0 z-[1] pointer-events-none"
          aria-hidden="true" 
        />
      )}  

      <main className="relative z-10 pt-24">
        <Navbar />
        <Hero title="Your Digital Agency"/>

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

        <Footer />
      </main>
    </>
  )
}

export default App