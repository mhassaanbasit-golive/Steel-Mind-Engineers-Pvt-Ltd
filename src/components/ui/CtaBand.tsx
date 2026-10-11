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
      className={`relative w-full overflow-hidden text-white bg-[var(--ink)] aspect-[16/9] lg:aspect-[21/9] flex items-center justify-center ${className}`}
    >
      {/* Background Image A.quote at full colour */}
      <img
        src={A.quote}
        alt="Steel Mind Engineers fabrication facility"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        loading="lazy"
      />

      {/* Overlay: bottom gradient linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 100%) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Text and buttons sit on top in white */}
      <div className="relative z-10 max-w-[1340px] mx-auto px-5 lg:px-10 flex flex-col items-center text-center py-8">
        <div className="max-w-[560px] space-y-3">
          <h3 className="text-[18px] lg:text-[24px] font-semibold text-white leading-[1.25]">
            Request a Quote
          </h3>
          <p className="text-[13px] lg:text-[14px] text-white/90 leading-[1.65]">
            Send the use, size and location of your project. An engineer will reply with questions and the next steps.
          </p>
          <div className="pt-3 flex flex-row flex-wrap items-center justify-center gap-3">
            <Button
              variant="ghost"
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
              Speak to an Engineer
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
