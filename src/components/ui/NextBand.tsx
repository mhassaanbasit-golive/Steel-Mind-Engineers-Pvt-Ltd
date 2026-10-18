import React, { useRef, useEffect } from "react";
import { TransitionLink } from "./TransitionLink.tsx";
import { cld } from "../../lib/cld.ts";
import { gsap } from "../../lib/gsap.ts";

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
  const descriptiveHeading = heading || nextTitle;
  const containerRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (image && containerRef.current) {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      if (imgRef.current) {
        gsap.fromTo(
          imgRef.current,
          { scale: 1.06 },
          {
            scale: 1,
            duration: 1.4,
            ease: "cubic-bezier(0.23, 1, 0.32, 1)",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }
    }
  }, [image]);

  const handleMouseEnter = () => {
    if (imgRef.current) {
      gsap.to(imgRef.current, { scale: 1.03, duration: 0.9, ease: "cubic-bezier(0.22, 1, 0.36, 1)" });
    }
    if (arrowRef.current) {
      gsap.to(arrowRef.current, { x: 8, duration: 0.3, ease: "cubic-bezier(0.22, 1, 0.36, 1)" });
    }
  };

  const handleMouseLeave = () => {
    if (imgRef.current) {
      gsap.to(imgRef.current, { scale: 1, duration: 0.9, ease: "cubic-bezier(0.22, 1, 0.36, 1)" });
    }
    if (arrowRef.current) {
      gsap.to(arrowRef.current, { x: 0, duration: 0.3, ease: "cubic-bezier(0.22, 1, 0.36, 1)" });
    }
  };

  // With image prop (PART 7.2)
  if (image) {
    return (
      <section
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative w-full overflow-hidden bg-[var(--blue)] flex items-center min-h-[320px] md:min-h-[480px] group ${className}`.trim()}
      >
        {/* Full-bleed background image */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img
            ref={imgRef}
            src={cld(image, 2560)}
            alt={nextTitle}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-[75%_center] md:object-center transition-transform duration-700"
          />
        </div>

        {/* Gradient on the left (Desktop) */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              "linear-gradient(to right, rgba(30, 58, 138, 0.72) 0%, rgba(30, 58, 138, 0.72) 20%, rgba(30, 58, 138, 0) 62%)",
          }}
        />

        {/* Gradient on Mobile */}
        <div
          className="md:hidden absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              "linear-gradient(to top, rgba(30, 58, 138, 0.85) 0%, rgba(30, 58, 138, 0.4) 50%, transparent 70%)",
          }}
        />

        {/* Content inside container */}
        <div className="container relative z-[2] py-14 md:py-20 text-left">
          <div className="max-w-[720px]">
            <div
              className="uppercase font-semibold tracking-[0.12em] text-white/80 mb-3"
              style={{ fontSize: "var(--fs-eyebrow, 11px)" }}
            >
              NEXT
            </div>

            <h2
              className="text-white font-bold tracking-[-0.02em] line-clamp-2 mb-6"
              style={{
                fontSize: "var(--fs-next-title)",
                lineHeight: 1.2,
              }}
            >
              {descriptiveHeading}
            </h2>

            <div className="h-[52px] flex items-center">
              <TransitionLink
                to={nextUrl}
                className="link-arrow text-white font-semibold text-[15px] md:text-[16px]"
              >
                <span>{nextTitle}</span>
                <span ref={arrowRef} className="inline-block text-[18px]">
                  →
                </span>
              </TransitionLink>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default behavior (keeps existing pages with classic blue next band)
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
