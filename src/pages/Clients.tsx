// PART 11. CLIENTS PAGE — Banner + 10 Logos Centered + Repeat Clients + FAQ + NextBand
import React from "react";
import pageData from "../content/generated/page-65.json";
import { A } from "../data/assets.ts";
import { HeroBand } from "../components/ui/HeroBand.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { NextBand } from "../components/ui/NextBand.tsx";
import { Button } from "../components/ui/Button.tsx";
import { TransitionLink } from "../components/ui/TransitionLink.tsx";

interface ClientItem {
  name: string;
  logo?: string;
  projectUrl?: string;
  projectNote?: string;
}

const CLIENTS: ClientItem[] = [
  {
    name: "Haier",
    logo: A.clientLogo["Haier"],
    projectUrl: "/projects/haier-peb-crane-and-mezzanine-shed-raiwind/",
    projectNote: "Store Shed, Crane Shed, Mezzanine",
  },
  {
    name: "Imperial Denim",
    logo: A.clientLogo["Imperial Denim"],
    projectUrl: "/projects/",
    projectNote: "Apparel & Industrial Facility",
  },
  {
    name: "Moiz Steel",
    logo: A.clientLogo["Moiz Steel"],
    projectUrl: "/projects/",
    projectNote: "Steel Processing Division",
  },
  {
    name: "Saif Engineers",
    logo: A.clientLogo["Saif Engineers"],
    projectUrl: "/projects/",
    projectNote: "Structural Infrastructure",
  },
  {
    name: "Dravton Dairy",
    logo: A.clientLogo["Dravton Dairy"],
    projectUrl: "/projects/dravton-dairy-peb-dairy-shed-chunian/",
    projectNote: "Dairy Shed, Milking Parlour, Rapid Exit",
  },
  {
    name: "Latifia Dairy",
    logo: A.clientLogo["Latifia Dairy"],
    projectUrl: "/projects/",
    projectNote: "PEB Dairy Shed, Kasur",
  },
  {
    name: "Maria B",
    logo: A.clientLogo["Maria B"],
    projectUrl: "/projects/maria-b-peb-mezzanine-floor-lahore/",
    projectNote: "Mezzanine Floor, Lahore",
  },
  {
    name: "Elite Stitching",
    logo: A.clientLogo["Elite Stitching"],
    projectUrl: "/projects/",
    projectNote: "Garment Manufacturing Unit",
  },
  {
    name: "MAB",
    logo: A.clientLogo["MAB"],
    projectUrl: "/projects/",
    projectNote: "Industrial Engineering",
  },
  {
    name: "Agha Waqar",
    logo: A.clientLogo["Agha Waqar"],
    projectUrl: "/projects/",
    projectNote: "Commercial Fabrication",
  },
];

export const Clients: React.FC = () => {
  return (
    <article className="w-full bg-white">
      {/* 1. Banner: Immersive Hero */}
      <HeroBand
        variant="immersive"
        imageSrc={A.team}
        imageAlt="Steel buildings built by Steel Mind Engineers for clients across Pakistan."
        h1={pageData.h1}
        subtitle={pageData.quickAnswer}
      />

      {/* 2. Intro Statement: Who Builds With Steel Mind Engineers */}
      <section className="py-12 lg:py-16 max-w-[1340px] mx-auto px-[var(--pad-x)] border-b border-[var(--line)]">
        <div className="max-w-[800px]">
          <span className="block text-[11px] uppercase tracking-[0.14em] font-semibold text-[var(--blue)] mb-2">
            Verified Partnerships
          </span>
          <h2 className="text-[22px] lg:text-[40px] font-bold leading-[1.18] tracking-[-0.02em] text-[var(--ink)] mb-4">
            Who Builds With Steel Mind Engineers
          </h2>
          <p className="text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[var(--grey)]">
            Steel Mind Engineers builds for manufacturers, dairy and livestock farms, apparel and retail brands, steel and engineering companies and infrastructure contractors. A client list shows who has trusted a contractor with real money and real deadlines, so each logo below belongs to a company that has worked with Steel Mind Engineers.
          </p>
        </div>
      </section>

      {/* 3. Logos Section: Plain white bg, clean responsive grid, centered last row */}
      <section className="w-full bg-white py-14 lg:py-20 border-b border-[var(--line)]">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="text-center mb-10">
            <h3 className="text-[18px] lg:text-[24px] font-bold text-[var(--ink)] tracking-tight">
              Companies That Have Built With Us
            </h3>
            <p className="text-[13px] text-[var(--grey)] mt-1">
              Click any client to see their completed projects and facilities
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {CLIENTS.map((client, idx) => (
              <TransitionLink
                key={client.name}
                to={client.projectUrl || "/projects/"}
                style={{ animationDelay: `${idx * 60}ms` }}
                className="group relative w-[calc(50%-12px)] sm:w-[calc(33.333%-22px)] lg:w-[calc(20%-26px)] aspect-[4/3] bg-white border border-[var(--line)] p-4 flex flex-col items-center justify-center transition-all duration-300 hover:border-[var(--blue)] hover:shadow-md hover:-translate-y-1 select-none"
              >
                {client.logo ? (
                  <img
                    src={client.logo}
                    alt={`${client.name} logo`}
                    width={200}
                    height={120}
                    loading="lazy"
                    decoding="async"
                    className="max-w-[75%] max-h-[60%] object-contain grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  />
                ) : (
                  <span className="font-semibold text-[14px] text-[var(--ink)] tracking-tight group-hover:text-[var(--blue)] transition-colors">
                    {client.name}
                  </span>
                )}
                <span className="absolute bottom-2 inset-x-2 text-center text-[9px] uppercase tracking-wider text-[var(--grey)] group-hover:text-[var(--blue)] font-medium truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {client.projectNote || "View Projects →"}
                </span>
              </TransitionLink>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Repeat Clients & What Clients Receive — Dual Contrast Section */}
      <section className="py-14 lg:py-20 bg-[#F9FAFB] border-b border-[var(--line)]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Repeat Clients Card */}
            <div className="bg-white p-8 lg:p-10 border border-[var(--line)] space-y-4">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--blue)] bg-[var(--blue)]/10 px-2.5 py-1">
                Customer Trust
              </span>
              <h3 className="text-[20px] lg:text-[26px] font-bold text-[var(--ink)] tracking-tight">
                Repeat Clients
              </h3>
              <p className="text-[14px] lg:text-[15px] text-[var(--grey)] leading-[1.7]">
                Haier has had four structures built at Raiwind: a store shed, a mezzanine floor, a crane shed, and a combined crane and mezzanine shed. Dravton Dairy has had four structures built at Chunian: a dairy shed, a milking parlour shed, a feed storage shed, and a rapid exit structure. Repeat orders demonstrate lasting satisfaction with structural performance and proactive engineering support.
              </p>
            </div>

            {/* What Clients Receive Card */}
            <div className="bg-white p-8 lg:p-10 border border-[var(--line)] space-y-4">
              <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--blue)] bg-[var(--blue)]/10 px-2.5 py-1">
                Turnkey Commitment
              </span>
              <h3 className="text-[20px] lg:text-[26px] font-bold text-[var(--ink)] tracking-tight">
                What Clients Receive
              </h3>
              <p className="text-[14px] lg:text-[15px] text-[var(--grey)] leading-[1.7]">
                Every client receives one contract, one dedicated point of contact, a milestone-based written schedule, and warranty support after handover. From initial engineering load calculations in Tekla to on-site crane erection and subsequent facility expansions, our single-source model prevents contractor finger-pointing.
              </p>
            </div>
          </div>

          {/* Become a Client Action Band */}
          <div
            style={{ backgroundColor: "var(--blue)" }}
            className="mt-10 p-8 lg:p-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div>
              <h3 className="text-[20px] lg:text-[24px] font-bold text-white tracking-tight">
                Become a Client
              </h3>
              <p className="text-[13px] lg:text-[14px] text-white/85 mt-1 max-w-[620px]">
                Send the use, size and location of your project. An engineer will examine your drawings and specifications and reply with a complete estimate.
              </p>
            </div>
            <Button
              variant="hero-white"
              size="md"
              href="/contact-us/#quote"
              className="flex-shrink-0"
            >
              Request a Quote
            </Button>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      {pageData.faq && pageData.faq.length > 0 && (
        <section className="py-12 lg:py-16 bg-white border-b border-[var(--line)]">
          <div className="max-w-[800px] mx-auto px-[var(--pad-x)] text-left">
            <h2 className="text-[22px] lg:text-[40px] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--ink)] mb-6">
              Frequently Asked Questions
            </h2>
            <Accordion items={pageData.faq} size="large" />
          </div>
        </section>
      )}

      {/* 6. Next Band */}
      <NextBand
        heading="Explore Our Completed Structures & Case Studies"
        nextUrl="/projects/"
        nextTitle="Our Projects"
      />
    </article>
  );
};
