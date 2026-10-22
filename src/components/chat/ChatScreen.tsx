import React, { useState, useEffect, useRef, useCallback } from "react";
import { streamChat, getChatStore } from "../../steelmind-chat/client.ts";
import { sendLead } from "../../steelmind-chat/lead.ts";
import { safeStorage } from "../../steelmind-chat/storage.ts";

export interface ActionCard {
  label: string;
  href: string;
  type?: string;
}

export interface StepItem {
  name: string;
  state: "running" | "done";
}

export interface Msg {
  role: "bot" | "user";
  text: string;
  ts?: number;
  actions?: ActionCard[];
}

export interface ChatScreenProps {
  leadName: string;
  messages: Msg[];
  onMessagesChange: (msgs: Msg[]) => void;
  muted: boolean;
  onCloseOverlay: () => void;
}

const DEFAULT_PILLS = [
  "What is a PEB?",
  "Schedule a factory tour",
  "Request a quote",
  "See your projects",
  "Call an engineer",
];

function isValidActionHref(href: string): boolean {
  if (!href || typeof href !== "string") return false;
  const h = href.trim();
  if (h.startsWith("tel:") || h.startsWith("mailto:")) return true;
  if (h.includes("wa.me/")) return true;
  if (h.includes("google.com/maps") || h.includes("maps.google.com")) return true;
  if (h.includes("drive.google.com")) return true;
  if (h.startsWith("/") || h.startsWith("#")) return true;
  try {
    const url = new URL(h, window.location.origin);
    if (url.origin === window.location.origin) return true;
  } catch {}
  return false;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  leadName,
  messages,
  onMessagesChange,
  onCloseOverlay,
}) => {
  const [inputVal, setInputVal] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [steps, setSteps] = useState<StepItem[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_PILLS);
  const [_memory, setMemory] = useState<string>("");
  const [_needsHuman, setNeedsHuman] = useState<boolean>(false);
  const [_hotLead, setHotLead] = useState<boolean>(false);

  // Lead sending state tracking
  const [_leadSent, setLeadSent] = useState<string | null>(null);
  const lastSentRef = useRef<{ [reason: string]: number }>({});
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTimeRef = useRef<number>(Date.now());
  const needsHumanRef = useRef(false);

  const [hasSentUserMsg, setHasSentUserMsg] = useState(
    messages.some((m) => m.role === "user")
  );

  // Speech Recognition State
  const [hasSpeechRec, setHasSpeechRec] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isInterim, setIsInterim] = useState(false);
  const [privacyNote, setPrivacyNote] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const hasInitedFirstMsg = useRef(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const isStreamingRef = useRef(false);
  const userAbortedRef = useRef(false);
  const messagesRef = useRef<Msg[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Lead sender helper
  const triggerSendLead = useCallback(
    (reason: "close" | "idle" | "leave" | "hot", extraState?: any) => {
      const currentMessages = messagesRef.current;
      if (!currentMessages || currentMessages.length === 0) return;

      const count = currentMessages.length;
      // Prevent sending the exact same reason twice for the same message count
      if (lastSentRef.current[reason] === count) {
        return;
      }
      lastSentRef.current[reason] = count;
      setLeadSent(`${reason}:${count}`);

      const store = getChatStore();
      sendLead(reason, {
        sessionId: store.sessionId,
        visitor: store.visitor,
        startedAt: sessionStartTimeRef.current,
        rating: extraState?.rating || "",
        comment: extraState?.comment || "",
        needsHuman: needsHumanRef.current,
        companyWebsite: safeStorage.get("sm_honeypot") || "",
        messages: currentMessages,
      });
    },
    []
  );

  // Idle timer: 120,000 ms (2 minutes)
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (messagesRef.current.length > 0) {
        triggerSendLead("idle");
      }
    }, 120000);
  }, [triggerSendLead]);

  // Leave trigger: visibilitychange and pagehide
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "hidden" &&
        messagesRef.current.length > 0
      ) {
        triggerSendLead("leave");
      }
    };

    const handlePageHide = () => {
      if (messagesRef.current.length > 0) {
        triggerSendLead("leave");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [triggerSendLead]);

  // Feature Detection for SpeechRecognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasRec = Boolean(
        (window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition
      );
      setHasSpeechRec(hasRec);
    }
  }, []);

  const getLastUserMessage = useCallback(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        return messages[i].text;
      }
    }
    return "";
  }, [messages]);

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    setIsInterim(false);
  }, []);

  const resetSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = setTimeout(() => {
      stopListening();
    }, 12000);
  }, [stopListening]);

  const startListening = useCallback(() => {
    setMicError(null);

    try {
      const alreadyShown = sessionStorage.getItem("sm_mic_privacy_shown");
      if (!alreadyShown) {
        sessionStorage.setItem("sm_mic_privacy_shown", "true");
        setPrivacyNote(
          "Your browser converts your voice to text. Steel Mind Engineers receives only the text."
        );
        setTimeout(() => {
          setPrivacyNote(null);
        }, 4000);
      }
    } catch {}

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      const lastUserMsg = getLastUserMessage();
      const isUrdu = /[\u0600-\u06FF]/.test(lastUserMsg);
      recognition.lang = isUrdu ? "ur-PK" : "en-PK";

      recognition.onstart = () => {
        setIsListening(true);
        resetSilenceTimer();
      };

      recognition.onresult = (event: any) => {
        resetSilenceTimer();
        let interim = "";
        let finalResult = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalResult += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setIsInterim(true);
          setInputVal(interim);
        }

        if (finalResult) {
          setIsInterim(false);
          setInputVal(finalResult);
        }
      };

      recognition.onerror = (event: any) => {
        if (
          event.error === "not-allowed" ||
          event.error === "permission-denied" ||
          event.error === "service-not-allowed"
        ) {
          setMicError(
            "Microphone access is blocked. You can type your message instead."
          );
          setTimeout(() => setMicError(null), 5000);
        }
        stopListening();
      };

      recognition.onend = () => {
        stopListening();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      stopListening();
    }
  }, [getLastUserMessage, resetSilenceTimer, stopListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  // Auto-scroll on new message or steps update
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, steps, isStreaming]);

  // Initial welcome message from bot
  useEffect(() => {
    if (messages.length === 0 && !hasInitedFirstMsg.current) {
      hasInitedFirstMsg.current = true;
      const firstName = leadName.split(" ")[0] || "there";
      const initialBotMsg: Msg = {
        role: "bot",
        text: `Welcome, ${firstName}. Tell us what you plan to build and where.`,
        ts: Date.now(),
      };
      messagesRef.current = [initialBotMsg];
      onMessagesChange([initialBotMsg]);
    }
  }, [leadName, messages.length, onMessagesChange]);

  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      userAbortedRef.current = true;
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    isStreamingRef.current = false;
    setSteps([]);
  }, []);

  const handleSendMessage = useCallback(
    async (textToSend?: string) => {
      const rawText = textToSend !== undefined ? textToSend : inputVal;
      const text = rawText.trim();
      if (!text || isStreamingRef.current) return;

      if (isListening) {
        stopListening();
      }

      // 1. Immediately add user message to messages array
      const userMsg: Msg = { role: "user", text, ts: Date.now() };
      const nextMessages = [...messagesRef.current, userMsg];
      messagesRef.current = nextMessages;
      onMessagesChange(nextMessages);
      setInputVal("");
      setIsInterim(false);
      setHasSentUserMsg(true);

      // Start / reset idle timer (2 minutes)
      resetIdleTimer();

      // 2. Show live steps card with first step "Understanding your question"
      setSteps([{ name: "Understanding your question", state: "running" }]);
      setIsStreaming(true);
      isStreamingRef.current = true;
      userAbortedRef.current = false;

      // 3. Create AbortController and save to ref
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const handleEvent = (name: string, data: any) => {
        if (userAbortedRef.current) return;

        switch (name) {
          case "status": {
            const stepName =
              data?.step || data?.name || data?.text || "Understanding your question";
            setSteps((prev) => {
              const existing = prev.find((s) => s.name === stepName);
              if (existing) {
                return prev.map((s) =>
                  s.name === stepName ? { ...s, state: "running" } : s
                );
              }
              return [...prev, { name: stepName, state: "running" }];
            });
            break;
          }

          case "status_done": {
            const stepName = data?.step || data?.name || data?.text;
            if (stepName) {
              setSteps((prev) =>
                prev.map((s) =>
                  s.name === stepName ? { ...s, state: "done" } : s
                )
              );
            }
            break;
          }

          case "token": {
            // Append text to current assistant message bubble; hide steps card
            setSteps([]);
            resetIdleTimer();
            const tokenText = data?.t || "";
            const current = [...messagesRef.current];
            const last = current[current.length - 1];
            if (last && last.role === "bot" && isStreamingRef.current) {
              current[current.length - 1] = {
                ...last,
                text: last.text + tokenText,
              };
            } else {
              current.push({ role: "bot", text: tokenText, ts: Date.now() });
            }
            messagesRef.current = current;
            onMessagesChange(current);
            break;
          }

          case "action": {
            if (data?.href && isValidActionHref(data.href)) {
              const actionCard: ActionCard = {
                label: data.label || data.title || "View link",
                href: data.href,
                type: data.type,
              };
              const current = [...messagesRef.current];
              const last = current[current.length - 1];
              if (last && last.role === "bot") {
                const currentActions = last.actions
                  ? [...last.actions, actionCard]
                  : [actionCard];
                current[current.length - 1] = {
                  ...last,
                  actions: currentActions,
                };
                messagesRef.current = current;
                onMessagesChange(current);
              }
            }
            break;
          }

          case "suggestions": {
            const chips = data?.chips || data?.suggestions;
            if (Array.isArray(chips)) {
              setSuggestions(chips);
            }
            break;
          }

          case "meta": {
            if (data?.memory) setMemory(data.memory);
            if (data?.needsHuman !== undefined) {
              setNeedsHuman(data.needsHuman);
              needsHumanRef.current = Boolean(data.needsHuman);
            }
            if (data?.hotLead !== undefined) {
              setHotLead(data.hotLead);
              // "hot" Trigger (Immediate): if data.hotLead === true, call sendLead("hot")
              if (data.hotLead === true) {
                triggerSendLead("hot");
              }
            }
            break;
          }

          case "error": {
            const errorMsg =
              data?.code === "busy"
                ? "Our assistants are currently busy assisting other clients. Please call +92 300 4253966 or leave a message."
                : "Sorry, that took too long. Please call +92 300 4253966 or submit a quote request.";
            const current = [
              ...messagesRef.current,
              { role: "bot" as const, text: errorMsg, ts: Date.now() },
            ];
            messagesRef.current = current;
            onMessagesChange(current);
            setIsStreaming(false);
            isStreamingRef.current = false;
            setSteps([]);
            break;
          }

          case "done": {
            setIsStreaming(false);
            isStreamingRef.current = false;
            setSteps([]);
            break;
          }
        }
      };

      try {
        await streamChat({
          messages: nextMessages,
          signal: controller.signal,
          onEvent: handleEvent,
        });
      } catch (err: any) {
        if (userAbortedRef.current) {
          // Stopped cleanly by user: keep partial text, no error
          return;
        }

        const fallbackMsg =
          err?.message === "busy"
            ? "Our assistants are currently busy assisting other clients. Please call +92 300 4253966 or leave a message."
            : "Sorry, that took too long. Please call +92 300 4253966 or submit a quote request.";

        const current = [
          ...messagesRef.current,
          { role: "bot" as const, text: fallbackMsg, ts: Date.now() },
        ];
        messagesRef.current = current;
        onMessagesChange(current);
      } finally {
        setIsStreaming(false);
        isStreamingRef.current = false;
        setSteps([]);
        abortControllerRef.current = null;
        userAbortedRef.current = false;
      }
    },
    [inputVal, isListening, onMessagesChange, resetIdleTimer, stopListening, triggerSendLead]
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const renderMessageContent = (text: string) => {
    let formatted: React.ReactNode = text;
    if (text.includes("+92 300 4253966") || text.includes("+923004253966")) {
      formatted = (
        <span>
          {text.split("+92 300 4253966")[0]}
          <a href="tel:+923004253966" className="underline font-semibold">
            +92 300 4253966
          </a>
          {text.split("+92 300 4253966")[1]}
        </span>
      );
    } else if (text.toLowerCase().includes("quote form")) {
      formatted = (
        <span>
          {text}{" "}
          <button
            type="button"
            onClick={() => {
              onCloseOverlay();
              window.location.href = "/contact-us/#quote";
            }}
            className="underline font-semibold cursor-pointer"
          >
            Open quote form
          </button>
        </span>
      );
    }

    return formatted;
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Messages List Area */}
      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        className="flex-1 overflow-y-auto pt-4 pb-[100px] px-4 sm:px-8 space-y-3 md:space-y-4 max-w-[760px] mx-auto w-full select-text"
        data-lenis-prevent=""
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex w-full ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`leading-[1.5] transition-all animate-[fadeIn_0.3s_ease-out] ${
                msg.role === "user"
                  ? "max-w-[75%] px-[18px] py-[14px] text-[15px] font-normal text-white rounded-[18px_18px_4px_18px] text-right"
                  : "max-w-[85%] md:max-w-[75%] px-[16px] py-[12px] md:px-5 md:py-3.5 text-[14px] text-[#0A0A0A] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[var(--line)] rounded-[18px_18px_18px_4px] text-left"
              }`}
              style={{
                backgroundColor: msg.role === "user" ? "#1A3A8A" : "#FFFFFF",
                color: msg.role === "user" ? "#FFFFFF" : "#0A0A0A",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {renderMessageContent(msg.text)}

              {/* Blinking Caret on streaming bot message */}
              {isStreaming && i === messages.length - 1 && msg.role === "bot" && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-[#1A3A8A] align-middle animate-pulse" />
              )}

              {/* Action Cards */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-[var(--line)] flex flex-wrap gap-2">
                  {msg.actions.map((act, actIdx) => (
                    <a
                      key={actIdx}
                      href={act.href}
                      target={act.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-medium bg-[#1A3A8A] text-white hover:bg-[#162D6E] transition-colors"
                    >
                      <span>{act.label}</span>
                      <svg
                        className="w-3.5 h-3.5 ml-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Live Steps Card */}
        {steps.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[var(--line)] rounded-[18px_18px_18px_4px] px-5 py-3.5 space-y-2 text-[13px] text-[var(--ink)]">
              {steps.map((st, sIdx) => (
                <div key={sIdx} className="flex items-center space-x-2">
                  {st.state === "running" ? (
                    <span className="w-2 h-2 rounded-full bg-[#1A3A8A] animate-ping" />
                  ) : (
                    <svg
                      className="w-3.5 h-3.5 text-green-600 stroke-current"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  <span
                    className={
                      st.state === "done" ? "text-gray-500" : "font-medium"
                    }
                  >
                    {st.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Container (Docked Suggestions + Input Bar) */}
      <div className="fixed bottom-[48px] inset-x-0 z-20 pointer-events-none">
        {/* Rotating Starter Questions (before first user message) */}
        {!hasSentUserMsg && (
          <div className="pointer-events-auto max-w-[760px] mx-auto px-4 sm:px-8 mb-2 overflow-hidden select-none">
            <div className="relative w-full overflow-hidden py-0.5">
              <div className="sm-rotating-chips-track">
                {[...DEFAULT_PILLS, ...DEFAULT_PILLS].map((pill, idx) => (
                  <button
                    key={`${pill}-${idx}`}
                    type="button"
                    disabled={isStreaming}
                    onClick={() => handleSendMessage(pill)}
                    className="px-[15px] py-[7.5px] text-[12.5px] font-medium bg-white/95 border border-[var(--line)] rounded-full text-[var(--ink)] hover:border-[#1A3A8A] hover:text-[#1A3A8A] transition-colors whitespace-nowrap cursor-pointer shadow-sm flex-shrink-0"
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Assistant Suggestions (during active conversation) */}
        {hasSentUserMsg && suggestions.length > 0 && (
          <div className="pointer-events-auto max-w-[760px] mx-auto px-4 sm:px-8 mb-2 flex items-center space-x-[6px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1">
            {suggestions.map((pill) => (
              <button
                key={pill}
                type="button"
                disabled={isStreaming}
                onClick={() => handleSendMessage(pill)}
                className="px-[14px] py-[7px] text-[12px] font-medium bg-white/95 border border-[var(--line)] rounded-full text-[var(--ink)] hover:border-[#1A3A8A] transition-colors whitespace-nowrap cursor-pointer shadow-sm flex-shrink-0"
              >
                {pill}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="pointer-events-auto bg-white border-t border-[var(--line)] px-4 sm:px-8 py-3">
        {(privacyNote || micError) && (
          <div
            className="max-w-[760px] mx-auto mb-2 text-center text-[12px] text-[#4B5563]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {micError || privacyNote}
          </div>
        )}

        <form
          onSubmit={handleFormSubmit}
          className="max-w-[760px] mx-auto flex items-center space-x-2 md:space-x-3"
        >
          <input
            type="text"
            maxLength={500}
            disabled={isStreaming}
            value={inputVal}
            onChange={(e) => {
              setIsInterim(false);
              setInputVal(e.target.value);
            }}
            placeholder={isListening ? "Listening..." : "Type your message"}
            style={isInterim ? { opacity: 0.6 } : undefined}
            className="flex-1 bg-white border border-[var(--line)] rounded-full px-[16px] py-[12px] h-[46px] md:h-[52px] text-[14px] text-[var(--ink)] focus:outline-none focus:border-[#1A3A8A] transition-colors"
          />

          {/* Microphone Button */}
          {hasSpeechRec && (
            <button
              type="button"
              onClick={toggleListening}
              disabled={isStreaming}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
              className="w-[44px] h-[44px] md:w-[48px] md:h-[48px] rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer transition-colors"
              style={{
                backgroundColor: isListening ? "#1A3A8A" : "#F3F4F6",
                color: isListening ? "#FFFFFF" : "#4B5563",
              }}
            >
              <svg
                className="w-5 h-5 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            </button>
          )}

          {/* Send / Stop Button: Turns into Stop (square) button while streaming */}
          {isStreaming ? (
            <button
              type="button"
              onClick={handleStop}
              aria-label="Stop generation"
              className="send-solid-btn w-[44px] h-[44px] md:w-[48px] md:h-[48px] rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer"
            >
              <span className="w-3.5 h-3.5 bg-white rounded-[2px]" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!inputVal.trim()}
              aria-label="Send message"
              className="send-solid-btn w-[44px] h-[44px] md:w-[48px] md:h-[48px] rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer"
            >
              <svg
                className="w-5 h-5 stroke-current -rotate-90 translate-x-[1px]"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 5 5 12" />
              </svg>
            </button>
          )}
        </form>
      </div>
    </div>

      <style>{`
        .send-solid-btn {
          background-color: #1A3A8A;
          color: #FFFFFF;
          transition: background-color 0.25s ease-out, transform 0.25s ease-out;
        }

        .send-solid-btn:not(:disabled):hover {
          background-color: #1E4A9C;
        }

        .send-solid-btn:not(:disabled):active {
          transform: scale(0.96);
        }

        .send-solid-btn:disabled {
          background-color: #E5E5E5;
          color: #B8B8B8;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};
