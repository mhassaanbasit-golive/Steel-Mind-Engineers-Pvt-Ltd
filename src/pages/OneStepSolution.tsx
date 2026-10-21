import React, { useState, useRef, useEffect, useMemo } from "react";
import { ContentData } from "../content/types.ts";
import { subpageImages } from "../data/subpageImages.ts";
import { SubpageHero } from "../components/subpage/SubpageHero.tsx";
import { SubpageNextBanner } from "../components/subpage/SubpageNextBanner.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { FitOneLine } from "../components/ui/FitOneLine.tsx";
import { useMediaQuery } from "../hooks/useMediaQuery.ts";

export interface OneStepSolutionProps {
  data: ContentData;
}

// 8 Steps extracted verbatim from page-13.json
const STEPS = [
  {
    num: "01",
    title: "Requirement review",
    text: "An engineer studies your use, size, site and budget.",
  },
  {
    num: "02",
    title: "Design and 3D concept",
    text: "The structure is designed and you approve the model.",
  },
  {
    num: "03",
    title: "Detailing",
    text: "Fabrication drawings are prepared.",
  },
  {
    num: "04",
    title: "Fabrication",
    text: "The factory cuts, welds and assembles the parts.",
  },
  {
    num: "05",
    title: "Cleaning and painting",
    text: "Surfaces are prepared and coated.",
  },
  {
    num: "06",
    title: "Delivery",
    text: "Parts are packed in erection order and sent to your site.",
  },
  {
    num: "07",
    title: "Erection",
    text: "Site crews assemble the building and fit sheeting and accessories.",
  },
  {
    num: "08",
    title: "Handover and after sale support",
    text: "You receive the finished building and support for later work.",
  },
];

const N = STEPS.length;

export const OneStepSolution: React.FC<OneStepSolutionProps> = ({ data }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ==========================================
  // 1. INTRO ANIMATION SETUP
  // ==========================================
  const introRef = useRef<HTMLElement>(null);
  const [introTriggered, setIntroTriggered] = useState(prefersReduced);

  const introTitle = "What One-Step Means";
  const introText =
    "Many steel projects use a separate designer, a separate fabricator and a separate erection contractor. When something goes wrong, each one blames the other. Steel Mind Engineers does all of the work with one team, so you have one contract and one person to call.";

  // Title character splitting (35ms stagger, cap delay 1400ms)
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

  // Text word splitting (45ms stagger, cap delay 1400ms)
  const textWords = useMemo(() => introText.trim().split(/\s+/), [introText]);
  const wordStagger = useMemo(() => {
    if (textWords.length <= 1) return 0;
    return Math.min(45, 1400 / (textWords.length - 1));
  }, [textWords]);

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
      { threshold: 0.3 }
    );

    if (introRef.current) observer.observe(introRef.current);
    return () => observer.disconnect();
  }, [introTriggered, prefersReduced]);

  // ==========================================
  // 2. VERTICAL RAIL INFOGRAPHIC (ALL SCREENS)
  // Single layout for desktop and mobile
  // ==========================================
  const liRefs = useRef<(HTMLLIElement | null)[]>([]);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Track active state per step (updated only when an index changes)
  const [activeSteps, setActiveSteps] = useState<boolean[]>(() =>
    Array(N).fill(prefersReduced)
  );

  const activeStepsRef = useRef<boolean[]>(Array(N).fill(prefersReduced));
  const segValsRef = useRef<number[]>(Array(N).fill(prefersReduced ? 1 : 0));
  const animFrameRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const checkAndAnimate = () => {
      const markY = window.innerHeight * 0.65;
      let needsMoreFrames = false;
      let activeChanged = false;
      const currentActive = [...activeStepsRef.current];

      liRefs.current.forEach((li, i) => {
        if (!li) return;
        const rect = li.getBoundingClientRect();
        const numEl = numRefs.current[i];
        const dotY = numEl ? numEl.offsetHeight / 2 : 28;
        const targetTop = rect.top + dotY;

        // Dot i is active when markY >= top + dotY
        const isAct = prefersReduced || markY >= targetTop;
        if (isAct !== currentActive[i]) {
          currentActive[i] = isAct;
          activeChanged = true;
        }

        if (prefersReduced) {
          li.style.setProperty("--seg", "1");
          return;
        }

        // Line segment progress: clamp((markY - (top + dotY)) / li.offsetHeight, 0, 1)
        const t = Math.max(0, Math.min(1, (markY - targetTop) / rect.height));
        const currentS = segValsRef.current[i] || 0;
        const diff = t - currentS;

        if (Math.abs(diff) > 0.001) {
          needsMoreFrames = true;
          const nextS = currentS + diff * 0.15;
          segValsRef.current[i] = nextS;
          li.style.setProperty("--seg", String(nextS));
        } else if (currentS !== t) {
          segValsRef.current[i] = t;
          li.style.setProperty("--seg", String(t));
        }
      });

      if (activeChanged) {
        activeStepsRef.current = currentActive;
        setActiveSteps(currentActive);
      }

      return needsMoreFrames;
    };

    const loop = () => {
      const needsMore = checkAndAnimate();
      if (needsMore) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        isRunningRef.current = false;
        animFrameRef.current = null;
      }
    };

    const triggerLoop = () => {
      if (isRunningRef.current) return;
      isRunningRef.current = true;
      animFrameRef.current = requestAnimationFrame(loop);
    };

    // Run once on mount to mark only steps already above markY
    triggerLoop();

    window.addEventListener("scroll", triggerLoop, { passive: true });
    window.addEventListener("resize", triggerLoop, { passive: true });

    return () => {
      window.removeEventListener("scroll", triggerLoop);
      window.removeEventListener("resize", triggerLoop);
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [prefersReduced]);

  // ==========================================
  // 3. FAQ STATE
  // ==========================================
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="w-full bg-white text-[var(--ink)] overflow-x-clip">
      {/* 1. HERO (compact for mobile) */}
      <SubpageHero
        title={data.h1}
        image={subpageImages.oneStepSolution.hero}
        quoteUrl="/contact-us/#quote"
        compact={true}
      />

      {/* 2. INTRO: Title Left, Existing Intro Text Right */}
      <section
        ref={introRef}
        className="w-full bg-white py-[72px] lg:py-[120px] px-6 lg:px-8 border-b border-[#E5E5E5]"
      >
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start text-left">
          {/* Title Left */}
          {isDesktop ? (
            <h2
              aria-label={introTitle}
              className="text-[17px] sm:text-[19px] lg:text-[46px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase"
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
                            filter: introTriggered ? "blur(0px)" : "blur(4px)",
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
            </h2>
          ) : (
            /* Mobile Title: FitOneLine helper (ONE line, never wrapped) */
            <div className="w-full overflow-hidden">
              <FitOneLine
                as="h2"
                ariaLabel={introTitle}
                initialClamp="clamp(17px, 5vw, 20px)"
                minFontSize={16}
                className="font-bold text-[#0A0A0A] tracking-[-0.02em] uppercase leading-tight text-[17px] sm:text-[19px]"
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
          )}

          {/* Text Right */}
          <p
            aria-label={introText}
            className="text-[15px] lg:text-[17px] text-[#0A0A0A] leading-[1.7] max-w-[560px]"
          >
            {textWords.map((word, wordIdx) => {
              const delay = prefersReduced ? 0 : wordIdx * wordStagger;

              return (
                <span
                  key={wordIdx}
                  className="inline-block whitespace-nowrap"
                  aria-hidden="true"
                  style={{
                    opacity: introTriggered ? 1 : 0,
                    transform: introTriggered
                      ? "translateY(0)"
                      : "translateY(40%)",
                    filter: introTriggered ? "blur(0px)" : "blur(4px)",
                    transition: prefersReduced
                      ? "none"
                      : `opacity 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, filter 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
                  }}
                >
                  {word}
                  {wordIdx < textWords.length - 1 ? "\u00A0" : ""}
                </span>
              );
            })}
          </p>
        </div>
      </section>

      {/* ========================================================
          3. PROCESS INFOGRAPHIC: ONE VERTICAL RAIL ON ALL SCREENS
          - Section: max-width 760px, centered. Side padding 24px mobile, 32px desktop.
            Padding 72px mobile, 120px desktop top/bottom.
          - <ol>: list-style none, position relative.
            CSS variables: --rail: 24px; --col: 64px; --num: clamp(44px, 12vw, 56px); from 1024px: clamp(56px, 5vw, 72px).
          - <li>: position relative; padding-left var(--col); padding-bottom 56px (72px from 1024px); last <li> 0.
          - DOT: left var(--rail), top calc(var(--num) / 2), width 14px, height 14px, border-radius 50%, translate(-50%, -50%).
          - LINE per <li>: ::before grey, ::after blue scaleY(var(--seg, 0)), left var(--rail), top calc(var(--num) / 2).
      ======================================================== */}
      <section className="w-full bg-white py-[72px] lg:py-[120px] px-6 lg:px-8">
        <div className="max-w-[760px] mx-auto text-left">
          <ol className="onestep-rail-list list-none m-0 p-0 relative">
            {STEPS.map((step, idx) => {
              const isActive = activeSteps[idx] || prefersReduced;

              return (
                <li
                  key={step.num}
                  ref={(el) => {
                    liRefs.current[idx] = el;
                  }}
                  className="onestep-rail-item relative"
                >
                  {/* DOT (14px circle centered at x = var(--rail), y = calc(var(--num) / 2)) */}
                  <div
                    className="absolute rounded-full box-border z-[2]"
                    style={{
                      left: "var(--rail)",
                      top: "calc(var(--num) / 2)",
                      width: "14px",
                      height: "14px",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: isActive ? "#1E3A8A" : "#FFFFFF",
                      border: `2px solid ${isActive ? "#1E3A8A" : "#E5E5E5"}`,
                      transition: prefersReduced
                        ? "none"
                        : "background-color 700ms cubic-bezier(0.22, 1, 0.36, 1), border-color 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  />

                  {/* Big Number (outline transparent when inactive, solid nav blue when active) */}
                  <span
                    ref={(el) => {
                      numRefs.current[idx] = el;
                    }}
                    className="block font-bold leading-none select-none"
                    style={{
                      fontSize: "var(--num)",
                      color: isActive ? "#1E3A8A" : "rgba(30, 58, 138, 0.45)",
                      transition: prefersReduced
                        ? "none"
                        : "color 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    {step.num}
                  </span>

                  {/* Title and existing text below number with margin-top 12px */}
                  <div
                    className="mt-3"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform:
                        isActive || prefersReduced
                          ? "translateY(0)"
                          : "translateY(16px)",
                      transition: prefersReduced
                        ? "none"
                        : "opacity 800ms cubic-bezier(0.22, 1, 0.36, 1), transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    <h3 className="font-bold text-[#0A0A0A] text-[14px] sm:text-[16px] lg:text-[22px] uppercase leading-[1.25] tracking-[-0.01em] mb-2">
                      {step.title}
                    </h3>
                    {step.text && (
                      <p className="text-[15px] lg:text-[16px] text-[#0A0A0A] leading-[1.65] max-w-[540px]">
                        {step.text}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 4. FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white pt-16 lg:pt-24 pb-[64px] lg:pb-[96px] px-6 lg:px-8 border-t border-[#E5E5E5]">
          <div className="max-w-[1280px] mx-auto text-left">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-[#0A0A0A] uppercase leading-[1.15] tracking-[-0.02em] mb-10">
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* 5. NEXT BANNER (compact) */}
      <SubpageNextBanner
        heading="See how Steel Mind's engineering team calculates and details every frame."
        title="Engineering Department"
        url="/pre-engineered-buildings-pakistan/engineering-department/"
        image={subpageImages.oneStepSolution.next}
        compact={true}
      />

      {/* CSS Rules for vertical rail line ::before and ::after pseudo-elements */}
      <style>{`
        .onestep-rail-list {
          --rail: 24px;
          --col: 64px;
          --num: clamp(44px, 12vw, 56px);
        }
        @media (min-width: 1024px) {
          .onestep-rail-list {
            --num: clamp(56px, 5vw, 72px);
          }
        }
        .onestep-rail-item {
          padding-left: var(--col);
          padding-bottom: 56px;
        }
        @media (min-width: 1024px) {
          .onestep-rail-item {
            padding-bottom: 72px;
          }
        }
        .onestep-rail-item:last-child {
          padding-bottom: 0;
        }
        .onestep-rail-item:not(:last-child)::before {
          content: "";
          position: absolute;
          left: var(--rail);
          top: calc(var(--num) / 2);
          width: 2px;
          height: 100%;
          transform: translateX(-50%);
          background-color: #E5E5E5;
          z-index: 1;
        }
        .onestep-rail-item:not(:last-child)::after {
          content: "";
          position: absolute;
          left: var(--rail);
          top: calc(var(--num) / 2);
          width: 2px;
          height: 100%;
          transform: translateX(-50%) scaleY(var(--seg, 0));
          transform-origin: 50% 0;
          background-color: #1E3A8A;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};
