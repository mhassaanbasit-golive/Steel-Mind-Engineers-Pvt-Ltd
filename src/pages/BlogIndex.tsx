import React, { useState, useMemo } from "react";
import { Link } from "../components/ui/TransitionLink.tsx";
import pageData from "../content/generated/page-67.json";
import blogCards from "../content/generated/blog-cards.json";
import { A } from "../data/assets.ts";
import { UI } from "../data/ui.ts";
import { HeroBand } from "../components/ui/HeroBand.tsx";
import { Card } from "../components/ui/Card.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { NextBand } from "../components/ui/NextBand.tsx";
import { poolImage } from "../data/pool.ts";

const CATEGORIES = [
  "All",
  "Pre-Engineered Building Basics",
  "Industrial Sheds",
  "Steel Warehouses",
  "Fabrication",
  "Quality, Safety and Care",
  "Buying Guide",
];

export const BlogIndex: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    return blogCards.filter((art) => {
      const matchCat =
        selectedCategory === "All" || art.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.keyword.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="w-full bg-white">
      {/* Block A — Hero Band (Image) */}
      <HeroBand
        variant="image"
        imageSrc={A.team}
        imageAlt="Steel drawings, hard hat and tablet on an engineer's desk at Steel Mind Engineers."
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Blogs" },
        ]}
        h1={pageData.h1}
        subtitle={pageData.quickAnswer}
      />

      {/* Category Chips & Search Bar */}
      <div className="bg-white border-b border-[var(--line)] py-3 sticky top-[var(--header-h)] z-40">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-1">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={isSelected ? { backgroundColor: "var(--blue)" } : undefined}
                  className={`px-3 py-1.5 text-[9px] uppercase tracking-[0.08em] font-semibold whitespace-nowrap transition-all cursor-pointer rounded-none ${
                    isSelected
                      ? "bg-[var(--blue)] text-white"
                      : "bg-white border border-[var(--line)] text-[var(--ink)] hover:border-[var(--blue)]"
                  }`}
                >
                  {cat === "All" ? UI.all : cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="w-full md:w-[260px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={UI.searchArticles}
              className="w-full px-3 py-1.5 text-[12px] lg:text-[13px] border border-[var(--line)] bg-white focus:border-[var(--blue)] focus:outline-none rounded-none"
            />
          </div>
        </div>
      </div>

      {/* Article Grid */}
      <section className="py-12 lg:py-16 max-w-[1340px] mx-auto px-[var(--pad-x)] bg-white">
        {filteredArticles.length === 0 ? (
          <div className="py-16 text-center text-[12px] lg:text-[13px] text-[var(--grey)]">
            No articles found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art, idx) => {
              const imgUrl = poolImage(art.url, idx);

              return (
                <Card
                  key={art.number}
                  href={art.url}
                  imageSrc={imgUrl}
                  imageAlt={art.title}
                  imageRatio="4/3"
                  title={art.title}
                  description={art.summary}
                  linkText={UI.readArticle}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* FAQ */}
      {pageData.faq && pageData.faq.length > 0 && (
        <section className="py-12 lg:py-16 bg-white border-t border-[#E5E5E5]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <h2 className="text-[22px] lg:text-[48px] font-bold leading-[1.15] tracking-[-0.02em] text-[#0A0A0A] mb-6">
              Frequently Asked Questions
            </h2>
            <Accordion items={pageData.faq} />
          </div>
        </section>
      )}

      {/* Next Band */}
      <NextBand
        heading="Discuss Your Project With Our Engineers"
        nextUrl="/contact-us/"
        nextTitle="Contact Us"
      />
    </div>
  );
};
