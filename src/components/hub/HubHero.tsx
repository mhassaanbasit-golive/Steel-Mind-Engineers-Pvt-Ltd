import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap.ts";
import { EASE_OUT_EXPO, EASE_IN_OUT_SOFT, isReducedMotion, splitLines } from "../../lib/splitText.ts";
import { A } from "../../data/assets.ts";

export interface HubHeroProps {
  divisionSlug: string; // e.g. "peb", "sheds", "warehouses", "structural", "custom"
  divisionName: string; // e.g. "PRE-ENGINEERED BUILDINGS"
  h1: string;
  subtitle: string;
}

const HERO_IMAGES: Record<string, string> = {
  peb: A.division.peb,
  sheds: A.division.sheds,
  warehouses: A.division.warehouses,
  structural: A.division.structural,
  custom: A.division.custom,
};

export const HubHero: React.FC<HubHeroProps> = ({
  divisionSlug,
  divisionName: _divisionName,
  h1,
  subtitle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  // Subtitle: First sentence of division Quick Answer
  const cleanSubtitle = subtitle
    ? subtitle.split(". ")[0].replace(/\.$/, "") + "."
    : "";

  const heroImgUrl = HERO_IMAGES[divisionSlug] || A.division.peb;

  useEffect(() => {
    if (isReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Hero Parallax: wrap overflow hidden box, image moves yPercent: -8 -> 8
      if (imageWrapRef.current && containerRef.current) {
        gsap.fromTo(
          imageWrapRef.current,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: EASE_IN_OUT_SOFT,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      }

      // Page entrance choreography
      // 1. Hero image wrapper: scale: 1.08 -> 1 over 1.4s, opacity: 0 -> 1 over 1s
      if (imageWrapRef.current) {
        gsap.fromTo(
          imageWrapRef.current,
          { scale: 1.08, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.4, ease: EASE_OUT_EXPO }
        );
      }

      // 2. Hero H1: split into lines with SplitText, lines animate yPercent: 110 -> 0 over 0.9s, stagger 0.08s, delay 0.4s
      if (h1Ref.current) {
        const split = splitLines(h1Ref.current);
        if (split.lines.length > 0) {
          gsap.fromTo(
            split.lines,
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: 0.9,
              ease: EASE_OUT_EXPO,
              stagger: 0.08,
              delay: 0.4,
            }
          );
        }
      }

      // 3. Hero subtitle: opacity: 0, y: 16 -> 1, 0 over 0.6s --ease-out-expo, delay 0.7s
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.7 }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [h1]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[60svh] lg:h-[70vh] overflow-hidden bg-[var(--ink)]"
    >
      {/* Parallax Image Box: height 116%, top -8% */}
      <div
        className="absolute inset-x-0 overflow-hidden pointer-events-none"
        style={{
          top: "-8%",
          height: "116%",
          zIndex: 0,
        }}
      >
        <div ref={imageWrapRef} className="w-full h-full relative">
          <picture className="w-full h-full block">
            <source media="(max-width: 767px)" srcSet={heroImgUrl} />
            <img
              src={heroImgUrl}
              alt={h1}
              className="w-full h-full object-cover object-center"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </picture>
        </div>
      </div>

      {/* Blue overlay: position: absolute; inset: 0; background: rgba(30, 58, 138, 0.20); mix-blend-mode: multiply; z-index: 1; */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: "rgba(30, 58, 138, 0.20)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Bottom gradient sits on top of this at z-index: 2 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.20) 45%, rgba(0, 0, 0, 0) 100%)",
        }}
      />

      {/* Content wrapper: z-index: 3 */}
      <div
        className="absolute z-[3] flex flex-col justify-end pointer-events-auto"
        style={{
          left: "var(--pad-x)",
          right: "var(--pad-x)",
          bottom: "40px",
        }}
      >
        <div className="w-full max-w-[320px] lg:max-w-[720px] lg:mb-6">
          {/* H1: font-size 22px (mobile), 40px (desktop), 700, line-height 1.15, -0.02em, uppercase, #FFFFFF, max-width 320px (mobile), 720px (desktop) */}
          <h1
            ref={h1Ref}
            className="text-[22px] lg:text-[40px] font-bold text-[#FFFFFF] uppercase leading-[1.15] tracking-[-0.02em] max-w-[320px] lg:max-w-[720px]"
          >
            {h1}
          </h1>

          {/* Subtitle: font-size 12px (mobile), 14px (desktop), 400, line-height 1.6, rgba(255,255,255,0.82), max-width 560px, margin-top 16px */}
          {cleanSubtitle && (
            <p
              ref={subtitleRef}
              className="mt-4 text-[12px] lg:text-[14px] font-normal text-white/82 leading-[1.6] max-w-[560px]"
              style={{
                color: "rgba(255, 255, 255, 0.82)",
              }}
            >
              {cleanSubtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
