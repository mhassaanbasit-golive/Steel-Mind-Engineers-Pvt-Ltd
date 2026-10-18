// Custom Steel Fabrication Division Signature Layouts (9.23 - 9.27)
import React from "react";
import { ContentData } from "../../../content/types.ts";
import { IMG } from "../../../data/subpageImages.ts";
import { PhotoBox } from "../../page/PhotoBox.tsx";
import { OutlineNum } from "../../page/OutlineNum.tsx";
import { HeroBand } from "../../ui/HeroBand.tsx";
import { Accordion } from "../../ui/Accordion.tsx";
import { NextBand } from "../../ui/NextBand.tsx";

// 9.23 Machine Frames — signature: "Statement + ruler + checklist"
export const MachineFramesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const checklist = [
    { title: "Design Points", desc: "Milled base mounting pads, internal structural rib stiffeners, and stress-relieved steel plates minimizing equipment operational vibration." },
    { title: "Typical Uses", desc: "Conveyor drive skids, heavy hydraulic press beds, generator mounting bases, and chemical processing equipment cradles." },
    { title: "What to Send", desc: "Equipment footprint dimensions, motor and pump center-of-gravity locations, anchor bolt patterns, and total operational weight." },
  ];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.custom.machineFrames.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Statement */}
      <section className="container py-[var(--sec-y-lg)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          <div className="lg:col-span-5">
            <h2 className="font-bold text-[var(--ink)]" style={{ fontSize: "var(--fs-h2)" }}>
              What a Machine Frame Does
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="font-bold text-[var(--ink)] leading-[1.45]" style={{ fontSize: "clamp(20px, 2.2vw, 24px)" }}>
              A heavy fabricated steel machine frame maintains precise equipment alignment under continuous mechanical torque, vibration, and thermal expansion.
            </p>
          </div>
        </div>
      </section>

      {/* Wide image with SVG ruler */}
      <section className="container pb-[var(--sec-y-lg)]">
        <PhotoBox src={IMG.custom.machineFrames.wide} alt="Machine Frame Fabrication" ratio="64/27" />
        {/* SVG ruler */}
        <div className="w-full h-8 flex items-end mt-4 border-b border-[var(--rule)] overflow-hidden">
          <div className="w-full flex justify-between">
            {Array.from({ length: 40 }).map((_, idx) => (
              <div
                key={idx}
                className={`w-[1px] bg-[var(--blue)] ${idx % 5 === 0 ? "h-5" : "h-2"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="container pb-[var(--sec-y-lg)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          {checklist.map((item, idx) => (
            <div key={idx} className="space-y-4">
              <div className="w-10 h-10 rounded-full border border-[var(--blue)] flex items-center justify-center text-[var(--blue)] font-bold">
                ✓
              </div>
              <h3 className="text-[22px] font-bold text-[var(--ink)]">{item.title}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {item.desc}
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
        image={IMG.custom.machineFrames.next}
        nextUrl="/custom-steel-fabrication-pakistan/storage-tanks/"
        nextTitle="Storage Tanks"
      />
    </article>
  );
};

// 9.24 Storage Tanks — signature: "Curtain overlay"
export const StorageTanksLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const tankBlocks = [
    { num: "01", title: "What Tanks We Fabricate", text: "Vertical cylindrical, horizontal cylindrical, rectangular water tanks, and elevated steel pressure vessels." },
    { num: "02", title: "Design Points", text: "Hydrostatic head pressure calculations, internal baffle plates, certified full-penetration welding, and leak testing." },
    { num: "03", title: "Typical Users", text: "Textile dying units, chemical plants, agricultural fertilizer storage, and industrial fire water reserves." },
  ];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.custom.tanks.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="relative w-full overflow-hidden my-[var(--sec-y-lg)]">
        {/* Full width image layer */}
        <div className="w-full h-[600px] overflow-hidden">
          <img
            src={IMG.custom.tanks.wide}
            alt="Steel Storage Tanks"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Floating cards */}
        <div className="container relative z-10 -mt-40 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tankBlocks.map((t) => (
              <div key={t.num} className="p-8 bg-white border border-[var(--rule)] shadow-xl text-left space-y-3">
                <OutlineNum num={t.num} />
                <h3 className="text-[22px] font-bold text-[var(--ink)]">{t.title}</h3>
                <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                  {t.text}
                </p>
              </div>
            ))}
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
        image={IMG.custom.tanks.next}
        nextUrl="/custom-steel-fabrication-pakistan/hoppers-and-bins/"
        nextTitle="Hoppers & Bins"
      />
    </article>
  );
};

// 9.25 Hoppers and Bins — signature: "Bento grid"
export const HoppersBinsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.custom.hoppers.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Bento Grid */}
      <section className="container py-[var(--sec-y-lg)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-auto">
          {/* Tile A: Image h1 (Cols 1-7, Rows 1-2) */}
          <div className="md:col-span-7 md:row-span-2 overflow-hidden bg-slate-900 min-h-[360px]">
            <img src={IMG.custom.hoppers.h1} alt="Hopper Cone" className="w-full h-full object-cover" />
          </div>

          {/* Tile B: Text What Hoppers Do (Cols 8-12, Row 1) */}
          <div className="md:col-span-5 bg-[var(--blue)] text-white p-8 text-left flex flex-col justify-center">
            <h3 className="text-[24px] font-bold mb-3">What Hoppers & Bins Do</h3>
            <p className="text-white/90 leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
              Engineered funnel bins and gravity discharge chutes ensuring smooth, uninterrupted bulk powder and grain material flow.
            </p>
          </div>

          {/* Tile C: Image h2 (Cols 8-12, Row 2) */}
          <div className="md:col-span-5 overflow-hidden bg-slate-900 min-h-[240px]">
            <img src={IMG.custom.hoppers.h2} alt="Bin on Frame" className="w-full h-full object-cover" />
          </div>

          {/* Tile D: Text Design Points (Cols 1-5, Row 3) */}
          <div className="md:col-span-5 border border-[var(--rule)] p-8 text-left bg-white">
            <h3 className="text-[22px] font-bold text-[var(--ink)] mb-3">Design Points</h3>
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
              Steep valley angles, smooth interior weld grinds preventing material hangup, and heavy structural support legs with load cell mounts.
            </p>
          </div>

          {/* Tile E: Image h3 (Cols 6-8, Row 3) */}
          <div className="md:col-span-3 overflow-hidden bg-slate-900 min-h-[240px]">
            <img src={IMG.custom.hoppers.h3} alt="Hopper Ladder Platform" className="w-full h-full object-cover" />
          </div>

          {/* Tile F: Text Typical Uses (Cols 9-12, Row 3) */}
          <div className="md:col-span-4 bg-[rgba(30,58,138,0.04)] border border-[var(--rule)] p-8 text-left">
            <h3 className="text-[22px] font-bold text-[var(--ink)] mb-3">Typical Uses</h3>
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
              Cement batching plants, flour and wheat mills, sugar processing factories, and coal power boilers across Pakistan.
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
        image={IMG.custom.hoppers.next}
        nextUrl="/custom-steel-fabrication-pakistan/steel-doors-and-gates/"
        nextTitle="Steel Doors & Gates"
      />
    </article>
  );
};

// 9.26 Doors and Gates — signature: "Door-open grid"
export const DoorsGatesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const doorTypes = [
    { name: "Sliding Gates", desc: "Heavy industrial cantilevered sliding gates spanning wide factory truck entrance perimeters.", img: IMG.custom.doors.d1 },
    { name: "Hinged Gates", desc: "Double-leaf heavy structural gates with heavy greaseable bearing hinges.", img: IMG.custom.doors.d2 },
    { name: "Rolling Doors", desc: "Motorized galvanized steel slatted roll-up doors with manual chain fall-back operation.", img: IMG.custom.doors.d3 },
    { name: "Personnel Doors", desc: "Insulated steel hollow metal panic exit doors with certified door closers.", img: IMG.custom.doors.d4 },
  ];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.custom.doors.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        <h2 className="font-bold text-[var(--ink)] mb-8 text-left" style={{ fontSize: "var(--fs-h2)" }}>
          Door & Gate Types
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {doorTypes.map((d, idx) => (
            <div key={idx} className="border border-[var(--rule)] p-6 bg-white space-y-4">
              <PhotoBox src={d.img} alt={d.name} ratio="4/3" />
              <OutlineNum num={idx + 1} />
              <h3 className="text-[22px] font-bold text-[var(--ink)]">{d.name}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {d.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Notes */}
      <section className="w-full bg-[rgba(30,58,138,0.04)] py-[var(--sec-y)] border-y border-[var(--rule)]">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div>
            <h3 className="text-[22px] font-bold text-[var(--ink)] mb-3">Design Points</h3>
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
              High-cycle track rollers, hot-dip galvanized primer protection, and heavy weather-strip bottom seals resisting rain and sand infiltration.
            </p>
          </div>
          <div>
            <h3 className="text-[22px] font-bold text-[var(--ink)] mb-3">Fitted to Your Building</h3>
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
              Custom framed door headers and structural jambs bolt directly to our pre-engineered building portal column framing.
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
        image={IMG.custom.doors.next}
        nextUrl="/custom-steel-fabrication-pakistan/steel-stairs/"
        nextTitle="Steel Stairs"
      />
    </article>
  );
};

// 9.27 Steel Stairs — signature: "Ascending steps"
export const SteelStairsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const stairTypes = [
    { num: "01", name: "Straight Stairs", desc: "Direct single-run steel flight staircases for mezzanine access.", img: IMG.custom.stairs.s1 },
    { num: "02", name: "Switchback Stairs", desc: "Intermediate rest landing stairs reversing 180° for multi-story towers.", img: IMG.custom.stairs.s2 },
    { num: "03", name: "Spiral Stairs", desc: "Compact footprint steel stairs wrapping around a central structural pipe.", img: IMG.custom.stairs.s3 },
    { num: "04", name: "Ladders with Cages", desc: "Vertical safety hoop access ladders for silo and roof maintenance.", img: IMG.custom.stairs.s4 },
    { num: "05", name: "Platforms & Walkways", desc: "Elevated catwalks with serrated anti-slip steel bar grating.", img: IMG.custom.stairs.s5 },
  ];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.custom.stairs.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        <h2 className="font-bold text-[var(--ink)] mb-12 text-left" style={{ fontSize: "var(--fs-h2)" }}>
          Ascending Steps
        </h2>

        {/* 5 Stair cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-left items-end">
          {stairTypes.map((st, idx) => (
            <div
              key={st.num}
              className="border border-[var(--rule)] p-5 bg-white space-y-3"
              style={{
                transform: `translateY(-${idx * 16}px)`,
              }}
            >
              <PhotoBox src={st.img} alt={st.name} ratio="4/5" />
              <OutlineNum num={st.num} />
              <h3 className="text-[18px] font-bold text-[var(--ink)]">{st.name}</h3>
              <p className="text-[var(--grey-strong)] text-[14px] leading-[1.6]">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Notes */}
      <section className="container pb-[var(--sec-y-lg)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left border-t border-[var(--rule)] pt-8">
          <div>
            <h3 className="text-[20px] font-bold text-[var(--ink)] mb-2">Design Points</h3>
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
              OSHA and Pakistan building code compliant riser heights, tread depths, and minimum 1.5 kN/m handrail design loadings.
            </p>
          </div>
          <div>
            <h3 className="text-[20px] font-bold text-[var(--ink)] mb-2">Safety First</h3>
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
              Self-draining serrated tread gratings and solid toe boards prevent industrial slips and falling debris hazards.
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
        image={IMG.custom.stairs.next}
        nextUrl="/services/"
        nextTitle="Services Overview"
      />
    </article>
  );
};
