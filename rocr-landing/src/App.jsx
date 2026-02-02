import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// Lazy load all page components for code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const PartnersPage = lazy(() => import("./pages/PartnersPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const SiteMapPage = lazy(() => import("./pages/SiteMapPage"));

// Minimal loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50" />
  </div>
);

const App = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="partners" element={<PartnersPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="site-map" element={<SiteMapPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;

