import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
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
import { cl } from "../../../lib/cloudinary.ts";
import { Reveal } from "../../../lib/motion.ts";

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

// 9.8 Factory Sheds — signature: "Stacking cards" with One-Step text styles & slowed STACK
export const FactoryShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const cards = [
    {
      num: "01",
      title: sections[0]?.title || "What a Factory Shed Must Do",
      text: sections[0]?.text || "",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033626/factory-1.jpg",
    },
    {
      num: "02",
      title: sections[1]?.title || "Design Points for Factory Sheds",
      text: sections[1]?.text || "",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033627/factory-2.jpg",
    },
    {
      num: "03",
      title: sections[2]?.title || "Typical Users",
      text: sections[2]?.text || "",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033627/factory-3.jpg",
    },
    {
      num: "04",
      title: sections[3]?.title || "From Brief to Production",
      text: sections[3]?.text || "",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033628/factory-4.jpg",
    },
  ];

  const [mobileOpenIdx, setMobileOpenIdx] = useState<number>(0); // First open at load
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const mainRef = useRef<HTMLElement>(null);
  const desktopCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopShadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const photoBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const photoImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileShadeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const faqSecRef = useRef<HTMLElement>(null);
  const faqTitleRef = useRef<HTMLHeadingElement>(null);

  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        debouncedRefresh();
      });
    }
  }, [debouncedRefresh]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // 1. DESKTOP: (min-width: 1024px)
      mm.add("(min-width: 1024px)", () => {
        // Desktop STACK: For every card except the last, trigger = NEXT card, scrub 1.4
        // Tweens current card's .inner to scale .95 and .shade to opacity .32 (ease "none")
        for (let i = 0; i < cards.length - 1; i++) {
          const nextCard = desktopCardRefs.current[i + 1];
          const currentInner = desktopInnerRefs.current[i];
          const currentShade = desktopShadeRefs.current[i];
          if (!nextCard || !currentInner || !currentShade) continue;

          const navOffset =
            parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue("--nav-offset")
            ) || 80;
          const stickyTopPx = navOffset + 24 + i * 12;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: nextCard,
              start: "top bottom",
              end: () => `top ${stickyTopPx}px`,
              scrub: 1.4,
              invalidateOnRefresh: true,
            },
          });

          tl.to(
            currentInner,
            {
              scale: 0.95,
              ease: "none",
            },
            0
          );

          tl.to(
            currentShade,
            {
              opacity: 0.32,
              ease: "none",
            },
            0
          );
        }

        // Inside each card: photo & text come in with RISE and CURTAIN (900ms)
        // the first time the card reaches its sticky position (once), not during the stack scrub.
        for (let i = 0; i < cards.length; i++) {
          const card = desktopCardRefs.current[i];
          const photoBox = photoBoxRefs.current[i];
          const photoImg = photoImgRefs.current[i];
          const numEl = numRefs.current[i];
          const titleEl = titleRefs.current[i];
          const textEl = textRefs.current[i];
          if (!card || !photoBox || !photoImg || !numEl || !titleEl || !textEl) continue;

          gsap.set(photoBox, { clipPath: "inset(0 0 100% 0)" });
          gsap.set(photoImg, { scale: 1.06 });
          gsap.set([numEl, titleEl, textEl], { y: 24, opacity: 0 });

          ScrollTrigger.create({
            trigger: card,
            start: () => {
              const navOffset =
                parseFloat(
                  getComputedStyle(document.documentElement).getPropertyValue("--nav-offset")
                ) || 80;
              const stickyTopPx = navOffset + 24 + i * 12;
              return `top ${stickyTopPx + 20}px`;
            },
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              // CURTAIN on photo (900ms with E2, inner img scale 1.06 to 1 over 900ms * 1.3 with E1)
              gsap.to(photoBox, {
                clipPath: "inset(0 0 0% 0)",
                duration: 0.9,
                ease: "E2",
                overwrite: "auto",
              });
              gsap.to(photoImg, {
                scale: 1,
                duration: 0.9 * 1.3,
                ease: "E1",
                overwrite: "auto",
              });

              // RISE on number, title, text
              gsap.to([numEl, titleEl, textEl], {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "E1",
                stagger: 0.09,
                overwrite: "auto",
                onStart: () => {
                  gsap.set([numEl, titleEl, textEl], {
                    willChange: "transform, opacity",
                  });
                },
                onComplete: () => {
                  gsap.set([numEl, titleEl, textEl], {
                    clearProps: "willChange",
                  });
                },
              });
            },
          });
        }

        // FAQ section RISE reveal once
        if (faqSecRef.current && faqTitleRef.current) {
          gsap.set(faqTitleRef.current, { y: 24, opacity: 0 });

          ScrollTrigger.create({
            trigger: faqSecRef.current,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              gsap.to(faqTitleRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "E1",
                overwrite: "auto",
                onStart: () => {
                  gsap.set(faqTitleRef.current, { willChange: "transform, opacity" });
                },
                onComplete: () => {
                  gsap.set(faqTitleRef.current, { clearProps: "willChange" });
                },
              });
            },
          });
        }
      });

      // 2. MOBILE: (max-width: 1023px)
      mm.add("(max-width: 1023px)", () => {
        // Mobile STACK: For every card except the last
        for (let i = 0; i < cards.length - 1; i++) {
          const nextCard = mobileCardRefs.current[i + 1];
          const currentInner = mobileInnerRefs.current[i];
          const currentShade = mobileShadeRefs.current[i];
          if (!nextCard || !currentInner || !currentShade) continue;

          const navOffset =
            parseFloat(
              getComputedStyle(document.documentElement).getPropertyValue("--nav-offset")
            ) || 60;
          const stickyTopPx = navOffset + 12 + i * 10;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: nextCard,
              start: "top bottom",
              end: () => `top ${stickyTopPx}px`,
              scrub: 1.4,
              invalidateOnRefresh: true,
            },
          });

          tl.to(
            currentInner,
            {
              scale: 0.95,
              ease: "none",
            },
            0
          );

          tl.to(
            currentShade,
            {
              opacity: 0.32,
              ease: "none",
            },
            0
          );
        }

        // FAQ section RISE reveal once on mobile
        if (faqSecRef.current && faqTitleRef.current) {
          gsap.set(faqTitleRef.current, { y: 24, opacity: 0 });

          ScrollTrigger.create({
            trigger: faqSecRef.current,
            start: "top 90%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              gsap.to(faqTitleRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "E1",
                overwrite: "auto",
                onStart: () => {
                  gsap.set(faqTitleRef.current, { willChange: "transform, opacity" });
                },
                onComplete: () => {
                  gsap.set(faqTitleRef.current, { clearProps: "willChange" });
                },
              });
            },
          });
        }
      });

      // 3. REDUCED MOTION
      mm.add("(prefers-reduced-motion: reduce)", () => {
        photoBoxRefs.current.forEach((el) => {
          if (el) gsap.set(el, { clipPath: "inset(0 0 0% 0)" });
        });
        photoImgRefs.current.forEach((el) => {
          if (el) gsap.set(el, { scale: 1 });
        });
        numRefs.current.forEach((el) => {
          if (el) gsap.set(el, { y: 0, opacity: 1 });
        });
        titleRefs.current.forEach((el) => {
          if (el) gsap.set(el, { y: 0, opacity: 1 });
        });
        textRefs.current.forEach((el) => {
          if (el) gsap.set(el, { y: 0, opacity: 1 });
        });
        desktopInnerRefs.current.forEach((el) => {
          if (el) gsap.set(el, { scale: 1 });
        });
        desktopShadeRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 0 });
        });
        mobileInnerRefs.current.forEach((el) => {
          if (el) gsap.set(el, { scale: 1 });
        });
        mobileShadeRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 0 });
        });
        if (faqTitleRef.current) {
          gsap.set(faqTitleRef.current, { y: 0, opacity: 1 });
        }
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const toggleMobileAccordion = (idx: number) => {
    setMobileOpenIdx((prev) => (prev === idx ? -1 : idx));
    debouncedRefresh();
  };

  return (
    <article ref={mainRef} className="w-full bg-white text-[var(--ink)]">
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033628/Factory-hero.jpg"
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)]">
        {/* Desktop: Stacking Cards with margin-bottom: 38svh, card height: min(78svh, 640px) */}
        <div className="hidden lg:block relative w-full">
          {cards.map((c, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div
                key={c.num}
                ref={(el) => {
                  desktopCardRefs.current[idx] = el;
                }}
                className="relative w-full"
                style={{
                  position: "sticky",
                  top: `calc(var(--nav-offset, 80px) + 24px + ${idx * 12}px)`,
                  zIndex: idx + 1,
                  marginBottom: idx === cards.length - 1 ? "0" : "38svh",
                  height: "min(78svh, 640px)",
                  minHeight: "min(78svh, 640px)",
                }}
              >
                {/* .inner holds the content and animates scale on scrub */}
                <div
                  ref={(el) => {
                    desktopInnerRefs.current[idx] = el;
                  }}
                  className="relative w-full h-full bg-white border border-[var(--rule)] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden"
                  style={{ transformOrigin: "top center" }}
                >
                  <div className="grid grid-cols-12 items-stretch h-full w-full">
                    {/* Photo Column at real shape with CURTAIN reveal */}
                    <div
                      className={`col-span-6 overflow-hidden relative flex items-center justify-center p-8 lg:p-12 bg-slate-50 ${
                        isEven ? "order-2" : "order-1"
                      }`}
                    >
                      <div
                        ref={(el) => {
                          photoBoxRefs.current[idx] = el;
                        }}
                        className="relative w-full overflow-hidden bg-slate-900 shadow-md"
                        style={{
                          aspectRatio: "1024 / 687",
                          clipPath: "inset(0 0 100% 0)",
                        }}
                      >
                        <img
                          ref={(el) => {
                            photoImgRefs.current[idx] = el;
                          }}
                          src={cl(c.img, 1920)}
                          alt={c.title}
                          width={1024}
                          height={687}
                          loading={idx === 0 ? "eager" : "lazy"}
                          decoding="async"
                          className="w-full h-full object-cover block"
                          style={{
                            aspectRatio: "1024 / 687",
                            transform: "scale(1.06)",
                          }}
                          onLoad={debouncedRefresh}
                        />
                      </div>
                    </div>

                    {/* Text Column with RISE reveal */}
                    <div
                      className={`col-span-6 p-10 lg:p-14 flex flex-col justify-center text-left ${
                        isEven ? "order-1" : "order-2"
                      }`}
                    >
                      {/* Solid bold blue number above title */}
                      <span
                        ref={(el) => {
                          numRefs.current[idx] = el;
                        }}
                        className="block font-extrabold text-[var(--blue)] leading-none select-none mb-3"
                        style={{ fontSize: "64px" }}
                      >
                        {c.num}
                      </span>

                      {/* Title: sentence case, bold, ink */}
                      <h3
                        ref={(el) => {
                          titleRefs.current[idx] = el;
                        }}
                        className="text-[20px] font-bold text-[#0A0A0A] leading-snug mb-4 tracking-[-0.01em]"
                      >
                        {c.title}
                      </h3>

                      {/* Text: One-Step blue, regular weight, max-w-[480px] */}
                      <p
                        ref={(el) => {
                          textRefs.current[idx] = el;
                        }}
                        className="text-[16px] leading-[1.7] text-[var(--blue)] font-normal max-w-[480px]"
                      >
                        {c.text}
                      </p>
                    </div>
                  </div>

                  {/* Dark overlay for smooth stacking shade */}
                  <div
                    ref={(el) => {
                      desktopShadeRefs.current[idx] = el;
                    }}
                    className="absolute inset-0 bg-black pointer-events-none"
                    style={{ opacity: 0 }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: 4 stacking cards with full-bleed photos, no borders, 64px row with title and plus icon */}
        <div className="lg:hidden relative w-full max-w-[540px] mx-auto flex flex-col pb-24">
          {cards.map((c, idx) => {
            const isOpen = mobileOpenIdx === idx;

            return (
              <div
                key={c.num}
                ref={(el) => {
                  mobileCardRefs.current[idx] = el;
                }}
                className="relative w-full"
                style={{
                  position: "sticky",
                  top: `calc(var(--nav-offset, 60px) + 12px + ${idx * 10}px)`,
                  zIndex: idx + 1,
                  marginBottom: "14svh",
                }}
              >
                {/* .inner holds the content with scale animation on scroll */}
                <div
                  ref={(el) => {
                    mobileInnerRefs.current[idx] = el;
                  }}
                  className="relative w-full bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden"
                  style={{ transformOrigin: "top center" }}
                >
                  {/* Photo edge to edge inside card at its real shape */}
                  <div
                    className="w-full bg-slate-900 overflow-hidden"
                    style={{ aspectRatio: "1024 / 687" }}
                  >
                    <img
                      src={cl(c.img, 1920)}
                      alt={c.title}
                      width={1024}
                      height={687}
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="w-full h-full object-cover block"
                      style={{ aspectRatio: "1024 / 687" }}
                      onLoad={debouncedRefresh}
                    />
                  </div>

                  {/* 64px row with title and plus icon */}
                  <button
                    type="button"
                    onClick={() => toggleMobileAccordion(idx)}
                    className="w-full h-[64px] min-h-[64px] px-5 flex items-center justify-between text-left cursor-pointer border-0 bg-white select-none focus-visible:outline-none"
                    aria-expanded={isOpen}
                  >
                    <h3 className="text-[17px] font-bold text-[#0A0A0A] leading-snug pr-3">
                      {c.title}
                    </h3>
                    <span className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-[#0A0A0A]">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        style={{
                          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                          transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </button>

                  {/* Expandable text panel using grid-template-rows: 0fr -> 1fr, 600ms */}
                  <div
                    className="grid"
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition: "grid-template-rows 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <div className="min-h-0 overflow-hidden px-5">
                      <p
                        className="text-[15px] leading-[1.6] text-[var(--blue)] font-normal pb-6"
                        style={{
                          opacity: isOpen ? 1 : 0,
                          transition: isOpen
                            ? "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1) 150ms"
                            : "opacity 200ms ease 0ms",
                        }}
                      >
                        {c.text}
                      </p>
                    </div>
                  </div>

                  {/* .shade (absolute dark overlay, opacity 0, tweens to 0.32) */}
                  <div
                    ref={(el) => {
                      mobileShadeRefs.current[idx] = el;
                    }}
                    className="absolute inset-0 bg-black pointer-events-none"
                    style={{ opacity: 0 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Frequently Asked Questions (One-Step style, ZERO grey text) */}
      {data.faq && data.faq.length > 0 && (
        <section ref={faqSecRef} className="container py-[var(--sec-y-lg)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2
              ref={faqTitleRef}
              className="text-[16px] lg:text-[44px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8"
            >
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="w-full divide-y divide-[rgba(15,23,42,0.12)] border-y border-[rgba(15,23,42,0.12)]">
              {data.faq.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                const panelId = `faq-factory-panel-${idx}`;
                const headerId = `faq-factory-header-${idx}`;

                return (
                  <div key={idx} className="group overflow-hidden">
                    <button
                      id={headerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => {
                        setOpenFaqIdx((prev) => (prev === idx ? null : idx));
                        debouncedRefresh();
                      }}
                      className="w-full min-h-[52px] py-5 flex items-center justify-between text-left cursor-pointer focus-visible:outline-none"
                    >
                      <span className="font-bold text-[17px] lg:text-[20px] text-[#0A0A0A] pr-6 leading-snug">
                        {item.q}
                      </span>

                      <span className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-[#0A0A0A]">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          style={{
                            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                            transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </span>
                    </button>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={headerId}
                      className="grid"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                        transition: "grid-template-rows 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <p
                          className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[var(--blue)] font-normal pb-6 max-w-[680px]"
                          style={{
                            opacity: isOpen ? 1 : 0,
                            transition: isOpen
                              ? "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1) 150ms"
                              : "opacity 200ms ease 0ms",
                          }}
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

      {/* Next Banner with Image */}
      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033631/factory-next.jpg"
        nextUrl="/industrial-sheds-pakistan/dairy-farm-sheds/"
        nextTitle="Dairy Farm Sheds"
      />
    </article>
  );
};

// 9.9 Dairy Farm Sheds — signature: "Wide bands with text card"
export const DairyShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);
  const images = [
    IMG.industrial.dairy.d1,
    IMG.industrial.dairy.d2,
    IMG.industrial.dairy.d3,
    IMG.industrial.dairy.d4,
  ];

  const bands = [
    {
      title: sections[0]?.title || "What Dairy Sheds Need",
      text: sections[0]?.text || "",
      img: images[0],
    },
    {
      title: sections[1]?.title || "Design Points for Dairy Sheds",
      text: sections[1]?.text || "",
      img: images[1],
    },
    {
      title: sections[2]?.title || "Experience",
      text: sections[2]?.text || "",
      img: images[2],
    },
    {
      title: sections[3]?.title || "Build in Phases",
      text: sections[3]?.text || "",
      img: images[3],
    },
  ];

  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const mainRef = useRef<HTMLElement>(null);
  const desktopBandRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopTitleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const desktopTextRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const faqSecRef = useRef<HTMLElement>(null);
  const faqTitleRef = useRef<HTMLHeadingElement>(null);

  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        debouncedRefresh();
      });
    }
  }, [debouncedRefresh]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // 1. DESKTOP: (min-width: 1024px) - Keep exactly as it is
      mm.add("(min-width: 1024px)", () => {
        // Desktop cards RISE once when band enters viewport
        for (let i = 0; i < bands.length; i++) {
          const band = desktopBandRefs.current[i];
          const card = desktopCardRefs.current[i];
          const title = desktopTitleRefs.current[i];
          const text = desktopTextRefs.current[i];
          if (!band || !card || !title || !text) continue;

          gsap.set([title, text], { y: 24, opacity: 0 });

          ScrollTrigger.create({
            trigger: band,
            start: "top 80%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              gsap.to([title, text], {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "E1",
                stagger: 0.09,
                overwrite: "auto",
                onStart: () => {
                  gsap.set([title, text], { willChange: "transform, opacity" });
                },
                onComplete: () => {
                  gsap.set([title, text], { clearProps: "willChange" });
                },
              });
            },
          });
        }

        // FAQ section RISE reveal once
        if (faqSecRef.current && faqTitleRef.current) {
          gsap.set(faqTitleRef.current, { y: 24, opacity: 0 });

          ScrollTrigger.create({
            trigger: faqSecRef.current,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              gsap.to(faqTitleRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "E1",
                overwrite: "auto",
                onStart: () => {
                  gsap.set(faqTitleRef.current, { willChange: "transform, opacity" });
                },
                onComplete: () => {
                  gsap.set(faqTitleRef.current, { clearProps: "willChange" });
                },
              });
            },
          });
        }
      });

      // 2. MOBILE: (max-width: 1023px) - Clean non-stacking RISE reveal
      mm.add("(max-width: 1023px)", () => {
        for (let i = 0; i < bands.length; i++) {
          const card = mobileCardRefs.current[i];
          if (!card) continue;

          gsap.set(card, { y: 20, opacity: 0 });

          ScrollTrigger.create({
            trigger: card,
            start: "top 90%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              gsap.to(card, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "E1",
                overwrite: "auto",
                onStart: () => {
                  gsap.set(card, { willChange: "transform, opacity" });
                },
                onComplete: () => {
                  gsap.set(card, { clearProps: "willChange" });
                },
              });
            },
          });
        }

        // FAQ section RISE reveal once on mobile
        if (faqSecRef.current && faqTitleRef.current) {
          gsap.set(faqTitleRef.current, { y: 24, opacity: 0 });

          ScrollTrigger.create({
            trigger: faqSecRef.current,
            start: "top 90%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              gsap.to(faqTitleRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "E1",
                overwrite: "auto",
                onStart: () => {
                  gsap.set(faqTitleRef.current, { willChange: "transform, opacity" });
                },
                onComplete: () => {
                  gsap.set(faqTitleRef.current, { clearProps: "willChange" });
                },
              });
            },
          });
        }
      });

      // 3. REDUCED MOTION
      mm.add("(prefers-reduced-motion: reduce)", () => {
        desktopTitleRefs.current.forEach((el) => {
          if (el) gsap.set(el, { y: 0, opacity: 1 });
        });
        desktopTextRefs.current.forEach((el) => {
          if (el) gsap.set(el, { y: 0, opacity: 1 });
        });
        mobileCardRefs.current.forEach((el) => {
          if (el) gsap.set(el, { y: 0, opacity: 1 });
        });
        if (faqTitleRef.current) {
          gsap.set(faqTitleRef.current, { y: 0, opacity: 1 });
        }
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <article ref={mainRef} className="w-full bg-white text-[var(--ink)]">
      <HeroBand
        variant="immersive"
        imageSrc={IMG.industrial.dairy.hero}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Main Section */}
      <section className="w-full">
        {/* Desktop: 4 full-width bands with 64/27 aspect ratio and floating white text cards (kept intact) */}
        <div className="hidden lg:flex flex-col space-y-12 my-[var(--sec-y-lg)]">
          {bands.map((b, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div
                key={idx}
                ref={(el) => {
                  desktopBandRefs.current[idx] = el;
                }}
                className="relative w-full overflow-hidden bg-slate-900"
                style={{
                  aspectRatio: "64 / 27",
                  width: "100%",
                }}
              >
                <img
                  src={cl(b.img, 2560)}
                  alt={b.title}
                  width={2560}
                  height={1080}
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-cover object-center absolute inset-0 block"
                  style={{ aspectRatio: "64 / 27" }}
                  onLoad={debouncedRefresh}
                />
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                {/* Desktop Floating White Text Card (no numbers, One-Step title & text style) */}
                <div
                  ref={(el) => {
                    desktopCardRefs.current[idx] = el;
                  }}
                  className={`absolute bottom-10 lg:bottom-12 p-8 lg:p-10 bg-white border border-[var(--rule)] text-left w-[520px] max-w-[520px] shadow-[0_4px_24px_rgba(0,0,0,0.08)] z-10 ${
                    isEven
                      ? "right-[max(32px,calc((100vw-var(--container))/2+32px))]"
                      : "left-[max(32px,calc((100vw-var(--container))/2+32px))]"
                  }`}
                >
                  {/* Title: bold, ink colour, sentence case, One-Step desktop 20px */}
                  <h3
                    ref={(el) => {
                      desktopTitleRefs.current[idx] = el;
                    }}
                    className="text-[20px] font-bold text-[#0A0A0A] leading-snug mb-3 tracking-[-0.01em]"
                  >
                    {b.title}
                  </h3>

                  {/* Text: One-Step blue, regular weight, 16px / 1.7 */}
                  <p
                    ref={(el) => {
                      desktopTextRefs.current[idx] = el;
                    }}
                    className="text-[16px] leading-[1.7] text-[var(--blue)] font-normal"
                  >
                    {b.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: Clean, non-stacking cards with uncropped 64/27 photos and One-Step text cards */}
        <div className="lg:hidden flex flex-col space-y-8 py-8 px-4 sm:px-6">
          {bands.map((b, idx) => {
            return (
              <div
                key={idx}
                ref={(el) => {
                  mobileCardRefs.current[idx] = el;
                }}
                className="w-full bg-white border border-[var(--rule)] shadow-[0_2px_12px_rgba(0,0,0,0.05)] overflow-hidden"
              >
                {/* Photo at real shape (64:27) - completely uncropped, zero zoom */}
                <div
                  className="w-full bg-slate-900 overflow-hidden relative"
                  style={{ aspectRatio: "64 / 27" }}
                >
                  <img
                    src={cl(b.img, 2560)}
                    alt={b.title}
                    width={2560}
                    height={1080}
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="w-full h-full object-cover block"
                    style={{ aspectRatio: "64 / 27" }}
                    onLoad={debouncedRefresh}
                  />
                </div>

                {/* Text Content below photo in One-Step style */}
                <div className="p-6 text-left">
                  {/* Title: bold, ink colour (#0A0A0A), sentence case, mobile 17px */}
                  <h3 className="text-[17px] font-bold text-[#0A0A0A] leading-snug mb-2 tracking-[-0.01em]">
                    {b.title}
                  </h3>

                  {/* Text: One-Step blue (var(--blue)), regular weight, mobile 15px / 1.6 */}
                  <p className="text-[15px] leading-[1.6] text-[var(--blue)] font-normal">
                    {b.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Frequently Asked Questions (One-Step style, ZERO grey text) */}
      {data.faq && data.faq.length > 0 && (
        <section ref={faqSecRef} className="container py-[var(--sec-y-lg)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2
              ref={faqTitleRef}
              className="text-[16px] lg:text-[44px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8"
            >
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="w-full divide-y divide-[rgba(15,23,42,0.12)] border-y border-[rgba(15,23,42,0.12)]">
              {data.faq.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                const panelId = `dairy-faq-panel-${idx}`;
                const headerId = `dairy-faq-header-${idx}`;

                return (
                  <div key={idx} className="group overflow-hidden">
                    <button
                      id={headerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => {
                        setOpenFaqIdx((prev) => (prev === idx ? null : idx));
                        debouncedRefresh();
                      }}
                      className="w-full min-h-[52px] py-5 flex items-center justify-between text-left cursor-pointer focus-visible:outline-none"
                    >
                      <span className="font-bold text-[17px] lg:text-[20px] text-[#0A0A0A] pr-6 leading-snug">
                        {item.q}
                      </span>

                      <span className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-[#0A0A0A]">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          style={{
                            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                            transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </span>
                    </button>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={headerId}
                      className="grid"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                        transition: "grid-template-rows 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <p
                          className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[var(--blue)] font-normal pb-6 max-w-[680px]"
                          style={{
                            opacity: isOpen ? 1 : 0,
                            transition: isOpen
                              ? "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1) 150ms"
                              : "opacity 200ms ease 0ms",
                          }}
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

      {/* Next Banner */}
      <NextBand
        image={IMG.industrial.dairy.next}
        nextUrl="/industrial-sheds-pakistan/poultry-sheds/"
        nextTitle="Poultry Sheds"
      />
    </article>
  );
};

// 9.10 Poultry Sheds — signature: "Staggered portrait strip"
export const PoultryShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);

  const items = [
    {
      num: "01",
      title: sections[0]?.title || "What Poultry Houses Need",
      text: sections[0]?.text || "",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033631/Poultry-1.jpg",
      w: 1024,
      h: 572,
      aspect: "1024 / 572",
      desktopOffset: "mt-0",
      mobileAlign: "left" as const,
    },
    {
      num: "02",
      title: sections[1]?.title || "Design Points for Poultry Sheds",
      text: sections[1]?.text || "",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033635/pultry-2.jpg",
      w: 1024,
      h: 687,
      aspect: "1024 / 687",
      desktopOffset: "mt-[72px]",
      mobileAlign: "right" as const,
    },
    {
      num: "03",
      title: sections[2]?.title || "Why Steel",
      text: sections[2]?.text || "",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033632/poultry-3.jpg",
      w: 1024,
      h: 559,
      aspect: "1024 / 559",
      desktopOffset: "mt-[36px]",
      mobileAlign: "left" as const,
    },
  ];

  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const mainRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const desktopColWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const desktopTextGroupRefs = useRef<(HTMLDivElement | null)[]>([]);

  const mobileBlockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobilePhotoWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const mobileTextGroupRefs = useRef<(HTMLDivElement | null)[]>([]);

  const faqSecRef = useRef<HTMLElement>(null);
  const faqTitleRef = useRef<HTMLHeadingElement>(null);

  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        debouncedRefresh();
      });
    }
  }, [debouncedRefresh]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // 1. DESKTOP: (min-width: 1024px)
      mm.add("(min-width: 1024px)", () => {
        // Setup hidden start states before first paint
        desktopBoxRefs.current.forEach((box) => {
          if (box) gsap.set(box, { clipPath: "inset(0 0 100% 0)" });
        });
        desktopImgRefs.current.forEach((img) => {
          if (img) gsap.set(img, { scale: 1.06 });
        });
        desktopTextGroupRefs.current.forEach((grp) => {
          if (grp) gsap.set(grp.children, { y: 24, opacity: 0 });
        });

        // The column WRAPPERS (never the photos) move with scrub 1.2:
        // column 1 y 0 to -24px, column 2 y 0 to -36px, column 3 y 0 to -30px.
        const colY = [-24, -36, -30];
        desktopColWrapperRefs.current.forEach((col, idx) => {
          if (!col || !rowRef.current) return;
          gsap.to(col, {
            y: colY[idx] || -24,
            ease: "none",
            scrollTrigger: {
              trigger: rowRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          });
        });

        // The 3 columns reveal left to right with CURTAIN 1200ms, stagger 150ms (one trigger on the row).
        // Text RISE 300ms after its photo.
        if (rowRef.current) {
          ScrollTrigger.create({
            trigger: rowRef.current,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              for (let i = 0; i < items.length; i++) {
                const box = desktopBoxRefs.current[i];
                const img = desktopImgRefs.current[i];
                const grp = desktopTextGroupRefs.current[i];
                const photoDelay = i * 0.15; // 150ms stagger
                const textDelay = photoDelay + 0.3; // 300ms after photo

                if (box && img) {
                  gsap.to(box, {
                    clipPath: "inset(0 0 0% 0)",
                    duration: 1.2,
                    ease: "E2",
                    delay: photoDelay,
                    overwrite: "auto",
                  });
                  gsap.to(img, {
                    scale: 1,
                    duration: 1.2 * 1.3,
                    ease: "E1",
                    delay: photoDelay,
                    overwrite: "auto",
                  });
                }

                if (grp) {
                  gsap.to(grp.children, {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    ease: "E1",
                    delay: textDelay,
                    stagger: 0.09,
                    overwrite: "auto",
                    onStart: () => {
                      gsap.set(grp.children, { willChange: "transform, opacity" });
                    },
                    onComplete: () => {
                      gsap.set(grp.children, { clearProps: "willChange" });
                    },
                  });
                }
              }
            },
          });
        }

        // FAQ section RISE reveal once
        if (faqSecRef.current && faqTitleRef.current) {
          gsap.set(faqTitleRef.current, { y: 24, opacity: 0 });
          ScrollTrigger.create({
            trigger: faqSecRef.current,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              gsap.to(faqTitleRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "E1",
                overwrite: "auto",
                onStart: () => {
                  gsap.set(faqTitleRef.current, { willChange: "transform, opacity" });
                },
                onComplete: () => {
                  gsap.set(faqTitleRef.current, { clearProps: "willChange" });
                },
              });
            },
          });
        }
      });

      // 2. MOBILE: (max-width: 1023px)
      mm.add("(max-width: 1023px)", () => {
        // Setup hidden start states for mobile
        items.forEach((item, idx) => {
          const photoWrapper = mobilePhotoWrapperRefs.current[idx];
          const box = mobileBoxRefs.current[idx];
          const img = mobileImgRefs.current[idx];
          const grp = mobileTextGroupRefs.current[idx];
          const slideX = item.mobileAlign === "right" ? 24 : -24;

          if (photoWrapper) gsap.set(photoWrapper, { x: slideX });
          if (box) gsap.set(box, { clipPath: "inset(0 0 100% 0)" });
          if (img) gsap.set(img, { scale: 1.06 });
          if (grp) gsap.set(grp.children, { y: 24, opacity: 0 });

          // Each block triggers on its own:
          // CURTAIN 900ms; the photo wrapper slides in x 24 (from its aligned side) to 0 at the same time (E1).
          // Number, title, text RISE (stagger 90ms) after 300ms.
          const block = mobileBlockRefs.current[idx];
          if (!block) return;

          ScrollTrigger.create({
            trigger: block,
            start: "top 90%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              if (photoWrapper) {
                gsap.to(photoWrapper, {
                  x: 0,
                  duration: 0.9,
                  ease: "E1",
                  overwrite: "auto",
                  onStart: () => {
                    gsap.set(photoWrapper, { willChange: "transform" });
                  },
                  onComplete: () => {
                    gsap.set(photoWrapper, { clearProps: "willChange" });
                  },
                });
              }

              if (box && img) {
                gsap.to(box, {
                  clipPath: "inset(0 0 0% 0)",
                  duration: 0.9,
                  ease: "E2",
                  overwrite: "auto",
                });
                gsap.to(img, {
                  scale: 1,
                  duration: 0.9 * 1.3,
                  ease: "E1",
                  overwrite: "auto",
                });
              }

              if (grp) {
                gsap.to(grp.children, {
                  y: 0,
                  opacity: 1,
                  duration: 0.9,
                  ease: "E1",
                  delay: 0.3,
                  stagger: 0.09,
                  overwrite: "auto",
                  onStart: () => {
                    gsap.set(grp.children, { willChange: "transform, opacity" });
                  },
                  onComplete: () => {
                    gsap.set(grp.children, { clearProps: "willChange" });
                  },
                });
              }
            },
          });
        });

        // FAQ section RISE reveal once on mobile
        if (faqSecRef.current && faqTitleRef.current) {
          gsap.set(faqTitleRef.current, { y: 24, opacity: 0 });
          ScrollTrigger.create({
            trigger: faqSecRef.current,
            start: "top 90%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              gsap.to(faqTitleRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "E1",
                overwrite: "auto",
                onStart: () => {
                  gsap.set(faqTitleRef.current, { willChange: "transform, opacity" });
                },
                onComplete: () => {
                  gsap.set(faqTitleRef.current, { clearProps: "willChange" });
                },
              });
            },
          });
        }
      });

      // 3. REDUCED MOTION
      mm.add("(prefers-reduced-motion: reduce)", () => {
        desktopBoxRefs.current.forEach((b) => b && gsap.set(b, { clipPath: "inset(0 0 0% 0)" }));
        desktopImgRefs.current.forEach((img) => img && gsap.set(img, { scale: 1 }));
        desktopColWrapperRefs.current.forEach((col) => col && gsap.set(col, { y: 0 }));
        desktopTextGroupRefs.current.forEach((grp) => grp && gsap.set(grp.children, { y: 0, opacity: 1 }));

        mobilePhotoWrapperRefs.current.forEach((pw) => pw && gsap.set(pw, { x: 0 }));
        mobileBoxRefs.current.forEach((b) => b && gsap.set(b, { clipPath: "inset(0 0 0% 0)" }));
        mobileImgRefs.current.forEach((img) => img && gsap.set(img, { scale: 1 }));
        mobileTextGroupRefs.current.forEach((grp) => grp && gsap.set(grp.children, { y: 0, opacity: 1 }));

        if (faqTitleRef.current) gsap.set(faqTitleRef.current, { y: 0, opacity: 1 });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <article ref={mainRef} className="w-full bg-white text-[var(--ink)] overflow-x-hidden">
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033632/Poultry-hero.jpg"
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* Main Section */}
      <section className="container py-[var(--sec-y-lg)]">
        {/* Desktop: 3 Staggered Columns (gap 40px, offsets 0, 72px, 36px) */}
        <div ref={rowRef} className="hidden lg:grid grid-cols-3 gap-10 items-start pb-20">
          {items.map((item, idx) => (
            <div
              key={item.num}
              ref={(el) => {
                desktopColWrapperRefs.current[idx] = el;
              }}
              className={`text-left ${item.desktopOffset}`}
            >
              {/* Photo Box with real shape of the photo, CURTAIN reveal */}
              <div
                ref={(el) => {
                  desktopBoxRefs.current[idx] = el;
                }}
                className="w-full overflow-hidden bg-slate-900 mb-6 shadow-sm"
                style={{
                  aspectRatio: item.aspect,
                  clipPath: "inset(0 0 100% 0)",
                }}
              >
                <img
                  ref={(el) => {
                    desktopImgRefs.current[idx] = el;
                  }}
                  src={cl(item.img, 1920)}
                  alt={item.title}
                  width={item.w}
                  height={item.h}
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-cover block"
                  style={{
                    aspectRatio: item.aspect,
                    transform: "scale(1.06)",
                  }}
                  onLoad={debouncedRefresh}
                />
              </div>

              {/* Under photo: number, title, text (Text group with RISE reveal) */}
              <div
                ref={(el) => {
                  desktopTextGroupRefs.current[idx] = el;
                }}
                className="flex flex-col text-left"
              >
                {/* Number: solid, bold, var(--blue), placed above title, One-Step desktop 64px */}
                <span
                  className="block font-extrabold text-[var(--blue)] leading-none select-none mb-3"
                  style={{ fontSize: "64px" }}
                >
                  {item.num}
                </span>

                {/* Title: bold, ink colour, sentence case, One-Step desktop 20px */}
                <h3 className="text-[20px] font-bold text-[#0A0A0A] leading-snug mb-3 tracking-[-0.01em]">
                  {item.title}
                </h3>

                {/* Text: One-Step blue, regular weight, 16px / 1.7 */}
                <p className="text-[16px] leading-[1.7] text-[var(--blue)] font-normal">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Stacked blocks with 86% wide alternating photos and full-width text underneath, 64px gap */}
        <div className="lg:hidden flex flex-col space-y-16 py-8">
          {items.map((item, idx) => {
            const isRight = item.mobileAlign === "right";
            return (
              <div
                key={item.num}
                ref={(el) => {
                  mobileBlockRefs.current[idx] = el;
                }}
                className="w-full flex flex-col text-left"
              >
                {/* Photo wrapper: 86% wide, aligned left (block 1, 3) or right (block 2) */}
                <div
                  ref={(el) => {
                    mobilePhotoWrapperRefs.current[idx] = el;
                  }}
                  className={`w-[86%] ${isRight ? "ml-auto" : "mr-auto"} overflow-hidden`}
                >
                  {/* Photo box with real shape of the photo */}
                  <div
                    ref={(el) => {
                      mobileBoxRefs.current[idx] = el;
                    }}
                    className="w-full overflow-hidden bg-slate-900 shadow-sm"
                    style={{
                      aspectRatio: item.aspect,
                      clipPath: "inset(0 0 100% 0)",
                    }}
                  >
                    <img
                      ref={(el) => {
                        mobileImgRefs.current[idx] = el;
                      }}
                      src={cl(item.img, 1920)}
                      alt={item.title}
                      width={item.w}
                      height={item.h}
                      loading={idx === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="w-full h-full object-cover block"
                      style={{
                        aspectRatio: item.aspect,
                        transform: "scale(1.06)",
                      }}
                      onLoad={debouncedRefresh}
                    />
                  </div>
                </div>

                {/* Number, title and text at full width under each photo */}
                <div
                  ref={(el) => {
                    mobileTextGroupRefs.current[idx] = el;
                  }}
                  className="w-full flex flex-col text-left mt-5"
                >
                  {/* Number: solid, bold, var(--blue), placed above title, One-Step mobile 40px */}
                  <span
                    className="block font-extrabold text-[var(--blue)] leading-none select-none mb-2"
                    style={{ fontSize: "40px" }}
                  >
                    {item.num}
                  </span>

                  {/* Title: bold, ink colour, sentence case, One-Step mobile 17px */}
                  <h3 className="text-[17px] font-bold text-[#0A0A0A] leading-snug mb-2 tracking-[-0.01em]">
                    {item.title}
                  </h3>

                  {/* Text: One-Step blue, regular weight, 15px / 1.6 */}
                  <p className="text-[15px] leading-[1.6] text-[var(--blue)] font-normal">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Frequently Asked Questions (One-Step style, ZERO grey text) */}
      {data.faq && data.faq.length > 0 && (
        <section ref={faqSecRef} className="container py-[var(--sec-y-lg)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2
              ref={faqTitleRef}
              className="text-[16px] lg:text-[44px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8"
            >
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="w-full divide-y divide-[rgba(15,23,42,0.12)] border-y border-[rgba(15,23,42,0.12)]">
              {data.faq.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                const panelId = `poultry-faq-panel-${idx}`;
                const headerId = `poultry-faq-header-${idx}`;

                return (
                  <div key={idx} className="group overflow-hidden">
                    <button
                      id={headerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => {
                        setOpenFaqIdx((prev) => (prev === idx ? null : idx));
                        debouncedRefresh();
                      }}
                      className="w-full min-h-[52px] py-5 flex items-center justify-between text-left cursor-pointer focus-visible:outline-none"
                    >
                      <span className="font-bold text-[17px] lg:text-[20px] text-[#0A0A0A] pr-6 leading-snug">
                        {item.q}
                      </span>

                      <span className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-[#0A0A0A]">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          style={{
                            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                            transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </span>
                    </button>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={headerId}
                      className="grid"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                        transition: "grid-template-rows 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <p
                          className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[var(--blue)] font-normal pb-6 max-w-[680px]"
                          style={{
                            opacity: isOpen ? 1 : 0,
                            transition: isOpen
                              ? "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1) 150ms"
                              : "opacity 200ms ease 0ms",
                          }}
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

      {/* Next Banner */}
      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033634/poultry-next.jpg"
        nextUrl="/industrial-sheds-pakistan/workshop-sheds/"
        nextTitle="Workshop Sheds"
      />
    </article>
  );
};

// 9.11 Workshop Sheds — signature: "Hover image list"
export const WorkshopShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { sections } = extractSections(data);

  const rows = [
    {
      num: "01",
      title: sections[0]?.title || "What a Workshop Shed Must Do",
      text: sections[0]?.text || "",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033635/workshop-.jpg",
      w: 1024,
      h: 572,
      aspect: "1024 / 572",
    },
    {
      num: "02",
      title: sections[1]?.title || "Design Points for Workshop Sheds",
      text: sections[1]?.text || "",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033637/workshop-2.jpg",
      w: 1024,
      h: 687,
      aspect: "1024 / 687",
    },
    {
      num: "03",
      title: sections[2]?.title || "Typical Users",
      text: sections[2]?.text || "",
      img: "https://res.cloudinary.com/cyfb9slf/image/upload/v1792033638/workshop-3.jpg",
      w: 1024,
      h: 559,
      aspect: "1024 / 559",
    },
  ];

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const prevHoveredIdxRef = useRef<number | null>(null);
  const [mobileOpenIdx, setMobileOpenIdx] = useState<number | null>(0); // First row open at load
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const mainRef = useRef<HTMLElement>(null);
  const desktopListRef = useRef<HTMLDivElement>(null);
  const floatingBoxRef = useRef<HTMLDivElement>(null);
  const floatingLayerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const mobilePhotoBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobilePhotoImgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const mobileTextRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const faqSecRef = useRef<HTMLElement>(null);
  const faqTitleRef = useRef<HTMLHeadingElement>(null);

  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        debouncedRefresh();
      });
    }
  }, [debouncedRefresh]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // 1. DESKTOP: (min-width: 1024px)
      mm.add("(min-width: 1024px)", () => {
        const isHoverPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

        if (isHoverPointer && floatingBoxRef.current) {
          gsap.set(floatingBoxRef.current, {
            opacity: 0,
            scale: 0.96,
            xPercent: 0,
            yPercent: 0,
          });

          const xTo = gsap.quickTo(floatingBoxRef.current, "x", {
            duration: 0.6,
            ease: "power3.out",
          });
          const yTo = gsap.quickTo(floatingBoxRef.current, "y", {
            duration: 0.6,
            ease: "power3.out",
          });

          const handleMouseMove = (e: MouseEvent) => {
            const boxWidth = 380;
            const boxHeight = 240;
            const targetX = e.clientX + 24;
            const targetY = e.clientY + 24;
            const maxX = window.innerWidth - boxWidth - 16;
            const maxY = window.innerHeight - boxHeight - 16;
            const clampedX = Math.min(Math.max(16, targetX), maxX);
            const clampedY = Math.min(Math.max(16, targetY), maxY);
            xTo(clampedX);
            yTo(clampedY);
          };

          window.addEventListener("mousemove", handleMouseMove, { passive: true });
          return () => {
            window.removeEventListener("mousemove", handleMouseMove);
          };
        }

        // FAQ section RISE reveal once
        if (faqSecRef.current && faqTitleRef.current) {
          gsap.set(faqTitleRef.current, { y: 24, opacity: 0 });
          ScrollTrigger.create({
            trigger: faqSecRef.current,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              gsap.to(faqTitleRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "E1",
                overwrite: "auto",
                onStart: () => {
                  gsap.set(faqTitleRef.current, { willChange: "transform, opacity" });
                },
                onComplete: () => {
                  gsap.set(faqTitleRef.current, { clearProps: "willChange" });
                },
              });
            },
          });
        }
      });

      // 2. MOBILE: (max-width: 1023px)
      mm.add("(max-width: 1023px)", () => {
        // Initial start states: Row 0 is open at load without animation
        // Rows 1 and 2 start with hidden photo box and text
        for (let i = 1; i < rows.length; i++) {
          const box = mobilePhotoBoxRefs.current[i];
          const img = mobilePhotoImgRefs.current[i];
          const txt = mobileTextRefs.current[i];
          if (box) gsap.set(box, { clipPath: "inset(0 0 100% 0)" });
          if (img) gsap.set(img, { scale: 1.06 });
          if (txt) gsap.set(txt, { y: 20, opacity: 0 });
        }

        // FAQ section RISE reveal once on mobile
        if (faqSecRef.current && faqTitleRef.current) {
          gsap.set(faqTitleRef.current, { y: 24, opacity: 0 });
          ScrollTrigger.create({
            trigger: faqSecRef.current,
            start: "top 90%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              gsap.to(faqTitleRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "E1",
                overwrite: "auto",
                onStart: () => {
                  gsap.set(faqTitleRef.current, { willChange: "transform, opacity" });
                },
                onComplete: () => {
                  gsap.set(faqTitleRef.current, { clearProps: "willChange" });
                },
              });
            },
          });
        }
      });

      // 3. REDUCED MOTION
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (faqTitleRef.current) gsap.set(faqTitleRef.current, { y: 0, opacity: 1 });
        mobilePhotoBoxRefs.current.forEach((b) => b && gsap.set(b, { clipPath: "inset(0 0 0% 0)" }));
        mobilePhotoImgRefs.current.forEach((img) => img && gsap.set(img, { scale: 1 }));
        mobileTextRefs.current.forEach((t) => t && gsap.set(t, { y: 0, opacity: 1 }));
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const handleRowMouseEnter = (idx: number) => {
    const prevIdx = prevHoveredIdxRef.current;
    setHoveredIdx(idx);
    prevHoveredIdxRef.current = idx;

    if (!floatingBoxRef.current) return;

    if (prevIdx === null) {
      // Entering list: fade in 300ms, scale .96 to 1 (400ms E1)
      gsap.to(floatingBoxRef.current, {
        opacity: 1,
        duration: 0.3,
        overwrite: "auto",
      });
      gsap.fromTo(
        floatingBoxRef.current,
        { scale: 0.96 },
        { scale: 1, duration: 0.4, ease: "E1", overwrite: "auto" }
      );
      // Ensure target image layer is opacity 1, others 0
      floatingLayerRefs.current.forEach((el, i) => {
        if (el) gsap.set(el, { opacity: i === idx ? 1 : 0 });
      });
    } else if (prevIdx !== idx) {
      // Moving between rows: photo SWAPs with a 600ms cross-fade
      const prevEl = floatingLayerRefs.current[prevIdx];
      const nextEl = floatingLayerRefs.current[idx];
      if (prevEl) {
        gsap.to(prevEl, { opacity: 0, duration: 0.6, ease: "power2.inOut", overwrite: "auto" });
      }
      if (nextEl) {
        gsap.to(nextEl, { opacity: 1, duration: 0.6, ease: "power2.inOut", overwrite: "auto" });
      }
    }
  };

  const handleListMouseLeave = () => {
    prevHoveredIdxRef.current = null;
    setHoveredIdx(null);
    if (floatingBoxRef.current) {
      // Leaving list: fade out 300ms
      gsap.to(floatingBoxRef.current, {
        opacity: 0,
        duration: 0.3,
        overwrite: "auto",
      });
    }
  };

  const toggleMobileRow = (idx: number) => {
    const isCurrentlyOpen = mobileOpenIdx === idx;
    const nextIdx = isCurrentlyOpen ? null : idx;
    setMobileOpenIdx(nextIdx);

    if (!isCurrentlyOpen) {
      // Inside open panel: photo does CURTAIN 700ms (from top) 100ms after panel starts to open, then text RISEs
      const box = mobilePhotoBoxRefs.current[idx];
      const img = mobilePhotoImgRefs.current[idx];
      const txt = mobileTextRefs.current[idx];

      if (box && img) {
        gsap.set(box, { clipPath: "inset(0 0 100% 0)" });
        gsap.set(img, { scale: 1.06 });

        gsap.to(box, {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.7,
          ease: "E2",
          delay: 0.1, // 100ms after panel starts to open
          overwrite: "auto",
        });
        gsap.to(img, {
          scale: 1,
          duration: 0.7 * 1.3,
          ease: "E1",
          delay: 0.1,
          overwrite: "auto",
        });
      }

      if (txt) {
        gsap.set(txt, { y: 20, opacity: 0 });
        gsap.to(txt, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "E1",
          delay: 0.35,
          overwrite: "auto",
          onStart: () => {
            gsap.set(txt, { willChange: "transform, opacity" });
          },
          onComplete: () => {
            gsap.set(txt, { clearProps: "willChange" });
          },
        });
      }
    }

    debouncedRefresh();
  };

  return (
    <article ref={mainRef} className="w-full bg-white text-[var(--ink)] overflow-x-hidden">
      <HeroBand
        variant="immersive"
        imageSrc="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033639/workshop-hero.jpg"
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      <section className="container py-[var(--sec-y-lg)] relative">
        {/* Desktop Floating Preview Image following pointer with quickTo */}
        <div
          ref={floatingBoxRef}
          className="hidden lg:block fixed pointer-events-none z-30 overflow-hidden shadow-2xl border-2 border-white bg-slate-900"
          style={{
            width: "380px",
            aspectRatio: hoveredIdx !== null ? rows[hoveredIdx].aspect : "1024 / 572",
            opacity: 0,
            transform: "scale(0.96)",
            transformOrigin: "center center",
            top: 0,
            left: 0,
          }}
        >
          {rows.map((r, idx) => (
            <div
              key={r.num}
              ref={(el) => {
                floatingLayerRefs.current[idx] = el;
              }}
              className="absolute inset-0 w-full h-full"
              style={{
                aspectRatio: r.aspect,
                opacity: idx === 0 ? 1 : 0,
              }}
            >
              <img
                src={cl(r.img, 1920)}
                alt={r.title}
                width={r.w}
                height={r.h}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover block"
                style={{ aspectRatio: r.aspect }}
              />
            </div>
          ))}
        </div>

        {/* Desktop List: divide-y divide-[var(--rule)] border-t border-b border-[var(--rule)] */}
        <div
          ref={desktopListRef}
          onMouseLeave={handleListMouseLeave}
          className="hidden lg:block divide-y divide-[var(--rule)] border-t border-b border-[var(--rule)]"
        >
          {rows.map((r, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={r.num}
                onMouseEnter={() => handleRowMouseEnter(idx)}
                className="py-12 lg:py-14 grid grid-cols-12 gap-8 items-start text-left cursor-pointer"
              >
                {/* Left: Number + Title (hover moves title right 20px, HOVER-ROW 600ms without changing height) */}
                <div className="col-span-6 flex flex-col text-left">
                  {/* Solid bold blue number above title (One-Step desktop 64px, weight 800) */}
                  <span
                    className="block font-extrabold text-[var(--blue)] leading-none select-none mb-3"
                    style={{ fontSize: "64px" }}
                  >
                    {r.num}
                  </span>

                  {/* Title: all capital, bold ink, adjusted in one line */}
                  <h3
                    className="text-[14px] xl:text-[16px] font-bold text-[#0A0A0A] uppercase tracking-[-0.01em] whitespace-nowrap"
                    style={{
                      transform: isHovered ? "translateX(16px)" : "translateX(0px)",
                      transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {r.title}
                  </h3>
                </div>

                {/* Right: Text in One-Step body style (16px / 1.7, var(--blue), regular weight, zero grey text) */}
                <div className="col-span-6 flex flex-col justify-center pt-2">
                  <p className="text-[16px] leading-[1.7] text-[var(--blue)] font-normal max-w-[560px]">
                    {r.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: Title list accordion with 76px row height, 1px lines, plus icon, no numbers */}
        <div className="lg:hidden w-full divide-y divide-[var(--rule)] border-t border-b border-[var(--rule)]">
          {rows.map((r, idx) => {
            const isOpen = mobileOpenIdx === idx;
            const panelId = `workshop-panel-${idx}`;
            const headerId = `workshop-header-${idx}`;

            return (
              <div key={r.num} className="w-full">
                {/* 76px row with title and plus icon */}
                <button
                  id={headerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleMobileRow(idx)}
                  className="w-full h-[76px] min-h-[76px] px-4 flex items-center justify-between text-left cursor-pointer border-0 bg-white select-none focus-visible:outline-none"
                >
                  {/* Title: all capital, bold ink, adjusted in one line */}
                  <h3 className="text-[12px] min-[360px]:text-[13px] min-[400px]:text-[14px] sm:text-[15px] font-bold text-[#0A0A0A] uppercase tracking-tight whitespace-nowrap truncate pr-2">
                    {r.title}
                  </h3>

                  <span className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-[#0A0A0A]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>

                {/* Expandable drawer: 0fr -> 1fr over 600ms */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  className="grid"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <div className="min-h-0 overflow-hidden px-4 pb-6">
                    {/* First the photo (full width, real shape) */}
                    <div
                      ref={(el) => {
                        mobilePhotoBoxRefs.current[idx] = el;
                      }}
                      className="w-full overflow-hidden bg-slate-900 shadow-sm"
                      style={{
                        aspectRatio: r.aspect,
                        clipPath: idx === 0 ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
                      }}
                    >
                      <img
                        ref={(el) => {
                          mobilePhotoImgRefs.current[idx] = el;
                        }}
                        src={cl(r.img, 1920)}
                        alt={r.title}
                        width={r.w}
                        height={r.h}
                        loading={idx === 0 ? "eager" : "lazy"}
                        decoding="async"
                        className="w-full h-full object-cover block"
                        style={{
                          aspectRatio: r.aspect,
                          transform: idx === 0 ? "scale(1)" : "scale(1.06)",
                        }}
                        onLoad={debouncedRefresh}
                      />
                    </div>

                    {/* Then the text (One-Step text style, mobile 15px / 1.6, var(--blue)) */}
                    <p
                      ref={(el) => {
                        mobileTextRefs.current[idx] = el;
                      }}
                      className="text-[15px] leading-[1.6] text-[var(--blue)] font-normal pt-4"
                      style={{
                        opacity: idx === 0 ? 1 : 0,
                      }}
                    >
                      {r.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Frequently Asked Questions (One-Step style, ZERO grey text) */}
      {data.faq && data.faq.length > 0 && (
        <section ref={faqSecRef} className="container py-[var(--sec-y-lg)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2
              ref={faqTitleRef}
              className="text-[16px] lg:text-[44px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8"
            >
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="w-full divide-y divide-[rgba(15,23,42,0.12)] border-y border-[rgba(15,23,42,0.12)]">
              {data.faq.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                const panelId = `workshop-faq-panel-${idx}`;
                const headerId = `workshop-faq-header-${idx}`;

                return (
                  <div key={idx} className="group overflow-hidden">
                    <button
                      id={headerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => {
                        setOpenFaqIdx((prev) => (prev === idx ? null : idx));
                        debouncedRefresh();
                      }}
                      className="w-full min-h-[52px] py-5 flex items-center justify-between text-left cursor-pointer focus-visible:outline-none"
                    >
                      <span className="font-bold text-[17px] lg:text-[20px] text-[#0A0A0A] pr-6 leading-snug">
                        {item.q}
                      </span>

                      <span className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-[#0A0A0A]">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          style={{
                            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                            transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </span>
                    </button>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={headerId}
                      className="grid"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                        transition: "grid-template-rows 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <p
                          className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[var(--blue)] font-normal pb-6 max-w-[680px]"
                          style={{
                            opacity: isOpen ? 1 : 0,
                            transition: isOpen
                              ? "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1) 150ms"
                              : "opacity 200ms ease 0ms",
                          }}
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

      {/* Next Banner */}
      <NextBand
        image="https://res.cloudinary.com/cyfb9slf/image/upload/v1792033640/workshop-next.jpg"
        nextUrl="/industrial-sheds-pakistan/crane-sheds/"
        nextTitle="Crane Sheds"
      />
    </article>
  );
};

// 9.12 Crane Sheds — signature: "Runway band + link cards"
export const CraneShedsLayout: React.FC<{ data: ContentData }> = ({ data }) => {
  const { introPs, sections } = extractSections(data);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const mainRef = useRef<HTMLElement>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  }, []);

  return (
    <article ref={mainRef} className="w-full bg-white text-[var(--ink)] overflow-x-hidden">
      <HeroBand
        variant="immersive"
        imageSrc={cl(IMG.industrial.craneSheds.hero, 2560)}
        imageAlt={data.h1}
        h1={data.h1}
        subtitle={data.quickAnswer}
      />

      {/* 1. Intro */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-[96px] items-start">
          <div className="lg:col-span-5">
            <h2 className="text-[16px] lg:text-[44px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em]">
              {(sections[0]?.title || "What a Crane Shed Is").toUpperCase()}
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 max-w-[640px]">
            <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[var(--blue)] font-normal">
              {sections[0]?.text || introPs[0] || ""}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Runway Band (21/9 full width with trolley visual indicator) */}
      <section className="relative w-full overflow-hidden bg-slate-900 aspect-[21/9] min-h-[320px]">
        <img
          src={cl(IMG.industrial.craneSheds.wide, 2560)}
          alt="Crane Shed Runway Structure"
          width={1024}
          height={439}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover block"
          onLoad={debouncedRefresh}
        />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        {/* Rail track decor with trolley */}
        <div className="container absolute bottom-6 inset-x-0 z-10 pointer-events-none">
          <div className="relative w-full h-[2px] bg-white/40">
            <div className="absolute top-1/2 -translate-y-1/2 left-[35%] w-3.5 h-3.5 bg-[var(--blue)] shadow-md" />
          </div>
        </div>
      </section>

      {/* 3. Raiwind Band: Full-width Royal Blue band (white text, same sizes, zero grey) */}
      <section className="w-full bg-[var(--blue)] text-white py-[var(--sec-y-lg)]">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-10 items-center text-left">
          <div className="lg:col-span-5">
            <h2 className="text-[16px] lg:text-[44px] font-bold uppercase tracking-[-0.02em] text-white leading-tight lg:leading-[1.15]">
              {(sections[1]?.title || "The Raiwind Crane Sheds").toUpperCase()}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-white text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] font-normal max-w-[640px]">
              {sections[1]?.text}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Design Points: 2 columns */}
      <section className="container py-[var(--sec-y-lg)] text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-[96px] items-start">
          <div className="lg:col-span-5">
            <h2 className="text-[16px] lg:text-[44px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em]">
              {(sections[2]?.title || "Design Points for Crane Sheds").toUpperCase()}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[var(--blue)] font-normal max-w-[640px]">
              {sections[2]?.text}
            </p>
          </div>
        </div>
      </section>

      {/* 5. Learn More: 2 Link Cards */}
      <section className="container pb-[var(--sec-y-lg)] text-left">
        <h2 className="text-[16px] lg:text-[44px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-4">
          {(sections[3]?.title || "Learn More").toUpperCase()}
        </h2>
        {sections[3]?.text && (
          <p className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[var(--blue)] font-normal mb-8 max-w-[640px]">
            {sections[3]?.text}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <TransitionLink
            to="/pre-engineered-buildings-pakistan/crane-system/"
            className="group block p-8 border border-[var(--rule)] bg-white hover:bg-[var(--blue)] transition-colors duration-400 min-h-[160px] flex flex-col justify-between"
          >
            <span className="font-bold text-[17px] lg:text-[20px] text-[#0A0A0A] group-hover:text-white transition-colors leading-snug">
              Crane Systems in PEB
            </span>
            <span className="text-[14px] font-semibold text-[var(--blue)] group-hover:text-white flex items-center gap-2 mt-4 transition-colors">
              <span>View Crane Specifications</span>
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </span>
          </TransitionLink>

          <TransitionLink
            to="/structural-steel-fabrication-pakistan/crane-gantry-structures/"
            className="group block p-8 border border-[var(--rule)] bg-white hover:bg-[var(--blue)] transition-colors duration-400 min-h-[160px] flex flex-col justify-between"
          >
            <span className="font-bold text-[17px] lg:text-[20px] text-[#0A0A0A] group-hover:text-white transition-colors leading-snug">
              Crane Gantry Structures
            </span>
            <span className="text-[14px] font-semibold text-[var(--blue)] group-hover:text-white flex items-center gap-2 mt-4 transition-colors">
              <span>View Gantry Fabrications</span>
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </span>
          </TransitionLink>
        </div>
      </section>

      {/* FAQ (One-Step style, ZERO grey text) */}
      {data.faq && data.faq.length > 0 && (
        <section className="container py-[var(--sec-y-lg)]">
          <div className="max-w-[800px] mx-auto text-left">
            <h2 className="text-[16px] lg:text-[44px] font-bold uppercase text-[#0A0A0A] leading-tight lg:leading-[1.15] tracking-[-0.02em] mb-8">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="w-full divide-y divide-[rgba(15,23,42,0.12)] border-y border-[rgba(15,23,42,0.12)]">
              {data.faq.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                const panelId = `crane-faq-panel-${idx}`;
                const headerId = `crane-faq-header-${idx}`;

                return (
                  <div key={idx} className="group overflow-hidden">
                    <button
                      id={headerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => {
                        setOpenFaqIdx((prev) => (prev === idx ? null : idx));
                        debouncedRefresh();
                      }}
                      className="w-full min-h-[52px] py-5 flex items-center justify-between text-left cursor-pointer focus-visible:outline-none"
                    >
                      <span className="font-bold text-[17px] lg:text-[20px] text-[#0A0A0A] pr-6 leading-snug">
                        {item.q}
                      </span>

                      <span className="w-6 h-6 flex items-center justify-center flex-shrink-0 text-[#0A0A0A]">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          style={{
                            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                            transition: "transform 400ms cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </span>
                    </button>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={headerId}
                      className="grid"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                        transition: "grid-template-rows 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <p
                          className="text-[15px] lg:text-[16px] leading-[1.6] lg:leading-[1.7] text-[var(--blue)] font-normal pb-6 max-w-[680px]"
                          style={{
                            opacity: isOpen ? 1 : 0,
                            transition: isOpen
                              ? "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1) 150ms"
                              : "opacity 200ms ease 0ms",
                          }}
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

      {/* Next Banner */}
      <NextBand
        image={cl(IMG.industrial.craneSheds.next, 2560)}
        nextUrl="/steel-warehouses-pakistan/storage-warehouses/"
        nextTitle="Storage Warehouses"
      />
    </article>
  );
};
