import React from "react";
import { TransitionLink } from "./TransitionLink.tsx";

export interface NextBandProps {
  heading?: string;
  nextUrl: string;
  nextTitle: string;
  className?: string;
  image?: string;
}

export const NextBand: React.FC<NextBandProps> = ({
  heading,
  nextUrl,
  nextTitle,
  className = "",
  image,
}) => {
  const descriptiveHeading = heading || `Explore ${nextTitle}`;

  // Image band variant when image prop is provided
  if (image) {
    return (
      <section
        className={`relative w-full overflow-hidden min-h-[320px] md:min-h-[480px] flex items-center bg-[#0F172A] ${className}`.trim()}
      >
        {/* Background Image filling band */}
        <img
          src={image}
          alt={nextTitle}
          width={2560}
          height={1080}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover [object-position:75%_center] md:[object-position:center] block"
          style={{ objectFit: "cover" }}
        />

        {/* Left-to-right gradient: nav blue at 70% on left edge, 0% at 60% width */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(30, 58, 138, 0.70) 0%, rgba(30, 58, 138, 0.70) 15%, rgba(30, 58, 138, 0) 60%)",
          }}
        />

        {/* Content starts at same left edge as page container */}
        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-8 py-12 md:py-16 text-left">
          <div className="text-[10px] tracking-[0.14em] uppercase font-semibold text-white/70 mb-3">
            NEXT
          </div>

          <h2
            className="font-bold text-white tracking-[-0.02em] leading-[1.1] mb-6 max-w-[850px] line-clamp-2 md:line-clamp-none"
            style={{
              fontSize: "clamp(26px, 7.4vw, 32px)",
            }}
          >
            <span className="hidden md:inline" style={{ fontSize: "clamp(40px, 4vw, 64px)" }}>
              {descriptiveHeading}
            </span>
            <span className="md:hidden">
              {descriptiveHeading}
            </span>
          </h2>

          <TransitionLink
            to={nextUrl}
            className="h-[52px] inline-flex items-center gap-3 text-white font-semibold text-[15px] md:text-[16px] group transition-opacity hover:opacity-90 select-none"
          >
            <span>{nextTitle}</span>
            <span className="inline-block text-[18px] transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </TransitionLink>
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
