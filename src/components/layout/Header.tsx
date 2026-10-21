import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { SITE } from "../../data/site.ts";
import { DesktopNav } from "./DesktopNav.tsx";
import { MobileMenu } from "./MobileMenu.tsx";
import { TransitionLink } from "../ui/TransitionLink.tsx";
import { lenis } from "../../lib/lenis.ts";

export interface HeaderProps {
  hasDarkHero?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ hasDarkHero = true }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [overHero, setOverHero] = useState<boolean>(hasDarkHero);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollYRef = useRef(0);
  const isHiddenRef = useRef(false);

  // Requirement 2: Solid blue on ALL pages EXCEPT the Homepage
  const isHome =
    location.pathname === "/" ||
    location.pathname === "" ||
    location.pathname === "/index.html";

  // By default, header is transparent at the top on the Homepage.
  // On ALL pages EXCEPT the Homepage, the header MUST have a solid blue background (var(--blue)).
  const isSolidBlue = !isHome || scrolled || mobileMenuOpen;

  // Sync nav element height to :root variables accurately
  useEffect(() => {
    const updateNavH = () => {
      if (headerRef.current) {
        const h = headerRef.current.offsetHeight || (window.innerWidth < 1024 ? 60 : 80);
        document.documentElement.style.setProperty("--nav-h", `${h}px`);
        if (!isHiddenRef.current) {
          document.documentElement.style.setProperty("--nav-offset", `${h}px`);
        }
      }
    };
    updateNavH();
    window.addEventListener("resize", updateNavH);
    return () => {
      window.removeEventListener("resize", updateNavH);
    };
  }, []);

  // On route change: reset visible state & detect [data-hero]
  useEffect(() => {
    isHiddenRef.current = false;
    setHidden(false);
    if (headerRef.current) {
      headerRef.current.removeAttribute("data-hidden");
      headerRef.current.style.transform = "translateY(0)";
    }
    const navH = headerRef.current?.offsetHeight || (window.innerWidth < 1024 ? 60 : 80);
    document.documentElement.style.setProperty("--nav-offset", `${navH}px`);

    const initialY =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      0;
    lastScrollYRef.current = Math.max(0, initialY);
    setScrolled(initialY > 24);

    let r1: number;
    let r2: number;
    r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => {
        const heroEl = document.querySelector("[data-hero]");
        const hasHero = !!heroEl || hasDarkHero;
        setOverHero(hasHero);
        if (headerRef.current) {
          headerRef.current.setAttribute("data-over-hero", String(hasHero));
        }
      });
    });

    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [location.pathname, hasDarkHero]);

  // Requirement 3: Smart scroll behavior (hide on scroll down, show on scroll up)
  const handleScrollUpdate = useCallback((rawScrollY: number) => {
    const currentScrollY = Math.max(0, rawScrollY);
    const isPast24 = currentScrollY > 24;
    setScrolled(isPast24);

    // Never hide if mobile menu is open or focused inside header
    if (mobileMenuOpen || headerRef.current?.contains(document.activeElement)) {
      if (isHiddenRef.current) {
        isHiddenRef.current = false;
        setHidden(false);
        if (headerRef.current) {
          headerRef.current.removeAttribute("data-hidden");
          headerRef.current.style.transform = "translateY(0)";
        }
        const navH = headerRef.current?.offsetHeight || (window.innerWidth < 1024 ? 60 : 80);
        document.documentElement.style.setProperty("--nav-offset", `${navH}px`);
      }
      lastScrollYRef.current = currentScrollY;
      return;
    }

    // When near top, always show header
    if (currentScrollY <= 24) {
      if (isHiddenRef.current) {
        isHiddenRef.current = false;
        setHidden(false);
        if (headerRef.current) {
          headerRef.current.removeAttribute("data-hidden");
          headerRef.current.style.transform = "translateY(0)";
        }
        const navH = headerRef.current?.offsetHeight || (window.innerWidth < 1024 ? 60 : 80);
        document.documentElement.style.setProperty("--nav-offset", `${navH}px`);
      }
      lastScrollYRef.current = currentScrollY;
      return;
    }

    const diff = currentScrollY - lastScrollYRef.current;

    // Scrolling DOWN -> hide header
    if (diff > 6 && currentScrollY > 50 && !isHiddenRef.current) {
      isHiddenRef.current = true;
      setHidden(true);
      if (headerRef.current) {
        headerRef.current.setAttribute("data-hidden", "true");
        headerRef.current.style.transform = "translateY(-100%)";
      }
      document.documentElement.style.setProperty("--nav-offset", "0px");
      lastScrollYRef.current = currentScrollY;
    }
    // Scrolling UP -> show header
    else if (diff < -6 && isHiddenRef.current) {
      isHiddenRef.current = false;
      setHidden(false);
      if (headerRef.current) {
        headerRef.current.removeAttribute("data-hidden");
        headerRef.current.style.transform = "translateY(0)";
      }
      const navH = headerRef.current?.offsetHeight || (window.innerWidth < 1024 ? 60 : 80);
      document.documentElement.style.setProperty("--nav-offset", `${navH}px`);
      lastScrollYRef.current = currentScrollY;
    }
    // Track reference when continuing in the same state
    else if (!isHiddenRef.current && currentScrollY < lastScrollYRef.current) {
      lastScrollYRef.current = currentScrollY;
    } else if (isHiddenRef.current && currentScrollY > lastScrollYRef.current) {
      lastScrollYRef.current = currentScrollY;
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        0;
      handleScrollUpdate(currentScrollY);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    if (lenis) {
      lenis.on("scroll", onScroll);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      lenis?.off("scroll", onScroll);
    };
  }, [handleScrollUpdate]);

  return (
    <>
      <header
        ref={headerRef}
        data-over-hero={String(overHero)}
        style={{
          backgroundColor: isSolidBlue ? "var(--blue, #1E3A8A)" : "transparent",
          borderColor: isSolidBlue ? "rgba(255, 255, 255, 0.12)" : "transparent",
          transform: hidden ? "translateY(-100%)" : "translateY(0)",
          willChange: "transform",
        }}
        className={`fixed top-0 inset-x-0 z-[220] h-[60px] md:h-[72px] lg:h-[80px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] border-b text-white data-[hidden=true]:-translate-y-full ${
          isSolidBlue ? "shadow-[0_4px_20px_rgba(15,23,42,0.15)]" : ""
        }`}
      >
        <div className="max-w-[1340px] mx-auto h-full px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-6 lg:gap-12 xl:gap-16">
          {/* Brand Lockup */}
          <TransitionLink
            to="/"
            className="flex flex-col text-left group select-none cursor-pointer shrink-0 mr-4 sm:mr-6 lg:mr-12 xl:mr-16"
            aria-label="Steel Mind Engineers Homepage"
          >
            <span className="font-bold text-[14px] sm:text-[15px] lg:text-[17px] text-white tracking-[-0.01em] leading-tight group-hover:text-white/90 transition-colors">
              {SITE.header.title}
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase font-semibold text-white/70 tracking-[0.16em] mt-0.5">
              {SITE.header.sub}
            </span>
          </TransitionLink>

          {/* Desktop Navigation */}
          <DesktopNav />

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center justify-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="w-10 h-10 flex items-center justify-center cursor-pointer text-white bg-transparent border-0 p-0 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                className="overflow-visible pointer-events-none"
              >
                <line
                  x1="2"
                  y1="12"
                  x2="22"
                  y2="12"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{
                    transformBox: "view-box",
                    transformOrigin: "12px 12px",
                    transform: mobileMenuOpen
                      ? "translateY(0px) rotate(45deg)"
                      : "translateY(-4px) rotate(0deg)",
                    transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
                <line
                  x1="2"
                  y1="12"
                  x2="22"
                  y2="12"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{
                    transformBox: "view-box",
                    transformOrigin: "12px 12px",
                    transform: mobileMenuOpen
                      ? "translateY(0px) rotate(-45deg)"
                      : "translateY(4px) rotate(0deg)",
                    transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};
