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
import { FrameDiagram } from "../../diagrams/FrameDiagram.tsx";
import { CraneDiagram } from "../../diagrams/CraneDiagram.tsx";
import { Reveal } from "../../../lib/motion.ts";
import { lenis } from "../../../lib/lenis.ts";

// Helper to extract sections from content data
function extractBlocks(data: ContentData) {
  const sections: { title: string; paragraphs: string[]; items?: { name: string; text: string }[] }[] = [];
  let current: { title: string; paragraphs: string[]; items?: { name: string; text: string }[] } | null = null;
  const introPs: string[] = [];

  data.blocks.forEach((b: ContentBlock) => {
    if (b.type === "h2") {
      if (current) sections.push(current);
      current = { title: b.title || "", paragraphs: [] };
    } else if (b.type === "p" && b.text) {
      if (current) current.paragraphs.push(b.text);
      else introPs.push(b.text);
    } else if ((b.type === "defs" || b.type === "steps") && b.items) {
      if (current) current.items = b.items;
    }
  });
  if (current) sections.push(current);

  return { introPs, sections };
}

// 9.1 Engineering Department — signature: "Process matrix + ledger"
export const EngineeringLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractBlocks(data);
  const stepsBlock = sections.find((s) => s.items && s.items.length >= 6) || sections[0];
  const steps = stepsBlock?.items || [
    { name: "Requirement study", text: "Analyzing building purpose, dimensions and special loads." },
    { name: "Load calculation", text: "Computing dead, live, wind, and seismic loads to building codes." },
    { name: "Frame design", text: "Optimizing steel portal frame sections for strength and economy." },
    { name: "3D model", text: "Creating a complete virtual structural model for verification." },
    { name: "Detailing", text: "Producing shop fabrication and field erection drawings." },
    { name: "Internal check", text: "Multi-engineer review before steel fabrication begins." },
  ];

  const ledgerBlocks = sections.filter((s) => s !== stepsBlock).slice(0, 3);

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
      <section className="container py-[var(--sec-y-lg)]">
        <SplitIntro
          title={sections[0]?.title || "What the Engineering Department Does"}
          lead={introPs[0]}
          text={introPs.slice(1).concat(sections[0]?.paragraphs || [])}
        />
      </section>

      {/* Process matrix: 3x2 on desktop */}
      <section className="container pb-[var(--sec-y)]">
        <h2 className="font-bold text-[var(--ink)] mb-14" style={{ fontSize: "var(--fs-h2)" }}>
          {stepsBlock?.title || "The Design Process"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="group pt-6 border-t border-[var(--rule)] relative transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-[var(--blue)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="flex items-start gap-4 mb-3">
                <OutlineNum num={idx + 1} className="group-hover:text-[var(--blue)]" />
                <h3 className="font-semibold text-[var(--ink)] pt-1" style={{ fontSize: "var(--fs-h3)" }}>
                  {st.name}
                </h3>
              </div>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {st.text}
              </p>
            </div>
          ))}
        </div>
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
        <section className="container pb-[var(--sec-y-lg)] border-b border-[var(--rule)]">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--rule)]">
            {ledgerBlocks.map((blk, idx) => (
              <div key={idx} className="py-6 md:py-0 md:px-8 first:pl-0 last:pr-0 text-left space-y-3">
                <h3 className="font-semibold text-[var(--ink)]" style={{ fontSize: "var(--fs-h3)" }}>
                  {blk.title}
                </h3>
                {blk.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                    {p}
                  </p>
                ))}
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
  const { introPs } = extractBlocks(data);
  const types = [
    { id: "01", name: "Clear Span (CS)", desc: "Wide open floor plan with no interior columns. Ideal for warehouses and factories." },
    { id: "02", name: "Lean-To (LT)", desc: "Economic extension wing joined to the sidewall of a main building frame." },
    { id: "03", name: "Mono Slope (MS)", desc: "Single-pitch roof designed for efficient rainwater shedding in one direction." },
    { id: "04", name: "Mono Slope Multi-Span 1", desc: "Single-slope roof profile supported by an interior column line for wide spans." },
    { id: "05", name: "Multi-Gable (MG)", desc: "Multiple ridge lines spanning across a very wide industrial building footprint." },
    { id: "06", name: "Multi-Gable (Clear Span & MS-1)", desc: "Combined clear span and multi-span bays under double gable roof geometry." },
    { id: "07", name: "Multi-Span 1 (MS-1)", desc: "Gabled portal frame with one center column row, cutting steel tonnage significantly." },
    { id: "08", name: "Multi-Span 2 (MS-2)", desc: "Gabled frame with two interior columns creating three clear structural bays." },
    { id: "09", name: "Multi-Span 3 (MS-3)", desc: "Wide gabled building with three interior column rows for maximum covered space." },
    { id: "10", name: "Roof System (RS)", desc: "Steel roof frame supported on load-bearing masonry or concrete perimeter walls." },
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const activeType = types[activeIdx];
  const listRef = useRef<HTMLDivElement>(null);

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
      <section className="container py-[var(--sec-y-lg)] text-center">
        <h2 className="font-bold text-[var(--ink)] max-w-[760px] mx-auto mb-4" style={{ fontSize: "var(--fs-h2)" }}>
          What the Primary Frame Is
        </h2>
        <p className="max-w-[760px] mx-auto text-[var(--ink)] leading-[1.6]" style={{ fontSize: "var(--fs-lead)" }}>
          {introPs[0] || "The primary framing system is the main load-bearing backbone of every pre-engineered building."}
        </p>
      </section>

      {/* Catalogue viewer */}
      <section className="container pb-[var(--sec-y-lg)]">
        {/* Mobile sticky chip bar */}
        <div
          data-lenis-prevent
          className="lg:hidden sticky z-30 bg-white py-3 -mx-4 px-4 overflow-x-auto flex gap-2 border-b border-[var(--rule)]"
          style={{ top: "var(--nav-offset, 88px)", scrollSnapType: "x proximity" }}
        >
          {types.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`px-3 py-1.5 whitespace-nowrap rounded border text-[13px] font-medium transition-colors ${
                activeIdx === idx
                  ? "bg-[var(--blue)] text-white border-[var(--blue)]"
                  : "bg-white text-[var(--ink)] border-[var(--rule)]"
              }`}
            >
              {t.id} {t.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mt-6 lg:mt-0">
          {/* Left sticky list (desktop) */}
          <div
            ref={listRef}
            className="hidden lg:block lg:col-span-4 sticky"
            style={{ top: "calc(var(--nav-offset, 88px) + 24px)" }}
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
                  className={`w-full h-[56px] flex items-center justify-between text-left cursor-pointer transition-colors ${
                    activeIdx === idx ? "text-[var(--blue)] font-semibold" : "text-[var(--grey-strong)] hover:text-[var(--ink)]"
                  }`}
                >
                  <span className="text-[14px]">{t.name}</span>
                  <span className="text-[12px] font-mono text-[var(--grey)]">{t.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right stage card */}
          <div className="lg:col-span-8 border border-[var(--rule)] p-6 lg:p-12 text-left bg-white min-h-[480px] flex flex-col justify-between">
            <div className="w-full max-h-[360px] flex items-center justify-center py-4 bg-slate-50/50">
              <FrameDiagram type={activeType.name} className="max-w-[480px]" />
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--rule)]">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[13px] font-mono text-[var(--blue)] font-bold">{activeType.id}</span>
                <h3 className="text-[24px] font-bold text-[var(--ink)]">{activeType.name}</h3>
              </div>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {activeType.desc}
              </p>
            </div>
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
  const { introPs, sections } = extractBlocks(data);
  const paramsBlock = sections.find((s) => s.items && s.items.length >= 8) || sections[0];
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
          Why These Parameters Matter
        </h2>
        <Rule />
        <p className="mt-8 font-medium text-[var(--ink)] leading-[1.5] max-w-[880px]" style={{ fontSize: "var(--fs-lead)" }}>
          {introPs[0] || "Accurate building parameters ensure precise structural design, preventing costly material overdesign or fabrication delays."}
        </p>
      </section>

      {/* Datasheet: 5fr / 7fr */}
      <section className="container pb-[var(--sec-y-lg)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left sticky PhotoBox */}
          <div
            className="lg:col-span-5 sticky"
            style={{ top: "calc(var(--nav-offset, 88px) + 24px)" }}
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
                  activeIdx === idx ? "opacity-100" : "opacity-60 hover:opacity-100"
                }`}
              >
                <OutlineNum num={idx + 1} active={activeIdx === idx} />
                <div className="text-left">
                  <h3 className="font-bold text-[var(--ink)] text-[20px] mb-1">{p.name}</h3>
                  <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                    {p.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two notes */}
      <section className="container pb-[var(--sec-y-lg)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="p-6 border-l-2 border-[var(--blue)] bg-slate-50">
            <h3 className="font-semibold text-[var(--ink)] mb-2" style={{ fontSize: "var(--fs-h3)" }}>
              Framing and Sheeting in the Parameters
            </h3>
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
              Roof and wall cladding gauges and secondary purlin spacing are determined directly by these parameters.
            </p>
          </div>
          <div className="p-6 border-l-2 border-[var(--blue)] bg-[rgba(30,58,138,0.04)]">
            <h3 className="font-semibold text-[var(--ink)] mb-2" style={{ fontSize: "var(--fs-h3)" }}>
              If You Do Not Have All the Data
            </h3>
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
              Our engineering team can assist with preliminary sizing based on your plot boundary and operational layout.
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
  const { introPs } = extractBlocks(data);
  const secondaryItems = [
    { name: "Purlins", desc: "Z or C shaped cold-formed steel channels supporting the roof sheeting panels." },
    { name: "Girts", desc: "Side wall cold-formed horizontal members providing support to exterior wall sheets." },
    { name: "Bracing", desc: "Diagonal cable or angle bracing transferring lateral wind and seismic forces to the ground." },
    { name: "Roof and wall sheeting", desc: "Corrugated galvanized or prepainted steel sheets with leak-proof fastener sealing." },
  ];

  const addOns = [
    { num: "01", name: "Canopy", desc: "Cantilevered weather overhangs guarding loading bays from rain." },
    { num: "02", name: "Fascia", desc: "Vertical parapet walls hiding sloped roof ridges for a clean box facade." },
    { num: "03", name: "Jack beam", desc: "Heavy transfer girder eliminating intermediate columns inside the floor plan." },
    { num: "04", name: "Partitions", desc: "Internal steel wall framing isolating office, storage or clean areas." },
    { num: "05", name: "Portal brace", desc: "Rigid frame bay replacing cross bracing where door clearance is required." },
    { num: "06", name: "Roof monitor", desc: "Continuous raised roof center allowing hot air and smoke escape." },
    { num: "07", name: "Roof platform", desc: "Reinforced steel decks supporting heavy HVAC and ductwork equipment." },
    { num: "08", name: "Stairs", desc: "Fabricated steel flight stairs and handrails accessing mezzanine floors." },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollByCard = (dir: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
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

      {/* Quote-bar intro */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <div className="border-l-2 border-[var(--blue)] pl-8 max-w-[780px]">
          <h2 className="font-bold text-[var(--ink)] mb-4" style={{ fontSize: "var(--fs-h2)" }}>
            What the Sub Structure Is
          </h2>
          <p className="text-[var(--ink)] font-medium leading-[1.6]" style={{ fontSize: "var(--fs-lead)" }}>
            {introPs[0] || "Secondary framing members transfer loads from the building skin to the primary portal frames."}
          </p>
        </div>
      </section>

      {/* Secondary framing stripes */}
      <section className="container pb-[var(--sec-y)]">
        <h2 className="font-bold text-[var(--ink)] mb-8 text-left" style={{ fontSize: "var(--fs-h2)" }}>
          Secondary Framing
        </h2>

        <div className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
          {secondaryItems.map((it, idx) => (
            <div
              key={idx}
              className="group relative py-8 px-4 grid grid-cols-1 md:grid-cols-[120px_5fr_7fr] gap-4 items-center transition-all duration-400 hover:pl-8 text-left"
            >
              <div className="absolute inset-0 bg-[rgba(30,58,138,0.04)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left -z-10" />
              <OutlineNum num={idx + 1} className="group-hover:text-[var(--blue)]" />
              <h3 className="font-bold text-[var(--ink)] text-[22px]">{it.name}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Wide band: 100vw Parallax */}
      <section className="w-full overflow-hidden my-[var(--sec-y-lg)]">
        <PhotoBox
          src={IMG.peb.subStructures.wide}
          alt="Sub-Structures Wide View"
          ratio="21/9"
          className="w-full"
        />
      </section>

      {/* Add-on carousel */}
      <section className="container pb-[var(--sec-y-lg)]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-bold text-[var(--ink)]" style={{ fontSize: "var(--fs-h2)" }}>
            Add-On Structures
          </h2>
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous Add-on"
              className="w-11 h-11 rounded-full border border-[var(--rule)] flex items-center justify-center hover:bg-[var(--blue)] hover:text-white transition-colors"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next Add-on"
              className="w-11 h-11 rounded-full border border-[var(--rule)] flex items-center justify-center hover:bg-[var(--blue)] hover:text-white transition-colors"
            >
              →
            </button>
          </div>
        </div>

        <div
          data-lenis-prevent
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto pb-4 cursor-grab"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
        >
          {addOns.map((ad) => (
            <div
              key={ad.num}
              className="flex-shrink-0 w-[82vw] sm:w-[320px] lg:w-[360px] p-8 border border-[var(--rule)] text-left flex flex-col justify-between"
              style={{ scrollSnapAlign: "start", minHeight: "280px" }}
            >
              <div>
                <OutlineNum num={ad.num} />
                <h3 className="font-bold text-[var(--ink)] text-[20px] mt-4 mb-2">{ad.name}</h3>
              </div>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {ad.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full h-[2px] bg-[var(--rule)] mt-6 overflow-hidden">
          <div
            className="h-full bg-[var(--blue)] origin-left transition-transform duration-150"
            style={{ transform: `scaleX(${scrollProgress})` }}
          />
        </div>
      </section>

      {/* Fasteners band */}
      <section className="w-full bg-[rgba(30,58,138,0.04)] py-[var(--sec-y)]">
        <div className="container grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
          <div className="md:col-span-5">
            <h2 className="font-bold text-[var(--ink)]" style={{ fontSize: "var(--fs-h2)" }}>
              Fasteners and Sealing
            </h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
              Precision self-drilling fasteners with bonded EPDM washers and UV-resistant sealants safeguard building roof sheets against rain leaks and severe wind uplift.
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
  const { introPs } = extractBlocks(data);
  const cranes = [
    { num: "01", title: "Jib Crane & Monorail", desc: "Wall-mounted pivoting jib arm and linear hoist monorail for workstation material handling." },
    { num: "02", title: "Semi-Gantry Crane", desc: "One leg travelling on elevated building brackets and one leg running on ground-level rail." },
    { num: "03", title: "Top-Running Crane (Clear Span)", desc: "Heavy overhead bridge crane riding runway beams mounted directly on portal columns." },
    { num: "04", title: "Top-Running Crane (Multi-Span)", desc: "Two independent crane bridges spanning across parallel bays within a large manufacturing shed." },
    { num: "05", title: "Underhung Crane", desc: "Light hoist suspended from the bottom flange of roof rafters, saving floor area." },
  ];

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left sticky intro */}
          <div
            className="lg:col-span-4 sticky text-left"
            style={{ top: "calc(var(--nav-offset, 88px) + 24px)" }}
          >
            <h2 className="font-bold text-[var(--ink)] mb-4" style={{ fontSize: "var(--fs-h2)" }}>
              Why Crane Buildings Need Special Design
            </h2>
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
              {introPs[0] || "Overhead cranes exert intense dynamic wheel loads, lateral thrust, and fatigue cycles on building portal columns and runway beams."}
            </p>
          </div>

          {/* Right blueprint sheets */}
          <div className="lg:col-span-8 space-y-8">
            {cranes.map((cr) => (
              <div
                key={cr.num}
                className="p-8 border border-[var(--rule)] text-left bg-white relative overflow-hidden"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(30,58,138,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,138,0.05) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[12px] font-mono text-[var(--blue)] font-bold">{cr.num} / 05</span>
                  <span className="text-[12px] uppercase font-semibold text-[var(--grey)] tracking-wider">Blueprint Spec</span>
                </div>

                <div className="w-full max-h-[300px] flex items-center justify-center py-4 bg-white/80 border border-slate-100">
                  <CraneDiagram type={cr.title} className="max-w-[420px]" />
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--rule)]">
                  <h3 className="font-bold text-[var(--ink)] text-[22px] mb-2">{cr.title}</h3>
                  <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                    {cr.desc}
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
  const panels = [
    { num: "01", title: "What a Mezzanine Is", text: "An intermediate floor built between main floors to double warehouse and plant floor capacity.", img: IMG.peb.mezzanine.m1 },
    { num: "02", title: "Parts of a Mezzanine", text: "Primary steel columns, main carrier beams, secondary joists, and concrete decking on steel deck.", img: IMG.peb.mezzanine.m2 },
    { num: "03", title: "Load and Use", text: "Engineered specifically for heavy pallet storage, light office rooms, or active assembly machinery.", img: IMG.peb.mezzanine.m3 },
    { num: "04", title: "Benefits", text: "Maximize usable interior floor area without purchasing extra land or enlarging external foundations.", img: IMG.peb.mezzanine.m5 },
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.peb.mezzanine.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Expanding panels (Desktop) */}
      <section className="container py-[var(--sec-y-lg)]">
        <div className="hidden lg:flex h-[640px] gap-3">
          {panels.map((p, idx) => {
            const isActive = activeIdx === idx;
            return (
              <div
                key={p.num}
                onClick={() => setActiveIdx(idx)}
                onMouseEnter={() => setActiveIdx(idx)}
                className={`relative overflow-hidden cursor-pointer transition-[flex] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isActive ? "flex-[5]" : "flex-[1]"
                }`}
              >
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Collapsed state */}
                {!isActive && (
                  <div className="absolute inset-0 p-6 flex flex-col justify-between text-white pointer-events-none">
                    <span className="font-mono text-[14px] font-bold">{p.num}</span>
                    <span
                      className="text-[14px] font-semibold tracking-wider uppercase whitespace-nowrap"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      {p.title}
                    </span>
                  </div>
                )}

                {/* Expanded state */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 p-10 text-left text-white max-w-[480px]">
                    <span className="font-mono text-[14px] font-bold text-white/80 block mb-2">{p.num}</span>
                    <h3 className="text-[28px] font-bold mb-3">{p.title}</h3>
                    <p className="text-[16px] leading-[1.6] text-white/90">{p.text}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile: 4 cards */}
        <div className="lg:hidden space-y-8">
          {panels.map((p) => (
            <div key={p.num} className="text-left border border-[var(--rule)] p-6 bg-white">
              <PhotoBox src={p.img} alt={p.title} ratio="16/9" className="mb-4" />
              <OutlineNum num={p.num} />
              <h3 className="font-bold text-[var(--ink)] text-[22px] mt-2 mb-2">{p.title}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Experience band */}
      <section className="w-full bg-[var(--blue)] text-white py-[var(--sec-y-lg)]">
        <div className="container grid grid-cols-1 md:grid-cols-12 gap-8 text-left items-center">
          <div className="md:col-span-5">
            <h2 className="font-bold text-white" style={{ fontSize: "var(--fs-h2)" }}>
              Experience
            </h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-white/85 leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
              Steel Mind Engineers has successfully delivered massive industrial mezzanine systems across Pakistan, including multi-tier mezzanine floors for Haier Pakistan and leading logistics hubs.
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
  const { introPs } = extractBlocks(data);
  const categories = [
    {
      id: "insulation",
      name: "Insulation",
      img: IMG.peb.accessories.a1,
      items: [
        { name: "Rockwool insulation board", desc: "Dense mineral wool slab providing exceptional fire barrier and acoustic absorption." },
        { name: "Fiberglass insulation", desc: "Lightweight glass wool blanket with aluminum foil facing for high thermal resistance." },
      ],
    },
    {
      id: "ventilation",
      name: "Light and Air",
      img: IMG.peb.accessories.a2,
      items: [
        { name: "Skylight panels", desc: "Translucent polycarbonate sheets letting natural daylight illuminate production floors." },
        { name: "Ridge ventilator", desc: "Continuous roof peak vent exhausting trapped hot air through natural thermal convection." },
        { name: "Turbo vent", desc: "Wind-driven spherical rotary cowl drawing stale fumes out without electric power." },
        { name: "Power ventilator", desc: "Motorized heavy-duty industrial exhaust fan extracting smoke and heat rapidly." },
        { name: "Louver", desc: "Adjustable aluminum or steel wall blades allowing continuous cross-ventilation." },
      ],
    },
    {
      id: "doors",
      name: "Industrial Doors",
      img: IMG.peb.accessories.a3,
      items: [
        { name: "Double sliding door", desc: "Wide steel leaf panels gliding on overhead roller tracks for equipment access." },
        { name: "Hangar door", desc: "Multi-leaf telescoping heavy door systems spanning very wide aircraft or crane bays." },
        { name: "PU-filled door", desc: "Insulated polyurethane core sandwich door minimizing heat loss in cold stores." },
        { name: "Sectional motorized roll-up", desc: "Rapid electric shutter rolling into ceiling space for truck loading docks." },
        { name: "Emergency exit door", desc: "Certified fire-rated egress panic doors ensuring personnel safety." },
      ],
    },
    {
      id: "access",
      name: "Safe Access",
      img: IMG.peb.accessories.a4,
      items: [
        { name: "Cage ladder", desc: "Fixed vertical galvanized steel ladder with protective safety hoop ring cage." },
        { name: "Staircase", desc: "Heavy stringer staircases with anti-slip grating treads and safety guardrails." },
        { name: "Walkway", desc: "Roof inspection platforms providing safe footpaths for maintenance technicians." },
      ],
    },
  ];

  const [activeCat, setActiveCat] = useState("insulation");

  const scrollToCat = (id: string) => {
    setActiveCat(id);
    const el = document.getElementById(id);
    if (el) {
      if (lenis) lenis.scrollTo(el, { offset: -110 });
      else el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.peb.accessories.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Magazine intro: 2 columns on desktop */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <h2 className="font-bold text-[var(--ink)] mb-6" style={{ fontSize: "var(--fs-h2)" }}>
          Why Accessories Matter
        </h2>
        <div className="md:columns-2 gap-16 text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
          <p className="mb-4">
            {introPs[0] || "A bare steel structure becomes a fully functional building through thoughtful integration of accessories. Natural lighting, thermal barrier insulation, ventilation louvers, and motorized rolling doors transform raw steel sheds into comfortable, efficient workspaces."}
          </p>
          <p>
            {introPs[1] || "All accessories are custom detailed by our engineering division to mount seamlessly with the primary and secondary steel framing, ensuring weather tightness and structural integrity."}
          </p>
        </div>
      </section>

      {/* Panels with scrollspy */}
      <section className="container pb-[var(--sec-y-lg)]">
        {/* Mobile chip bar */}
        <div
          data-lenis-prevent
          className="lg:hidden sticky z-30 bg-white py-3 -mx-4 px-4 overflow-x-auto flex gap-2 border-b border-[var(--rule)]"
          style={{ top: "var(--nav-offset, 88px)" }}
        >
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => scrollToCat(c.id)}
              className={`px-3 py-1.5 whitespace-nowrap rounded text-[13px] font-medium transition-colors ${
                activeCat === c.id
                  ? "bg-[var(--blue)] text-white"
                  : "bg-slate-100 text-[var(--ink)] hover:bg-slate-200"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mt-8 lg:mt-0">
          {/* Left sticky index (desktop) */}
          <div
            className="hidden lg:block lg:col-span-3 sticky text-left"
            style={{ top: "calc(var(--nav-offset, 88px) + 24px)" }}
          >
            <div className="border-l border-[var(--rule)] pl-4 space-y-4">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => scrollToCat(c.id)}
                  className={`block text-[15px] font-medium cursor-pointer transition-colors ${
                    activeCat === c.id ? "text-[var(--blue)] font-bold" : "text-[var(--grey)] hover:text-[var(--ink)]"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right category panels */}
          <div className="lg:col-span-9 space-y-20">
            {categories.map((cat) => (
              <div key={cat.id} id={cat.id} className="text-left space-y-8 scroll-mt-28">
                <PhotoBox src={cat.img} alt={cat.name} ratio="16/9" />
                <h3 className="font-bold text-[var(--ink)]" style={{ fontSize: "var(--fs-h2)" }}>
                  {cat.name}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {cat.items.map((it, idx) => (
                    <div key={idx} className="pt-4 border-t border-[var(--rule)]">
                      <span className="text-[12px] font-mono text-[var(--blue)] font-bold mb-1 block">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h4 className="font-semibold text-[var(--ink)] text-[18px] mb-2">{it.name}</h4>
                      <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                        {it.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Choose */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <div className="p-8 border-l-2 border-[var(--blue)] bg-slate-50">
          <h3 className="font-bold text-[var(--ink)] text-[22px] mb-3">How to Choose</h3>
          <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
            Select insulation thickness based on ambient regional heat in Punjab and Sindh, and configure continuous ridge ventilators to keep warehouse internal temperatures up to 8°C cooler.
          </p>
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

      <NextBand
        image={IMG.peb.accessories.next}
        nextUrl="/industrial-sheds-pakistan/"
        nextTitle="Industrial Sheds"
      />
    </article>
  );
};
