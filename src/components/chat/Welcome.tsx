import React from "react";
import { playPop } from "../../lib/sound.ts";

export interface WelcomeProps {
  onStart: () => void;
  muted: boolean;
}

interface LineConfig {
  text: string;
  startDelay: number;
  words: { word: string; hasSpace: boolean }[];
}

const LINES: LineConfig[] = [
  {
    text: "Hi!",
    startDelay: 0.2,
    words: [{ word: "Hi!", hasSpace: false }],
  },
  {
    text: "I am Steel Mind Engineers AI Assistant.",
    startDelay: 1.1,
    words: [
      { word: "I", hasSpace: true },
      { word: "am", hasSpace: true },
      { word: "Steel", hasSpace: true },
      { word: "Mind", hasSpace: true },
      { word: "Engineers", hasSpace: true },
      { word: "AI", hasSpace: true },
      { word: "Assistant.", hasSpace: false },
    ],
  },
  {
    text: "How may I help?",
    startDelay: 3.7,
    words: [
      { word: "How", hasSpace: true },
      { word: "may", hasSpace: true },
      { word: "I", hasSpace: true },
      { word: "help?", hasSpace: false },
    ],
  },
];

export const Welcome: React.FC<WelcomeProps> = ({ onStart, muted }) => {
  const handleClick = () => {
    playPop(muted);
    onStart();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center px-[20px] py-[24px] max-w-[420px] mx-auto select-none">
      {/* 1.2 New Typewriter Title — 3 Lines */}
      <div
        className="w-full flex flex-col items-center text-center text-[#0A0A0A] font-bold tracking-[-0.02em]"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
        }}
      >
        {LINES.map((lineItem, lineIdx) => {
          let lineCharOffset = 0;
          const isLine3 = lineIdx === 2;

          return (
            <div
              key={lineIdx}
              className={`text-[26px] md:text-[36px] leading-[1.25] md:leading-[1.3] flex flex-wrap justify-center items-center ${
                lineIdx > 0 ? "mt-[6px]" : ""
              }`}
            >
              {lineItem.words.map((item, wordIdx) => {
                const isLastWordOfLine = wordIdx === lineItem.words.length - 1;

                return (
                  <span
                    key={wordIdx}
                    className="inline-flex items-center whitespace-nowrap"
                  >
                    {Array.from(item.word).map((char, charIdxInWord) => {
                      const charDelay =
                        lineItem.startDelay + lineCharOffset * 0.06;
                      lineCharOffset += 1;

                      return (
                        <span
                          key={`${wordIdx}-${charIdxInWord}`}
                          className="inline-block"
                          style={{
                            animation: `charReveal 0.3s cubic-bezier(0.23, 1, 0.32, 1) ${charDelay}s both`,
                          }}
                        >
                          {char}
                        </span>
                      );
                    })}

                    {/* Blinking Cursor right after '?' in Line 3 */}
                    {isLine3 && isLastWordOfLine && (
                      <span
                        aria-hidden="true"
                        className="inline-block rounded-[1px] ml-[3px] align-middle bg-[#1A3A8A] w-[2px] h-[26px] md:h-[36px]"
                        style={{
                          animation:
                            "cursorLifecycle 8.3s cubic-bezier(0.23, 1, 0.32, 1) forwards",
                        }}
                      />
                    )}

                    {/* Word space */}
                    {item.hasSpace && (
                      <span className="inline-block w-[0.28em]">&nbsp;</span>
                    )}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* 1.3 CTA Button — Solid Blue (NO Glassmorphism) */}
      <button
        type="button"
        onClick={handleClick}
        className="welcome-solid-cta mt-[32px] inline-flex items-center justify-center gap-[6px] px-[20px] md:px-[22px] h-[42px] md:h-[44px] w-auto rounded-full text-white font-[500] text-[13px] uppercase tracking-[0.05em] cursor-pointer"
        style={{
          fontFamily: "'Inter', sans-serif",
          animation:
            "buttonReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) 4.8s both",
        }}
      >
        <span>START CHAT</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0"
          aria-hidden="true"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>

      <style>{`
        @keyframes charReveal {
          0% {
            opacity: 0;
            transform: translateY(6px);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
        }

        @keyframes cursorLifecycle {
          0%, 56.5% {
            opacity: 0;
          }
          56.6% {
            opacity: 1;
          }
          59.6% {
            opacity: 0;
          }
          62.6% {
            opacity: 1;
          }
          65.6% {
            opacity: 0;
          }
          68.6% {
            opacity: 1;
          }
          71.6% {
            opacity: 0;
          }
          74.7% {
            opacity: 1;
          }
          92.7% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes buttonReveal {
          0% {
            opacity: 0;
            transform: translateY(6px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .welcome-solid-cta {
          background-color: #1A3A8A;
          transition: background-color 0.25s ease-out, transform 0.25s ease-out;
        }

        .welcome-solid-cta:hover {
          background-color: #1E4A9C;
          transform: translateY(-1px);
        }

        .welcome-solid-cta:active {
          transform: scale(0.97);
        }
      `}</style>
    </div>
  );
};
