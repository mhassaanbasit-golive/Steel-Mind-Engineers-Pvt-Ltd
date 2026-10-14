import React from "react";
import { A } from "../../data/assets.ts";
import { BreadcrumbItem } from "./Breadcrumb.tsx";

export interface HeroBandProps {
  variant?: "image" | "blue" | "article";
  imageSrc?: string;
  imageAlt?: string;
  breadcrumbItems?: BreadcrumbItem[];
  h1: string;
  subtitle?: string;
}

export const HeroBand: React.FC<HeroBandProps> = ({
  variant = "image",
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

  // Article inner page banner variant
  if (variant === "article") {
    return (
      <section className="relative w-full bg-[#0A0A0A]">
        {/* Desktop (768px and up): full-width image, nav-blue tint, headline bottom-left, white uppercase, sub-text under it */}
        <div className="hidden md:block relative w-full h-[60svh] lg:h-[70vh] overflow-hidden bg-[#0A0A0A]">
          {/* 1. Full-bleed Image */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <img
              src={bgImage}
              alt={imageAlt || h1}
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              width={2560}
              height={1440}
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>

          {/* 2. Nav-blue tint on the photo */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 1,
              background: "rgba(30, 58, 138, 0.20)",
              mixBlendMode: "multiply",
            }}
          />

          {/* 3. Bottom gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 2,
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.20) 45%, rgba(0, 0, 0, 0) 100%)",
            }}
          />

          {/* 4. Content block bottom-left */}
          <div className="absolute z-[3] pointer-events-auto left-[20px] bottom-[40px] right-[20px] lg:left-[40px] lg:bottom-[64px] lg:right-[40px]">
            <div className="w-full max-w-[320px] lg:max-w-[640px]">
              <h1 className="text-[22px] lg:text-[40px] font-bold text-white uppercase leading-[1.15] tracking-[-0.02em]">
                {h1}
              </h1>
              {cleanSubtitle && (
                <p
                  className="mt-[14px] text-[12px] lg:text-[14px] text-white/85 font-normal leading-[1.6] max-w-[560px]"
                  style={{ color: "rgba(255, 255, 255, 0.85)" }}
                >
                  {cleanSubtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mobile (below 768px): photo on top at 16/9, blue panel under it, headline white uppercase 4 lines max, sub-text white at 85% */}
        <div className="md:hidden w-full flex flex-col">
          {/* Photo on top at 16/9 */}
          <div
            className="relative w-full overflow-hidden bg-[#0A0A0A]"
            style={{ aspectRatio: "16 / 9" }}
          >
            <img
              src={bgImage}
              alt={imageAlt || h1}
              className="w-full h-full object-cover block"
              loading="eager"
              fetchPriority="high"
              width={1280}
              height={720}
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
            {/* Nav-blue tint on the photo */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: "rgba(30, 58, 138, 0.20)",
              }}
            />
          </div>

          {/* Solid nav-blue panel underneath */}
          <div
            style={{ backgroundColor: "var(--blue, #1E3A8A)" }}
            className="w-full bg-[var(--blue)] text-white px-6 py-8 text-left"
          >
            <h1 className="text-[20px] font-bold text-white uppercase leading-[1.22] tracking-[-0.02em] line-clamp-4">
              {h1}
            </h1>
            {cleanSubtitle && (
              <p className="mt-3 text-[13px] text-white/85 leading-[1.6]">
                {cleanSubtitle}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // DEFAULT BEHAVIOR (keeps all existing shared pages unchanged)
  return (
    <section className="relative w-full h-[60svh] lg:h-[70vh] overflow-hidden bg-[#0A0A0A]">
      {/* 1. Full-bleed Image (z-index: 0) */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <img
          src={bgImage}
          alt={imageAlt || h1}
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          width={2560}
          height={1440}
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
