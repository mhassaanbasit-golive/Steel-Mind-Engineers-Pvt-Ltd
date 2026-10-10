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
      className={`relative w-full py-24 overflow-hidden text-white bg-[var(--ink)] ${className}`}
    >
      {/* Background Image full colour with soft dark gradient */}
      <div
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none overflow-hidden"
        data-parallax="6"
      >
        <img
          src={A.quote}
          alt="Steel building background"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>

      <div className="relative max-w-[1340px] mx-auto px-[var(--pad-x)] text-center flex flex-col items-center">
        <h2
          className="text-[18px] lg:text-[28px] font-semibold leading-[1.2] tracking-[-0.015em] text-white max-w-[800px] mb-4"
          data-split=""
        >
          {title}
        </h2>

        <p
          className="text-[13px] lg:text-[15px] leading-[1.6] text-white/90 max-w-[640px] mb-8"
          data-reveal=""
        >
          {description}
        </p>

        <div className="flex flex-row flex-wrap items-center justify-center gap-2 w-full sm:w-auto" data-fade-up="">
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
