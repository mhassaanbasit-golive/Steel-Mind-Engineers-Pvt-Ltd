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
  const [hasError, setHasError] = useState(false);
  const heroUrl = image ? cl(image, 2560) : "";

  return (
    <section className="relative w-full bg-[#0A0A0A] overflow-hidden">
      {/* Desktop (768px and up): Cinematic full-width hero extending under transparent header */}
      <div
        className="hidden md:block relative w-full overflow-hidden bg-[#0A0A0A]"
        style={{
          height: "min(calc(100svh - 40px), 720px)",
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
            className="absolute inset-0 w-full h-full object-cover object-[center_45%] block animate-[subpageHeroFadeIn_800ms_cubic-bezier(0.22,1,0.36,1)_forwards]"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[#0A0A0A]" />
        )}

        {/* 1. Flat tint on photo: nav blue at 28% opacity */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: "rgba(30, 58, 138, 0.28)" }}
        />

        {/* 2. Soft bottom gradient over lower 60% */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.30) 45%, rgba(0, 0, 0, 0) 100%)",
          }}
        />

        {/* 3. Soft left gradient for text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(0, 0, 0, 0.48) 0%, rgba(0, 0, 0, 0) 55%)",
          }}
        />

        {overlay && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.20)" }}
          />
        )}

        {/* Desktop Headline & Button bottom-left on image, above all overlays (z-10) */}
        <div className="absolute bottom-10 lg:bottom-14 left-6 lg:left-12 max-w-[820px] text-left z-10 pointer-events-auto">
          <h1 className="text-[26px] lg:text-[40px] font-bold text-white uppercase leading-[1.15] tracking-[-0.02em]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-[14px] lg:text-[15px] text-white/85 max-w-[620px] leading-relaxed">
              {subtitle}
            </p>
          )}
          <div className="mt-6">
            <TransitionLink
              to={quoteUrl}
              className="inline-flex items-center justify-center font-semibold text-[11px] uppercase tracking-[0.08em] min-h-[42px] px-6 py-2.5 bg-white text-[var(--blue)] hover:bg-white/90 active:scale-95 transition-all duration-300 cursor-pointer select-none shadow-sm hover:shadow-md"
            >
              <span>Request a Quote</span>
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </TransitionLink>
          </div>
        </div>
      </div>

      {/* Mobile (below 768px): 16/9 photo on top with subtle tint, solid nav-blue panel underneath */}
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
              className="w-full h-full object-cover object-center block"
            />
          ) : (
            <div className="w-full h-full bg-[#0A0A0A]" />
          )}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: "rgba(30, 58, 138, 0.22)" }}
          />
        </div>

        {/* Solid nav-blue panel underneath — reduced size but bold thickness preserved */}
        <div
          style={{ backgroundColor: "var(--blue, #1E3A8A)" }}
          className="w-full bg-[var(--blue)] text-white px-6 py-8 text-left"
        >
          <h1
            className="font-bold text-white uppercase tracking-[-0.02em]"
            style={{
              fontSize: "clamp(16px, 4.6vw, 21px)",
              lineHeight: 1.25,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2.5 text-[13px] text-white/85 leading-normal">
              {subtitle}
            </p>
          )}
          <div className="mt-5">
            <TransitionLink
              to={quoteUrl}
              className="inline-flex items-center justify-center font-semibold text-[10px] uppercase tracking-[0.08em] min-h-[38px] px-5 py-2.5 bg-white text-[var(--blue)] hover:bg-white/90 active:scale-95 transition-all cursor-pointer select-none"
            >
              <span>Request a Quote</span>
              <span className="ml-1.5 inline-block">→</span>
            </TransitionLink>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes subpageHeroFadeIn {
          from { opacity: 0; transform: scale(1.02); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
};
