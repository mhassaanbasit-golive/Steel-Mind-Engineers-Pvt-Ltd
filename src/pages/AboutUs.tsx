import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "../components/ui/TransitionLink.tsx";
import { SITE } from "../data/site.ts";
import { Button } from "../components/ui/Button.tsx";
import { lenis } from "../lib/lenis.ts";
import { SubpageHero } from "../components/subpage/SubpageHero.tsx";
import { SubpageNextBanner } from "../components/subpage/SubpageNextBanner.tsx";
import { aboutImages } from "../data/aboutImages.ts";

// Content Files for Pages 2 through 5
import page2 from "../content/generated/page-02.json";
import page3 from "../content/generated/page-03.json";
import page4 from "../content/generated/page-04.json";
import page5 from "../content/generated/page-05.json";

const STICKY_IMAGES = [
  {
    id: "introduction",
    src: aboutImages.aboutUs.introSticky,
    alt: "Steel Mind Engineers Leadership and Engineering Team",
    title: "Introduction",
  },
  {
    id: "vision",
    src: aboutImages.aboutUs.visionSticky,
    alt: "Modern Industrial Pre-Engineered Building Structure",
    title: "Vision",
  },
  {
    id: "mission",
    src: aboutImages.aboutUs.missionSticky,
    alt: "Precision Steel Fabrication, Cutting, and Welding Quality Inspection",
    title: "Mission",
  },
];

const SECTIONS = [
  { id: "introduction", num: "01", label: "Introduction" },
  { id: "vision", num: "02", label: "Vision" },
  { id: "mission", num: "03", label: "Mission" },
  { id: "core-values", num: "04", label: "Core Values" },
];

export const AboutUs: React.FC = () => {
  const location = useLocation();
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

  // Client-side anchor scroll on page load / hash change
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
  }, [location.hash]);

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

  // Extract Page 2 Content
  const p2WhoIsBlocks = page2.blocks.filter((b) => b.type === "p");
  const p2Paragraph1 = p2WhoIsBlocks[0]?.text || "";
  const p2Paragraph2 = p2WhoIsBlocks[1]?.text || "";

  // Extract Page 3 Content
  const p3Paragraphs = page3.blocks
    .filter((b) => b.type === "p")
    .map((b) => b.text || "");

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

  return (
    <div className="relative w-full bg-white text-[var(--ink)]">
      {/* Hero Band with 20% overlay */}
      <SubpageHero
        title={page2.h1}
        image={aboutImages.aboutUs.hero}
        quoteUrl="/contact-us/#quote"
        overlay={true}
      />

      {/* ========================================================= */}
      {/* ZONE B — STICKY IMAGE COLUMN (1. INTRODUCTION, 2. VISION, 3. MISSION) */}
      {/* ========================================================= */}
      <section className="w-full bg-white pt-12 lg:pt-16 pb-[72px] lg:pb-[112px]">
        <div className="max-w-[1340px] mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column Scrolls */}
            <div className="w-full">
              {/* --- 1. INTRODUCTION BLOCK --- */}
              <div
                id="introduction"
                style={{ scrollMarginTop: "var(--nav-h, 88px)" }}
                className="w-full pb-16 lg:pb-32 lg:min-h-[460px] flex flex-col justify-center"
              >
                {isMobile && (
                  <div className="mb-8">
                    <img
                      src={STICKY_IMAGES[0].src}
                      alt={STICKY_IMAGES[0].alt}
                      loading="lazy"
                      className="w-full aspect-[4/5] object-cover border border-[#E5E5E5]"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}

                <h2 className="text-[22px] lg:text-[48px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em]">
                  {page2.h1}
                </h2>

                <p className="text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[var(--blue)] max-w-[600px] mt-5">
                  {page2.quickAnswer}
                </p>

                <div className="mt-4 space-y-4 text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[var(--blue)] max-w-[600px]">
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
              <div
                id="vision"
                style={{ scrollMarginTop: "var(--nav-h, 88px)" }}
                className="w-full pt-8 lg:pt-16 pb-16 lg:pb-32 lg:min-h-[460px] flex flex-col justify-center"
              >
                {isMobile && (
                  <div className="mb-8">
                    <img
                      src={STICKY_IMAGES[1].src}
                      alt={STICKY_IMAGES[1].alt}
                      loading="lazy"
                      className="w-full aspect-[4/5] object-cover border border-[#E5E5E5]"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}

                <h2 className="text-[22px] lg:text-[48px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em]">
                  {page3.h1}
                </h2>

                <p className="text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[var(--blue)] max-w-[600px] mt-5">
                  {page3.quickAnswer}
                </p>

                <div className="mt-4 space-y-4 text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[var(--blue)] max-w-[600px]">
                  {p3Paragraphs.map((pText, i) => (
                    <p key={i}>{pText}</p>
                  ))}
                </div>
              </div>

              <div className="w-[40px] h-[1px] bg-[#E5E5E5] my-6 lg:my-10" />

              {/* --- 3. MISSION BLOCK --- */}
              <div
                id="mission"
                style={{ scrollMarginTop: "var(--nav-h, 88px)" }}
                className="w-full pt-8 lg:pt-16 pb-12 lg:min-h-[460px] flex flex-col justify-center"
              >
                {isMobile && (
                  <div className="mb-8">
                    <img
                      src={STICKY_IMAGES[2].src}
                      alt={STICKY_IMAGES[2].alt}
                      loading="lazy"
                      className="w-full aspect-[4/5] object-cover border border-[#E5E5E5]"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}

                <h2 className="text-[22px] lg:text-[48px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em]">
                  {page4.h1}
                </h2>

                <p className="text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[var(--blue)] max-w-[600px] mt-5">
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
                        <p className="text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[var(--blue)] max-w-[600px]">
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
                      loading="lazy"
                      className="w-full h-full object-cover object-center"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. CORE VALUES (Royal Blue section with white text) */}
      {/* ========================================================= */}
      <section
        id="core-values"
        style={{
          backgroundColor: "var(--blue)",
          scrollMarginTop: "var(--nav-h, 88px)",
        }}
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

      {/* Next Banner to SME Policy with 20% overlay */}
      <SubpageNextBanner
        heading="SME Policy: Quality, Health, Safety and Environment at Steel Mind Engineers"
        title="SME Policy"
        url="/about/sme-policy"
        image={aboutImages.aboutUs.nextSmePolicy}
        overlay={true}
      />
    </div>
  );
};
