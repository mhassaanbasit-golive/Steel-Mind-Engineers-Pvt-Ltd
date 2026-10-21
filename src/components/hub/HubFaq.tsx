import React, { useState, useRef } from "react";
import { gsap } from "../../lib/gsap.ts";

export interface HubFaqItem {
  q: string;
  a: string;
}

export interface HubFaqProps {
  items: HubFaqItem[];
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

export const HubFaq: React.FC<HubFaqProps> = ({ items }) => {
  // On page load: all rows closed. Nothing pre-opened.
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleToggle = (idx: number) => {
    const prevIndex = openIndex;

    if (prevIndex === idx) {
      const currEl = contentRefs.current[idx];
      if (currEl) {
        gsap.to(currEl, { height: 0, duration: 0.35, ease: "power3.inOut" });
      }
      setOpenIndex(null);
      return;
    }

    if (prevIndex !== null) {
      const prevEl = contentRefs.current[prevIndex];
      if (prevEl) {
        gsap.to(prevEl, { height: 0, duration: 0.35, ease: "power3.inOut" });
      }
    }

    const nextEl = contentRefs.current[idx];
    if (nextEl) {
      gsap.to(nextEl, { height: "auto", duration: 0.45, ease: "power3.out" });
    }

    setOpenIndex(idx);
  };

  return (
    <section className="w-full bg-[#FFFFFF] py-[64px] lg:py-[88px] px-[20px] lg:px-[40px] border-b border-[#E5E5E5]">
      <div className="max-w-[1340px] mx-auto text-left">
        {/* H2 Heading */}
        <h2 className="text-[20px] lg:text-[32px] font-bold text-[#0A0A0A] leading-[1.2] tracking-[-0.01em] mb-8">
          Frequently Asked Questions
        </h2>

        {/* Standardized Accordion list */}
        <div className="w-full divide-y divide-[#E5E5E5] border-y border-[#E5E5E5] bg-[#FFFFFF]">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            const sentenceQuestion = toSentenceCase(item.q);

            return (
              <div key={idx} className="group overflow-hidden">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => handleToggle(idx)}
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
                  ref={(el) => {
                    contentRefs.current[idx] = el;
                  }}
                  className="h-0 overflow-hidden"
                >
                  <div className="pt-1 pb-6 text-[13px] lg:text-[15px] leading-[1.65] text-[var(--grey)] max-w-[680px]">
                    {item.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
