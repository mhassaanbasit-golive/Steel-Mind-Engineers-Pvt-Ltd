import React from "react";
import { Link } from "react-router-dom";
import { UI } from "../../data/ui.ts";
import { PROJECTS } from "../../data/projects.ts";

export interface RelatedPagesProps {
  related: string[];
  className?: string;
}

const ROUTE_MAP: Record<string, string> = {
  "About Us": "/about-us/introduction/",
  "Introduction": "/about-us/introduction/",
  "Vision": "/about-us/vision/",
  "Mission": "/about-us/mission/",
  "Our Core Values": "/about-us/core-values/",
  "SME Policy": "/about-us/sme-policy/",
  "Committed To": "/about-us/committed-to/",
  "Factory Tour": "/about-us/factory-tour/",

  "Pre-Engineered Buildings": "/pre-engineered-buildings-pakistan/",
  "PEB Overview": "/pre-engineered-buildings-pakistan/overview/",
  "Advantages": "/pre-engineered-buildings-pakistan/advantages/",
  "Advantages of PEB": "/pre-engineered-buildings-pakistan/advantages/",
  "3D Concept": "/pre-engineered-buildings-pakistan/3d-concept/",
  "One-Step Solution": "/pre-engineered-buildings-pakistan/one-step-solution/",
  "Engineering Department": "/pre-engineered-buildings-pakistan/engineering-department/",
  "Primary Framing System": "/pre-engineered-buildings-pakistan/primary-framing-system/",
  "Basic Parameters": "/pre-engineered-buildings-pakistan/basic-parameters/",
  "Sub Structures": "/pre-engineered-buildings-pakistan/sub-structures/",
  "Crane System": "/pre-engineered-buildings-pakistan/crane-system/",
  "Mezzanine System": "/pre-engineered-buildings-pakistan/mezzanine-system/",
  "Accessories": "/pre-engineered-buildings-pakistan/accessories/",

  "Industrial Sheds": "/industrial-sheds-pakistan/",
  "Factory Sheds": "/industrial-sheds-pakistan/factory-sheds/",
  "Dairy Farm Sheds": "/industrial-sheds-pakistan/dairy-farm-sheds/",
  "Poultry Sheds": "/industrial-sheds-pakistan/poultry-sheds/",
  "Workshop Sheds": "/industrial-sheds-pakistan/workshop-sheds/",
  "Crane Sheds": "/industrial-sheds-pakistan/crane-sheds/",

  "Steel Warehouses": "/steel-warehouses-pakistan/",
  "Storage Warehouses": "/steel-warehouses-pakistan/storage-warehouses/",
  "Logistics Warehouses": "/steel-warehouses-pakistan/logistics-warehouses/",
  "Cold Storage Warehouses": "/steel-warehouses-pakistan/cold-storage-warehouses/",
  "Grain and Wheat Warehouses": "/steel-warehouses-pakistan/grain-and-wheat-warehouses/",
  "Warehouses with Loading Docks": "/steel-warehouses-pakistan/warehouses-with-loading-docks/",

  "Structural Steel Fabrication": "/structural-steel-fabrication-pakistan/",
  "Columns and Beams": "/structural-steel-fabrication-pakistan/columns-and-beams/",
  "Trusses": "/structural-steel-fabrication-pakistan/trusses/",
  "Mezzanine Floors": "/structural-steel-fabrication-pakistan/mezzanine-floors/",
  "Steel Bridges": "/structural-steel-fabrication-pakistan/steel-bridges/",
  "Crane Gantry Structures": "/structural-steel-fabrication-pakistan/crane-gantry-structures/",

  "Custom Steel Fabrication": "/custom-steel-fabrication-pakistan/",
  "Machine Frames": "/custom-steel-fabrication-pakistan/machine-frames/",
  "Storage Tanks": "/custom-steel-fabrication-pakistan/storage-tanks/",
  "Hoppers and Bins": "/custom-steel-fabrication-pakistan/hoppers-and-bins/",
  "Steel Doors and Gates": "/custom-steel-fabrication-pakistan/steel-doors-and-gates/",
  "Steel Stairs": "/custom-steel-fabrication-pakistan/steel-stairs/",

  "Services": "/services/",
  "Design": "/services/design/",
  "Detailing": "/services/detailing/",
  "Fabrication": "/services/fabrication/",
  "Cleaning": "/services/cleaning/",
  "Painting": "/services/painting/",
  "Erection": "/services/erection/",
  "After Sale Services": "/services/after-sale-services/",

  "Our Projects": "/projects/",
  "Our Clients": "/clients/",
  "Blogs": "/blog/",
  "Contact Us": "/contact-us/",
  "Company Profile": "/company-profile/",
};

export function resolveRelatedUrl(name: string): string | null {
  const trimmed = name.trim();
  if (ROUTE_MAP[trimmed]) return ROUTE_MAP[trimmed];

  const lower = trimmed.toLowerCase();
  for (const [key, val] of Object.entries(ROUTE_MAP)) {
    if (key.toLowerCase() === lower) return val;
  }

  // Check published projects
  for (const p of PROJECTS.filter((proj) => proj.published)) {
    if (
      p.title.toLowerCase().includes(lower) ||
      lower.includes(p.title.toLowerCase()) ||
      p.slug.toLowerCase().includes(lower) ||
      lower.includes(p.slug.toLowerCase())
    ) {
      return `/projects/${p.slug}/`;
    }
  }

  return null;
}

export const RelatedPages: React.FC<RelatedPagesProps> = ({
  related,
  className = "",
}) => {
  if (!related || related.length === 0) return null;

  const validItems = related
    .map((name) => ({ name, url: resolveRelatedUrl(name) }))
    .filter((item): item is { name: string; url: string } => item.url !== null);

  if (validItems.length === 0) return null;

  return (
    <div className={`my-12 ${className}`} data-reveal="">
      <span className="block text-[12px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em] mb-4">
        {UI.relatedPages}
      </span>
      <div className="border-t border-[var(--line)] divide-y divide-[var(--line)] border-b">
        {validItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.url}
            className="group flex items-center justify-between h-[56px] text-[16px] font-medium text-[var(--ink)] hover:text-[var(--blue)] transition-colors px-1"
          >
            <span>{item.name}</span>
            <svg
              className="w-5 h-5 stroke-current transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.5"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
};
