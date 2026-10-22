import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes.tsx";
import { PageTransitionProvider } from "./context/PageTransitionContext.tsx";
import { ErrorBoundary } from "./components/common/ErrorBoundary.tsx";
import { Loader } from "./components/layout/Loader.tsx";
import { gsap, ScrollTrigger } from "./lib/gsap.ts";
import { lenis } from "./lib/lenis.ts";

if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

export default function App() {
  useEffect(() => {
    // Force scroll to top BEFORE any animations or measurements
    window.scrollTo(0, 0);

    // Global reset on mount: wipe any lingering tweens or ScrollTriggers from prior states
    gsap.killTweensOf("*");
    ScrollTrigger.getAll().forEach((t) => t.kill());

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return (
    <ErrorBoundary isRoot={true}>
      <Loader />
      <BrowserRouter>
        <PageTransitionProvider>
          <AppRoutes />
        </PageTransitionProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
