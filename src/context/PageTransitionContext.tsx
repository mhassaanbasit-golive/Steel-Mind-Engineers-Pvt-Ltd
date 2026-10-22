import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { lenis, stopScroll, startScroll, scrollToTop } from "../lib/lenis.ts";
import { ScrollTrigger } from "../lib/gsap.ts";

interface PageTransitionContextType {
  transitionNavigate: (to: string) => void;
  transitionBack: () => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  transitionNavigate: () => {},
  transitionBack: () => {},
  isTransitioning: false,
} satisfies PageTransitionContextType);

export const useTransitionNavigate = () => {
  const ctx = useContext(PageTransitionContext);
  return ctx.transitionNavigate;
};

export const useTransitionBack = () => {
  const ctx = useContext(PageTransitionContext);
  return ctx.transitionBack;
};

export const useIsTransitioning = () => {
  const ctx = useContext(PageTransitionContext);
  return ctx.isTransitioning;
};

// Helper: decode hero image on incoming page
const waitForHeroImage = (): Promise<void> => {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, 800);

    requestAnimationFrame(() => {
      const heroImg = document.querySelector<HTMLImageElement>(
        'img[fetchpriority="high"], main img:first-of-type, #main img:first-of-type, section:first-of-type img'
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
};

const waitForFonts = (): Promise<void> => {
  if (typeof document !== "undefined" && document.fonts?.ready) {
    return Promise.race([
      document.fonts.ready.then(() => {}),
      new Promise<void>((r) => setTimeout(r, 600)),
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

  const isTransitioningRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [overlayActive, setOverlayActive] = useState(false);
  const [loadingBarVisible, setLoadingBarVisible] = useState(false);

  // Set history manual scroll restoration
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Save scroll position per path
  useEffect(() => {
    const saveScroll = () => {
      try {
        const key = `scroll_${location.pathname}`;
        sessionStorage.setItem(key, String(window.scrollY));
      } catch {}
    };

    window.addEventListener("beforeunload", saveScroll);
    return () => {
      saveScroll();
      window.removeEventListener("beforeunload", saveScroll);
    };
  }, [location.pathname]);

  // Loading bar animation controller
  const startLoadingBar = useCallback(() => {
    setLoadingBarVisible(true);
    const bar = progressBarRef.current;
    if (bar) {
      bar.style.transition = "none";
      bar.style.transform = "scaleX(0)";
      bar.style.opacity = "1";
      requestAnimationFrame(() => {
        bar.style.transition = "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)";
        bar.style.transform = "scaleX(0.7)";
        setTimeout(() => {
          if (isTransitioningRef.current && bar) {
            bar.style.transition = "transform 600ms ease-out";
            bar.style.transform = "scaleX(0.92)";
          }
        }, 350);
      });
    }
  }, []);

  const finishLoadingBar = useCallback(() => {
    const bar = progressBarRef.current;
    if (bar) {
      bar.style.transition = "transform 200ms ease-out";
      bar.style.transform = "scaleX(1)";
      setTimeout(() => {
        bar.style.transition = "opacity 250ms ease";
        bar.style.opacity = "0";
        setTimeout(() => {
          setLoadingBarVisible(false);
          bar.style.transform = "scaleX(0)";
        }, 250);
      }, 150);
    } else {
      setLoadingBarVisible(false);
    }
  }, []);

  // Handle browser back/forward buttons (POP)
  useEffect(() => {
    let safetyTimer: ReturnType<typeof setTimeout> | undefined;

    const cleanupLock = () => {
      if (safetyTimer) clearTimeout(safetyTimer);
      finishLoadingBar();
      const overlay = overlayRef.current;
      if (overlay) {
        overlay.style.transition = "none";
        overlay.style.clipPath = "inset(100% 0 0 0)";
      }
      setOverlayActive(false);
      isTransitioningRef.current = false;
      startScroll();
    };

    const handlePopState = () => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      setOverlayActive(true);
      startLoadingBar();

      const overlay = overlayRef.current;
      const dots = dotsRef.current;
      if (overlay) {
        overlay.style.transition = "clip-path 400ms cubic-bezier(0.76, 0, 0.24, 1)";
        overlay.style.clipPath = "inset(0 0 0 0)";
      }
      if (dots) {
        dots.style.transition = "opacity 200ms ease";
        dots.style.opacity = "1";
      }

      stopScroll();

      // Kill previous ScrollTriggers to prevent lingering stale triggers
      ScrollTrigger.getAll().forEach((t) => t.kill());

      safetyTimer = setTimeout(() => {
        cleanupLock();
      }, 1500);

      Promise.all([waitForFonts(), waitForHeroImage()])
        .catch(() => {})
        .finally(() => {
          // Restore scroll position
          let savedY = 0;
          try {
            const key = `scroll_${window.location.pathname}`;
            savedY = Number(sessionStorage.getItem(key)) || 0;
          } catch {}

          if (lenis) {
            lenis.scrollTo(savedY, { immediate: true, force: true });
          } else {
            window.scrollTo(0, savedY);
          }
          ScrollTrigger.refresh();
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 100);
          finishLoadingBar();

          setTimeout(() => {
            if (dots) dots.style.opacity = "0";
            if (overlay) {
              overlay.style.transition = "clip-path 500ms cubic-bezier(0.76, 0, 0.24, 1)";
              overlay.style.clipPath = "inset(0 0 100% 0)";
            }

            setTimeout(() => {
              cleanupLock();
            }, 500);
          }, 100);
        });
    };

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        cleanupLock();
        try {
          if (lenis) {
            lenis.start();
            lenis.resize();
          }
          ScrollTrigger.refresh(true);
        } catch {}
        window.location.reload();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      if (safetyTimer) clearTimeout(safetyTimer);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", handlePageShow);
      cleanupLock();
    };
  }, [startLoadingBar, finishLoadingBar]);

  // Transition navigation function
  const transitionNavigate = useCallback(
    (to: string) => {
      if (isTransitioningRef.current) return;

      const currentClean = currentLocationRef.current.replace(/\/$/, "");
      const toClean = to.split("?")[0].split("#")[0].replace(/\/$/, "");
      if (currentClean === toClean) {
        if (lenis) {
          lenis.scrollTo(0, { duration: 0.8 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      isTransitioningRef.current = true;
      setOverlayActive(true);
      startLoadingBar();
      stopScroll();

      const overlay = overlayRef.current;
      const dots = dotsRef.current;

      // 1. Covering: sweep blue curtain in
      if (overlay) {
        overlay.style.transition = "clip-path 400ms cubic-bezier(0.76, 0, 0.24, 1)";
        overlay.style.clipPath = "inset(0 0 0 0)";
      }

      setTimeout(() => {
        if (dots) {
          dots.style.transition = "opacity 180ms ease";
          dots.style.opacity = "1";
        }
      }, 200);

      // 2. Perform navigation once covered
      setTimeout(() => {
        // Kill previous ScrollTriggers so old triggers do not linger
        ScrollTrigger.getAll().forEach((t) => t.kill());
        routerNavigate(to);

        // 3. Wait for content readiness
        Promise.all([
          waitForFonts(),
          waitForHeroImage(),
          new Promise<void>((r) => {
            requestAnimationFrame(() => requestAnimationFrame(() => r()));
          }),
        ]).then(() => {
          // Scroll immediately to top while covered
          scrollToTop();
          ScrollTrigger.refresh();
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 100);
          finishLoadingBar();

          // 4. Revealing: upward wipe
          setTimeout(() => {
            if (dots) {
              dots.style.transition = "opacity 120ms ease";
              dots.style.opacity = "0";
            }

            if (overlay) {
              overlay.style.transition = "clip-path 500ms cubic-bezier(0.76, 0, 0.24, 1)";
              overlay.style.clipPath = "inset(0 0 100% 0)";
            }

            // Fire page reveal event for staggered entrance animations
            setTimeout(() => {
              document.dispatchEvent(new Event("page:revealed"));
              window.dispatchEvent(new Event("page:revealed"));
            }, 250);

            // 5. Reset to idle — PREVENT FLICKER: disable transition before repositioning!
            setTimeout(() => {
              if (overlay) {
                overlay.style.transition = "none";
                overlay.style.clipPath = "inset(100% 0 0 0)";
              }
              setOverlayActive(false);
              isTransitioningRef.current = false;
              startScroll();
            }, 500);
          }, 80);
        });
      }, 400);

      // Safety timeout: ensure site never gets permanently locked
      setTimeout(() => {
        if (isTransitioningRef.current) {
          finishLoadingBar();
          if (overlay) {
            overlay.style.transition = "none";
            overlay.style.clipPath = "inset(100% 0 0 0)";
          }
          setOverlayActive(false);
          isTransitioningRef.current = false;
          startScroll();
        }
      }, 3500);
    },
    [routerNavigate, startLoadingBar, finishLoadingBar]
  );

  // Transition back function (for Back button on mobile & desktop)
  const transitionBack = useCallback(() => {
    if (isTransitioningRef.current) return;

    isTransitioningRef.current = true;
    setOverlayActive(true);
    startLoadingBar();
    stopScroll();

    const overlay = overlayRef.current;
    const dots = dotsRef.current;

    // 1. Covering: sweep solid blue curtain in
    if (overlay) {
      overlay.style.transition = "clip-path 400ms cubic-bezier(0.76, 0, 0.24, 1)";
      overlay.style.clipPath = "inset(0 0 0 0)";
    }

    setTimeout(() => {
      if (dots) {
        dots.style.transition = "opacity 180ms ease";
        dots.style.opacity = "1";
      }
    }, 200);

    // 2. Perform navigate(-1) once fully covered
    setTimeout(() => {
      // Kill previous ScrollTriggers so old triggers do not linger
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (typeof window !== "undefined" && window.history.length > 1) {
        routerNavigate(-1);
      } else {
        routerNavigate("/");
      }

      // 3. Wait for content readiness on the incoming page
      Promise.all([
        waitForFonts(),
        waitForHeroImage(),
        new Promise<void>((r) => {
          requestAnimationFrame(() => requestAnimationFrame(() => r()));
        }),
      ]).then(() => {
        scrollToTop();
        ScrollTrigger.refresh();
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
        finishLoadingBar();

        // 4. Revealing: upward wipe
        setTimeout(() => {
          if (dots) {
            dots.style.transition = "opacity 120ms ease";
            dots.style.opacity = "0";
          }

          if (overlay) {
            overlay.style.transition = "clip-path 500ms cubic-bezier(0.76, 0, 0.24, 1)";
            overlay.style.clipPath = "inset(0 0 100% 0)";
          }

          setTimeout(() => {
            document.dispatchEvent(new Event("page:revealed"));
            window.dispatchEvent(new Event("page:revealed"));
          }, 250);

          setTimeout(() => {
            if (overlay) {
              overlay.style.transition = "none";
              overlay.style.clipPath = "inset(100% 0 0 0)";
            }
            setOverlayActive(false);
            isTransitioningRef.current = false;
            startScroll();
          }, 500);
        }, 80);
      });
    }, 400);

    // Safety timeout
    setTimeout(() => {
      if (isTransitioningRef.current) {
        finishLoadingBar();
        if (overlay) {
          overlay.style.transition = "none";
          overlay.style.clipPath = "inset(100% 0 0 0)";
        }
        setOverlayActive(false);
        isTransitioningRef.current = false;
        startScroll();
      }
    }, 3500);
  }, [routerNavigate, startLoadingBar, finishLoadingBar]);

  return (
    <PageTransitionContext.Provider
      value={{ transitionNavigate, transitionBack, isTransitioning: overlayActive }}
    >
      {/* Sleek Top Loading Bar (Linear / YouTube style) */}
      <div
        aria-hidden="true"
        className="fixed top-0 inset-x-0 z-[10001] h-[3px] pointer-events-none overflow-hidden"
        style={{ display: loadingBarVisible ? "block" : "none" }}
      >
        <div
          ref={progressBarRef}
          className="w-full h-full bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#60A5FA] origin-left"
          style={{
            transform: "scaleX(0)",
            transformOrigin: "left center",
            boxShadow: "0 0 10px rgba(37,99,235,0.7), 0 0 4px #FFFFFF",
          }}
        />
      </div>

      {children}

      {/* Royal Blue Curtain Overlay with 3 Pulsing Dots */}
      <div
        ref={overlayRef}
        aria-hidden={!overlayActive}
        className="fixed inset-0 z-[9999] flex items-center justify-center select-none"
        style={{
          backgroundColor: "#1E3A8A",
          clipPath: "inset(100% 0 0 0)",
          pointerEvents: overlayActive ? "auto" : "none",
        }}
      >
        <div
          ref={dotsRef}
          className="flex items-center justify-center opacity-0"
          style={{ gap: "10px" }}
        >
          <span
            className="w-2.5 h-2.5 rounded-full bg-white block animate-bounce"
            style={{ animationDelay: "0ms", animationDuration: "750ms" }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full bg-white block animate-bounce"
            style={{ animationDelay: "150ms", animationDuration: "750ms" }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full bg-white block animate-bounce"
            style={{ animationDelay: "300ms", animationDuration: "750ms" }}
          />
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
};
