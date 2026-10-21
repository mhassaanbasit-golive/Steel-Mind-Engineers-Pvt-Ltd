import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo } from "react";
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
import { FitOneLine } from "../../ui/FitOneLine.tsx";
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
            <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
              WHAT DESIGN COVERS
            </h2>
            <p className="text-[15px] lg:text-[17px] text-[#0A0A0A] leading-[1.7] font-normal">
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
        <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase mb-8 lg:mb-16">
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
                  <p className="text-[15px] lg:text-[17px] text-[#0A0A0A] leading-[1.7] font-normal">
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
            <p className="text-[15px] sm:text-[16px] text-[#0A0A0A] leading-[1.7] font-normal">
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
              <div className="text-[12px] font-bold text-[#0A0A0A] uppercase tracking-wider">
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

      {/* FREQUENTLY ASKED QUESTIONS */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white py-[60px] lg:py-[100px] px-6 lg:px-8 border-t border-[#E5E5E5] text-left">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-[#0A0A0A] uppercase leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Accordion items={data.faq} size="large" />
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
            <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
              WHAT DETAILING IS
            </h2>
          </div>

          {/* Right Column (7fr): Text in One-Step blue, regular weight */}
          <div className="lg:col-span-7">
            <p className="text-[15px] lg:text-[16px] text-[#0A0A0A] leading-[1.65] font-normal max-w-[620px]">
              Design decides what the building is. Detailing decides how every part is made. Each column, rafter, plate and bolt hole is drawn with exact size and position.
            </p>
          </div>
        </div>
      </section>

      {/* 3. REGISTER: "DRAWINGS PRODUCED" */}
      <section ref={registerRef} className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px] border-b border-[#E5E5E5]">
        {/* Section Heading: strictly capitalized in desktop and mobile view */}
        <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase mb-10 lg:mb-14">
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
                  <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-[1.25] tracking-[-0.01em] w-[260px] shrink-0 pr-6 uppercase">
                    {row.name.toUpperCase()}
                  </h3>

                  {/* Text: One-Step blue, regular weight, 15px / 16px, line-height 1.65 */}
                  <p className="text-[15px] lg:text-[16px] text-[#0A0A0A] leading-[1.65] font-normal flex-1 max-w-[560px] pr-8">
                    {row.text}
                  </p>

                  {/* Far right: 56px round button with arrow-up-right */}
                  <div className="w-[56px] h-[56px] rounded-full border border-[var(--blue)] relative flex items-center justify-center overflow-hidden shrink-0">
                    {/* Blue fill on hover by clip-path circle(0) to circle(100%) in 400ms */}
                    <div className="hover-row-btn-fill absolute inset-0 bg-[var(--blue)] rounded-full" />
                    {/* Arrow travels 8px up-right and back once */}
                    <ArrowUpRight
                      className="hover-row-arrow relative z-10 text-[#0A0A0A]"
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
                      className="text-[15px] text-[#0A0A0A] leading-[1.65] font-normal pb-5 transition-opacity duration-400 ease-out"
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
              <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-[1.25] uppercase">
                {note1.title.toUpperCase()}
              </h3>
              <p className="text-[15px] lg:text-[16px] text-[#0A0A0A] leading-[1.65] font-normal">
                {note1.text}
              </p>
            </div>
          </div>

          {/* Column 2: Detailing for Your Own Design */}
          <div className="flex flex-col">
            <div className="notes-top-line w-full h-[1px] bg-[#E5E5E5] mb-8" />
            <div className="notes-content-box space-y-4">
              <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-[1.25] uppercase">
                {note2.title.toUpperCase()}
              </h3>
              <p className="text-[15px] lg:text-[16px] text-[#0A0A0A] leading-[1.65] font-normal">
                {note2.text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white py-[60px] lg:py-[100px] px-6 lg:px-8 border-t border-[#E5E5E5] text-left">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-[#0A0A0A] uppercase leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Accordion items={data.faq} size="large" />
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
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  // 1. INTRO ANIMATION SETUP (identical to One-Step)
  const introRef = useRef<HTMLElement>(null);
  const [introTriggered, setIntroTriggered] = useState(prefersReduced);

  const introTitle = "WHAT FABRICATION COVERS";
  const introText =
    "Fabrication turns steel plates and sections into columns, rafters, beams, trusses and custom items. At Steel Mind Engineers, this work happens in one factory, under cover. Engineers send approved drawings to the workshop, and the workshop makes each part exactly as drawn.";

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

  // Motion setup: ON SCROLL ONLY for both desktop and mobile
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

    // 2. Desktop animations on scroll only: (min-width: 1024px)
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
                  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
                });
              }
              if (img) {
                gsap.to(img, {
                  scale: 1,
                  duration: 1.1,
                  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
                });
              }
              if (textGroup) {
                gsap.to(textGroup, {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
                  delay: 0.1,
                });
              }
            },
          });
        }
      });

      // Welding on scroll into view only
      const weldPath = weldPathRef.current;
      const weldDots = weldDotRefs.current.filter(Boolean) as SVGCircleElement[];
      const weldingCard = weldingCardRef.current;

      if (weldPath && weldingCard) {
        gsap.set(weldPath, { strokeDasharray: 704, strokeDashoffset: 704, opacity: 1 });
        gsap.set(weldDots, { scale: 0, transformOrigin: "center center", opacity: 1 });

        ScrollTrigger.create({
          trigger: weldingCard,
          start: "top 80%",
          once: true,
          onEnter: () => {
            const weldTl = gsap.timeline();
            weldTl.to(weldPath, { strokeDashoffset: 0, duration: 2.2, ease: "power2.out" }, 0);
            weldDots.forEach((dot, dotIdx) => {
              const atTime = (2.2 * (dotIdx + 1)) / 7;
              weldTl.to(dot, { scale: 1, duration: 0.25, ease: "back.out(1.5)" }, atTime - 0.05);
            });
          },
        });
      }
    });

    // 3. Mobile animations on scroll only: (max-width: 1023px)
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
            start: "top 88%",
            once: true,
            onEnter: () => {
              if (photoBox) {
                gsap.to(photoBox, {
                  clipPath: "inset(0 0 0 0%)",
                  duration: 0.9,
                  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
                });
              }
              if (img) {
                gsap.to(img, {
                  scale: 1,
                  duration: 1.1,
                  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
                });
              }
              if (textGroup) {
                gsap.to(textGroup, {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
                  delay: 0.1,
                });
              }
            },
          });
        }
      });

      // Mobile welding on scroll into view only
      const weldPath = weldPathRef.current;
      const weldDots = weldDotRefs.current.filter(Boolean) as SVGCircleElement[];
      const weldingCard = weldingCardRef.current;

      if (weldPath && weldingCard) {
        gsap.set(weldPath, { strokeDasharray: 704, strokeDashoffset: 704, opacity: 1 });
        gsap.set(weldDots, { scale: 0, transformOrigin: "center center", opacity: 1 });

        ScrollTrigger.create({
          trigger: weldingCard,
          start: "top 85%",
          once: true,
          onEnter: () => {
            const weldTl = gsap.timeline();
            weldTl.to(weldPath, { strokeDashoffset: 0, duration: 2.2, ease: "power2.out" }, 0);
            weldDots.forEach((dot, dotIdx) => {
              const atTime = (2.2 * (dotIdx + 1)) / 7;
              weldTl.to(dot, { scale: 1, duration: 0.25, ease: "back.out(1.5)" }, atTime - 0.05);
            });
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
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792202554/Fabrication-hero.jpg"
        imageAlt={data.h1.toUpperCase()}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* 2. INTRO: "WHAT FABRICATION COVERS" with One-Step lookalike scroll stagger */}
      <section
        ref={introRef}
        className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px] border-b border-[#E5E5E5]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column (5fr): Heading UPPERCASE bold ink with One-Step character animation */}
          <div className="lg:col-span-5">
            {isDesktop ? (
              <h2
                aria-label={introTitle}
                className="text-[28px] lg:text-[46px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase"
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
              <div className="w-full overflow-hidden">
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
            )}
          </div>

          {/* Right Column (7fr): Text in One-Step blue, regular weight with word stagger */}
          <div className="lg:col-span-7">
            <p
              aria-label={introText}
              className="text-[15px] lg:text-[17px] text-[#0A0A0A] leading-[1.7] max-w-[620px]"
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
        </div>
      </section>

      {/* 3. 7 PROCESS CARDS (Sequential flow, no stacking) */}
      <section className="relative w-full py-[72px] lg:py-[120px]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          {/* Section Heading: strictly capitalized with One-Step sizing */}
          {isDesktop ? (
            <h2 className="text-[28px] lg:text-[46px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase mb-12 lg:mb-16">
              THE FABRICATION STEPS
            </h2>
          ) : (
            <div className="w-full mb-10 overflow-hidden">
              <FitOneLine
                as="h2"
                initialClamp="clamp(20px, 6.5vw, 32px)"
                minFontSize={18}
                className="font-bold text-[#0A0A0A] tracking-[-0.02em] uppercase leading-tight"
              >
                THE FABRICATION STEPS
              </FitOneLine>
            </div>
          )}

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
                      <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-[1.25] mb-4 uppercase">
                        {step.title.toUpperCase()}
                      </h3>

                      {/* Text: One-Step blue, regular weight, 15px/16px, line-height 1.65 */}
                      <p className="text-[15px] lg:text-[16px] text-[#0A0A0A] leading-[1.65] font-normal max-w-[480px]">
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
                      <p className="text-[15px] text-[#0A0A0A] leading-[1.65] font-normal">
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

      {/* FREQUENTLY ASKED QUESTIONS */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white py-[60px] lg:py-[100px] px-6 lg:px-8 border-t border-[#E5E5E5] text-left">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-[#0A0A0A] uppercase leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Accordion items={data.faq} size="large" />
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
            <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
              WHY CLEANING COMES FIRST
            </h2>
          </div>

          {/* Right Column (7fr): Text in One-Step blue, regular weight */}
          <div className="lg:col-span-7">
            <p className="text-[15px] lg:text-[16px] text-[#0A0A0A] leading-[1.65] font-normal max-w-[620px]">
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
        <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase mb-12 lg:mb-16">
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
              <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-[1.25] mb-3 uppercase">
                {item.title.toUpperCase()}
              </h3>

              {/* Text: One-Step blue, regular weight, 15px/16px */}
              <p className="text-[15px] lg:text-[16px] text-[#0A0A0A] leading-[1.65] font-normal">
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
              <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-[1.25] mb-4 uppercase">
                {note.title.toUpperCase()}
              </h3>

              {/* Text: One-Step blue, regular weight */}
              <p className="text-[15px] lg:text-[16px] text-[#0A0A0A] leading-[1.65] font-normal">
                {note.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white py-[60px] lg:py-[100px] px-6 lg:px-8 border-t border-[#E5E5E5] text-left">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-[#0A0A0A] uppercase leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Accordion items={data.faq} size="large" />
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
              <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
                WHY THE COATING MATTERS
              </h2>
            </div>
            <div
              ref={(el) => {
                chapterTextRefs.current[0] = el;
              }}
              className="lg:col-span-8 max-w-[640px] text-left"
            >
              <p className="chapter-p text-[15px] lg:text-[16px] text-[#0A0A0A] leading-[1.6] lg:leading-[1.7] font-normal">
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
              <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
                WHAT A COATING SYSTEM IS
              </h2>
            </div>
            <div
              ref={(el) => {
                chapterTextRefs.current[1] = el;
              }}
              className="lg:col-span-8 max-w-[640px] text-left"
            >
              <p className="chapter-p text-[15px] lg:text-[16px] text-[#0A0A0A] leading-[1.6] lg:leading-[1.7] font-normal">
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
              <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
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
                    <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-[1.25] uppercase mb-3">
                      {item.title}
                    </h3>
                    {/* Text: One-Step blue, regular weight */}
                    <p className="text-[15px] lg:text-[16px] text-[#0A0A0A] leading-[1.6] lg:leading-[1.7] font-normal">
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
                            className="text-[15px] text-[#0A0A0A] leading-[1.6] font-normal pb-5 transition-opacity duration-400 ease-out"
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
              <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
                HOW PAINTING IS DONE
              </h2>
            </div>
            <div
              ref={(el) => {
                chapterTextRefs.current[2] = el;
              }}
              className="lg:col-span-8 max-w-[640px] text-left"
            >
              <p className="chapter-p text-[15px] lg:text-[16px] text-[#0A0A0A] leading-[1.6] lg:leading-[1.7] font-normal">
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
              <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
                COLORS
              </h2>
            </div>
            <div
              ref={(el) => {
                chapterTextRefs.current[3] = el;
              }}
              className="lg:col-span-8 max-w-[640px] text-left"
            >
              <p className="chapter-p text-[15px] lg:text-[16px] text-[#0A0A0A] leading-[1.6] lg:leading-[1.7] font-normal">
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
              <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
                AFTER ERECTION
              </h2>
            </div>
            <div
              ref={(el) => {
                chapterTextRefs.current[4] = el;
              }}
              className="lg:col-span-8 max-w-[640px] text-left"
            >
              <p className="chapter-p text-[15px] lg:text-[16px] text-[#0A0A0A] leading-[1.6] lg:leading-[1.7] font-normal">
                Parts can be scratched in transport and lifting. Crews touch up damaged areas on site. A building also needs repainting after some years, which Steel Mind Engineers can do. See After Sale Services.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white py-[60px] lg:py-[100px] px-6 lg:px-8 border-t border-[#E5E5E5] text-left">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-[#0A0A0A] uppercase leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Accordion items={data.faq} size="large" />
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

const ERECTION_STEP_PHOTOS = [
  {
    step: 1,
    title: "Site check",
    url: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202535/Erection-1.jpg",
    width: 1024,
    height: 687,
  },
  {
    step: 2,
    title: "Lifting plan",
    url: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202536/erection-2.jpg",
    width: 1024,
    height: 687,
  },
  {
    step: 3,
    title: "Frames",
    url: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202536/Erection-3.jpg",
    width: 1024,
    height: 687,
  },
  {
    step: 4,
    title: "Bracing and secondary members",
    url: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202537/Erection-4.jpg",
    width: 1024,
    height: 687,
  },
  {
    step: 5,
    title: "Alignment",
    url: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202538/Erection-5.jpg",
    width: 1024,
    height: 687,
  },
  {
    step: 6,
    title: "Sheeting and accessories",
    url: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202541/Erection-6.jpg",
    width: 1024,
    height: 687,
  },
  {
    step: 7,
    title: "Touch-up and handover",
    url: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202542/Erection-7.jpg",
    width: 1024,
    height: 687,
  },
];

// 9.33 Erection — signature: "Crane-hook rail"
export const ErectionLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const { introPs } = extractSections(data);

  // 1. INTRO ANIMATION SETUP (identical to One-Step)
  const introRef = useRef<HTMLElement>(null);
  const [introTriggered, setIntroTriggered] = useState(prefersReduced);

  const introTitle = "WHAT ERECTION INCLUDES";
  const introText =
    introPs[0] ||
    "Erection covers lifting the columns and rafters, bolting the frames, fitting purlins, girts and bracing, and then fitting the roof and wall sheets, doors and accessories. For mezzanines and bridges, it also covers deck, stairs and handrails.";

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

  // 2. THE 7 ERECTION STEPS
  const steps = [
    {
      num: "01",
      title: "Site check",
      text: "Foundation levels and anchor bolts are checked against the plan.",
    },
    {
      num: "02",
      title: "Lifting plan",
      text: "The lift plan is written and explained to the crew before work starts.",
    },
    {
      num: "03",
      title: "Frames",
      text: "Columns and rafters are lifted and bolted in order.",
    },
    {
      num: "04",
      title: "Bracing and secondary members",
      text: "Bracing, purlins and girts make the structure stable.",
    },
    {
      num: "05",
      title: "Alignment",
      text: "Frames are checked for plumb and level, and bolts are tightened to the specified torque.",
    },
    {
      num: "06",
      title: "Sheeting and accessories",
      text: "Roof and wall sheets, trims, doors, skylights and vents are fitted.",
    },
    {
      num: "07",
      title: "Touch-up and handover",
      text: "Damaged paint is repaired and the building is checked with you.",
    },
  ];

  const N = steps.length;

  // Refs for Desktop
  const desktopRowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const desktopNumRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const desktopBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const desktopWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopTextRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Refs for Mobile
  const mobileRowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const mobileNumRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mobileBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const mobileTextRefs = useRef<(HTMLDivElement | null)[]>([]);

  const rootTimelineRef = useRef<HTMLElement>(null);

  // Active steps state & hook rail animation
  const [activeSteps, setActiveSteps] = useState<boolean[]>(() =>
    Array(N).fill(prefersReduced)
  );
  const activeStepsRef = useRef<boolean[]>(Array(N).fill(prefersReduced));
  const segValsRef = useRef<number[]>(Array(N).fill(prefersReduced ? 1 : 0));
  const animFrameRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);

  // Measured dot positions relative to row top
  const [dotTopsDesktop, setDotTopsDesktop] = useState<number[]>(() => Array(N).fill(84));
  const [dotTopsMobile, setDotTopsMobile] = useState<number[]>(() => Array(N).fill(28));

  const updateDotPositions = useCallback(() => {
    const dLis = desktopRowRefs.current;
    const dNums = desktopNumRefs.current;
    if (dLis.length > 0 && dLis[0] && dNums[0]) {
      const nextTops = dLis.map((li, i) => {
        const num = dNums[i];
        if (!li || !num) return 84;
        const liRect = li.getBoundingClientRect();
        const numRect = num.getBoundingClientRect();
        return Math.round(numRect.top - liRect.top + numRect.height / 2);
      });
      setDotTopsDesktop(nextTops);
    }

    const mLis = mobileRowRefs.current;
    const mNums = mobileNumRefs.current;
    if (mLis.length > 0 && mLis[0] && mNums[0]) {
      const nextTops = mLis.map((li, i) => {
        const num = mNums[i];
        if (!li || !num) return 28;
        const liRect = li.getBoundingClientRect();
        const numRect = num.getBoundingClientRect();
        return Math.round(numRect.top - liRect.top + numRect.height / 2);
      });
      setDotTopsMobile(nextTops);
    }
  }, [N]);

  // Hook rail motion loop (identical to One-Step)
  useEffect(() => {
    updateDotPositions();

    const checkAndAnimate = () => {
      const markY = window.innerHeight * 0.65;
      let needsMoreFrames = false;
      let activeChanged = false;
      const currentActive = [...activeStepsRef.current];

      const isDesktopScreen = window.innerWidth >= 1024;
      const lis = isDesktopScreen ? desktopRowRefs.current : mobileRowRefs.current;
      const nums = isDesktopScreen ? desktopNumRefs.current : mobileNumRefs.current;

      lis.forEach((li, i) => {
        if (!li) return;
        const rect = li.getBoundingClientRect();
        const numEl = nums[i];
        const numRect = numEl ? numEl.getBoundingClientRect() : null;
        const targetTop = numRect ? (numRect.top + numRect.height / 2) : (rect.top + 28);

        const isAct = prefersReduced || markY >= targetTop;
        if (isAct !== currentActive[i]) {
          currentActive[i] = isAct;
          activeChanged = true;
        }

        if (prefersReduced) {
          desktopRowRefs.current[i]?.style.setProperty("--seg", "1");
          mobileRowRefs.current[i]?.style.setProperty("--seg", "1");
          return;
        }

        const t = Math.max(0, Math.min(1, (markY - targetTop) / rect.height));
        const currentS = segValsRef.current[i] || 0;
        const diff = t - currentS;

        if (Math.abs(diff) > 0.001) {
          needsMoreFrames = true;
          const nextS = currentS + diff * 0.15;
          segValsRef.current[i] = nextS;
          desktopRowRefs.current[i]?.style.setProperty("--seg", String(nextS));
          mobileRowRefs.current[i]?.style.setProperty("--seg", String(nextS));
        } else if (currentS !== t) {
          segValsRef.current[i] = t;
          desktopRowRefs.current[i]?.style.setProperty("--seg", String(t));
          mobileRowRefs.current[i]?.style.setProperty("--seg", String(t));
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

    triggerLoop();

    const handleResize = () => {
      updateDotPositions();
      triggerLoop();
    };

    window.addEventListener("scroll", triggerLoop, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", triggerLoop);
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [prefersReduced, updateDotPositions]);

  // GSAP CURTAIN & RISE MOTION (Recipes matching Motion Kit)
  useEffect(() => {
    if (!rootTimelineRef.current) return;

    const mm = gsap.matchMedia();

    // 1. DESKTOP (1024px and up):
    // Photos: CURTAIN 1200ms from outer edge (right for odd, left for even).
    // Photo wrapper drifts y 0 to -20px (scrub 1.4). Inner img scale 1.06 to 1 over 1560ms E1.
    // Text: number, title, text RISE (stagger 90ms) 200ms after photo starts.
    mm.add("(min-width: 1024px)", () => {
      desktopRowRefs.current.forEach((row, i) => {
        if (!row) return;
        const box = desktopBoxRefs.current[i];
        const img = desktopImgRefs.current[i];
        const wrap = desktopWrapRefs.current[i];
        const textContainer = desktopTextRefs.current[i];
        if (!box || !img || !textContainer) return;

        const isOdd = i % 2 === 0; // step 1, 3, 5, 7: odd index 0, 2, 4, 6 (photo right)
        // Photos on right come from right (inset(0 0 0 100%)), photos on left from left (inset(0 100% 0 0))
        const initialClip = isOdd ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";

        gsap.set(box, { clipPath: initialClip });
        gsap.set(img, { scale: 1.06 });

        const numSpan = textContainer.querySelector("span");
        const h3 = textContainer.querySelector("h3");
        const p = textContainer.querySelector("p");
        const textEls = [numSpan, h3, p].filter(Boolean) as HTMLElement[];
        gsap.set(textEls, { y: 24, opacity: 0 });

        // Wrapper drift y 0 to -20px (scrub 1.4)
        if (wrap) {
          gsap.fromTo(
            wrap,
            { y: 0 },
            {
              y: -20,
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.4,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        // Reveal timeline at top 85%
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
          },
          onStart: () => {
            box.style.willChange = "clip-path";
            img.style.willChange = "transform";
            textEls.forEach((el) => {
              (el as HTMLElement).style.willChange = "transform, opacity";
            });
          },
          onComplete: () => {
            gsap.set(box, { clearProps: "willChange" });
            gsap.set(img, { clearProps: "willChange" });
            textEls.forEach((el) => {
              gsap.set(el, { clearProps: "willChange" });
            });
          },
        });

        // 1. Photo: CURTAIN 1200ms from outer edge (E2) + inner img scale 1.06 to 1 over 1560ms (E1)
        tl.to(box, { clipPath: "inset(0 0 0 0%)", duration: 1.2, ease: "E2" }, 0);
        tl.to(img, { scale: 1, duration: 1.56, ease: "E1" }, 0);

        // 2. Text: number, title and text RISE (stagger 90ms) 200ms after photo starts
        tl.to(textEls, { y: 0, opacity: 1, duration: 0.9, stagger: 0.09, ease: "E1" }, 0.2);
      });
    });

    // 2. MOBILE (below 1024px):
    // Photo: CURTAIN 900ms from bottom, once.
    // Text: RISE (stagger 90ms) as step enters (top 90%). No parallax.
    mm.add("(max-width: 1023px)", () => {
      mobileRowRefs.current.forEach((row, i) => {
        if (!row) return;
        const box = mobileBoxRefs.current[i];
        const img = mobileImgRefs.current[i];
        const textContainer = mobileTextRefs.current[i];
        if (!box || !img || !textContainer) return;

        gsap.set(box, { clipPath: "inset(0 0 100% 0)" });
        gsap.set(img, { scale: 1.06 });

        const numSpan = textContainer.querySelector("span");
        const h3 = textContainer.querySelector("h3");
        const p = textContainer.querySelector("p");
        const textEls = [numSpan, h3, p].filter(Boolean) as HTMLElement[];
        gsap.set(textEls, { y: 24, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 90%",
            once: true,
            invalidateOnRefresh: true,
          },
          onStart: () => {
            box.style.willChange = "clip-path";
            img.style.willChange = "transform";
            textEls.forEach((el) => {
              (el as HTMLElement).style.willChange = "transform, opacity";
            });
          },
          onComplete: () => {
            gsap.set(box, { clearProps: "willChange" });
            gsap.set(img, { clearProps: "willChange" });
            textEls.forEach((el) => {
              gsap.set(el, { clearProps: "willChange" });
            });
          },
        });

        // Photo CURTAIN 900ms from bottom
        tl.to(box, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "E2" }, 0);
        tl.to(img, { scale: 1, duration: 1.17, ease: "E1" }, 0);

        // Text RISE
        tl.to(textEls, { y: 0, opacity: 1, duration: 0.9, stagger: 0.09, ease: "E1" }, 0);
      });
    });

    // 3. PREFERS-REDUCED-MOTION
    mm.add("(prefers-reduced-motion: reduce)", () => {
      [...desktopBoxRefs.current, ...mobileBoxRefs.current].forEach((b) => {
        if (b) gsap.set(b, { clipPath: "inset(0 0 0 0)" });
      });
      [...desktopImgRefs.current, ...mobileImgRefs.current].forEach((img) => {
        if (img) gsap.set(img, { scale: 1 });
      });
      [...desktopTextRefs.current, ...mobileTextRefs.current].forEach((c) => {
        if (c) gsap.set(c.children, { y: 0, opacity: 1 });
      });
    });

    // Refresh triggers after lazy decode and fonts
    const refreshTimer = setTimeout(() => {
      updateDotPositions();
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      mm.revert();
    };
  }, [updateDotPositions]);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

      {/* 2. INTRO: "WHAT ERECTION INCLUDES" with One-Step lookalike scroll stagger */}
      <section
        ref={introRef}
        className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px] border-b border-[#E5E5E5]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column (5fr): Heading UPPERCASE bold ink with One-Step character animation */}
          <div className="lg:col-span-5">
            {isDesktop ? (
              <h2
                aria-label={introTitle}
                className="text-[28px] lg:text-[46px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase"
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
              <div className="w-full overflow-hidden">
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
            )}
          </div>

          {/* Right Column (7fr): Text in One-Step blue, regular weight with word stagger */}
          <div className="lg:col-span-7 space-y-4">
            <p
              aria-label={introText}
              className="text-[15px] lg:text-[17px] text-[#0A0A0A] leading-[1.7] max-w-[620px]"
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
            {introPs[1] && (
              <p className="text-[15px] lg:text-[17px] text-[#0A0A0A] leading-[1.7] max-w-[620px]">
                {introPs[1]}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 3. THE ERECTION STEPS */}
      <section
        ref={rootTimelineRef}
        className="w-full bg-white py-[72px] lg:py-[120px] px-6 lg:px-8 border-b border-[#E5E5E5] erection-timeline-section"
      >
        <div className="max-w-[1280px] mx-auto text-left">
          {/* DESKTOP (1024px and up): A zigzag timeline around a centered rail */}
          <div className="hidden lg:block w-full">
            <h2 className="text-[28px] lg:text-[46px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase mb-[72px]">
              THE ERECTION STEPS
            </h2>

            <ol className="list-none m-0 p-0 relative w-full">
              {steps.map((step, idx) => {
                const photo = ERECTION_STEP_PHOTOS[idx];
                const isOdd = idx % 2 === 0; // Steps 1, 3, 5, 7: text on left, photo on right
                const isActive = activeSteps[idx] || prefersReduced;
                const dotTop = dotTopsDesktop[idx] ?? 84;
                const nextDotTop = dotTopsDesktop[idx + 1] ?? 84;

                return (
                  <li
                    key={step.num}
                    ref={(el) => {
                      desktopRowRefs.current[idx] = el;
                    }}
                    className="relative w-full py-[56px]"
                  >
                    <div className="grid grid-cols-[1fr_96px_1fr] items-center w-full">
                      {/* Column 1 */}
                      {isOdd ? (
                        // Odd step: text on the left, right-aligned to the rail, text left-aligned
                        <div className="flex justify-end w-full">
                          <div
                            ref={(el) => {
                              desktopTextRefs.current[idx] = el;
                            }}
                            className="w-full max-w-[420px] ml-auto text-left"
                          >
                            <span
                              ref={(el) => {
                                desktopNumRefs.current[idx] = el;
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
                            <div className="mt-3">
                              <h3 className="font-bold text-[#0A0A0A] text-[14px] sm:text-[16px] lg:text-[22px] uppercase leading-[1.25] tracking-[-0.01em] mb-2">
                                {step.title}
                              </h3>
                              <p className="text-[15px] lg:text-[16px] text-[#0A0A0A] leading-[1.65] max-w-[540px]">
                                {step.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Even step: photo on the left
                        <div
                          ref={(el) => {
                            desktopWrapRefs.current[idx] = el;
                          }}
                          className="w-full flex justify-end"
                        >
                          <div
                            ref={(el) => {
                              desktopBoxRefs.current[idx] = el;
                            }}
                            className="relative w-full overflow-hidden"
                            style={{
                              aspectRatio: "1024 / 687",
                              maxHeight: "68svh",
                              maxWidth: "calc(68svh * (1024 / 687))",
                            }}
                          >
                            <img
                              ref={(el) => {
                                desktopImgRefs.current[idx] = el;
                              }}
                              src={cld(photo.url, 1920)}
                              width={1024}
                              height={687}
                              alt={step.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover block"
                            />
                          </div>
                        </div>
                      )}

                      {/* Column 2: Centered Rail */}
                      <div className="relative w-[96px] h-full flex justify-center self-stretch">
                        {/* Grey background line to next step */}
                        {idx < N - 1 && (
                          <div
                            className="absolute w-[2px] bg-[#E5E5E5] z-[1]"
                            style={{
                              left: "50%",
                              top: `${dotTop}px`,
                              bottom: `-${nextDotTop}px`,
                              transform: "translateX(-50%)",
                            }}
                          />
                        )}

                        {/* Blue active fill line to next step */}
                        {idx < N - 1 && (
                          <div
                            className="absolute w-[2px] bg-[#1E3A8A] z-[1]"
                            style={{
                              left: "50%",
                              top: `${dotTop}px`,
                              bottom: `-${nextDotTop}px`,
                              transform: "translateX(-50%) scaleY(var(--seg, 0))",
                              transformOrigin: "50% 0",
                            }}
                          />
                        )}

                        {/* Dot (14px circle centered at x = 50%, y = dotTop) */}
                        <div
                          className="absolute rounded-full box-border z-[2]"
                          style={{
                            left: "50%",
                            top: `${dotTop}px`,
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
                      </div>

                      {/* Column 3 */}
                      {isOdd ? (
                        // Odd step: photo on the right
                        <div
                          ref={(el) => {
                            desktopWrapRefs.current[idx] = el;
                          }}
                          className="w-full flex justify-start"
                        >
                          <div
                            ref={(el) => {
                              desktopBoxRefs.current[idx] = el;
                            }}
                            className="relative w-full overflow-hidden"
                            style={{
                              aspectRatio: "1024 / 687",
                              maxHeight: "68svh",
                              maxWidth: "calc(68svh * (1024 / 687))",
                            }}
                          >
                            <img
                              ref={(el) => {
                                desktopImgRefs.current[idx] = el;
                              }}
                              src={cld(photo.url, 1920)}
                              width={1024}
                              height={687}
                              alt={step.title}
                              loading={idx === 0 ? "eager" : "lazy"}
                              decoding="async"
                              className="w-full h-full object-cover block"
                            />
                          </div>
                        </div>
                      ) : (
                        // Even step: text on the right
                        <div className="flex justify-start w-full">
                          <div
                            ref={(el) => {
                              desktopTextRefs.current[idx] = el;
                            }}
                            className="w-full max-w-[420px] mr-auto text-left"
                          >
                            <span
                              ref={(el) => {
                                desktopNumRefs.current[idx] = el;
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
                            <div className="mt-3">
                              <h3 className="font-bold text-[#0A0A0A] text-[14px] sm:text-[16px] lg:text-[22px] uppercase leading-[1.25] tracking-[-0.01em] mb-2">
                                {step.title}
                              </h3>
                              <p className="text-[15px] lg:text-[16px] text-[#0A0A0A] leading-[1.65] max-w-[540px]">
                                {step.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* MOBILE (below 1024px): Left Rail, 36px content indent, photo 24px below text, 56px between steps */}
          <div className="lg:hidden w-full max-w-[760px] mx-auto">
            <div className="w-full mb-10 overflow-hidden">
              <FitOneLine
                as="h2"
                initialClamp="clamp(20px, 6.5vw, 32px)"
                minFontSize={18}
                className="font-bold text-[#0A0A0A] tracking-[-0.02em] uppercase leading-tight"
              >
                THE ERECTION STEPS
              </FitOneLine>
            </div>

            <ol className="list-none m-0 p-0 relative w-full">
              {steps.map((step, idx) => {
                const photo = ERECTION_STEP_PHOTOS[idx];
                const isActive = activeSteps[idx] || prefersReduced;
                const dotTop = dotTopsMobile[idx] ?? 28;
                const nextDotTop = dotTopsMobile[idx + 1] ?? 28;

                return (
                  <li
                    key={step.num}
                    ref={(el) => {
                      mobileRowRefs.current[idx] = el;
                    }}
                    className="relative mb-[56px] last:mb-0 last:pb-[96px]"
                  >
                    {/* Left Rail: 12px from left edge */}
                    {idx < N - 1 && (
                      <div
                        className="absolute w-[2px] bg-[#E5E5E5] z-[1]"
                        style={{
                          left: "12px",
                          top: `${dotTop}px`,
                          bottom: `-${56 + nextDotTop}px`,
                          transform: "translateX(-50%)",
                        }}
                      />
                    )}

                    {idx < N - 1 && (
                      <div
                        className="absolute w-[2px] bg-[#1E3A8A] z-[1]"
                        style={{
                          left: "12px",
                          top: `${dotTop}px`,
                          bottom: `-${56 + nextDotTop}px`,
                          transform: "translateX(-50%) scaleY(var(--seg, 0))",
                          transformOrigin: "50% 0",
                        }}
                      />
                    )}

                    {/* Dot on left rail */}
                    <div
                      className="absolute rounded-full box-border z-[2]"
                      style={{
                        left: "12px",
                        top: `${dotTop}px`,
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

                    {/* Content Block (padding-left: 36px) */}
                    <div className="pl-[36px] text-left">
                      <div
                        ref={(el) => {
                          mobileTextRefs.current[idx] = el;
                        }}
                      >
                        <span
                          ref={(el) => {
                            mobileNumRefs.current[idx] = el;
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

                        <div className="mt-3">
                          <h3 className="font-bold text-[#0A0A0A] text-[14px] sm:text-[16px] uppercase leading-[1.25] tracking-[-0.01em] mb-2">
                            {step.title}
                          </h3>
                          <p className="text-[15px] text-[#0A0A0A] leading-[1.65]">
                            {step.text}
                          </p>
                        </div>
                      </div>

                      {/* Photo: 24px below text at full content width and real shape */}
                      <div
                        ref={(el) => {
                          mobileBoxRefs.current[idx] = el;
                        }}
                        className="relative w-full overflow-hidden mt-6 bg-slate-100"
                        style={{
                          aspectRatio: "1024 / 687",
                        }}
                      >
                        <img
                          ref={(el) => {
                            mobileImgRefs.current[idx] = el;
                          }}
                          src={cld(photo.url, 1200)}
                          width={1024}
                          height={687}
                          alt={step.title}
                          loading={idx === 0 ? "eager" : "lazy"}
                          decoding="async"
                          className="w-full h-full object-cover block"
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* 4. NOTES: Safety on Site & Why Parts Fit (Two columns, 1px top line, uppercase title, One-Step blue text) */}
      <section className="max-w-[1280px] mx-auto px-6 lg:px-8 py-[72px] lg:py-[120px] border-b border-[#E5E5E5]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Note 1: Safety on Site */}
          <div className="flex flex-col text-left">
            <div className="w-full h-[1px] bg-[#E5E5E5] mb-8" />
            <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-[1.25] uppercase mb-4">
              SAFETY ON SITE
            </h3>
            <p className="text-[15px] lg:text-[16px] text-[#0A0A0A] leading-[1.6] lg:leading-[1.7] font-normal">
              Workers wear certified protective equipment and follow written site rules. Any worker may stop a job that looks unsafe. See the SME Policy.
            </p>
          </div>

          {/* Note 2: Why Parts Fit */}
          <div className="flex flex-col text-left">
            <div className="w-full h-[1px] bg-[#E5E5E5] mb-8" />
            <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-[1.25] uppercase mb-4">
              WHY PARTS FIT
            </h3>
            <p className="text-[15px] lg:text-[16px] text-[#0A0A0A] leading-[1.6] lg:leading-[1.7] font-normal">
              Parts are made to the drawing and packed in erection order, so crews do not cut or rework steel on site.
            </p>
          </div>
        </div>
      </section>

      {/* CSS Rules for timeline variables */}
      <style>{`
        .erection-timeline-section {
          --num: clamp(44px, 12vw, 56px);
        }
        @media (min-width: 1024px) {
          .erection-timeline-section {
            --num: clamp(56px, 5vw, 72px);
          }
        }
      `}</style>

      {/* FREQUENTLY ASKED QUESTIONS */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white py-[60px] lg:py-[100px] px-6 lg:px-8 border-t border-[#E5E5E5] text-left">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-[#0A0A0A] uppercase leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* 6. NEXT BANNER: AFTER SALE SERVICES */}
      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792202544/Erection-next.jpg"
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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  const serviceCards = [
    {
      icon: Wrench,
      name: "Repairs",
      text: cardsSec?.items?.find((i) => i.name === "Repairs")?.text || "Damaged sheets, trims, doors and connections.",
    },
    {
      icon: PaintRoller,
      name: "Repainting",
      text: cardsSec?.items?.find((i) => i.name === "Repainting")?.text || "Cleaning and recoating of steel that has aged in the weather.",
    },
    {
      icon: MoveHorizontal,
      name: "Extensions",
      text: cardsSec?.items?.find((i) => i.name === "Extensions")?.text || "Extra bays at the end of a PEB, or a new shed beside the first one.",
    },
    {
      icon: SquarePlus,
      name: "Additions",
      text: cardsSec?.items?.find((i) => i.name === "Additions")?.text || "Canopies, mezzanine floors, skylights, ventilators, doors and stairs.",
    },
    {
      icon: ClipboardCheck,
      name: "Checks",
      text: cardsSec?.items?.find((i) => i.name === "Checks")?.text || "A visit to look at the structure and advise on needed work.",
    },
  ];

  const whyEasySec = sections[2];
  const supportSec = sections[3];

  return (
    <article className="w-full bg-white text-left">
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792202522/After-sale-services-hero.jpg"
        imageAlt={data.h1}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* Intro */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-[96px] items-start">
          <div className="lg:col-span-5">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[var(--ink)] uppercase leading-[1.15] tracking-[-0.02em]">
              {(sections[0]?.title || "Why After Sale Support Matters").toUpperCase()}
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 max-w-[640px]">
            {introPs[0] && (
              <p className="text-[15px] lg:text-[16px] font-normal text-[#0A0A0A] leading-[1.6] lg:leading-[1.7]">
                {introPs[0]}
              </p>
            )}
            {(sections[0]?.text || introPs.slice(1).join(" ")) && (
              <p className="text-[15px] lg:text-[16px] font-normal text-[#0A0A0A] leading-[1.6] lg:leading-[1.7]">
                {sections[0]?.text || introPs.slice(1).join(" ")}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 5 Service Icon Cards */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[var(--ink)] uppercase leading-[1.15] tracking-[-0.02em] mb-8 lg:mb-10">
          {(cardsSec?.title || "What Steel Mind Engineers Provides").toUpperCase()}
        </h2>

        {/* Desktop: 5-column grid */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-6">
          {serviceCards.map((sc, idx) => {
            const Icon = sc.icon;
            return (
              <div
                key={idx}
                className="group border border-[var(--rule)] bg-white p-8 space-y-4 transition-all duration-300 hover:bg-[var(--blue)] text-left cursor-default"
              >
                <div className="w-[56px] h-[56px] min-w-[56px] min-h-[56px] rounded-[14px] bg-[var(--blue)] text-white flex items-center justify-center transition-colors duration-300 group-hover:bg-white group-hover:text-[#0A0A0A]">
                  <Icon size={26} strokeWidth={2} />
                </div>
                <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase group-hover:text-white transition-colors duration-300">
                  {sc.name}
                </h3>
                <p className="text-[16px] leading-[1.7] font-normal text-[#0A0A0A] group-hover:text-white transition-colors duration-300">
                  {sc.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile: one column, gap 12px. Rows alternate blue and white: card 1 blue, 2 white, 3 blue, 4 white, 5 blue */}
        <div className="flex flex-col gap-[12px] lg:hidden">
          {serviceCards.map((sc, idx) => {
            const Icon = sc.icon;
            const isBlue = idx % 2 === 0;

            return (
              <div
                key={idx}
                className={`p-[18px] border transition-colors ${
                  isBlue
                    ? "bg-[var(--blue)] border-[var(--blue)] text-white"
                    : "bg-white border-[var(--rule)] text-[var(--blue)]"
                }`}
              >
                <div className="flex flex-row items-start gap-4 text-left">
                  {/* Left: icon box (56px, radius 14px) */}
                  <div
                    className={`w-[56px] h-[56px] min-w-[56px] min-h-[56px] rounded-[14px] flex items-center justify-center shrink-0 ${
                      isBlue ? "bg-white text-[var(--blue)]" : "bg-[var(--blue)] text-white"
                    }`}
                  >
                    <Icon size={26} strokeWidth={2} />
                  </div>

                  {/* Right: title and text */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-[17px] font-bold leading-tight ${
                        isBlue ? "text-white" : "text-[var(--ink)]"
                      }`}
                    >
                      {sc.name}
                    </h3>
                    <p
                      className={`text-[15px] leading-[1.6] font-normal mt-1 line-clamp-3 ${
                        isBlue ? "text-white" : "text-[#0A0A0A]"
                      }`}
                    >
                      {sc.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Wide Image (64:27 shape) */}
      <section className="container pb-[var(--sec-y-lg)]">
        <div className="w-full aspect-[64/27] overflow-hidden bg-slate-900 shadow-md">
          <img
            src="https://res.cloudinary.com/cyfb9slf/image/upload/v1792202525/after-sale-wide.jpg"
            alt="Ongoing Support and Factory Maintenance"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* Why Add Easily (2 Columns) */}
      {whyEasySec && (
        <section className="container pb-[var(--sec-y-lg)] text-left border-t border-[var(--rule)] pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            <div className="lg:col-span-5">
              <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[var(--ink)] uppercase leading-[1.15] tracking-[-0.02em]">
                {whyEasySec.title.toUpperCase()}
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[15px] lg:text-[16px] font-normal text-[#0A0A0A] leading-[1.6] lg:leading-[1.7]">
                {whyEasySec.text}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Support Band (Full Width Nav Blue with direct phone buttons) */}
      <section className="w-full bg-[var(--blue)] text-white py-[var(--sec-y-lg)]">
        <div className="container text-left space-y-6 lg:space-y-8">
          <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-white uppercase leading-[1.15] tracking-[-0.02em]">
            {(supportSec?.title || "How to Ask for Support").toUpperCase()}
          </h2>
          <p className="text-[15px] lg:text-[16px] font-normal text-white leading-[1.6] lg:leading-[1.7] max-w-[800px]">
            {supportSec?.text || "Call our service engineers directly with your project location and building details."}
          </p>

          <div className="flex flex-wrap gap-4 pt-2 lg:pt-4">
            <a
              href={`tel:${SITE.tel[0]}`}
              className="btn btn-light btn-sm"
            >
              <span>Call Engineer: {SITE.phones[0]}</span>
              <span className="btn-arrow" aria-hidden="true">&rarr;</span>
            </a>
            <a
              href={`tel:${SITE.tel[1]}`}
              className="btn btn-light btn-sm"
            >
              <span>Call Office: {SITE.phones[1]}</span>
              <span className="btn-arrow" aria-hidden="true">&rarr;</span>
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="btn btn-outline border-white text-white hover:bg-white hover:text-[#0A0A0A] btn-sm"
            >
              <span>Email: {SITE.email}</span>
            </a>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white py-[60px] lg:py-[100px] px-6 lg:px-8 border-t border-[#E5E5E5] text-left">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-[#0A0A0A] uppercase leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* Next Banner */}
      <NextBand
        image={IMG.services.afterSale.next}
        nextUrl="/projects/"
        nextTitle="OUR PROJECTS"
      />
    </article>
  );
};
