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
  title = "Get a Quote for Your Steel Building",
  description = "Send the use, size and location of your project. An engineer will read the details and reply with questions and the next steps. A steel building is judged for decades, so the planning starts before any steel is cut.",
  className = "",
}) => {
  return (
    <section
      className={`relative w-full py-24 overflow-hidden text-white ${className}`}
      style={{
        background: "var(--blue-glossy)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.15)",
      }}
    >
      {/* Background Image with Royal Blue gloss */}
      <div
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none overflow-hidden"
        data-parallax="6"
      >
        <img
          src={A.quote}
          alt="Steel building background"
          className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[var(--blue)]/60" />
      </div>

      <div className="relative max-w-[1340px] mx-auto px-[var(--pad-x)] text-center flex flex-col items-center">
        <h2
          className="text-[20px] lg:text-[32px] font-semibold leading-[1.2] tracking-[-0.015em] text-white max-w-[800px] mb-4"
          data-split=""
        >
          {title}
        </h2>

        <p
          className="text-[14px] lg:text-[15px] leading-[1.6] text-white/85 max-w-[640px] mb-8"
          data-reveal=""
        >
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto" data-fade-up="">
          <Button
            href="/contact-us/#quote"
            className="w-full sm:w-auto bg-white text-[var(--blue)] hover:bg-white/90"
          >
            {SITE.cta.primary}
          </Button>

          <Button
            variant="hero"
            href={`tel:${SITE.tel[0]}`}
            className="w-full sm:w-auto"
          >
            {SITE.cta.secondary}
          </Button>
        </div>
      </div>
    </section>
  );
};
