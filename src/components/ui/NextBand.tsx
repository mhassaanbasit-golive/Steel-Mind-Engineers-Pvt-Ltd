import React from "react";
import { TransitionLink } from "./TransitionLink.tsx";
import { cld } from "../../lib/cld.ts";

export interface NextBandProps {
  heading?: string;
  nextUrl: string;
  nextTitle: string;
  className?: string;
  image?: string;
  variant?: "split" | "overlay";
}

const DESCRIPTIVE_HEADINGS: Record<string, string> = {
  "Engineering Department": "See how Steel Mind's engineering team calculates and details every frame.",
  "Primary Framing System": "See how clear-span and multi-span steel portal frames support your building.",
  "Basic Parameters": "Understand building width, eave height, bay spacing, and design load criteria.",
  "Sub Structures": "Learn about purlins, girts, eave struts, and secondary steel framing.",
  "Crane System": "Discover integrated overhead bridge crane systems engineered into the steel frame.",
  "Mezzanine System": "Add functional second-floor office, storage, or production mezzanine space.",
  "Accessories": "Explore industrial sliding doors, louvers, ridge ventilators, and skylights.",
  "One-Step Solution": "Discover how our single-source turnkey process eliminates contractor disputes.",
  "3D Concept": "See how 3D concept modeling lets you approve the building before fabrication.",
  "Factory Sheds": "Turnkey production halls and industrial manufacturing buildings.",
  "Dairy Farm Sheds": "Well-ventilated livestock sheds designed for animal comfort and high yields.",
  "Poultry Sheds": "Controlled-environment poultry houses built for biosecurity and climate control.",
  "Workshop Sheds": "Clear-span maintenance workshops and repair facilities with crane provisions.",
  "Crane Sheds": "Heavy industrial sheds with integrated runway beams for overhead lifting.",
  "Storage Warehouses": "Cost-effective, wide-span storage buildings for raw materials and inventory.",
  "Logistics Warehouses": "Fast-throughput distribution centers with multiple loading docks and staging bays.",
  "Cold Storage": "Insulated temperature-controlled warehouses for perishable goods and food storage.",
  "Grain and Wheat": "Weatherproof, moisture-sealed bulk storage buildings for agriculture.",
  "Grain and Wheat Warehouses": "Weatherproof, moisture-sealed bulk storage buildings for agriculture.",
  "Warehouses with Loading Docks": "Warehouses engineered with automated dock levelers and rapid truck turnarounds.",
  "Columns and Beams": "Precision-cut, welded steel structural sections built to drawing.",
  "Trusses": "Engineered open-web steel trusses for long spans and high roof loads.",
  "Mezzanine Floors": "Custom-designed structural steel mezzanine floors to double your floor area.",
  "Steel Bridges": "Heavy-duty steel vehicular and pedestrian bridges built to high safety standards.",
  "Crane Gantry": "Engineered gantry cranes and runway steel structures for heavy industrial lifting.",
  "Crane Gantry Structures": "Engineered gantry cranes and runway steel structures for heavy industrial lifting.",
  "Machine Frames": "Rigid, vibration-dampened steel frames engineered for heavy industrial machinery.",
  "Storage Tanks": "Welded steel storage vessels and tanks for fuels, water, and industrial liquids.",
  "Hoppers and Bins": "Fabricated bulk material handling hoppers and discharge bins.",
  "Doors and Gates": "Heavy-duty industrial sliding doors and security gates built for factory access.",
  "Steel Doors and Gates": "Heavy-duty industrial sliding doors and security gates built for factory access.",
  "Steel Stairs": "Industrial steel staircases, platforms, and safety handrails.",
  "Design": "Structural engineering and code-compliant calculation for every steel building.",
  "Detailing": "Precise shop fabrication and site erection drawings produced in Tekla and CAD.",
  "Fabrication": "Cutting, fitting, and certified welding in our Lahore manufacturing plant.",
  "Cleaning": "Abrasive blast cleaning to remove mill scale and rust before primer application.",
  "Painting": "High-performance epoxy and polyurethane protective coatings for corrosion resistance.",
  "Erection": "Professional site assembly by certified SME erection crews with crane support.",
  "After Sale Services": "Long-term structural maintenance, expansions, repairs, and after-sale support.",
};

function toTitleCase(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
    .join(" ");
}

export const NextBand: React.FC<NextBandProps> = ({
  heading,
  nextUrl,
  nextTitle,
  className = "",
  image,
}) => {
  const descriptiveHeading =
    heading && heading !== nextTitle
      ? heading
      : DESCRIPTIVE_HEADINGS[nextTitle] || `Explore our engineering solutions for ${nextTitle}.`;

  const bannerImg = image || "https://res.cloudinary.com/cyfb9slf/image/upload/v1791406999/peb-card-image.jpg";
  const titleCasedHeading = toTitleCase(descriptiveHeading);
  const titleCasedNextTitle = toTitleCase(nextTitle);

  return (
    <section className={`w-full bg-[#0A0A0A] border-t border-[#E5E5E5]/20 overflow-hidden ${className}`.trim()}>
      <TransitionLink
        to={nextUrl}
        className="group block w-full no-underline select-none cursor-pointer"
      >
        {/* Desktop (768px and up): Cinematic widescreen banner */}
        <div className="hidden md:block relative w-full h-[380px] lg:h-[440px] overflow-hidden bg-[#0A0A0A]">
          <img
            src={cld(bannerImg, 2560)}
            alt={titleCasedNextTitle}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-center block transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.05]"
          />

          {/* 1. Flat tint on photo: nav blue at 25% */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: "rgba(30, 58, 138, 0.25)" }}
          />

          {/* 2. Dark contrast gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.35) 50%, rgba(0, 0, 0, 0.15) 100%)",
            }}
          />

          {/* 3. Left gradient for high text readability */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.35) 45%, rgba(0, 0, 0, 0) 75%)",
            }}
          />

          {/* Desktop Headline & link bottom-left on image: Title Case on desktop >= 1024px */}
          <div className="absolute bottom-10 lg:bottom-14 left-6 lg:left-12 max-w-[840px] text-left z-10">
            <h2 className="text-[26px] lg:text-[38px] font-bold text-white tracking-[-0.02em] leading-[1.18] mb-5 normal-case lg:normal-case">
              {titleCasedHeading}
            </h2>
            <div className="inline-flex items-center gap-2.5 text-[15px] lg:text-[17px] font-semibold text-white">
              <span>{titleCasedNextTitle}</span>
              <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 text-[20px]">
                &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Mobile (below 768px): Photo on top 16/9, solid nav-blue panel underneath, ALL CAPS on mobile */}
        <div className="md:hidden w-full flex flex-col">
          <div
            className="relative w-full overflow-hidden bg-[#0A0A0A]"
            style={{ aspectRatio: "16 / 9" }}
          >
            <img
              src={cld(bannerImg, 1080)}
              alt={titleCasedNextTitle}
              loading="lazy"
              className="w-full h-full object-cover object-center block"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundColor: "rgba(30, 58, 138, 0.22)" }}
            />
          </div>

          <div
            style={{ backgroundColor: "var(--blue, #1E3A8A)" }}
            className="w-full bg-[var(--blue)] text-white px-6 py-8 text-left"
          >
            <h2
              className="font-bold uppercase text-white tracking-[-0.02em] mb-4"
              style={{
                fontSize: "clamp(17px, 4.8vw, 22px)",
                lineHeight: 1.25,
                textTransform: "uppercase",
              }}
            >
              {descriptiveHeading}
            </h2>
            <div className="inline-flex items-center gap-2 text-[14px] font-semibold text-white">
              <span>{titleCasedNextTitle}</span>
              <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 text-[17px]">
                &rarr;
              </span>
            </div>
          </div>
        </div>
      </TransitionLink>
    </section>
  );
};
