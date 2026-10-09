import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ContentData, ContentBlock } from "../content/types.ts";
import { ProjectData, PROJECTS } from "../data/projects.ts";
import { Breadcrumb } from "../components/ui/Breadcrumb.tsx";
import { QuickAnswer } from "../components/ui/QuickAnswer.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { RelatedPages } from "../components/ui/RelatedPages.tsx";
import { QuoteBand } from "../components/ui/QuoteBand.tsx";
import { Lightbox } from "../components/ui/Lightbox.tsx";
import { UI } from "../data/ui.ts";

export interface ProjectProps {
  data: ContentData;
  project: ProjectData;
}

export const Project: React.FC<ProjectProps> = ({ data, project }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Find next project in the published list (loop around)
  const publishedList = PROJECTS.filter((p) => p.published);
  const currentIdx = publishedList.findIndex((p) => p.id === project.id);
  const nextProject = publishedList[(currentIdx + 1) % publishedList.length];

  // Blocks
  const aboutBlock = data.blocks.find(
    (b: ContentBlock) => b.title === "About the Project" || (b.text && !b.title)
  );
  const designPointsBlock = data.blocks.find(
    (b: ContentBlock) => b.title === "Design Points"
  );
  const whatItShowsBlock = data.blocks.find(
    (b: ContentBlock) => b.title === "What This Project Shows"
  );

  const thirdImage = project.images[2] || project.images[0];

  return (
    <div className="w-full">
      {/* 1. Hero Image */}
      <section className="relative w-full h-[78svh] min-h-[460px] lg:h-[80vh] bg-[var(--ink)] overflow-hidden">
        <div className="absolute inset-0 w-full h-full" data-parallax="4">
          <img
            src={project.images[0]}
            alt={data.alt || project.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#0A0A0A]/25" />
        </div>

        <div className="absolute inset-x-0 bottom-0 max-w-[1340px] mx-auto px-[var(--pad-x)] pb-10 z-10">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Our Projects", href: "/projects/" },
              { label: project.title },
            ]}
            theme="white"
            className="mb-4"
          />
          <h1
            className="text-[26px] lg:text-[52px] font-bold text-white leading-[1.15] tracking-[-0.02em] max-w-[800px]"
            data-split=""
          >
            {data.h1}
          </h1>
        </div>
      </section>

      {/* 2. Title Block & Subtitle (Drawer QuickAnswer attached) */}
      <section className="py-8 bg-white border-b border-[var(--line)]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="text-[11px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
            {project.subtitle}
          </div>
          <QuickAnswer text={data.quickAnswer} h1={data.h1} related={data.related} />
        </div>
      </section>

      {/* 3. Spec Grid */}
      <section className="py-12 bg-white border-b border-[var(--line)]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
                {UI.client}
              </span>
              <div className="text-[18px] lg:text-[20px] font-semibold text-[var(--ink)]">
                {project.client}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
                {UI.location}
              </span>
              <div className="text-[18px] lg:text-[20px] font-semibold text-[var(--ink)]">
                {project.location}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
                {UI.type}
              </span>
              <div className="text-[18px] lg:text-[20px] font-semibold text-[var(--ink)]">
                {project.type}
              </div>
            </div>

            {project.height && (
              <div className="space-y-1">
                <span className="text-[11px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
                  {UI.height}
                </span>
                <div className="text-[18px] lg:text-[20px] font-semibold text-[var(--ink)]">
                  {project.height}
                </div>
              </div>
            )}

            {project.width && (
              <div className="space-y-1">
                <span className="text-[11px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
                  {UI.width}
                </span>
                <div className="text-[18px] lg:text-[20px] font-semibold text-[var(--ink)]">
                  {project.width}
                </div>
              </div>
            )}

            {project.length && (
              <div className="space-y-1">
                <span className="text-[11px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
                  {UI.length}
                </span>
                <div className="text-[18px] lg:text-[20px] font-semibold text-[var(--ink)]">
                  {project.length}
                </div>
              </div>
            )}

            {/* Area Cell */}
            <div className="col-span-2 lg:col-span-4 border-t border-[var(--line)] pt-8 flex items-baseline space-x-3">
              <span className="text-[11px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
                {UI.area}:
              </span>
              <span
                className="text-[44px] lg:text-[52px] font-bold text-[var(--blue)] leading-none"
                data-count=""
                data-to={project.area}
                data-format="true"
              >
                {project.area.toLocaleString()}
              </span>
              <span className="text-[15px] text-[var(--grey)] font-medium">
                sq ft
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Project Gallery (Masonry-style grid: Mobile 16:9 + two 1:1, Desktop 3x 4:3) */}
      {project.images.length > 0 && (
        <section className="py-16 bg-[var(--offwhite)] border-b border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <h2 className="text-[22px] lg:text-[36px] font-semibold text-[var(--ink)] mb-8" data-split="">
              Project Gallery
            </h2>

            {/* Desktop: 3-column row of 4:3 images, gap 16px */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-4">
              {project.images.slice(0, 3).map((imgUrl, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setLightboxIndex(i);
                    setLightboxOpen(true);
                  }}
                  className="group relative cursor-pointer"
                  data-reveal=""
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-200">
                    <img
                      src={imgUrl}
                      alt={i === 0 ? data.alt || `${project.title} photo 1` : `${project.title} photo ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  {i === 0 && data.alt && (
                    <span className="block mt-2 text-[12px] text-[var(--grey)] text-left">
                      {data.alt}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile: First image full width 16:9; second & third 1:1 gap 10px, or 2nd image 16:9 if only 2 images */}
            <div className="lg:hidden space-y-[10px]">
              {project.images[0] && (
                <div
                  onClick={() => {
                    setLightboxIndex(0);
                    setLightboxOpen(true);
                  }}
                  className="group relative cursor-pointer"
                  data-reveal=""
                >
                  <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-200">
                    <img
                      src={project.images[0]}
                      alt={data.alt || `${project.title} photo 1`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {data.alt && (
                    <span className="block mt-1.5 text-[12px] text-[var(--grey)] text-left">
                      {data.alt}
                    </span>
                  )}
                </div>
              )}

              {project.images.length === 2 && (
                <div
                  onClick={() => {
                    setLightboxIndex(1);
                    setLightboxOpen(true);
                  }}
                  className="group relative cursor-pointer"
                  data-reveal=""
                >
                  <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-200">
                    <img
                      src={project.images[1]}
                      alt={`${project.title} photo 2`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              {project.images.length > 2 && (
                <div className="grid grid-cols-2 gap-[10px]">
                  {project.images.slice(1, 3).map((imgUrl, i) => (
                    <div
                      key={i + 1}
                      onClick={() => {
                        setLightboxIndex(i + 1);
                        setLightboxOpen(true);
                      }}
                      className="group relative aspect-square w-full overflow-hidden bg-neutral-200 cursor-pointer"
                      data-reveal=""
                    >
                      <img
                        src={imgUrl}
                        alt={`${project.title} photo ${i + 2}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5. About this project (New short description band between images and Design Points) */}
      {aboutBlock && (
        <section className="py-16 lg:py-20 max-w-[1340px] mx-auto px-[var(--pad-x)] border-b border-[var(--line)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-4">
              <h3 className="text-[16px] lg:text-[20px] font-semibold text-[var(--ink)]" data-split="">
                About this project
              </h3>
            </div>
            <div className="lg:col-span-8 text-[14px] lg:text-[15px] text-[var(--grey)] leading-[1.65] space-y-4 max-w-[520px]" data-reveal="">
              <p>{aboutBlock.text}</p>
            </div>
          </div>
        </section>
      )}

      {/* 6. Design Points with Third Image */}
      {designPointsBlock && (
        <section className="py-16 lg:py-20 bg-[var(--offwhite)] border-b border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-5 space-y-4">
                <h2 className="text-[20px] lg:text-[32px] font-semibold text-[var(--ink)]" data-split="">
                  Design Points
                </h2>
                <p className="text-[14px] lg:text-[15px] text-[var(--grey)] leading-[1.65] max-w-[520px]" data-reveal="">
                  {designPointsBlock.text}
                </p>
              </div>
              <div className="lg:col-span-7">
                <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-200">
                  <img
                    src={thirdImage}
                    alt={`${project.title} detail`}
                    className="w-full h-full object-cover object-right"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. What This Project Shows (Royal Blue Glossy) */}
      {whatItShowsBlock && (
        <section
          style={{
            background: "var(--blue-glossy)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.15)",
          }}
          className="py-20 text-white"
        >
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] max-w-[800px]">
            <span className="block text-[11px] uppercase font-semibold text-white/70 tracking-[0.1em] mb-3">
              Summary
            </span>
            <h2 className="text-[22px] lg:text-[36px] font-medium leading-[1.2] text-white" data-split="">
              {whatItShowsBlock.text}
            </h2>
          </div>
        </section>
      )}

      {/* 8. FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="py-16 bg-white border-b border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <h2 className="text-[22px] lg:text-[36px] font-semibold text-[var(--ink)] mb-8" data-split="">
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} />
          </div>
        </section>
      )}

      {/* 9. Next Project */}
      {nextProject && (
        <section className="py-16 bg-[var(--offwhite)] border-b border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <span className="block text-[11px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em] mb-6">
              {UI.nextProject}
            </span>
            <Link
              to={`/projects/${nextProject.slug}/`}
              className="group block bg-white border border-[var(--line)] overflow-hidden"
              data-reveal=""
            >
              <div className="aspect-[21/9] w-full overflow-hidden bg-neutral-200">
                <img
                  src={nextProject.images[0]}
                  alt={nextProject.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6 sm:p-8 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
                    {nextProject.client} · {nextProject.location}
                  </span>
                  <h3 className="text-[18px] lg:text-[22px] font-semibold text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors mt-1">
                    {nextProject.title}
                  </h3>
                </div>
                <div className="text-[16px] font-bold text-[var(--blue)]">
                  {nextProject.area.toLocaleString()} sq ft →
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* 10. Related Pages */}
      <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
        <RelatedPages related={data.related} />
      </div>

      {/* 11. CTA Band */}
      <QuoteBand />

      {/* Lightbox */}
      <Lightbox
        images={project.images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};
