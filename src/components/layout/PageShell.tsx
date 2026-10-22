import React, { useEffect, useRef, useState, Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import { SkipLink } from "./SkipLink.tsx";
import { Header } from "./Header.tsx";
import { Footer } from "./Footer.tsx";
import { FloatingTools } from "./FloatingTools.tsx";
import { BackButton } from "../ui/BackButton.tsx";
import { initMotion } from "../../lib/motion.ts";
import { ScrollTrigger } from "../../lib/gsap.ts";
import { ErrorBoundary } from "../common/ErrorBoundary.tsx";

const ChatOverlay = lazy(() =>
  import("../chat/ChatOverlay.tsx").then((m) => ({ default: m.ChatOverlay }))
);

let hasSiteLoadedInitially = false;
if (typeof window !== "undefined") {
  window.addEventListener("site:ready", () => {
    hasSiteLoadedInitially = true;
  }, { once: true });
  document.addEventListener("app:ready", () => {
    hasSiteLoadedInitially = true;
  }, { once: true });
}

export interface PageShellProps {
  children: React.ReactNode;
  hasDarkHero?: boolean;
}

export const PageShell: React.FC<PageShellProps> = ({
  children,
  hasDarkHero = true,
}) => {
  const location = useLocation();
  const isHomepage = location.pathname === "/";
  const mainRef = useRef<HTMLElement>(null);
  const [chatOpened, setChatOpened] = useState(false);

  // Lazy-load chat overlay only on first open event
  useEffect(() => {
    const handleChatOpen = () => setChatOpened(true);
    window.addEventListener("chat:open", handleChatOpen);
    return () => window.removeEventListener("chat:open", handleChatOpen);
  }, []);

  // Motion orchestration: ensure ScrollTrigger.refresh() is ONLY called after the Loader has completely finished
  useEffect(() => {
    // 1. Explicitly scroll to top BEFORE GSAP initializes
    window.scrollTo(0, 0);

    let revertMotion: (() => void) | undefined;
    let r1: number;
    let r2: number;
    let refreshTimer: ReturnType<typeof setTimeout>;

    const executeInit = () => {
      window.scrollTo(0, 0);
      r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => {
          if (mainRef.current) {
            revertMotion = initMotion(mainRef.current);
          }
          // Force ScrollTrigger refresh ONLY after Loader has completely finished and DOM has settled
          refreshTimer = setTimeout(() => {
            window.scrollTo(0, 0);
            ScrollTrigger.refresh(true);
          }, 100);
        });
      });
    };

    if (!hasSiteLoadedInitially) {
      let executed = false;
      const onLoaderDone = () => {
        if (executed) return;
        executed = true;
        hasSiteLoadedInitially = true;
        executeInit();
      };

      window.addEventListener("site:ready", onLoaderDone, { once: true });
      document.addEventListener("app:ready", onLoaderDone, { once: true });
      const timer = setTimeout(onLoaderDone, 2100);

      return () => {
        window.removeEventListener("site:ready", onLoaderDone);
        document.removeEventListener("app:ready", onLoaderDone);
        clearTimeout(timer);
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
        clearTimeout(refreshTimer);
        if (revertMotion) revertMotion();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    } else {
      executeInit();
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
        clearTimeout(refreshTimer);
        if (revertMotion) revertMotion();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex flex-col bg-white text-[var(--ink)] overflow-x-clip">
      <SkipLink />
      <Header hasDarkHero={hasDarkHero} />
      {!isHomepage && <BackButton />}

      <main
        id="main"
        ref={mainRef}
        data-home={String(isHomepage)}
        style={{
          paddingTop: isHomepage ? 0 : "var(--nav-h, 80px)",
        }}
        className="flex-1 w-full flow-root m-0 p-0"
      >
        <div key={location.pathname} className="w-full">
          <ErrorBoundary resetKey={location.pathname}>
            {children}
          </ErrorBoundary>
        </div>
      </main>

      <Footer />
      <FloatingTools />

      {chatOpened && (
        <Suspense fallback={null}>
          <ChatOverlay />
        </Suspense>
      )}
    </div>
  );
};
