import React from "react";
import { Link } from "../components/ui/TransitionLink.tsx";
import { ContentData, ContentBlock } from "../content/types.ts";
import { HeroBand } from "../components/ui/HeroBand.tsx";
import { Canvas } from "../components/ui/Canvas.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { NextBand } from "../components/ui/NextBand.tsx";
import { poolImage } from "../data/pool.ts";
import { NAV } from "../data/nav.ts";

import {
  EngineeringLayout,
  PrimaryFramingLayout,
  BasicParametersLayout,
  SubStructuresLayout,
  CraneSystemLayout,
  MezzanineLayout,
  AccessoriesLayout,
} from "../components/subpage/layouts/PebLayouts.tsx";
import {
  FactoryShedsLayout,
  DairyShedsLayout,
  PoultryShedsLayout,
  WorkshopShedsLayout,
  CraneShedsLayout,
} from "../components/subpage/layouts/IndustrialLayouts.tsx";
import {
  StorageWarehousesLayout,
  LogisticsWarehousesLayout,
  ColdStorageLayout,
  GrainWarehousesLayout,
  LoadingDocksLayout,
} from "../components/subpage/layouts/WarehouseLayouts.tsx";
import {
  ColumnsBeamsLayout,
  TrussesLayout,
  MezzanineFloorsLayout,
  SteelBridgesLayout,
  CraneGantryLayout,
} from "../components/subpage/layouts/StructuralLayouts.tsx";
import {
  MachineFramesLayout,
  StorageTanksLayout,
  HoppersBinsLayout,
  DoorsGatesLayout,
  SteelStairsLayout,
} from "../components/subpage/layouts/CustomLayouts.tsx";
import {
  DesignLayout,
  DetailingLayout,
  FabricationLayout,
  CleaningLayout,
  PaintingLayout,
  ErectionLayout,
  AfterSaleLayout,
} from "../components/subpage/layouts/ServicesLayouts.tsx";

export interface InfoProps {
  data: ContentData;
  isStepsPage?: boolean;
}

export const Info: React.FC<InfoProps> = ({ data, isStepsPage = false }) => {
  // 1. PEB Division Signature Layouts (9.1 - 9.7)
  if (data.url.includes("engineering-department")) return <EngineeringLayout data={data} />;
  if (data.url.includes("primary-framing-system")) return <PrimaryFramingLayout data={data} />;
  if (data.url.includes("basic-parameters")) return <BasicParametersLayout data={data} />;
  if (data.url.includes("sub-structures")) return <SubStructuresLayout data={data} />;
  if (data.url.includes("crane-system")) return <CraneSystemLayout data={data} />;
  if (data.url.includes("mezzanine-system")) return <MezzanineLayout data={data} />;
  if (data.url.includes("accessories")) return <AccessoriesLayout data={data} />;

  // 2. Industrial Sheds Division Signature Layouts (9.8 - 9.12)
  if (data.url.includes("factory-sheds")) return <FactoryShedsLayout data={data} />;
  if (data.url.includes("dairy-farm-sheds")) return <DairyShedsLayout data={data} />;
  if (data.url.includes("poultry-sheds")) return <PoultryShedsLayout data={data} />;
  if (data.url.includes("workshop-sheds")) return <WorkshopShedsLayout data={data} />;
  if (data.url.includes("crane-sheds")) return <CraneShedsLayout data={data} />;

  // 3. Steel Warehouses Division Signature Layouts (9.13 - 9.17)
  if (data.url.includes("cold-storage")) return <ColdStorageLayout data={data} />;
  if (data.url.includes("/storage-warehouses/")) return <StorageWarehousesLayout data={data} />;
  if (data.url.includes("logistics-warehouses")) return <LogisticsWarehousesLayout data={data} />;
  if (data.url.includes("grain-and-wheat")) return <GrainWarehousesLayout data={data} />;
  if (data.url.includes("warehouses-with-loading-docks")) return <LoadingDocksLayout data={data} />;

  // 4. Structural Steel Fabrication Signature Layouts (9.18 - 9.22)
  if (data.url.includes("columns-and-beams")) return <ColumnsBeamsLayout data={data} />;
  if (data.url.includes("trusses")) return <TrussesLayout data={data} />;
  if (data.url.includes("mezzanine-floors")) return <MezzanineFloorsLayout data={data} />;
  if (data.url.includes("steel-bridges")) return <SteelBridgesLayout data={data} />;
  if (data.url.includes("crane-gantry")) return <CraneGantryLayout data={data} />;

  // 5. Custom Steel Fabrication Signature Layouts (9.23 - 9.27)
  if (data.url.includes("machine-frames")) return <MachineFramesLayout data={data} />;
  if (data.url.includes("storage-tanks")) return <StorageTanksLayout data={data} />;
  if (data.url.includes("hoppers-and-bins")) return <HoppersBinsLayout data={data} />;
  if (data.url.includes("doors-and-gates")) return <DoorsGatesLayout data={data} />;
  if (data.url.includes("steel-stairs")) return <SteelStairsLayout data={data} />;

  // 6. Services Sub-pages Signature Layouts (9.28 - 9.34)
  if (data.url.includes("/services/design/")) return <DesignLayout data={data} />;
  if (data.url.includes("/services/detailing/")) return <DetailingLayout data={data} />;
  if (data.url.includes("/services/fabrication/")) return <FabricationLayout data={data} />;
  if (data.url.includes("/services/cleaning/")) return <CleaningLayout data={data} />;
  if (data.url.includes("/services/painting/")) return <PaintingLayout data={data} />;
  if (data.url.includes("/services/erection/")) return <ErectionLayout data={data} />;
  if (data.url.includes("/services/after-sale-services/")) return <AfterSaleLayout data={data} />;

  // Otherwise, default layout for finished/overview pages
  const isBlueHero = data.url.startsWith("/about-us/") || data.url.startsWith("/services/");
  const headerImg = isBlueHero ? undefined : poolImage(data.url, 0);

  // Group blocks by H2 sections
  const sections: Array<{
    h2Title: string;
    paragraphs: string[];
    defs?: Array<{ term: string; desc: string }>;
    steps?: Array<{ step: number; name: string; desc: string }>;
  }> = [];

  let currentSection: {
    h2Title: string;
    paragraphs: string[];
    defs?: Array<{ term: string; desc: string }>;
    steps?: Array<{ step: number; name: string; desc: string }>;
  } | null = null;

  const introParagraphs: string[] = [];

  data.blocks.forEach((block: ContentBlock) => {
    if (block.type === "h2") {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        h2Title: block.title || "",
        paragraphs: [],
      };
    } else if (block.type === "p" && block.text) {
      if (currentSection) {
        currentSection.paragraphs.push(block.text);
      } else {
        introParagraphs.push(block.text);
      }
    } else if (block.type === "defs" && block.items) {
      if (currentSection) {
        currentSection.defs = block.items.map((it) => ({ term: it.name, desc: it.text }));
      }
    } else if (block.type === "steps" && block.items) {
      if (currentSection) {
        currentSection.steps = block.items.map((it, idx) => ({ step: idx + 1, name: it.name, desc: it.text }));
      }
    }
  });
  if (currentSection) sections.push(currentSection);

  // Separate Section 0 (Block B) from Remaining Sections (Block C)
  const blockBSection = sections.length > 0 ? sections[0] : null;
  const remainingSections = sections.length > 1 ? sections.slice(1) : [];

  // Mapped images
  const infoImg = poolImage(data.url, 1);

  // Breadcrumb items
  const pathParts = data.url.split("/").filter(Boolean);
  const parentName =
    pathParts[0] === "about-us"
      ? "About Us"
      : pathParts[0] === "services"
      ? "Services"
      : "Pre-Engineered Buildings";

  const parentUrl =
    pathParts[0] === "about-us"
      ? "/about-us/introduction/"
      : pathParts[0] === "services"
      ? "/services/"
      : `/${pathParts[0]}/`;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: parentName, href: parentUrl },
    { label: data.h1.split(":")[0] || "Page" },
  ];

  // Find next page within current division or NAV group
  let nextPage: { label: string; url: string } | null = null;
  if (data.url === "/pre-engineered-buildings-pakistan/accessories/") {
    nextPage = {
      label: "Pre-Engineered Buildings",
      url: "/pre-engineered-buildings-pakistan/",
    };
  } else {
    for (const item of NAV) {
      if (item.divisions) {
        for (const div of item.divisions) {
          const idx = div.children.findIndex((c) => c.url === data.url);
          if (idx !== -1) {
            if (idx < div.children.length - 1) {
              nextPage = div.children[idx + 1];
            } else {
              nextPage = { label: div.label.replace(/\s*\(PEB\)/, ""), url: div.url };
            }
            break;
          }
        }
        if (nextPage) break;
      } else if (item.children) {
        const idx = item.children.findIndex((c) => c.url === data.url);
        if (idx !== -1 && idx < item.children.length - 1) {
          nextPage = item.children[idx + 1];
          break;
        }
      }
    }
  }

  const nextPageToUse = nextPage || {
    label: "Our Projects",
    url: "/projects/",
  };

  // Detect steps page (Factory Tour or One-Step Solution)
  const isTimelinePage =
    isStepsPage ||
    data.url.includes("factory-tour") ||
    data.url.includes("one-step-solution") ||
    data.blocks.some((b) => b.type === "steps");

  return (
    <div className="w-full bg-white">
      {/* Block A — Hero Band */}
      <HeroBand
        variant={isBlueHero ? "blue" : "image"}
        imageSrc={headerImg}
        imageAlt={data.alt || data.h1}
        breadcrumbItems={breadcrumbItems}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Block B — Information Panel (First H2 + First 2 Paragraphs + Image) */}
      {blockBSection && (
        <section className="py-12 lg:py-20 bg-white border-b border-[#E5E5E5]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              {/* Left Column: First H2 and first two paragraphs */}
              <div className="lg:col-span-6 space-y-4">
                <h2 className="text-[17px] sm:text-[19px] lg:text-[48px] font-bold text-[#0A0A0A] uppercase leading-[1.15] tracking-[-0.02em]">
                  {blockBSection.h2Title}
                </h2>
                {blockBSection.paragraphs.slice(0, 2).map((p, idx) => (
                  <p
                    key={idx}
                    className="text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[#0A0A0A] max-w-[600px]"
                  >
                    {p}
                  </p>
                ))}
              </div>

              {/* Right Column: Page image 4:3 on mobile, natural on desktop */}
              <div className="lg:col-span-6 w-full">
                <Canvas slot="info" ratio="4/3" src={infoImg} alt={blockBSection.h2Title} />
              </div>
            </div>

            {/* Any extra paragraphs or defs inside Block B section */}
            {blockBSection.paragraphs.length > 2 && (
              <div className="mt-8 space-y-4 max-w-[600px]">
                {blockBSection.paragraphs.slice(2).map((p, idx) => (
                  <p key={idx} className="text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[#0A0A0A] max-w-[600px]">
                    {p}
                  </p>
                ))}
              </div>
            )}

            {/* Feature Grid if defs in block B */}
            {blockBSection.defs && blockBSection.defs.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[#E5E5E5]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blockBSection.defs.map((item, idx) => {
                    const numStr = String(idx + 1).padStart(2, "0");
                    return (
                      <div key={idx} className="p-2 bg-transparent text-left">
                        <div className="text-[16px] font-bold text-[#1E3A8A] tabular-nums tracking-[0.06em] mb-3">
                          {numStr}
                        </div>
                        <h3 className="text-[14px] sm:text-[16px] lg:text-[22px] font-semibold text-[#0A0A0A] uppercase leading-[1.25] tracking-[-0.01em] mb-2">
                          {item.term}
                        </h3>
                        <p className="text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[#0A0A0A] max-w-[600px]">
                          {item.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Sequential Timeline for Steps Pages */}
      {isTimelinePage && (
        <section className="py-14 lg:py-20 bg-white border-b border-[#E5E5E5]">
          <div className="max-w-[720px] mx-auto px-[var(--pad-x)]">
            {sections
              .flatMap((s) => s.steps || [])
              .map((st, idx) => {
                const numStr = String(st.step || idx + 1).padStart(2, "0");
                const stepImg = poolImage(data.url, idx + 2);
                const showImg = idx % 2 === 0;

                return (
                  <div key={idx} className="relative pl-12 pb-12 last:pb-0 text-left">
                    {/* Vertical line running down left of numbers */}
                    <div className="absolute left-[8px] top-6 bottom-0 w-[1px] bg-[#1E3A8A]/30" />

                    {/* Step number left */}
                    <div className="absolute left-0 top-0 text-[16px] font-bold text-[#1E3A8A] tabular-nums tracking-[0.06em]">
                      {numStr}
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-[14px] sm:text-[16px] lg:text-[22px] font-semibold text-[#0A0A0A] uppercase leading-[1.25] tracking-[-0.01em]">
                        {st.name}
                      </h3>
                      <p className="text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[#0A0A0A] max-w-[600px]">
                        {st.desc}
                      </p>

                      {/* Image alternating between pairs of steps */}
                      {showImg && (
                        <div className="pt-4 max-w-[480px]">
                          <Canvas
                            slot={`step-${idx + 1}`}
                            ratio="4/3"
                            src={stepImg}
                            alt={st.name}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Alternating Image and Text Pairs for remaining H2 sections */}
      {!isTimelinePage &&
        remainingSections.map((sec, idx) => {
          const isEven = idx % 2 === 0;
          const sectionImg = poolImage(data.url, idx + 2);

          return (
            <React.Fragment key={idx}>
              <section className="py-14 lg:py-20 w-full bg-white border-b border-[#E5E5E5]">
                <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                    <div
                      className={`w-full ${
                        isEven
                          ? "lg:col-span-6 lg:order-1"
                          : "lg:col-span-6 lg:order-2"
                      }`}
                    >
                      <Canvas
                        slot={`pair-${idx + 1}`}
                        ratio="4/3"
                        src={sectionImg}
                        alt={sec.h2Title}
                      />
                    </div>

                    <div
                      className={`space-y-4 max-w-[600px] ${
                        isEven
                          ? "lg:col-span-6 lg:order-2"
                          : "lg:col-span-6 lg:order-1"
                      }`}
                    >
                      <h3 className="text-[14px] sm:text-[16px] lg:text-[22px] font-semibold text-[#0A0A0A] uppercase leading-[1.25] tracking-[-0.01em]">
                        {sec.h2Title}
                      </h3>
                      {sec.paragraphs.map((p, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[#0A0A0A] max-w-[600px]"
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Feature Grid if section has defs */}
                  {sec.defs && sec.defs.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-[#E5E5E5]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sec.defs.map((item, dIdx) => {
                          const numStr = String(dIdx + 1).padStart(2, "0");
                          return (
                            <div key={dIdx} className="p-2 bg-transparent text-left">
                              <div className="text-[16px] font-bold text-[#1E3A8A] tabular-nums tracking-[0.06em] mb-3">
                                {numStr}
                              </div>
                              <h3 className="text-[14px] sm:text-[16px] lg:text-[22px] font-semibold text-[#0A0A0A] uppercase leading-[1.25] tracking-[-0.01em] mb-2">
                                {item.term}
                              </h3>
                              <p className="text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[#0A0A0A] max-w-[600px]">
                                {item.desc}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </React.Fragment>
          );
        })}

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="py-12 lg:py-16 bg-white border-b border-[#E5E5E5]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] max-w-[800px]">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-[#0A0A0A] uppercase leading-[1.15] tracking-[-0.02em] mb-6">
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} />
          </div>
        </section>
      )}

      {/* Next Band */}
      <NextBand
        nextUrl={nextPageToUse.url}
        nextTitle={nextPageToUse.label}
      />
    </div>
  );
};
