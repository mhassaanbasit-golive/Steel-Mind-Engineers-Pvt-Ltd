import React, { useState, useEffect, useRef } from "react";
import { TransitionLink } from "./TransitionLink.tsx";
import { stopScroll, startScroll } from "../../lib/lenis.ts";

export interface QuickAnswerProps {
  text?: string;
  h1?: string;
  related?: (string | { title: string; url: string })[];
  className?: string;
}

export const QuickAnswer: React.FC<QuickAnswerProps> = ({
  text,
  h1,
  related = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);
  const [topicName, setTopicName] = useState("About this page");
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Derive topic name from prop or document h1
  useEffect(() => {
    if (h1) {
      const derived = h1.includes(":") ? h1.split(":")[0].trim() : h1.trim();
      setTopicName(derived || "About this page");
    } else {
      const docH1 = document.querySelector("h1")?.textContent;
      if (docH1) {
        const derived = docH1.includes(":") ? docH1.split(":")[0].trim() : docH1.trim();
        setTopicName(derived || "About this page");
      }
    }
  }, [h1]);

  // Show floating button 1s after loader ends
  useEffect(() => {
    const handleLoaderDone = () => {
      setTimeout(() => setBtnVisible(true), 1000);
    };

    window.addEventListener("loader:done", handleLoaderDone);
    const fallbackTimer = setTimeout(() => setBtnVisible(true), 2200);

    return () => {
      window.removeEventListener("loader:done", handleLoaderDone);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Lock scroll & handle keyboard
  useEffect(() => {
    if (isOpen) {
      stopScroll();
      drawerRef.current?.focus();
    } else {
      startScroll();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      startScroll();
    };
  }, [isOpen]);

  if (!text) return null;

  return (
    <>
      {/* Floating Trigger Button: bottom-left, appears 1s after loader */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Quick answer"
        title="Quick answer"
        style={{ backgroundColor: "var(--blue)" }}
        className={`fixed left-4 bottom-[calc(88px+env(safe-area-inset-bottom))] z-[90] w-11 h-11 bg-[var(--blue)] text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-[var(--blue-dark)] transition-all duration-300 rounded-none group border border-white/40 ${
          btnVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        {/* Info 'i' icon with 1.5px stroke */}
        <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="2" strokeLinecap="round" />
          <polyline points="11 12 12 12 12 16 13 16" />
        </svg>

        {/* Hover label */}
        <span className="hidden group-hover:block absolute left-[52px] bg-[var(--blue)] text-white text-[9px] uppercase tracking-[0.08em] px-2.5 py-1 whitespace-nowrap pointer-events-none">
          Quick answer
        </span>
      </button>

      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-[var(--blue)]/40 z-[140] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer: Stays mounted in DOM for SEO crawlers & accessibility */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Quick Answer: ${topicName}`}
        aria-hidden={!isOpen}
        tabIndex={-1}
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          visibility: isOpen ? "visible" : "hidden",
        }}
        className={`fixed top-0 bottom-0 left-0 z-[150] w-[min(85vw,340px)] h-full bg-white border-r border-[var(--line)] p-6 flex flex-col justify-between overflow-y-auto transition-[transform,visibility] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "pointer-events-auto shadow-2xl" : "pointer-events-none"
        }`}
        data-lenis-prevent=""
      >
        <div>
          {/* Top Bar: Label on left, Close cross top-right */}
          <div className="flex items-start justify-between pb-4 border-b border-[var(--line)]">
            <span className="block text-[9px] uppercase font-semibold text-[var(--blue)] tracking-[0.08em]">
              {topicName}
            </span>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close Quick Answer drawer"
              className="w-[22px] h-[22px] flex items-center justify-center text-[var(--grey)] hover:text-[var(--ink)] cursor-pointer"
            >
              <svg className="w-[22px] h-[22px] stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Quick Answer Body: 12px mobile / 13px desktop */}
          <div className="py-6">
            <p className="quick-answer text-[12px] lg:text-[13px] font-medium leading-[1.65] text-[var(--ink)]">
              {text}
            </p>
          </div>

          {/* Related pages mini list if present */}
          {related && related.length > 0 && (
            <div className="pt-4 border-t border-[var(--line)]">
              <span className="block text-[9px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em] mb-3">
                Related Pages
              </span>
              <ul className="space-y-2 text-[12px] lg:text-[13px]">
                {related.map((item, idx) => {
                  if (typeof item === "string") {
                    return (
                      <li key={idx}>
                        <span className="text-[var(--blue)] font-medium">• {item}</span>
                      </li>
                    );
                  }
                  return (
                    <li key={idx}>
                      <TransitionLink
                        to={item.url}
                        onClick={() => setIsOpen(false)}
                        className="text-[var(--blue)] hover:underline font-medium"
                      >
                        {item.title}
                      </TransitionLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Footer info in drawer */}
        <div className="pt-6 border-t border-[var(--line)] text-[12px] text-[var(--grey)]">
          Steel Mind Engineers Pvt. Ltd.
        </div>
      </div>
    </>
  );
};
