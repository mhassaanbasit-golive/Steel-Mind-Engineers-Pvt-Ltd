import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import pageData from "../content/generated/page-67.json";
import blogCards from "../content/generated/blog-cards.json";
import { A } from "../data/assets.ts";
import { UI } from "../data/ui.ts";
import { Breadcrumb } from "../components/ui/Breadcrumb.tsx";
import { QuickAnswer } from "../components/ui/QuickAnswer.tsx";
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
    <div className="w-full">
      {/* 1. Header */}
      <section className="relative w-full h-[62svh] min-h-[420px] lg:h-[70vh] bg-[var(--ink)] overflow-hidden">
        <div className="absolute inset-0 w-full h-full" data-parallax="4">
          <img
            src={A.team}
            alt="Steel drawings, hard hat and tablet on an engineer's desk at Steel Mind."
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#0A0A0A]/35" />
        </div>

        <div className="absolute inset-x-0 bottom-0 max-w-[1340px] mx-auto px-[var(--pad-x)] pb-10 z-10">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Blogs" },
            ]}
            theme="white"
            className="mb-4"
          />
          <h1
            className="text-[28px] lg:text-[56px] font-bold text-white leading-[1.1] tracking-[-0.02em] max-w-[800px]"
            data-split=""
          >
            {pageData.h1}
          </h1>
        </div>
      </section>

      {/* 2. Quick Answer (Floating Trigger + Drawer) */}
      <QuickAnswer text={pageData.quickAnswer} h1={pageData.h1} related={pageData.related} />

      {/* 3. Sticky Category Chips & Search Bar */}
      <div className="sticky top-[var(--header-h)] z-40 bg-white border-b border-[var(--line)] py-3">
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
                  style={isSelected ? { backgroundImage: "var(--gradient-brand-horizontal)" } : undefined}
                  className={`px-4 py-2 text-[13px] font-medium whitespace-nowrap transition-all cursor-pointer rounded-none ${
                    isSelected
                      ? "text-white hover:brightness-110 active:brightness-90"
                      : "bg-[var(--offwhite)] text-[var(--ink)] hover:bg-[var(--line)]"
                  }`}
                >
                  {cat === "All" ? UI.all : cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="w-full md:w-[280px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={UI.searchArticles}
              className="w-full px-3 py-2 text-[15px] border border-[var(--line)] bg-[var(--offwhite)] focus:bg-white focus:border-[var(--blue)] focus:outline-none rounded-none"
            />
          </div>
        </div>
      </div>

      {/* 4. Article Grid */}
      <section className="py-16 max-w-[1340px] mx-auto px-[var(--pad-x)]">
        {filteredArticles.length === 0 ? (
          <div className="py-16 text-center text-[var(--grey)]">
            No articles found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                  <div className="p-6 space-y-3">
                    <span className="text-[12px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em]">
                      {art.category}
                    </span>
                    <h3 className={`font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors leading-[1.3] ${
                      isFirst ? "text-[22px] lg:text-[26px]" : "text-[18px] lg:text-[20px]"
                    }`}>
                      {art.title}
                    </h3>
                    <p className="text-[15px] text-[var(--grey)] leading-[1.6] line-clamp-3">
                      {art.summary}
                    </p>
                    <div className="pt-2 flex items-center text-[13px] font-semibold text-[var(--blue)]">
                      <span>{UI.readArticle}</span>
                      <svg className="w-4 h-4 ml-1 stroke-current transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
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

      {/* 5. FAQ */}
      {pageData.faq && pageData.faq.length > 0 && (
        <section className="py-16 bg-[var(--offwhite)] border-t border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <h2 className="text-[28px] lg:text-[38px] font-semibold text-[var(--ink)] mb-8" data-split="">
              Frequently Asked Questions
            </h2>
            <Accordion items={pageData.faq} />
          </div>
        </section>
      )}

      {/* 6. CTA Band */}
      <QuoteBand />
    </div>
  );
};
