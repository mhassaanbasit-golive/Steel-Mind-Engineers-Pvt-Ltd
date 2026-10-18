// Steel Warehouses Division Signature Layouts (9.13 - 9.17)
import React, { useState, useEffect } from "react";
import { ContentData, ContentBlock } from "../../../content/types.ts";
import { IMG } from "../../../data/subpageImages.ts";
import { PhotoBox } from "../../page/PhotoBox.tsx";
import { OutlineNum } from "../../page/OutlineNum.tsx";
import { HeroBand } from "../../ui/HeroBand.tsx";
import { Accordion } from "../../ui/Accordion.tsx";
import { NextBand } from "../../ui/NextBand.tsx";
import { ChevronRight, ArrowDown } from "lucide-react";

function extractSections(data: ContentData) {
  const sections: { title: string; text: string; paragraphs: string[]; items?: { name: string; text: string }[] }[] = [];
  let current: { title: string; text: string; paragraphs: string[]; items?: { name: string; text: string }[] } | null = null;
  const introPs: string[] = [];

  data.blocks.forEach((b: ContentBlock) => {
    if (b.type === "h2") {
      if (current) sections.push(current);
      current = { title: b.title || "", text: "", paragraphs: [] };
    } else if (b.type === "p" && b.text) {
      if (current) {
        current.paragraphs.push(b.text);
        current.text = current.text ? `${current.text} ${b.text}` : b.text;
      } else {
        introPs.push(b.text);
      }
    } else if ((b.type === "defs" || b.type === "steps") && b.items) {
      if (current) current.items = b.items;
    }
  });
  if (current) sections.push(current);

  return { introPs, sections };
}

// 9.13 Storage Warehouses — signature: "Floating image collage"
export const StorageWarehousesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const blocks = sections.slice(0, 3);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.warehouses.storage.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        {/* Desktop: 2 Columns (Left: 3 Text Blocks, Right: Floating Collage) */}
        <div className="hidden lg:grid grid-cols-12 gap-24 items-center">
          <div className="col-span-6 space-y-12 text-left">
            {blocks.map((b, idx) => (
              <div key={idx} className="pt-8 border-t border-[var(--rule)] space-y-3">
                <span className="text-[12px] font-mono text-[var(--blue)] font-bold block">
                  0{idx + 1} / 03
                </span>
                <h3 className="text-[28px] font-bold text-[var(--ink)] tracking-[-0.01em]">
                  {b.title}
                </h3>
                <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
                  {b.text}
                </p>
              </div>
            ))}
          </div>

          <div className="col-span-6 relative min-h-[580px]">
            <div className="w-[82%] ml-auto aspect-[4/3] overflow-hidden shadow-lg border border-[var(--rule)]">
              <img
                src={IMG.warehouses.storage.s1}
                alt="Storage Warehouse Aerial View"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-[38%] left-0 w-[64%] aspect-[4/3] overflow-hidden shadow-2xl border-[12px] border-white">
              <img
                src={IMG.warehouses.storage.s2}
                alt="Storage Warehouse Pallet Racks"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Mobile: Interleaved Blocks with Photos */}
        <div className="lg:hidden space-y-12 text-left">
          {blocks.map((b, idx) => (
            <div key={idx} className="border-t border-[var(--rule)] pt-6 space-y-4">
              <span className="text-[12px] font-mono text-[var(--blue)] font-bold">
                0{idx + 1} / 03
              </span>
              <h3 className="text-[22px] font-bold text-[var(--ink)]">{b.title}</h3>
              <p className="text-[var(--grey-strong)] text-[14px] leading-[1.65]">{b.text}</p>
              {idx === 0 && <PhotoBox src={IMG.warehouses.storage.s1} alt={b.title} ratio="16/9" />}
              {idx === 1 && <PhotoBox src={IMG.warehouses.storage.s2} alt={b.title} ratio="16/9" />}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="font-bold text-[var(--ink)] mb-8" style={{ fontSize: "var(--fs-h2)" }}>
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* Next Banner */}
      <NextBand
        image={IMG.warehouses.storage.next}
        nextUrl="/steel-warehouses-pakistan/logistics-warehouses/"
        nextTitle="Logistics Warehouses"
      />
    </article>
  );
};

// 9.14 Logistics Warehouses — signature: "Dock lane"
export const LogisticsWarehousesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const images = [IMG.warehouses.logistics.l1, IMG.warehouses.logistics.l2, IMG.warehouses.logistics.l3];

  const cards = sections.slice(0, 3).map((sec, idx) => ({
    num: String(idx + 1).padStart(2, "0"),
    title: sec.title,
    text: sec.text,
    img: images[idx] || images[0],
  }));

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.warehouses.logistics.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        {/* Desktop: Horizontal Dock Lane Line */}
        <div className="hidden lg:block relative mb-12">
          <div className="w-full h-[2px] bg-[var(--rule)]" />
          <div className="absolute top-0 left-0 h-[2px] bg-[var(--blue)] w-full origin-left" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
          {cards.map((c) => (
            <div key={c.num} className="space-y-4">
              <div className="relative">
                <div className="hidden lg:block w-3.5 h-3.5 rounded-full bg-[var(--blue)] -mt-[23px] mb-6 shadow-sm" />
                <PhotoBox src={c.img} alt={c.title} ratio="3/2" className="mb-4" />
              </div>
              <OutlineNum num={c.num} />
              <h3 className="text-[24px] font-bold text-[var(--ink)] mt-2">{c.title}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="font-bold text-[var(--ink)] mb-8" style={{ fontSize: "var(--fs-h2)" }}>
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* Next Banner */}
      <NextBand
        image={IMG.warehouses.logistics.next}
        nextUrl="/steel-warehouses-pakistan/cold-storage-warehouses/"
        nextTitle="Cold Storage Warehouses"
      />
    </article>
  );
};

// 9.15 Cold Storage — signature: "Cold-chain flow"
export const ColdStorageLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const images = [IMG.warehouses.coldStorage.c1, IMG.warehouses.coldStorage.c2, IMG.warehouses.coldStorage.c3, IMG.warehouses.coldStorage.c4];

  const cards = sections.slice(0, 4).map((sec, idx) => ({
    num: String(idx + 1).padStart(2, "0"),
    title: sec.title,
    text: sec.text,
    img: images[idx] || images[0],
  }));

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.warehouses.coldStorage.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        {/* Desktop 4 columns with connecting chevrons */}
        <div className="hidden xl:grid grid-cols-4 gap-6 items-start text-left relative">
          {cards.map((c, idx) => (
            <div key={c.num} className="relative space-y-4">
              <PhotoBox src={c.img} alt={c.title} ratio="4/5" className="mb-4" />
              <OutlineNum num={c.num} />
              <h3 className="text-[20px] font-bold text-[var(--ink)] leading-[1.25]">{c.title}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.65] text-[15px]">{c.text}</p>

              {idx < 3 && (
                <div className="absolute top-[35%] -right-5 z-10 w-8 h-8 rounded-full bg-white border border-[var(--blue)] text-[var(--blue)] flex items-center justify-center shadow-md">
                  <ChevronRight size={16} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tablet: 2x2 grid */}
        <div className="hidden sm:grid xl:hidden grid-cols-2 gap-10 text-left">
          {cards.map((c) => (
            <div key={c.num} className="space-y-4">
              <PhotoBox src={c.img} alt={c.title} ratio="4/5" className="mb-4" />
              <OutlineNum num={c.num} />
              <h3 className="text-[22px] font-bold text-[var(--ink)]">{c.title}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>{c.text}</p>
            </div>
          ))}
        </div>

        {/* Mobile: Stacked with down arrows */}
        <div className="sm:hidden space-y-8 text-left">
          {cards.map((c, idx) => (
            <div key={c.num} className="space-y-4">
              <PhotoBox src={c.img} alt={c.title} ratio="16/9" />
              <OutlineNum num={c.num} />
              <h3 className="text-[20px] font-bold text-[var(--ink)]">{c.title}</h3>
              <p className="text-[var(--grey-strong)] text-[14px] leading-[1.65]">{c.text}</p>
              {idx < 3 && (
                <div className="flex justify-center py-2">
                  <div className="w-8 h-8 rounded-full border border-[var(--rule)] flex items-center justify-center text-[var(--grey)]">
                    <ArrowDown size={16} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="font-bold text-[var(--ink)] mb-8" style={{ fontSize: "var(--fs-h2)" }}>
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* Next Banner */}
      <NextBand
        image={IMG.warehouses.coldStorage.next}
        nextUrl="/steel-warehouses-pakistan/grain-and-wheat-warehouses/"
        nextTitle="Grain and Wheat Warehouses"
      />
    </article>
  );
};

// 9.16 Grain and Wheat Warehouses — signature: "Story slideshow"
export const GrainWarehousesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const images = [IMG.warehouses.grain.g1, IMG.warehouses.grain.g2, IMG.warehouses.grain.g3];
  const slides = sections.slice(0, 3).map((sec, idx) => ({
    num: String(idx + 1).padStart(2, "0"),
    title: sec.title,
    text: sec.text,
    img: images[idx] || images[0],
  }));

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.warehouses.grain.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        {/* Slideshow Frame */}
        <div className="relative w-full max-w-[1040px] mx-auto aspect-[16/10] overflow-hidden bg-slate-950 shadow-xl">
          {slides.map((s, idx) => (
            <img
              key={s.num}
              src={s.img}
              alt={s.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                activeIdx === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            />
          ))}

          {/* Top Progress Bars */}
          <div className="absolute top-4 inset-x-6 z-20 flex gap-2">
            {slides.map((_, idx) => (
              <div key={idx} className="h-1 flex-1 bg-white/40 overflow-hidden rounded-full">
                <div
                  className={`h-full bg-white transition-all duration-300 ${
                    idx < activeIdx ? "w-full" : idx === activeIdx ? "w-full animate-pulse" : "w-0"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Captions below frame */}
        <div className="max-w-[1040px] mx-auto mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-left items-start">
          <div className="md:col-span-4">
            <span className="text-[12px] font-mono text-[var(--blue)] font-bold block mb-1">
              0{activeIdx + 1} / 03
            </span>
            <h3 className="text-[24px] lg:text-[28px] font-bold text-[var(--ink)]">
              {slides[activeIdx]?.title}
            </h3>
          </div>
          <div className="md:col-span-8">
            <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
              {slides[activeIdx]?.text}
            </p>
          </div>
        </div>

        {/* Slide Selector Buttons */}
        <div className="max-w-[1040px] mx-auto mt-8 flex flex-wrap gap-3">
          {slides.map((s, idx) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.06em] border transition-colors cursor-pointer ${
                activeIdx === idx
                  ? "bg-[var(--blue)] text-white border-[var(--blue)]"
                  : "bg-white text-[var(--ink)] border-[var(--rule)] hover:border-[var(--blue)]"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="font-bold text-[var(--ink)] mb-8" style={{ fontSize: "var(--fs-h2)" }}>
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* Next Banner */}
      <NextBand
        image={IMG.warehouses.grain.next}
        nextUrl="/steel-warehouses-pakistan/warehouses-with-loading-docks/"
        nextTitle="Warehouses with Loading Docks"
      />
    </article>
  );
};

// 9.17 Warehouses with Loading Docks — signature: "Tabs"
export const LoadingDocksLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const images = [IMG.warehouses.loadingDocks.d1, IMG.warehouses.loadingDocks.d2, IMG.warehouses.loadingDocks.d3];

  const tabs = sections.slice(0, 3).map((sec, idx) => ({
    title: sec.title,
    text: sec.text,
    img: images[idx] || images[0],
  }));

  const [activeTab, setActiveTab] = useState(0);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.warehouses.loadingDocks.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        {/* Tab List */}
        <div className="flex border-b border-[var(--rule)] gap-8 overflow-x-auto scrollbar-none mb-12">
          {tabs.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`pb-4 text-[16px] lg:text-[18px] font-bold whitespace-nowrap transition-colors relative cursor-pointer ${
                activeTab === idx ? "text-[var(--blue)]" : "text-[var(--grey)] hover:text-[var(--ink)]"
              }`}
            >
              {t.title}
              {activeTab === idx && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--blue)]" />
              )}
            </button>
          ))}
        </div>

        {/* Active Tab Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          <div className="lg:col-span-6">
            <PhotoBox
              src={tabs[activeTab]?.img || ""}
              alt={tabs[activeTab]?.title || ""}
              ratio="4/3"
            />
          </div>
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-[26px] lg:text-[32px] font-bold text-[var(--ink)]">
              {tabs[activeTab]?.title}
            </h3>
            <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>
              {tabs[activeTab]?.text}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="font-bold text-[var(--ink)] mb-8" style={{ fontSize: "var(--fs-h2)" }}>
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* Next Banner */}
      <NextBand
        image={IMG.warehouses.loadingDocks.next}
        nextUrl="/structural-steel-fabrication-pakistan/columns-and-beams/"
        nextTitle="Columns and Beams"
      />
    </article>
  );
};
