import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, ScrollTrigger } from "../../lib/gsap.ts";
import { EASE_OUT_EXPO, EASE_SMOOTH, isReducedMotion, splitLines } from "../../lib/splitText.ts";

export interface HubEndBandProps {
  heading: string;
  nextUrl: string;
  nextTitle: string;
}

export const HubEndBand: React.FC<HubEndBandProps> = ({
  heading,
  nextUrl,
  nextTitle,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Label: opacity: 0, y: 8 -> 1, 0 over 0.5s --ease-out-expo
      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: EASE_OUT_EXPO,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }

      // Heading: split into lines, mask reveal yPercent: 110 -> 0 over 0.9s --ease-out-expo, stagger 0.08s, delay 0.1s
      if (headingRef.current) {
        const split = splitLines(headingRef.current);
        if (split.lines.length > 0) {
          gsap.fromTo(
            split.lines,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 0.9,
              stagger: 0.08,
              delay: 0.1,
              ease: EASE_OUT_EXPO,
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                once: true,
              },
            }
          );
        }
      }

      // Link: opacity: 0, y: 12 -> 1, 0 over 0.5s --ease-out-expo, delay 0.3s
      if (linkRef.current) {
        gsap.fromTo(
          linkRef.current,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.3,
            ease: EASE_OUT_EXPO,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [heading, nextUrl]);

  return (
    <section
      ref={containerRef}
      className="next-band w-full bg-[var(--blue)] text-white py-[96px] lg:py-[120px] px-[20px] lg:px-[40px] relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(0, 0, 0, 0.07) 100%)",
      }}
    >
      <div className="max-w-[1340px] mx-auto text-left">
        {/* Label NEXT */}
        <div
          ref={labelRef}
          className="text-[10px] uppercase font-semibold text-white/55 tracking-[0.14em] mb-5"
        >
          NEXT
        </div>

        {/* Heading */}
        <h2
          ref={headingRef}
          className="text-[24px] lg:text-[40px] font-bold text-white leading-[1.2] tracking-[-0.02em] max-w-[800px] mb-8"
        >
          {heading}
        </h2>

        {/* Link */}
        <div>
          <Link
            ref={linkRef}
            to={nextUrl}
            className="inline-flex items-center gap-3 text-[14px] lg:text-[18px] font-semibold text-white border-b border-white/40 pb-1.5 transition-colors duration-300 hover:border-white/90 group"
          >
            <span>{nextTitle}</span>
            <span className="text-[18px] transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};
