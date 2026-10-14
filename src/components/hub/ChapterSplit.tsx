import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Canvas } from "../ui/Canvas.tsx";
import { POOLS } from "../../data/pool.ts";

export interface ChapterItem {
  num: string;
  label: string;
  url: string;
  desc: string;
  slug: string;
}

export interface ChapterSplitProps {
  divisionSlug: string;
  chapters: ChapterItem[];
}

export const ChapterSplit: React.FC<ChapterSplitProps> = ({
  divisionSlug,
  chapters,
}) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Active chapter detection:
  // IntersectionObserver with rootMargin: "-45% 0px -45% 0px", threshold: 0.
  // Only the chapter block in the middle band of the viewport is active.
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

    rowRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [chapters]);

  const pool = POOLS[divisionSlug as keyof typeof POOLS] || POOLS.peb || [];
  const chapterImages = chapters.map((_, i) => pool[i % pool.length]);

  return (
    <section className="w-full bg-white">
      {/* Container: 
          Desktop: display: grid; grid-template-columns: 60% 40%; gap: 64px; padding: 96px 40px; max-width: 1340px; margin: 0 auto;
          Mobile: single column, padding 96px 20px
      */}
      <div
        className="chapter-split max-w-[1340px] mx-auto px-5 lg:px-10 py-24 lg:grid lg:grid-cols-[60%_40%] lg:gap-16"
        style={{
          margin: "0 auto",
        }}
      >
        {/* Left column (.chapter-list) */}
        <div className="chapter-list w-full flex flex-col">
          {chapters.map((ch, idx) => {
            const isActive = idx === activeChapter;

            return (
              <div
                key={ch.num}
                ref={(el) => {
                  rowRefs.current[idx] = el;
                }}
                data-index={idx}
                className="w-full relative"
              >
                {/* 1px var(--line) divider above every row except the first */}
                {idx > 0 && (
                  <div
                    className="w-full h-[1px] transition-colors duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    style={{
                      backgroundColor: isActive ? "var(--blue)" : "var(--line)",
                    }}
                  />
                )}

                {/* Row padding: 40px 0 mobile, 56px 0 desktop */}
                <div className="py-10 lg:py-14 flex flex-col items-start select-none">
                  {/* Number 01, 02… : 14px Inter 600 var(--blue), tabular numerals, letter-spacing 0.08em. Margin-bottom 12px. */}
                  <div
                    className="text-[14px] font-semibold text-[var(--blue)] font-mono tabular-nums mb-3 tracking-[0.08em]"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      color: "var(--blue)",
                      letterSpacing: "0.08em",
                      marginBottom: "12px",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {ch.num}
                  </div>

                  {/* Chapter name (H3): 17px mobile / 19px desktop, weight 600, var(--blue). Letter-spacing -0.01em. Margin-bottom 8px. 
                      Row name slides 4px right over 0.4s ease cubic-bezier(0.23, 1, 0.32, 1) when active.
                  */}
                  <h3
                    className="text-[17px] lg:text-[19px] font-semibold text-[var(--blue)] mb-2"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      color: "var(--blue)",
                      letterSpacing: "-0.01em",
                      marginBottom: "8px",
                      transform: isActive ? "translateX(4px)" : "translateX(0px)",
                      transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
                    }}
                  >
                    {ch.label}
                  </h3>

                  {/* Description: 13px, var(--grey), line-height 1.6, max-width 480px. Margin-bottom 16px. */}
                  <p
                    className="text-[13px] text-[var(--grey)] leading-[1.6] max-w-[480px] mb-4"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      color: "var(--grey)",
                      lineHeight: 1.6,
                      maxWidth: "480px",
                      marginBottom: "16px",
                    }}
                  >
                    {ch.desc}
                  </p>

                  {/* Link View →: 12px, weight 600, var(--blue). Underline grows left to right on hover over 0.3s. Arrow slides 4px right on hover. Only this link is clickable — the row itself is not. */}
                  <Link
                    to={ch.url}
                    className="relative inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--blue)] group/link cursor-pointer"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--blue)",
                    }}
                  >
                    <span className="relative inline-block pb-0.5">
                      View
                      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[var(--blue)] transition-all duration-300 ease-out group-hover/link:w-full" />
                    </span>
                    <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/link:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column (.chapter-preview) — Desktop only (>=1024px), hidden on mobile (<1024px) */}
        <aside
          className="chapter-preview hidden lg:block sticky top-[112px] self-start"
          style={{
            position: "sticky",
            top: "112px",
            alignSelf: "flex-start",
          }}
        >
          {/* Contains one image wrapper: aspect-ratio: 4/5; overflow: hidden; border: 1px solid var(--line); position: relative; */}
          <div
            style={{
              aspectRatio: "4/5",
              overflow: "hidden",
              border: "1px solid var(--line)",
              position: "relative",
              width: "100%",
            }}
          >
            {/* Inside the wrapper, all chapter images stacked as <Canvas slot="..."> placeholders, position: absolute; inset: 0; */}
            {chapters.map((ch, idx) => {
              const isActive = idx === activeChapter;

              return (
                <div
                  key={ch.num}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: isActive ? 1 : 0,
                    transition: isActive
                      ? "opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.05s"
                      : "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  <Canvas
                    slot={`${divisionSlug}.chapter.${ch.num}`}
                    src={chapterImages[idx]}
                    ratio="4/5"
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
          </div>

          {/* Below the image: current chapter name. 14px Inter 500 var(--grey). Changes with a fade only over 0.4s. */}
          <div
            className="mt-3 text-[14px] font-medium text-[var(--grey)] transition-opacity duration-400 ease-in-out"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--grey)",
            }}
          >
            {chapters[activeChapter]?.label}
          </div>
        </aside>
      </div>
    </section>
  );
};
