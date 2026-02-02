import React, { useEffect, useRef, Suspense, lazy } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Lenis from "lenis";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

// Lazy load ColorBends (Three.js) - this is the largest dependency
const ColorBends = lazy(() => import("../components/ColorBends"));

export default function MainLayout() {
  const { theme } = useTheme();
  const lenisRef = useRef(null);
  const location = useLocation();

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

  // Scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const bendColors =
    theme === "light"
      ? ["#57bfff", "#c08cf7", "#ff9b49"]
      : ["#00b7ff", "#a020f0", "#ff7a00"];
  const showScrim = theme === "dark";

  return (
    <>
      <div className="fixed inset-0 -y-20 z-0 pointer-events-none">
        <Suspense fallback={null}>
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
        </Suspense>
      </div>

      {showScrim && (
        <div
          className="readability-scrim fixed inset-0 z-1 pointer-events-none bg-black/50"
          aria-hidden="true"
        />
      )}

      <main className="relative z-10 pt-24">
        <Navbar />
        <Outlet />
        <Footer />
      </main>
    </>
  );
}
