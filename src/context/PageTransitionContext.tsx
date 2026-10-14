import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface PageTransitionContextType {
  transitionNavigate: (to: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  transitionNavigate: () => {},
  isTransitioning: false,
});

export const useTransitionNavigate = () => {
  const ctx = useContext(PageTransitionContext);
  return ctx.transitionNavigate;
};

export const useIsTransitioning = () => {
  const ctx = useContext(PageTransitionContext);
  return ctx.isTransitioning;
};

// Helper: decode any hero image or high priority image on the incoming page
const waitForHeroImage = (): Promise<void> => {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, 3000);

    // Give React time to mount the DOM
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const heroImg = document.querySelector<HTMLImageElement>(
          'img[fetchpriority="high"], main img:first-of-type, #main img:first-of-type'
        );

        if (!heroImg) {
          clearTimeout(timer);
          resolve();
          return;
        }

        if (heroImg.complete && heroImg.naturalWidth > 0) {
          clearTimeout(timer);
          resolve();
          return;
        }

        if (heroImg.decode) {
          heroImg
            .decode()
            .then(() => {
              clearTimeout(timer);
              resolve();
            })
            .catch(() => {
              clearTimeout(timer);
              resolve();
            });
        } else {
          heroImg.onload = () => {
            clearTimeout(timer);
            resolve();
          };
          heroImg.onerror = () => {
            clearTimeout(timer);
            resolve();
          };
        }
      });
    });
  });
};

const waitForFonts = (): Promise<void> => {
  if (typeof document !== "undefined" && document.fonts?.ready) {
    return Promise.race([
      document.fonts.ready.then(() => {}),
      new Promise<void>((r) => setTimeout(r, 2000)),
    ]);
  }
  return Promise.resolve();
};

export const PageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const routerNavigate = useNavigate();
  const location = useLocation();
  const currentLocationRef = useRef(location.pathname);
  currentLocationRef.current = location.pathname;

  const isLockedRef = useRef(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [transitionDuration, setTransitionDuration] = useState(400);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Initial load handler
  useEffect(() => {
    // Clean up initial HTML preloader if present
    const preloader = document.getElementById("initial-preloader");
    if (preloader) {
      preloader.remove();
    }
    document.documentElement.classList.remove("site-loading");

    const startTime = Date.now();
    isLockedRef.current = true;

    Promise.all([waitForFonts(), waitForHeroImage()]).then(() => {
      const elapsed = Date.now() - startTime;
      const remainingHold = Math.max(0, 600 - elapsed);

      setTimeout(() => {
        window.scrollTo(0, 0);
        const fadeOutTime = prefersReduced ? 200 : 600;
        setTransitionDuration(fadeOutTime);
        setOverlayOpacity(0);

        setTimeout(() => {
          setOverlayVisible(false);
          isLockedRef.current = false;
        }, fadeOutTime);
      }, remainingHold);
    });
  }, [prefersReduced]);

  // Back/forward navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (isLockedRef.current) return;
      isLockedRef.current = true;

      // Show overlay at once (no fade-in delay)
      setTransitionDuration(0);
      setOverlayOpacity(1);
      setOverlayVisible(true);

      const startTime = Date.now();
      Promise.all([waitForFonts(), waitForHeroImage()]).then(() => {
        const elapsed = Date.now() - startTime;
        const remainingHold = Math.max(0, 600 - elapsed);

        setTimeout(() => {
          window.scrollTo(0, 0);
          const fadeOutTime = prefersReduced ? 200 : 600;
          setTransitionDuration(fadeOutTime);
          setOverlayOpacity(0);

          setTimeout(() => {
            setOverlayVisible(false);
            isLockedRef.current = false;
          }, fadeOutTime);
        }, remainingHold);
      });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [prefersReduced]);

  // Programmatic & Link transition navigation
  const transitionNavigate = useCallback(
    (to: string) => {
      // 1. Ignore click if a transition is running (ref lock)
      if (isLockedRef.current) return;

      // Link to current page: do nothing
      const currentClean = currentLocationRef.current.replace(/\/$/, "");
      const toClean = to.split("?")[0].split("#")[0].replace(/\/$/, "");
      if (currentClean === toClean) {
        return;
      }

      isLockedRef.current = true;
      const fadeInTime = prefersReduced ? 200 : 400;
      setTransitionDuration(fadeInTime);
      setOverlayVisible(true);
      // Ensure element is visible before starting opacity fade
      requestAnimationFrame(() => {
        setOverlayOpacity(1);
      });

      const startTime = Date.now();

      // 2. Overlay fades IN 400ms.
      // 3. When fully visible, change route.
      setTimeout(() => {
        routerNavigate(to);

        // 4. Wait for: route component loaded, fonts, hero image decoded
        Promise.all([waitForFonts(), waitForHeroImage()]).then(() => {
          // 5. Hold overlay at least 600ms total
          const elapsed = Date.now() - startTime;
          const remainingHold = Math.max(0, 600 - elapsed);

          setTimeout(() => {
            // 6. window.scrollTo(0,0) before fade-out
            window.scrollTo(0, 0);

            // 7. Fade OUT 600ms. Release lock.
            const fadeOutTime = prefersReduced ? 200 : 600;
            setTransitionDuration(fadeOutTime);
            setOverlayOpacity(0);

            setTimeout(() => {
              setOverlayVisible(false);
              isLockedRef.current = false;
            }, fadeOutTime);
          }, remainingHold);
        });
      }, fadeInTime);
    },
    [routerNavigate, prefersReduced]
  );

  return (
    <PageTransitionContext.Provider
      value={{ transitionNavigate, isTransitioning: overlayVisible }}
    >
      {children}

      {/* ONE full-screen overlay. position fixed; inset 0; z-index 9999; background exact nav blue. */}
      <div
        aria-hidden={!overlayVisible}
        className="fixed inset-0 z-[9999] flex items-center justify-center select-none"
        style={{
          backgroundColor: "var(--blue, #1E3A8A)",
          opacity: overlayOpacity,
          pointerEvents: overlayVisible ? "auto" : "none",
          transition: `opacity ${transitionDuration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        {/* Centre: 3 white dots in a row. Size clamp(8px, 2.2vw, 14px). Gap clamp(8px, 2vw, 14px). */}
        <div
          className="flex items-center justify-center"
          style={{
            gap: "clamp(8px, 2vw, 14px)",
          }}
        >
          <span
            className="rounded-full bg-white block"
            style={{
              width: "clamp(8px, 2.2vw, 14px)",
              height: "clamp(8px, 2.2vw, 14px)",
              animation: prefersReduced
                ? "none"
                : "pageTransitionWave 1200ms cubic-bezier(0.22, 1, 0.36, 1) infinite 0ms",
            }}
          />
          <span
            className="rounded-full bg-white block"
            style={{
              width: "clamp(8px, 2.2vw, 14px)",
              height: "clamp(8px, 2.2vw, 14px)",
              animation: prefersReduced
                ? "none"
                : "pageTransitionWave 1200ms cubic-bezier(0.22, 1, 0.36, 1) infinite 160ms",
            }}
          />
          <span
            className="rounded-full bg-white block"
            style={{
              width: "clamp(8px, 2.2vw, 14px)",
              height: "clamp(8px, 2.2vw, 14px)",
              animation: prefersReduced
                ? "none"
                : "pageTransitionWave 1200ms cubic-bezier(0.22, 1, 0.36, 1) infinite 320ms",
            }}
          />
        </div>

        <style>{`
          @keyframes pageTransitionWave {
            0%, 100% {
              transform: scale(0.6);
              opacity: 0.4;
            }
            50% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </PageTransitionContext.Provider>
  );
};
