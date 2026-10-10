import React from "react";
import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb.tsx";

export interface HeroBandProps {
  variant?: "image" | "blue";
  imageSrc?: string;
  imageAlt?: string;
  breadcrumbItems: BreadcrumbItem[];
  h1: string;
  subtitle?: string;
}

export const HeroBand: React.FC<HeroBandProps> = ({
  breadcrumbItems,
  h1,
  subtitle,
}) => {
  // First sentence only for subtitle
  const cleanSubtitle = subtitle ? subtitle.split(". ")[0].replace(/\.$/, "") + "." : undefined;

  return (
    <section className="w-full bg-white border-b border-[var(--line)] pt-[calc(var(--header-h)+20px)] lg:pt-[calc(var(--header-h)+32px)] pb-6 lg:pb-8">
      <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <div className="max-w-[760px]">
          {/* Breadcrumb: small 10px uppercase */}
          <div className="mb-2.5">
            <Breadcrumb items={breadcrumbItems} theme="dark" className="text-[10px]" />
          </div>

          {/* Heading in small text */}
          <h1
            className="text-[18px] lg:text-[26px] font-semibold text-[var(--ink)] leading-[1.2] tracking-[-0.01em]"
            data-split=""
          >
            {h1}
          </h1>

          {/* Subtitle / summary */}
          {cleanSubtitle && (
            <p
              className="mt-2 text-[13px] lg:text-[14px] text-[var(--grey)] leading-[1.5] max-w-[640px]"
              data-fade-up=""
            >
              {cleanSubtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
