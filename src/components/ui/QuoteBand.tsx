import React from "react";
import { A } from "../../data/assets.ts";
import { SITE } from "../../data/site.ts";
import { Button } from "./Button.tsx";

export interface QuoteBandProps {
  title?: string;
  description?: string;
  className?: string;
}

export const QuoteBand: React.FC<QuoteBandProps> = ({
  title = "Get a Quote",
  description = "Send the use, size and location of your project. An engineer will read the details and reply with questions and the next steps. A steel building is judged for decades, so the planning starts before any steel is cut.",
  className = "",
}) => {
  return (
    <section
      style={{ backgroundColor: "var(--blue)" }}
      className={`relative w-full aspect-[16/9] lg:aspect-[21/9] overflow-hidden text-white bg-[var(--blue)] flex items-center justify-center ${className}`}
    >
      {/* The image itself: position: absolute; inset: 0; object-fit: cover; object-position: center; z-index: 0 */}
      <img
        src={A.quote}
        alt="Steel building background"
        style={{
          position: "absolute",
          inset: 0,
          objectFit: "cover",
          objectPosition: "center",
          zIndex: 0,
        }}
        className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none"
        loading="lazy"
      />

      {/* Layer 1 — Royal Blue tint: position: absolute; inset: 0; background: rgba(30, 58, 138, 0.55); z-index: 1 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(30, 58, 138, 0.55)",
          zIndex: 1,
        }}
      />

      {/* Layer 2 — bottom readability gradient: position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.10) 45%, rgba(0,0,0,0) 100%); z-index: 2 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.10) 45%, rgba(0,0,0,0) 100%)",
          zIndex: 2,
        }}
      />

      {/* The text and buttons inside the band: position: relative; z-index: 3 */}
      <div
        style={{ position: "relative", zIndex: 3 }}
        className="relative z-[3] max-w-[1340px] mx-auto px-[var(--pad-x)] py-6 text-center flex flex-col items-center"
      >
        <h2
          className="text-[16px] lg:text-[24px] font-semibold leading-[1.2] tracking-[-0.015em] text-white max-w-[800px] mb-3"
          data-split=""
        >
          {title}
        </h2>

        <p
          className="text-[12px] lg:text-[13px] leading-[1.65] text-white/90 max-w-[560px] mb-6"
          data-reveal=""
        >
          {description}
        </p>

        <div
          className="flex flex-row flex-wrap items-center justify-center gap-2.5 w-full sm:w-auto"
          data-fade-up=""
        >
          <Button
            size="sm"
            variant="hero-white"
            href="/contact-us/#quote"
            className="w-auto min-w-[130px]"
          >
            {SITE.cta.primary}
          </Button>

          <Button
            size="sm"
            variant="hero"
            href={`tel:${SITE.tel[0]}`}
            className="w-auto min-w-[130px]"
          >
            {SITE.cta.secondary}
          </Button>
        </div>
      </div>
    </section>
  );
};
