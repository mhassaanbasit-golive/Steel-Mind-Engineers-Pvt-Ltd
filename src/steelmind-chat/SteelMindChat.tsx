import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BotMessageSquareIcon,
  BotMessageSquareHandle,
} from "../components/icons/bot-message-square.tsx";
import "./styles.css";

export interface SteelMindChatProps {
  className?: string;
}

export const SteelMindChat: React.FC<SteelMindChatProps> = () => {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("app_booted") === "true";
  });

  const [bubbleRendered, setBubbleRendered] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);

  const iconRef = useRef<BotMessageSquareHandle>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const showTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isChatOpenRef = useRef(false);

  // 2. Widget Visibility — Loader Gate: Mounts only with the rest of the site after loader finishes
  useEffect(() => {
    if (visible) return;

    let triggered = false;
    const triggerEntrance = () => {
      if (triggered) return;
      triggered = true;
      setVisible(true);
      setTimeout(() => {
        iconRef.current?.startAnimation();
      }, 350);
    };

    window.addEventListener("site:ready", triggerEntrance);
    window.addEventListener("loader:done", triggerEntrance);
    document.addEventListener("app:ready", triggerEntrance);

    const fallbackTimer = setTimeout(triggerEntrance, 3200);

    return () => {
      window.removeEventListener("site:ready", triggerEntrance);
      window.removeEventListener("loader:done", triggerEntrance);
      document.removeEventListener("app:ready", triggerEntrance);
      clearTimeout(fallbackTimer);
    };
  }, [visible]);

  // Dismiss bubble immediately
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

    // Watch for removal of the assistant modal dialog
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

    let notificationShown = false;
    try {
      notificationShown = sessionStorage.getItem("notificationShown") === "true";
    } catch {}

    if (notificationShown) return;

    try {
      sessionStorage.setItem("notificationShown", "true");
    } catch {}

    let audioPlayed = false;
    const playChime = () => {
      if (audioPlayed) return;
      audioPlayed = true;
      try {
        const audio = new Audio("/sounds/pop.mp3");
        audio.volume = 0.5;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Silently fail if blocked by browser autoplay policy
          });
        }
      } catch {}
    };

    // Show after slight delay post-load
    showTimerRef.current = setTimeout(() => {
      setBubbleRendered(true);
      requestAnimationFrame(() => {
        setBubbleVisible(true);
      });
      playChime();

      // Mobile/browser autoplay fallback: if blocked, play on first user interaction while bubble is active
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

      {/* 3 & 4. Widget Launcher Button */}
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
