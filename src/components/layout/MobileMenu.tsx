import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV } from "../../data/nav.ts";
import { SITE } from "../../data/site.ts";
import { A } from "../../data/assets.ts";
import { stopScroll, startScroll } from "../../lib/lenis.ts";
import { FacebookIcon, FacebookIconHandle } from "../icons/facebook.tsx";
import { InstagramIcon, InstagramIconHandle } from "../icons/instagram.tsx";
import { TiktokIcon, TiktokIconHandle } from "../icons/tiktok.tsx";
import { LinkedinIcon, LinkedinIconHandle } from "../icons/linkedin.tsx";

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openSubDivision, setOpenSubDivision] = useState<string | null>(null);
  const initialPathRef = useRef(location.pathname);

  const facebookRef = useRef<FacebookIconHandle>(null);
  const instagramRef = useRef<InstagramIconHandle>(null);
  const tiktokRef = useRef<TiktokIconHandle>(null);
  const linkedinRef = useRef<LinkedinIconHandle>(null);

  // Close menu only when route actually changes after mounting
  useEffect(() => {
    if (initialPathRef.current !== location.pathname) {
      initialPathRef.current = location.pathname;
      onClose();
    }
  }, [location.pathname, onClose]);

  // Reset collapsed state and trigger social icon animations on open
  useEffect(() => {
    if (isOpen) {
      setOpenSection(null);
      setOpenSubDivision(null);
      stopScroll();
      const mainEl = document.getElementById("main");
      if (mainEl) mainEl.setAttribute("aria-hidden", "true");

      const animTimer = setTimeout(() => {
        facebookRef.current?.startAnimation();
        instagramRef.current?.startAnimation();
        tiktokRef.current?.startAnimation();
        linkedinRef.current?.startAnimation();
      }, 150);

      return () => clearTimeout(animTimer);
    } else {
      startScroll();
      const mainEl = document.getElementById("main");
      if (mainEl) mainEl.removeAttribute("aria-hidden");
    }
  }, [isOpen]);

  useEffect(() => {
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

  const isLinkActive = (url: string) =>
    location.pathname === url || (url !== "/" && location.pathname.startsWith(url));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      style={{
        backgroundColor: "var(--blue)",
      }}
      className="fixed inset-0 z-[200] h-[100dvh] max-h-[100dvh] overflow-hidden text-white flex flex-col justify-between select-none animate-[menuSlideIn_0.35s_cubic-bezier(0.16,1,0.3,1)_forwards]"
      data-lenis-prevent=""
    >
      {/* Main Content Area: Fits strictly in 100dvh without scroll */}
      <div className="pt-16 pb-4 px-5 max-w-[480px] w-full mx-auto h-full flex flex-col justify-between overflow-hidden">
        {/* Links List */}
        <div
          style={{ borderColor: "rgba(255, 255, 255, 0.15)" }}
          className="border-t border-b divide-y divide-white/15"
        >
          {NAV.map((item, idx) => {
            const isMega = item.label === "Main Divisions";
            const hasChildren = !!item.children || isMega;
            const isSectionOpen = openSection === item.label;
            const active = isLinkActive(item.url);

            return (
              <div
                key={item.label}
                style={{
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  animation: `itemFadeIn 0.4s cubic-bezier(0.16,1,0.3,1) ${idx * 0.03}s both`,
                }}
              >
                <div className="h-[42px] flex items-center justify-between">
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenSection(isSectionOpen ? null : item.label);
                        setOpenSubDivision(null);
                      }}
                      style={{ fontWeight: 300 }}
                      className="w-full h-full flex items-center justify-between text-left text-[15px] font-light text-white hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <span
                        style={{ fontWeight: 300 }}
                        className={
                          active
                            ? "underline decoration-white decoration-[2px] underline-offset-4 font-light"
                            : "font-light"
                        }
                      >
                        {item.label}
                      </span>
                      {/* Plus icon on group rows: thin 1.5px stroke, white. Rotates 45° on open, 0.3s ease */}
                      <svg
                        className="w-4 h-4 stroke-white flex-shrink-0"
                        style={{
                          transition: "transform 0.3s ease",
                          transform: isSectionOpen ? "rotate(45deg)" : "rotate(0deg)",
                        }}
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth="1.5"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                  ) : item.external ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontWeight: 300 }}
                      className="text-[15px] font-light text-white hover:opacity-80 transition-opacity block w-full leading-[42px]"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.url}
                      onClick={onClose}
                      style={{ fontWeight: 300 }}
                      className={`text-[15px] font-light text-white hover:opacity-80 transition-opacity block w-full leading-[42px] ${
                        active ? "underline decoration-white decoration-[2px] underline-offset-4" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>

                {/* Sub-links: About Us & Services (13px, font-weight 300) */}
                {hasChildren && !isMega && isSectionOpen && item.children && (
                  <div className="pl-3 pb-1.5 space-y-0.5">
                    {item.label === "Services" && (
                      <Link
                        to="/services/"
                        onClick={onClose}
                        style={{ fontWeight: 300 }}
                        className={`block h-[22px] leading-[22px] text-[13px] font-light text-white hover:opacity-80 transition-opacity ${
                          location.pathname === "/services/"
                            ? "underline decoration-white decoration-[2px] underline-offset-4"
                            : ""
                        }`}
                      >
                        Overview
                      </Link>
                    )}
                    {item.children.map((child) => (
                      <Link
                        key={child.url}
                        to={child.url}
                        onClick={onClose}
                        style={{ fontWeight: 300 }}
                        className={`block h-[22px] leading-[22px] text-[13px] font-light text-white hover:opacity-80 transition-opacity ${
                          location.pathname === child.url
                            ? "underline decoration-white decoration-[2px] underline-offset-4"
                            : ""
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Sub-links & Sub-sub-links: Main Divisions */}
                {isMega && isSectionOpen && item.divisions && (
                  <div className="pl-3 pb-1.5 divide-y divide-white/15">
                    {item.divisions.map((div) => {
                      const isDivOpen = openSubDivision === div.label;
                      const divActive = location.pathname.startsWith(div.url);
                      return (
                        <div key={div.label} style={{ borderColor: "rgba(255, 255, 255, 0.15)" }}>
                          <button
                            type="button"
                            onClick={() =>
                              setOpenSubDivision(isDivOpen ? null : div.label)
                            }
                            style={{ fontWeight: 300 }}
                            className="w-full flex items-center justify-between text-left h-[26px] text-[13px] font-light text-white hover:opacity-80 transition-opacity cursor-pointer"
                          >
                            <span
                              style={{ fontWeight: 300 }}
                              className={
                                divActive
                                  ? "underline decoration-white decoration-[2px] underline-offset-4 font-light"
                                  : "font-light"
                              }
                            >
                              {div.label}
                            </span>
                            <svg
                              className="w-3.5 h-3.5 stroke-white flex-shrink-0"
                              style={{
                                transition: "transform 0.3s ease",
                                transform: isDivOpen ? "rotate(45deg)" : "rotate(0deg)",
                              }}
                              viewBox="0 0 24 24"
                              fill="none"
                              strokeWidth="1.5"
                            >
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </button>

                          {isDivOpen && (
                            <div className="pl-3 pb-1 grid grid-cols-2 gap-x-2 gap-y-0.5">
                              <Link
                                to={div.url}
                                onClick={onClose}
                                style={{ fontWeight: 300 }}
                                className={`block h-[20px] leading-[20px] text-[12px] font-light text-white hover:opacity-80 truncate ${
                                  location.pathname === div.url
                                    ? "underline decoration-white decoration-[2px] underline-offset-4"
                                    : ""
                                }`}
                              >
                                Overview
                              </Link>
                              {div.children.map((child) => (
                                <Link
                                  key={child.url}
                                  to={child.url}
                                  onClick={onClose}
                                  style={{ fontWeight: 300 }}
                                  className={`block h-[20px] leading-[20px] text-[12px] font-light text-white hover:opacity-80 truncate ${
                                    location.pathname === child.url
                                      ? "underline decoration-white decoration-[2px] underline-offset-4"
                                      : ""
                                  }`}
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

        {/* Bottom Brand, Contact & Social Block */}
        <div
          style={{
            borderColor: "rgba(255, 255, 255, 0.15)",
            animation: "logoFadeIn 0.5s cubic-bezier(0.16,1,0.3,1) 0.25s both",
          }}
          className="pt-3 border-t flex flex-col space-y-2 pb-[env(safe-area-inset-bottom)]"
        >
          {/* Transparent Logo in White (filter: brightness(0) invert(1)) + Lockup */}
          <div className="flex items-center space-x-3">
            <Link to="/" onClick={onClose} className="inline-block flex-shrink-0">
              <img
                src={A.logoTransparent}
                alt="Steel Mind Engineers"
                style={{ filter: "brightness(0) invert(1)" }}
                className="w-[72px] h-auto object-contain"
              />
            </Link>

            <div className="flex flex-col text-left">
              <span className="font-normal text-[13px] text-white leading-tight">
                {SITE.header.title}
              </span>
              <span className="text-[9px] uppercase font-normal text-white tracking-[0.18em] mt-0.5">
                {SITE.header.sub}
              </span>
            </div>
          </div>

          {/* Contact Block: White text */}
          <div className="text-[11px] font-normal text-white leading-[1.45] space-y-0.5">
            <div>
              <a href={`tel:${SITE.tel[0]}`} className="text-white hover:underline font-normal">
                {SITE.phones[0]}
              </a>
              {" · "}
              <a href={`tel:${SITE.tel[1]}`} className="text-white hover:underline font-normal">
                {SITE.phones[1]}
              </a>
            </div>
            <div>
              <a href={`mailto:${SITE.email}`} className="text-white hover:underline font-normal">
                {SITE.email}
              </a>
            </div>
            <div>
              <a
                href={SITE.mapHeadOffice}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline font-normal"
              >
                {SITE.headOffice}
              </a>
            </div>
          </div>

          {/* Four Animated Social Icons: 20px, white, no background */}
          <div className="flex items-center space-x-4 pt-1 text-white">
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              onMouseEnter={() => facebookRef.current?.startAnimation()}
              className="text-white bg-transparent hover:opacity-80 transition-opacity inline-flex items-center justify-center"
            >
              <FacebookIcon ref={facebookRef} size={20} className="text-white" />
            </a>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              onMouseEnter={() => instagramRef.current?.startAnimation()}
              className="text-white bg-transparent hover:opacity-80 transition-opacity inline-flex items-center justify-center"
            >
              <InstagramIcon ref={instagramRef} size={20} className="text-white" />
            </a>
            <a
              href={SITE.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              onMouseEnter={() => tiktokRef.current?.startAnimation()}
              className="text-white bg-transparent hover:opacity-80 transition-opacity inline-flex items-center justify-center"
            >
              <TiktokIcon ref={tiktokRef} size={20} className="text-white" />
            </a>
            <a
              href={SITE.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              onMouseEnter={() => linkedinRef.current?.startAnimation()}
              className="text-white bg-transparent hover:opacity-80 transition-opacity inline-flex items-center justify-center"
            >
              <LinkedinIcon ref={linkedinRef} size={20} className="text-white" />
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
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
