import React, { useState } from "react";
import { Link } from "../components/ui/TransitionLink.tsx";
import { ContentData, ContentBlock } from "../content/types.ts";
import { ProjectData } from "../data/projects.ts";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

export interface ProjectProps {
  data: ContentData;
  project: ProjectData;
}

export const Project: React.FC<ProjectProps> = ({ data, project }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const images =
    project.images && project.images.length > 0 ? project.images : [];
  const firstImage = images[0] || "";
  const total = images.length;

  const nextSlide = () => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    setTouchStart(null);
  };

  // Find About the Project text block
  const aboutBlock = data.blocks?.find(
    (b: ContentBlock) =>
      b.title === "About the Project" || (b.text && !b.title)
  );

  const prevIndex = total > 0 ? (activeIndex - 1 + total) % total : 0;
  const nextIndex = total > 0 ? (activeIndex + 1) % total : 0;

  return (
    <div className="w-full bg-white overflow-x-hidden">
      {/* 1. HERO BANNER: First image of project as background, dark gradient, title/description/quote button at bottom left */}
      <section data-hero className="relative w-full overflow-hidden bg-[#0A0A0A]">
        <div className="relative w-full h-[60svh] lg:h-[70vh] min-h-[460px] md:min-h-[540px] flex flex-col justify-end">
          {/* Background Image: First photo of this specific project */}
          {firstImage && (
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={firstImage}
                alt={project.title}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}

          {/* Dark Gradient Overlay */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.45) 100%)",
            }}
          />

          {/* Bottom Left Content: Exactly like main site banners */}
          <div className="max-w-[1340px] w-full mx-auto px-[var(--pad-x)] relative z-[2] pb-10 lg:pb-14 text-left">
            {/* Back to Projects Link & Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link
                to="/projects/"
                className="inline-flex items-center gap-1.5 text-white/90 hover:text-white text-[13px] font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Projects</span>
              </Link>
              <span className="text-white/40">|</span>
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-[12px] text-white/80">
                  <li>
                    <Link to="/" className="hover:text-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>/</li>
                  <li>
                    <Link
                      to="/projects/"
                      className="hover:text-white transition-colors"
                    >
                      Our Projects
                    </Link>
                  </li>
                  <li>/</li>
                  <li className="text-white font-medium truncate max-w-[200px] sm:max-w-none">
                    {project.title}
                  </li>
                </ol>
              </nav>
            </div>

            {/* Project Title */}
            <h1 className="text-[26px] sm:text-[34px] md:text-[44px] lg:text-[50px] font-bold text-white uppercase tracking-[-0.02em] max-w-[860px] leading-[1.12]">
              {project.title}
            </h1>

            {/* Short Description */}
            {(project.subtitle || data.quickAnswer) && (
              <p className="mt-3.5 text-[14px] md:text-[15px] lg:text-[16px] text-white/90 max-w-[640px] leading-[1.6]">
                {project.subtitle || data.quickAnswer}
              </p>
            )}

            {/* Request a Quote Button */}
            <div className="mt-6">
              <Link
                to="/contact-us/#quote"
                className="btn btn--light btn-sm inline-flex items-center gap-2"
              >
                <span>Request a Quote</span>
                <span className="btn-arrow inline-block" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BLUE INTRO PANEL & CAROUSEL: Full-width blue section, White title and description, Carousel below */}
      <section
        style={{ backgroundColor: "var(--blue)" }}
        className="w-full py-12 lg:py-16 text-white"
      >
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          {/* Top text: Title and description are WHITE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start mb-8 lg:mb-12">
            <div className="lg:col-span-5">
              <h2 className="text-[24px] lg:text-[38px] font-bold text-white leading-[1.15] tracking-tight">
                {project.title}
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-[15px] lg:text-[16px] text-white/90 leading-[1.7] max-w-[680px]">
                {project.subtitle || data.quickAnswer}
              </p>
            </div>
          </div>

          {/* Image Carousel (Main project image included in the carousel) */}
          {total > 0 && (
            <div className="relative mt-4">
              {/* Desktop View: Center slide large, previous and next slides peeking from sides (dimmed) */}
              <div className="hidden md:flex items-center justify-center gap-4 lg:gap-6 overflow-hidden py-4">
                {/* Left peek (Previous) */}
                <div
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="w-[20%] aspect-[16/10] overflow-hidden opacity-40 hover:opacity-75 transition-all duration-300 scale-90 cursor-pointer shadow-md select-none shrink-0 border border-white/10"
                >
                  <img
                    src={images[prevIndex]}
                    alt={`${project.title} - Preview`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Center Slide (Active, large) */}
                <div className="w-[60%] max-w-[850px] aspect-[16/10] overflow-hidden opacity-100 scale-100 shadow-2xl transition-all duration-300 relative select-none shrink-0 border border-white/20">
                  <img
                    src={images[activeIndex]}
                    alt={`${project.title} - Active Slide`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Right peek (Next) */}
                <div
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="w-[20%] aspect-[16/10] overflow-hidden opacity-40 hover:opacity-75 transition-all duration-300 scale-90 cursor-pointer shadow-md select-none shrink-0 border border-white/10"
                >
                  <img
                    src={images[nextIndex]}
                    alt={`${project.title} - Next Preview`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Mobile View: Full width single slide, touch swipeable */}
              <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="md:hidden w-full aspect-[16/10] overflow-hidden shadow-xl border border-white/20 select-none relative"
              >
                <img
                  src={images[activeIndex]}
                  alt={`${project.title} - Mobile Slide ${activeIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Carousel Controls & Indicators */}
              {total > 1 && (
                <div className="flex items-center justify-between mt-6 max-w-[850px] mx-auto px-2">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>

                  {/* Dot Indicators */}
                  <div className="flex items-center space-x-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                          idx === activeIndex
                            ? "w-8 bg-white"
                            : "w-2 bg-white/40 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 3. PROJECT OVERVIEW (WHITE BACKGROUND, BLACK HEADINGS & TEXT) */}
      <section className="py-14 lg:py-24 bg-white">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left: "About the Project" heading in BLACK, full text in BLACK */}
            <div className="lg:col-span-6 space-y-4">
              <h2 className="text-[22px] lg:text-[34px] font-bold text-[#0A0A0A] tracking-tight leading-[1.2]">
                About the Project
              </h2>
              <div className="text-[15px] font-normal leading-[1.75] text-[#374151] space-y-3 pt-2">
                <p>
                  {aboutBlock?.text ||
                    `Steel Mind Engineers executed this ${project.type} for ${project.client} at ${project.location}. The structure covers an approximate area of ${project.area.toLocaleString()} square feet and incorporates high-strength structural engineering, tailored load distribution, and durable fabrication specifications.`}
                </p>
                {data.quickAnswer && data.quickAnswer !== aboutBlock?.text && (
                  <p>{data.quickAnswer}</p>
                )}
              </div>
            </div>

            {/* Right: Specification Table (1px blue line above each row, table text black, area blue & bold) */}
            <div className="lg:col-span-6">
              <div className="border-b border-[var(--blue)]">
                <h3 className="text-[17px] lg:text-[19px] font-bold text-[#0A0A0A] tracking-tight mb-4">
                  Project Specifications
                </h3>

                <div className="divide-y-0">
                  {/* Client */}
                  <div className="border-t border-[var(--blue)] py-3.5 flex items-center justify-between text-[13px] lg:text-[14px]">
                    <span className="text-[#4B5563] font-medium">Client</span>
                    <span className="font-semibold text-[#0A0A0A] text-right">
                      {project.client}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="border-t border-[var(--blue)] py-3.5 flex items-center justify-between text-[13px] lg:text-[14px]">
                    <span className="text-[#4B5563] font-medium">Location</span>
                    <span className="font-semibold text-[#0A0A0A] text-right">
                      {project.location}
                    </span>
                  </div>

                  {/* Type */}
                  <div className="border-t border-[var(--blue)] py-3.5 flex items-center justify-between text-[13px] lg:text-[14px]">
                    <span className="text-[#4B5563] font-medium">
                      Building Type
                    </span>
                    <span className="font-semibold text-[#0A0A0A] text-right">
                      {project.type}
                    </span>
                  </div>

                  {/* Height */}
                  {project.height && (
                    <div className="border-t border-[var(--blue)] py-3.5 flex items-center justify-between text-[13px] lg:text-[14px]">
                      <span className="text-[#4B5563] font-medium">
                        Clear Height
                      </span>
                      <span className="font-semibold text-[#0A0A0A] text-right tabular-nums">
                        {project.height}
                      </span>
                    </div>
                  )}

                  {/* Width */}
                  {project.width && (
                    <div className="border-t border-[var(--blue)] py-3.5 flex items-center justify-between text-[13px] lg:text-[14px]">
                      <span className="text-[#4B5563] font-medium">
                        Width (Span)
                      </span>
                      <span className="font-semibold text-[#0A0A0A] text-right tabular-nums">
                        {project.width}
                      </span>
                    </div>
                  )}

                  {/* Length */}
                  {project.length && (
                    <div className="border-t border-[var(--blue)] py-3.5 flex items-center justify-between text-[13px] lg:text-[14px]">
                      <span className="text-[#4B5563] font-medium">Length</span>
                      <span className="font-semibold text-[#0A0A0A] text-right tabular-nums">
                        {project.length}
                      </span>
                    </div>
                  )}

                  {/* Area (Blue and Bold) */}
                  <div className="border-t border-[var(--blue)] py-3.5 flex items-center justify-between text-[13px] lg:text-[14px]">
                    <span className="text-[#4B5563] font-medium">
                      Covered Area
                    </span>
                    <span
                      style={{ color: "var(--blue)" }}
                      className="font-bold text-[16px] lg:text-[18px] tabular-nums text-right"
                    >
                      {project.area.toLocaleString()} sq ft
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The page ends immediately after the Overview section per instructions */}
    </div>
  );
};
