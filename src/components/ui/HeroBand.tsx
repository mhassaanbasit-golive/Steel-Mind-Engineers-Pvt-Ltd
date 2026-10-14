import React from "react";
import { A } from "../../data/assets.ts";
import { BreadcrumbItem } from "./Breadcrumb.tsx";

export interface HeroBandProps {
  variant?: "image" | "blue";
  imageSrc?: string;
  imageAlt?: string;
  breadcrumbItems?: BreadcrumbItem[];
  h1: string;
  subtitle?: string;
}

export const HeroBand: React.FC<HeroBandProps> = ({
  imageSrc,
  imageAlt,
  h1,
  subtitle,
}) => {
  // First sentence of the Quick Answer only
  const cleanSubtitle = subtitle
    ? subtitle.split(". ")[0].replace(/\.$/, "") + "."
    : "";

  const bgImage = imageSrc || A.division.peb;

  return (
    <section className="relative w-full h-[60svh] lg:h-[70vh] overflow-hidden bg-[#0A0A0A]">
      {/* 1. Full-bleed Image (z-index: 0) */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <img
          src={bgImage}
          alt={imageAlt || h1}
          className="w-full h-full object-cover object-center"
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>

      {/* 2. Royal Blue tint layer (z-index: 1) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: "rgba(30, 58, 138, 0.20)",
          mixBlendMode: "multiply",
        }}
      />

      {/* 3. Bottom gradient (z-index: 2) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.20) 45%, rgba(0, 0, 0, 0) 100%)",
        }}
      />

      {/* 4. Content block (z-index: 3) — Bottom-left content block */}
      <div
        className="absolute z-[3] pointer-events-auto left-[20px] bottom-[40px] right-[20px] lg:left-[40px] lg:bottom-[64px] lg:right-[40px]"
      >
        <div className="w-full max-w-[320px] lg:max-w-[640px]">
          {/* H1: 22px mobile / 40px desktop. Weight 700. Uppercase. White. Line-height 1.15. Letter-spacing -0.02em. */}
          <h1 className="text-[22px] lg:text-[40px] font-bold text-white uppercase leading-[1.15] tracking-[-0.02em]">
            {h1}
          </h1>

          {/* Subtitle: 12px mobile / 14px desktop. White 82%. Max-width 560px. Margin-top 14px. First sentence of Quick Answer only. */}
          {cleanSubtitle && (
            <p
              className="mt-[14px] text-[12px] lg:text-[14px] text-white/82 font-normal leading-[1.6] max-w-[560px]"
              style={{ color: "rgba(255, 255, 255, 0.82)" }}
            >
              {cleanSubtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
