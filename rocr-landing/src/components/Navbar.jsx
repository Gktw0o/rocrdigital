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
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const logoSrc = theme === "light" ? "/logo-v3-black.svg" : "/logo-v3-white.svg";

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    // Close mobile menu on route change
    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

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
            ? "rounded-2xl border border-black/10 bg-white/80 backdrop-blur-md p-3"
            : "rounded-2xl border border-white/10 bg-black/50 backdrop-blur-md p-3";

    const mobileLinkClass =
        theme === "light"
            ? "block rounded-xl px-3 py-2 text-black/80 hover:bg-black/5 hover:text-black transition-colors"
            : "block rounded-xl px-3 py-2 text-white/90 hover:bg-white/10 hover:text-white transition-colors";

    const mobileCtaClass =
        theme === "light"
            ? "block rounded-xl bg-black text-white px-3 py-2 text-center font-semibold"
            : "block rounded-xl bg-white text-black px-3 py-2 text-center font-semibold";

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

                        <button
                            type="button"
                            aria-label="Toggle Menu"
                            aria-expanded={open}
                            onClick={() => setOpen((v) => !v)}
                            className={`md:hidden ${iconBtnClass}`}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="block"
                            >
                                <path
                                    d="M4 6h16M4 12h16M4 18h16"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {open && (
                    <div className={`md:hidden mt-2 ${mobilePanelClass}`}>
                        <ul className="flex flex-col gap-2">
                            {NAV_LINKS.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className={mobileLinkClass}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-2">
                                <Link
                                    to="/contact"
                                    className={mobileCtaClass}
                                >
                                    Get Started
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
