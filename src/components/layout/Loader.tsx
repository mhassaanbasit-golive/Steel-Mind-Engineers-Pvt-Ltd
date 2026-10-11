import React, { useEffect, useState, useRef } from "react";
import { A } from "../../data/assets.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import { stopScroll, startScroll } from "../../lib/lenis.ts";
import { gsap } from "../../lib/gsap.ts";

export const Loader: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);
  const reducedMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const lockupRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip entirely if prefers-reduced-motion: reduce
    if (reducedMotion) return;

    // Loader runs once per full page load. Not on route change.
    try {
      if (sessionStorage.getItem("sme_loaded")) {
        return;
      }
    } catch {
      return;
    }

    setMounted(true);
    stopScroll();
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const logo = logoRef.current;
      const lockup = lockupRef.current;
      const barFill = barFillRef.current;

      if (!container || !logo || !lockup || !barFill) return;

      const tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem("sme_loaded", "true");
          } catch {}
          setMounted(false);
          startScroll();
          document.body.style.overflow = "";
        },
      });

      // 1. Loader container fades in 0.3s
      tl.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "linear" }, 0);

      // 2. Logo fades in 0.4s delay 0.1s
      tl.fromTo(logo, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0.1);

      // 3. Lockup fades in 0.4s delay 0.2s
      tl.fromTo(lockup, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, 0.2);

      // 4. Bar fill animates scaleX(0) to scaleX(1) over 1.2s power2.out.
      // Simultaneously the percentage counts 0 to 100 with the same ease.
      const counterObj = { val: 0 };
      tl.fromTo(
        barFill,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: "power2.out", transformOrigin: "left" },
        0.3
      );
      tl.to(
        counterObj,
        {
          val: 100,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () => {
            setCount(Math.round(counterObj.val));
          },
        },
        0.3
      );

      // 5. Hold 0.2s (represented as position delay)
      // 6. Fade out whole loader 0.4s, ease power2.out, then unmount
      tl.to(container, { opacity: 0, duration: 0.4, ease: "power2.out" }, "+=0.2");
    });

    return () => {
      ctx.revert();
      startScroll();
      document.body.style.overflow = "";
    };
  }, [reducedMotion]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Loading"
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center select-none"
    >
      <div className="flex flex-col items-center justify-center text-center gap-5">
        {/* Transparent logo at 96px width */}
        <img
          ref={logoRef}
          src={A.logoTransparent}
          alt="Steel Mind Engineers"
          width={96}
          height={40}
          className="w-[96px] h-auto object-contain opacity-0"
        />

        {/* Lockup: "Steel Mind Engineers" and "Pvt Ltd" */}
        <div ref={lockupRef} className="flex flex-col items-center opacity-0">
          <span className="font-semibold text-[14px] text-[var(--ink)] leading-tight">
            Steel Mind Engineers
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--grey)] opacity-70 mt-0.5">
            Pvt Ltd
          </span>
        </div>

        {/* Thin 200px (mobile) / 240px (desktop) horizontal bar. Height 2px. Track var(--line). Fill var(--blue). */}
        <div className="w-[200px] md:w-[240px] h-[2px] bg-[var(--line)] relative overflow-hidden">
          <div
            ref={barFillRef}
            className="w-full h-full bg-[var(--blue)] origin-left scale-x-0"
          />
        </div>

        {/* Percentage number: 12px Inter 500, tabular-nums, grey, counts 0 to 100 */}
        <div className="text-[12px] font-medium text-[var(--grey)] tabular-nums font-mono leading-none">
          {count}%
        </div>
      </div>
    </div>
  );
};
