import React from "react";
import { Link } from "react-router-dom";
import { SITE } from "../../data/site.ts";
import { A } from "../../data/assets.ts";

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        background: "var(--blue-glossy)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
      }}
      className="text-white pt-16 lg:pt-24 pb-6 lg:pb-8 border-t border-white/12"
    >
      <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
        {/* 4-Column Grid: Desktop 1.3fr 1fr 1fr 1fr, Mobile 1 col gap-10 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10 lg:gap-10">
          {/* Column 1 — Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img
                src={A.logoTransparent}
                alt="Steel Mind Engineers"
                className="w-[110px] h-auto object-contain brightness-0 invert"
              />
            </Link>

            <div className="flex flex-col text-left">
              <span className="font-semibold text-[13px] text-white leading-tight">
                {SITE.header.title}
              </span>
              <span className="text-[9px] uppercase font-semibold text-white/70 tracking-[0.18em] mt-0.5">
                {SITE.header.sub}
              </span>
            </div>

            <p className="text-[11px] leading-[1.6] text-white/65 max-w-[240px]">
              Steel Mind Engineers designs, fabricates and erects steel structures for industry, agriculture and commerce.
            </p>

            <div className="text-[10px] uppercase tracking-[0.14em] text-white font-medium">
              {SITE.tagline}
            </div>

            {/* Social Icons Row (16px thin line, white, gap 12px) */}
            <div className="flex items-center space-x-3 pt-1 text-white">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:opacity-75 transition-opacity"
              >
                <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:opacity-75 transition-opacity"
              >
                <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="0" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href={SITE.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="hover:opacity-75 transition-opacity"
              >
                <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
              <a
                href={SITE.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:opacity-75 transition-opacity"
              >
                <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 — Company */}
          <div className="space-y-4">
            <span className="block text-[10px] uppercase font-semibold text-white/60 tracking-[0.14em]">
              Company
            </span>
            <div className="flex flex-col space-y-2 text-[12px] text-white/85">
              <Link to="/about-us/introduction/" className="hover:underline hover:text-white">
                About Us
              </Link>
              <Link to="/about-us/vision/" className="hover:underline hover:text-white">
                Vision
              </Link>
              <Link to="/about-us/mission/" className="hover:underline hover:text-white">
                Mission
              </Link>
              <Link to="/about-us/core-values/" className="hover:underline hover:text-white">
                Our Core Values
              </Link>
              <Link to="/about-us/sme-policy/" className="hover:underline hover:text-white">
                SME Policy
              </Link>
              <Link to="/about-us/committed-to/" className="hover:underline hover:text-white">
                Committed To
              </Link>
              <Link to="/about-us/factory-tour/" className="hover:underline hover:text-white">
                Factory Tour
              </Link>
              <Link to="/clients/" className="hover:underline hover:text-white">
                Our Clients
              </Link>
              <Link to="/contact-us/" className="hover:underline hover:text-white">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Column 3 — Main Divisions */}
          <div className="space-y-4">
            <span className="block text-[10px] uppercase font-semibold text-white/60 tracking-[0.14em]">
              Main Divisions
            </span>
            <div className="flex flex-col space-y-3 text-[12px] text-white/85">
              {/* Pre-Engineered Buildings */}
              <div>
                <Link to="/pre-engineered-buildings-pakistan/" className="font-semibold text-white hover:underline block">
                  Pre-Engineered Buildings
                </Link>
                <div className="pl-3 pt-1 space-y-1 text-[11px] text-white/70">
                  <Link to="/pre-engineered-buildings-pakistan/overview/" className="hover:underline block">Overview</Link>
                  <Link to="/pre-engineered-buildings-pakistan/advantages/" className="hover:underline block">Advantages</Link>
                  <Link to="/pre-engineered-buildings-pakistan/3d-concept/" className="hover:underline block">3D Concept</Link>
                  <Link to="/pre-engineered-buildings-pakistan/one-step-solution/" className="hover:underline block">One-Step Solution</Link>
                  <Link to="/pre-engineered-buildings-pakistan/engineering-department/" className="hover:underline block">Engineering</Link>
                  <Link to="/pre-engineered-buildings-pakistan/primary-framing-system/" className="hover:underline block">Framing</Link>
                  <Link to="/pre-engineered-buildings-pakistan/basic-parameters/" className="hover:underline block">Parameters</Link>
                  <Link to="/pre-engineered-buildings-pakistan/sub-structures/" className="hover:underline block">Sub Structures</Link>
                  <Link to="/pre-engineered-buildings-pakistan/crane-system/" className="hover:underline block">Crane</Link>
                  <Link to="/pre-engineered-buildings-pakistan/mezzanine-system/" className="hover:underline block">Mezzanine</Link>
                  <Link to="/pre-engineered-buildings-pakistan/accessories/" className="hover:underline block">Accessories</Link>
                </div>
              </div>

              {/* Industrial Sheds */}
              <div>
                <Link to="/industrial-sheds-pakistan/" className="font-semibold text-white hover:underline block">
                  Industrial Sheds
                </Link>
                <div className="pl-3 pt-1 space-y-1 text-[11px] text-white/70">
                  <Link to="/industrial-sheds-pakistan/factory-sheds/" className="hover:underline block">Factory</Link>
                  <Link to="/industrial-sheds-pakistan/dairy-farm-sheds/" className="hover:underline block">Dairy</Link>
                  <Link to="/industrial-sheds-pakistan/poultry-sheds/" className="hover:underline block">Poultry</Link>
                  <Link to="/industrial-sheds-pakistan/workshop-sheds/" className="hover:underline block">Workshop</Link>
                  <Link to="/industrial-sheds-pakistan/crane-sheds/" className="hover:underline block">Crane</Link>
                </div>
              </div>

              {/* Steel Warehouses */}
              <div>
                <Link to="/steel-warehouses-pakistan/" className="font-semibold text-white hover:underline block">
                  Steel Warehouses
                </Link>
                <div className="pl-3 pt-1 space-y-1 text-[11px] text-white/70">
                  <Link to="/steel-warehouses-pakistan/storage-warehouses/" className="hover:underline block">Storage</Link>
                  <Link to="/steel-warehouses-pakistan/logistics-warehouses/" className="hover:underline block">Logistics</Link>
                  <Link to="/steel-warehouses-pakistan/cold-storage-warehouses/" className="hover:underline block">Cold Storage</Link>
                  <Link to="/steel-warehouses-pakistan/grain-and-wheat-warehouses/" className="hover:underline block">Grain</Link>
                  <Link to="/steel-warehouses-pakistan/warehouses-with-loading-docks/" className="hover:underline block">Loading Docks</Link>
                </div>
              </div>

              {/* Structural Steel */}
              <div>
                <Link to="/structural-steel-fabrication-pakistan/" className="font-semibold text-white hover:underline block">
                  Structural Steel
                </Link>
                <div className="pl-3 pt-1 space-y-1 text-[11px] text-white/70">
                  <Link to="/structural-steel-fabrication-pakistan/columns-and-beams/" className="hover:underline block">Columns and Beams</Link>
                  <Link to="/structural-steel-fabrication-pakistan/trusses/" className="hover:underline block">Trusses</Link>
                  <Link to="/structural-steel-fabrication-pakistan/mezzanine-floors/" className="hover:underline block">Mezzanine Floors</Link>
                  <Link to="/structural-steel-fabrication-pakistan/steel-bridges/" className="hover:underline block">Bridges</Link>
                  <Link to="/structural-steel-fabrication-pakistan/crane-gantry-structures/" className="hover:underline block">Gantry</Link>
                </div>
              </div>

              {/* Custom Steel */}
              <div>
                <Link to="/custom-steel-fabrication-pakistan/" className="font-semibold text-white hover:underline block">
                  Custom Steel
                </Link>
                <div className="pl-3 pt-1 space-y-1 text-[11px] text-white/70">
                  <Link to="/custom-steel-fabrication-pakistan/machine-frames/" className="hover:underline block">Machine Frames</Link>
                  <Link to="/custom-steel-fabrication-pakistan/storage-tanks/" className="hover:underline block">Tanks</Link>
                  <Link to="/custom-steel-fabrication-pakistan/hoppers-and-bins/" className="hover:underline block">Hoppers</Link>
                  <Link to="/custom-steel-fabrication-pakistan/steel-doors-and-gates/" className="hover:underline block">Doors and Gates</Link>
                  <Link to="/custom-steel-fabrication-pakistan/steel-stairs/" className="hover:underline block">Stairs</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4 — Services and Other */}
          <div className="space-y-4">
            <span className="block text-[10px] uppercase font-semibold text-white/60 tracking-[0.14em]">
              Services
            </span>
            <div className="flex flex-col space-y-2 text-[12px] text-white/85">
              <Link to="/services/design/" className="hover:underline hover:text-white">Design</Link>
              <Link to="/services/detailing/" className="hover:underline hover:text-white">Detailing</Link>
              <Link to="/services/fabrication/" className="hover:underline hover:text-white">Fabrication</Link>
              <Link to="/services/cleaning/" className="hover:underline hover:text-white">Cleaning</Link>
              <Link to="/services/painting/" className="hover:underline hover:text-white">Painting</Link>
              <Link to="/services/erection/" className="hover:underline hover:text-white">Erection</Link>
              <Link to="/services/after-sale-services/" className="hover:underline hover:text-white">After Sale Services</Link>
            </div>

            <div className="pt-5 space-y-4">
              <span className="block text-[10px] uppercase font-semibold text-white/60 tracking-[0.14em]">
                Other
              </span>
              <div className="flex flex-col space-y-2 text-[12px] text-white/85">
                <Link to="/projects/" className="hover:underline hover:text-white">Our Projects</Link>
                <Link to="/blog/" className="hover:underline hover:text-white">Blogs</Link>
                <a
                  href={SITE.profilePdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white"
                >
                  Company Profile
                </a>
                <Link to="/sitemap/" className="hover:underline hover:text-white">Sitemap</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar (Divider 1px, 24px mt, 16px pt) */}
        <div className="mt-8 pt-4 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/70 gap-2">
          <div>© Steel Mind Engineers Pvt. Ltd.</div>
          <div>
            <a
              href="https://getgolive.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:underline transition-colors"
            >
              Demo Made By getGoLive.io
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
