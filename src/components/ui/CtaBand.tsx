import React from "react";
import { SITE } from "../../data/site.ts";
import { Button } from "./Button.tsx";

export interface CtaBandProps {
  className?: string;
}

export const CtaBand: React.FC<CtaBandProps> = ({ className = "" }) => {
  return (
    <section
      style={{
        background: "var(--blue-glossy)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.15)",
      }}
      className={`py-[56px] lg:py-[72px] text-white w-full ${className}`}
    >
      <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] flex flex-col items-center text-center">
        <div className="max-w-[480px] space-y-3">
          <h3 className="text-[15px] lg:text-[18px] font-semibold text-white leading-[1.25]">
            Request a Quote
          </h3>
          <p className="text-[12px] text-white/70 leading-[1.6]">
            Send the use, size and location of your project. An engineer will reply with questions and the next steps.
          </p>
          <div className="pt-3 flex flex-row flex-wrap items-center justify-center gap-2">
            <Button
              variant="hero-white"
              size="sm"
              href="/contact-us/#quote"
            >
              Request a Quote
            </Button>
            <Button
              variant="hero"
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
