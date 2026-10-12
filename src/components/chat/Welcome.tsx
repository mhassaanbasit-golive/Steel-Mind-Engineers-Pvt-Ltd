import React from "react";
import { playPop } from "../../lib/sound.ts";

export interface WelcomeProps {
  onStart: () => void;
  muted: boolean;
}

export const Welcome: React.FC<WelcomeProps> = ({ onStart, muted }) => {
  const handleClick = () => {
    playPop(muted);
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-[320px] mx-auto animate-[fadeInUp_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      {/* Thin Chat Bubble Icon 80x80, stroke 1.5px */}
      <div className="w-20 h-20 mb-6 flex items-center justify-center text-[var(--ink)] opacity-80 animate-[scaleIn_0.5s_cubic-bezier(0.16,1,0.3,1)_0.1s_both]">
        <svg
          className="w-20 h-20 stroke-current"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>

      <h2 className="text-[16px] lg:text-[24px] font-semibold text-[var(--ink)] tracking-tight">
        Welcome!
      </h2>

      <p className="text-[12px] lg:text-[13px] text-[var(--grey)] mt-3">
        Text us
      </p>

      {/* Solid Royal Blue pill button (border-radius: 999px) */}
      <button
        type="button"
        onClick={handleClick}
        className="w-full mt-10 py-3.5 px-6 rounded-full bg-[var(--blue)] text-white font-semibold text-[10px] uppercase tracking-[0.06em] hover:bg-[var(--blue-dark)] transition-all duration-300 cursor-pointer shadow-none"
      >
        START CONVERSATION
      </button>

      <style>{`
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 0.8; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
