import React, { useState, useRef } from "react";
import { gsap } from "../../lib/gsap.ts";

export interface HubFaqItem {
  q: string;
  a: string;
}

export interface HubFaqProps {
  items: HubFaqItem[];
}

export const HubFaq: React.FC<HubFaqProps> = ({ items }) => {
  // On page load: all rows closed. Nothing pre-opened.
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerTextRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleToggle = (idx: number) => {
    const prevIndex = openIndex;

    if (prevIndex === idx) {
      // Close the currently opened row
      const currEl = contentRefs.current[idx];
      if (currEl) {
        gsap.to(currEl, { height: 0, duration: 0.5, ease: "expo.out" });
      }
      setOpenIndex(null);
      return;
    }

    // Both closing and opening must run in the same animation window. Do not queue them.
    if (prevIndex !== null) {
      const prevEl = contentRefs.current[prevIndex];
      if (prevEl) {
        gsap.to(prevEl, { height: 0, duration: 0.5, ease: "expo.out" });
      }
    }

    const nextEl = contentRefs.current[idx];
    if (nextEl) {
      gsap.to(nextEl, { height: "auto", duration: 0.4, ease: "expo.out" });
    }

    setOpenIndex(idx);
  };

  return (
    <section className="w-full bg-[#FFFFFF] py-[80px] lg:py-[112px] px-[20px] lg:px-[40px] border-b border-[#E5E5E5]">
      <div className="max-w-[1340px] mx-auto">
        {/* H2 Heading */}
        <h2 className="text-[22px] lg:text-[48px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] mb-10">
          Frequently Asked Questions
        </h2>

        {/* Accordion list: 1px var(--line) divider between rows, background #FFFFFF */}
        <div className="w-full divide-y divide-[var(--line)] border-y border-[var(--line)] bg-[#FFFFFF]">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="w-full bg-[#FFFFFF] transition-all"
                style={{
                  padding: "20px 0",
                  borderLeft: isOpen ? "1px solid var(--blue)" : "none",
                  paddingLeft: isOpen ? "16px" : "0px",
                }}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => handleToggle(idx)}
                  className="w-full flex items-center justify-between text-left cursor-pointer transition-colors focus-visible:outline-none"
                >
                  {/* Question: 15px (mobile), 17px (desktop), weight 600, color var(--ink) */}
                  <span
                    className="font-semibold pr-6 text-[15px] lg:text-[17px]"
                    style={{
                      color: "var(--ink)",
                    }}
                  >
                    {item.q}
                  </span>

                  {/* Plus icon: 20px, stroke 1.5px, color var(--ink). Rotates 45 deg to become X on open over 0.35s, ease cubic-bezier(0.23, 1, 0.32, 1) */}
                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center relative">
                    <svg
                      className="w-5 h-5 stroke-[var(--ink)] transition-transform duration-[350ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="1.5"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>

                {/* Answer: 14px (mobile), 15px (desktop), color var(--grey), line-height 1.7, padding-bottom 24px */}
                <div
                  ref={(el) => {
                    contentRefs.current[idx] = el;
                  }}
                  className="h-0 overflow-hidden"
                >
                  <div
                    ref={(el) => {
                      innerTextRefs.current[idx] = el;
                    }}
                    className="pt-4 pb-6"
                    style={{
                      paddingBottom: "24px",
                    }}
                  >
                    <p className="text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[#6B7280] max-w-[600px]">
                      {item.a}
                    </p>
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
