import React from "react";
import pageData from "../content/generated/page-66.json";
import { SITE } from "../data/site.ts";
import { Breadcrumb } from "../components/ui/Breadcrumb.tsx";
import { QuickAnswer } from "../components/ui/QuickAnswer.tsx";
import { RelatedPages } from "../components/ui/RelatedPages.tsx";

export const Profile: React.FC = () => {
  return (
    <div className="w-full pt-28 pb-20 max-w-[1340px] mx-auto px-[var(--pad-x)]">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Company Profile" },
        ]}
        className="mb-6"
      />

      <h1 className="text-[26px] lg:text-[48px] font-bold text-[var(--ink)] mb-6" data-split="">
        {pageData.h1}
      </h1>

      <QuickAnswer text={pageData.quickAnswer} h1={pageData.h1} related={pageData.related} />

      <div className="space-y-6 my-10 max-w-[760px] text-[17px] leading-[1.65] text-[var(--grey)]">
        {pageData.blocks.map((b, i) => (
          <p key={i}>{b.text}</p>
        ))}
      </div>

      <div className="py-6 border-t border-[var(--line)]">
        <a
          href={SITE.profilePdf}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-7 py-4 bg-blue-glossy text-white text-[13px] uppercase font-semibold tracking-[0.05em] hover:brightness-110 transition-all rounded-none"
        >
          {SITE.profileButton}
        </a>
      </div>

      <RelatedPages related={pageData.related} />
    </div>
  );
};
