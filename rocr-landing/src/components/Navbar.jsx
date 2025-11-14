import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const NAV_LINKS = [
    { label: "Home", href: "#home" },
    { label: "Partners", href: "#partners" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
];

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const { theme, toggleTheme} = useTheme();
    const logoSrc = theme === "light" ? "/logo-v3-black.svg" : "/logo-v3-white.svg";

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const containerClass =
        theme === "light"
            ? "border border-black/10 bg-white/70 shadow-sm"
            : "border border-white/10 bg-black/30";

    const LinkClass =
        theme === "light"
            ? "text-black/70 hover:text-black transition-colors"
            : "text-white/80 hover:text-white transition-colors";

    const actionBtnClass =
        theme === "light"
            ? "bg-black/90 text-white hover:bg-black"
            : "bg-white/90 text-black hover:bg-white";

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
                    <a href="#" className="flex items-center gap-2">
                        <img src={logoSrc} alt="ROCR Digital" className="h-10 w-auto" />
                    </a>

                    <ul className="hidden md:flex items-center gap-6">
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} className={LinkClass}>
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Toggle Theme"
                            onClick={() => toggleTheme((t) => (t === "light" ? "dark" : "light"))}
                            className={iconBtnClass}
                            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                        >
                            {theme === "light" ? (
                                // ay iconu
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                // güneş iconu
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            )}
                        </button>

                        <button 
                            type="button"
                            aria-label="Toggle Menu"
                            aria-expended={open}
                            onClock={() => setOpen((v) => !v)}
                            className={iconBtnClass}
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
                    <div className='md:hidden mt-2 ${mobilePanelClass}'>
                        <ul className="flex flex-col gap-2">
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className={mobileLinkClass}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                            <li className="pt-2">
                                <a
                                    href="#get-started"
                                    onClick={() => setOpen(false)}
                                    className={mobileCtaClass}
                                >
                                    Get Started
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;