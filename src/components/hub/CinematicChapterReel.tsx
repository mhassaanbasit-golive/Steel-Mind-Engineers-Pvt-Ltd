import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { POOLS } from "../../data/pool.ts";

export interface ReelChapterItem {
  num: string; // "01" - "05"
  label: string;
  url: string;
  desc: string;
  slug: string;
}

export interface CinematicChapterReelProps {
  divisionSlug: string; // "sheds", "warehouses", "structural", "custom"
  statementSentence?: string; // Kept optional in prop signature for safety, but statement band is deleted per Item 4
  chapters: ReelChapterItem[];
}

export const CinematicChapterReel: React.FC<CinematicChapterReelProps> = ({
  divisionSlug,
  chapters,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Update progress line thumb via requestAnimationFrame
  const updateProgress = () => {
    const el = scrollerRef.current;
    const thumb = thumbRef.current;
    const track = trackRef.current;
    if (!el || !thumb || !track) return;

    const scrollLeft = el.scrollLeft;
    const scrollWidth = el.scrollWidth;
    const clientWidth = el.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < maxScroll - 5);

    const trackWidth = track.clientWidth;
    const visibleRatio = clientWidth / scrollWidth;
    const thumbWidth = Math.max(30, visibleRatio * trackWidth);
    const scrollRatio = maxScroll > 0 ? scrollLeft / maxScroll : 0;
    const thumbLeft = scrollRatio * (trackWidth - thumbWidth);

    thumb.style.width = `${thumbWidth}px`;
    thumb.style.transform = `translateX(${thumbLeft}px)`;
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let animId: number;
    const onScroll = () => {
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(updateProgress);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateProgress();

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(animId);
    };
  }, [chapters]);

  const scrollByCard = (direction: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = window.innerWidth >= 1024 ? 440 + 24 : el.clientWidth - 40;
    el.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  // Curated imagery per division
  const pool = (POOLS as Record<string, string[]>)[divisionSlug] || POOLS.sheds;

  return (
    <div className="w-full bg-white">
      {/* Card Reel Section */}
      <section className="w-full py-12 lg:py-16 bg-white overflow-hidden">
        {/* Top desktop arrows */}
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] mb-6 hidden lg:flex items-center justify-end">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => scrollByCard("left")}
              disabled={!canScrollLeft}
              className={`w-[44px] h-[44px] flex items-center justify-center border border-[var(--line)] bg-transparent text-[var(--ink)] transition-opacity duration-300 ${
                canScrollLeft
                  ? "cursor-pointer hover:border-[var(--blue)] hover:text-[var(--blue)]"
                  : "opacity-30 cursor-not-allowed"
              }`}
            >
              <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => scrollByCard("right")}
              disabled={!canScrollRight}
              className={`w-[44px] h-[44px] flex items-center justify-center border border-[var(--line)] bg-transparent text-[var(--ink)] transition-opacity duration-300 ${
                canScrollRight
                  ? "cursor-pointer hover:border-[var(--blue)] hover:text-[var(--blue)]"
                  : "opacity-30 cursor-not-allowed"
              }`}
            >
              <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scroller container:
            display: flex; gap: 24px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none;
            ::-webkit-scrollbar { display: none; }
            Padding-left and padding-right: 20px (mobile), 40px (desktop). */}
        <div
          ref={scrollerRef}
          className="w-full flex gap-[24px] overflow-x-auto snap-x snap-mandatory px-[20px] lg:px-[40px]"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {chapters.map((ch, idx) => {
            const cardImg = pool[idx % pool.length];
            return (
              <div
                key={ch.num}
                className="group cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(30,58,138,0.12)]"
                style={{
                  flex: "0 0 calc(100vw - 60px)",
                  scrollSnapAlign: "start",
                }}
              >
                {/* Responsive override for desktop: flex: 0 0 440px */}
                <style>{`
                  @media (min-width: 1024px) {
                    .reel-card-${idx} {
                      flex: 0 0 440px !important;
                    }
                  }
                `}</style>

                <div className={`reel-card-${idx} w-full`}>
                  {/* Card image wrapper: aspect-ratio: 4/5; overflow: hidden; position: relative; background: var(--offwhite); */}
                  <div
                    className="aspect-[4/5] overflow-hidden relative"
                    style={{
                      aspectRatio: "4/5",
                      overflow: "hidden",
                      position: "relative",
                      background: "var(--offwhite)",
                    }}
                  >
                    {/* Card image: width: 100%; height: 100%; object-fit: cover; object-position: center; Card image scales to 1.04 over 0.6s ease cubic-bezier(0.23, 1, 0.32, 1) on hover */}
                    <img
                      src={cardImg}
                      alt={ch.label}
                      className="w-full h-full object-cover object-center transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>

                  {/* Card body below image: padding: 24px 4px */}
                  <div
                    style={{
                      padding: "24px 4px",
                    }}
                  >
                    {/* Number 01 to 05: font-size 24px, weight 700, color var(--blue), tabular numerals, margin-bottom 12px */}
                    <div
                      className="font-bold font-mono tabular-nums leading-none"
                      style={{
                        fontSize: "24px",
                        color: "var(--blue)",
                        marginBottom: "12px",
                      }}
                    >
                      {ch.num}
                    </div>

                    {/* Chapter name (H3): font-size 20px, weight 600, color var(--ink), margin-bottom 10px */}
                    <h3
                      className="font-semibold leading-tight"
                      style={{
                        fontSize: "20px",
                        color: "var(--ink)",
                        marginBottom: "10px",
                      }}
                    >
                      {ch.label}
                    </h3>

                    {/* Description: font-size 13px, color var(--grey), line-height 1.6, max-width 360px, clamp to 2 lines */}
                    <p
                      className="line-clamp-2"
                      style={{
                        fontSize: "13px",
                        color: "var(--grey)",
                        lineHeight: "1.6",
                        maxWidth: "360px",
                      }}
                    >
                      {ch.desc}
                    </p>

                    {/* Link View ->: 12px, weight 600, color var(--blue), margin-top 16px */}
                    <div
                      style={{
                        marginTop: "16px",
                      }}
                    >
                      <Link
                        to={ch.url}
                        className="inline-flex items-center font-semibold group/link"
                        style={{
                          fontSize: "12px",
                          color: "var(--blue)",
                        }}
                      >
                        <span className="relative">
                          View
                          <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-[var(--blue)] transition-all duration-300 group-hover/link:w-full ease-[cubic-bezier(0.23,1,0.32,1)]" />
                        </span>
                        <span className="ml-2 transition-transform duration-300 group-hover/link:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress line below the reel:
            Track: 1px var(--line), full width of the container.
            Thumb: 2px var(--blue). Width = (visible width / total width) * track width. Position follows scrollLeft via rAF. No CSS transition. */}
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] mt-8">
          <div ref={trackRef} className="w-full h-[1px] bg-[var(--line)] relative overflow-hidden">
            <div
              ref={thumbRef}
              className="absolute top-0 left-0 h-[2px] bg-[var(--blue)]"
              style={{ transition: "none", willChange: "transform, width" }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
