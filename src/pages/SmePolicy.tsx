import React, { useEffect, useRef, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { SubpageHero } from "../components/subpage/SubpageHero.tsx";
import { SubpageNextBanner } from "../components/subpage/SubpageNextBanner.tsx";
import { aboutImages } from "../data/aboutImages.ts";
import { lenis } from "../lib/lenis.ts";
import { gsap, ScrollTrigger } from "../lib/gsap.ts";

import page6 from "../content/generated/page-06.json";
import page7 from "../content/generated/page-07.json";

export const SmePolicy: React.FC = () => {
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);

  // Section 1 Refs
  const p6HeadingRef = useRef<HTMLHeadingElement>(null);
  const p6IntroRef = useRef<HTMLParagraphElement>(null);
  const p6LineTopRef = useRef<HTMLDivElement>(null);
  const p6StripRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Section 2 Refs
  const p7HeadingRef = useRef<HTMLHeadingElement>(null);
  const p7AccentLineRef = useRef<HTMLDivElement>(null);
  const p7IntroRef = useRef<HTMLParagraphElement>(null);
  const p7DeskLineRef = useRef<HTMLDivElement>(null);
  const p7DeskColRefs = useRef<(HTMLDivElement | null)[]>([]);
  const p7MobCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll to hash on mount or hash change
  useEffect(() => {
    const rawHash = window.location.hash.replace("#", "");
    if (rawHash === "sme-policy" || rawHash === "committed-to") {
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

  // Extract Page 6 Content (SME Policy 5 strips, sentence case titles)
  const p6Strips = [
    {
      num: "01",
      title: "Quality management",
      desc: "Steel Mind Engineers inspects material when it arrives, checks dimensions after cutting, examines welds before assembly and checks alignment during erection. When a result falls short of the specification, the correction is recorded.",
    },
    {
      num: "02",
      title: "Health and safety",
      desc: "Every employee is trained before working on site. Workers wear certified protective equipment and follow written site rules. Risk reviews take place regularly so that hazards are removed instead of tolerated.",
    },
    {
      num: "03",
      title: "Environmental care",
      desc: "Cutting layouts are planned to reduce scrap, and offcuts are sent for recycling. Welding fumes and paint overspray are controlled. Working methods are chosen to limit noise, dust and waste at the workshop and on client premises.",
    },
    {
      num: "04",
      title: "Legal compliance",
      desc: "Steel Mind Engineers follows the quality, environmental and workplace safety rules that apply to its operations. It keeps the records needed to show that compliance to clients and authorities.",
    },
    {
      num: "05",
      title: "Improvement and responsibility",
      desc: "Feedback from clients, supervisors and workers is collected after each project and turned into changes in procedure. Management is responsible for applying the policy. Every employee has the right and the duty to stop work that looks unsafe and to report it.",
    },
  ];

  // Extract Page 7 Content (Committed To 5 columns, sentence case titles)
  const p7Commitments = [
    {
      num: "01",
      title: "The steel matches the drawing",
      desc: "Every structure is built to approved drawings. Steel Mind Engineers checks material on arrival, checks dimensions after cutting and checks alignment during erection.",
    },
    {
      num: "02",
      title: "A schedule you can plan around",
      desc: "You receive a written schedule before work starts showing design approval, fabrication, delivery and erection. Early notices are given for any adjustments.",
    },
    {
      num: "03",
      title: "Safe work on every site",
      desc: "Workers wear certified protective equipment and follow written lifting plans. Any worker may stop a job that looks unsafe.",
    },
    {
      num: "04",
      title: "One point of contact",
      desc: "You deal with one project coordinator from contract to handover who coordinates design, workshop and site teams seamlessly.",
    },
    {
      num: "05",
      title: "Support after handover",
      desc: "Steel buildings need repairs, additions and extensions over the years. Steel Mind Engineers stays available for long-term support.",
    },
  ];

  // GSAP Scroll Animations Setup
  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const E1 = "cubic-bezier(0.16, 1, 0.3, 1)";
    const E2 = "cubic-bezier(0.76, 0, 0.24, 1)";

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Section 1 Header and Intro Rise
      if (p6HeadingRef.current && p6IntroRef.current) {
        gsap.fromTo(
          [p6HeadingRef.current, p6IntroRef.current],
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: E1,
            stagger: 0.1,
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: p6HeadingRef.current,
              start: "top 88%",
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Section 1 Top Line Draw
      if (p6LineTopRef.current) {
        gsap.fromTo(
          p6LineTopRef.current,
          { scaleX: 0, transformOrigin: "left" },
          {
            scaleX: 1,
            duration: 1.0,
            ease: E2,
            clearProps: "transform",
            scrollTrigger: {
              trigger: p6LineTopRef.current,
              start: "top 88%",
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Section 1 Strips Stagger Rise
      const validStrips = p6StripRefs.current.filter(Boolean) as HTMLElement[];
      if (validStrips.length > 0) {
        gsap.fromTo(
          validStrips,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: E1,
            stagger: 0.08,
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: validStrips[0],
              start: "top 85%",
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Section 2 Header, Accent Line and Intro Rise
      if (p7HeadingRef.current) {
        const headerEls = [
          p7HeadingRef.current,
          p7AccentLineRef.current,
          p7IntroRef.current,
        ].filter(Boolean) as HTMLElement[];

        gsap.fromTo(
          headerEls,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: E1,
            stagger: 0.08,
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: p7HeadingRef.current,
              start: "top 88%",
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Section 2 Desktop: 5 Columns
      mm.add("(min-width: 1024px)", () => {
        if (p7DeskLineRef.current) {
          gsap.fromTo(
            p7DeskLineRef.current,
            { scaleX: 0, transformOrigin: "left" },
            {
              scaleX: 1,
              duration: 1.0,
              ease: E2,
              clearProps: "transform",
              scrollTrigger: {
                trigger: p7DeskLineRef.current,
                start: "top 85%",
                once: true,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        const validCols = p7DeskColRefs.current.filter(Boolean) as HTMLElement[];
        if (validCols.length > 0) {
          gsap.fromTo(
            validCols,
            { y: 32, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: E1,
              stagger: 0.1,
              clearProps: "transform,opacity",
              scrollTrigger: {
                trigger: validCols[0],
                start: "top 85%",
                once: true,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      });

      // Section 2 Mobile: 5 Blocks
      mm.add("(max-width: 1023px)", () => {
        const validMobCards = p7MobCardRefs.current.filter(Boolean) as HTMLElement[];
        validMobCards.forEach((card) => {
          gsap.fromTo(
            card,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: E1,
              clearProps: "transform,opacity",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                once: true,
                invalidateOnRefresh: true,
              },
            }
          );
        });
      });

      // Reduced motion fallback
      mm.add("(prefers-reduced-motion: reduce)", () => {
        const all = [
          p6HeadingRef.current,
          p6IntroRef.current,
          p6LineTopRef.current,
          ...p6StripRefs.current,
          p7HeadingRef.current,
          p7AccentLineRef.current,
          p7IntroRef.current,
          p7DeskLineRef.current,
          ...p7DeskColRefs.current,
          ...p7MobCardRefs.current,
        ].filter(Boolean) as HTMLElement[];

        gsap.set(all, { y: 0, opacity: 1, scaleX: 1 });
      });
    }, rootRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="sme-policy-page relative w-full bg-white text-[var(--ink)]">
      {/* Mobile banner overlap fix scoped to SME Policy */}
      <style>{`
        @media (max-width: 767px) {
          .sme-policy-page [data-hero] .md\\:hidden > div:last-child {
            padding-top: 2rem !important;
          }
          .sme-policy-page [data-hero] h1 {
            margin-top: 10px !important;
            padding-top: 8px !important;
          }
          button[aria-label="Go back"] {
            top: 66px !important;
            left: 16px !important;
          }
        }
      `}</style>

      {/* Hero with 20% overlay */}
      <SubpageHero
        title="SME POLICY: QUALITY, HEALTH, SAFETY AND ENVIRONMENT AT STEEL MIND ENGINEERS"
        image={aboutImages.smePolicy.hero}
        quoteUrl="/contact-us/#quote"
        overlay={true}
      />

      {/* ========================================================= */}
      {/* 1. SME POLICY SECTION (5 rows with numbers above title)   */}
      {/* ========================================================= */}
      <section
        id="sme-policy"
        style={{ scrollMarginTop: "var(--nav-h, 88px)" }}
        className="w-full bg-white text-[var(--ink)] py-[72px] lg:py-[112px]"
      >
        <div className="max-w-[1340px] mx-auto px-5 lg:px-10">
          {/* Section Heading: ALL CAPITALS bold ink colour */}
          <h2
            ref={p6HeadingRef}
            className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-[#0A0A0A] uppercase leading-[1.15] tracking-[-0.02em] mb-4 lg:mb-6"
          >
            WHY STEEL MIND ENGINEERS HAS THIS POLICY
          </h2>

          <p
            ref={p6IntroRef}
            className="text-[15px] lg:text-[16px] text-[#0A0A0A] font-normal max-w-[760px] leading-[1.6] lg:leading-[1.7]"
          >
            {page6.quickAnswer}
          </p>

          <div
            ref={p6LineTopRef}
            className="w-full h-[1px] bg-[#E5E5E5] mt-12 lg:mt-16 origin-left"
          />

          <div className="divide-y divide-[#E5E5E5] border-b border-[#E5E5E5]">
            {p6Strips.map((strip, idx) => (
              <div
                key={strip.num}
                ref={(el) => {
                  p6StripRefs.current[idx] = el;
                }}
                className="group relative grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12 py-8 lg:py-10 items-start rounded-xl px-4 lg:px-6 -mx-4 lg:-mx-6 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#1E3A8A]/[0.025] hover:shadow-[0_4px_24px_rgba(30,58,138,0.04)]"
              >
                {/* Number placed above its title, like One-Step */}
                <div className="lg:col-span-5">
                  <span className="inline-block text-[40px] lg:text-[64px] font-[800] text-[var(--blue)] leading-none select-none mb-3 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 origin-left">
                    {strip.num}
                  </span>
                  <div className="w-6 h-[2px] bg-[var(--blue)]/30 group-hover:w-12 group-hover:bg-[var(--blue)] transition-all duration-400 mb-2" />
                  <h3 className="text-[14px] sm:text-[15px] lg:text-[17px] font-bold text-[#0A0A0A] leading-[1.25] tracking-[-0.01em] uppercase transition-colors duration-300 group-hover:text-[var(--blue)]">
                    {strip.title}
                  </h3>
                </div>

                <div className="lg:col-span-7">
                  <p className="text-[15px] lg:text-[16px] text-[#0A0A0A] font-normal leading-[1.6] lg:leading-[1.7] max-w-[680px] transition-colors duration-300 group-hover:text-black">
                    {strip.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. COMMITTED TO (Royal Blue section with white text, 5 columns) */}
      {/* ========================================================= */}
      <section
        id="committed-to"
        style={{
          backgroundColor: "var(--blue)",
          scrollMarginTop: "var(--nav-h, 88px)",
        }}
        className="w-full bg-[var(--blue)] text-white py-[72px] lg:py-[112px] border-t border-white/20"
      >
        <div className="max-w-[1340px] mx-auto px-5 lg:px-10">
          {/* Section Heading: ALL CAPITALS bold white */}
          <h2
            ref={p7HeadingRef}
            className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-white uppercase leading-[1.15] tracking-[-0.02em] mb-4 lg:mb-6"
          >
            COMMITTED TO: ACCURATE STEEL, SAFE SITES AND HONEST SCHEDULES
          </h2>

          <div
            ref={p7AccentLineRef}
            className="w-[40px] h-[1px] bg-white/40 mb-5 origin-left"
          />

          {/* Intro text */}
          <p
            ref={p7IntroRef}
            className="text-[15px] lg:text-[16px] text-white font-normal max-w-[760px] leading-[1.6] lg:leading-[1.7]"
          >
            {page7.quickAnswer}
          </p>

          {/* Desktop 5 Columns */}
          <div
            ref={p7DeskLineRef}
            className="hidden lg:block w-full h-[1px] bg-white/20 mt-16 origin-left"
          />

          <div className="hidden lg:grid grid-cols-5 gap-6 lg:gap-8 pt-8">
            {p7Commitments.map((com, idx) => (
              <div
                key={com.num}
                ref={(el) => {
                  p7DeskColRefs.current[idx] = el;
                }}
                className="group relative flex flex-col items-start p-6 -m-6 rounded-xl transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/[0.08] hover:-translate-y-2 hover:shadow-[0_12px_32px_rgba(0,0,0,0.18)] cursor-default"
              >
                {/* Number placed above its title, like One-Step */}
                <span className="inline-block text-[40px] lg:text-[64px] font-[800] text-white leading-none select-none mb-3 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 origin-bottom-left">
                  {com.num}
                </span>
                <div className="w-6 h-[2px] bg-white/40 mb-3 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-14 group-hover:bg-white" />
                <h3 className="text-[14px] sm:text-[15px] lg:text-[17px] font-bold text-white leading-[1.25] tracking-[-0.01em] mb-2 uppercase transition-transform duration-300 group-hover:translate-x-1">
                  {com.title}
                </h3>
                <p className="text-[15px] lg:text-[16px] text-white/90 group-hover:text-white font-normal leading-[1.6] lg:leading-[1.7] w-full transition-colors duration-300">
                  {com.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile 5 blocks with numbers above titles */}
          <div className="block lg:hidden mt-12 space-y-10">
            {p7Commitments.map((com, idx) => (
              <div
                key={com.num}
                ref={(el) => {
                  p7MobCardRefs.current[idx] = el;
                }}
                className="w-full pt-6 border-t border-white/20 first:border-t-0 first:pt-0"
              >
                <span className="block text-[40px] font-[800] text-white leading-none select-none mb-3">
                  {com.num}
                </span>
                <h3 className="text-[14px] sm:text-[15px] lg:text-[17px] font-bold text-white leading-[1.25] tracking-[-0.01em] mb-2 uppercase">
                  {com.title}
                </h3>
                <p className="text-[15px] text-white font-normal leading-[1.6] w-full max-w-none">
                  {com.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Banner to Factory with ALL CAPITALS heading */}
      <SubpageNextBanner
        heading="FACTORY TOUR: INSIDE THE STEEL MIND ENGINEERS FABRICATION FACTORY IN LAHORE"
        title="Factory"
        url="/about/factory"
        image={aboutImages.smePolicy.nextFactory}
        overlay={true}
      />
    </div>
  );
};
