import React from "react";
import { A } from "../../data/assets.ts";
import { SITE } from "../../data/site.ts";
import { Button } from "./Button.tsx";

export interface CtaBandProps {
  className?: string;
}

export const CtaBand: React.FC<CtaBandProps> = ({ className = "" }) => {
  return (
    <section
      style={{ backgroundColor: "var(--blue)" }}
      className={`relative w-full overflow-hidden text-white bg-[var(--blue)] aspect-[16/9] lg:aspect-[21/9] flex items-center justify-center ${className}`}
    >
      {/* The image itself: position: absolute; inset: 0; object-fit: cover; object-position: center; z-index: 0 */}
      <img
        src={A.quote}
        alt="Steel Mind Engineers fabrication facility"
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
        className="relative z-[3] max-w-[1340px] mx-auto px-5 lg:px-10 flex flex-col items-center text-center py-6"
      >
        <div className="max-w-[560px] space-y-2.5">
          <h2 className="text-[16px] lg:text-[24px] font-semibold text-white leading-[1.2]">
            Get a Quote
          </h2>
          <p className="text-[12px] lg:text-[13px] text-white/90 leading-[1.65]">
            Send the use, size and location of your project. An engineer will reply with questions and the next steps.
          </p>
          <div className="pt-2 flex flex-row flex-wrap items-center justify-center gap-3">
            <Button
              variant="hero-white"
              size="sm"
              href="/contact-us/#quote"
            >
              Request a Quote
            </Button>
            <Button
              variant="ghost"
              size="sm"
              href={`tel:${SITE.tel[0]}`}
            >
              Talk to an Expert
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
