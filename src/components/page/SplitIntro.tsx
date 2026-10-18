import React, { useRef, useEffect } from "react";
import { Reveal } from "../../lib/motion.ts";

export interface SplitIntroProps {
  title: string;
  lead?: string;
  text?: string | string[];
  className?: string;
}

export const SplitIntro: React.FC<SplitIntroProps> = ({
  title,
  lead,
  text,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const heading = containerRef.current.querySelector("h2");
      const paragraphs = Array.from(containerRef.current.querySelectorAll("p"));
      if (heading) Reveal.Fade(heading, { y: 20 });
      if (paragraphs.length > 0) Reveal.Fade(paragraphs, { y: 24, stagger: 0.08 });
    }
  }, []);

  const textArray = Array.isArray(text) ? text : text ? [text] : [];

  return (
    <div
      ref={containerRef}
      className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-[96px] items-start ${className}`}
    >
      <div className="lg:col-span-5">
        <h2
          className="font-bold text-[var(--ink)] leading-[1.15] tracking-[-0.02em]"
          style={{ fontSize: "var(--fs-h2)" }}
        >
          {title}
        </h2>
      </div>
      <div className="lg:col-span-7 space-y-4 max-w-[640px]">
        {lead && (
          <p
            className="font-medium text-[var(--ink)] leading-[1.6]"
            style={{ fontSize: "var(--fs-lead)" }}
          >
            {lead}
          </p>
        )}
        {textArray.map((p, idx) => (
          <p
            key={idx}
            className="text-[var(--grey-strong)] leading-[1.65]"
            style={{ fontSize: "var(--fs-body)" }}
          >
            {p}
          </p>
        ))}
      </div>
    </div>
  );
};
