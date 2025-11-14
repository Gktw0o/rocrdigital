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


const App = () => {
  const { theme } = useTheme();
  const bendColors =
    theme === "light"
    ? ["#57bfff", "#c08cf7", "#ff9b49"]
    : ["#00b7ff", "#a020f0", "#ff7a00"];

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
      <main className="pt-24">
        <Navbar />
        <Hero />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App