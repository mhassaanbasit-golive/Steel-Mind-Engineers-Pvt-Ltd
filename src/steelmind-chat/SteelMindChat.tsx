import React from "react";
import "./styles.css";

export interface SteelMindChatProps {
  className?: string;
}

export const SteelMindChat: React.FC<SteelMindChatProps> = () => {
  return (
    <div className="sm-chat-root">
      <button
        type="button"
        className="sm-chat-launcher"
        aria-label="Open chat"
      >
        <svg
          className="sm-chat-launcher-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </div>
  );
};

export default SteelMindChat;
