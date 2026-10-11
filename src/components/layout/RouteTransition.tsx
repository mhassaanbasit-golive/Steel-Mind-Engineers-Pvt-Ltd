import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTop } from "../../lib/lenis.ts";
import { gsap } from "../../lib/gsap.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";

export const RouteTransition: React.FC = () => {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (location.pathname === prevPathRef.current) return;
    prevPathRef.current = location.pathname;

    const mainEl = document.getElementById("main");
    if (reducedMotion || !mainEl) {
      scrollToTop();
      return;
    }

    // Fade outgoing page to opacity: 0 over 0.2s, scroll to top,
    // then fade incoming page from opacity: 0, y: 12 to opacity: 1, y: 0 over 0.4s using cubic-bezier(0.23, 1, 0.32, 1)
    gsap.to(mainEl, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        scrollToTop();
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

  // No blocking overlay or dots
  return null;
};
