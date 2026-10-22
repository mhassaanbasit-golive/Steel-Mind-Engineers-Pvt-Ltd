import React, { useEffect, useRef, useState } from "react";
import { stopScroll, startScroll } from "../../lib/lenis.ts";

let hasLoadedInitially = false;

export const Loader: React.FC = () => {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    if (hasLoadedInitially) return false;
    // Check if previously loaded in session
    if (sessionStorage.getItem("app_booted") === "true") {
      hasLoadedInitially = true;
      return false;
    }
    return true;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const barWrapperRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If not visible, ensure static boot element is removed and scroll is active
    if (!visible) {
      const bootEl = document.getElementById("boot");
      if (bootEl) bootEl.remove();
      startScroll();
      return;
    }

    // Stop scrolling during initial loader
    stopScroll();

    // Clean up inline script interval if set
    if (typeof window !== "undefined" && (window as any).__bootInterval) {
      clearInterval((window as any).__bootInterval);
    }

    let currentVal = 0;
    let targetVal = 25;
    const startTime = performance.now();
    let isFinished = false;
    let rafId: number;

    const finish = () => {
      if (isFinished) return;
      isFinished = true;
      hasLoadedInitially = true;
      try {
        sessionStorage.setItem("app_booted", "true");
      } catch {}

      // Exit sequence: bar & count fade up, container wipes upward
      if (barWrapperRef.current && countRef.current && logoRef.current) {
        barWrapperRef.current.style.transition = "opacity 300ms ease, transform 300ms ease";
        countRef.current.style.transition = "opacity 300ms ease, transform 300ms ease";
        logoRef.current.style.transition = "opacity 350ms ease, transform 350ms ease";

        barWrapperRef.current.style.opacity = "0";
        barWrapperRef.current.style.transform = "translateY(-8px)";
        countRef.current.style.opacity = "0";
        countRef.current.style.transform = "translateY(-8px)";
        logoRef.current.style.opacity = "0";
        logoRef.current.style.transform = "scale(0.96)";
      }

      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.transition = "clip-path 700ms cubic-bezier(0.76, 0, 0.24, 1)";
          containerRef.current.style.clipPath = "inset(0 0 100% 0)";
        }

        setTimeout(() => {
          setVisible(false);
          startScroll();
          document.dispatchEvent(new Event("app:ready"));
          window.dispatchEvent(new Event("site:ready"));
        }, 700);
      }, 150);
    };

    const updateTicker = () => {
      if (isFinished) return;
      const elapsed = performance.now() - startTime;

      // Snappy and responsive target progression
      if (elapsed < 120) {
        targetVal = 55;
      } else if (elapsed < 260) {
        targetVal = 85;
      } else if (elapsed >= 400) {
        targetVal = 100;
      }

      currentVal += (targetVal - currentVal) * 0.22;
      if (currentVal > targetVal) currentVal = targetVal;

      const displayNum = Math.min(100, Math.round(currentVal));

      if (barFillRef.current) {
        barFillRef.current.style.transform = `scaleX(${currentVal / 100})`;
      }
      if (countRef.current) {
        countRef.current.textContent = `${displayNum}%`;
      }

      if (currentVal >= 99 && targetVal >= 100) {
        if (barFillRef.current) barFillRef.current.style.transform = "scaleX(1)";
        if (countRef.current) countRef.current.textContent = "100%";
        setTimeout(finish, 120);
      } else {
        rafId = requestAnimationFrame(updateTicker);
      }
    };

    rafId = requestAnimationFrame(updateTicker);

    // Hard fallback timeout
    const fallbackTimer = setTimeout(() => {
      if (!isFinished) finish();
    }, 2800);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(fallbackTimer);
      startScroll();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center select-none"
      style={{
        clipPath: "inset(0 0 0 0)",
      }}
    >
      <div className="flex flex-col items-center justify-center text-center px-4">
        {/* Steel Mind logo */}
        <img
          ref={logoRef}
          src="https://res.cloudinary.com/cyfb9slf/image/upload/v1791401768/Landscape.jpg"
          alt="Steel Mind Engineers"
          width={240}
          height={88}
          className="w-[180px] sm:w-[220px] md:w-[260px] max-w-[80vw] h-auto object-contain transition-transform"
        />

        {/* Loading progress bar */}
        <div
          ref={barWrapperRef}
          className="w-[180px] sm:w-[220px] h-[3px] mt-7 bg-[rgba(15,23,42,0.1)] relative overflow-hidden rounded-full"
        >
          <div
            ref={barFillRef}
            className="w-full h-full bg-[#1E3A8A] origin-left rounded-full"
            style={{
              transform: "scaleX(0)",
              transformOrigin: "left",
              boxShadow: "0 0 8px rgba(30,58,138,0.4)",
            }}
          />
        </div>

        {/* Counter */}
        <div
          ref={countRef}
          className="mt-3.5 text-[12px] font-semibold text-[#4B5563] tracking-[0.1em] tabular-nums font-mono leading-none"
        >
          0%
        </div>
      </div>
    </div>
  );
};
