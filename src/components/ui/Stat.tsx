import React from "react";
import { useCountUp } from "../../hooks/useCountUp.ts";

export interface StatProps {
  value: number;
  suffix?: string;
  label: string;
  format?: boolean;
  className?: string;
}

export const Stat: React.FC<StatProps> = ({
  value,
  suffix = "",
  label,
  format = true,
  className = "",
}) => {
  const numberRef = useCountUp(value, { suffix, format });

  return (
    <div className={`flex flex-col ${className}`} data-reveal="">
      {/* 40px x 1.5px Royal Blue line top */}
      <div
        style={{ backgroundColor: "var(--blue)" }}
        className="w-[40px] h-[1.5px] mb-3 bg-[var(--blue)]"
        data-line=""
      />
      <span
        ref={numberRef}
        className="text-[32px] lg:text-[48px] font-bold leading-none text-[var(--blue)] tracking-tight mb-2 font-sans"
      >
        0{suffix}
      </span>
      <span className="text-[9px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
        {label}
      </span>
    </div>
  );
};
