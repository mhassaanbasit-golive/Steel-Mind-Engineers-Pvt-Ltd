import React, { useReducer, useEffect, useCallback, useRef } from "react";
import { Welcome } from "./Welcome.tsx";
import { DetailsForm } from "./DetailsForm.tsx";
import { ChatScreen, Msg } from "./ChatScreen.tsx";
import { Survey } from "./Survey.tsx";
import { stopScroll, startScroll } from "../../lib/lenis.ts";
import { sendLead } from "../../steelmind-chat/lead.ts";
import { getChatStore } from "../../steelmind-chat/client.ts";
import { safeStorage } from "../../steelmind-chat/storage.ts";

type Screen = "welcome" | "form" | "chat" | "survey" | "review";

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
  | { type: "SET_TRANSCRIPT_SENT" }
  | { type: "RESET" };

const initialState: State = {
  isOpen: true,
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
    case "RESET":
      return {
        ...initialState,
        isOpen: false,
        screen: "welcome",
        lead: null,
        messages: [],
        leadSent: false,
        transcriptSent: false,
      };
    default:
      return state;
  }
}

export const ChatOverlay: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const sessionStartTimeRef = useRef<number>(Date.now());
  const lastSentRef = useRef<{ [reason: string]: number }>({});

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
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      const mainEl = document.getElementById("main");
      if (mainEl) mainEl.setAttribute("aria-hidden", "true");
    } else {
      startScroll();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      const mainEl = document.getElementById("main");
      if (mainEl) mainEl.removeAttribute("aria-hidden");
      window.dispatchEvent(new CustomEvent("chat:close"));
    }

    return () => {
      startScroll();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.dispatchEvent(new CustomEvent("chat:close"));
    };
  }, [state.isOpen]);

  // Close logic for cross button and Escape key
  const handleCloseTrigger = useCallback(() => {
    if (state.screen === "welcome" || state.screen === "form") {
      dispatch({ type: "CLOSE" });
    } else if (state.screen === "chat") {
      sendTranscript();
      const hasActualUserMessages = state.messages.some((m) => m.role === "user");
      if (!hasActualUserMessages) {
        dispatch({ type: "CLOSE" });
      } else {
        // Send close lead trigger when X is clicked after messages exist
        if (state.messages.length > 0 && lastSentRef.current["close"] !== state.messages.length) {
          lastSentRef.current["close"] = state.messages.length;
          const store = getChatStore();
          sendLead("close", {
            sessionId: store.sessionId,
            visitor: state.lead || store.visitor,
            startedAt: sessionStartTimeRef.current,
            rating: "",
            comment: "",
            needsHuman: false,
            companyWebsite: safeStorage.get("sm_honeypot") || "",
            messages: state.messages,
          });
        }
        dispatch({ type: "SET_SCREEN", screen: "review" });
      }
    } else if (state.screen === "survey" || state.screen === "review") {
      if (state.messages.length > 0 && lastSentRef.current["close"] !== state.messages.length) {
        lastSentRef.current["close"] = state.messages.length;
        const store = getChatStore();
        sendLead("close", {
          sessionId: store.sessionId,
          visitor: state.lead || store.visitor,
          startedAt: sessionStartTimeRef.current,
          rating: "",
          comment: "",
          needsHuman: false,
          companyWebsite: safeStorage.get("sm_honeypot") || "",
          messages: state.messages,
        });
      }
      dispatch({ type: "CLOSE" });
    }
  }, [state.screen, state.messages, state.lead, sendTranscript]);

  useEffect(() => {
    if (!state.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseTrigger();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.isOpen, handleCloseTrigger]);

  if (!state.isOpen) return null;

  const isWelcome = state.screen === "welcome";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Steel Mind Engineers Assistant"
      className={`fixed inset-0 z-[300] h-[100dvh] flex flex-col justify-between select-none animate-[fadeIn_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] overscroll-contain ${
        isWelcome
          ? "bg-[#1A3A8A]"
          : "bg-white"
      }`}
      style={{
        backgroundColor: isWelcome ? "#1A3A8A" : "#FFFFFF",
      }}
    >
      {/* Top Header (64px) */}
      {isWelcome ? (
        <div
          className="relative w-full h-[64px] px-5 md:px-6 flex items-center justify-between flex-shrink-0 z-20"
          style={{
            backgroundColor: "#1A3A8A",
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          {/* Brand Name & Subtext */}
          <div className="flex flex-col text-left">
            <span
              className="text-[12px] md:text-[13px] leading-tight"
              style={{
                color: "#FFFFFF",
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}
            >
              Steel Mind Engineers
            </span>
            <span
              className="text-[10px] uppercase leading-tight"
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                letterSpacing: "0.1em",
                marginTop: "2px",
              }}
            >
              Pvt Ltd
            </span>
          </div>

          {/* Close button (X) */}
          <button
            type="button"
            onClick={handleCloseTrigger}
            aria-label="Close assistant"
            className="screen1-close-btn w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[#FFFFFF] bg-transparent cursor-pointer"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.24)",
              transition: "background 0.2s ease, border-color 0.2s ease",
            }}
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="relative w-full h-[64px] px-6 flex items-center justify-between border-b border-[var(--line)] flex-shrink-0 z-20">
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
      )}

      {/* Screen Body */}
      <div className={`flex-1 w-full overflow-hidden flex flex-col relative ${isWelcome || state.screen === "form" ? "justify-center" : "justify-start"}`}>
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

        {(state.screen === "survey" || state.screen === "review") && (
          <Survey
            lead={state.lead}
            onFinish={(reviewData) => {
              if (state.messages.length > 0 && lastSentRef.current["close"] !== state.messages.length) {
                lastSentRef.current["close"] = state.messages.length;
                const store = getChatStore();
                sendLead("close", {
                  sessionId: store.sessionId,
                  visitor: state.lead || store.visitor,
                  startedAt: sessionStartTimeRef.current,
                  rating: reviewData?.rating || "",
                  comment: reviewData?.comment || "",
                  needsHuman: false,
                  companyWebsite: safeStorage.get("sm_honeypot") || "",
                  messages: state.messages,
                });
              }
              dispatch({ type: "RESET" });
              try {
                sessionStorage.removeItem("chat_session_id");
                sessionStorage.removeItem("chat_memory");
              } catch {}
            }}
          />
        )}
      </div>

      {/* Bottom Center Credit (48px bar) */}
      {isWelcome ? (
        <div
          className="h-[48px] px-6 flex items-center justify-center flex-shrink-0 z-10 pointer-events-auto"
          style={{
            backgroundColor: "#1A3A8A",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <a
            href="https://getgolive.io"
            target="_blank"
            rel="noopener noreferrer"
            className="screen1-footer-link text-[10px] md:text-[11px]"
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              letterSpacing: "0.04em",
              textDecoration: "none",
            }}
          >
            Powered by GetGoLive.io
          </a>
        </div>
      ) : (
        <div className="h-[48px] px-6 flex items-center justify-center flex-shrink-0 z-10 pointer-events-auto">
          <a
            href="https://getgolive.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-[var(--grey)] hover:underline"
          >
            Powered by GetGoLive.io
          </a>
        </div>
      )}

      {isWelcome && (
        <style>{`
          .screen1-close-btn:hover {
            background-color: rgba(255, 255, 255, 0.08) !important;
            border-color: rgba(255, 255, 255, 0.4) !important;
          }
          .screen1-footer-link {
            transition: color 0.2s ease, opacity 0.2s ease;
          }
          .screen1-footer-link:hover {
            color: #FFFFFF !important;
            opacity: 1 !important;
          }
        `}</style>
      )}
    </div>
  );
};
