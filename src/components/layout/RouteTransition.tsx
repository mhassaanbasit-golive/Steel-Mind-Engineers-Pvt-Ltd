import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTop } from "../../lib/lenis.ts";
import { gsap } from "../../lib/gsap.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";

export const RouteTransition: React.FC = () => {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const reducedMotion = useReducedMotion();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    if (location.pathname === prevPathRef.current) return;
    prevPathRef.current = location.pathname;

    setNavigating(true);
    const bar = progressBarRef.current;
    if (bar) {
      bar.style.transition = "none";
      bar.style.transform = "scaleX(0)";
      bar.style.opacity = "1";
      requestAnimationFrame(() => {
        bar.style.transition = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
        bar.style.transform = "scaleX(0.75)";
      });
    }

    const completeBar = () => {
      if (bar) {
        bar.style.transition = "transform 0.15s ease-out";
        bar.style.transform = "scaleX(1)";
        setTimeout(() => {
          bar.style.transition = "opacity 0.2s ease";
          bar.style.opacity = "0";
          setTimeout(() => setNavigating(false), 200);
        }, 150);
      } else {
        setNavigating(false);
      }
    };

    const mainEl = document.getElementById("main");
    if (reducedMotion || !mainEl) {
      scrollToTop();
      completeBar();
      return;
    }

    // Fade outgoing page to opacity: 0 over 0.2s, scroll to top,
    // then fade incoming page from opacity: 0, y: 12 to opacity: 1, y: 0 over 0.4s
    gsap.to(mainEl, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        scrollToTop();
        completeBar();
        gsap.fromTo(
          mainEl,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "cubic-bezier(0.23, 1, 0.32, 1)",
            clearProps: "transform,opacity",
          }
        );
      },
    });
  }, [location.pathname, reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px] pointer-events-none overflow-hidden"
      style={{ display: navigating ? "block" : "none" }}
    >
      <div
        ref={progressBarRef}
        className="w-full h-full bg-[var(--blue)] origin-left"
        style={{
          transform: "scaleX(0)",
          transformOrigin: "left center",
          boxShadow: "0 0 10px var(--blue-glow), 0 0 4px var(--blue-glow)",
        }}
      />
    </div>
  );
};
