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

export const FloatingTools: React.FC = () => {
  const [dialOpen, setDialOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const botMessageRef = useRef<BotMessageSquareHandle>(null);
  const layoutGridRef = useRef<LayoutGridIconHandle>(null);
  const whatsappRef = useRef<MessageCircleCheckIconHandle>(null);
  const phoneRef = useRef<PhoneIconHandle>(null);
  const emailRef = useRef<MessageSquareMoreIconHandle>(null);
  const linkedinRef = useRef<LinkedinIconHandle>(null);

  // Play animation on load, site:ready, or fallback
  useEffect(() => {
    let triggered = false;

    const playIcons = () => {
      botMessageRef.current?.startAnimation();
      layoutGridRef.current?.startAnimation();
    };

    const triggerEntrance = () => {
      if (triggered) {
        playIcons();
        return;
      }
      triggered = true;
      setVisible(true);
      requestAnimationFrame(() => {
        setTimeout(playIcons, 60);
      });
    };

    const handleLoaderDone = () => {
      setTimeout(triggerEntrance, 300);
    };

    const handleSiteReady = () => {
      triggerEntrance();
      playIcons();
    };

    window.addEventListener("site:ready", handleSiteReady);
    window.addEventListener("loader:done", handleLoaderDone);
    const fallbackTimer = setTimeout(triggerEntrance, 1000);

    return () => {
      window.removeEventListener("site:ready", handleSiteReady);
      window.removeEventListener("loader:done", handleLoaderDone);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Play animation when scrolled into view (IntersectionObserver, threshold: 0.5)
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            botMessageRef.current?.startAnimation();
            layoutGridRef.current?.startAnimation();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [visible]);

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

      {/* Contact Dial Toggle Button */}
      <button
        type="button"
        onClick={() => setDialOpen(!dialOpen)}
        onMouseEnter={() => layoutGridRef.current?.startAnimation()}
        aria-label="Contact options"
        style={{
          backgroundColor: "var(--blue)",
          color: "#FFFFFF",
        }}
        className="w-[44px] h-[44px] text-white flex items-center justify-center mb-3 hover:bg-[var(--blue-dark)] transition-colors cursor-pointer rounded-lg"
      >
        <LayoutGridIcon
          ref={layoutGridRef}
          size={20}
          stroke="#FFFFFF"
          className="text-white"
          style={{ color: "#FFFFFF" }}
        />
      </button>

      {/* AI Chat Launcher */}
      <button
        type="button"
        onClick={handleOpenChat}
        onMouseEnter={() => botMessageRef.current?.startAnimation()}
        aria-label="Open AI Assistant Chat"
        style={{ backgroundColor: "var(--blue)" }}
        className="w-[52px] h-[52px] rounded-full text-white flex items-center justify-center hover:bg-[var(--blue-dark)] active:scale-95 cursor-pointer transition-colors"
      >
        <BotMessageSquareIcon
          ref={botMessageRef}
          size={24}
          className="text-white"
        />
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
