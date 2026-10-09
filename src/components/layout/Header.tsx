import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SITE } from "../../data/site.ts";
import { useScrollState } from "../../hooks/useScrollState.ts";
import { DesktopNav } from "./DesktopNav.tsx";
import { MobileMenu } from "./MobileMenu.tsx";

export interface HeaderProps {
  hasDarkHero?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ hasDarkHero = true }) => {
  const { scrolled } = useScrollState(80);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If page does NOT have dark hero, keep scrolled blue style from top
  const isBlueState = !hasDarkHero || scrolled;

  return (
    <>
      <header
        style={
          isBlueState
            ? {
                background: "var(--blue-glass-glossy)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 24px -4px rgba(10,20,50,0.28)",
              }
            : undefined
        }
        className={`fixed top-0 inset-x-0 z-[100] transition-[background,box-shadow,border-color,backdrop-filter] duration-400 ease-out ${
          isBlueState
            ? "backdrop-blur-[18px] backdrop-saturate-[180%] [-webkit-backdrop-filter:blur(18px)_saturate(180%)] border-b border-white/[0.18]"
            : "bg-transparent border-b border-transparent"
        }`}
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
