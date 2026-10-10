import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV } from "../../data/nav.ts";
import { SITE } from "../../data/site.ts";
import { A } from "../../data/assets.ts";
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
        background: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
      }}
      className="fixed inset-0 z-[200] text-[var(--ink)] flex flex-col justify-between overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden animate-[menuSlideIn_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]"
      data-lenis-prevent=""
    >
      {/* Floating Close Cross (Top Right, 20px, 44px touch) */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close navigation menu"
        className="fixed top-5 right-5 z-[210] w-11 h-11 flex items-center justify-center text-[var(--ink)] hover:opacity-70 transition-opacity cursor-pointer animate-[fadeIn_0.3s_ease-out]"
      >
        <svg className="w-6 h-6 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Main Content Area: Link list starts at top: 64px from panel top */}
      <div className="pt-16 pb-8 px-6 max-w-[480px] w-full mx-auto flex-1 flex flex-col justify-between">
        {/* Links List */}
        <div className="divide-y divide-[var(--line)]">
          {NAV.map((item, idx) => {
            const isMega = item.label === "Main Divisions";
            const hasChildren = !!item.children || isMega;
            const isSectionOpen = openSection === item.label;

            return (
              <div
                key={item.label}
                style={{
                  animation: `itemFadeIn 0.5s cubic-bezier(0.16,1,0.3,1) ${idx * 0.04}s both`,
                }}
                className="py-1"
              >
                <div className="h-[44px] flex items-center justify-between">
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSection(isSectionOpen ? null : item.label)
                      }
                      className="w-full flex items-center justify-between text-left text-[18px] lg:text-[20px] font-semibold text-[var(--ink)] hover:text-[var(--blue)] transition-colors cursor-pointer"
                    >
                      <span>{item.label}</span>
                      {/* Thin Plus / Minus */}
                      <span className="relative w-4 h-4 flex items-center justify-center flex-shrink-0">
                        <span className="absolute w-3.5 h-[1.5px] bg-[var(--ink)]" />
                        <span
                          className={`absolute h-3.5 w-[1.5px] bg-[var(--ink)] transition-transform duration-300 ${
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
                      className="text-[18px] lg:text-[20px] font-semibold text-[var(--ink)] hover:text-[var(--blue)] transition-colors block w-full leading-[44px]"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.url}
                      onClick={onClose}
                      className="text-[18px] lg:text-[20px] font-semibold text-[var(--ink)] hover:text-[var(--blue)] transition-colors block w-full leading-[44px]"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>

                {/* Sub-links: About Us & Services */}
                {hasChildren && !isMega && isSectionOpen && item.children && (
                  <div className="pl-4 py-2 space-y-1 transition-all">
                    {item.label === "Services" && (
                      <Link
                        to="/services/"
                        onClick={onClose}
                        className="block h-[38px] leading-[38px] text-[15px] font-medium text-[var(--grey)] hover:text-[var(--blue)] transition-colors"
                      >
                        Overview
                      </Link>
                    )}
                    {item.children.map((child) => (
                      <Link
                        key={child.url}
                        to={child.url}
                        onClick={onClose}
                        className="block h-[38px] leading-[38px] text-[15px] font-medium text-[var(--grey)] hover:text-[var(--blue)] transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Sub-links & Sub-sub-links: Main Divisions */}
                {isMega && isSectionOpen && item.divisions && (
                  <div className="pl-4 py-2 space-y-2 transition-all">
                    {item.divisions.map((div) => {
                      const isDivOpen = openSubDivision === div.label;
                      return (
                        <div key={div.label} className="border-b border-[var(--line)]/60 pb-2 last:border-b-0">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenSubDivision(isDivOpen ? null : div.label)
                            }
                            className="w-full flex items-center justify-between text-left h-[38px] text-[15px] font-medium text-[var(--ink)] hover:text-[var(--blue)] transition-colors"
                          >
                            <span>{div.label}</span>
                            <span className="relative w-3 h-3 flex items-center justify-center flex-shrink-0">
                              <span className="absolute w-2.5 h-[1px] bg-[var(--grey)]" />
                              <span
                                className={`absolute h-2.5 w-[1px] bg-[var(--grey)] transition-transform duration-300 ${
                                  isDivOpen ? "scale-y-0" : "scale-y-100"
                                }`}
                              />
                            </span>
                          </button>

                          {isDivOpen && (
                            <div className="pl-6 pt-1 pb-2 space-y-1">
                              <Link
                                to={div.url}
                                onClick={onClose}
                                className="block h-[34px] leading-[34px] text-[13px] font-normal text-[var(--grey)] hover:text-[var(--blue)] transition-colors"
                              >
                                Overview
                              </Link>
                              {div.children.map((child) => (
                                <Link
                                  key={child.url}
                                  to={child.url}
                                  onClick={onClose}
                                  className="block h-[34px] leading-[34px] text-[13px] font-normal text-[var(--grey)] hover:text-[var(--blue)] transition-colors"
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

        {/* Logo at the end of the menu (bottom of panel) */}
        <div
          style={{
            animation: "logoFadeIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.35s both",
          }}
          className="mt-8 pt-6 border-t border-[var(--line)] flex flex-col space-y-3 pb-[calc(24px+env(safe-area-inset-bottom))]"
        >
          {/* Transparent Logo 100px ink */}
          <Link to="/" onClick={onClose} className="inline-block">
            <img
              src={A.logoTransparent}
              alt="Steel Mind Engineers"
              className="w-[100px] h-auto object-contain brightness-0"
            />
          </Link>

          {/* Text Lockup */}
          <div className="flex flex-col text-left">
            <span className="font-semibold text-[13px] text-[var(--ink)] leading-tight">
              {SITE.header.title}
            </span>
            <span className="text-[9px] uppercase font-semibold text-[var(--grey)] tracking-[0.18em] mt-0.5">
              {SITE.header.sub}
            </span>
          </div>

          {/* Tagline */}
          <div className="text-[11px] text-[var(--grey)]">
            {SITE.tagline}
          </div>

          {/* Contact Block: 11px grey, line-height 1.6 */}
          <div className="text-[11px] text-[var(--grey)] leading-[1.6] space-y-0.5">
            <div>
              <a href={`tel:${SITE.tel[0]}`} className="hover:text-[var(--blue)] hover:underline">
                {SITE.phones[0]}
              </a>
              {" · "}
              <a href={`tel:${SITE.tel[1]}`} className="hover:text-[var(--blue)] hover:underline">
                {SITE.phones[1]}
              </a>
            </div>
            <div>
              <a href={`mailto:${SITE.email}`} className="hover:text-[var(--blue)] hover:underline">
                {SITE.email}
              </a>
            </div>
            <div>
              <a
                href={SITE.mapHeadOffice}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--blue)] hover:underline"
              >
                {SITE.headOffice}
              </a>
            </div>
          </div>

          {/* Four Social Icons (18px thin line, ink, gap 14px) */}
          <div className="flex items-center space-x-[14px] pt-1 text-[var(--ink)]">
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-[var(--blue)] transition-colors"
            >
              <svg className="w-[18px] h-[18px] stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-[var(--blue)] transition-colors"
            >
              <svg className="w-[18px] h-[18px] stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="0" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href={SITE.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="hover:text-[var(--blue)] transition-colors"
            >
              <svg className="w-[18px] h-[18px] stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>
            <a
              href={SITE.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-[var(--blue)] transition-colors"
            >
              <svg className="w-[18px] h-[18px] stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes menuSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes itemFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
