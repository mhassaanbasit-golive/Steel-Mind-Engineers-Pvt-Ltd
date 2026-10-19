// PEB Division Signature Layouts (Portion 2: 2.1 - 2.6)
import React, { useState, useEffect, useRef } from "react";
import { ContentData, ContentBlock } from "../../../content/types.ts";
import { HeroBand } from "../../ui/HeroBand.tsx";
import { Accordion } from "../../ui/Accordion.tsx";
import { NextBand } from "../../ui/NextBand.tsx";
import { Steps } from "../../ui/Steps.tsx";
import { FrameDiagram } from "../../diagrams/FrameDiagram.tsx";
import { CraneDiagram } from "../../diagrams/CraneDiagram.tsx";
import { Pic } from "../../Pic.tsx";
import { TwoTone } from "../../page/TwoTone.tsx";
import { StageSwap } from "../../page/StageSwap.tsx";
import { StackCards } from "../../page/StackCards.tsx";
import { ImageAccordion } from "../../page/ImageAccordion.tsx";
import { lenis } from "../../../lib/lenis.ts";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

// 9.1 Engineering Department — kept per 1.2
export const EngineeringLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const stepsBlock = sections.find((s) => s.items && s.items.length >= 6) || sections[1];
  const steps = stepsBlock?.items || [
    { name: "Requirement study", text: "Analyzing building purpose, dimensions and special loads." },
    { name: "Load calculation", text: "Computing dead, live, wind, and seismic loads to building codes." },
    { name: "Frame design", text: "Optimizing steel portal frame sections for strength and economy." },
    { name: "3D model", text: "Creating a complete virtual structural model for verification." },
    { name: "Detailing", text: "Producing shop fabrication and field erection drawings." },
    { name: "Internal check", text: "Multi-engineer review before steel fabrication begins." },
  ];

  const ledgerBlocks = sections.filter((s) => s !== stepsBlock && s !== sections[0]).slice(0, 3);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792007694/Engineering-hero.jpg"
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)] text-left">
        <h2 className="text-[28px] lg:text-[44px] font-[500] leading-[1.1] tracking-[-0.025em] mb-4">
          <TwoTone text={sections[0]?.title || "What the Engineering Department Does"} />
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-[rgba(15,23,42,0.12)]">
          <div className="lg:col-span-5 text-[17px] lg:text-[20px] font-medium text-[var(--ink)] leading-[1.6]">
            {introPs[0]}
          </div>
          <div className="lg:col-span-7 text-[15px] lg:text-[17px] text-[#1E3A8A] leading-[1.65]">
            {sections[0]?.text || introPs.slice(1).join(" ")}
          </div>
        </div>
      </section>

      <section className="container pb-[var(--sec-y-lg)]">
        <Steps title={stepsBlock?.title || "The Design Process"} items={steps} />
      </section>

      <section className="container pb-[var(--sec-y-lg)]">
        <Pic
          src="https://res.cloudinary.com/cyfb9slf/image/upload/v1792007695/peb-engineering-wide.jpg"
          alt="PEB Engineering Wide View"
          ratio={16 / 9}
        />
      </section>

      {ledgerBlocks.length > 0 && (
        <section className="container pb-[var(--sec-y-lg)] border-b border-[rgba(15,23,42,0.12)] text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[rgba(15,23,42,0.12)]">
            {ledgerBlocks.map((blk, idx) => (
              <div key={idx} className="py-6 md:py-0 md:px-8 first:pl-0 last:pr-0 space-y-3">
                <h3 className="font-[600] text-[20px] lg:text-[24px] text-[var(--ink)]">
                  {blk.title}
                </h3>
                <p className="text-[#1E3A8A] text-[15px] lg:text-[17px] leading-[1.65]">
                  {blk.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[22px] lg:text-[36px] font-[600] text-[var(--ink)] mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033592/Primary-framing-hero.jpg"
        nextUrl="/pre-engineered-buildings-pakistan/primary-framing-system/"
        nextTitle="Primary Framing System"
      />
    </article>
  );
};

// 9.2 Primary Framing System (Portion 2.2) — numerals removed completely
export const PrimaryFramingLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const typesSec = sections.find((s) => s.items && s.items.length >= 10) || sections[2];
  const types = (typesSec?.items || []).map((it) => ({
    name: it.name,
    desc: it.text,
  }));

  const [activeIdx, setActiveIdx] = useState(0);
  const activeType = types[activeIdx] || { name: "Clear Span (CS)", desc: "One rafter spans the full width with no inner columns." };
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033592/Primary-framing-hero.jpg"
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)] text-center max-w-[840px] mx-auto">
        <h2 className="text-[24px] lg:text-[38px] font-[500] text-[var(--ink)] mb-4 tracking-[-0.025em]">
          <TwoTone text={sections[0]?.title || "What the Primary Frame Is"} />
        </h2>
        <p className="text-[15px] lg:text-[17px] text-[#1E3A8A] leading-[1.65]">
          {sections[0]?.text || introPs[0]}
        </p>
      </section>

      {/* Catalogue viewer without numbers */}
      <section className="container pb-[var(--sec-y-lg)]">
        {/* Mobile sticky chip bar (names only, no numerals) */}
        <div
          data-lenis-prevent=""
          className="lg:hidden sticky z-30 bg-white py-3 -mx-4 px-4 overflow-x-auto flex gap-2 border-b border-[rgba(15,23,42,0.12)]"
          style={{ top: "var(--nav-offset, 60px)", scrollSnapType: "x proximity" }}
        >
          {types.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`px-3.5 py-2 whitespace-nowrap rounded-none border text-[13px] font-semibold transition-colors cursor-pointer ${
                activeIdx === idx
                  ? "bg-[var(--blue)] text-white border-[var(--blue)]"
                  : "bg-white text-[var(--ink)] border-[rgba(15,23,42,0.12)]"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mt-6 lg:mt-0 text-left">
          {/* Left sticky list without numerals */}
          <div
            className="hidden lg:block lg:col-span-4 sticky"
            style={{ top: "calc(var(--nav-offset, 80px) + 24px)" }}
          >
            <div className="relative border-l-2 border-[rgba(15,23,42,0.12)] pl-4">
              <div
                className="absolute left-[-2px] w-[2px] bg-[var(--blue)] transition-transform duration-300"
                style={{
                  height: "56px",
                  transform: `translateY(${activeIdx * 56}px)`,
                }}
              />
              {types.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`w-full h-[56px] flex items-center justify-between text-left cursor-pointer transition-colors px-2 ${
                    activeIdx === idx ? "text-[var(--blue)] font-bold" : "text-[#1E3A8A] hover:text-[var(--ink)] font-medium"
                  }`}
                >
                  <span className="text-[14px]">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right stage card without numerals */}
          <div className="lg:col-span-8 border border-[rgba(15,23,42,0.12)] p-6 lg:p-12 text-left bg-white min-h-[560px] flex flex-col justify-between shadow-sm">
            <div className="w-full max-h-[360px] flex items-center justify-center py-6 bg-slate-50/60 border border-[rgba(15,23,42,0.12)]">
              <FrameDiagram type={activeType.name} className="max-w-[480px] w-full" />
            </div>

            <div className="mt-8 pt-6 border-t border-[rgba(15,23,42,0.12)] flex flex-col justify-between">
              <div>
                <h3 className="text-[28px] font-[500] text-[var(--ink)] mb-3 leading-[1.15]">{activeType.name}</h3>
                <p className="text-[#1E3A8A] leading-[1.65] text-[15px] lg:text-[17px]">
                  {activeType.desc}
                </p>
              </div>

              <div className="mt-6 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="link-arrow text-[var(--blue)] font-semibold text-[14px] inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Enlarge Diagram</span>
                  <span className="btn-arrow inline-block" aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enlarge Diagram Modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 z-[500] bg-black/80 flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-8 max-w-[800px] w-full rounded shadow-2xl relative text-left"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[22px] font-bold text-[var(--ink)]">{activeType.name}</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[24px] font-bold text-[#1E3A8A] hover:text-[var(--ink)] cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="w-full py-8 flex items-center justify-center bg-slate-50">
              <FrameDiagram type={activeType.name} className="max-w-[640px] w-full" />
            </div>
            <p className="mt-6 text-[#1E3A8A] leading-[1.6] text-[15px]">{activeType.desc}</p>
          </div>
        </div>
      )}

      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[22px] lg:text-[36px] font-[600] text-[var(--ink)] mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033592/primary-framing-next.jpg"
        nextUrl="/pre-engineered-buildings-pakistan/basic-parameters/"
        nextTitle="Basic Parameters"
      />
    </article>
  );
};

// 9.3 Basic Parameters (Portion 2.1) — StageSwap with 9 matched images
export const BasicParametersLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const paramsBlock = sections.find((s) => s.items && s.items.length >= 8) || sections[1];
  const rawParams = paramsBlock?.items || [
    { name: "Width", text: "Total distance from outside of outer eave strut to outside of opposite eave strut." },
    { name: "Length", text: "Overall building length measured out-to-out of endwall steel framing." },
    { name: "Bay spacing", text: "Distance between the centers of two adjacent interior portal frame columns." },
    { name: "Eave height", text: "Vertical distance from finished floor level to the top of the eave strut." },
    { name: "Roof slope", text: "Angle of roof pitch, commonly 1:10 or 1:20 for pre-engineered frames." },
    { name: "Design loads", text: "Dead, live, wind pressure, and seismic zone requirements for Pakistan." },
    { name: "Location", text: "City and geographic wind/seismic data specific to the project site." },
    { name: "Openings", text: "Industrial doors, windows, louvers, and ridge ventilation cut-outs." },
    { name: "Extras", text: "Overhead cranes, mezzanine floors, canopies, and future extension bays." },
  ];

  // Exactly 9 matched PEB images as specified in 2.1
  const paramImages = [
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033597/sub-structures-hero.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033598/sub-structures-wide.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033592/Primary-framing-hero.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033593/basic-parameters-1.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792007695/peb-engineering-wide.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033599/crane-system-hero.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792007694/Engineering-hero.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033608/accessories-3.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033601/mezzanine-1.jpg",
  ];

  const stageRows = rawParams.map((p, idx) => ({
    title: p.name,
    text: p.text,
    image: paramImages[idx] || paramImages[0],
    alt: `Steel structure ${p.name.toLowerCase()} design parameter`,
  }));

  const note1 = sections.find((s) => s.title.includes("Framing")) || sections[2];
  const note2 = sections.find((s) => s.title.includes("Data")) || sections[3];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033593/Basic-parameters-hero.jpg"
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)] text-left">
        <h2 className="text-[28px] lg:text-[44px] font-[500] text-[var(--ink)] mb-4 tracking-[-0.025em]">
          <TwoTone text={sections[0]?.title || "Why These Parameters Matter"} />
        </h2>
        <div className="w-full h-[1px] bg-[rgba(15,23,42,0.12)] my-6" />
        <p className="text-[17px] lg:text-[20px] font-medium text-[var(--ink)] leading-[1.6] max-w-[880px]">
          {sections[0]?.text || introPs[0]}
        </p>
      </section>

      {/* StageSwap section for 9 parameters */}
      <section className="container pb-[var(--sec-y-lg)]">
        <StageSwap rows={stageRows} ratio={3 / 2} />
      </section>

      {/* Two columns notes without tint, with 1px top hairline and TwoTone titles */}
      <section className="container pb-[var(--sec-y-lg)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left">
          {note1 && (
            <div className="pt-6 border-t border-[rgba(15,23,42,0.12)] space-y-3">
              <h3 className="text-[24px] font-[500] text-[var(--ink)]">
                <TwoTone text={note1.title} />
              </h3>
              <p className="text-[#1E3A8A] text-[16px] leading-[1.65]">
                {note1.text}
              </p>
            </div>
          )}
          {note2 && (
            <div className="pt-6 border-t border-[rgba(15,23,42,0.12)] space-y-3">
              <h3 className="text-[24px] font-[500] text-[var(--ink)]">
                <TwoTone text={note2.title} />
              </h3>
              <p className="text-[#1E3A8A] text-[16px] leading-[1.65]">
                {note2.text}
              </p>
            </div>
          )}
        </div>
      </section>

      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[22px] lg:text-[36px] font-[600] text-[var(--ink)] mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033595/basic-parameters-next.jpg"
        nextUrl="/pre-engineered-buildings-pakistan/sub-structures/"
        nextTitle="Sub Structures"
      />
    </article>
  );
};

// 9.4 Sub Structures (Portion 2.3) — wipe rows, 64:27 wide band, add-on carousel
export const SubStructuresLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const secFraming = sections.find((s) => s.title.includes("Secondary Framing")) || sections[1];
  const secondaryItems = secFraming?.items || [
    { name: "Purlins", text: "Z or C shaped cold-formed steel channels supporting the roof sheeting panels." },
    { name: "Girts", text: "Side wall cold-formed horizontal members providing support to exterior wall sheets." },
    { name: "Bracing", text: "Diagonal cable or angle bracing transferring lateral wind and seismic forces to the ground." },
    { name: "Roof and wall sheeting", text: "Corrugated galvanized or prepainted steel sheets with leak-proof fastener sealing." },
  ];

  const addOnSec = sections.find((s) => s.title.includes("Add-On")) || sections[2];
  const addOns = (addOnSec?.items || []).map((it) => ({
    name: it.name,
    desc: it.text,
  }));

  const fastenersSec = sections.find((s) => s.title.includes("Fasteners")) || sections[3];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollByCard = (dir: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 380, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const maxScroll = scrollWidth - clientWidth;
      setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
    }
  };

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033597/sub-structures-hero.jpg"
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* 1. Intro (2 cols 5fr/7fr, no vertical bar) */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-[28px] lg:text-[44px] font-[500] text-[var(--ink)] leading-[1.1] tracking-[-0.025em]">
              <TwoTone text={sections[0]?.title || "What the Sub Structure Is"} />
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-[17px] lg:text-[20px] font-medium text-[var(--ink)] leading-[1.6]">
              {introPs[0] || sections[0]?.text}
            </p>
            {introPs.slice(1).length > 0 && (
              <p className="mt-4 text-[15px] lg:text-[17px] text-[#1E3A8A] leading-[1.65]">
                {introPs.slice(1).join(" ")}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. Secondary Framing (4 wipe rows, grid 5fr/7fr, no numbers) */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <div className="border-t border-b border-[rgba(15,23,42,0.12)] divide-y divide-[rgba(15,23,42,0.12)]">
          {secondaryItems.map((item, idx) => (
            <div
              key={idx}
              className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start group"
            >
              <div className="lg:col-span-5">
                <div className="relative inline-block">
                  <h3 className="text-[24px] lg:text-[clamp(32px,4vw,56px)] font-[500] text-[var(--ink)] leading-[1.15] transition-transform duration-500 group-hover:translate-x-5">
                    {item.name}
                  </h3>
                  <div className="h-[2px] w-full bg-[var(--blue)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              </div>
              <div className="lg:col-span-7">
                <p className="text-[15px] lg:text-[17px] text-[#1E3A8A] leading-[1.65] max-w-[420px] overflow-wrap-anywhere">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Wide Band (100vw, Pic ratio 64/27 exactly, no max-height) */}
      <section className="w-full my-[var(--sec-y-lg)]">
        <Pic
          src="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033598/sub-structures-wide.jpg"
          alt="PEB Sub Structures Wide Band"
          ratio={64 / 27}
          sizes="100vw"
          className="w-full"
        />
      </section>

      {/* 4. Add-on Carousel without borders or fill */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <div className="flex justify-between items-baseline mb-8">
          <h2 className="text-[28px] lg:text-[40px] font-[500] text-[var(--ink)]">
            <TwoTone text={addOnSec?.title || "Add-On Structures"} />
          </h2>
          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous card"
              className="w-11 h-11 rounded-full border border-[rgba(15,23,42,0.18)] flex items-center justify-center text-[var(--ink)] hover:bg-[var(--blue)] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next card"
              className="w-11 h-11 rounded-full border border-[rgba(15,23,42,0.18)] flex items-center justify-center text-[var(--ink)] hover:bg-[var(--blue)] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          onScroll={handleScroll}
          data-lenis-prevent=""
          className="flex gap-8 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 cursor-grab"
        >
          {addOns.map((ao, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[78vw] lg:w-[calc((100%-64px)/3)] snap-start border-t border-[rgba(15,23,42,0.12)] hover:border-[var(--blue)] pt-7 space-y-3 transition-colors duration-500"
              style={{ minHeight: "220px" }}
            >
              <h3 className="text-[22px] lg:text-[28px] font-[500] text-[var(--ink)] leading-[1.2]">
                {ao.name}
              </h3>
              <p className="text-[15px] lg:text-[16px] text-[#1E3A8A] leading-[1.65]">
                {ao.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 2px progress line */}
        <div className="w-full h-[2px] bg-[rgba(15,23,42,0.12)] mt-6 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-[var(--blue)] transition-all duration-150 origin-left"
            style={{ width: `${Math.max(scrollProgress * 100, 20)}%` }}
          />
        </div>
      </section>

      {/* 5. Fasteners and Sealing (Two columns, no grey band, hairline on top) */}
      {fastenersSec && (
        <section className="container pb-[var(--sec-y-lg)] text-left border-t border-[rgba(15,23,42,0.12)] pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-[24px] lg:text-[32px] font-[500] text-[var(--ink)]">
                <TwoTone text={fastenersSec.title} />
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[15px] lg:text-[17px] text-[#1E3A8A] leading-[1.75]">
                {fastenersSec.text}
              </p>
            </div>
          </div>
        </section>
      )}

      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[22px] lg:text-[36px] font-[600] text-[var(--ink)] mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033597/sub-structures-next.jpg"
        nextUrl="/pre-engineered-buildings-pakistan/crane-system/"
        nextTitle="Crane System"
      />
    </article>
  );
};

// 9.5 Crane System (Portion 2.4) — clean diagrams, no grid background, no numbers
export const CraneSystemLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const sheets = [
    { title: "Jib crane and monorail crane", desc: "Cantilevered arm or single linear I-beam track serving localized workstations and manufacturing bays.", diagram: "Jib & Monorail" },
    { title: "Semi-gantry crane", desc: "One runway rail mounted on the building column and the other running on ground tracks for versatile floor clearance.", diagram: "Semi-Gantry" },
    { title: "Top-running crane in clear-span building", desc: "High-capacity heavy crane trolley traveling atop elevated runway beams supported by reinforced portal columns.", diagram: "Top-Running Clear Span" },
    { title: "Top-running crane in multi-span building", desc: "Dual or multi-bay crane runways operating independently across parallel industrial assembly aisles.", diagram: "Top-Running Multi-Span" },
    { title: "Underhung crane", desc: "Suspended crane trolley riding on the lower flanges of roof rafters, saving crucial floor area for smaller loads.", diagram: "Underhung" },
  ];

  const introSec = sections[0];
  const [modalDiagram, setModalDiagram] = useState<string | null>(null);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033599/crane-system-hero.jpg"
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start text-left">
          {/* Left Sticky Intro Block */}
          <div
            className="lg:col-span-4 sticky"
            style={{ top: "calc(var(--nav-offset, 80px) + 24px)" }}
          >
            <h2 className="text-[28px] lg:text-[40px] font-[500] text-[var(--ink)] leading-[1.15] mb-4">
              <TwoTone text={introSec?.title || "Why Crane Buildings Need Special Design"} />
            </h2>
            <p className="text-[15px] lg:text-[17px] text-[#1E3A8A] leading-[1.75]">
              {introSec?.text}
            </p>
          </div>

          {/* Right SVG Diagrams (Clean white page, no grid or card border) */}
          <div className="lg:col-span-8 space-y-24">
            {sheets.map((sh, idx) => (
              <div
                key={idx}
                className="pt-8 border-t border-[rgba(15,23,42,0.12)] space-y-6"
              >
                <div className="w-full flex items-center justify-center py-4 bg-white">
                  <div className="w-full max-h-[360px] flex items-center justify-center">
                    <CraneDiagram type={sh.diagram} className="w-full h-auto static max-h-[360px] block" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-[20px] lg:text-[28px] font-[500] text-[var(--ink)] leading-[1.2]">
                    {sh.title}
                  </h3>
                  <p className="text-[15px] lg:text-[17px] text-[#1E3A8A] leading-[1.65]">
                    {sh.desc}
                  </p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setModalDiagram(sh.diagram)}
                    className="link-arrow text-[var(--blue)] font-semibold text-[14px] cursor-pointer"
                  >
                    <span>Enlarge Diagram</span>
                    <span className="btn-arrow inline-block" aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enlarge Diagram Modal */}
      {modalDiagram && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setModalDiagram(null)}
          className="fixed inset-0 z-[500] bg-black/80 flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-8 max-w-[800px] w-full rounded shadow-2xl relative text-left"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[22px] font-bold text-[var(--ink)]">{modalDiagram}</h3>
              <button
                type="button"
                onClick={() => setModalDiagram(null)}
                className="text-[24px] font-bold text-[#1E3A8A] hover:text-[var(--ink)] cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="w-full py-8 flex items-center justify-center bg-slate-50">
              <CraneDiagram type={modalDiagram} className="max-w-[640px] w-full h-auto" />
            </div>
          </div>
        </div>
      )}

      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[22px] lg:text-[36px] font-[600] text-[var(--ink)] mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033599/crane-system-next.jpg"
        nextUrl="/pre-engineered-buildings-pakistan/mezzanine-system/"
        nextTitle="Mezzanine System"
      />
    </article>
  );
};

// 9.6 Mezzanine System (Portion 2.5) — slow flex desktop, StackCards mobile
export const MezzanineLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const panelsData = [
    { title: sections[0]?.title || "What a Mezzanine Is", text: sections[0]?.text, img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033601/mezzanine-1.jpg" },
    { title: sections[1]?.title || "Parts of a Steel Mezzanine", text: sections[1]?.text, img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033601/mezzanine-2.jpg" },
    { title: sections[2]?.title || "Load and Use", text: sections[2]?.text, img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033603/mezzanine-3.jpg" },
    { title: sections[3]?.title || "Benefits", text: sections[3]?.text, img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033603/mezzanine-5.jpg" },
  ];

  const experienceSec = sections[4] || sections[3];
  const [activePanel, setActivePanel] = useState(0);

  const mobileCards = panelsData.map((p, idx) => ({
    id: idx,
    content: (
      <div className="w-full bg-white text-left">
        <ImageAccordion
          items={[
            {
              title: p.title,
              text: p.text || "",
              image: p.img,
              ratio: 3 / 2,
            },
          ]}
        />
      </div>
    ),
  }));

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033605/mezzanine-hero.jpg"
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Desktop Expanding Panels (no numbers, slower 900ms flex) */}
      <section className="container py-[var(--sec-y-lg)]">
        <div className="hidden lg:flex h-[640px] gap-3">
          {panelsData.map((p, idx) => {
            const isActive = activePanel === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setActivePanel(idx)}
                onClick={() => setActivePanel(idx)}
                className={`relative overflow-hidden cursor-pointer transition-all duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] bg-slate-900 ${
                  isActive ? "flex-[5]" : "flex-1"
                }`}
              >
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                {/* Collapsed State: Vertical text only (no numbers) */}
                {!isActive && (
                  <div className="absolute inset-0 p-6 flex flex-col justify-end items-start pointer-events-none">
                    <span
                      className="text-white font-bold text-[16px] uppercase tracking-wider whitespace-nowrap"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      {p.title}
                    </span>
                  </div>
                )}

                {/* Active State: Title + Paragraph (no numbers) */}
                {isActive && (
                  <div className="absolute bottom-10 left-10 right-10 text-left space-y-3 z-10 pointer-events-none animate-[fadeIn_450ms_ease_300ms_forwards]">
                    <h3 className="text-[32px] font-bold text-white tracking-tight">
                      {p.title}
                    </h3>
                    <p className="text-white/90 text-[16px] leading-[1.65] max-w-[480px]">
                      {p.text}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile: StackCards with ImageAccordion (no numbers, no borders) */}
        <div className="lg:hidden">
          <StackCards cards={mobileCards} />
        </div>
      </section>

      {/* Experience Band (Full Width Nav Blue) */}
      {experienceSec && (
        <section className="w-full bg-[var(--blue)] text-white py-[var(--sec-y-lg)]">
          <div className="container grid grid-cols-1 lg:grid-cols-12 gap-10 items-center text-left">
            <div className="lg:col-span-5">
              <h2 className="text-[28px] lg:text-[38px] font-bold text-white">
                {experienceSec.title}
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-white/85 text-[15px] lg:text-[18px] leading-[1.7]">
                {experienceSec.text}
              </p>
            </div>
          </div>
        </section>
      )}

      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[22px] lg:text-[36px] font-[600] text-[var(--ink)] mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033606/mezzanine-next.jpg"
        nextUrl="/pre-engineered-buildings-pakistan/accessories/"
        nextTitle="Accessories"
      />
    </article>
  );
};

// 9.7 Accessories (Portion 2.6) — scrollspy index with scroll rule, mobile tab bar
export const AccessoriesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const categories = [
    { title: "Insulation", img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033607/accessories-1.jpg", items: sections[1]?.items || [] },
    { title: "Light and Air", img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033607/accessories-2.jpg", items: sections[2]?.items || [] },
    { title: "Doors and Windows", img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033608/accessories-3.jpg", items: sections[3]?.items || [] },
    { title: "Safe Access", img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033610/accessories-4.jpg", items: sections[4]?.items || [] },
  ];

  const howToChoose = sections.find((s) => s.title.includes("Choose")) || sections[5];
  const [activeCategory, setActiveCategory] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isLockedRef = useRef(false);
  const lockTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (isLockedRef.current) return;
      const navH = 80;
      const targetThreshold = navH + 160;
      let active = 0;

      for (let i = 0; i < sectionRefs.current.length; i++) {
        const el = sectionRefs.current[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= targetThreshold) {
            active = i;
          }
        }
      }
      setActiveCategory(active);
    };

    if (lenis) {
      lenis.on("scroll", handleScroll);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (lenis) lenis.off("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, []);

  const selectCategory = (idx: number) => {
    setActiveCategory(idx);
    isLockedRef.current = true;
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => {
      isLockedRef.current = false;
    }, 1200);

    const el = sectionRefs.current[idx];
    if (el) {
      if (lenis) {
        lenis.scrollTo(el, { offset: -100 });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033610/accessories-hero.jpg"
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Intro */}
      <section className="container py-[var(--sec-y-lg)] text-left space-y-6">
        <h2 className="text-[28px] lg:text-[44px] font-[500] text-[var(--ink)]">
          <TwoTone text={sections[0]?.title || "Why Accessories Matter"} />
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-[#1E3A8A] leading-[1.75] text-[15px] lg:text-[18px]">
          <p>{introPs[0] || sections[0]?.text}</p>
          <p>{introPs[1] || ""}</p>
        </div>
      </section>

      {/* Mobile Sticky Tab Bar */}
      <div
        className="lg:hidden sticky z-30 bg-white py-3 px-4 border-b border-[rgba(15,23,42,0.12)] overflow-x-auto flex gap-6"
        style={{ top: "var(--nav-offset, 60px)" }}
      >
        {categories.map((cat, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => selectCategory(idx)}
            className={`relative py-1 text-[13px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              activeCategory === idx ? "text-[var(--blue)]" : "text-[#1E3A8A]"
            }`}
          >
            <span>{cat.title}</span>
            {activeCategory === idx && (
              <span className="absolute bottom-0 inset-x-0 h-[2px] bg-[var(--blue)] transition-all duration-400" />
            )}
          </button>
        ))}
      </div>

      {/* Desktop Scrollspy Index + Panels */}
      <section className="container pb-[var(--sec-y-lg)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start text-left">
          {/* Desktop Left Sticky Index */}
          <div
            className="hidden lg:block lg:col-span-3 sticky"
            style={{ top: "calc(var(--nav-offset, 80px) + 24px)" }}
          >
            <div className="border-l-2 border-[rgba(15,23,42,0.12)] pl-4 space-y-4">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectCategory(idx)}
                  className={`block text-left text-[16px] font-bold transition-colors cursor-pointer ${
                    activeCategory === idx ? "text-[var(--blue)]" : "text-[#1E3A8A] hover:text-[var(--ink)]"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>

          {/* Right Panels without numbers */}
          <div className="lg:col-span-9 space-y-24">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  sectionRefs.current[idx] = el;
                }}
                className="space-y-8 border-b border-[rgba(15,23,42,0.12)] pb-16"
              >
                <Pic src={cat.img} alt={cat.title} ratio={3 / 2} />
                <h3 className="text-[28px] lg:text-[40px] font-[500] text-[var(--ink)]">
                  <TwoTone text={cat.title} />
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {cat.items.map((it, iIdx) => (
                    <div key={iIdx} className="border-t border-[rgba(15,23,42,0.12)] pt-4 space-y-2">
                      <h4 className="text-[20px] font-[600] text-[var(--ink)]">{it.name}</h4>
                      <p className="text-[#1E3A8A] leading-[1.65] text-[15px] lg:text-[16px]">
                        {it.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Choose (no side line, hairline on top, title, text 15px with links) */}
      {howToChoose && (
        <section className="container pb-[var(--sec-y-lg)] text-left">
          <div className="pt-8 border-t border-[rgba(15,23,42,0.12)] max-w-[840px] space-y-3">
            <h3 className="text-[24px] lg:text-[28px] font-[500] text-[var(--ink)]">
              <TwoTone text={howToChoose.title} />
            </h3>
            <p className="text-[#1E3A8A] leading-[1.75] text-[15px] lg:text-[16px]">
              {howToChoose.text}
            </p>
          </div>
        </section>
      )}

      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[22px] lg:text-[36px] font-[600] text-[var(--ink)] mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033611/accessories-next.jpg"
        nextUrl="/industrial-sheds-pakistan/factory-sheds/"
        nextTitle="Factory Sheds"
      />
    </article>
  );
};
