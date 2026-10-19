// Structural Steel Fabrication Signature Layouts (9.18 - 9.22)
import React, { useState, useEffect } from "react";
import { ContentData, ContentBlock } from "../../../content/types.ts";
import { IMG } from "../../../data/subpageImages.ts";
import { PhotoBox } from "../../page/PhotoBox.tsx";
import { OutlineNum } from "../../page/OutlineNum.tsx";
import { SplitIntro } from "../../page/SplitIntro.tsx";
import { HeroBand } from "../../ui/HeroBand.tsx";
import { Accordion } from "../../ui/Accordion.tsx";
import { NextBand } from "../../ui/NextBand.tsx";
import { TransitionLink } from "../../ui/TransitionLink.tsx";

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

// 9.18 Columns and Beams — signature: "Type cards + split rows"
export const ColumnsBeamsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const typesSec = sections.find((s) => s.items && s.items.length >= 3) || sections[1];
  const typeCards = typesSec?.items || [
    { name: "Rolled sections", text: "Standard hot-rolled I-beams and channels for primary and secondary frames." },
    { name: "Built-up sections", text: "Welded plate girders engineered for custom depth, tapering and high load spans." },
    { name: "Box sections", text: "Torsion-resistant hollow structural columns for high-capacity multi-story loads." },
  ];
  const typeImages = [IMG.structural.columnsBeams.c1, IMG.structural.columnsBeams.c2, IMG.structural.columnsBeams.c3];

  const splitSec1 = sections[2] || sections[0];
  const splitSec2 = sections[3] || sections[1];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.structural.columnsBeams.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Intro */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <SplitIntro
          title={sections[0]?.title || "The Role of Columns and Beams"}
          lead={introPs[0]}
          text={sections[0]?.text || introPs.slice(1)}
        />
      </section>

      {/* Type Cards (3 columns desktop, 3/4 aspect ratio) */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <h2 className="font-bold text-[var(--ink)] mb-10" style={{ fontSize: "var(--fs-h2)" }}>
          {typesSec?.title || "Types Fabricated"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {typeCards.map((tc, idx) => (
            <div key={idx} className="group border-t border-[var(--rule)] pt-6 space-y-4">
              <PhotoBox
                src={typeImages[idx] || typeImages[0]}
                alt={tc.name}
                ratio="3/4"
                className="mb-4"
              />
              <OutlineNum num={idx + 1} />
              <h3 className="text-[22px] font-bold text-[var(--ink)]">{tc.name}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {tc.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Split Row 1 (c4 Left, Text Right) */}
      <section className="w-full bg-slate-50 border-t border-[var(--rule)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[520px]">
          <div className="h-full min-h-[360px] lg:min-h-[520px]">
            <img
              src={IMG.structural.columnsBeams.c4}
              alt={splitSec1?.title || "Fabrication"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8 lg:p-20 flex flex-col justify-center text-left max-w-[620px]">
            <h2 className="text-[28px] lg:text-[34px] font-bold text-[var(--ink)] mb-4">
              {splitSec1?.title || "How Steel Mind Engineers Fabricates"}
            </h2>
            <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>
              {splitSec1?.text}
            </p>
          </div>
        </div>
      </section>

      {/* Split Row 2 (Text Left, c5 Right) */}
      <section className="w-full bg-white border-t border-b border-[var(--rule)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[520px]">
          <div className="order-2 lg:order-1 p-8 lg:p-20 flex flex-col justify-center text-left max-w-[620px] ml-auto">
            <h2 className="text-[28px] lg:text-[34px] font-bold text-[var(--ink)] mb-4">
              {splitSec2?.title || "Accuracy Matters"}
            </h2>
            <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>
              {splitSec2?.text}
            </p>
          </div>
          <div className="order-1 lg:order-2 h-full min-h-[360px] lg:min-h-[520px]">
            <img
              src={IMG.structural.columnsBeams.c5}
              alt={splitSec2?.title || "Accuracy"}
              className="w-full h-full object-cover"
            />
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
        image={IMG.structural.columnsBeams.next}
        nextUrl="/structural-steel-fabrication-pakistan/trusses/"
        nextTitle="Trusses"
      />
    </article>
  );
};

// 9.19 Trusses — signature: "Center-axis sticky viewer"
export const TrussesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const images = [IMG.structural.trusses.t1, IMG.structural.trusses.t2, IMG.structural.trusses.t3, IMG.structural.trusses.t4, IMG.structural.trusses.t5];
  const blocks = sections.slice(0, 5).map((sec, idx) => ({
    num: String(idx + 1).padStart(2, "0"),
    title: sec.title,
    text: sec.text,
    img: images[idx] || images[0],
  }));

  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.structural.trusses.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        {/* Desktop: 3-column Center Axis Layout */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-start relative">
          {/* Left Column (Odd blocks: 0, 2, 4) */}
          <div className="col-span-4 space-y-[45vh] text-left pt-12">
            {blocks.filter((_, i) => i % 2 === 0).map((b, i) => {
              const origIdx = i * 2;
              return (
                <div
                  key={b.num}
                  onMouseEnter={() => setActiveIdx(origIdx)}
                  className={`transition-opacity duration-400 space-y-4 ${
                    activeIdx === origIdx ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <OutlineNum num={b.num} active={activeIdx === origIdx} />
                  <h3 className="text-[26px] font-bold text-[var(--ink)]">{b.title}</h3>
                  <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>{b.text}</p>
                </div>
              );
            })}
          </div>

          {/* Center Column: Sticky Viewer */}
          <div className="col-span-4 sticky top-[calc(var(--nav-offset,80px)+24px)] aspect-[3/4] overflow-hidden bg-slate-900 border border-[var(--rule)] shadow-lg">
            {blocks.map((b, idx) => (
              <img
                key={b.num}
                src={b.img}
                alt={b.title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-600 ${
                  activeIdx === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
              />
            ))}
          </div>

          {/* Right Column (Even blocks: 1, 3) */}
          <div className="col-span-4 space-y-[45vh] text-left pt-[35vh]">
            {blocks.filter((_, i) => i % 2 === 1).map((b, i) => {
              const origIdx = i * 2 + 1;
              return (
                <div
                  key={b.num}
                  onMouseEnter={() => setActiveIdx(origIdx)}
                  className={`transition-opacity duration-400 space-y-4 ${
                    activeIdx === origIdx ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <OutlineNum num={b.num} active={activeIdx === origIdx} />
                  <h3 className="text-[26px] font-bold text-[var(--ink)]">{b.title}</h3>
                  <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>{b.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Clean Stacked Blocks */}
        <div className="lg:hidden space-y-12 text-left">
          {blocks.map((b) => (
            <div key={b.num} className="space-y-4 border-t border-[var(--rule)] pt-6">
              <PhotoBox src={b.img} alt={b.title} ratio="16/9" />
              <OutlineNum num={b.num} />
              <h3 className="text-[22px] font-bold text-[var(--ink)]">{b.title}</h3>
              <p className="text-[var(--grey-strong)] text-[14px] leading-[1.65]">{b.text}</p>
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
        image={IMG.structural.trusses.next}
        nextUrl="/structural-steel-fabrication-pakistan/mezzanine-floors/"
        nextTitle="Mezzanine Floors"
      />
    </article>
  );
};

// 9.20 Mezzanine Floors — signature: "Sliding floor bands"
export const MezzanineFloorsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const images = [IMG.structural.mezzFloors.m1, IMG.structural.mezzFloors.m2, IMG.structural.mezzFloors.m3, IMG.structural.mezzFloors.m4, IMG.structural.mezzFloors.m5];
  const bands = sections.slice(0, 5).map((sec, idx) => ({
    num: String(idx + 1).padStart(2, "0"),
    title: sec.title,
    text: sec.text,
    img: images[idx] || images[0],
  }));

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.structural.mezzFloors.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)] space-y-16">
        {bands.map((b) => (
          <div key={b.num} className="border-b border-[var(--rule)] pb-16 space-y-8 text-left">
            <div className="w-full aspect-[21/9] overflow-hidden bg-slate-900 shadow-md">
              <img
                src={b.img}
                alt={b.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 flex items-start gap-4">
                <OutlineNum num={b.num} />
                <h3 className="text-[26px] font-bold text-[var(--ink)] pt-1">{b.title}</h3>
              </div>
              <div className="lg:col-span-8">
                <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>
                  {b.text}
                </p>
              </div>
            </div>
          </div>
        ))}
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
        image={IMG.structural.mezzFloors.next}
        nextUrl="/structural-steel-fabrication-pakistan/steel-bridges/"
        nextTitle="Steel Bridges"
      />
    </article>
  );
};

// 9.21 Steel Bridges — signature: "Span diagram"
export const SteelBridgesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const remaining = sections.slice(1, 4);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.structural.bridges.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Centered Intro */}
      <section className="container py-[var(--sec-y-lg)] text-center max-w-[760px] mx-auto">
        <h2 className="font-bold text-[var(--ink)] mb-6" style={{ fontSize: "var(--fs-h2)" }}>
          {sections[0]?.title || "Why Steel for Bridges"}
        </h2>
        <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-lead)" }}>
          {sections[0]?.text || introPs.join(" ")}
        </p>
      </section>

      {/* Wide Band (100vw) */}
      <section className="w-full overflow-hidden bg-slate-900" style={{ height: "clamp(300px, 42vw, 600px)" }}>
        <img
          src={IMG.structural.bridges.wide}
          alt="Steel Bridge Girder Fabrication"
          className="w-full h-full object-cover"
        />
      </section>

      {/* Span Diagram Section: 3 columns hanging from bridge girder line */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        {/* SVG Bridge Girder Line */}
        <div className="hidden lg:block relative w-full mb-12">
          <div className="w-full h-[3px] bg-[var(--blue)] relative flex justify-between items-center">
            <div className="w-4 h-4 bg-[var(--blue)] rotate-45 -mt-[1px]" />
            <div className="w-4 h-4 bg-[var(--blue)] rotate-45 -mt-[1px]" />
          </div>
          <div className="grid grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex justify-center">
                <div className="w-[1px] h-12 bg-[var(--blue)]" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {remaining.map((sec, idx) => (
            <div key={idx} className="border-t lg:border-t-0 border-[var(--rule)] pt-6 lg:pt-0 space-y-4">
              <OutlineNum num={idx + 1} />
              <h3 className="text-[22px] font-bold text-[var(--ink)]">{sec.title}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>{sec.text}</p>
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
        image={IMG.structural.bridges.next}
        nextUrl="/structural-steel-fabrication-pakistan/crane-gantry-structures/"
        nextTitle="Crane Gantry Structures"
      />
    </article>
  );
};

// 9.22 Crane Gantry Structures — signature: "Anatomy triptych + compare band"
export const CraneGantryLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const partsSec = sections[1];
  const designSec = sections[2];
  const compareSec = sections[3];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.structural.gantry.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* 1. Intro + Full image g3 */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <SplitIntro
          title={sections[0]?.title || "What a Gantry Structure Is"}
          lead={introPs[0]}
          text={sections[0]?.text || introPs.slice(1)}
        />
        <div className="mt-12">
          <PhotoBox src={IMG.structural.gantry.g3} alt="Complete Gantry Structure Yard" ratio="16/9" />
        </div>
      </section>

      {/* 2. Parts Triptych: 2 tall image tiles + 1 Royal Blue tile */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <h2 className="font-bold text-[var(--ink)] mb-8" style={{ fontSize: "var(--fs-h2)" }}>
          {partsSec?.title || "Parts of a Gantry"}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="aspect-[4/5] overflow-hidden relative shadow-md">
            <img src={IMG.structural.gantry.g1} alt="Gantry Legs" className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 text-white text-[12px] font-semibold uppercase">
              Heavy Structural Columns
            </div>
          </div>
          <div className="aspect-[4/5] overflow-hidden relative shadow-md">
            <img src={IMG.structural.gantry.g2} alt="Runway Beams" className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 text-white text-[12px] font-semibold uppercase">
              Crane Runway Beams
            </div>
          </div>
          <div className="bg-[var(--blue)] text-white p-8 lg:p-10 flex flex-col justify-center space-y-4 shadow-md">
            <h3 className="text-[24px] font-bold text-white leading-[1.2]">
              {partsSec?.title || "Integrated Engineering"}
            </h3>
            <p className="text-white/85 text-[15px] leading-[1.7]">
              {partsSec?.text}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Design Points Ledger */}
      {designSec && (
        <section className="container pb-[var(--sec-y-lg)] text-left">
          <h2 className="font-bold text-[var(--ink)] mb-8" style={{ fontSize: "var(--fs-h2)" }}>
            {designSec.title}
          </h2>
          <div className="divide-y divide-[var(--rule)] border-t border-b border-[var(--rule)]">
            {designSec.text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0).map((sentence, sIdx) => (
              <div key={sIdx} className="py-5 grid grid-cols-12 gap-6 items-baseline">
                <div className="col-span-1">
                  <span className="text-[14px] font-mono font-bold text-[var(--blue)]">
                    {String(sIdx + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="col-span-11">
                  <p className="text-[var(--ink)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
                    {sentence}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Compare Band: Gantry or Crane Shed? */}
      {compareSec && (
        <section className="w-full bg-[var(--blue)] text-white py-12 lg:py-[var(--sec-y-lg)]">
          <div className="container px-4 sm:px-6 lg:px-8 text-left space-y-5">
            <h2 className="text-[24px] sm:text-[28px] lg:text-[36px] font-[600] tracking-[-0.025em] text-white leading-[1.15]">
              {compareSec.title}
            </h2>
            <p className="text-white/90 text-[15px] sm:text-[17px] lg:text-[18px] leading-[1.65] max-w-[760px]">
              {compareSec.text}
            </p>
            <div className="pt-2">
              <TransitionLink
                to="/industrial-sheds-pakistan/crane-sheds/"
                className="btn btn-light btn-sm inline-flex items-center gap-2"
              >
                <span>Explore Crane Sheds</span>
                <span className="btn-arrow">→</span>
              </TransitionLink>
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
        image={IMG.structural.gantry.next}
        nextUrl="/custom-steel-fabrication-pakistan/machine-frames/"
        nextTitle="Machine Frames"
      />
    </article>
  );
};
