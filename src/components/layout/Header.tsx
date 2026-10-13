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
  // On every inner page or when menu is open: solid Royal Blue.
  const isSolidBlue = !isHomepage || scrolled || mobileMenuOpen;

  return (
    <>
      <header
        style={{
          backgroundColor: isSolidBlue ? "var(--blue)" : "transparent",
          borderColor: isSolidBlue ? "rgba(255, 255, 255, 0.12)" : "transparent",
        }}
        className="fixed top-0 inset-x-0 z-[220] transition-[background-color,border-color] duration-300 ease border-b text-white"
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

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((v) => !v);
              }}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="w-11 h-11 flex items-center justify-center cursor-pointer text-white bg-transparent border-0 p-0"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="overflow-visible pointer-events-none"
              >
                <line
                  x1="1"
                  y1="12"
                  x2="23"
                  y2="12"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  style={{
                    transformBox: "view-box",
                    transformOrigin: "12px 12px",
                    transform: mobileMenuOpen
                      ? "translateY(0px) rotate(45deg)"
                      : "translateY(-3.75px) rotate(0deg)",
                    transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                />
                <line
                  x1="1"
                  y1="12"
                  x2="23"
                  y2="12"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  style={{
                    transformBox: "view-box",
                    transformOrigin: "12px 12px",
                    transform: mobileMenuOpen
                      ? "translateY(0px) rotate(-45deg)"
                      : "translateY(3.75px) rotate(0deg)",
                    transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
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
