import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { SITE } from "../data/site.ts";
import { Canvas } from "../components/ui/Canvas.tsx";
import { Button } from "../components/ui/Button.tsx";
import { NextBand } from "../components/ui/NextBand.tsx";
import { lenis } from "../lib/lenis.ts";
import { gsap } from "../lib/gsap.ts";
import { useReducedMotion } from "../hooks/useReducedMotion.ts";

// Content Files for Pages 2 through 8
import page2 from "../content/generated/page-02.json";
import page3 from "../content/generated/page-03.json";
import page4 from "../content/generated/page-04.json";
import page5 from "../content/generated/page-05.json";
import page6 from "../content/generated/page-06.json";
import page7 from "../content/generated/page-07.json";
import page8 from "../content/generated/page-08.json";

interface SectionInfo {
  id: string;
  num: string;
  label: string;
}

const SECTIONS: SectionInfo[] = [
  { id: "introduction", num: "01", label: "Introduction" },
  { id: "vision", num: "02", label: "Vision" },
  { id: "mission", num: "03", label: "Mission" },
  { id: "core-values", num: "04", label: "Core Values" },
  { id: "sme-policy", num: "05", label: "SME Policy" },
  { id: "committed-to", num: "06", label: "Committed To" },
  { id: "factory-tour", num: "07", label: "Factory Tour" },
];

export const AboutUs: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [railVisible, setRailVisible] = useState(false);

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Client-side anchor scroll on page load
  useEffect(() => {
    const rawHash = window.location.hash.replace("#", "");
    const validIds = SECTIONS.map((s) => s.id);
    if (rawHash && validIds.includes(rawHash)) {
      const timer = setTimeout(() => {
        const el = document.getElementById(rawHash);
        if (el) {
          if (lenis) {
            lenis.scrollTo(el, { offset: -32, duration: 1.2 });
          } else {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  // Scroll Tracking for Chapter Rail & Sticky Image using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = SECTIONS.findIndex((s) => s.id === entry.target.id);
            if (idx !== -1) {
              setActiveSectionIndex(idx);
              if (idx >= 0 && idx < 6) {
                setRailVisible(true);
              } else {
                setRailVisible(false);
              }
            }
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll handler for chapter rail dots
  const handleDotClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      if (lenis) {
        lenis.scrollTo(el, { offset: -32, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Factory Tour timeline line animation via scaleY scrub
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reducedMotion) return;
    const line = timelineLineRef.current;
    const container = timelineContainerRef.current;
    if (!line || !container) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0, transformOrigin: "top" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "bottom 70%",
            scrub: 1,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  // Extract Page 2 Content
  const p2WhoIsBlocks = page2.blocks.filter((b) => b.type === "p");
  const p2Paragraph1 = p2WhoIsBlocks[0]?.text || "";
  const p2Paragraph2 = p2WhoIsBlocks[1]?.text || "";

  // Extract Page 3 Content
  const p3Paragraphs = page3.blocks.filter((b) => b.type === "p").map((b) => b.text || "");

  // Extract Page 4 Content
  const p4Defs = (page4.blocks.find((b) => b.type === "defs") as any)?.items || [
    {
      name: "Quality",
      text: "Material is checked on arrival, dimensions are checked after cutting and welds are inspected before painting.",
    },
    {
      name: "Safety",
      text: "Workers use certified protective equipment and follow written site rules that are explained before work starts.",
    },
    {
      name: "Efficiency",
      text: "Cutting plans reduce scrap, and parts are packed in erection order so that site crews do not lose time searching for steel.",
    },
  ];

  // Extract Page 5 Content (Core Values)
  const p5Cards = page5.blocks
    .filter((b) => b.type === "h2")
    .map((h2Block, idx) => {
      const nextP = page5.blocks[page5.blocks.indexOf(h2Block) + 1];
      return {
        num: String(idx + 1).padStart(2, "0"),
        title: h2Block.title || "",
        desc: nextP?.text || "",
      };
    });

  // Extract Page 6 Content (SME Policy)
  const p6Strips = page6.blocks
    .filter((b) => b.type === "h2" && b.title !== "Why Steel Mind Engineers Has This Policy")
    .map((h2Block, idx) => {
      const nextP = page6.blocks[page6.blocks.indexOf(h2Block) + 1];
      return {
        num: String(idx + 1).padStart(2, "0"),
        title: h2Block.title || "",
        desc: nextP?.text || "",
      };
    });

  // Extract Page 7 Content (Committed To)
  const p7Commitments = [
    {
      num: "01",
      title: "The Steel Matches the Drawing",
      desc: "Every structure is built to approved drawings. Steel Mind Engineers checks material on arrival, checks dimensions after cutting and checks alignment during erection.",
    },
    {
      num: "02",
      title: "A Schedule You Can Plan Around",
      desc: "You receive a written schedule before work starts showing design approval, fabrication, delivery and erection. Early notices are given for any adjustments.",
    },
    {
      num: "03",
      title: "Safe Work on Every Site",
      desc: "Workers wear certified protective equipment and follow written lifting plans. Any worker may stop a job that looks unsafe.",
    },
    {
      num: "04",
      title: "One Point of Contact",
      desc: "You deal with one project coordinator from contract to handover who coordinates design, workshop and site teams seamlessly.",
    },
    {
      num: "05",
      title: "Support After Handover",
      desc: "Steel buildings need repairs, additions and extensions over the years. Steel Mind Engineers stays available for long-term support.",
    },
  ];

  // Extract Page 8 Content (Factory Tour)
  const p8WhereFactory = page8.blocks.find((b) => b.title === "Where the Factory Is");
  const p8WhereFactoryIdx = page8.blocks.indexOf(p8WhereFactory as any);
  const p8WhereFactoryText =
    page8.blocks[p8WhereFactoryIdx + 1]?.text ||
    "The Steel Mind Engineers factory is at Karol Ghati, Lahore, Punjab 54000. All fabrication for projects across Pakistan starts here. The head office is at 35-D Commercial, DHA EME Sector, Lahore.";

  const p8Steps = (page8.blocks.find((b) => b.type === "steps") as any)?.items || [];

  return (
    <div className="relative w-full bg-white text-[var(--ink)]">
      {/* ========================================================= */}
      {/* ZONE A — CHAPTER RAIL (THE SPINE) */}
      {/* ========================================================= */}
      <nav
        aria-label="Page chapters"
        style={{
          transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        }}
        className={`fixed left-5 top-1/2 -translate-y-1/2 z-50 w-10 hidden lg:flex flex-col items-center pointer-events-none transition-opacity ${
          railVisible
            ? "opacity-100 !pointer-events-auto duration-600"
            : "opacity-0 !duration-400"
        }`}
      >
        <div className="flex flex-col items-center text-center select-none min-h-[42px] mb-4">
          <span className="text-[9px] font-mono font-semibold uppercase tracking-[0.1em] text-[var(--blue)] tabular-nums transition-opacity duration-400">
            {SECTIONS[activeSectionIndex]?.num || "01"}
          </span>
          <span className="text-[9px] uppercase font-medium text-[var(--ink)] max-w-[120px] leading-tight mt-0.5 whitespace-nowrap transition-opacity duration-400">
            {SECTIONS[activeSectionIndex]?.label || "Introduction"}
          </span>
        </div>

        <div className="flex flex-col items-center space-y-8">
          {SECTIONS.map((sec, idx) => {
            const isActive = idx === activeSectionIndex;
            const isPassed = idx < activeSectionIndex;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleDotClick(sec.id)}
                aria-label={`Jump to ${sec.label}`}
                className="group relative flex items-center justify-center p-1 cursor-pointer focus:outline-none"
              >
                <span
                  style={{
                    transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                  className={`w-[6px] h-[6px] rounded-full transition-all duration-400 ${
                    isActive
                      ? "bg-[var(--blue)] border-0 scale-110"
                      : isPassed
                      ? "bg-[var(--blue)]/40 border-0"
                      : "bg-transparent border border-[var(--line)]"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </nav>

      {/* ========================================================= */}
      {/* ZONE B — STICKY IMAGE COLUMN (INTRODUCTION, VISION, MISSION) */}
      {/* ========================================================= */}
      <section className="w-full bg-white pt-[calc(var(--header-h)+32px)] pb-[72px] lg:pb-[112px]">
        <div className="max-w-[1340px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column Scrolls */}
            <div className="w-full">
              {/* --- 1. INTRODUCTION BLOCK (2.3: Eyebrow "INTRODUCTION" removed) --- */}
              <div id="introduction" className="w-full">
                {isMobile && (
                  <div className="mb-8">
                    <Canvas slot="about.introduction.main" ratio="4/5" />
                  </div>
                )}

                <h1 className="text-[20px] lg:text-[32px] font-semibold tracking-[-0.015em] text-[var(--ink)] leading-[1.15]">
                  {page2.h1}
                </h1>

                <div className="w-[40px] h-[1px] bg-[var(--blue)] mt-4" />

                <p className="text-[12px] lg:text-[13px] text-[var(--ink)] font-medium max-w-[520px] mt-5 leading-[1.65]">
                  {page2.quickAnswer}
                </p>

                <div className="mt-4 space-y-4 text-[12px] lg:text-[13px] leading-[1.65] text-[var(--grey)] max-w-[520px]">
                  <p>{p2Paragraph1}</p>
                  <p>{p2Paragraph2}</p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button
                    variant="secondary"
                    href={SITE.profilePdf}
                    target="_blank"
                  >
                    Download Company Profile
                  </Button>

                  <Link
                    to="/contact-us/"
                    className="text-[10px] uppercase tracking-[0.06em] font-semibold text-[var(--blue)] hover:underline inline-flex items-center gap-1.5 ml-3"
                  >
                    Get in Touch &rarr;
                  </Link>
                </div>
              </div>

              <div className="w-[40px] h-[1px] bg-[var(--line)] my-12" />

              {/* --- 2. VISION BLOCK (2.3: Eyebrow "VISION" removed) --- */}
              <div id="vision" className="w-full pt-12 lg:pt-20">
                {isMobile && (
                  <div className="mb-8">
                    <Canvas slot="about.vision.hero" ratio="4/5" />
                  </div>
                )}

                <h2 className="text-[16px] lg:text-[24px] font-semibold tracking-[-0.015em] text-[var(--ink)] leading-[1.2]">
                  {page3.h1}
                </h2>

                <div className="w-[40px] h-[1px] bg-[var(--blue)] mt-4" />

                <p className="text-[12px] lg:text-[13px] text-[var(--ink)] font-medium max-w-[520px] mt-5 leading-[1.65]">
                  {page3.quickAnswer}
                </p>

                <div className="mt-4 space-y-4 text-[12px] lg:text-[13px] leading-[1.65] text-[var(--grey)] max-w-[520px]">
                  {p3Paragraphs.map((pText, i) => (
                    <p key={i}>{pText}</p>
                  ))}
                </div>
              </div>

              <div className="w-[40px] h-[1px] bg-[var(--line)] my-12" />

              {/* --- 3. MISSION BLOCK (2.3: Eyebrow "MISSION" removed) --- */}
              <div id="mission" className="w-full pt-12 lg:pt-20">
                <h2 className="text-[16px] lg:text-[24px] font-semibold tracking-[-0.015em] text-[var(--ink)] leading-[1.2]">
                  {page4.h1}
                </h2>

                <div className="w-[40px] h-[1px] bg-[var(--blue)] mt-4" />

                <p className="text-[12px] lg:text-[13px] text-[var(--ink)] font-medium max-w-[520px] mt-5 leading-[1.65]">
                  {page4.quickAnswer}
                </p>

                <div className="mt-8 space-y-6">
                  {p4Defs.map((def: any, idx: number) => {
                    const numStr = String(idx + 1).padStart(2, "0");
                    return (
                      <div key={def.name} className="space-y-1">
                        <div className="text-[12px] font-bold text-[var(--blue)] font-mono leading-none">
                          {numStr}
                        </div>
                        <h3 className="text-[14px] lg:text-[17px] font-semibold text-[var(--ink)] leading-tight">
                          {def.name}
                        </h3>
                        <p className="text-[12px] lg:text-[13px] text-[var(--grey)] leading-[1.65] max-w-[480px]">
                          {def.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Shared Container (Desktop Only) */}
            {!isMobile && (
              <div className="hidden lg:block sticky top-[96px] h-[calc(100vh-192px)] w-full overflow-hidden border border-[var(--line)] bg-white">
                <div
                  style={{
                    transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-800 ${
                    activeSectionIndex === 0
                      ? "opacity-100 z-10"
                      : "opacity-0 pointer-events-none z-0"
                  }`}
                >
                  <Canvas
                    slot="about.introduction.main"
                    ratio="4/5"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div
                  style={{
                    transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-800 ${
                    activeSectionIndex === 1
                      ? "opacity-100 z-10"
                      : "opacity-0 pointer-events-none z-0"
                  }`}
                >
                  <Canvas
                    slot="about.vision.hero"
                    ratio="4/5"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div
                  style={{
                    transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                  }}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-800 ${
                    activeSectionIndex >= 2
                      ? "opacity-100 z-10"
                      : "opacity-0 pointer-events-none z-0"
                  }`}
                >
                  <div
                    data-canvas=""
                    data-slot="about.introduction.main"
                    data-canvas-slot="about.introduction.main"
                    data-canvas-ratio="4/5"
                    aria-hidden="true"
                    className="w-full h-full border border-dashed border-[var(--line)] bg-white flex flex-col items-center justify-center p-3 text-center select-none"
                  >
                    <div className="flex flex-col items-center justify-center space-y-0.5">
                      <span className="text-[9px] uppercase tracking-[0.1em] text-[var(--grey)] font-medium break-all px-1">
                        about.introduction.main (cropped top)
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.08em] text-[var(--grey)]/70">
                        4/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* ZONE C — FULL-BLEED ALTERNATING SECTIONS (NO WHITE CARDS ON OFFWHITE) */}
      {/* ========================================================= */}
      {/* 1. CORE VALUES (Royal Blue section with white text) */}
      <section
        id="core-values"
        style={{ backgroundColor: "var(--blue)" }}
        className="w-full bg-[var(--blue)] text-white py-[72px] lg:py-[112px]"
      >
        <div className="max-w-[1340px] mx-auto px-5 lg:px-10">
          {/* 2.3: Eyebrow "OUR CORE VALUES" removed */}
          <h2 className="text-[16px] lg:text-[24px] font-semibold tracking-[-0.015em] text-white leading-[1.2]">
            {page5.h1}
          </h2>

          <div className="w-[40px] h-[1px] bg-white/40 mt-4" />

          <p className="text-[12px] lg:text-[13px] text-white/90 font-medium max-w-[560px] mt-5 leading-[1.65]">
            {page5.quickAnswer}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mt-12">
            {p5Cards.map((card) => (
              <div key={card.num} className="flex flex-col">
                <div className="w-[40px] h-[1px] bg-white/40 mb-3" />
                <div className="text-[32px] lg:text-[48px] font-bold text-white font-sans leading-none">
                  {card.num}
                </div>
                <div className="w-full h-[1px] bg-white/20 mt-4" />
                <h3 className="text-[14px] lg:text-[17px] font-semibold text-white mt-4 leading-snug">
                  {card.title}
                </h3>
                <p className="text-[12px] lg:text-[13px] text-white/80 leading-[1.65] max-w-[360px] mt-2">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SME POLICY (Full-bleed White section with 1px --line dividers, no cards) */}
      <section
        id="sme-policy"
        className="w-full bg-white text-[var(--ink)] py-[72px] lg:py-[112px]"
      >
        <div className="max-w-[1340px] mx-auto px-5 lg:px-10">
          {/* 2.3: Eyebrow "SME POLICY" removed */}
          <h2 className="text-[16px] lg:text-[24px] font-semibold tracking-[-0.015em] text-[var(--ink)] leading-[1.2]">
            {page6.h1}
          </h2>

          <div className="w-[40px] h-[1px] bg-[var(--blue)] mt-4" />

          <p className="text-[12px] lg:text-[13px] text-[var(--ink)] font-medium max-w-[560px] mt-5 leading-[1.65]">
            {page6.quickAnswer}
          </p>

          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)] mt-12">
            {p6Strips.map((strip) => (
              <div
                key={strip.num}
                className="grid grid-cols-1 lg:grid-cols-[64px_1fr_1.8fr] gap-4 lg:gap-8 py-6 px-3 items-baseline"
              >
                <div className="text-[32px] lg:text-[48px] font-bold text-[var(--blue)] font-sans leading-none">
                  {strip.num}
                </div>
                <h3 className="text-[14px] lg:text-[17px] font-semibold text-[var(--ink)] leading-snug">
                  {strip.title}
                </h3>
                <p className="text-[12px] lg:text-[13px] text-[var(--grey)] leading-[1.65] max-w-[520px]">
                  {strip.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. COMMITTED TO (Royal Blue section with white text) */}
      <section
        id="committed-to"
        style={{ backgroundColor: "var(--blue)" }}
        className="w-full bg-[var(--blue)] text-white py-[72px] lg:py-[112px]"
      >
        <div className="max-w-[1340px] mx-auto px-5 lg:px-10">
          {/* 2.3: Eyebrow "COMMITTED TO" removed */}
          <h2 className="text-[16px] lg:text-[24px] font-semibold tracking-[-0.015em] text-white leading-[1.2]">
            {page7.h1}
          </h2>

          <div className="w-[40px] h-[1px] bg-white/40 mt-4" />

          <p className="text-[12px] lg:text-[13px] text-white/90 font-medium max-w-[560px] mt-5 leading-[1.65]">
            {page7.quickAnswer}
          </p>

          {/* Desktop: Horizontal Timeline */}
          <div className="hidden lg:block mt-16 relative">
            <div className="absolute top-[3px] left-0 right-0 h-[1px] bg-white/30 z-0" />

            <div className="grid grid-cols-5 gap-6 relative z-10">
              {p7Commitments.map((com) => (
                <div key={com.num} className="pt-6">
                  <div className="w-[7px] h-[7px] rounded-full bg-white -mt-[28px] mb-6" />

                  <div className="text-[32px] lg:text-[48px] font-bold text-white font-sans leading-none">
                    {com.num}
                  </div>
                  <h3 className="text-[14px] lg:text-[17px] font-semibold text-white leading-snug max-w-[220px] mt-2">
                    {com.title}
                  </h3>
                  <p className="text-[12px] lg:text-[13px] text-white/80 leading-[1.65] max-w-[220px] mt-2">
                    {com.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Vertical Timeline */}
          <div className="block lg:hidden mt-12 relative pl-8 space-y-8">
            <div className="absolute left-[4px] top-1 bottom-1 w-[2px] bg-white/40" />

            {p7Commitments.map((com) => (
              <div key={com.num} className="relative">
                <div className="absolute -left-[32px] top-1 w-[10px] h-[10px] rounded-full bg-white" />
                <div className="text-[32px] font-bold text-white font-sans leading-none">
                  {com.num}
                </div>
                <h3 className="text-[14px] font-semibold text-white leading-snug mt-1">
                  {com.title}
                </h3>
                <p className="text-[12px] text-white/80 leading-[1.65] mt-1">
                  {com.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* ZONE D — FULL-BLEED FACTORY TOUR */}
      {/* ========================================================= */}
      <section id="factory-tour" className="w-full bg-white">
        <div className="relative w-full h-[60vh] lg:h-[70vh] flex items-end overflow-hidden bg-[var(--blue)]">
          <div className="absolute inset-0 w-full h-full">
            <Canvas
              slot="about.factory.hero"
              ratio={isMobile ? "4/5" : "21/9"}
              className="w-full h-full object-cover"
            />
          </div>

          <div
            style={{
              background:
                "linear-gradient(to top, rgba(16,31,78,0.85) 0%, rgba(16,31,78,0.35) 50%, rgba(16,31,78,0.10) 100%)",
            }}
            className="absolute inset-0 pointer-events-none"
          />

          <div className="relative z-10 w-full max-w-[1340px] mx-auto p-10 lg:p-16">
            <div className="max-w-[900px] text-left">
              {/* 2.3: Eyebrow "FACTORY TOUR" removed */}
              <h2 className="text-[16px] lg:text-[24px] font-semibold text-white tracking-[-0.015em] leading-[1.2]">
                {page8.h1}
              </h2>

              <p className="text-[12px] lg:text-[13px] text-white/85 max-w-[560px] mt-4 leading-[1.65]">
                {page8.quickAnswer}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full bg-white py-[72px] lg:py-[112px]">
          <div className="max-w-[1340px] mx-auto px-5 lg:px-10">
            <p className="text-[12px] lg:text-[13px] leading-[1.65] text-[var(--grey)] max-w-[640px]">
              {p8WhereFactoryText}
            </p>

            <div
              ref={timelineContainerRef}
              className="relative mt-16 pl-12 lg:pl-16 space-y-10"
            >
              <div
                ref={timelineLineRef}
                className="absolute left-[15px] lg:left-[19px] top-2 bottom-6 w-[1px] bg-[var(--blue)] origin-top"
              />

              {p8Steps.map((step: any, idx: number) => {
                const stepNum = String(idx + 1).padStart(2, "0");
                const stepSlot = `about.factory.step${idx + 1}` as const;

                return (
                  <div key={step.name} className="relative">
                    <div className="absolute -left-[48px] lg:-left-[64px] top-0 text-[14px] lg:text-[17px] font-bold text-[var(--blue)] font-mono leading-none bg-white pr-2">
                      {stepNum}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[14px] lg:text-[17px] font-semibold text-[var(--ink)] leading-snug">
                        {step.name}
                      </h3>
                      <p className="text-[12px] lg:text-[13px] text-[var(--grey)] leading-[1.65] max-w-[480px]">
                        {step.text}
                      </p>

                      <div className="pt-3 max-w-[480px]">
                        <Canvas slot={stepSlot} ratio="4/3" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-16 text-center">
              <Button
                variant="secondary"
                href="/contact-us/"
              >
                Book a Factory Visit
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Next Band */}
      <NextBand
        heading="Explore Pre-Engineered Steel Buildings"
        nextUrl="/pre-engineered-buildings-pakistan/"
        nextTitle="Pre-Engineered Buildings"
      />
    </div>
  );
};
