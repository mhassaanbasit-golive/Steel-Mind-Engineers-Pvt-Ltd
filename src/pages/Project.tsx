import React, { useState } from "react";
import { ContentData, ContentBlock } from "../content/types.ts";
import { ProjectData } from "../data/projects.ts";
import { SubpageHero } from "../components/subpage/SubpageHero.tsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface ProjectProps {
  data: ContentData;
  project: ProjectData;
}

export const Project: React.FC<ProjectProps> = ({ data, project }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Ensure Haier project explicitly uses the verified Cloudinary main image
  const rawImages = project.images && project.images.length > 0 ? project.images : [];
  const images =
    project.client === "Haier"
      ? [
          "https://res.cloudinary.com/cyfb9slf/image/upload/v1791401784/Haier-Injection-Modling-Structure-Fabrication-Main-Image.png",
          ...rawImages.filter(
            (img) =>
              img !==
              "https://res.cloudinary.com/cyfb9slf/image/upload/v1791401784/Haier-Injection-Modling-Structure-Fabrication-Main-Image.png"
          ),
        ]
      : rawImages;

  const firstImage =
    project.client === "Haier"
      ? "https://res.cloudinary.com/cyfb9slf/image/upload/v1791401784/Haier-Injection-Modling-Structure-Fabrication-Main-Image.png"
      : images[0] || "";

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
      {/* 1. HERO BANNER: Standard site-wide SubpageHero with concise text and correct main image */}
      <SubpageHero
        title={project.title}
        subtitle={`${project.type} • ${project.location}`}
        image={firstImage}
        quoteUrl="/contact-us/#quote"
      />

      {/* 2. PROJECT GALLERY & CAROUSEL */}
      {total > 0 && (
        <section
          style={{ backgroundColor: "var(--blue)" }}
          className="w-full py-10 lg:py-16 text-white"
        >
          <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
            {/* Image Carousel */}
            <div className="relative">
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
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer"
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
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 4. PROJECT OVERVIEW & SPECIFICATIONS */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="max-w-[1340px] mx-auto px-[var(--pad-x)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left: About the Project */}
            <div className="lg:col-span-6 space-y-4">
              <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-semibold text-[#0A0A0A] uppercase tracking-tight leading-[1.2]">
                About the Project
              </h2>
              <div className="text-[14px] sm:text-[15px] font-normal leading-[1.75] text-[#0A0A0A] space-y-3 pt-1">
                <p>
                  {aboutBlock?.text ||
                    `Steel Mind Engineers executed this ${project.type} for ${project.client} at ${project.location}. The structure covers an approximate area of ${project.area.toLocaleString()} square feet and incorporates high-strength structural engineering, tailored load distribution, and durable fabrication specifications.`}
                </p>
                {data.quickAnswer && data.quickAnswer !== aboutBlock?.text && (
                  <p>{data.quickAnswer}</p>
                )}
              </div>
            </div>

            {/* Right: Specification Table */}
            <div className="lg:col-span-6">
              <div className="border-b border-[#E5E5E5]">
                <h3 className="text-[14px] sm:text-[16px] lg:text-[18px] font-bold text-[#0A0A0A] uppercase tracking-tight mb-4">
                  Project Specifications
                </h3>

                <div className="divide-y-0">
                  {/* Client */}
                  <div className="border-t border-[#E5E5E5] py-3 flex items-center justify-between text-[13px] lg:text-[14px]">
                    <span className="text-[#0A0A0A] font-medium">Client</span>
                    <span className="font-semibold text-[#0A0A0A] text-right">
                      {project.client}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="border-t border-[#E5E5E5] py-3 flex items-center justify-between text-[13px] lg:text-[14px]">
                    <span className="text-[#0A0A0A] font-medium">Location</span>
                    <span className="font-semibold text-[#0A0A0A] text-right">
                      {project.location}
                    </span>
                  </div>

                  {/* Type */}
                  <div className="border-t border-[#E5E5E5] py-3 flex items-center justify-between text-[13px] lg:text-[14px]">
                    <span className="text-[#0A0A0A] font-medium">
                      Building Type
                    </span>
                    <span className="font-semibold text-[#0A0A0A] text-right">
                      {project.type}
                    </span>
                  </div>

                  {/* Height */}
                  {project.height && (
                    <div className="border-t border-[#E5E5E5] py-3 flex items-center justify-between text-[13px] lg:text-[14px]">
                      <span className="text-[#0A0A0A] font-medium">
                        Clear Height
                      </span>
                      <span className="font-semibold text-[#0A0A0A] text-right tabular-nums">
                        {project.height}
                      </span>
                    </div>
                  )}

                  {/* Width */}
                  {project.width && (
                    <div className="border-t border-[#E5E5E5] py-3 flex items-center justify-between text-[13px] lg:text-[14px]">
                      <span className="text-[#0A0A0A] font-medium">
                        Width (Span)
                      </span>
                      <span className="font-semibold text-[#0A0A0A] text-right tabular-nums">
                        {project.width}
                      </span>
                    </div>
                  )}

                  {/* Length */}
                  {project.length && (
                    <div className="border-t border-[#E5E5E5] py-3 flex items-center justify-between text-[13px] lg:text-[14px]">
                      <span className="text-[#0A0A0A] font-medium">Length</span>
                      <span className="font-semibold text-[#0A0A0A] text-right tabular-nums">
                        {project.length}
                      </span>
                    </div>
                  )}

                  {/* Area */}
                  <div className="border-t border-[#E5E5E5] py-3 flex items-center justify-between text-[13px] lg:text-[14px]">
                    <span className="text-[#0A0A0A] font-medium">
                      Covered Area
                    </span>
                    <span
                      className="font-bold text-[16px] lg:text-[18px] text-[#0A0A0A] tabular-nums text-right"
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
    </div>
  );
};
