import React, { useState, useRef, useEffect } from "react";
import { ContentData } from "../content/types.ts";
import { subpageImages } from "../data/subpageImages.ts";
import { SubpageHero } from "../components/subpage/SubpageHero.tsx";
import { Accordion } from "../components/ui/Accordion.tsx";
import { NextBand } from "../components/ui/NextBand.tsx";
import { TransitionLink } from "../components/ui/TransitionLink.tsx";
import { useMediaQuery } from "../hooks/useMediaQuery.ts";

export interface Concept3DProps {
  data: ContentData;
}

const BLOCKS = [
  {
    num: "01",
    title: "Why a 3D Model Helps",
    text: "A flat drawing is hard to read for people who are not engineers. A 3D model shows the building as it will stand: the height, the roof slope, the door positions and the crane or mezzanine layout. You can check it with your own team before any steel is cut.",
    image: subpageImages.concept3D.viewer01,
    alt: "Why a 3D Model Helps",
  },
  {
    num: "02",
    title: "What the 3D Concept Shows",
    text: "The model shows the full building shape, with frames, purlins and bracing. It shows the positions of doors, windows, skylights and vents. It shows the layout of cranes, mezzanine floors and interior equipment where they apply. It also shows the clearance for trucks, forklifts and machines.",
    image: subpageImages.concept3D.viewer02,
    alt: "What the 3D Concept Shows",
  },
  {
    num: "03",
    title: "How the 3D Stage Works",
    text: "You send your layout, size and use. The engineer builds the 3D model of the structure. You review the model and ask for changes. After you approve the model, the engineers prepare the detail drawings. Changes at the 3D stage cost very little, while changes after fabrication cost much more. This is why Steel Mind Engineers asks for your approval before cutting starts.",
    image: subpageImages.concept3D.viewer03,
    alt: "How the 3D Stage Works",
  },
  {
    num: "04",
    title: "From 3D Model to Fabrication",
    text: "The approved model is the basis for the fabrication drawings. The same data feeds the cutting lists, so the factory makes exactly what you approved. Read more on the Engineering Department page and the Detailing page.",
    image: subpageImages.concept3D.viewer04,
    alt: "From 3D Model to Fabrication",
  },
];

export const Concept3D: React.FC<Concept3DProps> = ({ data }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Active step index for desktop viewer (0 to 3)
  const [activeIndex, setActiveIndex] = useState(0);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Section reveal animation via IntersectionObserver (threshold 0.2, once)
  const sectionRef = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(prefersReduced);

  useEffect(() => {
    if (prefersReduced) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [prefersReduced]);

  // Desktop active block tracking with rootMargin "-40% 0px -40% 0px"
  useEffect(() => {
    if (!isDesktop) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = blockRefs.current.indexOf(
              entry.target as HTMLDivElement
            );
            if (index !== -1) {
              setActiveIndex((prev) => (prev !== index ? index : prev));
            }
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      }
    );

    blockRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isDesktop]);

  return (
    <div className="w-full bg-white text-[var(--ink)]">
      {/* 1. HERO: variant="full", existing headline & subtext */}
      <SubpageHero
        title="3D CONCEPT DESIGN: SEE YOUR PRE-ENGINEERED BUILDING BEFORE IT IS BUILT"
        subtitle={data.quickAnswer}
        image={subpageImages.concept3D.hero}
        variant="full"
      />

      {/* 2. STORY SECTION: Desktop 5fr/7fr with sticky viewer; Mobile stacked blocks */}
      <section
        ref={sectionRef}
        className="w-full bg-white text-left"
        style={{
          opacity: isRevealed ? 1 : 0,
          transform:
            isRevealed || prefersReduced ? "translateY(0)" : "translateY(16px)",
          transition: prefersReduced
            ? "none"
            : `opacity ${isDesktop ? "800ms" : "600ms"} cubic-bezier(0.22, 1, 0.36, 1), transform ${
                isDesktop ? "800ms" : "600ms"
              } cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        {isDesktop ? (
          /* DESKTOP (1024px and up): 5fr / 7fr Grid, max-w 1280px, gap 96px, py 96px */
          <div className="max-w-[1280px] mx-auto px-8 py-24">
            <div className="grid grid-cols-[5fr_7fr] gap-24 items-start">
              {/* LEFT: Sticky 4/5 Viewer */}
              <div
                className="sticky"
                style={{
                  top: "calc(var(--nav-h, 88px) + 24px)",
                }}
              >
                <div
                  className="relative w-full rounded-none overflow-hidden bg-[#0F172A]"
                  style={{
                    aspectRatio: "4 / 5",
                    maxHeight: "calc(100svh - var(--nav-h, 88px) - 48px)",
                  }}
                >
                  {BLOCKS.map((block, idx) => {
                    const isVisible = activeIndex === idx;

                    return (
                      <img
                        key={block.num}
                        src={block.image}
                        alt={block.alt}
                        width={2400}
                        height={1600}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover object-center block"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                          opacity: isVisible ? 1 : 0,
                          transition: prefersReduced
                            ? "none"
                            : "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* RIGHT: 4 Text Blocks stacked */}
              <div className="flex flex-col">
                {BLOCKS.map((block, idx) => {
                  const isActive = activeIndex === idx;
                  const isLast = idx === BLOCKS.length - 1;

                  return (
                    <div
                      key={block.num}
                      ref={(el) => {
                        blockRefs.current[idx] = el;
                      }}
                      className="flex flex-col justify-center"
                      style={{
                        minHeight: "80svh",
                        paddingBottom: isLast ? "20svh" : undefined,
                        opacity: prefersReduced || isActive ? 1 : 0.35,
                        transition: prefersReduced ? "none" : "opacity 500ms ease",
                      }}
                    >
                      {/* Big Number "01" to "04" */}
                      <div
                        className="font-bold select-none"
                        style={{
                          fontSize: "clamp(96px, 11vw, 168px)",
                          lineHeight: 0.9,
                          color: `rgba(30, 58, 138, ${isActive ? 0.18 : 0.10})`,
                          transition: prefersReduced ? "none" : "color 500ms ease",
                        }}
                      >
                        {block.num}
                      </div>

                      {/* Title */}
                      <h2 className="text-[32px] font-bold text-[#0A0A0A] leading-snug tracking-[-0.01em] mt-3 mb-4">
                        {block.title}
                      </h2>

                      {/* Text */}
                      {idx === 3 ? (
                        /* Block 04: with links to Engineering Department and Detailing */
                        <div className="text-[17px] leading-[1.7] text-[#374151] max-w-[520px]">
                          <p>
                            The approved model is the basis for the fabrication
                            drawings. The same data feeds the cutting lists, so
                            the factory makes exactly what you approved. Read more
                            on the{" "}
                            <TransitionLink
                              to="/pre-engineered-buildings-pakistan/engineering-department/"
                              className="text-[var(--blue,#1E3A8A)] underline font-medium hover:opacity-80"
                            >
                              Engineering Department
                            </TransitionLink>{" "}
                            page and the{" "}
                            <TransitionLink
                              to="/services/detailing/"
                              className="text-[var(--blue,#1E3A8A)] underline font-medium hover:opacity-80"
                            >
                              Detailing
                            </TransitionLink>{" "}
                            page.
                          </p>

                          {/* Desktop Button under text: 52px high, nav-blue background, white text, 24px side padding */}
                          <div className="pt-8">
                            <TransitionLink
                              to="/pre-engineered-buildings-pakistan/engineering-department/"
                              className="h-[52px] inline-flex items-center justify-center gap-3 px-6 bg-[var(--blue,#1E3A8A)] text-white font-semibold text-[15px] hover:bg-[#1E40AF] transition-colors cursor-pointer select-none"
                            >
                              <span>Engineering Department</span>
                              <span className="inline-block text-[18px]">→</span>
                            </TransitionLink>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[17px] leading-[1.7] text-[#374151] max-w-[520px]">
                          {block.text}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* MOBILE AND TABLET (below 1024px): Max-w 720px, py 56px, px 24px, gap 56px between blocks */
          <div className="max-w-[720px] mx-auto px-6 py-14">
            <div className="flex flex-col gap-14">
              {BLOCKS.map((block, idx) => (
                <div key={block.num} className="flex flex-col">
                  {/* Photo: 16/9 aspect-ratio, object-fit cover, full width */}
                  <div
                    className="relative w-full overflow-hidden bg-[#0F172A]"
                    style={{ aspectRatio: "16 / 9" }}
                  >
                    <img
                      src={block.image}
                      alt={block.alt}
                      width={2400}
                      height={1600}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center block"
                      style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                  </div>

                  {/* Outline Number: 44px, color transparent, -webkit-text-stroke 1px nav blue */}
                  <div
                    className="font-bold text-transparent [-webkit-text-stroke:1px_var(--blue,#1E3A8A)] leading-none mt-5"
                    style={{ fontSize: "44px" }}
                  >
                    {block.num}
                  </div>

                  {/* Title: 20px */}
                  <h2 className="text-[20px] font-bold text-[#0A0A0A] leading-snug tracking-[-0.01em] mt-2">
                    {block.title}
                  </h2>

                  {/* Text: 16px, line-height 1.6, dark grey */}
                  {idx === 3 ? (
                    <div className="text-[16px] leading-[1.6] text-[#374151] mt-3">
                      <p>
                        The approved model is the basis for the fabrication
                        drawings. The same data feeds the cutting lists, so the
                        factory makes exactly what you approved. Read more on
                        the{" "}
                        <TransitionLink
                          to="/pre-engineered-buildings-pakistan/engineering-department/"
                          className="text-[var(--blue,#1E3A8A)] underline font-medium hover:opacity-80"
                        >
                          Engineering Department
                        </TransitionLink>{" "}
                        page and the{" "}
                        <TransitionLink
                          to="/services/detailing/"
                          className="text-[var(--blue,#1E3A8A)] underline font-medium hover:opacity-80"
                        >
                          Detailing
                        </TransitionLink>{" "}
                        page.
                      </p>

                      {/* Mobile Button: full width and 52px high */}
                      <div className="pt-6">
                        <TransitionLink
                          to="/pre-engineered-buildings-pakistan/engineering-department/"
                          className="w-full h-[52px] inline-flex items-center justify-center gap-3 px-6 bg-[var(--blue,#1E3A8A)] text-white font-semibold text-[15px] hover:bg-[#1E40AF] transition-colors cursor-pointer select-none"
                        >
                          <span>Engineering Department</span>
                          <span className="inline-block text-[18px]">→</span>
                        </TransitionLink>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[16px] leading-[1.6] text-[#374151] mt-3">
                      {block.text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. FAQ SECTION: size="large" */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white border-t border-[#E5E5E5] py-16 lg:py-24 px-6 lg:px-8">
          <div className="max-w-[1280px] mx-auto text-left">
            <h2 className="text-[22px] lg:text-[36px] font-bold text-[#0A0A0A] leading-tight tracking-[-0.02em] mb-10">
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* 4. NEXT BANNER: image prop, existing next link & heading */}
      <NextBand
        image={subpageImages.concept3D.next}
        heading="One-Step Solution: A Turnkey Steel Building From Design to Handover"
        nextTitle="Explore One-Step Solution"
        nextUrl="/pre-engineered-buildings-pakistan/one-step-solution/"
      />
    </div>
  );
};
