import React, { useEffect, useState, useRef } from "react";
import { Button } from "../components/ui/Button.tsx";
import { SubpageHero } from "../components/subpage/SubpageHero.tsx";
import { SubpageNextBanner } from "../components/subpage/SubpageNextBanner.tsx";
import { aboutImages } from "../data/aboutImages.ts";
import { cl } from "../data/images.ts";
import { gsap } from "../lib/gsap.ts";
import { useReducedMotion } from "../hooks/useReducedMotion.ts";
import page8 from "../content/generated/page-08.json";

export const FactoryTour: React.FC = () => {
  const reducedMotion = useReducedMotion();

  // Factory Tour timeline line animation via scaleY scrub
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const line = timelineLineRef.current;
    const container = timelineContainerRef.current;
    if (!line || !container) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0, transformOrigin: "top" },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "bottom 70%",
            scrub: 1,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  // Extract Page 8 Content (Factory Tour)
  const p8WhereFactory = page8.blocks.find(
    (b: any) => b.title === "Where the Factory Is"
  );
  const p8WhereFactoryIdx = page8.blocks.indexOf(p8WhereFactory as any);
  const p8WhereFactoryText =
    page8.blocks[p8WhereFactoryIdx + 1]?.text ||
    "The Steel Mind Engineers factory is at Karol Ghati, Lahore, Punjab 54000. All fabrication for projects across Pakistan starts here. The head office is at 35-D Commercial, DHA EME Sector, Lahore.";

  const p8Steps =
    (page8.blocks.find((b: any) => b.type === "steps") as any)?.items || [];

  return (
    <div className="relative w-full bg-white text-[var(--ink)]">
      {/* Hero with 20% overlay */}
      <SubpageHero
        title={page8.h1}
        image={aboutImages.factory.hero}
        quoteUrl="/contact-us/#quote"
        overlay={true}
      />

      {/* ========================================================= */}
      {/* FACTORY TOUR CONTENT */}
      {/* ========================================================= */}
      <section
        id="factory-tour"
        style={{ scrollMarginTop: "var(--nav-h, 88px)" }}
        className="w-full bg-white py-[72px] lg:py-[112px]"
      >
        <div className="max-w-[1340px] mx-auto px-5 lg:px-10">
          <p className="text-[14px] lg:text-[15px] leading-[1.7] text-[#0A0A0A] max-w-[600px] text-left">
            {p8WhereFactoryText}
          </p>

          <div
            ref={timelineContainerRef}
            className="relative mt-16 pl-12 lg:pl-16 space-y-10 text-left"
          >
            <div
              ref={timelineLineRef}
              className="absolute left-[15px] lg:left-[19px] top-2 bottom-6 w-[1px] bg-[#1E3A8A] origin-top"
            />

            {p8Steps.map((step: any, idx: number) => {
              const stepNum = String(idx + 1).padStart(2, "0");
              const stepImg = cl(
                aboutImages.factory.steps[idx]?.src ||
                aboutImages.factory.steps[0].src,
                1000
              );

              return (
                <div key={step.name} className="relative">
                  <div className="absolute -left-[48px] lg:-left-[64px] top-0 text-[16px] font-bold text-[#1E3A8A] tabular-nums tracking-[0.06em] bg-white pr-2">
                    {stepNum}
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-[17px] sm:text-[19px] lg:text-[22px] font-semibold text-[#0A0A0A] leading-[1.25] tracking-[-0.01em] uppercase">
                      {step.name}
                    </h2>
                    <p className="text-[14px] lg:text-[15px] text-[#0A0A0A] leading-[1.7] max-w-[600px]">
                      {step.text}
                    </p>

                    <div className="pt-3 max-w-[480px]">
                      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#0F172A] border border-[#E5E5E5]">
                        <img
                          src={stepImg}
                          alt={step.name}
                          loading="lazy"
                          className="w-full h-full object-cover object-center block"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Button variant="secondary" href="/contact-us/">
              Book a Factory Visit
            </Button>
          </div>
        </div>
      </section>

      {/* Next Banner to PEB with 20% overlay */}
      <SubpageNextBanner
        heading="Explore Pre-Engineered Steel Buildings"
        title="Pre-Engineered Buildings"
        url="/pre-engineered-buildings-pakistan/"
        image={aboutImages.factory.nextPeb}
        overlay={true}
      />
    </div>
  );
};
