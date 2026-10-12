import React, { useState, useEffect, useRef } from "react";
import { SITE } from "../../data/site.ts";
import {
  BotMessageSquareIcon,
  BotMessageSquareHandle,
} from "../icons/bot-message-square.tsx";
import {
  LayoutGridIcon,
  LayoutGridIconHandle,
} from "../icons/layout-grid.tsx";
import { PhoneIcon, PhoneIconHandle } from "../icons/phone.tsx";
import {
  MessageCircleCheckIcon,
  MessageCircleCheckIconHandle,
} from "../icons/message-circle-check.tsx";
import {
  MessageSquareMoreIcon,
  MessageSquareMoreIconHandle,
} from "../icons/message-square-more.tsx";
import { LinkedinIcon, LinkedinIconHandle } from "../icons/linkedin.tsx";
import { useScrollState } from "../../hooks/useScrollState.ts";

export const FloatingTools: React.FC = () => {
  const [dialOpen, setDialOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isScrolling } = useScrollState();

  const botMessageRef = useRef<BotMessageSquareHandle>(null);
  const layoutGridRef = useRef<LayoutGridIconHandle>(null);
  const whatsappRef = useRef<MessageCircleCheckIconHandle>(null);
  const phoneRef = useRef<PhoneIconHandle>(null);
  const emailRef = useRef<MessageSquareMoreIconHandle>(null);
  const linkedinRef = useRef<LinkedinIconHandle>(null);

  // Play animation on load, site:ready, plus idle loop every 4s
  useEffect(() => {
    let triggered = false;
    let idleInterval: NodeJS.Timeout | undefined;

    const triggerEntrance = () => {
      if (triggered) return;
      triggered = true;
      setVisible(true);
      requestAnimationFrame(() => {
        setTimeout(() => {
          botMessageRef.current?.startAnimation();
          layoutGridRef.current?.startAnimation();
        }, 50);
      });

      // Loop while idle every 4 seconds
      idleInterval = setInterval(() => {
        botMessageRef.current?.startAnimation();
      }, 4000);
    };

    const handleLoaderDone = () => {
      setTimeout(triggerEntrance, 300);
    };

    window.addEventListener("site:ready", triggerEntrance);
    window.addEventListener("loader:done", handleLoaderDone);
    const fallbackTimer = setTimeout(triggerEntrance, 2000);

    return () => {
      window.removeEventListener("site:ready", triggerEntrance);
      window.removeEventListener("loader:done", handleLoaderDone);
      clearTimeout(fallbackTimer);
      if (idleInterval) clearInterval(idleInterval);
    };
  }, []);

  // Animate bot icon during scroll
  useEffect(() => {
    let lastScrollAnim = 0;
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollAnim > 600) {
        lastScrollAnim = now;
        botMessageRef.current?.startAnimation();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 6.2: On opening any section that contains an animated icon (dial open), the icon plays its animation once.
  useEffect(() => {
    if (dialOpen) {
      const t = setTimeout(() => {
        whatsappRef.current?.startAnimation();
        phoneRef.current?.startAnimation();
        emailRef.current?.startAnimation();
        linkedinRef.current?.startAnimation();
      }, 60);
      return () => clearTimeout(t);
    }
  }, [dialOpen]);

  // Close on outside tap or Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDialOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
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
      {/* Dial Pop-up Items Stack — 20px icon inside 44px rounded square, Royal Blue bg, white icon */}
      {dialOpen && (
        <div className="flex flex-col items-center space-y-2 mb-3 animate-[fadeInUp_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          {/* Label Tooltip */}
          {copiedLabel && (
            <div className="absolute right-[60px] top-4 bg-[var(--blue)] text-white text-[12px] px-3 py-1 font-medium whitespace-nowrap rounded-none animate-fade-in pointer-events-none">
              {copiedLabel}
            </div>
          )}

          {/* WhatsApp — message-circle-check */}
          <a
            href={SITE.whatsappMessage}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            onClick={() => showLabelTemporarily("WhatsApp")}
            onMouseEnter={() => whatsappRef.current?.startAnimation()}
            style={{ backgroundColor: "var(--blue)" }}
            className="w-[44px] h-[44px] text-white flex items-center justify-center hover:bg-[var(--blue-dark)] transition-colors cursor-pointer rounded-lg"
          >
            <MessageCircleCheckIcon
              ref={whatsappRef}
              size={20}
              className="text-white"
            />
          </a>

          {/* Call Phone 1 — phone */}
          <a
            href={`tel:${SITE.tel[0]}`}
            aria-label="Call Steel Mind Engineers"
            onClick={() => showLabelTemporarily(SITE.phones[0])}
            onMouseEnter={() => phoneRef.current?.startAnimation()}
            style={{ backgroundColor: "var(--blue)" }}
            className="w-[44px] h-[44px] text-white flex items-center justify-center hover:bg-[var(--blue-dark)] transition-colors cursor-pointer rounded-lg"
          >
            <PhoneIcon ref={phoneRef} size={20} className="text-white" />
          </a>

          {/* Email — message-square-more */}
          <a
            href={`mailto:${SITE.email}`}
            aria-label="Email Steel Mind Engineers"
            onClick={() => showLabelTemporarily(SITE.email)}
            onMouseEnter={() => emailRef.current?.startAnimation()}
            style={{ backgroundColor: "var(--blue)" }}
            className="w-[44px] h-[44px] text-white flex items-center justify-center hover:bg-[var(--blue-dark)] transition-colors cursor-pointer rounded-lg"
          >
            <MessageSquareMoreIcon
              ref={emailRef}
              size={20}
              className="text-white"
            />
          </a>

          {/* LinkedIn — linkedin */}
          <a
            href={SITE.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            onClick={() => showLabelTemporarily("LinkedIn")}
            onMouseEnter={() => linkedinRef.current?.startAnimation()}
            style={{ backgroundColor: "var(--blue)" }}
            className="w-[44px] h-[44px] text-white flex items-center justify-center hover:bg-[var(--blue-dark)] transition-colors cursor-pointer rounded-lg"
          >
            <LinkedinIcon ref={linkedinRef} size={20} className="text-white" />
          </a>
        </div>
      )}

      {/* Contact Dial Toggle Button — layout-grid, 20px icon inside 44px rounded square, Royal Blue bg, white icon */}
      <button
        type="button"
        onClick={() => setDialOpen(!dialOpen)}
        onMouseEnter={() => layoutGridRef.current?.startAnimation()}
        aria-label="Contact options"
        style={{ backgroundColor: "var(--blue)" }}
        className="w-[44px] h-[44px] text-white flex items-center justify-center mb-3 hover:bg-[var(--blue-dark)] transition-colors cursor-pointer rounded-lg"
      >
        <LayoutGridIcon
          ref={layoutGridRef}
          size={20}
          className="text-white"
        />
      </button>

      {/* AI Chat Launcher with soft white glow and scroll animation */}
      <div className="relative flex items-center justify-center">
        {/* Soft white glow aura */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 -m-2 rounded-full pointer-events-none transition-all duration-300 ease-out blur-md ${
            isScrolling
              ? "scale-125 opacity-95 bg-white/50"
              : "scale-100 opacity-70 bg-white/35"
          }`}
          style={{
            boxShadow: isScrolling
              ? "0 0 28px 10px rgba(255, 255, 255, 0.7)"
              : "0 0 20px 6px rgba(255, 255, 255, 0.45)",
          }}
        />

        <button
          type="button"
          onClick={handleOpenChat}
          onMouseEnter={() => botMessageRef.current?.startAnimation()}
          aria-label="Open AI Assistant Chat"
          style={{
            backgroundColor: "var(--blue)",
            boxShadow: isScrolling
              ? "0 0 24px 6px rgba(255, 255, 255, 0.6), 0 8px 24px rgba(0, 0, 0, 0.35)"
              : "0 0 16px 3px rgba(255, 255, 255, 0.35), 0 6px 18px var(--blue-glow)",
          }}
          className={`relative z-10 w-[52px] h-[52px] rounded-full text-white flex items-center justify-center hover:bg-[var(--blue-dark)] active:scale-95 cursor-pointer transition-all duration-300 ease-out ${
            isScrolling
              ? "-translate-y-2 scale-110 rotate-[-4deg] animate-[chatScrollBob_0.8s_ease-in-out_infinite]"
              : ""
          }`}
        >
          <BotMessageSquareIcon
            ref={botMessageRef}
            size={24}
            className="text-white"
          />
        </button>
      </div>

      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
