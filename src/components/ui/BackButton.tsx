import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftIcon, ArrowLeftIconHandle } from "../icons/arrow-left.tsx";
import { lenis } from "../../lib/lenis.ts";
import { useTransitionBack } from "../../context/PageTransitionContext.tsx";

export const BackButton: React.FC = () => {
  const transitionBack = useTransitionBack();
  const location = useLocation();
  const iconRef = useRef<ArrowLeftIconHandle>(null);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  const handleBack = useCallback(() => {
    transitionBack();
  }, [transitionBack]);

  useEffect(() => {
    // Reset to visible on route change if at upper section
    const initialY = typeof window !== "undefined" ? window.scrollY : 0;
    lastScrollYRef.current = initialY;
    setIsVisible(initialY <= 300);

    let rafId: number | null = null;

    const checkScroll = (currentY: number) => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        const lastY = lastScrollYRef.current;
        const isScrollingUp = currentY < lastY;
        lastScrollYRef.current = currentY;

        // Stick to the upper section only:
        // Visible when within upper section (<= 300px), or when returning back towards it (<= 450px and scrolling up).
        // Hides when scrolled deeper down into the page.
        const shouldShow = currentY <= 300 || (currentY <= 450 && isScrollingUp);
        setIsVisible(shouldShow);
        rafId = null;
      });
    };

    const onNativeScroll = () => {
      checkScroll(window.scrollY);
    };

    const onLenisScroll = (e: { scroll: number }) => {
      checkScroll(e.scroll);
    };

    window.addEventListener("scroll", onNativeScroll, { passive: true });
    if (lenis) {
      lenis.on("scroll", onLenisScroll);
    }

    return () => {
      window.removeEventListener("scroll", onNativeScroll);
      if (lenis) {
        lenis.off("scroll", onLenisScroll);
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [location.pathname]);

  if (location.pathname === "/") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
      aria-label="Go back"
      title="Go back"
      className={`fixed top-[76px] lg:top-[104px] left-4 lg:left-8 z-[150] w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-[#1E3A8A] text-white border-0 outline-none flex items-center justify-center cursor-pointer shadow-[0_8px_24px_rgba(30,58,138,0.35)] hover:shadow-[0_12px_28px_rgba(30,58,138,0.48)] hover:bg-[#1E40AF] active:scale-95 transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E3A8A] ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 -translate-y-4 scale-90 pointer-events-none"
      }`}
    >
      <ArrowLeftIcon
        ref={iconRef}
        size={22}
        className="text-white flex items-center justify-center"
      />
    </button>
  );
};
