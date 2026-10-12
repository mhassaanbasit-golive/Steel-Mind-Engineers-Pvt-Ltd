import React, { useEffect, useRef, useState } from "react";
import { A } from "../../data/assets.ts";
import { stopScroll, startScroll } from "../../lib/lenis.ts";

let hasPlayedInitialLoader = false;

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    try {
      sessionStorage.removeItem("sme_loaded");
    } catch {
      // ignore
    }
  });
}

export const Loader: React.FC = () => {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [mounted, setMounted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    if (prefersReduced) return false;
    if (hasPlayedInitialLoader) return false;
    try {
      const navEntry = performance.getEntriesByType?.("navigation")?.[0] as PerformanceNavigationTiming | undefined;
      if (navEntry && navEntry.type === "reload") {
        sessionStorage.removeItem("sme_loaded");
      }
      if (sessionStorage.getItem("sme_loaded")) {
        return false;
      }
    } catch {
      // ignore
    }
    return true;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const lockupRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mounted || prefersReduced) {
      document.documentElement.classList.remove("site-loading");
      const preloader = document.getElementById("initial-preloader");
      if (preloader) {
        preloader.remove();
      }
      window.dispatchEvent(new CustomEvent("loader:done"));
      window.dispatchEvent(new Event("site:ready"));
      return;
    }

    stopScroll();
    document.body.style.overflow = "hidden";

    let finished = false;
    let animId: number;

    const finish = () => {
      if (finished) return;
      finished = true;
      hasPlayedInitialLoader = true;
      try {
        sessionStorage.setItem("sme_loaded", "true");
      } catch {
        // ignore
      }

      setMounted(false);
      startScroll();
      document.body.style.overflow = "";
      document.documentElement.classList.remove("site-loading");
      const preloader = document.getElementById("initial-preloader");
      if (preloader) {
        preloader.remove();
      }
      window.dispatchEvent(new CustomEvent("loader:done"));
      window.dispatchEvent(new Event("site:ready"));
    };

    // Hard fallback: never longer than 2.5s
    const hardTimeout = setTimeout(finish, 2400);

    const startTime = performance.now();

    // Keyframes matching the specification:
    // 0ms - 300ms: Loader container fades in (0.3s)
    // 100ms - 500ms: Logo fades in (0.4s delay 0.1s)
    // 200ms - 600ms: Lockup fades in (0.4s delay 0.2s)
    // 300ms - 1500ms: Bar fill animates scaleX(0) to scaleX(1) over 1.2s power2.out.
    //                 Percentage counts 0 to 100 with same ease.
    // 1500ms - 1700ms: Hold 0.2s (at 100%)
    // 1700ms - 2100ms: Fade out whole loader 0.4s ease power2.out, then unmount
    const tick = (now: number) => {
      if (finished) return;

      const t = Math.max(0, now - startTime);

      // 1. Loader container opacity: 0 -> 1 over 300ms
      const containerEl = containerRef.current;
      if (containerEl) {
        if (t < 300) {
          containerEl.style.opacity = String(t / 300);
        } else if (t >= 1700) {
          // Fade out whole loader 0.4s (1700ms to 2100ms) with power2.out: (1 - p)^2
          const fadeProgress = Math.min(1, (t - 1700) / 400);
          const fadeEase = 1 - Math.pow(fadeProgress, 2);
          containerEl.style.opacity = String(Math.max(0, fadeEase));
        } else {
          containerEl.style.opacity = "1";
        }
      }

      // 2. Logo opacity: 0 -> 1 from 100ms to 500ms (0.4s delay 0.1s)
      const logoEl = logoRef.current;
      if (logoEl) {
        if (t < 100) {
          logoEl.style.opacity = "0";
        } else if (t <= 500) {
          const lp = (t - 100) / 400;
          logoEl.style.opacity = String(1 - Math.pow(1 - lp, 2));
        } else {
          logoEl.style.opacity = "1";
        }
      }

      // 3. Lockup opacity: 0 -> 1 from 200ms to 600ms (0.4s delay 0.2s)
      const lockupEl = lockupRef.current;
      if (lockupEl) {
        if (t < 200) {
          lockupEl.style.opacity = "0";
        } else if (t <= 600) {
          const lkp = (t - 200) / 400;
          lockupEl.style.opacity = String(1 - Math.pow(1 - lkp, 2));
        } else {
          lockupEl.style.opacity = "1";
        }
      }

      // 4. Bar fill & counter: from 300ms to 1500ms (1.2s power2.out)
      const barEl = barFillRef.current;
      const countEl = counterRef.current;
      if (t < 300) {
        if (barEl) barEl.style.transform = "scaleX(0)";
        if (countEl) countEl.textContent = "0%";
      } else if (t <= 1500) {
        const bp = (t - 300) / 1200;
        // power2.out: 1 - (1 - bp)^2
        const ease = 1 - Math.pow(1 - bp, 2);
        const percent = Math.min(100, Math.round(ease * 100));
        if (barEl) barEl.style.transform = `scaleX(${ease})`;
        if (countEl) countEl.textContent = `${percent}%`;
      } else {
        // Hold 0.2s at 100% (1500ms - 1700ms)
        if (barEl) barEl.style.transform = "scaleX(1)";
        if (countEl) countEl.textContent = "100%";
      }

      // Check completion at 2100ms
      if (t >= 2100) {
        finish();
      } else {
        animId = requestAnimationFrame(tick);
      }
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(hardTimeout);
      startScroll();
      document.body.style.overflow = "";
    };
  }, [mounted, prefersReduced]);

  if (!mounted || prefersReduced) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Loading"
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center select-none"
      style={{
        opacity: 0,
      }}
    >
      <div className="flex flex-col items-center justify-center text-center gap-[20px]">
        {/* Transparent logo (A.logoTransparent) at 96px width */}
        <img
          ref={logoRef}
          src={A.logoTransparent}
          alt="Steel Mind Engineers"
          width={96}
          height={40}
          className="w-[96px] h-auto object-contain"
          style={{ opacity: 0 }}
        />

        {/* Lockup: "Steel Mind Engineers" (Inter 600, 14px, ink) and below it "Pvt Ltd" (10px uppercase, tracking 0.18em, grey, opacity 0.7) */}
        <div
          ref={lockupRef}
          className="flex flex-col items-center"
          style={{ opacity: 0 }}
        >
          <span className="font-semibold text-[14px] text-[var(--ink)] leading-tight">
            Steel Mind Engineers
          </span>
          <span className="text-[9px] uppercase tracking-[0.18em] text-[var(--grey)] opacity-70 mt-0.5">
            Pvt Ltd
          </span>
        </div>

        {/* A thin 200px (mobile) / 240px (desktop) horizontal bar. Height 2px. Track var(--line). Fill var(--blue). transform-origin: left; scaleX(0). */}
        <div className="w-[200px] md:w-[240px] h-[2px] bg-[var(--line)] relative overflow-hidden">
          <div
            ref={barFillRef}
            className="w-full h-full bg-[var(--blue)] origin-left"
            style={{
              transform: "scaleX(0)",
              transformOrigin: "left",
            }}
          />
        </div>

        {/* Percentage number: 12px Inter 500, tabular-nums, grey, counts 0 to 100 */}
        <div
          ref={counterRef}
          className="text-[12px] font-medium text-[var(--grey)] tabular-nums font-mono leading-none"
        >
          0%
        </div>
      </div>
    </div>
  );
};
