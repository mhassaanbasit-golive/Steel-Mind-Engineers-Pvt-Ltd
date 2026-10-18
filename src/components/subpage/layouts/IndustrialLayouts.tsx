// Industrial Sheds Division Signature Layouts (9.8 - 9.12)
import React, { useState, useEffect, useRef } from "react";
import { ContentData } from "../../../content/types.ts";
import { IMG } from "../../../data/subpageImages.ts";
import { PhotoBox } from "../../page/PhotoBox.tsx";
import { OutlineNum } from "../../page/OutlineNum.tsx";
import { SplitIntro } from "../../page/SplitIntro.tsx";
import { HeroBand } from "../../ui/HeroBand.tsx";
import { Accordion } from "../../ui/Accordion.tsx";
import { NextBand } from "../../ui/NextBand.tsx";
import { TransitionLink } from "../../ui/TransitionLink.tsx";
import { gsap } from "../../../lib/gsap.ts";

// 9.8 Factory Sheds — signature: "Stacking cards"
export const FactoryShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const cards = [
    { num: "01", title: "What a Factory Shed Must Do", text: "Houses heavy machinery, overhead cranes, and active production lines while resisting vibration and heat.", img: IMG.industrial.factory.f1 },
    { num: "02", title: "Design Points for Factory Sheds", text: "Optimal column bay spacing, heavy portal connections, thermal ridge vents, and natural skylighting.", img: IMG.industrial.factory.f2 },
    { num: "03", title: "Typical Users", text: "Automobile plants, textile weaving mills, food processing centers, and heavy engineering workshops across Pakistan.", img: IMG.industrial.factory.f3 },
    { num: "04", title: "From Brief to Production", text: "Complete turnkey execution from foundation bolt layout to structural erection and cladding handover.", img: IMG.industrial.factory.f4 },
  ];

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
        {/* Desktop stacking cards */}
        <div className="hidden lg:block space-y-12">
          {cards.map((c, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div
                key={c.num}
                className="sticky bg-white border border-[var(--rule)] overflow-hidden shadow-sm"
                style={{
                  top: `calc(var(--nav-offset, 88px) + 24px + ${idx * 20}px)`,
                  minHeight: "480px",
                }}
              >
                <div className={`grid grid-cols-12 items-stretch h-full ${isEven ? "flex-row-reverse" : ""}`}>
                  <div className={`col-span-6 overflow-hidden ${isEven ? "order-2" : "order-1"}`}>
                    <img
                      src={c.img}
                      alt={c.title}
                      className="w-full h-full object-cover min-h-[480px]"
                    />
                  </div>
                  <div className={`col-span-6 p-14 flex flex-col justify-center text-left ${isEven ? "order-1" : "order-2"}`}>
                    <OutlineNum num={c.num} />
                    <h3 className="text-[32px] font-bold text-[var(--ink)] mt-4 mb-3">{c.title}</h3>
                    <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                      {c.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: regular cards */}
        <div className="lg:hidden space-y-10">
          {cards.map((c) => (
            <div key={c.num} className="border border-[var(--rule)] p-6 text-left bg-white">
              <PhotoBox src={c.img} alt={c.title} ratio="16/9" className="mb-4" />
              <OutlineNum num={c.num} />
              <h3 className="text-[22px] font-bold text-[var(--ink)] mt-2 mb-2">{c.title}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {c.text}
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
        image={IMG.industrial.factory.next}
        nextUrl="/industrial-sheds-pakistan/dairy-farm-sheds/"
        nextTitle="Dairy Farm Sheds"
      />
    </article>
  );
};

// 9.9 Dairy Farm Sheds — signature: "Wide bands with text card"
export const DairyShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const bands = [
    { num: "01", title: "What Dairy Sheds Need", text: "Maximum natural airflow, high eave clearance, and insulated roofing to protect cattle from intense summer heat.", img: IMG.industrial.dairy.d1 },
    { num: "02", title: "Design Points for Dairy Sheds", text: "Continuous ridge monitoring, corrosion-resistant galvanized purlins, and open side walls ensuring continuous air circulation.", img: IMG.industrial.dairy.d2 },
    { num: "03", title: "Experience", text: "Over 80,000 sq ft of high-performance cattle sheds engineered and built for premier dairy corporations in Kasur and Chunian.", img: IMG.industrial.dairy.d3 },
    { num: "04", title: "Build in Phases", text: "Standardized portal frame geometry enables seamless length extensions as cattle herd count expands over time.", img: IMG.industrial.dairy.d4 },
  ];

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
            <div key={b.num} className="relative w-full overflow-hidden bg-slate-900" style={{ height: "clamp(440px, 46vw, 640px)" }}>
              <img
                src={b.img}
                alt={b.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/20" />

              {/* Floating text card */}
              <div
                className={`hidden md:block absolute bottom-12 p-10 bg-white border border-[var(--rule)] text-left w-[520px] shadow-lg ${
                  isEven ? "right-12" : "left-12"
                }`}
              >
                <span className="text-[12px] font-mono font-bold text-[var(--blue)] block mb-2">{b.num} / 04</span>
                <h3 className="text-[28px] font-bold text-[var(--ink)] mb-3">{b.title}</h3>
                <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                  {b.text}
                </p>
              </div>

              {/* Mobile text below */}
              <div className="md:hidden absolute inset-x-0 bottom-0 p-6 bg-white/95 text-left border-t border-[var(--rule)]">
                <span className="text-[12px] font-mono font-bold text-[var(--blue)]">{b.num}</span>
                <h3 className="text-[20px] font-bold text-[var(--ink)] mt-1 mb-2">{b.title}</h3>
                <p className="text-[var(--grey-strong)] text-[14px] leading-[1.6]">{b.text}</p>
              </div>
            </div>
          );
        })}
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
        image={IMG.industrial.dairy.next}
        nextUrl="/industrial-sheds-pakistan/poultry-sheds/"
        nextTitle="Poultry Sheds"
      />
    </article>
  );
};

// 9.10 Poultry Sheds — signature: "Staggered portrait strip"
export const PoultryShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const columns = [
    { num: "01", title: "What Poultry Houses Need", text: "Hermetically sealed environment with high R-value insulation for automated tunnel ventilation systems.", img: IMG.industrial.poultry.p1, offset: "mt-0" },
    { num: "02", title: "Design Points for Poultry Sheds", text: "Sloped floor clearance, anti-corrosive structural coating resisting ammonia vapors, and ceiling deck panels.", img: IMG.industrial.poultry.p2, offset: "md:mt-24" },
    { num: "03", title: "Why Steel", text: "Termite-proof, rodent-proof, fire-safe, and rapid to erect across vast acreage in rural agricultural belts.", img: IMG.industrial.poultry.p3, offset: "md:mt-12" },
  ];

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
        {/* Desktop 3 staggered columns */}
        <div className="hidden md:grid grid-cols-3 gap-10 items-start">
          {columns.map((c) => (
            <div key={c.num} className={`text-left space-y-4 ${c.offset}`}>
              <PhotoBox src={c.img} alt={c.title} ratio="4/5" />
              <OutlineNum num={c.num} />
              <h3 className="text-[26px] font-bold text-[var(--ink)]">{c.title}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {c.text}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div
          data-lenis-prevent
          className="md:hidden flex gap-4 overflow-x-auto pb-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {columns.map((c) => (
            <div
              key={c.num}
              className="flex-shrink-0 w-[78vw] p-5 border border-[var(--rule)] text-left"
              style={{ scrollSnapAlign: "start" }}
            >
              <PhotoBox src={c.img} alt={c.title} ratio="4/5" className="mb-4" />
              <OutlineNum num={c.num} />
              <h3 className="text-[20px] font-bold text-[var(--ink)] mt-2 mb-2">{c.title}</h3>
              <p className="text-[var(--grey-strong)] text-[14px] leading-[1.6]">{c.text}</p>
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
        image={IMG.industrial.poultry.next}
        nextUrl="/industrial-sheds-pakistan/workshop-sheds/"
        nextTitle="Workshop Sheds"
      />
    </article>
  );
};

// 9.11 Workshop Sheds — signature: "Hover image list"
export const WorkshopShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const rows = [
    { num: "01", title: "What a Workshop Shed Must Do", text: "Provide durable floor clearance, crane lifting rails, heavy equipment anchoring, and clear wide spans.", img: IMG.industrial.workshop.w1 },
    { num: "02", title: "Design Points for Workshop Sheds", text: "Reinforced gantry bracket supports, multi-point electrical cable trays, exhaust ventilation, and natural skylighting.", img: IMG.industrial.workshop.w2 },
    { num: "03", title: "Typical Users", text: "Automobile repair centers, heavy plant maintenance depots, tool and die fabrication yards, and assembly facilities.", img: IMG.industrial.workshop.w3 },
  ];

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.industrial.workshop.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        {/* Floating cursor image on desktop */}
        {hoveredIdx !== null && (
          <div
            className="hidden lg:block fixed pointer-events-none z-30 overflow-hidden shadow-2xl transition-transform duration-150"
            style={{
              width: "360px",
              aspectRatio: "4/3",
              left: `${cursorPos.x + 24}px`,
              top: `${cursorPos.y - 120}px`,
            }}
          >
            <img
              src={rows[hoveredIdx].img}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
          {rows.map((r, idx) => (
            <div
              key={r.num}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="py-12 text-left transition-all duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-[80px_5fr_7fr] gap-6 items-center">
                <OutlineNum num={r.num} active={hoveredIdx === idx} />
                <h3 className="text-[28px] lg:text-[36px] font-bold text-[var(--ink)]">{r.title}</h3>
                <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                  {r.text}
                </p>
              </div>

              {/* Mobile photo inside */}
              <div className="lg:hidden mt-6">
                <PhotoBox src={r.img} alt={r.title} ratio="16/9" />
              </div>
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
        image={IMG.industrial.workshop.next}
        nextUrl="/industrial-sheds-pakistan/crane-sheds/"
        nextTitle="Crane Sheds"
      />
    </article>
  );
};

// 9.12 Crane Sheds — signature: "Runway band + link cards"
export const CraneShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.industrial.craneSheds.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        <SplitIntro
          title="What a Crane Shed Is"
          lead="A specialized steel industrial building designed to support high-capacity overhead traveling cranes."
          text="Portal frame columns carry stepped haunches and heavy crane runway girders engineered for continuous dynamic cyclic wheel loads."
        />
      </section>

      {/* Runway band: 100vw */}
      <section className="w-full relative overflow-hidden bg-slate-900" style={{ minHeight: "360px", aspectRatio: "21/9" }}>
        <img
          src={IMG.industrial.craneSheds.wide}
          alt="Crane Shed Runway"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-8 container">
          <div className="h-[2px] bg-white/40 w-full relative">
            <div className="w-[14px] h-[14px] bg-[var(--blue)] absolute -top-[6px] left-[35%]" />
          </div>
        </div>
      </section>

      {/* Raiwind band */}
      <section className="w-full bg-[var(--blue)] text-white py-[var(--sec-y-lg)] my-[var(--sec-y)]">
        <div className="container grid grid-cols-1 md:grid-cols-12 gap-8 text-left items-center">
          <div className="md:col-span-5">
            <h2 className="font-bold text-white" style={{ fontSize: "var(--fs-h2)" }}>
              The Raiwind Crane Sheds
            </h2>
          </div>
          <div className="md:col-span-7">
            <p className="text-white/85 leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
              Our premier 96,600 sq ft crane shed constructed for Haier at Raiwind features 10-ton overhead crane runways spanning 300+ feet of continuous manufacturing bays.
            </p>
          </div>
        </div>
      </section>

      {/* Learn more link cards */}
      <section className="container pb-[var(--sec-y-lg)]">
        <h2 className="font-bold text-[var(--ink)] mb-8 text-left" style={{ fontSize: "var(--fs-h2)" }}>
          Learn More
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TransitionLink
            to="/pre-engineered-buildings-pakistan/crane-system/"
            className="p-8 border border-[var(--rule)] text-left hover:bg-[var(--blue)] hover:text-white group transition-colors duration-300 flex flex-col justify-between min-h-[180px]"
          >
            <h3 className="text-[22px] font-bold group-hover:text-white text-[var(--ink)]">
              Crane System Design
            </h3>
            <span className="text-[14px] font-semibold mt-4 text-[var(--blue)] group-hover:text-white">
              Explore Diagrams →
            </span>
          </TransitionLink>

          <TransitionLink
            to="/structural-steel-fabrication-pakistan/crane-gantry-structures/"
            className="p-8 border border-[var(--rule)] text-left hover:bg-[var(--blue)] hover:text-white group transition-colors duration-300 flex flex-col justify-between min-h-[180px]"
          >
            <h3 className="text-[22px] font-bold group-hover:text-white text-[var(--ink)]">
              Crane Gantry Structures
            </h3>
            <span className="text-[14px] font-semibold mt-4 text-[var(--blue)] group-hover:text-white">
              Explore Gantries →
            </span>
          </TransitionLink>
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
        image={IMG.industrial.craneSheds.next}
        nextUrl="/steel-warehouses-pakistan/"
        nextTitle="Steel Warehouses"
      />
    </article>
  );
};
