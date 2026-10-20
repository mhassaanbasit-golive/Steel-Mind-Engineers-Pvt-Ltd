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
    <article ref={rootRef} className="w-full bg-white text-left pb-[96px] overflow-x-clip">
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
            <h2 className="text-[24px] sm:text-[32px] lg:text-[46px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase">
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
        <h2 className="text-[24px] sm:text-[32px] lg:text-[46px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase mb-12 lg:mb-16">
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
              <div className="text-[12px] font-bold text-[var(--blue)]">
                {steps[activeStep].num} / 03
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
            <h2 className="text-[24px] sm:text-[32px] lg:text-[46px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] uppercase mb-10">
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
  const { introPs, sections } = extractSections(data);
  const drawingsSec = sections.find((s) => s.items && s.items.length >= 4) || sections[1];
  const drawingRows = drawingsSec?.items || [
    { name: "Fabrication drawings", text: "Detailed part geometry, plate cuts, holes, stiffeners, and weld symbols for the shop floor." },
    { name: "Cutting lists", text: "Material nesting plans optimizing steel plate and beam utilization, minimizing scrap waste." },
    { name: "Erection drawings", text: "Step-by-step match-marked assembly maps guiding field cranes and bolting crews." },
    { name: "Anchor bolt plans", text: "Precise setting templates delivered before foundation pouring to ensure exact alignment." },
  ];

  const note1 = sections[2] || sections[0];
  const note2 = sections[3] || sections[1];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.detailing.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Intro */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <SplitIntro
          title={sections[0]?.title || "What Detailing Is"}
          lead={introPs[0]}
          text={sections[0]?.text || introPs.slice(1)}
        />
      </section>

      {/* Drawing Register */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <h2 className="font-bold text-[var(--ink)] mb-10" style={{ fontSize: "var(--fs-h2)" }}>
          {drawingsSec?.title || "Drawings Produced"}
        </h2>

        <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
          {drawingRows.map((dr, idx) => (
            <div
              key={idx}
              className="py-8 grid grid-cols-12 gap-6 items-baseline transition-all duration-300 hover:bg-[rgba(30,58,138,0.03)] px-4"
            >
              <div className="col-span-12 sm:col-span-1">
                <span className="text-[16px] font-mono font-bold text-[var(--blue)]">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="col-span-12 sm:col-span-4 flex items-center justify-between">
                <h3 className="text-[22px] font-bold text-[var(--ink)] tracking-tight">
                  {dr.name}
                </h3>
                <ArrowUpRight size={18} className="text-[var(--blue)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="col-span-12 sm:col-span-7">
                <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
                  {dr.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notes (2 Columns with 48px rules) */}
      <section className="container pb-[var(--sec-y-lg)] text-left border-t border-[var(--rule)] pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
          <div className="space-y-4">
            <div className="w-12 h-[2px] bg-[var(--blue)]" />
            <h3 className="text-[24px] font-bold text-[var(--ink)]">{note1?.title}</h3>
            <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>{note1?.text}</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-[2px] bg-[var(--blue)]" />
            <h3 className="text-[24px] font-bold text-[var(--ink)]">{note2?.title}</h3>
            <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>{note2?.text}</p>
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
        image={IMG.services.detailing.next}
        nextUrl="/services/fabrication/"
        nextTitle="Fabrication Services"
      />
    </article>
  );
};

// 9.30 Fabrication — signature: "Pinned filmstrip"
export const FabricationLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const stepsSec = sections.find((s) => s.items && s.items.length >= 6) || sections[0];
  const steps = stepsSec?.items || [
    { name: "Material check", text: "Inspecting steel mill test certificates, thickness, and ultrasonic integrity." },
    { name: "Cutting", text: "High-precision CNC oxy-fuel and plasma profiling of web and flange plates." },
    { name: "Drilling", text: "Multi-spindle automatic drilling of connection bolt patterns to millimeter accuracy." },
    { name: "Fitting", text: "Tack-welding webs, flanges, end plates, and stiffeners in precision alignment jigs." },
    { name: "Welding", text: "Continuous submerged arc welding (SAW) of built-up beams with certified welders." },
    { name: "Cleaning and painting", text: "Abrasive blast cleaning to SA 2.5 profile followed by primer and intermediate coating." },
    { name: "Marking and packing", text: "Tagging each component with unique erection mark and bundling in field installation order." },
  ];
  const images = [
    IMG.services.fabrication.f1,
    IMG.services.fabrication.f2,
    IMG.services.fabrication.f3,
    IMG.services.fabrication.f4,
    "", // Step 05 Welding has no photo
    IMG.services.fabrication.f6,
    IMG.services.fabrication.f7,
  ];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.fabrication.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Intro */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <SplitIntro
          title={sections[0]?.title || "What Fabrication Covers"}
          lead={introPs[0]}
          text={sections[0]?.text || introPs.slice(1)}
        />
      </section>

      {/* Filmstrip Panels (Horizontal Scrolling / Drag Track) */}
      <section className="w-full pb-[var(--sec-y-lg)] overflow-hidden text-left">
        <div className="container mb-6 flex justify-between items-baseline">
          <h2 className="font-bold text-[var(--ink)]" style={{ fontSize: "var(--fs-h2)" }}>
            Fabrication Process
          </h2>
          <span className="text-[13px] font-mono text-[var(--blue)] font-bold">01 / 07 STEPS</span>
        </div>

        <div
          data-lenis-prevent=""
          className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory px-[var(--gutter)] pb-4"
        >
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[85vw] sm:w-[480px] lg:w-[560px] snap-start border border-[var(--rule)] bg-white p-6 space-y-4"
            >
              {idx === 4 ? (
                /* Step 05 Welding (no photo): nav blue card */
                <div className="w-full aspect-[3/2] bg-[var(--blue)] flex items-center justify-center p-8 text-white">
                  <div className="text-center space-y-2">
                    <span className="font-bold text-[48px] text-white/30 block">05</span>
                    <span className="text-[20px] font-bold uppercase tracking-wider block">Submerged Arc Welding</span>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-[3/2] overflow-hidden bg-slate-900 shadow-sm">
                  <img
                    src={images[idx]}
                    alt={st.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <OutlineNum num={idx + 1} />
              <h3 className="text-[22px] font-bold text-[var(--ink)]">{st.name}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {st.text}
              </p>
            </div>
          ))}
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
        image={IMG.services.fabrication.next}
        nextUrl="/services/cleaning/"
        nextTitle="Cleaning Services"
      />
    </article>
  );
};

// 9.31 Cleaning — signature: "Blast reveal + inspection sheet"
export const CleaningLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const checklist = sections.slice(1, 5);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.cleaning.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Intro */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <SplitIntro
          title={sections[0]?.title || "Why Cleaning Comes First"}
          lead={introPs[0]}
          text={sections[0]?.text || introPs.slice(1)}
        />
      </section>

      {/* Blast Reveal Image */}
      <section className="container pb-[var(--sec-y-lg)]">
        <div className="w-full aspect-[21/9] overflow-hidden bg-slate-900 shadow-md">
          <img
            src={IMG.services.cleaning.c1}
            alt="Abrasive Blast Cleaning of Steel Surface"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Inspection Sheet (2x2 Grid with Checkboxes) */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {checklist.map((sec, idx) => (
            <div key={idx} className="border-t border-[var(--rule)] pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded bg-[var(--blue)] text-white flex items-center justify-center">
                  <CheckSquare2 size={16} />
                </div>
                <h3 className="text-[22px] font-bold text-[var(--ink)]">{sec.title}</h3>
              </div>
              {sec.bullets && sec.bullets.length > 0 ? (
                <ul className="space-y-2 text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                  {sec.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--blue)] mt-2 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
                  {sec.text}
                </p>
              )}
            </div>
          ))}
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
        image={IMG.services.cleaning.next}
        nextUrl="/services/painting/"
        nextTitle="Painting Services"
      />
    </article>
  );
};

// 9.32 Painting — signature: "Paint-wipe long-form"
export const PaintingLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const chooseSec = sections.find((s) => s.items && s.items.length >= 4) || sections[2];
  const chooseItems = chooseSec?.items || [
    { name: "Dry indoor buildings", text: "Standard single or dual-coat alkyd zinc phosphate primer system." },
    { name: "Outdoor structures", text: "Epoxy zinc-rich primer with high-build polyurethane topcoat UV protection." },
    { name: "Dairy and poultry sheds", text: "Chemical-resistant epoxy barriers resisting aggressive ammonia emissions." },
    { name: "Grain stores and tanks", text: "Food-grade non-toxic epoxy coatings approved for grain contact." },
  ];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.painting.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)] text-left">
        {/* Centered Prose Column */}
        <div className="max-w-[720px] mx-auto space-y-12">
          {/* Block 1 */}
          <div className="space-y-4">
            <h2 className="text-[28px] lg:text-[34px] font-bold text-[var(--ink)]">
              {sections[0]?.title || "Why the Coating Matters"}
            </h2>
            <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-lead)" }}>
              {sections[0]?.text}
            </p>
          </div>

          {/* Block 2 */}
          <div className="space-y-4">
            <h2 className="text-[26px] font-bold text-[var(--ink)]">
              {sections[1]?.title || "What a Coating System Is"}
            </h2>
            <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>
              {sections[1]?.text}
            </p>
          </div>
        </div>

        {/* Wipe Band 1 (p1) */}
        <div className="my-16 w-full aspect-[21/9] overflow-hidden bg-slate-900 shadow-md">
          <img src={IMG.services.painting.p1} alt="Primer Coating Application" className="w-full h-full object-cover" />
        </div>

        {/* Choosing by Use Grid (Breaks out to container) */}
        <div className="my-16 space-y-8">
          <h2 className="text-[26px] lg:text-[32px] font-bold text-[var(--ink)]">
            {chooseSec?.title || "Choosing by Use"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {chooseItems.map((it, idx) => (
              <div key={idx} className="border-t border-[var(--rule)] pt-6 space-y-3">
                <OutlineNum num={idx + 1} />
                <h3 className="text-[22px] font-bold text-[var(--ink)]">{it.name}</h3>
                <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>{it.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wipe Band 2 (p2) */}
        <div className="my-16 w-full aspect-[21/9] overflow-hidden bg-slate-900 shadow-md">
          <img src={IMG.services.painting.p2} alt="Intermediate Epoxy Coating" className="w-full h-full object-cover" />
        </div>

        {/* Remaining Prose */}
        <div className="max-w-[720px] mx-auto space-y-12">
          {sections.slice(3, 5).map((sec, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-[26px] font-bold text-[var(--ink)]">{sec.title}</h2>
              <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>{sec.text}</p>
            </div>
          ))}
        </div>

        {/* Wipe Band 3 (p3) */}
        <div className="my-16 w-full aspect-[21/9] overflow-hidden bg-slate-900 shadow-md">
          <img src={IMG.services.painting.p3} alt="Final Polyurethane Topcoat Finish" className="w-full h-full object-cover" />
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
        image={IMG.services.painting.next}
        nextUrl="/services/erection/"
        nextTitle="Erection Services"
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

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.erection.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Intro */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <SplitIntro
          title={sections[0]?.title || "What Erection Includes"}
          lead={introPs[0]}
          text={sections[0]?.text || introPs.slice(1)}
        />
      </section>

      {/* Crane Hook Rail (Vertical Progress Axis) */}
      <section className="container pb-[var(--sec-y-lg)] text-left relative">
        {/* Desktop Vertical Center Line with alternating steps */}
        <div className="hidden lg:block relative">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-[var(--rule)]" />
          <div className="space-y-16">
            {steps.map((st, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div key={idx} className="grid grid-cols-12 gap-10 items-center">
                  <div className={`col-span-5 ${isEven ? "order-1 text-right" : "order-1"}`}>
                    {!isEven && (
                      <div className="space-y-3">
                        <span className="text-[13px] font-mono font-semibold text-[var(--blue)] tracking-wider">
                          STEP {String(idx + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-[26px] font-[600] tracking-[-0.025em] text-[var(--ink)] leading-[1.1]">
                          <TwoTone text={st.name} />
                        </h3>
                        <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>{st.text}</p>
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 flex justify-center order-2">
                    <div className="w-4 h-4 rounded-full bg-[var(--blue)] ring-4 ring-white shadow-md" />
                  </div>
                  <div className={`col-span-5 ${isEven ? "order-3" : "order-3"}`}>
                    {isEven && (
                      <div className="space-y-3">
                        <span className="text-[13px] font-mono font-semibold text-[var(--blue)] tracking-wider">
                          STEP {String(idx + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-[26px] font-[600] tracking-[-0.025em] text-[var(--ink)] leading-[1.1]">
                          <TwoTone text={st.name} />
                        </h3>
                        <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>{st.text}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Left Rail */}
        <div className="lg:hidden relative pl-8 border-l-2 border-[var(--blue)] space-y-12">
          {steps.map((st, idx) => (
            <div key={idx} className="relative space-y-2">
              <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-[var(--blue)] ring-4 ring-white" />
              <span className="text-[12px] font-mono font-semibold text-[var(--blue)] tracking-wider block">
                STEP {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[20px] font-[600] tracking-[-0.025em] text-[var(--ink)] leading-[1.2]">
                <TwoTone text={st.name} />
              </h3>
              <p className="text-[var(--grey-strong)] text-[14px] leading-[1.65]">{st.text}</p>
            </div>
          ))}
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

      {/* Next Banner: Blue Classic Banner without image as per prompt */}
      <NextBand
        nextUrl="/services/after-sale-services/"
        nextTitle="After Sale Services"
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
