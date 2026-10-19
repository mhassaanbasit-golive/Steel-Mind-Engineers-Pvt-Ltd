// Industrial Sheds Division Signature Layouts (9.8 - 9.12)
import React, { useState, useEffect, useRef } from "react";
import { ContentData, ContentBlock } from "../../../content/types.ts";
import { IMG } from "../../../data/subpageImages.ts";
import { PhotoBox } from "../../page/PhotoBox.tsx";
import { OutlineNum } from "../../page/OutlineNum.tsx";
import { SplitIntro } from "../../page/SplitIntro.tsx";
import { HeroBand } from "../../ui/HeroBand.tsx";
import { Accordion } from "../../ui/Accordion.tsx";
import { NextBand } from "../../ui/NextBand.tsx";
import { TransitionLink } from "../../ui/TransitionLink.tsx";
import { gsap, ScrollTrigger } from "../../../lib/gsap.ts";
import { Reveal } from "../../../lib/motion.ts";
import { StackCards, StackCardItem } from "../../page/StackCards.tsx";
import { ImageAccordion } from "../../page/ImageAccordion.tsx";
import { Pic } from "../../Pic.tsx";
import { TwoTone } from "../../page/TwoTone.tsx";
import { DotRail } from "../../page/DotRail.tsx";
import { cld } from "../../../lib/cld.ts";
import { useCountUp } from "../../../hooks/useCountUp.ts";

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

// 9.8 Factory Sheds — signature: "Stacking cards"
export const FactoryShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const factoryImages = {
    hero: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033628/Factory-hero.jpg",
    f1: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033626/factory-1.jpg",
    f2: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033627/factory-2.jpg",
    f3: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033627/factory-3.jpg",
    f4: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033628/factory-4.jpg",
    next: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033631/factory-next.jpg",
  };

  const images = [
    factoryImages.f1,
    factoryImages.f2,
    factoryImages.f3,
    factoryImages.f4,
  ];

  const cards = sections.slice(0, 4).map((sec, idx) => ({
    title: sec.title,
    text: sec.text,
    img: images[idx] || images[0],
  }));

  // Desktop: Alternating split cards inside StackCards
  const desktopStackCards: StackCardItem[] = cards.map((c, idx) => {
    const isEven = idx % 2 === 1;
    return {
      id: idx,
      content: (
        <div
          className="w-full bg-white overflow-hidden shadow-none"
          style={{
            height: "min(78svh, 640px)",
          }}
        >
          <div className="grid grid-cols-12 items-center h-full">
            <div
              className={`col-span-6 overflow-hidden flex items-center justify-center p-6 lg:p-8 ${
                isEven ? "order-2" : "order-1"
              }`}
            >
              <Pic
                src={c.img}
                alt={c.title}
                ratio={3 / 2}
                className="w-full h-auto object-cover"
              />
            </div>
            <div
              className={`col-span-6 p-10 lg:p-14 flex flex-col justify-center text-left ${
                isEven ? "order-1" : "order-2"
              }`}
            >
              <h3 className="text-[36px] font-[500] text-[var(--ink)] mb-4 tracking-[-0.015em] leading-[1.15]">
                <TwoTone text={c.title} />
              </h3>
              <p className="text-[17px] text-[var(--grey-strong)] leading-[1.7] max-w-[480px]">
                {c.text}
              </p>
            </div>
          </div>
        </div>
      ),
    };
  });

  // Mobile: StackCards with ImageAccordion (4 cards, full-bleed, no border, no number)
  const mobileStackCards: StackCardItem[] = cards.map((c, idx) => ({
    id: idx,
    content: (
      <div className="w-full bg-white text-left p-0 border-0">
        <ImageAccordion
          items={[
            {
              title: c.title,
              text: c.text,
              image: c.img,
              ratio: 3 / 2,
            },
          ]}
        />
      </div>
    ),
  }));

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={factoryImages.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        {/* Desktop: Stacking Cards with 4 alternating split cards */}
        <div className="hidden lg:block">
          <StackCards cards={desktopStackCards} marginBottom="38svh" />
        </div>

        {/* Mobile: StackCards with ImageAccordion (4 cards, full-bleed image, no border, no number) */}
        <div className="lg:hidden">
          <StackCards cards={mobileStackCards} marginBottom="20svh" />
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

      {/* Next Banner with Image */}
      <NextBand
        image={factoryImages.next}
        nextUrl="/industrial-sheds-pakistan/dairy-farm-sheds/"
        nextTitle="Dairy Farm Sheds"
      />
    </article>
  );
};

// 9.9 Dairy Farm Sheds — signature: "Wide bands with text card"
export const DairyShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const dairyImages = {
    hero: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033623/Dairy-hero.jpg",
    d1: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033618/Dairy-1.jpg",
    d2: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033622/dairy-2.jpg",
    d3: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033623/dairy-3.jpg",
    d4: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033623/dairy-4.jpg",
    next: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033624/dairy-next.jpg",
  };

  const images = [dairyImages.d1, dairyImages.d2, dairyImages.d3, dairyImages.d4];
  const defaultTitles = [
    "What Dairy Sheds Need",
    "Design Points",
    "Experience",
    "Build in Phases",
  ];

  const bands = Array.from({ length: 4 }).map((_, idx) => {
    const sec = sections[idx];
    return {
      title: sec?.title || defaultTitles[idx],
      text: sec?.text || "",
      img: images[idx],
    };
  });

  // Desktop refs
  const desktopBandRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopCurtainRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Mobile refs & state
  const mobileSectionRef = useRef<HTMLDivElement>(null);
  const mobileSlideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCurtainRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeMobileSlide, setActiveMobileSlide] = useState(0);
  const [isMobileSectionInView, setIsMobileSectionInView] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // 1. Desktop Reveal: curtain 1200ms, card fades up 24px 250ms later, no parallax zoom
      desktopBandRefs.current.forEach((bandEl, idx) => {
        if (!bandEl) return;
        const curtainEl = desktopCurtainRefs.current[idx];
        const cardEl = desktopCardRefs.current[idx];

        if (prefersReduced) {
          if (curtainEl) gsap.set(curtainEl, { clipPath: "inset(0 0 0% 0)" });
          if (cardEl) gsap.set(cardEl, { opacity: 1, y: 0 });
          return;
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: bandEl,
            start: "top 80%",
            once: true,
          },
        });

        if (curtainEl) {
          tl.fromTo(
            curtainEl,
            { clipPath: "inset(0 0 100% 0)" },
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 1.2,
              ease: "cubic-bezier(0.76, 0, 0.24, 1)",
            },
            0
          );
        }

        if (cardEl) {
          tl.fromTo(
            cardEl,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "cubic-bezier(0.22, 1, 0.36, 1)",
            },
            0.25 // 250ms later
          );
        }
      });

      // 2. Mobile Reveal: curtain on image, text fades up with 120ms stagger
      mobileSlideRefs.current.forEach((slideEl, idx) => {
        if (!slideEl) return;
        const curtainEl = mobileCurtainRefs.current[idx];
        const contentEl = mobileContentRefs.current[idx];

        if (prefersReduced) {
          if (curtainEl) gsap.set(curtainEl, { clipPath: "inset(0 0 0% 0)" });
          if (contentEl) {
            const els = contentEl.querySelectorAll(".mobile-anim");
            gsap.set(els, { opacity: 1, y: 0 });
          }
          return;
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: slideEl,
            start: "top 85%",
            once: true,
          },
        });

        if (curtainEl) {
          tl.fromTo(
            curtainEl,
            { clipPath: "inset(0 0 100% 0)" },
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 1.0,
              ease: "cubic-bezier(0.76, 0, 0.24, 1)",
            },
            0
          );
        }

        if (contentEl) {
          const els = contentEl.querySelectorAll(".mobile-anim");
          tl.fromTo(
            els,
            { opacity: 0, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.12, // 120ms stagger
              ease: "cubic-bezier(0.22, 1, 0.36, 1)",
            },
            0.2
          );
        }
      });
    });

    return () => ctx.revert();
  }, [bands]);

  // Mobile active slide observer and section visibility observer
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Observer for active slide inside mobile layout
    const slideObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-slide-index"));
            if (!isNaN(index)) {
              setActiveMobileSlide(index);
            }
          }
        });
      },
      {
        rootMargin: "-25% 0px -25% 0px",
        threshold: 0.2,
      }
    );

    mobileSlideRefs.current.forEach((el) => {
      if (el) slideObserver.observe(el);
    });

    // Observer for mobile section in viewport to toggle DotRail
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsMobileSectionInView(entry.isIntersecting);
        });
      },
      {
        threshold: 0.05,
      }
    );

    if (mobileSectionRef.current) {
      sectionObserver.observe(mobileSectionRef.current);
    }

    return () => {
      slideObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <article className="w-full bg-white">
      <HeroBand
        variant="immersive"
        imageSrc={dairyImages.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Desktop (768px and up): 4 full-width bands, aspect-ratio: 64/27, 100vw wide, no max-height, no min-height */}
      <section className="hidden md:block w-full space-y-8 my-[var(--sec-y-lg)]">
        {bands.map((b, idx) => {
          const isEven = idx % 2 === 1;
          return (
            <div
              key={idx}
              ref={(el) => {
                desktopBandRefs.current[idx] = el;
              }}
              className="relative w-full overflow-hidden bg-white"
              style={{ aspectRatio: "64 / 27" }}
            >
              {/* Image with curtain reveal (1200ms) - loads at 2560px, no parallax zoom */}
              <div
                ref={(el) => {
                  desktopCurtainRefs.current[idx] = el;
                }}
                className="w-full h-full overflow-hidden"
                style={{ clipPath: "inset(0 0 100% 0)" }}
              >
                <img
                  src={cld(b.img, 2560)}
                  srcSet={`${cld(b.img, 1280)} 1280w, ${cld(b.img, 1920)} 1920w, ${cld(b.img, 2560)} 2560w`}
                  sizes="100vw"
                  alt={b.title}
                  className="w-full h-full object-cover block"
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>

              {/* White floating text card (460px, padding 40px) */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="container h-full relative">
                  <div
                    ref={(el) => {
                      desktopCardRefs.current[idx] = el;
                    }}
                    className={`pointer-events-auto absolute bottom-12 w-[460px] p-10 bg-white border border-[var(--rule)] text-left z-10 ${
                      isEven ? "right-0" : "left-0"
                    }`}
                    style={{
                      boxShadow: "0 16px 36px -12px rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <h3 className="text-[30px] font-semibold text-[var(--ink)] mb-3 leading-[1.2] tracking-[-0.015em]">
                      <TwoTone text={b.title} />
                    </h3>
                    <p className="text-[16px] text-[var(--grey-strong)] leading-[1.65]">
                      {b.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Mobile (below 768px): Slides layout with vertical DotRail (4 ticks) fixed at right edge */}
      <section
        ref={mobileSectionRef}
        className="md:hidden relative w-full my-8 text-left"
      >
        {/* Vertical DotRail (4 ticks) fixed at the right edge inside the section */}
        <div
          className={`fixed right-3 top-1/2 -translate-y-1/2 z-30 transition-opacity duration-300 pointer-events-auto ${
            isMobileSectionInView ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-label="Dairy sheds slide navigation"
        >
          <DotRail
            count={4}
            active={activeMobileSlide}
            orientation="vertical"
            onSelect={(i) => {
              mobileSlideRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
        </div>

        {bands.map((b, idx) => (
          <div
            key={idx}
            ref={(el) => {
              mobileSlideRefs.current[idx] = el;
            }}
            data-slide-index={idx}
            className="mobile-slide relative w-full"
          >
            {/* Full-bleed Pic at 64:27 (no crop, loads at 2560px) with curtain reveal */}
            <div
              className="relative w-full overflow-hidden bg-[rgba(10,10,10,0.05)]"
              style={{ aspectRatio: "64 / 27" }}
            >
              <div
                ref={(el) => {
                  mobileCurtainRefs.current[idx] = el;
                }}
                className="w-full h-full overflow-hidden"
                style={{ clipPath: "inset(0 0 100% 0)" }}
              >
                <img
                  src={cld(b.img, 2560)}
                  srcSet={`${cld(b.img, 640)} 640w, ${cld(b.img, 960)} 960w, ${cld(b.img, 1280)} 1280w, ${cld(b.img, 2560)} 2560w`}
                  sizes="100vw"
                  alt={b.title}
                  className="w-full h-full object-cover block"
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            </div>

            {/* 28px below it: title (22px, TwoTone), then text (15px, lead rule) */}
            <div
              ref={(el) => {
                mobileContentRefs.current[idx] = el;
              }}
              className="mt-[28px] px-5 sm:px-6"
            >
              <h3 className="mobile-anim text-[22px] font-semibold text-[var(--ink)] leading-[1.25] tracking-[-0.01em]">
                <TwoTone text={b.title} />
              </h3>

              {/* Lead rule */}
              <div className="mobile-anim w-8 h-[1px] bg-[var(--blue)] my-3" />

              {/* Text: 15px */}
              <p className="mobile-anim text-[15px] text-[var(--grey-strong)] leading-[1.65]">
                {b.text}
              </p>
            </div>

            {/* A 1px hairline between slides, 56px space */}
            {idx < bands.length - 1 && (
              <div className="py-[28px] px-5 sm:px-6">
                <div className="w-full h-[1px] bg-[var(--rule)]" />
              </div>
            )}
          </div>
        ))}
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
        image={dairyImages.next}
        nextUrl="/industrial-sheds-pakistan/poultry-sheds/"
        nextTitle="Poultry Sheds"
      />
    </article>
  );
};

// 9.10 Poultry Sheds — signature: "Staggered triptych (Desktop) & Asymmetric Editorial (Mobile)"
export const PoultryShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const poultryImages = {
    hero: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033632/Poultry-hero.jpg",
    p1: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033631/Poultry-1.jpg",
    p2: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033635/pultry-2.jpg",
    p3: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033632/poultry-3.jpg",
    next: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033634/poultry-next.jpg",
  };

  const images = [poultryImages.p1, poultryImages.p2, poultryImages.p3];
  const defaultTitles = [
    "What Poultry Houses Need",
    "Design Points for Poultry Sheds",
    "Why Steel",
  ];
  const defaultTexts = [
    "Birds are sensitive to heat, damp and bad air. The shed must hold a stable temperature and give steady ventilation. The steel structure must also carry the weight of equipment hung from the roof, such as feeders, drinkers, fans and cooling pads.",
    "Insulated panels reduce heat gain in summer and heat loss in winter. Fan openings and inlets are placed in the frame design from the start. The frames are checked for equipment loads on the roof members. Poultry houses are long and narrow, and steel frames with regular bays suit this shape. Smooth surfaces and good drainage help cleaning between batches.",
    "Steel sheds are fast to build, so you can start production sooner. They resist rot and pests, and they can be extended when you add a new house.",
  ];

  const columns = Array.from({ length: 3 }).map((_, idx) => {
    const sec = sections[idx];
    return {
      title: sec?.title || defaultTitles[idx],
      text: sec?.text || defaultTexts[idx],
      img: images[idx],
    };
  });

  const desktopSectionRef = useRef<HTMLDivElement>(null);
  const desktopColRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopCurtainRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopTextRefs = useRef<(HTMLDivElement | null)[]>([]);

  const mobileCurtainRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileTextRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // 1. Desktop: Curtain reveal + Scrub 1.2 wrapper motion (±24px)
      const columnScrubs = [-24, 24, -18];

      desktopColRefs.current.forEach((colEl, idx) => {
        if (!colEl) return;
        const curtainEl = desktopCurtainRefs.current[idx];
        const textEl = desktopTextRefs.current[idx];

        if (prefersReduced) {
          if (curtainEl) gsap.set(curtainEl, { clipPath: "inset(0 0 0% 0)" });
          if (textEl) gsap.set(textEl, { opacity: 1, y: 0 });
          return;
        }

        // Curtain reveal
        if (curtainEl) {
          gsap.fromTo(
            curtainEl,
            { clipPath: "inset(0 0 100% 0)" },
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 1.1,
              ease: "cubic-bezier(0.76, 0, 0.24, 1)",
              scrollTrigger: {
                trigger: colEl,
                start: "top 85%",
                once: true,
              },
            }
          );
        }

        // Text fade up
        if (textEl) {
          gsap.fromTo(
            textEl,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: 0.2,
              ease: "cubic-bezier(0.22, 1, 0.36, 1)",
              scrollTrigger: {
                trigger: colEl,
                start: "top 85%",
                once: true,
              },
            }
          );
        }

        // Wrapper moves with scrub 1.2 (±24px)
        const delta = columnScrubs[idx] || 0;
        gsap.fromTo(
          colEl,
          { y: -delta },
          {
            y: delta,
            ease: "none",
            scrollTrigger: {
              trigger: desktopSectionRef.current || colEl,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      });

      // 2. Mobile: Curtain reveal on staggered editorial blocks
      mobileCurtainRefs.current.forEach((curtainEl, idx) => {
        if (!curtainEl) return;
        const textEl = mobileTextRefs.current[idx];

        if (prefersReduced) {
          gsap.set(curtainEl, { clipPath: "inset(0 0 0% 0)" });
          if (textEl) gsap.set(textEl, { opacity: 1, y: 0 });
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

        if (textEl) {
          gsap.fromTo(
            textEl,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: 0.2,
              ease: "cubic-bezier(0.22, 1, 0.36, 1)",
              scrollTrigger: {
                trigger: textEl,
                start: "top 90%",
                once: true,
              },
            }
          );
        }
      });
    });

    return () => ctx.revert();
  }, [columns]);

  // Column offsets: 0, 72px, 36px
  const desktopOffsets = ["mt-0", "mt-[72px]", "mt-[36px]"];

  return (
    <article className="w-full bg-white overflow-x-clip">
      <HeroBand
        variant="immersive"
        imageSrc={poultryImages.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        {/* Desktop: Staggered Triptych. 3 columns, gap 40px. Column offsets: 0, 72px, 36px */}
        <div
          ref={desktopSectionRef}
          className="hidden lg:grid grid-cols-3 gap-[40px] items-start pb-20"
        >
          {columns.map((c, idx) => (
            <div
              key={idx}
              ref={(el) => {
                desktopColRefs.current[idx] = el;
              }}
              className={`text-left ${desktopOffsets[idx]}`}
            >
              {/* Pic at its real ratio (3:2, no crop) with curtain reveal */}
              <div
                className="relative w-full overflow-hidden bg-[rgba(10,10,10,0.05)]"
                style={{ aspectRatio: "3 / 2" }}
              >
                <div
                  ref={(el) => {
                    desktopCurtainRefs.current[idx] = el;
                  }}
                  className="w-full h-full overflow-hidden"
                  style={{ clipPath: "inset(0 0 100% 0)" }}
                >
                  <img
                    src={cld(c.img, 1920)}
                    srcSet={`${cld(c.img, 960)} 960w, ${cld(c.img, 1280)} 1280w, ${cld(c.img, 1920)} 1920w`}
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    alt={c.title}
                    className="w-full h-full object-cover block"
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
              </div>

              {/* 28px below it: title (28px, TwoTone) and text (16px) */}
              <div
                ref={(el) => {
                  desktopTextRefs.current[idx] = el;
                }}
                className="mt-[28px]"
              >
                <h3 className="text-[28px] font-semibold text-[var(--ink)] leading-[1.2] tracking-[-0.015em] mb-3">
                  <TwoTone text={c.title} />
                </h3>
                <p className="text-[16px] text-[var(--grey-strong)] leading-[1.65]">
                  {c.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Staggered editorial. Block 1: 86% left, Block 2: 86% right, Block 3: 86% left. 64px between blocks. */}
        <div className="lg:hidden space-y-[64px] text-left">
          {columns.map((c, idx) => {
            const isRightAligned = idx === 1; // block 2 is 86% aligned right, blocks 1 & 3 are left
            return (
              <div key={idx} className="w-full">
                {/* 86% wide image, alternating left / right */}
                <div
                  className={`w-[86%] ${isRightAligned ? "ml-auto" : "mr-auto"}`}
                >
                  <div
                    className="relative w-full overflow-hidden bg-[rgba(10,10,10,0.05)]"
                    style={{ aspectRatio: "3 / 2" }}
                  >
                    <div
                      ref={(el) => {
                        mobileCurtainRefs.current[idx] = el;
                      }}
                      className="w-full h-full overflow-hidden"
                      style={{ clipPath: "inset(0 0 100% 0)" }}
                    >
                      <img
                        src={cld(c.img, 1600)}
                        srcSet={`${cld(c.img, 640)} 640w, ${cld(c.img, 960)} 960w, ${cld(c.img, 1280)} 1280w`}
                        sizes="86vw"
                        alt={c.title}
                        className="w-full h-full object-cover block"
                        loading={idx === 0 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>

                {/* Title (22px) and text (15px) at full width below */}
                <div
                  ref={(el) => {
                    mobileTextRefs.current[idx] = el;
                  }}
                  className="w-full mt-6"
                >
                  <h3 className="text-[22px] font-semibold text-[var(--ink)] leading-[1.25] tracking-[-0.01em] mb-2.5">
                    <TwoTone text={c.title} />
                  </h3>
                  <p className="text-[15px] text-[var(--grey-strong)] leading-[1.65]">
                    {c.text}
                  </p>
                </div>
              </div>
            );
          })}
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
        image={poultryImages.next}
        nextUrl="/industrial-sheds-pakistan/workshop-sheds/"
        nextTitle="Workshop Sheds"
      />
    </article>
  );
};

// 9.11 Workshop Sheds — signature: "Hover image list (Desktop) & Accordion Title List (Mobile)"
export const WorkshopShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const workshopImages = {
    hero: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033639/workshop-hero.jpg",
    w1: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033635/workshop-.jpg",
    w2: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033637/workshop-2.jpg",
    w3: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033638/workshop-3.jpg",
    next: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033640/workshop-next.jpg",
  };

  const images = [workshopImages.w1, workshopImages.w2, workshopImages.w3];

  const rows = sections.slice(0, 3).map((sec, idx) => ({
    title: sec.title,
    text: sec.text,
    img: images[idx] || images[0],
  }));

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [openMobileIdx, setOpenMobileIdx] = useState<number | null>(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <article className="w-full bg-white" onMouseMove={handleMouseMove}>
      <HeroBand
        variant="immersive"
        imageSrc={workshopImages.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)] relative">
        {/* Floating preview image following cursor on desktop fine pointer (360px wide, ratio 3:2) */}
        {hoveredIdx !== null && (
          <div
            className="hidden lg:block fixed pointer-events-none z-30 overflow-hidden shadow-2xl border-2 border-white transition-opacity duration-300"
            style={{
              width: "360px",
              aspectRatio: "3 / 2",
              left: `${cursorPos.x + 24}px`,
              top: `${cursorPos.y - 120}px`,
            }}
          >
            <img
              src={cld(rows[hoveredIdx].img, 1280)}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Desktop List: No outline numbers, hover list preserved */}
        <div className="hidden lg:block divide-y divide-[var(--rule)] border-t border-b border-[var(--rule)]">
          {rows.map((r, idx) => {
            const isHovered = hoveredIdx === idx;
            const isOtherHovered = hoveredIdx !== null && !isHovered;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`py-14 grid grid-cols-12 gap-8 items-start text-left transition-all duration-400 cursor-pointer ${
                  isOtherHovered ? "opacity-40" : "opacity-100"
                }`}
              >
                <div className="col-span-5">
                  <h3
                    className={`font-bold transition-transform duration-300 ${
                      isHovered ? "translate-x-4 text-[var(--blue)]" : "text-[var(--ink)]"
                    }`}
                    style={{ fontSize: "var(--fs-h2)" }}
                  >
                    {r.title}
                  </h3>
                </div>
                <div className="col-span-7">
                  <p className="text-[var(--grey-strong)] leading-[1.7]" style={{ fontSize: "var(--fs-body)" }}>
                    {r.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: Title List. Each row: title (24px/500) and plus icon. Row height 76px, hairlines. Tap opens: first image (full-bleed 3:2, curtain 700ms), then text (15px). One open at a time. First row open at load. */}
        <div className="lg:hidden border-t border-[var(--rule)] divide-y divide-[var(--rule)] text-left">
          {rows.map((r, idx) => {
            const isOpen = openMobileIdx === idx;
            return (
              <div key={idx} className="w-full">
                <button
                  type="button"
                  onClick={() => setOpenMobileIdx(isOpen ? null : idx)}
                  className="w-full min-h-[76px] py-4 flex items-center justify-between text-left cursor-pointer transition-colors"
                >
                  <span className="text-[24px] font-[500] text-[var(--ink)] tracking-[-0.01em] pr-4">
                    {r.title}
                  </span>
                  <span
                    className={`text-[28px] font-light text-[var(--ink)] leading-none transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="pb-8 overflow-hidden">
                    {/* Full-bleed 3:2 image with 700ms curtain reveal */}
                    <div
                      className="relative w-full overflow-hidden bg-[rgba(10,10,10,0.05)]"
                      style={{
                        aspectRatio: "3 / 2",
                        marginInline: "calc(var(--gutter) * -1)",
                        width: "calc(100% + var(--gutter) * 2)",
                      }}
                    >
                      <div
                        className="w-full h-full overflow-hidden"
                        style={{
                          animation: "workshopCurtain 700ms cubic-bezier(0.76, 0, 0.24, 1) forwards",
                        }}
                      >
                        <img
                          src={cld(r.img, 1280)}
                          alt={r.title}
                          className="w-full h-full object-cover block"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Text: 15px */}
                    <div
                      className="mt-4"
                      style={{
                        animation: "workshopTextFade 400ms ease-out 250ms both",
                      }}
                    >
                      <p className="text-[15px] text-[var(--grey-strong)] leading-[1.65]">
                        {r.text}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <style>{`
          @keyframes workshopCurtain {
            from { clip-path: inset(0 0 100% 0); }
            to { clip-path: inset(0 0 0% 0); }
          }
          @keyframes workshopTextFade {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
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
        image={workshopImages.next}
        nextUrl="/industrial-sheds-pakistan/crane-sheds/"
        nextTitle="Crane Sheds"
      />
    </article>
  );
};

// Helper component for count-up animated stats in Raiwind blue band
const StatNum: React.FC<{ value: number; unit: string; mobile?: boolean }> = ({
  value,
  unit,
  mobile = false,
}) => {
  const ref = useCountUp(value, { duration: 1.6, format: true });

  return (
    <div className="flex flex-col text-left">
      <span
        ref={ref}
        className={`font-[500] text-white leading-none tracking-tight ${
          mobile ? "text-[28px]" : "text-[44px]"
        }`}
      >
        0
      </span>
      <span className="text-[13px] text-white/70 font-normal mt-2 leading-tight">
        {unit}
      </span>
    </div>
  );
};

// 9.12 Crane Sheds — signature: "Full-width wide band, Raiwind stat band & Sentence grid"
export const CraneShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);

  const craneImages = {
    hero: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033617/crane-hero.jpg",
    wide: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033618/crane-wide.jpg",
    next: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033618/crane-next.jpg",
    extra: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033599/crane-system-hero.jpg",
  };

  const wideSectionRef = useRef<HTMLDivElement>(null);
  const wideCurtainRef = useRef<HTMLDivElement>(null);
  const wideImgRef = useRef<HTMLImageElement>(null);
  const sentenceHairlineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Split Design Points paragraph into exact sentences
  const designSentences = [
    "Crane capacity, span, lifting height and duty cycle set the size of columns and runway beams.",
    "Rails must be level and straight within tight limits, and the factory cuts and drills them to drawing.",
    "Crane columns carry large loads, so the foundation is designed with the steel.",
    "Crane stops, access ladders and walkways are placed in the design.",
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Wide image: Curtain reveal 1200ms and scale 1.04 -> 1
      if (prefersReduced) {
        if (wideCurtainRef.current) gsap.set(wideCurtainRef.current, { clipPath: "inset(0 0 0% 0)" });
        if (wideImgRef.current) gsap.set(wideImgRef.current, { scale: 1 });
      } else {
        if (wideCurtainRef.current) {
          gsap.fromTo(
            wideCurtainRef.current,
            { clipPath: "inset(0 0 100% 0)" },
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 1.2,
              ease: "cubic-bezier(0.76, 0, 0.24, 1)",
              scrollTrigger: {
                trigger: wideSectionRef.current,
                start: "top 80%",
                once: true,
              },
            }
          );
        }

        if (wideImgRef.current) {
          gsap.fromTo(
            wideImgRef.current,
            { scale: 1.04 },
            {
              scale: 1,
              duration: 1.2,
              ease: "cubic-bezier(0.23, 1, 0.32, 1)",
              scrollTrigger: {
                trigger: wideSectionRef.current,
                start: "top 80%",
                once: true,
              },
            }
          );
        }
      }

      // Sentence hairlines draw across
      sentenceHairlineRefs.current.forEach((hl) => {
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
              start: "top 92%",
              once: true,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <article className="w-full bg-white overflow-x-clip">
      {/* 1. Hero */}
      <HeroBand
        variant="immersive"
        imageSrc={craneImages.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* 2. Intro: title left (TwoTone), text right (lead rule). Mobile: Intro stacked. */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-[96px] items-start">
          <div className="lg:col-span-5">
            <h2
              className="font-bold text-[var(--ink)] leading-[1.15] tracking-[-0.02em]"
              style={{ fontSize: "var(--fs-h2)" }}
            >
              <TwoTone text={sections[0]?.title || "What a Crane Shed Is"} />
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 max-w-[640px]">
            <div className="w-10 h-[1px] bg-[var(--blue)] mb-4" />
            <p className="text-[15px] lg:text-[17px] text-[var(--grey-strong)] leading-[1.7]">
              {sections[0]?.text || introPs.join(" ")}
            </p>
          </div>
        </div>
      </section>

      {/* 3. Wide Image: 100vw, Pic 64/27, no crop, no rail, no square. Curtain reveal 1200ms and scale 1.04 -> 1. Mobile: full-bleed 64:27 */}
      <section
        ref={wideSectionRef}
        className="relative w-full overflow-hidden bg-[rgba(10,10,10,0.05)]"
        style={{ aspectRatio: "64 / 27" }}
      >
        <div
          ref={wideCurtainRef}
          className="w-full h-full overflow-hidden"
          style={{ clipPath: "inset(0 0 100% 0)" }}
        >
          <img
            ref={wideImgRef}
            src={cld(craneImages.wide, 2560)}
            srcSet={`${cld(craneImages.wide, 1280)} 1280w, ${cld(craneImages.wide, 1920)} 1920w, ${cld(craneImages.wide, 2560)} 2560w`}
            sizes="100vw"
            alt="Crane Shed Runway Structure"
            className="w-full h-full object-cover block"
            loading="lazy"
          />
        </div>
      </section>

      {/* 4. "The Raiwind Crane Sheds": full-width blue band. Grid 5fr/7fr. Left: title in white (TwoTone: first part white, rest white at 55%). Right: existing paragraph (white 88%, 18px). Under it stat band for two sheds. */}
      <section className="w-full bg-[var(--blue)] text-white py-[var(--sec-y-lg)]">
        <div className="container text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5">
              <h2 className="text-[28px] lg:text-[38px] font-bold tracking-[-0.015em] leading-[1.2]">
                <TwoTone text={sections[1]?.title || "The Raiwind Crane Sheds"} light={true} />
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-white/88 text-[15px] lg:text-[18px] leading-[1.7] max-w-[640px]">
                {sections[1]?.text}
              </p>
            </div>
          </div>

          {/* Desktop Stat Band (4 columns per shed) */}
          <div className="hidden md:block mt-14 pt-12 border-t border-white/15 space-y-10">
            {/* Shed 1 */}
            <div>
              <span className="text-[13px] uppercase tracking-[0.08em] font-medium text-white/70 block mb-5">
                pre-engineered crane shed
              </span>
              <div className="grid grid-cols-4 gap-8">
                <StatNum value={96600} unit="square feet" />
                <StatNum value={30} unit="feet high" />
                <StatNum value={184} unit="feet wide" />
                <StatNum value={525} unit="feet long" />
              </div>
            </div>

            <div className="w-full h-[1px] bg-white/15" />

            {/* Shed 2 */}
            <div>
              <span className="text-[13px] uppercase tracking-[0.08em] font-medium text-white/70 block mb-5">
                PEB crane and mezzanine shed
              </span>
              <div className="grid grid-cols-4 gap-8">
                <StatNum value={97888} unit="square feet" />
                <StatNum value={33} unit="feet high" />
                <StatNum value={184} unit="feet wide" />
                <StatNum value={532} unit="feet long" />
              </div>
            </div>
          </div>

          {/* Mobile Stat Band (2x2 grid per shed, numbers 28px) */}
          <div className="md:hidden mt-8 pt-8 border-t border-white/15 space-y-8">
            {/* Shed 1 */}
            <div>
              <span className="text-[12px] uppercase tracking-[0.08em] font-medium text-white/70 block mb-3">
                pre-engineered crane shed
              </span>
              <div className="grid grid-cols-2 gap-4">
                <StatNum value={96600} unit="square feet" mobile={true} />
                <StatNum value={30} unit="feet high" mobile={true} />
                <StatNum value={184} unit="feet wide" mobile={true} />
                <StatNum value={525} unit="feet long" mobile={true} />
              </div>
            </div>

            <div className="w-full h-[1px] bg-white/15" />

            {/* Shed 2 */}
            <div>
              <span className="text-[12px] uppercase tracking-[0.08em] font-medium text-white/70 block mb-3">
                PEB crane and mezzanine shed
              </span>
              <div className="grid grid-cols-2 gap-4">
                <StatNum value={97888} unit="square feet" mobile={true} />
                <StatNum value={33} unit="feet high" mobile={true} />
                <StatNum value={184} unit="feet wide" mobile={true} />
                <StatNum value={532} unit="feet long" mobile={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Design Points: grid 4fr/8fr. Left sticky: title and extra image (Pic 3:2). Right: split existing paragraph into its sentences. One row per sentence: 1px top hairline (draws), sentence 20px, padding 28px 0. Mobile: title, extra image (full-bleed 3:2), sentence rows (text 16px). */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        {/* Desktop View */}
        <div className="hidden lg:grid grid-cols-12 gap-12 items-start">
          <div className="col-span-4 sticky top-[calc(var(--nav-offset,80px)+24px)] space-y-6">
            <h3 className="text-[32px] font-bold text-[var(--ink)] leading-[1.2] tracking-[-0.015em]">
              {sections[2]?.title || "Design Points for Crane Sheds"}
            </h3>
            <div className="w-full overflow-hidden">
              <Pic
                src={craneImages.extra}
                alt={sections[2]?.title || "Design Points for Crane Sheds"}
                ratio={3 / 2}
                className="w-full"
              />
            </div>
          </div>

          <div className="col-span-8 divide-y divide-[var(--rule)] border-b border-[var(--rule)]">
            {designSentences.map((sentence, idx) => (
              <div key={idx} className="relative">
                <div
                  ref={(el) => {
                    sentenceHairlineRefs.current[idx] = el;
                  }}
                  className="w-full h-[1px] bg-[var(--rule)] origin-left"
                />
                <div className="py-[28px]">
                  <p className="text-[20px] font-normal text-[var(--ink)] leading-[1.65]">
                    {sentence}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden text-left space-y-6">
          <h3 className="text-[24px] font-bold text-[var(--ink)] leading-[1.25] tracking-[-0.01em]">
            {sections[2]?.title || "Design Points for Crane Sheds"}
          </h3>

          <div className="-mx-[var(--gutter)] w-[calc(100%+var(--gutter)*2)]">
            <Pic
              src={craneImages.extra}
              alt={sections[2]?.title || "Design Points for Crane Sheds"}
              ratio={3 / 2}
              className="w-full"
            />
          </div>

          <div className="divide-y divide-[var(--rule)] border-t border-b border-[var(--rule)]">
            {designSentences.map((sentence, idx) => (
              <div key={idx} className="py-5">
                <p className="text-[16px] font-normal text-[var(--ink)] leading-[1.65]">
                  {sentence}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Learn More: heading and sentence, then two link rows (no boxes). Desktop: height 120px, hairline top and bottom, title 36px/500 left, 52px round arrow right. Mobile: height 88px, title 22px, round arrow 44px. */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <div className="mb-10 max-w-[720px]">
          <h3 className="text-[26px] lg:text-[32px] font-bold text-[var(--ink)] tracking-[-0.015em] mb-3">
            {sections[3]?.title || "Learn More"}
          </h3>
          <p className="text-[15px] lg:text-[17px] text-[var(--grey-strong)] leading-[1.65]">
            {sections[3]?.text || "Read the Crane System page for technical detail and the Crane Gantry Structures page for outdoor cranes."}
          </p>
        </div>

        <div className="border-b border-[var(--rule)]">
          {/* Link 1: Crane System */}
          <TransitionLink
            to="/pre-engineered-buildings-pakistan/crane-system/"
            className="group flex items-center justify-between min-h-[88px] lg:min-h-[120px] py-4 lg:py-6 border-t border-[var(--rule)] transition-colors duration-300"
          >
            <span className="text-[22px] lg:text-[36px] font-[500] text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors duration-300">
              Crane System
            </span>
            <div className="w-[44px] h-[44px] lg:w-[52px] lg:h-[52px] rounded-full border border-[var(--rule)] flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--blue)] group-hover:border-[var(--blue)] group-hover:text-white text-[var(--ink)] flex-shrink-0">
              <span className="text-[18px] lg:text-[22px] transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true">
                &rarr;
              </span>
            </div>
          </TransitionLink>

          {/* Link 2: Crane Gantry Structures */}
          <TransitionLink
            to="/structural-steel-fabrication-pakistan/crane-gantry-structures/"
            className="group flex items-center justify-between min-h-[88px] lg:min-h-[120px] py-4 lg:py-6 border-t border-[var(--rule)] transition-colors duration-300"
          >
            <span className="text-[22px] lg:text-[36px] font-[500] text-[var(--ink)] group-hover:text-[var(--blue)] transition-colors duration-300">
              Crane Gantry Structures
            </span>
            <div className="w-[44px] h-[44px] lg:w-[52px] lg:h-[52px] rounded-full border border-[var(--rule)] flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--blue)] group-hover:border-[var(--blue)] group-hover:text-white text-[var(--ink)] flex-shrink-0">
              <span className="text-[18px] lg:text-[22px] transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true">
                &rarr;
              </span>
            </div>
          </TransitionLink>
        </div>
      </section>

      {/* 7. FAQ */}
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

      {/* 8. Next Banner */}
      <NextBand
        image={craneImages.next}
        nextUrl="/steel-warehouses-pakistan/storage-warehouses/"
        nextTitle="Storage Warehouses"
      />
    </article>
  );
};
