import React from "react";

export interface OutlineNumProps {
  num: string | number;
  active?: boolean;
  className?: string;
}

export const OutlineNum: React.FC<OutlineNumProps> = ({
  num,
  active = false,
  className = "",
}) => {
  const displayNum = typeof num === "number" ? String(num).padStart(2, "0") : num;

  return (
    <span
      className={`font-semibold tabular-nums transition-colors duration-300 select-none ${className}`}
      style={{
        fontSize: "var(--fs-num)",
        color: "var(--blue, #1E3A8A)",
      }}
    >
      {displayNum}
    </span>
  );
};
