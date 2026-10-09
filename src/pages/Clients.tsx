import React from "react";
import { Link } from "react-router-dom";
import pageData from "../content/generated/page-65.json";
import { SITE } from "../data/site.ts";
import { A } from "../data/assets.ts";
import { Breadcrumb } from "../components/ui/Breadcrumb.tsx";
import { QuickAnswer } from "../components/ui/QuickAnswer.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { RelatedPages } from "../components/ui/RelatedPages.tsx";
import { QuoteBand } from "../components/ui/QuoteBand.tsx";

// 10 clients per Section 0 edit 4 & 5
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
    <div className="w-full">
      {/* 1. Header */}
      <section className="relative w-full h-[62svh] min-h-[420px] lg:h-[70vh] bg-[var(--ink)] overflow-hidden">
        <div className="absolute inset-0 w-full h-full" data-parallax="4">
          <img
            src={A.team}
            alt="Steel buildings built by Steel Mind for clients across Pakistan."
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#0A0A0A]/35" />
        </div>

        <div className="absolute inset-x-0 bottom-0 max-w-[1340px] mx-auto px-[var(--pad-x)] pb-10 z-10">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Our Clients" },
            ]}
            theme="white"
            className="mb-4"
          />
          <h1
            className="text-[28px] lg:text-[56px] font-bold text-white leading-[1.1] tracking-[-0.02em] max-w-[800px]"
            data-split=""
          >
            {pageData.h1}
          </h1>
        </div>
      </section>

      {/* 2. Quick Answer (Floating Trigger + Drawer) */}
      <QuickAnswer text={pageData.quickAnswer} h1={pageData.h1} related={pageData.related} />

      {/* 3. Who Builds With Steel Mind */}
      <section className="py-12 max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <h2 className="text-[28px] lg:text-[38px] font-semibold text-[var(--ink)] mb-4" data-split="">
          Who Builds With Steel Mind
        </h2>
        <p className="text-[16px] lg:text-[17px] leading-[1.65] text-[var(--grey)] max-w-[760px]" data-reveal="">
          Steel Mind builds for manufacturers, dairy and livestock farms, apparel and retail brands, steel and engineering companies and infrastructure contractors. A client list shows who has trusted a contractor with real money and real deadlines, so each logo below belongs to a company that has worked with Steel Mind.
        </p>
      </section>

      {/* 4. Client Logo Grid (10 tiles, 2 cols mobile / 4 cols desktop, gap 1px) */}
      <section className="py-8 max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[var(--line)] p-[1px] border border-[var(--line)]">
          {CLIENT_NAMES.map((name) => {
            const logo = A.clientLogo[name as keyof typeof A.clientLogo];
            return (
              <div
                key={name}
                className="bg-white h-[120px] lg:h-[160px] flex items-center justify-center p-6 group transition-colors"
                data-reveal=""
              >
                {logo ? (
                  <img
                    src={logo}
                    alt={`${name} logo`}
                    className="max-h-[70%] max-w-[70%] object-contain mix-blend-multiply grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-[16px] font-semibold text-[var(--ink)]">{name}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Published Project Links */}
        <div className="mt-12 space-y-4 max-w-[760px] border-t border-[var(--line)] pt-8">
          <h3 className="text-[20px] font-semibold text-[var(--ink)]">
            Selected Client Projects You Can Explore:
          </h3>
          <ul className="space-y-3 text-[16px] text-[var(--grey)]">
            <li>
              <strong className="text-[var(--ink)] font-semibold">Haier:</strong>{" "}
              <Link to="/projects/haier-peb-crane-and-mezzanine-shed-raiwind/" className="text-[var(--blue)] hover:underline">
                PEB Crane and Mezzanine Shed (97,888 sq ft)
              </Link>
            </li>
            <li>
              <strong className="text-[var(--ink)] font-semibold">Dravton Dairy:</strong>{" "}
              <Link to="/projects/dravton-dairy-peb-dairy-shed-chunian/" className="text-[var(--blue)] hover:underline">
                PEB Dairy Shed (39,330 sq ft)
              </Link>
              {", "}
              <Link to="/projects/dravton-dairy-peb-milking-parlour-shed-chunian/" className="text-[var(--blue)] hover:underline">
                Milking Parlour Shed (21,686 sq ft)
              </Link>
              {", and "}
              <Link to="/projects/dravton-dairy-rapid-exit-structure-chunian/" className="text-[var(--blue)] hover:underline">
                Rapid Exit Structure (484 sq ft)
              </Link>
            </li>
            <li>
              <strong className="text-[var(--ink)] font-semibold">Maria B:</strong>{" "}
              <Link to="/projects/maria-b-peb-mezzanine-floor-lahore/" className="text-[var(--blue)] hover:underline">
                PEB Mezzanine Floor (7,020 sq ft)
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* 5. Repeat Clients, What Clients Receive */}
      <section className="py-16 bg-[var(--offwhite)] border-y border-[var(--line)]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4" data-reveal="">
            <h2 className="text-[24px] lg:text-[28px] font-semibold text-[var(--ink)]">
              Repeat Clients
            </h2>
            <p className="text-[16px] leading-[1.65] text-[var(--grey)]">
              Haier has had four structures built at Raiwind: a store shed, a mezzanine floor, a crane shed and a crane and mezzanine shed. Dravton Dairy has had four structures built at Chunian: a dairy shed, a milking parlour shed, a feed storage shed and a rapid exit structure. Repeat orders show that clients are satisfied with the work and with the way the team deals with them.
            </p>
          </div>

          <div className="space-y-4" data-reveal="">
            <h2 className="text-[24px] lg:text-[28px] font-semibold text-[var(--ink)]">
              What Clients Receive
            </h2>
            <p className="text-[16px] leading-[1.65] text-[var(--grey)]">
              Every client receives one contract, one point of contact, a written schedule and support after handover. See Committed To and After Sale Services.
            </p>
            <div className="pt-2">
              <Link
                to="/contact-us/#quote"
                className="inline-block px-6 py-3 bg-blue-glossy text-white font-semibold text-[13px] uppercase tracking-[0.05em] hover:brightness-110 transition-all"
              >
                Become a Client
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      {pageData.faq && (
        <section className="py-16 max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <h2 className="text-[28px] lg:text-[38px] font-semibold text-[var(--ink)] mb-8" data-split="">
            Frequently Asked Questions
          </h2>
          <Accordion items={pageData.faq} />
        </section>
      )}

      {/* 7. Related */}
      <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <RelatedPages related={pageData.related} />
      </div>

      {/* 8. CTA Band */}
      <QuoteBand />
    </div>
  );
};
