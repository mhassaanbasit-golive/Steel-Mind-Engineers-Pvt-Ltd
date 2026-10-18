import React, { useState, useEffect, useRef } from "react";
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
  const isHomepage = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollYRef = useRef(0);
  const isHiddenRef = useRef(false);

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

  // Smart scroll: hide on fast scroll down, reveal on scroll up
  useEffect(() => {
    const handleScrollUpdate = (scrollY: number) => {
      const isPast50 = scrollY > 50;
      setScrolled(isPast50);

      // Never hide if mobile menu is open or focused inside header
      if (mobileMenuOpen || headerRef.current?.contains(document.activeElement)) {
        if (isHiddenRef.current) {
          isHiddenRef.current = false;
          headerRef.current?.removeAttribute("data-hidden");
          const navH = headerRef.current?.offsetHeight || 60;
          document.documentElement.style.setProperty("--nav-offset", `${navH}px`);
        }
        lastScrollYRef.current = scrollY;
        return;
      }

      const diff = scrollY - lastScrollYRef.current;

      if (scrollY > 100 && diff > 10 && !isHiddenRef.current) {
        // Scrolling down -> hide header
        isHiddenRef.current = true;
        headerRef.current?.setAttribute("data-hidden", "true");
        document.documentElement.style.setProperty("--nav-offset", "0px");
      } else if ((diff < -6 || scrollY < 60) && isHiddenRef.current) {
        // Scrolling up -> show header
        isHiddenRef.current = false;
        headerRef.current?.removeAttribute("data-hidden");
        const navH = headerRef.current?.offsetHeight || 60;
        document.documentElement.style.setProperty("--nav-offset", `${navH}px`);
      }

      lastScrollYRef.current = scrollY;
    };

    if (lenis) {
      const onLenisScroll = (e: any) => handleScrollUpdate(e.scroll || window.scrollY);
      lenis.on("scroll", onLenisScroll);
      return () => {
        lenis?.off("scroll", onLenisScroll);
      };
    } else {
      const onNativeScroll = () => handleScrollUpdate(window.scrollY);
      window.addEventListener("scroll", onNativeScroll, { passive: true });
      return () => window.removeEventListener("scroll", onNativeScroll);
    }
  }, [mobileMenuOpen]);

  // Visual state: transparent on hero if hasDarkHero and not scrolled; otherwise solid Royal Blue
  const isSolidBlue = !hasDarkHero || scrolled || mobileMenuOpen;

  return (
    <>
      <header
        ref={headerRef}
        style={{
          backgroundColor: isSolidBlue ? "#1E3A8A" : "transparent",
          borderColor: isSolidBlue ? "rgba(255, 255, 255, 0.12)" : "transparent",
        }}
        className={`fixed top-0 inset-x-0 z-[220] h-[60px] md:h-[72px] lg:h-[80px] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] border-b text-white data-[hidden=true]:-translate-y-full ${
          isSolidBlue ? "shadow-[0_4px_20px_rgba(15,23,42,0.15)]" : ""
        }`}
      >
        <div className="max-w-[1340px] mx-auto h-full px-4 sm:px-6 lg:px-10 flex items-center justify-between">
          {/* Brand Lockup */}
          <TransitionLink
            to="/"
            className="flex flex-col text-left group select-none cursor-pointer"
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
