import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SITE } from "../../data/site.ts";
import { useScrollState } from "../../hooks/useScrollState.ts";
import { DesktopNav } from "./DesktopNav.tsx";
import { MobileMenu } from "./MobileMenu.tsx";

export interface HeaderProps {
  hasDarkHero?: boolean;
}

export const Header: React.FC<HeaderProps> = () => {
  const location = useLocation();
  const isHomepage = location.pathname === "/";
  const { scrolled, isScrolling } = useScrollState(80);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // On homepage: transparent for first 80px, then solid Royal Blue.
  // On every inner page: solid Royal Blue at all times.
  const isSolidBlue = !isHomepage || scrolled;

  return (
    <>
      <header
        style={{
          backgroundColor: isSolidBlue ? "var(--blue)" : "transparent",
          borderColor: isSolidBlue ? "rgba(255, 255, 255, 0.12)" : "transparent",
        }}
        className="fixed top-0 inset-x-0 z-[100] transition-[background-color,border-color] duration-300 ease border-b text-white"
      >
        <div className="max-w-[1340px] mx-auto h-[64px] lg:h-[88px] px-5 lg:px-10 flex items-center justify-between">
          {/* Brand Lockup */}
          <Link
            to="/"
            className="flex flex-col text-left group select-none cursor-pointer"
            aria-label="Steel Mind Engineers Homepage"
          >
            <span className="font-semibold text-[15px] lg:text-[17px] text-white tracking-[-0.01em] leading-tight">
              {SITE.header.title}
            </span>
            <span className="text-[9px] uppercase font-semibold text-white/70 tracking-[0.18em] mt-0.5">
              {SITE.header.sub}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav />

          {/* Mobile Menu Button with Soft White Glow and Scroll Animation */}
          <div className="lg:hidden relative flex items-center justify-center">
            {/* Soft white glow aura */}
            <div
              aria-hidden="true"
              className={`absolute inset-0 -m-1.5 rounded-full pointer-events-none transition-all duration-300 ease-out blur-md ${
                isScrolling
                  ? "scale-125 opacity-95 bg-white/45"
                  : "scale-100 opacity-65 bg-white/25"
              }`}
              style={{
                boxShadow: isScrolling
                  ? "0 0 18px 6px rgba(255, 255, 255, 0.65)"
                  : "0 0 12px 3px rgba(255, 255, 255, 0.4)",
              }}
            />

            <button
              type="button"
              onClick={() => {
                console.log('[menu] toggled', !mobileMenuOpen);
                setMobileMenuOpen((v) => !v);
              }}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className={`w-11 h-11 flex flex-col items-center justify-center space-y-[6px] cursor-pointer text-white bg-transparent border-0 p-0 relative z-10 transition-transform duration-300 ease-out ${
                isScrolling && !mobileMenuOpen
                  ? "scale-110 -translate-y-0.5"
                  : ""
              }`}
            >
              <span
                className={`h-[1.5px] bg-white transition-all duration-300 pointer-events-none ${
                  mobileMenuOpen
                    ? "w-[22px] translate-y-[3.75px] rotate-45"
                    : isScrolling
                    ? "w-[17px] translate-x-1 animate-[menuScrollTop_0.5s_ease-in-out_infinite_alternate]"
                    : "w-[22px]"
                }`}
              />
              <span
                className={`h-[1.5px] bg-white transition-all duration-300 pointer-events-none ${
                  mobileMenuOpen
                    ? "w-[22px] -translate-y-[3.75px] -rotate-45"
                    : isScrolling
                    ? "w-[17px] -translate-x-1 animate-[menuScrollBottom_0.5s_ease-in-out_infinite_alternate]"
                    : "w-[22px]"
                }`}
              />
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
