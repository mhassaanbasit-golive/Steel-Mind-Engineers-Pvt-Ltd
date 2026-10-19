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
      className={`w-full divide-y divide-[var(--rule,rgba(15,23,42,0.12))] border-y border-[var(--rule,rgba(15,23,42,0.12))] ${className}`}
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
                isLarge ? "py-[18px] md:py-[28px]" : "py-6"
              }`}
            >
              <span
                className={`font-semibold text-[var(--ink)] pr-6 group-hover:text-[var(--blue)] transition-colors leading-[1.3] ${
                  isLarge ? "text-[15px] md:text-[20px]" : "text-[14px] lg:text-[16px]"
                }`}
                style={isLarge ? { fontSize: "var(--fs-faq-q, 20px)" } : undefined}
              >
                {item.q}
              </span>

              {/* Plus icon rotating 45° to become × */}
              <span
                className={`relative flex-shrink-0 flex items-center justify-center transition-transform duration-300 ease-out ${
                  isLarge ? "w-[22px] h-[22px]" : "w-4 h-4"
                }`}
                style={{
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                }}
              >
                <span
                  className="absolute bg-[var(--blue)]"
                  style={{
                    width: isLarge ? "18px" : "14px",
                    height: "1.5px",
                  }}
                />
                <span
                  className="absolute bg-[var(--blue)]"
                  style={{
                    height: isLarge ? "18px" : "14px",
                    width: "1.5px",
                  }}
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
                className={`text-[var(--faq-a-color,var(--grey))] max-w-[680px] ${
                  isLarge
                    ? "pt-2 pb-6 text-[15px] md:text-[17px] leading-[1.7]"
                    : "pb-6 text-[13px] lg:text-[15px] leading-[1.65]"
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
