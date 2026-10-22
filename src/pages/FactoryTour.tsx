import React, { useRef, useLayoutEffect } from "react";
import { Button } from "../components/ui/Button.tsx";
import { SubpageHero } from "../components/subpage/SubpageHero.tsx";
import { SubpageNextBanner } from "../components/subpage/SubpageNextBanner.tsx";
import { aboutImages } from "../data/aboutImages.ts";
import { cl } from "../data/images.ts";
import { gsap, ScrollTrigger } from "../lib/gsap.ts";
import page8 from "../content/generated/page-08.json";

export const FactoryTour: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const stepCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const stepTextRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepNumRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

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

  // GSAP Scroll Animations Setup matching Custom Steel Fabrication Signatures
  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const E1 = "cubic-bezier(0.16, 1, 0.3, 1)";
    const E2 = "cubic-bezier(0.76, 0, 0.24, 1)";

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Intro Rise Animation
      if (introRef.current) {
        gsap.fromTo(
          introRef.current,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: E1,
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: introRef.current,
              start: "top 88%",
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Timeline Vertical Track Line Scrub
      if (timelineLineRef.current && timelineContainerRef.current) {
        gsap.fromTo(
          timelineLineRef.current,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: timelineContainerRef.current,
              start: "top 80%",
              end: "bottom 70%",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Individual Step Reveals (Curtain on Photo + Rise on Text + Badge Pop)
      p8Steps.forEach((_: any, idx: number) => {
        const card = stepCardRefs.current[idx];
        const box = stepBoxRefs.current[idx];
        const img = stepImgRefs.current[idx];
        const textGroup = stepTextRefs.current[idx];
        const numBadge = stepNumRefs.current[idx];

        if (!card) return;

        // Start states
        if (box) gsap.set(box, { clipPath: "inset(0 0 100% 0)" });
        if (img) gsap.set(img, { scale: 1.06 });
        if (textGroup) gsap.set(textGroup, { y: 24, opacity: 0 });
        if (numBadge) gsap.set(numBadge, { scale: 0.85, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
          },
          onStart: () => {
            if (box) gsap.set(box, { willChange: "clip-path" });
            if (img) gsap.set(img, { willChange: "transform" });
            if (textGroup) gsap.set(textGroup, { willChange: "transform, opacity" });
          },
          onComplete: () => {
            if (box) gsap.set(box, { clearProps: "willChange,clipPath" });
            if (img) gsap.set(img, { clearProps: "willChange,scale" });
            if (textGroup) gsap.set(textGroup, { clearProps: "willChange,transform,opacity" });
            if (numBadge) gsap.set(numBadge, { clearProps: "scale,opacity" });
          },
        });

        // Step number pop
        if (numBadge) {
          tl.to(numBadge, { scale: 1, opacity: 1, duration: 0.5, ease: E1 }, 0);
        }

        // Photo curtain reveal 1000ms E2
        if (box) {
          tl.to(box, { clipPath: "inset(0 0 0% 0)", duration: 1.0, ease: E2 }, 0);
        }

        // Inner image zoom out 1300ms E1
        if (img) {
          tl.to(img, { scale: 1, duration: 1.3, ease: E1 }, 0);
        }

        // Text & descriptions RISE
        if (textGroup) {
          tl.to(
            textGroup,
            { y: 0, opacity: 1, duration: 0.85, ease: E1 },
            0.15
          );
        }
      });

      // CTA Button Rise
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: E1,
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Reduced Motion
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (introRef.current) gsap.set(introRef.current, { y: 0, opacity: 1 });
        if (timelineLineRef.current) gsap.set(timelineLineRef.current, { scaleY: 1 });
        stepBoxRefs.current.forEach((box) => {
          if (box) gsap.set(box, { clipPath: "none" });
        });
        stepImgRefs.current.forEach((img) => {
          if (img) gsap.set(img, { scale: 1 });
        });
        stepTextRefs.current.forEach((txt) => {
          if (txt) gsap.set(txt, { y: 0, opacity: 1 });
        });
        stepNumRefs.current.forEach((badge) => {
          if (badge) gsap.set(badge, { scale: 1, opacity: 1 });
        });
        if (ctaRef.current) gsap.set(ctaRef.current, { y: 0, opacity: 1 });
      });
    }, rootRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [p8Steps.length]);

  return (
    <div ref={rootRef} className="relative w-full bg-white text-[var(--ink)]">
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
          <p
            ref={introRef}
            className="text-[14px] lg:text-[15px] leading-[1.7] text-[#0A0A0A] max-w-[640px] text-left"
          >
            {p8WhereFactoryText}
          </p>

          <div
            ref={timelineContainerRef}
            className="relative mt-16 pl-12 lg:pl-16 space-y-12 lg:space-y-14 text-left"
          >
            {/* Scrubbed Timeline Guide Line */}
            <div
              ref={timelineLineRef}
              className="absolute left-[15px] lg:left-[19px] top-2 bottom-6 w-[2px] bg-[#1E3A8A] origin-top"
            />

            {p8Steps.map((step: any, idx: number) => {
              const stepNum = String(idx + 1).padStart(2, "0");
              const stepImg = cl(
                aboutImages.factory.steps[idx]?.src ||
                aboutImages.factory.steps[0].src,
                1000
              );

              return (
                <div
                  key={step.name}
                  ref={(el) => {
                    stepCardRefs.current[idx] = el;
                  }}
                  className="group relative transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                >
                  {/* Step Number Tag sitting on the timeline */}
                  <div
                    ref={(el) => {
                      stepNumRefs.current[idx] = el;
                    }}
                    className="absolute -left-[48px] lg:-left-[64px] top-0 text-[16px] font-bold text-[#1E3A8A] tabular-nums tracking-[0.06em] bg-white pr-2 py-0.5 select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:text-white group-hover:bg-[#1E3A8A] rounded px-1.5 -ml-1.5 shadow-sm"
                  >
                    {stepNum}
                  </div>

                  <div className="space-y-2">
                    {/* Step Title & Description with Rise */}
                    <div
                      ref={(el) => {
                        stepTextRefs.current[idx] = el;
                      }}
                      className="space-y-2"
                    >
                      <h2 className="text-[17px] sm:text-[19px] lg:text-[22px] font-semibold text-[#0A0A0A] leading-[1.25] tracking-[-0.01em] uppercase transition-colors duration-300 group-hover:text-[var(--blue)]">
                        {step.name}
                      </h2>
                      <div className="w-6 h-[2px] bg-[var(--blue)]/30 group-hover:w-12 group-hover:bg-[var(--blue)] transition-all duration-400 mb-2" />
                      <p className="text-[14px] lg:text-[15px] text-[#0A0A0A] leading-[1.7] max-w-[620px] transition-colors duration-300 group-hover:text-black">
                        {step.text}
                      </p>
                    </div>

                    {/* Step Photo Box with Curtain Reveal & Smooth Hover Zoom */}
                    <div className="pt-3 max-w-[500px]">
                      <div
                        ref={(el) => {
                          stepBoxRefs.current[idx] = el;
                        }}
                        className="relative w-full aspect-[4/3] overflow-hidden bg-[#0F172A] border border-[#E5E5E5] rounded-sm shadow-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:shadow-[0_16px_36px_rgba(30,58,138,0.12)] group-hover:border-[var(--blue)]"
                      >
                        <img
                          ref={(el) => {
                            stepImgRefs.current[idx] = el;
                          }}
                          src={stepImg}
                          alt={step.name}
                          loading="lazy"
                          className="w-full h-full object-cover object-center block origin-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div ref={ctaRef} className="mt-16 text-center">
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
