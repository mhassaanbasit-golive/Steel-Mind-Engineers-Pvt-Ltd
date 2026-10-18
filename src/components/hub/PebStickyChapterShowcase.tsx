import React, { useState, useEffect, useRef } from "react";
import { Link } from "../ui/TransitionLink.tsx";
import { POOLS } from "../../data/pool.ts";

export interface PebChapterItem {
  num: string; // "01" - "11"
  label: string;
  url: string;
  desc: string;
}

export interface PebStickyChapterShowcaseProps {
  chapters: PebChapterItem[];
}

export const PebStickyChapterShowcase: React.FC<PebStickyChapterShowcaseProps> = ({
  chapters,
}) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Active chapter detection:
  // IntersectionObserver with rootMargin: "-45% 0px -45% 0px", threshold: 0.
  // Only the block occupying the middle band of the viewport becomes active.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(index)) {
              setActiveChapter(index);
            }
          }
        });
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      }
    );

    blockRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [chapters]);

  // All 11 images stacked with position: absolute; inset: 0; inside the wrapper.
  const pebPool = POOLS.peb;
  const chapterImages = chapters.map((_, i) => pebPool[i % pebPool.length]);

  return (
    <section ref={containerRef} className="w-full bg-white relative border-t border-[var(--line)]">
      <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
        {/* Desktop Layout: Two-column container. Left column 38%, Right column 62%, Gap 56px */}
        <div className="flex flex-col lg:flex-row lg:gap-[56px]">
          {/* Left column (sticky): width 38%, position: sticky; top: calc(72px + 40px); align-self: flex-start; */}
          {/* Hidden entirely on mobile (<1024px) */}
          <div className="hidden lg:block w-[38%] sticky top-[calc(72px+40px)] self-start h-fit pb-16">
            {/* Number 01 to 11. Font-size: 56px. Weight: 700. Color: var(--blue). Tabular numerals. Line-height: 1. */}
            {/* Number transition: Outgoing y: 0 -> -100%, opacity 1 -> 0 over 0.35s ease cubic-bezier(0.23, 1, 0.32, 1).
                Incoming: y: 100% -> 0, opacity 0 -> 1 over 0.45s ease cubic-bezier(0.23, 1, 0.32, 1). Two stacked spans inside overflow: hidden. */}
            <div className="h-[56px] overflow-hidden relative select-none">
              {chapters.map((ch, idx) => {
                const isActive = idx === activeChapter;
                return (
                  <span
                    key={ch.num}
                    className={`absolute inset-0 flex items-center font-bold text-[var(--blue)] font-mono tabular-nums leading-none transition-all ${
                      isActive
                        ? "opacity-100 translate-y-0 duration-[450ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
                        : "opacity-0 -translate-y-full duration-[350ms] ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none"
                    }`}
                    style={{
                      fontSize: "56px",
                      lineHeight: 1,
                    }}
                  >
                    {ch.num}
                  </span>
                );
              })}
            </div>

            {/* Image below the number: aspect-ratio: 4/5; overflow: hidden; border: 1px solid var(--line); margin-top: 24px; */}
            {/* Image crossfade: outgoing opacity 1 -> 0 over 0.5s ease cubic-bezier(0.16, 1, 0.3, 1).
                Incoming opacity 0 -> 1 over 0.7s ease cubic-bezier(0.16, 1, 0.3, 1) delay 0.05s.
                All 11 images stacked with position: absolute; inset: 0; inside wrapper. */}
            <div
              className="w-full aspect-[4/5] overflow-hidden relative bg-neutral-100"
              style={{
                aspectRatio: "4/5",
                overflow: "hidden",
                border: "1px solid var(--line)",
                marginTop: "24px",
              }}
            >
              {chapterImages.map((src, idx) => {
                const isActive = idx === activeChapter;
                return (
                  <img
                    key={idx}
                    src={src}
                    alt={chapters[idx]?.label || "PEB Chapter"}
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity ${
                      isActive
                        ? "opacity-100 z-10 duration-[700ms] delay-[50ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                        : "opacity-0 z-0 duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
                    }`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                );
              })}
            </div>

            {/* Chapter name below image: Font-size: 16px. Weight: 600. Color: var(--ink). Margin-top: 16px. */}
            {/* Fade only: opacity 0.15 -> 1 over 0.4s ease cubic-bezier(0.16, 1, 0.3, 1). */}
            <div className="h-[28px] overflow-hidden relative select-none mt-4">
              {chapters.map((ch, idx) => {
                const isActive = idx === activeChapter;
                return (
                  <div
                    key={ch.num}
                    className={`absolute inset-0 flex items-center font-semibold text-[var(--ink)] transition-opacity duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                    style={{
                      fontSize: "16px",
                    }}
                  >
                    {ch.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column: width 62% on desktop, full width on mobile */}
          <div className="w-full lg:w-[62%]">
            {chapters.map((ch, idx) => {
              const isFirst = idx === 0;
              return (
                <div
                  key={ch.num}
                  data-index={idx}
                  ref={(el) => {
                    blockRefs.current[idx] = el;
                  }}
                  className={`py-[40px] lg:py-[120px] ${
                    isFirst ? "" : "border-t border-[var(--line)]"
                  }`}
                  style={{
                    borderTop: isFirst ? "none" : "1px solid var(--line)",
                  }}
                >
                  {/* Number 01 to 11: font-size 24px (mobile), 32px (desktop), weight 700, color var(--blue), tabular numerals, line-height 1, margin-bottom 20px on desktop */}
                  <div
                    className="text-[24px] lg:text-[32px] font-bold text-[var(--blue)] font-mono tabular-nums leading-none lg:mb-5"
                    style={{
                      color: "var(--blue)",
                      lineHeight: 1,
                    }}
                  >
                    {ch.num}
                  </div>

                  {/* Chapter name (H3): 18px (mobile), 24px (desktop), weight 600, color var(--ink), letter-spacing -0.01em, margin-top 12px (mobile), margin-bottom 14px (desktop) */}
                  <h3
                    className="text-[18px] lg:text-[24px] font-semibold text-[var(--ink)] tracking-[-0.01em] mt-3 lg:mt-0 lg:mb-3.5"
                    style={{
                      color: "var(--ink)",
                    }}
                  >
                    {ch.label}
                  </h3>

                  {/* Description: 13px (mobile), 14px (desktop), color var(--grey), line-height 1.6 (mobile) / 1.65 (desktop), max-width 100% (mobile) / 520px (desktop), margin-top 8px (mobile) / margin-bottom 24px (desktop) */}
                  <p
                    className="text-[13px] lg:text-[14px] text-[var(--grey)] leading-[1.6] lg:leading-[1.65] max-w-full lg:max-w-[520px] mt-2 lg:mt-0 lg:mb-6"
                    style={{
                      color: "var(--grey)",
                    }}
                  >
                    {ch.desc}
                  </p>

                  {/* Link View ->: 12px (mobile), 13px (desktop), weight 600, color var(--blue), margin-top 16px. Underline grows left to right over 0.3s. Arrow slides 4px right */}
                  <div className="mt-4 lg:mt-0">
                    <Link
                      to={ch.url}
                      className="inline-flex items-center text-[12px] lg:text-[13px] font-semibold text-[var(--blue)] group relative"
                      style={{
                        color: "var(--blue)",
                      }}
                    >
                      <span className="relative">
                        View
                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-[var(--blue)] transition-all duration-300 group-hover:w-full ease-[cubic-bezier(0.23,1,0.32,1)]" />
                      </span>
                      <span className="ml-2 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
