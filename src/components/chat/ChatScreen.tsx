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
    // If text contains phone number: make tel: link
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
          {text}
          {" "}
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
        className="flex-1 overflow-y-auto pt-20 pb-36 px-4 sm:px-8 space-y-4 max-w-[760px] mx-auto w-full select-text"
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
              className={`max-w-[75%] px-5 py-3.5 text-[15px] leading-[1.55] transition-all animate-[fadeIn_0.3s_ease-out] ${
                msg.role === "user"
                  ? "text-white rounded-[20px]"
                  : "bg-white text-[var(--ink)] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[20px]"
              }`}
              style={
                msg.role === "user"
                  ? {
                      background: "var(--blue-btn-gradient)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.22), 0 2px 8px rgba(26,43,104,0.22)",
                    }
                  : undefined
              }
            >
              {renderMessageContent(msg.text)}
            </div>
          </div>
        ))}

        {/* Typing Dots */}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[20px] px-5 py-4 flex items-center space-x-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-[var(--ink)] rounded-full animate-pulse"
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

      {/* Quick Pills (Visible until user sends first message) */}
      {!hasSentUserMsg && (
        <div className="absolute bottom-[92px] inset-x-0 px-4 sm:px-8 max-w-[760px] mx-auto flex items-center space-x-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-2 pointer-events-auto">
          {QUICK_PILLS.map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => sendMessage(pill)}
              className="px-4 py-2 bg-white/90 border border-[var(--line)] rounded-full text-[13px] font-medium text-[var(--ink)] hover:border-[var(--blue)] transition-colors whitespace-nowrap cursor-pointer shadow-sm"
            >
              {pill}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar Fixed Bottom */}
      <div className="absolute bottom-0 inset-x-0 bg-white border-t border-[var(--line)] px-4 sm:px-8 py-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
        <form
          onSubmit={handleFormSubmit}
          className="max-w-[760px] mx-auto flex items-center space-x-3"
        >
          <input
            type="text"
            maxLength={500}
            disabled={typing}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your message"
            className="flex-1 bg-white border border-[var(--line)] rounded-full px-5 py-3 text-[16px] focus:outline-none focus:border-[var(--blue)] transition-colors"
          />

          <button
            type="submit"
            disabled={!inputVal.trim() || typing}
            aria-label="Send message"
            className="w-10 h-10 rounded-full bg-[var(--ink)] text-white flex items-center justify-center hover:bg-blue-glossy hover:brightness-110 transition-all disabled:opacity-30 cursor-pointer flex-shrink-0"
          >
            <svg className="w-5 h-5 stroke-current -rotate-90 translate-x-[1px]" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 5 5 12" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
