import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BotMessageSquareIcon,
  BotMessageSquareHandle,
} from "../components/icons/bot-message-square.tsx";
import "./styles.css";

// Ensure a fresh page reload resets any stale notification flag so the user can see & test the bubble
if (typeof window !== "undefined") {
  try {
    if (!(window as any).__smChatSessionInitialized) {
      (window as any).__smChatSessionInitialized = true;
      sessionStorage.removeItem("notificationShown");
    }
  } catch {}
}

export interface SteelMindChatProps {
  className?: string;
}

export const SteelMindChat: React.FC<SteelMindChatProps> = () => {
  // Check whether loader is actively running on the page
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return false;
    }
    // If the loader overlay exists in the DOM, keep widget hidden (return null)
    const loaderEl = document.querySelector(".z-\\[10000\\]");
    if (loaderEl) {
      return false;
    }
    // Otherwise check if app has already booted in this session
    return sessionStorage.getItem("app_booted") === "true";
  });

  const [bubbleRendered, setBubbleRendered] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);

  const iconRef = useRef<BotMessageSquareHandle>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const showTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isChatOpenRef = useRef(false);
  const audioPlayedRef = useRef(false);

  // Trigger built-in Lucide animation 2 times automatically on site load
  useEffect(() => {
    if (!visible) return;
    let animTimer3: NodeJS.Timeout | null = null;
    const animTimer1 = setTimeout(() => {
      iconRef.current?.startAnimation();
    }, 350);
    const animTimer2 = setTimeout(() => {
      iconRef.current?.stopAnimation();
      animTimer3 = setTimeout(() => {
        iconRef.current?.startAnimation();
      }, 50);
    }, 1500);

    return () => {
      clearTimeout(animTimer1);
      clearTimeout(animTimer2);
      if (animTimer3) clearTimeout(animTimer3);
    };
  }, [visible]);

  // Preload chat overlay module when widget becomes visible so first click opens instantly
  useEffect(() => {
    if (!visible) return;
    import("../components/chat/ChatOverlay.tsx").catch(() => {});
  }, [visible]);

  // 2. Widget Visibility — Loader Gate: Mounts only with the rest of the site after loader finishes
  useEffect(() => {
    if (visible) return;

    let triggered = false;
    const triggerEntrance = () => {
      if (triggered) return;
      triggered = true;
      setVisible(true);
    };

    // The Loader dispatches "site:ready" and "app:ready" right when its exit wipe finishes
    window.addEventListener("site:ready", triggerEntrance);
    document.addEventListener("app:ready", triggerEntrance);

    // Fallback: If loader is already gone or does not fire within 3.5s
    const fallbackTimer = setTimeout(() => {
      triggerEntrance();
    }, 3500);

    // Mutation observer check: trigger immediately if loader element is removed from DOM
    const observer = new MutationObserver(() => {
      const loaderEl = document.querySelector(".z-\\[10000\\]");
      if (!loaderEl) {
        triggerEntrance();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("site:ready", triggerEntrance);
      document.removeEventListener("app:ready", triggerEntrance);
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [visible]);

  // Dismiss notification bubble
  const dismissBubble = useCallback(() => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setBubbleVisible(false);
    setTimeout(() => setBubbleRendered(false), 400);
  }, []);

  // 4. Open chat and trigger Lucide built-in animation
  const handleOpenChat = useCallback(() => {
    dismissBubble();
    iconRef.current?.startAnimation();
    isChatOpenRef.current = true;
    window.dispatchEvent(new CustomEvent("chat:open"));
  }, [dismissBubble]);

  // 4. Close trigger for Lucide icon
  useEffect(() => {
    if (!visible) return;

    const handleChatCloseEvent = () => {
      if (isChatOpenRef.current) {
        isChatOpenRef.current = false;
        iconRef.current?.startAnimation();
      }
    };

    window.addEventListener("chat:close", handleChatCloseEvent);

    // Watch for removal of the assistant modal dialog to trigger close animation
    const observer = new MutationObserver(() => {
      const dialog = document.querySelector(
        'div[role="dialog"][aria-label="Steel Mind Engineers Assistant"]'
      );
      if (dialog) {
        isChatOpenRef.current = true;
      } else if (isChatOpenRef.current) {
        isChatOpenRef.current = false;
        iconRef.current?.startAnimation();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("chat:close", handleChatCloseEvent);
      observer.disconnect();
    };
  }, [visible]);

  // 5. Notification Bubble & Sound (only triggers after site is loaded and widget is visible)
  useEffect(() => {
    if (!visible) return;

    // Check if notification has already been shown in this session
    let notificationShown = false;
    try {
      notificationShown = sessionStorage.getItem("notificationShown") === "true";
    } catch {}

    if (notificationShown) return;

    try {
      sessionStorage.setItem("notificationShown", "true");
    } catch {}

    const playChime = () => {
      if (audioPlayedRef.current) return;
      try {
        const audio = new Audio("/sounds/pop.mp3");
        audio.volume = 0.5;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              audioPlayedRef.current = true;
            })
            .catch(() => {
              // Silently fail if blocked by browser autoplay policy
            });
        }
      } catch {}
    };

    // Show after 500ms post-load
    showTimerRef.current = setTimeout(() => {
      setBubbleRendered(true);
      requestAnimationFrame(() => {
        setBubbleVisible(true);
      });
      playChime();

      // Mobile/browser autoplay fallback: retry audio on first user interaction if blocked
      const onFirstInteract = () => {
        playChime();
        window.removeEventListener("pointerdown", onFirstInteract);
        window.removeEventListener("touchstart", onFirstInteract);
        window.removeEventListener("scroll", onFirstInteract);
      };
      window.addEventListener("pointerdown", onFirstInteract, {
        once: true,
        passive: true,
      });
      window.addEventListener("touchstart", onFirstInteract, {
        once: true,
        passive: true,
      });
      window.addEventListener("scroll", onFirstInteract, {
        once: true,
        passive: true,
      });

      // Fade out after exactly 4000ms (4 seconds)
      hideTimerRef.current = setTimeout(() => {
        setBubbleVisible(false);
        window.removeEventListener("pointerdown", onFirstInteract);
        window.removeEventListener("touchstart", onFirstInteract);
        window.removeEventListener("scroll", onFirstInteract);
        setTimeout(() => setBubbleRendered(false), 400);
      }, 4000);
    }, 500);

    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [visible]);

  // 2. Return null while loader is running
  if (!visible) {
    return null;
  }

  return (
    <div className="sm-chat-root">
      {/* 5. Notification Bubble */}
      {bubbleRendered && (
        <div
          role="status"
          aria-live="polite"
          onClick={handleOpenChat}
          className={`sm-chat-bubble ${
            bubbleVisible ? "sm-chat-bubble-visible" : "sm-chat-bubble-hidden"
          }`}
        >
          Hi! Do you need any help?
        </div>
      )}

      {/* 3 & 4. Widget Launcher Button (sized 44px × 44px matching upper menu icon) */}
      <button
        type="button"
        className="sm-chat-launcher"
        aria-label="Open chat"
        onClick={handleOpenChat}
        onMouseEnter={() => iconRef.current?.startAnimation()}
      >
        <BotMessageSquareIcon
          ref={iconRef}
          size={20}
          className="text-white"
        />
      </button>
    </div>
  );
};

export default SteelMindChat;
