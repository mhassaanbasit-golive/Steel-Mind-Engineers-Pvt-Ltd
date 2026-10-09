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

  return (
    <div className={`w-full divide-y divide-[var(--line)] border-y border-[var(--line)] ${className}`}>
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
              className="w-full py-6 flex items-center justify-between text-left cursor-pointer transition-colors hover:text-[var(--blue)] focus-visible:outline-none"
            >
              <span className="text-[17px] font-semibold text-[var(--ink)] pr-6 group-hover:text-[var(--blue)] transition-colors">
                {item.q}
              </span>

              {/* Plus/Minus icon made with two 1px lines */}
              <span className="relative flex-shrink-0 w-4 h-4 flex items-center justify-center">
                <span className="absolute w-4 h-[1.5px] bg-[var(--ink)] group-hover:bg-[var(--blue)] transition-colors" />
                <span
                  className={`absolute h-4 w-[1.5px] bg-[var(--ink)] group-hover:bg-[var(--blue)] transition-transform duration-300 ${
                    isOpen ? "scale-y-0" : "scale-y-100"
                  }`}
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
              <div className="pb-6 text-[15px] lg:text-[16px] leading-[1.6] text-[var(--grey)] max-w-[520px]">
                {item.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
