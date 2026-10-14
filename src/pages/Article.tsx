import React, { useEffect, useState } from "react";
import { Link } from "../components/ui/TransitionLink.tsx";
import { ContentData, ContentBlock } from "../content/types.ts";
import { HeroBand } from "../components/ui/HeroBand.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { NextBand } from "../components/ui/NextBand.tsx";
import { poolImage } from "../data/pool.ts";
import { getBlogCover } from "../data/blogImages.ts";
import { UI } from "../data/ui.ts";
import blogCards from "../content/generated/blog-cards.json";

export interface ArticleProps {
  data: ContentData;
}

export const Article: React.FC<ArticleProps> = ({ data }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Read banner image from the same key as the Blogs list card
  const fallbackImg = poolImage(data.url, 0);
  const headerImg = getBlogCover(data.title, data.url, fallbackImg);

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

      {/* Block A — Hero Band (Article Variant: Same cover as blog list card) */}
      <HeroBand
        variant="article"
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

      {/* Reading Column: max-w 480px mobile / 600px desktop */}
      <div className="max-w-[480px] lg:max-w-[600px] mx-auto px-[var(--pad-x)] pt-10 pb-12">
        {/* Body Blocks */}
        <div className="space-y-6 text-[14px] lg:text-[15px] leading-[1.7] text-[#6B7280]">
          {data.blocks.map((block: ContentBlock, idx: number) => {
            if (block.type === "h2") {
              const id = (block.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
              return (
                <h2
                  key={idx}
                  id={id}
                  className="text-[22px] lg:text-[48px] font-bold text-[#0A0A0A] pt-6 leading-[1.15] tracking-[-0.02em] text-left"
                >
                  {block.title}
                </h2>
              );
            }
            if (block.type === "p") {
              return (
                <p key={idx} className="text-left text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[#6B7280]">
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
        <section className="py-12 lg:py-16 bg-white border-t border-[#E5E5E5]">
          <div className="max-w-[480px] lg:max-w-[600px] mx-auto px-[var(--pad-x)]">
            <h2 className="text-[22px] lg:text-[48px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] mb-6">
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} />
          </div>
        </section>
      )}

      {/* Next Band */}
      {nextArticle ? (
        <NextBand
          heading={`Next Article: ${nextArticle.title}`}
          nextUrl={nextArticle.url}
          nextTitle={nextArticle.title}
        />
      ) : (
        <NextBand
          heading="Explore All Articles"
          nextUrl="/blog/"
          nextTitle="All Articles"
        />
      )}
    </div>
  );
};
