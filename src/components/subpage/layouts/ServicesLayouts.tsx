// Services Sub-pages Signature Layouts (9.28 - 9.34)
import React, { useState, useEffect, useRef } from "react";
import { ContentData, ContentBlock } from "../../../content/types.ts";
import { IMG } from "../../../data/subpageImages.ts";
import { PhotoBox } from "../../page/PhotoBox.tsx";
import { OutlineNum } from "../../page/OutlineNum.tsx";
import { SplitIntro } from "../../page/SplitIntro.tsx";
import { HeroBand } from "../../ui/HeroBand.tsx";
import { Accordion } from "../../ui/Accordion.tsx";
import { NextBand } from "../../ui/NextBand.tsx";
import { SITE } from "../../../data/site.ts";
import {
  Wrench,
  PaintRoller,
  MoveHorizontal,
  SquarePlus,
  ClipboardCheck,
  ArrowUpRight,
  CheckSquare2,
} from "lucide-react";

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

// 9.28 Design — signature: "Blueprint canvas"
export const DesignLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const row2Blocks = sections.slice(1, 4);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.design.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Blueprint Grid Canvas Section */}
      <section
        className="w-full py-[var(--sec-y-lg)] relative"
        style={{
          backgroundImage:
            "radial-gradient(rgba(30,58,138,0.12) 1px, transparent 1px), radial-gradient(rgba(30,58,138,0.06) 1px, #FFFFFF 1px)",
          backgroundSize: "32px 32px",
          backgroundPosition: "0 0, 16px 16px",
        }}
      >
        <div className="container space-y-20 text-left">
          {/* Row 1: 5fr / 7fr Grid with Framed Blueprint */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-[28px] lg:text-[36px] font-bold text-[var(--ink)]">
                {sections[0]?.title || "What Design Covers"}
              </h2>
              <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-lead)" }}>
                {sections[0]?.text || introPs.join(" ")}
              </p>
            </div>

            <div className="lg:col-span-7 relative p-4">
              <div className="relative border-2 border-[var(--blue)] p-3 bg-white shadow-xl">
                <img
                  src={IMG.services.design.d1}
                  alt="3D BIM Structural Model and Plan"
                  className="w-full aspect-[3/2] object-cover"
                />
                {/* 4 Corner Crosses */}
                <span className="absolute -top-2.5 -left-2.5 text-[var(--blue)] text-[18px] font-mono leading-none">+</span>
                <span className="absolute -top-2.5 -right-2.5 text-[var(--blue)] text-[18px] font-mono leading-none">+</span>
                <span className="absolute -bottom-2.5 -left-2.5 text-[var(--blue)] text-[18px] font-mono leading-none">+</span>
                <span className="absolute -bottom-2.5 -right-2.5 text-[var(--blue)] text-[18px] font-mono leading-none">+</span>
              </div>
            </div>
          </div>

          {/* Row 2: 3 Columns with Corner Crosses */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {row2Blocks.map((blk, idx) => (
              <div
                key={idx}
                className="relative bg-white border border-[var(--rule)] p-8 space-y-4 shadow-sm"
              >
                <span className="absolute -top-2 -left-2 text-[var(--blue)] text-[14px] font-mono leading-none">+</span>
                <span className="absolute -top-2 -right-2 text-[var(--blue)] text-[14px] font-mono leading-none">+</span>
                <OutlineNum num={idx + 1} />
                <h3 className="text-[22px] font-bold text-[var(--ink)]">{blk.title}</h3>
                <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
                  {blk.text}
                </p>
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
        image={IMG.services.design.next}
        nextUrl="/services/detailing/"
        nextTitle="Detailing Services"
      />
    </article>
  );
};

// 9.29 Detailing — signature: "Drawing register"
export const DetailingLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const drawingsSec = sections.find((s) => s.items && s.items.length >= 4) || sections[1];
  const drawingRows = drawingsSec?.items || [
    { name: "Fabrication drawings", text: "Detailed part geometry, plate cuts, holes, stiffeners, and weld symbols for the shop floor." },
    { name: "Cutting lists", text: "Material nesting plans optimizing steel plate and beam utilization, minimizing scrap waste." },
    { name: "Erection drawings", text: "Step-by-step match-marked assembly maps guiding field cranes and bolting crews." },
    { name: "Anchor bolt plans", text: "Precise setting templates delivered before foundation pouring to ensure exact alignment." },
  ];

  const note1 = sections[2] || sections[0];
  const note2 = sections[3] || sections[1];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.detailing.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Intro */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <SplitIntro
          title={sections[0]?.title || "What Detailing Is"}
          lead={introPs[0]}
          text={sections[0]?.text || introPs.slice(1)}
        />
      </section>

      {/* Drawing Register */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <h2 className="font-bold text-[var(--ink)] mb-10" style={{ fontSize: "var(--fs-h2)" }}>
          {drawingsSec?.title || "Drawings Produced"}
        </h2>

        <div className="border-t border-[var(--rule)] divide-y divide-[var(--rule)]">
          {drawingRows.map((dr, idx) => (
            <div
              key={idx}
              className="py-8 grid grid-cols-12 gap-6 items-baseline transition-all duration-300 hover:bg-[rgba(30,58,138,0.03)] px-4"
            >
              <div className="col-span-12 sm:col-span-1">
                <span className="text-[16px] font-mono font-bold text-[var(--blue)]">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="col-span-12 sm:col-span-4 flex items-center justify-between">
                <h3 className="text-[22px] font-bold text-[var(--ink)] tracking-tight">
                  {dr.name}
                </h3>
                <ArrowUpRight size={18} className="text-[var(--blue)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="col-span-12 sm:col-span-7">
                <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
                  {dr.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notes (2 Columns with 48px rules) */}
      <section className="container pb-[var(--sec-y-lg)] text-left border-t border-[var(--rule)] pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
          <div className="space-y-4">
            <div className="w-12 h-[2px] bg-[var(--blue)]" />
            <h3 className="text-[24px] font-bold text-[var(--ink)]">{note1?.title}</h3>
            <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>{note1?.text}</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-[2px] bg-[var(--blue)]" />
            <h3 className="text-[24px] font-bold text-[var(--ink)]">{note2?.title}</h3>
            <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>{note2?.text}</p>
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
        image={IMG.services.detailing.next}
        nextUrl="/services/fabrication/"
        nextTitle="Fabrication Services"
      />
    </article>
  );
};

// 9.30 Fabrication — signature: "Pinned filmstrip"
export const FabricationLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const stepsSec = sections.find((s) => s.items && s.items.length >= 6) || sections[0];
  const steps = stepsSec?.items || [
    { name: "Material check", text: "Inspecting steel mill test certificates, thickness, and ultrasonic integrity." },
    { name: "Cutting", text: "High-precision CNC oxy-fuel and plasma profiling of web and flange plates." },
    { name: "Drilling", text: "Multi-spindle automatic drilling of connection bolt patterns to millimeter accuracy." },
    { name: "Fitting", text: "Tack-welding webs, flanges, end plates, and stiffeners in precision alignment jigs." },
    { name: "Welding", text: "Continuous submerged arc welding (SAW) of built-up beams with certified welders." },
    { name: "Cleaning and painting", text: "Abrasive blast cleaning to SA 2.5 profile followed by primer and intermediate coating." },
    { name: "Marking and packing", text: "Tagging each component with unique erection mark and bundling in field installation order." },
  ];
  const images = [
    IMG.services.fabrication.f1,
    IMG.services.fabrication.f2,
    IMG.services.fabrication.f3,
    IMG.services.fabrication.f4,
    "", // Step 05 Welding has no photo
    IMG.services.fabrication.f6,
    IMG.services.fabrication.f7,
  ];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.fabrication.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Intro */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <SplitIntro
          title={sections[0]?.title || "What Fabrication Covers"}
          lead={introPs[0]}
          text={sections[0]?.text || introPs.slice(1)}
        />
      </section>

      {/* Filmstrip Panels (Horizontal Scrolling / Drag Track) */}
      <section className="w-full pb-[var(--sec-y-lg)] overflow-hidden text-left">
        <div className="container mb-6 flex justify-between items-baseline">
          <h2 className="font-bold text-[var(--ink)]" style={{ fontSize: "var(--fs-h2)" }}>
            Fabrication Process
          </h2>
          <span className="text-[13px] font-mono text-[var(--blue)] font-bold">01 / 07 STEPS</span>
        </div>

        <div
          data-lenis-prevent=""
          className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory px-[var(--gutter)] pb-4"
        >
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[85vw] sm:w-[480px] lg:w-[560px] snap-start border border-[var(--rule)] bg-white p-6 space-y-4"
            >
              {idx === 4 ? (
                /* Step 05 Welding (no photo): nav blue card */
                <div className="w-full aspect-[3/2] bg-[var(--blue)] flex items-center justify-center p-8 text-white">
                  <div className="text-center space-y-2">
                    <span className="font-bold text-[48px] text-white/30 block">05</span>
                    <span className="text-[20px] font-bold uppercase tracking-wider block">Submerged Arc Welding</span>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-[3/2] overflow-hidden bg-slate-900 shadow-sm">
                  <img
                    src={images[idx]}
                    alt={st.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <OutlineNum num={idx + 1} />
              <h3 className="text-[22px] font-bold text-[var(--ink)]">{st.name}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {st.text}
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
        image={IMG.services.fabrication.next}
        nextUrl="/services/cleaning/"
        nextTitle="Cleaning Services"
      />
    </article>
  );
};

// 9.31 Cleaning — signature: "Blast reveal + inspection sheet"
export const CleaningLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const checklist = sections.slice(1, 5);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.cleaning.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Intro */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <SplitIntro
          title={sections[0]?.title || "Why Cleaning Comes First"}
          lead={introPs[0]}
          text={sections[0]?.text || introPs.slice(1)}
        />
      </section>

      {/* Blast Reveal Image */}
      <section className="container pb-[var(--sec-y-lg)]">
        <div className="w-full aspect-[21/9] overflow-hidden bg-slate-900 shadow-md">
          <img
            src={IMG.services.cleaning.c1}
            alt="Abrasive Blast Cleaning of Steel Surface"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Inspection Sheet (2x2 Grid with Checkboxes) */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {checklist.map((sec, idx) => (
            <div key={idx} className="border-t border-[var(--rule)] pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded bg-[var(--blue)] text-white flex items-center justify-center">
                  <CheckSquare2 size={16} />
                </div>
                <h3 className="text-[22px] font-bold text-[var(--ink)]">{sec.title}</h3>
              </div>
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
        image={IMG.services.cleaning.next}
        nextUrl="/services/painting/"
        nextTitle="Painting Services"
      />
    </article>
  );
};

// 9.32 Painting — signature: "Paint-wipe long-form"
export const PaintingLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const chooseSec = sections.find((s) => s.items && s.items.length >= 4) || sections[2];
  const chooseItems = chooseSec?.items || [
    { name: "Dry indoor buildings", text: "Standard single or dual-coat alkyd zinc phosphate primer system." },
    { name: "Outdoor structures", text: "Epoxy zinc-rich primer with high-build polyurethane topcoat UV protection." },
    { name: "Dairy and poultry sheds", text: "Chemical-resistant epoxy barriers resisting aggressive ammonia emissions." },
    { name: "Grain stores and tanks", text: "Food-grade non-toxic epoxy coatings approved for grain contact." },
  ];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.painting.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)] text-left">
        {/* Centered Prose Column */}
        <div className="max-w-[720px] mx-auto space-y-12">
          {/* Block 1 */}
          <div className="space-y-4">
            <h2 className="text-[28px] lg:text-[34px] font-bold text-[var(--ink)]">
              {sections[0]?.title || "Why the Coating Matters"}
            </h2>
            <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-lead)" }}>
              {sections[0]?.text}
            </p>
          </div>

          {/* Block 2 */}
          <div className="space-y-4">
            <h2 className="text-[26px] font-bold text-[var(--ink)]">
              {sections[1]?.title || "What a Coating System Is"}
            </h2>
            <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>
              {sections[1]?.text}
            </p>
          </div>
        </div>

        {/* Wipe Band 1 (p1) */}
        <div className="my-16 w-full aspect-[21/9] overflow-hidden bg-slate-900 shadow-md">
          <img src={IMG.services.painting.p1} alt="Primer Coating Application" className="w-full h-full object-cover" />
        </div>

        {/* Choosing by Use Grid (Breaks out to container) */}
        <div className="my-16 space-y-8">
          <h2 className="text-[26px] lg:text-[32px] font-bold text-[var(--ink)]">
            {chooseSec?.title || "Choosing by Use"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {chooseItems.map((it, idx) => (
              <div key={idx} className="border-t border-[var(--rule)] pt-6 space-y-3">
                <OutlineNum num={idx + 1} />
                <h3 className="text-[22px] font-bold text-[var(--ink)]">{it.name}</h3>
                <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>{it.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wipe Band 2 (p2) */}
        <div className="my-16 w-full aspect-[21/9] overflow-hidden bg-slate-900 shadow-md">
          <img src={IMG.services.painting.p2} alt="Intermediate Epoxy Coating" className="w-full h-full object-cover" />
        </div>

        {/* Remaining Prose */}
        <div className="max-w-[720px] mx-auto space-y-12">
          {sections.slice(3, 5).map((sec, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-[26px] font-bold text-[var(--ink)]">{sec.title}</h2>
              <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>{sec.text}</p>
            </div>
          ))}
        </div>

        {/* Wipe Band 3 (p3) */}
        <div className="my-16 w-full aspect-[21/9] overflow-hidden bg-slate-900 shadow-md">
          <img src={IMG.services.painting.p3} alt="Final Polyurethane Topcoat Finish" className="w-full h-full object-cover" />
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
        image={IMG.services.painting.next}
        nextUrl="/services/erection/"
        nextTitle="Erection Services"
      />
    </article>
  );
};

// 9.33 Erection — signature: "Crane-hook rail"
export const ErectionLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const stepsSec = sections.find((s) => s.items && s.items.length >= 6) || sections[0];
  const steps = stepsSec?.items || [
    { name: "Site check", text: "Verifying foundation survey coordinates, anchor bolt elevations and crane access paths." },
    { name: "Lifting plan", text: "Rigging calculations determining crane capacity, radius, and tandem lift safety." },
    { name: "Frames", text: "Standing primary portal frame columns and assembling rafters into rigid bents." },
    { name: "Bracing and secondary members", text: "Installing cable bracing, fly braces, purlins and girts to lock structural geometry." },
    { name: "Alignment", text: "Plumb line laser alignment and torquing high-strength connection bolts." },
    { name: "Sheeting and accessories", text: "Fastening insulated roof and wall sandwich panels, ridge monitors, and skylights." },
    { name: "Touch-up and handover", text: "Paint coating inspection, field bolt touch-up, and client commissioning sign-off." },
  ];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.erection.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Intro */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <SplitIntro
          title={sections[0]?.title || "What Erection Includes"}
          lead={introPs[0]}
          text={sections[0]?.text || introPs.slice(1)}
        />
      </section>

      {/* Crane Hook Rail (Vertical Progress Axis) */}
      <section className="container pb-[var(--sec-y-lg)] text-left relative">
        {/* Desktop Vertical Center Line with alternating steps */}
        <div className="hidden lg:block relative">
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-[var(--rule)]" />
          <div className="space-y-16">
            {steps.map((st, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div key={idx} className="grid grid-cols-12 gap-10 items-center">
                  <div className={`col-span-5 ${isEven ? "order-1 text-right" : "order-1"}`}>
                    {!isEven && (
                      <div className="space-y-3">
                        <OutlineNum num={idx + 1} />
                        <h3 className="text-[26px] font-bold text-[var(--ink)]">{st.name}</h3>
                        <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>{st.text}</p>
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 flex justify-center order-2">
                    <div className="w-4 h-4 rounded-full bg-[var(--blue)] ring-4 ring-white shadow-md" />
                  </div>
                  <div className={`col-span-5 ${isEven ? "order-3" : "order-3"}`}>
                    {isEven && (
                      <div className="space-y-3">
                        <OutlineNum num={idx + 1} />
                        <h3 className="text-[26px] font-bold text-[var(--ink)]">{st.name}</h3>
                        <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>{st.text}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Left Rail */}
        <div className="lg:hidden relative pl-8 border-l-2 border-[var(--blue)] space-y-12">
          {steps.map((st, idx) => (
            <div key={idx} className="relative space-y-2">
              <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-[var(--blue)] ring-4 ring-white" />
              <OutlineNum num={idx + 1} />
              <h3 className="text-[20px] font-bold text-[var(--ink)]">{st.name}</h3>
              <p className="text-[var(--grey-strong)] text-[14px] leading-[1.65]">{st.text}</p>
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

      {/* Next Banner: Blue Classic Banner without image as per prompt */}
      <NextBand
        nextUrl="/services/after-sale-services/"
        nextTitle="After Sale Services"
      />
    </article>
  );
};

// 9.34 After Sale Services — signature: "Support desk"
export const AfterSaleLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const cardsSec = sections[1];
  const serviceCards = [
    { icon: Wrench, name: "Repairs", text: "Immediate structural repairs for accidental crane or forklift impact damage." },
    { icon: PaintRoller, name: "Repainting", text: "Periodic recoating and touch-up maintaining anti-corrosion barrier integrity." },
    { icon: MoveHorizontal, name: "Extensions", text: "Adding building length bays or connecting lean-tos using original anchor points." },
    { icon: SquarePlus, name: "Additions", text: "Retrofitting mezzanines, crane brackets, roof monitors, and partition walls." },
    { icon: ClipboardCheck, name: "Checks", text: "Annual structural inspections verifying bolt torques and foundation alignment." },
  ];

  const whyEasySec = sections[2];
  const supportSec = sections[3];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.afterSale.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Intro */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <SplitIntro
          title={sections[0]?.title || "Why After Sale Support Matters"}
          lead={introPs[0]}
          text={sections[0]?.text || introPs.slice(1)}
        />
      </section>

      {/* 5 Service Icon Cards */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <h2 className="font-bold text-[var(--ink)] mb-10" style={{ fontSize: "var(--fs-h2)" }}>
          {cardsSec?.title || "What Steel Mind Engineers Provides"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {serviceCards.map((sc, idx) => {
            const Icon = sc.icon;
            return (
              <div
                key={idx}
                className="group border border-[var(--rule)] bg-white p-8 space-y-4 transition-all duration-300 hover:bg-[var(--blue)] hover:text-white"
              >
                <div className="w-12 h-12 rounded-lg bg-[rgba(30,58,138,0.08)] text-[var(--blue)] flex items-center justify-center group-hover:bg-white group-hover:text-[var(--blue)] transition-colors">
                  <Icon size={24} />
                </div>
                <h3 className="text-[20px] font-bold text-[var(--ink)] group-hover:text-white transition-colors">
                  {sc.name}
                </h3>
                <p className="text-[var(--grey-strong)] group-hover:text-white/90 text-[14px] leading-[1.6] transition-colors">
                  {sc.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Wide Image */}
      <section className="container pb-[var(--sec-y-lg)]">
        <div className="w-full aspect-[64/27] overflow-hidden bg-slate-900 shadow-md">
          <img
            src={IMG.services.afterSale.wide}
            alt="Ongoing Support and Factory Maintenance"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Why Add Easily (2 Columns) */}
      {whyEasySec && (
        <section className="container pb-[var(--sec-y-lg)] text-left border-t border-[var(--rule)] pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <h2 className="text-[26px] lg:text-[34px] font-bold text-[var(--ink)]">
                {whyEasySec.title}
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>
                {whyEasySec.text}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Support Band (Full Width Nav Blue with direct phone buttons) */}
      <section className="w-full bg-[var(--blue)] text-white py-[var(--sec-y-lg)]">
        <div className="container text-left space-y-8">
          <h2 className="text-[28px] lg:text-[38px] font-bold text-white">
            {supportSec?.title || "How to Ask for Support"}
          </h2>
          <p className="text-white/90 text-[16px] lg:text-[18px] leading-[1.7] max-w-[800px]">
            {supportSec?.text || "Call our service engineers directly with your project location and building details."}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href={`tel:${SITE.tel[0]}`}
              className="btn btn-light btn-sm"
            >
              <span>Call Engineer: {SITE.phones[0]}</span>
              <span className="btn-arrow">→</span>
            </a>
            <a
              href={`tel:${SITE.tel[1]}`}
              className="btn btn-light btn-sm"
            >
              <span>Call Office: {SITE.phones[1]}</span>
              <span className="btn-arrow">→</span>
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="btn btn-outline border-white text-white hover:bg-white hover:text-[var(--blue)] btn-sm"
            >
              <span>Email: {SITE.email}</span>
            </a>
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
        image={IMG.services.afterSale.next}
        nextUrl="/projects/"
        nextTitle="Our Projects"
      />
    </article>
  );
};
