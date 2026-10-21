import React from "react";

export interface SectionProps {
  bg?: "white" | "blue";
  label?: string;
  title?: string;
  intro?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  bg = "white",
  title,
  intro,
  children,
  className = "",
  id,
}) => {
  const isBlue = bg === "blue";
  const bgClass = isBlue
    ? "bg-[var(--blue)] text-white"
    : "bg-white text-[var(--ink)]";

  return (
    <section
      id={id}
      style={{
        backgroundColor: isBlue ? "var(--blue)" : "#FFFFFF",
      }}
      className={`py-[var(--section-y)] relative w-full ${bgClass} ${className}`}
    >
      <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
        {(title || intro) && (
          <div className="mb-10 lg:mb-14 max-w-[800px]" data-reveal-group="">
            {title && (
              <h2
                className={`text-[20px] lg:text-[32px] font-semibold leading-[1.2] tracking-[-0.01em] uppercase ${
                  isBlue ? "text-white" : "text-[var(--ink)]"
                }`}
                data-split=""
              >
                {title}
              </h2>
            )}
            {intro && (
              <p
                className={`mt-3 text-[12px] lg:text-[13px] leading-[1.65] max-w-[520px] ${
                  isBlue ? "text-white/85" : "text-[var(--grey)]"
                }`}
                data-reveal=""
              >
                {intro}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};
