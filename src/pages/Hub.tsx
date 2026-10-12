import React from "react";
import { Link } from "react-router-dom";
import { ContentData, ContentBlock } from "../content/types.ts";
import { HeroBand } from "../components/ui/HeroBand.tsx";
import { Canvas } from "../components/ui/Canvas.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { RelatedPages } from "../components/ui/RelatedPages.tsx";
import { CtaBand } from "../components/ui/CtaBand.tsx";
import { NAV } from "../data/nav.ts";
import { poolImage } from "../data/pool.ts";
import { CONTENT_BY_URL } from "../content/index.ts";

export interface HubProps {
  data: ContentData;
}

export const Hub: React.FC<HubProps> = ({ data }) => {
  const headerImg = poolImage(data.url, 0);
  const infoImg = poolImage(data.url, 1);

  // Find child pages from NAV
  let childPages: Array<{ label: string; url: string; desc: string }> = [];
  const foundNavItem = NAV.find((item) => item.url === data.url);
  if (foundNavItem?.children) {
    childPages = foundNavItem.children.map((c) => {
      const childData = CONTENT_BY_URL[c.url];
      const qa = childData?.quickAnswer || "";
      const firstSentence = qa ? qa.split(". ")[0].replace(/\.$/, "") + "." : "";
      return {
        label: c.label,
        url: c.url,
        desc: firstSentence,
      };
    });
  } else {
    // Check main divisions
    const mainDivs = NAV.find((item) => item.label === "Main Divisions");
    const matchedDiv = mainDivs?.divisions?.find((d) => d.url === data.url);
    if (matchedDiv?.children) {
      childPages = matchedDiv.children.map((c) => {
        const childData = CONTENT_BY_URL[c.url];
        const qa = childData?.quickAnswer || "";
        const firstSentence = qa ? qa.split(". ")[0].replace(/\.$/, "") + "." : "";
        return {
          label: c.label,
          url: c.url,
          desc: firstSentence,
        };
      });
    }
  }

  // Extract first H2 and its first two paragraphs for Block B
  const firstH2Index = data.blocks.findIndex((b) => b.type === "h2");
  let blockBTitle = data.h1;
  let blockBParagraphs: string[] = [];

  if (firstH2Index !== -1) {
    const firstH2 = data.blocks[firstH2Index];
    blockBTitle = firstH2.title || data.h1;
    // Get paragraphs immediately following this H2
    for (let i = firstH2Index + 1; i < data.blocks.length; i++) {
      const b = data.blocks[i];
      if (b.type === "h2") break;
      if (b.type === "p" && b.text) {
        blockBParagraphs.push(b.text);
        if (blockBParagraphs.length >= 2) break;
      }
    }
  }

  // Fallback if no paragraphs under first H2
  if (blockBParagraphs.length === 0) {
    const pBlocks = data.blocks.filter((b) => b.type === "p" && b.text);
    blockBParagraphs = pBlocks.slice(0, 2).map((b) => b.text || "");
  }

  return (
    <div className="w-full bg-white">
      {/* Block A — Hero Band (Image) */}
      <HeroBand
        variant="image"
        imageSrc={headerImg}
        imageAlt={data.alt || data.h1}
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: data.h1.split(":")[0] || "Hub" },
        ]}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Block B — Information Panel (Image + Facts) */}
      <section className="py-12 lg:py-20 bg-white border-b border-[var(--line)]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Column: First H2 and first two paragraphs */}
            <div className="lg:col-span-6 space-y-4" data-reveal-group="">
              <h2
                className="text-[16px] lg:text-[24px] font-semibold text-[var(--ink)] leading-[1.2]"
                data-split=""
              >
                {blockBTitle}
              </h2>
              {blockBParagraphs.map((p, idx) => (
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
              <Canvas slot="info" ratio="4/3" src={infoImg} alt={blockBTitle} />
            </div>
          </div>
        </div>
      </section>

      {/* Block D — Numbered Feature Grid of Child Pages (Royal Blue alternating with White) */}
      {childPages.length > 0 && (
        <section
          style={{ backgroundColor: "var(--blue)" }}
          className="py-14 lg:py-20 bg-[var(--blue)] text-white"
        >
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <div className="mb-10 lg:mb-14">
              {/* 2.3: Eyebrow "Overview" removed */}
              <h2 className="text-[16px] lg:text-[24px] font-semibold text-white leading-[1.2]">
                Explore This Division
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {childPages.map((child, idx) => {
                const numStr = String(idx + 1).padStart(2, "0");
                return (
                  <Link
                    key={child.url}
                    to={child.url}
                    className="group block p-2 bg-transparent transition-all"
                    data-reveal=""
                  >
                    {/* Top line 24px wide white */}
                    <div className="w-6 h-[1px] bg-white/60 mb-4" />

                    {/* Outlined number */}
                    <div
                      className="text-[32px] lg:text-[48px] font-semibold leading-none mb-3 text-transparent select-none"
                      style={{ WebkitTextStroke: "1px rgba(255,255,255,0.85)" }}
                    >
                      {numStr}
                    </div>

                    {/* H3 subheading 14px mobile / 17px desktop */}
                    <h3 className="text-[14px] lg:text-[17px] font-semibold text-white group-hover:underline transition-colors leading-[1.25] mb-2">
                      {child.label}
                    </h3>

                    {/* Description 12px mobile / 13px desktop */}
                    {child.desc && (
                      <p className="text-[12px] lg:text-[13px] leading-[1.6] text-white/85 line-clamp-3">
                        {child.desc}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

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

      {/* Related Pages (Block E) */}
      {data.related && data.related.length > 0 && (
        <section className="py-8 bg-white border-b border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] max-w-[800px]">
            <RelatedPages related={data.related} />
          </div>
        </section>
      )}

      {/* Block F — CTA Band */}
      <CtaBand />
    </div>
  );
};
