import React from "react";
import TitleGraphic from "./components/TitleGraphic";
import Navbar from "./components/Navbar";
import TextPressure from "./components/TextPressure";
import ColorBends from "./components/ColorBends";
import BlurText from "./components/BlurText";
import { useTheme } from "./context/ThemeContext";
import Hero from "./components/Hero";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Services from "./components/Services";


const App = () => {
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
        <Services />
        <Contact />
        <Footer />
      </main>
    </>
  )
}

export default App