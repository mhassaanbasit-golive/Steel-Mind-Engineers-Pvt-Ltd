import React, { useState } from "react";
import { cl } from "../../data/images.ts";
import { TransitionLink } from "../ui/TransitionLink.tsx";

export interface SubpageNextBannerProps {
  heading: string;
  title: string;
  url: string;
  image: string;
  compact?: boolean;
  overlay?: boolean;
}

export const SubpageNextBanner: React.FC<SubpageNextBannerProps> = ({
  heading,
  title,
  url,
  image,
  compact = false,
  overlay = false,
}) => {
  const [ratio, setRatio] = useState<string>("16 / 9");
  const [hasError, setHasError] = useState(false);

  const checkRatio = (img: HTMLImageElement | null) => {
    if (!img) return;
    if (img.naturalWidth && img.naturalHeight) {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const target = 16 / 9;
      const actual = w / h;
      if (Math.abs(actual - target) / target <= 0.06) {
        setRatio("16 / 9");
      } else {
        setRatio(`${w} / ${h}`);
      }
    }
  };

  const nextUrl = image ? cl(image, 2000) : "";

  return (
    <section className="w-full bg-white border-t border-[#E5E5E5]">
      <TransitionLink
        to={url}
        className="group block w-full no-underline select-none cursor-pointer"
      >
        {/* Banner Image Box: stretch with natural aspect ratio */}
        <div
          className="relative w-full overflow-hidden bg-[#0F172A]"
          style={{ aspectRatio: ratio }}
        >
          {nextUrl && !hasError ? (
            <img
              src={nextUrl}
              alt={title}
              loading="lazy"
              ref={(el) => {
                if (el && el.complete && el.naturalWidth > 0) {
                  checkRatio(el);
                }
              }}
              onLoad={(e) => checkRatio(e.currentTarget)}
              onError={() => setHasError(true)}
              className="absolute inset-0 w-full h-full block"
              style={{ objectFit: "fill" }}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-[#0F172A]" />
          )}

          {/* Separate 20% exact nav blue overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: "rgba(30, 58, 138, 0.20)" }}
          />

          {/* Desktop dark gradient for high contrast */}
          <div
            className="hidden md:block absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.30) 45%, rgba(0,0,0,0) 100%)",
            }}
          />

          {/* 20% overlay when overlay prop is true */}
          {overlay && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.20)",
                zIndex: 3,
              }}
            />
          )}

          {/* Desktop Headline & link bottom-left on image */}
          <div className="hidden md:block absolute bottom-8 lg:bottom-12 left-6 lg:left-12 max-w-[800px] text-left z-10">
            <h2 className="text-[24px] lg:text-[38px] font-bold text-white tracking-[-0.02em] leading-[1.15] mb-4">
              {heading}
            </h2>
            <div className="inline-flex items-center gap-2 text-[14px] lg:text-[16px] font-semibold text-white">
              <span>{title}</span>
              <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
                &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Mobile (<768px): Headline and link BELOW image on nav blue, 24px side, 32px top/bottom */}
        <div className="md:hidden w-full bg-[var(--blue)] text-white px-6 py-8 text-left">
          <h2
            className={`font-bold text-white tracking-[-0.02em] mb-4 ${
              compact ? "text-balance [hyphens:none] line-clamp-2" : "text-[19px] leading-[1.25]"
            }`}
            style={{
              fontSize: compact ? "clamp(18px, 5vw, 24px)" : undefined,
              lineHeight: compact ? 1.25 : undefined,
              textWrap: compact ? ("balance" as any) : undefined,
            }}
          >
            {heading}
          </h2>
          <div className="inline-flex items-center gap-2 text-[14px] font-semibold text-white">
            <span>{title}</span>
            <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5">
              &rarr;
            </span>
          </div>
        </div>
      </TransitionLink>
    </section>
  );
};
