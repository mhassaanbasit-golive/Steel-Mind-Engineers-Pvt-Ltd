import React from "react";
import { Link } from "../components/ui/TransitionLink.tsx";
import pageData from "../content/generated/page-53.json";
import { PROJECTS } from "../data/projects.ts";
import { HeroBand } from "../components/ui/HeroBand.tsx";
import { Card } from "../components/ui/Card.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { NextBand } from "../components/ui/NextBand.tsx";
import { Button } from "../components/ui/Button.tsx";
import { A } from "../data/assets.ts";

export const ProjectsIndex: React.FC = () => {
  const publishedProjects = PROJECTS.filter((p) => p.published);

  return (
    <div className="w-full bg-white">
      {/* Block A — Hero Band (Immersive) */}
      <HeroBand
        variant="immersive"
        imageSrc={A.project.haierCraneMezzanine[0]}
        imageAlt="Finished steel crane shed built by Steel Mind Engineers in Pakistan."
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Our Projects" },
        ]}
        h1={pageData.h1}
        subtitle={pageData.quickAnswer}
      />

      {/* Proof You Can Check */}
      <section className="py-12 lg:py-16 max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <h2 className="text-[22px] lg:text-[48px] font-bold leading-[1.15] tracking-[-0.02em] text-[#0A0A0A] mb-4">
          Proof You Can Check
        </h2>
        <p className="text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[var(--blue)] max-w-[600px]">
          A steel contractor is best judged by what it has built. Every project below lists the client, the place, the height, the width, the length and the covered area. The largest crane sheds cover almost 100,000 square feet, and the dairy sheds show repeat work for the same farms.
        </p>
      </section>

      {/* Project List Table (6 Rows) */}
      <section className="py-4 max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <div className="border-t border-[#E5E5E5] divide-y divide-[#E5E5E5] border-b">
          {publishedProjects.map((proj) => (
            <Link
              key={proj.id}
              to={`/projects/${proj.slug}/`}
              className="group flex flex-col md:flex-row md:items-center justify-between py-4 hover:bg-[var(--blue)]/5 transition-colors px-2"
            >
              <div className="flex items-center space-x-4">
                <div className="w-[60px] h-[60px] overflow-hidden bg-white flex-shrink-0">
                  <img
                    src={proj.images[0]}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-[#0A0A0A] leading-[1.25] tracking-[-0.01em]">
                    {proj.title}
                  </h3>
                  <p className="text-[12px] font-medium text-[var(--blue)] tracking-[0.02em] mt-0.5">
                    {proj.client} · {proj.location}
                  </p>
                </div>
              </div>

              <div className="mt-3 md:mt-0 flex items-center space-x-6 text-right">
                <span className="text-[16px] font-bold text-[#1E3A8A] tabular-nums tracking-[0.06em]">
                  {proj.area.toLocaleString()} sq ft
                </span>
                <span className="text-[13px] font-semibold text-[#1E3A8A]">
                  &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6 Projects in Grid using Card system — Full width on mobile */}
      <section className="py-12 lg:py-16 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedProjects.map((proj) => {
              return (
                <Card
                  key={proj.id}
                  href={`/projects/${proj.slug}/`}
                  imageSrc={proj.images[0]}
                  imageAlt={proj.title}
                  imageRatio="4/3"
                  title={proj.title}
                  description={`${proj.client} · ${proj.location} · ${proj.area.toLocaleString()} sq ft covered area.`}
                  linkText="View Project"
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* What the Projects Show (Royal Blue section) */}
      <section
        style={{ backgroundColor: "var(--blue)" }}
        className="py-12 lg:py-16 bg-[var(--blue)] text-white"
      >
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <h2 className="text-[22px] lg:text-[48px] font-bold leading-[1.15] tracking-[-0.02em] text-white mb-6">
            What the Projects Show
          </h2>
          <div className="space-y-3 max-w-[600px]">
            <div className="flex items-start space-x-3 text-[14px] lg:text-[15px] text-white/85 leading-[1.7]">
              <span className="w-1.5 h-1.5 bg-white mt-2 flex-shrink-0" />
              <span>Scale. Crane sheds of almost 100,000 square feet.</span>
            </div>
            <div className="flex items-start space-x-3 text-[14px] lg:text-[15px] text-white/85 leading-[1.7]">
              <span className="w-1.5 h-1.5 bg-white mt-2 flex-shrink-0" />
              <span>Range. Sheds, mezzanine floors and a steel bridge.</span>
            </div>
            <div className="flex items-start space-x-3 text-[14px] lg:text-[15px] text-white/85 leading-[1.7]">
              <span className="w-1.5 h-1.5 bg-white mt-2 flex-shrink-0" />
              <span>Repeat clients. Haier and Dravton Dairy came back for more than one structure.</span>
            </div>
            <div className="flex items-start space-x-3 text-[14px] lg:text-[15px] text-white/85 leading-[1.7]">
              <span className="w-1.5 h-1.5 bg-white mt-2 flex-shrink-0" />
              <span>Reach. Projects in Lahore, Kasur, Chunian and Sindh.</span>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/20">
            <h3 className="text-[17px] lg:text-[22px] font-semibold text-white mb-2 leading-[1.25] tracking-[-0.01em]">
              Start Your Own Project
            </h3>
            <p className="text-[14px] lg:text-[15px] leading-[1.7] text-white/85 mb-5 max-w-[600px]">
              Send the use, size and location of your building. An engineer will review it and reply.
            </p>
            <Button
              size="sm"
              variant="hero-white"
              href="/contact-us/#quote"
              className="w-fit min-w-[130px]"
            >
              Request a Quote
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {pageData.faq && (
        <section className="py-12 lg:py-16 bg-white border-b border-[#E5E5E5]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <h2 className="text-[22px] lg:text-[48px] font-bold leading-[1.15] tracking-[-0.02em] text-[#0A0A0A] mb-6">
              Frequently Asked Questions
            </h2>
            <Accordion items={pageData.faq} />
          </div>
        </section>
      )}

      {/* Next Band */}
      <NextBand
        heading="See the Companies We Build For"
        nextUrl="/clients/"
        nextTitle="Our Clients"
      />
    </div>
  );
};
