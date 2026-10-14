import React, { useState, useRef, useEffect, useMemo } from "react";
import { ContentData } from "../content/types.ts";
import { subpageImages } from "../data/subpageImages.ts";
import { PhotoBox } from "../components/ui/PhotoBox.tsx";
import { SubpageHero } from "../components/subpage/SubpageHero.tsx";
import { SubpageNextBanner } from "../components/subpage/SubpageNextBanner.tsx";
import { FitOneLine } from "../components/ui/FitOneLine.tsx";
import { useMediaQuery } from "../hooks/useMediaQuery.ts";

export interface AdvantagesProps {
  data: ContentData;
}

const POINTS = [
  {
    num: "01",
    title: "Faster construction",
    text: "Fabrication and foundation work happen at the same time. Site work is mostly assembly, so the building is ready for use sooner than a concrete building of the same size.",
  },
  {
    num: "02",
    title: "Efficient use of steel",
    text: "Each frame is sized for its own loads. The steel is thicker where the forces are high and lighter where they are low. This reduces weight and material cost.",
  },
  {
    num: "03",
    title: "Wide clear spans",
    text: "Frames can cover wide spans with no inner columns. You get open floor for machines, racking, vehicles or animals.",
  },
  {
    num: "04",
    title: "Predictable cost",
    text: "Because the design is complete before fabrication starts, the quantity of steel is known early. Fewer surprises appear during construction.",
  },
  {
    num: "05",
    title: "Easy extension",
    text: "Bolted frames allow you to add bays at the end of the building when your business grows.",
  },
  {
    num: "06",
    title: "Controlled quality",
    text: "Factory work is done under cover with set inspection steps. Parts are made to tight tolerances and fit on site without cutting.",
  },
];

export const Advantages: React.FC<AdvantagesProps> = ({ data }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 2a: Row 01 open on load (initial openIndex = 0)
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const rowButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggleRow = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  // Keyboard navigation for accordion rows
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number
  ) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (idx + 1) % POINTS.length;
      rowButtonRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (idx - 1 + POINTS.length) % POINTS.length;
      rowButtonRefs.current[prev]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      rowButtonRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      rowButtonRefs.current[POINTS.length - 1]?.focus();
    }
  };

  // Mobile intro title per-character animation setup
  const introTitle = "Why Owners Choose PEB";
  const [introTriggered, setIntroTriggered] = useState(prefersReduced);
  const introMobileRef = useRef<HTMLDivElement>(null);

  const titleWords = useMemo(
    () => introTitle.trim().split(/\s+/),
    [introTitle]
  );
  const totalTitleChars = useMemo(
    () => titleWords.reduce((acc, w) => acc + w.length, 0),
    [titleWords]
  );
  const charStagger = useMemo(() => {
    if (totalTitleChars <= 1) return 0;
    return Math.min(35, 1400 / (totalTitleChars - 1));
  }, [totalTitleChars]);

  useEffect(() => {
    if (prefersReduced) {
      setIntroTriggered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !introTriggered) {
            setIntroTriggered(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    if (introMobileRef.current) observer.observe(introMobileRef.current);
    return () => observer.disconnect();
  }, [introTriggered, prefersReduced]);

  // Two blocks reveal via IntersectionObserver (trigger once, threshold 0.25)
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const [block1Revealed, setBlock1Revealed] = useState(prefersReduced);
  const [block2Revealed, setBlock2Revealed] = useState(prefersReduced);

  useEffect(() => {
    if (prefersReduced) {
      setBlock1Revealed(true);
      setBlock2Revealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === block1Ref.current) {
              setBlock1Revealed(true);
            } else if (entry.target === block2Ref.current) {
              setBlock2Revealed(true);
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    if (block1Ref.current) observer.observe(block1Ref.current);
    if (block2Ref.current) observer.observe(block2Ref.current);

    return () => observer.disconnect();
  }, [prefersReduced]);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="w-full bg-white text-[var(--ink)] overflow-x-clip">
      {/* 1. HERO (compact for mobile) */}
      <SubpageHero
        title={data.h1}
        image={subpageImages.advantages.hero}
        quoteUrl="/contact-us/#quote"
        compact={true}
      />

      {/* 2. POINTS SECTION */}
      <section className="w-full bg-white py-[72px] lg:py-[120px] px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto">
          {isDesktop ? (
            /* DESKTOP LAYOUT (1024px and wider): grid 5fr / 7fr, gap 96px */
            <div className="grid grid-cols-[5fr_7fr] gap-[96px] items-start">
              {/* LEFT: One Sticky Box */}
              <div
                className="sticky flex flex-col items-start"
                style={{ top: "calc(var(--nav-h, 88px) + 48px)" }}
              >
                <h2
                  className="font-bold text-[#0A0A0A] leading-[1.12] tracking-[-0.02em] max-w-[420px] text-left uppercase"
                  style={{ fontSize: "clamp(36px, 3.4vw, 56px)" }}
                >
                  Why Owners Choose PEB
                </h2>

                {/* Vertical Progress Line: 1px light grey track with 1px blue scale line */}
                <div className="w-[1px] h-[160px] bg-[#E5E5E5] mt-12 relative overflow-hidden">
                  <div
                    className="absolute inset-x-0 top-0 w-full bg-[#1E3A8A]"
                    style={{
                      height: "100%",
                      transformOrigin: "top",
                      transform:
                        openIndex !== null
                          ? `scaleY(${(openIndex + 1) / 6})`
                          : "scaleY(0)",
                      transition: prefersReduced
                        ? "none"
                        : "transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  />
                </div>
              </div>

              {/* RIGHT: Top 16:9 PhotoBox + 6 Accordion Rows */}
              <div className="w-full flex flex-col">
                {/* 16:9 Intro Image fading in once on load */}
                <div
                  className="w-full"
                  style={{
                    animation: prefersReduced
                      ? "none"
                      : "advantagesImgFadeIn 1000ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
                  }}
                >
                  <PhotoBox
                    src={subpageImages.advantages.pointsIntro}
                    alt="Why Owners Choose PEB"
                    aspectRatio="16 / 9"
                    loading="eager"
                  />
                </div>

                {/* 6 Accordion Rows below image (margin-top 72px) */}
                <div className="w-full mt-[72px] flex flex-col">
                  {POINTS.map((pt, idx) => {
                    const isOpen = openIndex === idx;
                    const isFirst = idx === 0;

                    return (
                      <div
                        key={pt.num}
                        className={`w-full relative ${
                          isFirst ? "border-t border-[#E5E5E5]" : ""
                        } border-b border-[#E5E5E5]`}
                      >
                        {/* Row Button */}
                        <button
                          ref={(el) => {
                            rowButtonRefs.current[idx] = el;
                          }}
                          type="button"
                          id={`advantages-button-${idx}`}
                          aria-expanded={isOpen}
                          aria-controls={`advantages-panel-${idx}`}
                          onClick={() => toggleRow(idx)}
                          onKeyDown={(e) => handleKeyDown(e, idx)}
                          className="w-full min-h-[56px] py-8 flex items-center justify-between text-left cursor-pointer group focus-visible:outline-none"
                        >
                          <div className="flex items-center flex-1 pr-6 min-w-0">
                            {/* Number: existing blue style, width 64px */}
                            <span
                              className="w-16 flex-shrink-0 text-[15px] lg:text-[17px] font-bold text-[#1E3A8A] tracking-[0.06em]"
                              style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                              {pt.num}
                            </span>

                            {/* Title: clamp(22px, 2vw, 30px), transitions to nav blue on hover over 400ms */}
                            <span
                              className="font-bold text-[#0A0A0A] group-hover:text-[#1E3A8A] transition-colors duration-[400ms] leading-[1.25] tracking-[-0.01em]"
                              style={{ fontSize: "clamp(22px, 2vw, 30px)" }}
                            >
                              {pt.title}
                            </span>
                          </div>

                          {/* Plus Icon: two 1px blue lines. When open, vertical line rotates 90deg and fades out (700ms) */}
                          <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-5 h-5 stroke-[#1E3A8A]"
                              viewBox="0 0 24 24"
                              fill="none"
                              strokeWidth="1.5"
                            >
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <line
                                x1="12"
                                y1="5"
                                x2="12"
                                y2="19"
                                style={{
                                  transformOrigin: "center",
                                  transform: isOpen
                                    ? "rotate(90deg)"
                                    : "rotate(0deg)",
                                  opacity: isOpen ? 0 : 1,
                                  transition: prefersReduced
                                    ? "none"
                                    : "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                                }}
                              />
                            </svg>
                          </span>
                        </button>

                        {/* Panel: grid-template-rows 0fr to 1fr, opacity 0 to 1, 700ms */}
                        <div
                          id={`advantages-panel-${idx}`}
                          role="region"
                          aria-labelledby={`advantages-button-${idx}`}
                          className="grid"
                          style={{
                            gridTemplateRows: isOpen ? "1fr" : "0fr",
                            opacity: isOpen ? 1 : 0,
                            transition: prefersReduced
                              ? "none"
                              : "grid-template-rows 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                          }}
                        >
                          <div className="overflow-hidden min-h-0">
                            <p
                              className="pl-16 pb-8 text-[15px] text-[#6B7280] leading-[1.7] max-w-[520px]"
                              style={{
                                transform:
                                  isOpen || prefersReduced
                                    ? "translateY(0)"
                                    : "translateY(12px)",
                                opacity: isOpen || prefersReduced ? 1 : 0,
                                transition: prefersReduced
                                  ? "none"
                                  : "transform 700ms cubic-bezier(0.22, 1, 0.36, 1) 100ms, opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) 100ms",
                              }}
                            >
                              {pt.text}
                            </p>
                          </div>
                        </div>

                        {/* 1px blue line sits on bottom border, scaleX 0 to 1 over 800ms when open */}
                        <div
                          className="absolute bottom-0 left-0 w-full h-[1px] bg-[#1E3A8A] pointer-events-none"
                          style={{
                            transformOrigin: "left",
                            transform: isOpen ? "scaleX(1)" : "scaleX(0)",
                            transition: prefersReduced
                              ? "none"
                              : "transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* MOBILE LAYOUT (below 1024px): one column, title -> image -> rows */
            <div ref={introMobileRef} className="w-full flex flex-col">
              {/* Intro Title: FitOneLine helper (ONE line, never wrapped) with per-character animation */}
              <div className="w-full mb-8 text-left overflow-hidden">
                <FitOneLine
                  as="h2"
                  ariaLabel={introTitle}
                  initialClamp="clamp(18px, 6vw, 30px)"
                  minFontSize={16}
                  className="font-bold text-[#0A0A0A] tracking-[-0.02em] uppercase leading-tight"
                >
                  {titleWords.map((word, wordIdx) => {
                    let prevChars = 0;
                    for (let i = 0; i < wordIdx; i++) {
                      prevChars += titleWords[i].length;
                    }

                    return (
                      <span
                        key={wordIdx}
                        className="inline-block whitespace-nowrap"
                        aria-hidden="true"
                      >
                        {word.split("").map((char, charIdx) => {
                          const delay = prefersReduced
                            ? 0
                            : (prevChars + charIdx) * charStagger;

                          return (
                            <span
                              key={charIdx}
                              className="inline-block"
                              style={{
                                opacity: introTriggered ? 1 : 0,
                                transform: introTriggered
                                  ? "translateY(0)"
                                  : "translateY(40%)",
                                filter: introTriggered
                                  ? "blur(0px)"
                                  : "blur(4px)",
                                transition: prefersReduced
                                  ? "none"
                                  : `opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, filter 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
                              }}
                            >
                              {char}
                            </span>
                          );
                        })}
                        {wordIdx < titleWords.length - 1 ? "\u00A0" : ""}
                      </span>
                    );
                  })}
                </FitOneLine>
              </div>

              {/* 16:9 Intro Image */}
              <div className="w-full mb-10">
                <PhotoBox
                  src={subpageImages.advantages.pointsIntro}
                  alt="Why Owners Choose PEB"
                  aspectRatio="16 / 9"
                  loading="eager"
                />
              </div>

              {/* Rows */}
              <div className="w-full flex flex-col">
                {POINTS.map((pt, idx) => {
                  const isOpen = openIndex === idx;
                  const isFirst = idx === 0;

                  return (
                    <div
                      key={pt.num}
                      className={`w-full relative ${
                        isFirst ? "border-t border-[#E5E5E5]" : ""
                      } border-b border-[#E5E5E5]`}
                    >
                      <button
                        ref={(el) => {
                          rowButtonRefs.current[idx] = el;
                        }}
                        type="button"
                        id={`advantages-button-mob-${idx}`}
                        aria-expanded={isOpen}
                        aria-controls={`advantages-panel-mob-${idx}`}
                        onClick={() => toggleRow(idx)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        className="w-full min-h-[56px] py-6 flex items-center justify-between text-left cursor-pointer group focus-visible:outline-none"
                      >
                        <div className="flex items-center flex-1 pr-4 min-w-0">
                          <span
                            className="w-12 flex-shrink-0 text-[14px] font-bold text-[#1E3A8A] tracking-[0.06em]"
                            style={{ fontVariantNumeric: "tabular-nums" }}
                          >
                            {pt.num}
                          </span>
                          <span
                            className="font-bold text-[#0A0A0A] group-hover:text-[#1E3A8A] transition-colors leading-[1.25]"
                            style={{ fontSize: "clamp(19px, 5vw, 24px)" }}
                          >
                            {pt.title}
                          </span>
                        </div>

                        <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-4 h-4 stroke-[#1E3A8A]"
                            viewBox="0 0 24 24"
                            fill="none"
                            strokeWidth="1.5"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <line
                              x1="12"
                              y1="5"
                              x2="12"
                              y2="19"
                              style={{
                                transformOrigin: "center",
                                transform: isOpen
                                  ? "rotate(90deg)"
                                  : "rotate(0deg)",
                                opacity: isOpen ? 0 : 1,
                                transition: prefersReduced
                                  ? "none"
                                  : "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                              }}
                            />
                          </svg>
                        </span>
                      </button>

                      <div
                        id={`advantages-panel-mob-${idx}`}
                        role="region"
                        aria-labelledby={`advantages-button-mob-${idx}`}
                        className="grid"
                        style={{
                          gridTemplateRows: isOpen ? "1fr" : "0fr",
                          opacity: isOpen ? 1 : 0,
                          transition: prefersReduced
                            ? "none"
                            : "grid-template-rows 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                        }}
                      >
                        <div className="overflow-hidden min-h-0">
                          <p
                            className="pl-12 pb-6 text-[15px] text-[#6B7280] leading-[1.6]"
                            style={{
                              transform:
                                isOpen || prefersReduced
                                  ? "translateY(0)"
                                  : "translateY(12px)",
                              opacity: isOpen || prefersReduced ? 1 : 0,
                              transition: prefersReduced
                                ? "none"
                                : "transform 700ms cubic-bezier(0.22, 1, 0.36, 1) 100ms, opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) 100ms",
                            }}
                          >
                            {pt.text}
                          </p>
                        </div>
                      </div>

                      <div
                        className="absolute bottom-0 left-0 w-full h-[1px] bg-[#1E3A8A] pointer-events-none"
                        style={{
                          transformOrigin: "left",
                          transform: isOpen ? "scaleX(1)" : "scaleX(0)",
                          transition: prefersReduced
                            ? "none"
                            : "transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          2b. BLOCK 1: "PEB Compared With Concrete Construction"
          - Desktop: max-width 1280px, side padding 32px, padding 96px top and bottom.
            First PhotoBox full container width, 16 / 9, object-fit cover, fades in 1000ms.
            Below it (margin-top 56px) grid 5fr / 7fr, gap 96px.
            Left: title clamp(28px, 2.8vw, 44px).
            Right: two columns, gap 48px. Column A line grey; Column B line blue and draws scaleX 0 to 1, 800ms, 300ms after reveal.
          - Mobile: side padding 24px. Image 16 / 9, then title, column A, column B stacked, gap 32px.
      ======================================================== */}
      <section
        ref={block1Ref}
        className="w-full bg-white border-t border-[#E5E5E5] py-[56px] lg:py-[96px] px-6 lg:px-8"
      >
        <div className="max-w-[1280px] mx-auto">
          {/* 16:9 PhotoBox, full container width */}
          <div
            className="w-full"
            style={{
              opacity: block1Revealed ? 1 : 0,
              transition: prefersReduced
                ? "none"
                : "opacity 1000ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <PhotoBox
              src={subpageImages.advantages.comparedWithConcrete}
              alt="PEB Compared With Concrete Construction"
              aspectRatio="16 / 9"
            />
          </div>

          {/* Desktop: Grid 5fr / 7fr, margin-top 56px, gap 96px */}
          <div
            className="mt-8 lg:mt-[56px] grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-8 lg:gap-[96px] items-start text-left"
            style={{
              opacity: block1Revealed ? 1 : 0,
              transform:
                block1Revealed || prefersReduced
                  ? "translateY(0)"
                  : "translateY(24px)",
              transition: prefersReduced
                ? "none"
                : "opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) 200ms, transform 800ms cubic-bezier(0.22, 1, 0.36, 1) 200ms",
            }}
          >
            {/* Title Left */}
            <h3
              className="font-bold text-[#0A0A0A] leading-[1.2] tracking-[-0.01em]"
              style={{
                fontSize: isDesktop
                  ? "clamp(28px, 2.8vw, 44px)"
                  : "clamp(18px, 5vw, 24px)",
                textWrap: !isDesktop ? ("balance" as any) : undefined,
              }}
            >
              PEB Compared With Concrete Construction
            </h3>

            {/* Right: Two columns, gap 48px on desktop, stacked on mobile with gap 32px */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Column A: text up to end of sentence about concrete. 1px light grey top line */}
              <div className="relative pt-6">
                <div className="absolute top-0 inset-x-0 h-[1px] bg-[#E5E5E5]" />
                <p className="text-[15px] text-[#6B7280] leading-[1.7]">
                  Concrete buildings are cast on site. They depend on curing
                  time and weather, and changes are slow.
                </p>
              </div>

              {/* Column B: the rest starting at 'A PEB is made'. 1px nav blue line draws scaleX 0 to 1, 300ms after reveal */}
              <div className="relative pt-6">
                <div
                  className="absolute top-0 inset-x-0 h-[1px] bg-[#1E3A8A]"
                  style={{
                    transformOrigin: "left",
                    transform:
                      block1Revealed || prefersReduced
                        ? "scaleX(1)"
                        : "scaleX(0)",
                    transition: prefersReduced
                      ? "none"
                      : "transform 800ms cubic-bezier(0.22, 1, 0.36, 1) 300ms",
                  }}
                />
                <p className="text-[15px] text-[#6B7280] leading-[1.7]">
                  A PEB is made in a factory and assembled on site. This is why
                  many factory, warehouse and farm owners in Pakistan now ask
                  for a PEB first.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2c. BLOCK 2: "When Another Solution Is Better"
          - Full-width band: background exact nav blue, width 100%, white text, no shadow.
          - Desktop: grid 5fr / 7fr, gap 0, min-height 560px.
            Left cell: padding 96px 64px 96px max(32px, calc((100vw - 1280px) / 2));
            Title white clamp(28px, 2.8vw, 44px); under it first sentence clamp(20px, 1.8vw, 26px) white; rest body size, white at 80% opacity.
            Right cell: position relative, image absolute inset 0, 100% size, object-fit cover, touching right edge of screen.
          - Mobile: image first, full width 16 / 9. Then blue panel, padding 48px 24px.
      ======================================================== */}
      <section
        ref={block2Ref}
        className="w-full bg-[var(--blue,#1E3A8A)] text-white overflow-hidden"
      >
        {isDesktop ? (
          /* Desktop: Grid 5fr / 7fr, min-height 560px */
          <div className="w-full grid grid-cols-[5fr_7fr] min-h-[560px]">
            {/* Left Cell */}
            <div
              className="flex flex-col justify-center text-left"
              style={{
                paddingTop: "96px",
                paddingBottom: "96px",
                paddingRight: "64px",
                paddingLeft: "max(32px, calc((100vw - 1280px) / 2))",
                opacity: block2Revealed ? 1 : 0,
                transform:
                  block2Revealed || prefersReduced
                    ? "translateY(0)"
                    : "translateY(24px)",
                transition: prefersReduced
                  ? "none"
                  : "opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) 200ms, transform 800ms cubic-bezier(0.22, 1, 0.36, 1) 200ms",
              }}
            >
              <h3
                className="font-bold text-white leading-[1.2] tracking-[-0.01em] mb-6"
                style={{ fontSize: "clamp(28px, 2.8vw, 44px)" }}
              >
                When Another Solution Is Better
              </h3>
              <div className="max-w-[440px] flex flex-col gap-4">
                <p
                  className="font-semibold text-white leading-[1.4]"
                  style={{ fontSize: "clamp(20px, 1.8vw, 26px)" }}
                >
                  A PEB is not always the best option.
                </p>
                <p className="text-[15px] text-white/80 leading-[1.7]">
                  Very small buildings, or buildings that need heavy concrete
                  walls for fire or security, may need a different design. An
                  engineer will tell you honestly if a PEB does not fit your
                  project.
                </p>
              </div>
            </div>

            {/* Right Cell: Image touching right edge of screen */}
            <div
              className="relative w-full h-full min-h-[560px] overflow-hidden"
              style={{
                opacity: block2Revealed ? 1 : 0,
                transition: prefersReduced
                  ? "none"
                  : "opacity 1000ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <PhotoBox
                src={subpageImages.advantages.whenAnotherSolutionIsBetter}
                alt="When Another Solution Is Better"
                aspectRatio="auto"
                className="!absolute inset-0 w-full h-full"
                style={{ height: "100%" }}
              />
            </div>
          </div>
        ) : (
          /* Mobile: Image first (16 / 9), then blue panel */
          <div className="w-full flex flex-col">
            <div
              className="w-full"
              style={{
                opacity: block2Revealed ? 1 : 0,
                transition: prefersReduced
                  ? "none"
                  : "opacity 1000ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <PhotoBox
                src={subpageImages.advantages.whenAnotherSolutionIsBetter}
                alt="When Another Solution Is Better"
                aspectRatio="16 / 9"
              />
            </div>

            <div
              className="w-full px-6 py-12 text-left"
              style={{
                opacity: block2Revealed ? 1 : 0,
                transform:
                  block2Revealed || prefersReduced
                    ? "translateY(0)"
                    : "translateY(24px)",
                transition: prefersReduced
                  ? "none"
                  : "opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) 200ms, transform 800ms cubic-bezier(0.22, 1, 0.36, 1) 200ms",
              }}
            >
              <h3
                className="font-bold text-white tracking-[-0.01em] mb-5"
                style={{
                  fontSize: "clamp(18px, 5vw, 24px)",
                  textWrap: "balance" as any,
                }}
              >
                When Another Solution Is Better
              </h3>
              <div className="flex flex-col gap-3">
                <p className="text-[17px] font-semibold text-white leading-snug">
                  A PEB is not always the best option.
                </p>
                <p className="text-[15px] text-white/80 leading-[1.65]">
                  Very small buildings, or buildings that need heavy concrete
                  walls for fire or security, may need a different design. An
                  engineer will tell you honestly if a PEB does not fit your
                  project.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. FAQ (compact title with FitOneLine on mobile, 15px question text) */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white pt-16 lg:pt-24 pb-[64px] lg:pb-[96px] px-6 lg:px-8 border-t border-[#E5E5E5]">
          <div className="max-w-[1280px] mx-auto text-left">
            {isDesktop ? (
              <h2 className="text-[22px] lg:text-[40px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] mb-10">
                Frequently Asked Questions
              </h2>
            ) : (
              <div className="w-full mb-8 overflow-hidden">
                <FitOneLine
                  as="h2"
                  initialClamp="clamp(18px, 6vw, 30px)"
                  minFontSize={16}
                  className="font-bold text-[#0A0A0A] tracking-[-0.02em] leading-tight"
                >
                  Frequently Asked Questions
                </FitOneLine>
              </div>
            )}

            <div className="w-full divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
              {data.faq.map((item, idx) => {
                const isOpen = openFaqIndex === idx;

                return (
                  <div key={idx} className="w-full py-5">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between text-left cursor-pointer group focus-visible:outline-none"
                    >
                      <span className="font-semibold text-[15px] text-[#0A0A0A] pr-6 leading-snug">
                        {item.q}
                      </span>

                      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 stroke-[#0A0A0A]"
                          viewBox="0 0 24 24"
                          fill="none"
                          strokeWidth="1.5"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <line
                            x1="12"
                            y1="5"
                            x2="12"
                            y2="19"
                            style={{
                              transformOrigin: "center",
                              transform: isOpen
                                ? "rotate(90deg)"
                                : "rotate(0deg)",
                              opacity: isOpen ? 0 : 1,
                              transition: prefersReduced
                                ? "none"
                                : "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                            }}
                          />
                        </svg>
                      </span>
                    </button>

                    <div
                      className="grid"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                        opacity: isOpen ? 1 : 0,
                        transition: prefersReduced
                          ? "none"
                          : "grid-template-rows 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    >
                      <div className="overflow-hidden">
                        <p className="pt-3 pb-2 text-[15px] text-[#6B7280] leading-[1.7] max-w-[800px]">
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
      )}

      {/* 5. NEXT BANNER (compact) */}
      <SubpageNextBanner
        heading="See how 3D modeling and concept design shapes your PEB project."
        title="3D Concept"
        url="/pre-engineered-buildings-pakistan/3d-concept/"
        image={subpageImages.advantages.next}
        compact={true}
      />

      <style>{`
        @keyframes advantagesImgFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
