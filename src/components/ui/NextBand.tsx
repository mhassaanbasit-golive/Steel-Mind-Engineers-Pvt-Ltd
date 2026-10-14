import React from "react";
import { TransitionLink } from "./TransitionLink.tsx";

export interface NextBandProps {
  heading?: string;
  nextUrl: string;
  nextTitle: string;
  className?: string;
  image?: string;
  variant?: "split" | "overlay";
}

export const NextBand: React.FC<NextBandProps> = ({
  heading,
  nextUrl,
  nextTitle,
  className = "",
  image,
  variant,
}) => {
  const descriptiveHeading = heading || `Explore ${nextTitle}`;

  // Image band with nav-blue gradient overlay (Blogs next banner)
  if (variant === "overlay" && image) {
    return (
      <section
        className={`relative w-full overflow-hidden bg-[#1E3A8A] min-h-[320px] md:min-h-[480px] flex items-center ${className}`.trim()}
      >
        {/* Background Image: Desktop center, Mobile 75% center */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          {/* Desktop img (768px and up): object-position center */}
          <img
            src={image}
            alt={nextTitle}
            width={2560}
            height={1080}
            loading="lazy"
            decoding="async"
            className="hidden md:block w-full h-full object-cover"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          {/* Mobile img (below 768px): object-position 75% center */}
          <img
            src={image}
            alt={nextTitle}
            width={2560}
            height={1080}
            loading="lazy"
            decoding="async"
            className="md:hidden w-full h-full object-cover"
            style={{
              objectFit: "cover",
              objectPosition: "75% center",
            }}
          />
        </div>

        {/* Nav-blue gradient overlay on the left so white title stays readable */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background:
              "linear-gradient(to right, rgba(30, 58, 138, 0.95) 0%, rgba(30, 58, 138, 0.88) 35%, rgba(30, 58, 138, 0.45) 65%, rgba(30, 58, 138, 0.15) 100%)",
          }}
        />
        <div
          className="md:hidden absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background:
              "linear-gradient(to right, rgba(30, 58, 138, 0.94) 0%, rgba(30, 58, 138, 0.82) 100%)",
          }}
        />

        {/* Content container */}
        <div
          className="relative w-full max-w-[1340px] mx-auto px-[var(--pad-x,20px)] lg:px-[var(--pad-x,40px)] py-16 md:py-20"
          style={{ zIndex: 2 }}
        >
          <div className="max-w-[760px] text-left">
            {/* Same NEXT label */}
            <div
              className="text-white/70 uppercase font-semibold text-[10px] md:text-[12px] tracking-[0.14em] mb-4"
            >
              NEXT
            </div>

            {/* Same title "Discuss Your Project With Our Engineers" */}
            <h2
              className="text-white font-bold tracking-[-0.02em] text-[24px] md:text-[36px] lg:text-[40px] leading-[1.15] mb-6 max-w-[900px]"
            >
              {descriptiveHeading}
            </h2>

            {/* Same "Contact Us →" link */}
            <div>
              <TransitionLink
                to={nextUrl}
                className="inline-flex items-center gap-3 text-white font-semibold text-[14px] md:text-[16px] group transition-opacity hover:opacity-85 select-none cursor-pointer"
              >
                <span>{nextTitle}</span>
                <span className="inline-block text-[18px] transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </TransitionLink>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Image band variant when image prop is provided (3D Concept next banner)
  if (image) {
    return (
      <section className={`w-full bg-white ${className}`.trim()}>
        {/* Desktop (768px and up): split grid 5fr / 7fr, min-height 420px */}
        <div
          className="hidden md:grid w-full min-h-[420px] items-stretch"
          style={{
            gridTemplateColumns: "minmax(0, 5fr) minmax(0, 7fr)",
            gap: 0,
          }}
        >
          {/* Left cell: solid nav-blue background. Padding 64px 48px 64px (page container left edge). Content centered vertically. */}
          <div
            className="flex flex-col justify-center text-left"
            style={{
              backgroundColor: "var(--blue, #1E3A8A)",
              paddingTop: "64px",
              paddingBottom: "64px",
              paddingRight: "48px",
              paddingLeft: "max(var(--pad-x, 40px), calc((100vw - 1340px) / 2 + var(--pad-x, 40px)))",
            }}
          >
            {/* Label: 12px, uppercase, letter-spacing 0.14em, white at 70% */}
            <div
              className="text-white/70 uppercase font-semibold"
              style={{
                fontSize: "12px",
                letterSpacing: "0.14em",
              }}
            >
              NEXT
            </div>

            {/* Title: white, font-size clamp(26px, 2.6vw, 40px), line-height 1.15, margin-top 16px, maximum 4 lines */}
            <h2
              className="text-white font-bold tracking-[-0.02em] line-clamp-4"
              style={{
                fontSize: "clamp(26px, 2.6vw, 40px)",
                lineHeight: 1.15,
                marginTop: "16px",
              }}
            >
              {descriptiveHeading}
            </h2>

            {/* Link row: margin-top 32px, 52px high, white text, 16px, weight 600, with the arrow */}
            <div style={{ marginTop: "32px" }}>
              <TransitionLink
                to={nextUrl}
                className="h-[52px] inline-flex items-center gap-3 text-white font-semibold text-[16px] group transition-opacity hover:opacity-90 select-none cursor-pointer"
              >
                <span>{nextTitle}</span>
                <span className="inline-block text-[18px] transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </TransitionLink>
            </div>
          </div>

          {/* Right cell: position relative. The image: position absolute; inset 0; width 100%; height 100%; object-fit cover; object-position 70% center. Touches right edge of screen. No overlay of any kind. */}
          <div className="relative w-full h-full overflow-hidden bg-[#0F172A]">
            <img
              src={image}
              alt={nextTitle}
              width={2560}
              height={1080}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full block"
              style={{
                objectFit: "cover",
                objectPosition: "70% center",
              }}
            />
          </div>
        </div>

        {/* Mobile (below 768px): The image first, then solid nav-blue panel */}
        <div className="md:hidden w-full flex flex-col">
          {/* Image first: Full width, aspect-ratio 16/9, object-fit cover, object-position 70% center */}
          <div
            className="relative w-full overflow-hidden bg-[#0F172A]"
            style={{ aspectRatio: "16 / 9" }}
          >
            <img
              src={image}
              alt={nextTitle}
              width={2560}
              height={1080}
              loading="lazy"
              decoding="async"
              className="w-full h-full block"
              style={{
                objectFit: "cover",
                objectPosition: "70% center",
              }}
            />
          </div>

          {/* Solid nav-blue panel: padding 28px 24px 32px */}
          <div
            className="w-full text-left text-white"
            style={{
              backgroundColor: "var(--blue, #1E3A8A)",
              padding: "28px 24px 32px",
            }}
          >
            {/* Label: 12px */}
            <div
              className="text-white/70 uppercase font-semibold"
              style={{
                fontSize: "12px",
                letterSpacing: "0.14em",
              }}
            >
              NEXT
            </div>

            {/* Title: white, clamp(20px, 5.6vw, 24px), line-height 1.2, no line limit */}
            <h2
              className="text-white font-bold tracking-[-0.02em]"
              style={{
                fontSize: "clamp(20px, 5.6vw, 24px)",
                lineHeight: 1.2,
                marginTop: "16px",
              }}
            >
              {descriptiveHeading}
            </h2>

            {/* Link row: 52px high, 16px, margin-top 20px */}
            <div style={{ marginTop: "20px" }}>
              <TransitionLink
                to={nextUrl}
                className="h-[52px] inline-flex items-center gap-3 text-white font-semibold text-[16px] group transition-opacity hover:opacity-90 select-none cursor-pointer"
              >
                <span>{nextTitle}</span>
                <span className="inline-block text-[18px] transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </TransitionLink>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default behavior (keeps every other page exactly as it is)
  return (
    <section className={`next-band ${className}`.trim()}>
      <div className="next-band-inner">
        <div className="next-band-label">NEXT</div>
        <h2 className="next-band-heading">{descriptiveHeading}</h2>
        <TransitionLink className="next-band-link" to={nextUrl}>
          {nextTitle}
          <span className="next-band-arrow">→</span>
        </TransitionLink>
      </div>
    </section>
  );
};
