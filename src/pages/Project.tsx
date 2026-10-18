import React, { useState } from "react";
import { Link } from "../components/ui/TransitionLink.tsx";
import { ContentData, ContentBlock } from "../content/types.ts";
import { ProjectData, PROJECTS } from "../data/projects.ts";
import { HeroBand } from "../components/ui/HeroBand.tsx";
import { Canvas } from "../components/ui/Canvas.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { NextBand } from "../components/ui/NextBand.tsx";
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

  const mainImage = project.images.find((img) => /main[-_]?image/i.test(img)) || project.images[0];
  const otherImages = project.images.filter((img) => img !== mainImage);
  const img1 = mainImage;
  const img2 = otherImages[0] || mainImage;
  const img3 = otherImages[1] || mainImage;

  return (
    <div className="w-full bg-white">
      {/* Block A — Hero Band (Immersive) */}
      <HeroBand
        variant="immersive"
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
      <section className="py-12 lg:py-20 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Column: Spec Grid */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h2 className="text-[22px] lg:text-[48px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em]">
                  {project.title}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2 border-t border-[#E5E5E5]">
                <div>
                  <span className="block text-[12px] font-medium text-[#6B7280] tracking-[0.02em]">
                    {UI.client}
                  </span>
                  <div className="text-[17px] lg:text-[22px] font-semibold text-[#0A0A0A] mt-0.5">
                    {project.client}
                  </div>
                </div>

                <div>
                  <span className="block text-[12px] font-medium text-[#6B7280] tracking-[0.02em]">
                    {UI.location}
                  </span>
                  <div className="text-[17px] lg:text-[22px] font-semibold text-[#0A0A0A] mt-0.5">
                    {project.location}
                  </div>
                </div>

                <div>
                  <span className="block text-[12px] font-medium text-[#6B7280] tracking-[0.02em]">
                    {UI.type}
                  </span>
                  <div className="text-[17px] lg:text-[22px] font-semibold text-[#0A0A0A] mt-0.5">
                    {project.type}
                  </div>
                </div>

                {project.height && (
                  <div>
                    <span className="block text-[12px] font-medium text-[#6B7280] tracking-[0.02em]">
                      {UI.height}
                    </span>
                    <div className="text-[17px] lg:text-[22px] font-semibold text-[#0A0A0A] mt-0.5">
                      {project.height}
                    </div>
                  </div>
                )}

                {project.width && (
                  <div>
                    <span className="block text-[12px] font-medium text-[#6B7280] tracking-[0.02em]">
                      {UI.width}
                    </span>
                    <div className="text-[17px] lg:text-[22px] font-semibold text-[#0A0A0A] mt-0.5">
                      {project.width}
                    </div>
                  </div>
                )}

                {project.length && (
                  <div>
                    <span className="block text-[12px] font-medium text-[#6B7280] tracking-[0.02em]">
                      {UI.length}
                    </span>
                    <div className="text-[17px] lg:text-[22px] font-semibold text-[#0A0A0A] mt-0.5">
                      {project.length}
                    </div>
                  </div>
                )}
              </div>

              {/* Area */}
              <div className="border-t border-[#E5E5E5] pt-4 flex items-baseline space-x-2">
                <span className="text-[12px] font-medium text-[#6B7280] tracking-[0.02em]">
                  {UI.area}:
                </span>
                <span className="text-[16px] font-bold text-[#1E3A8A] tabular-nums tracking-[0.06em]">
                  {project.area.toLocaleString()}
                </span>
                <span className="text-[12px] font-medium text-[#6B7280]">sq ft</span>
              </div>
            </div>

            {/* Right Column: Project's main image */}
            <div className="lg:col-span-6">
              <Canvas slot="spec-main" ratio="4/3" src={img1} alt={project.title} />
            </div>
          </div>
        </div>
      </section>

      {/* Block C — "About the Project" as one image-text pair */}
      {aboutBlock && (
        <section className="py-14 lg:py-20 w-full bg-white border-b border-[#E5E5E5]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              <div className="order-2 lg:order-1 lg:col-span-6 space-y-4 max-w-[600px]">
                <h3 className="text-[17px] lg:text-[22px] font-semibold text-[#0A0A0A] leading-[1.25] tracking-[-0.01em]">
                  {aboutBlock.title || "About the Project"}
                </h3>
                <p className="text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[#6B7280]">
                  {aboutBlock.text}
                </p>
              </div>

              <div className="order-1 lg:order-2 lg:col-span-6">
                <Canvas slot="about-project" ratio="4/3" src={img2} alt="About the Project" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Block C — "Design Points" as one image-text pair */}
      {designPointsBlock && (
        <section className="py-14 lg:py-20 w-full bg-white border-b border-[#E5E5E5]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              <div className="order-1 lg:col-span-6">
                <Canvas slot="design-points" ratio="4/3" src={img3} alt="Design Points" />
              </div>

              <div className="order-2 lg:col-span-6 space-y-4 max-w-[600px]">
                <h3 className="text-[17px] lg:text-[22px] font-semibold text-[#0A0A0A] leading-[1.25] tracking-[-0.01em]">
                  {designPointsBlock.title || "Design Points"}
                </h3>
                <p className="text-[14px] lg:text-[15px] font-normal leading-[1.7] text-[#6B7280]">
                  {designPointsBlock.text}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Band: first image full-width (16:9), second and third side by side (1:1 each) */}
      <section className="py-14 lg:py-20 bg-white border-b border-[var(--line)]">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] space-y-6">
          <div className="mb-6">
            <h2 className="text-[22px] lg:text-[48px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em]">
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

      {/* "What This Project Shows" — Royal Blue band, centered, H3 size, white text */}
      {whatItShowsBlock && (
        <section
          style={{
            backgroundColor: "var(--blue)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.15)",
          }}
          className="py-16 lg:py-20 bg-[var(--blue)] text-white w-full"
        >
          <div className="max-w-[800px] mx-auto px-[var(--pad-x)] text-center space-y-3">
            <h3 className="text-[17px] lg:text-[22px] font-semibold leading-[1.25] tracking-[-0.01em] text-white">
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

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="py-12 lg:py-16 bg-white border-b border-[#E5E5E5]">
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)] max-w-[800px]">
            <h2 className="text-[22px] lg:text-[48px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] mb-6">
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} />
          </div>
        </section>
      )}

      {/* Next Band */}
      {nextProject && (
        <NextBand
          heading={`Next Project: ${nextProject.title}`}
          nextUrl={`/projects/${nextProject.slug}/`}
          nextTitle={nextProject.title}
        />
      )}
    </div>
  );
};
