import React from "react";
import { Link } from "react-router-dom";
import { ContentData, ContentBlock } from "../content/types.ts";
import { Breadcrumb } from "../components/ui/Breadcrumb.tsx";
import { QuickAnswer } from "../components/ui/QuickAnswer.tsx";
import { SectionIndex } from "../components/ui/SectionIndex.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { RelatedPages } from "../components/ui/RelatedPages.tsx";
import { QuoteBand } from "../components/ui/QuoteBand.tsx";
import { Img } from "../components/ui/Img.tsx";
import { SwipeRow } from "../components/ui/SwipeRow.tsx";
import { DefList } from "../components/ui/DefList.tsx";
import { Steps } from "../components/ui/Steps.tsx";
import { NAV } from "../data/nav.ts";
import { poolImage } from "../data/pool.ts";

export interface HubProps {
  data: ContentData;
}

export const Hub: React.FC<HubProps> = ({ data }) => {
  const headerImg = poolImage(data.url, 0);

  // Find child pages from NAV
  let childPages: Array<{ label: string; url: string; image: string }> = [];
  const foundNavItem = NAV.find((item) => item.url === data.url);
  if (foundNavItem?.children) {
    childPages = foundNavItem.children.map((c, i) => ({
      ...c,
      image: poolImage(c.url, i + 1),
    }));
  } else {
    // Check main divisions
    const mainDivs = NAV.find((item) => item.label === "Main Divisions");
    const matchedDiv = mainDivs?.divisions?.find((d) => d.url === data.url);
    if (matchedDiv?.children) {
      childPages = matchedDiv.children.map((c, i) => ({
        ...c,
        image: poolImage(c.url, i + 1),
      }));
    }
  }

  // Extract H2 sections for SectionIndex
  const h2Sections = data.blocks
    .filter((b: ContentBlock) => b.type === "h2" && b.title)
    .map((b: ContentBlock) => ({
      id: (b.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: b.title || "",
    }));

  return (
    <div className="w-full">
      {/* 1. Full-Bleed Dark Header */}
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
              { label: data.h1.split(":")[0] || "Hub" },
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

      {/* 2. Quick Answer (Floating Trigger + Drawer) & Sticky Index */}
      <QuickAnswer text={data.quickAnswer} h1={data.h1} related={data.related} />

      <SectionIndex sections={h2Sections} />

      {/* 3. Children Showcase Section */}
      {childPages.length > 0 && (
        <section className="py-16 bg-[var(--offwhite)] border-b border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <h2 className="text-[28px] lg:text-[36px] font-semibold text-[var(--ink)] mb-8" data-split="">
              Explore This Division
            </h2>

            <SwipeRow ariaLabel="Child Pages">
              {childPages.map((child, idx) => (
                <Link
                  key={child.url}
                  to={child.url}
                  className="group block bg-white border border-[var(--line)] overflow-hidden"
                  data-reveal=""
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                    <img
                      src={child.image}
                      alt={child.label}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-[20px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors">
                      {child.label}
                    </h3>
                    <div className="pt-2 flex items-center justify-end">
                      <svg className="w-5 h-5 stroke-current text-[var(--blue)] transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                        <line x1="4" y1="12" x2="20" y2="12" />
                        <polyline points="14 6 20 12 14 18" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </SwipeRow>
          </div>
        </section>
      )}

      {/* 4. Body Blocks */}
      <div className="w-full">
        {data.blocks.map((block: ContentBlock, idx: number) => {
          const sectionId = block.title
            ? block.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
            : undefined;

          if (block.type === "h2") {
            return (
              <div key={idx} id={sectionId} className="pt-16 pb-4 max-w-[1340px] mx-auto px-[var(--pad-x)]">
                <h2 className="text-[28px] lg:text-[38px] font-semibold text-[var(--ink)]" data-split="">
                  {block.title}
                </h2>
              </div>
            );
          }
          if (block.type === "p") {
            return (
              <div key={idx} className="py-3 max-w-[1340px] mx-auto px-[var(--pad-x)]">
                <p className="text-[16px] lg:text-[17px] leading-[1.65] text-[var(--grey)] max-w-[760px]" data-reveal="">
                  {block.text}
                </p>
              </div>
            );
          }
          if (block.type === "defs" && block.items) {
            return (
              <div key={idx} className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
                <DefList items={block.items} />
              </div>
            );
          }
          if (block.type === "steps" && block.items) {
            return (
              <div key={idx} className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
                <Steps items={block.items} />
              </div>
            );
          }
          if (block.type === "bullets" && block.bullets) {
            return (
              <div key={idx} className="py-4 max-w-[1340px] mx-auto px-[var(--pad-x)] space-y-3">
                {block.bullets.map((b: string, bIdx: number) => (
                  <div key={bIdx} className="flex items-start space-x-3 text-[16px] text-[var(--grey)] leading-[1.6]" data-reveal="">
                    <span className="w-1.5 h-1.5 bg-[var(--blue)] mt-2.5 flex-shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* 5. FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="py-16 bg-[var(--offwhite)] border-t border-[var(--line)] mt-16">
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
