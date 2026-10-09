import React from "react";
import { Link } from "react-router-dom";
import pageData from "../content/generated/page-53.json";
import { PROJECTS } from "../data/projects.ts";
import { Breadcrumb } from "../components/ui/Breadcrumb.tsx";
import { QuickAnswer } from "../components/ui/QuickAnswer.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { RelatedPages } from "../components/ui/RelatedPages.tsx";
import { QuoteBand } from "../components/ui/QuoteBand.tsx";
import { A } from "../data/assets.ts";

export const ProjectsIndex: React.FC = () => {
  const publishedProjects = PROJECTS.filter((p) => p.published);

  return (
    <div className="w-full">
      {/* 1. Header with Haier crane and mezzanine image */}
      <section className="relative w-full h-[62svh] min-h-[420px] lg:h-[70vh] bg-[var(--ink)] overflow-hidden">
        <div className="absolute inset-0 w-full h-full" data-parallax="4">
          <img
            src={A.project.haierCraneMezzanine[0]}
            alt="Finished steel crane shed built by Steel Mind in Pakistan."
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#0A0A0A]/35" />
        </div>

        <div className="absolute inset-x-0 bottom-0 max-w-[1340px] mx-auto px-[var(--pad-x)] pb-10 z-10">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Our Projects" },
            ]}
            theme="white"
            className="mb-4"
          />
          <h1
            className="text-[28px] lg:text-[56px] font-bold text-white leading-[1.1] tracking-[-0.02em] max-w-[800px]"
            data-split=""
          >
            {pageData.h1}
          </h1>
        </div>
      </section>

      {/* 2. Quick Answer (Floating Trigger + Drawer) */}
      <QuickAnswer text={pageData.quickAnswer} h1={pageData.h1} related={pageData.related} />

      {/* 3. Proof You Can Check */}
      <section className="py-12 max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <h2 className="text-[28px] lg:text-[38px] font-semibold text-[var(--ink)] mb-4" data-split="">
          Proof You Can Check
        </h2>
        <p className="text-[16px] lg:text-[17px] leading-[1.65] text-[var(--grey)] max-w-[760px]" data-reveal="">
          A steel contractor is best judged by what it has built. Every project below lists the client, the place, the height, the width, the length and the covered area. The largest crane sheds cover almost 100,000 square feet, and the dairy sheds show repeat work for the same farms.
        </p>
      </section>

      {/* 4. Project List Table (6 Rows) */}
      <section className="py-8 max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <div className="border-t border-[var(--line)] divide-y divide-[var(--line)] border-b">
          {publishedProjects.map((proj) => (
            <Link
              key={proj.id}
              to={`/projects/${proj.slug}/`}
              className="group flex flex-col md:flex-row md:items-center justify-between py-5 hover:bg-[var(--offwhite)] transition-colors px-2"
              data-reveal=""
            >
              <div className="flex items-center space-x-4">
                <div className="w-[72px] h-[72px] overflow-hidden bg-neutral-100 flex-shrink-0">
                  <img
                    src={proj.images[0]}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-[13px] text-[var(--grey)] mt-0.5">
                    {proj.client} · {proj.location}
                  </p>
                </div>
              </div>

              <div className="mt-3 md:mt-0 flex items-center space-x-6 text-right">
                <span className="text-[16px] font-bold text-[var(--blue)]">
                  {proj.area.toLocaleString()} sq ft
                </span>
                <svg className="w-5 h-5 stroke-current text-[var(--grey)] group-hover:text-[var(--blue)] group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. 6 Project Cards in 2-3 Column Grid */}
      <section className="py-16 bg-[var(--offwhite)] border-b border-[var(--line)]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedProjects.map((proj, idx) => {
              const ratio = idx % 2 === 0 ? "aspect-[4/5]" : "aspect-[1/1]";
              return (
                <Link
                  key={proj.id}
                  to={`/projects/${proj.slug}/`}
                  className="group block bg-white border border-[var(--line)] overflow-hidden"
                  data-reveal=""
                >
                  <div className={`w-full ${ratio} overflow-hidden bg-neutral-100`}>
                    <img
                      src={proj.images[0]}
                      alt={proj.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    <span className="text-[12px] uppercase font-semibold text-[var(--grey)] tracking-[0.08em]">
                      {proj.client}
                    </span>
                    <h3 className="text-[20px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors">
                      {proj.title}
                    </h3>
                    <div className="text-[15px] font-semibold text-[var(--blue)] pt-1">
                      {proj.area.toLocaleString()} sq ft
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. What the Projects Show */}
      <section className="py-16 max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <h2 className="text-[28px] lg:text-[38px] font-semibold text-[var(--ink)] mb-6" data-split="">
          What the Projects Show
        </h2>
        <div className="space-y-3 max-w-[760px]">
          <div className="flex items-start space-x-3 text-[16px] text-[var(--grey)]">
            <span className="w-1.5 h-1.5 bg-[var(--blue)] mt-2.5 flex-shrink-0" />
            <span>Scale. Crane sheds of almost 100,000 square feet.</span>
          </div>
          <div className="flex items-start space-x-3 text-[16px] text-[var(--grey)]">
            <span className="w-1.5 h-1.5 bg-[var(--blue)] mt-2.5 flex-shrink-0" />
            <span>Range. Sheds, mezzanine floors and a steel bridge.</span>
          </div>
          <div className="flex items-start space-x-3 text-[16px] text-[var(--grey)]">
            <span className="w-1.5 h-1.5 bg-[var(--blue)] mt-2.5 flex-shrink-0" />
            <span>Repeat clients. Haier and Dravton Dairy came back for more than one structure.</span>
          </div>
          <div className="flex items-start space-x-3 text-[16px] text-[var(--grey)]">
            <span className="w-1.5 h-1.5 bg-[var(--blue)] mt-2.5 flex-shrink-0" />
            <span>Reach. Projects in Lahore, Kasur, Chunian and Sindh.</span>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--line)]">
          <h3 className="text-[22px] font-semibold text-[var(--ink)] mb-3">
            Start Your Own Project
          </h3>
          <p className="text-[16px] text-[var(--grey)] mb-6 max-w-[600px]">
            Send the use, size and location of your building. An engineer will review it and reply.
          </p>
          <Link
            to="/contact-us/#quote"
            className="inline-block px-7 py-3.5 bg-blue-glossy text-white font-semibold text-[13px] uppercase tracking-[0.05em] hover:brightness-110 transition-all"
          >
            Request a Quote
          </Link>
        </div>
      </section>

      {/* 7. FAQ */}
      {pageData.faq && (
        <section className="py-16 bg-[var(--offwhite)] border-t border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <h2 className="text-[28px] lg:text-[38px] font-semibold text-[var(--ink)] mb-8" data-split="">
              Frequently Asked Questions
            </h2>
            <Accordion items={pageData.faq} />
          </div>
        </section>
      )}

      {/* 8. Related Pages */}
      <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <RelatedPages related={pageData.related} />
      </div>

      {/* 9. CTA Band */}
      <QuoteBand />
    </div>
  );
};
