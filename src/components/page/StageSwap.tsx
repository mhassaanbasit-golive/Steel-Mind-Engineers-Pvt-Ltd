import React, { useState, useEffect, useRef } from "react";
import { Pic } from "../Pic.tsx";
import { DotRail } from "./DotRail.tsx";
import { lenis } from "../../lib/lenis.ts";

export interface StageSwapRow {
  title: string;
  text: string;
  image: string;
  alt?: string;
}

export interface StageSwapProps {
  rows: StageSwapRow[];
  ratio?: number;
  className?: string;
  renderExtra?: React.ReactNode;
}

export const StageSwap: React.FC<StageSwapProps> = ({
  rows,
  ratio = 3 / 2,
  className = "",
  renderExtra,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rAFRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rAFRef.current !== null) return;
      rAFRef.current = requestAnimationFrame(() => {
        rAFRef.current = null;
        const threshold = window.innerHeight * 0.5;
        let bestIndex = 0;

        for (let i = 0; i < rowRefs.current.length; i++) {
          const el = rowRefs.current[i];
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= threshold) {
              bestIndex = i;
            }
          }
        }

        setActiveIdx((prev) => (prev !== bestIndex ? bestIndex : prev));
      });
    };

    if (lenis) {
      lenis.on("scroll", handleScroll);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (lenis) lenis.off("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rAFRef.current !== null) cancelAnimationFrame(rAFRef.current);
    };
  }, [rows.length]);

  const scrollToRow = (index: number) => {
    const el = rowRefs.current[index];
    if (el) {
      if (lenis) {
        lenis.scrollTo(el, { offset: -120 });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className={`stage-swap w-full ${className}`}>
      {/* DESKTOP (1024px+) */}
      <div className="hidden lg:grid grid-cols-[6fr_6fr] gap-[88px] items-start relative">
        {/* Sticky Stage on the Left */}
        <div
          className="sticky flex flex-col"
          style={{
            top: "calc(var(--nav-offset, 80px) + 24px)",
          }}
        >
          {/* Stacked Images */}
          <div
            className="relative w-full overflow-hidden bg-[rgba(10,10,10,0.05)]"
            style={{ aspectRatio: String(ratio) }}
          >
            {rows.map((row, idx) => {
              const isActive = activeIdx === idx;
              return (
                <div
                  key={idx}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    zIndex: isActive ? 2 : 1,
                    clipPath: isActive ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
                    transition: "clip-path 1100ms cubic-bezier(0.76, 0, 0.24, 1)",
                  }}
                >
                  <Pic
                    src={row.image}
                    alt={row.alt || row.title}
                    ratio={ratio}
                    eager={idx === 0}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="w-full h-full"
                  />
                </div>
              );
            })}
          </div>

          {/* Under the stage: row of tick bars */}
          <div className="flex items-center gap-2 mt-4 w-full">
            {rows.map((row, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  aria-label={row.title}
                  onClick={() => scrollToRow(idx)}
                  className="h-[2px] flex-1 cursor-pointer transition-colors duration-500 border-0 p-0"
                  style={{
                    backgroundColor: isActive
                      ? "var(--blue, #1E3A8A)"
                      : "rgba(10, 10, 10, 0.18)",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Rows on the Right */}
        <div className="flex flex-col">
          {rows.map((row, idx) => {
            const isActive = activeIdx === idx;
            return (
              <div
                key={idx}
                ref={(el) => {
                  rowRefs.current[idx] = el;
                }}
                className="flex flex-col justify-center border-t border-[rgba(15,23,42,0.12)] transition-opacity duration-600"
                style={{
                  minHeight: "58svh",
                  opacity: isActive ? 1 : 0.35,
                }}
                onMouseEnter={() => setActiveIdx(idx)}
              >
                <h3 className="text-[22px] lg:text-[30px] font-bold text-[#0A0A0A] uppercase leading-[1.15] tracking-[-0.025em] mb-4">
                  {row.title}
                </h3>
                <p className="text-[15px] lg:text-[17px] text-[#0A0A0A] leading-[1.65] max-w-[560px]">
                  {row.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE (< 1024px) */}
      <div className="lg:hidden w-full relative">
        {/* Sticky Mobile Stage */}
        <div
          className="sticky z-10 bg-white"
          style={{
            top: "var(--nav-offset, 60px)",
            marginInline: "calc(var(--gutter) * -1)",
          }}
        >
          <div className="relative w-full" style={{ aspectRatio: String(ratio) }}>
            {rows.map((row, idx) => {
              const isActive = activeIdx === idx;
              return (
                <div
                  key={idx}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    zIndex: isActive ? 2 : 1,
                    clipPath: isActive ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
                    transition: "clip-path 900ms cubic-bezier(0.76, 0, 0.24, 1)",
                  }}
                >
                  <Pic
                    src={row.image}
                    alt={row.alt || row.title}
                    ratio={ratio}
                    eager={idx === 0}
                    sizes="100vw"
                    className="w-full h-full"
                  />
                </div>
              );
            })}
          </div>

          {/* Under stage: Horizontal DotRail */}
          <div className="py-2.5 px-4 flex justify-center bg-white">
            <DotRail
              count={rows.length}
              active={activeIdx}
              onSelect={scrollToRow}
              orientation="horizontal"
              itemNames={rows.map((r) => r.title)}
            />
          </div>

          {/* 20px white-to-transparent gradient */}
          <div
            className="w-full h-[20px] pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, #FFFFFF 0%, rgba(255,255,255,0) 100%)",
            }}
          />
        </div>

        {/* Mobile Rows in Normal Flow */}
        <div className="flex flex-col mt-4">
          {rows.map((row, idx) => (
            <div
              key={idx}
              ref={(el) => {
                rowRefs.current[idx] = el;
              }}
              className="py-7 border-t border-[rgba(15,23,42,0.12)] text-left"
            >
              <h3 className="text-[17px] sm:text-[19px] font-bold text-[#0A0A0A] uppercase leading-[1.2] tracking-[-0.025em] mb-2.5">
                {row.title}
              </h3>
              <p className="text-[15px] text-[#0A0A0A] leading-[1.65]">
                {row.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {renderExtra && <div className="w-full mt-16">{renderExtra}</div>}
    </div>
  );
};
