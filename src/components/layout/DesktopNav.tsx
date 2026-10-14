import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { NAV, NavItem } from "../../data/nav.ts";
import { Button } from "../ui/Button.tsx";
import { SITE } from "../../data/site.ts";
import { TransitionLink } from "../ui/TransitionLink.tsx";

export const DesktopNav: React.FC = () => {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="hidden lg:flex items-center space-x-8 text-[14px] font-medium text-white relative">
      {NAV.map((item: NavItem) => {
        const isMega = item.label === "Main Divisions";
        const hasChildren = !!item.children || isMega;
        const isActive =
          location.pathname === item.url ||
          (item.url !== "/" && location.pathname.startsWith(item.url));

        return (
          <div
            key={item.label}
            className="relative group py-6"
            onMouseEnter={() => setActiveDropdown(item.label)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            {item.external ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-60 flex items-center"
              >
                {item.label}
              </a>
            ) : (
              <TransitionLink
                to={item.url}
                className={`relative py-1 transition-opacity hover:opacity-60 flex items-center ${
                  isActive ? "text-white" : "text-white/90"
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[1px] bg-white" />
                )}
              </TransitionLink>
            )}

            {/* Standard Dropdown: About Us, Services */}
            {hasChildren && !isMega && activeDropdown === item.label && item.children && (
              <div className="absolute top-[80px] left-0 w-[280px] bg-white text-[var(--ink)] shadow-none border border-[var(--line)] py-2 z-50 animate-[fadeDrop_0.35s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                {item.children.map((child) => (
                  <TransitionLink
                    key={child.url}
                    to={child.url}
                    className="block px-5 py-3 text-[13px] hover:bg-[var(--blue)] hover:text-white transition-colors border-b border-[var(--line)] last:border-b-0"
                  >
                    {child.label}
                  </TransitionLink>
                ))}
              </div>
            )}

            {/* Mega Panel: Main Divisions (5 columns across container) */}
            {isMega && activeDropdown === item.label && item.divisions && (
              <div className="fixed top-[88px] left-0 w-screen bg-white text-[var(--ink)] border-b border-[var(--line)] shadow-none z-50 animate-[fadeDrop_0.35s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] py-8 grid grid-cols-5 gap-6">
                  {item.divisions.map((div) => (
                    <div key={div.label} className="flex flex-col space-y-3">
                      <TransitionLink to={div.url} className="group/div block overflow-hidden">
                        <div className="w-full aspect-[4/3] bg-white overflow-hidden mb-3">
                          <img
                            src={div.image}
                            alt={div.label}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/div:scale-105"
                          />
                        </div>
                        <h4 className="text-[14px] lg:text-[17px] font-semibold text-[var(--ink)] group-hover/div:text-[var(--blue)] transition-colors">
                          {div.label}
                        </h4>
                      </TransitionLink>

                      <div className="flex flex-col space-y-1.5 pt-2 border-t border-[var(--line)]">
                        {div.children.map((child) => (
                          <TransitionLink
                            key={child.url}
                            to={child.url}
                            className="text-[12px] lg:text-[13px] text-[var(--grey)] hover:text-[var(--blue)] transition-colors py-0.5"
                          >
                            {child.label}
                          </TransitionLink>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Far Right Action Button — White background, Royal Blue text in both header states */}
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
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
};
