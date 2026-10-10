import React, { useEffect, useState } from "react";
import { A } from "../../data/assets.ts";
import { stopScroll, startScroll } from "../../lib/lenis.ts";

let hasLoaderPlayed = false;

const PHRASES = [
  "Cutting steel to drawing",
  "Welding every joint",
  "Raising your frame",
];

export const Loader: React.FC = () => {
  const [mounted, setMounted] = useState(!hasLoaderPlayed);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (hasLoaderPlayed) return;

    stopScroll();

    // Phrases interval: visible 0.5s each
    const phraseInterval = setInterval(() => {
      setPhraseIndex((prev) => (prev < PHRASES.length - 1 ? prev + 1 : prev));
    }, 550);

    // Quick splash dismissal so site is interactive in under 1 second
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        hasLoaderPlayed = true;
        setMounted(false);
        startScroll();
        window.dispatchEvent(new CustomEvent("loader:done"));
      }, 200);
    }, 280);

    return () => {
      clearInterval(phraseInterval);
      clearTimeout(exitTimer);
      startScroll();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-400 ${
        isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* 3px Top Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-neutral-100 overflow-hidden">
        <div
          style={{ backgroundImage: "var(--gradient-brand-horizontal)" }}
          className="h-full w-full origin-left animate-[loaderFill_1.5s_cubic-bezier(0.25,1,0.5,1)_forwards]"
        />
      </div>

      {/* Transparent Logo */}
      <div className="w-[120px] mb-6 flex items-center justify-center animate-[fadeIn_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]">
        <img
          src={A.logoTransparent}
          alt="Steel Mind Engineers Logo"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Phrases */}
      <div className="h-6 flex items-center justify-center">
        <span
          key={phraseIndex}
          className="text-[13px] uppercase font-semibold text-[var(--grey)] tracking-[0.12em] animate-[fadeIn_0.3s_ease-out_forwards]"
        >
          {PHRASES[phraseIndex]}
        </span>
      </div>

      <style>{`
        @keyframes loaderFill {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
