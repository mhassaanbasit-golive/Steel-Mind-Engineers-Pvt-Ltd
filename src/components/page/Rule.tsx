import React, { useRef, useEffect } from "react";
import { Reveal } from "../../lib/motion.ts";

export interface RuleProps {
  className?: string;
  color?: string;
}

export const Rule: React.FC<RuleProps> = ({ className = "", color = "var(--rule, rgba(15, 23, 42, 0.12))" }) => {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lineRef.current) {
      Reveal.Line(lineRef.current);
    }
  }, []);

  return (
    <div
      ref={lineRef}
      className={`w-full h-[1px] origin-left ${className}`}
      style={{ backgroundColor: color }}
    />
  );
};
