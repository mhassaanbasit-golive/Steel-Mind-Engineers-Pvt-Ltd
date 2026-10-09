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
      {/* 40px x 1.5px brand gradient line top */}
      <div
        style={{ backgroundImage: "var(--gradient-brand-horizontal)" }}
        className="w-[40px] h-[1.5px] mb-4"
        data-line=""
      />
      <span
        ref={numberRef}
        className="text-[44px] lg:text-[56px] font-bold leading-none text-[var(--ink)] tracking-tight mb-2"
      >
        0{suffix}
      </span>
      <span className="text-[11px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
        {label}
      </span>
    </div>
  );
};
