import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ContentData, ContentBlock } from "../content/types.ts";
import { HeroBand } from "../components/ui/HeroBand.tsx";
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
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const total = document.documentElement.scrollHeight - window.innerHeight;
          if (total > 0) {
            setScrollProgress(Math.min(1, Math.max(0, window.scrollY / total)));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prev / Next article
  const currentIdx = blogCards.findIndex((b) => b.url === data.url);
  const prevArticle = currentIdx > 0 ? blogCards[currentIdx - 1] : null;
  const nextArticle = currentIdx < blogCards.length - 1 ? blogCards[currentIdx + 1] : null;

  return (
    <div className="w-full bg-white">
      {/* Reading Progress Bar fixed at bottom of header */}
      <div className="fixed top-[var(--header-h)] inset-x-0 h-[2.5px] bg-[var(--line)]/40 z-[110] pointer-events-none">
        <div
          className="h-full origin-left transition-transform duration-75 bg-[var(--blue)]"
          style={{
            transform: `scaleX(${scrollProgress})`,
            transformOrigin: "left center",
          }}
        />
      </div>

      {/* Block A — Hero Band (Image) */}
      <HeroBand
        variant="image"
        imageSrc={headerImg}
        imageAlt={data.alt || data.h1}
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Blogs", href: "/blog/" },
          { label: "Article" },
        ]}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Reading Column: max-w 480px mobile / 560px desktop */}
      <div className="max-w-[480px] lg:max-w-[560px] mx-auto px-[var(--pad-x)] pt-10 pb-12">
        {/* Body Blocks */}
        <div className="space-y-6 text-[12px] lg:text-[13px] leading-[1.65] text-[var(--grey)]">
          {data.blocks.map((block: ContentBlock, idx: number) => {
            if (block.type === "h2") {
              const id = (block.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
              return (
                <h2
                  key={idx}
                  id={id}
                  className="text-[16px] lg:text-[24px] font-semibold text-[var(--ink)] pt-6 leading-[1.2] text-left"
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

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="py-12 lg:py-16 bg-white border-t border-[var(--line)]">
          <div className="max-w-[480px] lg:max-w-[560px] mx-auto px-[var(--pad-x)]">
            <h2 className="text-[16px] lg:text-[24px] font-semibold text-[var(--ink)] leading-[1.2] mb-6" data-split="">
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} />
          </div>
        </section>
      )}

      {/* Related Pages */}
      <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <RelatedPages related={data.related} />
      </div>

      {/* CTA Band */}
      <QuoteBand />

      {/* Previous and Next Article Links */}
      {(prevArticle || nextArticle) && (
        <div className="border-t border-[var(--line)] py-8 max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-2 divide-x divide-[var(--line)]">
            <div className="pr-4 lg:pr-6">
              {prevArticle && (
                <Link to={prevArticle.url} className="group block text-left">
                  <span className="block text-[9px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em] mb-1">
                    {UI.previous}
                  </span>
                  <span className="text-[12px] lg:text-[13px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors line-clamp-2 leading-[1.3]">
                    {prevArticle.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="pl-4 lg:pl-6 text-right">
              {nextArticle && (
                <Link to={nextArticle.url} className="group block text-right">
                  <span className="block text-[9px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em] mb-1">
                    {UI.next}
                  </span>
                  <span className="text-[12px] lg:text-[13px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors line-clamp-2 leading-[1.3]">
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
