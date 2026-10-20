// Steel Warehouses Division Signature Layouts (9.13 - 9.17)
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ContentData, ContentBlock } from "../../../content/types.ts";
import { IMG } from "../../../data/subpageImages.ts";
import { PhotoBox } from "../../page/PhotoBox.tsx";
import { OutlineNum } from "../../page/OutlineNum.tsx";
import { HeroBand } from "../../ui/HeroBand.tsx";
import { Accordion } from "../../ui/Accordion.tsx";
import { NextBand } from "../../ui/NextBand.tsx";
import { ChevronRight, ArrowDown } from "lucide-react";
import { gsap, ScrollTrigger } from "../../../lib/gsap.ts";
import { cl } from "../../../lib/cloudinary.ts";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

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

// 9.13 Storage Warehouses — signature: "Floating image collage"
export const StorageWarehousesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const blocks = sections.slice(0, 3);

  const mainRef = React.useRef<HTMLElement>(null);
  const sectionRef = React.useRef<HTMLElement>(null);
  const [openFaqIdx, setOpenFaqIdx] = React.useState<number | null>(null);

  // Real photo shapes (initial natural aspect ratio 1024 / 687 = 1.4905)
  const [s1Ratio, setS1Ratio] = React.useState<number>(1024 / 687);
  const [s2Ratio, setS2Ratio] = React.useState<number>(1024 / 687);

  // Debounced ScrollTrigger refresh after font load and image decode
  React.useEffect(() => {
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

    const urls = [
      IMG.warehouses.storage.hero,
      IMG.warehouses.storage.s1,
      IMG.warehouses.storage.s2,
      IMG.warehouses.storage.next,
    ];

    urls.forEach((u) => {
      const im = new Image();
      im.src = cl(u, 1920);
      if (im.decode) {
        im.decode().then(debouncedRefresh).catch(() => {});
      } else {
        im.onload = debouncedRefresh;
      }
    });

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Motion Kit animations: Desktop and Mobile written separately
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // 1. Reduced motion: immediate final state, no movement
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".sw-line", { scaleX: 1, clearProps: "all" });
        gsap.set(".sw-text-item", { opacity: 1, y: 0, clearProps: "all" });
        gsap.set(".sw-photo-box", { clipPath: "inset(0 0 0% 0)", clearProps: "clipPath" });
        gsap.set(".sw-photo-img", { scale: 1, clearProps: "scale" });
        gsap.set(".sw-wrapper", { y: 0, clearProps: "y" });
      });

      // 2. Desktop: 1024px and up
      mm.add("(min-width: 1024px)", () => {
        // Set hidden initial states before first paint
        gsap.set(".sw-desktop .sw-line", { scaleX: 0, transformOrigin: "left center" });
        gsap.set(".sw-desktop .sw-text-item", { opacity: 0, y: 24 });
        gsap.set(".sw-desktop .sw-photo-box", { clipPath: "inset(0 100% 0 0)" });
        gsap.set(".sw-desktop .sw-photo-img", { scale: 1.06, transformOrigin: "center center" });

        // Lines DRAW on reveal (1000ms E2); text RISE 300ms after (900ms E1, stagger 90ms)
        const desktopBlocks = gsap.utils.toArray<HTMLElement>(".sw-desktop .sw-block");
        desktopBlocks.forEach((block) => {
          const line = block.querySelector(".sw-line");
          const texts = block.querySelectorAll(".sw-text-item");

          ScrollTrigger.create({
            trigger: block,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              if (line) {
                gsap.to(line, {
                  scaleX: 1,
                  duration: 1.0,
                  ease: "E2",
                  overwrite: "auto",
                  onStart: () => gsap.set(line, { willChange: "transform" }),
                  onComplete: () => gsap.set(line, { clearProps: "willChange" }),
                });
              }
              if (texts.length) {
                gsap.to(texts, {
                  opacity: 1,
                  y: 0,
                  duration: 0.9,
                  delay: 0.3,
                  stagger: 0.09,
                  ease: "E1",
                  overwrite: "auto",
                  onStart: () => gsap.set(texts, { willChange: "transform, opacity" }),
                  onComplete: () => gsap.set(texts, { clearProps: "all" }),
                });
              }
            },
          });
        });

        // Desktop collage: CURTAIN on each photo (1200ms, stagger 200ms, from side nearest text - left)
        const collage = document.querySelector(".sw-desktop-collage");
        if (collage) {
          const photoBoxes = collage.querySelectorAll<HTMLElement>(".sw-photo-box");
          const photoImgs = collage.querySelectorAll<HTMLElement>(".sw-photo-img");

          ScrollTrigger.create({
            trigger: collage,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              photoBoxes.forEach((box, i) => {
                gsap.to(box, {
                  clipPath: "inset(0 0% 0 0)",
                  duration: 1.2,
                  delay: i * 0.2,
                  ease: "E2",
                  overwrite: "auto",
                  onStart: () => gsap.set(box, { willChange: "clip-path" }),
                  onComplete: () => gsap.set(box, { clearProps: "willChange" }),
                });
              });

              photoImgs.forEach((img, i) => {
                gsap.to(img, {
                  scale: 1,
                  duration: 1.56, // 1200ms * 1.3
                  delay: i * 0.2,
                  ease: "E1",
                  overwrite: "auto",
                  onStart: () => gsap.set(img, { willChange: "transform" }),
                  onComplete: () => gsap.set(img, { clearProps: "scale,willChange" }),
                });
              });
            },
          });
        }

        // Parallax on photo WRAPPERS only: wrapper 1 y 0 to -30px, wrapper 2 y 0 to 40px, scrub 1.4
        const wrapper1 = document.querySelector(".sw-wrapper-1");
        const wrapper2 = document.querySelector(".sw-wrapper-2");
        const section = sectionRef.current;

        if (section && wrapper1) {
          gsap.fromTo(
            wrapper1,
            { y: 0 },
            {
              y: -30,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.4,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        if (section && wrapper2) {
          gsap.fromTo(
            wrapper2,
            { y: 0 },
            {
              y: 40,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.4,
                invalidateOnRefresh: true,
              },
            }
          );
        }
      });

      // 3. Mobile: 1023px and below
      mm.add("(max-width: 1023px)", () => {
        // Set hidden initial states
        gsap.set(".sw-mobile .sw-line", { scaleX: 0, transformOrigin: "left center" });
        gsap.set(".sw-mobile .sw-text-item", { opacity: 0, y: 24 });
        gsap.set(".sw-mobile .sw-photo-box", { clipPath: "inset(0 0 100% 0)" });
        gsap.set(".sw-mobile .sw-photo-img", { scale: 1.06, transformOrigin: "center center" });

        // Mobile text blocks: lines DRAW, text RISE
        const mobileBlocks = gsap.utils.toArray<HTMLElement>(".sw-mobile .sw-block");
        mobileBlocks.forEach((block) => {
          const line = block.querySelector(".sw-line");
          const texts = block.querySelectorAll(".sw-text-item");

          ScrollTrigger.create({
            trigger: block,
            start: "top 90%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              if (line) {
                gsap.to(line, {
                  scaleX: 1,
                  duration: 1.0,
                  ease: "E2",
                  overwrite: "auto",
                  onStart: () => gsap.set(line, { willChange: "transform" }),
                  onComplete: () => gsap.set(line, { clearProps: "willChange" }),
                });
              }
              if (texts.length) {
                gsap.to(texts, {
                  opacity: 1,
                  y: 0,
                  duration: 0.9,
                  delay: 0.3,
                  stagger: 0.09,
                  ease: "E1",
                  overwrite: "auto",
                  onStart: () => gsap.set(texts, { willChange: "transform, opacity" }),
                  onComplete: () => gsap.set(texts, { clearProps: "all" }),
                });
              }
            },
          });
        });

        // Mobile photos: CURTAIN 900ms (start "top 90%", once: true), no parallax
        const mobilePhotos = gsap.utils.toArray<HTMLElement>(".sw-mobile .sw-photo-container");
        mobilePhotos.forEach((container) => {
          const box = container.querySelector<HTMLElement>(".sw-photo-box");
          const img = container.querySelector<HTMLElement>(".sw-photo-img");

          ScrollTrigger.create({
            trigger: container,
            start: "top 90%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              if (box) {
                gsap.to(box, {
                  clipPath: "inset(0 0 0% 0)",
                  duration: 0.9,
                  ease: "E2",
                  overwrite: "auto",
                  onStart: () => gsap.set(box, { willChange: "clip-path" }),
                  onComplete: () => gsap.set(box, { clearProps: "willChange" }),
                });
              }
              if (img) {
                gsap.to(img, {
                  scale: 1,
                  duration: 1.17, // 900ms * 1.3
                  ease: "E1",
                  overwrite: "auto",
                  onStart: () => gsap.set(img, { willChange: "transform" }),
                  onComplete: () => gsap.set(img, { clearProps: "scale,willChange" }),
                });
              }
            },
          });
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <article ref={mainRef} className="w-full bg-white text-[var(--ink)] overflow-x-clip">
      {/* 1. Hero Band */}
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033614/storage-hero.jpg"
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* 2. Main Content Section */}
      <section ref={sectionRef} className="container py-[var(--sec-y-lg)] max-w-[1340px] mx-auto">
        {/* Desktop: 2 Columns (Left: 3 Text Blocks with TEXT STYLE, Right: Floating Collage) */}
        <div className="hidden lg:grid grid-cols-12 gap-16 lg:gap-24 items-center sw-desktop">
          <div className="col-span-6 space-y-12 text-left">
            {blocks.map((b, idx) => (
              <div key={idx} className="sw-block space-y-3">
                <div className="w-full h-[1px] bg-[#E5E5E5] mb-5 sw-line" />
                <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-snug sw-text-item">
                  {b.title}
                </h3>
                <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[var(--blue)] font-normal sw-text-item">
                  {b.text}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop Floating Collage (Wrapper 1 & Wrapper 2 with parallax scrub 1.4) */}
          <div className="col-span-6 relative min-h-[580px] lg:min-h-[640px] flex items-center sw-desktop-collage select-none">
            {/* Wrapper 1 */}
            <div className="w-[82%] ml-auto relative z-[1] sw-wrapper sw-wrapper-1">
              <div
                className="w-full overflow-hidden shadow-lg border border-[#E5E5E5] sw-photo-box"
                style={{ aspectRatio: `${s1Ratio}` }}
              >
                <img
                  src={cl("https://res.cloudinary.com/cyfb9slf/image/upload/v1792033612/Storage-1.jpg", 1920)}
                  alt="Storage Warehouse Aerial View"
                  width={1024}
                  height={687}
                  loading="lazy"
                  decoding="async"
                  onLoad={(e) => {
                    const { naturalWidth, naturalHeight } = e.currentTarget;
                    if (naturalWidth && naturalHeight) {
                      setS1Ratio(naturalWidth / naturalHeight);
                    }
                  }}
                  className="w-full h-full object-cover block sw-photo-img"
                />
              </div>
            </div>

            {/* Wrapper 2 with white 12px border */}
            <div className="absolute top-[36%] left-0 w-[64%] z-[2] sw-wrapper sw-wrapper-2">
              <div
                className="w-full overflow-hidden shadow-2xl border-[12px] border-white sw-photo-box"
                style={{ aspectRatio: `${s2Ratio}` }}
              >
                <img
                  src={cl("https://res.cloudinary.com/cyfb9slf/image/upload/v1792033612/Storage-2.jpg", 1920)}
                  alt="Storage Warehouse Pallet Racks"
                  width={1024}
                  height={687}
                  loading="lazy"
                  decoding="async"
                  onLoad={(e) => {
                    const { naturalWidth, naturalHeight } = e.currentTarget;
                    if (naturalWidth && naturalHeight) {
                      setS2Ratio(naturalWidth / naturalHeight);
                    }
                  }}
                  className="w-full h-full object-cover block sw-photo-img"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Editorial flow with exactly 56px between parts */}
        <div className="lg:hidden flex flex-col space-y-[56px] text-left sw-mobile">
          {/* Part 1: Block 1 text */}
          <div className="sw-block space-y-3">
            <div className="w-full h-[1px] bg-[#E5E5E5] mb-5 sw-line" />
            <h3 className="text-[17px] font-bold text-[#0A0A0A] leading-snug sw-text-item">
              {blocks[0]?.title}
            </h3>
            <p className="text-[15px] leading-[1.6] text-[var(--blue)] font-normal sw-text-item">
              {blocks[0]?.text}
            </p>
          </div>

          {/* Part 2: Photo s1 full width */}
          <div className="sw-photo-container w-full">
            <div
              className="w-full overflow-hidden shadow-md border border-[#E5E5E5] sw-photo-box"
              style={{ aspectRatio: `${s1Ratio}` }}
            >
              <img
                src={cl("https://res.cloudinary.com/cyfb9slf/image/upload/v1792033612/Storage-1.jpg", 2560)}
                alt={blocks[0]?.title || "Storage Warehouse Interior"}
                width={1024}
                height={687}
                loading="lazy"
                decoding="async"
                onLoad={(e) => {
                  const { naturalWidth, naturalHeight } = e.currentTarget;
                  if (naturalWidth && naturalHeight) {
                    setS1Ratio(naturalWidth / naturalHeight);
                  }
                }}
                className="w-full h-full object-cover block sw-photo-img"
              />
            </div>
          </div>

          {/* Part 3: Block 2 text */}
          <div className="sw-block space-y-3">
            <div className="w-full h-[1px] bg-[#E5E5E5] mb-5 sw-line" />
            <h3 className="text-[17px] font-bold text-[#0A0A0A] leading-snug sw-text-item">
              {blocks[1]?.title}
            </h3>
            <p className="text-[15px] leading-[1.6] text-[var(--blue)] font-normal sw-text-item">
              {blocks[1]?.text}
            </p>
          </div>

          {/* Part 4: Photo s2 full width */}
          <div className="sw-photo-container w-full">
            <div
              className="w-full overflow-hidden shadow-xl border-4 border-white sw-photo-box"
              style={{ aspectRatio: `${s2Ratio}` }}
            >
              <img
                src={cl("https://res.cloudinary.com/cyfb9slf/image/upload/v1792033612/Storage-2.jpg", 2560)}
                alt={blocks[1]?.title || "Storage Warehouse Pallet Racking"}
                width={1024}
                height={687}
                loading="lazy"
                decoding="async"
                onLoad={(e) => {
                  const { naturalWidth, naturalHeight } = e.currentTarget;
                  if (naturalWidth && naturalHeight) {
                    setS2Ratio(naturalWidth / naturalHeight);
                  }
                }}
                className="w-full h-full object-cover block sw-photo-img"
              />
            </div>
          </div>

          {/* Part 5: Block 3 text */}
          <div className="sw-block space-y-3">
            <div className="w-full h-[1px] bg-[#E5E5E5] mb-5 sw-line" />
            <h3 className="text-[17px] font-bold text-[#0A0A0A] leading-snug sw-text-item">
              {blocks[2]?.title}
            </h3>
            <p className="text-[15px] leading-[1.6] text-[var(--blue)] font-normal sw-text-item">
              {blocks[2]?.text}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Frequently Asked Questions: TEXT STYLE & ACCORDION recipe */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y-lg)] border-t border-[#E5E5E5] text-left max-w-[1340px] mx-auto">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-[16px] lg:text-[44px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="w-full divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
              {data.faq.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                const panelId = `storage-faq-panel-${idx}`;
                const headerId = `storage-faq-header-${idx}`;

                return (
                  <div key={idx} className="group overflow-hidden">
                    <button
                      id={headerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full min-h-[48px] py-5 lg:py-6 flex items-center justify-between text-left cursor-pointer transition-colors"
                    >
                      <span className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-snug pr-4">
                        {item.q}
                      </span>
                      <span
                        className={`flex-shrink-0 w-8 h-8 rounded-full border border-[var(--blue)] flex items-center justify-center text-[var(--blue)] font-bold text-[18px] transition-transform duration-300 ${
                          isOpen ? "rotate-45 bg-[var(--blue)] text-white" : "bg-white"
                        }`}
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </button>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={headerId}
                      className="overflow-hidden"
                      style={{
                        display: "grid",
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                        opacity: isOpen ? 1 : 0,
                        transition:
                          "grid-template-rows 600ms cubic-bezier(.16, 1, .3, 1), opacity 400ms cubic-bezier(.16, 1, .3, 1) 150ms",
                      }}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <p className="pb-6 text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[var(--blue)] font-normal max-w-[680px]">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. Next Banner */}
      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033617/Storage-next.jpg"
        nextUrl="/steel-warehouses-pakistan/logistics-warehouses/"
        nextTitle="Logistics Warehouses"
      />
    </article>
  );
};

// 9.14 Logistics Warehouses — signature: "Dock lane"
export const LogisticsWarehousesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const images = [
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202369/logistics-1.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202369/logistics-2.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202371/Logistics-3.jpg",
  ];

  const cards = sections.slice(0, 3).map((sec, idx) => ({
    num: String(idx + 1).padStart(2, "0"),
    title: sec.title,
    text: sec.text,
    img: images[idx] || images[0],
  }));

  const mainRef = React.useRef<HTMLElement>(null);
  const sectionRef = React.useRef<HTMLElement>(null);
  const mobileRailRef = React.useRef<HTMLDivElement>(null);
  const [openFaqIdx, setOpenFaqIdx] = React.useState<number | null>(null);

  // Real photo shapes (initial natural aspect ratio 1024 / 687 = 1.4905)
  const [imgRatios, setImgRatios] = React.useState<number[]>([
    1024 / 687,
    1024 / 687,
    1024 / 687,
  ]);

  // Debounced ScrollTrigger refresh after font load and image decode
  React.useEffect(() => {
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

    const urls = [
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202370/logistics-hero.jpg",
      ...images,
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202370/logistics-next.jpg",
    ];

    urls.forEach((u) => {
      const im = new Image();
      im.src = cl(u, 1920);
      if (im.decode) {
        im.decode().then(debouncedRefresh).catch(() => {});
      } else {
        im.onload = debouncedRefresh;
      }
    });

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Motion Kit animations: Desktop and Mobile written separately
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // 1. Reduced motion: immediate final state, no movement
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".lw-desktop-fill", { scaleX: 1, clearProps: "all" });
        gsap.set(".lw-desktop-dot", { backgroundColor: "#1E3A8A", clearProps: "all" });
        gsap.set(".lw-mobile-fill", { scaleY: 1, clearProps: "all" });
        gsap.set(".lw-mobile-dot", { backgroundColor: "#1E3A8A", clearProps: "all" });
        gsap.set(".lw-photo-box", { clipPath: "inset(0 0 0% 0)", clearProps: "clipPath" });
        gsap.set(".lw-photo-img", { scale: 1, clearProps: "scale" });
        gsap.set(".lw-text-item", { opacity: 1, y: 0, clearProps: "all" });
      });

      // 2. Desktop: 1024px and up
      mm.add("(min-width: 1024px)", () => {
        // Set hidden initial states before first paint
        gsap.set(".lw-desktop .lw-desktop-fill", { scaleX: 0, transformOrigin: "left center" });
        gsap.set(".lw-desktop .lw-photo-box", { clipPath: "inset(0 0 100% 0)" });
        gsap.set(".lw-desktop .lw-photo-img", { scale: 1.06, transformOrigin: "center center" });
        gsap.set(".lw-desktop .lw-text-item", { opacity: 0, y: 24 });

        const desktopColumns = gsap.utils.toArray<HTMLElement>(".lw-desktop .lw-column");
        const desktopDots = gsap.utils.toArray<HTMLElement>(".lw-desktop .lw-desktop-dot");
        const desktopFill = document.querySelector<HTMLElement>(".lw-desktop-fill");
        const laneTrack = document.querySelector<HTMLElement>(".lw-desktop-lane");

        const revealedState = [false, false, false];

        const triggerColumnReveal = (idx: number) => {
          if (revealedState[idx]) return;
          revealedState[idx] = true;

          const col = desktopColumns[idx];
          if (!col) return;

          const box = col.querySelector<HTMLElement>(".lw-photo-box");
          const img = col.querySelector<HTMLElement>(".lw-photo-img");
          const texts = col.querySelectorAll<HTMLElement>(".lw-text-item");

          if (box) {
            gsap.to(box, {
              clipPath: "inset(0 0 0% 0)",
              duration: 0.9,
              ease: "E2",
              overwrite: "auto",
              onStart: () => gsap.set(box, { willChange: "clip-path" }),
              onComplete: () => gsap.set(box, { clearProps: "willChange" }),
            });
          }

          if (img) {
            gsap.to(img, {
              scale: 1,
              duration: 1.17, // 900ms * 1.3
              ease: "E1",
              overwrite: "auto",
              onStart: () => gsap.set(img, { willChange: "transform" }),
              onComplete: () => gsap.set(img, { clearProps: "scale,willChange" }),
            });
          }

          if (texts.length) {
            gsap.to(texts, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              delay: 0.3,
              stagger: 0.09,
              ease: "E1",
              overwrite: "auto",
              onStart: () => gsap.set(texts, { willChange: "transform, opacity" }),
              onComplete: () => gsap.set(texts, { clearProps: "all" }),
            });
          }
        };

        // Desktop lane: RAIL(fill) horizontally (scaleX, origin left) across the 3 columns, scrub 1.2
        if (desktopFill && laneTrack) {
          const dotThresholds = [0.03, 0.38, 0.72];

          gsap.fromTo(
            desktopFill,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 65%",
                end: "center 45%",
                scrub: 1.2,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  const p = self.progress;
                  desktopDots.forEach((dot, idx) => {
                    const threshold = dotThresholds[idx] ?? (idx / 3);
                    if (p >= threshold) {
                      dot.style.backgroundColor = "var(--blue)";
                      triggerColumnReveal(idx);
                    } else if (!revealedState[idx]) {
                      dot.style.backgroundColor = "#FFFFFF";
                    }
                  });
                },
              },
            }
          );
        }
      });

      // 3. Mobile: 1023px and below
      mm.add("(max-width: 1023px)", () => {
        // Set hidden initial states
        gsap.set(".lw-mobile .lw-mobile-fill", { scaleY: 0, transformOrigin: "top center" });
        gsap.set(".lw-mobile .lw-photo-box", { clipPath: "inset(0 0 100% 0)" });
        gsap.set(".lw-mobile .lw-photo-img", { scale: 1.06, transformOrigin: "center center" });
        gsap.set(".lw-mobile .lw-text-item", { opacity: 0, y: 24 });

        const mobileBlocks = gsap.utils.toArray<HTMLElement>(".lw-mobile .lw-block");
        const mobileDots = gsap.utils.toArray<HTMLElement>(".lw-mobile .lw-mobile-dot");
        const mobileFill = document.querySelector<HTMLElement>(".lw-mobile-fill");
        const mobileRail = mobileRailRef.current;

        // 2. Mobile lane: RAIL(fill) vertical, scrub 1.2
        if (mobileFill && mobileRail) {
          const mobileDotThresholds = [0.02, 0.38, 0.74];

          gsap.fromTo(
            mobileFill,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: mobileRail,
                start: "top 60%",
                end: "bottom 60%",
                scrub: 1.2,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  const p = self.progress;
                  mobileDots.forEach((dot, idx) => {
                    const threshold = mobileDotThresholds[idx] ?? (idx / 3);
                    if (p >= threshold) {
                      dot.style.backgroundColor = "var(--blue)";
                    } else {
                      dot.style.backgroundColor = "#FFFFFF";
                    }
                  });
                },
              },
            }
          );
        }

        // Each mobile block triggers on its own (once), independent of the rail
        mobileBlocks.forEach((block) => {
          const box = block.querySelector<HTMLElement>(".lw-photo-box");
          const img = block.querySelector<HTMLElement>(".lw-photo-img");
          const texts = block.querySelectorAll<HTMLElement>(".lw-text-item");

          ScrollTrigger.create({
            trigger: block,
            start: "top 90%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              if (box) {
                gsap.to(box, {
                  clipPath: "inset(0 0 0% 0)",
                  duration: 0.9,
                  ease: "E2",
                  overwrite: "auto",
                  onStart: () => gsap.set(box, { willChange: "clip-path" }),
                  onComplete: () => gsap.set(box, { clearProps: "willChange" }),
                });
              }

              if (img) {
                gsap.to(img, {
                  scale: 1,
                  duration: 1.17, // 900ms * 1.3
                  ease: "E1",
                  overwrite: "auto",
                  onStart: () => gsap.set(img, { willChange: "transform" }),
                  onComplete: () => gsap.set(img, { clearProps: "scale,willChange" }),
                });
              }

              if (texts.length) {
                gsap.to(texts, {
                  opacity: 1,
                  y: 0,
                  duration: 0.9,
                  delay: 0.3,
                  stagger: 0.09,
                  ease: "E1",
                  overwrite: "auto",
                  onStart: () => gsap.set(texts, { willChange: "transform, opacity" }),
                  onComplete: () => gsap.set(texts, { clearProps: "all" }),
                });
              }
            },
          });
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <article ref={mainRef} className="w-full bg-white text-[var(--ink)] overflow-x-clip">
      {/* 1. Hero Band */}
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792202370/logistics-hero.jpg"
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* 2. Main Content Section */}
      <section ref={sectionRef} className="container py-[var(--sec-y-lg)] max-w-[1340px] mx-auto">
        {/* Desktop: Horizontal Dock Lane (line, 3 dots, 3 columns) */}
        <div className="hidden lg:block sw-desktop lw-desktop">
          {/* Horizontal Dock Lane Line & Dots */}
          <div className="relative mb-8 lg:mb-10 lw-desktop-lane">
            {/* Background 2px line (behind dots, z-[1]) */}
            <div className="absolute top-[5px] left-0 right-0 h-[2px] bg-[#E5E5E5] z-[1]" />
            {/* Active 2px blue fill line (behind dots, z-[1]) */}
            <div className="lw-desktop-fill absolute top-[5px] left-0 right-0 h-[2px] bg-[var(--blue)] z-[1]" />

            {/* 3 dots matching the 3-column grid alignment */}
            <div className="grid grid-cols-3 gap-8 lg:gap-10">
              {cards.map((c, idx) => (
                <div key={idx} className="relative">
                  <div
                    className="lw-desktop-dot relative z-[2] w-[12px] h-[12px] rounded-full border-2 border-[var(--blue)] bg-white transition-colors duration-300"
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 3 Columns */}
          <div className="grid grid-cols-3 gap-8 lg:gap-10 text-left">
            {cards.map((c, idx) => (
              <div key={c.num} className="lw-column flex flex-col justify-start">
                {/* Photo at real shape */}
                <div
                  className="w-full overflow-hidden shadow-sm border border-[#E5E5E5] lw-photo-box"
                  style={{ aspectRatio: `${imgRatios[idx] || 1024 / 687}` }}
                >
                  <img
                    src={cl(c.img, 1920)}
                    alt={c.title}
                    width={1024}
                    height={687}
                    loading="lazy"
                    decoding="async"
                    onLoad={(e) => {
                      const { naturalWidth, naturalHeight } = e.currentTarget;
                      if (naturalWidth && naturalHeight) {
                        const ratio = naturalWidth / naturalHeight;
                        setImgRatios((prev) => {
                          const next = [...prev];
                          next[idx] = ratio;
                          return next;
                        });
                      }
                    }}
                    className="w-full h-full object-cover block lw-photo-img"
                  />
                </div>

                {/* Number: solid, bold, var(--blue), placed above its title, like One-Step */}
                <div className="text-[40px] lg:text-[64px] font-[800] text-[var(--blue)] leading-none select-none mt-6 mb-3 lw-text-item">
                  {c.num}
                </div>

                {/* Title: bold, ink colour, sentence case */}
                <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-snug mb-3 lw-text-item">
                  {c.title}
                </h3>

                {/* Text: the blue of the One-Step body text (var(--blue)), regular weight */}
                <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[var(--blue)] font-normal lw-text-item">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical Lane (Rail) */}
        {/* A 2px blue line 12px from the left edge, a dot for each block. Content has padding-left: 36px. 56px between blocks. */}
        <div ref={mobileRailRef} className="lg:hidden relative text-left lw-mobile">
          {/* Vertical 2px background rail line (behind dots, z-[1]) */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-[#E5E5E5] z-[1] pointer-events-none"
            style={{ left: "12px" }}
          />
          {/* Vertical 2px active fill line (behind dots, z-[1]) */}
          <div
            className="lw-mobile-fill absolute top-0 bottom-0 w-[2px] bg-[var(--blue)] z-[1] pointer-events-none"
            style={{ left: "12px" }}
          />

          {/* 3 Mobile Blocks separated by 56px */}
          <div className="flex flex-col space-y-[56px]">
            {cards.map((c, idx) => (
              <div key={c.num} className="lw-block relative pl-[36px]">
                {/* 10px Dot centered at left: 12px (z-[2]) */}
                <div
                  className="lw-mobile-dot absolute z-[2] w-[10px] h-[10px] rounded-full border-2 border-[var(--blue)] bg-white transition-colors duration-300"
                  style={{
                    left: "12px",
                    top: "16px",
                    transform: "translate(-50%, 0)",
                  }}
                  aria-hidden="true"
                />

                {/* Photo at real shape */}
                <div
                  className="w-full overflow-hidden shadow-sm border border-[#E5E5E5] lw-photo-box"
                  style={{ aspectRatio: `${imgRatios[idx] || 1024 / 687}` }}
                >
                  <img
                    src={cl(c.img, 2560)}
                    alt={c.title}
                    width={1024}
                    height={687}
                    loading="lazy"
                    decoding="async"
                    onLoad={(e) => {
                      const { naturalWidth, naturalHeight } = e.currentTarget;
                      if (naturalWidth && naturalHeight) {
                        const ratio = naturalWidth / naturalHeight;
                        setImgRatios((prev) => {
                          const next = [...prev];
                          next[idx] = ratio;
                          return next;
                        });
                      }
                    }}
                    className="w-full h-full object-cover block lw-photo-img"
                  />
                </div>

                {/* Number: solid, bold, var(--blue), placed above its title, like One-Step */}
                <div className="text-[40px] font-[800] text-[var(--blue)] leading-none select-none mt-4 mb-2 lw-text-item">
                  {c.num}
                </div>

                {/* Title: bold, ink colour, sentence case */}
                <h3 className="text-[17px] font-bold text-[#0A0A0A] leading-snug mb-2 lw-text-item">
                  {c.title}
                </h3>

                {/* Text: the blue of the One-Step body text (var(--blue)), regular weight */}
                <p className="text-[15px] leading-[1.6] text-[var(--blue)] font-normal lw-text-item">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Frequently Asked Questions: TEXT STYLE & ACCORDION recipe */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y-lg)] border-t border-[#E5E5E5] text-left max-w-[1340px] mx-auto">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-[16px] lg:text-[44px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="w-full divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
              {data.faq.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                const panelId = `logistics-faq-panel-${idx}`;
                const headerId = `logistics-faq-header-${idx}`;

                return (
                  <div key={idx} className="group overflow-hidden">
                    <button
                      id={headerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full min-h-[48px] py-5 lg:py-6 flex items-center justify-between text-left cursor-pointer transition-colors"
                    >
                      <span className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-snug pr-4">
                        {item.q}
                      </span>
                      <span
                        className={`flex-shrink-0 w-8 h-8 rounded-full border border-[var(--blue)] flex items-center justify-center text-[var(--blue)] font-bold text-[18px] transition-transform duration-300 ${
                          isOpen ? "rotate-45 bg-[var(--blue)] text-white" : "bg-white"
                        }`}
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </button>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={headerId}
                      className="overflow-hidden"
                      style={{
                        display: "grid",
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                        opacity: isOpen ? 1 : 0,
                        transition:
                          "grid-template-rows 600ms cubic-bezier(.16, 1, .3, 1), opacity 400ms cubic-bezier(.16, 1, .3, 1) 150ms",
                      }}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <p className="pb-6 text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[var(--blue)] font-normal max-w-[680px]">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. Next Banner */}
      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792202370/logistics-next.jpg"
        nextUrl="/steel-warehouses-pakistan/cold-storage-warehouses/"
        nextTitle="Cold Storage Warehouses"
      />
    </article>
  );
};

// 9.15 Cold Storage — signature: "Cold-chain flow"
const COLD_STORAGE_IMAGES = {
  hero: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202370/Cold-storage-hero.jpg",
  c1: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202371/Cold-storage-1.jpg",
  c2: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202371/Cold-storage-2.jpg",
  c3: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202367/cold-storage-3.jpg",
  c4: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202368/cold-storage-4.jpg",
  next: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202371/cold-storage-next.jpg",
};

export const ColdStorageLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const defaultSections = [
    {
      title: "What Cold Storage Needs",
      text: "A cold store keeps goods at a set temperature. The building must stop heat from entering. Gaps, thin walls or leaks make the cooling system work harder and cost more to run.",
      img: COLD_STORAGE_IMAGES.c1,
    },
    {
      title: "What Steel Mind Engineers Provides",
      text: "Steel Mind Engineers supplies the steel frame, the roof and wall structure, and the supports for insulated panels. The refrigeration plant is installed by the cooling specialist you choose, and Steel Mind Engineers coordinates the loads and openings with that specialist.",
      img: COLD_STORAGE_IMAGES.c2,
    },
    {
      title: "Design Points",
      text: "Thick insulated panels with sealed joints reduce heat gain. Frame connections are detailed to avoid heat paths where possible. The roof and frames carry condensers, ducts and hanging evaporators. The floor needs insulation, and the doors must seal tightly. Vapor barriers and good detailing prevent water inside the walls.",
      img: COLD_STORAGE_IMAGES.c3,
    },
    {
      title: "Who Uses Cold Storage",
      text: "Fruit and vegetable traders, dairy and meat processors, pharmaceutical distributors and food exporters use cold stores.",
      img: COLD_STORAGE_IMAGES.c4,
    },
  ];

  const cards = [0, 1, 2, 3].map((idx) => ({
    title: sections[idx]?.title || defaultSections[idx].title,
    text: sections[idx]?.text || defaultSections[idx].text,
    img: defaultSections[idx].img,
  }));

  const mainRef = React.useRef<HTMLElement>(null);
  const sectionRef = React.useRef<HTMLElement>(null);
  const row1Ref = React.useRef<HTMLDivElement>(null);
  const row2Ref = React.useRef<HTMLDivElement>(null);
  const row1PhotoRef = React.useRef<HTMLDivElement>(null);
  const row2PhotoRef = React.useRef<HTMLDivElement>(null);
  const dividerRef = React.useRef<HTMLDivElement>(null);

  const [openFaqIdx, setOpenFaqIdx] = React.useState<number | null>(null);

  // Dynamic photo aspect ratios (initial natural shape 1024 / 687 = 1.4905)
  const [imgRatios, setImgRatios] = React.useState<number[]>([
    1024 / 687,
    1024 / 687,
    1024 / 687,
    1024 / 687,
  ]);

  // Measured mid-height of photo boxes for exact connector positioning
  const [row1PhotoMidY, setRow1PhotoMidY] = React.useState<number>(196);
  const [row2PhotoMidY, setRow2PhotoMidY] = React.useState<number>(196);

  const updateMidY = React.useCallback(() => {
    if (row1PhotoRef.current) {
      setRow1PhotoMidY(row1PhotoRef.current.offsetHeight / 2);
    }
    if (row2PhotoRef.current) {
      setRow2PhotoMidY(row2PhotoRef.current.offsetHeight / 2);
    }
  }, []);

  const handleImageLoad = (idx: number, ratio: number) => {
    setImgRatios((prev) => {
      const next = [...prev];
      next[idx] = ratio;
      return next;
    });
    requestAnimationFrame(updateMidY);
  };

  React.useEffect(() => {
    updateMidY();
    window.addEventListener("resize", updateMidY);
    return () => window.removeEventListener("resize", updateMidY);
  }, [updateMidY]);

  // Debounced ScrollTrigger refresh after font load and image decode
  React.useEffect(() => {
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

    const urls = [
      COLD_STORAGE_IMAGES.hero,
      COLD_STORAGE_IMAGES.c1,
      COLD_STORAGE_IMAGES.c2,
      COLD_STORAGE_IMAGES.c3,
      COLD_STORAGE_IMAGES.c4,
      COLD_STORAGE_IMAGES.next,
    ];

    urls.forEach((u) => {
      const im = new Image();
      im.src = cl(u, 1920);
      if (im.decode) {
        im.decode().then(debouncedRefresh).catch(() => {});
      } else {
        im.onload = debouncedRefresh;
      }
    });

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Motion Kit animations: Desktop and Mobile written separately
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // 1. Reduced motion: immediate final state, no movement
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".cs-photo-box", { clipPath: "inset(0 0 0% 0)", clearProps: "clipPath" });
        gsap.set(".cs-photo-img", { scale: 1, clearProps: "scale" });
        gsap.set(".cs-text-item", { opacity: 1, y: 0, clearProps: "all" });
        gsap.set(".cs-connector-line, .cs-divider-line, .cs-mobile-line", { scaleX: 1, clearProps: "all" });
        gsap.set(".cs-connector-circle, .cs-divider-circle, .cs-mobile-circle", { scale: 1, opacity: 1, clearProps: "all" });
        gsap.set(".cs-connector-chevron", { x: 0, clearProps: "all" });
        gsap.set(".cs-divider-arrow", { y: 0, clearProps: "all" });
      });

      // 2. Desktop: 1024px and up (2x2 flow grid, gap 80px 72px)
      mm.add("(min-width: 1024px)", () => {
        // Initial hidden states set before first paint
        gsap.set(".cs-desktop .cs-photo-box", { clipPath: "inset(0 0 100% 0)" });
        gsap.set(".cs-desktop .cs-photo-img", { scale: 1.06, transformOrigin: "center center" });
        gsap.set(".cs-desktop .cs-text-item", { opacity: 0, y: 24 });
        gsap.set(".cs-desktop .cs-connector-line", { scaleX: 0, transformOrigin: "left center" });
        gsap.set(".cs-desktop .cs-connector-circle", { scale: 0.6, opacity: 0, transformOrigin: "center center" });
        gsap.set(".cs-desktop .cs-connector-chevron", { x: 0 });
        gsap.set(".cs-desktop .cs-divider-line", { scaleX: 0, transformOrigin: "left center" });
        gsap.set(".cs-desktop .cs-divider-circle", { scale: 0.6, opacity: 0, transformOrigin: "center center" });
        gsap.set(".cs-desktop .cs-divider-arrow", { y: -4 });

        // Helper to build timeline for a desktop row
        const setupRowTimeline = (rowEl: HTMLElement | null) => {
          if (!rowEl) return;

          const cell1Box = rowEl.querySelector<HTMLElement>(".cs-cell-1 .cs-photo-box");
          const cell1Img = rowEl.querySelector<HTMLElement>(".cs-cell-1 .cs-photo-img");
          const cell1Texts = rowEl.querySelectorAll<HTMLElement>(".cs-cell-1 .cs-text-item");

          const connLine = rowEl.querySelector<HTMLElement>(".cs-connector-line");
          const connCircle = rowEl.querySelector<HTMLElement>(".cs-connector-circle");
          const connChevron = rowEl.querySelector<HTMLElement>(".cs-connector-chevron");

          const cell2Box = rowEl.querySelector<HTMLElement>(".cs-cell-2 .cs-photo-box");
          const cell2Img = rowEl.querySelector<HTMLElement>(".cs-cell-2 .cs-photo-img");
          const cell2Texts = rowEl.querySelectorAll<HTMLElement>(".cs-cell-2 .cs-text-item");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: rowEl,
              start: "top 80%",
              once: true,
              invalidateOnRefresh: true,
            },
          });

          // 1. Sequence per row: cell 1 CURTAIN 1200ms
          if (cell1Box) {
            tl.to(
              cell1Box,
              {
                clipPath: "inset(0 0 0% 0)",
                duration: 1.2,
                ease: "E2",
                overwrite: "auto",
                onStart: () => gsap.set(cell1Box, { willChange: "clip-path" }),
                onComplete: () => gsap.set(cell1Box, { clearProps: "willChange" }),
              },
              0
            );
          }
          if (cell1Img) {
            tl.to(
              cell1Img,
              {
                scale: 1,
                duration: 1.56, // 1200ms * 1.3
                ease: "E1",
                overwrite: "auto",
                onStart: () => gsap.set(cell1Img, { willChange: "transform" }),
                onComplete: () => gsap.set(cell1Img, { clearProps: "scale,willChange" }),
              },
              0
            );
          }
          if (cell1Texts.length) {
            tl.to(
              cell1Texts,
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.09,
                ease: "E1",
                overwrite: "auto",
                onStart: () => gsap.set(cell1Texts, { willChange: "transform, opacity" }),
                onComplete: () => gsap.set(cell1Texts, { clearProps: "all" }),
              },
              0.3
            );
          }

          // 2. Connector line DRAW 600ms (starts at 700ms)
          if (connLine) {
            tl.to(
              connLine,
              {
                scaleX: 1,
                duration: 0.6,
                ease: "E2",
                overwrite: "auto",
                onStart: () => gsap.set(connLine, { willChange: "transform" }),
                onComplete: () => gsap.set(connLine, { clearProps: "willChange" }),
              },
              0.7
            );
          }

          // 3. Chevron circle scales .6 to 1 with opacity (400ms E1) and chevron nudges 4px right once
          if (connCircle) {
            tl.to(
              connCircle,
              {
                scale: 1,
                opacity: 1,
                duration: 0.4,
                ease: "E1",
                overwrite: "auto",
                onStart: () => gsap.set(connCircle, { willChange: "transform, opacity" }),
                onComplete: () => gsap.set(connCircle, { clearProps: "willChange" }),
              },
              0.9
            );
          }
          if (connChevron) {
            tl.fromTo(
              connChevron,
              { x: 0 },
              {
                x: 4,
                duration: 0.2,
                ease: "E1",
                yoyo: true,
                repeat: 1,
                overwrite: "auto",
              },
              1.1
            );
          }

          // 4. Cell 2 CURTAIN (starts at 900ms)
          if (cell2Box) {
            tl.to(
              cell2Box,
              {
                clipPath: "inset(0 0 0% 0)",
                duration: 1.2,
                ease: "E2",
                overwrite: "auto",
                onStart: () => gsap.set(cell2Box, { willChange: "clip-path" }),
                onComplete: () => gsap.set(cell2Box, { clearProps: "willChange" }),
              },
              0.9
            );
          }
          if (cell2Img) {
            tl.to(
              cell2Img,
              {
                scale: 1,
                duration: 1.56,
                ease: "E1",
                overwrite: "auto",
                onStart: () => gsap.set(cell2Img, { willChange: "transform" }),
                onComplete: () => gsap.set(cell2Img, { clearProps: "scale,willChange" }),
              },
              0.9
            );
          }
          if (cell2Texts.length) {
            tl.to(
              cell2Texts,
              {
                opacity: 1,
                y: 0,
                duration: 0.9,
                stagger: 0.09,
                ease: "E1",
                overwrite: "auto",
                onStart: () => gsap.set(cell2Texts, { willChange: "transform, opacity" }),
                onComplete: () => gsap.set(cell2Texts, { clearProps: "all" }),
              },
              1.2
            );
          }
        };

        // Row 1
        setupRowTimeline(row1Ref.current);

        // Divider between rows: line DRAWs 1000ms, circle scales in 400ms, arrow-down moves y -4 to 0 once
        if (dividerRef.current) {
          const divEl = dividerRef.current;
          const dLine = divEl.querySelector<HTMLElement>(".cs-divider-line");
          const dCircle = divEl.querySelector<HTMLElement>(".cs-divider-circle");
          const dArrow = divEl.querySelector<HTMLElement>(".cs-divider-arrow");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: divEl,
              start: "top 80%",
              once: true,
              invalidateOnRefresh: true,
            },
          });

          if (dLine) {
            tl.to(
              dLine,
              {
                scaleX: 1,
                duration: 1.0,
                ease: "E2",
                overwrite: "auto",
                onStart: () => gsap.set(dLine, { willChange: "transform" }),
                onComplete: () => gsap.set(dLine, { clearProps: "willChange" }),
              },
              0
            );
          }
          if (dCircle) {
            tl.to(
              dCircle,
              {
                scale: 1,
                opacity: 1,
                duration: 0.4,
                ease: "E1",
                overwrite: "auto",
                onStart: () => gsap.set(dCircle, { willChange: "transform, opacity" }),
                onComplete: () => gsap.set(dCircle, { clearProps: "willChange" }),
              },
              0.5
            );
          }
          if (dArrow) {
            tl.to(
              dArrow,
              {
                y: 0,
                duration: 0.4,
                ease: "E1",
                overwrite: "auto",
              },
              0.7
            );
          }
        }

        // Row 2
        setupRowTimeline(row2Ref.current);
      });

      // 3. Mobile / Tablet: 1023px and below (stacked, one column)
      mm.add("(max-width: 1023px)", () => {
        // Initial hidden states
        gsap.set(".cs-mobile .cs-photo-box", { clipPath: "inset(0 0 100% 0)" });
        gsap.set(".cs-mobile .cs-photo-img", { scale: 1.06, transformOrigin: "center center" });
        gsap.set(".cs-mobile .cs-text-item", { opacity: 0, y: 24 });
        gsap.set(".cs-mobile .cs-mobile-line", { scaleX: 0, transformOrigin: "center center" });
        gsap.set(".cs-mobile .cs-mobile-circle", { scale: 0.6, opacity: 0, transformOrigin: "center center" });

        // Mobile blocks: each CURTAIN 900ms then text RISE
        const mobileBlocks = gsap.utils.toArray<HTMLElement>(".cs-mobile .cs-mobile-block");
        mobileBlocks.forEach((block) => {
          const box = block.querySelector<HTMLElement>(".cs-photo-box");
          const img = block.querySelector<HTMLElement>(".cs-photo-img");
          const texts = block.querySelectorAll<HTMLElement>(".cs-text-item");

          ScrollTrigger.create({
            trigger: block,
            start: "top 90%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              if (box) {
                gsap.to(box, {
                  clipPath: "inset(0 0 0% 0)",
                  duration: 0.9,
                  ease: "E2",
                  overwrite: "auto",
                  onStart: () => gsap.set(box, { willChange: "clip-path" }),
                  onComplete: () => gsap.set(box, { clearProps: "willChange" }),
                });
              }
              if (img) {
                gsap.to(img, {
                  scale: 1,
                  duration: 1.17, // 900ms * 1.3
                  ease: "E1",
                  overwrite: "auto",
                  onStart: () => gsap.set(img, { willChange: "transform" }),
                  onComplete: () => gsap.set(img, { clearProps: "scale,willChange" }),
                });
              }
              if (texts.length) {
                gsap.to(texts, {
                  opacity: 1,
                  y: 0,
                  duration: 0.9,
                  delay: 0.3,
                  stagger: 0.09,
                  ease: "E1",
                  overwrite: "auto",
                  onStart: () => gsap.set(texts, { willChange: "transform, opacity" }),
                  onComplete: () => gsap.set(texts, { clearProps: "all" }),
                });
              }
            },
          });
        });

        // Mobile connectors: circle scales in 400ms and line DRAWs 600ms when it enters
        const mobileConnectors = gsap.utils.toArray<HTMLElement>(".cs-mobile .cs-mobile-connector");
        mobileConnectors.forEach((conn) => {
          const line = conn.querySelector<HTMLElement>(".cs-mobile-line");
          const circle = conn.querySelector<HTMLElement>(".cs-mobile-circle");

          ScrollTrigger.create({
            trigger: conn,
            start: "top 90%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              if (circle) {
                gsap.to(circle, {
                  scale: 1,
                  opacity: 1,
                  duration: 0.4,
                  ease: "E1",
                  overwrite: "auto",
                  onStart: () => gsap.set(circle, { willChange: "transform, opacity" }),
                  onComplete: () => gsap.set(circle, { clearProps: "willChange" }),
                });
              }
              if (line) {
                gsap.to(line, {
                  scaleX: 1,
                  duration: 0.6,
                  ease: "E2",
                  overwrite: "auto",
                  onStart: () => gsap.set(line, { willChange: "transform" }),
                  onComplete: () => gsap.set(line, { clearProps: "willChange" }),
                });
              }
            },
          });
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <article ref={mainRef} className="w-full bg-white text-[var(--ink)] overflow-x-clip">
      {/* 1. Hero Band */}
      <HeroBand
        variant="immersive"
        imageSrc={COLD_STORAGE_IMAGES.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* 2. Main Content Section */}
      <section ref={sectionRef} className="container py-[var(--sec-y-lg)] max-w-[1340px] mx-auto">
        {/* Desktop: 2x2 Flow Grid (gap 80px 72px) */}
        <div className="hidden lg:block cs-desktop">
          {/* Row 1 */}
          <div
            ref={row1Ref}
            className="cs-desktop-row relative grid grid-cols-2 gap-x-[72px] text-left"
          >
            {/* Cell 1: photo (real shape), title, text */}
            <div className="cs-cell cs-cell-1 flex flex-col justify-start">
              <div
                ref={row1PhotoRef}
                className="w-full overflow-hidden shadow-sm border border-[#E5E5E5] cs-photo-box"
                style={{ aspectRatio: `${imgRatios[0] || 1024 / 687}` }}
              >
                <img
                  src={cl(cards[0].img, 1920)}
                  alt={cards[0].title}
                  width={1024}
                  height={687}
                  loading="lazy"
                  decoding="async"
                  onLoad={(e) => {
                    const { naturalWidth, naturalHeight } = e.currentTarget;
                    if (naturalWidth && naturalHeight) {
                      handleImageLoad(0, naturalWidth / naturalHeight);
                    }
                  }}
                  className="w-full h-full object-cover block cs-photo-img"
                />
              </div>
              <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-snug mt-6 mb-3 cs-text-item">
                {cards[0].title}
              </h3>
              <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[var(--blue)] font-normal cs-text-item">
                {cards[0].text}
              </p>
            </div>

            {/* In the gap between the two cells of Row 1: connector at photo mid-height */}
            <div
              className="cs-connector absolute pointer-events-none z-10 flex items-center justify-center"
              style={{
                left: "50%",
                top: `${row1PhotoMidY}px`,
                transform: "translate(-50%, -50%)",
                width: "72px",
              }}
            >
              <div className="cs-connector-line w-[48px] h-[1px] bg-[var(--blue)] origin-left" />
              <div className="cs-connector-circle -ml-[12px] w-[28px] h-[28px] rounded-full border border-[var(--blue)] bg-white text-[var(--blue)] flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg
                  className="cs-connector-chevron w-[14px] h-[14px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>

            {/* Cell 2: photo (real shape), title, text */}
            <div className="cs-cell cs-cell-2 flex flex-col justify-start">
              <div
                className="w-full overflow-hidden shadow-sm border border-[#E5E5E5] cs-photo-box"
                style={{ aspectRatio: `${imgRatios[1] || 1024 / 687}` }}
              >
                <img
                  src={cl(cards[1].img, 1920)}
                  alt={cards[1].title}
                  width={1024}
                  height={687}
                  loading="lazy"
                  decoding="async"
                  onLoad={(e) => {
                    const { naturalWidth, naturalHeight } = e.currentTarget;
                    if (naturalWidth && naturalHeight) {
                      handleImageLoad(1, naturalWidth / naturalHeight);
                    }
                  }}
                  className="w-full h-full object-cover block cs-photo-img"
                />
              </div>
              <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-snug mt-6 mb-3 cs-text-item">
                {cards[1].title}
              </h3>
              <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[var(--blue)] font-normal cs-text-item">
                {cards[1].text}
              </p>
            </div>
          </div>

          {/* Between the two rows: a full-width 1px line with a centered 36px circle holding an arrow-down */}
          <div
            ref={dividerRef}
            className="cs-divider relative w-full h-[36px] my-10 flex items-center justify-center"
          >
            <div className="cs-divider-line absolute left-0 right-0 h-[1px] bg-[var(--blue)] z-[1]" />
            <div className="cs-divider-circle relative z-[2] w-[36px] h-[36px] rounded-full border border-[var(--blue)] bg-white text-[var(--blue)] flex items-center justify-center shadow-sm">
              <svg
                className="cs-divider-arrow w-[16px] h-[16px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </div>
          </div>

          {/* Row 2 */}
          <div
            ref={row2Ref}
            className="cs-desktop-row relative grid grid-cols-2 gap-x-[72px] text-left"
          >
            {/* Cell 3: photo (real shape), title, text */}
            <div className="cs-cell cs-cell-1 flex flex-col justify-start">
              <div
                ref={row2PhotoRef}
                className="w-full overflow-hidden shadow-sm border border-[#E5E5E5] cs-photo-box"
                style={{ aspectRatio: `${imgRatios[2] || 1024 / 687}` }}
              >
                <img
                  src={cl(cards[2].img, 1920)}
                  alt={cards[2].title}
                  width={1024}
                  height={687}
                  loading="lazy"
                  decoding="async"
                  onLoad={(e) => {
                    const { naturalWidth, naturalHeight } = e.currentTarget;
                    if (naturalWidth && naturalHeight) {
                      handleImageLoad(2, naturalWidth / naturalHeight);
                    }
                  }}
                  className="w-full h-full object-cover block cs-photo-img"
                />
              </div>
              <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-snug mt-6 mb-3 cs-text-item">
                {cards[2].title}
              </h3>
              <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[var(--blue)] font-normal cs-text-item">
                {cards[2].text}
              </p>
            </div>

            {/* In the gap between the two cells of Row 2: connector at photo mid-height */}
            <div
              className="cs-connector absolute pointer-events-none z-10 flex items-center justify-center"
              style={{
                left: "50%",
                top: `${row2PhotoMidY}px`,
                transform: "translate(-50%, -50%)",
                width: "72px",
              }}
            >
              <div className="cs-connector-line w-[48px] h-[1px] bg-[var(--blue)] origin-left" />
              <div className="cs-connector-circle -ml-[12px] w-[28px] h-[28px] rounded-full border border-[var(--blue)] bg-white text-[var(--blue)] flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg
                  className="cs-connector-chevron w-[14px] h-[14px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>

            {/* Cell 4: photo (real shape), title, text */}
            <div className="cs-cell cs-cell-2 flex flex-col justify-start">
              <div
                className="w-full overflow-hidden shadow-sm border border-[#E5E5E5] cs-photo-box"
                style={{ aspectRatio: `${imgRatios[3] || 1024 / 687}` }}
              >
                <img
                  src={cl(cards[3].img, 1920)}
                  alt={cards[3].title}
                  width={1024}
                  height={687}
                  loading="lazy"
                  decoding="async"
                  onLoad={(e) => {
                    const { naturalWidth, naturalHeight } = e.currentTarget;
                    if (naturalWidth && naturalHeight) {
                      handleImageLoad(3, naturalWidth / naturalHeight);
                    }
                  }}
                  className="w-full h-full object-cover block cs-photo-img"
                />
              </div>
              <h3 className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-snug mt-6 mb-3 cs-text-item">
                {cards[3].title}
              </h3>
              <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[var(--blue)] font-normal cs-text-item">
                {cards[3].text}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet: Stacked One Column */}
        {/* Full-width photo, title, text. Between blocks: a 32px circle with an arrow-down on a 1px line. */}
        <div className="lg:hidden flex flex-col text-left cs-mobile">
          {cards.map((c, idx) => (
            <React.Fragment key={idx}>
              <div className="cs-mobile-block flex flex-col justify-start">
                {/* Full-width photo at real shape */}
                <div
                  className="w-full overflow-hidden shadow-sm border border-[#E5E5E5] cs-photo-box"
                  style={{ aspectRatio: `${imgRatios[idx] || 1024 / 687}` }}
                >
                  <img
                    src={cl(c.img, 2560)}
                    alt={c.title}
                    width={1024}
                    height={687}
                    loading="lazy"
                    decoding="async"
                    onLoad={(e) => {
                      const { naturalWidth, naturalHeight } = e.currentTarget;
                      if (naturalWidth && naturalHeight) {
                        handleImageLoad(idx, naturalWidth / naturalHeight);
                      }
                    }}
                    className="w-full h-full object-cover block cs-photo-img"
                  />
                </div>

                {/* Title: bold, ink colour, sentence case */}
                <h3 className="text-[17px] font-bold text-[#0A0A0A] leading-snug mt-5 mb-2 cs-text-item">
                  {c.title}
                </h3>

                {/* Text: the blue of the One-Step body text (var(--blue)), regular weight */}
                <p className="text-[15px] leading-[1.6] text-[var(--blue)] font-normal cs-text-item">
                  {c.text}
                </p>
              </div>

              {/* Between blocks: a 32px circle with an arrow-down on a 1px line */}
              {idx < cards.length - 1 && (
                <div className="cs-mobile-connector relative w-full h-[32px] my-8 flex items-center justify-center">
                  <div className="cs-mobile-line absolute left-0 right-0 h-[1px] bg-[var(--blue)] z-[1]" />
                  <div className="cs-mobile-circle relative z-[2] w-[32px] h-[32px] rounded-full border border-[var(--blue)] bg-white text-[var(--blue)] flex items-center justify-center shadow-sm">
                    <svg
                      className="w-[14px] h-[14px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <polyline points="19 12 12 19 5 12" />
                    </svg>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* 3. Frequently Asked Questions: TEXT STYLE & ACCORDION recipe */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y-lg)] border-t border-[#E5E5E5] text-left max-w-[1340px] mx-auto">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-[16px] lg:text-[44px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="w-full divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
              {data.faq.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                const panelId = `cold-storage-faq-panel-${idx}`;
                const headerId = `cold-storage-faq-header-${idx}`;

                return (
                  <div key={idx} className="group overflow-hidden">
                    <button
                      id={headerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full min-h-[48px] py-5 lg:py-6 flex items-center justify-between text-left cursor-pointer transition-colors"
                    >
                      <span className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-snug pr-4">
                        {item.q}
                      </span>
                      <span
                        className={`flex-shrink-0 w-8 h-8 rounded-full border border-[var(--blue)] flex items-center justify-center text-[var(--blue)] font-bold text-[18px] transition-transform duration-300 ${
                          isOpen ? "rotate-45 bg-[var(--blue)] text-white" : "bg-white"
                        }`}
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </button>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={headerId}
                      className="overflow-hidden"
                      style={{
                        display: "grid",
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                        opacity: isOpen ? 1 : 0,
                        transition:
                          "grid-template-rows 600ms cubic-bezier(.16, 1, .3, 1), opacity 400ms cubic-bezier(.16, 1, .3, 1) 150ms",
                      }}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <p className="pb-6 text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[var(--blue)] font-normal max-w-[680px]">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. Next Banner */}
      <NextBand
        image={COLD_STORAGE_IMAGES.next}
        nextUrl="/steel-warehouses-pakistan/grain-and-wheat-warehouses/"
        nextTitle="Grain and Wheat Warehouses"
      />
    </article>
  );
};

// 9.16 Grain and Wheat Warehouses — signature: "Story slideshow"
export const GrainWarehousesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const grainImages = [
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202372/grain-1.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202372/grain-2.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202374/grain-3.jpg",
  ];

  const slides = [
    {
      title: sections[0]?.title || "What Grain Storage Needs",
      text:
        sections[0]?.text ||
        "Grain must stay dry and cool. Moisture causes mold, insects and heat inside the pile. The building needs a tight roof, good ventilation and strong walls that can hold the sideways push of grain.",
      img: grainImages[0],
    },
    {
      title: sections[1]?.title || "Design Points",
      text:
        sections[1]?.text ||
        "Stored grain pushes on the walls, so the wall frames and bracing are designed for this load. Ridge vents and louvers keep air moving above the grain. A leak-free roof with good sheet laps and trims keeps the wheat dry. A raised, sealed floor limits moisture from the ground. Wide doors and driveways allow trucks and loaders to enter. Grain dust and moisture can attack steel, so a good coating extends the life of the frame. See Painting.",
      img: grainImages[1],
    },
    {
      title: sections[2]?.title || "Why Steel",
      text:
        sections[2]?.text ||
        "A steel grain warehouse is quick to build, which matters before the harvest and procurement seasons. Large clear spans give you the volume you need without inner columns.",
      img: grainImages[2],
    },
  ];

  const AUTOPLAY_MS = 6000;
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const activeIdxRef = useRef(0);
  const isPausedRef = useRef(false);

  // Desktop refs
  const desktopLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const desktopTabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const desktopUnderlineRef = useRef<HTMLDivElement | null>(null);
  const desktopCaptionTitleRef = useRef<HTMLHeadingElement | null>(null);
  const desktopCaptionTextRef = useRef<HTMLParagraphElement | null>(null);
  const desktopFrameRef = useRef<HTMLDivElement | null>(null);
  const desktopProgressRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Mobile refs
  const mobileLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const mobileTabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileUnderlineRef = useRef<HTMLDivElement | null>(null);
  const mobileCaptionTitleRef = useRef<HTMLHeadingElement | null>(null);
  const mobileCaptionTextRef = useRef<HTMLParagraphElement | null>(null);
  const mobileFrameRef = useRef<HTMLDivElement | null>(null);
  const mobileProgressRefs = useRef<(HTMLDivElement | null)[]>([]);

  const swapTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const captionTweenRef = useRef<gsap.core.Tween | null>(null);
  const autoplayProgressTweenRef = useRef<gsap.core.Tween | null>(null);

  // Pointer drag gestures
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const hasHorizontalIntentRef = useRef<boolean | null>(null);

  const mobileTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const mobileIsDraggingRef = useRef(false);
  const mobileHasHorizontalIntentRef = useRef<boolean | null>(null);

  const prefersReducedRef = useRef(false);

  // Check reduced motion
  useEffect(() => {
    prefersReducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Preload and decode images before first swap, refresh triggers when fonts/images ready (RULE f)
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

    const allUrls = [
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202373/grain-hero.jpg",
      ...grainImages,
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202373/grain-next.jpg",
    ];

    allUrls.forEach((src) => {
      const img = new Image();
      img.src = cl(src, 1920);
      if (img.decode) {
        img.decode().then(debouncedRefresh).catch(() => {});
      } else {
        img.onload = debouncedRefresh;
      }
    });

    return () => clearTimeout(timer);
  }, []);

  // Synchronized update for tab underlines (Desktop & Mobile)
  const updateBothUnderlines = useCallback((targetIdx: number) => {
    // Desktop underline
    const dTab = desktopTabRefs.current[targetIdx];
    const dUnderline = desktopUnderlineRef.current;
    if (dTab && dUnderline && dTab.offsetWidth > 0) {
      if (prefersReducedRef.current) {
        gsap.set(dUnderline, { x: dTab.offsetLeft, scaleX: dTab.offsetWidth });
      } else {
        gsap.to(dUnderline, {
          x: dTab.offsetLeft,
          scaleX: dTab.offsetWidth,
          duration: 0.4,
          ease: "E1",
          overwrite: "auto",
        });
      }
    }

    // Mobile underline
    const mTab = mobileTabRefs.current[targetIdx];
    const mUnderline = mobileUnderlineRef.current;
    if (mTab && mUnderline && mTab.offsetWidth > 0) {
      if (prefersReducedRef.current) {
        gsap.set(mUnderline, { x: mTab.offsetLeft, scaleX: mTab.offsetWidth });
      } else {
        gsap.to(mUnderline, {
          x: mTab.offsetLeft,
          scaleX: mTab.offsetWidth,
          duration: 0.4,
          ease: "E1",
          overwrite: "auto",
        });
      }
    }
  }, []);

  // Synchronized update for progress bars (Desktop & Mobile)
  const updateProgressBars = useCallback((idx: number, isManual: boolean) => {
    if (autoplayProgressTweenRef.current) {
      autoplayProgressTweenRef.current.kill();
    }

    const allBarGroups = [desktopProgressRefs.current, mobileProgressRefs.current];
    allBarGroups.forEach((group) => {
      group.forEach((bar, i) => {
        if (!bar) return;
        if (i < idx) {
          gsap.set(bar, { scaleX: 1 });
        } else if (i > idx) {
          gsap.set(bar, { scaleX: 0 });
        }
      });
    });

    const activeBars = [
      desktopProgressRefs.current[idx],
      mobileProgressRefs.current[idx],
    ].filter(Boolean) as HTMLElement[];

    if (!activeBars.length) return;

    if (prefersReducedRef.current) {
      activeBars.forEach((bar) => gsap.set(bar, { scaleX: 1 }));
      return;
    }

    const duration = isManual ? 0.6 : AUTOPLAY_MS / 1000;
    const ease = isManual ? "E1" : "none";

    activeBars.forEach((bar) => gsap.set(bar, { scaleX: 0 }));
    autoplayProgressTweenRef.current = gsap.to(activeBars, {
      scaleX: 1,
      duration,
      ease,
      overwrite: "auto",
    });
  }, []);

  // Caption cross-fade: old out 250ms E1, new in 500ms E1 with y 12 to 0 (Desktop & Mobile)
  const animateCaption = useCallback(
    (nextIdx: number) => {
      const titles = [
        desktopCaptionTitleRef.current,
        mobileCaptionTitleRef.current,
      ].filter(Boolean) as HTMLElement[];
      const texts = [
        desktopCaptionTextRef.current,
        mobileCaptionTextRef.current,
      ].filter(Boolean) as HTMLElement[];

      if (!titles.length && !texts.length) return;

      if (prefersReducedRef.current) {
        titles.forEach((el) => {
          el.textContent = slides[nextIdx].title.toUpperCase();
        });
        texts.forEach((el) => {
          el.textContent = slides[nextIdx].text;
        });
        return;
      }

      if (captionTweenRef.current) {
        captionTweenRef.current.kill();
      }

      const allCaptionEls = [...titles, ...texts];
      captionTweenRef.current = gsap.to(allCaptionEls, {
        opacity: 0,
        duration: 0.25,
        ease: "E1",
        overwrite: "auto",
        onComplete: () => {
          titles.forEach((el) => {
            el.textContent = slides[nextIdx].title.toUpperCase();
          });
          texts.forEach((el) => {
            el.textContent = slides[nextIdx].text;
          });
          gsap.fromTo(
            allCaptionEls,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "E1",
              overwrite: "auto",
              clearProps: "transform",
            }
          );
        },
      });
    },
    [slides]
  );

  // SWAP recipe for slide change (Unified for Desktop and Mobile)
  const goToSlide = useCallback(
    (nextIdx: number, isManual = true) => {
      if (nextIdx === activeIdxRef.current) return;
      const prevIdx = activeIdxRef.current;
      activeIdxRef.current = nextIdx;
      setActiveIdx(nextIdx);

      // Reduced motion fast path
      if (prefersReducedRef.current) {
        desktopLayerRefs.current.forEach((layer, i) => {
          if (!layer) return;
          if (i === nextIdx) {
            gsap.set(layer, {
              clipPath: "inset(0 0 0% 0)",
              zIndex: 1,
              visibility: "visible",
            });
          } else {
            gsap.set(layer, { zIndex: 0, visibility: "hidden" });
          }
        });
        mobileLayerRefs.current.forEach((layer, i) => {
          if (!layer) return;
          if (i === nextIdx) {
            gsap.set(layer, {
              clipPath: "inset(0 0 0% 0)",
              zIndex: 1,
              visibility: "visible",
            });
          } else {
            gsap.set(layer, { zIndex: 0, visibility: "hidden" });
          }
        });

        if (desktopCaptionTitleRef.current)
          desktopCaptionTitleRef.current.textContent = slides[nextIdx].title.toUpperCase();
        if (desktopCaptionTextRef.current)
          desktopCaptionTextRef.current.textContent = slides[nextIdx].text;
        if (mobileCaptionTitleRef.current)
          mobileCaptionTitleRef.current.textContent = slides[nextIdx].title.toUpperCase();
        if (mobileCaptionTextRef.current)
          mobileCaptionTextRef.current.textContent = slides[nextIdx].text;

        updateBothUnderlines(nextIdx);
        updateProgressBars(nextIdx, isManual);
        return;
      }

      // Finish running wipe instantly if user clicked or swiped fast
      if (swapTimelineRef.current) {
        swapTimelineRef.current.progress(1);
      }

      const dInLayer = desktopLayerRefs.current[nextIdx];
      const dInImg = desktopImgRefs.current[nextIdx];
      const dOutLayer = desktopLayerRefs.current[prevIdx];

      const mInLayer = mobileLayerRefs.current[nextIdx];
      const mInImg = mobileImgRefs.current[nextIdx];
      const mOutLayer = mobileLayerRefs.current[prevIdx];

      const incomingLayers = [dInLayer, mInLayer].filter(Boolean) as HTMLElement[];
      const incomingImgs = [dInImg, mInImg].filter(Boolean) as HTMLElement[];
      const outgoingLayers = [dOutLayer, mOutLayer].filter(Boolean) as HTMLElement[];

      // Outgoing layers stay fully visible underneath until wipe ends
      outgoingLayers.forEach((layer) => {
        gsap.set(layer, { zIndex: 1, visibility: "visible" });
      });

      // Incoming layers start with clipPath inset(0 0 100% 0), z-index 2
      incomingLayers.forEach((layer) => {
        gsap.set(layer, {
          zIndex: 2,
          visibility: "visible",
          clipPath: "inset(0 0 100% 0)",
        });
      });
      incomingImgs.forEach((img) => {
        gsap.set(img, {
          scale: 1.08,
          transformOrigin: "center center",
        });
      });

      const tl = gsap.timeline({
        onStart: () => {
          incomingLayers.forEach((layer) => gsap.set(layer, { willChange: "clip-path" }));
          incomingImgs.forEach((img) => gsap.set(img, { willChange: "transform" }));
        },
        onComplete: () => {
          incomingLayers.forEach((layer) =>
            gsap.set(layer, { zIndex: 1, clearProps: "willChange" })
          );
          incomingImgs.forEach((img) =>
            gsap.set(img, { clearProps: "willChange,scale" })
          );
          outgoingLayers.forEach((layer) =>
            gsap.set(layer, { visibility: "hidden", zIndex: 0 })
          );
          swapTimelineRef.current = null;
        },
      });

      // Wipe: 1100ms E2
      incomingLayers.forEach((layer) => {
        tl.to(
          layer,
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.1,
            ease: "E2",
            overwrite: "auto",
          },
          0
        );
      });

      // Inner img: scale 1.08 to 1 over 1600ms E1
      incomingImgs.forEach((img) => {
        tl.to(
          img,
          {
            scale: 1,
            duration: 1.6,
            ease: "E1",
            overwrite: "auto",
          },
          0
        );
      });

      swapTimelineRef.current = tl;

      // Caption cross-fade at same moment
      animateCaption(nextIdx);

      // Tab underline
      updateBothUnderlines(nextIdx);

      // Progress bars
      updateProgressBars(nextIdx, isManual);
    },
    [slides, animateCaption, updateBothUnderlines, updateProgressBars]
  );

  // Initial layout & resize measurement
  useIsomorphicLayoutEffect(() => {
    // Initial states: slide 0 visible, others hidden (Desktop & Mobile)
    const initLayerGroup = (group: (HTMLDivElement | null)[]) => {
      group.forEach((layer, i) => {
        if (!layer) return;
        if (i === 0) {
          gsap.set(layer, {
            clipPath: "inset(0 0 0% 0)",
            zIndex: 1,
            visibility: "visible",
          });
        } else {
          gsap.set(layer, {
            clipPath: "inset(0 0 100% 0)",
            zIndex: 0,
            visibility: "hidden",
          });
        }
      });
    };

    initLayerGroup(desktopLayerRefs.current);
    initLayerGroup(mobileLayerRefs.current);

    // Initial underlines
    const dTab = desktopTabRefs.current[0];
    const dUnderline = desktopUnderlineRef.current;
    if (dTab && dUnderline && dTab.offsetWidth > 0) {
      gsap.set(dUnderline, {
        x: dTab.offsetLeft,
        scaleX: dTab.offsetWidth,
      });
    }

    const mTab = mobileTabRefs.current[0];
    const mUnderline = mobileUnderlineRef.current;
    if (mTab && mUnderline && mTab.offsetWidth > 0) {
      gsap.set(mUnderline, {
        x: mTab.offsetLeft,
        scaleX: mTab.offsetWidth,
      });
    }

    updateProgressBars(0, false);

    const onResize = () => {
      updateBothUnderlines(activeIdxRef.current);
    };

    window.addEventListener("resize", onResize);
    if (document.fonts?.ready) {
      document.fonts.ready.then(onResize);
    }

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [updateBothUnderlines, updateProgressBars]);

  // Autoplay loop with pause on hover / touch, disabled on reduced motion
  useEffect(() => {
    isPausedRef.current = isPaused;
    if (prefersReducedRef.current) return;

    if (isPaused) {
      if (autoplayProgressTweenRef.current) {
        autoplayProgressTweenRef.current.pause();
      }
      return;
    }

    if (autoplayProgressTweenRef.current) {
      autoplayProgressTweenRef.current.resume();
    }

    const interval = setInterval(() => {
      if (!isPausedRef.current) {
        const next = (activeIdxRef.current + 1) % slides.length;
        goToSlide(next, false);
      }
    }, AUTOPLAY_MS);

    return () => clearInterval(interval);
  }, [isPaused, slides.length, goToSlide]);

  // Desktop Pointer gestures (threshold 40px, touch-action: pan-y)
  const onDesktopPointerDown = (e: React.PointerEvent) => {
    touchStartRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = true;
    hasHorizontalIntentRef.current = null;
    setIsPaused(true);
  };

  const onDesktopPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !touchStartRef.current) return;
    const dx = e.clientX - touchStartRef.current.x;
    const dy = e.clientY - touchStartRef.current.y;

    if (hasHorizontalIntentRef.current === null) {
      if (Math.abs(dx) > 7 || Math.abs(dy) > 7) {
        hasHorizontalIntentRef.current = Math.abs(dx) >= Math.abs(dy);
      }
    }

    if (hasHorizontalIntentRef.current && desktopFrameRef.current) {
      gsap.set(desktopFrameRef.current, { x: dx });
    }
  };

  const onDesktopPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !touchStartRef.current) return;
    const dx = e.clientX - touchStartRef.current.x;
    isDraggingRef.current = false;
    setIsPaused(false);

    if (hasHorizontalIntentRef.current && Math.abs(dx) >= 40) {
      if (desktopFrameRef.current) gsap.set(desktopFrameRef.current, { x: 0 });
      if (dx < 0) {
        goToSlide((activeIdxRef.current + 1) % slides.length, true);
      } else {
        goToSlide((activeIdxRef.current - 1 + slides.length) % slides.length, true);
      }
    } else if (desktopFrameRef.current) {
      gsap.to(desktopFrameRef.current, { x: 0, duration: 0.3, ease: "E1" });
    }

    touchStartRef.current = null;
    hasHorizontalIntentRef.current = null;
  };

  // Mobile Pointer gestures (threshold 40px, touch-action: pan-y)
  const onMobilePointerDown = (e: React.PointerEvent) => {
    mobileTouchStartRef.current = { x: e.clientX, y: e.clientY };
    mobileIsDraggingRef.current = true;
    mobileHasHorizontalIntentRef.current = null;
    setIsPaused(true);
  };

  const onMobilePointerMove = (e: React.PointerEvent) => {
    if (!mobileIsDraggingRef.current || !mobileTouchStartRef.current) return;
    const dx = e.clientX - mobileTouchStartRef.current.x;
    const dy = e.clientY - mobileTouchStartRef.current.y;

    if (mobileHasHorizontalIntentRef.current === null) {
      if (Math.abs(dx) > 7 || Math.abs(dy) > 7) {
        mobileHasHorizontalIntentRef.current = Math.abs(dx) >= Math.abs(dy);
      }
    }

    if (mobileHasHorizontalIntentRef.current && mobileFrameRef.current) {
      gsap.set(mobileFrameRef.current, { x: dx });
    }
  };

  const onMobilePointerUp = (e: React.PointerEvent) => {
    if (!mobileIsDraggingRef.current || !mobileTouchStartRef.current) return;
    const dx = e.clientX - mobileTouchStartRef.current.x;
    mobileIsDraggingRef.current = false;
    setIsPaused(false);

    if (mobileHasHorizontalIntentRef.current && Math.abs(dx) >= 40) {
      if (mobileFrameRef.current) gsap.set(mobileFrameRef.current, { x: 0 });
      if (dx < 0) {
        goToSlide((activeIdxRef.current + 1) % slides.length, true);
      } else {
        goToSlide((activeIdxRef.current - 1 + slides.length) % slides.length, true);
      }
    } else if (mobileFrameRef.current) {
      gsap.to(mobileFrameRef.current, { x: 0, duration: 0.3, ease: "E1" });
    }

    mobileTouchStartRef.current = null;
    mobileHasHorizontalIntentRef.current = null;
  };

  return (
    <article className="w-full bg-white text-[var(--ink)]">
      {/* 1. Hero Band (Capitalized Heading) */}
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792202373/grain-hero.jpg"
        imageAlt={data.h1.toUpperCase()}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* 2. Content & Slideshow Section */}
      <section className="container py-[var(--sec-y-lg)]">
        {/* DESKTOP VIEW (min-width: 1024px) */}
        {/* Desktop is good. Keep the slideshow.
            1. Delete the "03 / 03" label and any number.
            2. Delete the drop shadow on the frame.
            3. The three outlined buttons below become plain text tabs (same words, title style): a 1px line under the row, and a 2px blue line under the active tab that slides. No boxes.
            4. The caption (title left, text right) has no box; use TEXT STYLE. */}
        <div
          className="hidden lg:block max-w-[1040px] mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slideshow Frame (Aspect 1024/687 matches natural photo dimensions; NO drop shadow, NO numbers) */}
          <div
            ref={desktopFrameRef}
            onPointerDown={onDesktopPointerDown}
            onPointerMove={onDesktopPointerMove}
            onPointerUp={onDesktopPointerUp}
            onPointerCancel={onDesktopPointerUp}
            style={{ touchAction: "pan-y" }}
            className="relative w-full aspect-[1024/687] overflow-hidden bg-slate-950 select-none cursor-grab active:cursor-grabbing shadow-none"
          >
            {slides.map((s, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  desktopLayerRefs.current[idx] = el;
                }}
                className="absolute inset-0 w-full h-full overflow-hidden"
              >
                <img
                  ref={(el) => {
                    desktopImgRefs.current[idx] = el;
                  }}
                  src={cl(s.img, 1920)}
                  alt={s.title}
                  width={1024}
                  height={687}
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-cover object-center pointer-events-none"
                />
              </div>
            ))}

            {/* Desktop Top Progress Bars inside frame (clean line, no boxes) */}
            <div className="absolute top-4 inset-x-6 z-20 flex gap-2 pointer-events-none">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className="h-[3px] flex-1 bg-white/30 overflow-hidden rounded-full"
                >
                  <div
                    ref={(el) => {
                      desktopProgressRefs.current[idx] = el;
                    }}
                    className="h-full bg-white origin-left"
                    style={{ transform: "scaleX(0)" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Caption (Title left, text right; NO box; One-Step TEXT STYLE) */}
          <div className="mt-8 grid grid-cols-12 gap-8 text-left items-start">
            <div className="col-span-5">
              <h3
                ref={desktopCaptionTitleRef}
                className="font-bold uppercase text-[#0A0A0A] text-[20px] lg:text-[22px] leading-[1.25] tracking-[-0.01em]"
              >
                {slides[0]?.title.toUpperCase()}
              </h3>
            </div>
            <div className="col-span-7">
              <p
                ref={desktopCaptionTextRef}
                className="text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.7] font-normal"
              >
                {slides[0]?.text}
              </p>
            </div>
          </div>

          {/* Desktop Plain Text Tabs: 1px line under row, 2px blue line under active tab that slides. No boxes! */}
          <div className="mt-8 border-b border-[#E5E5E5] relative flex overflow-x-auto scrollbar-none gap-8">
            {slides.map((s, idx) => (
              <button
                key={idx}
                ref={(el) => {
                  desktopTabRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => goToSlide(idx, true)}
                className="pb-3 px-4 first:pl-0 font-bold uppercase text-[18px] lg:text-[20px] text-[#0A0A0A] cursor-pointer whitespace-nowrap bg-transparent border-0 transition-colors focus-visible:outline-none"
              >
                {s.title.toUpperCase()}
              </button>
            ))}

            {/* 2px sliding blue line under active tab */}
            <div
              ref={desktopUnderlineRef}
              className="absolute bottom-0 left-0 h-[2px] bg-[var(--blue)] transform-gpu origin-left pointer-events-none"
              style={{ width: "1px" }}
            />
          </div>
        </div>

        {/* MOBILE VIEW (max-width: 1023px) */}
        {/* Mobile: swipe slideshow.
            Under the photo: 3 progress bars (4px, 8px gap).
            Under them the caption of the current slide: its own title and its own text.
            Delete the button boxes; use the same plain text tabs in one horizontal row. */}
        <div className="lg:hidden w-full max-w-[640px] mx-auto flex flex-col text-left">
          {/* Mobile Swipe Slideshow (real shape, pointer events, follows finger x) */}
          <div
            ref={mobileFrameRef}
            onPointerDown={onMobilePointerDown}
            onPointerMove={onMobilePointerMove}
            onPointerUp={onMobilePointerUp}
            onPointerCancel={onMobilePointerUp}
            style={{ touchAction: "pan-y" }}
            className="relative w-full aspect-[1024/687] overflow-hidden bg-slate-950 select-none cursor-grab active:cursor-grabbing shadow-none"
          >
            {slides.map((s, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  mobileLayerRefs.current[idx] = el;
                }}
                className="absolute inset-0 w-full h-full overflow-hidden"
              >
                <img
                  ref={(el) => {
                    mobileImgRefs.current[idx] = el;
                  }}
                  src={cl(s.img, 1920)}
                  alt={s.title}
                  width={1024}
                  height={687}
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-cover object-center pointer-events-none"
                />
              </div>
            ))}
          </div>

          {/* Under the photo: 3 progress bars (4px, 8px gap) */}
          <div className="mt-4 flex gap-2 w-full">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className="h-[4px] flex-1 bg-[#E5E5E5] overflow-hidden rounded-full relative"
              >
                <div
                  ref={(el) => {
                    mobileProgressRefs.current[idx] = el;
                  }}
                  className="h-full bg-[var(--blue)] origin-left"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
            ))}
          </div>

          {/* Under progress bars: caption of the current slide (its own title, its own text) */}
          <div className="mt-6 flex flex-col gap-2 text-left">
            <h3
              ref={mobileCaptionTitleRef}
              className="font-bold uppercase text-[#0A0A0A] text-[17px] leading-snug tracking-[-0.01em]"
            >
              {slides[0]?.title.toUpperCase()}
            </h3>
            <p
              ref={mobileCaptionTextRef}
              className="text-[15px] text-[var(--blue)] leading-[1.6] font-normal"
            >
              {slides[0]?.text}
            </p>
          </div>

          {/* Under caption: Plain text tabs in one horizontal row (same words, title style).
              A 1px line under the row, 2px blue line under active tab that slides. Delete button boxes! */}
          <div className="mt-6 border-b border-[#E5E5E5] relative flex overflow-x-auto scrollbar-none gap-6 pb-0">
            {slides.map((s, idx) => (
              <button
                key={idx}
                ref={(el) => {
                  mobileTabRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => goToSlide(idx, true)}
                className="pb-2.5 font-bold uppercase text-[15px] sm:text-[17px] text-[#0A0A0A] cursor-pointer whitespace-nowrap bg-transparent border-0 transition-colors focus-visible:outline-none flex-shrink-0"
              >
                {s.title.toUpperCase()}
              </button>
            ))}

            {/* 2px sliding blue line under active tab */}
            <div
              ref={mobileUnderlineRef}
              className="absolute bottom-0 left-0 h-[2px] bg-[var(--blue)] transform-gpu origin-left pointer-events-none"
              style={{ width: "1px" }}
            />
          </div>
        </div>
      </section>

      {/* 3. FAQ Section: Accordion recipe & Text Style */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="font-bold text-[#0A0A0A] uppercase text-[16px] lg:text-[44px] leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8 md:mb-10">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="w-full divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
              {data.faq.map((item, idx) => {
                const isOpen = openFaqIndex === idx;

                return (
                  <div key={idx} className="w-full">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() =>
                        setOpenFaqIndex((prev) => (prev === idx ? null : idx))
                      }
                      className="w-full min-h-[48px] py-4 lg:py-5 flex items-center justify-between text-left cursor-pointer group focus-visible:outline-none"
                    >
                      <span className="font-bold text-[#0A0A0A] text-[15px] lg:text-[18px] pr-6 leading-snug">
                        {item.q}
                      </span>

                      {/* Rotating Plus Icon (0 to 45deg over 400ms E1) */}
                      <span
                        className="relative flex-shrink-0 w-6 h-6 flex items-center justify-center transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        }}
                      >
                        <span className="absolute w-[16px] h-[2px] bg-[var(--blue)]" />
                        <span className="absolute h-[16px] w-[2px] bg-[var(--blue)]" />
                      </span>
                    </button>

                    {/* Accordion panel: grid-template-rows 0fr to 1fr over 600ms E1 */}
                    <div
                      className="grid transition-[grid-template-rows] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                      }}
                    >
                      <div className="overflow-hidden">
                        <p
                          className="pt-2 pb-5 text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.65] font-normal max-w-[800px] transition-opacity duration-400 delay-150"
                          style={{ opacity: isOpen ? 1 : 0 }}
                        >
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. Next Banner (Capitalized Heading & Title) */}
      <NextBand
        heading="WAREHOUSES WITH LOADING DOCKS: FAST TRUCK ACCESS AND AUTOMATED LEVELERS."
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792202373/grain-next.jpg"
        nextUrl="/steel-warehouses-pakistan/warehouses-with-loading-docks/"
        nextTitle="Warehouses with Loading Docks"
      />
    </article>
  );
};

// 9.17 Warehouses with Loading Docks — signature: "Two-column list with Slat Reveal"
export const LoadingDocksLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const dockImages = [
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202367/loading-docks-1.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202367/loading-docks-2.jpg",
    "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202368/loading-docks-3.jpg",
  ];

  const items = [
    {
      title: sections[0]?.title || "Why Dock Design Matters",
      text:
        sections[0]?.text ||
        "Slow loading wastes time and money. A good dock lets a truck back in, load quickly and leave. It also keeps the goods dry and the workers safe.",
      img: dockImages[0],
    },
    {
      title: sections[1]?.title || "Design Points",
      text:
        sections[1]?.text ||
        "The dock floor should match the truck bed height, and the engineer sets the floor level from your fleet. A steel canopy covers trucks against rain and sun. Choose the door size and number from the count of trucks you load at the same time. Allow enough yard depth for trucks to turn and back in. The frame spacing should match the dock door spacing. Bumpers, wheel guides and clear marking reduce accidents.",
      img: dockImages[1],
    },
    {
      title: sections[2]?.title || "Combine With Other Warehouse Types",
      text:
        sections[2]?.text ||
        "Loading docks suit logistics hubs, cold stores and general stores. Tell the engineer how many trucks you expect each day.",
      img: dockImages[2],
    },
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [currentPhoto, setCurrentPhoto] = useState(items[0].img);
  const [incomingPhoto, setIncomingPhoto] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const activeIdxRef = useRef(0);
  const currentPhotoRef = useRef(items[0].img);
  const isHoveredRef = useRef(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerTweenRef = useRef<gsap.core.Tween | null>(null);
  const slatTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const desktopTabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const desktopTimerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopSlatBoxRefs = useRef<(HTMLDivElement | null)[]>([]);

  const mobileTimerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileFrameRef = useRef<HTMLDivElement | null>(null);
  const mobileSlatBoxRefs = useRef<(HTMLDivElement | null)[]>([]);

  const mobileTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const mobileIsDraggingRef = useRef(false);
  const mobileHasHorizontalIntentRef = useRef<boolean | null>(null);

  const prefersReducedRef = useRef(false);

  useEffect(() => {
    prefersReducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Preload and decode images and refresh ScrollTrigger on decode
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

    const allUrls = [
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202368/loading-docks-hero.jpg",
      ...dockImages,
      "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202368/loading-docks-next.jpg",
    ];

    allUrls.forEach((src) => {
      const img = new Image();
      img.src = cl(src, 1920);
      if (img.decode) {
        img.decode().then(debouncedRefresh).catch(() => {});
      } else {
        img.onload = debouncedRefresh;
      }
    });

    return () => clearTimeout(timer);
  }, []);

  // Timer line: 2px line of active item goes scaleX 0 to 1 over 7000ms, ease "none", origin left
  const startTimer = useCallback(
    (idx: number) => {
      if (timerTweenRef.current) {
        timerTweenRef.current.kill();
      }

      // Reset all timer lines
      [desktopTimerRefs.current, mobileTimerRefs.current].forEach((group) => {
        group.forEach((bar) => {
          if (bar) gsap.set(bar, { scaleX: 0 });
        });
      });

      if (prefersReducedRef.current) return;

      const targetTimerBars = [
        desktopTimerRefs.current[idx],
        mobileTimerRefs.current[idx],
      ].filter(Boolean) as HTMLElement[];
      if (!targetTimerBars.length) return;

      targetTimerBars.forEach((bar) => gsap.set(bar, { scaleX: 0 }));

      timerTweenRef.current = gsap.fromTo(
        targetTimerBars,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 7,
          ease: "none",
          transformOrigin: "left center",
          paused: isHoveredRef.current,
          onComplete: () => {
            const next = (activeIdxRef.current + 1) % items.length;
            selectItem(next);
          },
        }
      );
    },
    [items.length]
  );

  // Trigger Slat Reveal
  // Desktop: 6 horizontal slats, 700ms, stagger 70ms, E2
  // Mobile: 6 horizontal slats, 500ms, stagger 50ms, E2
  const triggerSlatReveal = useCallback(
    (nextImgUrl: string, isMobile = false) => {
      if (slatTimelineRef.current) {
        slatTimelineRef.current.progress(1);
      }

      if (prefersReducedRef.current) {
        currentPhotoRef.current = nextImgUrl;
        setCurrentPhoto(nextImgUrl);
        setIncomingPhoto(null);
        return;
      }

      setIncomingPhoto(nextImgUrl);

      requestAnimationFrame(() => {
        const slatBoxes = [
          ...desktopSlatBoxRefs.current,
          ...mobileSlatBoxRefs.current,
        ].filter(Boolean) as HTMLElement[];

        if (slatBoxes.length === 0) {
          currentPhotoRef.current = nextImgUrl;
          setCurrentPhoto(nextImgUrl);
          setIncomingPhoto(null);
          return;
        }

        slatBoxes.forEach((box) => {
          gsap.set(box, { scaleY: 0, transformOrigin: "top center" });
        });

        const duration = isMobile ? 0.5 : 0.7;
        const stagger = isMobile ? 0.05 : 0.07;

        slatTimelineRef.current = gsap.timeline({
          onComplete: () => {
            currentPhotoRef.current = nextImgUrl;
            setCurrentPhoto(nextImgUrl);
            setIncomingPhoto(null);
            slatTimelineRef.current = null;
          },
        });

        slatTimelineRef.current.to(slatBoxes, {
          scaleY: 1,
          duration,
          stagger,
          ease: "E2",
          overwrite: "auto",
        });
      });
    },
    []
  );

  // Select Item
  const selectItem = useCallback(
    (nextIdx: number, isMobile = false) => {
      if (nextIdx === activeIdxRef.current) return;
      activeIdxRef.current = nextIdx;
      setActiveIdx(nextIdx);

      const nextImg = items[nextIdx].img;
      triggerSlatReveal(nextImg, isMobile);
      startTimer(nextIdx);
    },
    [items, triggerSlatReveal, startTimer]
  );

  // Initial timer start
  useEffect(() => {
    startTimer(0);
    return () => {
      if (timerTweenRef.current) timerTweenRef.current.kill();
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, [startTimer]);

  // Hover handlers for 120ms delay on desktop
  const handleItemMouseEnter = (idx: number) => {
    isHoveredRef.current = true;
    if (timerTweenRef.current) timerTweenRef.current.pause();

    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (idx !== activeIdxRef.current) {
      hoverTimeoutRef.current = setTimeout(() => {
        selectItem(idx, false);
      }, 120);
    }
  };

  const handleItemMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  const handleContainerMouseEnter = () => {
    isHoveredRef.current = true;
    if (timerTweenRef.current) timerTweenRef.current.pause();
  };

  const handleContainerMouseLeave = () => {
    isHoveredRef.current = false;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (timerTweenRef.current) timerTweenRef.current.resume();
  };

  // Keyboard navigation for tablist (desktop)
  const handleKeyDown = (e: React.KeyboardEvent, currentIdx: number) => {
    let nextIdx = currentIdx;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      nextIdx = (currentIdx + 1) % items.length;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      nextIdx = (currentIdx - 1 + items.length) % items.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIdx = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIdx = items.length - 1;
    }

    if (nextIdx !== currentIdx) {
      selectItem(nextIdx, false);
      desktopTabRefs.current[nextIdx]?.focus();
    }
  };

  // Mobile Swipe Gestures
  const onMobilePointerDown = (e: React.PointerEvent) => {
    mobileTouchStartRef.current = { x: e.clientX, y: e.clientY };
    mobileIsDraggingRef.current = true;
    mobileHasHorizontalIntentRef.current = null;
    isHoveredRef.current = true;
    if (timerTweenRef.current) timerTweenRef.current.pause();
  };

  const onMobilePointerMove = (e: React.PointerEvent) => {
    if (!mobileIsDraggingRef.current || !mobileTouchStartRef.current) return;
    const dx = e.clientX - mobileTouchStartRef.current.x;
    const dy = e.clientY - mobileTouchStartRef.current.y;

    if (mobileHasHorizontalIntentRef.current === null) {
      if (Math.abs(dx) > 7 || Math.abs(dy) > 7) {
        mobileHasHorizontalIntentRef.current = Math.abs(dx) >= Math.abs(dy);
      }
    }

    if (mobileHasHorizontalIntentRef.current && mobileFrameRef.current) {
      gsap.set(mobileFrameRef.current, { x: dx });
    }
  };

  const onMobilePointerUp = (e: React.PointerEvent) => {
    if (!mobileIsDraggingRef.current || !mobileTouchStartRef.current) return;
    const dx = e.clientX - mobileTouchStartRef.current.x;
    mobileIsDraggingRef.current = false;
    isHoveredRef.current = false;
    if (timerTweenRef.current) timerTweenRef.current.resume();

    if (mobileHasHorizontalIntentRef.current && Math.abs(dx) >= 40) {
      if (mobileFrameRef.current) gsap.set(mobileFrameRef.current, { x: 0 });
      if (dx < 0) {
        selectItem((activeIdxRef.current + 1) % items.length, true);
      } else {
        selectItem((activeIdxRef.current - 1 + items.length) % items.length, true);
      }
    } else if (mobileFrameRef.current) {
      gsap.to(mobileFrameRef.current, { x: 0, duration: 0.3, ease: "E1" });
    }

    mobileTouchStartRef.current = null;
    mobileHasHorizontalIntentRef.current = null;
  };

  return (
    <article className="w-full bg-white text-[var(--ink)]">
      {/* 1. Hero Band (Capitalized Heading) */}
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792202368/loading-docks-hero.jpg"
        imageAlt={data.h1.toUpperCase()}
        h1={data.h1.toUpperCase()}
        subtitle={data.quickAnswer}
      />

      {/* 2. Interactive Section */}
      <section className="container py-[var(--sec-y-lg)]">
        {/* ========================================================
            DESKTOP VIEW: Two columns (7fr / 5fr, gap 72px, centered)
            Left: real photo shape holding the 3 photos with Slat Reveal
            Right: list of 3 titles with 1px lines between, blue dot, ACCORDION text, and 2px timer line
        ======================================================== */}
        <div
          className="hidden lg:grid grid-cols-12 gap-[72px] items-center max-w-[1280px] mx-auto text-left"
          onMouseEnter={handleContainerMouseEnter}
          onMouseLeave={handleContainerMouseLeave}
        >
          {/* Left Column (7fr / col-span-7): Real photo shape (aspect-[1024/687]) with 6-slat reveal */}
          <div className="col-span-7">
            <div className="relative w-full aspect-[1024/687] overflow-hidden bg-slate-950 select-none shadow-none">
              {/* Base Photo */}
              <img
                src={cl(currentPhoto, 1920)}
                alt={items[activeIdx]?.title || ""}
                width={1024}
                height={687}
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center block"
              />

              {/* 6 Horizontal Slats Overlay during reveal */}
              {incomingPhoto && (
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      ref={(el) => {
                        desktopSlatBoxRefs.current[i] = el;
                      }}
                      className="absolute left-0 right-0 overflow-hidden transform-gpu origin-top"
                      style={{
                        top: `${(i * 100) / 6}%`,
                        height: `${100 / 6}%`,
                        transform: "scaleY(0)",
                      }}
                    >
                      <img
                        src={cl(incomingPhoto, 1920)}
                        alt=""
                        width={1024}
                        height={687}
                        className="absolute left-0 right-0 w-full pointer-events-none"
                        style={{
                          height: "600%",
                          top: `${-i * 100}%`,
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (5fr / col-span-5): 3 titles list with 1px lines between, role="tablist" */}
          <div
            role="tablist"
            aria-orientation="vertical"
            className="col-span-5 divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]"
          >
            {items.map((item, idx) => {
              const isActive = activeIdx === idx;

              return (
                <div key={idx} className="py-6">
                  {/* Title Button (Tab) */}
                  <button
                    ref={(el) => {
                      desktopTabRefs.current[idx] = el;
                    }}
                    role="tab"
                    id={`tab-desktop-${idx}`}
                    aria-controls={`panel-desktop-${idx}`}
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    type="button"
                    onClick={() => selectItem(idx, false)}
                    onMouseEnter={() => handleItemMouseEnter(idx)}
                    onMouseLeave={handleItemMouseLeave}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className="w-full flex items-center gap-3 text-left cursor-pointer focus-visible:outline-none group select-none bg-transparent border-0 p-0"
                  >
                    {/* Active Title Blue Dot at Left */}
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 transition-opacity duration-300 ${
                        isActive ? "bg-[var(--blue)] opacity-100" : "opacity-0"
                      }`}
                    />

                    {/* Title Style: bold, ink colour, uppercase */}
                    <span className="font-bold uppercase text-[18px] lg:text-[20px] text-[#0A0A0A] leading-snug">
                      {item.title.toUpperCase()}
                    </span>
                  </button>

                  {/* Active Text Panel: opens with ACCORDION (600ms), text RISE */}
                  <div
                    id={`panel-desktop-${idx}`}
                    role="tabpanel"
                    aria-labelledby={`tab-desktop-${idx}`}
                    aria-hidden={!isActive}
                    className="grid transition-[grid-template-rows] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] pl-[22px]"
                    style={{
                      gridTemplateRows: isActive ? "1fr" : "0fr",
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-3 text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.65] font-normal">
                        {item.text}
                      </p>

                      {/* 2px blue line that draws over 7000ms (autoplay timer) */}
                      <div className="w-full h-[2px] bg-[#E5E5E5] mt-4 overflow-hidden rounded-full">
                        <div
                          ref={(el) => {
                            desktopTimerRefs.current[idx] = el;
                          }}
                          className="h-full bg-[var(--blue)] origin-left transform-gpu"
                          style={{ transform: "scaleX(0)" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            MOBILE VIEW (max-width: 1023px):
            The image on top (full width, swipe changes the item).
            Under it the 3 titles as rows (64px, plus icon).
            Only the active row shows its text.
            The 2px timer line sits under the active row.
        ======================================================== */}
        <div className="lg:hidden flex flex-col max-w-[640px] mx-auto text-left">
          {/* Top Image: Full-width, real shape, swipeable with Slat Reveal */}
          <div
            ref={mobileFrameRef}
            onPointerDown={onMobilePointerDown}
            onPointerMove={onMobilePointerMove}
            onPointerUp={onMobilePointerUp}
            onPointerCancel={onMobilePointerUp}
            style={{ touchAction: "pan-y" }}
            className="relative w-full aspect-[1024/687] overflow-hidden bg-slate-950 select-none cursor-grab active:cursor-grabbing shadow-none"
          >
            {/* Base Photo */}
            <img
              src={cl(currentPhoto, 1920)}
              alt={items[activeIdx]?.title || ""}
              width={1024}
              height={687}
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-center block pointer-events-none"
            />

            {/* 6 Horizontal Slats Overlay during reveal */}
            {incomingPhoto && (
              <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    ref={(el) => {
                      mobileSlatBoxRefs.current[i] = el;
                    }}
                    className="absolute left-0 right-0 overflow-hidden transform-gpu origin-top"
                    style={{
                      top: `${(i * 100) / 6}%`,
                      height: `${100 / 6}%`,
                      transform: "scaleY(0)",
                    }}
                  >
                    <img
                      src={cl(incomingPhoto, 1920)}
                      alt=""
                      width={1024}
                      height={687}
                      className="absolute left-0 right-0 w-full pointer-events-none"
                      style={{
                        height: "600%",
                        top: `${-i * 100}%`,
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Under image: 3 titles as rows (64px, plus icon). Only the active row shows its text. */}
          <div className="mt-6 divide-y divide-[#E5E5E5] border-y border-[#E5E5E5] w-full">
            {items.map((item, idx) => {
              const isActive = activeIdx === idx;

              return (
                <div key={idx} className="w-full">
                  <button
                    type="button"
                    aria-expanded={isActive}
                    onClick={() => selectItem(idx, true)}
                    className="w-full min-h-[64px] py-4 flex items-center justify-between text-left cursor-pointer focus-visible:outline-none bg-transparent border-0 p-0"
                  >
                    {/* Title Style: bold, ink colour, uppercase */}
                    <span className="font-bold uppercase text-[16px] sm:text-[17px] text-[#0A0A0A] leading-snug pr-4">
                      {item.title.toUpperCase()}
                    </span>

                    {/* Plus Icon: rotates 0 to 45deg over 400ms E1 */}
                    <span
                      className="relative flex-shrink-0 w-6 h-6 flex items-center justify-center transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        transform: isActive ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                      aria-hidden="true"
                    >
                      <span className="absolute w-[16px] h-[2px] bg-[var(--blue)]" />
                      <span className="absolute h-[16px] w-[2px] bg-[var(--blue)]" />
                    </span>
                  </button>

                  {/* Text panel: Only active row shows its text (opens with ACCORDION 600ms E1) */}
                  <div
                    className="grid transition-[grid-template-rows] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      gridTemplateRows: isActive ? "1fr" : "0fr",
                    }}
                  >
                    <div className="overflow-hidden">
                      <p
                        className="pt-1 pb-3 text-[15px] text-[var(--blue)] leading-[1.6] font-normal transition-opacity duration-400 delay-150"
                        style={{ opacity: isActive ? 1 : 0 }}
                      >
                        {item.text}
                      </p>

                      {/* The 2px timer line sits under the active row */}
                      <div className="w-full h-[2px] bg-[#E5E5E5] mb-4 overflow-hidden rounded-full">
                        <div
                          ref={(el) => {
                            mobileTimerRefs.current[idx] = el;
                          }}
                          className="h-full bg-[var(--blue)] origin-left transform-gpu"
                          style={{ transform: "scaleX(0)" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FAQ Section: size according to other pages */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y-lg)] border-t border-[#E5E5E5] text-left max-w-[1340px] mx-auto">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-[16px] lg:text-[44px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="w-full divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
              {data.faq.map((item, idx) => {
                const isOpen = openFaqIndex === idx;

                return (
                  <div key={idx} className="group overflow-hidden">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() =>
                        setOpenFaqIndex((prev) => (prev === idx ? null : idx))
                      }
                      className="w-full min-h-[48px] py-5 lg:py-6 flex items-center justify-between text-left cursor-pointer transition-colors focus-visible:outline-none"
                    >
                      <span className="text-[17px] lg:text-[20px] font-bold text-[#0A0A0A] leading-snug pr-4">
                        {item.q}
                      </span>

                      {/* Rotating Plus Icon (0 to 45deg over 400ms E1) */}
                      <span
                        className="relative flex-shrink-0 w-6 h-6 flex items-center justify-center transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        }}
                      >
                        <span className="absolute w-[16px] h-[2px] bg-[var(--blue)]" />
                        <span className="absolute h-[16px] w-[2px] bg-[var(--blue)]" />
                      </span>
                    </button>

                    {/* Accordion panel: grid-template-rows 0fr to 1fr over 600ms E1 */}
                    <div
                      className="grid transition-[grid-template-rows] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                      }}
                    >
                      <div className="overflow-hidden">
                        <p
                          className="pt-1.5 pb-5 text-[15px] lg:text-[16px] text-[var(--blue)] leading-[1.65] font-normal max-w-[800px] transition-opacity duration-400 delay-150"
                          style={{ opacity: isOpen ? 1 : 0 }}
                        >
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. Next Banner */}
      <NextBand
        heading="PRECISION-CUT, WELDED STEEL STRUCTURAL SECTIONS BUILT TO DRAWING."
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792202368/loading-docks-next.jpg"
        nextUrl="/structural-steel-fabrication-pakistan/columns-and-beams/"
        nextTitle="COLUMNS AND BEAMS"
      />
    </article>
  );
};
