import React from "react";
import { Link } from "react-router-dom";
import pageData from "../content/generated/page-65.json";
import { A } from "../data/assets.ts";
import { HeroBand } from "../components/ui/HeroBand.tsx";
import { Canvas } from "../components/ui/Canvas.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { NextBand } from "../components/ui/NextBand.tsx";

const CLIENT_NAMES = [
  "Haier",
  "Imperial Denim",
  "Moiz Steel",
  "Saif Engineers",
  "Dravton Dairy",
  "Latifia Dairy",
  "Maria B",
  "Elite Stitching",
  "MAB",
  "Agha Waqar",
];

export const Clients: React.FC = () => {
  return (
    <div className="w-full bg-white">
      {/* Block A — Hero Band (Image) */}
      <HeroBand
        variant="image"
        imageSrc={A.team}
        imageAlt="Steel buildings built by Steel Mind Engineers for clients across Pakistan."
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Our Clients" },
        ]}
        h1={pageData.h1}
        subtitle={pageData.quickAnswer}
      />

      {/* Block B — Information Panel (Royal Blue alternating with White) */}
      <section
        style={{ backgroundColor: "var(--blue)" }}
        className="py-12 lg:py-20 bg-[var(--blue)] text-white"
      >
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-6 space-y-4" data-reveal-group="">
              <h2
                className="text-[16px] lg:text-[24px] font-semibold text-white leading-[1.2]"
                data-split=""
              >
                Who Builds With Steel Mind Engineers
              </h2>
              <p
                className="text-[12px] lg:text-[13px] leading-[1.65] text-white/85"
                data-reveal=""
              >
                Steel Mind Engineers builds for manufacturers, dairy and livestock farms, apparel and retail brands, steel and engineering companies and infrastructure contractors. A client list shows who has trusted a contractor with real money and real deadlines, so each logo below belongs to a company that has worked with Steel Mind Engineers.
              </p>
              <p
                className="text-[12px] lg:text-[13px] leading-[1.65] text-white/85"
                data-reveal=""
              >
                Every client receives one contract, one point of contact, a written schedule and support after handover. Many clients return for later phases.
              </p>
            </div>

            <div className="lg:col-span-6" data-reveal="">
              <Canvas slot="clients-info" ratio="4/3" src={A.about} alt="Who Builds With Steel Mind Engineers" />
            </div>
          </div>
        </div>
      </section>

      {/* Client Logo Grid: Pure white section with 1px --line dividers (no white cards on offwhite) */}
      <section className="py-14 lg:py-20 bg-white border-b border-[var(--line)]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="mb-8 lg:mb-10">
            {/* 2.3: Eyebrow label removed */}
            <h2 className="text-[16px] lg:text-[24px] font-semibold text-[var(--ink)] leading-[1.2]">
              Our Client Portfolio
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 border-t border-l border-[var(--line)]">
            {CLIENT_NAMES.map((name) => {
              const logo = A.clientLogo[name as keyof typeof A.clientLogo];
              return (
                <div
                  key={name}
                  className="bg-white h-[120px] flex items-center justify-center p-4 border-r border-b border-[var(--line)]"
                  data-reveal=""
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt={`${name} logo`}
                      className="max-h-[65%] max-w-[70%] object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-[12px] lg:text-[13px] font-semibold text-[var(--ink)]">{name}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Client Project Links */}
          <div className="mt-10 pt-6 border-t border-[var(--line)] space-y-3 max-w-[640px]">
            <h3 className="text-[14px] lg:text-[17px] font-semibold text-[var(--ink)]">
              Selected Client Projects
            </h3>
            <div className="space-y-2 text-[12px] lg:text-[13px] text-[var(--grey)]">
              <div>
                <strong className="text-[var(--ink)] font-semibold">Haier:</strong>{" "}
                <Link to="/projects/haier-peb-crane-and-mezzanine-shed-raiwind/" className="text-[var(--blue)] hover:underline">
                  PEB Crane and Mezzanine Shed (97,888 sq ft)
                </Link>
              </div>
              <div>
                <strong className="text-[var(--ink)] font-semibold">Dravton Dairy:</strong>{" "}
                <Link to="/projects/dravton-dairy-peb-dairy-shed-chunian/" className="text-[var(--blue)] hover:underline">
                  PEB Dairy Shed (39,330 sq ft)
                </Link>
                {", "}
                <Link to="/projects/dravton-dairy-peb-milking-parlour-shed-chunian/" className="text-[var(--blue)] hover:underline">
                  Milking Parlour Shed (21,686 sq ft)
                </Link>
              </div>
              <div>
                <strong className="text-[var(--ink)] font-semibold">Maria B:</strong>{" "}
                <Link to="/projects/maria-b-peb-mezzanine-floor-lahore/" className="text-[var(--blue)] hover:underline">
                  PEB Mezzanine Floor (7,020 sq ft)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Repeat Clients as Block C (Royal Blue alternating with White) */}
      <section
        style={{ backgroundColor: "var(--blue)" }}
        className="py-14 lg:py-20 w-full bg-[var(--blue)] text-white"
      >
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="order-2 lg:order-1 lg:col-span-6 space-y-4 max-w-[460px]" data-reveal-group="">
              <h3 className="text-[14px] lg:text-[17px] font-semibold text-white leading-[1.25]">
                Repeat Clients: Haier and Dravton Dairy
              </h3>
              <p className="text-[12px] lg:text-[13px] leading-[1.65] text-white/85" data-reveal="">
                Haier has had four structures built at Raiwind: a store shed, a mezzanine floor, a crane shed and a crane and mezzanine shed. Dravton Dairy has had four structures built at Chunian: a dairy shed, a milking parlour shed, a feed storage shed and a rapid exit structure.
              </p>
              <p className="text-[12px] lg:text-[13px] leading-[1.65] text-white/85" data-reveal="">
                Repeat orders show that clients are satisfied with the work and with the way the team deals with them from the first drawing to final handover.
              </p>
            </div>

            <div className="order-1 lg:order-2 lg:col-span-6" data-reveal="">
              <Canvas
                slot="repeat-clients"
                ratio="4/3"
                src={A.project.haierCraneMezzanine[0]}
                alt="Haier PEB Crane and Mezzanine Shed"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ (Block E — White) */}
      {pageData.faq && pageData.faq.length > 0 && (
        <section className="py-12 lg:py-16 bg-white border-b border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] max-w-[800px]">
            {/* 2.3: Eyebrow "Questions" removed */}
            <h2 className="text-[16px] lg:text-[24px] font-semibold text-[var(--ink)] leading-[1.2] mb-6">
              Frequently Asked Questions
            </h2>
            <Accordion items={pageData.faq} />
          </div>
        </section>
      )}

      {/* Next Band */}
      <NextBand
        heading="Explore Our Completed Projects"
        nextUrl="/projects/"
        nextTitle="Our Projects"
      />
    </div>
  );
};
