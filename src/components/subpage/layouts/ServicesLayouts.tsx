// Services Sub-pages Signature Layouts (9.28 - 9.34)
import React, { useState, useEffect, useRef } from "react";
import { ContentData } from "../../../content/types.ts";
import { IMG } from "../../../data/subpageImages.ts";
import { PhotoBox } from "../../page/PhotoBox.tsx";
import { OutlineNum } from "../../page/OutlineNum.tsx";
import { SplitIntro } from "../../page/SplitIntro.tsx";
import { HeroBand } from "../../ui/HeroBand.tsx";
import { Accordion } from "../../ui/Accordion.tsx";
import { NextBand } from "../../ui/NextBand.tsx";
import { SITE } from "../../../data/site.ts";

// 9.28 Design — signature: "Blueprint canvas"
export const DesignLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.design.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section
        className="w-full py-[var(--sec-y-lg)] relative"
        style={{
          backgroundImage:
            "linear-gradient(rgba(30,58,138,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(30,58,138,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div className="container space-y-20">
          {/* Row 1: 5fr / 7fr */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
            <div className="lg:col-span-5 space-y-4 bg-white/90 p-8 border border-[var(--rule)]">
              <h2 className="font-bold text-[var(--ink)]" style={{ fontSize: "var(--fs-h2)" }}>
                What Design Covers
              </h2>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                Engineering analysis using finite element analysis (FEA), calculating 3D wind tunnel vortexes, dead weight, and seismic accelerations to UBC/AISC standards.
              </p>
            </div>
            <div className="lg:col-span-7">
              <PhotoBox src={IMG.services.design.d1} alt="Steel Design Plan" ratio="3/2" />
            </div>
          </div>

          {/* Row 2: 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-8 bg-white border border-[var(--rule)] space-y-3 shadow-sm">
              <OutlineNum num="01" />
              <h3 className="text-[20px] font-bold text-[var(--ink)]">The Design Steps</h3>
              <p className="text-[var(--grey-strong)] leading-[1.6]" style={{ fontSize: "var(--fs-body)" }}>
                Architectural grid coordination, load case generation, frame profile optimization, and connection design.
              </p>
            </div>

            <div className="p-8 bg-white border border-[var(--rule)] space-y-3 shadow-sm">
              <OutlineNum num="02" />
              <h3 className="text-[20px] font-bold text-[var(--ink)]">What You Receive</h3>
              <p className="text-[var(--grey-strong)] leading-[1.6]" style={{ fontSize: "var(--fs-body)" }}>
                Complete structural calculations book, anchor bolt reaction schedules, and signed engineer drawings.
              </p>
            </div>

            <div className="p-8 bg-white border border-[var(--rule)] space-y-3 shadow-sm">
              <OutlineNum num="03" />
              <h3 className="text-[20px] font-bold text-[var(--ink)]">Construction Support</h3>
              <p className="text-[var(--grey-strong)] leading-[1.6]" style={{ fontSize: "var(--fs-body)" }}>
                Direct engineer phone consultation and site inspections throughout foundation pouring and bolt placement.
              </p>
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
        image={IMG.services.design.next}
        nextUrl="/services/detailing/"
        nextTitle="Detailing Services"
      />
    </article>
  );
};

// 9.29 Detailing — signature: "Drawing register"
export const DetailingLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const registerRows = [
    { num: "01", name: "Fabrication Drawings", desc: "Detailed single-part and assembly shop drawings specifying plate thicknesses, bevel cuts, and weld sizes." },
    { num: "02", name: "Cutting Lists", desc: "CNC automated cutting, nesting, and drill coordination schedules minimizing mill plate scrap." },
    { num: "03", name: "Erection Drawings", desc: "3D erection mark plans showing exact piece callouts, crane staging points, and bolt torque values." },
    { num: "04", name: "Anchor Bolt Plans", desc: "Precision foundation layout drawings detailing column centerlines, embedment depths, and base projection heights." },
  ];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.detailing.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        <SplitIntro
          title="What Detailing Is"
          lead="Detailing translates structural engineering models into millimeter-accurate shop fabrication blueprints."
          text="Every bolt hole, bevel, stiffener, and connection clip is fully modeled in 3D to ensure zero clashes during erection."
        />
      </section>

      {/* Register */}
      <section className="container pb-[var(--sec-y-lg)]">
        <h2 className="font-bold text-[var(--ink)] mb-8 text-left" style={{ fontSize: "var(--fs-h2)" }}>
          Drawings Produced
        </h2>

        <div className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
          {registerRows.map((r) => (
            <div
              key={r.num}
              className="py-8 px-4 grid grid-cols-1 md:grid-cols-[96px_4fr_8fr] gap-4 items-center text-left hover:bg-[rgba(30,58,138,0.04)] transition-colors group"
            >
              <OutlineNum num={r.num} className="group-hover:text-[var(--blue)]" />
              <h3 className="text-[22px] font-bold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors">
                {r.name}
              </h3>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Notes */}
      <section className="container pb-[var(--sec-y-lg)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div className="space-y-3">
            <div className="w-12 h-1 bg-[var(--blue)]" />
            <h3 className="text-[20px] font-bold text-[var(--ink)]">Why Detailing Prevents Delays</h3>
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
              Accurate 3D clash-checked drawings mean steel fits together cleanly on site without torch alterations or expensive crane waiting time.
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-1 bg-[var(--blue)]" />
            <h3 className="text-[20px] font-bold text-[var(--ink)]">Detailing for Your Own Design</h3>
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
              We also provide independent steel detailing services for consulting engineering firms, EPC contractors, and general builders across Pakistan.
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
        image={IMG.services.detailing.next}
        nextUrl="/services/fabrication/"
        nextTitle="Fabrication Services"
      />
    </article>
  );
};

// 9.30 Fabrication — signature: "Pinned filmstrip"
export const FabricationLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const steps = [
    { num: "01", name: "Material Check", desc: "Chemical and ultrasonic mill certificate verification for every incoming steel plate.", img: IMG.services.fabrication.f1 },
    { num: "02", name: "Cutting", desc: "Computerized multi-torch CNC plasma cutting slicing plates up to 50mm thick with clean bevels.", img: IMG.services.fabrication.f2 },
    { num: "03", name: "Drilling", desc: "High-speed multi-spindle CNC radial drilling creating clean bolt holes at exact centerlines.", img: IMG.services.fabrication.f3 },
    { num: "04", name: "Fitting", desc: "Skilled boilermakers tack-welding web plates, flanges, and internal stiffeners in precision jigs.", img: IMG.services.fabrication.f4 },
    { num: "05", name: "Welding", desc: "Submerged arc welding (SAW) laying down high-penetration structural fillet and butt welds.", img: null },
    { num: "06", name: "Cleaning & Painting", desc: "Surface preparation to Sa 2.5 profile and uniform application of protective primer systems.", img: IMG.services.fabrication.f6 },
    { num: "07", name: "Marking & Packing", desc: "Indelible piecemark coding, bundling, and secure flatbed dispatch staging.", img: IMG.services.fabrication.f7 },
  ];

  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.fabrication.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        <SplitIntro
          title="What Fabrication Covers"
          lead="From prime certified steel plates to fully assembled, painted, and piece-marked structural building frames."
          text="Our modern fabrication facility in Lahore operates heavy overhead cranes, automatic submerged arc welders, and precision CNC plate cutters."
        />
      </section>

      {/* Filmstrip track */}
      <section className="w-full py-8 overflow-hidden">
        <div className="container mb-6 flex justify-between items-center text-left">
          <h2 className="font-bold text-[var(--ink)]" style={{ fontSize: "var(--fs-h2)" }}>
            Fabrication Process (01 - 07)
          </h2>
          <span className="text-[13px] font-mono text-[var(--grey)]">7 Steps</span>
        </div>

        <div
          data-lenis-prevent
          ref={trackRef}
          className="flex gap-8 overflow-x-auto px-6 lg:px-16 pb-8 cursor-grab"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
        >
          {steps.map((st) => (
            <div
              key={st.num}
              className="flex-shrink-0 w-[82vw] sm:w-[480px] lg:w-[540px] border border-[var(--rule)] p-6 bg-white text-left space-y-4"
              style={{ scrollSnapAlign: "start" }}
            >
              {st.img ? (
                <div className="w-full aspect-[3/2] overflow-hidden bg-slate-900">
                  <img src={st.img} alt={st.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full aspect-[3/2] bg-[var(--blue)] flex items-center justify-center text-white">
                  <OutlineNum num="05" className="text-white text-[72px]" />
                </div>
              )}
              <OutlineNum num={st.num} />
              <h3 className="text-[24px] font-bold text-[var(--ink)]">{st.name}</h3>
              <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>
                {st.desc}
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
        image={IMG.services.fabrication.next}
        nextUrl="/services/cleaning/"
        nextTitle="Surface Cleaning"
      />
    </article>
  );
};

// 9.31 Cleaning — signature: "Blast reveal + inspection sheet"
export const CleaningLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const inspectionPoints = [
    { title: "What Is Removed", desc: "Mill scale, grease oils, heavy corrosion pits, and welding flux slag." },
    { title: "How Method Is Chosen", desc: "Abrasive copper slag or steel grit blasting calibrated to achieve required Sa 2.5 surface roughness." },
    { title: "When Cleaning Happens", desc: "Directly after fitting and welding, immediately before the primer application window closes." },
    { title: "What You Can Check", desc: "Surface profile gauge testing, surface cleanliness comparators, and air dust tape tests." },
  ];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.cleaning.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        <SplitIntro
          title="Why Cleaning Comes First"
          lead="No paint system can bond to loose mill scale or oily steel plates. Surface cleaning determines primer longevity."
          text="Blast cleaning creates microscopic surface profile anchors that lock the primer epoxy resin directly into the virgin steel."
        />
      </section>

      {/* Blast image */}
      <section className="container pb-[var(--sec-y-lg)]">
        <PhotoBox src={IMG.services.cleaning.c1} alt="Cleaned Steel Beam" ratio="21/9" />
      </section>

      {/* Inspection sheet 2x2 */}
      <section className="container pb-[var(--sec-y-lg)]">
        <h2 className="font-bold text-[var(--ink)] mb-8 text-left" style={{ fontSize: "var(--fs-h2)" }}>
          Surface Inspection Standards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {inspectionPoints.map((item, idx) => (
            <div key={idx} className="p-8 border border-[var(--rule)] bg-white space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded border border-[var(--blue)] bg-[var(--blue)] text-white flex items-center justify-center font-bold text-[14px]">
                  ✓
                </div>
                <h3 className="text-[20px] font-bold text-[var(--ink)]">{item.title}</h3>
              </div>
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
        image={IMG.services.cleaning.next}
        nextUrl="/services/painting/"
        nextTitle="Painting Services"
      />
    </article>
  );
};

// 9.32 Painting — signature: "Paint-wipe long-form"
export const PaintingLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.painting.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="max-w-[760px] mx-auto px-6 py-[var(--sec-y-lg)] text-left space-y-12">
        <div>
          <h2 className="font-bold text-[var(--ink)] mb-4" style={{ fontSize: "var(--fs-h2)" }}>
            Why the Coating Matters
          </h2>
          <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
            Steel structures in Pakistan face severe humidity in Sindh, harsh industrial emissions in Punjab, and extreme temperature variations. High-performance epoxy and polyurethane coatings stop corrosion before it begins.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-[var(--ink)] mb-4" style={{ fontSize: "var(--fs-h2)" }}>
            What a Coating System Is
          </h2>
          <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
            A complete barrier system combines a zinc-rich anti-corrosion primer, a high-build intermediate epoxy barrier coat, and an aliphatic polyurethane topcoat resisting ultraviolet degradation.
          </p>
        </div>
      </section>

      {/* Breakout image 1 */}
      <section className="container pb-12">
        <PhotoBox src={IMG.services.painting.p1} alt="Primer Coat Application" ratio="21/9" />
      </section>

      <section className="max-w-[760px] mx-auto px-6 py-8 text-left space-y-12">
        <div>
          <h2 className="font-bold text-[var(--ink)] mb-4" style={{ fontSize: "var(--fs-h2)" }}>
            How Painting Is Done
          </h2>
          <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
            Airless spray pumps apply uniform wet film thicknesses (WFT) monitored continuously with magnetic dry film thickness (DFT) gauges in climate-controlled painting bays.
          </p>
        </div>
      </section>

      {/* Breakout image 2 */}
      <section className="container pb-12">
        <PhotoBox src={IMG.services.painting.p2} alt="Intermediate Epoxy Coat" ratio="21/9" />
      </section>

      <section className="max-w-[760px] mx-auto px-6 py-8 text-left space-y-12">
        <div>
          <h2 className="font-bold text-[var(--ink)] mb-4" style={{ fontSize: "var(--fs-h2)" }}>
            Colors and Finish
          </h2>
          <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
            RAL industrial color matches, safety yellow hazard markings for crane girders, and reflective roof coatings lowering building interior temperatures.
          </p>
        </div>
      </section>

      {/* Breakout image 3 */}
      <section className="container pb-[var(--sec-y-lg)]">
        <PhotoBox src={IMG.services.painting.p3} alt="Polyurethane Top Coat" ratio="21/9" />
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
        image={IMG.services.painting.next}
        nextUrl="/services/erection/"
        nextTitle="Erection Services"
      />
    </article>
  );
};

// 9.33 Erection — signature: "Crane-hook rail"
export const ErectionLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const steps = [
    { num: "01", title: "Site Check", desc: "Surveying concrete foundation anchor bolt positions and site access crane road readiness." },
    { num: "02", title: "Lifting Plan", desc: "Rigging geometry calculations, crane outrigger pad ground bearing, and tandem lift schedules." },
    { num: "03", title: "Portal Frames", desc: "Erecting primary columns, cross-guy stabilizing, and hoisting assembled rafter rafters into place." },
    { num: "04", title: "Bracing & Secondaries", desc: "Installing roof purlins, wall girts, and diagonal bracing cables to lock the first plumbed bay." },
    { num: "05", title: "Alignment", desc: "Optical total station alignment checking vertical plumb and horizontal roof line tolerances." },
    { num: "06", title: "Sheeting & Trim", desc: "Laying insulated roof panels, wall sheets, corner trims, and ridge ventilators." },
    { num: "07", title: "Touch-up & Handover", desc: "Field bolt torque inspection, paint touch-up at connection welds, and project client sign-off." },
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

      <section className="container py-[var(--sec-y-lg)]">
        <SplitIntro
          title="What Erection Includes"
          lead="From foundation bolt verification to complete framed and sheeted industrial building commissioning."
          text="Experienced certified rigging crews equipped with mobile cranes, boom lifts, torque wrenches, and fall protection safety lines."
        />
      </section>

      {/* Crane Hook Rail */}
      <section className="container pb-[var(--sec-y-lg)]">
        <div className="relative border-l-2 border-[var(--blue)] pl-8 lg:pl-16 space-y-16 text-left">
          {steps.map((st) => (
            <div key={st.num} className="relative group">
              {/* Point dot on line */}
              <div className="absolute -left-[41px] lg:-left-[73px] top-1.5 w-4 h-4 rounded-full bg-[var(--blue)] border-4 border-white shadow-sm" />
              <div className="flex items-baseline gap-3 mb-2">
                <OutlineNum num={st.num} />
                <h3 className="text-[24px] font-bold text-[var(--ink)]">{st.title}</h3>
              </div>
              <p className="text-[var(--grey-strong)] leading-[1.65] max-w-[640px]" style={{ fontSize: "var(--fs-body)" }}>
                {st.desc}
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

      {/* Blue next band without image (no next image for Erection) */}
      <NextBand
        nextUrl="/services/after-sale-services/"
        nextTitle="After Sale Services"
      />
    </article>
  );
};

// 9.34 After Sale Services — signature: "Support desk"
export const AfterSaleLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const serviceCards = [
    { title: "Repairs", desc: "Vehicle impact column damage repairs, cladding panel replacement, and gutter sealing.", icon: "🔧" },
    { title: "Repainting", desc: "Long-term coating refresh, rust treatment, and complete facility recoating programs.", icon: "🎨" },
    { title: "Extensions", desc: "Adding bays to building length or width with matching structural roof lines.", icon: "↔️" },
    { title: "Additions", desc: "Adding new mezzanine floors, crane runway beams, partition walls, or canopies.", icon: "➕" },
    { title: "Checks", desc: "Annual bolt torque verification, roof drainage inspection, and structural health checks.", icon: "📋" },
  ];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.services.afterSale.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        <SplitIntro
          title="Why After Sale Support Matters"
          lead="Industrial buildings are living production assets that expand and adapt as manufacturing businesses grow."
          text="Because Steel Mind Engineers maintains complete CAD and 3D structural models of every building ever erected, future additions bolt on seamlessly."
        />
      </section>

      {/* 5 service cards */}
      <section className="container pb-[var(--sec-y-lg)]">
        <h2 className="font-bold text-[var(--ink)] mb-8 text-left" style={{ fontSize: "var(--fs-h2)" }}>
          What Steel Mind Engineers Provides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-left">
          {serviceCards.map((c, idx) => (
            <div
              key={idx}
              className="p-6 border border-[var(--rule)] bg-white space-y-4 hover:bg-[var(--blue)] hover:text-white group transition-colors duration-300"
            >
              <div className="text-3xl">{c.icon}</div>
              <h3 className="text-[20px] font-bold text-[var(--ink)] group-hover:text-white">
                {c.title}
              </h3>
              <p className="text-[var(--grey-strong)] group-hover:text-white/85 text-[14px] leading-[1.6]">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Wide image */}
      <section className="container pb-[var(--sec-y-lg)]">
        <PhotoBox src={IMG.services.afterSale.wide} alt="After Sale Building Extension" ratio="64/27" />
      </section>

      {/* Support hotline band */}
      <section className="w-full bg-[var(--blue)] text-white py-[var(--sec-y-lg)]">
        <div className="container text-left space-y-8">
          <div>
            <h2 className="font-bold text-white mb-2" style={{ fontSize: "var(--fs-h2)" }}>
              How to Ask for Support
            </h2>
            <p className="text-white/85 max-w-[640px]" style={{ fontSize: "var(--fs-lead)" }}>
              Directly contact our engineering department for building modifications, inspections, or maintenance inquiries:
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a href={`tel:${SITE.tel[0]}`} className="btn btn-light">
              <span>Call +92 300 4253966</span>
              <span className="btn-arrow">→</span>
            </a>
            <a href={`mailto:${SITE.email}`} className="btn btn-outline border-white text-white">
              <span>Email {SITE.email}</span>
            </a>
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
        image={IMG.services.afterSale.next}
        nextUrl="/projects/"
        nextTitle="Our Projects"
      />
    </article>
  );
};
