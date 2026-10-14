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

  // Extract Page 6 Content (SME Policy 5 strips)
  const p6Strips = page6.blocks
    .filter(
      (b) => b.type === "h2" && b.title !== "Why Steel Mind Engineers Has This Policy"
    )
    .map((h2Block, idx) => {
      const nextP = page6.blocks[page6.blocks.indexOf(h2Block) + 1];
      return {
        num: String(idx + 1).padStart(2, "0"),
        title: h2Block.title || "",
        desc: nextP?.text || "",
      };
    });

  // Extract Page 7 Content (Committed To 5 columns)
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

  return (
    <div className="relative w-full bg-white text-[var(--ink)]">
      {/* Hero with 20% overlay — headline is existing SME Policy section title word for word */}
      <SubpageHero
        title={page6.h1}
        image={aboutImages.smePolicy.hero}
        quoteUrl="/contact-us/#quote"
        overlay={true}
      />

      {/* ========================================================= */}
      {/* 1. SME POLICY SECTION (5 rows) — title already shown in hero */}
      {/* ========================================================= */}
      <section
        id="sme-policy"
        style={{ scrollMarginTop: "var(--nav-h, 88px)" }}
        className="w-full bg-white text-[var(--ink)] py-[72px] lg:py-[112px]"
      >
        <div className="max-w-[1340px] mx-auto px-5 lg:px-10">
          <p className="text-[14px] lg:text-[15px] text-[#6B7280] font-normal max-w-[600px] leading-[1.7]">
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
                <h2 className="text-[17px] lg:text-[22px] font-semibold text-[#0A0A0A] leading-[1.25] tracking-[-0.01em]">
                  {strip.title}
                </h2>
                <p className="text-[14px] lg:text-[15px] text-[#6B7280] leading-[1.7] max-w-[600px]">
                  {strip.desc}
                </p>
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

      {/* Next Banner to Factory with 20% overlay */}
      <SubpageNextBanner
        heading="Factory Tour: Inside the Steel Mind Engineers Fabrication Factory in Lahore"
        title="Factory"
        url="/about/factory"
        image={aboutImages.smePolicy.nextFactory}
        overlay={true}
      />
    </div>
  );
};
