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
  const [openDivision, setOpenDivision] = useState<string | null>(null);
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
      setOpenDivision(null);
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

  const isLinkActive = (url: string, label?: string) => {
    if (label === "About Us") {
      return (
        location.pathname === "/about" ||
        location.pathname === "/about/" ||
        location.pathname.startsWith("/about/") ||
        location.pathname.startsWith("/about-us")
      );
    }
    const cleanPath = location.pathname.replace(/\/$/, "");
    const cleanUrl = url.replace(/\/$/, "");
    return (
      location.pathname === url ||
      (cleanUrl !== "" && cleanPath === cleanUrl) ||
      (url !== "/" && location.pathname.startsWith(url))
    );
  };

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
      {/* Main Content Area */}
      <div className="pt-16 pb-3 px-5 max-w-[440px] w-full mx-auto h-full flex flex-col justify-between overflow-hidden">
        {/* Scrollable Links Container */}
        <div
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden my-2 pr-1"
          style={{ scrollbarWidth: "none" }}
        >
          <div
            style={{ borderColor: "rgba(255, 255, 255, 0.15)" }}
            className="border-t border-b divide-y divide-white/15"
          >
            {NAV.map((item) => {
              const isMega = item.label === "Main Divisions";
              const isAbout = item.label === "About Us";
              const hasChildren = !!item.children || isMega;
              const isSectionOpen = openSection === item.label;
              const active = isLinkActive(item.url, item.label);

              return (
                <div
                  key={item.label}
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <div className="min-h-[38px] py-1.5 flex items-center justify-between">
                    {hasChildren ? (
                      <button
                        type="button"
                        onClick={() => {
                          setOpenSection(isSectionOpen ? null : item.label);
                        }}
                        style={{ fontWeight: 400 }}
                        className="w-full h-full flex items-center justify-between text-left text-[14px] text-white hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        <span
                          className={
                            active
                              ? "underline decoration-white decoration-[2px] underline-offset-4 font-medium"
                              : "font-normal"
                          }
                        >
                          {item.label}
                        </span>
                        {/* Chevron icon for About Us, plus icon for other group rows */}
                        {isAbout ? (
                          <svg
                            className="w-3.5 h-3.5 stroke-white flex-shrink-0"
                            style={{
                              transition:
                                "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)",
                              transform: isSectionOpen
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            }}
                            viewBox="0 0 24 24"
                            fill="none"
                            strokeWidth="1.5"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        ) : (
                          <svg
                            className="w-3.5 h-3.5 stroke-white flex-shrink-0"
                            style={{
                              transition:
                                "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)",
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
                        )}
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

                  {/* Sub-links for Services / About Us (16px indent) */}
                  {hasChildren && !isMega && isSectionOpen && item.children && (
                    <div className="pl-4 pb-2 pt-1 space-y-1 border-l border-white/20 ml-1.5 my-1">
                      {item.children.map((child) => {
                        const isChildActive =
                          child.url === "/services/" || child.url === "/about" || child.url === "/about/"
                            ? location.pathname === child.url || location.pathname === child.url.replace(/\/$/, "")
                            : location.pathname === child.url ||
                              (child.url !== "/" && location.pathname.startsWith(child.url));

                        return (
                          <TransitionLink
                            key={child.url}
                            to={child.url}
                            onClick={onClose}
                            style={{ fontWeight: 300 }}
                            className={`block py-1 text-[12px] font-light text-white/90 hover:opacity-100 transition-opacity ${
                              isChildActive
                                ? "underline decoration-white decoration-[2px] underline-offset-4 font-medium text-white"
                                : ""
                            }`}
                          >
                            {child.label}
                          </TransitionLink>
                        );
                      })}
                    </div>
                  )}

                  {/* Main Divisions: Expandable accordion showing each division and ALL its proper sub-pages */}
                  {isMega && isSectionOpen && item.divisions && (
                    <div className="pl-2 pb-2 pt-1 divide-y divide-white/10">
                      {item.divisions.map((div) => {
                        const divActive = location.pathname.startsWith(div.url);
                        const isDivOpen = openDivision === div.label;

                        return (
                          <div
                            key={div.label}
                            style={{ borderColor: "rgba(255, 255, 255, 0.10)" }}
                            className="py-1"
                          >
                            {/* Division Title & Toggle Button */}
                            <div className="flex items-center justify-between min-h-[32px]">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenDivision(isDivOpen ? null : div.label)
                                }
                                className="flex-1 flex items-center justify-between text-left text-[13px] text-white hover:opacity-80 transition-opacity cursor-pointer pr-2"
                              >
                                <span
                                  className={
                                    divActive
                                      ? "underline decoration-white decoration-[2px] underline-offset-4 font-medium"
                                      : "font-normal"
                                  }
                                >
                                  {div.label}
                                </span>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setOpenDivision(isDivOpen ? null : div.label)
                                }
                                aria-label={`Toggle ${div.label} sub-pages`}
                                className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white cursor-pointer flex-shrink-0"
                              >
                                <svg
                                  className="w-3 h-3 stroke-white"
                                  style={{
                                    transition:
                                      "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)",
                                    transform: isDivOpen
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
                            </div>

                            {/* Proper Sub-pages list */}
                            {isDivOpen && div.children && (
                              <div className="pl-3 pt-1 pb-2 space-y-1 border-l border-white/20 ml-1.5 mt-1">
                                {/* Division Overview Link */}
                                <TransitionLink
                                  to={div.url}
                                  onClick={onClose}
                                  className="block py-1 text-[12px] font-medium text-white/95 hover:text-white transition-opacity"
                                >
                                  &bull; {div.label} Overview &rarr;
                                </TransitionLink>

                                {/* Individual Sub-pages */}
                                {div.children.map((child) => {
                                  const isChildActive =
                                    location.pathname === child.url;

                                  return (
                                    <TransitionLink
                                      key={child.url}
                                      to={child.url}
                                      onClick={onClose}
                                      className={`block py-1 text-[12px] text-white/80 hover:text-white transition-opacity ${
                                        isChildActive
                                          ? "underline decoration-white decoration-[2px] underline-offset-4 text-white font-medium"
                                          : "font-light"
                                      }`}
                                    >
                                      {child.label}
                                    </TransitionLink>
                                  );
                                })}
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
        </div>

        {/* Compact Footer lockup inside Mobile Drawer */}
        <div className="pt-2 space-y-2 flex-shrink-0">
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
