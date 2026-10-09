import React, { useRef, useState, useEffect, useCallback } from "react";
import { UI } from "../../data/ui.ts";
import { gsap } from "../../lib/gsap.ts";

export interface SwipeRowProps {
  children: React.ReactNode;
  ariaLabel?: string;
  theme?: "light" | "dark";
  progress?: boolean;
  className?: string;
}

export const SwipeRow: React.FC<SwipeRowProps> = ({
  children,
  ariaLabel = "Items list",
  theme = "light",
  progress = true,
  className = "",
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  // Update progress thumb & arrow states
  const updateMetrics = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const currentScroll = scroller.scrollLeft;

    setCanScrollPrev(currentScroll > 10);
    setCanScrollNext(currentScroll < maxScroll - 10);

    if (progress && trackRef.current && thumbRef.current && scroller.scrollWidth > 0) {
      const visibleRatio = Math.min(1, scroller.clientWidth / scroller.scrollWidth);
      const trackWidth = trackRef.current.clientWidth;
      const thumbWidth = Math.max(32, trackWidth * visibleRatio);
      const scrollRatio = maxScroll > 0 ? currentScroll / maxScroll : 0;
      const thumbX = (trackWidth - thumbWidth) * scrollRatio;

      thumbRef.current.style.width = `${thumbWidth}px`;
      thumbRef.current.style.transform = `translateX(${thumbX}px)`;
    }
  }, [progress]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let rafId: number;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateMetrics);
    };

    updateMetrics();
    scroller.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      cancelAnimationFrame(rafId);
      scroller.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [updateMetrics]);

  const scrollByCard = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const card = scroller.firstElementChild as HTMLElement;
    const cardWidth = card ? card.offsetWidth + 24 : 320;
    const targetScroll = scroller.scrollLeft + direction * cardWidth;

    scroller.style.scrollSnapType = "none";
    gsap.to(scroller, {
      scrollLeft: targetScroll,
      duration: 0.5,
      ease: "power4.out",
      onComplete: () => {
        scroller.style.scrollSnapType = "x mandatory";
        updateMetrics();
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCard(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCard(1);
    }
  };

  const isDark = theme === "dark";

  return (
    <div className={`relative w-full ${className}`}>
      {/* Desktop Controls */}
      <div className="hidden lg:flex items-center justify-end space-x-4 mb-4">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={!canScrollPrev}
          aria-label={UI.previous}
          className={`w-11 h-11 flex items-center justify-center transition-opacity cursor-pointer ${
            isDark ? "text-white" : "text-[var(--ink)]"
          } ${canScrollPrev ? "opacity-100 hover:opacity-75" : "opacity-30 cursor-not-allowed"}`}
        >
          {/* Thin chevron 1.5px stroke */}
          <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={!canScrollNext}
          aria-label={UI.next}
          className={`w-11 h-11 flex items-center justify-center transition-opacity cursor-pointer ${
            isDark ? "text-white" : "text-[var(--ink)]"
          } ${canScrollNext ? "opacity-100 hover:opacity-75" : "opacity-30 cursor-not-allowed"}`}
        >
          <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Scroller */}
      <div
        ref={scrollerRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex gap-4 lg:gap-[var(--gutter)] overflow-x-auto scroll-smooth overscroll-x-contain pb-4 focus:outline-none [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [scroll-snap-type:x_mandatory]"
        data-lenis-prevent=""
      >
        {React.Children.map(children, (child, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-[calc(100vw-110px)] sm:w-[360px] lg:w-[calc((min(100vw,1340px)-2*var(--pad-x)-2*var(--gutter))/2.5)] [scroll-snap-align:start]"
          >
            {child}
          </div>
        ))}
      </div>

      {/* Progress Track and Thumb */}
      {progress && (
        <div
          ref={trackRef}
          className={`relative w-full h-[1px] mt-6 ${
            isDark ? "bg-white/40" : "bg-[var(--line)]"
          }`}
        >
          <div
            ref={thumbRef}
            className={`absolute top-[-0.5px] left-0 h-[2px] transition-transform duration-75 ${
              isDark ? "bg-white" : ""
            }`}
            style={{
              backgroundImage: isDark ? undefined : "var(--gradient-brand-horizontal)",
            }}
          />
        </div>
      )}
    </div>
  );
};
