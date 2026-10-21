import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SubpageHero } from "../components/subpage/SubpageHero.tsx";
import { SubpageNextBanner } from "../components/subpage/SubpageNextBanner.tsx";
import { aboutImages } from "../data/aboutImages.ts";
import { lenis } from "../lib/lenis.ts";

import page6 from "../content/generated/page-06.json";
import page7 from "../content/generated/page-07.json";

export const SmePolicy: React.FC = () => {
  const location = useLocation();

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

  return (
    <div className="sme-policy-page relative w-full bg-white text-[var(--ink)]">
      {/* Mobile banner overlap fix scoped to SME Policy: push headline down and ensure back arrow sits cleanly above */}
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

      {/* Hero with 20% overlay — headline is existing SME Policy section title in ALL CAPITALS */}
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
          {/* Section Heading: ALL CAPITALS bold ink colour (One-Step size: 17px-19px mobile, 32px desktop) */}
          <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-[#0A0A0A] uppercase leading-[1.15] tracking-[-0.02em] mb-4 lg:mb-6">
            WHY STEEL MIND ENGINEERS HAS THIS POLICY
          </h2>

          <p className="text-[15px] lg:text-[16px] text-[#0A0A0A] font-normal max-w-[760px] leading-[1.6] lg:leading-[1.7]">
            {page6.quickAnswer}
          </p>

          <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5] mt-12 lg:mt-16">
            {p6Strips.map((strip) => (
              <div
                key={strip.num}
                className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12 py-8 lg:py-12 items-start"
              >
                {/* Number placed above its title, like One-Step */}
                <div className="lg:col-span-5">
                  <span className="block text-[40px] lg:text-[64px] font-[800] text-[var(--blue)] leading-none select-none mb-3">
                    {strip.num}
                  </span>
                  <h3 className="text-[14px] sm:text-[15px] lg:text-[17px] font-bold text-[#0A0A0A] leading-[1.25] tracking-[-0.01em] uppercase">
                    {strip.title}
                  </h3>
                </div>

                <div className="lg:col-span-7">
                  <p className="text-[15px] lg:text-[16px] text-[#0A0A0A] font-normal leading-[1.6] lg:leading-[1.7] max-w-[680px]">
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
          {/* Section Heading: ALL CAPITALS bold white (One-Step size: 17px-19px mobile, 32px desktop) */}
          <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-white uppercase leading-[1.15] tracking-[-0.02em] mb-4 lg:mb-6">
            COMMITTED TO: ACCURATE STEEL, SAFE SITES AND HONEST SCHEDULES
          </h2>

          <div className="w-[40px] h-[1px] bg-white/40 mb-5" />

          {/* Intro text: solid white, no opacity reduction, no early ragged wrap */}
          <p className="text-[15px] lg:text-[16px] text-white font-normal max-w-[760px] leading-[1.6] lg:leading-[1.7]">
            {page7.quickAnswer}
          </p>

          {/* Desktop: 5 Columns with numbers above titles */}
          <div className="hidden lg:grid grid-cols-5 gap-6 lg:gap-8 mt-16 pt-8 border-t border-white/20">
            {p7Commitments.map((com) => (
              <div key={com.num} className="flex flex-col items-start">
                {/* Number placed above its title, like One-Step */}
                <span className="block text-[40px] lg:text-[64px] font-[800] text-white leading-none select-none mb-3">
                  {com.num}
                </span>
                <h3 className="text-[14px] sm:text-[15px] lg:text-[17px] font-bold text-white leading-[1.25] tracking-[-0.01em] mb-2 uppercase">
                  {com.title}
                </h3>
                <p className="text-[15px] lg:text-[16px] text-white font-normal leading-[1.6] lg:leading-[1.7] w-full">
                  {com.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Mobile: 5 blocks with numbers above titles, no restrictive max-width to prevent ragged wrap */}
          <div className="block lg:hidden mt-12 space-y-10">
            {p7Commitments.map((com) => (
              <div key={com.num} className="w-full pt-6 border-t border-white/20 first:border-t-0 first:pt-0">
                {/* Number placed above its title, like One-Step */}
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
