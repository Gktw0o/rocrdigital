import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const NAV_LINKS = [
    { label: "Home", to: "/" },
    { label: "Partners", to: "/partners" },
    { label: "Services", to: "/services" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
];

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const logoSrc = theme === "light" ? "/logo-v3-black.svg" : "/logo-v3-white.svg";

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    // Close mobile menu on route change
    useEffect(() => {
        if (open) {
            setIsAnimating(true);
            setOpen(false);
            setTimeout(() => setIsAnimating(false), 300);
        }
    }, [location.pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const handleToggle = () => {
        if (open) {
            setIsAnimating(true);
            setOpen(false);
            setTimeout(() => setIsAnimating(false), 300);
        } else {
            setOpen(true);
        }
    };

    const containerClass =
        theme === "light"
            ? "border border-black/10 bg-white/70 shadow-sm"
            : "border border-white/10 bg-black/30";

    const linkClass =
        theme === "light"
            ? "text-black/70 hover:text-black transition-colors"
            : "text-white/80 hover:text-white transition-colors";

    const activeLinkClass =
        theme === "light"
            ? "text-black font-semibold"
            : "text-white font-semibold";

    const iconBtnClass =
        theme === "light"
            ? "rounded-full border border-black/20 p-2 text-black/80 hover:text-black hover:border-black/40 transition-colors"
            : "rounded-full border border-white/20 p-2 text-white/90 hover:text-white hover:border-white/40 transition-colors";

    const mobilePanelClass =
        theme === "light"
            ? "rounded-2xl border border-black/10 bg-white/95 backdrop-blur-xl shadow-xl"
            : "rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-xl";

    const mobileLinkClass =
        theme === "light"
            ? "block rounded-xl px-4 py-3 text-black/80 hover:bg-black/5 hover:text-black transition-all duration-200"
            : "block rounded-xl px-4 py-3 text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200";

    const mobileCtaClass =
        theme === "light"
            ? "block rounded-xl bg-black text-white px-4 py-3 text-center font-semibold hover:bg-black/90 transition-colors"
            : "block rounded-xl bg-white text-black px-4 py-3 text-center font-semibold hover:bg-white/90 transition-colors";

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            <nav aria-label="Main" className="mx-auto max-w-6xl px-4">
                <div className={`mt-4 flex items-center justify-between rounded-full backdrop-blur-md px-4 py-2 ${containerClass}`}>
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logoSrc} alt="ROCR Digital" className="h-10 w-auto" />
                    </Link>

                    <ul className="hidden md:flex items-center gap-6">
                        {NAV_LINKS.map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    className={location.pathname === link.to ? activeLinkClass : linkClass}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Toggle Theme"
                            onClick={() => toggleTheme()}
                            className={iconBtnClass}
                            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                        >
                            {theme === "light" ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            )}
                        </button>

                        {/* Animated Hamburger Button */}
                        <button
                            type="button"
                            aria-label="Toggle Menu"
                            aria-expanded={open}
                            onClick={handleToggle}
                            className={`md:hidden ${iconBtnClass} relative`}
                        >
                            <div className="w-5 h-5 flex flex-col justify-center items-center">
                                <span
                                    className={`block h-0.5 w-4 bg-current transform transition-all duration-300 ease-out ${
                                        open ? "rotate-45 translate-y-0.5" : "-translate-y-1"
                                    }`}
                                />
                                <span
                                    className={`block h-0.5 w-4 bg-current transition-all duration-300 ease-out ${
                                        open ? "opacity-0 scale-0" : "opacity-100"
                                    }`}
                                />
                                <span
                                    className={`block h-0.5 w-4 bg-current transform transition-all duration-300 ease-out ${
                                        open ? "-rotate-45 -translate-y-0.5" : "translate-y-1"
                                    }`}
                                />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu with Animations */}
                <div
                    className={`md:hidden mt-2 overflow-hidden transition-all duration-300 ease-out ${
                        open
                            ? "max-h-[500px] opacity-100 translate-y-0"
                            : isAnimating
                            ? "max-h-0 opacity-0 -translate-y-2"
                            : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                >
                    <div className={`p-4 ${mobilePanelClass}`}>
                        <ul className="flex flex-col gap-1">
                            {NAV_LINKS.map((link, index) => (
                                <li
                                    key={link.to}
                                    className="transform transition-all duration-300 ease-out"
                                    style={{
                                        transitionDelay: open ? `${index * 50}ms` : "0ms",
                                        opacity: open ? 1 : 0,
                                        transform: open ? "translateX(0)" : "translateX(-10px)",
                                    }}
                                >
                                    <Link
                                        to={link.to}
                                        className={mobileLinkClass}
                                        onClick={() => handleToggle()}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li
                                className="pt-3 transform transition-all duration-300 ease-out"
                                style={{
                                    transitionDelay: open ? `${NAV_LINKS.length * 50}ms` : "0ms",
                                    opacity: open ? 1 : 0,
                                    transform: open ? "translateY(0)" : "translateY(10px)",
                                }}
                            >
                                <Link
                                    to="/contact"
                                    className={mobileCtaClass}
                                    onClick={() => handleToggle()}
                                >
                                    Get Started
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;

