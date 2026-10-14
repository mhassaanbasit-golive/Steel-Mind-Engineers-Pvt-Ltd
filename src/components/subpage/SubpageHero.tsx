import React, { useState } from "react";
import { cl } from "../../data/images.ts";
import { TransitionLink } from "../ui/TransitionLink.tsx";

export interface SubpageHeroProps {
  title: string;
  image: string;
  subtitle?: string;
  quoteUrl?: string;
  compact?: boolean;
  overlay?: boolean;
  variant?: "classic" | "full";
}

export const SubpageHero: React.FC<SubpageHeroProps> = ({
  title,
  image,
  subtitle,
  quoteUrl = "/contact-us/#quote",
  compact = false,
  overlay = false,
  variant = "classic",
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

  const heroUrl = image ? cl(image, 2560) : "";

  // =========================================================================
  // VARIANT "full": 3D Concept hero (min(100svh - nav, 720px), min 520px on desktop)
  // =========================================================================
  if (variant === "full") {
    return (
      <section className="w-full pt-[64px] lg:pt-[var(--nav-h,88px)] bg-white">
        {/* Desktop (768px and up): min(calc(100svh - nav height), 720px), min 520px */}
        <div
          className="hidden md:block relative w-full overflow-hidden bg-[#0A0A0A]"
          style={{
            height: "min(calc(100svh - var(--nav-h, 88px)), 720px)",
            minHeight: "520px",
          }}
        >
          {heroUrl && !hasError ? (
            <img
              src={heroUrl}
              alt={title}
              width={2560}
              height={1440}
              fetchPriority="high"
              loading="eager"
              onError={() => setHasError(true)}
              className="absolute inset-0 w-full h-full block"
              style={{ objectFit: "cover", objectPosition: "50% 65%" }}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-[#0A0A0A]" />
          )}

          {/* 1. Flat tint on photo: nav blue at 30% opacity */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: "rgba(30, 58, 138, 0.30)" }}
          />

          {/* 2. Soft bottom gradient over lower 55%: black at 55% at bottom, transparent at top of zone */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0) 55%)",
            }}
          />

          {/* Desktop Headline & Button bottom-left on image, above all overlays (z-10) — matching Advantages page */}
          <div className="hidden md:block absolute bottom-8 lg:bottom-12 left-6 lg:left-12 max-w-[720px] text-left z-10 pointer-events-auto">
            <h1 className="text-[24px] lg:text-[40px] font-bold text-white uppercase leading-[1.15] tracking-[-0.02em]">
              {title}
            </h1>
            <div className="mt-5">
              <TransitionLink
                to={quoteUrl}
                className="inline-flex items-center justify-center font-semibold text-[10px] uppercase tracking-[0.06em] min-h-[38px] px-5 py-2.5 bg-white text-[var(--blue)] hover:bg-white/90 transition-colors cursor-pointer select-none"
              >
                Request a Quote
              </TransitionLink>
            </div>
          </div>
        </div>

        {/* Mobile (below 768px): Photo on top 16/9, solid nav-blue panel with button underneath — matching Advantages page */}
        <div className="md:hidden w-full flex flex-col">
          {/* Photo on top with 16/9 aspect-ratio */}
          <div
            className="relative w-full overflow-hidden bg-[#0A0A0A]"
            style={{ aspectRatio: "16 / 9" }}
          >
            {heroUrl && !hasError ? (
              <img
                src={heroUrl}
                alt={title}
                width={1280}
                height={720}
                fetchPriority="high"
                loading="eager"
                onError={() => setHasError(true)}
                className="w-full h-full block"
                style={{ objectFit: "cover", objectPosition: "50% 65%" }}
              />
            ) : (
              <div className="w-full h-full bg-[#0A0A0A]" />
            )}
          </div>

          {/* Under photo: solid nav-blue panel with button, matching Advantages page */}
          <div
            style={{ backgroundColor: "var(--blue, #1E3A8A)" }}
            className="w-full bg-[var(--blue)] text-white px-6 py-8 text-left"
          >
            <h1
              className="font-bold text-white uppercase tracking-[-0.02em] text-balance [hyphens:none]"
              style={{
                fontSize: "clamp(15px, 4.4vw, 21px)",
                lineHeight: 1.22,
              }}
            >
              {title}
            </h1>
            <div className="mt-5">
              <TransitionLink
                to={quoteUrl}
                className="inline-flex items-center justify-center font-semibold text-[10px] uppercase tracking-[0.06em] min-h-[38px] px-5 py-2.5 bg-white text-[var(--blue)] hover:bg-white/90 transition-colors cursor-pointer select-none"
              >
                Request a Quote
              </TransitionLink>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================================
  // VARIANT "classic" (DEFAULT): Preserves exact behavior for all existing pages
  // =========================================================================
  return (
    <section className="w-full pt-[64px] lg:pt-[88px] bg-white">
      {/* Aspect Ratio Box with natural ratio check */}
      <div
        className="relative w-full overflow-hidden bg-[#0F172A]"
        style={{ aspectRatio: ratio }}
      >
        {heroUrl && !hasError ? (
          <img
            src={heroUrl}
            alt={title}
            fetchPriority="high"
            loading="eager"
            ref={(el) => {
              if (el && el.complete && el.naturalWidth > 0) {
                checkRatio(el);
              }
            }}
            onLoad={(e) => checkRatio(e.currentTarget)}
            onError={() => setHasError(true)}
            className="absolute inset-0 w-full h-full block animate-[subpageHeroFadeIn_1000ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
            style={{ objectFit: "fill" }}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[#0F172A]" />
        )}

        {/* Desktop Overlay (768px+): 3 separate absolute divs, inset 0 */}
        {/* a) exact nav blue at alpha 0.30 */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none"
          style={{ backgroundColor: "rgba(30, 58, 138, 0.30)" }}
        />
        {/* b) linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.10) 100%) */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.10) 100%)",
          }}
        />
        {/* c) linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 55%) */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 55%)",
          }}
        />

        {/* Mobile Overlay (<768px): exact nav blue at alpha 0.20 only */}
        <div
          className="md:hidden absolute inset-0 pointer-events-none"
          style={{ backgroundColor: "rgba(30, 58, 138, 0.20)" }}
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

        {/* Desktop Headline & Button bottom-left on image, above all overlays (z-10) */}
        <div className="hidden md:block absolute bottom-8 lg:bottom-12 left-6 lg:left-12 max-w-[720px] text-left z-10 pointer-events-auto">
          <h1 className="text-[24px] lg:text-[40px] font-bold text-white uppercase leading-[1.15] tracking-[-0.02em]">
            {title}
          </h1>
          <div className="mt-5">
            <TransitionLink
              to={quoteUrl}
              className="inline-flex items-center justify-center font-semibold text-[10px] uppercase tracking-[0.06em] min-h-[38px] px-5 py-2.5 bg-white text-[var(--blue)] hover:bg-white/90 transition-colors cursor-pointer select-none"
            >
              Request a Quote
            </TransitionLink>
          </div>
        </div>
      </div>

      {/* Mobile (<768px): Headline and button go BELOW image on solid nav blue, 24px side, 32px top/bottom */}
      <div className="md:hidden w-full bg-[var(--blue)] text-white px-6 py-8 text-left">
        <h1
          className={`font-bold text-white uppercase tracking-[-0.02em] ${
            compact ? "text-balance [hyphens:none]" : "text-[20px] leading-[1.2]"
          }`}
          style={{
            fontSize: compact ? "clamp(15px, 4.4vw, 21px)" : undefined,
            lineHeight: compact ? 1.22 : undefined,
            textWrap: compact ? ("balance" as any) : undefined,
          }}
        >
          {title}
        </h1>
        <div className="mt-5">
          <TransitionLink
            to={quoteUrl}
            className="inline-flex items-center justify-center font-semibold text-[10px] uppercase tracking-[0.06em] min-h-[38px] px-5 py-2.5 bg-white text-[var(--blue)] hover:bg-white/90 transition-colors cursor-pointer select-none"
          >
            Request a Quote
          </TransitionLink>
        </div>
      </div>

      <style>{`
        @keyframes subpageHeroFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
};
