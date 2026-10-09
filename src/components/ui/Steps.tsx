import React from "react";

export interface StepItem {
  name: string;
  text: string;
}

export interface StepsProps {
  items: StepItem[];
  className?: string;
}

export const Steps: React.FC<StepsProps> = ({ items, className = "" }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className={`relative pl-12 lg:pl-16 my-10 ${className}`} data-reveal-group="">
      {/* Vertical 1px grey line that draws with scaleY scrub */}
      <div
        className="absolute left-[16px] lg:left-[20px] top-4 bottom-4 w-[1px] bg-[var(--line)]"
        data-steps=""
      />

      <div className="space-y-10 lg:space-y-12">
        {items.map((step, idx) => {
          const stepNum = String(idx + 1).padStart(2, "0");
          return (
            <div key={idx} className="relative" data-reveal="">
              {/* Number marker on the line */}
              <div className="absolute -left-[44px] lg:-left-[48px] top-0.5 w-6 h-6 flex items-center justify-center bg-[var(--white)]">
                <span className="text-[13px] font-semibold text-[var(--blue)]">
                  {stepNum}
                </span>
              </div>
              <h3 className="text-[20px] lg:text-[22px] font-semibold text-[var(--ink)] mb-2">
                {step.name}
              </h3>
              <p className="text-[16px] leading-[1.65] text-[var(--grey)] max-w-[700px]">
                {step.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
