import React, { useRef, useEffect } from "react";
import { A } from "../../data/assets.ts";
import { BreadcrumbItem } from "./Breadcrumb.tsx";
import { BackButton } from "./BackButton.tsx";
import { cld } from "../../lib/cld.ts";
import { gsap } from "../../lib/gsap.ts";

export interface HeroBandProps {
  variant?: "image" | "blue" | "article" | "immersive";
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
  const bgImage = imageSrc || A.division.peb;
  const cleanSubtitle = subtitle ? subtitle.split(". ")[0].replace(/\.$/, "") + "." : "";

  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (variant === "immersive" && containerRef.current) {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      if (imgRef.current) {
        gsap.fromTo(
          imgRef.current,
          { opacity: 0, scale: 1.1 },
          { opacity: 1, scale: 1, duration: 1.6, ease: "cubic-bezier(0.23, 1, 0.32, 1)" }
        );
      }
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9, delay: 0.2, ease: "cubic-bezier(0.22, 1, 0.36, 1)" }
        );
      }
      if (btnRef.current) {
        gsap.fromTo(
          btnRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, delay: 0.4, ease: "cubic-bezier(0.22, 1, 0.36, 1)" }
        );
      }
    }
  }, [variant]);

  // Variant: immersive (PART 7.1)
  if (variant === "immersive") {
    return (
      <section ref={containerRef} className="relative w-full bg-[#0A0A0A]">
        {/* Desktop (768px and up) */}
        <div
          className="hidden md:flex relative w-full overflow-hidden flex-col justify-between"
          style={{
            height: "clamp(520px, calc(100svh - var(--nav-h)), 760px)",
          }}
        >
          {/* Full-bleed photo with scale & fade */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              ref={imgRef}
              src={cld(bgImage, 2560)}
              alt={imageAlt || h1}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Flat nav blue tint 22% */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{ backgroundColor: "rgba(30, 58, 138, 0.22)" }}
          />

          {/* Gradient */}
          <div
            className="absolute inset-0 z-[2] pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.28) 38%, rgba(0,0,0,0) 70%)",
            }}
          />



          {/* Bottom text block */}
          <div className="container relative z-[3] pb-14 text-left">
            <h1
              ref={headlineRef}
              className="font-bold text-white uppercase tracking-[-0.02em] max-w-[860px]"
              style={{
                fontSize: "var(--fs-hero)",
                lineHeight: 1.1,
              }}
            >
              {h1}
            </h1>

            <div className="mt-6">
              <a
                ref={btnRef}
                href="/contact-us/"
                className="btn btn-light btn-sm"
              >
                <span>Request a Quote</span>
                <span className="btn-arrow">→</span>
              </a>
            </div>

            {/* Visually hidden sub-text for SEO preservation */}
            {cleanSubtitle && (
              <p
                style={{
                  position: "absolute",
                  width: "1px",
                  height: "1px",
                  overflow: "hidden",
                  clip: "rect(0 0 0 0)",
                }}
              >
                {cleanSubtitle}
              </p>
            )}
          </div>
        </div>

        {/* Mobile (below 768px) */}
        <div className="md:hidden w-full flex flex-col">
          {/* Photo on top 16/9 with Back button */}
          <div className="relative w-full overflow-hidden bg-[#0A0A0A]" style={{ aspectRatio: "16/9" }}>
            <img
              src={cld(bgImage, 1080)}
              alt={imageAlt || h1}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover object-center"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ backgroundColor: "rgba(30, 58, 138, 0.22)" }}
            />

          </div>

          {/* Solid nav blue panel underneath */}
          <div
            className="w-full text-white text-left px-6 py-7"
            style={{ backgroundColor: "var(--blue)" }}
          >
            <h1
              className="font-bold text-white uppercase tracking-[-0.02em]"
              style={{
                fontSize: "var(--fs-hero)",
                lineHeight: 1.22,
                textWrap: "balance",
              }}
            >
              {h1}
            </h1>

            <div className="mt-[18px]">
              <a
                href="/contact-us/"
                className="btn btn-light btn-sm"
              >
                <span>Request a Quote</span>
                <span className="btn-arrow">→</span>
              </a>
            </div>

            {/* Hidden subtext for SEO */}
            {cleanSubtitle && (
              <p
                style={{
                  position: "absolute",
                  width: "1px",
                  height: "1px",
                  overflow: "hidden",
                  clip: "rect(0 0 0 0)",
                }}
              >
                {cleanSubtitle}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Article variant
  if (variant === "article") {
    return (
      <section className="relative w-full bg-[#0A0A0A]">
        <div className="hidden md:block relative w-full h-[60svh] lg:h-[70vh] overflow-hidden bg-[#0A0A0A]">
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <img
              src={cld(bgImage, 2560)}
              alt={imageAlt || h1}
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 1, background: "rgba(30, 58, 138, 0.20)", mixBlendMode: "multiply" }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 2,
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.20) 45%, rgba(0, 0, 0, 0) 100%)",
            }}
          />
          <div className="absolute z-[3] pointer-events-auto left-[20px] bottom-[40px] right-[20px] lg:left-[40px] lg:bottom-[64px] lg:right-[40px]">
            <div className="w-full max-w-[320px] lg:max-w-[640px]">
              <h1 className="text-[22px] lg:text-[40px] font-bold text-white uppercase leading-[1.15] tracking-[-0.02em]">
                {h1}
              </h1>
              {cleanSubtitle && (
                <p className="mt-[14px] text-[12px] lg:text-[14px] text-white/85 font-normal leading-[1.6] max-w-[560px]">
                  {cleanSubtitle}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="md:hidden w-full flex flex-col">
          <div className="relative w-full overflow-hidden bg-[#0A0A0A]" style={{ aspectRatio: "16 / 9" }}>
            <img
              src={cld(bgImage, 1080)}
              alt={imageAlt || h1}
              className="w-full h-full object-cover block"
              loading="eager"
              fetchPriority="high"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: "rgba(30, 58, 138, 0.20)" }} />
          </div>
          <div style={{ backgroundColor: "var(--blue)" }} className="w-full bg-[var(--blue)] text-white px-6 py-8 text-left">
            <h1 className="text-[20px] font-bold text-white uppercase leading-[1.22] tracking-[-0.02em] line-clamp-4">
              {h1}
            </h1>
            {cleanSubtitle && <p className="mt-3 text-[13px] text-white/85 leading-[1.6]">{cleanSubtitle}</p>}
          </div>
        </div>
      </section>
    );
  }

  // Classic default variant
  return (
    <section className="relative w-full h-[60svh] lg:h-[70vh] overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <img
          src={cld(bgImage, 2560)}
          alt={imageAlt || h1}
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1, background: "rgba(30, 58, 138, 0.20)", mixBlendMode: "multiply" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.20) 45%, rgba(0, 0, 0, 0) 100%)",
        }}
      />
      <div className="absolute z-[3] pointer-events-auto left-[20px] bottom-[40px] right-[20px] lg:left-[40px] lg:bottom-[64px] lg:right-[40px]">
        <div className="w-full max-w-[320px] lg:max-w-[640px]">
          <h1 className="text-[22px] lg:text-[40px] font-bold text-white uppercase leading-[1.15] tracking-[-0.02em]">
            {h1}
          </h1>
          {cleanSubtitle && (
            <p className="mt-[14px] text-[12px] lg:text-[14px] text-white/82 font-normal leading-[1.6] max-w-[560px]">
              {cleanSubtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
