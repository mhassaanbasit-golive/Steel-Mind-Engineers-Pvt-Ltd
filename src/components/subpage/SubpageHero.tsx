import React, { useState } from "react";
import { cl } from "../../data/images.ts";
import { TransitionLink } from "../ui/TransitionLink.tsx";

export interface SubpageHeroProps {
  title: string;
  image: string;
  quoteUrl?: string;
  compact?: boolean;
  overlay?: boolean;
}

export const SubpageHero: React.FC<SubpageHeroProps> = ({
  title,
  image,
  quoteUrl = "/contact-us/#quote",
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

  const heroUrl = image ? cl(image, 2400) : "";

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
