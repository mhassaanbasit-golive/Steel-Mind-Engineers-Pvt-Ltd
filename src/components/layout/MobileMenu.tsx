import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { NAV } from "../../data/nav.ts";
import { SITE } from "../../data/site.ts";
import { A } from "../../data/assets.ts";
import { stopScroll, startScroll } from "../../lib/lenis.ts";
import { FacebookIcon, FacebookIconHandle } from "../icons/facebook.tsx";
import { InstagramIcon, InstagramIconHandle } from "../icons/instagram.tsx";
import { TiktokIcon, TiktokIconHandle } from "../icons/tiktok.tsx";
import { LinkedinIcon, LinkedinIconHandle } from "../icons/linkedin.tsx";
import { TransitionLink } from "../ui/TransitionLink.tsx";

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [openSection, setOpenSection] = useState<string | null>(null);
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

  // Lock body scroll while open, unlock on close
  useEffect(() => {
    if (isOpen) {
      setOpenSection(null);
      stopScroll();
      document.body.style.overflow = "hidden";
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
      document.body.style.overflow = "";
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
    };
  }, [isOpen, onClose]);

  const isLinkActive = (url: string) =>
    location.pathname === url ||
    (url !== "/" && location.pathname.startsWith(url));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label="Navigation Menu"
      style={{
        backgroundColor: "var(--blue, #1E3A8A)",
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateY(0)" : "translateY(-8px)",
        pointerEvents: isOpen ? "auto" : "none",
        transition:
          "opacity 500ms cubic-bezier(0.22, 1, 0.36, 1), transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className="fixed inset-0 z-[200] h-[100dvh] max-h-[100dvh] overflow-hidden text-white flex flex-col justify-between select-none"
      data-lenis-prevent=""
    >
      {/* Main Content Area: Compact padding and sizing so it fits cleanly in 100dvh with NO scrollbar */}
      <div className="pt-16 pb-3 px-5 max-w-[440px] w-full mx-auto h-full flex flex-col justify-between overflow-hidden">
        {/* Links List */}
        <div
          style={{ borderColor: "rgba(255, 255, 255, 0.15)" }}
          className="border-t border-b divide-y divide-white/15"
        >
          {NAV.map((item) => {
            const isMega = item.label === "Main Divisions";
            const hasChildren = !!item.children || isMega;
            const isSectionOpen = openSection === item.label;
            const active = isLinkActive(item.url);

            return (
              <div
                key={item.label}
                style={{
                  borderColor: "rgba(255, 255, 255, 0.15)",
                }}
              >
                <div className="h-[38px] flex items-center justify-between">
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenSection(isSectionOpen ? null : item.label);
                      }}
                      style={{ fontWeight: 300 }}
                      className="w-full h-full flex items-center justify-between text-left text-[14px] font-light text-white hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <span
                        className={
                          active
                            ? "underline decoration-white decoration-[2px] underline-offset-4 font-light"
                            : "font-light"
                        }
                      >
                        {item.label}
                      </span>
                      {/* Plus icon on group rows: rotates 45° on open */}
                      <svg
                        className="w-3.5 h-3.5 stroke-white flex-shrink-0"
                        style={{
                          transition:
                            "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)",
                          transform: isSectionOpen
                            ? "rotate(45deg)"
                            : "rotate(0deg)",
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
                      className="text-[14px] font-light text-white hover:opacity-80 transition-opacity block w-full leading-[38px]"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <TransitionLink
                      to={item.url}
                      onClick={onClose}
                      style={{ fontWeight: 300 }}
                      className={`text-[14px] font-light text-white hover:opacity-80 transition-opacity block w-full leading-[38px] ${
                        active
                          ? "underline decoration-white decoration-[2px] underline-offset-4"
                          : ""
                      }`}
                    >
                      {item.label}
                    </TransitionLink>
                  )}
                </div>

                {/* Sub-links for Services / About Us */}
                {hasChildren && !isMega && isSectionOpen && item.children && (
                  <div className="pl-3 pb-1 space-y-0.5">
                    {item.children.map((child) => (
                      <TransitionLink
                        key={child.url}
                        to={child.url}
                        onClick={onClose}
                        style={{ fontWeight: 300 }}
                        className={`block h-[22px] leading-[22px] text-[12px] font-light text-white hover:opacity-80 transition-opacity ${
                          location.pathname === child.url
                            ? "underline decoration-white decoration-[2px] underline-offset-4"
                            : ""
                        }`}
                      >
                        {child.label}
                      </TransitionLink>
                    ))}
                  </div>
                )}

                {/* Main Divisions: Tapping a division opens its overview page (with transition) and closes the menu */}
                {isMega && isSectionOpen && item.divisions && (
                  <div className="pl-3 pb-1 divide-y divide-white/10">
                    {item.divisions.map((div) => {
                      const divActive = location.pathname.startsWith(div.url);

                      return (
                        <div
                          key={div.label}
                          style={{ borderColor: "rgba(255, 255, 255, 0.10)" }}
                          className="h-[26px] flex items-center"
                        >
                          <TransitionLink
                            to={div.url}
                            onClick={onClose}
                            style={{ fontWeight: 300 }}
                            className={`w-full flex items-center justify-between text-left text-[12px] font-light text-white hover:opacity-80 transition-opacity ${
                              divActive
                                ? "underline decoration-white decoration-[2px] underline-offset-4 font-light"
                                : "font-light"
                            }`}
                          >
                            <span className="truncate pr-2">{div.label}</span>
                            <span className="text-[11px] opacity-60 flex-shrink-0">&rarr;</span>
                          </TransitionLink>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Compact Footer lockup inside Mobile Drawer */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center space-x-2.5">
            <TransitionLink to="/" onClick={onClose} className="block">
              <img
                src={A.logoTransparent}
                alt="Steel Mind Engineers"
                style={{ filter: "brightness(0) invert(1)" }}
                className="w-[58px] h-auto object-contain"
              />
            </TransitionLink>

            <div className="flex flex-col text-left">
              <span className="font-normal text-[12px] text-white leading-tight">
                {SITE.header.title}
              </span>
              <span className="text-[8px] uppercase font-normal text-white/70 tracking-[0.16em] mt-0.5">
                {SITE.header.sub}
              </span>
            </div>
          </div>

          {/* Contact Block: Compact white text */}
          <div className="text-[10px] font-normal text-white/90 leading-[1.35] space-y-0.5 text-left">
            <div>
              <a
                href={`tel:${SITE.tel[0]}`}
                className="text-white hover:underline font-normal"
              >
                {SITE.phones[0]}
              </a>
              {" · "}
              <a
                href={`tel:${SITE.tel[1]}`}
                className="text-white hover:underline font-normal"
              >
                {SITE.phones[1]}
              </a>
            </div>
            <div>
              <a
                href={`mailto:${SITE.email}`}
                className="text-white hover:underline font-normal"
              >
                {SITE.email}
              </a>
            </div>
            <div className="truncate">
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

          {/* Four Animated Social Icons: Compact 18px */}
          <div className="flex items-center space-x-3.5 pt-0.5 text-white">
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              onMouseEnter={() => facebookRef.current?.startAnimation()}
              className="text-white bg-transparent hover:opacity-80 transition-opacity inline-flex items-center justify-center"
            >
              <FacebookIcon
                ref={facebookRef}
                size={18}
                className="text-white"
              />
            </a>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              onMouseEnter={() => instagramRef.current?.startAnimation()}
              className="text-white bg-transparent hover:opacity-80 transition-opacity inline-flex items-center justify-center"
            >
              <InstagramIcon
                ref={instagramRef}
                size={18}
                className="text-white"
              />
            </a>
            <a
              href={SITE.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              onMouseEnter={() => tiktokRef.current?.startAnimation()}
              className="text-white bg-transparent hover:opacity-80 transition-opacity inline-flex items-center justify-center"
            >
              <TiktokIcon ref={tiktokRef} size={18} className="text-white" />
            </a>
            <a
              href={SITE.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              onMouseEnter={() => linkedinRef.current?.startAnimation()}
              className="text-white bg-transparent hover:opacity-80 transition-opacity inline-flex items-center justify-center"
            >
              <LinkedinIcon
                ref={linkedinRef}
                size={18}
                className="text-white"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
