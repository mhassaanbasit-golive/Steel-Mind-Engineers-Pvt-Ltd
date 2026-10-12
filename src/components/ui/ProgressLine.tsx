import React from "react";

export interface ProgressLineProps {
  progress?: number; // 0 to 1
  theme?: "light" | "dark";
  className?: string;
}

export const ProgressLine: React.FC<ProgressLineProps> = ({
  progress = 0,
  theme = "light",
  className = "",
}) => {
  const isDark = theme === "dark";

  return (
    <div
      className={`relative w-full h-[1px] ${
        isDark ? "bg-white/20" : "bg-[var(--line)]"
      } ${className}`}
    >
      <div
        className={`absolute top-[-0.5px] left-0 h-[2px] transition-transform duration-75 ${
          isDark ? "bg-white" : "bg-[var(--blue)]"
        }`}
        style={{
          width: "25%",
          transform: `translateX(${progress * 300}%)`,
        }}
      />
    </div>
  );
};
