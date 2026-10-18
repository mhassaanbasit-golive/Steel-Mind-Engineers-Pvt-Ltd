// PEB Division Signature Layouts (9.1 - 9.7)
import React, { useState, useEffect, useRef } from "react";
import { ContentData, ContentBlock } from "../../../content/types.ts";
import { IMG } from "../../../data/subpageImages.ts";
import { PhotoBox } from "../../page/PhotoBox.tsx";
import { OutlineNum } from "../../page/OutlineNum.tsx";
import { Rule } from "../../page/Rule.tsx";
import { SplitIntro } from "../../page/SplitIntro.tsx";
import { HeroBand } from "../../ui/HeroBand.tsx";
import { Accordion } from "../../ui/Accordion.tsx";
import { NextBand } from "../../ui/NextBand.tsx";
import { Steps } from "../../ui/Steps.tsx";
import { FrameDiagram } from "../../diagrams/FrameDiagram.tsx";
import { CraneDiagram } from "../../diagrams/CraneDiagram.tsx";
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

// 9.1 Engineering Department — signature: "Process matrix + ledger"
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
        imageSrc={IMG.peb.engineering.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Intro (SplitIntro) */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <SplitIntro
          title={sections[0]?.title || "What the Engineering Department Does"}
          lead={introPs[0]}
          text={sections[0]?.text || introPs.slice(1)}
        />
      </section>

      {/* Process Infographic: Interactive Vertical Rail */}
      <section className="container pb-[var(--sec-y-lg)]">
        <Steps
          title={stepsBlock?.title || "The Design Process"}
          items={steps}
        />
      </section>

      {/* Wide image: 16/9 PhotoBox */}
      <section className="container pb-[var(--sec-y-lg)]">
        <PhotoBox
          src={IMG.peb.engineering.wide}
          alt="PEB Engineering Wide View"
          ratio="16/9"
        />
      </section>

      {/* Ledger: 3 columns with 1px vertical rule */}
      {ledgerBlocks.length > 0 && (
        <section className="container pb-[var(--sec-y-lg)] border-b border-[var(--rule)] text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--rule)]">
            {ledgerBlocks.map((blk, idx) => (
              <div key={idx} className="py-6 md:py-0 md:px-8 first:pl-0 last:pr-0 space-y-3">
                <h3 className="font-semibold text-[var(--ink)]" style={{ fontSize: "var(--fs-h3)" }}>
                  {blk.title}
                </h3>
                <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
                  {blk.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

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
        image={IMG.peb.engineering.next}
        nextUrl="/pre-engineered-buildings-pakistan/primary-framing-system/"
        nextTitle="Primary Framing System"
      />
    </article>
  );
};

// 9.2 Primary Framing System — signature: "Catalogue viewer"
export const PrimaryFramingLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const typesSec = sections.find((s) => s.items && s.items.length >= 10) || sections[2];
  const types = (typesSec?.items || []).map((it, idx) => ({
    id: String(idx + 1).padStart(2, "0"),
    name: it.name,
    desc: it.text,
  }));

  const [activeIdx, setActiveIdx] = useState(0);
  const activeType = types[activeIdx] || { id: "01", name: "Clear Span (CS)", desc: "One rafter spans the full width with no inner columns." };
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.peb.primaryFraming.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Statement intro: centered */}
      <section className="container py-[var(--sec-y-lg)] text-center max-w-[840px] mx-auto">
        <h2 className="font-bold text-[var(--ink)] mb-4" style={{ fontSize: "var(--fs-h2)" }}>
          {sections[0]?.title || "What the Primary Frame Is"}
        </h2>
        <p className="text-[var(--ink)] leading-[1.65]" style={{ fontSize: "var(--fs-lead)" }}>
          {sections[0]?.text || introPs[0]}
        </p>
      </section>

      {/* Catalogue viewer */}
      <section className="container pb-[var(--sec-y-lg)]">
        {/* Mobile sticky chip bar */}
        <div
          data-lenis-prevent=""
          className="lg:hidden sticky z-30 bg-white py-3 -mx-4 px-4 overflow-x-auto flex gap-2 border-b border-[var(--rule)]"
          style={{ top: "var(--nav-offset, 80px)", scrollSnapType: "x proximity" }}
        >
          {types.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`px-3.5 py-2 whitespace-nowrap rounded-none border text-[13px] font-semibold transition-colors cursor-pointer ${
                activeIdx === idx
                  ? "bg-[var(--blue)] text-white border-[var(--blue)]"
                  : "bg-white text-[var(--ink)] border-[var(--rule)]"
              }`}
            >
              {t.id} {t.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mt-6 lg:mt-0 text-left">
          {/* Left sticky list (desktop) */}
          <div
            className="hidden lg:block lg:col-span-4 sticky"
            style={{ top: "calc(var(--nav-offset, 80px) + 24px)" }}
          >
            <div className="relative border-l-2 border-[var(--rule)] pl-4">
              <div
                className="absolute left-[-2px] w-[2px] bg-[var(--blue)] transition-transform duration-300"
                style={{
                  height: "56px",
                  transform: `translateY(${activeIdx * 56}px)`,
                }}
              />
              {types.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`w-full h-[56px] flex items-center justify-between text-left cursor-pointer transition-colors px-2 ${
                    activeIdx === idx ? "text-[var(--blue)] font-bold" : "text-[var(--grey-strong)] hover:text-[var(--ink)] font-medium"
                  }`}
                >
                  <span className="text-[14px]">{t.name}</span>
                  <span className="text-[12px] font-mono text-[var(--grey)]">{t.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right stage card */}
          <div className="lg:col-span-8 border border-[var(--rule)] p-6 lg:p-12 text-left bg-white min-h-[560px] flex flex-col justify-between shadow-sm">
            <div className="w-full max-h-[360px] flex items-center justify-center py-6 bg-slate-50/60 border border-[var(--rule)]">
              <FrameDiagram type={activeType.name} className="max-w-[480px] w-full" />
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--rule)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[13px] font-mono text-[var(--blue)] font-bold">{activeType.id}</span>
                  <h3 className="text-[26px] font-bold text-[var(--ink)]">{activeType.name}</h3>
                </div>
                <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
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
                  <span>→</span>
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
                className="text-[24px] font-bold text-[var(--grey)] hover:text-[var(--ink)] cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="w-full py-8 flex items-center justify-center bg-slate-50">
              <FrameDiagram type={activeType.name} className="max-w-[640px] w-full" />
            </div>
            <p className="mt-6 text-[var(--grey-strong)] leading-[1.6] text-[15px]">{activeType.desc}</p>
          </div>
        </div>
      )}

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
        image={IMG.peb.primaryFraming.next}
        nextUrl="/pre-engineered-buildings-pakistan/basic-parameters/"
        nextTitle="Basic Parameters"
      />
    </article>
  );
};

// 9.3 Basic Parameters — signature: "Datasheet with sticky joint image"
export const BasicParametersLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const paramsBlock = sections.find((s) => s.items && s.items.length >= 8) || sections[1];
  const params = paramsBlock?.items || [
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

  const note1 = sections.find((s) => s.title.includes("Framing")) || sections[2];
  const note2 = sections.find((s) => s.title.includes("Data")) || sections[3];

  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.peb.basicParameters.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Lead intro */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <h2 className="font-bold text-[var(--ink)] mb-4" style={{ fontSize: "var(--fs-h2)" }}>
          {sections[0]?.title || "Why These Parameters Matter"}
        </h2>
        <Rule />
        <p className="mt-8 font-medium text-[var(--ink)] leading-[1.6] max-w-[880px]" style={{ fontSize: "var(--fs-lead)" }}>
          {sections[0]?.text || introPs[0]}
        </p>
      </section>

      {/* Datasheet: 5fr / 7fr */}
      <section className="container pb-[var(--sec-y-lg)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          {/* Left sticky PhotoBox */}
          <div
            className="lg:col-span-5 sticky"
            style={{ top: "calc(var(--nav-offset, 80px) + 24px)" }}
          >
            <div className="relative">
              <PhotoBox
                src={IMG.peb.basicParameters.p1}
                alt="PEB Joint Parameters"
                ratio="4/5"
              />
              <div className="absolute bottom-4 left-4 bg-[var(--blue)] text-white text-[12px] font-mono px-3 py-1 font-semibold">
                {String(activeIdx + 1).padStart(2, "0")} / {String(params.length).padStart(2, "0")}
              </div>
            </div>
          </div>

          {/* Right parameters rows */}
          <div className="lg:col-span-7 divide-y divide-[var(--rule)]">
            {params.map((p, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveIdx(idx)}
                className={`py-7 transition-opacity duration-300 grid grid-cols-[64px_1fr] gap-4 ${
                  activeIdx === idx ? "opacity-100" : "opacity-55 hover:opacity-100"
                }`}
              >
                <OutlineNum num={idx + 1} active={activeIdx === idx} />
                <div className="text-left space-y-1">
                  <h3 className="font-bold text-[var(--ink)] text-[22px]">{p.name}</h3>
                  <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                    {p.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two notes (2 Columns desktop) */}
      <section className="container pb-[var(--sec-y-lg)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {note1 && (
            <div className="p-8 border-l-2 border-[var(--blue)] bg-slate-50 space-y-3">
              <h3 className="font-semibold text-[var(--ink)] text-[22px]">
                {note1.title}
              </h3>
              <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
                {note1.text}
              </p>
            </div>
          )}
          {note2 && (
            <div className="p-8 border-l-2 border-[var(--blue)] bg-[rgba(30,58,138,0.04)] space-y-3">
              <h3 className="font-semibold text-[var(--ink)] text-[22px]">
                {note2.title}
              </h3>
              <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
                {note2.text}
              </p>
            </div>
          )}
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
        image={IMG.peb.basicParameters.next}
        nextUrl="/pre-engineered-buildings-pakistan/sub-structures/"
        nextTitle="Sub Structures"
      />
    </article>
  );
};

// 9.4 Sub Structures — signature: "Stripe rows + add-on carousel"
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
  const addOns = (addOnSec?.items || []).map((it, idx) => ({
    num: String(idx + 1).padStart(2, "0"),
    name: it.name,
    desc: it.text,
  }));

  const fastenersSec = sections.find((s) => s.title.includes("Fasteners")) || sections[3];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollByCard = (dir: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 360, behavior: "smooth" });
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
        imageSrc={IMG.peb.subStructures.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* 1. Intro with 2px Nav Blue Vertical Bar */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <div className="border-l-2 border-[var(--blue)] pl-8 max-w-[780px] space-y-4">
          <h2 className="font-bold text-[var(--ink)]" style={{ fontSize: "var(--fs-h2)" }}>
            {sections[0]?.title || "What the Sub Structure Is"}
          </h2>
          <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-lead)" }}>
            {sections[0]?.text || introPs[0]}
          </p>
        </div>
      </section>

      {/* 2. Secondary Framing (4 Full-Width Stripes) */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <h2 className="font-bold text-[var(--ink)] mb-8" style={{ fontSize: "var(--fs-h2)" }}>
          {secFraming?.title || "Secondary Framing"}
        </h2>

        <div className="border-t border-b border-[var(--rule)] divide-y divide-[var(--rule)]">
          {secondaryItems.map((item, idx) => (
            <div
              key={idx}
              className="py-10 grid grid-cols-12 gap-8 items-baseline px-4 transition-all duration-300 hover:bg-[rgba(30,58,138,0.04)]"
            >
              <div className="col-span-12 lg:col-span-1">
                <span className="text-[18px] font-mono font-bold text-[var(--blue)]">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="col-span-12 lg:col-span-4">
                <h3 className="text-[24px] font-bold text-[var(--ink)]">{item.name}</h3>
              </div>
              <div className="col-span-12 lg:col-span-7">
                <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Wide Band (100vw Parallax) */}
      <section
        className="w-full overflow-hidden bg-slate-900 my-[var(--sec-y-lg)]"
        style={{ height: "clamp(280px, 40vw, 560px)" }}
      >
        <img
          src={IMG.peb.subStructures.wide}
          alt="PEB Sub Structures Wide View"
          className="w-full h-full object-cover"
        />
      </section>

      {/* 4. Add-on Carousel */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <div className="flex justify-between items-baseline mb-8">
          <h2 className="font-bold text-[var(--ink)]" style={{ fontSize: "var(--fs-h2)" }}>
            {addOnSec?.title || "Add-On Structures"}
          </h2>
          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous card"
              className="w-11 h-11 rounded-full border border-[var(--rule)] flex items-center justify-center text-[var(--ink)] hover:bg-[var(--blue)] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next card"
              className="w-11 h-11 rounded-full border border-[var(--rule)] flex items-center justify-center text-[var(--ink)] hover:bg-[var(--blue)] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          onScroll={handleScroll}
          data-lenis-prevent=""
          className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4"
        >
          {addOns.map((ao) => (
            <div
              key={ao.num}
              className="flex-shrink-0 w-[82vw] lg:w-[calc((var(--container)-2*var(--gutter)-48px)/3)] snap-start border border-[var(--rule)] bg-white p-8 space-y-4 shadow-sm"
              style={{ minHeight: "280px" }}
            >
              <OutlineNum num={ao.num} />
              <h3 className="text-[22px] font-bold text-[var(--ink)]">{ao.name}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {ao.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-[2px] bg-[var(--rule)] mt-6 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-[var(--blue)] transition-all duration-150 origin-left"
            style={{ width: `${Math.max(scrollProgress * 100, 15)}%` }}
          />
        </div>
      </section>

      {/* 5. Fasteners and Sealing Band */}
      {fastenersSec && (
        <section className="w-full bg-[rgba(30,58,138,0.04)] py-[var(--sec-y)] border-t border-b border-[var(--rule)]">
          <div className="container grid grid-cols-1 lg:grid-cols-12 gap-10 items-baseline text-left">
            <div className="lg:col-span-5">
              <h2 className="text-[26px] lg:text-[32px] font-bold text-[var(--ink)]">
                {fastenersSec.title}
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>
                {fastenersSec.text}
              </p>
            </div>
          </div>
        </section>
      )}

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
        image={IMG.peb.subStructures.next}
        nextUrl="/pre-engineered-buildings-pakistan/crane-system/"
        nextTitle="Crane System"
      />
    </article>
  );
};

// 9.5 Crane System — signature: "Blueprint sheets"
export const CraneSystemLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const arrangementsSec = sections.find((s) => s.title.includes("Arrangements")) || sections[1];
  const sheets = [
    { title: "Jib crane and monorail crane", desc: "Cantilevered arm or single linear I-beam track serving localized workstations and manufacturing bays.", diagram: "Jib & Monorail" },
    { title: "Semi-gantry crane", desc: "One runway rail mounted on the building column and the other running on ground tracks for versatile floor clearance.", diagram: "Semi-Gantry" },
    { title: "Top-running crane in clear-span building", desc: "High-capacity heavy crane trolley traveling atop elevated runway beams supported by reinforced portal columns.", diagram: "Top-Running Clear Span" },
    { title: "Top-running crane in multi-span building", desc: "Dual or multi-bay crane runways operating independently across parallel industrial assembly aisles.", diagram: "Top-Running Multi-Span" },
    { title: "Underhung crane", desc: "Suspended crane trolley riding on the lower flanges of roof rafters, saving crucial floor area for smaller loads.", diagram: "Underhung" },
  ];

  const introSec = sections[0];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.peb.craneSystem.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          {/* Left Sticky Intro Block */}
          <div
            className="lg:col-span-4 sticky"
            style={{ top: "calc(var(--nav-offset, 80px) + 24px)" }}
          >
            <div className="space-y-4">
              <h2 className="font-bold text-[var(--ink)]" style={{ fontSize: "var(--fs-h2)" }}>
                {introSec?.title || "Why Crane Buildings Need Special Design"}
              </h2>
              <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>
                {introSec?.text}
              </p>
            </div>
          </div>

          {/* Right Blueprint Sheets */}
          <div className="lg:col-span-8 space-y-10">
            {sheets.map((sh, idx) => (
              <div
                key={idx}
                className="border border-[var(--rule)] p-8 lg:p-10 shadow-sm relative space-y-6"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(30,58,138,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,138,0.05) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              >
                <div className="flex justify-between items-center border-b border-[var(--rule)] pb-4">
                  <span className="text-[13px] font-mono text-[var(--blue)] font-bold">
                    0{idx + 1} / 05
                  </span>
                  <span className="text-[12px] uppercase font-semibold text-[var(--grey)] tracking-wider">
                    Engineering Blueprint
                  </span>
                </div>

                <div className="w-full max-h-[300px] flex items-center justify-center py-6 bg-white/80 border border-[var(--rule)]">
                  <CraneDiagram type={sh.diagram} className="max-w-[420px] w-full" />
                </div>

                <div>
                  <h3 className="text-[24px] font-bold text-[var(--ink)] mb-2">{sh.title}</h3>
                  <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                    {sh.desc}
                  </p>
                </div>
              </div>
            ))}
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
        image={IMG.peb.craneSystem.next}
        nextUrl="/pre-engineered-buildings-pakistan/mezzanine-system/"
        nextTitle="Mezzanine System"
      />
    </article>
  );
};

// 9.6 Mezzanine System — signature: "Expanding panels"
export const MezzanineLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const panelsData = [
    { title: sections[0]?.title || "What a Mezzanine Is", text: sections[0]?.text, img: IMG.peb.mezzanine.m1 },
    { title: sections[1]?.title || "Parts of a Steel Mezzanine", text: sections[1]?.text, img: IMG.peb.mezzanine.m2 },
    { title: sections[2]?.title || "Load and Use", text: sections[2]?.text, img: IMG.peb.mezzanine.m3 },
    { title: sections[3]?.title || "Benefits", text: sections[3]?.text, img: IMG.peb.mezzanine.m5 },
  ];

  const experienceSec = sections[4] || sections[3];
  const [activePanel, setActivePanel] = useState(0);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.peb.mezzanine.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Desktop Expanding Panels (Height 640px, flex: 5 active, flex: 1 collapsed) */}
      <section className="container py-[var(--sec-y-lg)]">
        <div className="hidden lg:flex h-[640px] gap-3">
          {panelsData.map((p, idx) => {
            const isActive = activePanel === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setActivePanel(idx)}
                onClick={() => setActivePanel(idx)}
                className={`relative overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] bg-slate-900 ${
                  isActive ? "flex-[5]" : "flex-1"
                }`}
              >
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                {/* Collapsed State: Number top left + Vertical text */}
                {!isActive && (
                  <div className="absolute inset-0 p-6 flex flex-col justify-between items-start pointer-events-none">
                    <span className="text-[18px] font-mono font-bold text-white/90">
                      0{idx + 1}
                    </span>
                    <span
                      className="text-white font-bold text-[16px] uppercase tracking-wider whitespace-nowrap"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      {p.title}
                    </span>
                  </div>
                )}

                {/* Active State: Title + Paragraph bottom left */}
                {isActive && (
                  <div className="absolute bottom-10 left-10 right-10 text-left space-y-3 z-10 pointer-events-none">
                    <span className="text-[14px] font-mono font-bold text-[var(--blue-light,#60A5FA)] block">
                      0{idx + 1} / 04
                    </span>
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

        {/* Mobile: 4 Cards in 1 Column */}
        <div className="lg:hidden space-y-10 text-left">
          {panelsData.map((p, idx) => (
            <div key={idx} className="border border-[var(--rule)] p-6 bg-white space-y-4">
              <PhotoBox src={p.img} alt={p.title} ratio="16/9" />
              <OutlineNum num={idx + 1} />
              <h3 className="text-[22px] font-bold text-[var(--ink)]">{p.title}</h3>
              <p className="text-[var(--grey-strong)] text-[14px] leading-[1.65]">{p.text}</p>
            </div>
          ))}
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
              <p className="text-white/85 text-[16px] lg:text-[18px] leading-[1.7]">
                {experienceSec.text}
              </p>
            </div>
          </div>
        </section>
      )}

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
        image={IMG.peb.mezzanine.next}
        nextUrl="/pre-engineered-buildings-pakistan/accessories/"
        nextTitle="Accessories"
      />
    </article>
  );
};

// 9.7 Accessories — signature: "Scrollspy index"
export const AccessoriesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const categories = [
    { title: "Insulation", img: IMG.peb.accessories.a1, items: sections[1]?.items || [] },
    { title: "Light and Air", img: IMG.peb.accessories.a2, items: sections[2]?.items || [] },
    { title: "Doors and Windows", img: IMG.peb.accessories.a3, items: sections[3]?.items || [] },
    { title: "Safe Access", img: IMG.peb.accessories.a4, items: sections[4]?.items || [] },
  ];

  const howToChoose = sections.find((s) => s.title.includes("Choose")) || sections[5];
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.peb.accessories.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Intro (Full width title, 2 columns on desktop) */}
      <section className="container py-[var(--sec-y-lg)] text-left space-y-6">
        <h2 className="font-bold text-[var(--ink)]" style={{ fontSize: "var(--fs-h2)" }}>
          {sections[0]?.title || "Why Accessories Matter"}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-lead)" }}>
          <p>{introPs[0] || sections[0]?.text}</p>
          <p>{introPs[1] || ""}</p>
        </div>
      </section>

      {/* Scrollspy Index + Panels */}
      <section className="container pb-[var(--sec-y-lg)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start text-left">
          {/* Desktop Left Sticky Index */}
          <div
            className="hidden lg:block lg:col-span-3 sticky"
            style={{ top: "calc(var(--nav-offset, 80px) + 24px)" }}
          >
            <div className="border-l-2 border-[var(--rule)] pl-4 space-y-4">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveCategory(idx)}
                  className={`block text-left text-[16px] font-bold transition-colors cursor-pointer ${
                    activeCategory === idx ? "text-[var(--blue)]" : "text-[var(--grey)] hover:text-[var(--ink)]"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>

          {/* Right Panels */}
          <div className="lg:col-span-9 space-y-20">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveCategory(idx)}
                className="space-y-8 border-b border-[var(--rule)] pb-16"
              >
                <PhotoBox src={cat.img} alt={cat.title} ratio="16/9" />
                <h3 className="text-[28px] lg:text-[34px] font-bold text-[var(--ink)]">
                  {cat.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {cat.items.map((it, iIdx) => (
                    <div key={iIdx} className="border-t border-[var(--rule)] pt-4 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[13px] font-mono font-bold text-[var(--blue)]">0{iIdx + 1}</span>
                        <h4 className="text-[18px] font-bold text-[var(--ink)]">{it.name}</h4>
                      </div>
                      <p className="text-[var(--grey-strong)] leading-[1.6]" style={{ fontSize: "var(--fs-body)" }}>
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

      {/* How to Choose Callout Block */}
      {howToChoose && (
        <section className="container pb-[var(--sec-y-lg)] text-left">
          <div className="border-l-4 border-[var(--blue)] pl-8 py-2 max-w-[840px] space-y-3">
            <h3 className="text-[24px] font-bold text-[var(--ink)]">{howToChoose.title}</h3>
            <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-lead)" }}>
              {howToChoose.text}
            </p>
          </div>
        </section>
      )}

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
        image={IMG.peb.accessories.next}
        nextUrl="/industrial-sheds-pakistan/factory-sheds/"
        nextTitle="Factory Sheds"
      />
    </article>
  );
};
