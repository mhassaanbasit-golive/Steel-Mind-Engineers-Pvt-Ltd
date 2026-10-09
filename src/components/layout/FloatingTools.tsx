import React, { useState, useEffect, useRef } from "react";
import { SITE } from "../../data/site.ts";

export const FloatingTools: React.FC = () => {
  const [dialOpen, setDialOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show 1s after loader finishes (or on load if loader already played)
    const handleLoaderDone = () => {
      setTimeout(() => setVisible(true), 1000);
    };

    window.addEventListener("loader:done", handleLoaderDone);
    const fallbackTimer = setTimeout(() => setVisible(true), 2500);

    return () => {
      window.removeEventListener("loader:done", handleLoaderDone);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Close on outside tap or Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDialOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDialOpen(false);
      }
    };

    if (dialOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dialOpen]);

  const handleOpenChat = () => {
    window.dispatchEvent(new CustomEvent("chat:open"));
  };

  const showLabelTemporarily = (label: string) => {
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 1500);
  };

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed z-[250] right-4 bottom-[calc(16px+env(safe-area-inset-bottom))] flex flex-col items-center select-none"
    >
      {/* Dial Pop-up Items Stack */}
      {dialOpen && (
        <div className="flex flex-col items-center space-y-2 mb-3 animate-[fadeInUp_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          {/* Label Tooltip */}
          {copiedLabel && (
            <div className="absolute right-[64px] top-4 bg-[var(--ink)] text-white text-[12px] px-3 py-1 font-medium whitespace-nowrap shadow-none rounded-none animate-fade-in pointer-events-none">
              {copiedLabel}
            </div>
          )}

          {/* WhatsApp */}
          <a
            href={SITE.whatsappMessage}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            onClick={() => showLabelTemporarily("WhatsApp")}
            className="w-11 h-11 bg-white border border-[var(--blue)] text-[var(--blue)] flex items-center justify-center hover:bg-[var(--blue)] hover:text-white transition-colors cursor-pointer rounded-none"
          >
            <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </a>

          {/* Call Phone 1 */}
          <a
            href={`tel:${SITE.tel[0]}`}
            aria-label="Call Steel Mind"
            onClick={() => showLabelTemporarily(SITE.phones[0])}
            className="w-11 h-11 bg-white border border-[var(--blue)] text-[var(--blue)] flex items-center justify-center hover:bg-[var(--blue)] hover:text-white transition-colors cursor-pointer rounded-none"
          >
            <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </a>

          {/* Email */}
          <a
            href={`mailto:${SITE.email}`}
            aria-label="Email Steel Mind"
            onClick={() => showLabelTemporarily(SITE.email)}
            className="w-11 h-11 bg-white border border-[var(--blue)] text-[var(--blue)] flex items-center justify-center hover:bg-[var(--blue)] hover:text-white transition-colors cursor-pointer rounded-none"
          >
            <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
              <rect x="2" y="4" width="20" height="16" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href={SITE.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            onClick={() => showLabelTemporarily("LinkedIn")}
            className="w-11 h-11 bg-white border border-[var(--blue)] text-[var(--blue)] flex items-center justify-center hover:bg-[var(--blue)] hover:text-white transition-colors cursor-pointer rounded-none"
          >
            <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        </div>
      )}

      {/* Contact Dial Button (Square, 52px, 1px blue border) */}
      <button
        type="button"
        onClick={() => setDialOpen(!dialOpen)}
        aria-label="Contact options"
        className="w-[52px] h-[52px] bg-white border border-[var(--blue)] text-[var(--blue)] flex items-center justify-center shadow-none mb-3 hover:bg-[var(--offwhite)] transition-colors cursor-pointer rounded-none"
      >
        <svg className="w-6 h-6 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>

      {/* AI Chat Launcher (Circle 52px, soft glossy royal blue) */}
      <button
        type="button"
        onClick={handleOpenChat}
        aria-label="Open AI Assistant Chat"
        style={{
          background: "var(--blue-btn-gradient)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.28), 0 6px 18px rgba(26,43,104,0.35)",
        }}
        className="w-[52px] h-[52px] rounded-full text-white flex items-center justify-center hover:brightness-110 active:scale-95 transition-all cursor-pointer"
      >
        <svg className="w-6 h-6 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
