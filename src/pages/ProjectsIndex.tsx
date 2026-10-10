import React from "react";
import { Link } from "react-router-dom";
import pageData from "../content/generated/page-53.json";
import { PROJECTS } from "../data/projects.ts";
import { HeroBand } from "../components/ui/HeroBand.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { RelatedPages } from "../components/ui/RelatedPages.tsx";
import { QuoteBand } from "../components/ui/QuoteBand.tsx";
import { Button } from "../components/ui/Button.tsx";
import { A } from "../data/assets.ts";

export const ProjectsIndex: React.FC = () => {
  const publishedProjects = PROJECTS.filter((p) => p.published);

  return (
    <div className="w-full bg-white">
      {/* Block A — Hero Band (Image) */}
      <HeroBand
        variant="image"
        imageSrc={A.project.haierCraneMezzanine[0]}
        imageAlt="Finished steel crane shed built by Steel Mind in Pakistan."
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Our Projects" },
        ]}
        h1={pageData.h1}
        subtitle={pageData.quickAnswer}
      />

      {/* Proof You Can Check */}
      <section className="py-12 lg:py-16 max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <h2 className="text-[18px] lg:text-[28px] font-semibold leading-[1.2] text-[var(--ink)] mb-4" data-split="">
          Proof You Can Check
        </h2>
        <p className="text-[13px] lg:text-[15px] leading-[1.6] text-[var(--grey)] max-w-[560px]" data-reveal="">
          A steel contractor is best judged by what it has built. Every project below lists the client, the place, the height, the width, the length and the covered area. The largest crane sheds cover almost 100,000 square feet, and the dairy sheds show repeat work for the same farms.
        </p>
      </section>

      {/* Project List Table (6 Rows) */}
      <section className="py-4 max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <div className="border-t border-[var(--line)] divide-y divide-[var(--line)] border-b">
          {publishedProjects.map((proj) => (
            <Link
              key={proj.id}
              to={`/projects/${proj.slug}/`}
              className="group flex flex-col md:flex-row md:items-center justify-between py-4 hover:bg-[var(--offwhite)] transition-colors px-2"
              data-reveal=""
            >
              <div className="flex items-center space-x-4">
                <div className="w-[60px] h-[60px] overflow-hidden bg-neutral-100 flex-shrink-0">
                  <img
                    src={proj.images[0]}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="text-[15px] lg:text-[18px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors leading-[1.25]">
                    {proj.title}
                  </h3>
                  <p className="text-[12px] text-[var(--grey)] mt-0.5">
                    {proj.client} · {proj.location}
                  </p>
                </div>
              </div>

              <div className="mt-3 md:mt-0 flex items-center space-x-6 text-right">
                <span className="text-[14px] lg:text-[15px] font-bold text-[var(--blue)]">
                  {proj.area.toLocaleString()} sq ft
                </span>
                <svg className="w-4 h-4 stroke-current text-[var(--grey)] group-hover:text-[var(--blue)] group-hover:translate-x-1 transition-all" viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6 Project Cards in 2-3 Column Grid */}
      <section className="py-12 lg:py-16 bg-[var(--offwhite)] border-b border-[var(--line)]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="p-5 space-y-2">
                    <span className="text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
                      {proj.client}
                    </span>
                    <h3 className="text-[15px] lg:text-[18px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors leading-[1.25]">
                      {proj.title}
                    </h3>
                    <div className="text-[13px] font-semibold text-[var(--blue)] pt-1">
                      {proj.area.toLocaleString()} sq ft
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* What the Projects Show */}
      <section className="py-12 lg:py-16 max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <h2 className="text-[18px] lg:text-[28px] font-semibold leading-[1.2] text-[var(--ink)] mb-6" data-split="">
          What the Projects Show
        </h2>
        <div className="space-y-3 max-w-[560px]">
          <div className="flex items-start space-x-3 text-[13px] lg:text-[15px] text-[var(--grey)] leading-[1.6]">
            <span className="w-1.5 h-1.5 bg-[var(--blue)] mt-2 flex-shrink-0" />
            <span>Scale. Crane sheds of almost 100,000 square feet.</span>
          </div>
          <div className="flex items-start space-x-3 text-[13px] lg:text-[15px] text-[var(--grey)] leading-[1.6]">
            <span className="w-1.5 h-1.5 bg-[var(--blue)] mt-2 flex-shrink-0" />
            <span>Range. Sheds, mezzanine floors and a steel bridge.</span>
          </div>
          <div className="flex items-start space-x-3 text-[13px] lg:text-[15px] text-[var(--grey)] leading-[1.6]">
            <span className="w-1.5 h-1.5 bg-[var(--blue)] mt-2 flex-shrink-0" />
            <span>Repeat clients. Haier and Dravton Dairy came back for more than one structure.</span>
          </div>
          <div className="flex items-start space-x-3 text-[13px] lg:text-[15px] text-[var(--grey)] leading-[1.6]">
            <span className="w-1.5 h-1.5 bg-[var(--blue)] mt-2 flex-shrink-0" />
            <span>Reach. Projects in Lahore, Kasur, Chunian and Sindh.</span>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--line)]">
          <h3 className="text-[15px] lg:text-[18px] font-semibold text-[var(--ink)] mb-2 leading-[1.25]">
            Start Your Own Project
          </h3>
          <p className="text-[13px] lg:text-[15px] leading-[1.6] text-[var(--grey)] mb-5 max-w-[480px]">
            Send the use, size and location of your building. An engineer will review it and reply.
          </p>
          <Button
            size="sm"
            variant="primary"
            href="/contact-us/#quote"
            className="w-fit min-w-[130px]"
          >
            Request a Quote
          </Button>
        </div>
      </section>

      {/* FAQ */}
      {pageData.faq && (
        <section className="py-12 lg:py-16 bg-[var(--offwhite)] border-t border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <h2 className="text-[18px] lg:text-[28px] font-semibold leading-[1.2] text-[var(--ink)] mb-6" data-split="">
              Frequently Asked Questions
            </h2>
            <Accordion items={pageData.faq} />
          </div>
        </section>
      )}

      {/* Related Pages */}
      <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <RelatedPages related={pageData.related} />
      </div>

      {/* CTA Band */}
      <QuoteBand />
    </div>
  );
};
