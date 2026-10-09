import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import { scrollToTop } from "../../lib/lenis.ts";

export const RouteTransition: React.FC = () => {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(false);
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  useEffect(() => {
    // Skip if only hash changed or same path
    if (location.pathname === prevPathname) return;
    setPrevPathname(location.pathname);

    if (reducedMotion) {
      scrollToTop();
      return;
    }

    setActive(true);

    const scrollTimer = setTimeout(() => {
      scrollToTop();
    }, 300);

    const doneTimer = setTimeout(() => {
      setActive(false);
    }, 600);

    return () => {
      clearTimeout(scrollTimer);
      clearTimeout(doneTimer);
    };
  }, [location.pathname, prevPathname, reducedMotion]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[500] bg-[#0A0A0A] flex items-center justify-center pointer-events-none transition-opacity duration-300"
    >
      <div className="flex items-center space-x-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white animate-pulse"
            style={{
              animationDelay: `${i * 150}ms`,
              animationDuration: "900ms",
            }}
          />
        ))}
      </div>
    </div>
  );
};
