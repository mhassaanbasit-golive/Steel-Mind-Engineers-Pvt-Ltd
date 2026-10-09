import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV } from "../../data/nav.ts";
import { SITE } from "../../data/site.ts";
import { stopScroll, startScroll } from "../../lib/lenis.ts";

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openSubDivision, setOpenSubDivision] = useState<string | null>(null);
  const initialPathRef = useRef(location.pathname);

  // Close menu only when route actually changes after mounting
  useEffect(() => {
    if (initialPathRef.current !== location.pathname) {
      initialPathRef.current = location.pathname;
      onClose();
    }
  }, [location.pathname, onClose]);

  // Dev log for verification
  useEffect(() => {
    if (isOpen) {
      console.log("[menu] panel mounted and open", isOpen);
    }
  }, [isOpen]);

  // Lock scroll and trap focus
  useEffect(() => {
    if (isOpen) {
      stopScroll();
      const mainEl = document.getElementById("main");
      if (mainEl) mainEl.setAttribute("aria-hidden", "true");
    } else {
      startScroll();
      const mainEl = document.getElementById("main");
      if (mainEl) mainEl.removeAttribute("aria-hidden");
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      startScroll();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      style={{
        background: "var(--blue-glossy)",
      }}
      className="fixed inset-0 z-[200] text-white flex flex-col justify-between overflow-y-auto animate-[slideInRight_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]"
      data-lenis-prevent=""
    >
      {/* Top Bar 64px */}
      <div className="h-[64px] px-5 flex items-center justify-between border-b border-white/16 flex-shrink-0 backdrop-blur-[18px] backdrop-saturate-[180%] [-webkit-backdrop-filter:blur(18px)_saturate(180%)]">
        <Link to="/" onClick={onClose} className="flex flex-col text-left">
          <span className="font-semibold text-[16px] text-white tracking-[-0.01em] leading-tight">
            {SITE.header.title}
          </span>
          <span className="text-[10px] uppercase font-semibold text-white/70 tracking-[0.18em] mt-0.5">
            {SITE.header.sub}
          </span>
        </Link>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="w-11 h-11 flex items-center justify-center text-white cursor-pointer"
        >
          {/* Thin 22px cross */}
          <svg className="w-6 h-6 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Navigation Body */}
      <div className="flex-1 px-5 py-6 divide-y divide-white/16">
        {NAV.map((item) => {
          const isMega = item.label === "Main Divisions";
          const hasChildren = !!item.children || isMega;
          const isSectionOpen = openSection === item.label;

          return (
            <div key={item.label} className="py-2">
              <div className="min-h-[52px] flex items-center justify-between">
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() =>
                      setOpenSection(isSectionOpen ? null : item.label)
                    }
                    className="w-full flex items-center justify-between text-left text-[24px] font-semibold text-white hover:text-white/80 cursor-pointer"
                  >
                    <span>{item.label}</span>
                    {/* Plus / Minus */}
                    <span className="relative w-4 h-4 flex items-center justify-center flex-shrink-0">
                      <span className="absolute w-4 h-[1.5px] bg-white" />
                      <span
                        className={`absolute h-4 w-[1.5px] bg-white transition-transform duration-300 ${
                          isSectionOpen ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                ) : item.external ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[24px] font-semibold text-white hover:text-white/80 block w-full py-1"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    to={item.url}
                    onClick={onClose}
                    className="text-[24px] font-semibold text-white hover:text-white/80 block w-full py-1"
                  >
                    {item.label}
                  </Link>
                )}
              </div>

              {/* Children for About Us & Services */}
              {hasChildren && !isMega && isSectionOpen && item.children && (
                <div className="pl-4 py-2 space-y-3">
                  {/* Overview row for Services only */}
                  {item.label === "Services" && (
                    <Link
                      to="/services/"
                      onClick={onClose}
                      className="block text-[18px] font-semibold text-white/90 py-1"
                    >
                      Overview
                    </Link>
                  )}
                  {item.children.map((child) => (
                    <Link
                      key={child.url}
                      to={child.url}
                      onClick={onClose}
                      className="block text-[17px] text-white/80 hover:text-white py-1"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}

              {/* Main Divisions Multi-level Accordion */}
              {isMega && isSectionOpen && item.divisions && (
                <div className="pl-4 py-2 space-y-4">
                  {item.divisions.map((div) => {
                    const isDivOpen = openSubDivision === div.label;
                    return (
                      <div key={div.label} className="border-b border-white/10 pb-3">
                        <div className="flex items-center justify-between py-1">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenSubDivision(isDivOpen ? null : div.label)
                            }
                            className="w-full flex items-center justify-between text-left text-[18px] font-medium text-white/95"
                          >
                            <span>{div.label}</span>
                            <span className="relative w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">
                              <span className="absolute w-3.5 h-[1.5px] bg-white" />
                              <span
                                className={`absolute h-3.5 w-[1.5px] bg-white transition-transform duration-300 ${
                                  isDivOpen ? "scale-y-0" : "scale-y-100"
                                }`}
                              />
                            </span>
                          </button>
                        </div>

                        {isDivOpen && (
                          <div className="pl-3 pt-2 space-y-2">
                            {/* Overview row for divisions */}
                            <Link
                              to={div.url}
                              onClick={onClose}
                              className="block text-[16px] font-semibold text-white/90 py-1"
                            >
                              Overview
                            </Link>
                            {div.children.map((child) => (
                              <Link
                                key={child.url}
                                to={child.url}
                                onClick={onClose}
                                className="block text-[15px] text-white/80 hover:text-white py-0.5"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fixed Bottom Area with Safe-Area Padding */}
      <div className="px-5 pt-6 pb-[calc(24px+env(safe-area-inset-bottom))] border-t border-white/16 space-y-4 flex-shrink-0 bg-black/10 backdrop-blur-sm">
        <Link
          to="/contact-us/#quote"
          onClick={onClose}
          className="w-full py-3.5 px-6 bg-white text-[var(--blue)] text-center font-semibold text-[13px] uppercase tracking-[0.05em] block cursor-pointer"
        >
          Request a Quote
        </Link>

        <div className="space-y-1 text-[13px] text-white/80">
          <div>
            <a href={`tel:${SITE.tel[0]}`} className="hover:underline">
              {SITE.phones[0]}
            </a>
          </div>
          <div>
            <a href={`mailto:${SITE.email}`} className="hover:underline">
              {SITE.email}
            </a>
          </div>
          <div className="text-white/60">{SITE.headOffice}</div>
        </div>

        {/* Social Icons */}
        <div className="flex items-center space-x-5 pt-1 text-white">
          <a
            href={SITE.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:opacity-75"
          >
            <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          <a
            href={SITE.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:opacity-75"
          >
            <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="0" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a
            href={SITE.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:opacity-75"
          >
            <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a
            href={SITE.social.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="hover:opacity-75"
          >
            <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
            </svg>
          </a>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
