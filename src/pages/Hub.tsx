import React from "react";
import { ContentData } from "../content/types.ts";
import { NAV } from "../data/nav.ts";
import { CONTENT_BY_URL } from "../content/index.ts";
import { HubHero } from "../components/hub/HubHero.tsx";
import { HubIntro } from "../components/hub/HubIntro.tsx";
import { PebStickyChapterShowcase } from "../components/hub/PebStickyChapterShowcase.tsx";
import { CinematicChapterReel } from "../components/hub/CinematicChapterReel.tsx";
import { HubFaq } from "../components/hub/HubFaq.tsx";
import { HubEndBand } from "../components/hub/HubEndBand.tsx";

export interface HubProps {
  data: ContentData;
}

const DIVISION_CONFIGS: Record<
  string,
  {
    slug: string;
    divisionTitle: string;
    statementSentence: string;
    nextHeading: string;
    nextUrl: string;
    nextTitle: string;
  }
> = {
  "/pre-engineered-buildings-pakistan/": {
    slug: "peb",
    divisionTitle: "PRE-ENGINEERED BUILDINGS",
    statementSentence: "",
    nextHeading: "See the sheds Steel Mind Engineers builds for factories, farms, workshops and cranes.",
    nextUrl: "/industrial-sheds-pakistan/",
    nextTitle: "Industrial Sheds",
  },
  "/industrial-sheds-pakistan/": {
    slug: "sheds",
    divisionTitle: "INDUSTRIAL SHEDS",
    statementSentence: "Steel sheds for production, storage, dairy and livestock use.",
    nextHeading: "See the warehouses Steel Mind Engineers builds for storage, logistics and cold storage.",
    nextUrl: "/steel-warehouses-pakistan/",
    nextTitle: "Steel Warehouses",
  },
  "/steel-warehouses-pakistan/": {
    slug: "warehouses",
    divisionTitle: "STEEL WAREHOUSES",
    statementSentence: "Wide-span storage and logistics buildings that make full use of the floor area.",
    nextHeading: "See the structural steel Steel Mind Engineers fabricates for frames, trusses and bridges.",
    nextUrl: "/structural-steel-fabrication-pakistan/",
    nextTitle: "Structural Steel Fabrication",
  },
  "/structural-steel-fabrication-pakistan/": {
    slug: "structural",
    divisionTitle: "STRUCTURAL STEEL FABRICATION",
    statementSentence: "Columns, beams, trusses and complete frames, fabricated to drawing.",
    nextHeading: "See the custom steel items Steel Mind Engineers fabricates to your own drawings.",
    nextUrl: "/custom-steel-fabrication-pakistan/",
    nextTitle: "Custom Steel Fabrication",
  },
  "/custom-steel-fabrication-pakistan/": {
    slug: "custom",
    divisionTitle: "CUSTOM STEEL FABRICATION",
    statementSentence: "Machine frames, tanks, hoppers, gates and stairs made to your own drawings.",
    nextHeading: "See the seven services Steel Mind Engineers runs from design to after sale support.",
    nextUrl: "/services/",
    nextTitle: "Services",
  },
};

export const Hub: React.FC<HubProps> = ({ data }) => {
  const isPeb = data.url === "/pre-engineered-buildings-pakistan/";
  const config = DIVISION_CONFIGS[data.url] || {
    slug: "peb",
    divisionTitle: data.h1.split(":")[0]?.toUpperCase() || "DIVISION",
    statementSentence: "Engineered steel structures fabricated to approved drawings across Pakistan.",
    nextHeading: "See the sheds Steel Mind Engineers builds for factories, farms, workshops and cranes.",
    nextUrl: "/industrial-sheds-pakistan/",
    nextTitle: "Industrial Sheds",
  };

  // Find child pages from NAV
  let rawChildren: Array<{ label: string; url: string }> = [];
  const foundNavItem = NAV.find((item) => item.url === data.url);
  if (foundNavItem?.children) {
    rawChildren = foundNavItem.children;
  } else {
    const mainDivs = NAV.find((item) => item.label === "Main Divisions");
    const matchedDiv = mainDivs?.divisions?.find((d) => d.url === data.url);
    if (matchedDiv?.children) {
      rawChildren = matchedDiv.children;
    }
  }

  // Format chapters with 2-digit numbers and first sentence of quickAnswer
  const chapters = rawChildren.map((c, idx) => {
    const childData = CONTENT_BY_URL[c.url];
    const qa = childData?.quickAnswer || "";
    const firstSentence = qa ? qa.split(". ")[0].replace(/\.$/, "") + "." : "";
    const num = String(idx + 1).padStart(2, "0");
    const slugParts = c.url.replace(/\/$/, "").split("/");
    const slug = slugParts[slugParts.length - 1] || `item-${idx + 1}`;

    return {
      num,
      label: c.label,
      url: c.url,
      desc: firstSentence,
      slug,
    };
  });

  return (
    <div className="w-full bg-white">
      {/* ITEM 1 — Hero Band */}
      <HubHero
        divisionSlug={config.slug}
        divisionName={config.divisionTitle}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* ITEM 2 — Intro Band */}
      <HubIntro
        divisionTitle={config.divisionTitle}
        quickAnswer={data.quickAnswer}
      />

      {/* ITEM 3 or ITEM 4 — PEB Sticky Chapter Showcase or Cinematic Chapter Reel */}
      {isPeb ? (
        <PebStickyChapterShowcase chapters={chapters} />
      ) : (
        <CinematicChapterReel
          divisionSlug={config.slug}
          statementSentence={config.statementSentence}
          chapters={chapters}
        />
      )}

      {/* ITEM 5 — FAQ Restyled */}
      {data.faq && data.faq.length > 0 && <HubFaq items={data.faq} />}

      {/* ITEM 6 — End-of-page Royal Blue Band */}
      <HubEndBand
        heading={config.nextHeading}
        nextUrl={config.nextUrl}
        nextTitle={config.nextTitle}
      />
    </div>
  );
};
