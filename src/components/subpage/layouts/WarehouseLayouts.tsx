// Steel Warehouses Division Signature Layouts (9.13 - 9.17)
import React, { useState, useEffect } from "react";
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
  const images = [IMG.warehouses.grain.g1, IMG.warehouses.grain.g2, IMG.warehouses.grain.g3];
  const slides = sections.slice(0, 3).map((sec, idx) => ({
    num: String(idx + 1).padStart(2, "0"),
    title: sec.title,
    text: sec.text,
    img: images[idx] || images[0],
  }));

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev: number) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.warehouses.grain.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        {/* Slideshow Frame */}
        <div className="relative w-full max-w-[1040px] mx-auto aspect-[16/10] overflow-hidden bg-slate-950 shadow-xl">
          {slides.map((s, idx) => (
            <img
              key={s.num}
              src={s.img}
              alt={s.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                activeIdx === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            />
          ))}

          {/* Top Progress Bars */}
          <div className="absolute top-4 inset-x-6 z-20 flex gap-2">
            {slides.map((_, idx) => (
              <div key={idx} className="h-1 flex-1 bg-white/40 overflow-hidden rounded-full">
                <div
                  className={`h-full bg-white transition-all duration-300 ${
                    idx < activeIdx ? "w-full" : idx === activeIdx ? "w-full animate-pulse" : "w-0"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Captions below frame */}
        <div className="max-w-[1040px] mx-auto mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-left items-start">
          <div className="md:col-span-4">
            <span className="text-[12px] font-mono text-[var(--blue)] font-bold block mb-1">
              0{activeIdx + 1} / 03
            </span>
            <h3 className="text-[24px] lg:text-[28px] font-bold text-[var(--ink)]">
              {slides[activeIdx]?.title}
            </h3>
          </div>
          <div className="md:col-span-8">
            <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
              {slides[activeIdx]?.text}
            </p>
          </div>
        </div>

        {/* Slide Selector Buttons */}
        <div className="max-w-[1040px] mx-auto mt-8 flex flex-wrap gap-3">
          {slides.map((s, idx) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.06em] border transition-colors cursor-pointer ${
                activeIdx === idx
                  ? "bg-[var(--blue)] text-white border-[var(--blue)]"
                  : "bg-white text-[var(--ink)] border-[var(--rule)] hover:border-[var(--blue)]"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="font-bold text-[var(--ink)] mb-8" style={{ fontSize: "var(--fs-h2)" }}>
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* Next Banner */}
      <NextBand
        image={IMG.warehouses.grain.next}
        nextUrl="/steel-warehouses-pakistan/warehouses-with-loading-docks/"
        nextTitle="Warehouses with Loading Docks"
      />
    </article>
  );
};

// 9.17 Warehouses with Loading Docks — signature: "Tabs"
export const LoadingDocksLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const images = [IMG.warehouses.loadingDocks.d1, IMG.warehouses.loadingDocks.d2, IMG.warehouses.loadingDocks.d3];

  const tabs = sections.slice(0, 3).map((sec, idx) => ({
    title: sec.title,
    text: sec.text,
    img: images[idx] || images[0],
  }));

  const [activeTab, setActiveTab] = useState(0);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.warehouses.loadingDocks.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        {/* Tab List */}
        <div className="flex border-b border-[var(--rule)] gap-8 overflow-x-auto scrollbar-none mb-12">
          {tabs.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`pb-4 text-[16px] lg:text-[18px] font-bold whitespace-nowrap transition-colors relative cursor-pointer ${
                activeTab === idx ? "text-[var(--blue)]" : "text-[var(--grey)] hover:text-[var(--ink)]"
              }`}
            >
              {t.title}
              {activeTab === idx && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--blue)]" />
              )}
            </button>
          ))}
        </div>

        {/* Active Tab Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          <div className="lg:col-span-6">
            <PhotoBox
              src={tabs[activeTab]?.img || ""}
              alt={tabs[activeTab]?.title || ""}
              ratio="4/3"
            />
          </div>
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-[26px] lg:text-[32px] font-bold text-[var(--ink)]">
              {tabs[activeTab]?.title}
            </h3>
            <p className="text-[var(--grey-strong)] leading-[1.75]" style={{ fontSize: "var(--fs-body)" }}>
              {tabs[activeTab]?.text}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="font-bold text-[var(--ink)] mb-8" style={{ fontSize: "var(--fs-h2)" }}>
              Frequently Asked Questions
            </h2>
            <Accordion items={data.faq} size="large" />
          </div>
        </section>
      )}

      {/* Next Banner */}
      <NextBand
        image={IMG.warehouses.loadingDocks.next}
        nextUrl="/structural-steel-fabrication-pakistan/columns-and-beams/"
        nextTitle="Columns and Beams"
      />
    </article>
  );
};
