import React, { useEffect } from "react";
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

const SECTIONS = [
  { id: "introduction", label: "Introduction" },
  { id: "vision", label: "Vision" },
  { id: "mission", label: "Mission" },
  { id: "core-values", label: "Core Values" },
];

export const AboutUs: React.FC = () => {
  const location = useLocation();

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

  // Extract Page 2 Content
  const p2WhoIsBlocks = page2.blocks.filter((b) => b.type === "p");
  const p2Paragraph1 = p2WhoIsBlocks[0]?.text || "";
  const p2Paragraph2 = p2WhoIsBlocks[1]?.text || "";
  const p2DoesText =
    page2.blocks.find(
      (b, idx) =>
        idx > 0 &&
        page2.blocks[idx - 1]?.type === "h2" &&
        (page2.blocks[idx - 1] as any)?.title === "What Steel Mind Engineers Does"
    )?.text || "";
  const p2TeamText =
    page2.blocks.find(
      (b, idx) =>
        idx > 0 &&
        page2.blocks[idx - 1]?.type === "h2" &&
        (page2.blocks[idx - 1] as any)?.title === "How the Team Is Organized"
    )?.text || "";

  // Extract Page 3 Content (Vision)
  const p3Pillars = [
    {
      title: "What the vision means",
      text:
        page3.blocks.find(
          (b, idx) =>
            idx > 0 &&
            page3.blocks[idx - 1]?.type === "h2" &&
            (page3.blocks[idx - 1] as any)?.title === "What the Vision Means"
        )?.text || "",
    },
    {
      title: "Why long-term partnerships matter",
      text:
        page3.blocks.find(
          (b, idx) =>
            idx > 0 &&
            page3.blocks[idx - 1]?.type === "h2" &&
            (page3.blocks[idx - 1] as any)?.title ===
              "Why Long-Term Partnerships Matter"
        )?.text || "",
    },
    {
      title: "How the vision shows in daily work",
      text:
        page3.blocks.find(
          (b, idx) =>
            idx > 0 &&
            page3.blocks[idx - 1]?.type === "h2" &&
            (page3.blocks[idx - 1] as any)?.title ===
              "How the Vision Shows in Daily Work"
        )?.text || "",
    },
  ];

  // Extract Page 4 Content (Mission)
  const p4OneParagraph =
    page4.blocks.find(
      (b, idx) =>
        idx > 0 &&
        page4.blocks[idx - 1]?.type === "h2" &&
        (page4.blocks[idx - 1] as any)?.title === "The Mission in One Paragraph"
    )?.text || "";
  const p4DependableClient =
    page4.blocks.find(
      (b, idx) =>
        idx > 0 &&
        page4.blocks[idx - 1]?.type === "h2" &&
        (page4.blocks[idx - 1] as any)?.title === "What Dependable Means to a Client"
    )?.text || "";
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
  const p5Cards = [
    {
      title: "Quality fabrication",
      desc:
        page5.blocks.find(
          (b, idx) =>
            idx > 0 &&
            page5.blocks[idx - 1]?.type === "h2" &&
            (page5.blocks[idx - 1] as any)?.title === "Quality Fabrication"
        )?.text || "",
    },
    {
      title: "Continuous improvement",
      desc:
        page5.blocks.find(
          (b, idx) =>
            idx > 0 &&
            page5.blocks[idx - 1]?.type === "h2" &&
            (page5.blocks[idx - 1] as any)?.title === "Continuous Improvement"
        )?.text || "",
    },
    {
      title: "Safety and reliability",
      desc:
        page5.blocks.find(
          (b, idx) =>
            idx > 0 &&
            page5.blocks[idx - 1]?.type === "h2" &&
            (page5.blocks[idx - 1] as any)?.title === "Safety and Reliability"
        )?.text || "",
    },
    {
      title: "How these values affect your project",
      desc:
        page5.blocks.find(
          (b, idx) =>
            idx > 0 &&
            page5.blocks[idx - 1]?.type === "h2" &&
            (page5.blocks[idx - 1] as any)?.title ===
              "How These Values Affect Your Project"
        )?.text || "",
    },
  ];

  return (
    <div className="relative w-full bg-white text-[var(--ink)]">
      {/* Hero Banner */}
      <SubpageHero
        title={page2.h1}
        image={aboutImages.aboutUs.hero}
        quoteUrl="/contact-us/#quote"
        overlay={true}
      />

      {/* ========================================================= */}
      {/* SECTION 1: ABOUT / INTRODUCTION (Two-Column Asymmetric) */}
      {/* ========================================================= */}
      <section
        id="introduction"
        style={{ scrollMarginTop: "var(--nav-h, 88px)" }}
        className="w-full bg-white py-12 lg:py-20 border-b border-[#E5E5E5]"
      >
        <div className="max-w-[1340px] mx-auto px-5 lg:px-10">
          {/* Mobile Heading First */}
          <div className="block lg:hidden mb-6">
            <h2 className="text-[16px] font-bold text-[#0A0A0A] uppercase leading-[1.15] tracking-[-0.02em]">
              {page2.h1}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col">
              {/* Desktop Heading */}
              <h2 className="hidden lg:block text-[44px] font-bold text-[#0A0A0A] uppercase leading-[1.15] tracking-[-0.02em]">
                {page2.h1}
              </h2>

              <p className="text-[15px] lg:text-[16px] font-normal leading-[1.6] lg:leading-[1.7] text-[var(--blue)] mt-4 lg:mt-6">
                {page2.quickAnswer}
              </p>

              <div className="mt-4 space-y-4 text-[15px] lg:text-[16px] font-normal leading-[1.6] lg:leading-[1.7] text-[var(--blue)]">
                <p>{p2Paragraph1}</p>
                <p>{p2Paragraph2}</p>
              </div>

              {(p2DoesText || p2TeamText) && (
                <div className="mt-6 pt-6 border-t border-[#E5E5E5] grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {p2DoesText && (
                    <div>
                      <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-[1.25]">
                        What Steel Mind Engineers does
                      </h3>
                      <p className="text-[15px] lg:text-[16px] font-normal leading-[1.6] lg:leading-[1.7] text-[var(--blue)] mt-2">
                        {p2DoesText}
                      </p>
                    </div>
                  )}
                  {p2TeamText && (
                    <div>
                      <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-[1.25]">
                        How the team is organized
                      </h3>
                      <p className="text-[15px] lg:text-[16px] font-normal leading-[1.6] lg:leading-[1.7] text-[var(--blue)] mt-2">
                        {p2TeamText}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  variant="secondary"
                  size="sm"
                  href={SITE.profilePdf}
                  target="_blank"
                >
                  Download Company Profile
                </Button>

                <Link
                  to="/contact-us/"
                  className="text-[13px] font-semibold text-[#1E3A8A] hover:underline inline-flex items-center gap-1.5"
                >
                  <span>Get in Touch</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Right Photo Column (Content-Proportional, No 920px Empty Gap) */}
            <div className="lg:col-span-5 order-first lg:order-last">
              <div className="w-full overflow-hidden border border-[#E5E5E5] bg-[#0A0A0A]">
                <img
                  src={aboutImages.aboutUs.introSticky}
                  alt="Steel Mind Engineers Leadership and Engineering Team"
                  loading="lazy"
                  className="w-full aspect-[4/3] lg:aspect-[5/4] object-cover object-center block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: VISION (Panoramic Banner + 3-Pillar Grid)     */}
      {/* ========================================================= */}
      <section
        id="vision"
        style={{ scrollMarginTop: "var(--nav-h, 88px)" }}
        className="w-full bg-[#F8FAFC] py-12 lg:py-20 border-b border-[#E5E5E5]"
      >
        <div className="max-w-[1340px] mx-auto px-5 lg:px-10">
          {/* Section Heading & Quick Answer */}
          <div className="w-full">
            <h2 className="text-[16px] lg:text-[44px] font-bold text-[#0A0A0A] uppercase leading-[1.15] tracking-[-0.02em]">
              {page3.h1}
            </h2>

            <p className="text-[15px] lg:text-[16px] font-normal leading-[1.6] lg:leading-[1.7] text-[var(--blue)] mt-4 lg:mt-6">
              {page3.quickAnswer}
            </p>
          </div>

          {/* Wide Panoramic Landscape Photo */}
          <div className="w-full overflow-hidden border border-[#E5E5E5] bg-[#0A0A0A] mt-6 lg:mt-8">
            <img
              src={aboutImages.aboutUs.visionSticky}
              alt="Completed steel building complex at sunrise in Pakistan"
              loading="lazy"
              className="w-full aspect-[16/9] lg:aspect-[24/9] object-cover object-center block"
            />
          </div>

          {/* 3 Pillar Columns (No Numbers, Clean Sentence-Case Titles) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-8 lg:mt-12">
            {p3Pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="bg-white border border-[#E5E5E5] p-6 lg:p-7 flex flex-col justify-start"
              >
                <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-[1.25]">
                  {pillar.title}
                </h3>
                <p className="text-[15px] lg:text-[16px] font-normal leading-[1.6] lg:leading-[1.7] text-[var(--blue)] mt-3">
                  {pillar.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: MISSION (Photo + Definitions Side-by-Side)    */}
      {/* ========================================================= */}
      <section
        id="mission"
        style={{ scrollMarginTop: "var(--nav-h, 88px)" }}
        className="w-full bg-white py-12 lg:py-20 border-b border-[#E5E5E5]"
      >
        <div className="max-w-[1340px] mx-auto px-5 lg:px-10">
          {/* Mobile Heading First */}
          <div className="block lg:hidden mb-6">
            <h2 className="text-[16px] font-bold text-[#0A0A0A] uppercase leading-[1.15] tracking-[-0.02em]">
              {page4.h1}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left Column: Photo & Narrative Statements */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="w-full overflow-hidden border border-[#E5E5E5] bg-[#0A0A0A]">
                <img
                  src={aboutImages.aboutUs.missionSticky}
                  alt="Precision Steel Fabrication, Cutting, and Welding Quality Inspection"
                  loading="lazy"
                  className="w-full aspect-[4/3] lg:aspect-[5/4] object-cover object-center block"
                />
              </div>

              {p4OneParagraph && (
                <div className="mt-6">
                  <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-[1.25]">
                    The mission in one paragraph
                  </h3>
                  <p className="text-[15px] lg:text-[16px] font-normal leading-[1.6] lg:leading-[1.7] text-[var(--blue)] mt-2">
                    {p4OneParagraph}
                  </p>
                </div>
              )}

              {p4DependableClient && (
                <div className="mt-5">
                  <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-[1.25]">
                    What dependable means to a client
                  </h3>
                  <p className="text-[15px] lg:text-[16px] font-normal leading-[1.6] lg:leading-[1.7] text-[var(--blue)] mt-2">
                    {p4DependableClient}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Heading, Quick Answer & 3 Definitions (No 01-03 numbers) */}
            <div className="lg:col-span-7 flex flex-col">
              {/* Desktop Heading */}
              <h2 className="hidden lg:block text-[44px] font-bold text-[#0A0A0A] uppercase leading-[1.15] tracking-[-0.02em]">
                {page4.h1}
              </h2>

              <p className="text-[15px] lg:text-[16px] font-normal leading-[1.6] lg:leading-[1.7] text-[var(--blue)] mt-4 lg:mt-6">
                {page4.quickAnswer}
              </p>

              {/* 3 Definition Panels: Quality, Safety, Efficiency (No numbers, no floating tick lines) */}
              <div className="mt-8 space-y-4">
                {p4Defs.map((def: any) => (
                  <div
                    key={def.name}
                    className="p-5 lg:p-6 border border-[#E5E5E5] bg-[#F8FAFC]"
                  >
                    <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-[1.25]">
                      {def.name}
                    </h3>
                    <p className="text-[15px] lg:text-[16px] font-normal leading-[1.6] lg:leading-[1.7] text-[var(--blue)] mt-2">
                      {def.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: CORE VALUES (Royal Blue Band, Solid White Text) */}
      {/* ========================================================= */}
      <section
        id="core-values"
        style={{
          backgroundColor: "var(--blue)",
          scrollMarginTop: "var(--nav-h, 88px)",
        }}
        className="w-full bg-[var(--blue)] text-white py-12 lg:py-20"
      >
        <div className="max-w-[1340px] mx-auto px-5 lg:px-10">
          {/* Section Heading: ALL CAPS, One-Step Sizes, Solid White */}
          <h2 className="text-[16px] lg:text-[44px] font-bold text-white uppercase leading-[1.15] tracking-[-0.02em]">
            {page5.h1}
          </h2>

          <p className="text-[15px] lg:text-[16px] font-normal leading-[1.6] lg:leading-[1.7] text-white mt-4 lg:mt-6">
            {page5.quickAnswer}
          </p>

          {/* 4 Clean Cards: No 01-04 numbers, no 3-mark lines, solid white text */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mt-10 lg:mt-14">
            {p5Cards.map((card) => (
              <div
                key={card.title}
                className="p-6 lg:p-8 border border-white/20 bg-white/[0.04] flex flex-col justify-start"
              >
                <h3 className="text-[17px] lg:text-[20px] font-bold text-white leading-[1.25]">
                  {card.title}
                </h3>
                <p className="text-[15px] lg:text-[16px] font-normal leading-[1.6] lg:leading-[1.7] text-white mt-3">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Banner to SME Policy with ALL CAPS heading */}
      <SubpageNextBanner
        heading="SME POLICY: QUALITY, HEALTH, SAFETY AND ENVIRONMENT AT STEEL MIND ENGINEERS"
        title="SME Policy"
        url="/about/sme-policy"
        image={aboutImages.aboutUs.nextSmePolicy}
        overlay={true}
      />
    </div>
  );
};
