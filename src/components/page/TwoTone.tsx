import React from "react";

export interface TwoToneProps {
  text: string;
  className?: string;
  light?: boolean;
}

export const TwoTone: React.FC<TwoToneProps> = ({ text, className = "", light = false }) => {
  if (!text) return null;
  const words = text.trim().split(/\s+/);
  if (words.length <= 2) {
    return <span className={className}>{text}</span>;
  }
  const cutoff = Math.ceil(words.length * 0.55);
  const part1 = words.slice(0, cutoff).join(" ");
  const part2 = words.slice(cutoff).join(" ");

  const color1 = light ? "#FFFFFF" : "var(--ink)";
  const color2 = light ? "rgba(255, 255, 255, 0.55)" : "#9AA3B2";

  return (
    <span className={className}>
      <span style={{ color: color1 }}>{part1} </span>
      <span style={{ color: color2 }}>{part2}</span>
    </span>
  );
};
