import React, { useEffect, useRef, useState, Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import { SkipLink } from "./SkipLink.tsx";
import { Header } from "./Header.tsx";
import { Footer } from "./Footer.tsx";
import { FloatingTools } from "./FloatingTools.tsx";
import { BackButton } from "../ui/BackButton.tsx";
import { initMotion } from "../../lib/motion.ts";
import { applySeo } from "../../lib/seo.ts";
import "../../lib/schema-inject.ts";
import { ErrorBoundary } from "../common/ErrorBoundary.tsx";

const ChatOverlay = lazy(() =>
  import("../chat/ChatOverlay.tsx").then((m) => ({ default: m.ChatOverlay }))
);

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

  // Lazy-load chat overlay on first open event, preloading module on idle
  useEffect(() => {
    const handleChatOpen = () => setChatOpened(true);
    window.addEventListener("chat:open", handleChatOpen);

    const preloadTimer = setTimeout(() => {
      import("../chat/ChatOverlay.tsx");
    }, 1500);

    return () => {
      window.removeEventListener("chat:open", handleChatOpen);
      clearTimeout(preloadTimer);
    };
  }, []);

  // Motion orchestration after 2 rAF ticks on every route change
  useEffect(() => {
    let revertMotion: (() => void) | undefined;
    let r1: number;
    let r2: number;

    r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => {
        if (mainRef.current) {
          revertMotion = initMotion(mainRef.current);
        }
      });
    });

    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
      if (revertMotion) revertMotion();
    };
  }, [location.pathname]);

  useEffect(() => {
    applySeo(location.pathname);
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
