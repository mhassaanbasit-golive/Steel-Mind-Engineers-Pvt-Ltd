// Industrial Sheds Division Signature Layouts (9.8 - 9.12)
import React, { useState, useEffect, useRef } from "react";
import { ContentData, ContentBlock } from "../../../content/types.ts";
import { IMG } from "../../../data/subpageImages.ts";
import { PhotoBox } from "../../page/PhotoBox.tsx";
import { OutlineNum } from "../../page/OutlineNum.tsx";
import { SplitIntro } from "../../page/SplitIntro.tsx";
import { HeroBand } from "../../ui/HeroBand.tsx";
import { Accordion } from "../../ui/Accordion.tsx";
import { NextBand } from "../../ui/NextBand.tsx";
import { TransitionLink } from "../../ui/TransitionLink.tsx";
import { gsap } from "../../../lib/gsap.ts";
import { Reveal } from "../../../lib/motion.ts";

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

// 9.8 Factory Sheds — signature: "Stacking cards"
export const FactoryShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const images = [IMG.industrial.factory.f1, IMG.industrial.factory.f2, IMG.industrial.factory.f3, IMG.industrial.factory.f4];

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
        imageSrc={IMG.industrial.factory.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        {/* Desktop: Stacking Cards */}
        <div className="hidden lg:block space-y-12">
          {cards.map((c, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div
                key={c.num}
                className="sticky bg-white border border-[var(--rule)] overflow-hidden transition-all duration-300"
                style={{
                  top: `calc(var(--nav-offset, 80px) + 24px + ${idx * 20}px)`,
                  minHeight: "min(calc(100svh - var(--nav-h, 80px) - 96px), 620px)",
                }}
              >
                <div className="grid grid-cols-12 items-stretch h-full min-h-[520px]">
                  <div className={`col-span-6 overflow-hidden ${isEven ? "order-2" : "order-1"}`}>
                    <img
                      src={c.img}
                      alt={c.title}
                      className="w-full h-full object-cover min-h-[520px]"
                    />
                  </div>
                  <div className={`col-span-6 p-14 flex flex-col justify-center text-left ${isEven ? "order-1" : "order-2"}`}>
                    <OutlineNum num={c.num} />
                    <h3 className="text-[28px] lg:text-[32px] font-bold text-[var(--ink)] mt-4 mb-4 tracking-[-0.01em]">
                      {c.title}
                    </h3>
                    <p className="text-[var(--grey-strong)] leading-[1.7] max-w-[480px]" style={{ fontSize: "var(--fs-body)" }}>
                      {c.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: Clean Stacked Cards */}
        <div className="lg:hidden space-y-8">
          {cards.map((c) => (
            <div key={c.num} className="border border-[var(--rule)] p-6 text-left bg-white">
              <PhotoBox src={c.img} alt={c.title} ratio="16/9" className="mb-5" />
              <OutlineNum num={c.num} />
              <h3 className="text-[20px] font-bold text-[var(--ink)] mt-2 mb-3">
                {c.title}
              </h3>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
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

      {/* Next Banner with Image */}
      <NextBand
        image={IMG.industrial.factory.next}
        nextUrl="/industrial-sheds-pakistan/dairy-farm-sheds/"
        nextTitle="Dairy Farm Sheds"
      />
    </article>
  );
};

// 9.9 Dairy Farm Sheds — signature: "Wide bands with text card"
export const DairyShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const images = [IMG.industrial.dairy.d1, IMG.industrial.dairy.d2, IMG.industrial.dairy.d3, IMG.industrial.dairy.d4];

  const bands = sections.slice(0, 4).map((sec, idx) => ({
    num: String(idx + 1).padStart(2, "0"),
    title: sec.title,
    text: sec.text,
    img: images[idx] || images[0],
  }));

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.industrial.dairy.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="w-full space-y-6 my-[var(--sec-y)]">
        {bands.map((b, idx) => {
          const isEven = idx % 2 === 1;
          return (
            <div
              key={b.num}
              className="relative w-full overflow-hidden bg-slate-900"
              style={{ minHeight: "clamp(440px, 46vw, 640px)" }}
            >
              <img
                src={b.img}
                alt={b.title}
                className="w-full h-full object-cover object-center absolute inset-0"
              />
              <div className="absolute inset-0 bg-black/25 pointer-events-none" />

              {/* Desktop Floating White Text Card */}
              <div
                className={`hidden md:block absolute bottom-12 p-10 bg-white border border-[var(--rule)] text-left w-[520px] shadow-lg z-10 ${
                  isEven
                    ? "right-[max(32px,calc((100vw-var(--container))/2+32px))]"
                    : "left-[max(32px,calc((100vw-var(--container))/2+32px))]"
                }`}
              >
                <span className="text-[12px] font-mono font-bold text-[var(--blue)] block mb-2">
                  {b.num} / 04
                </span>
                <h3 className="text-[26px] lg:text-[28px] font-bold text-[var(--ink)] mb-3">
                  {b.title}
                </h3>
                <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                  {b.text}
                </p>
              </div>

              {/* Mobile Text Box Below Full Photo */}
              <div className="md:hidden relative z-10 mt-[260px] p-6 bg-white text-left border-t border-[var(--rule)]">
                <span className="text-[12px] font-mono font-bold text-[var(--blue)] block mb-1">
                  {b.num} / 04
                </span>
                <h3 className="text-[20px] font-bold text-[var(--ink)] mb-2">
                  {b.title}
                </h3>
                <p className="text-[var(--grey-strong)] text-[14px] leading-[1.65]">
                  {b.text}
                </p>
              </div>
            </div>
          );
        })}
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
        image={IMG.industrial.dairy.next}
        nextUrl="/industrial-sheds-pakistan/poultry-sheds/"
        nextTitle="Poultry Sheds"
      />
    </article>
  );
};

// 9.10 Poultry Sheds — signature: "Staggered portrait strip"
export const PoultryShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const images = [IMG.industrial.poultry.p1, IMG.industrial.poultry.p2, IMG.industrial.poultry.p3];

  const columns = sections.slice(0, 3).map((sec, idx) => ({
    num: String(idx + 1).padStart(2, "0"),
    title: sec.title,
    text: sec.text,
    img: images[idx] || images[0],
    offset: idx === 1 ? "lg:mt-24" : idx === 2 ? "lg:mt-12" : "mt-0",
  }));

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.industrial.poultry.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        {/* Desktop: 3 Staggered Columns */}
        <div className="hidden lg:grid grid-cols-3 gap-10 items-start pb-16">
          {columns.map((c) => (
            <div key={c.num} className={`text-left space-y-4 ${c.offset}`}>
              <PhotoBox src={c.img} alt={c.title} ratio="4/5" className="mb-4" />
              <OutlineNum num={c.num} />
              <h3 className="text-[24px] lg:text-[28px] font-bold text-[var(--ink)] mt-2">
                {c.title}
              </h3>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {c.text}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile: Horizontal Scroll-Snap Strip */}
        <div
          data-lenis-prevent=""
          className="lg:hidden flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 scrollbar-none"
        >
          {columns.map((c) => (
            <div
              key={c.num}
              className="flex-shrink-0 w-[82vw] snap-center border border-[var(--rule)] p-5 text-left bg-white"
            >
              <PhotoBox src={c.img} alt={c.title} ratio="16/9" className="mb-4" />
              <OutlineNum num={c.num} />
              <h3 className="text-[18px] font-bold text-[var(--ink)] mt-2 mb-2">{c.title}</h3>
              <p className="text-[var(--grey-strong)] text-[14px] leading-[1.6]">{c.text}</p>
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
        image={IMG.industrial.poultry.next}
        nextUrl="/industrial-sheds-pakistan/workshop-sheds/"
        nextTitle="Workshop Sheds"
      />
    </article>
  );
};

// 9.11 Workshop Sheds — signature: "Hover image list"
export const WorkshopShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const images = [IMG.industrial.workshop.w1, IMG.industrial.workshop.w2, IMG.industrial.workshop.w3];

  const rows = sections.slice(0, 3).map((sec, idx) => ({
    num: String(idx + 1).padStart(2, "0"),
    title: sec.title,
    text: sec.text,
    img: images[idx] || images[0],
  }));

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <article className="w-full bg-white" onMouseMove={handleMouseMove}>
      <HeroBand
        variant="immersive"
        imageSrc={IMG.industrial.workshop.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)] relative">
        {/* Floating preview image following cursor on desktop fine pointer */}
        {hoveredIdx !== null && (
          <div
            className="hidden lg:block fixed pointer-events-none z-30 overflow-hidden shadow-2xl border-2 border-white transition-opacity duration-300"
            style={{
              width: "360px",
              aspectRatio: "4/3",
              left: `${cursorPos.x + 24}px`,
              top: `${cursorPos.y - 140}px`,
            }}
          >
            <img
              src={rows[hoveredIdx].img}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Desktop List */}
        <div className="hidden lg:block divide-y divide-[var(--rule)] border-t border-b border-[var(--rule)]">
          {rows.map((r, idx) => {
            const isHovered = hoveredIdx === idx;
            const isOtherHovered = hoveredIdx !== null && !isHovered;
            return (
              <div
                key={r.num}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`py-14 grid grid-cols-12 gap-8 items-start text-left transition-all duration-400 cursor-pointer ${
                  isOtherHovered ? "opacity-40" : "opacity-100"
                }`}
              >
                <div className="col-span-1">
                  <OutlineNum num={r.num} active={isHovered} />
                </div>
                <div className="col-span-5">
                  <h3
                    className={`font-bold transition-transform duration-300 ${
                      isHovered ? "translate-x-4 text-[var(--blue)]" : "text-[var(--ink)]"
                    }`}
                    style={{ fontSize: "var(--fs-h2)" }}
                  >
                    {r.title}
                  </h3>
                </div>
                <div className="col-span-6">
                  <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
                    {r.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile List with Inlined Photos */}
        <div className="lg:hidden space-y-10 text-left">
          {rows.map((r) => (
            <div key={r.num} className="border-t border-[var(--rule)] pt-6 space-y-4">
              <PhotoBox src={r.img} alt={r.title} ratio="16/9" />
              <OutlineNum num={r.num} />
              <h3 className="text-[22px] font-bold text-[var(--ink)]">{r.title}</h3>
              <p className="text-[var(--grey-strong)] text-[14px] leading-[1.65]">{r.text}</p>
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
        image={IMG.industrial.workshop.next}
        nextUrl="/industrial-sheds-pakistan/crane-sheds/"
        nextTitle="Crane Sheds"
      />
    </article>
  );
};

// 9.12 Crane Sheds — signature: "Runway band + link cards"
export const CraneShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.industrial.craneSheds.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* 1. Intro */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <SplitIntro
          title={sections[0]?.title || "What a Crane Shed Is"}
          lead={introPs[0]}
          text={sections[0]?.text || introPs.slice(1)}
        />
      </section>

      {/* 2. Runway Band (21/9 full width with trolley visual indicator) */}
      <section className="relative w-full overflow-hidden bg-slate-900 aspect-[21/9] min-h-[320px]">
        <img
          src={IMG.industrial.craneSheds.wide}
          alt="Crane Shed Runway Structure"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        {/* Rail track decor with trolley */}
        <div className="container absolute bottom-6 inset-x-0 z-10 pointer-events-none">
          <div className="relative w-full h-[2px] bg-white/40">
            <div className="absolute top-1/2 -translate-y-1/2 left-[35%] w-3.5 h-3.5 bg-[var(--blue)] shadow-md" />
          </div>
        </div>
      </section>

      {/* 3. Raiwind Band: Full-width Royal Blue band */}
      <section className="w-full bg-[var(--blue)] text-white py-[var(--sec-y-lg)]">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-10 items-center text-left">
          <div className="lg:col-span-5">
            <h2 className="text-[26px] lg:text-[36px] font-bold uppercase tracking-[-0.01em] text-white">
              {sections[1]?.title || "The Raiwind Crane Sheds"}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-white/90 text-[16px] lg:text-[18px] leading-[1.7] max-w-[640px]">
              {sections[1]?.text}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Design Points: 2 columns */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <h3 className="font-bold text-[var(--ink)] sticky top-[calc(var(--nav-offset,80px)+24px)]" style={{ fontSize: "var(--fs-h2)" }}>
              {sections[2]?.title || "Design Points for Crane Sheds"}
            </h3>
          </div>
          <div className="lg:col-span-8">
            <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-lead)" }}>
              {sections[2]?.text}
            </p>
          </div>
        </div>
      </section>

      {/* 5. Learn More: 2 Link Cards */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <h3 className="font-bold text-[var(--ink)] mb-6 text-[22px]">
          {sections[3]?.title || "Learn More"}
        </h3>
        {sections[3]?.text && (
          <p className="text-[var(--grey-strong)] mb-8 max-w-[640px]">
            {sections[3]?.text}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <TransitionLink
            to="/pre-engineered-buildings-pakistan/crane-system/"
            className="group block p-8 border border-[var(--rule)] bg-white hover:bg-[var(--blue)] transition-colors duration-400 min-h-[160px] flex flex-col justify-between"
          >
            <span className="font-bold text-[18px] lg:text-[22px] text-[var(--ink)] group-hover:text-white transition-colors">
              Crane Systems in PEB
            </span>
            <span className="text-[14px] font-semibold text-[var(--blue)] group-hover:text-white flex items-center gap-2 mt-4">
              <span>View Crane Specifications</span>
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </span>
          </TransitionLink>

          <TransitionLink
            to="/structural-steel-fabrication-pakistan/crane-gantry-structures/"
            className="group block p-8 border border-[var(--rule)] bg-white hover:bg-[var(--blue)] transition-colors duration-400 min-h-[160px] flex flex-col justify-between"
          >
            <span className="font-bold text-[18px] lg:text-[22px] text-[var(--ink)] group-hover:text-white transition-colors">
              Crane Gantry Structures
            </span>
            <span className="text-[14px] font-semibold text-[var(--blue)] group-hover:text-white flex items-center gap-2 mt-4">
              <span>View Gantry Fabrications</span>
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </span>
          </TransitionLink>
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
        image={IMG.industrial.craneSheds.next}
        nextUrl="/steel-warehouses-pakistan/storage-warehouses/"
        nextTitle="Storage Warehouses"
      />
    </article>
  );
};
