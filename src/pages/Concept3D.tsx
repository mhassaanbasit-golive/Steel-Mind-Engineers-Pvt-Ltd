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

// Mobile block component with single reveal-once IntersectionObserver (threshold 0.2, 600ms)
const MobileStoryBlock: React.FC<{
  block: (typeof BLOCKS)[0];
  idx: number;
  isLast: boolean;
  prefersReduced: boolean;
}> = ({ block, idx, isLast, prefersReduced }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(prefersReduced);

  useEffect(() => {
    if (prefersReduced) {
      setIsRevealed(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

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

    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <div
      ref={ref}
      className={`flex flex-col text-left ${
        !isLast ? "pb-12 mb-12 border-b border-[#E5E5E5]" : ""
      }`}
      style={{
        opacity: isRevealed ? 1 : 0,
        transform:
          isRevealed || prefersReduced ? "translateY(0)" : "translateY(16px)",
        transition: prefersReduced
          ? "none"
          : "opacity 600ms ease, transform 600ms ease",
      }}
    >
      {/* 1. Photo: true 3/2 ratio, full width, object-fit cover, no border radius */}
      <div
        className="w-full bg-[#0F172A]"
        style={{ aspectRatio: "3 / 2" }}
      >
        <img
          src={block.image}
          alt={block.alt}
          width={2400}
          height={1600}
          loading="lazy"
          decoding="async"
          className="w-full h-full block"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      {/* 2. Number row, margin-top 20px: 14px, weight 600, letter-spacing 0.12em, nav blue, solid. Next to number: line 32px wide, 1px high */}
      <div className="flex items-center mt-5">
        <span
          className="font-semibold text-[var(--blue,#1E3A8A)] leading-none select-none"
          style={{
            fontSize: "14px",
            letterSpacing: "0.12em",
          }}
        >
          {block.num}
        </span>
        <span
          className="inline-block bg-[var(--blue,#1E3A8A)]"
          style={{
            width: "32px",
            height: "1px",
            marginLeft: "12px",
          }}
        />
      </div>

      {/* 3. Title, margin-top 10px: font-size 19px, line-height 1.25 */}
      <h2
        className="font-bold text-[#0A0A0A] tracking-[-0.01em]"
        style={{
          fontSize: "19px",
          lineHeight: 1.25,
          marginTop: "10px",
        }}
      >
        {block.title}
      </h2>

      {/* 4. Text, margin-top 10px: 15px, line-height 1.7, colour #6B7280 matching Advantages page */}
      {idx === 3 ? (
        <div
          className="text-[#6B7280]"
          style={{
            fontSize: "15px",
            lineHeight: 1.7,
            marginTop: "10px",
          }}
        >
          <p>
            The approved model is the basis for the fabrication drawings. The
            same data feeds the cutting lists, so the factory makes exactly what
            you approved. Read more on the{" "}
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

          {/* Block 04 Button: full width, 52px high, margin-top 24px */}
          <div style={{ marginTop: "24px" }}>
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
        <p
          className="text-[#6B7280]"
          style={{
            fontSize: "15px",
            lineHeight: 1.7,
            marginTop: "10px",
          }}
        >
          {block.text}
        </p>
      )}
    </div>
  );
};

export const Concept3D: React.FC<Concept3DProps> = ({ data }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Active step index for desktop viewer (0 to 3)
  const [activeIndex, setActiveIndex] = useState(0);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  // PART 3. Active block logic (desktop) without IntersectionObserver:
  // markY = window.innerHeight * 0.5. Active index is block with smallest |center - markY|.
  useEffect(() => {
    if (!isDesktop) return;

    let rafId: number | null = null;

    const calculateActiveBlock = () => {
      rafId = null;
      const markY = window.innerHeight * 0.5;
      let closestIndex = 0;
      let minDistance = Infinity;

      blockRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - markY);
        if (dist < minDistance) {
          minDistance = dist;
          closestIndex = idx;
        }
      });

      setActiveIndex((prev) => (prev !== closestIndex ? closestIndex : prev));
    };

    const scheduleUpdate = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(calculateActiveBlock);
      }
    };

    // Run once on mount
    scheduleUpdate();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isDesktop]);

  return (
    <div className="w-full bg-white text-[var(--ink)]">
      {/* 1. HERO: Heading placed with button on bottom left like Advantages page, no subheading */}
      <SubpageHero
        title="3D CONCEPT DESIGN: SEE YOUR PRE-ENGINEERED BUILDING BEFORE IT IS BUILT"
        image={subpageImages.concept3D.hero}
        quoteUrl="/contact-us/#quote"
        compact={true}
      />

      {/* 2. STORY SECTION: Desktop 6fr/5fr with sticky viewer; Mobile stacked blocks.
          No overflow hidden, no transform and no filter on section or ancestors */}
      <section
        className="w-full bg-white text-left"
        style={{ paddingTop: "96px", paddingBottom: "96px" }}
      >
        {isDesktop ? (
          /* DESKTOP (1024px and up): Grid 6fr / 5fr, gap 64px, max-w-[1340px] px-5 lg:px-10 */
          <div className="max-w-[1340px] mx-auto px-5 lg:px-10">
            <div
              className="grid items-start"
              style={{
                gridTemplateColumns: "minmax(0, 6fr) minmax(0, 5fr)",
                gap: "64px",
              }}
            >
              {/* LEFT: Sticky 4/3 Viewer */}
              <div
                className="sticky"
                style={{
                  top: "calc(var(--nav-h, 88px) + 32px)",
                }}
              >
                <div
                  className="relative w-full overflow-hidden bg-[#0F172A]"
                  style={{
                    aspectRatio: "4 / 3",
                    maxHeight: "calc(100svh - var(--nav-h, 88px) - 64px)",
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
                        loading="eager"
                        decoding="async"
                        className="absolute inset-0 w-full h-full block"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                          opacity: isVisible ? 1 : 0,
                          transition: prefersReduced
                            ? "none"
                            : "opacity 700ms ease",
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
                        minHeight: "70svh",
                        paddingBottom: isLast ? "15svh" : undefined,
                        opacity: prefersReduced || isActive ? 1 : 0.4,
                        transition: prefersReduced
                          ? "none"
                          : "opacity 500ms ease",
                      }}
                    >
                      {/* Number "01" to "04": active solid nav blue; inactive transparent with 1px stroke at 45% */}
                      <div
                        className="font-bold select-none"
                        style={{
                          fontSize: "clamp(64px, 6vw, 96px)",
                          lineHeight: 1,
                          marginBottom: "16px",
                          color: isActive
                            ? "var(--blue, #1E3A8A)"
                            : "transparent",
                          WebkitTextStroke: isActive
                            ? "0px transparent"
                            : "1px rgba(30, 58, 138, 0.45)",
                          transition: prefersReduced
                            ? "none"
                            : "color 500ms ease, -webkit-text-stroke 500ms ease",
                        }}
                      >
                        {block.num}
                      </div>

                      {/* Title: 20px / 28px desktop, same as Advantages page section titles */}
                      <h2 className="text-[20px] lg:text-[28px] font-bold text-[#0A0A0A] leading-snug tracking-[-0.01em]">
                        {block.title}
                      </h2>

                      {/* Text: 15px leading-[1.7] text-[#6B7280], exactly matching Advantages page body text */}
                      {idx === 3 ? (
                        /* Block 04: with links to Engineering Department and Detailing */
                        <div className="text-[15px] leading-[1.7] text-[#6B7280] mt-3 max-w-[520px]">
                          <p>
                            The approved model is the basis for the fabrication
                            drawings. The same data feeds the cutting lists, so
                            the factory makes exactly what you approved. Read
                            more on the{" "}
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
                          <div style={{ marginTop: "24px" }}>
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
                        <p className="text-[15px] leading-[1.7] text-[#6B7280] mt-3 max-w-[520px]">
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
          /* MOBILE AND TABLET (below 1024px): Max-w 720px centered, padding 48px 24px, no sticky viewer */
          <div className="max-w-[720px] mx-auto px-6 py-12">
            <div className="flex flex-col">
              {BLOCKS.map((block, idx) => (
                <MobileStoryBlock
                  key={block.num}
                  block={block}
                  idx={idx}
                  isLast={idx === BLOCKS.length - 1}
                  prefersReduced={prefersReduced}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. FAQ SECTION: text size 22px / 40px desktop matching Advantages page */}
      {data.faq && data.faq.length > 0 && (
        <section className="w-full bg-white border-t border-[#E5E5E5] py-16 lg:py-24">
          <div className="max-w-[1340px] mx-auto px-5 lg:px-10 text-left">
            <h2 className="text-[22px] lg:text-[40px] font-bold text-[#0A0A0A] leading-[1.15] tracking-[-0.02em] mb-10">
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
