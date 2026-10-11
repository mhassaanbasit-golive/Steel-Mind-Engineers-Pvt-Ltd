import React from "react";
import { Link } from "react-router-dom";
import pageData from "../content/generated/page-65.json";
import { A } from "../data/assets.ts";
import { HeroBand } from "../components/ui/HeroBand.tsx";
import { Canvas } from "../components/ui/Canvas.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { RelatedPages } from "../components/ui/RelatedPages.tsx";
import { CtaBand } from "../components/ui/CtaBand.tsx";

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

      {/* Block B — Information Panel */}
      <section className="py-12 lg:py-20 bg-white border-b border-[var(--line)]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="lg:col-span-6 space-y-4" data-reveal-group="">
              <h2
                className="text-[18px] lg:text-[28px] font-semibold text-[var(--ink)] leading-[1.2]"
                data-split=""
              >
                Who Builds With Steel Mind Engineers
              </h2>
              <p
                className="text-[13px] lg:text-[15px] leading-[1.6] text-[var(--grey)]"
                data-reveal=""
              >
                Steel Mind Engineers builds for manufacturers, dairy and livestock farms, apparel and retail brands, steel and engineering companies and infrastructure contractors. A client list shows who has trusted a contractor with real money and real deadlines, so each logo below belongs to a company that has worked with Steel Mind Engineers.
              </p>
              <p
                className="text-[13px] lg:text-[15px] leading-[1.6] text-[var(--grey)]"
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

      {/* Client Logo Grid: 10 logos, 2 cols mobile / 4 desktop. Each tile 120px tall, offwhite background, logo centered at 60% max width, full colour */}
      <section className="py-14 lg:py-20 bg-[var(--offwhite)] border-b border-[var(--line)]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="mb-8 lg:mb-10">
            <span className="block text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em] mb-1">
              Trusted Relationships
            </span>
            <h2 className="text-[18px] lg:text-[28px] font-semibold text-[var(--ink)] leading-[1.2]">
              Our Client Portfolio
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CLIENT_NAMES.map((name) => {
              const logo = A.clientLogo[name as keyof typeof A.clientLogo];
              return (
                <div
                  key={name}
                  className="bg-white h-[120px] flex items-center justify-center p-4 border border-[var(--line)] shadow-none"
                  data-reveal=""
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt={`${name} logo`}
                      className="max-h-[60%] max-w-[60%] object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-[14px] font-semibold text-[var(--ink)]">{name}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Client Project Links */}
          <div className="mt-10 pt-6 border-t border-[var(--line)] space-y-3 max-w-[640px]">
            <span className="block text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
              Selected Client Projects
            </span>
            <div className="space-y-2 text-[13px] text-[var(--grey)]">
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

      {/* Repeat Clients as Block C (one text-image pair per repeat-client story) */}
      <section className="py-14 lg:py-20 w-full bg-white border-b border-[var(--line)]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            <div className="order-2 lg:order-1 lg:col-span-6 space-y-4 max-w-[400px]" data-reveal-group="">
              <h3 className="text-[15px] lg:text-[18px] font-semibold text-[var(--ink)] leading-[1.25]">
                Repeat Clients: Haier and Dravton Dairy
              </h3>
              <p className="text-[13px] leading-[1.6] text-[var(--grey)]" data-reveal="">
                Haier has had four structures built at Raiwind: a store shed, a mezzanine floor, a crane shed and a crane and mezzanine shed. Dravton Dairy has had four structures built at Chunian: a dairy shed, a milking parlour shed, a feed storage shed and a rapid exit structure.
              </p>
              <p className="text-[13px] leading-[1.6] text-[var(--grey)]" data-reveal="">
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

      {/* FAQ (Block E) */}
      {pageData.faq && pageData.faq.length > 0 && (
        <section className="py-12 lg:py-16 bg-[var(--offwhite)] border-b border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] max-w-[800px]">
            <span className="block text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em] mb-2">
              Questions
            </span>
            <h2 className="text-[18px] lg:text-[28px] font-semibold text-[var(--ink)] leading-[1.2] mb-6">
              Frequently Asked Questions
            </h2>
            <Accordion items={pageData.faq} />
          </div>
        </section>
      )}

      {/* Related Pages (Block E) */}
      {pageData.related && pageData.related.length > 0 && (
        <section className="py-8 bg-white border-b border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] max-w-[800px]">
            <RelatedPages related={pageData.related} />
          </div>
        </section>
      )}

      {/* Block F — CTA Band */}
      <CtaBand />
    </div>
  );
};
