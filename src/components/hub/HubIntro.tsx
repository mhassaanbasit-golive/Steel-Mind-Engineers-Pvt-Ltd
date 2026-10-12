import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap.ts";
import { isReducedMotion } from "../../lib/splitText.ts";

export interface HubIntroProps {
  divisionTitle: string; // e.g. "PRE-ENGINEERED BUILDINGS"
  quickAnswer: string;
}

export const HubIntro: React.FC<HubIntroProps> = ({
  divisionTitle,
  quickAnswer,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);

  const characters = Array.from(divisionTitle.toUpperCase());

  useEffect(() => {
    if (isReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Kinetic character reveal with scroll:
      // Each character starts at color: var(--grey); opacity: 0.15.
      // As the section scrolls from top 80% to top 40% of viewport,
      // characters flip to color: var(--ink); opacity: 1 in order from left to right.
      // Scrub: 1. Per character transition: color 0.3s ease, opacity 0.3s ease.
      const charEls = h2Ref.current?.querySelectorAll<HTMLElement>(".intro-char");
      if (charEls && charEls.length > 0) {
        gsap.fromTo(
          charEls,
          {
            opacity: 0.15,
            color: "var(--grey)",
          },
          {
            opacity: 1,
            color: "var(--ink)",
            stagger: 0.04,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              end: "top 40%",
              scrub: 1,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [divisionTitle]);

  return (
    <section
      ref={containerRef}
      className="w-full bg-white py-[96px] lg:py-[120px] px-[20px] lg:px-[40px]"
    >
      <div className="max-w-[900px] mx-auto text-center flex flex-col items-center">
        {/* Heading: font-size 18px (mobile, 16px if tight), 44px (desktop), 700, -0.02em, 1.15, uppercase, center, nowrap */}
        <h2
          ref={h2Ref}
          className="text-[16px] sm:text-[18px] lg:text-[44px] font-bold text-[var(--ink)] leading-[1.15] tracking-[-0.02em] text-center uppercase whitespace-nowrap select-none max-w-full overflow-hidden"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          {characters.map((char, index) => (
            <span
              key={index}
              className="intro-char inline-block"
              style={{
                opacity: 0.15,
                color: "var(--grey)",
                transition: "color 0.3s ease, opacity 0.3s ease",
                whiteSpace: char === " " ? "pre" : "normal",
              }}
            >
              {char}
            </span>
          ))}
        </h2>

        {/* Body Paragraph: font-size 15px (mobile), 17px (desktop), line-height 1.7, color: var(--grey), max-width 720px, margin: 28px auto 0, text-align: center */}
        <p
          ref={pRef}
          className="mt-[28px] max-w-[720px] text-[15px] lg:text-[17px] text-[var(--grey)] leading-[1.7] text-center mx-auto"
        >
          {quickAnswer}
        </p>
      </div>
    </section>
  );
};
