import React, { useState, useRef, useEffect } from "react";
import { gsap } from "../../lib/gsap.ts";

export interface AccordionItemData {
  q: string;
  a: string;
}

export interface AccordionProps {
  items: AccordionItemData[];
  className?: string;
  defaultOpenIndex?: number | null;
  size?: "normal" | "large";
}

function toSentenceCase(text: string): string {
  if (!text) return "";
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();
  let result = lower.charAt(0).toUpperCase() + lower.slice(1);
  result = result
    .replace(/\bpeb\b/gi, "PEB")
    .replace(/\bsme\b/gi, "SME")
    .replace(/\bpakistan\b/gi, "Pakistan")
    .replace(/\blahore\b/gi, "Lahore");
  return result;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  className = "",
  defaultOpenIndex = null,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    contentRefs.current.forEach((el, index) => {
      if (!el) return;
      if (index === openIndex) {
        gsap.to(el, {
          height: "auto",
          duration: 0.45,
          ease: "power3.out",
        });
      } else {
        gsap.to(el, {
          height: 0,
          duration: 0.35,
          ease: "power3.inOut",
        });
      }
    });
  }, [openIndex]);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div
      className={`w-full divide-y divide-[#E5E5E5] border-y border-[#E5E5E5] ${className}`.trim()}
    >
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const panelId = `accordion-panel-${idx}`;
        const headerId = `accordion-header-${idx}`;
        const sentenceQuestion = toSentenceCase(item.q);

        return (
          <div key={idx} className="group overflow-hidden">
            <button
              id={headerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(idx)}
              className="w-full min-h-[48px] py-5 lg:py-6 flex items-center justify-between text-left cursor-pointer transition-colors group focus-visible:outline-none"
            >
              <span className="text-[14px] lg:text-[16px] font-semibold text-[var(--ink)] leading-snug pr-4 group-hover:text-[var(--blue)] transition-colors normal-case">
                {sentenceQuestion}
              </span>

              {/* Exact Steel Warehouses circular badge icon: + rotates 45° to × with solid blue fill */}
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full border border-[var(--blue)] flex items-center justify-center font-bold text-[18px] transition-all duration-300 leading-none select-none ${
                  isOpen
                    ? "rotate-45 bg-[var(--blue)] text-white"
                    : "bg-white text-[var(--blue)]"
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              aria-hidden={!isOpen}
              ref={(el) => {
                contentRefs.current[idx] = el;
              }}
              className="h-0 overflow-hidden"
            >
              <div className="pt-1 pb-6 text-[13px] lg:text-[15px] leading-[1.65] text-[#0A0A0A] max-w-[680px]">
                {item.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
