import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { NAV, NavItem } from "../../data/nav.ts";
import { Button } from "../ui/Button.tsx";
import { SITE } from "../../data/site.ts";
import { TransitionLink } from "../ui/TransitionLink.tsx";

export const DesktopNav: React.FC = () => {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close dropdown on outside click and Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className="hidden lg:flex items-center space-x-8 text-[14px] font-medium text-white relative h-full overflow-visible"
    >
      {NAV.map((item: NavItem) => {
        const isMega = item.label === "Main Divisions";
        const isAbout = item.label === "About Us";
        const hasChildren = !!item.children || isMega;

        const isActive = isAbout
          ? location.pathname === "/about" ||
            location.pathname === "/about/" ||
            location.pathname.startsWith("/about/") ||
            location.pathname.startsWith("/about-us")
          : location.pathname === item.url ||
            (item.url !== "/" && location.pathname.startsWith(item.url));

        return (
          <div
            key={item.label}
            className="relative group h-full flex items-center"
            onMouseEnter={() => setActiveDropdown(item.label)}
            onMouseLeave={() => setActiveDropdown(null)}
            onFocus={() => setActiveDropdown(item.label)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setActiveDropdown(null);
              }
            }}
          >
            {item.external ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/navlink relative py-2 px-1 flex items-center transition-all duration-300 text-white/85 hover:text-white"
              >
                <span className="relative z-10 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/navlink:-translate-y-[1px]">
                  {item.label}
                </span>
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] scale-x-0 opacity-0 group-hover/navlink:scale-x-100 group-hover/navlink:opacity-100 origin-center" />
              </a>
            ) : (
              <TransitionLink
                to={item.url}
                className={`group/navlink relative py-2 px-1 flex items-center transition-all duration-300 ${
                  isActive ? "text-white font-semibold" : "text-white/85 hover:text-white"
                }`}
              >
                <span className="relative z-10 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/navlink:-translate-y-[1px]">
                  {item.label}
                </span>
                <span
                  className={`absolute bottom-0 left-0 right-0 h-[2px] bg-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive
                      ? "scale-x-100 opacity-100"
                      : "scale-x-0 opacity-0 group-hover/navlink:scale-x-100 group-hover/navlink:opacity-100 origin-center"
                  }`}
                />
              </TransitionLink>
            )}

            {/* Standard Dropdown: About Us, Services */}
            {hasChildren && !isMega && activeDropdown === item.label && item.children && (
              <div
                className={`absolute top-full left-0 ${
                  isAbout ? "min-w-[200px]" : "w-[280px]"
                } bg-white text-[var(--ink)] border border-[var(--line,#E5E5E5)] p-2 z-50 animate-[fadeDrop8_250ms_cubic-bezier(0.16,1,0.3,1)_forwards] shadow-lg`}
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
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
                      onClick={() => setActiveDropdown(null)}
                      className={`group/drop flex items-center justify-between px-4 py-2.5 text-[13px] transition-all duration-200 ease-out border-b border-[var(--line,#E5E5E5)] last:border-b-0 ${
                        isChildActive
                          ? "bg-[var(--blue,#1E3A8A)] text-white font-semibold pl-5"
                          : "text-[var(--ink,#0A0A0A)] hover:bg-[var(--blue,#1E3A8A)] hover:text-white hover:pl-5"
                      }`}
                    >
                      <span>{child.label}</span>
                      <span className="opacity-0 group-hover/drop:opacity-100 transition-opacity duration-200 text-[11px]">
                        &rarr;
                      </span>
                    </TransitionLink>
                  );
                })}
              </div>
            )}

            {/* Mega Panel: Main Divisions (5 columns across container with proper sub-pages) */}
            {isMega && activeDropdown === item.label && item.divisions && (
              <div
                className="fixed top-[var(--nav-h,88px)] left-0 w-screen bg-white text-[var(--ink)] border-b border-[var(--line)] shadow-xl z-50 animate-[fadeDrop_0.25s_cubic-bezier(0.16,1,0.3,1)_forwards] max-h-[calc(100vh-var(--nav-h,88px))] overflow-y-auto"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] py-8 grid grid-cols-5 gap-6">
                  {item.divisions.map((div) => {
                    const isDivActive = location.pathname.startsWith(div.url);

                    return (
                      <div key={div.label} className="flex flex-col text-left">
                        {/* Division Header & Thumbnail */}
                        <TransitionLink
                          to={div.url}
                          onClick={() => setActiveDropdown(null)}
                          className="group/div block overflow-hidden mb-2"
                        >
                          <div className="w-full aspect-[16/10] bg-[#0F172A] overflow-hidden mb-2.5 rounded-sm">
                            <img
                              src={div.image}
                              alt={div.label}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/div:scale-105"
                            />
                          </div>
                          <h4
                            className={`text-[14px] lg:text-[15px] font-bold leading-snug transition-colors ${
                              isDivActive
                                ? "text-[var(--blue)]"
                                : "text-[var(--ink)] group-hover/div:text-[var(--blue)]"
                            }`}
                          >
                            {div.label}
                          </h4>
                          <span className="text-[11px] text-[var(--blue)] font-medium inline-flex items-center gap-1 mt-0.5 group-hover/div:underline">
                            View Overview &rarr;
                          </span>
                        </TransitionLink>

                        {/* Proper Sub-pages list */}
                        <div className="flex flex-col space-y-1 pt-2 border-t border-[var(--line)]">
                          {div.children.map((child) => {
                            const isChildActive = location.pathname === child.url;

                            return (
                              <TransitionLink
                                key={child.url}
                                to={child.url}
                                onClick={() => setActiveDropdown(null)}
                                className={`text-[12px] lg:text-[13px] py-1 transition-colors leading-tight ${
                                  isChildActive
                                    ? "text-[var(--blue)] font-semibold"
                                    : "text-[#4B5563] hover:text-[var(--blue)]"
                                }`}
                              >
                                {child.label}
                              </TransitionLink>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Far Right Action Button — White background, Royal Blue text */}
      <div className="pl-4">
        <Button
          variant="hero-white"
          size="sm"
          href="/contact-us/#quote"
          className="!bg-white !text-[var(--blue)] hover:!bg-white/90 hover:!text-[var(--blue)] border border-white"
        >
          {SITE.cta.primary}
        </Button>
      </div>

      <style>{`
        @keyframes fadeDrop {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDrop8 {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
};
