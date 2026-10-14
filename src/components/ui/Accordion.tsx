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

export const Accordion: React.FC<AccordionProps> = ({
  items,
  className = "",
  defaultOpenIndex = null,
  size = "normal",
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    contentRefs.current.forEach((el, index) => {
      if (!el) return;
      if (index === openIndex) {
        gsap.to(el, {
          height: "auto",
          duration: 0.5,
          ease: "power3.out",
        });
      } else {
        gsap.to(el, {
          height: 0,
          duration: 0.5,
          ease: "power3.out",
        });
      }
    });
  }, [openIndex]);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  const isLarge = size === "large";

  return (
    <div
      className={`w-full divide-y divide-[var(--line)] border-y border-[var(--line)] ${className}`}
    >
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const panelId = `accordion-panel-${idx}`;
        const headerId = `accordion-header-${idx}`;

        return (
          <div key={idx} className="group overflow-hidden">
            <button
              id={headerId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(idx)}
              className={`w-full flex items-center justify-between text-left cursor-pointer transition-colors hover:text-[var(--blue)] focus-visible:outline-none ${
                isLarge
                  ? "py-[20px] md:py-[28px]"
                  : "py-6"
              }`}
            >
              <span
                className={`font-semibold text-[var(--ink)] pr-6 group-hover:text-[var(--blue)] transition-colors leading-[1.3] ${
                  isLarge
                    ? "text-[16px] md:text-[20px]"
                    : "text-[12px] lg:text-[14px]"
                }`}
              >
                {item.q}
              </span>

              {/* Plus/Minus icon made with two 1px lines */}
              <span
                className={`relative flex-shrink-0 flex items-center justify-center ${
                  isLarge ? "w-6 h-6" : "w-4 h-4"
                }`}
              >
                <span
                  className={`absolute bg-[var(--blue)] transition-colors ${
                    isLarge ? "w-5 h-[1.5px]" : "w-4 h-[1.5px]"
                  }`}
                />
                <span
                  className={`absolute bg-[var(--blue)] transition-transform duration-300 ${
                    isLarge ? "h-5 w-[1.5px]" : "h-4 w-[1.5px]"
                  } ${isOpen ? "scale-y-0" : "scale-y-100"}`}
                />
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
              <div
                className={`text-[var(--grey)] leading-[1.65] max-w-[640px] ${
                  isLarge
                    ? "pt-2 pb-6 text-[15px] md:text-[16px] leading-[1.7]"
                    : "pb-6 text-[12px] lg:text-[13px]"
                }`}
              >
                {item.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
