import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import pageData from "../content/generated/page-67.json";
import blogCards from "../content/generated/blog-cards.json";
import { A } from "../data/assets.ts";
import { UI } from "../data/ui.ts";
import { HeroBand } from "../components/ui/HeroBand.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { QuoteBand } from "../components/ui/QuoteBand.tsx";
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
                  style={isSelected ? { background: "var(--blue-glossy)" } : undefined}
                  className={`px-3 py-1.5 text-[11px] lg:text-[12px] font-medium whitespace-nowrap transition-all cursor-pointer rounded-none ${
                    isSelected
                      ? "text-white shadow-sm"
                      : "bg-[var(--offwhite)] text-[var(--ink)] hover:bg-[var(--line)]"
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
              className="w-full px-3 py-1.5 text-[13px] border border-[var(--line)] bg-[var(--offwhite)] focus:bg-white focus:border-[var(--blue)] focus:outline-none rounded-none"
            />
          </div>
        </div>
      </div>

      {/* Article Grid */}
      <section className="py-12 lg:py-16 max-w-[1340px] mx-auto px-[var(--pad-x)]">
        {filteredArticles.length === 0 ? (
          <div className="py-16 text-center text-[13px] text-[var(--grey)]">
            No articles found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredArticles.map((art, idx) => {
              const isFirst = idx === 0 && selectedCategory === "All" && !searchQuery;
              const imgUrl = poolImage(art.url, idx);

              return (
                <Link
                  key={art.number}
                  to={art.url}
                  className={`group block bg-white border border-[var(--line)] overflow-hidden transition-colors hover:border-[var(--blue)] ${
                    isFirst ? "md:col-span-2 lg:col-span-2" : ""
                  }`}
                  data-reveal=""
                >
                  <div className={`${isFirst ? "aspect-[16/9]" : "aspect-[4/3]"} w-full overflow-hidden bg-neutral-100`}>
                    <img
                      src={imgUrl}
                      alt={art.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
                      {art.category}
                    </span>
                    <h3 className={`font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors leading-[1.25] ${
                      isFirst ? "text-[18px] lg:text-[22px]" : "text-[15px] lg:text-[18px]"
                    }`}>
                      {art.title}
                    </h3>
                    <p className="text-[13px] lg:text-[14px] text-[var(--grey)] leading-[1.6] line-clamp-3">
                      {art.summary}
                    </p>
                    <div className="pt-2 flex items-center text-[12px] font-semibold text-[var(--blue)]">
                      <span>{UI.readArticle}</span>
                      <svg className="w-3.5 h-3.5 ml-1 stroke-current transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* FAQ */}
      {pageData.faq && pageData.faq.length > 0 && (
        <section className="py-12 lg:py-16 bg-[var(--offwhite)] border-t border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <h2 className="text-[18px] lg:text-[28px] font-semibold leading-[1.2] text-[var(--ink)] mb-6" data-split="">
              Frequently Asked Questions
            </h2>
            <Accordion items={pageData.faq} />
          </div>
        </section>
      )}

      {/* CTA Band */}
      <QuoteBand />
    </div>
  );
};
