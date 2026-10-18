// Steel Warehouses Division Signature Layouts (9.13 - 9.17)
import React, { useState, useEffect } from "react";
import { ContentData } from "../../../content/types.ts";
import { IMG } from "../../../data/subpageImages.ts";
import { PhotoBox } from "../../page/PhotoBox.tsx";
import { OutlineNum } from "../../page/OutlineNum.tsx";
import { HeroBand } from "../../ui/HeroBand.tsx";
import { Accordion } from "../../ui/Accordion.tsx";
import { NextBand } from "../../ui/NextBand.tsx";

// 9.13 Storage Warehouses — signature: "Floating image collage"
export const StorageWarehousesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const blocks = [
    { title: "What a Storage Warehouse Does", text: "Safeguards bulk materials, pallets, and raw goods within an insulated, pest-proof, and fire-resistant steel envelope." },
    { title: "Design Points", text: "High eave height for multi-tier vertical pallet racking, wide column-free spans, and smooth forklift turning radiuses." },
    { title: "Add Floor Area", text: "Integrate multi-tier steel mezzanine floors to double usable square footage under the existing roofline." },
  ];

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left: 3 text blocks */}
          <div className="lg:col-span-6 space-y-12 text-left">
            {blocks.map((b, idx) => (
              <div key={idx} className="pt-8 border-t border-[var(--rule)]">
                <span className="text-[12px] font-mono text-[var(--blue)] font-bold mb-2 block">
                  0{idx + 1} / 03
                </span>
                <h3 className="text-[28px] font-bold text-[var(--ink)] mb-3">{b.title}</h3>
                <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                  {b.text}
                </p>
              </div>
            ))}
          </div>

          {/* Right: Floating image collage */}
          <div className="lg:col-span-6 relative min-h-[500px]">
            <div className="w-[82%] ml-auto aspect-[4/3] overflow-hidden shadow-lg border border-[var(--rule)]">
              <img
                src={IMG.warehouses.storage.s1}
                alt="Storage Warehouse Aerial"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-[42%] left-0 w-[62%] aspect-[4/3] overflow-hidden shadow-2xl border-[12px] border-white">
              <img
                src={IMG.warehouses.storage.s2}
                alt="Storage Warehouse Racks"
                className="w-full h-full object-cover"
              />
            </div>
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
        image={IMG.warehouses.storage.next}
        nextUrl="/steel-warehouses-pakistan/logistics-warehouses/"
        nextTitle="Logistics Warehouses"
      />
    </article>
  );
};

// 9.14 Logistics Warehouses — signature: "Dock lane"
export const LogisticsWarehousesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const lanes = [
    { num: "01", title: "What Logistics Needs", text: "Continuous throughput with multi-door loading docks, automated vehicle circulation lanes, and high ceiling clear heights.", img: IMG.warehouses.logistics.l1 },
    { num: "02", title: "Design Points", text: "Laser-leveled concrete floors, heavy portal canopy shelters, and dock leveler pits pre-engineered into the perimeter.", img: IMG.warehouses.logistics.l2 },
    { num: "03", title: "Why Pakistani Companies Choose Steel", text: "Rapid installation, minimal maintenance, zero termite damage, and complete flexibility for future expansion.", img: IMG.warehouses.logistics.l3 },
  ];

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
        {/* Horizontal lane bar */}
        <div className="hidden lg:block w-full h-[2px] bg-[var(--rule)] relative mb-12">
          <div className="absolute inset-0 bg-[var(--blue)] origin-left" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
          {lanes.map((l) => (
            <div key={l.num} className="space-y-4">
              <PhotoBox src={l.img} alt={l.title} ratio="3/2" />
              <OutlineNum num={l.num} />
              <h3 className="text-[24px] font-bold text-[var(--ink)]">{l.title}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {l.text}
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
        image={IMG.warehouses.logistics.next}
        nextUrl="/steel-warehouses-pakistan/cold-storage-warehouses/"
        nextTitle="Cold Storage"
      />
    </article>
  );
};

// 9.15 Cold Storage — signature: "Cold-chain flow"
export const ColdStorageLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const steps = [
    { num: "01", title: "What Cold Storage Needs", text: "Airtight building envelope, cold bridge prevention, and heavy suspended ceiling loads for evaporator coils.", img: IMG.warehouses.coldStorage.c1 },
    { num: "02", title: "What Steel Mind Provides", text: "High-grade steel portal framing with custom brackets designed to support PUF sandwich insulation panels.", img: IMG.warehouses.coldStorage.c2 },
    { num: "03", title: "Design Points", text: "Anti-condensation vapor barriers, sub-floor ventilation air ducts, and thermal breaks at every column base plate.", img: IMG.warehouses.coldStorage.c3 },
    { num: "04", title: "Who Uses Cold Storage", text: "Pharmaceutical cold chains, fruit exporters, dairy distribution hubs, and poultry processing plants.", img: IMG.warehouses.coldStorage.c4 },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 text-left">
          {steps.map((st) => (
            <div key={st.num} className="border border-[var(--rule)] p-6 bg-white space-y-4 flex flex-col justify-between">
              <div>
                <PhotoBox src={st.img} alt={st.title} ratio="4/5" className="mb-4" />
                <OutlineNum num={st.num} />
                <h3 className="text-[20px] font-bold text-[var(--ink)] mt-2 mb-2">{st.title}</h3>
              </div>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {st.text}
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
        image={IMG.warehouses.coldStorage.next}
        nextUrl="/steel-warehouses-pakistan/grain-and-wheat-warehouses/"
        nextTitle="Grain & Wheat Warehouses"
      />
    </article>
  );
};

// 9.16 Grain and Wheat Warehouses — signature: "Story slideshow"
export const GrainWarehousesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const slides = [
    { title: "What Grain Storage Needs", text: "Moisture-sealed roof framing, bird-proof ridge vents, and heavy thrust walls resisting bulk grain pressure.", img: IMG.warehouses.grain.g1 },
    { title: "Design Points", text: "High internal volume for conveyor loading, corrosion-resistant galvanized purlins, and automated fumigation sealing.", img: IMG.warehouses.grain.g2 },
    { title: "Why Steel", text: "Zero dampness, rodent proof, rapid to construct before seasonal harvest, and spans up to 150+ feet without central columns.", img: IMG.warehouses.grain.g3 },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
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
        {/* Slideshow frame */}
        <div className="max-w-[1040px] mx-auto relative aspect-[16/10] overflow-hidden shadow-xl bg-slate-950">
          {slides.map((s, idx) => (
            <img
              key={idx}
              src={s.img}
              alt={s.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                activeSlide === idx ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />
          ))}

          {/* Progress indicators on top */}
          <div className="absolute top-4 inset-x-6 flex gap-2 z-10">
            {slides.map((_, idx) => (
              <div key={idx} className="h-1 flex-1 bg-white/40 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-white transition-all duration-300 ${
                    activeSlide >= idx ? "w-full" : "w-0"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Caption under frame */}
        <div className="max-w-[1040px] mx-auto mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-left items-start">
          <div className="md:col-span-5">
            <span className="text-[12px] font-mono font-bold text-[var(--blue)] block mb-1">
              0{activeSlide + 1} / 03
            </span>
            <h3 className="text-[26px] font-bold text-[var(--ink)]">
              {slides[activeSlide].title}
            </h3>
          </div>
          <div className="md:col-span-7">
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
              {slides[activeSlide].text}
            </p>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="max-w-[1040px] mx-auto mt-6 flex justify-start gap-4">
          {slides.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlide(idx)}
              className={`text-[13px] font-semibold pb-1 border-b-2 transition-colors cursor-pointer ${
                activeSlide === idx
                  ? "text-[var(--blue)] border-[var(--blue)]"
                  : "text-[var(--grey)] border-transparent hover:text-[var(--ink)]"
              }`}
            >
              {s.title}
            </button>
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
        image={IMG.warehouses.grain.next}
        nextUrl="/steel-warehouses-pakistan/warehouses-with-loading-docks/"
        nextTitle="Warehouses with Loading Docks"
      />
    </article>
  );
};

// 9.17 Warehouses with Loading Docks — signature: "Tabs"
export const LoadingDocksLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const tabs = [
    { title: "Why Dock Design Matters", text: "Optimized dock door spacing, bumper positioning, and canopy overhangs prevent freight congestion and trailer turn-around bottlenecks.", img: IMG.warehouses.loadingDocks.d1 },
    { title: "Design Points", text: "Reinforced dock pits, integrated overhead sectional doors, rubber dock bumpers, and weather seals protecting shipments.", img: IMG.warehouses.loadingDocks.d2 },
    { title: "Combine With Other Types", text: "Seamless integration with heavy pallet rack storage bays and automated cold-chain staging chambers.", img: IMG.warehouses.loadingDocks.d3 },
  ];

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
        {/* Tab row */}
        <div className="flex border-b border-[var(--rule)] gap-8 mb-12 overflow-x-auto">
          {tabs.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`pb-4 text-[16px] md:text-[20px] font-bold transition-colors whitespace-nowrap cursor-pointer border-b-2 -mb-[2px] ${
                activeTab === idx
                  ? "text-[var(--blue)] border-[var(--blue)]"
                  : "text-[var(--grey)] border-transparent hover:text-[var(--ink)]"
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>

        {/* Panel 6fr / 6fr */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          <div className="lg:col-span-6">
            <PhotoBox
              src={tabs[activeTab].img}
              alt={tabs[activeTab].title}
              ratio="4/3"
            />
          </div>
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[12px] font-mono font-bold text-[var(--blue)]">
              0{activeTab + 1} / 03
            </span>
            <h3 className="text-[32px] font-bold text-[var(--ink)]">{tabs[activeTab].title}</h3>
            <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
              {tabs[activeTab].text}
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
        image={IMG.warehouses.loadingDocks.next}
        nextUrl="/structural-steel-fabrication-pakistan/"
        nextTitle="Structural Steel Fabrication"
      />
    </article>
  );
};
