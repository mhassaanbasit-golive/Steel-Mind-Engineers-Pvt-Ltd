import React, { useState, useEffect, useRef } from "react";
import { playSwoosh, playDing } from "../../lib/sound.ts";

export interface Msg {
  role: "bot" | "user";
  text: string;
}

export interface ChatScreenProps {
  leadName: string;
  messages: Msg[];
  onMessagesChange: (msgs: Msg[]) => void;
  muted: boolean;
  onCloseOverlay: () => void;
}

const QUICK_PILLS = [
  "What is a PEB?",
  "Schedule a factory tour",
  "Request a quote",
];

export const ChatScreen: React.FC<ChatScreenProps> = ({
  leadName,
  messages,
  onMessagesChange,
  muted,
  onCloseOverlay,
}) => {
  const [inputVal, setInputVal] = useState("");
  const [typing, setTyping] = useState(false);
  const [hasSentUserMsg, setHasSentUserMsg] = useState(
    messages.some((m) => m.role === "user")
  );

  const listRef = useRef<HTMLDivElement>(null);
  const hasInitedFirstMsg = useRef(false);

  // Auto-scroll on new message
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, typing]);

  // Initial welcome message from bot
  useEffect(() => {
    if (messages.length === 0 && !hasInitedFirstMsg.current) {
      hasInitedFirstMsg.current = true;
      setTyping(true);

      const timer = setTimeout(() => {
        setTyping(false);
        const firstName = leadName.split(" ")[0] || "there";
        const initialBotMsg: Msg = {
          role: "bot",
          text: `Welcome, ${firstName}. Tell us what you plan to build and where.`,
        };
        onMessagesChange([initialBotMsg]);
        playDing(muted);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [leadName, messages.length, muted, onMessagesChange]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || typing) return;

    const userMsg: Msg = { role: "user", text: text.trim() };
    const updatedMsgs = [...messages, userMsg];
    onMessagesChange(updatedMsgs);
    setInputVal("");
    setHasSentUserMsg(true);
    playSwoosh(muted);
    setTyping(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const history = updatedMsgs.slice(-12).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          history,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const json = await res.json();

      let reply = json.reply;
      if (!reply || !json.ok) {
        reply = "I'm having trouble connecting. Please call +92 300 4253966.";
      }

      onMessagesChange([...updatedMsgs, { role: "bot", text: reply }]);
      playDing(muted);
    } catch {
      onMessagesChange([
        ...updatedMsgs,
        {
          role: "bot",
          text: "I'm having trouble connecting. Please call +92 300 4253966.",
        },
      ]);
      playDing(muted);
    } finally {
      setTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputVal);
  };

  // Render text with clickable phone and quote links
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
      {/* Messages List Area (flex: 1, overflow-y: auto, padding-bottom: 100px) */}
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
            </div>
          </div>
        ))}

        {/* Typing Dots */}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[var(--line)] rounded-[18px_18px_18px_4px] px-5 py-4 flex items-center space-x-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-[#1A3A8A] rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 150}ms`,
                    animationDuration: "1.2s",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Pills (Horizontal scroll, no wrap, padding: 7px 14px, font-size: 12px, gap: 6px) */}
      {!hasSentUserMsg && (
        <div className="fixed bottom-[124px] md:bottom-[132px] inset-x-0 px-4 sm:px-8 max-w-[760px] mx-auto flex items-center space-x-[6px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1 pointer-events-auto z-20">
          {QUICK_PILLS.map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => sendMessage(pill)}
              className="px-[14px] py-[7px] text-[12px] font-medium bg-white/95 border border-[var(--line)] rounded-full text-[var(--ink)] hover:border-[#1A3A8A] transition-colors whitespace-nowrap cursor-pointer shadow-sm flex-shrink-0"
            >
              {pill}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar Fixed Bottom at 48px */}
      <div className="fixed bottom-[48px] inset-x-0 bg-white border-t border-[var(--line)] px-4 sm:px-8 py-3 z-20">
        <form
          onSubmit={handleFormSubmit}
          className="max-w-[760px] mx-auto flex items-center space-x-2 md:space-x-3"
        >
          <input
            type="text"
            maxLength={500}
            disabled={typing}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your message"
            className="flex-1 bg-white border border-[var(--line)] rounded-full px-[16px] py-[12px] h-[46px] md:h-[52px] text-[14px] text-[var(--ink)] focus:outline-none focus:border-[#1A3A8A] transition-colors"
          />

          {/* Send Button — Solid Brand Blue #1A3A8A */}
          <button
            type="submit"
            disabled={!inputVal.trim() || typing}
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
        </form>
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
