import React, { useReducer, useEffect, useCallback } from "react";
import { Welcome } from "./Welcome.tsx";
import { DetailsForm } from "./DetailsForm.tsx";
import { ChatScreen, Msg } from "./ChatScreen.tsx";
import { Survey } from "./Survey.tsx";
import { stopScroll, startScroll } from "../../lib/lenis.ts";

type Screen = "welcome" | "form" | "chat" | "survey";

interface State {
  isOpen: boolean;
  screen: Screen;
  lead: { name: string; email: string; phone: string } | null;
  messages: Msg[];
  muted: boolean;
  leadSent: boolean;
  transcriptSent: boolean;
}

type Action =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SET_SCREEN"; screen: Screen }
  | { type: "SET_LEAD"; lead: { name: string; email: string; phone: string } }
  | { type: "SET_MESSAGES"; messages: Msg[] }
  | { type: "TOGGLE_MUTE" }
  | { type: "SET_TRANSCRIPT_SENT" };

const initialState: State = {
  isOpen: false,
  screen: "welcome",
  lead: null,
  messages: [],
  muted: false,
  leadSent: false,
  transcriptSent: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "OPEN":
      return {
        ...state,
        isOpen: true,
        screen: "welcome",
        lead: null,
        messages: [],
        leadSent: false,
        transcriptSent: false,
      };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "SET_SCREEN":
      return { ...state, screen: action.screen };
    case "SET_LEAD":
      return { ...state, lead: action.lead, leadSent: true, screen: "chat" };
    case "SET_MESSAGES":
      return { ...state, messages: action.messages };
    case "TOGGLE_MUTE":
      return { ...state, muted: !state.muted };
    case "SET_TRANSCRIPT_SENT":
      return { ...state, transcriptSent: true };
    default:
      return state;
  }
}

export const ChatOverlay: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Send transcript helper
  const sendTranscript = useCallback(() => {
    if (state.transcriptSent || !state.lead) return;
    const hasUserMessages = state.messages.some((m) => m.role === "user");
    if (!hasUserMessages) return;

    dispatch({ type: "SET_TRANSCRIPT_SENT" });

    const payload = {
      stage: "end",
      name: state.lead.name,
      email: state.lead.email,
      phone: state.lead.phone,
      conversation: state.messages,
    };

    try {
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    } catch {}
  }, [state.transcriptSent, state.lead, state.messages]);

  // Open / Close events
  useEffect(() => {
    const handleOpen = () => dispatch({ type: "OPEN" });
    window.addEventListener("chat:open", handleOpen);
    return () => window.removeEventListener("chat:open", handleOpen);
  }, []);

  // Scroll lock and accessibility on open
  useEffect(() => {
    if (state.isOpen) {
      stopScroll();
      const mainEl = document.getElementById("main");
      if (mainEl) mainEl.setAttribute("aria-hidden", "true");
    } else {
      startScroll();
      const mainEl = document.getElementById("main");
      if (mainEl) mainEl.removeAttribute("aria-hidden");
    }

    return () => {
      startScroll();
    };
  }, [state.isOpen]);

  // Close logic for cross button and Escape key
  const handleCloseTrigger = useCallback(() => {
    if (state.screen === "welcome" || state.screen === "form") {
      dispatch({ type: "CLOSE" });
    } else if (state.screen === "chat") {
      sendTranscript();
      dispatch({ type: "SET_SCREEN", screen: "survey" });
    } else if (state.screen === "survey") {
      dispatch({ type: "CLOSE" });
    }
  }, [state.screen, sendTranscript]);

  useEffect(() => {
    if (!state.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseTrigger();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.isOpen, handleCloseTrigger]);

  if (!state.isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Steel Mind Engineers Assistant"
      className="fixed inset-0 z-[300] h-[100dvh] bg-white/95 backdrop-blur-[20px] backdrop-saturate-[180%] [-webkit-backdrop-filter:blur(20px)_saturate(180%)] flex flex-col justify-between select-none animate-[fadeIn_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]"
    >
      {/* Top Header */}
      <div className="relative w-full h-[72px] px-6 flex items-center justify-between border-b border-[var(--line)] flex-shrink-0 z-20">
        {/* Mute Toggle */}
        <button
          type="button"
          onClick={() => dispatch({ type: "TOGGLE_MUTE" })}
          aria-pressed={state.muted}
          aria-label={state.muted ? "Unmute audio" : "Mute audio"}
          className="w-11 h-11 flex items-center justify-center text-[var(--ink)] hover:text-[var(--blue)] transition-colors cursor-pointer"
        >
          {state.muted ? (
            <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
              <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          ) : (
            <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>

        {/* Lockup Text */}
        <div className="text-center font-semibold text-[14px] lg:text-[17px] text-[var(--ink)] tracking-tight">
          Steel Mind Engineers
        </div>

        {/* Close Cross (Thin 24px) */}
        <button
          type="button"
          onClick={handleCloseTrigger}
          aria-label="Close assistant"
          className="w-11 h-11 flex items-center justify-center text-[var(--ink)] hover:text-[var(--blue)] transition-colors cursor-pointer"
        >
          <svg className="w-6 h-6 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Screen Body */}
      <div className="flex-1 w-full overflow-hidden flex flex-col justify-center relative">
        {state.screen === "welcome" && (
          <Welcome
            muted={state.muted}
            onStart={() => dispatch({ type: "SET_SCREEN", screen: "form" })}
          />
        )}

        {state.screen === "form" && (
          <DetailsForm
            muted={state.muted}
            onSubmit={(lead) => dispatch({ type: "SET_LEAD", lead })}
          />
        )}

        {state.screen === "chat" && state.lead && (
          <ChatScreen
            leadName={state.lead.name}
            messages={state.messages}
            muted={state.muted}
            onMessagesChange={(msgs) =>
              dispatch({ type: "SET_MESSAGES", messages: msgs })
            }
            onCloseOverlay={() => dispatch({ type: "CLOSE" })}
          />
        )}

        {state.screen === "survey" && (
          <Survey
            lead={state.lead}
            onFinish={() => dispatch({ type: "CLOSE" })}
          />
        )}
      </div>

      {/* Bottom Center Credit (Visible outside input bar) */}
      <div className="py-2.5 text-center flex-shrink-0 z-10 pointer-events-auto">
        <a
          href="https://getgolive.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] text-[var(--grey)] hover:underline"
        >
          Powered by getGoLive.io
        </a>
      </div>
    </div>
  );
};
