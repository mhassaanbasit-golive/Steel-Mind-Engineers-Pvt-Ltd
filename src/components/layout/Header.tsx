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
  const { scrolled } = useScrollState(80);
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
            <span className="font-semibold text-[16px] lg:text-[18px] text-white tracking-[-0.01em] leading-tight">
              {SITE.header.title}
            </span>
            <span className="text-[10px] uppercase font-semibold text-white/70 tracking-[0.18em] mt-0.5">
              {SITE.header.sub}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav />

          {/* Mobile Menu Button 44x44 */}
          <button
            type="button"
            onClick={() => {
              console.log('[menu] toggled', !mobileMenuOpen);
              setMobileMenuOpen((v) => !v);
            }}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="lg:hidden w-11 h-11 flex flex-col items-center justify-center space-y-[6px] cursor-pointer text-white bg-transparent border-0 p-0 relative z-10"
          >
            <span
              className={`w-[22px] h-[1.5px] bg-white transition-transform duration-300 pointer-events-none ${
                mobileMenuOpen ? "translate-y-[3.75px] rotate-45" : ""
              }`}
            />
            <span
              className={`w-[22px] h-[1.5px] bg-white transition-transform duration-300 pointer-events-none ${
                mobileMenuOpen ? "-translate-y-[3.75px] -rotate-45" : ""
              }`}
            />
          </button>
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
