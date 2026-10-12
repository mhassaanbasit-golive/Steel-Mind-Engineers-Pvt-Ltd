import React from "react";
import pageData from "../content/generated/page-66.json";
import { SITE } from "../data/site.ts";
import { HeroBand } from "../components/ui/HeroBand.tsx";
import { Button } from "../components/ui/Button.tsx";
import { NextBand } from "../components/ui/NextBand.tsx";

export const Profile: React.FC = () => {
  return (
    <div className="w-full bg-white">
      {/* Block A — Hero Band (Blue) */}
      <HeroBand
        variant="blue"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Company Profile" },
        ]}
        h1={pageData.h1}
        subtitle={pageData.quickAnswer}
      />

      <div className="py-12 lg:py-16 max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <div className="space-y-4 max-w-[560px] text-[12px] lg:text-[13px] leading-[1.65] text-[var(--grey)]">
          {pageData.blocks.map((b, i) => (
            <p key={i}>{b.text}</p>
          ))}
        </div>

        <div className="py-8 mt-6 border-t border-[var(--line)]">
          <Button
            size="sm"
            variant="primary"
            href={SITE.profilePdf}
            target="_blank"
            className="w-fit min-w-[130px]"
          >
            {SITE.profileButton}
          </Button>
        </div>
      </div>

      {/* Next Band */}
      <NextBand
        heading="Explore Our Factory and Capabilities"
        nextUrl="/about-us/"
        nextTitle="About Us"
      />
    </div>
  );
};
