import React, { useState, useEffect, useRef } from "react";
import { ContentData, ContentBlock } from "../../../content/types.ts";
import { IMG } from "../../../data/subpageImages.ts";
import { PhotoBox } from "../../page/PhotoBox.tsx";
import { OutlineNum } from "../../page/OutlineNum.tsx";
import { HeroBand } from "../../ui/HeroBand.tsx";
import { Accordion } from "../../ui/Accordion.tsx";
import { NextBand } from "../../ui/NextBand.tsx";
import { TwoTone } from "../../page/TwoTone.tsx";
import { Pic } from "../../Pic.tsx";
import { cld } from "../../../lib/cld.ts";
import { gsap, ScrollTrigger } from "../../../lib/gsap.ts";
import { ChevronRight, ArrowDown } from "lucide-react";

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

  const storageImages = {
    hero: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033614/storage-hero.jpg",
    s1: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033612/Storage-1.jpg",
    s2: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033612/Storage-2.jpg",
    next: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033617/Storage-next.jpg",
  };

  const desktopSectionRef = useRef<HTMLDivElement>(null);
  const collageWrap1Ref = useRef<HTMLDivElement>(null);
  const collageWrap2Ref = useRef<HTMLDivElement>(null);
  const hairlineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const mobileCurtain1Ref = useRef<HTMLDivElement>(null);
  const mobileCurtain2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Desktop: Hairlines that draw
      hairlineRefs.current.forEach((hl) => {
        if (!hl) return;
        if (prefersReduced) {
          gsap.set(hl, { scaleX: 1 });
          return;
        }
        gsap.fromTo(
          hl,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
            scrollTrigger: {
              trigger: hl,
              start: "top 90%",
              once: true,
            },
          }
        );
      });

      // Desktop: Parallax on the collage wrappers only
      if (!prefersReduced && desktopSectionRef.current) {
        if (collageWrap1Ref.current) {
          gsap.fromTo(
            collageWrap1Ref.current,
            { y: -24 },
            {
              y: 24,
              ease: "none",
              scrollTrigger: {
                trigger: desktopSectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }
        if (collageWrap2Ref.current) {
          gsap.fromTo(
            collageWrap2Ref.current,
            { y: 24 },
            {
              y: -24,
              ease: "none",
              scrollTrigger: {
                trigger: desktopSectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        }
      }

      // Mobile: Curtain reveal on s1 and s2
      [mobileCurtain1Ref.current, mobileCurtain2Ref.current].forEach((curtainEl) => {
        if (!curtainEl) return;
        if (prefersReduced) {
          gsap.set(curtainEl, { clipPath: "inset(0 0 0% 0)" });
          return;
        }
        gsap.fromTo(
          curtainEl,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.0,
            ease: "cubic-bezier(0.76, 0, 0.24, 1)",
            scrollTrigger: {
              trigger: curtainEl,
              start: "top 85%",
              once: true,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  // Helper to split lead sentence (17px) from rest (15px)
  const splitLead = (text: string) => {
    const match = text.match(/^([^.!?]+[.!?])\s*(.*)$/s);
    if (match) {
      return { lead: match[1], rest: match[2] };
    }
    return { lead: text, rest: "" };
  };

  return (
    <article className="w-full bg-white overflow-x-clip">
      <HeroBand
        variant="immersive"
        imageSrc={storageImages.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        {/* Desktop: 2 Columns (Left: 3 Text Blocks with TwoTone + lead rule + drawing hairlines, Right: Floating Collage at 3:2 with 12px white border) */}
        <div ref={desktopSectionRef} className="hidden lg:grid grid-cols-12 gap-20 items-center">
          <div className="col-span-6 space-y-12 text-left">
            {blocks.map((b, idx) => (
              <div key={idx} className="relative pt-8">
                <div
                  ref={(el) => {
                    hairlineRefs.current[idx] = el;
                  }}
                  className="w-full h-[1px] bg-[var(--rule)] origin-left absolute top-0 left-0"
                />
                <h3 className="text-[28px] lg:text-[32px] font-bold text-[var(--ink)] tracking-[-0.015em] mb-3">
                  <TwoTone text={b.title} />
                </h3>
                <div className="w-8 h-[1px] bg-[var(--blue)] my-3" />
                <p className="text-[16px] text-[var(--grey-strong)] leading-[1.7]">
                  {b.text}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop Collage: Pic at real ratio (3:2) with 12px white border, parallax on wrappers only */}
          <div className="col-span-6 relative min-h-[580px] flex items-center justify-center">
            {/* Wrapper 1 (Back image, s1) */}
            <div
              ref={collageWrap1Ref}
              className="w-[84%] ml-auto overflow-hidden shadow-xl border-[12px] border-white z-0"
              style={{ willChange: "transform" }}
            >
              <Pic
                src={storageImages.s1}
                alt="Storage Warehouse Space"
                ratio={3 / 2}
                className="w-full block"
              />
            </div>

            {/* Wrapper 2 (Front overlapping image, s2) */}
            <div
              ref={collageWrap2Ref}
              className="absolute top-[35%] left-0 w-[66%] overflow-hidden shadow-2xl border-[12px] border-white z-10"
              style={{ willChange: "transform" }}
            >
              <Pic
                src={storageImages.s2}
                alt="Storage Warehouse Racking"
                ratio={3 / 2}
                className="w-full block"
              />
            </div>
          </div>
        </div>

        {/* Mobile: Editorial flow. Block 1 text, then s1 full-bleed, Block 2 text, then s2 full-bleed, Block 3 text. 56px between parts. Titles 22px, text 15px with lead sentence 17px. Curtain reveal. */}
        <div className="lg:hidden space-y-[56px] text-left">
          {/* Part 1: Block 1 Text */}
          {blocks[0] && (
            <div>
              <h3 className="text-[22px] font-semibold text-[var(--ink)] leading-[1.25] tracking-[-0.01em] mb-3">
                <TwoTone text={blocks[0].title} />
              </h3>
              <p className="text-[17px] font-medium text-[var(--ink)] leading-[1.6] mb-2">
                {splitLead(blocks[0].text).lead}
              </p>
              {splitLead(blocks[0].text).rest && (
                <p className="text-[15px] text-[var(--grey-strong)] leading-[1.65]">
                  {splitLead(blocks[0].text).rest}
                </p>
              )}
            </div>
          )}

          {/* Part 2: Photo s1 full-bleed with curtain reveal */}
          <div
            className="-mx-[var(--gutter)] w-[calc(100%+var(--gutter)*2)] overflow-hidden bg-[rgba(10,10,10,0.05)]"
            style={{ aspectRatio: "3 / 2" }}
          >
            <div
              ref={mobileCurtain1Ref}
              className="w-full h-full overflow-hidden"
              style={{ clipPath: "inset(0 0 100% 0)" }}
            >
              <img
                src={cld(storageImages.s1, 1600)}
                srcSet={`${cld(storageImages.s1, 640)} 640w, ${cld(storageImages.s1, 960)} 960w, ${cld(storageImages.s1, 1280)} 1280w`}
                sizes="100vw"
                alt={blocks[0]?.title || "Storage Warehouse"}
                className="w-full h-full object-cover block"
                loading="lazy"
              />
            </div>
          </div>

          {/* Part 3: Block 2 Text */}
          {blocks[1] && (
            <div>
              <h3 className="text-[22px] font-semibold text-[var(--ink)] leading-[1.25] tracking-[-0.01em] mb-3">
                <TwoTone text={blocks[1].title} />
              </h3>
              <p className="text-[17px] font-medium text-[var(--ink)] leading-[1.6] mb-2">
                {splitLead(blocks[1].text).lead}
              </p>
              {splitLead(blocks[1].text).rest && (
                <p className="text-[15px] text-[var(--grey-strong)] leading-[1.65]">
                  {splitLead(blocks[1].text).rest}
                </p>
              )}
            </div>
          )}

          {/* Part 4: Photo s2 full-bleed with curtain reveal */}
          <div
            className="-mx-[var(--gutter)] w-[calc(100%+var(--gutter)*2)] overflow-hidden bg-[rgba(10,10,10,0.05)]"
            style={{ aspectRatio: "3 / 2" }}
          >
            <div
              ref={mobileCurtain2Ref}
              className="w-full h-full overflow-hidden"
              style={{ clipPath: "inset(0 0 100% 0)" }}
            >
              <img
                src={cld(storageImages.s2, 1600)}
                srcSet={`${cld(storageImages.s2, 640)} 640w, ${cld(storageImages.s2, 960)} 960w, ${cld(storageImages.s2, 1280)} 1280w`}
                sizes="100vw"
                alt={blocks[1]?.title || "Storage Warehouse Logistics"}
                className="w-full h-full object-cover block"
                loading="lazy"
              />
            </div>
          </div>

          {/* Part 5: Block 3 Text */}
          {blocks[2] && (
            <div>
              <h3 className="text-[22px] font-semibold text-[var(--ink)] leading-[1.25] tracking-[-0.01em] mb-3">
                <TwoTone text={blocks[2].title} />
              </h3>
              <p className="text-[17px] font-medium text-[var(--ink)] leading-[1.6] mb-2">
                {splitLead(blocks[2].text).lead}
              </p>
              {splitLead(blocks[2].text).rest && (
                <p className="text-[15px] text-[var(--grey-strong)] leading-[1.65]">
                  {splitLead(blocks[2].text).rest}
                </p>
              )}
            </div>
          )}
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
        image={storageImages.next}
        nextUrl="/steel-warehouses-pakistan/logistics-warehouses/"
        nextTitle="Logistics Warehouses"
      />
    </article>
  );
};

// 9.14 Logistics Warehouses — signature: "Dock lane with scroll scrub"
export const LogisticsWarehousesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const logisticsImages = {
    hero: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202370/logistics-hero.jpg",
    l1: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202369/logistics-1.jpg",
    l2: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202369/logistics-2.jpg",
    l3: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202371/Logistics-3.jpg",
    next: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202370/logistics-next.jpg",
  };

  const images = [logisticsImages.l1, logisticsImages.l2, logisticsImages.l3];

  const cards = sections.slice(0, 3).map((sec, idx) => ({
    title: sec.title,
    text: sec.text,
    img: images[idx] || images[0],
  }));

  const desktopLaneRef = useRef<HTMLDivElement>(null);
  const desktopFillRef = useRef<HTMLDivElement>(null);
  const [activeDesktopDots, setActiveDesktopDots] = useState([false, false, false]);

  const mobileLaneRef = useRef<HTMLDivElement>(null);
  const mobileFillRef = useRef<HTMLDivElement>(null);
  const [activeMobileDots, setActiveMobileDots] = useState([false, false, false]);
  const mobileRollerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // 1. Desktop Dock Lane: Progress line fills blue with scroll (scrub 1.2), dots turn blue when line reaches them
      if (desktopLaneRef.current && desktopFillRef.current) {
        if (prefersReduced) {
          gsap.set(desktopFillRef.current, { scaleX: 1 });
          setActiveDesktopDots([true, true, true]);
        } else {
          gsap.fromTo(
            desktopFillRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: desktopLaneRef.current,
                start: "top 75%",
                end: "bottom 75%",
                scrub: 1.2,
                onUpdate: (self) => {
                  const p = self.progress;
                  setActiveDesktopDots([
                    p >= 0.12,
                    p >= 0.48,
                    p >= 0.84,
                  ]);
                },
              },
            }
          );
        }
      }

      // 2. Mobile Vertical Lane: Blue fill follows scroll, dots turn blue, roller door reveal (clip-path: inset(0 0 100% 0) -> inset(0), 900ms)
      if (mobileLaneRef.current && mobileFillRef.current) {
        if (prefersReduced) {
          gsap.set(mobileFillRef.current, { scaleY: 1 });
          setActiveMobileDots([true, true, true]);
        } else {
          gsap.fromTo(
            mobileFillRef.current,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: mobileLaneRef.current,
                start: "top 75%",
                end: "bottom 75%",
                scrub: 1.2,
                onUpdate: (self) => {
                  const p = self.progress;
                  setActiveMobileDots([
                    p >= 0.10,
                    p >= 0.45,
                    p >= 0.80,
                  ]);
                },
              },
            }
          );
        }
      }

      // Mobile Roller door reveal on each photo
      mobileRollerRefs.current.forEach((rollerEl) => {
        if (!rollerEl) return;
        if (prefersReduced) {
          gsap.set(rollerEl, { clipPath: "inset(0 0 0% 0)" });
          return;
        }

        gsap.fromTo(
          rollerEl,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 0.9,
            ease: "cubic-bezier(0.76, 0, 0.24, 1)",
            scrollTrigger: {
              trigger: rollerEl,
              start: "top 85%",
              once: true,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [cards]);

  return (
    <article className="w-full bg-white overflow-x-clip">
      <HeroBand
        variant="immersive"
        imageSrc={logisticsImages.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        {/* Desktop: Dock Lane (line, 3 dots, 3 columns). Titles 28px TwoTone, text 16px. Progress line fills blue with scrub 1.2, dots turn blue. */}
        <div ref={desktopLaneRef} className="hidden lg:block pb-16">
          {/* Track line & 3 dots */}
          <div className="relative mb-12 w-full">
            {/* Background 2px grey line */}
            <div className="w-full h-[2px] bg-[var(--rule)]" />
            {/* Blue fill line (scrub 1.2) */}
            <div
              ref={desktopFillRef}
              className="absolute top-0 left-0 h-[2px] bg-[var(--blue)] w-full origin-left scale-x-0"
            />

            {/* 3 dots above column centers: 16.66%, 50%, 83.33% */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 left-[16.66%] -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white transition-colors duration-300 z-10 ${
                activeDesktopDots[0] ? "bg-[var(--blue)] shadow-md" : "bg-[#D1D5DB]"
              }`}
            />
            <div
              className={`absolute top-1/2 -translate-y-1/2 left-[50%] -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white transition-colors duration-300 z-10 ${
                activeDesktopDots[1] ? "bg-[var(--blue)] shadow-md" : "bg-[#D1D5DB]"
              }`}
            />
            <div
              className={`absolute top-1/2 -translate-y-1/2 left-[83.33%] -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white transition-colors duration-300 z-10 ${
                activeDesktopDots[2] ? "bg-[var(--blue)] shadow-md" : "bg-[#D1D5DB]"
              }`}
            />
          </div>

          {/* 3 columns */}
          <div className="grid grid-cols-3 gap-10 text-left items-start">
            {cards.map((c, idx) => (
              <div key={idx} className="space-y-4">
                {/* Image Pic 3:2 */}
                <div className="w-full overflow-hidden">
                  <Pic src={c.img} alt={c.title} ratio={3 / 2} className="w-full" />
                </div>
                {/* Title 28px TwoTone */}
                <h3 className="text-[28px] font-semibold text-[var(--ink)] leading-[1.2] tracking-[-0.015em]">
                  <TwoTone text={c.title} />
                </h3>
                {/* Text 16px */}
                <p className="text-[16px] text-[var(--grey-strong)] leading-[1.65]">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical Lane. 2px grey line at 12px from left, blue fill follows scroll, 12px dot per block. Content padding-left: 36px, photo 3:2 roller door reveal (900ms), title 22px, text 15px. 56px between blocks. */}
        <div ref={mobileLaneRef} className="lg:hidden relative w-full text-left space-y-[56px]">
          {/* Vertical 2px grey line at 12px from left edge */}
          <div className="absolute left-[12px] top-3 bottom-6 w-[2px] bg-[var(--rule)]" />
          {/* Blue fill following scroll */}
          <div
            ref={mobileFillRef}
            className="absolute left-[12px] top-3 bottom-6 w-[2px] bg-[var(--blue)] origin-top scale-y-0"
          />

          {cards.map((c, idx) => (
            <div key={idx} className="relative pl-[36px]">
              {/* 12px dot on the line (center at 12px, so left = 12 - 6 = 6px) */}
              <div
                className={`absolute left-[7px] top-2 w-[12px] h-[12px] rounded-full border border-white transition-colors duration-300 z-10 ${
                  activeMobileDots[idx] ? "bg-[var(--blue)] shadow-sm" : "bg-[#D1D5DB]"
                }`}
              />

              {/* Photo 3:2 with Roller Door reveal: clip-path inset(0 0 100% 0) -> inset(0), 900ms */}
              <div
                className="relative w-full overflow-hidden bg-[rgba(10,10,10,0.05)]"
                style={{ aspectRatio: "3 / 2" }}
              >
                <div
                  ref={(el) => {
                    mobileRollerRefs.current[idx] = el;
                  }}
                  className="w-full h-full overflow-hidden"
                  style={{ clipPath: "inset(0 0 100% 0)" }}
                >
                  <img
                    src={cld(c.img, 1280)}
                    alt={c.title}
                    className="w-full h-full object-cover block"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Title 22px */}
              <h3 className="text-[22px] font-semibold text-[var(--ink)] leading-[1.25] tracking-[-0.01em] mt-4 mb-2">
                <TwoTone text={c.title} />
              </h3>

              {/* Text 15px */}
              <p className="text-[15px] text-[var(--grey-strong)] leading-[1.65]">
                {c.text}
              </p>
            </div>
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
        image={logisticsImages.next}
        nextUrl="/steel-warehouses-pakistan/cold-storage-warehouses/"
        nextTitle="Cold Storage Warehouses"
      />
    </article>
  );
};

// 9.15 Cold Storage Warehouses — signature: "Cold-chain flow with connectors"
export const ColdStorageLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);

  const coldStorageImages = {
    hero: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202370/Cold-storage-hero.jpg",
    c1: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202371/Cold-storage-1.jpg",
    c2: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202371/Cold-storage-2.jpg",
    c3: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202367/cold-storage-3.jpg",
    c4: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202368/cold-storage-4.jpg",
    next: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202371/cold-storage-next.jpg",
  };

  const images = [
    coldStorageImages.c1,
    coldStorageImages.c2,
    coldStorageImages.c3,
    coldStorageImages.c4,
  ];

  const defaultTitles = [
    "What Cold Storage Needs",
    "What Steel Mind Engineers Provides",
    "Design Points",
    "Who Uses Cold Storage",
  ];

  const cells = Array.from({ length: 4 }).map((_, idx) => {
    const sec = sections[idx];
    return {
      title: sec?.title || defaultTitles[idx],
      text: sec?.text || "",
      img: images[idx],
    };
  });

  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row1ConnLineRef = useRef<HTMLDivElement>(null);
  const row1ConnCircleRef = useRef<HTMLDivElement>(null);
  const row2ConnLineRef = useRef<HTMLDivElement>(null);
  const row2ConnCircleRef = useRef<HTMLDivElement>(null);
  const dividerHairlineRef = useRef<HTMLDivElement>(null);
  const dividerCircleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        if (row1ConnLineRef.current) gsap.set(row1ConnLineRef.current, { scaleX: 1 });
        if (row1ConnCircleRef.current) gsap.set(row1ConnCircleRef.current, { scale: 1 });
        if (row2ConnLineRef.current) gsap.set(row2ConnLineRef.current, { scaleX: 1 });
        if (row2ConnCircleRef.current) gsap.set(row2ConnCircleRef.current, { scale: 1 });
        if (dividerHairlineRef.current) gsap.set(dividerHairlineRef.current, { scaleX: 1 });
        if (dividerCircleRef.current) gsap.set(dividerCircleRef.current, { scale: 1 });
        return;
      }

      // Row 1: Cells reveal, then connector draws after 150ms stagger
      if (row1Ref.current) {
        const row1Cells = row1Ref.current.querySelectorAll(".cell-reveal");
        gsap.fromTo(
          row1Cells,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
            stagger: 0.1,
            scrollTrigger: {
              trigger: row1Ref.current,
              start: "top 82%",
              once: true,
            },
          }
        );

        if (row1ConnLineRef.current && row1ConnCircleRef.current) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: row1Ref.current,
              start: "top 82%",
              once: true,
            },
            delay: 0.25, // Stagger 150ms after cell reveal starts
          });
          tl.fromTo(
            row1ConnLineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.6, ease: "cubic-bezier(0.22, 1, 0.36, 1)" }
          ).fromTo(
            row1ConnCircleRef.current,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.7)" },
            "-=0.2"
          );
        }
      }

      // Full-width hairline divider between Row 1 and Row 2
      if (dividerHairlineRef.current) {
        gsap.fromTo(
          dividerHairlineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
            scrollTrigger: {
              trigger: dividerHairlineRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }
      if (dividerCircleRef.current) {
        gsap.fromTo(
          dividerCircleRef.current,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            delay: 0.2,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: dividerCircleRef.current,
              start: "top 88%",
              once: true,
            },
          }
        );
      }

      // Row 2: Cells reveal, then connector draws after 150ms stagger
      if (row2Ref.current) {
        const row2Cells = row2Ref.current.querySelectorAll(".cell-reveal");
        gsap.fromTo(
          row2Cells,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "cubic-bezier(0.22, 1, 0.36, 1)",
            stagger: 0.1,
            scrollTrigger: {
              trigger: row2Ref.current,
              start: "top 82%",
              once: true,
            },
          }
        );

        if (row2ConnLineRef.current && row2ConnCircleRef.current) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: row2Ref.current,
              start: "top 82%",
              once: true,
            },
            delay: 0.25, // Stagger 150ms after cell reveal starts
          });
          tl.fromTo(
            row2ConnLineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.6, ease: "cubic-bezier(0.22, 1, 0.36, 1)" }
          ).fromTo(
            row2ConnCircleRef.current,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.7)" },
            "-=0.2"
          );
        }
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <article className="w-full bg-white overflow-x-clip">
      {/* Hero Band with cold storage photography */}
      <HeroBand
        variant="immersive"
        imageSrc={coldStorageImages.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        {/* ============================================================== */}
        {/* DESKTOP: 2x2 Flow Grid, gap 80px (col) 72px (row)              */}
        {/* ============================================================== */}
        <div className="hidden lg:block">
          {/* Row 1: Cell 0 & Cell 1 with connector at image mid-height */}
          <div ref={row1Ref} className="grid grid-cols-2 gap-x-[80px] items-start text-left">
            {/* Cell 0: What Cold Storage Needs */}
            <div className="cell-reveal space-y-5">
              <div
                className="relative w-full overflow-visible"
                style={{ aspectRatio: "3 / 2" }}
              >
                <div className="w-full h-full overflow-hidden bg-[rgba(10,10,10,0.05)]">
                  <Pic
                    src={cells[0].img}
                    alt={cells[0].title}
                    ratio={3 / 2}
                    className="w-full block"
                  />
                </div>

                {/* Connector in the 80px gutter at image mid-height */}
                <div className="absolute -right-[80px] top-1/2 -translate-y-1/2 w-[80px] flex items-center justify-center pointer-events-none z-10">
                  <div className="flex items-center">
                    {/* 1px blue line (48px) that draws */}
                    <div
                      ref={row1ConnLineRef}
                      className="w-[48px] h-[1px] bg-[var(--blue)] origin-left scale-x-0"
                    />
                    {/* 28px chevron in thin circle */}
                    <div
                      ref={row1ConnCircleRef}
                      className="w-[28px] h-[28px] rounded-full border border-[var(--blue)] bg-white text-[var(--blue)] flex items-center justify-center -ml-1 shadow-sm"
                    >
                      <ChevronRight size={15} strokeWidth={2} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[28px] font-semibold text-[var(--ink)] leading-[1.2] tracking-[-0.015em] mb-3">
                  <TwoTone text={cells[0].title} />
                </h3>
                <p className="text-[16px] text-[var(--grey-strong)] leading-[1.65]">
                  {cells[0].text}
                </p>
              </div>
            </div>

            {/* Cell 1: What Steel Mind Engineers Provides */}
            <div className="cell-reveal space-y-5">
              <div
                className="relative w-full overflow-hidden bg-[rgba(10,10,10,0.05)]"
                style={{ aspectRatio: "3 / 2" }}
              >
                <Pic
                  src={cells[1].img}
                  alt={cells[1].title}
                  ratio={3 / 2}
                  className="w-full block"
                />
              </div>

              <div>
                <h3 className="text-[28px] font-semibold text-[var(--ink)] leading-[1.2] tracking-[-0.015em] mb-3">
                  <TwoTone text={cells[1].title} />
                </h3>
                <p className="text-[16px] text-[var(--grey-strong)] leading-[1.65]">
                  {cells[1].text}
                </p>
              </div>
            </div>
          </div>

          {/* Full-width 1px hairline with a centered 36px circle holding animated arrow-down */}
          <div className="relative my-[72px] flex items-center justify-center w-full">
            <div
              ref={dividerHairlineRef}
              className="w-full h-[1px] bg-[var(--rule)] origin-center scale-x-0"
            />
            <div
              ref={dividerCircleRef}
              className="absolute z-10 w-[36px] h-[36px] rounded-full border border-[var(--blue)] bg-white text-[var(--blue)] flex items-center justify-center shadow-sm"
            >
              <ArrowDown size={17} strokeWidth={2} className="animate-bounce" />
            </div>
          </div>

          {/* Row 2: Cell 2 & Cell 3 with connector at image mid-height */}
          <div ref={row2Ref} className="grid grid-cols-2 gap-x-[80px] items-start text-left">
            {/* Cell 2: Design Points */}
            <div className="cell-reveal space-y-5">
              <div
                className="relative w-full overflow-visible"
                style={{ aspectRatio: "3 / 2" }}
              >
                <div className="w-full h-full overflow-hidden bg-[rgba(10,10,10,0.05)]">
                  <Pic
                    src={cells[2].img}
                    alt={cells[2].title}
                    ratio={3 / 2}
                    className="w-full block"
                  />
                </div>

                {/* Connector in the 80px gutter at image mid-height */}
                <div className="absolute -right-[80px] top-1/2 -translate-y-1/2 w-[80px] flex items-center justify-center pointer-events-none z-10">
                  <div className="flex items-center">
                    {/* 1px blue line (48px) that draws */}
                    <div
                      ref={row2ConnLineRef}
                      className="w-[48px] h-[1px] bg-[var(--blue)] origin-left scale-x-0"
                    />
                    {/* 28px chevron in thin circle */}
                    <div
                      ref={row2ConnCircleRef}
                      className="w-[28px] h-[28px] rounded-full border border-[var(--blue)] bg-white text-[var(--blue)] flex items-center justify-center -ml-1 shadow-sm"
                    >
                      <ChevronRight size={15} strokeWidth={2} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[28px] font-semibold text-[var(--ink)] leading-[1.2] tracking-[-0.015em] mb-3">
                  <TwoTone text={cells[2].title} />
                </h3>
                <p className="text-[16px] text-[var(--grey-strong)] leading-[1.65]">
                  {cells[2].text}
                </p>
              </div>
            </div>

            {/* Cell 3: Who Uses Cold Storage */}
            <div className="cell-reveal space-y-5">
              <div
                className="relative w-full overflow-hidden bg-[rgba(10,10,10,0.05)]"
                style={{ aspectRatio: "3 / 2" }}
              >
                <Pic
                  src={cells[3].img}
                  alt={cells[3].title}
                  ratio={3 / 2}
                  className="w-full block"
                />
              </div>

              <div>
                <h3 className="text-[28px] font-semibold text-[var(--ink)] leading-[1.2] tracking-[-0.015em] mb-3">
                  <TwoTone text={cells[3].title} />
                </h3>
                <p className="text-[16px] text-[var(--grey-strong)] leading-[1.65]">
                  {cells[3].text}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TABLET: 1 Column with same vertical connectors                 */}
        {/* ============================================================== */}
        <div className="hidden sm:block lg:hidden max-w-[680px] mx-auto text-left">
          {cells.map((c, idx) => (
            <React.Fragment key={idx}>
              <div className="space-y-5">
                <div
                  className="w-full overflow-hidden bg-[rgba(10,10,10,0.05)]"
                  style={{ aspectRatio: "3 / 2" }}
                >
                  <Pic src={c.img} alt={c.title} ratio={3 / 2} className="w-full block" />
                </div>
                <div>
                  <h3 className="text-[26px] font-semibold text-[var(--ink)] leading-[1.25] tracking-[-0.015em] mb-3">
                    <TwoTone text={c.title} />
                  </h3>
                  <p className="text-[16px] text-[var(--grey-strong)] leading-[1.65]">
                    {c.text}
                  </p>
                </div>
              </div>

              {/* Vertical connector: 1px blue line + 28px chevron/down-arrow circle */}
              {idx < cells.length - 1 && (
                <div className="flex flex-col items-center justify-center my-10">
                  <div className="w-[1px] h-[48px] bg-[var(--blue)]" />
                  <div className="w-[28px] h-[28px] rounded-full border border-[var(--blue)] bg-white text-[var(--blue)] flex items-center justify-center -mt-1 shadow-sm">
                    <ArrowDown size={14} strokeWidth={2} />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ============================================================== */}
        {/* MOBILE: Stacked. Full-bleed Pic, 22px title, 15px text,        */}
        {/* 32px circle with arrow-down on 1px hairline between blocks.    */}
        {/* ============================================================== */}
        <div className="sm:hidden text-left">
          {cells.map((c, idx) => (
            <React.Fragment key={idx}>
              <div className="w-full">
                {/* Full-bleed Pic at 3:2 */}
                <div
                  className="-mx-[var(--gutter)] w-[calc(100%+var(--gutter)*2)] overflow-hidden bg-[rgba(10,10,10,0.05)]"
                  style={{ aspectRatio: "3 / 2" }}
                >
                  <img
                    src={cld(c.img, 1280)}
                    alt={c.title}
                    className="w-full h-full object-cover block"
                    loading="lazy"
                  />
                </div>

                {/* Title: 22px TwoTone */}
                <h3 className="text-[22px] font-semibold text-[var(--ink)] leading-[1.25] tracking-[-0.01em] mt-5 mb-2.5">
                  <TwoTone text={c.title} />
                </h3>

                {/* Text: 15px */}
                <p className="text-[15px] text-[var(--grey-strong)] leading-[1.65]">
                  {c.text}
                </p>
              </div>

              {/* Between blocks: 32px circle with arrow-down on 1px hairline */}
              {idx < cells.length - 1 && (
                <div className="relative my-[44px] flex items-center justify-center w-full">
                  <div className="w-full h-[1px] bg-[var(--rule)]" />
                  <div className="absolute z-10 w-[32px] h-[32px] rounded-full border border-[var(--rule)] bg-white text-[var(--blue)] flex items-center justify-center shadow-xs">
                    <ArrowDown size={14} strokeWidth={1.8} />
                  </div>
                </div>
              )}
            </React.Fragment>
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
        image={coldStorageImages.next}
        nextUrl="/steel-warehouses-pakistan/grain-and-wheat-warehouses/"
        nextTitle="Grain and Wheat Warehouses"
      />
    </article>
  );
};

// 9.16 Grain and Wheat Warehouses — signature: "Text-tabbed slideshow with swipe"
export const GrainWarehousesLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);

  const grainImages = {
    hero: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202373/grain-hero.jpg",
    g1: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202372/grain-1.jpg",
    g2: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202372/grain-2.jpg",
    g3: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202374/grain-3.jpg",
    next: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792202373/grain-next.jpg",
  };

  const images = [grainImages.g1, grainImages.g2, grainImages.g3];
  const defaultTitles = [
    "What Grain Storage Needs",
    "Design Points",
    "Why Steel",
  ];

  const slides = Array.from({ length: 3 }).map((_, idx) => {
    const sec = sections[idx];
    return {
      title: sec?.title || defaultTitles[idx],
      text: sec?.text || "",
      img: images[idx],
    };
  });

  const [activeIdx, setActiveIdx] = useState(0);

  // Tab indicator tracking
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const updateTabIndicator = (idx: number) => {
    const tabEl = tabRefs.current[idx];
    if (tabEl) {
      setIndicatorStyle({
        left: tabEl.offsetLeft,
        width: tabEl.offsetWidth,
      });
    }
  };

  useEffect(() => {
    updateTabIndicator(activeIdx);
  }, [activeIdx]);

  useEffect(() => {
    const handleResize = () => updateTabIndicator(activeIdx);
    window.addEventListener("resize", handleResize);
    const timer = setTimeout(() => updateTabIndicator(activeIdx), 100);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [activeIdx]);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 40) {
      // Swipe Right -> previous
      setActiveIdx((prev) => (prev - 1 + slides.length) % slides.length);
    } else if (deltaX < -40) {
      // Swipe Left -> next
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }
    touchStartX.current = null;
  };

  return (
    <article className="w-full bg-white overflow-x-clip">
      {/* Hero Band with grain photography */}
      <HeroBand
        variant="immersive"
        imageSrc={grainImages.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        {/* Slideshow Frame without drop shadow */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full max-w-[1040px] mx-auto aspect-[16/10] overflow-hidden bg-[rgba(10,10,10,0.05)] select-none"
        >
          {slides.map((s, idx) => (
            <img
              key={idx}
              src={cld(s.img, 1920)}
              alt={s.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                activeIdx === idx ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              loading={idx === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>

        {/* ============================================================== */}
        {/* DESKTOP VIEW                                                   */}
        {/* ============================================================== */}
        <div className="hidden md:block max-w-[1040px] mx-auto">
          {/* Plain text tabs: 12px uppercase, 1px line under row, 2px blue sliding line (400ms). No boxes. */}
          <div className="relative mt-8 border-b border-[var(--rule)] flex items-center gap-8">
            {slides.map((s, idx) => (
              <button
                key={idx}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`pb-3.5 text-[12px] uppercase tracking-[0.08em] whitespace-nowrap transition-colors cursor-pointer ${
                  activeIdx === idx
                    ? "font-semibold text-[var(--blue)]"
                    : "font-medium text-[var(--grey)] hover:text-[var(--ink)]"
                }`}
              >
                {s.title}
              </button>
            ))}

            {/* 2px blue line that slides (400ms) */}
            <div
              className="absolute bottom-0 h-[2px] bg-[var(--blue)] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
              }}
            />
          </div>

          {/* Caption (title left 5fr, text right 7fr): title TwoTone. No box. No '03 / 03' label. */}
          <div className="mt-8 grid grid-cols-12 gap-8 text-left items-start">
            <div className="col-span-5">
              <h3 className="text-[28px] font-semibold text-[var(--ink)] leading-[1.2] tracking-[-0.015em]">
                <TwoTone text={slides[activeIdx]?.title || ""} />
              </h3>
            </div>
            <div className="col-span-7">
              <p className="text-[16px] text-[var(--grey-strong)] leading-[1.7]">
                {slides[activeIdx]?.text}
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MOBILE VIEW: Swipe slideshow, 3 progress bars (4px, gap 8px),  */}
        {/* caption cross-fades 500ms, text tabs in one horizontal row.   */}
        {/* ============================================================== */}
        <div className="md:hidden max-w-[1040px] mx-auto text-left">
          {/* 3 Progress Bars: 4px height, gap 8px */}
          <div className="flex gap-[8px] w-full mt-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className="h-[4px] flex-1 bg-[rgba(10,10,10,0.1)] rounded-full overflow-hidden cursor-pointer"
                aria-label={`Go to slide ${idx + 1}`}
              >
                <div
                  className={`h-full bg-[var(--blue)] transition-all duration-300 ${
                    idx === activeIdx ? "w-full" : idx < activeIdx ? "w-full opacity-60" : "w-0"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Plain text tabs in one horizontal row (same as desktop) */}
          <div className="relative mt-6 border-b border-[var(--rule)] flex items-center gap-6 overflow-x-auto scrollbar-none">
            {slides.map((s, idx) => (
              <button
                key={idx}
                ref={(el) => {
                  if (window.innerWidth < 768) {
                    tabRefs.current[idx] = el;
                  }
                }}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`pb-3 text-[12px] uppercase tracking-[0.08em] whitespace-nowrap transition-colors cursor-pointer ${
                  activeIdx === idx
                    ? "font-semibold text-[var(--blue)]"
                    : "font-medium text-[var(--grey)] hover:text-[var(--ink)]"
                }`}
              >
                {s.title}
              </button>
            ))}

            {/* Sliding 2px blue line */}
            <div
              className="absolute bottom-0 h-[2px] bg-[var(--blue)] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
              }}
            />
          </div>

          {/* Caption of current slide: its own title (22px) and text (15px). Cross-fades in 500ms */}
          <div
            key={activeIdx}
            className="mt-6 text-left"
            style={{
              animation: "grainCaptionFade 500ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
            }}
          >
            <h3 className="text-[22px] font-semibold text-[var(--ink)] leading-[1.25] tracking-[-0.01em] mb-2.5">
              <TwoTone text={slides[activeIdx]?.title || ""} />
            </h3>
            <p className="text-[15px] text-[var(--grey-strong)] leading-[1.65]">
              {slides[activeIdx]?.text}
            </p>
          </div>

          <style>{`
            @keyframes grainCaptionFade {
              from {
                opacity: 0;
                transform: translateY(6px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
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
        image={grainImages.next}
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
