import React from "react";
import { Link } from "react-router-dom";
import { ContentData, ContentBlock } from "../content/types.ts";
import { Breadcrumb } from "../components/ui/Breadcrumb.tsx";
import { QuickAnswer } from "../components/ui/QuickAnswer.tsx";
import { SectionIndex } from "../components/ui/SectionIndex.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { RelatedPages } from "../components/ui/RelatedPages.tsx";
import { QuoteBand } from "../components/ui/QuoteBand.tsx";
import { DefList } from "../components/ui/DefList.tsx";
import { Steps } from "../components/ui/Steps.tsx";
import { poolImage } from "../data/pool.ts";
import { UI } from "../data/ui.ts";
import { NAV } from "../data/nav.ts";

export interface InfoProps {
  data: ContentData;
  isStepsPage?: boolean;
}

export const Info: React.FC<InfoProps> = ({ data, isStepsPage = false }) => {
  const headerImg = poolImage(data.url, 0);
  const bodyImg1 = poolImage(data.url, 1);
  const bodyImg2 = poolImage(data.url, 2);

  // Group blocks by H2 sections
  const sections: Array<{
    h2Title: string;
    blocks: ContentBlock[];
  }> = [];

  let currentSection: { h2Title: string; blocks: ContentBlock[] } | null = null;
  const introBlocks: ContentBlock[] = [];

  data.blocks.forEach((block: ContentBlock) => {
    if (block.type === "h2") {
      if (currentSection) sections.push(currentSection);
      currentSection = { h2Title: block.title || "", blocks: [] };
    } else {
      if (currentSection) {
        currentSection.blocks.push(block);
      } else {
        introBlocks.push(block);
      }
    }
  });
  if (currentSection) sections.push(currentSection);

  const h2IndexItems = sections.map((sec) => ({
    id: sec.h2Title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: sec.h2Title,
  }));

  // Find previous and next pages within current NAV group
  let prevPage: { label: string; url: string } | null = null;
  let nextPage: { label: string; url: string } | null = null;

  for (const item of NAV) {
    const list = item.children || (item.divisions ? item.divisions.flatMap((d) => d.children) : []);
    const idx = list.findIndex((c) => c.url === data.url);
    if (idx !== -1) {
      if (idx > 0) prevPage = list[idx - 1];
      if (idx < list.length - 1) nextPage = list[idx + 1];
      break;
    }
  }

  return (
    <div className="w-full">
      {/* 1. Header Image */}
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
              { label: data.h1.split(":")[0] || "Page" },
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

      {/* 3. Sticky Section Index */}
      <SectionIndex sections={h2IndexItems} />

      {/* Intro Blocks if any */}
      {introBlocks.length > 0 && (
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] py-8 space-y-4">
          {introBlocks.map((b, i) => (
            <p key={i} className="text-[16px] lg:text-[17px] leading-[1.65] text-[var(--grey)] max-w-[760px]">
              {b.text}
            </p>
          ))}
        </div>
      )}

      {/* 4. Sections Body with Alternating Backgrounds */}
      <div className="w-full">
        {sections.map((sec, secIdx) => {
          const isOdd = secIdx % 2 === 0;
          const bgClass = isOdd ? "bg-white" : "bg-[var(--offwhite)]";
          const secId = sec.h2Title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

          return (
            <React.Fragment key={secIdx}>
              <section id={secId} className={`py-14 lg:py-20 w-full ${bgClass} border-b border-[var(--line)]`}>
                <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Desktop 4/12 Left Column: H2 */}
                    <div className="lg:col-span-4">
                      <h2
                        className="text-[26px] lg:text-[34px] font-semibold text-[var(--ink)] leading-[1.2] sticky top-[calc(var(--header-h)+64px)]"
                        data-split=""
                      >
                        {sec.h2Title}
                      </h2>
                    </div>

                    {/* Desktop 7/12 Right Column: Content */}
                    <div className="lg:col-span-7 lg:col-start-6 space-y-6">
                      {sec.blocks.map((block, bIdx) => {
                        if (block.type === "p") {
                          return (
                            <p
                              key={bIdx}
                              className="text-[16px] lg:text-[17px] leading-[1.65] text-[var(--grey)] max-w-[600px]"
                              data-reveal=""
                            >
                              {block.text}
                            </p>
                          );
                        }
                        if (block.type === "defs" && block.items) {
                          return <DefList key={bIdx} items={block.items} />;
                        }
                        if (block.type === "steps" && block.items) {
                          if (isStepsPage) {
                            return (
                              <div key={bIdx} className="space-y-8 my-6">
                                {block.items.map((step: { name: string; text: string }, sIdx: number) => (
                                  <div key={sIdx} className="flex items-start space-x-6" data-reveal="">
                                    <span
                                      className="text-[52px] font-bold leading-none text-transparent flex-shrink-0"
                                      style={{ WebkitTextStroke: "1px var(--blue)" }}
                                    >
                                      {String(sIdx + 1).padStart(2, "0")}
                                    </span>
                                    <div>
                                      <h3 className="text-[20px] font-semibold text-[var(--ink)] mb-2">
                                        {step.name}
                                      </h3>
                                      <p className="text-[16px] leading-[1.6] text-[var(--grey)]">
                                        {step.text}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          return <Steps key={bIdx} items={block.items} />;
                        }
                        if (block.type === "bullets" && block.bullets) {
                          return (
                            <div key={bIdx} className="space-y-3 py-2">
                              {block.bullets.map((b: string, bulletIdx: number) => (
                                <div key={bulletIdx} className="flex items-start space-x-3 text-[16px] text-[var(--grey)]">
                                  <span className="w-1.5 h-1.5 bg-[var(--blue)] mt-2 flex-shrink-0" />
                                  <span>{b}</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              </section>

              {/* Image Rhythm: Full-bleed 16:9 after 2nd H2 */}
              {secIdx === 1 && (
                <div className="w-full aspect-[16/9] overflow-hidden" data-parallax="6">
                  <img
                    src={bodyImg1}
                    alt={`${data.h1} feature`}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Inset Image after 5th H2 */}
              {secIdx === 4 && (
                <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] py-12">
                  <div className="max-w-[800px] overflow-hidden aspect-[4/3] lg:aspect-[5/6]">
                    <img
                      src={bodyImg2}
                      alt={`${data.h1} detail`}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
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

      {/* 7. Previous and Next Nav Row */}
      {(prevPage || nextPage) && (
        <div className="border-t border-[var(--line)] py-10 max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-2 divide-x divide-[var(--line)]">
            <div className="pr-6">
              {prevPage && (
                <Link to={prevPage.url} className="group block text-left">
                  <span className="block text-[12px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em] mb-1">
                    {UI.previous}
                  </span>
                  <span className="text-[16px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors">
                    {prevPage.label}
                  </span>
                </Link>
              )}
            </div>
            <div className="pl-6 text-right">
              {nextPage && (
                <Link to={nextPage.url} className="group block text-right">
                  <span className="block text-[12px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em] mb-1">
                    {UI.next}
                  </span>
                  <span className="text-[16px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors">
                    {nextPage.label}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. CTA Quote Band */}
      <QuoteBand />
    </div>
  );
};
