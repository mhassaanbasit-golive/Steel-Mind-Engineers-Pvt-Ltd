import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { ContentData, ContentBlock } from "../../../content/types.ts";
import { HeroBand } from "../../ui/HeroBand.tsx";
import { SubpageHero } from "../SubpageHero.tsx";
import { SubpageNextBanner } from "../SubpageNextBanner.tsx";
import { cl } from "../../../data/images.ts";
import { Accordion } from "../../ui/Accordion.tsx";
import { NextBand } from "../../ui/NextBand.tsx";
import { Steps } from "../../ui/Steps.tsx";
import { FrameDiagram } from "../../diagrams/FrameDiagram.tsx";
import { CraneDiagram } from "../../diagrams/CraneDiagram.tsx";
import { Pic } from "../../Pic.tsx";
import { TwoTone } from "../../page/TwoTone.tsx";
import { StageSwap } from "../../page/StageSwap.tsx";
import { StackCards } from "../../page/StackCards.tsx";
import { ImageAccordion } from "../../page/ImageAccordion.tsx";
import { lenis } from "../../../lib/lenis.ts";
import { gsap, ScrollTrigger } from "../../../lib/gsap.ts";
import { useReducedMotion } from "../../../hooks/useReducedMotion.ts";
import { ArrowLeft, ArrowRight } from "lucide-react";

function extractSections(data: ContentData) {
  const sections: { title: string; text: string; paragraphs: string[]; items?: { name: string; text: string }[] }[] = [];
  let current: { title: string; text: string; paragraphs: string[]; items?: { name: string; text: string }[] } | null = null;
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
    } else if ((b.type === "defs" || b.type === "steps") && b.items) {
      if (current) current.items = b.items;
    }
  });
  if (current) sections.push(current);

  return { introPs, sections };
}

// 9.1 Engineering Department — One-Step Solution typography & interactive 3-card hover layout
export const EngineeringLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const stepsBlock = sections.find((s) => s.items && s.items.length >= 6) || sections[1];
  const steps = stepsBlock?.items || [
    { name: "Requirement study", text: "Analyzing building purpose, dimensions and special loads." },
    { name: "Load calculation", text: "Computing dead, live, wind, and seismic loads to building codes." },
    { name: "Frame design", text: "Optimizing steel portal frame sections for strength and economy." },
    { name: "3D model", text: "Creating a complete virtual structural model for verification." },
    { name: "Detailing", text: "Producing shop fabrication and field erection drawings." },
    { name: "Internal check", text: "Multi-engineer review before steel fabrication begins." },
  ];

  const ledgerBlocks = sections.filter((s) => s !== stepsBlock && s !== sections[0]).slice(0, 3);

  return (
    <article className="w-full bg-white text-[var(--ink)]">
      {/* 1. Hero Band */}
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792007694/Engineering-hero.jpg"
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* 2. Intro Section: WHAT THE ENGINEERING DEPARTMENT DOES (matching One-Step Solution structural alignment) */}
      <section className="w-full bg-white py-[60px] lg:py-[100px] px-6 lg:px-8 border-b border-[#E5E5E5]">
        <div className="max-w-[1340px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start text-left">
          <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] uppercase">
            WHAT THE ENGINEERING DEPARTMENT DOES
          </h2>
          <div className="max-w-[560px]">
            <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal">
              {sections[0]?.text || introPs[0]}
            </p>
            {introPs.slice(1).length > 0 && (
              <p className="mt-4 text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal">
                {introPs.slice(1).join(" ")}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 3. Steps Rail: THE DESIGN PROCESS (matching One-Step Solution vertical rail padding & max-w 760px) */}
      <section className="w-full bg-white py-[72px] lg:py-[120px] px-6 lg:px-8">
        <div className="max-w-[760px] mx-auto text-left">
          <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] uppercase mb-12">
            THE DESIGN PROCESS
          </h2>

          <ol className="list-none m-0 p-0 relative">
            {steps.map((step, idx) => {
              const stepNumber = String(idx + 1).padStart(2, "0");
              const isLast = idx === steps.length - 1;

              return (
                <li
                  key={idx}
                  className={`relative pl-[44px] lg:pl-[64px] ${isLast ? "pb-0" : "pb-12 lg:pb-16"}`}
                >
                  {/* Rail: 2px blue vertical line */}
                  {!isLast && (
                    <div
                      className="absolute top-[28px] lg:top-[36px] bottom-0 w-[2px] pointer-events-none"
                      style={{
                        left: "16px",
                        backgroundColor: "var(--blue)",
                      }}
                    />
                  )}

                  {/* 10px dot centered on rail */}
                  <div
                    className="absolute rounded-full box-border z-[2]"
                    style={{
                      left: "16px",
                      top: "28px",
                      width: "10px",
                      height: "10px",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "var(--blue)",
                      border: "2px solid var(--blue)",
                    }}
                  />

                  {/* Number: solid, bold, var(--blue), placed above its title, like One-Step */}
                  <div className="text-[40px] lg:text-[64px] font-[800] text-[var(--blue)] leading-none select-none mb-3">
                    {stepNumber}
                  </div>

                  {/* Title: bold, ink colour, sentence case */}
                  <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-snug mb-2">
                    {step.name}
                  </h3>

                  {/* Text: the blue of One-Step body text (var(--blue)), regular weight */}
                  <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal max-w-[580px]">
                    {step.text}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 4. Wide View Photo: Clean framing, no grey border (matching One-Step layout) */}
      <section className="w-full bg-white px-6 lg:px-8 pb-[72px] lg:pb-[120px]">
        <div className="max-w-[1340px] mx-auto">
          <div className="w-full relative overflow-hidden bg-slate-900 shadow-sm" style={{ aspectRatio: "16 / 9" }}>
            <img
              src="https://res.cloudinary.com/cyfb9slf/image/upload/v1792007695/peb-engineering-wide.jpg"
              alt="PEB Engineering Wide View"
              className="w-full h-full object-cover block"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* 5. 3 Blocks: High-end interactive cards with hover transition & crisp typography */}
      {ledgerBlocks.length > 0 && (
        <section className="w-full bg-white px-6 lg:px-8 pb-[72px] lg:pb-[120px] text-left">
          <div className="max-w-[1340px] mx-auto">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-4">
              DELIVERABLES AND VALUE
            </h2>
            <div className="w-full h-[1px] bg-[#E5E5E5] mb-8 lg:mb-12" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {ledgerBlocks.map((blk, idx) => {
                const blockNum = String(idx + 1).padStart(2, "0");
                return (
                  <div
                    key={idx}
                    className="relative bg-white border border-[#E5E5E5] p-6 lg:p-8 flex flex-col justify-between group transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-2 hover:shadow-[0_16px_36px_rgba(30,58,138,0.08)] hover:border-[var(--blue)] overflow-hidden"
                  >
                    {/* 3px top blue accent line that expands smoothly from left to right on hover */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--blue)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] origin-left" />

                    <div>
                      {/* Number: solid, bold, var(--blue), placed above its title, like One-Step */}
                      <div className="text-[40px] lg:text-[48px] font-[800] text-[var(--blue)] leading-none select-none mb-3">
                        {blockNum}
                      </div>

                      {/* Title: bold, ink colour, sentence case, One-Step desktop 20px */}
                      <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-snug mb-3 group-hover:text-[var(--blue)] transition-colors duration-300">
                        {blk.title}
                      </h3>

                      {/* Text: the blue of One-Step body text, regular weight */}
                      <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal">
                        {blk.text}
                      </p>
                    </div>

                    {/* Interactive card footer accent */}
                    <div className="mt-6 pt-4 border-t border-[#E5E5E5] group-hover:border-[var(--blue)]/30 flex items-center justify-between text-[13px] font-semibold text-[var(--blue)] transition-colors">
                      <span>Engineering Specification</span>
                      <span className="transform group-hover:translate-x-1.5 transition-transform duration-300 inline-block" aria-hidden="true">&rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 6. Frequently Asked Questions */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white py-[60px] lg:py-[100px] px-6 lg:px-8 border-t border-[#E5E5E5] text-left">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* 7. Next Band */}
      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033592/Primary-framing-hero.jpg"
        nextUrl="/pre-engineered-buildings-pakistan/primary-framing-system/"
        nextTitle="Primary Framing System"
      />
    </article>
  );
};

// 9.2 Primary Framing System (Portion 2.2) — numerals removed completely, One-Step TEXT STYLE applied
export const PrimaryFramingLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const typesSec = sections.find((s) => s.items && s.items.length >= 10) || sections[2];
  const types = (typesSec?.items || []).map((it) => ({
    name: it.name.replace(/^\d+[\.\s\-_]*/, ""), // Strip any leading numbers
    desc: it.text,
  }));

  const [activeIdx, setActiveIdx] = useState(0);
  const activeType = types[activeIdx] || { name: "Clear Span (CS)", desc: "One rafter spans the full width with no inner columns." };
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <article className="w-full bg-white text-[var(--ink)]">
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033592/Primary-framing-hero.jpg"
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)] text-left max-w-[1340px] mx-auto">
        <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] uppercase mb-4">
          WHAT THE PRIMARY FRAME IS
        </h2>
        <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal max-w-[880px]">
          {sections[0]?.text || introPs[0]}
        </p>
      </section>

      {/* Catalogue viewer without numbers */}
      <section className="container pb-[var(--sec-y-lg)]">
        {/* Mobile sticky chip bar (names only, no numerals) */}
        <div
          data-lenis-prevent=""
          className="lg:hidden sticky z-30 bg-white py-3 -mx-4 px-4 overflow-x-auto flex gap-2 border-b border-[rgba(15,23,42,0.12)]"
          style={{ top: "var(--nav-offset, 60px)", scrollSnapType: "x proximity" }}
        >
          {types.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`px-3.5 py-2 whitespace-nowrap rounded-none border text-[13px] font-semibold transition-colors cursor-pointer ${
                activeIdx === idx
                  ? "bg-[var(--blue)] text-white border-[var(--blue)]"
                  : "bg-white text-[#0A0A0A] border-[rgba(15,23,42,0.12)]"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mt-6 lg:mt-0 text-left">
          {/* Left sticky list without numerals */}
          <div
            className="hidden lg:block lg:col-span-4 sticky"
            style={{ top: "calc(var(--nav-offset, 80px) + 24px)" }}
          >
            <div className="relative border-l-2 border-[rgba(15,23,42,0.12)] pl-4">
              <div
                className="absolute left-[-2px] w-[2px] bg-[var(--blue)] transition-transform duration-300"
                style={{
                  height: "56px",
                  transform: `translateY(${activeIdx * 56}px)`,
                }}
              />
              {types.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`w-full h-[56px] flex items-center justify-between text-left cursor-pointer transition-colors px-2 ${
                    activeIdx === idx ? "text-[var(--blue)] font-bold" : "text-[var(--blue)] hover:text-[#0A0A0A] font-medium"
                  }`}
                >
                  <span className="text-[14px]">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right stage card without numerals */}
          <div className="lg:col-span-8 border border-[rgba(15,23,42,0.12)] p-6 lg:p-12 text-left bg-white min-h-[560px] flex flex-col justify-between shadow-sm">
            <div className="w-full max-h-[360px] flex items-center justify-center py-6 bg-slate-50/60 border border-[rgba(15,23,42,0.12)]">
              <FrameDiagram type={activeType.name} className="max-w-[480px] w-full" />
            </div>

            <div className="mt-8 pt-6 border-t border-[rgba(15,23,42,0.12)] flex flex-col justify-between">
              <div>
                <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-snug mb-3">
                  {activeType.name}
                </h3>
                <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal">
                  {activeType.desc}
                </p>
              </div>

              <div className="mt-6 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="link-arrow text-[var(--blue)] font-semibold text-[14px] inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Enlarge Diagram</span>
                  <span className="btn-arrow inline-block" aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enlarge Diagram Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 z-[500] bg-black/80 flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-8 max-w-[800px] w-full rounded shadow-2xl relative text-left"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-snug">{activeType.name}</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[24px] font-bold text-[var(--blue)] hover:text-[#0A0A0A] cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="w-full py-8 flex items-center justify-center bg-slate-50">
              <FrameDiagram type={activeType.name} className="max-w-[640px] w-full" />
            </div>
            <p className="mt-6 text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal">{activeType.desc}</p>
          </div>
        </div>
      )}

      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033592/primary-framing-next.jpg"
        nextUrl="/pre-engineered-buildings-pakistan/basic-parameters/"
        nextTitle="Basic Parameters"
      />
    </article>
  );
};

// 9.3 Basic Parameters — Two-column sticky image stack & rail layout
interface BasicParamItem {
  num: string;
  title: string;
  text: string;
  image: string;
}

const BASIC_PARAM_ITEMS: BasicParamItem[] = [
  {
    num: "01",
    title: "Width",
    text: "The distance between the two side walls, measured from the outside face of one sidewall girt to the outside face of the other. This sets the span of the frame.",
    image:
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033597/sub-structures-hero.jpg",
  },
  {
    num: "02",
    title: "Length",
    text: "The distance along the building between the end walls. It is divided into bays.",
    image:
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033598/sub-structures-wide.jpg",
  },
  {
    num: "03",
    title: "Bay spacing",
    text: "The distance between two frames. The best spacing depends on the loads and the roof system, and the engineer will confirm it.",
    image:
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033592/Primary-framing-hero.jpg",
  },
  {
    num: "04",
    title: "Eave height",
    text: "The height from the floor to the top of the outer eave purlin. Set it from the tallest machine, stack or truck that must enter. Clear height, measured to the bottom of the rafter, and ridge height, measured to the peak, are also stated.",
    image:
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033593/basic-parameters-1.jpg",
  },
  {
    num: "05",
    title: "Roof slope",
    text: "The angle of the roof. A low slope between 0.5 in 10 and 1.5 in 10 is common for PEB. Rain and sheet type affect the choice.",
    image:
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792007695/peb-engineering-wide.jpg",
  },
  {
    num: "06",
    title: "Loads",
    text: "Include the dead load, the live load, wind, and any special loads such as solar panels, hanging equipment or cranes.",
    image:
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033599/crane-system-hero.jpg",
  },
  {
    num: "07",
    title: "Location",
    text: "The site decides wind speed and rain intensity. Give the city and, if possible, the exact site.",
    image:
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792007694/Engineering-hero.jpg",
  },
  {
    num: "08",
    title: "Openings",
    text: "List the number, size and position of doors, windows and loading docks.",
    image:
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033608/accessories-3.jpg",
  },
  {
    num: "09",
    title: "Extras",
    text: "Mention any crane, mezzanine, insulation, skylight or future extension.",
    image:
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033601/mezzanine-1.jpg",
  },
];

const INITIAL_RATIOS: number[] = [
  1024 / 572, // 1 Width: 1.790
  1024 / 430, // 2 Length: 2.381
  1024 / 572, // 3 Bay spacing: 1.790
  1024 / 687, // 4 Eave height: 1.491
  1024 / 572, // 5 Roof slope: 1.790
  1024 / 572, // 6 Loads: 1.790
  1024 / 572, // 7 Location: 1.790
  1024 / 687, // 8 Openings: 1.491
  1024 / 687, // 9 Extras: 1.491
];

export const BasicParametersLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);

  const [activeIdx, setActiveIdx] = useState<number>(0);
  const activeIdxRef = useRef<number>(0);

  const [displayedIdx, setDisplayedIdx] = useState<number>(0);
  const [incomingIdx, setIncomingIdx] = useState<number | null>(null);
  const [enterActive, setEnterActive] = useState<boolean>(false);
  const animTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [imageRatios, setImageRatios] = useState<number[]>(INITIAL_RATIOS);

  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileImageBoxRef = useRef<HTMLDivElement | null>(null);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Handle activeIdx image transitions:
  // Smooth, heavy Framer-like transition with ease cubic-bezier(.16, 1, .3, 1)
  useEffect(() => {
    if (prefersReduced) {
      setDisplayedIdx(activeIdx);
      setIncomingIdx(null);
      setEnterActive(false);
      return;
    }

    if (activeIdx !== displayedIdx && activeIdx !== incomingIdx) {
      if (incomingIdx !== null) {
        setDisplayedIdx(incomingIdx);
      }
      if (animTimeoutRef.current) {
        clearTimeout(animTimeoutRef.current);
      }

      setIncomingIdx(activeIdx);
      setEnterActive(false);

      const raf = requestAnimationFrame(() => {
        setEnterActive(true);
      });

      animTimeoutRef.current = setTimeout(() => {
        setDisplayedIdx(activeIdx);
        setIncomingIdx(null);
        setEnterActive(false);
      }, 870);

      return () => {
        cancelAnimationFrame(raf);
      };
    }
  }, [activeIdx, displayedIdx, incomingIdx, prefersReduced]);

  // Scroll position detection:
  // Desktop: take the row whose top is above 50% of the screen.
  // Mobile: target reading zone between bottom of sticky image container and screen bottom.
  const updateActiveIndex = useCallback(() => {
    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      if (!mobileImageBoxRef.current) return;
      const boxRect = mobileImageBoxRef.current.getBoundingClientRect();
      const readingTop = Math.max(0, boxRect.bottom);
      const readingBottom = window.innerHeight;
      const targetY = readingTop + (readingBottom - readingTop) * 0.42;

      let matchedIdx = activeIdxRef.current;
      for (let i = 0; i < rowRefs.current.length; i++) {
        const rowEl = rowRefs.current[i];
        if (!rowEl) continue;
        const rect = rowEl.getBoundingClientRect();
        if (rect.top <= targetY && rect.bottom >= targetY) {
          matchedIdx = i;
          break;
        }
      }

      if (matchedIdx !== activeIdxRef.current) {
        activeIdxRef.current = matchedIdx;
        setActiveIdx(matchedIdx);
      }
    } else {
      const triggerY = window.innerHeight * 0.5;
      let matchedIdx = 0;
      rowRefs.current.forEach((rowEl, idx) => {
        if (!rowEl) return;
        const rect = rowEl.getBoundingClientRect();
        if (rect.top <= triggerY) {
          matchedIdx = idx;
        }
      });

      if (matchedIdx !== activeIdxRef.current) {
        activeIdxRef.current = matchedIdx;
        setActiveIdx(matchedIdx);
      }
    }
  }, []);

  useEffect(() => {
    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateActiveIndex();
      });
    };

    updateActiveIndex();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    let unsubscribeLenis: (() => void) | undefined;
    const l = lenis;
    if (l) {
      const lenisHandler = () => onScroll();
      l.on("scroll", lenisHandler);
      unsubscribeLenis = () => {
        l.off("scroll", lenisHandler);
      };
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (unsubscribeLenis) unsubscribeLenis();
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, [updateActiveIndex]);

  const note1 = sections.find((s) => s.title.includes("Framing")) || {
    title: "Framing and Sheeting in the Parameters",
    text: "Primary framing means the columns and rafters. Secondary framing means the purlins and girts that carry the sheets and brace the main frames. The sheeting is the roof and wall cover, usually hot-dip galvanized, zinc-aluminium coated steel.",
  };

  const note2 = sections.find((s) => s.title.includes("Data")) || {
    title: "If You Do Not Have All the Data",
    text: "Send what you have. The engineer will ask for the rest. A rough sketch or a photo of the site is enough to begin.",
  };

  const currentRatio = imageRatios[activeIdx] || 16 / 9;

  // Render Image Box & Stack with heavy, smooth Framer-like switching
  const renderStackedImageBox = () => (
    <div
      className="relative w-full overflow-hidden bg-[#0A0A0A] rounded-none shadow-sm select-none"
      style={{
        aspectRatio: `${currentRatio}`,
        transition: prefersReduced
          ? "none"
          : "aspect-ratio 700ms cubic-bezier(.16, 1, .3, 1)",
      }}
    >
      {/* Hidden preloader and aspect ratio detector */}
      <div className="hidden" aria-hidden="true">
        {BASIC_PARAM_ITEMS.map((item, idx) => (
          <img
            key={idx}
            src={cl(item.image, 1920)}
            alt=""
            loading="eager"
            onLoad={(e) => {
              const { naturalWidth, naturalHeight } = e.currentTarget;
              if (naturalWidth && naturalHeight) {
                const ratio = naturalWidth / naturalHeight;
                setImageRatios((prev) => {
                  if (Math.abs(prev[idx] - ratio) > 0.01) {
                    const next = [...prev];
                    next[idx] = ratio;
                    return next;
                  }
                  return prev;
                });
              }
            }}
          />
        ))}
      </div>

      {/* Base (old) image - smoothly stays underneath with subtle scale back at 100% opacity */}
      <div
        className="absolute inset-0 w-full h-full z-[1] overflow-hidden bg-black"
        style={{
          transform: enterActive ? "scale(0.98)" : "scale(1)",
          opacity: 1,
          transition: prefersReduced
            ? "none"
            : "transform 850ms cubic-bezier(.16, 1, .3, 1)",
        }}
      >
        <img
          src={cl(BASIC_PARAM_ITEMS[displayedIdx].image, 1920)}
          alt={BASIC_PARAM_ITEMS[displayedIdx].title}
          className="w-full h-full object-cover block"
          loading="eager"
        />
      </div>

      {/* Active incoming image - enters with clip-path wipe and subtle scale settle at 100% opacity */}
      {incomingIdx !== null && (
        <div
          className="absolute inset-0 w-full h-full z-[2] overflow-hidden pointer-events-none"
          style={{
            clipPath: enterActive ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
            opacity: 1,
            transition: prefersReduced
              ? "none"
              : "clip-path 850ms cubic-bezier(.16, 1, .3, 1)",
            willChange: "clip-path, transform",
          }}
        >
          <img
            src={cl(BASIC_PARAM_ITEMS[incomingIdx].image, 1920)}
            alt={BASIC_PARAM_ITEMS[incomingIdx].title}
            className="w-full h-full object-cover block"
            style={{
              transform: enterActive ? "scale(1)" : "scale(1.04)",
              transition: prefersReduced
                ? "none"
                : "transform 850ms cubic-bezier(.16, 1, .3, 1)",
              willChange: "transform",
            }}
            loading="eager"
          />
        </div>
      )}
    </div>
  );

  // Render 9 indicator bars with rounded geometry and smooth active state
  const renderIndicatorBars = () => (
    <div className="flex items-center gap-[6px] w-full mt-3">
      {BASIC_PARAM_ITEMS.map((_, idx) => (
        <div
          key={idx}
          className="h-[2.5px] rounded-full flex-1 transition-all duration-700"
          style={{
            backgroundColor:
              activeIdx === idx
                ? "var(--blue)"
                : "rgba(30, 58, 138, 0.16)",
            transform: activeIdx === idx ? "scaleY(1.3)" : "scaleY(1)",
          }}
        />
      ))}
    </div>
  );

  return (
    <article className="w-full bg-white text-[var(--ink)] overflow-x-clip">
      {/* 1. HERO BANNER: One-Step Solution style SubpageHero */}
      <SubpageHero
        title={data.h1}
        subtitle={data.quickAnswer}
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033593/Basic-parameters-hero.jpg"
        quoteUrl="/contact-us/#quote"
        compact={true}
      />

      {/* 2. INTRO: "WHY THESE PARAMETERS MATTER" using exact TEXT STYLE */}
      <section className="w-full bg-white py-12 lg:py-20 border-b border-[#E5E5E5]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] text-left">
          <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em]">
            WHY THESE PARAMETERS MATTER
          </h2>
          <div className="w-full h-[1px] bg-[#E5E5E5] my-6" />
          <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal max-w-[880px]">
            {sections[0]?.text ||
              introPs[0] ||
              "Every design starts with a few numbers. If they are correct, the quote is accurate and the design is fast. If they are wrong, the structure may be too weak or too costly. Collect the items below before you request a quote."}
          </p>
        </div>
      </section>

      {/* 3 & 4. PARAMETERS RAIL SECTION:
          Includes the mobile sticky image container INSIDE the section,
          solid opaque white with z-40 and isolation isolate so no dot ever bleeds or shows inside the image! */}
      <section className="relative w-full bg-white border-b border-[#E5E5E5]">
        {/* Mobile Sticky Image Box:
            Strictly z-40 with solid 100% opaque white background, completely obscuring rail dots underneath! */}
        <div
          ref={mobileImageBoxRef}
          className="lg:hidden sticky z-40 bg-white w-full pt-3 pb-3 border-b border-[#E5E5E5] shadow-sm"
          style={{
            top: "var(--nav-offset, 60px)",
            isolation: "isolate",
            backgroundColor: "#FFFFFF",
          }}
        >
          <div className="px-4">
            {renderStackedImageBox()}
            {renderIndicatorBars()}
          </div>
        </div>

        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] py-8 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-[88px] items-start">
            {/* Desktop Left: Sticky image box holding all 9 images stacked + 9 indicator bars */}
            <div
              className="hidden lg:block lg:col-span-6 sticky"
              style={{ top: "calc(var(--nav-offset, 80px) + 24px)" }}
            >
              {renderStackedImageBox()}
              {renderIndicatorBars()}
            </div>

            {/* Right: The 9 parameters on a rail (Desktop & Mobile) */}
            <div className="col-span-1 lg:col-span-6 relative">
              {/* 2px blue vertical rail line (z-[2] so it stays underneath sticky mobile image) */}
              <div
                className="absolute top-0 bottom-0 w-[2px] pointer-events-none z-[2]"
                style={{
                  left: "12px",
                  backgroundColor: "var(--blue)",
                }}
              />

              {/* The 9 parameter rows */}
              <div className="flex flex-col">
                {BASIC_PARAM_ITEMS.map((item, idx) => {
                  const isActive = activeIdx === idx;

                  return (
                    <div
                      key={idx}
                      ref={(el) => {
                        rowRefs.current[idx] = el;
                      }}
                      className="relative min-h-[70svh] lg:min-h-[52svh] flex flex-col justify-center text-left py-8 lg:py-8 pl-[36px]"
                    >
                      {/* 10px dot: z-[2] so it scrolls cleanly BEHIND the z-30 mobile sticky image container!
                          Never visible inside or across the photo from any angle! */}
                      <div
                        className="absolute rounded-full transition-all duration-500 z-[2]"
                        style={{
                          left: "12px",
                          top: "calc(50% - 20px)",
                          width: "10px",
                          height: "10px",
                          transform: "translate(-50%, -50%)",
                          backgroundColor: isActive ? "var(--blue)" : "#FFFFFF",
                          border: "2px solid var(--blue)",
                        }}
                      />

                      {/* Number: solid, bold, var(--blue), placed above its title, like One-Step */}
                      <div className="text-[40px] lg:text-[64px] font-[800] text-[var(--blue)] leading-none select-none">
                        {item.num}
                      </div>

                      {/* Title: bold, ink colour, sentence case */}
                      <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-snug mt-3 mb-2">
                        {item.title}
                      </h3>

                      {/* Text: the blue of the One-Step body text (var(--blue)), regular weight, full colour */}
                      <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal max-w-[540px]">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BELOW NOTES: Two columns (gap 64px on desktop), stacked on mobile, 1px top line that draws, title, text. No box, no tint, no side line. */}
      <section className="w-full bg-white py-12 lg:py-20 border-b border-[#E5E5E5]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[64px]">
            {note1 && (
              <div className="relative pt-6">
                <div className="w-full h-[1px] bg-[#E5E5E5] absolute top-0 left-0" />
                <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-snug mb-3 uppercase">
                  {note1.title}
                </h3>
                <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal">
                  {note1.text}
                </p>
              </div>
            )}

            {note2 && (
              <div className="relative pt-6">
                <div className="w-full h-[1px] bg-[#E5E5E5] absolute top-0 left-0" />
                <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-snug mb-3 uppercase">
                  {note2.title}
                </h3>
                <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal">
                  {note2.text}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white py-12 lg:py-20 border-b border-[#E5E5E5]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] text-left">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <div className="max-w-[860px]">
              <Accordion items={data.faq} size="large" />
            </div>
          </div>
        </section>
      )}

      {/* 7. NEXT BANNER: SubpageNextBanner with exact next image */}
      <SubpageNextBanner
        heading="Next in Pre-Engineered Buildings"
        title="Sub Structures"
        url="/pre-engineered-buildings-pakistan/sub-structures/"
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033595/basic-parameters-next.jpg"
      />
    </article>
  );
};

// Helper: Wide band with 1200ms curtain reveal at 64:27 aspect ratio
const WideBandCurtain: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReduced) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <section ref={containerRef} className="w-full my-[var(--sec-y-lg)] overflow-hidden">
      <div
        className="w-full relative overflow-hidden"
        style={{
          aspectRatio: "64 / 27",
          clipPath: revealed || prefersReduced ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
          transition: prefersReduced
            ? "none"
            : "clip-path 1200ms cubic-bezier(.16, 1, .3, 1)",
          willChange: "clip-path",
        }}
      >
        <img
          src={cl(src, 2560)}
          alt={alt}
          className="w-full h-full object-cover block select-none pointer-events-none"
          style={{
            transform: revealed || prefersReduced ? "scale(1)" : "scale(1.04)",
            transition: prefersReduced
              ? "none"
              : "transform 1200ms cubic-bezier(.16, 1, .3, 1)",
            willChange: "transform",
          }}
          loading="lazy"
        />
      </div>
    </section>
  );
};

// 9.4 Sub Structures (Portion 2.3) — wipe rows, 64:27 wide band, add-on carousel
export const SubStructuresLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const secFraming = sections.find((s) => s.title.includes("Secondary Framing")) || sections[1];
  const secondaryItems = [
    {
      num: "01",
      name: "Purlins",
      text: "Purlins run along the roof from frame to frame and support the roof sheets. They are light cold-formed steel sections that are strong for their weight.",
    },
    {
      num: "02",
      name: "Girts",
      text: "Girts run along the walls from column to column. They support the wall sheets and carry wind load from the wall into the frames.",
    },
    {
      num: "03",
      name: "Bracing",
      text: "Bracing prevents the building from swaying. Rods or angles form an X pattern in the roof and the walls. Without bracing, even a strong frame can fail in a storm.",
    },
    {
      num: "04",
      name: "Roof and wall sheeting",
      text: "Covers the building. Profiled steel sheets are coated against corrosion and come in many colors. Single-skin sheets suit simple sheds. Insulated panels suit cold stores, poultry sheds and offices because they lower heat inside the building.",
    },
  ];

  const addOns = [
    {
      num: "01",
      name: "Canopy",
      desc: "A projecting roof over loading docks, entrances and walkways. It shelters people and goods from sun and rain.",
    },
    {
      num: "02",
      name: "Fascia",
      desc: "A horizontal band along the roof edge that hides the gutter and the ends of the roof sheets. It gives the building a clean finished line.",
    },
    {
      num: "03",
      name: "Jack beam",
      desc: "A beam that supports a rafter or purlin where a column has been left out. It allows a wide opening such as a large door or loading bay.",
    },
    {
      num: "04",
      name: "Partitions",
      desc: "Steel-framed internal walls that divide the building into offices, stores or production zones. They can carry insulation for sound and temperature control.",
    },
    {
      num: "05",
      name: "Portal brace",
      desc: "A braced frame built into a side or end wall. It resists wind while leaving a wide opening for doors.",
    },
    {
      num: "06",
      name: "Roof monitor",
      desc: "A raised section along the ridge, fitted with louvers or glazing. It admits daylight and releases hot air.",
    },
    {
      num: "07",
      name: "Roof platform",
      desc: "A safe, slip-resistant platform on the roof for maintaining fans, tanks and other equipment.",
    },
    {
      num: "08",
      name: "Stairs",
      desc: "Steel staircases with correct tread depth, riser height and handrails. See Steel Stairs.",
    },
  ];

  const fastenersSec = sections.find((s) => s.title.includes("Fasteners")) || sections[3];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const scrollByCard = (dir: number) => {
    if (carouselRef.current) {
      const cardW = carouselRef.current.firstElementChild?.clientWidth || 360;
      carouselRef.current.scrollBy({ left: dir * (cardW + 32), behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const maxScroll = scrollWidth - clientWidth;
      setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - carouselRef.current.offsetLeft;
    scrollLeftRef.current = carouselRef.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDraggingRef.current = false;
  };

  const onMouseUp = () => {
    isDraggingRef.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  return (
    <article className="w-full bg-white text-[var(--ink)]">
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033597/sub-structures-hero.jpg"
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* 1. Intro: No vertical bar, 2 columns on desktop (heading left, text right), stacked on mobile */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] uppercase">
              {sections[0]?.title?.toUpperCase() || "WHAT THE SUB STRUCTURE IS"}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal max-w-[640px]">
              {introPs[0] || sections[0]?.text}
            </p>
            {introPs.slice(1).length > 0 && (
              <p className="mt-4 text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal max-w-[640px]">
                {introPs.slice(1).join(" ")}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. Secondary Framing (4 wipe rows, 3 columns: number, title 5fr, text 7fr. Row padding 48px 0, 1px lines. Hover moves right 20px and draws 2px blue line) */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <div className="border-t border-b border-[#E5E5E5] divide-y divide-[#E5E5E5]">
          {secondaryItems.map((item, idx) => (
            <div
              key={idx}
              className="py-[48px] grid grid-cols-1 lg:grid-cols-[auto_5fr_7fr] gap-4 lg:gap-12 items-baseline group transition-all duration-500 cursor-default"
              style={{ overflowWrap: "anywhere", minWidth: 0 }}
            >
              {/* Number: solid, bold, var(--blue), placed above title like One-Step */}
              <div className="transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-5">
                <span className="text-[40px] lg:text-[64px] font-[800] text-[var(--blue)] leading-none select-none block">
                  {item.num}
                </span>
              </div>

              {/* Title: bold, ink colour, sentence case with 2px blue line on hover */}
              <div className="transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-5 min-w-0">
                <div className="relative inline-block max-w-full">
                  <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-snug">
                    {item.name}
                  </h3>
                  <div className="h-[2px] w-full bg-[var(--blue)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] origin-left" />
                </div>
              </div>

              {/* Text: the blue of One-Step, regular weight */}
              <div className="min-w-0">
                <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal max-w-[560px]">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Wide Band: 100vw, aspect-ratio 64/27, no max-height, no crop, curtain reveal 1200ms */}
      <WideBandCurtain
        src="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033598/sub-structures-wide.jpg"
        alt="PEB Sub Structures Wide Band"
      />

      {/* 4. Add-on Carousel without borders or fill, scroll snap mandatory, 2px progress line */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <div className="flex justify-between items-baseline mb-8">
          <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em]">
            ADD-ON STRUCTURES
          </h2>
          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous card"
              className="w-11 h-11 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A0A0A] hover:bg-[var(--blue)] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next card"
              className="w-11 h-11 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A0A0A] hover:bg-[var(--blue)] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          onScroll={handleScroll}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          data-lenis-prevent=""
          className="flex gap-4 lg:gap-8 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 cursor-grab active:cursor-grabbing"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {addOns.map((ao, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[78vw] lg:w-[calc((100%-64px)/3)] snap-start border-t border-[#E5E5E5] hover:border-[var(--blue)] pt-6 space-y-3 transition-colors duration-500 group select-none"
              style={{ minHeight: "220px" }}
            >
              {/* Number: solid, bold, var(--blue), placed above title */}
              <div className="text-[40px] lg:text-[64px] font-[800] text-[var(--blue)] leading-none select-none">
                {ao.num}
              </div>

              {/* Title: bold, ink colour, sentence case */}
              <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-snug">
                {ao.name}
              </h3>

              {/* Text: the blue of One-Step */}
              <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal">
                {ao.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 2px progress line under the track */}
        <div className="w-full h-[2px] bg-[rgba(15,23,42,0.12)] mt-6 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-[var(--blue)] transition-all duration-150 origin-left"
            style={{ width: `${Math.max(scrollProgress * 100, 16)}%` }}
          />
        </div>
      </section>

      {/* 5. Fasteners and Sealing: Two columns with top line, no grey band */}
      {fastenersSec && (
        <section className="container pb-[var(--sec-y-lg)] text-left border-t border-[#E5E5E5] pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em]">
                {fastenersSec.title?.toUpperCase() || "FASTENERS AND SEALING"}
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal max-w-[640px]">
                {fastenersSec.text}
              </p>
            </div>
          </div>
        </section>
      )}

      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033597/sub-structures-next.jpg"
        nextUrl="/pre-engineered-buildings-pakistan/crane-system/"
        nextTitle="Crane System"
      />
    </article>
  );
};

// 9.5 Crane System (Portion 2.4) — clean diagrams, no grid background, no numbers, no overlap at 360px
export const CraneSystemLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const sheets = [
    {
      title: "Jib crane and monorail crane",
      desc: "Cantilevered arm or single linear I-beam track serving localized workstations and manufacturing bays.",
      diagram: "Jib & Monorail",
    },
    {
      title: "Semi-gantry crane",
      desc: "One runway rail mounted on the building column and the other running on ground tracks for versatile floor clearance.",
      diagram: "Semi-Gantry",
    },
    {
      title: "Top-running crane in clear-span building",
      desc: "High-capacity heavy crane trolley traveling atop elevated runway beams supported by reinforced portal columns.",
      diagram: "Top-Running Clear Span",
    },
    {
      title: "Top-running crane in multi-span building",
      desc: "Dual or multi-bay crane runways operating independently across parallel industrial assembly aisles.",
      diagram: "Top-Running Multi-Span",
    },
    {
      title: "Underhung crane",
      desc: "Suspended crane trolley riding on the lower flanges of roof rafters, saving crucial floor area for smaller loads.",
      diagram: "Underhung",
    },
  ];

  const introSec = sections[0];
  const [modalDiagram, setModalDiagram] = useState<string | null>(null);

  return (
    <article className="w-full bg-white text-[var(--ink)]">
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033599/crane-system-hero.jpg"
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-[96px] items-start text-left">
          {/* Left Sticky Intro Block (4fr on desktop, sticky) */}
          <div
            className="lg:col-span-4 lg:sticky"
            style={{ top: "calc(var(--nav-offset, 80px) + 24px)" }}
          >
            <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] uppercase mb-4">
              WHY CRANE BUILDINGS NEED SPECIAL DESIGN
            </h2>
            <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal max-w-[440px]">
              {introSec?.text}
            </p>
          </div>

          {/* Right SVG Diagrams (8fr, 96px between arrangements, clean white page, no grid or card border) */}
          <div className="lg:col-span-8 space-y-[96px]">
            {sheets.map((sh, idx) => (
              <div
                key={idx}
                className="pt-8 border-t border-[#E5E5E5]"
              >
                {/* SVG diagram on the pure white page with NO fixed height wrapper and NO absolute positioning */}
                <div className="w-full bg-white flex items-center justify-center">
                  <CraneDiagram
                    type={sh.diagram}
                    className="w-full h-auto max-h-[360px] block static"
                  />
                </div>

                {/* Exactly 20px gap on mobile, 32px on desktop between diagram and title */}
                <div className="mt-5 lg:mt-8">
                  <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-snug mb-2">
                    {sh.title}
                  </h3>
                  <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal">
                    {sh.desc}
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setModalDiagram(sh.diagram)}
                    className="link-arrow text-[var(--blue)] font-semibold text-[14px] inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Enlarge Diagram</span>
                    <span className="btn-arrow inline-block" aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enlarge Diagram Modal */}
      {modalDiagram && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setModalDiagram(null)}
          className="fixed inset-0 z-[500] bg-black/80 flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-8 max-w-[800px] w-full rounded shadow-2xl relative text-left"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-snug">{modalDiagram}</h3>
              <button
                type="button"
                onClick={() => setModalDiagram(null)}
                className="text-[24px] font-bold text-[var(--blue)] hover:text-[#0A0A0A] cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="w-full py-8 flex items-center justify-center bg-slate-50">
              <CraneDiagram type={modalDiagram} className="max-w-[640px] w-full h-auto" />
            </div>
          </div>
        </div>
      )}

      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033599/crane-system-next.jpg"
        nextUrl="/pre-engineered-buildings-pakistan/mezzanine-system/"
        nextTitle="Mezzanine System"
      />
    </article>
  );
};

// 9.6 Mezzanine System — desktop expanding panels, 4 full-bleed stacking cards mobile, One-Step text style
export const MezzanineLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const panelsData = [
    {
      title: sections[0]?.title || "What a Mezzanine Is",
      text: sections[0]?.text || "",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033601/mezzanine-1.jpg",
    },
    {
      title: sections[1]?.title || "Parts of a Steel Mezzanine",
      text: sections[1]?.text || "",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033601/mezzanine-2.jpg",
    },
    {
      title: sections[2]?.title || "Load and Use",
      text: sections[2]?.text || "",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033603/mezzanine-3.jpg",
    },
    {
      title: sections[3]?.title || "Benefits",
      text: sections[3]?.text || "",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033603/mezzanine-5.jpg", // No mezzanine-4 photo
    },
  ];

  const experienceSec = sections[4] || sections[3];
  const [activePanel, setActivePanel] = useState<number>(0);
  const [mobileOpenIdx, setMobileOpenIdx] = useState<number>(0); // First open at load
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const mainRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const experienceSecRef = useRef<HTMLElement>(null);
  const experienceTitleRef = useRef<HTMLHeadingElement>(null);
  const experienceTextRef = useRef<HTMLParagraphElement>(null);

  const faqSecRef = useRef<HTMLElement>(null);
  const faqTitleRef = useRef<HTMLHeadingElement>(null);

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        debouncedRefresh();
      });
    }
  }, [debouncedRefresh]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop: min-width: 1024px
      mm.add("(min-width: 1024px)", () => {
        if (experienceSecRef.current && experienceTitleRef.current && experienceTextRef.current) {
          gsap.set([experienceTitleRef.current, experienceTextRef.current], {
            y: 24,
            opacity: 0,
          });

          ScrollTrigger.create({
            trigger: experienceSecRef.current,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              gsap.to([experienceTitleRef.current, experienceTextRef.current], {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "E1",
                stagger: 0.09,
                overwrite: "auto",
                onStart: () => {
                  gsap.set([experienceTitleRef.current, experienceTextRef.current], {
                    willChange: "transform, opacity",
                  });
                },
                onComplete: () => {
                  gsap.set([experienceTitleRef.current, experienceTextRef.current], {
                    clearProps: "willChange",
                  });
                },
              });
            },
          });
        }

        if (faqSecRef.current && faqTitleRef.current) {
          gsap.set(faqTitleRef.current, { y: 24, opacity: 0 });

          ScrollTrigger.create({
            trigger: faqSecRef.current,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              gsap.to(faqTitleRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "E1",
                overwrite: "auto",
                onStart: () => {
                  gsap.set(faqTitleRef.current, { willChange: "transform, opacity" });
                },
                onComplete: () => {
                  gsap.set(faqTitleRef.current, { clearProps: "willChange" });
                },
              });
            },
          });
        }
      });

      // Mobile: max-width: 1023px
      mm.add("(max-width: 1023px)", () => {
        // STACK: For every card except the last, create one ScrollTrigger:
        // trigger = NEXT card, start "top bottom", end = "top " + (that card's sticky top in px), scrub 1.4.
        // It tweens that card's .inner to scale .95 and its .shade to opacity .32 (ease "none").
        for (let i = 0; i < panelsData.length - 1; i++) {
          const nextCard = cardRefs.current[i + 1];
          const currentInner = innerRefs.current[i];
          const currentShade = shadeRefs.current[i];
          if (!nextCard || !currentInner || !currentShade) continue;

          const navOffset =
            parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue("--nav-offset")
            ) || 60;
          const stickyTopPx = navOffset + 12 + i * 10;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: nextCard,
              start: "top bottom",
              end: () => `top ${stickyTopPx}px`,
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });

          tl.to(
            currentInner,
            {
              scale: 0.95,
              ease: "none",
            },
            0
          );

          tl.to(
            currentShade,
            {
              opacity: 0.32,
              ease: "none",
            },
            0
          );
        }

        if (experienceSecRef.current && experienceTitleRef.current && experienceTextRef.current) {
          gsap.set([experienceTitleRef.current, experienceTextRef.current], {
            y: 24,
            opacity: 0,
          });

          ScrollTrigger.create({
            trigger: experienceSecRef.current,
            start: "top 90%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              gsap.to([experienceTitleRef.current, experienceTextRef.current], {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "E1",
                stagger: 0.09,
                overwrite: "auto",
                onStart: () => {
                  gsap.set([experienceTitleRef.current, experienceTextRef.current], {
                    willChange: "transform, opacity",
                  });
                },
                onComplete: () => {
                  gsap.set([experienceTitleRef.current, experienceTextRef.current], {
                    clearProps: "willChange",
                  });
                },
              });
            },
          });
        }

        if (faqSecRef.current && faqTitleRef.current) {
          gsap.set(faqTitleRef.current, { y: 24, opacity: 0 });

          ScrollTrigger.create({
            trigger: faqSecRef.current,
            start: "top 90%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              gsap.to(faqTitleRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "E1",
                overwrite: "auto",
                onStart: () => {
                  gsap.set(faqTitleRef.current, { willChange: "transform, opacity" });
                },
                onComplete: () => {
                  gsap.set(faqTitleRef.current, { clearProps: "willChange" });
                },
              });
            },
          });
        }
      });

      // Reduced motion: show final state immediately
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (experienceTitleRef.current && experienceTextRef.current) {
          gsap.set([experienceTitleRef.current, experienceTextRef.current], {
            y: 0,
            opacity: 1,
          });
        }
        if (faqTitleRef.current) {
          gsap.set(faqTitleRef.current, { y: 0, opacity: 1 });
        }
        innerRefs.current.forEach((el) => {
          if (el) gsap.set(el, { scale: 1 });
        });
        shadeRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 0 });
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const handlePanelMouseEnter = (idx: number) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setActivePanel(idx);
    }, 150);
  };

  const handlePanelMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  };

  const handlePanelClick = (idx: number) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setActivePanel(idx);
  };

  const handlePanelKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = (idx + 1) % panelsData.length;
      setActivePanel(next);
      panelRefs.current[next]?.focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (idx - 1 + panelsData.length) % panelsData.length;
      setActivePanel(prev);
      panelRefs.current[prev]?.focus();
    }
  };

  const toggleMobileAccordion = (idx: number) => {
    setMobileOpenIdx((prev) => (prev === idx ? -1 : idx));
    debouncedRefresh();
  };

  return (
    <article ref={mainRef} className="w-full bg-white text-[var(--ink)]">
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033605/mezzanine-hero.jpg"
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Main Section */}
      <section className="container py-[var(--sec-y-lg)]">
        {/* Desktop: Expanding Panels (flex: 5 on active, flex: 1 on others, transition flex-grow 900ms cubic-bezier(.16,1,.3,1)) */}
        <div className="hidden lg:flex h-[640px] gap-3">
          {panelsData.map((p, idx) => {
            const isActive = activePanel === idx;
            return (
              <div
                key={idx}
                ref={(el) => {
                  panelRefs.current[idx] = el;
                }}
                tabIndex={0}
                role="region"
                aria-label={p.title}
                onMouseEnter={() => handlePanelMouseEnter(idx)}
                onMouseLeave={handlePanelMouseLeave}
                onClick={() => handlePanelClick(idx)}
                onFocus={() => handlePanelClick(idx)}
                onKeyDown={(e) => handlePanelKeyDown(e, idx)}
                className="relative overflow-hidden cursor-pointer bg-slate-900 focus-visible:outline-none"
                style={{
                  flex: isActive ? 5 : 1,
                  transition: "flex-grow 900ms cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <img
                  src={cl(p.img, 1920)}
                  alt={p.title}
                  width={1920}
                  height={1288}
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-cover"
                  style={{
                    transform: isActive ? "scale(1)" : "scale(1.06)",
                    transition: "transform 1200ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  onLoad={debouncedRefresh}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                {/* Collapsed State: Vertical title only (no numbers) */}
                <div
                  className="absolute inset-0 p-6 flex flex-col justify-end items-start pointer-events-none"
                  style={{
                    opacity: isActive ? 0 : 1,
                    transition: "opacity 300ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <span
                    className="text-white font-bold text-[20px] whitespace-nowrap select-none uppercase"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    {p.title}
                  </span>
                </div>

                {/* Active State: Title + Text in white (fades in 450ms after 300ms delay). Fixed width 480px, clipped by panel */}
                <div
                  className="absolute bottom-10 left-10 text-left pointer-events-none z-10 w-[480px] max-w-[480px]"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transition: isActive
                      ? "opacity 450ms cubic-bezier(0.16, 1, 0.3, 1) 300ms"
                      : "opacity 200ms ease 0ms",
                  }}
                >
                  <h3 className="text-[20px] font-bold text-white leading-snug mb-3 uppercase tracking-[-0.01em]">
                    {p.title}
                  </h3>
                  <p className="text-white text-[16px] leading-[1.7] font-normal">
                    {p.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: 4 stacking cards with full-bleed photos, no borders, 64px row with title and plus icon */}
        <div className="lg:hidden relative w-full max-w-[540px] mx-auto flex flex-col pb-24">
          {panelsData.map((p, idx) => {
            const isOpen = mobileOpenIdx === idx;

            return (
              <div
                key={idx}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className="relative w-full"
                style={{
                  position: "sticky",
                  top: `calc(var(--nav-offset, 60px) + 12px + ${idx * 10}px)`,
                  zIndex: idx + 1,
                  marginBottom: "14svh",
                }}
              >
                {/* .inner holds the content with scale animation on scroll */}
                <div
                  ref={(el) => {
                    innerRefs.current[idx] = el;
                  }}
                  className="relative w-full bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden"
                  style={{ transformOrigin: "top center" }}
                >
                  {/* Photo edge to edge inside card at its real shape */}
                  <div
                    className="w-full bg-slate-900 overflow-hidden"
                    style={{ aspectRatio: "1024 / 687" }}
                  >
                    <img
                      src={cl(p.img, 1920)}
                      alt={p.title}
                      width={1024}
                      height={687}
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="w-full h-full object-cover block"
                      style={{ aspectRatio: "1024 / 687" }}
                      onLoad={debouncedRefresh}
                    />
                  </div>

                  {/* 64px row with title and plus icon */}
                  <button
                    type="button"
                    onClick={() => toggleMobileAccordion(idx)}
                    className="w-full h-[64px] min-h-[64px] px-5 flex items-center justify-between text-left cursor-pointer border-0 bg-white select-none focus-visible:outline-none"
                    aria-expanded={isOpen}
                  >
                    <h3 className="text-[17px] font-bold text-[#0A0A0A] leading-snug pr-3 uppercase">
                      {p.title}
                    </h3>
                    <span className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-[#0A0A0A]">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        style={{
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                          transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </button>

                  {/* Expandable text panel using grid-template-rows: 0fr -> 1fr, 600ms */}
                  <div
                    className="grid"
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition: "grid-template-rows 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <div className="min-h-0 overflow-hidden px-5">
                      <p
                        className="text-[15px] leading-[1.6] text-[#0A0A0A] font-normal pb-6"
                        style={{
                          opacity: isOpen ? 1 : 0,
                          transition: isOpen
                            ? "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1) 150ms"
                            : "opacity 200ms ease 0ms",
                        }}
                      >
                        {p.text}
                      </p>
                    </div>
                  </div>

                  {/* .shade (absolute dark overlay, opacity 0, tweens to 0.32) */}
                  <div
                    ref={(el) => {
                      shadeRefs.current[idx] = el;
                    }}
                    className="absolute inset-0 bg-black pointer-events-none"
                    style={{ opacity: 0 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Experience Band (Full Width Nav Blue, white text, RISE once) */}
      {experienceSec && (
        <section
          ref={experienceSecRef}
          className="w-full bg-[var(--blue)] text-white py-[var(--sec-y-lg)]"
        >
          <div className="container grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start text-left">
            <div className="lg:col-span-5">
              <h2
                ref={experienceTitleRef}
                className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-white uppercase leading-tight lg:leading-[1.15] tracking-[-0.02em]"
              >
                {experienceSec.title?.toUpperCase() || "EXPERIENCE"}
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p
                ref={experienceTextRef}
                className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-white font-normal max-w-[640px]"
              >
                {experienceSec.text}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Frequently Asked Questions */}
      {data.faq && data.faq.length > 0 && (
        <section ref={faqSecRef} className="container py-[var(--sec-y-lg)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2
              ref={faqTitleRef}
              className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8"
            >
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033606/mezzanine-next.jpg"
        nextUrl="/pre-engineered-buildings-pakistan/accessories/"
        nextTitle="Accessories"
      />
    </article>
  );
};

// Helper component for Category Photo with CURTAIN reveal
const CategoryCurtainPhoto: React.FC<{
  src: string;
  alt: string;
  isFirst?: boolean;
}> = ({ src, alt, isFirst = false }) => {
  const [ratio, setRatio] = useState<number>(3 / 2);
  const [revealed, setRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setRevealed(true);
      return;
    }
    const el = containerRef.current;
    if (!el) return;

    const tr = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => setRevealed(true),
    });

    return () => tr.kill();
  }, [reduced]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-slate-900"
      style={{
        aspectRatio: `${ratio}`,
      }}
    >
      <div
        className="w-full h-full overflow-hidden"
        style={{
          clipPath: revealed || reduced ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
          transition: reduced
            ? "none"
            : "clip-path 1200ms cubic-bezier(0.76, 0, 0.24, 1)",
          willChange: revealed ? "auto" : "clip-path",
        }}
      >
        <img
          src={cl(src, 1920)}
          alt={alt}
          width={1920}
          height={Math.round(1920 / ratio)}
          loading={isFirst ? "eager" : "lazy"}
          decoding="async"
          onLoad={(e) => {
            const { naturalWidth, naturalHeight } = e.currentTarget;
            if (naturalWidth && naturalHeight) {
              const r = naturalWidth / naturalHeight;
              if (Math.abs(r - ratio) > 0.01) {
                setRatio(r);
              }
            }
            ScrollTrigger.refresh();
          }}
          className="w-full h-full object-cover block"
          style={{
            transform: revealed || reduced ? "scale(1)" : "scale(1.06)",
            transition: reduced
              ? "none"
              : "transform 1560ms cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: revealed ? "auto" : "transform",
          }}
        />
      </div>
    </div>
  );
};

// 9.7 Accessories (Portion 2.6) — scrollspy index with ACTIVE scroll rule, mobile tab bar & accordion
export const AccessoriesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const categories = useMemo(() => [
    {
      id: "insulation",
      title: "Insulation",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033607/accessories-1.jpg",
      items: [
        {
          name: "Rockwool insulation board",
          text: "A dense mineral-wool board that insulates roofs and walls against heat and noise. It resists fire and moisture.",
        },
        {
          name: "Fiberglass insulation",
          text: "A light blanket laid under roof sheets or inside wall panels to reduce heat transfer and sound. It is easy to install.",
        },
      ],
    },
    {
      id: "light-and-air",
      title: "Light and Air",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033607/accessories-2.jpg",
      items: [
        {
          name: "Skylight",
          text: "Translucent roof panels that bring daylight inside and cut daytime electricity use.",
        },
        {
          name: "Ridge ventilator",
          text: "A continuous vent along the ridge that lets rising hot air and moisture leave without power.",
        },
        {
          name: "Turbo vent",
          text: "A wind-driven rotating ventilator on the roof. It removes heat, moisture and fumes without electricity.",
        },
        {
          name: "Power ventilator",
          text: "A motor-driven roof fan that pushes out hot, stale air and draws in fresh air in large enclosed spaces.",
        },
        {
          name: "Louver",
          text: "A set of slats in a wall opening that lets air pass while keeping out rain and sun. It is useful in poultry and dairy sheds.",
        },
      ],
    },
    {
      id: "doors-and-windows",
      title: "Doors and Windows",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033608/accessories-3.jpg",
      items: [
        {
          name: "Double sliding door",
          text: "A large door that opens along a track beside the wall. It saves floor space and gives a wide opening for vehicles.",
        },
        {
          name: "Hangar door",
          text: "A very large door for aircraft, vehicles or oversized equipment that leaves the floor clear when open.",
        },
        {
          name: "PU-filled door",
          text: "A door with a polyurethane foam core. It insulates against heat and sound and resists moisture, which suits cold rooms.",
        },
        {
          name: "Sectional motorized roll-up door",
          text: "An insulated door made of horizontal panels that rise overhead on a motor. It suits loading bays.",
        },
        {
          name: "Emergency exit door",
          text: "A fire-resistant door with panic hardware that opens quickly under pressure to give a clear escape route.",
        },
      ],
    },
    {
      id: "safe-access",
      title: "Safe Access",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033610/accessories-4.jpg",
      items: [
        {
          name: "Cage ladder",
          text: "A fixed vertical ladder enclosed by a safety cage, with anti-slip rungs, for roofs and elevated platforms.",
        },
        {
          name: "Staircase",
          text: "A steel stair with correct tread, riser and handrails for floors, platforms and roofs.",
        },
        {
          name: "Walkway",
          text: "A slip-resistant steel pathway with handrails that connects floors, mezzanines and equipment.",
        },
      ],
    },
  ], []);

  const howToChoose = sections.find((s) => s.title.includes("Choose")) || sections[5];
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const activeCategoryRef = useRef<number>(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isLockedRef = useRef(false);
  const lockTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile Accordion state: maps categoryIndex to currently open itemIndex (-1 for all closed)
  const [openMobileItems, setOpenMobileItems] = useState<Record<number, number>>({
    0: 0,
    1: -1,
    2: -1,
    3: -1,
  });

  const toggleMobileItem = (catIdx: number, itemIdx: number) => {
    setOpenMobileItems((prev) => ({
      ...prev,
      [catIdx]: prev[catIdx] === itemIdx ? -1 : itemIdx,
    }));
  };

  // Mobile Tab bar refs & underline measurement
  const tabTrackRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number }>({ left: 16, width: 80 });

  // Update underline and auto-center active tab
  useEffect(() => {
    const activeTab = tabRefs.current[activeCategory];
    if (activeTab && tabTrackRef.current) {
      setUnderlineStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
      });

      const track = tabTrackRef.current;
      const targetScroll = activeTab.offsetLeft - (track.clientWidth - activeTab.offsetWidth) / 2;
      track.scrollTo({ left: targetScroll, behavior: "smooth" });
    }
  }, [activeCategory]);

  // ACTIVE recipe scroll calculation:
  // Active category is the last one whose top is above navHeight + 160px.
  // Works identically scrolling down and scrolling back up!
  const updateActiveCategory = useCallback(() => {
    if (isLockedRef.current) return;
    const isMobile = window.innerWidth < 1024;
    const navH = isMobile ? 60 : 80;
    const targetThreshold = navH + 160;

    let matched = 0;
    for (let i = 0; i < sectionRefs.current.length; i++) {
      const el = sectionRefs.current[i];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= targetThreshold) {
          matched = i;
        }
      }
    }

    if (matched !== activeCategoryRef.current) {
      activeCategoryRef.current = matched;
      setActiveCategory(matched);
    }
  }, []);

  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateActiveCategory();
      });
    };

    updateActiveCategory();

    if (lenis) {
      lenis.on("scroll", handleScroll);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      if (lenis) lenis.off("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, [updateActiveCategory]);

  // Click on a category name: locks ACTIVE for 1200ms, then scroll control returns
  const selectCategory = (idx: number) => {
    activeCategoryRef.current = idx;
    setActiveCategory(idx);
    isLockedRef.current = true;
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => {
      isLockedRef.current = false;
    }, 1200);

    const el = sectionRefs.current[idx];
    if (el) {
      const isMobile = window.innerWidth < 1024;
      const navH = isMobile ? 60 : 80;
      const targetOffset = isMobile ? -(navH + 52) : -(navH + 24);

      if (lenis) {
        lenis.scrollTo(el, {
          offset: targetOffset,
          duration: 1.4,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        });
      } else {
        const top = el.getBoundingClientRect().top + window.scrollY + targetOffset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  return (
    <article className="w-full bg-white text-[var(--ink)]">
      {/* Hero Band */}
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033610/accessories-hero.jpg"
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Intro: "WHY ACCESSORIES MATTER" (TEXT STYLE uppercase bold ink) */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] uppercase mb-4">
          WHY ACCESSORIES MATTER
        </h2>
        <div className="w-full h-[1px] bg-[#E5E5E5] my-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal">
            {introPs[0] || sections[0]?.text || "The frame and the sheets make a building. The accessories make it comfortable, safe and usable. Steel Mind Engineers supplies and fits them with the building, so each item is ordered at the right stage and carries the same finish as the rest of the structure."}
          </p>
          {introPs[1] && (
            <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal">
              {introPs[1]}
            </p>
          )}
        </div>
      </section>

      {/* Mobile Sticky Tab Bar (white bg, 1px bottom line, no shadow, sliding 2px blue underline) */}
      <div
        className="lg:hidden sticky z-40 bg-white border-b border-[#E5E5E5] w-full"
        style={{ top: "var(--nav-offset, 60px)" }}
      >
        <div
          ref={tabTrackRef}
          data-lenis-prevent=""
          className="flex items-center overflow-x-auto scrollbar-none relative px-4 gap-6 select-none"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((cat, idx) => {
            const isActive = activeCategory === idx;
            return (
              <button
                key={idx}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => selectCategory(idx)}
                className={`py-3.5 text-[15px] font-bold whitespace-nowrap cursor-pointer transition-colors duration-300 border-0 bg-transparent ${
                  isActive ? "text-[var(--blue)]" : "text-[#0A0A0A] hover:text-[var(--blue)]"
                }`}
              >
                {cat.title}
              </button>
            );
          })}

          {/* 2px blue underline sliding over 400ms E1 */}
          <div
            className="absolute bottom-0 h-[2px] bg-[var(--blue)] pointer-events-none transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              left: `${underlineStyle.left}px`,
              width: `${underlineStyle.width}px`,
            }}
          />
        </div>
      </div>

      {/* Main Layout: Desktop Sticky Rail Index on Left, Categories on Right */}
      <section className="container pb-[var(--sec-y-lg)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start text-left">
          {/* Desktop Left Sticky Index */}
          <div
            className="hidden lg:block lg:col-span-4 sticky"
            style={{ top: "calc(var(--nav-offset, 80px) + 24px)" }}
          >
            <div className="relative pl-6 py-2">
              {/* 2px vertical rail line background */}
              <div
                className="absolute top-3 bottom-3 w-[2px] bg-[#E5E5E5] pointer-events-none"
                style={{ left: "4px" }}
              />

              {/* 2px blue rail line progress fill */}
              <div
                className="absolute top-3 w-[2px] bg-[var(--blue)] pointer-events-none transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  left: "4px",
                  height: `${(activeCategory / (categories.length - 1)) * 100}%`,
                  maxHeight: "calc(100% - 24px)",
                }}
              />

              {/* The 4 Category Names with 10px dots */}
              <div className="flex flex-col space-y-8">
                {categories.map((cat, idx) => {
                  const isActive = activeCategory === idx;
                  const isPassed = activeCategory >= idx;

                  return (
                    <div key={idx} className="relative flex items-center">
                      {/* 10px dot on rail line: solid blue when passed/active, hollow when inactive */}
                      <div
                        className="absolute rounded-full transition-all duration-300 pointer-events-none"
                        style={{
                          left: "4px",
                          top: "50%",
                          width: "10px",
                          height: "10px",
                          transform: "translate(-50%, -50%)",
                          backgroundColor: isPassed ? "var(--blue)" : "#FFFFFF",
                          border: "2px solid var(--blue)",
                        }}
                      />

                      {/* Name button: Title style, sentence case bold 20px */}
                      <button
                        type="button"
                        onClick={() => selectCategory(idx)}
                        className={`pl-6 text-left text-[20px] font-bold transition-colors duration-300 cursor-pointer select-none leading-snug border-0 bg-transparent ${
                          isActive
                            ? "text-[var(--blue)]"
                            : "text-[#0A0A0A] hover:text-[var(--blue)]"
                        }`}
                      >
                        {cat.title}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Categories Container */}
          <div className="lg:col-span-8 space-y-16 lg:space-y-24">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  sectionRefs.current[idx] = el;
                }}
                className="border-b border-[#E5E5E5] pb-12 lg:pb-20 scroll-mt-[100px]"
              >
                {/* Photo at real shape with CURTAIN reveal */}
                <CategoryCurtainPhoto
                  src={cat.img}
                  alt={cat.title}
                  isFirst={idx === 0}
                />

                {/* Category Heading (TEXT STYLE uppercase bold ink) */}
                <h3 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] uppercase leading-tight lg:leading-[1.15] tracking-[-0.02em] mt-8 mb-6">
                  {cat.title}
                </h3>

                {/* Desktop: 2-column grid, 1px top line, title, text */}
                <div className="hidden lg:grid grid-cols-2 gap-x-12 gap-y-8 mt-6">
                  {cat.items.map((it, iIdx) => (
                    <div key={iIdx} className="border-t border-[#E5E5E5] pt-5 space-y-2">
                      <h4 className="text-[20px] font-bold text-[#0A0A0A] leading-snug">
                        {it.name}
                      </h4>
                      <p className="text-[16px] leading-[1.7] text-[#0A0A0A] font-normal">
                        {it.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Mobile: ACCORDION (title left, plus icon right, tap opens text) */}
                <div className="lg:hidden flex flex-col mt-4">
                  {cat.items.map((it, iIdx) => {
                    const isOpen = openMobileItems[idx] === iIdx;

                    return (
                      <div key={iIdx} className="border-t border-[#E5E5E5]">
                        <button
                          type="button"
                          onClick={() => toggleMobileItem(idx, iIdx)}
                          className="w-full min-h-[56px] py-4 flex items-center justify-between text-left cursor-pointer border-0 bg-transparent select-none"
                          aria-expanded={isOpen}
                        >
                          <h4 className="text-[17px] font-bold text-[#0A0A0A] leading-snug pr-3">
                            {it.name}
                          </h4>
                          <span className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-[#0A0A0A]">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              style={{
                                transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                                transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                              }}
                            >
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </span>
                        </button>

                        <div
                          className="grid"
                          style={{
                            gridTemplateRows: isOpen ? "1fr" : "0fr",
                            transition: "grid-template-rows 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        >
                          <div className="overflow-hidden min-h-0">
                            <p
                              className="text-[15px] leading-[1.6] text-[#0A0A0A] font-normal pb-5 transition-opacity duration-400 delay-150"
                              style={{ opacity: isOpen ? 1 : 0 }}
                            >
                              {it.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* "How to Choose": No side line, 1px top line, heading, text with existing links */}
      {howToChoose && (
        <section className="container pb-[var(--sec-y-lg)] text-left">
          <div className="pt-8 border-t border-[#E5E5E5] max-w-[880px] space-y-4">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em]">
              {howToChoose.title?.toUpperCase() || "HOW TO CHOOSE"}
            </h2>
            <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[#0A0A0A] font-normal">
              Pick accessories by use. A{" "}
              <Link
                to="/agricultural-sheds-pakistan/poultry-sheds/"
                className="underline font-semibold hover:text-[#0A0A0A] transition-colors"
              >
                poultry shed
              </Link>{" "}
              needs ventilation first. A{" "}
              <Link
                to="/industrial-sheds-pakistan/storage-warehouses/"
                className="underline font-semibold hover:text-[#0A0A0A] transition-colors"
              >
                warehouse
              </Link>{" "}
              needs skylights and dock doors. A workshop needs light and fume control. The engineer will advise during the design stage, and many accessories can also be fitted after handover if the frame is ready for them.
            </p>
          </div>
        </section>
      )}

      {/* Frequently Asked Questions */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* Next Band */}
      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033611/accessories-next.jpg"
        nextUrl="/industrial-sheds-pakistan/factory-sheds/"
        nextTitle="Factory Sheds"
      />
    </article>
  );
};
