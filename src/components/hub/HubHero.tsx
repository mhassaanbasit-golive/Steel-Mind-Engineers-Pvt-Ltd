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

      // Image reveals only
      if (imageWrapRef.current) {
        gsap.fromTo(
          imageWrapRef.current,
          { scale: 1.08, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.4, ease: EASE_OUT_EXPO }
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
        className="absolute z-[3] flex flex-col justify-end pointer-events-auto left-[20px] bottom-[40px] right-[20px] lg:left-[40px] lg:bottom-[64px] lg:right-[40px]"
      >
        <div className="w-full max-w-[320px] lg:max-w-[640px]">
          {/* H1: 22px mobile / 40px desktop. Weight 700. Uppercase. White. Line-height 1.15. Letter-spacing -0.02em. */}
          <h1
            ref={h1Ref}
            className="text-[22px] lg:text-[40px] font-bold text-white uppercase leading-[1.15] tracking-[-0.02em]"
          >
            {h1}
          </h1>

          {/* Subtitle: 12px mobile / 14px desktop. White 82%. Max-width 560px. Margin-top 14px. */}
          {cleanSubtitle && (
            <p
              ref={subtitleRef}
              className="mt-[14px] text-[12px] lg:text-[14px] font-normal leading-[1.6] max-w-[560px]"
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
