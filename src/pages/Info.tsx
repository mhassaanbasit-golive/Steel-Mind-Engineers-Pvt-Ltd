import React from "react";
import { Link } from "react-router-dom";
import { ContentData, ContentBlock } from "../content/types.ts";
import { HeroBand } from "../components/ui/HeroBand.tsx";
import { Canvas } from "../components/ui/Canvas.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { NextBand } from "../components/ui/NextBand.tsx";
import { poolImage } from "../data/pool.ts";
import { NAV } from "../data/nav.ts";

export interface InfoProps {
  data: ContentData;
  isStepsPage?: boolean;
}

export const Info: React.FC<InfoProps> = ({ data, isStepsPage = false }) => {
  // Hero variant: Blue for About and Services, image for division children
  const isBlueHero = data.url.startsWith("/about-us/") || data.url.startsWith("/services/");
  const headerImg = isBlueHero ? undefined : poolImage(data.url, 0);

  // Group blocks by H2 sections
  const sections: Array<{
    h2Title: string;
    paragraphs: string[];
    defs?: Array<{ term: string; desc: string }>;
    steps?: Array<{ step: number; name: string; desc: string }>;
  }> = [];

  let currentSection: {
    h2Title: string;
    paragraphs: string[];
    defs?: Array<{ term: string; desc: string }>;
    steps?: Array<{ step: number; name: string; desc: string }>;
  } | null = null;

  const introParagraphs: string[] = [];

  data.blocks.forEach((block: ContentBlock) => {
    if (block.type === "h2") {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        h2Title: block.title || "",
        paragraphs: [],
      };
    } else if (block.type === "p" && block.text) {
      if (currentSection) {
        currentSection.paragraphs.push(block.text);
      } else {
        introParagraphs.push(block.text);
      }
    } else if (block.type === "defs" && block.items) {
      if (currentSection) {
        currentSection.defs = block.items.map((it) => ({ term: it.name, desc: it.text }));
      }
    } else if (block.type === "steps" && block.items) {
      if (currentSection) {
        currentSection.steps = block.items.map((it, idx) => ({ step: idx + 1, name: it.name, desc: it.text }));
      }
    }
  });
  if (currentSection) sections.push(currentSection);

  // Separate Section 0 (Block B) from Remaining Sections (Block C)
  const blockBSection = sections.length > 0 ? sections[0] : null;
  const remainingSections = sections.length > 1 ? sections.slice(1) : [];

  // Mapped images
  const infoImg = poolImage(data.url, 1);

  // Breadcrumb items
  const pathParts = data.url.split("/").filter(Boolean);
  const parentName =
    pathParts[0] === "about-us"
      ? "About Us"
      : pathParts[0] === "services"
      ? "Services"
      : "Pre-Engineered Buildings";

  const parentUrl =
    pathParts[0] === "about-us"
      ? "/about-us/introduction/"
      : pathParts[0] === "services"
      ? "/services/"
      : `/${pathParts[0]}/`;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: parentName, href: parentUrl },
    { label: data.h1.split(":")[0] || "Page" },
  ];

  // Find next page within current NAV group or next division
  let nextPage: { label: string; url: string } | null = null;
  for (const item of NAV) {
    const list = item.children || (item.divisions ? item.divisions.flatMap((d) => d.children) : []);
    const idx = list.findIndex((c) => c.url === data.url);
    if (idx !== -1 && idx < list.length - 1) {
      nextPage = list[idx + 1];
      break;
    }
  }

  const nextPageToUse = nextPage || {
    label: "Our Projects",
    url: "/projects/",
  };

  // Detect steps page (Factory Tour or One-Step Solution)
  const isTimelinePage =
    isStepsPage ||
    data.url.includes("factory-tour") ||
    data.url.includes("one-step-solution") ||
    data.blocks.some((b) => b.type === "steps");

  return (
    <div className="w-full bg-white">
      {/* Block A — Hero Band */}
      <HeroBand
        variant={isBlueHero ? "blue" : "image"}
        imageSrc={headerImg}
        imageAlt={data.alt || data.h1}
        breadcrumbItems={breadcrumbItems}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Block B — Information Panel (First H2 + First 2 Paragraphs + Image) */}
      {blockBSection && (
        <section className="py-12 lg:py-20 bg-white border-b border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              {/* Left Column: First H2 and first two paragraphs */}
              <div className="lg:col-span-6 space-y-4" data-reveal-group="">
                <h2
                  className="text-[16px] lg:text-[24px] font-semibold text-[var(--ink)] leading-[1.2]"
                  data-split=""
                >
                  {blockBSection.h2Title}
                </h2>
                {blockBSection.paragraphs.slice(0, 2).map((p, idx) => (
                  <p
                    key={idx}
                    className="text-[12px] lg:text-[13px] leading-[1.65] text-[var(--grey)]"
                    data-reveal=""
                  >
                    {p}
                  </p>
                ))}
              </div>

              {/* Right Column: Page image 4:3 */}
              <div className="lg:col-span-6" data-reveal="">
                <Canvas slot="info" ratio="4/3" src={infoImg} alt={blockBSection.h2Title} />
              </div>
            </div>

            {/* Any extra paragraphs or defs inside Block B section */}
            {blockBSection.paragraphs.length > 2 && (
              <div className="mt-8 space-y-4 max-w-[640px]">
                {blockBSection.paragraphs.slice(2).map((p, idx) => (
                  <p key={idx} className="text-[12px] lg:text-[13px] leading-[1.65] text-[var(--grey)]">
                    {p}
                  </p>
                ))}
              </div>
            )}

            {/* Block D — Numbered Feature Grid if defs in block B */}
            {blockBSection.defs && blockBSection.defs.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[var(--line)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blockBSection.defs.map((item, idx) => {
                    const numStr = String(idx + 1).padStart(2, "0");
                    return (
                      <div key={idx} className="p-2 bg-transparent" data-reveal="">
                        <div className="w-6 h-[1px] bg-[var(--blue)] mb-4" />
                        <div
                          className="text-[32px] lg:text-[48px] font-semibold leading-none mb-3 text-transparent select-none"
                          style={{ WebkitTextStroke: "1px var(--blue)" }}
                        >
                          {numStr}
                        </div>
                        <h4 className="text-[14px] lg:text-[17px] font-semibold text-[var(--ink)] leading-[1.25] mb-2">
                          {item.term}
                        </h4>
                        <p className="text-[12px] lg:text-[13px] leading-[1.6] text-[var(--grey)]">
                          {item.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Template T2s: Full-width Sequential Timeline for Steps Pages (Royal Blue alternating with White) */}
      {isTimelinePage && (
        <section
          style={{ backgroundColor: "var(--blue)" }}
          className="py-14 lg:py-20 bg-[var(--blue)] text-white"
        >
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] max-w-[800px]">
            {sections
              .flatMap((s) => s.steps || [])
              .map((st, idx) => {
                const numStr = String(st.step || idx + 1).padStart(2, "0");
                const stepImg = poolImage(data.url, idx + 2);
                const showImg = idx % 2 === 0;

                return (
                  <div key={idx} className="relative pl-16 pb-12 last:pb-0" data-reveal="">
                    {/* Vertical line running down left of numbers */}
                    <div className="absolute left-[31px] top-4 bottom-0 w-[1px] bg-white/25" />

                    {/* Step number left outlined white */}
                    <div
                      className="absolute left-0 top-0 text-[32px] lg:text-[48px] font-semibold leading-none text-transparent select-none"
                      style={{ WebkitTextStroke: "1px rgba(255,255,255,0.85)" }}
                    >
                      {numStr}
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-[14px] lg:text-[17px] font-semibold text-white leading-[1.25]">
                        {st.name}
                      </h3>
                      <p className="text-[12px] lg:text-[13px] leading-[1.65] text-white/85">
                        {st.desc}
                      </p>

                      {/* Image alternating between pairs of steps */}
                      {showImg && (
                        <div className="pt-4 max-w-[440px]">
                          <Canvas
                            slot={`step-${idx + 1}`}
                            ratio="4/3"
                            src={stepImg}
                            alt={st.name}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Block C — Alternating Image and Text Pairs for remaining H2 sections (Alternating Royal Blue and White) */}
      {!isTimelinePage &&
        remainingSections.map((sec, idx) => {
          const isEven = idx % 2 === 0;
          const sectionImg = poolImage(data.url, idx + 2);

          return (
            <React.Fragment key={idx}>
              {!isEven && <div data-line="" className="w-full h-[1px] bg-[var(--line)]" />}
              <section
                style={isEven ? { backgroundColor: "var(--blue)" } : undefined}
                className={`py-14 lg:py-20 w-full ${
                  isEven ? "bg-[var(--blue)] text-white" : "bg-white text-[var(--ink)]"
                }`}
              >
                <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                    <div
                      className={`order-1 ${
                        isEven
                          ? "lg:col-span-6 lg:order-1"
                          : "lg:col-span-6 lg:order-2"
                      }`}
                      data-reveal=""
                    >
                      <Canvas
                        slot={`pair-${idx + 1}`}
                        ratio="4/3"
                        src={sectionImg}
                        alt={sec.h2Title}
                      />
                    </div>

                    <div
                      className={`order-2 space-y-4 max-w-[400px] ${
                        isEven
                          ? "lg:col-span-6 lg:order-2"
                          : "lg:col-span-6 lg:order-1"
                      }`}
                      data-reveal-group=""
                    >
                      <h3
                        className={`text-[14px] lg:text-[17px] font-semibold leading-[1.25] ${
                          isEven ? "text-white" : "text-[var(--ink)]"
                        }`}
                        data-split=""
                      >
                        {sec.h2Title}
                      </h3>
                      {sec.paragraphs.map((p, pIdx) => (
                        <p
                          key={pIdx}
                          className={`text-[12px] lg:text-[13px] leading-[1.65] ${
                            isEven ? "text-white/85" : "text-[var(--grey)]"
                          }`}
                          data-reveal=""
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Block D if section has defs */}
                  {sec.defs && sec.defs.length > 0 && (
                    <div
                      className={`mt-12 pt-8 border-t ${
                        isEven ? "border-white/20" : "border-[var(--line)]"
                      }`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sec.defs.map((item, dIdx) => {
                          const numStr = String(dIdx + 1).padStart(2, "0");
                          return (
                            <div key={dIdx} className="p-2 bg-transparent" data-reveal="">
                              <div
                                className={`w-6 h-[1px] mb-4 ${
                                  isEven ? "bg-white/60" : "bg-[var(--blue)]"
                                }`}
                              />
                              <div
                                className="text-[32px] lg:text-[48px] font-semibold leading-none mb-3 text-transparent select-none"
                                style={{
                                  WebkitTextStroke: isEven
                                    ? "1px rgba(255,255,255,0.85)"
                                    : "1px var(--blue)",
                                }}
                              >
                                {numStr}
                              </div>
                              <h4
                                className={`text-[14px] lg:text-[17px] font-semibold leading-[1.25] mb-2 ${
                                  isEven ? "text-white" : "text-[var(--ink)]"
                                }`}
                              >
                                {item.term}
                              </h4>
                              <p
                                className={`text-[12px] lg:text-[13px] leading-[1.6] ${
                                  isEven ? "text-white/85" : "text-[var(--grey)]"
                                }`}
                              >
                                {item.desc}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </React.Fragment>
          );
        })}

      {/* FAQ (Block E Divided List Rows) */}
      {data.faq && data.faq.length > 0 && (
        <section className="py-12 lg:py-16 bg-white border-b border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] max-w-[800px]">
            {/* 2.3: Eyebrow "Questions" removed */}
            <h2 className="text-[16px] lg:text-[24px] font-semibold text-[var(--ink)] leading-[1.2] mb-6">
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} />
          </div>
        </section>
      )}

      {/* Next Band */}
      <NextBand
        nextUrl={nextPageToUse.url}
        nextTitle={nextPageToUse.label}
      />
    </div>
  );
};
