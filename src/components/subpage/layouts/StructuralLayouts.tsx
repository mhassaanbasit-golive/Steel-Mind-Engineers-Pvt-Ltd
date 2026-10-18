// Structural Steel Fabrication Division Signature Layouts (9.18 - 9.22)
import React, { useState } from "react";
import { ContentData } from "../../../content/types.ts";
import { IMG } from "../../../data/subpageImages.ts";
import { PhotoBox } from "../../page/PhotoBox.tsx";
import { OutlineNum } from "../../page/OutlineNum.tsx";
import { SplitIntro } from "../../page/SplitIntro.tsx";
import { HeroBand } from "../../ui/HeroBand.tsx";
import { Accordion } from "../../ui/Accordion.tsx";
import { NextBand } from "../../ui/NextBand.tsx";
import { TransitionLink } from "../../ui/TransitionLink.tsx";

// 9.18 Columns and Beams — signature: "Type cards + split rows"
export const ColumnsBeamsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const types = [
    { name: "Rolled Sections", desc: "Standard I-beams and universal columns procured from certified prime steel mills.", img: IMG.structural.columnsBeams.c1 },
    { name: "Built-up Sections", desc: "Heavy plate welded H-sections fabricated with automated submerged arc welding.", img: IMG.structural.columnsBeams.c2 },
    { name: "Box Sections", desc: "Hollow structural steel box columns providing equal resistance along both principal axes.", img: IMG.structural.columnsBeams.c3 },
  ];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.structural.columnsBeams.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        <SplitIntro
          title="The Role of Columns and Beams"
          lead="Columns transmit high vertical gravitational forces to foundation pile caps, while floor and crane beams carry heavy bending moments."
          text="Every steel member is manufactured to strict millimeter dimensional tolerances in our Lahore fabrication plant."
        />
      </section>

      {/* Type cards */}
      <section className="container pb-[var(--sec-y-lg)]">
        <h2 className="font-bold text-[var(--ink)] mb-8 text-left" style={{ fontSize: "var(--fs-h2)" }}>
          Types Fabricated
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {types.map((t, idx) => (
            <div key={idx} className="border border-[var(--rule)] p-6 bg-white space-y-4">
              <PhotoBox src={t.img} alt={t.name} ratio="3/4" />
              <OutlineNum num={idx + 1} />
              <h3 className="text-[22px] font-bold text-[var(--ink)]">{t.name}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Split row 1 */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-2 items-center bg-slate-50 border-t border-[var(--rule)]">
        <div className="w-full h-full min-h-[420px] overflow-hidden">
          <img
            src={IMG.structural.columnsBeams.c4}
            alt="How Steel Mind Engineers Fabricates"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-10 lg:p-20 text-left max-w-[560px]">
          <h3 className="text-[32px] font-bold text-[var(--ink)] mb-4">
            How Steel Mind Engineers Fabricates
          </h3>
          <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
            Computer-controlled plasma cutting, automatic hydraulic flange straightening, and dual-wire submerged arc welding ensure flawless structural steel assembly.
          </p>
        </div>
      </section>

      {/* Split row 2 */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-2 items-center bg-white border-y border-[var(--rule)]">
        <div className="p-10 lg:p-20 text-left max-w-[560px] lg:order-1 order-2">
          <h3 className="text-[32px] font-bold text-[var(--ink)] mb-4">
            Accuracy Matters
          </h3>
          <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
            Precise hole pitch alignment and end-milling ensure rapid bolt-up assembly at the project site without torch-cutting or forced fitting.
          </p>
        </div>
        <div className="w-full h-full min-h-[420px] overflow-hidden lg:order-2 order-1">
          <img
            src={IMG.structural.columnsBeams.c5}
            alt="Accuracy Matters"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

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
        image={IMG.structural.columnsBeams.next}
        nextUrl="/structural-steel-fabrication-pakistan/trusses/"
        nextTitle="Trusses"
      />
    </article>
  );
};

// 9.19 Trusses — signature: "Center-axis sticky viewer"
export const TrussesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const trussItems = [
    { num: "01", title: "What a Truss Is", text: "A triangulated framework of structural steel members acting primarily in axial tension or compression.", img: IMG.structural.trusses.t1 },
    { num: "02", title: "Where Trusses Are Used", text: "Long-span stadium arenas, auditorium halls, industrial shed roofs, and conveyor bridges.", img: IMG.structural.trusses.t2 },
    { num: "03", title: "Common Truss Types", text: "Pratt, Warren, Howe, Bowstring, and pitched triangular roof trusses engineered for optimal load paths.", img: IMG.structural.trusses.t3 },
    { num: "04", title: "Tubes or Angles", text: "Hollow structural steel (SHS/RHS) or back-to-back angle profiles connected by heavy gusset plates.", img: IMG.structural.trusses.t4 },
    { num: "05", title: "Delivery and Erection", text: "Shop fabricated in modular transportable lengths and bolted together at site for tandem crane tandem lifts.", img: IMG.structural.trusses.t5 },
  ];

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
        {/* Desktop 3-column center axis */}
        <div className="hidden lg:grid grid-cols-[1fr_420px_1fr] gap-12 items-start">
          {/* Left blocks: 1, 3, 5 */}
          <div className="space-y-40 text-right pr-6">
            {[trussItems[0], trussItems[2], trussItems[4]].map((item, idx) => (
              <div
                key={item.num}
                onMouseEnter={() => setActiveIdx(idx * 2)}
                className="space-y-3 cursor-pointer"
              >
                <OutlineNum num={item.num} active={activeIdx === idx * 2} />
                <h3 className="text-[26px] font-bold text-[var(--ink)]">{item.title}</h3>
                <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Center sticky viewer */}
          <div
            className="sticky overflow-hidden border border-[var(--rule)] shadow-lg aspect-[3/4]"
            style={{ top: "calc(var(--nav-offset, 88px) + 24px)" }}
          >
            {trussItems.map((item, idx) => (
              <img
                key={item.num}
                src={item.img}
                alt={item.title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  activeIdx === idx ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>

          {/* Right blocks: 2, 4 */}
          <div className="space-y-40 text-left pl-6 pt-32">
            {[trussItems[1], trussItems[3]].map((item, idx) => (
              <div
                key={item.num}
                onMouseEnter={() => setActiveIdx(idx * 2 + 1)}
                className="space-y-3 cursor-pointer"
              >
                <OutlineNum num={item.num} active={activeIdx === idx * 2 + 1} />
                <h3 className="text-[26px] font-bold text-[var(--ink)]">{item.title}</h3>
                <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile / tablet stacked */}
        <div className="lg:hidden space-y-12">
          {trussItems.map((item) => (
            <div key={item.num} className="border border-[var(--rule)] p-6 text-left bg-white">
              <PhotoBox src={item.img} alt={item.title} ratio="16/9" className="mb-4" />
              <OutlineNum num={item.num} />
              <h3 className="text-[22px] font-bold text-[var(--ink)] mt-2 mb-2">{item.title}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

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
        image={IMG.structural.trusses.next}
        nextUrl="/structural-steel-fabrication-pakistan/mezzanine-floors/"
        nextTitle="Mezzanine Floors"
      />
    </article>
  );
};

// 9.20 Mezzanine Floors — signature: "Sliding floor bands"
export const MezzanineFloorsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const bands = [
    { num: "01", title: "What This Page Covers", text: "Structural steel mezzanine floors engineered and fabricated to carry heavy pallet loads and machine equipment.", img: IMG.structural.mezzFloors.m1 },
    { num: "02", title: "Where Mezzanines Help", text: "Doubles floor space in existing factories without ground foundation alterations or civil construction downtime.", img: IMG.structural.mezzFloors.m2 },
    { num: "03", title: "What Steel Mind Provides", text: "Complete structural package: columns, primary beams, secondary joists, steel decking, staircases, and handrails.", img: IMG.structural.mezzFloors.m3 },
    { num: "04", title: "Project Reference", text: "Over 32,400 sq ft industrial mezzanine floor successfully fabricated and installed for Haier Pakistan at Raiwind.", img: IMG.structural.mezzFloors.m4 },
    { num: "05", title: "What to Send for a Quote", text: "Target floor area, required clear height under beams, and live load per square meter (e.g., 500 kg/m² to 1,500 kg/m²).", img: IMG.structural.mezzFloors.m5 },
  ];

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
          <div key={b.num} className="border-t border-[var(--rule)] pt-8 space-y-6 text-left">
            <PhotoBox src={b.img} alt={b.title} ratio="21/9" />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-5 flex items-baseline gap-4">
                <OutlineNum num={b.num} />
                <h3 className="text-[26px] font-bold text-[var(--ink)]">{b.title}</h3>
              </div>
              <div className="md:col-span-7">
                <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
                  {b.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

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
        image={IMG.structural.mezzFloors.next}
        nextUrl="/structural-steel-fabrication-pakistan/steel-bridges/"
        nextTitle="Steel Bridges"
      />
    </article>
  );
};

// 9.21 Steel Bridges — signature: "Span diagram"
export const SteelBridgesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.structural.bridges.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)] text-center">
        <h2 className="font-bold text-[var(--ink)] max-w-[680px] mx-auto mb-4" style={{ fontSize: "var(--fs-h2)" }}>
          Why Steel for Bridges
        </h2>
        <p className="max-w-[680px] mx-auto text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-lead)" }}>
          High strength-to-weight ratio allows long spans with minimal piers, rapid site installation, and superior seismic resilience.
        </p>
      </section>

      {/* Wide band: 100vw */}
      <section className="w-full overflow-hidden">
        <PhotoBox src={IMG.structural.bridges.wide} alt="Steel Bridge Wide View" ratio="21/9" />
      </section>

      {/* Span diagram */}
      <section className="container py-[var(--sec-y-lg)]">
        {/* SVG bridge hanger line */}
        <div className="w-full h-12 flex justify-between items-center relative mb-8">
          <div className="w-full h-[2px] bg-[var(--blue)]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="space-y-3">
            <OutlineNum num="01" />
            <h3 className="text-[22px] font-bold text-[var(--ink)]">What We Fabricate</h3>
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
              Pedestrian footbridges, plant pipeline conveyor spans, and heavy highway plate girder overpasses.
            </p>
          </div>
          <div className="space-y-3">
            <OutlineNum num="02" />
            <h3 className="text-[22px] font-bold text-[var(--ink)]">Design Points</h3>
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
              AASHTO / AISC code compliance, wind dynamic resonance calculations, and certified non-destructive weld testing.
            </p>
          </div>
          <div className="space-y-3">
            <OutlineNum num="03" />
            <h3 className="text-[22px] font-bold text-[var(--ink)]">Project Reference</h3>
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
              150-foot water requirement steel bridge fabricated and erected for M/S Yascon at Petaro Cantt, Sindh.
            </p>
          </div>
        </div>
      </section>

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
        image={IMG.structural.bridges.next}
        nextUrl="/structural-steel-fabrication-pakistan/crane-gantry-structures/"
        nextTitle="Crane Gantry Structures"
      />
    </article>
  );
};

// 9.22 Crane Gantry Structures — signature: "Anatomy triptych + compare band"
export const CraneGantryLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.structural.gantry.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        <SplitIntro
          title="What a Gantry Structure Is"
          lead="Free-standing outdoor structural steel frame carrying heavy traveling cranes in storage yards and rail sidings."
          text="Rigid A-frame portal legs and heavy box runway girders withstand continuous wind buffeting and crane dynamic braking forces."
        />

        <div className="mt-12">
          <PhotoBox src={IMG.structural.gantry.g3} alt="Full Gantry Yard View" ratio="16/9" />
        </div>
      </section>

      {/* Anatomy triptych */}
      <section className="container pb-[var(--sec-y-lg)]">
        <h2 className="font-bold text-[var(--ink)] mb-8 text-left" style={{ fontSize: "var(--fs-h2)" }}>
          Parts of a Gantry
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PhotoBox src={IMG.structural.gantry.g1} alt="Gantry Legs" ratio="4/5" />
          <PhotoBox src={IMG.structural.gantry.g2} alt="Runway Beams" ratio="4/5" />
          <div className="p-8 bg-[var(--blue)] text-white text-left flex flex-col justify-between">
            <div>
              <span className="text-[12px] font-mono font-bold text-white/70">SPECIFICATION</span>
              <h3 className="text-[26px] font-bold mt-3 mb-4">Complete System</h3>
              <p className="text-white/85 leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                End-truck rail stops, electrical conductor bar brackets, and ladder access platforms with safety cages.
              </p>
            </div>
            <span className="text-[14px] font-semibold text-white/90">Engineered to DIN / AISC</span>
          </div>
        </div>
      </section>

      {/* Compare band */}
      <section className="w-full bg-[var(--blue)] text-white py-[var(--sec-y-lg)]">
        <div className="container grid grid-cols-1 md:grid-cols-12 gap-8 text-left items-center">
          <div className="md:col-span-8">
            <h2 className="font-bold text-white mb-3" style={{ fontSize: "var(--fs-h2)" }}>
              Gantry or Crane Shed?
            </h2>
            <p className="text-white/85 leading-[1.7]" style={{ fontSize: "var(--fs-lead)" }}>
              Outdoor bulk storage yards benefit most from open gantry structures, while enclosed production lines require our complete crane sheds.
            </p>
          </div>
          <div className="md:col-span-4 flex justify-start md:justify-end">
            <TransitionLink
              to="/industrial-sheds-pakistan/crane-sheds/"
              className="btn btn-light btn-sm"
            >
              <span>Explore Crane Sheds</span>
              <span className="btn-arrow">→</span>
            </TransitionLink>
          </div>
        </div>
      </section>

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
        image={IMG.structural.gantry.next}
        nextUrl="/custom-steel-fabrication-pakistan/"
        nextTitle="Custom Steel Fabrication"
      />
    </article>
  );
};
