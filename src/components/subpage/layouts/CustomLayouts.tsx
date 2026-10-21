// Custom Steel Fabrication Signature Layouts (9.23 - 9.27)
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { ContentData, ContentBlock } from "../../../content/types.ts";
import { IMG } from "../../../data/subpageImages.ts";
import { PhotoBox } from "../../page/PhotoBox.tsx";
import { OutlineNum } from "../../page/OutlineNum.tsx";
import { HeroBand } from "../../ui/HeroBand.tsx";
import { Accordion } from "../../ui/Accordion.tsx";
import { NextBand } from "../../ui/NextBand.tsx";
import { Check } from "lucide-react";
import { gsap, ScrollTrigger } from "../../../lib/gsap.ts";

function extractSections(data: ContentData) {
  const sections: { title: string; text: string; paragraphs: string[]; items?: { name: string; text: string }[] }[] = [];
  let current: { title: string; text: string; paragraphs: string[]; items?: { name: string; text: string }[] } | null = null;
  const introPs: string[] = [];

  data.blocks.forEach((b: ContentBlock) => {
    if (b.type === "h2") {
      if (current) sections.push(current);
      current = { title: b.title || "", text: "", paragraphs: [] };
    } else if (b.type === "p" && b.text) {
      if (current) {
        current.paragraphs.push(b.text);
        current.text = current.text ? `${current.text} ${b.text}` : b.text;
      } else {
        introPs.push(b.text);
      }
    } else if ((b.type === "defs" || b.type === "steps") && b.items) {
      if (current) current.items = b.items;
    }
  });
  if (current) sections.push(current);

  return { introPs, sections };
}

// 9.23 Machine Frames — signature: "Statement + ruler + checklist"
export const MachineFramesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const rootRef = useRef<HTMLElement>(null);
  const mobileBlockRef = useRef<HTMLDivElement>(null);
  const mobileHeadingRef = useRef<HTMLHeadingElement>(null);
  const mobileTextRef = useRef<HTMLParagraphElement>(null);

  const { introPs, sections } = extractSections(data);
  const checklistSecs = sections.slice(1, 4);

  // Motion for Machine Frames:
  // "Only that block: heading and text RISE once (stagger 90ms); if the ruler already animates, leave it exactly as it is. No other motion is added or changed."
  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Mobile: (max-width: 1023px)
      mm.add("(max-width: 1023px)", () => {
        if (mobileBlockRef.current && mobileHeadingRef.current && mobileTextRef.current) {
          const els = [mobileHeadingRef.current, mobileTextRef.current];
          gsap.set(els, { y: 24, opacity: 0 });

          gsap.to(els, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "E1",
            stagger: 0.09,
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: mobileBlockRef.current,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
            onStart: () => {
              els.forEach((el) => {
                if (el) gsap.set(el, { willChange: "transform, opacity" });
              });
            },
            onComplete: () => {
              els.forEach((el) => {
                if (el) gsap.set(el, { clearProps: "willChange" });
              });
            },
          });
        }
      });

      // Reduced motion
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (mobileHeadingRef.current && mobileTextRef.current) {
          gsap.set([mobileHeadingRef.current, mobileTextRef.current], { y: 0, opacity: 1 });
        }
      });
    }, rootRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <article ref={rootRef} className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.custom.machineFrames.hero}
        imageAlt={data.h1.toUpperCase()}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* Desktop Statement Section */}
      <section className="hidden lg:block container py-[var(--sec-y-lg)] text-left">
        <div className="grid grid-cols-12 gap-10 items-baseline">
          <div className="col-span-5">
            <h2 className="text-[26px] lg:text-[34px] font-bold text-[var(--ink)] uppercase leading-[1.2]">
              {(sections[0]?.title || "What a Machine Frame Does").toUpperCase()}
            </h2>
          </div>
          <div className="col-span-7">
            <p className="text-[16px] sm:text-[17px] lg:text-[24px] text-[var(--ink)] font-normal leading-[1.65] lg:leading-[1.45] text-pretty">
              {sections[0]?.text || introPs.join(" ")}
            </p>
          </div>
        </div>
      </section>

      {/* Desktop Wide Image with SVG Precision Ruler */}
      <section className="hidden lg:block container pb-[var(--sec-y-lg)]">
        <div className="w-full aspect-[64/27] overflow-hidden bg-slate-900 shadow-md">
          <img
            src={IMG.custom.machineFrames.wide}
            alt="Precision Machine Frame Fabrication"
            width={2560}
            height={1080}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover block"
          />
        </div>
        {/* SVG Engineering Ruler */}
        <div className="w-full h-6 border-b border-[var(--blue)] flex justify-between items-end px-2 pt-2">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className={`w-[1px] bg-[var(--blue)] ${i % 5 === 0 ? "h-4" : "h-2"}`}
            />
          ))}
        </div>
      </section>

      {/* Mobile Block: "What a Machine Frame Does" (Heading 16px bold uppercase, 20px gap, Text 15px / 1.6 var(--blue), 40px gap, Image, Ruler) */}
      <section className="block lg:hidden container py-12 text-left">
        <div ref={mobileBlockRef}>
          {/* Heading: mobile size of TEXT STYLE (16px, bold, uppercase, ink) */}
          <h2
            ref={mobileHeadingRef}
            className="text-[16px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-[20px]"
          >
            {(sections[0]?.title || "What a Machine Frame Does").toUpperCase()}
          </h2>

          {/* Text: mobile size of TEXT STYLE (15px / 1.6, regular weight, var(--blue)), 40px under to image */}
          <p
            ref={mobileTextRef}
            className="text-[15px] font-normal text-[#0A0A0A] leading-[1.6] mb-[40px]"
          >
            {sections[0]?.text || introPs.join(" ")}
          </p>
        </div>

        {/* Wide Image with SVG Precision Ruler */}
        <div>
          <div className="w-full aspect-[64/27] overflow-hidden bg-slate-900 shadow-md">
            <img
              src={IMG.custom.machineFrames.wide}
              alt="Precision Machine Frame Fabrication"
              width={1920}
              height={810}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover block"
            />
          </div>
          {/* SVG Engineering Ruler */}
          <div className="w-full h-6 border-b border-[var(--blue)] flex justify-between items-end px-2 pt-2">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className={`w-[1px] bg-[var(--blue)] ${i % 5 === 0 ? "h-4" : "h-2"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Checklist Section (3 columns with 40px circle & check icon) */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {checklistSecs.map((sec, idx) => (
            <div key={idx} className="group space-y-4 transition-transform duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 rounded-full border border-[var(--blue)] bg-white text-[var(--blue)] flex items-center justify-center transition-colors duration-300 group-hover:bg-[var(--blue)] group-hover:text-white">
                <Check size={20} />
              </div>
              <h3 className="text-[20px] lg:text-[22px] font-bold text-[var(--ink)] uppercase leading-snug">
                {sec.title.toUpperCase()}
              </h3>
              <p className="text-[16px] text-[#0A0A0A] font-normal leading-[1.7]">
                {sec.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-[#0A0A0A] mb-8 uppercase leading-tight lg:leading-[1.15] tracking-[-0.02em]">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* Next Banner */}
      <NextBand
        image={IMG.custom.machineFrames.next}
        nextUrl="/custom-steel-fabrication-pakistan/storage-tanks/"
        nextTitle="Storage Tanks"
        heading="CUSTOM-DESIGNED STORAGE TANKS IN PAKISTAN"
      />
    </article>
  );
};

// 9.24 Storage Tanks — signature: "Pinned cinematic 340svh viewer (Desktop) + rail flow (Mobile)"
export const StorageTanksLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const rootRef = useRef<HTMLElement>(null);

  // Desktop refs
  const desktopSecRef = useRef<HTMLElement>(null);
  const desktopImgRef = useRef<HTMLImageElement>(null);
  const desktopCaptionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopTickRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Mobile refs
  const mobilePhotoBoxRef = useRef<HTMLDivElement>(null);
  const mobileImgRef = useRef<HTMLImageElement>(null);
  const mobileRailContainerRef = useRef<HTMLDivElement>(null);
  const mobileRailFillRef = useRef<HTMLDivElement>(null);
  const mobileBlockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileDotRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeIdxRef = useRef(0);
  const [, setActiveIdx] = useState(0);

  const { sections } = extractSections(data);
  const blocks = sections.slice(0, 3).map((sec, idx) => ({
    num: String(idx + 1).padStart(2, "0"),
    title: sec.title,
    text: sec.text,
  }));

  const HERO_IMAGE = "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202493/Tanks-hero.jpg";
  const WIDE_IMAGE = "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202576/tanks-wide.jpg";
  const NEXT_IMAGE = "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202575/tanks-next.jpg";

  // Preload and decode images and debounced refresh
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const debouncedRefresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(debouncedRefresh);
    }

    [HERO_IMAGE, WIDE_IMAGE, NEXT_IMAGE].forEach((src) => {
      const img = new Image();
      img.src = src;
      if (img.decode) {
        img.decode().then(debouncedRefresh).catch(() => {});
      } else {
        img.onload = debouncedRefresh;
      }
    });

    return () => clearTimeout(timer);
  }, []);

  // Motion Setup: Desktop (340svh pinned scroll + captions + ticks) and Mobile (Curtain + Rail fill + Rise)
  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const E1 = "cubic-bezier(0.16, 1, 0.3, 1)";
    const E2 = "cubic-bezier(0.76, 0, 0.24, 1)";

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ==========================================
      // DESKTOP: (min-width: 1024px)
      // ==========================================
      mm.add("(min-width: 1024px)", () => {
        // Set initial states before paint
        desktopCaptionRefs.current.forEach((cap, i) => {
          if (!cap) return;
          if (i === 0) {
            gsap.set(cap, { opacity: 1, y: 0 });
          } else {
            gsap.set(cap, { opacity: 0, y: 16 });
          }
        });

        desktopTickRefs.current.forEach((tick, i) => {
          if (!tick) return;
          gsap.set(tick, { scaleY: i === 0 ? 1 : 0.41, opacity: i === 0 ? 1 : 0.6 });
        });

        if (desktopSecRef.current && desktopImgRef.current) {
          // 1. Photo scale goes 1.04 to 1 over the whole section (scrub 1.4, ease "none") on inner <img> only
          gsap.fromTo(
            desktopImgRef.current,
            { scale: 1.04 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: desktopSecRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.4,
                invalidateOnRefresh: true,
              },
            }
          );

          // 2. ScrollTrigger on the 340svh section: gives progress p; Caption index = p < .333 ? 0 : p < .666 ? 1 : 2
          ScrollTrigger.create({
            trigger: desktopSecRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const nextIdx = p < 0.333 ? 0 : p < 0.666 ? 1 : 2;
              if (nextIdx !== activeIdxRef.current) {
                const prevIdx = activeIdxRef.current;
                activeIdxRef.current = nextIdx;
                setActiveIdx(nextIdx);

                // Caption change: old caption fades out 300ms; new one fades in 800ms with y 16 to 0 (E1) starting 200ms later
                const prevCap = desktopCaptionRefs.current[prevIdx];
                const nextCap = desktopCaptionRefs.current[nextIdx];
                if (prevCap) {
                  gsap.to(prevCap, {
                    opacity: 0,
                    y: -8,
                    duration: 0.3,
                    ease: E1,
                    overwrite: "auto",
                  });
                }
                if (nextCap) {
                  gsap.fromTo(
                    nextCap,
                    { opacity: 0, y: 16 },
                    {
                      opacity: 1,
                      y: 0,
                      duration: 0.8,
                      delay: 0.2,
                      ease: E1,
                      overwrite: "auto",
                    }
                  );
                }

                // Tick rail: ticks 44px tall, scaleY(.41) inactive and scaleY(1) active, 400ms E1
                desktopTickRefs.current.forEach((tick, i) => {
                  if (!tick) return;
                  if (i === nextIdx) {
                    gsap.to(tick, {
                      scaleY: 1,
                      opacity: 1,
                      duration: 0.4,
                      ease: E1,
                      overwrite: "auto",
                    });
                  } else {
                    gsap.to(tick, {
                      scaleY: 0.41,
                      opacity: 0.6,
                      duration: 0.4,
                      ease: E1,
                      overwrite: "auto",
                    });
                  }
                });
              }
            },
          });
        }
      });

      // ==========================================
      // MOBILE: (max-width: 1023px)
      // ==========================================
      mm.add("(max-width: 1023px)", () => {
        // 1. Mobile photo CURTAIN 900ms
        if (mobilePhotoBoxRef.current && mobileImgRef.current) {
          const box = mobilePhotoBoxRef.current;
          const img = mobileImgRef.current;

          gsap.set(box, { clipPath: "inset(0 0 100% 0)" });
          gsap.set(img, { scale: 1.06 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: box,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
            onStart: () => {
              gsap.set(box, { willChange: "clip-path" });
              gsap.set(img, { willChange: "transform" });
            },
            onComplete: () => {
              gsap.set(box, { clearProps: "willChange,clipPath" });
              gsap.set(img, { clearProps: "willChange,transform" });
            },
          });

          tl.to(box, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: E2 }, 0);
          tl.to(img, { scale: 1, duration: 1.17, ease: E1 }, 0);
        }

        // 2. Mobile Rail vertical fill (scrub 1.2, start top 60%, end bottom 60%) + dot fill
        if (mobileRailContainerRef.current) {
          const blocksEls = mobileBlockRefs.current.filter(Boolean) as HTMLElement[];
          gsap.set(blocksEls, { y: 24, opacity: 0 });

          // Blocks RISE once (y 24 to 0, opacity 0 to 1, 900ms E1, stagger 90ms)
          gsap.to(blocksEls, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: E1,
            stagger: 0.09,
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: mobileRailContainerRef.current,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
          });

          // RAIL(fill) vertical, scrub 1.2
          if (mobileRailFillRef.current) {
            const fill = mobileRailFillRef.current;
            const container = mobileRailContainerRef.current;
            const dots = mobileDotRefs.current.filter(Boolean) as HTMLElement[];

            gsap.set(fill, { scaleY: 0, transformOrigin: "top center" });

            ScrollTrigger.create({
              trigger: container,
              start: "top 60%",
              end: "bottom 60%",
              scrub: 1.2,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = self.progress;
                gsap.set(fill, { scaleY: p });

                const containerRect = container.getBoundingClientRect();
                const containerH = containerRect.height;
                const fillY = containerH * p;

                dots.forEach((dot) => {
                  const dotTop = dot.offsetTop + dot.offsetHeight / 2;
                  if (fillY >= dotTop) {
                    dot.classList.add("bg-[var(--blue)]");
                    dot.classList.remove("bg-white");
                  } else {
                    dot.classList.remove("bg-[var(--blue)]");
                    dot.classList.add("bg-white");
                  }
                });
              },
            });
          }
        }
      });

      // ==========================================
      // REDUCED MOTION: (prefers-reduced-motion: reduce)
      // ==========================================
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (desktopImgRef.current) gsap.set(desktopImgRef.current, { scale: 1 });
        desktopCaptionRefs.current.forEach((cap, i) => {
          if (!cap) return;
          gsap.set(cap, { opacity: i === 0 ? 1 : 0, y: 0 });
        });
        desktopTickRefs.current.forEach((tick, i) => {
          if (!tick) return;
          gsap.set(tick, { scaleY: i === 0 ? 1 : 0.41, opacity: i === 0 ? 1 : 0.6 });
        });
        if (mobilePhotoBoxRef.current) gsap.set(mobilePhotoBoxRef.current, { clipPath: "none" });
        if (mobileImgRef.current) gsap.set(mobileImgRef.current, { scale: 1 });
        if (mobileRailFillRef.current) gsap.set(mobileRailFillRef.current, { scaleY: 1 });
        mobileDotRefs.current.forEach((dot) => {
          if (dot) {
            dot.classList.add("bg-[var(--blue)]");
            dot.classList.remove("bg-white");
          }
        });
        mobileBlockRefs.current.forEach((block) => {
          if (block) gsap.set(block, { y: 0, opacity: 1 });
        });
      });
    }, rootRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <article ref={rootRef} className="w-full bg-white text-left">
      {/* 1. Hero Band (Capitalized Heading) */}
      <HeroBand
        variant="immersive"
        imageSrc={HERO_IMAGE}
        imageAlt={data.h1.toUpperCase()}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* 2. Desktop (1024px and up): Pinned cinematic section of height 340svh */}
      <section
        ref={desktopSecRef}
        className="hidden lg:block relative w-full h-[340svh] bg-white"
      >
        {/* Sticky box centered vertically, holding photo at 100vw with aspect-ratio: 64 / 27 (no crop) */}
        <div
          className="sticky w-full overflow-hidden"
          style={{
            top: "max(0px, calc((100svh - 42.19vw) / 2))",
            aspectRatio: "64 / 27",
          }}
        >
          <img
            ref={desktopImgRef}
            src={WIDE_IMAGE}
            alt="Steel Storage Tank Fabrication"
            width={2560}
            height={1080}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover block origin-center"
          />

          {/* Dark gradient on bottom of photo: linear-gradient(to top, rgba(0,0,0,.65), transparent 55%) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.65) 20%, transparent 55%)",
            }}
          />

          {/* Bottom content: Active caption on bottom-left, 3 white tick bars on right edge */}
          <div className="absolute bottom-8 lg:bottom-12 left-0 right-0 z-10 pointer-events-none">
            <div className="container px-8 lg:px-12 mx-auto text-left flex justify-between items-end">
              {/* Active Block Caption (Heading 44px bold uppercase, text 16px / 1.7 in white, TEXT STYLE sizes, no numbers) */}
              <div className="relative max-w-[680px] w-full min-h-[140px]">
                {blocks.map((b, idx) => (
                  <div
                    key={idx}
                    ref={(el) => {
                      desktopCaptionRefs.current[idx] = el;
                    }}
                    className="absolute bottom-0 left-0 w-full text-left"
                    style={{
                      opacity: idx === 0 ? 1 : 0,
                      transform: idx === 0 ? "translateY(0)" : "translateY(16px)",
                    }}
                  >
                    <h2 className="text-[44px] font-bold text-white uppercase tracking-[-0.02em] leading-tight mb-4">
                      {b.title.toUpperCase()}
                    </h2>
                    <p className="text-[16px] font-normal text-white leading-[1.7]">
                      {b.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Vertical rail of 3 white tick bars at the right edge of the photo */}
              <div
                className="flex flex-col items-center gap-2 pb-2"
                aria-hidden="true"
              >
                {blocks.map((_, idx) => (
                  <div
                    key={idx}
                    ref={(el) => {
                      desktopTickRefs.current[idx] = el;
                    }}
                    className="w-[2px] h-[44px] bg-white origin-center"
                    style={{
                      transform: idx === 0 ? "scaleY(1)" : "scaleY(0.41)",
                      opacity: idx === 0 ? 1 : 0.6,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mobile View: Photo full width at 64:27, then 3 blocks on a 2px blue rail (no borders, no boxes) */}
      <section className="block lg:hidden container py-10 text-left">
        {/* Photo full width at 64:27 with CURTAIN 900ms */}
        <div
          ref={mobilePhotoBoxRef}
          className="w-full aspect-[64/27] overflow-hidden bg-slate-900 mb-10"
        >
          <img
            ref={mobileImgRef}
            src={WIDE_IMAGE}
            alt="Steel Storage Tank Fabrication"
            width={1920}
            height={810}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover block"
          />
        </div>

        {/* 3 Blocks on a rail: 2px blue line at left, 10px dot for each block, padding-left: 28px, 48px between blocks */}
        <div
          ref={mobileRailContainerRef}
          className="relative w-full text-left"
          style={{ paddingLeft: "28px" }}
        >
          {/* Background Rail Track: 2px wide, centered at left: 10px */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-[#E5E5E5] pointer-events-none"
            style={{ left: "10px", transform: "translateX(-50%)" }}
            aria-hidden="true"
          />

          {/* Active Rail Fill Line: 2px blue, scaleY scrubbed with ScrollTrigger */}
          <div
            ref={mobileRailFillRef}
            className="absolute top-0 bottom-0 w-[2px] bg-[var(--blue)] pointer-events-none origin-top"
            style={{ left: "10px", transform: "translateX(-50%) scaleY(0)" }}
            aria-hidden="true"
          />

          {/* 3 Blocks: sitting right of line, 48px between blocks */}
          <div className="space-y-[48px]">
            {blocks.map((b, idx) => (
              <div
                key={b.num}
                ref={(el) => {
                  mobileBlockRefs.current[idx] = el;
                }}
                className="relative flex flex-col items-start"
              >
                {/* Dot on the rail line: 10px circle, centered at left: 10px (which is -18px relative to paddingLeft 28px) */}
                <div
                  ref={(el) => {
                    mobileDotRefs.current[idx] = el;
                  }}
                  className="absolute w-[10px] h-[10px] rounded-full bg-white border-2 border-[var(--blue)] z-10 transition-colors duration-200"
                  style={{
                    left: "-18px",
                    top: "20px",
                    transform: "translate(-50%, -50%)",
                  }}
                  aria-hidden="true"
                />

                {/* Number: 40px, weight 800, solid bold var(--blue) */}
                <div className="text-[40px] font-extrabold text-[var(--blue)] leading-none select-none mb-2">
                  {b.num}
                </div>

                {/* Title: 17px, weight 700, ink colour, uppercase */}
                <h3 className="text-[17px] font-bold text-[#0A0A0A] uppercase leading-snug mb-2">
                  {b.title.toUpperCase()}
                </h3>

                {/* Text: 15px / 1.6, regular weight, var(--blue) */}
                <p className="text-[15px] font-normal text-[#0A0A0A] leading-[1.6]">
                  {b.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions (Capitalized Heading) */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)] border-t border-[var(--rule)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2
              className="font-bold text-[var(--ink)] mb-8 uppercase"
              style={{ fontSize: "var(--fs-h2)" }}
            >
              {"Frequently Asked Questions".toUpperCase()}
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* 5. Next Banner (Capitalized Heading, exact URL) */}
      <NextBand
        image={NEXT_IMAGE}
        nextUrl="/custom-steel-fabrication-pakistan/hoppers-and-bins/"
        nextTitle="Hoppers and Bins"
        heading="CUSTOM-DESIGNED HOPPERS AND BINS IN PAKISTAN"
      />
    </article>
  );
};

// 9.25 Hoppers and Bins — signature: "Bento grid"
export const HoppersBinsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const sec1 = sections[0];
  const sec2 = sections[1];
  const sec3 = sections[2];

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.custom.hoppers.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Desktop 12-column Bento Grid */}
      <section className="container py-[var(--sec-y-lg)]">
        <div className="hidden lg:grid grid-cols-12 gap-4 auto-rows-[minmax(260px,auto)] text-left">
          {/* Tile A: Image h1 (Cols 1-7, Rows 1-2) */}
          <div className="col-span-7 row-span-2 overflow-hidden bg-slate-900 shadow-md">
            <img src={IMG.custom.hoppers.h1} alt="Hopper Cone Structure" className="w-full h-full object-cover" />
          </div>

          {/* Tile B: Text What Hoppers and Bins Do (Cols 8-12, Row 1, Nav Blue bg) */}
          <div className="col-span-5 bg-[var(--blue)] text-white p-8 flex flex-col justify-center space-y-3 shadow-md">
            <h3 className="text-[17px] sm:text-[19px] lg:text-[24px] font-bold text-white uppercase">{sec1?.title || "What Hoppers and Bins Do"}</h3>
            <p className="text-white/90 text-[15px] leading-[1.65]">{sec1?.text}</p>
          </div>

          {/* Tile C: Image h2 (Cols 8-12, Row 2) */}
          <div className="col-span-5 overflow-hidden bg-slate-900 shadow-md">
            <img src={IMG.custom.hoppers.h2} alt="Bin on Steel Frame" className="w-full h-full object-cover" />
          </div>

          {/* Tile D: Text Design Points (Cols 1-5, Row 3) */}
          <div className="col-span-5 border border-[var(--rule)] bg-white p-8 flex flex-col justify-center space-y-3 shadow-sm">
            <h3 className="text-[14px] sm:text-[16px] lg:text-[22px] font-bold text-[#0A0A0A] uppercase">{sec2?.title || "Design Points"}</h3>
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>{sec2?.text}</p>
          </div>

          {/* Tile E: Image h3 (Cols 6-8, Row 3) */}
          <div className="col-span-3 overflow-hidden bg-slate-900 shadow-md">
            <img src={IMG.custom.hoppers.h3} alt="Hopper Ladder Platform" className="w-full h-full object-cover" />
          </div>

          {/* Tile F: Text Typical Uses (Cols 9-12, Row 3, Nav Blue 4% bg) */}
          <div className="col-span-4 border border-[var(--rule)] bg-[rgba(30,58,138,0.04)] p-8 flex flex-col justify-center space-y-3 shadow-sm">
            <h3 className="text-[14px] sm:text-[16px] lg:text-[22px] font-bold text-[#0A0A0A] uppercase">{sec3?.title || "Typical Uses"}</h3>
            <p className="text-[var(--grey-strong)] leading-[1.65]" style={{ fontSize: "var(--fs-body)" }}>{sec3?.text}</p>
          </div>
        </div>

        {/* Mobile: 1 Column in sequence A -> F */}
        <div className="lg:hidden space-y-6 text-left">
          <PhotoBox src={IMG.custom.hoppers.h1} alt="Hopper Cone" ratio="16/9" />
          <div className="bg-[var(--blue)] text-white p-6">
            <h3 className="text-[17px] sm:text-[19px] font-bold text-white uppercase mb-2">{sec1?.title}</h3>
            <p className="text-white/90 text-[14px] leading-[1.6]">{sec1?.text}</p>
          </div>
          <PhotoBox src={IMG.custom.hoppers.h2} alt="Bin Frame" ratio="16/9" />
          <div className="border border-[var(--rule)] p-6 bg-white">
            <h3 className="text-[14px] sm:text-[16px] font-bold text-[#0A0A0A] uppercase mb-2">{sec2?.title}</h3>
            <p className="text-[var(--grey-strong)] text-[14px] leading-[1.6]">{sec2?.text}</p>
          </div>
          <PhotoBox src={IMG.custom.hoppers.h3} alt="Platform" ratio="16/9" />
          <div className="border border-[var(--rule)] p-6 bg-[rgba(30,58,138,0.04)]">
            <h3 className="text-[14px] sm:text-[16px] font-bold text-[#0A0A0A] uppercase mb-2">{sec3?.title}</h3>
            <p className="text-[var(--grey-strong)] text-[14px] leading-[1.6]">{sec3?.text}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[17px] sm:text-[19px] lg:text-[32px] font-bold text-[#0A0A0A] mb-8 uppercase leading-tight lg:leading-[1.15] tracking-[-0.02em]">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* Next Banner */}
      <NextBand
        image={IMG.custom.hoppers.next}
        nextUrl="/custom-steel-fabrication-pakistan/steel-doors-and-gates/"
        nextTitle="Steel Doors and Gates"
      />
    </article>
  );
};

// 9.26 Doors and Gates — signature: "Door-open grid + dual notes"
export const DoorsGatesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const rootRef = useRef<HTMLElement>(null);

  const desktopItemBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopItemImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const desktopItemTextRefs = useRef<(HTMLDivElement | null)[]>([]);

  const mobileItemBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileItemImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const mobileItemTextRefs = useRef<(HTMLDivElement | null)[]>([]);

  const notesLineRef = useRef<HTMLDivElement>(null);
  const notesTextRef = useRef<HTMLDivElement>(null);

  const { sections } = extractSections(data);
  const typesSec = sections.find((s) => s.items && s.items.length >= 4) || sections[0];
  const items = typesSec?.items || [
    { name: "Sliding gates", text: "Run on a rail and save swing space, which suits factory entrances." },
    { name: "Hinged gates", text: "Swing on pillars and suit farms and small sites." },
    { name: "Rolling doors", text: "Roll up above the opening and suit warehouses and docks." },
    { name: "Personnel doors", text: "Smaller doors for people, fitted into large doors or walls." },
  ];
  const images = [IMG.custom.doors.d1, IMG.custom.doors.d2, IMG.custom.doors.d3, IMG.custom.doors.d4];

  const note1 = sections[1] || sections[0];
  const note2 = sections[2] || sections[1];

  // Preload and decode images and debounced refresh
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const debouncedRefresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(debouncedRefresh);
    }

    [IMG.custom.doors.hero, ...images, IMG.custom.doors.next].forEach((src) => {
      const img = new Image();
      img.src = src;
      if (img.decode) {
        img.decode().then(debouncedRefresh).catch(() => {});
      } else {
        img.onload = debouncedRefresh;
      }
    });

    return () => clearTimeout(timer);
  }, [images]);

  // GSAP Animations with Setup Rules and Motion Recipes
  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const E1 = "cubic-bezier(0.16, 1, 0.3, 1)";
    const E2 = "cubic-bezier(0.76, 0, 0.24, 1)";

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ==========================================
      // DESKTOP: (min-width: 1024px)
      // ==========================================
      mm.add("(min-width: 1024px)", () => {
        // 1. Door-open reveal on 4 items (1200ms E2), then numbers/titles/text RISE (300ms delay)
        desktopItemBoxRefs.current.forEach((box, idx) => {
          if (!box) return;
          const img = desktopItemImgRefs.current[idx];
          const textGroup = desktopItemTextRefs.current[idx];

          // Hidden start states before paint
          gsap.set(box, { clipPath: "inset(0 50% 0 50%)" });
          if (img) gsap.set(img, { scale: 1.06 });
          if (textGroup) gsap.set(textGroup, { y: 24, opacity: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: box,
              start: "top 85%",
              once: true,
              invalidateOnRefresh: true,
            },
            onStart: () => {
              gsap.set(box, { willChange: "clip-path" });
              if (img) gsap.set(img, { willChange: "transform" });
              if (textGroup) gsap.set(textGroup, { willChange: "transform, opacity" });
            },
            onComplete: () => {
              gsap.set(box, { clearProps: "willChange" });
              if (img) gsap.set(img, { clearProps: "willChange,scale" });
              if (textGroup) gsap.set(textGroup, { clearProps: "willChange" });
            },
          });

          // Door-open curtain 1200ms E2
          tl.to(box, { clipPath: "inset(0 0% 0 0%)", duration: 1.2, ease: E2 }, 0);
          if (img) {
            tl.to(img, { scale: 1, duration: 1.56, ease: E1 }, 0);
          }

          // Numbers, titles, text: RISE after the door finishes (300ms delay -> 1.5s)
          if (textGroup) {
            tl.to(
              textGroup.children,
              { y: 0, opacity: 1, duration: 0.9, ease: E1, stagger: 0.09 },
              1.5
            );
          }
        });

        // 2. The two notes: DRAW the top line (1000ms E2), then RISE title and text
        if (notesLineRef.current && notesTextRef.current) {
          const line = notesLineRef.current;
          const noteEls = notesTextRef.current.querySelectorAll(".note-col");

          gsap.set(line, { scaleX: 0, transformOrigin: "left" });
          gsap.set(noteEls, { y: 24, opacity: 0 });

          const notesTl = gsap.timeline({
            scrollTrigger: {
              trigger: line,
              start: "top 85%",
              once: true,
              invalidateOnRefresh: true,
            },
            onStart: () => {
              gsap.set(line, { willChange: "transform" });
              noteEls.forEach((el) => gsap.set(el, { willChange: "transform, opacity" }));
            },
            onComplete: () => {
              gsap.set(line, { clearProps: "willChange" });
              noteEls.forEach((el) => gsap.set(el, { clearProps: "willChange" }));
            },
          });

          notesTl.to(line, { scaleX: 1, duration: 1.0, ease: E2 }, 0);
          notesTl.to(noteEls, { y: 0, opacity: 1, duration: 0.9, ease: E1, stagger: 0.09 }, 0.5);
        }
      });

      // ==========================================
      // MOBILE: (max-width: 1023px)
      // ==========================================
      mm.add("(max-width: 1023px)", () => {
        // 1. Door-open reveal on mobile items (900ms E2), then numbers/titles/text RISE (300ms delay -> 1.2s)
        mobileItemBoxRefs.current.forEach((box, idx) => {
          if (!box) return;
          const img = mobileItemImgRefs.current[idx];
          const textGroup = mobileItemTextRefs.current[idx];

          gsap.set(box, { clipPath: "inset(0 50% 0 50%)" });
          if (img) gsap.set(img, { scale: 1.06 });
          if (textGroup) gsap.set(textGroup, { y: 24, opacity: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: box,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
            onStart: () => {
              gsap.set(box, { willChange: "clip-path" });
              if (img) gsap.set(img, { willChange: "transform" });
              if (textGroup) gsap.set(textGroup, { willChange: "transform, opacity" });
            },
            onComplete: () => {
              gsap.set(box, { clearProps: "willChange" });
              if (img) gsap.set(img, { clearProps: "willChange,scale" });
              if (textGroup) gsap.set(textGroup, { clearProps: "willChange" });
            },
          });

          // Door-open curtain 900ms E2
          tl.to(box, { clipPath: "inset(0 0% 0 0%)", duration: 0.9, ease: E2 }, 0);
          if (img) {
            tl.to(img, { scale: 1, duration: 1.17, ease: E1 }, 0);
          }

          // Numbers, titles, text: RISE after the door finishes (300ms delay -> 1.2s)
          if (textGroup) {
            tl.to(
              textGroup.children,
              { y: 0, opacity: 1, duration: 0.9, ease: E1, stagger: 0.09 },
              1.2
            );
          }
        });

        // 2. The two notes: DRAW the top line, then RISE title and text
        if (notesLineRef.current && notesTextRef.current) {
          const line = notesLineRef.current;
          const noteEls = notesTextRef.current.querySelectorAll(".note-col");

          gsap.set(line, { scaleX: 0, transformOrigin: "left" });
          gsap.set(noteEls, { y: 24, opacity: 0 });

          const notesTl = gsap.timeline({
            scrollTrigger: {
              trigger: line,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
            onStart: () => {
              gsap.set(line, { willChange: "transform" });
              noteEls.forEach((el) => gsap.set(el, { willChange: "transform, opacity" }));
            },
            onComplete: () => {
              gsap.set(line, { clearProps: "willChange" });
              noteEls.forEach((el) => gsap.set(el, { clearProps: "willChange" }));
            },
          });

          notesTl.to(line, { scaleX: 1, duration: 1.0, ease: E2 }, 0);
          notesTl.to(noteEls, { y: 0, opacity: 1, duration: 0.9, ease: E1, stagger: 0.09 }, 0.5);
        }
      });

      // ==========================================
      // REDUCED MOTION: (prefers-reduced-motion: reduce)
      // ==========================================
      mm.add("(prefers-reduced-motion: reduce)", () => {
        desktopItemBoxRefs.current.forEach((box) => {
          if (box) gsap.set(box, { clipPath: "none" });
        });
        desktopItemImgRefs.current.forEach((img) => {
          if (img) gsap.set(img, { scale: 1 });
        });
        desktopItemTextRefs.current.forEach((textGroup) => {
          if (textGroup) {
            gsap.set(textGroup, { y: 0, opacity: 1 });
            gsap.set(textGroup.children, { y: 0, opacity: 1 });
          }
        });

        mobileItemBoxRefs.current.forEach((box) => {
          if (box) gsap.set(box, { clipPath: "none" });
        });
        mobileItemImgRefs.current.forEach((img) => {
          if (img) gsap.set(img, { scale: 1 });
        });
        mobileItemTextRefs.current.forEach((textGroup) => {
          if (textGroup) {
            gsap.set(textGroup, { y: 0, opacity: 1 });
            gsap.set(textGroup.children, { y: 0, opacity: 1 });
          }
        });

        if (notesLineRef.current) gsap.set(notesLineRef.current, { scaleX: 1 });
        if (notesTextRef.current) {
          const noteEls = notesTextRef.current.querySelectorAll(".note-col");
          gsap.set(noteEls, { y: 0, opacity: 1 });
        }
      });
    }, rootRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <article ref={rootRef} className="w-full bg-white text-left pb-[96px]">
      {/* 1. Hero Band (Capitalized Heading) */}
      <HeroBand
        variant="immersive"
        imageSrc={IMG.custom.doors.hero}
        imageAlt={data.h1.toUpperCase()}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* 2. Types Section: 2x2 Grid with Door-Open Visual Effect */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-8 lg:mb-12">
          {(typesSec?.title || "Types").toUpperCase()}
        </h2>

        {/* Desktop View: 2x2 Grid */}
        <div className="hidden lg:grid grid-cols-2 gap-12 lg:gap-16">
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col items-start text-left border-t border-[var(--rule)] pt-8">
              {/* Photo box: real photo shape 1024/687 with door-open CURTAIN */}
              <div
                ref={(el) => {
                  desktopItemBoxRefs.current[idx] = el;
                }}
                className="w-full overflow-hidden bg-slate-900 mb-6 shadow-md"
                style={{ aspectRatio: "1024 / 687" }}
              >
                <img
                  ref={(el) => {
                    desktopItemImgRefs.current[idx] = el;
                  }}
                  src={images[idx] || images[0]}
                  alt={item.name}
                  width={1024}
                  height={687}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover block"
                />
              </div>

              {/* Text Group: Number, Title, Text (RISE after door finishes) */}
              <div
                ref={(el) => {
                  desktopItemTextRefs.current[idx] = el;
                }}
                className="flex flex-col items-start w-full"
              >
                {/* Number: solid, bold, var(--blue), placed above title. Desktop: 64px, weight 800 */}
                <div className="text-[64px] font-extrabold text-[var(--blue)] leading-none select-none mb-3">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                {/* Title: 20px, bold, uppercase */}
                <h3 className="text-[20px] font-bold text-[#0A0A0A] uppercase leading-snug mb-3">
                  {item.name.toUpperCase()}
                </h3>

                {/* Text: 16px / 1.7, regular weight, var(--blue) */}
                <p className="text-[16px] font-normal text-[#0A0A0A] leading-[1.7]">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View: 56px between items, 16px photo-to-num, 8px num-to-title, 8px title-to-text */}
        <div className="block lg:hidden space-y-[56px]">
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col items-start text-left w-full">
              {/* Photo box: real photo shape 1024/687 with door-open CURTAIN */}
              <div
                ref={(el) => {
                  mobileItemBoxRefs.current[idx] = el;
                }}
                className="w-full overflow-hidden bg-slate-900 shadow-md"
                style={{ aspectRatio: "1024 / 687" }}
              >
                <img
                  ref={(el) => {
                    mobileItemImgRefs.current[idx] = el;
                  }}
                  src={images[idx] || images[0]}
                  alt={item.name}
                  width={1024}
                  height={687}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover block"
                />
              </div>

              {/* Text Group: 16px between photo and number, 8px between number and title, 8px between title and text */}
              <div
                ref={(el) => {
                  mobileItemTextRefs.current[idx] = el;
                }}
                className="flex flex-col items-start w-full mt-[16px]"
              >
                {/* Number: 40px, weight 800, solid bold var(--blue), 8px to title */}
                <div className="text-[40px] font-extrabold text-[var(--blue)] leading-none select-none mb-[8px]">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                {/* Title: 17px, bold, uppercase, 8px to text */}
                <h3 className="text-[17px] font-bold text-[#0A0A0A] uppercase leading-snug mb-[8px]">
                  {item.name.toUpperCase()}
                </h3>

                {/* Text: 15px / 1.6, regular weight, var(--blue) */}
                <p className="text-[15px] font-normal text-[#0A0A0A] leading-[1.6]">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Notes: 2 Columns with 1px Line on Top (No Grey Background) */}
      <section className="w-full bg-white py-12 lg:py-20 text-left">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Top 1px line with DRAW animation */}
          <div
            ref={notesLineRef}
            className="w-full h-[1px] bg-[#E5E5E5] origin-left mb-10 lg:mb-12"
          />

          <div
            ref={notesTextRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 text-left"
          >
            <div className="note-col flex flex-col items-start">
              <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-snug mb-3">
                {(note1?.title || "Design Points").toUpperCase()}
              </h3>
              <p className="text-[15px] lg:text-[16px] font-normal text-[#0A0A0A] leading-[1.6] lg:leading-[1.7]">
                {note1?.text}
              </p>
            </div>
            <div className="note-col flex flex-col items-start">
              <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-snug mb-3">
                {(note2?.title || "Fitted to Your Building").toUpperCase()}
              </h3>
              <p className="text-[15px] lg:text-[16px] font-normal text-[#0A0A0A] leading-[1.6] lg:leading-[1.7]">
                {note2?.text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions (Capitalized Heading) */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)] border-t border-[var(--rule)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2
              className="font-bold text-[var(--ink)] mb-8 uppercase"
              style={{ fontSize: "var(--fs-h2)" }}
            >
              {"Frequently Asked Questions".toUpperCase()}
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* 5. Next Banner (Capitalized Heading) */}
      <NextBand
        image={IMG.custom.doors.next}
        nextUrl="/custom-steel-fabrication-pakistan/steel-stairs/"
        nextTitle="Steel Stairs"
        heading="CUSTOM-DESIGNED STEEL STAIRS IN PAKISTAN"
      />
    </article>
  );
};

// 9.27 Steel Stairs — signature: "Ascending steps"
export const SteelStairsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const rootRef = useRef<HTMLElement>(null);
  const desktopSecRef = useRef<HTMLElement>(null);
  const desktopItemBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopItemImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const desktopItemTickRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopItemTextRefs = useRef<(HTMLDivElement | null)[]>([]);

  const mobileItemCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileItemBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileItemImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const mobileItemOverlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileItemTextRefs = useRef<(HTMLDivElement | null)[]>([]);

  const notesSecRef = useRef<HTMLElement>(null);
  const notesLineRef = useRef<HTMLDivElement>(null);
  const notesTextRef = useRef<HTMLDivElement>(null);

  const { sections } = extractSections(data);
  const typesSec = sections.find((s) => s.items && s.items.length >= 5) || sections[0];
  const items = typesSec?.items || [
    { name: "Straight stairs", text: "A single flight, simple and low in cost." },
    { name: "Switchback stairs", text: "Have two flights and a landing and save floor area." },
    { name: "Spiral stairs", text: "Compact and suit tight spaces." },
    { name: "Ladders and cages", text: "Serve roofs, tanks and occasional access." },
    { name: "Platforms and walkways", text: "Steel decks with handrails around machines and tanks." },
  ];
  const images = [IMG.custom.stairs.s1, IMG.custom.stairs.s2, IMG.custom.stairs.s3, IMG.custom.stairs.s4, IMG.custom.stairs.s5];

  const note1 = sections[1];
  const note2 = sections[2];

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop: 1024px+
      mm.add("(min-width: 1024px)", () => {
        // Pre-set start states before first paint
        desktopItemBoxRefs.current.forEach((box) => {
          if (box) gsap.set(box, { clipPath: "inset(100% 0 0 0)" });
        });
        desktopItemImgRefs.current.forEach((img) => {
          if (img) gsap.set(img, { scale: 1.06 });
        });
        desktopItemTickRefs.current.forEach((tick) => {
          if (tick) gsap.set(tick, { scaleY: 0, transformOrigin: "top" });
        });
        desktopItemTextRefs.current.forEach((txt) => {
          if (txt) gsap.set(txt, { y: 24, opacity: 0 });
        });

        if (desktopSecRef.current) {
          const masterTl = gsap.timeline({
            scrollTrigger: {
              trigger: desktopSecRef.current,
              start: "top 85%",
              once: true,
              invalidateOnRefresh: true,
            },
          });

          items.forEach((_, idx) => {
            const box = desktopItemBoxRefs.current[idx];
            const img = desktopItemImgRefs.current[idx];
            const tick = desktopItemTickRefs.current[idx];
            const txt = desktopItemTextRefs.current[idx];

            if (!box || !img || !tick || !txt) return;

            // Stagger 150ms in staircase order (left to right)
            const startTime = idx * 0.15;

            // CURTAIN 1200ms from the bottom
            masterTl.to(
              box,
              {
                clipPath: "inset(0% 0 0 0)",
                duration: 1.2,
                ease: "E2",
                clearProps: "clipPath",
                onStart: () => gsap.set(box, { willChange: "clip-path" }),
                onComplete: () => gsap.set(box, { clearProps: "willChange" }),
              },
              startTime
            );

            masterTl.to(
              img,
              {
                scale: 1,
                duration: 1.2 * 1.3,
                ease: "E1",
                clearProps: "scale",
                onStart: () => gsap.set(img, { willChange: "transform" }),
                onComplete: () => gsap.set(img, { clearProps: "willChange" }),
              },
              startTime
            );

            // 28px tick DRAWs (scaleY 0 to 1, 600ms E2) 300ms after
            const tickStartTime = startTime + 1.2 + 0.3;
            masterTl.to(
              tick,
              {
                scaleY: 1,
                duration: 0.6,
                ease: "E2",
                clearProps: "transform",
                onStart: () => gsap.set(tick, { willChange: "transform" }),
                onComplete: () => gsap.set(tick, { clearProps: "willChange" }),
              },
              tickStartTime
            );

            // Title and text RISE 200ms after the tick
            const textStartTime = tickStartTime + 0.6 + 0.2;
            masterTl.to(
              txt,
              {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "E1",
                clearProps: "transform,opacity",
                onStart: () => gsap.set(txt, { willChange: "transform, opacity" }),
                onComplete: () => gsap.set(txt, { clearProps: "willChange" }),
              },
              textStartTime
            );
          });
        }
      });

      // Mobile: max-width 1023px
      mm.add("(max-width: 1023px)", () => {
        mobileItemBoxRefs.current.forEach((box) => {
          if (box) gsap.set(box, { clipPath: "inset(100% 0 0 0)" });
        });
        mobileItemImgRefs.current.forEach((img) => {
          if (img) gsap.set(img, { scale: 1.06 });
        });
        mobileItemOverlayRefs.current.forEach((ov) => {
          if (ov) gsap.set(ov, { opacity: 0 });
        });
        mobileItemTextRefs.current.forEach((txt) => {
          if (txt) gsap.set(txt, { y: 24, opacity: 0 });
        });

        items.forEach((_, idx) => {
          const card = mobileItemCardRefs.current[idx];
          const box = mobileItemBoxRefs.current[idx];
          const img = mobileItemImgRefs.current[idx];
          const overlay = mobileItemOverlayRefs.current[idx];
          const text = mobileItemTextRefs.current[idx];

          if (!card || !box || !img || !overlay || !text) return;

          const cardTl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
              invalidateOnRefresh: true,
            },
          });

          // CURTAIN 900ms
          cardTl.to(
            box,
            {
              clipPath: "inset(0% 0 0 0)",
              duration: 0.9,
              ease: "E2",
              clearProps: "clipPath",
              onStart: () => gsap.set(box, { willChange: "clip-path" }),
              onComplete: () => gsap.set(box, { clearProps: "willChange" }),
            },
            0
          );

          cardTl.to(
            img,
            {
              scale: 1,
              duration: 0.9 * 1.3,
              ease: "E1",
              clearProps: "scale",
              onStart: () => gsap.set(img, { willChange: "transform" }),
              onComplete: () => gsap.set(img, { clearProps: "willChange" }),
            },
            0
          );

          // The gradient and title fade in 500ms 400ms later
          cardTl.to(
            overlay,
            {
              opacity: 1,
              duration: 0.5,
              ease: "E1",
              clearProps: "opacity",
              onStart: () => gsap.set(overlay, { willChange: "opacity" }),
              onComplete: () => gsap.set(overlay, { clearProps: "willChange" }),
            },
            0.4
          );

          // Text RISEs
          cardTl.to(
            text,
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "E1",
              clearProps: "transform,opacity",
              onStart: () => gsap.set(text, { willChange: "transform, opacity" }),
              onComplete: () => gsap.set(text, { clearProps: "willChange" }),
            },
            0.9
          );
        });
      });

      // Notes (both desktop and mobile): DRAW the top line, then RISE
      if (notesSecRef.current && notesLineRef.current && notesTextRef.current) {
        const line = notesLineRef.current;
        const noteCols = notesTextRef.current.querySelectorAll(".note-col");

        gsap.set(line, { scaleX: 0, transformOrigin: "left" });
        gsap.set(noteCols, { y: 24, opacity: 0 });

        const notesTl = gsap.timeline({
          scrollTrigger: {
            trigger: notesSecRef.current,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
          },
        });

        // DRAW the top line
        notesTl.to(line, {
          scaleX: 1,
          duration: 1.0,
          ease: "E2",
          clearProps: "transform",
          onStart: () => gsap.set(line, { willChange: "transform" }),
          onComplete: () => gsap.set(line, { clearProps: "willChange" }),
        });

        // then RISE
        notesTl.to(
          noteCols,
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "E1",
            stagger: 0.09,
            clearProps: "transform,opacity",
            onStart: () => {
              noteCols.forEach((col) => gsap.set(col, { willChange: "transform, opacity" }));
            },
            onComplete: () => {
              noteCols.forEach((col) => gsap.set(col, { clearProps: "willChange" }));
            },
          },
          "+=0.1"
        );
      }

      // Reduced motion: show final states immediately
      mm.add("(prefers-reduced-motion: reduce)", () => {
        desktopItemBoxRefs.current.forEach((b) => b && gsap.set(b, { clipPath: "inset(0% 0 0 0)" }));
        desktopItemImgRefs.current.forEach((i) => i && gsap.set(i, { scale: 1 }));
        desktopItemTickRefs.current.forEach((t) => t && gsap.set(t, { scaleY: 1 }));
        desktopItemTextRefs.current.forEach((tx) => tx && gsap.set(tx, { y: 0, opacity: 1 }));

        mobileItemBoxRefs.current.forEach((b) => b && gsap.set(b, { clipPath: "inset(0% 0 0 0)" }));
        mobileItemImgRefs.current.forEach((i) => i && gsap.set(i, { scale: 1 }));
        mobileItemOverlayRefs.current.forEach((o) => o && gsap.set(o, { opacity: 1 }));
        mobileItemTextRefs.current.forEach((tx) => tx && gsap.set(tx, { y: 0, opacity: 1 }));

        if (notesLineRef.current) gsap.set(notesLineRef.current, { scaleX: 1 });
        if (notesTextRef.current) {
          const noteCols = notesTextRef.current.querySelectorAll(".note-col");
          gsap.set(noteCols, { y: 0, opacity: 1 });
        }
      });
    }, rootRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [items]);

  return (
    <article ref={rootRef} className="w-full bg-white text-left pb-[96px]">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.custom.stairs.hero}
        imageAlt={data.h1.toUpperCase()}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* Ascending Steps Section (Desktop: Rising Staircase Alignment) */}
      <section ref={desktopSecRef} className="container py-[var(--sec-y-lg)] text-left">
        <h2 className="text-[17px] sm:text-[19px] lg:text-[44px] font-bold text-[#0A0A0A] uppercase tracking-[-0.02em] leading-tight mb-8 lg:mb-12">
          TYPES OF STEEL STAIRS
        </h2>

        {/* Desktop 1280px+ Staircase Rise */}
        <div className="hidden xl:flex items-end gap-6 pt-32 pb-8">
          {items.map((it, idx) => (
            <div
              key={idx}
              className="flex-1 flex flex-col items-start border-t border-[var(--rule)] pt-6 text-left"
              style={{ transform: `translateY(-${idx * 48}px)` }}
            >
              {/* Photo Box: real photo aspect ratio 1024 / 687 */}
              <div
                ref={(el) => {
                  desktopItemBoxRefs.current[idx] = el;
                }}
                className="w-full overflow-hidden bg-slate-900 shadow-md mb-6"
                style={{ aspectRatio: "1024 / 687" }}
              >
                <img
                  ref={(el) => {
                    desktopItemImgRefs.current[idx] = el;
                  }}
                  src={images[idx] || images[0]}
                  alt={it.name}
                  width={1024}
                  height={687}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover block"
                />
              </div>

              {/* 1px x 28px blue tick that draws down on reveal */}
              <div
                ref={(el) => {
                  desktopItemTickRefs.current[idx] = el;
                }}
                className="w-[1px] h-[28px] bg-[var(--blue)] origin-top mb-4"
              />

              {/* Title and text sit under the photo, left aligned with the photo edge */}
              <div
                ref={(el) => {
                  desktopItemTextRefs.current[idx] = el;
                }}
                className="flex flex-col items-start text-left w-full"
              >
                <h3 className="text-[20px] font-bold text-[#0A0A0A] uppercase leading-snug mb-3">
                  {it.name.toUpperCase()}
                </h3>
                <p className="text-[16px] font-normal text-[#0A0A0A] leading-[1.7]">
                  {it.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet / Medium Screens: 3+2 Grid */}
        <div className="hidden md:grid xl:hidden grid-cols-3 gap-8">
          {items.map((it, idx) => (
            <div key={idx} className="flex flex-col items-start text-left border-t border-[var(--rule)] pt-6">
              <div
                className="w-full overflow-hidden bg-slate-900 shadow-md mb-6"
                style={{ aspectRatio: "1024 / 687" }}
              >
                <img
                  src={images[idx] || images[0]}
                  alt={it.name}
                  width={1024}
                  height={687}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover block"
                />
              </div>

              {/* 1px x 28px blue tick */}
              <div className="w-[1px] h-[28px] bg-[var(--blue)] mb-4" />

              <h3 className="text-[20px] font-bold text-[#0A0A0A] uppercase leading-snug mb-3">
                {it.name.toUpperCase()}
              </h3>
              <p className="text-[16px] font-normal text-[#0A0A0A] leading-[1.7]">
                {it.text}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile: Clean Stacked, Centered in Middle with Identical Dimensions */}
        <div className="md:hidden space-y-8 w-full max-w-[480px] mx-auto">
          {items.map((it, idx) => (
            <div
              key={idx}
              ref={(el) => {
                mobileItemCardRefs.current[idx] = el;
              }}
              className="w-full flex flex-col items-start text-left border-t border-[var(--rule)] pt-6"
            >
              {/* Photo Box with title over the bottom-left on bottom gradient */}
              <div
                ref={(el) => {
                  mobileItemBoxRefs.current[idx] = el;
                }}
                className="relative w-full overflow-hidden bg-slate-900 shadow-sm"
                style={{ aspectRatio: "1024 / 687" }}
              >
                <img
                  ref={(el) => {
                    mobileItemImgRefs.current[idx] = el;
                  }}
                  src={images[idx] || images[0]}
                  alt={it.name}
                  width={1024}
                  height={687}
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-cover block"
                />

                {/* Bottom gradient overlay with title */}
                <div
                  ref={(el) => {
                    mobileItemOverlayRefs.current[idx] = el;
                  }}
                  className="absolute inset-x-0 bottom-0 pt-12 pb-3.5 px-3.5 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex items-end justify-start text-left"
                >
                  <h3 className="text-[17px] font-bold text-white uppercase leading-snug">
                    {it.name.toUpperCase()}
                  </h3>
                </div>
              </div>

              {/* Text under photo */}
              <div
                ref={(el) => {
                  mobileItemTextRefs.current[idx] = el;
                }}
                className="w-full mt-3 text-left"
              >
                <p className="text-[15px] font-normal text-[#0A0A0A] leading-[1.6]">
                  {it.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notes: 2 Columns with 1px Line on Top (No Grey Background) */}
      {(note1 || note2) && (
        <section ref={notesSecRef} className="w-full bg-white pb-[var(--sec-y-lg)] text-left">
          <div className="container mx-auto">
            {/* Top 1px line with DRAW animation */}
            <div
              ref={notesLineRef}
              className="w-full h-[1px] bg-[#E5E5E5] origin-left mb-10 lg:mb-12"
            />

            <div
              ref={notesTextRef}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 text-left"
            >
              {note1 && (
                <div className="note-col flex flex-col items-start">
                  <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-snug mb-3">
                    {(note1.title || "Design Points").toUpperCase()}
                  </h3>
                  <p className="text-[15px] lg:text-[16px] font-normal text-[#0A0A0A] leading-[1.6] lg:leading-[1.7]">
                    {note1.text}
                  </p>
                </div>
              )}
              {note2 && (
                <div className="note-col flex flex-col items-start">
                  <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] uppercase leading-snug mb-3">
                    {(note2.title || "Safety").toUpperCase()}
                  </h3>
                  <p className="text-[15px] lg:text-[16px] font-normal text-[#0A0A0A] leading-[1.6] lg:leading-[1.7]">
                    {note2.text}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Frequently Asked Questions */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)] border-t border-[var(--rule)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2
              className="text-[22px] lg:text-[40px] font-bold text-[#0A0A0A] uppercase leading-[1.15] tracking-[-0.02em] mb-8 lg:mb-10"
            >
              {"Frequently Asked Questions".toUpperCase()}
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* Next Banner */}
      <NextBand
        image={IMG.custom.stairs.next}
        nextUrl="/services/design/"
        nextTitle="Design Services"
        heading="STEEL STRUCTURE DESIGN SERVICES IN PAKISTAN"
      />
    </article>
  );
};
