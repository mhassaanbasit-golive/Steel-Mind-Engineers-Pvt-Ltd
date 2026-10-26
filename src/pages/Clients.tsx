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
  width?: number;
  height?: number;
  projectUrl?: string;
  projectNote?: string;
}

const CLIENTS: ClientItem[] = [
  {
    name: "Haier",
    logo: A.clientLogo["Haier"],
    width: 1024,
    height: 572,
    projectUrl: "/projects/haier-peb-crane-and-mezzanine-shed-raiwind/",
    projectNote: "Store Shed, Crane Shed, Mezzanine",
  },
  {
    name: "Imperial Denim",
    logo: A.clientLogo["Imperial Denim"],
    width: 1536,
    height: 1024,
    projectUrl: "/projects/",
    projectNote: "Apparel & Industrial Facility",
  },
  {
    name: "Moiz Steel",
    logo: A.clientLogo["Moiz Steel"],
    width: 1536,
    height: 1024,
    projectUrl: "/projects/",
    projectNote: "Steel Processing Division",
  },
  {
    name: "Saif Engineers",
    logo: A.clientLogo["Saif Engineers"],
    width: 1024,
    height: 765,
    projectUrl: "/projects/",
    projectNote: "Structural Infrastructure",
  },
  {
    name: "Dravton Dairy",
    logo: A.clientLogo["Dravton Dairy"],
    width: 1536,
    height: 1024,
    projectUrl: "/projects/dravton-dairy-peb-dairy-shed-chunian/",
    projectNote: "Dairy Shed, Milking Parlour, Rapid Exit",
  },
  {
    name: "Latifia Dairy",
    logo: A.clientLogo["Latifia Dairy"],
    width: 1024,
    height: 572,
    projectUrl: "/projects/",
    projectNote: "PEB Dairy Shed, Kasur",
  },
  {
    name: "Maria B",
    logo: A.clientLogo["Maria B"],
    width: 1024,
    height: 572,
    projectUrl: "/projects/maria-b-peb-mezzanine-floor-lahore/",
    projectNote: "Mezzanine Floor, Lahore",
  },
  {
    name: "Elite Stitching",
    logo: A.clientLogo["Elite Stitching"],
    width: 1024,
    height: 572,
    projectUrl: "/projects/",
    projectNote: "Garment Manufacturing Unit",
  },
  {
    name: "MAB",
    logo: A.clientLogo["MAB"],
    width: 1024,
    height: 572,
    projectUrl: "/projects/",
    projectNote: "Industrial Engineering",
  },
  {
    name: "Agha Waqar",
    logo: A.clientLogo["Agha Waqar"],
    width: 1024,
    height: 572,
    projectUrl: "/projects/",
    projectNote: "Commercial Fabrication",
  },
  {
    name: "M/S Yascon",
    logo: A.clientLogo["M/S Yascon"],
    width: 1024,
    height: 572,
    projectUrl: "/projects/yascon-water-requirement-bridge-petaro/",
    projectNote: "Water Requirement Bridge",
  },
  {
    name: "Vendor City",
    logo: A.clientLogo["Vendor City"],
    width: 1024,
    height: 572,
    projectUrl: "/projects/",
    projectNote: "Industrial Facility",
  },
];

export const Clients: React.FC = () => {
  return (
    <article className="w-full bg-white">
      {/* 1. Banner: Immersive Hero without entrance animation */}
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792422059/client-section-banner.jpg"
        imageAlt="Steel buildings built by Steel Mind Engineers for clients across Pakistan."
        h1={pageData.h1}
        subtitle={pageData.quickAnswer}
        disableAnimation={true}
      />

      {/* 2. Logos Section */}
      <section className="w-full bg-white py-14 lg:py-20 border-b border-[var(--line)]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[28px] font-semibold text-[#0A0A0A] uppercase tracking-tight">
              Companies That Have Built With Us
            </h2>
            <p className="text-[13px] lg:text-[14px] text-[#0A0A0A] mt-1.5">
              Click any client to see their completed projects and facilities
            </p>
          </div>

          {/* Clean 2 columns on mobile, 3 columns on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 items-center justify-items-center">
            {CLIENTS.map((client, idx) => (
              <div
                key={client.name}
                className="w-full flex items-center justify-center"
              >
                <TransitionLink
                  to={client.projectUrl || "/projects/"}
                  className="flex flex-col items-center justify-center p-3 sm:p-5 w-full select-none"
                >
                  {client.logo ? (
                    <img
                      src={client.logo}
                      alt={`${client.name} logo`}
                      width={client.width}
                      height={client.height}
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="w-full h-[90px] sm:h-[110px] md:h-[130px] lg:h-[145px] object-contain block"
                    />
                  ) : (
                    <span className="font-semibold text-[16px] lg:text-[20px] text-[var(--ink)] tracking-tight">
                      {client.name}
                    </span>
                  )}
                  {client.projectNote && (
                    <span className="mt-3 text-center text-[11px] sm:text-[12px] uppercase tracking-wider text-[#0A0A0A] font-medium line-clamp-1">
                      {client.projectNote}
                    </span>
                  )}
                </TransitionLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Repeat Clients & What Clients Receive — Static layout, immediate visibility */}
      <section className="py-14 lg:py-20 bg-[#F9FAFB] border-b border-[var(--line)]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Repeat Clients Card */}
            <div
              style={{ backgroundColor: "var(--blue)" }}
              className="p-8 lg:p-10 space-y-4 text-white shadow-md flex flex-col justify-start"
            >
              <h3 className="text-[17px] sm:text-[20px] lg:text-[26px] font-bold text-white uppercase tracking-tight">
                Repeat Clients
              </h3>
              <p className="text-[14px] lg:text-[15px] text-white leading-[1.7]">
                Haier has had four structures built at Raiwind: a store shed, a mezzanine floor, a crane shed, and a combined crane and mezzanine shed. Dravton Dairy has had four structures built at Chunian: a dairy shed, a milking parlour shed, a feed storage shed, and a rapid exit structure. Repeat orders demonstrate lasting satisfaction with structural performance and proactive engineering support.
              </p>
            </div>

            {/* What Clients Receive Card */}
            <div
              style={{ backgroundColor: "var(--blue)" }}
              className="p-8 lg:p-10 space-y-4 text-white shadow-md flex flex-col justify-start"
            >
              <h3 className="text-[17px] sm:text-[20px] lg:text-[26px] font-bold text-white uppercase tracking-tight">
                What Clients Receive
              </h3>
              <p className="text-[14px] lg:text-[15px] text-white leading-[1.7]">
                Every client receives one contract, one dedicated point of contact, a milestone-based written schedule, and warranty support after handover. From initial engineering load calculations in Tekla to on-site crane erection and subsequent facility expansions, our single-source model prevents contractor finger-pointing.
              </p>
            </div>
          </div>

          {/* Become a Client Action Band */}
          <div
            style={{ backgroundColor: "var(--blue)" }}
            className="mt-10 p-8 lg:p-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md"
          >
            <div>
              <h3 className="text-[17px] sm:text-[20px] lg:text-[24px] font-bold text-white uppercase tracking-tight">
                Become a Client
              </h3>
              <p className="text-[13px] lg:text-[14px] text-white mt-1 max-w-[620px]">
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

      {/* 4. FAQ Section */}
      {pageData.faq && pageData.faq.length > 0 && (
        <section className="py-12 lg:py-16 bg-white border-b border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] text-left">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-semibold uppercase text-[#0A0A0A] mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion items={pageData.faq} />
          </div>
        </section>
      )}

      {/* 5. Next Band */}
      <NextBand
        heading="Explore Our Completed Structures & Case Studies"
        nextUrl="/projects/"
        nextTitle="Our Projects"
      />
    </article>
  );
};
