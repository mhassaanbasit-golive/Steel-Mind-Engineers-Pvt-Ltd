import React, { useEffect, useRef } from "react";
import { Link } from "../ui/TransitionLink.tsx";
import { SITE } from "../../data/site.ts";
import { A } from "../../data/assets.ts";
import { FacebookIcon, FacebookIconHandle } from "../icons/facebook.tsx";
import { InstagramIcon, InstagramIconHandle } from "../icons/instagram.tsx";
import { TiktokIcon, TiktokIconHandle } from "../icons/tiktok.tsx";
import { LinkedinIcon, LinkedinIconHandle } from "../icons/linkedin.tsx";

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const facebookRef = useRef<FacebookIconHandle>(null);
  const instagramRef = useRef<InstagramIconHandle>(null);
  const tiktokRef = useRef<TiktokIconHandle>(null);
  const linkedinRef = useRef<LinkedinIconHandle>(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    let hasPlayed = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayed) {
            hasPlayed = true;
            facebookRef.current?.startAnimation();
            instagramRef.current?.startAnimation();
            tiktokRef.current?.startAnimation();
            linkedinRef.current?.startAnimation();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      style={{
        backgroundColor: "var(--blue)",
      }}
      className="text-white pt-16 lg:pt-24 pb-6 lg:pb-8 border-t border-white/15"
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

            <p className="text-[12px] lg:text-[13px] leading-[1.6] text-white/75 max-w-[240px]">
              Steel Mind Engineers designs, fabricates and erects steel structures for industry, agriculture and commerce.
            </p>

            <div className="text-[9px] uppercase tracking-[0.14em] text-white font-medium">
              {SITE.tagline}
            </div>

            {/* Social Icons Row (20px animated icons, no background, white only) */}
            <div className="flex items-center space-x-4 pt-1 text-white">
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                onMouseEnter={() => facebookRef.current?.startAnimation()}
                className="text-white bg-transparent hover:opacity-80 transition-opacity inline-flex items-center justify-center"
              >
                <FacebookIcon ref={facebookRef} size={20} className="text-white" />
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                onMouseEnter={() => instagramRef.current?.startAnimation()}
                className="text-white bg-transparent hover:opacity-80 transition-opacity inline-flex items-center justify-center"
              >
                <InstagramIcon ref={instagramRef} size={20} className="text-white" />
              </a>
              <a
                href={SITE.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                onMouseEnter={() => tiktokRef.current?.startAnimation()}
                className="text-white bg-transparent hover:opacity-80 transition-opacity inline-flex items-center justify-center"
              >
                <TiktokIcon ref={tiktokRef} size={20} className="text-white" />
              </a>
              <a
                href={SITE.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                onMouseEnter={() => linkedinRef.current?.startAnimation()}
                className="text-white bg-transparent hover:opacity-80 transition-opacity inline-flex items-center justify-center"
              >
                <LinkedinIcon ref={linkedinRef} size={20} className="text-white" />
              </a>
            </div>
          </div>

          {/* Column 2 — Company */}
          <div className="space-y-4">
            <span className="block text-[9px] uppercase font-semibold text-white/60 tracking-[0.14em]">
              Company
            </span>
            <div className="flex flex-col space-y-2 text-[12px] text-white/85">
              <Link to="/about" className="hover:underline hover:text-white">
                About Us
              </Link>
              <Link to="/about#vision" className="hover:underline hover:text-white">
                Vision
              </Link>
              <Link to="/about#mission" className="hover:underline hover:text-white">
                Mission
              </Link>
              <Link to="/about#core-values" className="hover:underline hover:text-white">
                Our Core Values
              </Link>
              <Link to="/about/sme-policy#sme-policy" className="hover:underline hover:text-white">
                SME Policy
              </Link>
              <Link to="/about/sme-policy#committed-to" className="hover:underline hover:text-white">
                Committed To
              </Link>
              <Link to="/about/factory" className="hover:underline hover:text-white">
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
            <span className="block text-[9px] uppercase font-semibold text-white/60 tracking-[0.14em]">
              Main Divisions
            </span>
            <div className="flex flex-col space-y-3 text-[12px] text-white/85">
              {/* Pre-Engineered Buildings */}
              <div>
                <Link to="/pre-engineered-buildings-pakistan/" className="font-semibold text-white hover:underline block">
                  Pre-Engineered Buildings
                </Link>
                <div className="pl-3 pt-1 space-y-1 text-[11px] text-white/70">
                  <Link to="/pre-engineered-buildings-pakistan/" className="hover:underline block">Overview</Link>
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
            <span className="block text-[9px] uppercase font-semibold text-white/60 tracking-[0.14em]">
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
              <span className="block text-[9px] uppercase font-semibold text-white/60 tracking-[0.14em]">
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
