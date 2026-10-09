import React, { useState } from "react";
import { ContentData, ContentBlock } from "../content/types.ts";
import { Breadcrumb } from "../components/ui/Breadcrumb.tsx";
import { QuickAnswer } from "../components/ui/QuickAnswer.tsx";
import { SwipeRow } from "../components/ui/SwipeRow.tsx";
import { FrameDiagram } from "../components/diagrams/FrameDiagram.tsx";
import { CraneDiagram } from "../components/diagrams/CraneDiagram.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { RelatedPages } from "../components/ui/RelatedPages.tsx";
import { QuoteBand } from "../components/ui/QuoteBand.tsx";
import { poolImage } from "../data/pool.ts";

export interface DiagramGalleryProps {
  data: ContentData;
}

export const DiagramGallery: React.FC<DiagramGalleryProps> = ({ data }) => {
  const headerImg = poolImage(data.url, 0);
  const isCranePage = data.url.includes("crane");

  const [modalItem, setModalItem] = useState<{ name: string; text: string } | null>(null);

  // Find defs block which contains the diagram items
  const defsBlock = data.blocks.find((b: ContentBlock) => b.type === "defs" && b.items);
  const items = defsBlock?.items || [];

  return (
    <div className="w-full">
      {/* 1. Header */}
      <section className="relative w-full h-[62svh] min-h-[420px] lg:h-[70vh] bg-[var(--ink)] overflow-hidden">
        <div className="absolute inset-0 w-full h-full" data-parallax="4">
          <img
            src={headerImg}
            alt={data.alt || data.h1}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#0A0A0A]/35" />
        </div>

        <div className="absolute inset-x-0 bottom-0 max-w-[1340px] mx-auto px-[var(--pad-x)] pb-10 z-10">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: data.h1.split(":")[0] || "Diagram Gallery" },
            ]}
            theme="white"
            className="mb-4"
          />
          <h1
            className="text-[28px] lg:text-[56px] font-bold text-white leading-[1.1] tracking-[-0.02em] max-w-[800px]"
            data-split=""
          >
            {data.h1}
          </h1>
        </div>
      </section>

      {/* 2. Quick Answer (Floating Trigger + Drawer) */}
      <QuickAnswer text={data.quickAnswer} h1={data.h1} related={data.related} />

      {/* 3. Diagram Gallery SwipeRow */}
      {items.length > 0 && (
        <section className="py-16 bg-[var(--offwhite)] border-y border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <h2 className="text-[28px] lg:text-[36px] font-semibold text-[var(--ink)] mb-8" data-split="">
              {isCranePage ? "Crane Arrangements" : "Framing System Types"}
            </h2>

            <SwipeRow ariaLabel="Diagrams Gallery">
              {items.map((item: { name: string; text: string }, idx: number) => (
                <div
                  key={idx}
                  onClick={() => setModalItem(item)}
                  className="group bg-white border border-[var(--line)] p-4 flex flex-col cursor-pointer transition-colors hover:border-[var(--blue)]"
                  data-reveal=""
                >
                  <div className="w-full mb-4 overflow-hidden bg-[var(--offwhite)]">
                    {isCranePage ? (
                      <CraneDiagram type={item.name} />
                    ) : (
                      <FrameDiagram type={item.name} />
                    )}
                  </div>
                  <h3 className="text-[18px] font-semibold text-[var(--ink)] mb-2 group-hover:text-[var(--blue)] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-[var(--grey)] line-clamp-3">
                    {item.text}
                  </p>
                  <span className="mt-4 text-[13px] font-semibold text-[var(--blue)] inline-block">
                    Enlarge diagram +
                  </span>
                </div>
              ))}
            </SwipeRow>
          </div>
        </section>
      )}

      {/* Modal for enlarged diagram */}
      {modalItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[350] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
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

            <div className="w-full aspect-[4/3] bg-[var(--offwhite)]">
              {isCranePage ? (
                <CraneDiagram type={modalItem.name} />
              ) : (
                <FrameDiagram type={modalItem.name} />
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-[22px] font-bold text-[var(--ink)]">
                {modalItem.name}
              </h3>
              <p className="text-[16px] leading-[1.65] text-[var(--grey)]">
                {modalItem.text}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Other Blocks */}
      <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] py-12 space-y-8">
        {data.blocks
          .filter((b: ContentBlock) => b.type !== "defs")
          .map((b: ContentBlock, idx: number) => {
            if (b.type === "h2") {
              return (
                <h2 key={idx} className="text-[26px] lg:text-[34px] font-semibold text-[var(--ink)] pt-8" data-split="">
                  {b.title}
                </h2>
              );
            }
            if (b.type === "p") {
              return (
                <p key={idx} className="text-[16px] lg:text-[17px] leading-[1.65] text-[var(--grey)] max-w-[720px]">
                  {b.text}
                </p>
              );
            }
            return null;
          })}
      </div>

      {/* 5. FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="py-16 bg-[var(--offwhite)] border-t border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <h2 className="text-[28px] lg:text-[38px] font-semibold text-[var(--ink)] mb-8" data-split="">
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} />
          </div>
        </section>
      )}

      {/* 6. Related Pages */}
      <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <RelatedPages related={data.related} />
      </div>

      {/* 7. CTA Quote Band */}
      <QuoteBand />
    </div>
  );
};
