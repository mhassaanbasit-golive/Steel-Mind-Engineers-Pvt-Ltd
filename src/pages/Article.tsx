import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ContentData, ContentBlock } from "../content/types.ts";
import { Breadcrumb } from "../components/ui/Breadcrumb.tsx";
import { QuickAnswer } from "../components/ui/QuickAnswer.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { RelatedPages } from "../components/ui/RelatedPages.tsx";
import { QuoteBand } from "../components/ui/QuoteBand.tsx";
import { poolImage } from "../data/pool.ts";
import { UI } from "../data/ui.ts";
import blogCards from "../content/generated/blog-cards.json";

export interface ArticleProps {
  data: ContentData;
}

export const Article: React.FC<ArticleProps> = ({ data }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const headerImg = poolImage(data.url, 0);

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / total)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // H2 sections for chip index
  const h2Blocks = data.blocks.filter((b: ContentBlock) => b.type === "h2" && b.title);

  // Prev / Next article
  const currentIdx = blogCards.findIndex((b) => b.url === data.url);
  const prevArticle = currentIdx > 0 ? blogCards[currentIdx - 1] : null;
  const nextArticle = currentIdx < blogCards.length - 1 ? blogCards[currentIdx + 1] : null;

  return (
    <div className="w-full">
      {/* Reading Progress Bar fixed at header bottom */}
      <div
        className="fixed top-[var(--header-h)] inset-x-0 h-[2px] bg-transparent z-40 pointer-events-none"
      >
        <div
          className="h-full origin-left transition-transform duration-75"
          style={{
            backgroundImage: "var(--gradient-brand-horizontal)",
            transform: `scaleX(${scrollProgress})`,
          }}
        />
      </div>

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
              { label: "Blogs", href: "/blog/" },
              { label: "Article" },
            ]}
            theme="white"
            className="mb-4"
          />
          <h1
            className="text-[26px] lg:text-[48px] font-bold text-white leading-[1.15] tracking-[-0.02em] max-w-[800px]"
            data-split=""
          >
            {data.h1}
          </h1>
        </div>
      </section>

      {/* 2. Reading Column */}
      <div className="max-w-[700px] mx-auto px-[var(--pad-x)] pt-8 pb-8">
        <QuickAnswer text={data.quickAnswer} h1={data.h1} related={data.related} />

        {/* Chip index of H2 names */}
        {h2Blocks.length > 2 && (
          <div className="my-8 p-4 bg-[var(--offwhite)] border border-[var(--line)]">
            <span className="block text-[12px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em] mb-2">
              In this article:
            </span>
            <ul className="space-y-1.5 text-[14px]">
              {h2Blocks.map((b: ContentBlock, i: number) => {
                const id = (b.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
                return (
                  <li key={i}>
                    <a href={`#${id}`} className="text-[var(--blue)] hover:underline">
                      {b.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Body Blocks */}
        <div className="space-y-8 my-8 text-[17px] leading-[1.7] text-[var(--grey)]">
          {data.blocks.map((block: ContentBlock, idx: number) => {
            if (block.type === "h2") {
              const id = (block.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
              return (
                <h2
                  key={idx}
                  id={id}
                  className="text-[24px] font-semibold text-[var(--ink)] pt-6 text-left"
                >
                  {block.title}
                </h2>
              );
            }
            if (block.type === "p") {
              return (
                <p key={idx} className="text-left">
                  {block.text}
                </p>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* 3. FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="py-16 bg-[var(--offwhite)] border-t border-[var(--line)]">
          <div className="max-w-[700px] mx-auto px-[var(--pad-x)]">
            <h2 className="text-[26px] font-semibold text-[var(--ink)] mb-8" data-split="">
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} />
          </div>
        </section>
      )}

      {/* 4. Related Pages */}
      <div className="max-w-[700px] mx-auto px-[var(--pad-x)]">
        <RelatedPages related={data.related} />
      </div>

      {/* 5. CTA Band */}
      <QuoteBand />

      {/* 6. Previous and Next Article Links */}
      {(prevArticle || nextArticle) && (
        <div className="border-t border-[var(--line)] py-10 max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-2 divide-x divide-[var(--line)]">
            <div className="pr-6">
              {prevArticle && (
                <Link to={prevArticle.url} className="group block text-left">
                  <span className="block text-[12px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em] mb-1">
                    {UI.previous}
                  </span>
                  <span className="text-[16px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors line-clamp-2">
                    {prevArticle.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="pl-6 text-right">
              {nextArticle && (
                <Link to={nextArticle.url} className="group block text-right">
                  <span className="block text-[12px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em] mb-1">
                    {UI.next}
                  </span>
                  <span className="text-[16px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors line-clamp-2">
                    {nextArticle.title}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
