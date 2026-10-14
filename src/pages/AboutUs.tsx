import React, { useEffect, useState, useRef } from "react";
import { Link } from "../components/ui/TransitionLink.tsx";
import { SITE } from "../data/site.ts";
import { Canvas } from "../components/ui/Canvas.tsx";
import { Button } from "../components/ui/Button.tsx";
import { NextBand } from "../components/ui/NextBand.tsx";
import { lenis } from "../lib/lenis.ts";
import { gsap } from "../lib/gsap.ts";
import { HeroBand } from "../components/ui/HeroBand.tsx";
import { A } from "../data/assets.ts";
import { useReducedMotion } from "../hooks/useReducedMotion.ts";

// Content Files for Pages 2 through 8
import page2 from "../content/generated/page-02.json";
import page3 from "../content/generated/page-03.json";
import page4 from "../content/generated/page-04.json";
import page5 from "../content/generated/page-05.json";
import page6 from "../content/generated/page-06.json";
import page7 from "../content/generated/page-07.json";
import page8 from "../content/generated/page-08.json";

const STICKY_IMAGES = [
  {
    id: "introduction",
    src: A.team,
    alt: "Steel Mind Engineers Leadership and Engineering Team",
    title: "Introduction",
  },
  {
    id: "vision",
    src: A.project.haierCraneMezzanine[0],
    alt: "Modern Industrial Pre-Engineered Building Structure",
    title: "Vision",
  },
  {
    id: "mission",
    src: A.service.fabrication,
    alt: "Precision Steel Fabrication, Cutting, and Welding Quality Inspection",
    title: "Mission",
  },
];

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
  const [activeZoneBIndex, setActiveZoneBIndex] = useState(0);

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

  // Track scroll position to seamlessly switch desktop card images at end of sections
  useEffect(() => {
    let ticking = false;

    const updateActiveImage = () => {
      const visionEl = document.getElementById("vision");
      const missionEl = document.getElementById("mission");
      if (!visionEl || !missionEl) return;

      // Trigger point: when next section reaches upper half of viewport (50%)
      const triggerPoint = window.innerHeight * 0.5;
      const visionTop = visionEl.getBoundingClientRect().top;
      const missionTop = missionEl.getBoundingClientRect().top;

      let nextIndex = 0;
      if (missionTop <= triggerPoint) {
        nextIndex = 2; // Section 3: Mission
      } else if (visionTop <= triggerPoint) {
        nextIndex = 1; // Section 2: Vision
      } else {
        nextIndex = 0; // Section 1: Introduction
      }

      setActiveZoneBIndex((prev) => (prev !== nextIndex ? nextIndex : prev));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateActiveImage);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    lenis?.on("scroll", onScroll);

    // Initial check on mount
    updateActiveImage();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      lenis?.off("scroll", onScroll);
    };
  }, []);

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
      {/* Hero Band — Section 3 */}
      <HeroBand
        imageSrc={A.about}
        imageAlt="About Steel Mind Engineers"
        h1={page2.h1}
        subtitle={page2.quickAnswer}
      />

      {/* ========================================================= */}
      {/* ZONE B — STICKY IMAGE COLUMN (INTRODUCTION, VISION, MISSION) */}
      {/* ========================================================= */}
      <section className="w-full bg-white pt-12 lg:pt-16 pb-[72px] lg:pb-[112px]">
        <div className="max-w-[1340px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column Scrolls */}
            <div className="w-full">
              {/* --- 1. INTRODUCTION BLOCK --- */}
              <div id="introduction" className="w-full pb-16 lg:pb-32 lg:min-h-[460px] flex flex-col justify-center">
                {isMobile && (
                  <div className="mb-8">
                    <img
                      src={STICKY_IMAGES[0].src}
                      alt={STICKY_IMAGES[0].alt}
                      className="w-full aspect-[4/5] object-cover border border-[#E5E5E5]"
                    />
                  </div>
                )}

                <h2 className="text-[22px] lg:text-[48px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em]">
                  {page2.h1}
                </h2>

                <p className="text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[#6B7280] max-w-[600px] mt-5">
                  {page2.quickAnswer}
                </p>

                <div className="mt-4 space-y-4 text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[#6B7280] max-w-[600px]">
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
                    className="text-[13px] font-semibold text-[#1E3A8A] hover:underline inline-flex items-center gap-1.5 ml-3"
                  >
                    Get in Touch &rarr;
                  </Link>
                </div>
              </div>

              <div className="w-[40px] h-[1px] bg-[#E5E5E5] my-6 lg:my-10" />

              {/* --- 2. VISION BLOCK --- */}
              <div id="vision" className="w-full pt-8 lg:pt-16 pb-16 lg:pb-32 lg:min-h-[460px] flex flex-col justify-center">
                {isMobile && (
                  <div className="mb-8">
                    <img
                      src={STICKY_IMAGES[1].src}
                      alt={STICKY_IMAGES[1].alt}
                      className="w-full aspect-[4/5] object-cover border border-[#E5E5E5]"
                    />
                  </div>
                )}

                <h2 className="text-[22px] lg:text-[48px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em]">
                  {page3.h1}
                </h2>

                <p className="text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[#6B7280] max-w-[600px] mt-5">
                  {page3.quickAnswer}
                </p>

                <div className="mt-4 space-y-4 text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[#6B7280] max-w-[600px]">
                  {p3Paragraphs.map((pText, i) => (
                    <p key={i}>{pText}</p>
                  ))}
                </div>
              </div>

              <div className="w-[40px] h-[1px] bg-[#E5E5E5] my-6 lg:my-10" />

              {/* --- 3. MISSION BLOCK --- */}
              <div id="mission" className="w-full pt-8 lg:pt-16 pb-12 lg:min-h-[460px] flex flex-col justify-center">
                {isMobile && (
                  <div className="mb-8">
                    <img
                      src={STICKY_IMAGES[2].src}
                      alt={STICKY_IMAGES[2].alt}
                      className="w-full aspect-[4/5] object-cover border border-[#E5E5E5]"
                    />
                  </div>
                )}

                <h2 className="text-[22px] lg:text-[48px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em]">
                  {page4.h1}
                </h2>

                <p className="text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[#6B7280] max-w-[600px] mt-5">
                  {page4.quickAnswer}
                </p>

                <div className="mt-8 space-y-6">
                  {p4Defs.map((def: any, idx: number) => {
                    const numStr = String(idx + 1).padStart(2, "0");
                    return (
                      <div key={def.name} className="space-y-1">
                        <div className="text-[16px] font-bold text-[#1E3A8A] tabular-nums tracking-[0.06em]">
                          {numStr}
                        </div>
                        <h3 className="text-[17px] lg:text-[22px] font-semibold text-[#0A0A0A] leading-[1.25] tracking-[-0.01em]">
                          {def.name}
                        </h3>
                        <p className="text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[#6B7280] max-w-[600px]">
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
              <div className="hidden lg:block sticky top-[96px] h-[calc(100vh-192px)] w-full overflow-hidden border border-[#E5E5E5] bg-[#0A0A0A]">
                {STICKY_IMAGES.map((img, idx) => (
                  <div
                    key={img.title}
                    style={{
                      transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                      activeZoneBIndex === idx
                        ? "opacity-100 z-10"
                        : "opacity-0 pointer-events-none z-0"
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                ))}
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
          <h2 className="text-[22px] lg:text-[48px] font-bold text-white leading-[1.15] tracking-[-0.02em]">
            {page5.h1}
          </h2>

          <div className="w-[40px] h-[1px] bg-white/40 mt-4" />

          <p className="text-[14px] lg:text-[15px] text-white/90 font-normal leading-[1.7] max-w-[600px] mt-5">
            {page5.quickAnswer}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mt-12">
            {p5Cards.map((card) => (
              <div key={card.num} className="flex flex-col">
                <div className="w-[40px] h-[1px] bg-white/40 mb-3" />
                <div className="text-[16px] font-bold text-white tabular-nums tracking-[0.06em]">
                  {card.num}
                </div>
                <div className="w-full h-[1px] bg-white/20 mt-4" />
                <h3 className="text-[17px] lg:text-[22px] font-semibold text-white mt-4 leading-[1.25] tracking-[-0.01em]">
                  {card.title}
                </h3>
                <p className="text-[14px] lg:text-[15px] text-white/80 leading-[1.7] max-w-[600px] mt-2">
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
          <h2 className="text-[22px] lg:text-[48px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em]">
            {page6.h1}
          </h2>

          <div className="w-[40px] h-[1px] bg-[#1E3A8A] mt-4" />

          <p className="text-[14px] lg:text-[15px] text-[#6B7280] font-normal max-w-[600px] mt-5 leading-[1.7]">
            {page6.quickAnswer}
          </p>

          <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5] mt-12">
            {p6Strips.map((strip) => (
              <div
                key={strip.num}
                className="grid grid-cols-1 lg:grid-cols-[64px_1fr_1.8fr] gap-4 lg:gap-8 py-6 px-3 items-baseline"
              >
                <div className="text-[16px] font-bold text-[#1E3A8A] tabular-nums tracking-[0.06em]">
                  {strip.num}
                </div>
                <h3 className="text-[17px] lg:text-[22px] font-semibold text-[#0A0A0A] leading-[1.25] tracking-[-0.01em]">
                  {strip.title}
                </h3>
                <p className="text-[14px] lg:text-[15px] text-[#6B7280] leading-[1.7] max-w-[600px]">
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
          <h2 className="text-[22px] lg:text-[48px] font-bold text-white leading-[1.15] tracking-[-0.02em]">
            {page7.h1}
          </h2>

          <div className="w-[40px] h-[1px] bg-white/40 mt-4" />

          <p className="text-[14px] lg:text-[15px] text-white/90 font-normal max-w-[600px] mt-5 leading-[1.7]">
            {page7.quickAnswer}
          </p>

          {/* Desktop: Horizontal Timeline */}
          <div className="hidden lg:block mt-16 relative">
            <div className="absolute top-[3px] left-0 right-0 h-[1px] bg-white/30 z-0" />

            <div className="grid grid-cols-5 gap-6 relative z-10">
              {p7Commitments.map((com) => (
                <div key={com.num} className="pt-6">
                  <div className="w-[7px] h-[7px] rounded-full bg-white -mt-[28px] mb-6" />

                  <div className="text-[16px] font-bold text-white tabular-nums tracking-[0.06em]">
                    {com.num}
                  </div>
                  <h3 className="text-[17px] lg:text-[22px] font-semibold text-white leading-[1.25] tracking-[-0.01em] mt-2">
                    {com.title}
                  </h3>
                  <p className="text-[14px] lg:text-[15px] text-white/80 leading-[1.7] max-w-[600px] mt-2">
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
                <div className="text-[16px] font-bold text-white tabular-nums tracking-[0.06em]">
                  {com.num}
                </div>
                <h3 className="text-[17px] font-semibold text-white leading-[1.25] tracking-[-0.01em] mt-1">
                  {com.title}
                </h3>
                <p className="text-[14px] text-white/80 leading-[1.7] mt-1">
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
              <h2 className="text-[22px] lg:text-[48px] font-bold text-white leading-[1.15] tracking-[-0.02em]">
                {page8.h1}
              </h2>

              <p className="text-[14px] lg:text-[15px] text-white/85 max-w-[600px] mt-4 leading-[1.7]">
                {page8.quickAnswer}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full bg-white py-[72px] lg:py-[112px]">
          <div className="max-w-[1340px] mx-auto px-5 lg:px-10">
            <p className="text-[14px] lg:text-[15px] leading-[1.7] text-[#6B7280] max-w-[600px]">
              {p8WhereFactoryText}
            </p>

            <div
              ref={timelineContainerRef}
              className="relative mt-16 pl-12 lg:pl-16 space-y-10"
            >
              <div
                ref={timelineLineRef}
                className="absolute left-[15px] lg:left-[19px] top-2 bottom-6 w-[1px] bg-[#1E3A8A] origin-top"
              />

              {p8Steps.map((step: any, idx: number) => {
                const stepNum = String(idx + 1).padStart(2, "0");
                const stepSlot = `about.factory.step${idx + 1}` as const;

                return (
                  <div key={step.name} className="relative">
                    <div className="absolute -left-[48px] lg:-left-[64px] top-0 text-[16px] font-bold text-[#1E3A8A] tabular-nums tracking-[0.06em] bg-white pr-2">
                      {stepNum}
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-[17px] lg:text-[22px] font-semibold text-[#0A0A0A] leading-[1.25] tracking-[-0.01em]">
                        {step.name}
                      </h3>
                      <p className="text-[14px] lg:text-[15px] text-[#6B7280] leading-[1.7] max-w-[600px]">
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
