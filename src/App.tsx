import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes.tsx";
import { PageTransitionProvider } from "./context/PageTransitionContext.tsx";
import { ErrorBoundary } from "./components/common/ErrorBoundary.tsx";
import { Loader } from "./components/layout/Loader.tsx";
import { ScrollTrigger } from "./lib/gsap.ts";
import { lenis } from "./lib/lenis.ts";

export default function App() {
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
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
