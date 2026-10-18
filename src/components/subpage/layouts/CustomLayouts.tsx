// Custom Steel Fabrication Signature Layouts (9.23 - 9.27)
import React, { useState, useEffect } from "react";
import { ContentData, ContentBlock } from "../../../content/types.ts";
import { IMG } from "../../../data/subpageImages.ts";
import { PhotoBox } from "../../page/PhotoBox.tsx";
import { OutlineNum } from "../../page/OutlineNum.tsx";
import { HeroBand } from "../../ui/HeroBand.tsx";
import { Accordion } from "../../ui/Accordion.tsx";
import { NextBand } from "../../ui/NextBand.tsx";
import { Check } from "lucide-react";

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

// 9.23 Machine Frames — signature: "Statement + ruler + checklist"
export const MachineFramesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const checklistSecs = sections.slice(1, 4);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.custom.machineFrames.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Statement Section */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-baseline">
          <div className="lg:col-span-5">
            <h2 className="text-[26px] lg:text-[34px] font-bold text-[var(--ink)] leading-[1.2]">
              {sections[0]?.title || "What a Machine Frame Does"}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-[18px] lg:text-[24px] text-[var(--ink)] font-normal leading-[1.45] text-pretty">
              {sections[0]?.text || introPs.join(" ")}
            </p>
          </div>
        </div>
      </section>

      {/* Wide Image with SVG Precision Ruler */}
      <section className="container pb-[var(--sec-y-lg)]">
        <div className="w-full aspect-[64/27] overflow-hidden bg-slate-900 shadow-md">
          <img
            src={IMG.custom.machineFrames.wide}
            alt="Precision Machine Frame Fabrication"
            className="w-full h-full object-cover"
          />
        </div>
        {/* SVG Engineering Ruler */}
        <div className="w-full h-6 border-b border-[var(--blue)] flex justify-between items-end px-2 pt-2">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className={`w-[1px] bg-[var(--blue)] ${i % 5 === 0 ? "h-4" : "h-2"}`}
            />
          ))}
        </div>
      </section>

      {/* Checklist Section (3 columns with 40px circle & check icon) */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {checklistSecs.map((sec, idx) => (
            <div key={idx} className="group space-y-4 transition-transform duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 rounded-full border border-[var(--blue)] bg-white text-[var(--blue)] flex items-center justify-center transition-colors duration-300 group-hover:bg-[var(--blue)] group-hover:text-white">
                <Check size={20} />
              </div>
              <h3 className="text-[22px] font-bold text-[var(--ink)]">{sec.title}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
                {sec.text}
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
        image={IMG.custom.machineFrames.next}
        nextUrl="/custom-steel-fabrication-pakistan/storage-tanks/"
        nextTitle="Storage Tanks"
      />
    </article>
  );
};

// 9.24 Storage Tanks — signature: "Curtain overlay"
export const StorageTanksLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const cards = sections.slice(0, 3).map((sec, idx) => ({
    num: String(idx + 1).padStart(2, "0"),
    title: sec.title,
    text: sec.text,
  }));

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.custom.tanks.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Desktop Curtain Overlay Section */}
      <div className="hidden lg:block relative min-h-[220vh] w-full">
        {/* Sticky Background Image Layer */}
        <div className="sticky top-0 h-screen w-full overflow-hidden z-0 bg-slate-900">
          <img
            src={IMG.custom.tanks.wide}
            alt="Steel Storage Tank Fabrication"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/35 pointer-events-none" />
        </div>

        {/* Floating Scrolling Cards */}
        <div className="container relative z-10 -mt-[100vh] pb-[20vh] space-y-[45vh] text-left">
          {cards.map((c, idx) => (
            <div
              key={c.num}
              className={`w-[480px] p-10 bg-white border border-[var(--rule)] shadow-2xl space-y-4 ${
                idx % 2 === 1 ? "ml-auto" : "mr-auto"
              }`}
            >
              <OutlineNum num={c.num} />
              <h3 className="text-[26px] font-bold text-[var(--ink)]">{c.title}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Stacked Section */}
      <div className="lg:hidden container py-12 space-y-8 text-left">
        <PhotoBox src={IMG.custom.tanks.wide} alt="Storage Tanks" ratio="16/9" />
        {cards.map((c) => (
          <div key={c.num} className="border border-[var(--rule)] p-6 bg-white space-y-3">
            <OutlineNum num={c.num} />
            <h3 className="text-[20px] font-bold text-[var(--ink)]">{c.title}</h3>
            <p className="text-[var(--grey-strong)] text-[14px] leading-[1.65]">{c.text}</p>
          </div>
        ))}
      </div>

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
        image={IMG.custom.tanks.next}
        nextUrl="/custom-steel-fabrication-pakistan/hoppers-and-bins/"
        nextTitle="Hoppers and Bins"
      />
    </article>
  );
};

// 9.25 Hoppers and Bins — signature: "Bento grid"
export const HoppersBinsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const sec1 = sections[0];
  const sec2 = sections[1];
  const sec3 = sections[2];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.custom.hoppers.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Desktop 12-column Bento Grid */}
      <section className="container py-[var(--sec-y-lg)]">
        <div className="hidden lg:grid grid-cols-12 gap-4 auto-rows-[minmax(260px,auto)] text-left">
          {/* Tile A: Image h1 (Cols 1-7, Rows 1-2) */}
          <div className="col-span-7 row-span-2 overflow-hidden bg-slate-900 shadow-md">
            <img src={IMG.custom.hoppers.h1} alt="Hopper Cone Structure" className="w-full h-full object-cover" />
          </div>

          {/* Tile B: Text What Hoppers and Bins Do (Cols 8-12, Row 1, Nav Blue bg) */}
          <div className="col-span-5 bg-[var(--blue)] text-white p-8 flex flex-col justify-center space-y-3 shadow-md">
            <h3 className="text-[24px] font-bold text-white">{sec1?.title || "What Hoppers and Bins Do"}</h3>
            <p className="text-white/90 text-[15px] leading-[1.65]">{sec1?.text}</p>
          </div>

          {/* Tile C: Image h2 (Cols 8-12, Row 2) */}
          <div className="col-span-5 overflow-hidden bg-slate-900 shadow-md">
            <img src={IMG.custom.hoppers.h2} alt="Bin on Steel Frame" className="w-full h-full object-cover" />
          </div>

          {/* Tile D: Text Design Points (Cols 1-5, Row 3) */}
          <div className="col-span-5 border border-[var(--rule)] bg-white p-8 flex flex-col justify-center space-y-3 shadow-sm">
            <h3 className="text-[22px] font-bold text-[var(--ink)]">{sec2?.title || "Design Points"}</h3>
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>{sec2?.text}</p>
          </div>

          {/* Tile E: Image h3 (Cols 6-8, Row 3) */}
          <div className="col-span-3 overflow-hidden bg-slate-900 shadow-md">
            <img src={IMG.custom.hoppers.h3} alt="Hopper Ladder Platform" className="w-full h-full object-cover" />
          </div>

          {/* Tile F: Text Typical Uses (Cols 9-12, Row 3, Nav Blue 4% bg) */}
          <div className="col-span-4 border border-[var(--rule)] bg-[rgba(30,58,138,0.04)] p-8 flex flex-col justify-center space-y-3 shadow-sm">
            <h3 className="text-[22px] font-bold text-[var(--ink)]">{sec3?.title || "Typical Uses"}</h3>
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>{sec3?.text}</p>
          </div>
        </div>

        {/* Mobile: 1 Column in sequence A -> F */}
        <div className="lg:hidden space-y-6 text-left">
          <PhotoBox src={IMG.custom.hoppers.h1} alt="Hopper Cone" ratio="16/9" />
          <div className="bg-[var(--blue)] text-white p-6">
            <h3 className="text-[20px] font-bold text-white mb-2">{sec1?.title}</h3>
            <p className="text-white/90 text-[14px] leading-[1.6]">{sec1?.text}</p>
          </div>
          <PhotoBox src={IMG.custom.hoppers.h2} alt="Bin Frame" ratio="16/9" />
          <div className="border border-[var(--rule)] p-6 bg-white">
            <h3 className="text-[20px] font-bold text-[var(--ink)] mb-2">{sec2?.title}</h3>
            <p className="text-[var(--grey-strong)] text-[14px] leading-[1.6]">{sec2?.text}</p>
          </div>
          <PhotoBox src={IMG.custom.hoppers.h3} alt="Platform" ratio="16/9" />
          <div className="border border-[var(--rule)] p-6 bg-[rgba(30,58,138,0.04)]">
            <h3 className="text-[20px] font-bold text-[var(--ink)] mb-2">{sec3?.title}</h3>
            <p className="text-[var(--grey-strong)] text-[14px] leading-[1.6]">{sec3?.text}</p>
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
        image={IMG.custom.hoppers.next}
        nextUrl="/custom-steel-fabrication-pakistan/steel-doors-and-gates/"
        nextTitle="Steel Doors and Gates"
      />
    </article>
  );
};

// 9.26 Doors and Gates — signature: "Door-open grid"
export const DoorsGatesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const typesSec = sections.find((s) => s.items && s.items.length >= 4) || sections[0];
  const items = typesSec?.items || [
    { name: "Sliding gates", text: "Top-hung and ground-track heavy security sliding gates for industrial compound entries." },
    { name: "Hinged gates", text: "Heavy-duty double-leaf hinged gates engineered for high daily vehicle cycles." },
    { name: "Rolling doors", text: "Motorized steel roller shutters engineered to withstand wind velocity and frequent use." },
    { name: "Personnel doors", text: "Insulated fire-rated steel entry doors fitted with panic hardware and mortise locks." },
  ];
  const images = [IMG.custom.doors.d1, IMG.custom.doors.d2, IMG.custom.doors.d3, IMG.custom.doors.d4];

  const note1 = sections[1] || sections[0];
  const note2 = sections[2] || sections[1];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.custom.doors.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Types: 2x2 Grid with Door-Open Visual Effect */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <h2 className="font-bold text-[var(--ink)] mb-10" style={{ fontSize: "var(--fs-h2)" }}>
          {typesSec?.title || "Types"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {items.map((item, idx) => (
            <div key={idx} className="group border-t border-[var(--rule)] pt-6 space-y-4">
              <div className="w-full aspect-[4/3] overflow-hidden bg-slate-900 relative shadow-md">
                <img
                  src={images[idx] || images[0]}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <OutlineNum num={idx + 1} />
              <h3 className="text-[24px] font-bold text-[var(--ink)]">{item.name}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Notes: 2 Columns on Nav Blue 4% Background */}
      <section className="w-full bg-[rgba(30,58,138,0.04)] py-[var(--sec-y)] border-t border-b border-[var(--rule)]">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-12 divide-y md:divide-y-0 md:divide-x divide-[var(--rule)] text-left">
          <div className="space-y-4 pr-0 md:pr-8">
            <h3 className="text-[24px] font-bold text-[var(--ink)]">{note1?.title || "Design Points"}</h3>
            <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>
              {note1?.text}
            </p>
          </div>
          <div className="space-y-4 pt-8 md:pt-0 pl-0 md:pl-8">
            <h3 className="text-[24px] font-bold text-[var(--ink)]">{note2?.title || "Fitted to Your Building"}</h3>
            <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>
              {note2?.text}
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
        image={IMG.custom.doors.next}
        nextUrl="/custom-steel-fabrication-pakistan/steel-stairs/"
        nextTitle="Steel Stairs"
      />
    </article>
  );
};

// 9.27 Steel Stairs — signature: "Ascending steps"
export const SteelStairsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const typesSec = sections.find((s) => s.items && s.items.length >= 5) || sections[0];
  const items = typesSec?.items || [
    { name: "Straight stairs", text: "Simple industrial run between ground floor and elevated equipment decks." },
    { name: "Switchback stairs", text: "Compact two-flight stairways with intermediate landings for mezzanines." },
    { name: "Spiral stairs", text: "Tight radius circular access stairs saving crucial floor area around towers." },
    { name: "Ladders and cages", text: "OSHA-compliant safety caged vertical access ladders for roof inspection." },
    { name: "Platforms and walkways", text: "Non-slip grating walkways with guardrails connecting distant machinery." },
  ];
  const images = [IMG.custom.stairs.s1, IMG.custom.stairs.s2, IMG.custom.stairs.s3, IMG.custom.stairs.s4, IMG.custom.stairs.s5];

  const note1 = sections[1];
  const note2 = sections[2];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.custom.stairs.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Ascending Steps Section (Desktop: Rising Staircase Alignment) */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <h2 className="font-bold text-[var(--ink)] mb-12" style={{ fontSize: "var(--fs-h2)" }}>
          {typesSec?.title || "Types"}
        </h2>

        {/* Desktop 1280px+ Staircase Rise */}
        <div className="hidden xl:flex items-end gap-6 pt-32 pb-8">
          {items.map((it, idx) => (
            <div
              key={idx}
              className="flex-1 border-t border-[var(--rule)] pt-6 space-y-4"
              style={{ transform: `translateY(-${idx * 48}px)` }}
            >
              <PhotoBox src={images[idx] || images[0]} alt={it.name} ratio="4/5" className="mb-3" />
              <OutlineNum num={idx + 1} />
              <h3 className="text-[19px] font-bold text-[var(--ink)]">{it.name}</h3>
              <p className="text-[var(--grey-strong)] text-[14px] leading-[1.6]">{it.text}</p>
            </div>
          ))}
        </div>

        {/* Tablet / Medium Screens: 3+2 Grid */}
        <div className="hidden md:grid xl:hidden grid-cols-3 gap-8">
          {items.map((it, idx) => (
            <div key={idx} className="border-t border-[var(--rule)] pt-6 space-y-4">
              <PhotoBox src={images[idx] || images[0]} alt={it.name} ratio="4/5" className="mb-3" />
              <OutlineNum num={idx + 1} />
              <h3 className="text-[20px] font-bold text-[var(--ink)]">{it.name}</h3>
              <p className="text-[var(--grey-strong)] text-[14px] leading-[1.6]">{it.text}</p>
            </div>
          ))}
        </div>

        {/* Mobile: Clean Stacked with Indent */}
        <div className="md:hidden space-y-8">
          {items.map((it, idx) => (
            <div
              key={idx}
              className="border-t border-[var(--rule)] pt-6 space-y-3"
              style={{ marginLeft: `${Math.min(idx * 6, 24)}px` }}
            >
              <PhotoBox src={images[idx] || images[0]} alt={it.name} ratio="16/9" />
              <OutlineNum num={idx + 1} />
              <h3 className="text-[19px] font-bold text-[var(--ink)]">{it.name}</h3>
              <p className="text-[var(--grey-strong)] text-[14px] leading-[1.6]">{it.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Notes: 2 Columns */}
      {(note1 || note2) && (
        <section className="container pb-[var(--sec-y-lg)] border-t border-[var(--rule)] pt-12 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 divide-y md:divide-y-0 md:divide-x divide-[var(--rule)]">
            {note1 && (
              <div className="space-y-4 pr-0 md:pr-8">
                <h3 className="text-[24px] font-bold text-[var(--ink)]">{note1.title}</h3>
                <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>{note1.text}</p>
              </div>
            )}
            {note2 && (
              <div className="space-y-4 pt-8 md:pt-0 pl-0 md:pl-8">
                <h3 className="text-[24px] font-bold text-[var(--ink)]">{note2.title}</h3>
                <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>{note2.text}</p>
              </div>
            )}
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
        image={IMG.custom.stairs.next}
        nextUrl="/services/design/"
        nextTitle="Design Services"
      />
    </article>
  );
};
