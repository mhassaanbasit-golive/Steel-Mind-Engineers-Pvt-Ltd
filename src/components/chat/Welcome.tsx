import React from "react";
import { motion } from "framer-motion";
import { playPop } from "../../lib/sound.ts";

export interface WelcomeProps {
  onStart: () => void;
  muted: boolean;
}

const text = "Ask Me Anything!";
const chars = text.split("");

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.045, delayChildren: 0.15 },
  },
};

const charVariant = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] as const },
  },
};

export const Welcome: React.FC<WelcomeProps> = ({ onStart, muted }) => {
  const handleClick = () => {
    playPop(muted);
    onStart();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center px-[20px] py-[24px] select-none">
      {/* 4. TITLE — "Ask Me Anything!" (Character-by-Character Typewriter) */}
      <motion.h1
        variants={container}
        initial="hidden"
        animate="visible"
        className="welcome-title text-[32px] md:text-[48px] max-w-[88%] md:max-w-none mx-auto leading-none text-center"
        style={{
          color: "#FFFFFF",
          fontFamily: "Inter, sans-serif",
          fontWeight: 900,
          letterSpacing: "-0.05em",
          lineHeight: 1.0,
          textAlign: "center",
        }}
      >
        {chars.map((c, i) => (
          <motion.span
            key={i}
            variants={charVariant}
            style={{ display: "inline-block" }}
          >
            {c === " " ? "\u00A0" : c}
          </motion.span>
        ))}
        {/* 5. CURSOR — WHITE BLINKING BAR */}
        <span
          aria-hidden="true"
          className="welcome-cursor inline-block rounded-[1px] ml-[6px] align-middle bg-[#FFFFFF] w-[2px] md:w-[3px] h-[36px] md:h-[52px]"
        />
      </motion.h1>

      {/* 6. BUTTON — "Start Chat" (White Background, Blue Text) */}
      <button
        type="button"
        onClick={handleClick}
        className="welcome-chat-btn"
        style={{
          backgroundColor: "#FFFFFF",
          color: "#1A3A8A",
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: "15px",
          letterSpacing: "0.01em",
          textTransform: "none",
          border: "none",
          borderRadius: "999px",
        }}
      >
        <span>Start Chat</span>
        <span className="welcome-arrow-badge" aria-hidden="true">
          <svg
            className="welcome-arrow-svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </button>

      <style>{`
        .welcome-title {
          font-size: 32px;
        }

        @media (min-width: 768px) {
          .welcome-title {
            font-size: 48px;
          }
        }

        .welcome-cursor {
          opacity: 0;
          animation: cursorLifecycle 3.6s cubic-bezier(0.23, 1, 0.32, 1) 1.13s forwards;
        }

        @keyframes cursorLifecycle {
          0% {
            opacity: 0;
          }
          1.5% {
            opacity: 1;
          }
          6.9% {
            opacity: 0;
          }
          13.9% {
            opacity: 1;
          }
          20.8% {
            opacity: 0;
          }
          27.8% {
            opacity: 1;
          }
          34.7% {
            opacity: 0;
          }
          41.7% {
            opacity: 1;
          }
          83.3% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .welcome-chat-btn {
          height: 52px;
          padding: 10px 10px 10px 20px;
          width: auto;
          box-shadow: 0 0 40px rgba(255, 255, 255, 0.10);
          margin-top: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          outline: none;
          transition: transform 0.25s ease-out, box-shadow 0.25s ease-out;
        }

        @media (min-width: 768px) {
          .welcome-chat-btn {
            height: 56px;
            padding: 10px 10px 10px 24px;
          }
        }

        .welcome-chat-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 60px rgba(255, 255, 255, 0.18);
        }

        .welcome-chat-btn:active {
          transform: scale(0.97);
        }

        .welcome-arrow-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background-color: #1A3A8A;
          width: 24px;
          height: 24px;
          margin-left: 8px;
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .welcome-arrow-badge {
            width: 28px;
            height: 28px;
          }
        }

        .welcome-arrow-svg {
          width: 14px;
          height: 14px;
        }

        @media (min-width: 768px) {
          .welcome-arrow-svg {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>
    </div>
  );
};
