import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ContentData, ContentBlock } from "../content/types.ts";
import { ProjectData, PROJECTS } from "../data/projects.ts";
import { HeroBand } from "../components/ui/HeroBand.tsx";
import { Canvas } from "../components/ui/Canvas.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { RelatedPages } from "../components/ui/RelatedPages.tsx";
import { CtaBand } from "../components/ui/CtaBand.tsx";
import { Lightbox } from "../components/ui/Lightbox.tsx";
import { UI } from "../data/ui.ts";

export interface ProjectProps {
  data: ContentData;
  project: ProjectData;
}

export const Project: React.FC<ProjectProps> = ({ data, project }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Next project in published list (loop around)
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

  const img1 = project.images[0];
  const img2 = project.images[1] || project.images[0];
  const img3 = project.images[2] || project.images[0];

  return (
    <div className="w-full bg-white">
      {/* Block A — Hero Band (Image) */}
      <HeroBand
        variant="image"
        imageSrc={img1}
        imageAlt={data.alt || project.title}
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Our Projects", href: "/projects/" },
          { label: project.title },
        ]}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Block B — Spec Panel (Left: Spec Grid, Right: Project's Main Image) */}
      <section className="py-12 lg:py-20 bg-white border-b border-[var(--line)]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Column: Spec Grid */}
            <div className="lg:col-span-6 space-y-6" data-reveal-group="">
              <div>
                <span className="block text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em] mb-2">
                  Specifications
                </span>
                <h2 className="text-[18px] lg:text-[28px] font-semibold text-[var(--ink)] leading-[1.2]">
                  {project.title}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2 border-t border-[var(--line)]">
                <div>
                  <span className="block text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
                    {UI.client}
                  </span>
                  <div className="text-[14px] lg:text-[16px] font-semibold text-[var(--ink)] mt-0.5">
                    {project.client}
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
                    {UI.location}
                  </span>
                  <div className="text-[14px] lg:text-[16px] font-semibold text-[var(--ink)] mt-0.5">
                    {project.location}
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
                    {UI.type}
                  </span>
                  <div className="text-[14px] lg:text-[16px] font-semibold text-[var(--ink)] mt-0.5">
                    {project.type}
                  </div>
                </div>

                {project.height && (
                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
                      {UI.height}
                    </span>
                    <div className="text-[14px] lg:text-[16px] font-semibold text-[var(--ink)] mt-0.5">
                      {project.height}
                    </div>
                  </div>
                )}

                {project.width && (
                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
                      {UI.width}
                    </span>
                    <div className="text-[14px] lg:text-[16px] font-semibold text-[var(--ink)] mt-0.5">
                      {project.width}
                    </div>
                  </div>
                )}

                {project.length && (
                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
                      {UI.length}
                    </span>
                    <div className="text-[14px] lg:text-[16px] font-semibold text-[var(--ink)] mt-0.5">
                      {project.length}
                    </div>
                  </div>
                )}
              </div>

              {/* Area */}
              <div className="border-t border-[var(--line)] pt-4 flex items-baseline space-x-2">
                <span className="text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em]">
                  {UI.area}:
                </span>
                <span className="text-[20px] lg:text-[24px] font-bold text-[var(--blue)] leading-none">
                  {project.area.toLocaleString()}
                </span>
                <span className="text-[13px] font-semibold text-[var(--grey)]">sq ft</span>
              </div>
            </div>

            {/* Right Column: Project's main image */}
            <div className="lg:col-span-6" data-reveal="">
              <Canvas slot="spec-main" ratio="4/3" src={img1} alt={project.title} />
            </div>
          </div>
        </div>
      </section>

      {/* Block C — "About the Project" as one image-text pair (image right) */}
      {aboutBlock && (
        <section className="py-14 lg:py-20 w-full bg-[var(--offwhite)] border-b border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              <div className="order-2 lg:order-1 lg:col-span-6 space-y-4 max-w-[400px]" data-reveal-group="">
                <h3 className="text-[15px] lg:text-[18px] font-semibold text-[var(--ink)] leading-[1.25]">
                  {aboutBlock.title || "About the Project"}
                </h3>
                <p className="text-[13px] leading-[1.6] text-[var(--grey)]" data-reveal="">
                  {aboutBlock.text}
                </p>
              </div>

              <div className="order-1 lg:order-2 lg:col-span-6" data-reveal="">
                <Canvas slot="about-project" ratio="4/3" src={img2} alt="About the Project" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Block C — "Design Points" as one image-text pair (image left) */}
      {designPointsBlock && (
        <section className="py-14 lg:py-20 w-full bg-white border-b border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              <div className="order-1 lg:col-span-6" data-reveal="">
                <Canvas slot="design-points" ratio="4/3" src={img3} alt="Design Points" />
              </div>

              <div className="order-2 lg:col-span-6 space-y-4 max-w-[400px]" data-reveal-group="">
                <h3 className="text-[15px] lg:text-[18px] font-semibold text-[var(--ink)] leading-[1.25]">
                  {designPointsBlock.title || "Design Points"}
                </h3>
                <p className="text-[13px] leading-[1.6] text-[var(--grey)]" data-reveal="">
                  {designPointsBlock.text}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Band: first image full-width (16:9), second and third side by side (1:1 each) */}
      <section className="py-14 lg:py-20 bg-[var(--offwhite)] border-b border-[var(--line)]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] space-y-6">
          <div className="mb-6">
            <span className="block text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em] mb-1">
              Project Gallery
            </span>
            <h2 className="text-[18px] lg:text-[28px] font-semibold text-[var(--ink)] leading-[1.2]">
              Structure & Construction Details
            </h2>
          </div>

          {/* First image full-width 16:9 */}
          <div
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
            className="cursor-pointer overflow-hidden group"
            data-reveal=""
          >
            <Canvas
              slot="gallery-1"
              ratio="16/9"
              src={project.images[0]}
              alt={`${project.title} - Full Overview`}
              className="transition-transform duration-500 group-hover:scale-[1.01]"
            />
          </div>

          {/* Second and third side by side 1:1 each */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              onClick={() => {
                setLightboxIndex(1);
                setLightboxOpen(true);
              }}
              className="cursor-pointer overflow-hidden group"
              data-reveal=""
            >
              <Canvas
                slot="gallery-2"
                ratio="1/1"
                src={project.images[1] || project.images[0]}
                alt={`${project.title} - Detail 1`}
                className="transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </div>

            <div
              onClick={() => {
                setLightboxIndex(2);
                setLightboxOpen(true);
              }}
              className="cursor-pointer overflow-hidden group"
              data-reveal=""
            >
              <Canvas
                slot="gallery-3"
                ratio="1/1"
                src={project.images[2] || project.images[0]}
                alt={`${project.title} - Detail 2`}
                className="transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* "What This Project Shows" — blue band, centered, H3 size, white text, data-split */}
      {whatItShowsBlock && (
        <section
          style={{
            background: "var(--blue-glossy)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.15)",
          }}
          className="py-16 lg:py-20 text-white w-full"
        >
          <div className="max-w-[800px] mx-auto px-[var(--pad-x)] text-center space-y-3">
            <span className="block text-[10px] uppercase font-semibold text-white/70 tracking-[0.1em]">
              Summary
            </span>
            <h3 className="text-[18px] lg:text-[22px] font-medium leading-[1.3] text-white" data-split="">
              {whatItShowsBlock.text}
            </h3>
          </div>
        </section>
      )}

      {/* Lightbox for gallery */}
      {lightboxOpen && (
        <Lightbox
          images={project.images}
          initialIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* FAQ (Block E) */}
      {data.faq && data.faq.length > 0 && (
        <section className="py-12 lg:py-16 bg-white border-b border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] max-w-[800px]">
            <span className="block text-[10px] uppercase font-semibold text-[var(--grey)] tracking-[0.1em] mb-2">
              Questions
            </span>
            <h2 className="text-[18px] lg:text-[28px] font-semibold text-[var(--ink)] leading-[1.2] mb-6">
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} />
          </div>
        </section>
      )}

      {/* Related Pages (Block E) */}
      {data.related && data.related.length > 0 && (
        <section className="py-8 bg-white border-b border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] max-w-[800px]">
            <RelatedPages related={data.related} />
          </div>
        </section>
      )}

      {/* Next Project (Block E Single Row) */}
      {nextProject && (
        <section className="py-4 bg-white border-b border-[var(--line)]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] max-w-[800px]">
            <Link
              to={`/projects/${nextProject.slug}/`}
              className="group flex items-center justify-between py-4 text-[14px] font-semibold text-[var(--ink)] hover:text-[var(--blue)] transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.1em] text-[var(--grey)]">Next Project</span>
                <span>{nextProject.title}</span>
              </div>
              <svg
                className="w-5 h-5 stroke-current transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* Block F — CTA Band */}
      <CtaBand />
    </div>
  );
};
