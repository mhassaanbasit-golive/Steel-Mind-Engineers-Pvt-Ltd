import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
import { ContentData, ContentBlock } from "../../../content/types.ts";
import { IMG } from "../../../data/subpageImages.ts";
import { PhotoBox } from "../../page/PhotoBox.tsx";
import { OutlineNum } from "../../page/OutlineNum.tsx";
import { SplitIntro } from "../../page/SplitIntro.tsx";
import { HeroBand } from "../../ui/HeroBand.tsx";
import { Accordion } from "../../ui/Accordion.tsx";
import { NextBand } from "../../ui/NextBand.tsx";
import { TwoTone } from "../../page/TwoTone.tsx";
import { SITE } from "../../../data/site.ts";
import { gsap, ScrollTrigger } from "../../../lib/gsap.ts";
import { useMediaQuery } from "../../../hooks/useMediaQuery.ts";
import { cld } from "../../../lib/cld.ts";
import {
  Wrench,
  PaintRoller,
  MoveHorizontal,
  SquarePlus,
  ClipboardCheck,
  ArrowUpRight,
  CheckSquare2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function extractSections(data: ContentData) {
  const sections: {
    title: string;
    text: string;
    paragraphs: string[];
    items?: { name: string; text: string }[];
    bullets?: string[];
  }[] = [];
  let current: {
    title: string;
    text: string;
    paragraphs: string[];
    items?: { name: string; text: string }[];
    bullets?: string[];
  } | null = null;
  const introPs: string[] = [];

  data.blocks.forEach((b: ContentBlock) => {
    if (b.type === "h2") {
      if (current) sections.push(current);
      current = { title: b.title || "", text: "", paragraphs: [] };
    } else if (b.type === "p" && b.text) {
      if (current) {
        current.paragraphs.push(b.text);
        current.text = current.text ? `${current.text} ${b.text}` : b.text;
      } else {
        introPs.push(b.text);
      }
    } else if (b.type === "bullets" && b.bullets) {
      if (current) {
        current.bullets = b.bullets;
        current.paragraphs.push(...b.bullets);
        current.text = current.text ? `${current.text} ${b.bullets.join(" ")}` : b.bullets.join(" ");
      }
    } else if ((b.type === "defs" || b.type === "steps") && b.items) {
      if (current) current.items = b.items;
    }
  });
  if (current) sections.push(current);

  return { introPs, sections };
}

// 9.28 Design — signature: "Blueprint canvas & Process Rail"
export const DesignLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const rootRef = useRef<HTMLElement>(null);
  const curtainBoxRef = useRef<HTMLDivElement>(null);
  const curtainImgRef = useRef<HTMLImageElement>(null);
  const coverTextRef = useRef<HTMLDivElement>(null);
  const railLineRef = useRef<HTMLDivElement>(null);
  const stepColRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileTabContainerRef = useRef<HTMLDivElement>(null);
  const mobileTabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelMeasureRefs = useRef<(HTMLDivElement | null)[]>([]);

  // State
  const [activeStep, setActiveStep] = useState(0);
  const [tallestPanelHeight, setTallestPanelHeight] = useState<number>(180);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Steps data strictly adhering to page-46.json
  const steps = [
    {
      num: "01",
      title: "THE DESIGN STEPS",
      text: "Engineers study your use, size, site and budget. They set the loads from the structure, wind, rain, roof use, cranes and equipment. They choose the frame and size each column, rafter and brace. They prepare a 3D model for your review. A second engineer checks the design before release.",
    },
    {
      num: "02",
      title: "WHAT YOU RECEIVE",
      text: "You receive a 3D model, general arrangement drawings and the anchor bolt plan for your foundation contractor.",
    },
    {
      num: "03",
      title: "DESIGN SUPPORT DURING CONSTRUCTION",
      text: "The designer stays available during fabrication and erection and answers site questions the same day.",
    },
  ];

  const coverText =
    "The design stage decides what the building is: its frame type, its member sizes, its connections and its foundation loads. A good design uses steel where it is needed and nowhere else.";

  // Measure tallest panel after fonts are ready so the page does not jump
  const measureTallest = useCallback(() => {
    let maxH = 0;
    panelMeasureRefs.current.forEach((el) => {
      if (el) {
        const h = el.offsetHeight;
        if (h > maxH) maxH = h;
      }
    });
    if (maxH > 0) {
      setTallestPanelHeight(maxH);
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const debouncedMeasure = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        measureTallest();
        ScrollTrigger.refresh();
      }, 150);
    };

    debouncedMeasure();

    if (document.fonts?.ready) {
      document.fonts.ready.then(debouncedMeasure).catch(() => {});
    }

    const img = new Image();
    img.src = IMG.services.design.d1;
    if (img.decode) {
      img.decode().then(debouncedMeasure).catch(() => {});
    } else {
      img.onload = debouncedMeasure;
    }

    window.addEventListener("resize", debouncedMeasure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", debouncedMeasure);
    };
  }, [measureTallest]);

  // Center active tab on mobile
  useEffect(() => {
    if (!isDesktop) {
      const activeBtn = mobileTabRefs.current[activeStep];
      if (activeBtn && mobileTabContainerRef.current) {
        activeBtn.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeStep, isDesktop]);

  // GSAP Entrance Animations
  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        if (curtainBoxRef.current) gsap.set(curtainBoxRef.current, { clipPath: "none" });
        if (curtainImgRef.current) gsap.set(curtainImgRef.current, { scale: 1 });
        if (coverTextRef.current) gsap.set(coverTextRef.current, { opacity: 1, y: 0 });
        if (railLineRef.current) gsap.set(railLineRef.current, { scaleX: 1 });
        stepColRefs.current.forEach((col) => col && gsap.set(col, { opacity: 1, y: 0 }));
        return;
      }

      // 1. Cover Curtain Reveal (1200ms E2) + Inner Photo subtle scale (1400ms E1)
      if (curtainBoxRef.current && curtainImgRef.current) {
        gsap.set(curtainBoxRef.current, { clipPath: "inset(0 0 100% 0)" });
        gsap.set(curtainImgRef.current, { scale: 1.05 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: curtainBoxRef.current,
            start: "top 85%",
            once: true,
          },
        });

        tl.to(
          curtainBoxRef.current,
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.2,
            ease: "E2",
            clearProps: "clipPath",
          },
          0
        );
        tl.to(
          curtainImgRef.current,
          {
            scale: 1,
            duration: 1.4,
            ease: "E1",
          },
          0
        );
      }

      // 2. Cover Text RISE Reveal
      if (coverTextRef.current) {
        gsap.fromTo(
          coverTextRef.current,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "E1",
            scrollTrigger: {
              trigger: coverTextRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // 3. Rail Line DRAW (1000ms E2) + Step items RISE
      if (railLineRef.current) {
        gsap.fromTo(
          railLineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.0,
            ease: "E2",
            transformOrigin: "left center",
            scrollTrigger: {
              trigger: railLineRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      const validCols = stepColRefs.current.filter(Boolean);
      if (validCols.length > 0) {
        gsap.fromTo(
          validCols,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "E1",
            scrollTrigger: {
              trigger: validCols[0],
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <article ref={rootRef} className="w-full bg-white text-left pb-0 overflow-x-clip">
      {/* 1. HERO BAND (strictly capitalized in desktop and mobile view) */}
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.design.hero}
        imageAlt={data.h1.toUpperCase()}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* 2. COVER SPLIT SECTION: "WHAT DESIGN COVERS" */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px] border-b border-[#E5E5E5]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Heading & Text */}
          <div ref={coverTextRef} className="lg:col-span-5 space-y-6">
            <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
              WHAT DESIGN COVERS
            </h2>
            <p className="text-[15px] lg:text-[17px] text-[var(--blue)] leading-[1.7] font-normal">
              {coverText}
            </p>
          </div>

          {/* Right Column: Photo Box with 1200ms E2 CURTAIN */}
          <div className="lg:col-span-7">
            <div
              ref={curtainBoxRef}
              className="w-full overflow-hidden bg-slate-900 shadow-md relative"
              style={{
                aspectRatio: "1024 / 559",
                clipPath: "inset(0 0 100% 0)",
              }}
            >
              <img
                ref={curtainImgRef}
                src={IMG.services.design.d1}
                alt="3D BIM STRUCTURAL MODEL AND PLAN"
                width={1024}
                height={559}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover block"
                style={{ transform: "scale(1.05)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROCESS INFOGRAPHIC WITH RAIL (ALL SCREEN SIZES) */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px] border-b border-[#E5E5E5]">
        {/* Section Heading: strictly capitalized in desktop and mobile view */}
        <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase mb-8 lg:mb-16">
          THE DESIGN PROCESS & DELIVERABLES
        </h2>

        {/* DESKTOP VIEW (lg:block): 3 Columns connected with a 2px horizontal rail line */}
        <div className="hidden lg:block relative pt-6">
          {/* Continuous 2px Blue Rail Line across the 3 steps */}
          <div className="relative w-full mb-10">
            <div
              ref={railLineRef}
              className="absolute left-[5%] right-[5%] top-[5px] h-[2px] bg-[var(--blue)] z-0"
              style={{ transformOrigin: "left center" }}
            />

            {/* 3 Step Columns */}
            <div className="grid grid-cols-3 gap-12 relative z-10">
              {steps.map((st, idx) => (
                <div
                  key={st.num}
                  ref={(el) => {
                    stepColRefs.current[idx] = el;
                  }}
                  className="flex flex-col items-start text-left"
                >
                  {/* 10px dot on the 2px blue rail line */}
                  <div className="w-[10px] h-[10px] rounded-full bg-[var(--blue)] mb-6 shadow-sm ring-4 ring-white" />

                  {/* Step Number: solid, bold, var(--blue), placed above title */}
                  <span className="block text-[44px] lg:text-[64px] font-bold text-[var(--blue)] leading-none select-none mb-3">
                    {st.num}
                  </span>

                  {/* Step Title: UPPERCASE, bold, ink colour */}
                  <h3 className="text-[18px] lg:text-[22px] font-bold text-[#0A0A0A] leading-[1.25] tracking-[-0.01em] uppercase mb-3">
                    {st.title}
                  </h3>

                  {/* Step Text: One-Step body blue, regular weight, same size & line-height */}
                  <p className="text-[15px] lg:text-[17px] text-[var(--blue)] leading-[1.7] font-normal">
                    {st.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MOBILE VIEW (lg:hidden): Horizontal Rail Tabs + Slide View with Fixed Min-Height to Prevent Jumps */}
        <div className="lg:hidden">
          {/* Rail Tab Navigation Bar */}
          <div className="relative mb-8 pb-4">
            {/* 2px Horizontal Rail Line */}
            <div className="absolute left-6 right-6 top-[22px] h-[2px] bg-[var(--blue)] z-0" />

            {/* Scrollable Tabs */}
            <div
              ref={mobileTabContainerRef}
              className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-none px-2 relative z-10"
            >
              {steps.map((st, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={st.num}
                    ref={(el) => {
                      mobileTabRefs.current[idx] = el;
                    }}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className="flex flex-col items-center focus:outline-none cursor-pointer group px-2 py-1"
                  >
                    {/* 10px Blue Dot on Rail Line */}
                    <div
                      className={`w-[12px] h-[12px] rounded-full transition-all duration-300 ring-4 ring-white ${
                        isActive
                          ? "bg-[var(--blue)] scale-125"
                          : "bg-[var(--blue)] opacity-60 group-hover:opacity-100"
                      }`}
                    />

                    {/* Step Number */}
                    <span
                      className={`text-[28px] font-bold leading-none select-none mt-2 transition-all duration-300 ${
                        isActive
                          ? "text-[var(--blue)] scale-105"
                          : "text-[var(--blue)] opacity-60"
                      }`}
                    >
                      {st.num}
                    </span>

                    {/* Step Short Label */}
                    <span
                      className={`text-[12px] font-bold uppercase tracking-wider mt-1 transition-colors ${
                        isActive ? "text-[#0A0A0A]" : "text-[#0A0A0A]/60"
                      }`}
                    >
                      STEP {st.num}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Panel with Fixed Min-Height Equal to the Tallest Panel so the page does not jump */}
          <div
            className="w-full relative bg-white border border-[#E5E5E5] p-6 sm:p-8 transition-all duration-300 shadow-sm"
            style={{ minHeight: `${tallestPanelHeight + 48}px` }}
          >
            {/* Step Number: solid, bold, var(--blue) */}
            <span className="block text-[44px] font-bold text-[var(--blue)] leading-none select-none mb-2">
              {steps[activeStep].num}
            </span>

            {/* Step Title: UPPERCASE bold ink */}
            <h3 className="text-[18px] sm:text-[20px] font-bold text-[#0A0A0A] leading-[1.25] tracking-[-0.01em] uppercase mb-3">
              {steps[activeStep].title}
            </h3>

            {/* Step Text: One-Step blue */}
            <p className="text-[15px] sm:text-[16px] text-[var(--blue)] leading-[1.7] font-normal">
              {steps[activeStep].text}
            </p>

            {/* Navigation buttons: Prev / Next */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#E5E5E5]">
              <button
                type="button"
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
                className={`inline-flex items-center gap-1 text-[13px] font-bold uppercase tracking-wider transition-colors ${
                  activeStep === 0
                    ? "opacity-30 cursor-not-allowed text-[#0A0A0A]"
                    : "text-[var(--blue)] hover:text-[#0A0A0A] cursor-pointer"
                }`}
              >
                <ChevronLeft size={16} /> PREV
              </button>
              <div className="text-[12px] font-bold text-[var(--blue)] uppercase tracking-wider">
                STEP {steps[activeStep].num}
              </div>
              <button
                type="button"
                onClick={() =>
                  setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))
                }
                disabled={activeStep === steps.length - 1}
                className={`inline-flex items-center gap-1 text-[13px] font-bold uppercase tracking-wider transition-colors ${
                  activeStep === steps.length - 1
                    ? "opacity-30 cursor-not-allowed text-[#0A0A0A]"
                    : "text-[var(--blue)] hover:text-[#0A0A0A] cursor-pointer"
                }`}
              >
                NEXT <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Hidden measurement container to accurately compute the tallest panel after fonts ready */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] top-0 pointer-events-none opacity-0 max-w-[480px] p-6 sm:p-8"
        >
          {steps.map((st, i) => (
            <div
              key={i}
              ref={(el) => {
                panelMeasureRefs.current[i] = el;
              }}
              className="space-y-3"
            >
              <div className="text-[44px] font-bold leading-none">{st.num}</div>
              <div className="text-[18px] sm:text-[20px] font-bold uppercase">
                {st.title}
              </div>
              <div className="text-[15px] sm:text-[16px] leading-[1.7]">{st.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS (One-Step Style, No Grey Text, Uppercase Headings) */}
      {data.faq && data.faq.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase mb-8 lg:mb-10">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
              {data.faq.map((faqItem, idx) => {
                const isOpen = openFaqIndex === idx;
                const panelId = `design-faq-panel-${idx}`;
                const headerId = `design-faq-header-${idx}`;

                return (
                  <div key={idx} className="group overflow-hidden">
                    <button
                      id={headerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaqIndex((prev) => (prev === idx ? null : idx))}
                      className="w-full flex items-center justify-between text-left cursor-pointer transition-colors hover:text-[var(--blue)] focus-visible:outline-none py-6 lg:py-8"
                    >
                      <span className="font-bold text-[#0A0A0A] uppercase pr-6 leading-[1.3] text-[16px] md:text-[20px] tracking-[-0.01em] group-hover:text-[var(--blue)] transition-colors">
                        {faqItem.q.toUpperCase()}
                      </span>

                      {/* Plus icon rotating 45° to become × */}
                      <span
                        className="relative flex-shrink-0 flex items-center justify-center w-[22px] h-[22px] transition-transform duration-300 ease-out"
                        style={{
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        }}
                      >
                        <span className="absolute bg-[var(--blue)] w-[18px] h-[2px]" />
                        <span className="absolute bg-[var(--blue)] h-[18px] w-[2px]" />
                      </span>
                    </button>

                    {isOpen && (
                      <div id={panelId} role="region" aria-labelledby={headerId}>
                        <p className="text-[15px] lg:text-[17px] text-[var(--blue)] leading-[1.7] font-normal pt-1 pb-6 max-w-[700px]">
                          {faqItem.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 5. NEXT BANNER: DETAILING SERVICES (strictly capitalized) */}
      <NextBand
        image={IMG.services.design.next}
        nextUrl="/services/detailing/"
        nextTitle="DETAILING SERVICES"
      />
    </article>
  );
};

// 9.29 Detailing — signature: "Drawing register"
export const DetailingLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const rootRef = useRef<HTMLElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLElement>(null);
  // Mobile Accordion state
  const [mobileOpenRow, setMobileOpenRow] = useState<number | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const drawingRows = [
    {
      num: "01",
      name: "Fabrication drawings",
      text: "Detailed part geometry, plate cuts, holes, stiffeners, and weld symbols for the shop floor.",
    },
    {
      num: "02",
      name: "Cutting lists",
      text: "Material nesting plans optimizing steel plate and beam utilization, minimizing scrap waste.",
    },
    {
      num: "03",
      name: "Erection drawings",
      text: "Step-by-step match-marked assembly maps guiding field cranes and bolting crews.",
    },
    {
      num: "04",
      name: "Anchor bolt plans",
      text: "Precise setting templates delivered before foundation pouring to ensure exact alignment.",
    },
  ];

  const note1 = {
    title: "Why Detailing Prevents Delays",
    text: "A hole in the wrong place or a part that is a few millimeters short can stop a whole site. Careful detailing removes these errors before the steel is cut. The same model that produced your 3D view feeds the drawings.",
  };

  const note2 = {
    title: "Detailing for Your Own Design",
    text: "If you or your consultant already have a design, Steel Mind Engineers can prepare the shop drawings from it.",
  };

  // Debounced refresh after fonts/images ready
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const refreshST = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(refreshST).catch(() => {});
    }
    window.addEventListener("resize", refreshST);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", refreshST);
    };
  }, []);

  // Motion setup with gsap.matchMedia
  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const mm = gsap.matchMedia();

    // Reduced motion: show final state at once, no animation
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".register-desktop-line", { scaleX: 1 });
      gsap.set(".register-desktop-row", { opacity: 1, y: 0 });
      gsap.set(".register-mobile-line", { scaleX: 1 });
      gsap.set(".register-mobile-row", { opacity: 1, y: 0 });
      gsap.set(".notes-top-line", { scaleX: 1 });
      gsap.set(".notes-content-box", { opacity: 1, y: 0 });
    });

    // Desktop animations: (min-width: 1024px)
    mm.add("(min-width: 1024px)", () => {
      // 1. Register rows: each line DRAWs (1000ms), then row fades up (RISE, stagger 100ms)
      const dLines = gsap.utils.toArray<HTMLElement>(".register-desktop-line");
      const dRows = gsap.utils.toArray<HTMLElement>(".register-desktop-row");

      gsap.set(dLines, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(dRows, { opacity: 0, y: 24 });

      const dRegTl = gsap.timeline({
        scrollTrigger: {
          trigger: registerRef.current,
          start: "top 85%",
          once: true,
          invalidateOnRefresh: true,
        },
      });

      dRegTl.to(
        dLines,
        {
          scaleX: 1,
          duration: 1.0,
          ease: "E2",
          stagger: 0.08,
          onStart: () => {
            gsap.set(dLines, { willChange: "transform" });
          },
          onComplete: () => {
            gsap.set(dLines, { clearProps: "willChange" });
          },
        },
        0
      );

      dRegTl.to(
        dRows,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "E1",
          stagger: 0.1,
          onStart: () => {
            gsap.set(dRows, { willChange: "transform,opacity" });
          },
          onComplete: () => {
            gsap.set(dRows, { clearProps: "willChange" });
          },
        },
        0.2
      );

      // 2. Notes: DRAW the top lines, then RISE title and text
      const nLines = gsap.utils.toArray<HTMLElement>(".notes-top-line");
      const nBoxes = gsap.utils.toArray<HTMLElement>(".notes-content-box");

      gsap.set(nLines, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(nBoxes, { opacity: 0, y: 24 });

      const nTl = gsap.timeline({
        scrollTrigger: {
          trigger: notesRef.current,
          start: "top 85%",
          once: true,
          invalidateOnRefresh: true,
        },
      });

      nTl.to(
        nLines,
        {
          scaleX: 1,
          duration: 1.0,
          ease: "E2",
          stagger: 0.1,
          onStart: () => {
            gsap.set(nLines, { willChange: "transform" });
          },
          onComplete: () => {
            gsap.set(nLines, { clearProps: "willChange" });
          },
        },
        0
      );

      nTl.to(
        nBoxes,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "E1",
          stagger: 0.1,
          onStart: () => {
            gsap.set(nBoxes, { willChange: "transform,opacity" });
          },
          onComplete: () => {
            gsap.set(nBoxes, { clearProps: "willChange" });
          },
        },
        0.2
      );
    });

    // Mobile animations: (max-width: 1023px)
    mm.add("(max-width: 1023px)", () => {
      // 1. Mobile register rows entrance
      const mLines = gsap.utils.toArray<HTMLElement>(".register-mobile-line");
      const mRows = gsap.utils.toArray<HTMLElement>(".register-mobile-row");

      gsap.set(mLines, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(mRows, { opacity: 0, y: 24 });

      const mRegTl = gsap.timeline({
        scrollTrigger: {
          trigger: registerRef.current,
          start: "top 90%",
          once: true,
          invalidateOnRefresh: true,
        },
      });

      mRegTl.to(
        mLines,
        {
          scaleX: 1,
          duration: 1.0,
          ease: "E2",
          stagger: 0.08,
          onStart: () => {
            gsap.set(mLines, { willChange: "transform" });
          },
          onComplete: () => {
            gsap.set(mLines, { clearProps: "willChange" });
          },
        },
        0
      );

      mRegTl.to(
        mRows,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "E1",
          stagger: 0.1,
          onStart: () => {
            gsap.set(mRows, { willChange: "transform,opacity" });
          },
          onComplete: () => {
            gsap.set(mRows, { clearProps: "willChange" });
          },
        },
        0.2
      );

      // 2. Mobile Notes: DRAW lines, RISE title & text
      const mnLines = gsap.utils.toArray<HTMLElement>(".notes-top-line");
      const mnBoxes = gsap.utils.toArray<HTMLElement>(".notes-content-box");

      gsap.set(mnLines, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(mnBoxes, { opacity: 0, y: 24 });

      const mnTl = gsap.timeline({
        scrollTrigger: {
          trigger: notesRef.current,
          start: "top 90%",
          once: true,
          invalidateOnRefresh: true,
        },
      });

      mnTl.to(
        mnLines,
        {
          scaleX: 1,
          duration: 1.0,
          ease: "E2",
          stagger: 0.1,
          onStart: () => {
            gsap.set(mnLines, { willChange: "transform" });
          },
          onComplete: () => {
            gsap.set(mnLines, { clearProps: "willChange" });
          },
        },
        0
      );

      mnTl.to(
        mnBoxes,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "E1",
          stagger: 0.1,
          onStart: () => {
            gsap.set(mnBoxes, { willChange: "transform,opacity" });
          },
          onComplete: () => {
            gsap.set(mnBoxes, { clearProps: "willChange" });
          },
        },
        0.2
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <article ref={rootRef} className="w-full bg-white text-left pb-0 overflow-x-clip">
      {/* 1. HERO BAND (strictly capitalized in desktop and mobile view) */}
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792202526/Detailing-hero.jpg"
        imageAlt={data.h1.toUpperCase()}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* 2. INTRO: Two columns (5fr / 7fr) on desktop, stacked on mobile */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px] border-b border-[#E5E5E5]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column (5fr): Heading UPPERCASE bold ink */}
          <div className="lg:col-span-5">
            <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
              WHAT DETAILING IS
            </h2>
          </div>

          {/* Right Column (7fr): Text in One-Step blue, regular weight */}
          <div className="lg:col-span-7">
            <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.65] font-normal max-w-[620px]">
              Design decides what the building is. Detailing decides how every part is made. Each column, rafter, plate and bolt hole is drawn with exact size and position.
            </p>
          </div>
        </div>
      </section>

      {/* 3. REGISTER: "DRAWINGS PRODUCED" */}
      <section ref={registerRef} className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px] border-b border-[#E5E5E5]">
        {/* Section Heading: strictly capitalized in desktop and mobile view */}
        <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase mb-10 lg:mb-14">
          DRAWINGS PRODUCED
        </h2>

        {/* DESKTOP REGISTER (lg:block): 4 rows, ~150px high, 1px lines, HOVER-ROW, no bg colour */}
        <div className="hidden lg:block w-full">
          {drawingRows.map((row, idx) => (
            <div key={row.num} className="w-full">
              {/* 1px top line */}
              <div className="register-desktop-line w-full h-[1px] bg-[#E5E5E5]" />

              {/* Row container: ~150px high, no background color */}
              <div className="hover-row group min-h-[150px] flex items-center justify-between py-6 px-4 bg-transparent cursor-default">
                {/* Content container translates right 24px in 600ms E1 on hover */}
                <div className="hover-row-content flex items-center w-full">
                  {/* Number: solid, bold, var(--blue) placed as first column */}
                  <span className="block text-[40px] lg:text-[64px] font-extrabold text-[var(--blue)] leading-none select-none w-[110px] shrink-0">
                    {row.num}
                  </span>

                  {/* Title: bold, ink colour, uppercase */}
                  <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-[1.25] tracking-[-0.01em] w-[260px] shrink-0 pr-6 uppercase">
                    {row.name.toUpperCase()}
                  </h3>

                  {/* Text: One-Step blue, regular weight, 15px / 16px, line-height 1.65 */}
                  <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.65] font-normal flex-1 max-w-[560px] pr-8">
                    {row.text}
                  </p>

                  {/* Far right: 56px round button with arrow-up-right */}
                  <div className="w-[56px] h-[56px] rounded-full border border-[var(--blue)] relative flex items-center justify-center overflow-hidden shrink-0">
                    {/* Blue fill on hover by clip-path circle(0) to circle(100%) in 400ms */}
                    <div className="hover-row-btn-fill absolute inset-0 bg-[var(--blue)] rounded-full" />
                    {/* Arrow travels 8px up-right and back once */}
                    <ArrowUpRight
                      className="hover-row-arrow relative z-10 text-[var(--blue)]"
                      size={24}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom 1px line after the last row */}
              {idx === drawingRows.length - 1 && (
                <div className="register-desktop-line w-full h-[1px] bg-[#E5E5E5]" />
              )}
            </div>
          ))}
        </div>

        {/* MOBILE REGISTER (lg:hidden): ACCORDION - number, title, plus icon, tap opens text */}
        <div className="lg:hidden w-full divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
          {drawingRows.map((row, idx) => {
            const isOpen = mobileOpenRow === idx;
            const panelId = `detailing-register-panel-${idx}`;
            const buttonId = `detailing-register-btn-${idx}`;

            return (
              <div key={row.num} className="register-mobile-row w-full overflow-hidden">
                {/* 1px line */}
                <div className="register-mobile-line w-full h-[1px] bg-[#E5E5E5] -mt-[1px]" />

                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setMobileOpenRow((prev) => (prev === idx ? null : idx))}
                  className="w-full flex items-center justify-between text-left cursor-pointer min-h-[56px] py-4 focus-visible:outline-none"
                >
                  <div className="flex flex-col pr-4">
                    {/* Solid, bold, var(--blue) number above its title, like One-Step */}
                    <span className="block text-[40px] font-extrabold text-[var(--blue)] leading-none select-none mb-1">
                      {row.num}
                    </span>
                    {/* Title: bold ink uppercase */}
                    <h3 className="text-[17px] font-bold text-[#0A0A0A] leading-[1.25] uppercase">
                      {row.name.toUpperCase()}
                    </h3>
                  </div>

                  {/* Plus icon rotating 0 to 45deg over 400ms */}
                  <span
                    className="relative flex-shrink-0 flex items-center justify-center w-[24px] h-[24px] transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)]"
                    style={{
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    <span className="absolute bg-[var(--blue)] w-[20px] h-[2px]" />
                    <span className="absolute bg-[var(--blue)] h-[20px] w-[2px]" />
                  </span>
                </button>

                {/* ACCORDION panel: grid-template-rows 0fr to 1fr over 600ms E1 */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="transition-[grid-template-rows] duration-600 ease-[cubic-bezier(.16,1,.3,1)]"
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                  }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p
                      className="text-[15px] text-[var(--blue)] leading-[1.65] font-normal pb-5 transition-opacity duration-400 ease-out"
                      style={{
                        opacity: isOpen ? 1 : 0,
                        transitionDelay: isOpen ? "150ms" : "0ms",
                      }}
                    >
                      {row.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. NOTES: Two columns (gap 64px), 1px line on top, title, text. Stacked on mobile */}
      <section ref={notesRef} className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px] border-b border-[#E5E5E5]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Column 1: Why Detailing Prevents Delays */}
          <div className="flex flex-col">
            <div className="notes-top-line w-full h-[1px] bg-[#E5E5E5] mb-8" />
            <div className="notes-content-box space-y-4">
              <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-[1.25] uppercase">
                {note1.title.toUpperCase()}
              </h3>
              <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.65] font-normal">
                {note1.text}
              </p>
            </div>
          </div>

          {/* Column 2: Detailing for Your Own Design */}
          <div className="flex flex-col">
            <div className="notes-top-line w-full h-[1px] bg-[#E5E5E5] mb-8" />
            <div className="notes-content-box space-y-4">
              <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-[1.25] uppercase">
                {note2.title.toUpperCase()}
              </h3>
              <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.65] font-normal">
                {note2.text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ (One-Step Style, No Grey Text, Uppercase Heading) */}
      {data.faq && data.faq.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase mb-8 lg:mb-10">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
              {data.faq.map((faqItem, idx) => {
                const isOpen = openFaqIndex === idx;
                const panelId = `detailing-faq-panel-${idx}`;
                const headerId = `detailing-faq-header-${idx}`;

                return (
                  <div key={idx} className="group overflow-hidden">
                    <button
                      id={headerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaqIndex((prev) => (prev === idx ? null : idx))}
                      className="w-full flex items-center justify-between text-left cursor-pointer transition-colors hover:text-[var(--blue)] focus-visible:outline-none py-6 lg:py-8"
                    >
                      <span className="font-bold text-[#0A0A0A] uppercase pr-6 leading-[1.3] text-[16px] lg:text-[20px] tracking-[-0.01em] group-hover:text-[var(--blue)] transition-colors">
                        {faqItem.q.toUpperCase()}
                      </span>

                      {/* Plus icon rotating 0 to 45deg over 400ms */}
                      <span
                        className="relative flex-shrink-0 flex items-center justify-center w-[22px] h-[22px] transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)]"
                        style={{
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        }}
                      >
                        <span className="absolute bg-[var(--blue)] w-[18px] h-[2px]" />
                        <span className="absolute bg-[var(--blue)] h-[18px] w-[2px]" />
                      </span>
                    </button>

                    {isOpen && (
                      <div id={panelId} role="region" aria-labelledby={headerId}>
                        <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.65] font-normal pt-1 pb-6 max-w-[700px]">
                          {faqItem.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 7. NEXT BANNER: FABRICATION SERVICES (strictly capitalized) */}
      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792202527/detailing-next.jpg"
        nextUrl="/services/fabrication/"
        nextTitle="FABRICATION SERVICES"
      />
    </article>
  );
};


// 9.30 Fabrication — signature: "7 Sequential Process Cards"
export const FabricationLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const rootRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const photoBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const textGroupRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Welding element refs
  const weldingCardRef = useRef<HTMLDivElement>(null);
  const weldPathRef = useRef<SVGPathElement>(null);
  const weldDotRefs = useRef<(SVGCircleElement | null)[]>([]);

  // State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const steps = [
    {
      num: "01",
      title: "Material check",
      text: "Plates and sections are checked against the order when they arrive.",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202546/fabrication-1.jpg",
    },
    {
      num: "02",
      title: "Cutting",
      text: "Cutting machines cut each part to the size on the cutting list. Layouts are planned to reduce scrap.",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202548/fabrication-2.jpg",
    },
    {
      num: "03",
      title: "Drilling",
      text: "Bolt holes are drilled or punched at the positions on the drawing.",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202548/Fabrication-3.jpg",
    },
    {
      num: "04",
      title: "Fitting",
      text: "Parts are placed in position and held true before welding starts.",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202550/Fabrication-4.jpg",
    },
    {
      num: "05",
      title: "Welding",
      text: "Welders join the parts. Supervisors inspect each weld.",
      img: "", // Blue panel with SVG weld line & 6 dots
    },
    {
      num: "06",
      title: "Cleaning and painting",
      text: "The part moves to surface preparation and coating. See Cleaning and Painting.",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202552/Fabrication-6.jpg",
    },
    {
      num: "07",
      title: "Marking and packing",
      text: "Each part is marked and packed in erection order.",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202554/fabrication-7.jpg",
    },
  ];

  // Debounced ScrollTrigger refresh
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const refreshST = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(refreshST).catch(() => {});
    }
    window.addEventListener("resize", refreshST);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", refreshST);
    };
  }, []);

  // Motion setup: CURTAIN, RISE, WELDING LOOP (No Stacking)
  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const mm = gsap.matchMedia();

    // 1. Reduced motion: immediate final static state
    mm.add("(prefers-reduced-motion: reduce)", () => {
      photoBoxRefs.current.forEach((box) => box && gsap.set(box, { clipPath: "none" }));
      imgRefs.current.forEach((img) => img && gsap.set(img, { scale: 1 }));
      textGroupRefs.current.forEach((g) => g && gsap.set(g, { opacity: 1, y: 0 }));
      if (weldPathRef.current) gsap.set(weldPathRef.current, { strokeDashoffset: 0, opacity: 1 });
      weldDotRefs.current.forEach((dot) => dot && gsap.set(dot, { scale: 1, opacity: 1 }));
    });

    // 2. Desktop animations: (min-width: 1024px)
    mm.add("(min-width: 1024px)", () => {
      steps.forEach((_, idx) => {
        const card = cardRefs.current[idx];
        const photoBox = photoBoxRefs.current[idx];
        const img = imgRefs.current[idx];
        const textGroup = textGroupRefs.current[idx];
        const isOdd = idx % 2 === 0;

        if (photoBox) {
          const initialClip = isOdd ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
          gsap.set(photoBox, { clipPath: initialClip });
        }
        if (img) gsap.set(img, { scale: 1.06 });
        if (textGroup) gsap.set(textGroup, { opacity: 0, y: 24 });

        if (card) {
          ScrollTrigger.create({
            trigger: card,
            start: "top 85%",
            once: true,
            onEnter: () => {
              if (photoBox) {
                gsap.to(photoBox, {
                  clipPath: "inset(0 0 0 0%)",
                  duration: 0.9,
                  ease: "E2",
                });
              }
              if (img) {
                gsap.to(img, {
                  scale: 1,
                  duration: 1.17,
                  ease: "E1",
                });
              }
              if (textGroup) {
                gsap.to(textGroup, {
                  opacity: 1,
                  y: 0,
                  duration: 0.9,
                  ease: "E1",
                  delay: 0.1,
                });
              }
            },
          });
        }
      });

      // Welding loop
      const weldPath = weldPathRef.current;
      const weldDots = weldDotRefs.current.filter(Boolean) as SVGCircleElement[];
      const weldingCard = weldingCardRef.current;

      if (weldPath && weldingCard) {
        gsap.set(weldPath, { strokeDasharray: 704, strokeDashoffset: 704, opacity: 1 });
        gsap.set(weldDots, { scale: 0, transformOrigin: "center center", opacity: 1 });

        const weldTl = gsap.timeline({
          repeat: -1,
          scrollTrigger: {
            trigger: weldingCard,
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play pause resume pause",
          },
        });

        weldTl.to(weldPath, { strokeDashoffset: 0, duration: 3.0, ease: "none" }, 0);
        weldDots.forEach((dot, dotIdx) => {
          const atTime = (3.0 * (dotIdx + 1)) / 7;
          weldTl.to(dot, { scale: 1, duration: 0.22, ease: "E1" }, atTime - 0.08);
        });
        weldTl.to({}, { duration: 0.6 });
        weldTl.to([weldPath, ...weldDots], { opacity: 0, duration: 0.3, ease: "power1.out" });
        weldTl.set(weldPath, { strokeDashoffset: 704, opacity: 1 });
        weldTl.set(weldDots, { scale: 0, opacity: 1 });
      }
    });

    // 3. Mobile animations: (max-width: 1023px)
    mm.add("(max-width: 1023px)", () => {
      steps.forEach((_, idx) => {
        const card = cardRefs.current[idx];
        const photoBox = photoBoxRefs.current[idx];
        const img = imgRefs.current[idx];
        const textGroup = textGroupRefs.current[idx];

        if (photoBox) gsap.set(photoBox, { clipPath: "inset(0 0 100% 0)" });
        if (img) gsap.set(img, { scale: 1.06 });
        if (textGroup) gsap.set(textGroup, { opacity: 0, y: 20 });

        if (card) {
          ScrollTrigger.create({
            trigger: card,
            start: "top 90%",
            once: true,
            onEnter: () => {
              if (photoBox) {
                gsap.to(photoBox, {
                  clipPath: "inset(0 0 0 0%)",
                  duration: 0.9,
                  ease: "E2",
                });
              }
              if (img) {
                gsap.to(img, {
                  scale: 1,
                  duration: 1.17,
                  ease: "E1",
                });
              }
              if (textGroup) {
                gsap.to(textGroup, {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  ease: "E1",
                  delay: 0.1,
                });
              }
            },
          });
        }
      });

      // Mobile welding loop
      const weldPath = weldPathRef.current;
      const weldDots = weldDotRefs.current.filter(Boolean) as SVGCircleElement[];
      const weldingCard = weldingCardRef.current;

      if (weldPath && weldingCard) {
        gsap.set(weldPath, { strokeDasharray: 704, strokeDashoffset: 704, opacity: 1 });
        gsap.set(weldDots, { scale: 0, transformOrigin: "center center", opacity: 1 });

        const weldTl = gsap.timeline({
          repeat: -1,
          scrollTrigger: {
            trigger: weldingCard,
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play pause resume pause",
          },
        });

        weldTl.to(weldPath, { strokeDashoffset: 0, duration: 3.0, ease: "none" }, 0);
        weldDots.forEach((dot, dotIdx) => {
          const atTime = (3.0 * (dotIdx + 1)) / 7;
          weldTl.to(dot, { scale: 1, duration: 0.22, ease: "E1" }, atTime - 0.08);
        });
        weldTl.to({}, { duration: 0.6 });
        weldTl.to([weldPath, ...weldDots], { opacity: 0, duration: 0.3, ease: "power1.out" });
        weldTl.set(weldPath, { strokeDashoffset: 704, opacity: 1 });
        weldTl.set(weldDots, { scale: 0, opacity: 1 });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <article ref={rootRef} className="w-full bg-white text-left pb-0 overflow-x-clip">
      {/* 1. HERO BAND (strictly capitalized in desktop and mobile view) */}
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792202554/Fabrication-hero.jpg"
        imageAlt={data.h1.toUpperCase()}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* 2. INTRO: "WHAT FABRICATION COVERS" (heading left, text right) */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px] border-b border-[#E5E5E5]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column (5fr): Heading UPPERCASE bold ink */}
          <div className="lg:col-span-5">
            <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
              WHAT FABRICATION COVERS
            </h2>
          </div>

          {/* Right Column (7fr): Text in One-Step blue, regular weight */}
          <div className="lg:col-span-7">
            <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.65] font-normal max-w-[620px]">
              Fabrication turns steel plates and sections into columns, rafters, beams, trusses and custom items. At Steel Mind Engineers, this work happens in one factory, under cover. Engineers send approved drawings to the workshop, and the workshop makes each part exactly as drawn.
            </p>
          </div>
        </div>
      </section>

      {/* 3. 7 PROCESS CARDS (Sequential flow, no stacking) */}
      <section className="relative w-full py-[72px] lg:py-[120px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          {/* Section Heading: strictly capitalized */}
          <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase mb-12 lg:mb-16">
            THE FABRICATION STEPS
          </h2>

          <div className="w-full space-y-12 lg:space-y-20">
            {steps.map((step, idx) => {
              const isOdd = idx % 2 === 0; // 0, 2, 4, 6 (1st, 3rd, 5th, 7th: photo left, text right)
              const isWelding = idx === 4;

              return (
                <div
                  key={step.num}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                    if (isWelding) weldingCardRef.current = el;
                  }}
                  className="w-full bg-white border-t border-[#E5E5E5] pt-8 lg:pt-12"
                >
                  {/* DESKTOP VIEW (lg:grid): Two columns (7fr photo / 5fr text, gap 64px) */}
                  <div className="hidden lg:grid grid-cols-12 gap-16 items-center w-full">
                    {/* Photo Column */}
                    <div className={`col-span-7 ${isOdd ? "order-1" : "order-2"}`}>
                      <div
                        ref={(el) => {
                          photoBoxRefs.current[idx] = el;
                        }}
                        className="w-full overflow-hidden relative shadow-md"
                        style={{
                          aspectRatio: "1024 / 559",
                          backgroundColor: isWelding ? "var(--blue)" : "#0F172A",
                        }}
                      >
                        {isWelding ? (
                          /* Welding card: blue panel with white 2px SVG weld line and 6 small dots */
                          <div className="w-full h-full flex items-center justify-center p-8 select-none">
                            <svg
                              viewBox="0 0 1024 559"
                              className="w-full h-full block overflow-visible"
                            >
                              <path
                                ref={weldPathRef}
                                d="M 160 280 L 864 280"
                                stroke="#FFFFFF"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                fill="none"
                              />
                              {[260, 361, 461, 562, 663, 763].map((cx, dotIdx) => (
                                <circle
                                  key={dotIdx}
                                  ref={(el) => {
                                    weldDotRefs.current[dotIdx] = el;
                                  }}
                                  cx={cx}
                                  cy={280}
                                  r={5}
                                  fill="#FFFFFF"
                                />
                              ))}
                            </svg>
                          </div>
                        ) : (
                          <img
                            ref={(el) => {
                              imgRefs.current[idx] = el;
                            }}
                            src={step.img}
                            alt={step.title}
                            width={1024}
                            height={559}
                            loading={idx === 0 ? "eager" : "lazy"}
                            decoding="async"
                            className="w-full h-full object-cover block"
                          />
                        )}
                      </div>
                    </div>

                    {/* Text Column */}
                    <div
                      ref={(el) => {
                        textGroupRefs.current[idx] = el;
                      }}
                      className={`col-span-5 flex flex-col justify-center text-left ${
                        isOdd ? "order-2" : "order-1"
                      }`}
                    >
                      {/* Number: solid, bold, var(--blue), placed above its title */}
                      <span className="block text-[40px] lg:text-[64px] font-extrabold text-[var(--blue)] leading-none select-none mb-3">
                        {step.num}
                      </span>

                      {/* Title: bold, ink colour, uppercase */}
                      <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-[1.25] mb-4 uppercase">
                        {step.title.toUpperCase()}
                      </h3>

                      {/* Text: One-Step blue, regular weight, 15px/16px, line-height 1.65 */}
                      <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.65] font-normal max-w-[480px]">
                        {step.text}
                      </p>
                    </div>
                  </div>

                  {/* MOBILE VIEW (lg:hidden): Image, heading, sub heading cards */}
                  <div className="lg:hidden w-full flex flex-col space-y-4">
                    {/* Photo Box */}
                    <div
                      ref={(el) => {
                        if (typeof window !== "undefined" && window.innerWidth < 1024) photoBoxRefs.current[idx] = el;
                      }}
                      className="w-full overflow-hidden relative shadow-sm"
                      style={{
                        aspectRatio: "1024 / 559",
                        backgroundColor: isWelding ? "var(--blue)" : "#0F172A",
                      }}
                    >
                      {isWelding ? (
                        <div className="w-full h-full flex items-center justify-center p-4 select-none">
                          <svg
                            viewBox="0 0 1024 559"
                            className="w-full h-full block overflow-visible"
                          >
                            <path
                              d="M 160 280 L 864 280"
                              stroke="#FFFFFF"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              fill="none"
                            />
                            {[260, 361, 461, 562, 663, 763].map((cx, dotIdx) => (
                              <circle
                                key={dotIdx}
                                cx={cx}
                                cy={280}
                                r={5}
                                fill="#FFFFFF"
                              />
                            ))}
                          </svg>
                        </div>
                      ) : (
                        <img
                          ref={(el) => {
                            if (typeof window !== "undefined" && window.innerWidth < 1024) imgRefs.current[idx] = el;
                          }}
                          src={step.img}
                          alt={step.title}
                          width={1024}
                          height={559}
                          loading={idx === 0 ? "eager" : "lazy"}
                          decoding="async"
                          className="w-full h-full object-cover block"
                        />
                      )}
                    </div>

                    {/* Content under Photo */}
                    <div className="pt-2">
                      <span className="block text-[32px] sm:text-[40px] font-extrabold text-[var(--blue)] leading-none select-none mb-2">
                        {step.num}
                      </span>
                      <h3 className="text-[17px] font-bold text-[#0A0A0A] leading-[1.25] mb-2 uppercase">
                        {step.title.toUpperCase()}
                      </h3>
                      <p className="text-[15px] text-[var(--blue)] leading-[1.65] font-normal">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS (One-Step Style, No Grey Text, Uppercase Heading) */}
      {data.faq && data.faq.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase mb-8 lg:mb-10">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
              {data.faq.map((faqItem, idx) => {
                const isOpen = openFaqIndex === idx;
                const panelId = `fab-faq-panel-${idx}`;
                const headerId = `fab-faq-header-${idx}`;

                return (
                  <div key={idx} className="group overflow-hidden">
                    <button
                      id={headerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaqIndex((prev) => (prev === idx ? null : idx))}
                      className="w-full flex items-center justify-between text-left cursor-pointer transition-colors hover:text-[var(--blue)] focus-visible:outline-none py-6 lg:py-8"
                    >
                      <span className="font-bold text-[#0A0A0A] uppercase pr-6 leading-[1.3] text-[16px] lg:text-[20px] tracking-[-0.01em] group-hover:text-[var(--blue)] transition-colors">
                        {faqItem.q.toUpperCase()}
                      </span>

                      {/* Plus icon rotating 0 to 45deg over 400ms */}
                      <span
                        className="relative flex-shrink-0 flex items-center justify-center w-[22px] h-[22px] transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)]"
                        style={{
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        }}
                      >
                        <span className="absolute bg-[var(--blue)] w-[18px] h-[2px]" />
                        <span className="absolute bg-[var(--blue)] h-[18px] w-[2px]" />
                      </span>
                    </button>

                    {isOpen && (
                      <div id={panelId} role="region" aria-labelledby={headerId}>
                        <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.65] font-normal pt-1 pb-6 max-w-[700px]">
                          {faqItem.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 5. NEXT BANNER: CLEANING SERVICES (strictly capitalized) */}
      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792202579/Fabrication-next.jpg"
        nextUrl="/services/cleaning/"
        nextTitle="CLEANING SERVICES"
      />
    </article>
  );
};


// 9.31 Cleaning — signature: "Blast reveal + Surface Contaminants Register"
export const CleaningLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const rootRef = useRef<HTMLElement>(null);
  const blastPhotoBoxRef = useRef<HTMLDivElement>(null);
  const blastImgRef = useRef<HTMLImageElement>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // 5 Contaminants removed (extracted verbatim from page-49.json)
  const contaminants = [
    {
      num: "01",
      title: "Mill scale",
      text: "The hard grey layer that forms on new steel during rolling.",
    },
    {
      num: "02",
      title: "Rust",
      text: "Oxidation developed from outdoor storage and transport.",
    },
    {
      num: "03",
      title: "Oil and grease",
      text: "Machine residues and lubricants from cutting and workshop handling.",
    },
    {
      num: "04",
      title: "Weld spatter and sharp edges",
      text: "Rough deposits, burrs and slag which prevent an even, continuous coat.",
    },
    {
      num: "05",
      title: "Dust and loose dirt",
      text: "Airborne grit and fine particles settling on steel surfaces before priming.",
    },
  ];

  // 3 Method & Quality Checks (extracted verbatim from page-49.json)
  const notes = [
    {
      title: "How the method is chosen",
      text: "The cleaning method follows the coating system. A building for a dry indoor use needs a different surface than a bridge, a tank or a dairy shed that faces moisture. The engineer sets the surface requirement when the coating system is chosen. See Painting.",
    },
    {
      title: "When cleaning happens",
      text: "Cleaning takes place in the factory after welding and before the first coat. Painting follows soon after, so that the clean steel does not rust again. Areas that are damaged in transport or erection are cleaned again before touch-up.",
    },
    {
      title: "What you can check",
      text: "Ask to see the parts before the primer coat. The steel should look clean, dry and free of loose rust, oil and spatter.",
    },
  ];

  // Motion setup: Curtain reveal for blast image
  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const mm = gsap.matchMedia();

    // 1. Reduced motion: immediate final state
    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (blastPhotoBoxRef.current) gsap.set(blastPhotoBoxRef.current, { clipPath: "none" });
      if (blastImgRef.current) gsap.set(blastImgRef.current, { scale: 1 });
    });

    // 2. Desktop animations: (min-width: 1024px)
    mm.add("(min-width: 1024px)", () => {
      if (blastPhotoBoxRef.current) {
        gsap.set(blastPhotoBoxRef.current, { clipPath: "inset(0 100% 0 0)" });
        if (blastImgRef.current) gsap.set(blastImgRef.current, { scale: 1.06 });

        ScrollTrigger.create({
          trigger: blastPhotoBoxRef.current,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(blastPhotoBoxRef.current, {
              clipPath: "inset(0 0% 0 0)",
              duration: 1.0,
              ease: "E2",
            });
            if (blastImgRef.current) {
              gsap.to(blastImgRef.current, {
                scale: 1,
                duration: 1.25,
                ease: "E1",
              });
            }
          },
        });
      }
    });

    // 3. Mobile animations: (max-width: 1023px)
    mm.add("(max-width: 1023px)", () => {
      if (blastPhotoBoxRef.current) {
        gsap.set(blastPhotoBoxRef.current, { clipPath: "inset(0 0 100% 0)" });
        if (blastImgRef.current) gsap.set(blastImgRef.current, { scale: 1.05 });

        ScrollTrigger.create({
          trigger: blastPhotoBoxRef.current,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(blastPhotoBoxRef.current, {
              clipPath: "inset(0 0% 0 0)",
              duration: 0.9,
              ease: "E2",
            });
            if (blastImgRef.current) {
              gsap.to(blastImgRef.current, {
                scale: 1,
                duration: 1.15,
                ease: "E1",
              });
            }
          },
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <article ref={rootRef} className="w-full bg-white text-left pb-0 overflow-x-clip">
      {/* 1. HERO BAND (strictly capitalized in desktop and mobile view) */}
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792202526/Cleaning-hero.jpg"
        imageAlt={data.h1.toUpperCase()}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* 2. INTRO: "WHY CLEANING COMES FIRST" (heading left, text right) */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px] border-b border-[#E5E5E5]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column (5fr): Heading UPPERCASE bold ink */}
          <div className="lg:col-span-5">
            <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
              WHY CLEANING COMES FIRST
            </h2>
          </div>

          {/* Right Column (7fr): Text in One-Step blue, regular weight */}
          <div className="lg:col-span-7">
            <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.65] font-normal max-w-[620px]">
              Paint does not hold well on dirty steel. Mill scale, rust, oil and dust form a weak layer between the steel and the coating. The paint then lifts, blisters or peels. Good cleaning costs little compared with repainting a building.
            </p>
          </div>
        </div>
      </section>

      {/* 3. BLAST REVEAL IMAGE */}
      <section className="w-full max-w-[1280px] mx-auto px-6 lg:px-8 my-10 lg:my-[80px]">
        <div
          ref={blastPhotoBoxRef}
          className="w-full aspect-[16/9] lg:aspect-[21/9] overflow-hidden relative shadow-md bg-[#0F172A]"
        >
          <img
            ref={blastImgRef}
            src="https://res.cloudinary.com/cyfb9slf/image/upload/v1792202526/Cleaning-1.jpg"
            alt="ABRASIVE BLAST CLEANING OF STEEL SURFACE"
            width={1280}
            height={548}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover block"
          />
        </div>
      </section>

      {/* 4. WHAT IS REMOVED (5 Surface Contaminants Register) */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px] border-b border-[#E5E5E5]">
        {/* Section Heading: strictly capitalized */}
        <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase mb-12 lg:mb-16">
          WHAT IS REMOVED
        </h2>

        {/* 5-item responsive grid with numbers, titles, and text */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {contaminants.map((item) => (
            <div key={item.num} className="border-t border-[#E5E5E5] pt-6 lg:pt-8 flex flex-col justify-start text-left">
              {/* Number: solid, bold, var(--blue), placed above its title */}
              <span className="block text-[40px] lg:text-[64px] font-extrabold text-[var(--blue)] leading-none select-none mb-3">
                {item.num}
              </span>

              {/* Title: bold, ink colour, uppercase */}
              <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-[1.25] mb-3 uppercase">
                {item.title.toUpperCase()}
              </h3>

              {/* Text: One-Step blue, regular weight, 15px/16px */}
              <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.65] font-normal">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. METHOD & QUALITY CHECKS (Three Columns with 1px top line) */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px] border-b border-[#E5E5E5]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {notes.map((note, idx) => (
            <div key={idx} className="flex flex-col border-t border-[#E5E5E5] pt-6 lg:pt-8 text-left">
              {/* Title: bold, ink colour, uppercase */}
              <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-[1.25] mb-4 uppercase">
                {note.title.toUpperCase()}
              </h3>

              {/* Text: One-Step blue, regular weight */}
              <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.65] font-normal">
                {note.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS (One-Step Style, No Grey Text, Uppercase Heading) */}
      {data.faq && data.faq.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase mb-8 lg:mb-10">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
              {data.faq.map((faqItem, idx) => {
                const isOpen = openFaqIndex === idx;
                const panelId = `cleaning-faq-panel-${idx}`;
                const headerId = `cleaning-faq-header-${idx}`;

                return (
                  <div key={idx} className="group overflow-hidden">
                    <button
                      id={headerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaqIndex((prev) => (prev === idx ? null : idx))}
                      className="w-full flex items-center justify-between text-left cursor-pointer transition-colors hover:text-[var(--blue)] focus-visible:outline-none py-6 lg:py-8"
                    >
                      <span className="font-bold text-[#0A0A0A] uppercase pr-6 leading-[1.3] text-[16px] lg:text-[20px] tracking-[-0.01em] group-hover:text-[var(--blue)] transition-colors">
                        {faqItem.q.toUpperCase()}
                      </span>

                      {/* Plus icon rotating 0 to 45deg over 400ms */}
                      <span
                        className="relative flex-shrink-0 flex items-center justify-center w-[22px] h-[22px] transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)]"
                        style={{
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        }}
                      >
                        <span className="absolute bg-[var(--blue)] w-[18px] h-[2px]" />
                        <span className="absolute bg-[var(--blue)] h-[18px] w-[2px]" />
                      </span>
                    </button>

                    {isOpen && (
                      <div id={panelId} role="region" aria-labelledby={headerId}>
                        <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.65] font-normal pt-1 pb-6 max-w-[700px]">
                          {faqItem.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 7. NEXT BANNER: PAINTING SERVICES (strictly capitalized) */}
      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792202524/Cleaning-next.jpg"
        nextUrl="/services/painting/"
        nextTitle="PAINTING SERVICES"
      />
    </article>
  );
};

// 9.32 Painting — signature: "Paint-wipe long-form & 6 Two-Column Chapters"
const PAINTING_IMAGES = {
  hero: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202584/Painting-hero.jpg",
  primer: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202581/Painting-1.jpg",
  intermediate: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202584/Painting-2.jpg",
  topcoat: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202582/Painting-3.jpg",
  next: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202588/Painting-next.jpg",
};

const CHOOSING_ITEMS = [
  {
    num: "01",
    title: "DRY INDOOR BUILDINGS",
    text: "A primer and a finish coat are usually enough.",
  },
  {
    num: "02",
    title: "OUTDOOR STRUCTURES",
    text: "Bridges, gantries and open sheds need a stronger system, because rain and sun reach the steel.",
  },
  {
    num: "03",
    title: "DAIRY AND POULTRY SHEDS",
    text: "Moisture and animal waste attack steel. Choose a system built for damp, dirty air.",
  },
  {
    num: "04",
    title: "GRAIN STORES AND TANKS",
    text: "Dust, moisture and stored goods call for a coating that suits the contents.",
  },
];

export const PaintingLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const rootRef = useRef<HTMLElement>(null);
  const wipeBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wipeImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const wipeLineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chapterLineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chapterTextRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chooseItemLineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // State
  const [mobileOpenItem, setMobileOpenItem] = useState<number | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Debounced ScrollTrigger refresh after images and fonts are loaded
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const refreshST = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(refreshST).catch(() => {});
    }

    const imgUrls = [
      PAINTING_IMAGES.primer,
      PAINTING_IMAGES.intermediate,
      PAINTING_IMAGES.topcoat,
    ];
    imgUrls.forEach((url) => {
      const im = new Image();
      im.src = cld(url, 1920);
      if (im.decode) {
        im.decode().then(refreshST).catch(() => {});
      } else {
        im.onload = refreshST;
      }
    });

    window.addEventListener("resize", refreshST);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", refreshST);
    };
  }, []);

  // Motion setup with gsap.matchMedia
  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const mm = gsap.matchMedia();

    // 1. Reduced motion: immediate final state, no animation
    mm.add("(prefers-reduced-motion: reduce)", () => {
      chapterLineRefs.current.forEach((line) => line && gsap.set(line, { scaleX: 1 }));
      chooseItemLineRefs.current.forEach((line) => line && gsap.set(line, { scaleX: 1 }));
      chapterTextRefs.current.forEach((tg) => {
        if (tg) {
          const ps = tg.querySelectorAll<HTMLElement>(".chapter-p");
          gsap.set(ps, { opacity: 1, y: 0 });
        }
      });
      wipeBoxRefs.current.forEach((box) => box && gsap.set(box, { clipPath: "none" }));
      wipeImgRefs.current.forEach((img) => img && gsap.set(img, { scale: 1 }));
      wipeLineRefs.current.forEach((line) => line && gsap.set(line, { opacity: 0 }));
    });

    // 2. Desktop animations: (min-width: 1024px)
    mm.add("(min-width: 1024px)", () => {
      // a. Chapter lines DRAW (scaleX 0 to 1, transform-origin left, 1000ms E2)
      chapterLineRefs.current.forEach((line) => {
        if (!line) return;
        gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(line, {
          scaleX: 1,
          duration: 1.0,
          ease: "E2",
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
          },
          onStart: () => gsap.set(line, { willChange: "transform" }),
          onComplete: () => gsap.set(line, { clearProps: "willChange" }),
        });
      });

      // b. Chapter text RISE (paragraphs, y 24 to 0, opacity 0 to 1, 900ms E1, stagger 90ms)
      chapterTextRefs.current.forEach((tg) => {
        if (!tg) return;
        const ps = tg.querySelectorAll<HTMLElement>(".chapter-p");
        if (ps.length === 0) return;
        gsap.set(ps, { opacity: 0, y: 24 });
        gsap.to(ps, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "E1",
          stagger: 0.09,
          scrollTrigger: {
            trigger: tg,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
          },
          onStart: () => gsap.set(ps, { willChange: "transform,opacity" }),
          onComplete: () => gsap.set(ps, { clearProps: "willChange" }),
        });
      });

      // c. Choosing by Use items DRAW
      chooseItemLineRefs.current.forEach((line) => {
        if (!line) return;
        gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(line, {
          scaleX: 1,
          duration: 1.0,
          ease: "E2",
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
          },
          onStart: () => gsap.set(line, { willChange: "transform" }),
          onComplete: () => gsap.set(line, { clearProps: "willChange" }),
        });
      });

      // d. Paint wipes (3 photos)
      wipeBoxRefs.current.forEach((box, i) => {
        const img = wipeImgRefs.current[i];
        const line = wipeLineRefs.current[i];
        if (!box || !img || !line) return;

        gsap.set(box, { clipPath: "inset(0 0 100% 0)" });
        gsap.set(img, { scale: 1.06 });
        gsap.set(line, { y: 0, opacity: 1 });

        const targetY = box.offsetHeight || Math.round(box.offsetWidth * (559 / 1024)) || 350;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: box,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
          },
          onStart: () => {
            gsap.set([box, img, line], { willChange: "transform,clip-path,opacity" });
          },
          onComplete: () => {
            gsap.set([box, img, line], { clearProps: "willChange" });
          },
        });

        tl.to(box, { clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "E2" }, 0);
        tl.fromTo(line, { y: 0, opacity: 1 }, { y: targetY, duration: 1.4, ease: "E2" }, 0);
        tl.to(line, { opacity: 0, duration: 0.3, ease: "power1.out" }, 1.1);
        tl.fromTo(img, { scale: 1.06 }, { scale: 1, duration: 1.8, ease: "E1" }, 0);
      });
    });

    // 3. Mobile animations: (max-width: 1023px)
    mm.add("(max-width: 1023px)", () => {
      // a. Chapter lines DRAW
      chapterLineRefs.current.forEach((line) => {
        if (!line) return;
        gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(line, {
          scaleX: 1,
          duration: 1.0,
          ease: "E2",
          scrollTrigger: {
            trigger: line,
            start: "top 90%",
            once: true,
            invalidateOnRefresh: true,
          },
          onStart: () => gsap.set(line, { willChange: "transform" }),
          onComplete: () => gsap.set(line, { clearProps: "willChange" }),
        });
      });

      // b. Chapter text RISE
      chapterTextRefs.current.forEach((tg) => {
        if (!tg) return;
        const ps = tg.querySelectorAll<HTMLElement>(".chapter-p");
        if (ps.length === 0) return;
        gsap.set(ps, { opacity: 0, y: 20 });
        gsap.to(ps, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "E1",
          stagger: 0.08,
          scrollTrigger: {
            trigger: tg,
            start: "top 90%",
            once: true,
            invalidateOnRefresh: true,
          },
          onStart: () => gsap.set(ps, { willChange: "transform,opacity" }),
          onComplete: () => gsap.set(ps, { clearProps: "willChange" }),
        });
      });

      // c. Mobile Paint wipes (3 photos)
      wipeBoxRefs.current.forEach((box, i) => {
        const img = wipeImgRefs.current[i];
        const line = wipeLineRefs.current[i];
        if (!box || !img || !line) return;

        gsap.set(box, { clipPath: "inset(0 0 100% 0)" });
        gsap.set(img, { scale: 1.06 });
        gsap.set(line, { y: 0, opacity: 1 });

        const targetY = box.offsetHeight || Math.round(box.offsetWidth * (559 / 1024)) || 220;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: box,
            start: "top 90%",
            once: true,
            invalidateOnRefresh: true,
          },
          onStart: () => {
            gsap.set([box, img, line], { willChange: "transform,clip-path,opacity" });
          },
          onComplete: () => {
            gsap.set([box, img, line], { clearProps: "willChange" });
          },
        });

        tl.to(box, { clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "E2" }, 0);
        tl.fromTo(line, { y: 0, opacity: 1 }, { y: targetY, duration: 1.4, ease: "E2" }, 0);
        tl.to(line, { opacity: 0, duration: 0.3, ease: "power1.out" }, 1.1);
        tl.fromTo(img, { scale: 1.06 }, { scale: 1, duration: 1.8, ease: "E1" }, 0);
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <article ref={rootRef} className="w-full bg-white text-left pb-0 overflow-x-clip">
      {/* 1. HERO BAND (strictly capitalized in desktop and mobile view) */}
      <HeroBand
        variant="immersive"
        imageSrc={PAINTING_IMAGES.hero}
        imageAlt={data.h1.toUpperCase()}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* CHAPTER 1: WHY THE COATING MATTERS */}
      <div className="relative w-full">
        <div className="py-[56px] lg:py-[88px] max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-[96px] items-start">
            <div className="lg:col-span-4 lg:sticky top-[calc(var(--nav-offset)+24px)] self-start">
              <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
                WHY THE COATING MATTERS
              </h2>
            </div>
            <div
              ref={(el) => {
                chapterTextRefs.current[0] = el;
              }}
              className="lg:col-span-8 max-w-[640px] text-left"
            >
              <p className="chapter-p text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.6] lg:leading-[1.7] font-normal">
                Steel rusts when it meets water and air. In Pakistan, heat, rain, humid air and dust all speed up the damage. A good coating is the cheapest protection a steel building can have.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CHAPTER 2: WHAT A COATING SYSTEM IS + PRIMER PHOTO */}
      <div className="relative w-full">
        <div
          ref={(el) => {
            chapterLineRefs.current[0] = el;
          }}
          className="chapter-line w-full h-[1px] bg-[#E5E5E5]"
        />
        <div className="py-[56px] lg:py-[88px] max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-[96px] items-start">
            <div className="lg:col-span-4 lg:sticky top-[calc(var(--nav-offset)+24px)] self-start">
              <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
                WHAT A COATING SYSTEM IS
              </h2>
            </div>
            <div
              ref={(el) => {
                chapterTextRefs.current[1] = el;
              }}
              className="lg:col-span-8 max-w-[640px] text-left"
            >
              <p className="chapter-p text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.6] lg:leading-[1.7] font-normal">
                A coating system is a set of layers. The primer bonds to the steel and gives the first protection. Intermediate and top coats add thickness, resist weather and give the final color. Steel Mind Engineers selects the number of coats and the paint type from the use of the structure.
              </p>

              {/* Photo 1: Primer (48px under the text with Paint Wipe) */}
              <div
                ref={(el) => {
                  wipeBoxRefs.current[0] = el;
                }}
                className="paint-wipe-box relative w-full overflow-hidden shadow-md mt-12 bg-slate-900"
                style={{
                  aspectRatio: "1024 / 559",
                  clipPath: "inset(0 0 100% 0)",
                }}
              >
                <img
                  ref={(el) => {
                    wipeImgRefs.current[0] = el;
                  }}
                  src={cld(PAINTING_IMAGES.primer, 1920)}
                  alt="STEEL RAFTERS WITH A RED-OXIDE PRIMER COAT"
                  width={1024}
                  height={559}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover block"
                  style={{ transform: "scale(1.06)" }}
                />
                <div
                  ref={(el) => {
                    wipeLineRefs.current[0] = el;
                  }}
                  className="paint-wipe-line absolute left-0 right-0 top-0 h-[4px] bg-[var(--blue)] pointer-events-none z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHAPTER 3: CHOOSING BY USE */}
      <div className="relative w-full">
        <div
          ref={(el) => {
            chapterLineRefs.current[1] = el;
          }}
          className="chapter-line w-full h-[1px] bg-[#E5E5E5]"
        />
        <div className="py-[56px] lg:py-[88px] max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-[96px] items-start">
            <div className="lg:col-span-4 lg:sticky top-[calc(var(--nav-offset)+24px)] self-start">
              <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
                CHOOSING BY USE
              </h2>
            </div>
            <div className="lg:col-span-8 max-w-[640px] text-left">
              {/* Desktop: 2x2 Grid with 1px top line (turns blue on hover), number, title, text */}
              <div className="hidden lg:grid grid-cols-2 gap-8 lg:gap-12 w-full">
                {CHOOSING_ITEMS.map((item, i) => (
                  <div key={item.num} className="group flex flex-col items-start text-left">
                    {/* 1px top line (turns blue on hover) */}
                    <div
                      ref={(el) => {
                        chooseItemLineRefs.current[i] = el;
                      }}
                      className="choose-item-line w-full h-[1px] bg-[#E5E5E5] group-hover:bg-[var(--blue)] transition-colors duration-300 mb-6"
                    />
                    {/* Number: solid, bold, var(--blue), placed above its title */}
                    <span className="block text-[40px] lg:text-[64px] font-extrabold text-[var(--blue)] leading-none select-none mb-3">
                      {item.num}
                    </span>
                    {/* Title: bold, ink colour, uppercase as per critical instruction */}
                    <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-[1.25] uppercase mb-3">
                      {item.title}
                    </h3>
                    {/* Text: One-Step blue, regular weight */}
                    <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.6] lg:leading-[1.7] font-normal">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mobile: 4 Accordion rows (number, title, plus icon, text on tap) */}
              <div className="lg:hidden w-full divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
                {CHOOSING_ITEMS.map((item, i) => {
                  const isOpen = mobileOpenItem === i;
                  const panelId = `paint-choose-panel-${i}`;
                  const btnId = `paint-choose-btn-${i}`;

                  return (
                    <div key={item.num} className="w-full overflow-hidden">
                      <button
                        id={btnId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setMobileOpenItem((prev) => (prev === i ? null : i))}
                        className="w-full flex items-center justify-between text-left cursor-pointer min-h-[48px] py-4 focus-visible:outline-none"
                      >
                        <div className="flex flex-col pr-4">
                          {/* Number: solid, bold, var(--blue) */}
                          <span className="block text-[36px] sm:text-[40px] font-extrabold text-[var(--blue)] leading-none select-none mb-1">
                            {item.num}
                          </span>
                          {/* Title: bold ink uppercase */}
                          <h3 className="text-[17px] font-bold text-[#0A0A0A] leading-[1.25] uppercase">
                            {item.title}
                          </h3>
                        </div>

                        {/* Plus icon rotating 0 to 45deg over 400ms */}
                        <span
                          className="relative flex-shrink-0 flex items-center justify-center w-[24px] h-[24px] transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)]"
                          style={{
                            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                          }}
                        >
                          <span className="absolute bg-[var(--blue)] w-[20px] h-[2px]" />
                          <span className="absolute bg-[var(--blue)] h-[20px] w-[2px]" />
                        </span>
                      </button>

                      {/* ACCORDION panel: grid-template-rows 0fr to 1fr over 600ms E1 */}
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={btnId}
                        className="transition-[grid-template-rows] duration-600 ease-[cubic-bezier(.16,1,.3,1)]"
                        style={{
                          display: "grid",
                          gridTemplateRows: isOpen ? "1fr" : "0fr",
                        }}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <p
                            className="text-[15px] text-[var(--blue)] leading-[1.6] font-normal pb-5 transition-opacity duration-400 ease-out"
                            style={{
                              opacity: isOpen ? 1 : 0,
                              transitionDelay: isOpen ? "150ms" : "0ms",
                            }}
                          >
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHAPTER 4: HOW PAINTING IS DONE + INTERMEDIATE COAT PHOTO */}
      <div className="relative w-full">
        <div
          ref={(el) => {
            chapterLineRefs.current[2] = el;
          }}
          className="chapter-line w-full h-[1px] bg-[#E5E5E5]"
        />
        <div className="py-[56px] lg:py-[88px] max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-[96px] items-start">
            <div className="lg:col-span-4 lg:sticky top-[calc(var(--nav-offset)+24px)] self-start">
              <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
                HOW PAINTING IS DONE
              </h2>
            </div>
            <div
              ref={(el) => {
                chapterTextRefs.current[2] = el;
              }}
              className="lg:col-span-8 max-w-[640px] text-left"
            >
              <p className="chapter-p text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.6] lg:leading-[1.7] font-normal">
                Steel is cleaned first. The primer goes on soon after cleaning. Later coats follow in order, and each coat is left to dry as the paint maker requires. Coating thickness is checked against the specification. Bolted joints are left ready for site touch-up.
              </p>

              {/* Photo 2: Intermediate Coat (48px under text with Paint Wipe) */}
              <div
                ref={(el) => {
                  wipeBoxRefs.current[1] = el;
                }}
                className="paint-wipe-box relative w-full overflow-hidden shadow-md mt-12 bg-slate-900"
                style={{
                  aspectRatio: "1024 / 559",
                  clipPath: "inset(0 0 100% 0)",
                }}
              >
                <img
                  ref={(el) => {
                    wipeImgRefs.current[1] = el;
                  }}
                  src={cld(PAINTING_IMAGES.intermediate, 1920)}
                  alt="INTERMEDIATE EPOXY COAT APPLICATION ON STEEL MEMBERS"
                  width={1024}
                  height={559}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover block"
                  style={{ transform: "scale(1.06)" }}
                />
                <div
                  ref={(el) => {
                    wipeLineRefs.current[1] = el;
                  }}
                  className="paint-wipe-line absolute left-0 right-0 top-0 h-[4px] bg-[var(--blue)] pointer-events-none z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHAPTER 5: COLORS + TOP COAT PHOTO */}
      <div className="relative w-full">
        <div
          ref={(el) => {
            chapterLineRefs.current[3] = el;
          }}
          className="chapter-line w-full h-[1px] bg-[#E5E5E5]"
        />
        <div className="py-[56px] lg:py-[88px] max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-[96px] items-start">
            <div className="lg:col-span-4 lg:sticky top-[calc(var(--nav-offset)+24px)] self-start">
              <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
                COLORS
              </h2>
            </div>
            <div
              ref={(el) => {
                chapterTextRefs.current[3] = el;
              }}
              className="lg:col-span-8 max-w-[640px] text-left"
            >
              <p className="chapter-p text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.6] lg:leading-[1.7] font-normal">
                Tell the engineer your color choice at the design stage. Sheeting and trims can follow a color scheme that suits your brand.
              </p>

              {/* Photo 3: Top Coat (48px under text with Paint Wipe) */}
              <div
                ref={(el) => {
                  wipeBoxRefs.current[2] = el;
                }}
                className="paint-wipe-box relative w-full overflow-hidden shadow-md mt-12 bg-slate-900"
                style={{
                  aspectRatio: "1024 / 559",
                  clipPath: "inset(0 0 100% 0)",
                }}
              >
                <img
                  ref={(el) => {
                    wipeImgRefs.current[2] = el;
                  }}
                  src={cld(PAINTING_IMAGES.topcoat, 1920)}
                  alt="FINAL POLYURETHANE TOP COAT FINISH"
                  width={1024}
                  height={559}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover block"
                  style={{ transform: "scale(1.06)" }}
                />
                <div
                  ref={(el) => {
                    wipeLineRefs.current[2] = el;
                  }}
                  className="paint-wipe-line absolute left-0 right-0 top-0 h-[4px] bg-[var(--blue)] pointer-events-none z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHAPTER 6: AFTER ERECTION */}
      <div className="relative w-full">
        <div
          ref={(el) => {
            chapterLineRefs.current[4] = el;
          }}
          className="chapter-line w-full h-[1px] bg-[#E5E5E5]"
        />
        <div className="py-[56px] lg:py-[88px] max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-[96px] items-start">
            <div className="lg:col-span-4 lg:sticky top-[calc(var(--nav-offset)+24px)] self-start">
              <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
                AFTER ERECTION
              </h2>
            </div>
            <div
              ref={(el) => {
                chapterTextRefs.current[4] = el;
              }}
              className="lg:col-span-8 max-w-[640px] text-left"
            >
              <p className="chapter-p text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.6] lg:leading-[1.7] font-normal">
                Parts can be scratched in transport and lifting. Crews touch up damaged areas on site. A building also needs repainting after some years, which Steel Mind Engineers can do. See After Sale Services.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white border-t border-[#E5E5E5] py-[72px] lg:py-[120px]">
          <div className="max-w-[800px] mx-auto px-6 lg:px-8 text-left">
            <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase mb-8 lg:mb-10">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
              {data.faq.map((faqItem, idx) => {
                const isOpen = openFaqIndex === idx;
                const panelId = `painting-faq-panel-${idx}`;
                const headerId = `painting-faq-header-${idx}`;

                return (
                  <div key={idx} className="group overflow-hidden">
                    <button
                      id={headerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaqIndex((prev) => (prev === idx ? null : idx))}
                      className="w-full flex items-center justify-between text-left cursor-pointer transition-colors hover:text-[var(--blue)] focus-visible:outline-none min-h-[48px] py-6 lg:py-8"
                    >
                      <span className="font-bold text-[#0A0A0A] uppercase pr-6 leading-[1.3] text-[16px] lg:text-[20px] tracking-[-0.01em] group-hover:text-[var(--blue)] transition-colors">
                        {faqItem.q.toUpperCase()}
                      </span>

                      {/* Plus icon rotating 0 to 45deg over 400ms */}
                      <span
                        className="relative flex-shrink-0 flex items-center justify-center w-[22px] h-[22px] transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)]"
                        style={{
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        }}
                      >
                        <span className="absolute bg-[var(--blue)] w-[18px] h-[2px]" />
                        <span className="absolute bg-[var(--blue)] h-[18px] w-[2px]" />
                      </span>
                    </button>

                    {isOpen && (
                      <div id={panelId} role="region" aria-labelledby={headerId}>
                        <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.65] font-normal pt-1 pb-6 max-w-[700px]">
                          {faqItem.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Next Banner: Erection Services */}
      <NextBand
        image={PAINTING_IMAGES.next}
        nextUrl="/services/erection/"
        nextTitle="ERECTION SERVICES"
      />
    </article>
  );
};

// 9.33 Erection — signature: "Crane-hook rail"
export const ErectionLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const stepsSec = sections.find((s) => s.items && s.items.length >= 6) || sections[0];
  const steps = stepsSec?.items || [
    { name: "Site check", text: "Verifying foundation survey coordinates, anchor bolt elevations and crane access paths." },
    { name: "Lifting plan", text: "Rigging calculations determining crane capacity, radius, and tandem lift safety." },
    { name: "Frames", text: "Standing primary portal frame columns and assembling rafters into rigid bents." },
    { name: "Bracing and secondary members", text: "Installing cable bracing, fly braces, purlins and girts to lock structural geometry." },
    { name: "Alignment", text: "Plumb line laser alignment and torquing high-strength connection bolts." },
    { name: "Sheeting and accessories", text: "Fastening insulated roof and wall sandwich panels, ridge monitors, and skylights." },
    { name: "Touch-up and handover", text: "Paint coating inspection, field bolt touch-up, and client commissioning sign-off." },
  ];

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [activeSteps, setActiveSteps] = useState<boolean[]>(() =>
    Array(steps.length).fill(prefersReduced)
  );
  const activeStepsRef = useRef<boolean[]>(Array(steps.length).fill(prefersReduced));

  useEffect(() => {
    if (prefersReduced) {
      setActiveSteps(Array(steps.length).fill(true));
      return;
    }

    let animFrame: number | null = null;
    let isRunning = false;

    const checkActive = () => {
      const target = window.innerHeight * 0.5;
      let changed = false;
      const current = [...activeStepsRef.current];

      itemRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const isAct = rect.top <= target;
        if (isAct !== current[idx]) {
          current[idx] = isAct;
          changed = true;
        }
      });

      if (changed) {
        activeStepsRef.current = current;
        setActiveSteps(current);
      }
      isRunning = false;
    };

    const onScroll = () => {
      if (isRunning) return;
      isRunning = true;
      animFrame = requestAnimationFrame(checkActive);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (animFrame !== null) cancelAnimationFrame(animFrame);
    };
  }, [prefersReduced, steps.length]);

  return (
    <article className="w-full bg-white text-left pb-0 overflow-x-clip">
      {/* 1. HERO BAND (strictly capitalized in desktop and mobile view) */}
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.erection.hero}
        imageAlt={data.h1.toUpperCase()}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* 2. INTRO: Two columns on desktop, stacked on mobile */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px] border-b border-[#E5E5E5]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Heading UPPERCASE bold ink */}
          <div className="lg:col-span-5">
            <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
              WHAT ERECTION INCLUDES
            </h2>
          </div>

          {/* Right Column: Text in One-Step blue, regular weight */}
          <div className="lg:col-span-7 space-y-4">
            <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.6] lg:leading-[1.7] font-normal max-w-[620px]">
              {introPs[0] || "Erection covers lifting the columns and rafters, bolting the frames, fitting purlins, girts and bracing, and then fitting the roof and wall sheets, doors and accessories. For mezzanines and bridges, it also covers deck, stairs and handrails."}
            </p>
            {introPs[1] && (
              <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.6] lg:leading-[1.7] font-normal max-w-[620px]">
                {introPs[1]}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 3. CRANE HOOK RAIL (THE ERECTION STEPS) */}
      <section className="w-full py-[72px] lg:py-[120px] border-b border-[#E5E5E5]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 mb-12 lg:mb-16">
          <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
            THE ERECTION STEPS
          </h2>
        </div>

        {/* Desktop Vertical Center Line with alternating steps */}
        <div className="hidden lg:block relative max-w-[1280px] mx-auto px-8">
          {/* 2px vertical center rail line */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-[#E5E5E5]" />
          
          <div className="space-y-16 lg:space-y-24">
            {steps.map((st, idx) => {
              const isEven = idx % 2 === 1;
              const isActive = activeSteps[idx] || prefersReduced;
              const numStr = String(idx + 1).padStart(2, "0");

              return (
                <div
                  key={idx}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  className="grid grid-cols-12 gap-10 items-center relative"
                >
                  {/* Left Column (col-span-5) */}
                  <div className="col-span-5 order-1">
                    {!isEven ? (
                      <div className="flex flex-col items-start text-left">
                        {/* Number: solid, bold, var(--blue) when active and rgba(30,58,138,.35) when inactive, no stroke, no outline, font-variant-numeric: tabular-nums */}
                        <span
                          className="block text-[40px] lg:text-[64px] font-extrabold leading-none select-none mb-3"
                          style={{
                            fontVariantNumeric: "tabular-nums",
                            color: isActive ? "var(--blue)" : "rgba(30, 58, 138, 0.35)",
                            transition: prefersReduced ? "none" : "color 300ms ease-out",
                          }}
                        >
                          {numStr}
                        </span>

                        {/* Title: bold, ink colour, uppercase */}
                        <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-[1.25] tracking-[-0.01em] uppercase mb-3">
                          {st.name.toUpperCase()}
                        </h3>

                        {/* Text: One-Step blue, regular weight */}
                        <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.6] lg:leading-[1.7] font-normal max-w-[460px]">
                          {st.text}
                        </p>
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>

                  {/* Center Dot (col-span-2) */}
                  <div className="col-span-2 flex justify-center order-2 relative z-10">
                    <div
                      className="w-[14px] h-[14px] rounded-full ring-4 ring-white shadow-sm transition-colors duration-300"
                      style={{
                        backgroundColor: isActive ? "var(--blue)" : "#FFFFFF",
                        border: `2px solid ${isActive ? "var(--blue)" : "#E5E5E5"}`,
                      }}
                    />
                  </div>

                  {/* Right Column (col-span-5) */}
                  <div className="col-span-5 order-3">
                    {isEven ? (
                      <div className="flex flex-col items-start text-left">
                        {/* Number: solid, bold, var(--blue) when active and rgba(30,58,138,.35) when inactive */}
                        <span
                          className="block text-[40px] lg:text-[64px] font-extrabold leading-none select-none mb-3"
                          style={{
                            fontVariantNumeric: "tabular-nums",
                            color: isActive ? "var(--blue)" : "rgba(30, 58, 138, 0.35)",
                            transition: prefersReduced ? "none" : "color 300ms ease-out",
                          }}
                        >
                          {numStr}
                        </span>

                        {/* Title: bold, ink colour, uppercase */}
                        <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-[1.25] tracking-[-0.01em] uppercase mb-3">
                          {st.name.toUpperCase()}
                        </h3>

                        {/* Text: One-Step blue, regular weight */}
                        <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.6] lg:leading-[1.7] font-normal max-w-[460px]">
                          {st.text}
                        </p>
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Left Rail */}
        <div className="lg:hidden relative pl-8 border-l-2 border-[var(--blue)] space-y-12 max-w-[1280px] mx-auto px-6 ml-6">
          {steps.map((st, idx) => {
            const isActive = activeSteps[idx] || prefersReduced;
            const numStr = String(idx + 1).padStart(2, "0");

            return (
              <div
                key={idx}
                ref={(el) => {
                  if (typeof window !== "undefined" && window.innerWidth < 1024) {
                    itemRefs.current[idx] = el;
                  }
                }}
                className="relative space-y-2 text-left"
              >
                {/* Dot on left rail */}
                <div
                  className="absolute -left-[41px] top-2 w-[14px] h-[14px] rounded-full ring-4 ring-white shadow-sm transition-colors duration-300"
                  style={{
                    backgroundColor: isActive ? "var(--blue)" : "#FFFFFF",
                    border: `2px solid ${isActive ? "var(--blue)" : "#E5E5E5"}`,
                  }}
                />

                {/* Number: solid, bold, var(--blue) when active and rgba(30,58,138,.35) when inactive, placed above title */}
                <span
                  className="block text-[40px] font-extrabold leading-none select-none mb-1"
                  style={{
                    fontVariantNumeric: "tabular-nums",
                    color: isActive ? "var(--blue)" : "rgba(30, 58, 138, 0.35)",
                    transition: prefersReduced ? "none" : "color 300ms ease-out",
                  }}
                >
                  {numStr}
                </span>

                {/* Title: bold, ink colour, uppercase */}
                <h3 className="text-[17px] font-bold text-[#0A0A0A] leading-[1.25] uppercase">
                  {st.name.toUpperCase()}
                </h3>

                {/* Text: One-Step blue, regular weight */}
                <p className="text-[15px] text-[var(--blue)] leading-[1.6] font-normal">
                  {st.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. NOTES: Safety on Site & Why Parts Fit (Two columns, 1px top line, uppercase title, One-Step blue text) */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px] border-b border-[#E5E5E5]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Note 1: Safety on Site */}
          <div className="flex flex-col text-left">
            <div className="w-full h-[1px] bg-[#E5E5E5] mb-8" />
            <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-[1.25] uppercase mb-4">
              SAFETY ON SITE
            </h3>
            <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.6] lg:leading-[1.7] font-normal">
              Workers wear certified protective equipment and follow written site rules. Any worker may stop a job that looks unsafe. See the SME Policy.
            </p>
          </div>

          {/* Note 2: Why Parts Fit */}
          <div className="flex flex-col text-left">
            <div className="w-full h-[1px] bg-[#E5E5E5] mb-8" />
            <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-[1.25] uppercase mb-4">
              WHY PARTS FIT
            </h3>
            <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.6] lg:leading-[1.7] font-normal">
              Parts are made to the drawing and packed in erection order, so crews do not cut or rework steel on site.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      {data.faq && data.faq.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase mb-8 lg:mb-10">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
              {data.faq.map((faqItem, idx) => {
                const isOpen = openFaqIndex === idx;
                const panelId = `erection-faq-panel-${idx}`;
                const headerId = `erection-faq-header-${idx}`;

                return (
                  <div key={idx} className="group overflow-hidden">
                    <button
                      id={headerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaqIndex((prev) => (prev === idx ? null : idx))}
                      className="w-full flex items-center justify-between text-left cursor-pointer transition-colors hover:text-[var(--blue)] focus-visible:outline-none py-6 lg:py-8"
                    >
                      <span className="font-bold text-[#0A0A0A] uppercase pr-6 leading-[1.3] text-[16px] lg:text-[20px] tracking-[-0.01em] group-hover:text-[var(--blue)] transition-colors">
                        {faqItem.q.toUpperCase()}
                      </span>

                      {/* Plus icon rotating 0 to 45deg over 400ms */}
                      <span
                        className="relative flex-shrink-0 flex items-center justify-center w-[22px] h-[22px] transition-transform duration-400 ease-[cubic-bezier(.16,1,.3,1)]"
                        style={{
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        }}
                      >
                        <span className="absolute bg-[var(--blue)] w-[18px] h-[2px]" />
                        <span className="absolute bg-[var(--blue)] h-[18px] w-[2px]" />
                      </span>
                    </button>

                    {isOpen && (
                      <div id={panelId} role="region" aria-labelledby={headerId}>
                        <p className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.65] font-normal pt-1 pb-6 max-w-[700px]">
                          {faqItem.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 6. NEXT BANNER: AFTER SALE SERVICES */}
      <NextBand
        nextUrl="/services/after-sale-services/"
        nextTitle="AFTER SALE SERVICES"
      />
    </article>
  );
};

// 9.34 After Sale Services — signature: "Support desk"
export const AfterSaleLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const cardsSec = sections[1];
  const serviceCards = [
    { icon: Wrench, name: "Repairs", text: "Immediate structural repairs for accidental crane or forklift impact damage." },
    { icon: PaintRoller, name: "Repainting", text: "Periodic recoating and touch-up maintaining anti-corrosion barrier integrity." },
    { icon: MoveHorizontal, name: "Extensions", text: "Adding building length bays or connecting lean-tos using original anchor points." },
    { icon: SquarePlus, name: "Additions", text: "Retrofitting mezzanines, crane brackets, roof monitors, and partition walls." },
    { icon: ClipboardCheck, name: "Checks", text: "Annual structural inspections verifying bolt torques and foundation alignment." },
  ];

  const whyEasySec = sections[2];
  const supportSec = sections[3];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.afterSale.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Intro */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <SplitIntro
          title={sections[0]?.title || "Why After Sale Support Matters"}
          lead={introPs[0]}
          text={sections[0]?.text || introPs.slice(1)}
        />
      </section>

      {/* 5 Service Icon Cards */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <h2 className="font-bold text-[var(--ink)] mb-10" style={{ fontSize: "var(--fs-h2)" }}>
          {cardsSec?.title || "What Steel Mind Engineers Provides"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {serviceCards.map((sc, idx) => {
            const Icon = sc.icon;
            return (
              <div
                key={idx}
                className="group border border-[var(--rule)] bg-white p-8 space-y-4 transition-all duration-300 hover:bg-[var(--blue)] hover:text-white"
              >
                <div className="w-12 h-12 rounded-lg bg-[rgba(30,58,138,0.08)] text-[var(--blue)] flex items-center justify-center group-hover:bg-white group-hover:text-[var(--blue)] transition-colors">
                  <Icon size={24} />
                </div>
                <h3 className="text-[20px] font-bold text-[var(--ink)] group-hover:text-white transition-colors">
                  {sc.name}
                </h3>
                <p className="text-[var(--grey-strong)] group-hover:text-white/90 text-[14px] leading-[1.6] transition-colors">
                  {sc.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Wide Image */}
      <section className="container pb-[var(--sec-y-lg)]">
        <div className="w-full aspect-[64/27] overflow-hidden bg-slate-900 shadow-md">
          <img
            src={IMG.services.afterSale.wide}
            alt="Ongoing Support and Factory Maintenance"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Why Add Easily (2 Columns) */}
      {whyEasySec && (
        <section className="container pb-[var(--sec-y-lg)] text-left border-t border-[var(--rule)] pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <h2 className="text-[26px] lg:text-[34px] font-bold text-[var(--ink)]">
                {whyEasySec.title}
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>
                {whyEasySec.text}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Support Band (Full Width Nav Blue with direct phone buttons) */}
      <section className="w-full bg-[var(--blue)] text-white py-[var(--sec-y-lg)]">
        <div className="container text-left space-y-8">
          <h2 className="text-[28px] lg:text-[38px] font-bold text-white">
            {supportSec?.title || "How to Ask for Support"}
          </h2>
          <p className="text-white/90 text-[16px] lg:text-[18px] leading-[1.7] max-w-[800px]">
            {supportSec?.text || "Call our service engineers directly with your project location and building details."}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href={`tel:${SITE.tel[0]}`}
              className="btn btn-light btn-sm"
            >
              <span>Call Engineer: {SITE.phones[0]}</span>
              <span className="btn-arrow">→</span>
            </a>
            <a
              href={`tel:${SITE.tel[1]}`}
              className="btn btn-light btn-sm"
            >
              <span>Call Office: {SITE.phones[1]}</span>
              <span className="btn-arrow">→</span>
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="btn btn-outline border-white text-white hover:bg-white hover:text-[var(--blue)] btn-sm"
            >
              <span>Email: {SITE.email}</span>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="font-bold text-[var(--ink)] mb-8" style={{ fontSize: "var(--fs-h2)" }}>
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* Next Banner */}
      <NextBand
        image={IMG.services.afterSale.next}
        nextUrl="/projects/"
        nextTitle="Our Projects"
      />
    </article>
  );
};
