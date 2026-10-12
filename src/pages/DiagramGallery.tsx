import React, { useState } from "react";
import { ContentData, ContentBlock } from "../content/types.ts";
import { HeroBand } from "../components/ui/HeroBand.tsx";
import { Canvas } from "../components/ui/Canvas.tsx";
import { FrameDiagram } from "../components/diagrams/FrameDiagram.tsx";
import { CraneDiagram } from "../components/diagrams/CraneDiagram.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { NextBand } from "../components/ui/NextBand.tsx";
import { NAV } from "../data/nav.ts";
import { poolImage } from "../data/pool.ts";

export interface DiagramGalleryProps {
  data: ContentData;
}

export const DiagramGallery: React.FC<DiagramGalleryProps> = ({ data }) => {
  const headerImg = poolImage(data.url, 0);
  const infoImg = poolImage(data.url, 1);
  const isCranePage = data.url.includes("crane");

  const [modalItem, setModalItem] = useState<{ name: string; text: string } | null>(null);

  // Find defs block which contains the diagram items
  const defsBlock = data.blocks.find((b: ContentBlock) => b.type === "defs" && b.items);
  const items = defsBlock?.items || [];

  let nextPage: { label: string; url: string } | null = null;
  for (const item of NAV) {
    const list = item.children || (item.divisions ? item.divisions.flatMap((d) => d.children) : []);
    const idx = list.findIndex((c) => c.url === data.url);
    if (idx !== -1 && idx < list.length - 1) {
      nextPage = list[idx + 1];
      break;
    }
  }
  const nextPageToUse = nextPage || { label: "Our Projects", url: "/projects/" };

  // Extract first H2 and first two paragraphs for Block B
  const firstH2Index = data.blocks.findIndex((b) => b.type === "h2");
  let blockBTitle = data.h1;
  let blockBParagraphs: string[] = [];

  if (firstH2Index !== -1) {
    const firstH2 = data.blocks[firstH2Index];
    blockBTitle = firstH2.title || data.h1;
    for (let i = firstH2Index + 1; i < data.blocks.length; i++) {
      const b = data.blocks[i];
      if (b.type === "h2") break;
      if (b.type === "p" && b.text) {
        blockBParagraphs.push(b.text);
        if (blockBParagraphs.length >= 2) break;
      }
    }
  }

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
          { label: "Pre-Engineered Buildings", href: "/pre-engineered-buildings-pakistan/" },
          { label: data.h1.split(":")[0] || "Diagram Gallery" },
        ]}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Block B — Information Panel (Royal Blue alternating with White) */}
      <section
        style={{ backgroundColor: "var(--blue)" }}
        className="py-12 lg:py-20 bg-[var(--blue)] text-white"
      >
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-6 space-y-4" data-reveal-group="">
              <h2
                className="text-[16px] lg:text-[24px] font-semibold text-white leading-[1.2]"
                data-split=""
              >
                {blockBTitle}
              </h2>
              {blockBParagraphs.map((p, idx) => (
                <p
                  key={idx}
                  className="text-[12px] lg:text-[13px] leading-[1.65] text-white/85"
                  data-reveal=""
                >
                  {p}
                </p>
              ))}
            </div>

            <div className="lg:col-span-6" data-reveal="">
              <Canvas slot="info" ratio="4/3" src={infoImg} alt={blockBTitle} />
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Diagrams (Full-bleed White section with 1px --line dividers, no white cards on offwhite) */}
      {items.length > 0 && (
        <section className="py-14 lg:py-20 bg-white border-b border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <div className="mb-10 lg:mb-12">
              {/* 2.3: Eyebrow "Technical Diagrams" removed */}
              <h2 className="text-[16px] lg:text-[24px] font-semibold text-[var(--ink)] leading-[1.2]">
                {isCranePage ? "Crane Arrangements" : "Framing System Types"}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[var(--line)]">
              {items.map((item: { name: string; text: string }, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setModalItem(item)}
                  className="group bg-white border-r border-b border-[var(--line)] p-6 flex flex-col cursor-pointer transition-colors"
                  data-reveal=""
                >
                  <div className="w-full aspect-[4/3] mb-4 overflow-hidden bg-white flex items-center justify-center p-2">
                    {isCranePage ? (
                      <CraneDiagram type={item.name} />
                    ) : (
                      <FrameDiagram type={item.name} />
                    )}
                  </div>
                  <h3 className="text-[14px] lg:text-[17px] font-semibold text-[var(--ink)] mb-2 group-hover:text-[var(--blue)] transition-colors leading-[1.25]">
                    {item.name}
                  </h3>
                  <p className="text-[12px] lg:text-[13px] leading-[1.65] text-[var(--grey)] line-clamp-3">
                    {item.text}
                  </p>
                  <span className="mt-4 text-[10px] font-semibold text-[var(--blue)] inline-block uppercase tracking-[0.06em]">
                    Enlarge diagram +
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox for enlarged diagram (1.3: Royal Blue backdrop, no black) */}
      {modalItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[350] bg-[var(--blue)]/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        >
          <div className="bg-white max-w-[720px] w-full p-6 sm:p-8 space-y-6 relative border border-[var(--line)]">
            <button
              type="button"
              onClick={() => setModalItem(null)}
              aria-label="Close"
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-[var(--ink)] hover:text-[var(--blue)] cursor-pointer"
            >
              <svg className="w-6 h-6 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="w-full aspect-[4/3] bg-white flex items-center justify-center p-4">
              {isCranePage ? (
                <CraneDiagram type={modalItem.name} />
              ) : (
                <FrameDiagram type={modalItem.name} />
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-[14px] lg:text-[17px] font-semibold text-[var(--ink)]">
                {modalItem.name}
              </h3>
              <p className="text-[12px] lg:text-[13px] leading-[1.65] text-[var(--grey)]">
                {modalItem.text}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FAQ (Block E) */}
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
